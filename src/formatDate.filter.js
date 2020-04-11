import twoDigits from './twoDigits';

export default function formatDate(milliseconds) {
    const d = new Date(milliseconds);
    const month = twoDigits(d.getMonth() + 1);
    const day = twoDigits(d.getDate());
    return `${month}-${day}-${d.getFullYear()}`;
}