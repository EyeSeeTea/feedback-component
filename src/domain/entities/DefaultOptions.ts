import { FeedbackOptions } from "./Feedback";

export const defaultOptions: FeedbackOptions = {
    dhis2: {
        issue: {
            title: "[User feedback] {title}",
            body: "## dhis2\n\nUsername: {username}\n\n{body}",
        },
        sendToDhis2UserGroups: ["administrators"],
    },
    github: {
        userToken: ["feewfw", "fewfewefw"],
        issue: {
            repository: "EyeSeeTea/SP-OCC-central-planning-reporting",
            title: "[User feedback] {title}",
            body: "## dhis2\n\nUsername: {username}\n\n{body}",
        },
        screenshot: {
            repository: "EyeSeeTeaBotTest/snapshots",
            branch: "master",
        },
    },
    clickUp: {
        apiUrl: "https://dev.eyeseetea.com/clickup",
        listId: "176458462",
        title: "[User feedback] {title}",
        body: "## dhis2\n\nUsername: {username}\n\n{body}",
        status: "To do",
        addBrowserInfo: true,
    },
    layoutOptions: {
        showContact: true,
        buttonPosition: "bottom-start",
        descriptionTemplate:
            "## Summary\n\n## Steps to reproduce\n\n## Actual results\n\n## Expected results\n\n",
    },
};
