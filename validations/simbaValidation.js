/**@param {ReportCSV} reportsCSV  */
export function validateSimbaReport(reportsCSV) {
    const dealersData = validateDealerXSimbaProducts(reportsCSV);
    const dealersDataCustomers = validateActiveCustomers(
        reportsCSV,
        dealersData
    );
    console.log(dealersDataCustomers);
}

/**
 * @param {ReportCSV} reportsCSV
 * @param {DealerData[]} dealers
 * @returns {DealerData[]}
 */
function validateActiveCustomers(reportsCSV, dealers) {
    const viewersid = 0;
    const customersid = 1;
    const profilesid = 2;
    const profile = 3;
    const login = 4;
    const portal = 5;
    const dealerid = 6;
    const dealer = 7;
    const productid = 8;
    const product = 9;
    const subscribed_at = 10;
    const cancelled_at = 11;

    const avendor = 0;
    const adealerid = 1;
    const adealer = 2;
    const aprofileUsed = 3;
    const aused = 4;
    const aviewersid = 5;
    const acustomersid = 6;
    const alogin = 7;

    const customerTemp = {};

    let counter = 0;
    for (const dealerData of dealers) {
        for (const subscription of reportsCSV.subscriptions) {
            const subColumns = subscription.split(',');
            if (subColumns[viewersid] === 'viewersid') {
                console.log(subColumns[viewersid], subColumns[login]);
                continue;
            }

            if (!customerTemp[subColumns[viewersid]]) {
                customerTemp[subColumns[viewersid]] = {
                    viewersId: parseInt(subColumns[viewersid]),
                    customersId: parseInt(subColumns[customersid]),
                    login: subColumns[login],
                    isActive: false,
                    simbaProducts: [],
                };
                dealerData.customers.push(customerTemp[subColumns[viewersid]]);
            }

            for (const simbaProduct of dealerData.simbaProducts) {
                if (
                    simbaProduct.productsId === parseInt(subColumns[productid])
                ) {
                    console.log(
                        dealerData.dealerName,
                        'idp: ',
                        simbaProduct.productsId,
                        'idc: ',
                        subColumns[viewersid],
                        'count: ',
                        counter
                    );
                    customerTemp[subColumns[viewersid]].simbaProducts.push(
                        simbaProduct
                    );
                }
                counter++;
            }

            for (const active of reportsCSV.active) {
                const actColumns = active.split(',');
                if (
                    customerTemp[subColumns[viewersid]].viewersId ===
                    parseInt(actColumns[aviewersid])
                ) {
                    console.log(
                        dealerData.dealerName,
                        'ids: ',
                        actColumns[aviewersid],
                        'idc: ',
                        subColumns[viewersid],
                        'count: ',
                        counter
                    );
                    customerTemp[subColumns[viewersid]].isActive = true;
                }
                counter++;
            }
        }
        break;
    }

    return dealers;
}

/**
 * @param {ReportCSV} reportsCSV
 * @returns {DealerData[]}
 */
function validateDealerXSimbaProducts(reportsCSV) {
    const dealers_id = 0;
    const dealers_name = 1;
    const products_id = 2;
    const packages_id = 3;
    const packages_name = 4;
    const channels_id = 5;
    const channels_name = 6;

    const id = 0;
    const name = 1;
    const nomefantasia = 2;
    const razaosocial = 3;
    const cnpj = 4;
    const cidade = 5;
    const uf = 6;

    const dealers = [];
    const tempProductsGroup = {};
    const tempoDealerGrouped = {};

    for (const product of reportsCSV.simba) {
        const columns = product.split(',');
        if (columns[dealers_id] === 'dealers_id') {
            console.log(columns[dealers_id], columns[packages_name]);
            continue;
        }
        if (!tempProductsGroup[columns[products_id]]) {
            tempProductsGroup[columns[products_id]] = {
                packageId: parseInt(columns[packages_id]),
                productsId: parseInt(columns[products_id]),
                productsName: columns[packages_name],
            };
        }

        if (tempoDealerGrouped[columns[dealers_id]]) {
            let shouldinclude = true;
            for (const item of tempoDealerGrouped[columns[dealers_id]]
                .simbaProducts) {
                if (item.packageId === parseInt(columns[packages_id])) {
                    shouldinclude = false;
                }
            }
            if (shouldinclude) {
                tempoDealerGrouped[columns[dealers_id]].simbaProducts.push(
                    tempProductsGroup[columns[products_id]]
                );
            }
        } else {
            for (const dealer of reportsCSV.dealers) {
                const dealerColumn = dealer.split(',');
                if (columns[dealers_id] === dealerColumn[id]) {
                    tempoDealerGrouped[columns[dealers_id]] = {
                        dealerId: parseInt(columns[dealers_id]),
                        dealerName: columns[dealers_name],
                        dealerNomeFantasia: dealerColumn[nomefantasia],
                        dealerRazaoSocial: dealerColumn[razaosocial],
                        dealerCnpj: dealerColumn[cnpj],
                        dealerCidade: dealerColumn[cidade],
                        dealerUf: dealerColumn[uf],
                        simbaProducts: [
                            tempProductsGroup[columns[products_id]],
                        ],
                        customers: [],
                        totalCustomersActive: 0,
                        totalCustomers: 0,
                    };
                    dealers.push(tempoDealerGrouped[columns[dealers_id]]);
                }
            }
        }
    }
    return dealers;
}

/**
 * @typedef {object} DealerData
 * @property {number} dealerId
 * @property {string} dealerName
 * @property {string} dealerNomeFantasia
 * @property {string} dealerRazaoSocial
 * @property {string} dealerCnpj
 * @property {string} dealerCidade
 * @property {string} dealerUf
 * @property {SimbaProductsData[]} simbaProducts
 * @property {CustomerData[]} customers
 * @property {number} totalCustomersActive
 * @property {number} totalCustomers
 */

/**
 * @typedef {object} CustomerData
 * @property {number} viewersId
 * @property {number} customersId
 * @property {string} login
 * @property {boolean} isActive
 * @property {SimbaProductsData[]} simbaProducts
 */

/**
 * @typedef {object} SimbaProductsData
 * @property {number} packageId
 * @property {number} productsId
 * @property {string} productsName
 */

/**
 * @typedef {object} ReportCSV
 * @property {string[]} active
 * @property {string[]} simba,
 * @property {string[]} subscriptions
 * @property {string[]} dealers
 */
