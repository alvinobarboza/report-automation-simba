/**
 * @param {string} blob
 * @returns {string[]}
 */
export function readCSVfile(blob) {
    return Buffer.from(blob, 'base64').toString('utf8').split('\n');
}
