/*
Github module for https://github.com/eisnerd/feedback-tool

You need a personal token that will be used both as a reporter user and to upload screenshot
images. Steps:

  - Create a specific github user.
  - Create a project (i.e.) snapshots to store images.
  - Create a personal token:
    - User -> Settings -> Developer Settings -> Personal access tokens -> Generate new token
    - Description: Upload screenshots for feedback.js
    - Select scopes: repo -> public_repo.
    - Generate token.

It's recommended to use a reverse-proxy so the token is not publicly available.
*/
/*
import { GitHubOptions } from "../domain/entities/FeedbackOptions";

const apiUrl = "https://dev.eyeseetea.com/github";

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

const gitHub = (options: GitHubOptions, username?: string) => {
    const token = options.userToken ? options.userToken.join("") : undefined;
    const api = options.apiUrl || apiUrl;

    const setAuthHeader = (xhr: any) => {
        xhr.setRequestHeader("Authorization", "token " + token);
    };

    const _send = (data: any) => {
        // data.post.img = "data:image/png;base64,iVBORw0KG..."
        const imgBase64 = data.post.img.split(",")[1];
        const uid = new Date().getTime() + parseInt((Math.random() * 1e6).toString()).toString();

        return uploadFile("screenshot-" + uid + ".png", imgBase64)
            .then((url: string) => {
                return getPayload(data, url);
            })
            .then((payload: any) => {
                if (options.issue) {
                    return postIssue(payload);
                } else {
                    return payload;
                }
            });
    };

    const uploadFile = (filename: string, contents: any) => {
        const payload = {
            message: "feedback.js snapshot",
            branch: options.screenshot?.branch,
            content: contents,
        };
        
        return $.ajax({
            url: api + "/repos/" + options.screenshot?.repository + "/contents/" + filename,
            type: "PUT",
            beforeSend: setAuthHeader.bind(this),
            dataType: "json",
            data: JSON.stringify(payload),
        }).then((res: any) => res.content.download_url);
        return Promise.resolve("x");
    };

    const getPayload = (data: any, screenshotUrl: string) => {
        const info = data.post;
        const browser = info.browser;
        const contact = info.contact
            ? `Contact info: ${info.contact.name} (${info.contact.email})`
            : "";
        const body = [
            "## Browser",
            "- Name: " + browser.appCodeName,
            "- Version: " + browser.appVersion,
            "- Platform: " + browser.platform,
            "",
            "## User report",
            contact,
            "URL: " + info.url,
            "",
            info.note,
            "",
            "![See screenshot here]( " + screenshotUrl + " )",
        ].join("\n");
        const bodyNamespace = { body, username: username };

        return {
            title: interpolate(options.issue?.title ?? "", { title: info.title }),
            body: options.issue?.body ? interpolate(options.issue.body, bodyNamespace) : body,
        };
    };

    const postIssue = (payload: any) => {
        
        return $.ajax({
            type: "POST",
            url: api + "/repos/" + options.issue?.repository + "/issues",
            beforeSend: setAuthHeader.bind(this),
            dataType: "json",
            data: JSON.stringify(payload),
        }).then((res: any) => {
            return Object.assign(payload, { issueURL: res.html_url });
        });
    };
};


window.$.feedbackGitHub = (options: GitHubOptions, username?: string) => {
    return options.issue ? gitHub(options, username) : { send: () => Promise.resolve(null) };
};
*/
