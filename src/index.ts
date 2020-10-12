const express = require("express");
const app = express();
const PORT = 3001;
import * as bodyParser from "body-parser";
const fs = require('fs');
import { serviceInformationModel } from './models/serviceInformation'

const db: Array<object> = JSON.parse(fs.readFileSync('./database.json', 'utf8'));

app.use(bodyParser.json());

app.post('/form', (req: any, res: any) => {
  let body: serviceInformationModel = req.body;
  db.push(body)
  let json = JSON.stringify(db);
  fs.writeFileSync('./database.json', json, 'utf8');
  res.send('200 Created correctly')
})

app.get('/consult', (req: any, res: any) => {

  res.send()
})

app.listen(PORT, () => {
  console.log(`Running in http://localhost:${PORT}`);
});
