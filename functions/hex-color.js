const sharp = require('sharp');

function hexColorAllocate(hex) {
    hex = hex.replace('#', '');
    const a = parseInt(hex.substr(0, 2), 16);
    const b = parseInt(hex.substr(2, 2), 16);
    const c = parseInt(hex.substr(4, 2), 16);
    return [a, b, c];
}

function hexColorAllocateAlpha(hex, alpha) {
    hex = hex.replace('#', '');
    const a = parseInt(hex.substr(0, 2), 16);
    const b = parseInt(hex.substr(2, 2), 16);
    const c = parseInt(hex.substr(4, 2), 16);
    return [a, b, c, alpha];
}

// Example usage
const image = sharp({
    create: {
        width: 100,
        height: 100,
        channels: 4, // 4 channels to support alpha
        background: { r: 255, g: 255, b: 255, alpha: 0 } // White background with 0 alpha (transparent)
    }
});

const color = hexColorAllocate('#FF0000'); // Red color
const alphaColor = hexColorAllocateAlpha('#00FF00', 100); // Green color with alpha value 100

// Use the allocated colors for drawing on the image
// For example, drawing a red rectangle and a semi-transparent green circle:
image
    .overlayWith(Buffer.from([color]), { top: 0, left: 0 })
    .overlayWith(Buffer.from([alphaColor]), { top: 30, left: 30 })
    .toFile('output.png', (err) => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log('Image saved as output.png');
        }
    });
