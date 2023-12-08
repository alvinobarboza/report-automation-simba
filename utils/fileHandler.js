import fs from 'node:fs';
import path from 'node:path';
import getFilenameDirname from './dirnameFilename.js';
import * as DateUtils from './dateManipulation.js';
const { __dirname } = getFilenameDirname(import.meta.url);

const OUTPUT_FOLDER = 'output';

/**@type {string} */
const PATHTOFOLDER = (() => {
    const pathFolder = path.join(
        __dirname,
        '..',
        OUTPUT_FOLDER,
        `${DateUtils.getCurrentMonth()}${DateUtils.getCurrentYear()}_${DateUtils.getCurrentDate()}`
    );
    if (!fs.existsSync(pathFolder)) fs.mkdirSync(pathFolder);
    return pathFolder;
})();

/**@param {string} filename @returns {string} */
export function getPath(filename) {
    return path.join(PATHTOFOLDER, filename);
}

/**@param {string} filename  */
export function insertFilenameToFilenames(filename) {
    FILENAMES.push({
        filename: path.basename(filename),
        path: filename,
    });
}

/**@type {Files[]} */
export const FILENAMES = [];

export function loadEmailTemplate() {
    const emailTemplate = fs
        .readFileSync(path.join(__dirname, '..', 'email', 'emailTemplate.html'))
        .toString()
        .replace(':date:', new Date().toLocaleString());
    // console.log(emailTemplate);
    return emailTemplate;
}
