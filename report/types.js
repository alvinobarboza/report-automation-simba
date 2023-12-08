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

/**
 * @typedef {object} Files
 * @property {string} filename
 * @property {string} path
 */
