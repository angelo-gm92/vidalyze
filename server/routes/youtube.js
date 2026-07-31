import express from "express";
import ytdlp from "yt-dlp-exec";

const router = express.Router();

router.get("/youtube", async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Missing URL" });
    }

    try {
        const info = await ytdlp(url, {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            preferFreeFormats: true
        });

        // Buscar el mejor formato con vídeo
        const bestFormat = info.formats.find(f => f.vcodec !== "none");

        res.json({
            title: info.title,
            duration: info.duration,
            thumbnail: info.thumbnail,
            directUrl: bestFormat?.url || null,
            codec_video: bestFormat?.vcodec || "Desconocido",
            codec_audio: bestFormat?.acodec || "Desconocido",
            fps: bestFormat?.fps || "Desconocido",
            size: bestFormat?.filesize || "Desconocido",
            resolution: bestFormat?.resolution || `${bestFormat?.width}x${bestFormat?.height}`,
            format: bestFormat?.ext || "mp4"
        });

    } catch (err) {
        console.error("yt-dlp error:", err);
        res.status(500).json({ error: "yt-dlp failed", details: err.message });
    }
});

export default router;
