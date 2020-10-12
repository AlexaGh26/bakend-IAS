const express = require("express");
const app = express();
const PORT = 3001;
import * as bodyParser from "body-parser";
const fs = require('fs');
import { save } from './middleware/inserService';
import { calculateHours } from './middleware/calculateHours'

const db: Array<object> = JSON.parse(fs.readFileSync('./database.json', 'utf8'));

app.use(bodyParser.json());

app.post('/form', (req: any, res: any) => {
  save.saveNewService( req , res)
})

app.get('/consult/:idTechnical/:week', async (req: any, res: any) => {
  const { idTechnical, week } = req.params;
  console.log(idTechnical, week)
  let historyTechnical = db.filter((service: any) => service.idTechnical.toString() === idTechnical.toString())
  let resConsult = await calculateHours.calculate(historyTechnical);
  res.send(resConsult)
})

app.listen(PORT, () => {
  console.log(`Running in http://localhost:${PORT}`);
});
