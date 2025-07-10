import express from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globerErrorHandler";
import notFound from "./app/middlewares/notFound";

 
const app = express();
app.use(express.json());
app.use(cors())

app.use("/api/v1", router)


app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello World"
    })
})

app.use(globalErrorHandler);
app.use(notFound);

export default app;