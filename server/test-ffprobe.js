import ffmpeg from "fluent-ffmpeg";
import ffprobePath from "ffprobe-static";

ffmpeg.setFfprobePath(ffprobePath.path);

ffmpeg.ffprobe("https://filesamples.com/samples/video/mp4/sample_640x360.mp4", (err, data) => {
    if (err) {
        console.error("ERROR:", err);
    } else {
        console.log("OK:", data);
    }
});
