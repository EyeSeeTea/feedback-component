import { UseCase } from "../../CompositionRoot";
import { Future } from "../../data/entities/future";
import { ScreenshotOptions } from "../../data/repositories/ScreenshotDefaultRepository";
import { ScreenshotRepository } from "../repositories/ScreenshotRepository";

export class ScreenshotUseCase implements UseCase {
    constructor(private screenshotRepository: ScreenshotRepository) {}

    public execute(options: ScreenshotOptions): Future<string, string> {
        return this.screenshotRepository.screenshot(options);
    }
}
