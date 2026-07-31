import ffmpeg from "fluent-ffmpeg";
import ffprobePath from "ffprobe-static";
import fetch from "node-fetch";

ffmpeg.setFfprobePath(ffprobePath.path);

export async function getVideoInfo(url) {
    // HEAD request para tamaño
    const head = await fetch(url, { method: "HEAD" });
    const size = head.headers.get("content-length");

    // ffprobe para metadata
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(url, { path: ffprobePath.path }, (err, data) => {
            if (err) return reject(err);

            const videoStream = data.streams.find(s => s.codec_type === "video");
            const audioStream = data.streams.find(s => s.codec_type === "audio");

            resolve({
                url,
                duration: data.format.duration,
                size: size ? `${(size / 1048576).toFixed(2)} MB` : "Desconocido",
                codec_video: videoStream?.codec_name || "Desconocido",
                codec_audio: audioStream?.codec_name || "No detectado",
                resolution: videoStream ? `${videoStream.width}x${videoStream.height}` : "Desconocido",
                bitrate: data.format.bit_rate ? `${(data.format.bit_rate / 1000).toFixed(0)} kbps` : "Desconocido",
                fps: videoStream?.avg_frame_rate || "Desconocido",
                hasAudio: !!audioStream
            });
        });
    });
}
