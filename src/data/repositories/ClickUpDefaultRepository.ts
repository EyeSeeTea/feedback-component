import { ClickUpOptions, Task } from "../../domain/entities/ClickUp";
import { UserFeedback } from "../../domain/entities/Feedback";
import { ClickUpRepository } from "../../domain/repositories/ClickUpRepository";
import { fromPromise, Future } from "../entities/future";
import { request, RequestError, RequestResult } from "../entities/future-axios";

export class ClickUpDefaultRepository implements ClickUpRepository {
    readonly api: string;
    readonly options?: ClickUpOptions;
    readonly username?: string;

    constructor(options?: ClickUpOptions, username?: string) {
        this.api = options?.apiUrl ?? `https://dev.eyeseetea.com/clickup`;
        if (options) this.options = options;
        this.username = username;
    }

    sendToClickUp(
        userFeedback: UserFeedback,
        encodedImg?: string | undefined
    ): Future<RequestError, RequestResult<Task>> {
        return this.options
            ? this.createTask(getPayload(userFeedback, this.options, this.username)).flatMap(
                  request =>
                      encodedImg
                          ? this.attachFileToTask(request.data.id, encodedImg).bimap(
                                (reqResult): RequestResult<Task> => ({
                                    ...reqResult,
                                    data: { ...request.data, file: reqResult.data },
                                }),
                                reqError => ({
                                    message: reqError,
                                })
                            )
                          : Future.success(request)
              )
            : Future.error({ message: "ClickUp Options not defined" });
    }

    private attachFileToTask = (taskId: string, imgSrc: string) => {
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
                    url: `${this.api}/task/${taskId}/attachment`,
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

    private createTask = (payload: Payload) => {
        return request<Task>({
            method: "post",
            url: `${this.api}/list/${this.options?.listId}/task`,
            data: JSON.stringify(payload),
            responseType: "json",
            headers: {
                "Content-Type": "application/json",
            },
        });
    };
}

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

//TODO: Implement browser info. Properties below are deprecated. https://app.clickup.com/t/2911zxm
//const browser = info.browser;
/*  Add to body array.
        const browserBody = [
            "## Browser",
            "- Name: " + browser.appCodeName,
            "- Version: " + browser.appVersion,
            "- Platform: " + browser.platform,
            "",
        ];*/
function getPayload(
    userFeedback: UserFeedback,
    options: ClickUpOptions,
    username?: string
): Payload {
    const contact = userFeedback.contact
        ? `Contact info: ${userFeedback.contact.name} (${userFeedback.contact.email})`
        : "";
    const body = [
        "## User report",
        contact,
        "URL: " + document.URL,
        "",
        userFeedback.description,
    ].join("\n");

    const bodyNamespace = { body, username: username ?? "" };
    const description = options?.body ? interpolate(options.body, bodyNamespace) : body;

    return {
        name: interpolate(options.title, { title: userFeedback.title }),
        markdown_description: description,
        assignees: [],
        tags: ["feedback-component"],
        status: options.status,
    };
}

interface Payload {
    name: string;
    markdown_description: string;
    assignees: number[];
    tags: string[];
    status?: string;
}
