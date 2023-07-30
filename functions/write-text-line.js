const { createCanvas, loadImage, registerFont } = require('canvas');

// Make sure to register the font if you are using a custom font
// registerFont('path/to/font.ttf', { family: 'FontFamilyName' });

function writeTextLine(ctx, fontSize, angle, left, top, color, fontFile, text, textShadow, textOutline, tracking) {
    if (textShadow) {
        const tsArray = textShadow.split(' '); // left top color alphaopacity
        imagettftextWithTracking(ctx, fontSize, angle, left + parseFloat(tsArray[0]), top + parseFloat(tsArray[1]), hexColorAllocateAlpha(ctx, tsArray[2], tsArray[3]), fontFile, text, tracking);
    }

    if (textOutline) {
        const otArray = textOutline.split(' '); // spread color alpha
        const spread = parseFloat(otArray[0]);
        const colorWithAlpha = hexColorAllocateAlpha(ctx, otArray[1], otArray[2]);
        for (let c1 = left - Math.abs(spread); c1 <= left + Math.abs(spread); c1++) {
            for (let c2 = top - Math.abs(spread); c2 <= top + Math.abs(spread); c2++) {
                imagettftextWithTracking(ctx, fontSize, angle, c1, c2, colorWithAlpha, fontFile, text, tracking);
            }
        }
    }

    imagettftextWithTracking(ctx, fontSize, angle, left, top, color, fontFile, text, tracking);
}

// The supporting functions (assuming they are similar to the PHP counterparts)
// You can refer to the previous responses for their implementations.
function hexColorAllocateAlpha(ctx, hex, alpha) { /* ... */ }
function imagettftextWithTracking(ctx, fontSize, angle, left, top, color, fontFile, text, tracking) { /* ... */ }

// Example usage
(async () => {
    const canvas = createCanvas(500, 300);
    const ctx = canvas.getContext('2d');

    // Assuming you have a font file registered if using a custom font
    const fontFile = 'FontFamilyName';
    const fontSize = 24;
    const angle = 0;
    const left = 100;
    const top = 100;
    const color = [255, 0, 0]; // Red color

    // Example text shadow and outline strings
    const textShadow = '2px 2px #000 0.5';
    const textOutline = '3 #000 0.7';

    const text = 'Hello, World!';
    const tracking = 2;

    // Call the function
    writeTextLine(ctx, fontSize, angle, left, top, color, fontFile, text, textShadow, textOutline, tracking);

    // Save the canvas to an image file or do whatever you want with it
    const fs = require('fs');
    const out = fs.createWriteStream('output.png');
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('Image saved as output.png'));
})();
