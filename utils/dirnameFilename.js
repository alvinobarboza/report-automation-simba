import path from 'node:path';
import { fileURLToPath } from 'node:url';
/**
 * @param {string} url
 * @returns {{__filename: string, __dirname: string}}
 */
export default function getFilenameDirname(url) {
    const __filename = fileURLToPath(url);
    const __dirname = path.dirname(__filename);
    return {
        __filename,
        __dirname,
    };
}
