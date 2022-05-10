import { Future } from "../../data/entities/future";
import { ScreenshotOptions } from "../../data/repositories/ScreenshotDefaultRepository";

export interface ScreenshotRepository {
    screenshot(options: ScreenshotOptions): Future<string, string>;
}
