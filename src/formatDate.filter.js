import twoDigits from './twoDigits';

export default function formatDate(dateStr) {
    const d = new Date(`${dateStr} 00:00:00`);
    const month = twoDigits(d.getMonth() + 1);
    const day = twoDigits(d.getDate());
    return `${month}-${day}-${d.getFullYear()}`;
}