function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function average(elements) {
    return elements.reduce(function(sum, a) { return sum + a },0)/(elements.length||1);
}

function propToArr(obj) {
    return Object.keys(obj).map(k => {
        obj[k]._key = k;
        return obj[k];
    })
}