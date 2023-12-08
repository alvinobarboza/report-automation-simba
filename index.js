import 'dotenv/config';
import * as SIMBA from './reportDownload/simba.js';
import { validateSimbaReport } from './validations/simbaValidation.js';
import { generateExcelFiles } from './report/reports.js';

(async function () {
    const ids = await SIMBA.returnLatestIdFromReportType();
    const downloadedReports = await SIMBA.downloadAllReports(ids);
    const downloadedReportsCSVLines =
        SIMBA.linesfromDownloadReports(downloadedReports);
    const validatedUsers = validateSimbaReport(downloadedReportsCSVLines);
    generateExcelFiles(validatedUsers, downloadedReportsCSVLines);
})();
