import express, { Express, Request, Response } from "express";
import { PORT } from "../secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/error";
const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Working");
});
export const prismaClient=new PrismaClient({log:['query']})
app.use(express.json())
app.use("/api", rootRouter);
app.use(errorMiddleware)
app.listen(PORT, () => {
  console.log(`App working on port ${PORT}`);
});
