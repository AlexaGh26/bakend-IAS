"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
var PORT = 3001;
var bodyParser = __importStar(require("body-parser"));
var fs = require('fs');
var db = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
app.use(bodyParser.json());
app.post('/form', function (req, res) {
    var body = req.body;
    db.push(body);
    var json = JSON.stringify(db);
    fs.writeFileSync('./database.json', json, 'utf8');
    res.send('200 Created correctly');
});
app.get('/consult', function (req, res) {
    res.send();
});
app.listen(PORT, function () {
    console.log("Running in http://localhost:" + PORT);
});
