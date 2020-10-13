const express = require("express");
const app = express();
const PORT = 3001;
import * as bodyParser from "body-parser";
const fs = require('fs');
import { save } from './middleware/insertService';
import { calculateHours } from './middleware/calculateHours'

const db: Array<object> = JSON.parse(fs.readFileSync('./database.json', 'utf8'));

app.use(bodyParser.json());

app.post('/form', (req: any, res: any) => {
  save.saveNewService( req , res)
})

app.get('/consult/:idTechnical/:week', (req: any, res: any) => {
  const { idTechnical, week } = req.params;
  let historyTechnical = db.filter((service: any) => service.idTechnical.toString() === idTechnical.toString())
  if (!historyTechnical.length) {
    res.status(404).send()
  } else {
    let resConsult = calculateHours.calculate(historyTechnical, week);
    res.send(resConsult)
  }
})

app.listen(PORT, () => {
  console.log(`Running in http://localhost:${PORT}`);
});
