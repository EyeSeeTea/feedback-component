import { UseCase } from "../../CompositionRoot";
import { Future } from "../../data/entities/future";
import { RequestError, RequestResult } from "../../data/entities/future-axios";
import { Task } from "../entities/ClickUp";
import { Fields } from "../entities/Feedback";
import { ClickUpRepository } from "../repositories/ClickUpRepository";

export class SendToClickUpUseCase implements UseCase {
    constructor(private clickupRepository: ClickUpRepository) {}

    public execute(fields: Fields, encodedImg?: string): Future<RequestError, RequestResult<Task>> {
        return this.clickupRepository.sendToClickUp(fields, encodedImg);
    }
}
