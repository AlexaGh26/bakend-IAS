const fs = require('fs');

import { servInformationModel } from '../models/servInformation';

export const save = {
    saveNewService: async (req: any, res: any) => {
        const db: Array<object> = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
        let body: servInformationModel = req.body;
        db.push(body)
        let json = JSON.stringify(db);
        fs.writeFileSync('./database.json', json, 'utf8');
        res.send('Created correctly')
    },
};

