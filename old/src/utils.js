const isObject = value => typeof value === 'object' && value !== null; // broadly defined in JS; could also be Array, DOM object, etc...
function clone(obj, deep = false) {
    let copy = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        let value = obj[key];
        if (deep && (Array.isArray(value) || isObject(value))) {
            copy[key] = clone(value, deep);
        } else {
            copy[key] = value;
        }
    }
    return copy;
}

const twoDigits = number => String(number).padStart(2, '0');

export {clone, twoDigits};