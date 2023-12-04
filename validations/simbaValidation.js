/**@param {ReportCSV} reportsCSV  */
export function validateSimbaReport(reportsCSV) {
    console.log(
        `active: ${reportsCSV.active.length} \nsimba: ${reportsCSV.simba.length} \nsubscriptions: ${reportsCSV.subscriptions.length}`
    );
}

/**
 * @typedef {object} ReportCSV
 * @property {string[]} active
 * @property {string[]} simba,
 * @property {string[]} subscriptions
 */
