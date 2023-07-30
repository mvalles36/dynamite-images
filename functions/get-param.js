function getParam(req, string, fallback) {
    if (req.query && req.query[string]) {
        return req.query[string];
    } else if (fallback !== undefined) {
        return fallback;
    } else {
        return '';
    }
}

function getParamAsArray(req, string, fallback) {
    if (req.query && req.query[string] && req.query[string] !== "") {
        let param = req.query[string];
        return Array.isArray(param) ? param : [param];
    } else {
        return [fallback];
    }
}
