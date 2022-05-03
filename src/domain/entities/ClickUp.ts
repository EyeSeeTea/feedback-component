/* https://clickup.com/api */

export interface ClickUpOptions {
    apiUrl?: string;
    listId: string;
    title: string;
    body: string;
    status?: string;
    addBrowserInfo?: boolean;
}

export interface Task {
    id: string;
    file?: Object;
}
