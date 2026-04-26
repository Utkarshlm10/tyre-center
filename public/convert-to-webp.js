const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Target your specific directory
// Since this script is in the 'public' folder, we just point to the 'cars' subfolder
const directoryPath = path.join(__dirname, 'cars');

console.log(`Scanning directory: ${directoryPath}`);

// Read all files in the directory
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.error('Unable to scan directory: ' + err);
  }

  files.forEach((file) => {
    // Only process .jpg and .jpeg files
    if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')) {
      const inputPath = path.join(directoryPath, file);
      
      // Remove the old extension and add .webp
      const fileNameWithoutExt = path.parse(file).name;
      const outputPath = path.join(directoryPath, `${fileNameWithoutExt}.webp`);

      // Compress and convert to WebP using sharp
      // A quality of 80 is the sweet spot for web (drastic size reduction, visually identical)
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
