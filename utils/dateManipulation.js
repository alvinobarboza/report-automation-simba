export const getDateAstertes = () => {
    const date = new Date();
    return new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        1
    ).toLocaleDateString('pt-br');
};

export const getDateRange = () => {
    const date = new Date();
    const firstDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    ).toLocaleDateString('pt-br');
    const lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).toLocaleDateString('pt-br');
    return firstDay + ' até ' + lastDay;
};

export const getCurrentMonthYearNumeric = () => {
    const tempDate = new Date();
    return new Date(tempDate.getFullYear(), tempDate.getMonth())
        .toLocaleString('pt-BR', { month: 'numeric', year: 'numeric' })
        .split('/')
        .join('.');
};

export const getCurrentMonth = () => {
    return new Date()
        .toLocaleString('pt-BR', { month: 'short' })
        .toLocaleUpperCase()
        .split('.')[0];
};

export const getCurrentYear = () => {
    return new Date().getFullYear();
};

export const getLastMonthTimestamp = () => {
    return new Date(new Date().setMonth(new Date().getMonth() - 1)).getTime();
};

export const getCurrentMonthYearShort = () => {
    const tempDate = new Date();
    const date = new Date(tempDate.getFullYear(), tempDate.getMonth())
        .toLocaleString('pt-BR', { month: 'short', year: '2-digit' })
        .toLocaleLowerCase();
    return date.substring(0, 3) + '/' + date.substring(date.length - 2);
};

export const convertTimestampToYearMonthDay = (timestamp) => {
    const year = new Date(timestamp).getFullYear();
    const month = new Date(timestamp)
        .toLocaleString('pt-BR', { month: 'short' })
        .toLocaleUpperCase()
        .split('.')[0];
    const day = Number.parseInt(
        new Date(timestamp).toLocaleString('pt-BR', { day: 'numeric' })
    );
    return { year, month, day };
};

export const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
};
