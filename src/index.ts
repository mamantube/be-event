import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

app.use(express.json());

app.use(express.urlencoded({ extended: true }))

const PORT = 3001;

app.use("/api", router)

app.listen(PORT, () => (
    console.log(`Server is running on http://localhost:${PORT}`)
));

