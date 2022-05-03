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
    title: string;
    body: string;
    addBrowserInfo?: boolean;
}

export interface Dhis2Options extends Issue {
    sendToDhis2UserGroups?: string[];
}

export interface GitHubOptions extends Issue {
    repository: string;
    apiUrl?: string;
    userToken?: string[];
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
