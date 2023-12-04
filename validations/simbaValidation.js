/**@param {ReportCSV} reportsCSV  */
export function validateSimbaReport(reportsCSV) {
    const data = [
        {
            dealerId: 0,
            dealer: '',
            simbaProducts: [
                {
                    packageId: 0,
                    productsId: 0,
                    productsName: '',
                },
            ],
            customers: [
                {
                    viewersId: 0,
                    customersId: 0,
                    login: '',
                    isActive: false,
                },
            ],
            totalCustomersActive: 0,
            totalCustomers: 0,
        },
    ];
}

/**
 * @typedef {object} ReportCSV
 * @property {string[]} active
 * @property {string[]} simba,
 * @property {string[]} subscriptions
 */
