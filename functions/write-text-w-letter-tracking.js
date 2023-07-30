const { createCanvas, loadImage, registerFont } = require('canvas');

// Make sure to register the font if you are using a custom font
// registerFont('path/to/font.ttf', { family: 'FontFamilyName' });

function imagettftextWithTracking(ctx, fontSize, angle, x, y, color, fontFile, text, tracking) {
    if (!tracking) {
        return ctx.fillText(text, x, y);
    } else {
        let pos = 0;
        let lastCharacterWidth = 0;
        let lastCharacter = null;
        let trackingTmp = 0;

        for (let i = 0; i < text.length; i++) {
            const character = text.charAt(i);

            // Width of this character
            const charMetrics = ctx.measureText(character);
            const charWidth = charMetrics.width;

            // Width of this character and the last character together
            const twoCharMetrics = ctx.measureText(lastCharacter + character);
            const twoCharWidth = twoCharMetrics.width;

            // Space between characters as a percentage of their total width
            trackingTmp = (lastCharacter !== null) ? tracking - (twoCharWidth - lastCharacterWidth - charWidth) : 0;

            ctx.fillText(character, x + pos + trackingTmp, y);

            pos += charWidth + trackingTmp;
            lastCharacter = character;
            lastCharacterWidth = charWidth;
        }
    }
}

function imagettfbboxWithTracking(ctx, fontSize, angle, fontFile, text, tracking) {
    if (!tracking) {
        return ctx.measureText(text).width;
    } else {
        let pos = 0;
        for (let i = 0; i < text.length; i++) {
            const character = text.charAt(i);
            const charMetrics = ctx.measureText(character);
            pos += charMetrics.width;
        }
        return pos - tracking * (text.length - 1); // Last space shouldn't count
    }
}

// Example usage
(async () => {
    const canvas = createCanvas(500, 300);
    const ctx = canvas.getContext('2d');

    // Assuming you have a font file registered if using a custom font
    const fontFile = 'FontFamilyName';
    const fontSize = 24;
    const angle = 0;
    const x = 100;
    const y = 100;
    const color = 'red'; // Color string or RGBA value

    // Example text and tracking value
    const text = 'Hello, World!';
    const tracking = 2;

    // Set the font size and color
    ctx.font = `${fontSize}px ${fontFile}`;
    ctx.fillStyle = color;

    // Call the function
    imagettftextWithTracking(ctx, fontSize, angle, x, y, color, fontFile, text, tracking);

    // Save the canvas to an image file or do whatever you want with it
    const fs = require('fs');
    const out = fs.createWriteStream('output.png');
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('Image saved as output.png'));
})();
