import { fromPromise } from "./future";

export const checkIfBrowserSupported = () => Boolean(navigator.mediaDevices?.getDisplayMedia);

type Options = {
    /**
     * The quality between 0-1 of your final image. 1 is uncompressed, 0 is lowest quality.
     * @default 0.7
     */
    quality?: number;
    onCaptureStart?: () => void;
    onCaptureEnd?: () => void;
    type?: "image/jpeg" | "image/png" | "image/webp";
};

/**
 * Takes a screenshot of the current page using a the native browser [`MediaDevices`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia) API.
 */
export const screenshot = ({
    onCaptureEnd,
    onCaptureStart,
    quality = 0.7,
    type = "image/png",
}: Options = {}) => {
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

const sleep = (timeoutInMs = 300) =>
    new Promise(r => {
        setTimeout(r, timeoutInMs);
    });

const waitForFocus = async (result: MediaStream): Promise<MediaStream> => {
    await sleep();
    return document.hasFocus() ? result : waitForFocus(result);
};

const createVideoElementToCaptureFrames = (mediaStream: MediaStream) => {
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
};

const paintVideoFrameOnCanvas = (video: HTMLVideoElement) => {
    // @ts-ignore getTracks is very much valid in modern browsers
    const videoTrackSettings = video.srcObject?.getTracks()[0].getSettings();
    const canvas = document.createElement("canvas");
    canvas.width = videoTrackSettings?.width ?? 0;
    canvas.height = videoTrackSettings?.height ?? 0;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);
    return canvas;
};

const stopCapture = (video: HTMLVideoElement) => {
    // @ts-ignore getTracks is very much valid in modern browsers
    const tracks = video.srcObject?.getTracks();
    tracks?.forEach((track: { stop: () => void }) => track.stop());

    // This is the only way to clean up a video stream in the browser
    // eslint-disable-next-line no-param-reassign
    video.srcObject = null;
    video.remove();
};
