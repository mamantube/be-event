import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import db from "./utils/databse";
import docs from "./docs/routes";
import cors from "cors";


async function init() {
    try {
        const result = await db();

        console.log("Database ststus:", result)

        const app = express();

        app.use(cors())
        
        app.use(bodyParser.json());
        
        app.use(express.json());
        
        app.use(express.urlencoded({ extended: true }))
        
        const PORT = 3001;

        app.get("/", (req, res) => {
            res.status(200).json({
                message: "Server is running"
            })
        })
        
        app.use("/api", router)
        docs(app);
        
        app.listen(PORT, () => (
            console.log(`Server is running on http://localhost:${PORT}`)
        ));  
    } catch (error) {
     console.error(error);   
    }
}

init();

