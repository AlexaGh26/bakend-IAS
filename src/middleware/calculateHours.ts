const fs = require('fs');
const moment = require('moment');
const db: Array<object> = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
import { servInformationModel } from '../models/servInformation';

export const calculateHours = {
    calculate: (historyTechnical: any) => {
        console.log('entro a calculate');
        return calculateHours.calHoursExtra(historyTechnical);
    },
    calHoursExtra: (historyTechnical: any) => {
        console.log('entro a calHoursExtra');
        historyTechnical.map((registry :any) => {
            const {  dateInit, dateEnd } = registry
            const dateInitFormat = moment(dateInit, 'DD/MM/YYYY HH:mm:ss');
            const dateEndFormat = moment(dateEnd, 'DD/MM/YYYY HH:mm:ss');  
            const hoursWorked = dateEndFormat.diff(dateInitFormat, 'hours');
            return hoursWorked;
        })
    }
    



};

