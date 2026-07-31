import React, { useRef, useState } from "react";
import { getVideoMetadata } from "../utils/getVideoMetadata";
import { getYoutubeMetadata } from "../utils/getYoutubeMetadata";

export default function VideoAnalyser({ url, setUrl, history }) {

    const videoRef = useRef(null);
    const [info, setInfo] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [locked, setLocked] = useState(false);
    const [error, setError] = useState(null);

    function validateUrlLive(u) {
        if (!u) return "La URL está vacía.";

        try {
            new URL(u);
        } catch {
            return "La URL no es válida.";
        }

        const isVideo = /\.(mp4|webm|mov|mkv)$/i.test(u);
        const isYT = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(u);

        if (!isVideo && !isYT) {
            return "Debe ser un enlace de YouTube o un archivo de vídeo.";
        }

        return null;
    }

    const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");
    const canDownload = info?.directUrl || url.match(/\.(mp4|webm|mov|mkv)$/i);

    const handleMetadata = async () => {
        setLoading(true);
        setLocked(true);

        let backendInfo = null;

        try {
            if (isYoutube) {
                backendInfo = await getYoutubeMetadata(url);

                setInfo({
                    title: backendInfo.title,
                    duration: backendInfo.duration,
                    resolution: backendInfo.resolution || "Desconocida",
                    thumbnail: backendInfo.thumbnail,
                    subtitles: [],
                    size: backendInfo.size || "Desconocido",
                    codec_video: backendInfo.codec_video || "Desconocido",
                    codec_audio: backendInfo.codec_audio || "Desconocido",
                    bitrate: backendInfo.bitrate || "Desconocido",
                    fps: backendInfo.fps || "Desconocido",
                    hasAudio: true,
                    format: "YouTube",
                    directUrl: backendInfo.directUrl
                });

                setLoading(false);
                return;
            }

            // --- VÍDEOS NORMALES ---
            const video = videoRef.current;
            if (!video) return;

            const duration = video.duration;
            const width = video.videoWidth;
            const height = video.videoHeight;

            const canvas = document.createElement("canvas");
            canvas.width = width || 320;
            canvas.height = height || 180;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumb = canvas.toDataURL("image/png");
            setThumbnail(thumb);

            const subtitles = Array.from(video.textTracks || []).map(t => ({
                kind: t.kind,
                label: t.label,
                language: t.language
            }));

            backendInfo = await getVideoMetadata(url);

            setInfo({
                title: url,
                duration,
                resolution: `${width}x${height}`,
                thumbnail: thumb,
                subtitles,
                size: backendInfo?.size || "Desconocido",
                codec_video: backendInfo?.codec_video || "Desconocido",
                codec_audio: backendInfo?.codec_audio || "Desconocido",
                bitrate: backendInfo?.bitrate || "Desconocido",
                fps: backendInfo?.fps || "Desconocido",
                hasAudio: backendInfo?.hasAudio ?? true,
                format: backendInfo?.format || url.split(".").pop()
            });

        } catch (err) {
            console.error("Error backend:", err);
        }

        setLoading(false);
    };

    const resetAnalyser = () => {
        setUrl("");
        setInfo(null);
        setThumbnail(null);
        setLocked(false);
        setLoading(false);
        setError(null);
    };

    return (
        <div className="video-analyser">

            <div className="va-section">

                <h2 className="va-title">Inserta aquí la URL del vídeo que deseas analizar</h2>
                <input
                    className={`va-input ${locked ? "va-input-locked" : ""}`}
                    type="text"
                    placeholder="Ejemplo: www.example.com/video.mp4"
                    value={url}
                    onChange={(e) => {
                        if (locked) return;

                        const value = e.target.value;
                        setUrl(value);

                        const err = validateUrlLive(value);
                        setError(err);
                    }}
                    disabled={locked}
                />

                {error && (
                    <div className="va-error">
                        {error}
                    </div>
                )}


                {loading && <div className="va-spinner"></div>}

                <div className="va-actions">
                    {locked && (
                        <button className="va-action-btn" onClick={resetAnalyser}>
                            ↺ Reintentar
                        </button>
                    )}

                    {info && canDownload && (
                        <button
                            className="va-action-btn"
                            onClick={() => {
                                const link = document.createElement("a");
                                link.href = info.directUrl || url;
                                link.download = info.title || "video";
                                link.click();
                            }}
                        >
                            ⬇ Descargar
                        </button>
                    )}
                </div>

            </div>

            {url && !isYoutube && (
                <video
                    ref={videoRef}
                    src={url}
                    controls
                    onLoadedMetadata={handleMetadata}
                    className="va-video"
                    hidden
                />
            )}

            {info && (
                <div className="va-section info-card">

                    <h2 className="va-title">Información del vídeo</h2>

                    <div className="va-grid">
                        <div className="va-item va-title-wide">
                            <span className="va-label">Título</span>
                            <span className="va-value">{info.title}</span>
                        </div>

                        <div className="va-item">
                            <span className="va-label">Duración</span>
                            <span className="va-value">{info.duration.toFixed(2)} s</span>
                        </div>

                        <div className="va-item va-preview">
                            <span className="va-label">Vista previa</span>
                            <video
                                src={info.directUrl || url}
                                controls
                                className="va-preview-video"
                            />
                        </div>

                        <div className="va-item">
                            <span className="va-label">Resolución</span>
                            <span className="va-value">{info.resolution}</span>
                        </div>

                        <div className="va-item">
                            <span className="va-label">Formato</span>
                            <span className="va-value">{info.format}</span>
                        </div>

                        <div className="va-item">
                            <span className="va-label">Audio disponible</span>
                            <span className="va-value">{info.hasAudio ? "Sí" : "No"}</span>
                        </div>

                        <div className="va-item">
                            <span className="va-label">Tamaño</span>
                            <span className="va-value">{info.size}</span>
                        </div>

                        <div className="va-item">
                            <span className="va-label">Códec de vídeo</span>
                            <span className="va-value">{info.codec_video}</span>
                        </div>

                        <div className="va-item">
                            <span className="va-label">Códec de audio</span>
                            <span className="va-value">{info.codec_audio}</span>
                        </div>

                        <div className="va-item">
                            <span className="va-label">Bitrate</span>
                            <span className="va-value">{info.bitrate}</span>
                        </div>

                        <div className="va-item">
                            <span className="va-label">FPS</span>
                            <span className="va-value">{info.fps}</span>
                        </div>

                        <div className="va-item">
                            <span className="va-label">Subtítulos</span>
                            <span className="va-value">
                                {info.subtitles.length > 0
                                    ? info.subtitles.map((s, i) => (
                                        <div key={i}>{s.label || s.language || s.kind}</div>
                                    ))
                                    : "No disponibles"}
                            </span>
                        </div>

                        <div></div>

                    </div>
                </div>
            )}


        </div>
    );
}
