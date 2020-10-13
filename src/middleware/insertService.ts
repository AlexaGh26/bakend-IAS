const fs = require('fs');

import moment from 'moment';
import { servInformationModel } from '../models/servInformation';

export const save = {
    saveNewService: async (req: any, res: any) => {
        const dateFormat = 'DD/MM/YYYY HH:mm:ss';
        const {dateInit, hoursInit, dateEnd, hoursEnd, registrationNumber, typeService} = req.body;

        const db: Array<object> = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
        const dateInitialSumHour = moment(dateInit).add(hoursInit, 'hours').format(dateFormat);
        const dateFinalSumHour = moment(dateEnd).add(hoursEnd, 'hours').format(dateFormat);
        let bodyFormat: servInformationModel = {
            "idTechnical": Number(registrationNumber),
            "dateInit": dateInitialSumHour,
            "dateEnd": dateFinalSumHour,
            "typeService" : typeService,
        };
        db.push(bodyFormat)
        let json = JSON.stringify(db);
        fs.writeFileSync('./database.json', json, 'utf8');
        res.send()
    },
};

