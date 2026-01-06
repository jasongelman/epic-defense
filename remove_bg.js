import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const JimpLib = require('jimp');

// Debugging what we got
console.log('Jimp export:', JimpLib);

// Based on previous debug output, the class is at .Jimp
const Jimp = JimpLib.Jimp;

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, 'public/assets');

fs.readdir(assetsDir, (err, files) => {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    files.forEach((file, index) => {
        if (file !== 'Naruto Tower sprite sheet.png') return;

        const filePath = path.join(assetsDir, file);

        Jimp.read(filePath)
            .then(image => {
                image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
                    const r = this.bitmap.data[idx + 0];
                    const g = this.bitmap.data[idx + 1];
                    const b = this.bitmap.data[idx + 2];

                    if (r > 200 && g > 200 && b > 200) {
                        this.bitmap.data[idx + 3] = 0;
                    }
                });
                return new Promise((resolve, reject) => {
                    image.write(filePath, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            })
            .then(() => {
                console.log(`Processed ${file}`);
            })
            .catch(err => {
                console.error(`Error processing ${file}:`, err);
            });
    });
});
