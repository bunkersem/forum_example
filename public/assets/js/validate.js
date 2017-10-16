function validator(result, msg) {
    return { result: result, msg: msg };
}
validator.equals = function equals(a, b) {
    return a === b;
};
validator.isNumber = function isNumber(a) {
    return typeof a === 'number';
};
validator.isString = function isString(a) {
    return typeof a === 'string';
};
validator.exists = function exists(a) {
    return a !== undefined && a !== null;
};

function checkValid(args) {
    var result = Array.prototype.slice.call(arguments, 0)
        .filter(i => i.result !== true)
        .map(i => i.msg)
        .join('\n');
    if (result.length === 0)
        return true;
    else 
        return result;
}