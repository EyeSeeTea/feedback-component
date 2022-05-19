import { ScreenshotRepository } from "../../domain/repositories/ScreenshotRepository";
import { fromPromise } from "../entities/future";

export type ScreenshotOptions = {
    quality?: number;
    onCaptureStart?: () => void;
    onCaptureEnd?: () => void;
    type?: "image/jpeg" | "image/png" | "image/webp";
};

export class ScreenshotDefaultRepository implements ScreenshotRepository {
    screenshot = ({
        onCaptureEnd,
        onCaptureStart,
        quality = 0.7,
        type = "image/png",
    }: ScreenshotOptions = {}) => {
        onCaptureStart?.();
        return fromPromise(
            navigator.mediaDevices.getDisplayMedia({
                // Actually supported only in Chrome. Not yet part of the TS typedefs
                // @ts-ignore
                preferCurrentTab: true,
                video: { frameRate: 30 },
            })
        )
            .flatMap(result => fromPromise(waitForFocus(result)))
            .flatMap(result => {
                const video = createVideoElementToCaptureFrames(result);
                document.body.appendChild(video);
                return fromPromise(sleep()).map(() => {
                    const canvas = paintVideoFrameOnCanvas(video);
                    const screenshot = canvas.toDataURL(type, quality);
                    stopCapture(video);
                    canvas.remove();
                    onCaptureEnd?.();
                    return screenshot;
                });
            });
    };
}

function sleep(timeoutInMs = 300) {
    return new Promise(r => {
        setTimeout(r, timeoutInMs);
    });
}

async function waitForFocus(result: MediaStream): Promise<MediaStream> {
    await sleep();
    return document.hasFocus() ? result : waitForFocus(result);
}

function createVideoElementToCaptureFrames(mediaStream: MediaStream) {
    const video = document.createElement("video");
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.srcObject = mediaStream;
    video.setAttribute(
        "style",
        "position:fixed;top:0;left:0;pointer-events:none;visibility:hidden;"
    );
    return video;
}

function paintVideoFrameOnCanvas(video: HTMLVideoElement) {
    if (!(video.srcObject && isMediaStream(video.srcObject))) throw new Error("Not a MediaStream");
    const videoTrackSettings = video.srcObject.getTracks()[0].getSettings();
    const canvas = document.createElement("canvas");
    canvas.width = videoTrackSettings?.width ?? 0;
    canvas.height = videoTrackSettings?.height ?? 0;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);
    return canvas;
}

function stopCapture(video: HTMLVideoElement) {
    if (!(video.srcObject && isMediaStream(video.srcObject))) throw new Error("Not a MediaStream");
    const tracks = video.srcObject.getTracks();
    tracks?.forEach((track: { stop: () => void }) => track.stop());
    video.srcObject = null;
    video.remove();
}

export function checkIfBrowserSupported() {
    return Boolean(navigator.mediaDevices?.getDisplayMedia);
}

function isMediaStream(provider: MediaProvider): provider is MediaStream {
    return "getTracks" in provider;
}
