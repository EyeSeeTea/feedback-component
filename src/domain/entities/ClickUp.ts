/* https://clickup.com/api */

import { Issue } from "./Feedback";

export interface ClickUpOptions extends Issue {
    apiUrl?: string;
    listId: string;
    status?: string;
}

export interface Task {
    id: string;
    file?: Object;
}
