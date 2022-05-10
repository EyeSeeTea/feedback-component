import { Future } from "../../data/entities/future";
import { RequestError, RequestResult } from "../../data/entities/future-axios";
import { Task } from "../entities/ClickUp";
import { Fields } from "../entities/Feedback";

export interface ClickUpRepository {
    sendToClickUp(fields: Fields, encodedImg?: string): Future<RequestError, RequestResult<Task>>;
}
