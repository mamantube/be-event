import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import db from "./utils/db";

const app = express();

app.use(bodyParser.json());

let databaseConnected = false;

app.use(async (req, res, next) => {
  try {
    if (!databaseConnected) {
      const result = await db();

      console.log("Database status:", result);

      databaseConnected = true;
    }

    next();
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      message: "Database connection failed",
      data: null,
    });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
    data: null,
  });
});

app.use("/api/v1", router);

export default app;

if (process.env.NODE_ENV !== "production") {
  const PORT = 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// import express from "express";
// import router from "./routes/api";
// import bodyParser from "body-parser";
// import db from "./utils/db";

// async function init() {
//   try {
//     const result = await db();

//     console.log("Database status:", result)

    
//     const app = express();
//     const PORT = 3000;

//     app.get("/", (req, res) => {
//       res.status(200).json({
//         message: "Server is running",
//         data: null
//       })
//     })

//     app.use(bodyParser.json());
//     app.use("/api/v1", router);

//     app.listen(PORT, () => {
//       console.log(`Server is running on http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.log(error)
//   }
// }

// init();
