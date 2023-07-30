const { createCanvas, loadImage, registerFont } = require('canvas');

// Make sure to register the font if you are using a custom font
// registerFont('path/to/font.ttf', { family: 'FontFamilyName' });

function centerText(ctx, fontSize, fontFile, text, iWidth, left, tracking) {
    ctx.font = `${fontSize}px ${fontFile}`;
    if (tracking !== undefined) {
        ctx.tracking = tracking;
    }
    const textWidth = ctx.measureText(text).width + (ctx.tracking || 0);
    if (left === undefined) {
        left = 0;
    }
    return Math.abs(iWidth / 2) - textWidth / 2 + left;
}

function rightalignText(ctx, fontSize, fontFile, text, iWidth, right, tracking) {
    ctx.font = `${fontSize}px ${fontFile}`;
    if (tracking !== undefined) {
        ctx.tracking = tracking;
    }
    const textWidth = ctx.measureText(text).width + (ctx.tracking || 0);
    return iWidth - textWidth - (right || 0);
}

function centerVert(ctx, fontSize, fontFile, text, iHeight, top) {
    ctx.font = `${fontSize}px ${fontFile}`;
    const textMetrics = ctx.measureText(text);
    const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    if (top === undefined) {
        top = 0;
    }
    return Math.abs(iHeight / 2) - textHeight / 2 + top;
}

function bottomalignText(ctx, fontSize, fontFile, text, iHeight, top) {
    ctx.font = `${fontSize}px ${fontFile}`;
    const textMetrics = ctx.measureText(text);
    const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    return iHeight - textHeight - (top || 0);
}

// Example usage
const canvas = createCanvas(200, 100);
const ctx = canvas.getContext('2d');

// Assuming you have a font file registered if using a custom font
const fontFile = 'FontFamilyName';
const fontSize = 20;
const text = 'Hello, World!';
const iWidth = canvas.width;
const iHeight = canvas.height;

// Center text horizontally and vertically
const centerX = centerText(ctx, fontSize, fontFile, text, iWidth);
const centerY = centerVert(ctx, fontSize, fontFile, text, iHeight);

ctx.fillText(text, centerX, centerY);

// Save the canvas to an image file or do whatever you want with it
const fs = require('fs');
const out = fs.createWriteStream('output.png');
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => console.log('Image saved as output.png'));
