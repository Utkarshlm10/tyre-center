const fs = require('fs');
let content = fs.readFileSync('./src/app/page.js', 'utf8');

// Replace \` with `
content = content.replace(/\\`/g, '`');

// Replace \$ with $
content = content.replace(/\\\$/g, '$');

fs.writeFileSync('./src/app/page.js', content, 'utf8');
console.log('Fixed escaped chars in page.js');
