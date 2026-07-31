import express from "express";
import { getVideoInfo } from "../utils/videoInfo.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Falta la URL del video" });

    try {
        const info = await getVideoInfo(url);
        res.json(info);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al analizar el video" });
    }
});

export default router;
