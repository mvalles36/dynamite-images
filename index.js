const { createCanvas, loadImage, registerFont } = require('canvas');
const http = require('http');
const url = require('url');
const I18N_Arabic = require('i18n-arabic');

// Make sure to register the font if you are using a custom font
// registerFont('path/to/font.ttf', { family: 'FontFamilyName' });

function getParam(query, paramName, defaultValue = null) {
    const params = new url.URLSearchParams(query);
    return params.get(paramName) || defaultValue;
}

function getParamAsArray(query, paramName, defaultValue) {
    const param = getParam(query, paramName);
    return param ? param.split(',') : defaultValue;
}

function hexColorAllocateAlpha(image, hex, alpha) {
    // Implement hexColorAllocateAlpha here (similar to the PHP function)
    // ...
    return color;
}

// Define other functions like imagettftextWithTracking, imagettfbboxWithTracking, etc. (as shown earlier)

const server = http.createServer((req, res) => {
    // Get query parameters from the request URL
    const query = url.parse(req.url).query;

    // Set basic parameters and defaults
    const local = getParam(query, 'local', false);
    const debug = getParam(query, 'debug', false);
    const pngcomp = parseInt(getParam(query, 'pngcomp', 5));
    const jpgquality = parseInt(getParam(query, 'jpgquality', 100));

    // Determine the image type
    const urlParts = url.parse(req.url).pathname.split('.');
    const imageType = urlParts[urlParts.length - 1].toLowerCase();

    // Get the source image path
    const appHost = req.headers.host.split('~').pop() + '.appspot.com';
    const sourceimg = local ? './img' + urlParts.join('.') : 'gs://' + appHost + urlParts.join('.');

    // Define the defaults object
    const defaults = {
        text: '',
        'text-align': null,
        'vertical-align': null,
        color: '#000000',
        'font-size': 24,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        'letter-spacing': null,
        'text-transform': null,
        'font-family': 'OpenSans-Regular',
        'line-height': 1.5,
        angle: 0,
        'white-space': 'nowrap',
        'max-width': 'none',
        'text-shadow': null,
        outline: null,
    };

    // Get parameters and process textGroups
    const params = {};
    for (const key in defaults) {
        params[key] = getParamAsArray(query, key, defaults[key]);
    }
    const textStrings = params.text.length - 1;
    const textGroups = [];

    // Create canvas and context
    const canvas = createCanvas(500, 300);
    const ctx = canvas.getContext('2d');

    if (imageType === 'png') {
        res.setHeader('Content-Type', 'image/png');
        const image = loadImage(sourceimg);
        image.onload = () => {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            // Continue with the rest of the image processing (writing text, etc.)
            // ...
            res.end(canvas.toBuffer());
        };
    } else {
        res.setHeader('Content-Type', 'image/jpeg');
        const image = loadImage(sourceimg);
        image.onload = () => {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            // Continue with the rest of the image processing (writing text, etc.)
            // ...
            res.end(canvas.toBuffer());
        };
    }
});

const port = 8080; // Set the desired port number
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
