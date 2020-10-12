const express = require("express");
const app = express();
const PORT = 3001;
import * as bodyParser from "body-parser";
const fs = require('fs'); 


const db :Array<object> = JSON.parse(fs.readFileSync('./database.json' ,'utf8'));

app.use(bodyParser.json());

app.post( '/form', ( req:any, res: any) => {
  console.log(db)
  db.push(req.body)
  let json = JSON.stringify(db); 
  fs.writeFileSync('./database.json', json, 'utf8'); 
  res.send('ok')
})

app.listen(PORT, () => {
  console.log(`Running in http://localhost:${PORT}`);
});
