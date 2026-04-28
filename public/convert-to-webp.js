const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Target directories to process
const directories = [
    path.join(__dirname, 'hero'),
    path.join(__dirname, 'logos'),
    path.join(__dirname, 'tyre-brands'),
    __dirname // Also process images in the public root
];

directories.forEach(directoryPath => {
    if (!fs.existsSync(directoryPath)) {
        console.warn(`⚠️ Directory does not exist: ${directoryPath}`);
        return;
    }

    console.log(`\n📂 Processing directory: ${directoryPath}`);

    // Read all files in the directory
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return console.error('Unable to scan directory: ' + err);
        }

        files.forEach((file) => {
            // Only process .jpg, .jpeg, and .png files
            if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.png')) {
                const inputPath = path.join(directoryPath, file);

                // Remove the old extension and add .webp
                const fileNameWithoutExt = path.parse(file).name;
                const outputPath = path.join(directoryPath, `${fileNameWithoutExt}.webp`);

                // Compress and convert to WebP using sharp
                sharp(inputPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath)
                    .then(() => {
                        console.log(`✅ Converted: ${file} -> ${fileNameWithoutExt}.webp`);
                    })
                    .catch((err) => {
                        console.error(`❌ Error converting ${file}:`, err);
                    });
            }
        });
    });
});