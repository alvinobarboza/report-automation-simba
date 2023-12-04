import { createHash } from 'crypto';

const LOGIN = process.env.LOGINMOTV;
const SECRET = process.env.SECRETMOTV;
const REPORT_ID = 6;

export async function getLastestEntryFromSchedule() {
    const reportsToDownload = {};
    const URL = 'https://mw.yplay.com.br/api/reportSchedule/historySelection';
    const BODY = {
        data: {
            where: [
                {
                    column: 'report_schedules_attachements_report_schedules_id',
                    type: '=',
                    valueType: '%i',
                    value: REPORT_ID,
                },
                {
                    column: 'report_schedules_attachements_generated',
                    type: '>=',
                    valueType: '%t',
                    value: getCurrentDate(),
                },
            ],
        },
    };

    const request = await moTV(URL, BODY, LOGIN, SECRET);
    return request.response.rows;
}

/**@param {number} id @returns {Promise<string>} */
export async function downloadReport(id) {
    const URL = 'https://mw.yplay.com.br/api/reportSchedule/downloadReport';
    const BODY = { data: { reportSchedulesAttachementsId: id } };

    const request = await moTV(URL, BODY, LOGIN, SECRET);
    return request.response.content;
}

async function moTV(url, data, user = '', secret = '') {
    const headers = { 'Authorization-user': getToken(user, secret) };
    console.log(`request-start: ${new Date().toISOString()}`);
    console.log(
        'URL: ',
        url,
        '\n',
        'Headers: ',
        JSON.stringify(headers, undefined, 2),
        '\n',
        'Body: ',
        JSON.stringify(data, undefined, 2),
        '\n'
    );

    const request = await fetch(url, {
        body: JSON.stringify(data),
        headers,
        method: 'POST',
    });
    const body = await request.json();
    console.log(`request-end: ${new Date().toISOString()}`);
    return body;
}

function getToken(user, secret) {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const sha1Hash = createHash('sha1')
        .update(timestamp + user + secret)
        .digest('hex');
    return `${user}:${timestamp}:${sha1Hash}`;
}

function getCurrentDate() {
    // return '2023-12-04';
    let date = new Date();
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let timestamp = `${year}-${month}-${day} 00:00:00`;
    let timezone = `-03:00`;
    return `${timestamp}${timezone}`;
}
