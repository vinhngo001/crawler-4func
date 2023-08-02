import express, { Request, Response } from 'express';
import cors from "cors";
import helmet from 'helmet';
import morgan from 'morgan';
import logger from 'node-color-log';
import dotenv from 'dotenv';

import { formulaRaceResult, getRaceResult } from "./services";

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

// Routes
/**  
 * @route GET crawling-race-result
 * @desc Crawl data with year and type:["teams","drivers"], if not use type default is races
 * @access Public
*/
app.get("/crawling-race-result", async (req: Request, res: Response) => {
    const { year, type } = req.query;
    await formulaRaceResult(year as any, type as any);
    res.send({ message: "Crawling data in successfully" });
});

/**  
 * @route GET crawling-race-result
 * @desc searching race result with query field: year, driver, team
 * If not use query field, default get all data race result
 * @access Public
*/
app.get("/race-result", async (req: Request, res: Response) => {
    const { year, team, driver } = req.query;
    const result = await getRaceResult(year as any, team as any, driver as any);
    res.json({ message: "Get data in successfully", data: result })
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => logger.info(`Server is listening on port ${PORT}`));