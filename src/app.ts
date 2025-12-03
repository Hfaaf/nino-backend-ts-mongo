import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import ocorrenciaRoutes from "./routes/ocorrenciaRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// rotas
app.use("/auth", authRoutes);
app.use("/ocorrencias", ocorrenciaRoutes);


export default app;