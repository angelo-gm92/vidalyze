import express from "express";
import cors from "cors";
import analyzeRouter from "./routes/analyze.js";
import youtubeRouter from "./routes/youtube.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", youtubeRouter);

app.use("/api/analyze", analyzeRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor backend activo en puerto ${PORT}`));
