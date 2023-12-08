import { sendEmail } from '../email/emailHandler.js';
import { writeProgramadorasReportSimba } from './simbaReport.js';
import './types.js';

/**@param {DealerData[]} dealerData  @param {ReportCSV} reportsCSV */
export async function generateExcelFiles(dealerData, reportsCSV) {
    await writeProgramadorasReportSimba(dealerData);
    sendEmail();
}
