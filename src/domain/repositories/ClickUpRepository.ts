import { Future } from "../../data/entities/future";
import { RequestError, RequestResult } from "../../data/entities/future-axios";
import { Task } from "../entities/ClickUp";
import { UserFeedback } from "../entities/Feedback";

export interface ClickUpRepository {
    sendToClickUp(
        userFeedback: UserFeedback,
        encodedImg?: string
    ): Future<RequestError, RequestResult<Task>>;
}
