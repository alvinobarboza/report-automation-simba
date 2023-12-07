import os from 'node:os';
import * as CSV from './simbaConstantsCSV.js';

/**@param {ReportCSV} reportsCSV  */
export function validateSimbaReport(reportsCSV) {
    console.time('Validation');
    const data = validateCustomerSimbaAndActive(reportsCSV);
    console.timeEnd('Validation');

    return data;
}

/**
 * @param {ReportCSV} reportsCSV
 * @returns {DealerData[]}
 */
function validateCustomerSimbaAndActive(reportsCSV) {
    const customersInserted = new Set();

    const genericActiveCustomers = efficientListActiveCustomer(
        reportsCSV.active
    );
    const genericDealerData = efficientDealerXSimbaProducts(reportsCSV);

    for (const subscriptions of reportsCSV.subscriptions) {
        const subcripstion_columns = removeDoubleQuotesFromCSV(subscriptions);

        const viewersId = subcripstion_columns[CSV.sub_viewersid];
        const dealer =
            genericDealerData[subcripstion_columns[CSV.sub_dealerid]];
        const activeCustomer = genericActiveCustomers[viewersId];

        if (activeCustomer && dealer && !customersInserted.has(viewersId)) {
            customersInserted.add(viewersId);
            dealer.customers.push(activeCustomer);
            dealer.totalCustomersActive++;
            dealer.totalCustomers++;
        } else if (
            !activeCustomer &&
            dealer &&
            !customersInserted.has(viewersId)
        ) {
            customersInserted.add(viewersId);
            genericActiveCustomers[viewersId] = {
                viewersId: parseInt(viewersId),
                customersId: parseInt(
                    subcripstion_columns[CSV.sub_customersid]
                ),
                login: subcripstion_columns[CSV.sub_login],
                isActive: false,
                simbaProducts: [],
                lastUsed: undefined,
            };
            dealer.customers.push(genericActiveCustomers[viewersId]);
            dealer.totalCustomers++;
        }

        if (dealer) {
            for (const simbaProduct of dealer.simbaProducts) {
                if (
                    simbaProduct.productsId ===
                    parseInt(subcripstion_columns[CSV.sub_productid])
                ) {
                    genericActiveCustomers[viewersId].simbaProducts.push(
                        simbaProduct
                    );
                }
            }
        }
    }

    /**@type {DealerData[]} */
    const dealerData = [];

    for (const key in genericDealerData) {
        if (genericDealerData.hasOwnProperty(key)) {
            dealerData.push(genericDealerData[key]);
        }
    }

    return dealerData;
}

/**
 * @param {string[]} activeReport
 * @returns {GenericCustomerData}
 */
function efficientListActiveCustomer(activeReport) {
    /**@type {GenericCustomerData} */
    const genericCustomerData = {};

    for (const line of activeReport) {
        const active_columns = removeDoubleQuotesFromCSV(line);

        if (
            active_columns[CSV.act_vendor] === 'vendor' ||
            !(active_columns.length > 1)
        ) {
            continue;
        }

        if (!genericCustomerData[active_columns[CSV.act_viewersid]]) {
            genericCustomerData[active_columns[CSV.act_viewersid]] = {
                viewersId: parseInt(active_columns[CSV.act_viewersid]),
                customersId: parseInt(active_columns[CSV.act_customersid]),
                login: active_columns[CSV.act_login],
                isActive: true,
                lastUsed: active_columns[CSV.act_used],
                simbaProducts: [],
            };
        }
    }
    return genericCustomerData;
}

/**
 * @param {ReportCSV} reportsCSV
 * @returns {GenericDealerData}
 */
function efficientDealerXSimbaProducts(reportsCSV) {
    /**@type {GenericSimbaProductsData} */
    const tempProductsGroup = {};
    /**@type {GenericDealerData} */
    const tempoDealerGrouped = {};

    for (const dealer of reportsCSV.dealers) {
        const dealerColumn = removeDoubleQuotesFromCSV(dealer);

        for (const product of reportsCSV.simba) {
            const columns = removeDoubleQuotesFromCSV(product);
            if (
                columns[CSV.sim_dealers_id] === 'dealers_id' ||
                !(columns.length > 1)
            ) {
                // console.log(
                //     'Continue',
                //     columns[CSV.sim_dealers_id],
                //     columns[CSV.sim_packages_name]
                // );
                continue;
            }
            if (!tempProductsGroup[columns[CSV.sim_products_id]]) {
                // console.log(
                //     columns[CSV.sim_packages_id],
                //     columns[CSV.sim_products_id],
                //     columns[CSV.sim_packages_name]
                // );
                tempProductsGroup[columns[CSV.sim_products_id]] = {
                    packageId: parseInt(columns[CSV.sim_packages_id]),
                    productsId: parseInt(columns[CSV.sim_products_id]),
                    productsName: columns[CSV.sim_packages_name],
                };
            }

            if (tempoDealerGrouped[columns[CSV.sim_dealers_id]]) {
                let shouldinclude = true;
                for (const item of tempoDealerGrouped[
                    columns[CSV.sim_dealers_id]
                ].simbaProducts) {
                    if (
                        item.packageId ===
                        parseInt(columns[CSV.sim_packages_id])
                    ) {
                        shouldinclude = false;
                    }
                }
                if (shouldinclude) {
                    tempoDealerGrouped[
                        columns[CSV.sim_dealers_id]
                    ].simbaProducts.push(
                        tempProductsGroup[columns[CSV.sim_products_id]]
                    );
                }
            } else {
                if (columns[CSV.sim_dealers_id] === dealerColumn[CSV.d_id]) {
                    tempoDealerGrouped[columns[CSV.sim_dealers_id]] = {
                        dealerId: parseInt(columns[CSV.sim_dealers_id]),
                        dealerName: columns[CSV.sim_dealers_name],
                        dealerNomeFantasia: dealerColumn[CSV.d_nomefantasia],
                        dealerRazaoSocial: dealerColumn[CSV.d_razaosocial],
                        dealerCnpj: dealerColumn[CSV.d_cnpj],
                        dealerCidade: dealerColumn[CSV.d_cidade],
                        dealerUf: dealerColumn[CSV.d_uf],
                        simbaProducts: [
                            tempProductsGroup[columns[CSV.sim_products_id]],
                        ],
                        customers: [],
                        totalCustomersActive: 0,
                        totalCustomers: 0,
                    };
                }
            }
        }
    }
    return tempoDealerGrouped;
}

/**@param {string} line @returns {string[]} */
function removeDoubleQuotesFromCSV(line) {
    return line.split(',').reduce((pre, curr) => {
        pre.push(curr.replaceAll('"', ''));
        return pre;
    }, []);
}

/**
 * @typedef {Object.<string, DealerData>} GenericDealerData
 */

/**
 * @typedef {Object.<string, CustomerData>} GenericCustomerData
 */

/**
 * @typedef {Object.<string, SimbaProductsData>} GenericSimbaProductsData
 */

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
 * @property {string} [lastUsed]
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
