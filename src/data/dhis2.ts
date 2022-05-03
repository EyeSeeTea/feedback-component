/* Dhis2+Github module for https://github.com/eisnerd/feedback-tool */

import { Dhis2Options as _Dhis2Options } from "../domain/entities/Feedback"; /*REVISAR*/ /*REVISAR*/ /*REVISAR*/ /*REVISAR*/ /*REVISAR*/ /*REVISAR*/ /*REVISAR*/
/*
const dhis2 = (options: Dhis2Options, d2: any, appKey: string) => {
    const init = () => {
        const dhis2Groups = options.sendToDhis2UserGroups || [];
        const dhis2NotificationsEnabled = dhis2Groups.length > 0;
        const githubNotificationsEnabled = !!options.issue;

        const username = d2.currentUser.username;
        /*REVISAR*/
/*const github = window.$.feedbackGitHub(options, username);

        const sendToGithubOrDhis2 = (data: any) => {
            return github
                .send(data)
                .then((payload: any) => sendFeedbackToUserGroups(payload))
                .then(data.success, data.error);
        };

        const useGithub = dhis2NotificationsEnabled || githubNotificationsEnabled;
        const sendGithubDhis2 = useGithub ? sendToGithubOrDhis2 : () => Promise.resolve();

        window.$.feedback({
            postFunction: (data: any) => {
                return sendGithubDhis2(data).then(data.success, data.error);
            },
            buttonPosition: this.options.buttonPosition || "bottom",
            i18nProperties,
            ...this.options.feedbackOptions,
        });
    };

    const sendFeedbackToUserGroups = (payload: any) => {
        if (!payload) return;
        const userGroupNames = this.options.sendToDhis2UserGroups;
        if (userGroupNames.length === 0) return Promise.resolve();

        const { title, body } = payload;
        const currentApp = this.d2.system.installedApps.find(app => app.key === this.appKey);
        const fullTitle = currentApp ? `[${currentApp.name}] ${title}` : title;
        const fullBody = payload.issueURL ? `${body}\n\n---\n${payload.issueURL}` : body;

        return this.getUserGroups(userGroupNames).then(res =>
            this.sendMessage(fullTitle, fullBody, res.userGroups)
        );
    };

    const getUserGroups = (names: any) => {
        const api = this.d2.Api.getApi();

        return api.get("/userGroups", {
            filter: "name:in:[" + names.join(",") + "]",
            paging: false,
        });
    };

    const sendMessage = (subject, text, userGroups) => {
        const api = this.d2.Api.getApi();
        const ids = objs => objs && objs.map(obj => ({ id: obj.id }));

        const message = {
            subject: subject,
            text: text,
            userGroups: ids(userGroups),
        };

        if (userGroups.length == 0) {
            return Promise.resolve();
        } else {
            return api.post("/messageConversations", message);
        }
    };
};

window.$.feedbackDhis2 = function (options: Dhis2Options, d2: object, appKey: string) {
    const feedBackToolDhis2 = new FeedBackToolDhis2(d2, appKey, options);
    feedBackToolDhis2.init();
    return feedBackToolDhis2;
};*/
