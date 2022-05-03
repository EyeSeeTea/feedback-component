import { Task } from "../domain/entities/ClickUp";
import { ClickUpOptions } from "../domain/entities/ClickUp";
import { Fields } from "../domain/entities/Feedback";
import { fromPromise, Future } from "./future";
import { request, RequestResult } from "./future-axios";

const apiUrl = `https://dev.eyeseetea.com/clickup`;

function interpolate(
    template: string,
    namespace: { body?: string; username?: string; title?: string }
) {
    return template.replace(
        /{([^{}]*)}/g,
        (substring: string, args: "body" | "username" | "title") => {
            const r = namespace[args];
            return typeof r === "string" || typeof r === "number" ? r : substring;
        }
    );
}

export const ClickUp = (
    fields: Fields,
    options: ClickUpOptions,
    opt?: {
        username?: string;
        encodedImg?: string;
    }
) => {
    const api = options.apiUrl ?? apiUrl;

    const attachFileToTask = (taskId: string, imgSrc: string) => {
        const uid = new Date().getTime() + parseInt((Math.random() * 1e6).toString()).toString();
        const filename = "screenshot-" + uid + ".png";
        return fromPromise(fetch(imgSrc))
            .flatMap(res =>
                fromPromise(res.blob()).map(blob => {
                    const form = new FormData();
                    form.append("filename", filename);
                    form.append("attachment", blob);
                    return form;
                })
            )
            .flatMap(form =>
                request<Task>({
                    method: "post",
                    url: `${api}/task/${taskId}/attachment`,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    data: form,
                }).bimap(
                    reqResult => reqResult,
                    reqError => reqError.message
                )
            );
    };

    //TODO: Implement browser info. Properties below are deprecated. https://app.clickup.com/t/2911zxm
    function getPayload(): Payload {
        //const browser = info.browser;
        /*  Add to body array.
        const browserBody = [
            "## Browser",
            "- Name: " + browser.appCodeName,
            "- Version: " + browser.appVersion,
            "- Platform: " + browser.platform,
            "",
        ];*/
        const contact = fields.contact
            ? `Contact info: ${fields.contact.name} (${fields.contact.email})`
            : "";

        const body = [
            "## User report",
            contact,
            "URL: " + document.URL,
            "",
            fields.description,
        ].join("\n");

        const bodyNamespace = { body, username: opt?.username ?? "" };
        const description = options.body ? interpolate(options.body, bodyNamespace) : body;

        return {
            name: interpolate(options.title, { title: fields.title }),
            markdown_description: description,
            assignees: [],
            tags: ["feedback-component"],
            status: options.status,
        };
    }

    const createTask = (payload: Payload) => {
        return request<Task>({
            method: "post",
            url: `${api}/list/${options.listId}/task`,
            data: JSON.stringify(payload),
            responseType: "json",
            headers: {
                "Content-Type": "application/json",
            },
        });
    };

    return createTask(getPayload()).flatMap(request =>
        opt?.encodedImg
            ? attachFileToTask(request.data.id, opt.encodedImg).bimap(
                  (reqResult): RequestResult<Task> => ({
                      ...reqResult,
                      data: { ...request.data, file: reqResult.data },
                  }),
                  reqError => ({
                      message: reqError,
                  })
              )
            : Future.success(request)
    );
};

interface Payload {
    name: string;
    markdown_description: string;
    assignees: number[];
    tags: string[];
    status?: string;
}
