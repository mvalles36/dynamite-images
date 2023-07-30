const { createCanvas, loadImage, registerFont } = require('canvas');

// Make sure to register the font if you are using a custom font
// registerFont('path/to/font.ttf', { family: 'FontFamilyName' });

async function writeTextGroup(canvas, imageWidth, imageHeight, params) {
    const ctx = canvas.getContext('2d');

    // Path to our ttf font file
    const fontFile = `./fonts/${params['font-family']}.ttf`;
    const color = hexColorAllocate(ctx, params['color']);
    let isRtl = false; // is this a right to left language? Default = false.

    if (params['text-transform'] === "uppercase") {
        params['text'] = params['text'].toUpperCase();
    } else if (params['text-transform'] === "capitalize") {
        params['text'] = params['text'].replace(/(^|\s)([a-z])/g, (_, space, letter) => space + letter.toUpperCase());
    }

    if (params['vertical-align'] === "middle") {
        params['top'] = centerVert(ctx, params['font-size'], fontFile, params['text'], imageHeight, params['top']);
    }
    if (params['vertical-align'] === "bottom") {
        params['top'] = bottomalignText(ctx, params['font-size'], fontFile, params['text'], imageHeight, params['top']);
    }

    // Sort out any Arabic Character glyph issues
    // These fonts get special handling to ensure their glyphs are rendered correctly.
    const arabicFonts = ["DroidKufi-Bold.ttf", "DroidKuf-Regular.ttf", "terafik.ttf"];

    if (arabicFonts.includes(require('path').basename(fontFile))) {
        const { Arabic } = require('arabic-shaping');
        params['text'] = Arabic.shaping(params['text']);
        isRtl = true;
    }

    /* Write the text */
    if (params['white-space'] === "normal") {
        const words = params['text'].split(' ');
        const mlength = params['max-width'] > 0 ? params['max-width'] :
            Math.abs(params['text-align'] === "right" ? imageWidth - params['right'] : imageWidth - params['left']);
        let topset = 0;
        let line = '';

        for (const word of words) {
            const sizeWithWord = imagettfbboxWithTracking(ctx, params['font-size'], params['angle'], fontFile, line === "" ? word : `${line} ${word}`, params['letter-spacing']);
            if ((sizeWithWord[2] - sizeWithWord[0] > mlength)) {
                let tmpleft;
                if (params['text-align'] === "center") {
                    tmpleft = centerText(ctx, params['font-size'], fontFile, line, imageWidth, params['left'], params['letter-spacing']);
                } else if (params['text-align'] === "right") {
                    tmpleft = rightalignText(ctx, params['font-size'], fontFile, line, imageWidth, params['left'], params['letter-spacing']);
                } else {
                    tmpleft = params['left'];
                }
                writeTextLine(ctx, params['font-size'], params['angle'], tmpleft, params['top'] + topset, color, fontFile, line, params['text-shadow'], params['outline'], params['letter-spacing']);
                line = word;
                topset += params['line-height'] * params['font-size'];
            } else {
                line = line === "" ? word : `${line} ${word}`;
            }
        }
        let tmpleft;
        if (params['text-align'] === "center") {
            tmpleft = centerText(ctx, params['font-size'], fontFile, line, imageWidth, params['left'], params['letter-spacing']);
        } else if (params['text-align'] === "right") {
            tmpleft = rightalignText(ctx, params['font-size'], fontFile, line, imageWidth, params['left'], params['letter-spacing']);
        } else {
            tmpleft = params['left'];
        }

        writeTextLine(ctx, params['font-size'], params['angle'], tmpleft, params['top'] + topset, color, fontFile, line, params['text-shadow'], params['outline'], params['letter-spacing']); // remaining lines
    } else {
        let tmpleft;
        if (params['text-align'] === "center") {
            tmpleft = centerText(ctx, params['font-size'], fontFile, params['text'], imageWidth, params['left'], params['letter-spacing']);
        }
        if (params['text-align'] === "right") {
            tmpleft = rightalignText(ctx, params['font-size'], fontFile, params['text'], imageWidth, params['left'], params['letter-spacing']);
        }

        writeTextLine(ctx, params['font-size'], params['angle'], tmpleft, params['top'], color, fontFile, params['text'], params['text-shadow'], params['outline'], params['letter-spacing']);
    }
}

// The supporting functions (assuming they are similar to the PHP counterparts)
// You can refer to the previous responses for their implementations.
function hexColorAllocate(ctx, hex) { /* ... */ }
function centerText(ctx, fontSize, fontFile, text, iWidth, left, tracking) { /* ... */ }
function rightalignText(ctx, fontSize, fontFile, text, iWidth, right, tracking) { /* ... */ }
function centerVert(ctx, fontSize, fontFile, text, iHeight, top) { /* ... */ }
function bottomalignText(ctx, fontSize, fontFile, text, iHeight, top) { /* ... */ }
function writeTextLine(ctx, fontSize, angle, left, top, color, fontFile, text, textShadow, outline, letterSpacing) { /* ... */ }
function imagettfbboxWithTracking(ctx, fontSize, angle, fontFile, text, tracking) { /* ... */ }

// Example usage
(async () => {
    const canvas = createCanvas(500, 300);
    const imageWidth = canvas.width;
    const imageHeight = canvas.height;
    const params = {
        'font-family': 'FontFamilyName',
        'color': '#FF0000',
        'text-transform': 'uppercase',
        'vertical-align': 'middle',
        'font-size': 24,
        'left': 100,
        'top': 100,
        'text': 'Hello, World!',
        'letter-spacing': 2,
        'white-space': 'normal',
        'max-width': 400,
        'text-align': 'center',
        'line-height': 1.2,
        'angle': 0,
        'text-shadow': false,
        'outline': false,
    };

    await writeTextGroup(canvas, imageWidth, imageHeight, params);

    // Save the canvas to an image file or do whatever you want with it
    const fs = require('fs');
    const out = fs.createWriteStream('output.png');
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('Image saved as output.png'));
})();
