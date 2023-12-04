import { readCSVfile } from '../utils/ConvertB64toCSV.js';
import {
    downloadReport,
    getLastestEntryFromSchedule,
} from '../utils/moTV.call.js';

const ACTIVE = 'active';
const SUBSCRIPTIONS = 'subscriptions';
const SIMBA = 'simba';

const TYPES = [ACTIVE, SUBSCRIPTIONS, SIMBA];

/** @returns {Promise<ReportIds>} */
export async function returnLatestIdFromReportType() {
    /**@type {Entries[]} */
    const entries = await getLastestEntryFromSchedule();

    const reportsDates = {};
    const reportsId = {};

    for (const report of entries) {
        const temp = new Date(report.report_schedules_attachements_generated);

        for (const TYPE of TYPES) {
            if (
                !reportsDates[TYPE] &&
                report.report_schedules_attachements_note === TYPE
            ) {
                reportsDates[TYPE] = new Date(
                    report.report_schedules_attachements_generated
                );
                reportsId[TYPE] = report.report_schedules_attachements_id;
            } else if (
                reportsDates[TYPE] < temp &&
                report.report_schedules_attachements_note === TYPE
            ) {
                reportsDates[TYPE] = temp;
                reportsId[TYPE] = report.report_schedules_attachements_id;
            }
        }
    }

    return reportsId;
}

/**@param {ReportIds} ids @returns {Promise<ReportContents>}*/
export async function downloadAllReports(ids) {
    const tempObject = {};

    for (const TYPE of TYPES) {
        const content = await downloadReport(ids[TYPE]);
        tempObject[TYPE] = content;
    }
    return tempObject;
}

/**@param {ReportContents} content @returns {ReportCSV}*/
export function linesfromDownloadReports(content) {
    const tempObject = {};
    for (const TYPE of TYPES) {
        const lines = readCSVfile(content[TYPE]);
        tempObject[TYPE] = lines;
    }
    return tempObject;
}

/**
 * @typedef {object} ReportIds
 * @property {number} active
 * @property {number} simba,
 * @property {number} subscriptions
 */

/**
 * @typedef {object} ReportContents
 * @property {string} active
 * @property {string} simba,
 * @property {string} subscriptions
 */

/**
 * @typedef {object} ReportCSV
 * @property {string[]} active
 * @property {string[]} simba,
 * @property {string[]} subscriptions
 */

/**
 * @typedef {object} Entries
 * @property {Date} report_schedules_attachements_generated
 * @property {number} report_schedules_attachements_id
 * @property {string} report_schedules_attachements_note
 */
