import { ClickUpOptions } from "./ClickUp";

export interface Fields {
    title: string;
    description: string;
    contact?: {
        name: string;
        email: string;
    };
}

export interface FeedbackOptions {
    dhis2?: Dhis2Options;
    github?: GitHubOptions;
    clickUp?: ClickUpOptions;
    layoutOptions?: LayoutOptions;
}

export interface Issue {
    addBrowserInfo?: boolean;
    title: string;
    body: string;
}

export interface GitHubIssue extends Issue {
    repository: string;
}

export interface Dhis2Options {
    issue?: Issue;
    sendToDhis2UserGroups?: string[];
}

export interface GitHubOptions {
    apiUrl?: string;
    userToken?: string[];
    issue?: GitHubIssue;
    screenshot?: UploadScreenshot;
}

export interface UploadScreenshot {
    repository: string;
    branch: string;
}

export interface LayoutOptions {
    screenshotLabel?: string;
    descriptionTemplate?: string;
    buttonPosition?: ButtonPosition;
    showContact?: boolean;
}

export type ButtonPosition =
    | "left"
    | "left-start"
    | "left-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom-start"
    | "bottom-end";
