import { ClickUpDefaultRepository } from "./data/repositories/ClickUpDefaultRepository";
import { ScreenshotDefaultRepository } from "./data/repositories/ScreenshotDefaultRepository";
import { SendToClickUpUseCase } from "./domain/usecases/SendToClickUpUseCase";
import { ScreenshotUseCase } from "./domain/usecases/ScreenshotUseCase";
import { FeedbackOptions } from "./domain/entities/Feedback";

export function getCompositionRoot(options: FeedbackOptions, username?: string) {
    const clickUpRepository = new ClickUpDefaultRepository(options.repositories.clickUp, username);
    const screenshotRepository = new ScreenshotDefaultRepository();

    return {
        screenshot: new ScreenshotUseCase(screenshotRepository),
        sendToClickUp: new SendToClickUpUseCase(clickUpRepository),
    };
}

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

export interface UseCase {
    execute: Function;
}
