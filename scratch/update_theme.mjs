import fs from 'fs';

let content = fs.readFileSync('./src/app/page.js', 'utf8');

// 1. Outermost container
content = content.replace(
  /className="flex h-screen w-full overflow-hidden text-neutral-400 bg-\[#0a0a0a\]"/g,
  'className="flex h-screen w-full overflow-hidden text-[#191c1d] bg-[#f8f9fa] font-sans"'
);

// 2. Remove all borders per No-Line Rule
// Except for the Inputs which we will handle later, remove generic borders
// First, remove border utility classes
content = content.replace(/\bborder-(r|b|t|l|x|y)\b/g, '');
content = content.replace(/\bborder\b/g, '');
content = content.replace(/\bborder-\[#222\]\b/g, '');
content = content.replace(/\bborder-\[#333\]\b/g, '');
content = content.replace(/\bborder-\[#444\]\b/g, '');
content = content.replace(/\bborder-neutral-800\b/g, '');
content = content.replace(/\bborder-neutral-800\/50\b/g, '');
content = content.replace(/\bborder-neutral-800\/60\b/g, '');
content = content.replace(/\bborder-neutral-200\b/g, '');
content = content.replace(/\bborder-red-600\b/g, '');
content = content.replace(/\bborder-red-600\/50\b/g, '');
content = content.replace(/\bborder-red-500\b/g, '');
content = content.replace(/\bborder-white\b/g, '');
content = content.replace(/\bborder-transparent\b/g, '');
content = content.replace(/\bhover:border-\[#444\]\b/g, '');
content = content.replace(/\bhover:border-neutral-700\b/g, '');
content = content.replace(/\bhover:border-red-600\/50\b/g, '');
content = content.replace(/\bfocus:border-red-500\b/g, '');
content = content.replace(/\bfocus:border-red-600\b/g, '');
content = content.replace(/\bring-1\b/g, '');
content = content.replace(/\bring-red-600\/50\b/g, '');


// 3. Typography & Background
content = content.replace(/bg-\[#0a0a0a\]/g, 'bg-[#f8f9fa]');
content = content.replace(/text-white/g, 'text-[#191c1d]');
// Some specific things:
content = content.replace(/text-neutral-400/g, 'text-[#5a6063]');
content = content.replace(/text-neutral-500/g, 'text-[#5a6063]');
content = content.replace(/text-neutral-600/g, 'text-[#5a6063]');
content = content.replace(/bg-neutral-900/g, 'bg-[#ffffff]');
content = content.replace(/bg-neutral-950/g, 'bg-[#f8f9fa]');
content = content.replace(/bg-black/g, 'bg-[#f8f9fa]');
content = content.replace(/bg-\[#111\]/g, 'bg-[#f3f4f5]');
content = content.replace(/bg-\[#151515\]/g, 'bg-[#ffffff]');
content = content.replace(/bg-\[#161616\]/g, 'bg-[#ffffff]');
content = content.replace(/bg-\[#222\]/g, 'bg-[#e7e8e9]');


// Headings tight tracking
content = content.replace(
  /className="text-3xl md:text-5xl font-black tracking-tighter/g,
  'className="text-3xl md:text-5xl font-black tracking-[-0.02em]'
);

// 4. Sidebars
// Sidebar bg is now #f3f4f5. Earlier I replaced #111 with #f3f4f5.

// 5. Main Content Cards (Cars & Tyres)
// Handled by bg-neutral-900 -> bg-[#ffffff] earlier. Wait, brand cards were:
// bg-neutral-900 -> now bg-[#ffffff]

// 6. Deep Industrial Blue & Active Highlights
// Replace all red accents with Deep Industrial Blue
content = content.replace(/text-red-600/g, 'text-[#00254d]');
content = content.replace(/text-red-500/g, 'text-[#00254d]');
content = content.replace(/bg-red-600/g, 'bg-[#00254d]');
content = content.replace(/bg-red-400/g, 'bg-[#00254d]');
content = content.replace(/bg-red-500/g, 'bg-[#001a33]');
content = content.replace(/hover:bg-red-500/g, 'hover:bg-[#001a33]');
content = content.replace(/from-red-600/g, 'from-[#00254d]');
content = content.replace(/to-red-800/g, 'to-[#001a33]');
content = content.replace(/hover:from-red-500/g, 'hover:from-[#001a33]');
content = content.replace(/hover:to-red-700/g, 'hover:to-[#001a33]');

// Fix contrast on primary buttons
content = content.replace(/bg-\[#00254d\] text-\[#191c1d\]/g, 'bg-[#00254d] text-white'); // some text-white became text-[#191c1d]

// Active sidebar highlight:
// `<a onClick={() => setStep(1)} className={`group flex items-center gap-3 py-3 cursor-pointer transition-all duration-300 active:scale-[0.98] ${step === 1 ? 'text-[#191c1d] border-l-2 border-[#00254d] pl-3 bg-[#ffffff]/40' : 'text-[#5a6063] pl-4 hover:text-[#191c1d] hover:bg-[#ffffff]/30'} pr-4`} href="#">`
// Should be `bg-[#00254d] text-white`
content = content.replace(
  /step === 1 \? 'text-\[#191c1d\]    pl-3 bg-\[#ffffff\]\/40' : 'text-\[#5a6063\] pl-4 hover:text-\[#191c1d\] hover:bg-\[#ffffff\]\/30'/g,
  "step === 1 ? 'bg-[#00254d] text-white pl-4' : 'text-[#5a6063] pl-4 hover:text-[#191c1d] hover:bg-neutral-200'"
);
content = content.replace(
  /step === 2 \? 'text-\[#191c1d\]    pl-3 bg-neutral-800\/40' : 'text-\[#5a6063\] pl-4 hover:text-\[#191c1d\] hover:bg-\[#ffffff\]\/30'/g,
  "step === 2 ? 'bg-[#00254d] text-white pl-4' : 'text-[#5a6063] pl-4 hover:text-[#191c1d] hover:bg-neutral-200'"
);
content = content.replace(
  /step === 3 \? 'text-\[#191c1d\]    pl-3 bg-neutral-800\/40' : 'text-\[#5a6063\] pl-4 hover:text-\[#191c1d\] hover:bg-\[#ffffff\]\/30'/g,
  "step === 3 ? 'bg-[#00254d] text-white pl-4' : 'text-[#5a6063] pl-4 hover:text-[#191c1d] hover:bg-neutral-200'"
);
// Above regexes failed due to multi-replace, I'll do a better replace for sidebar nav items.

// 7. Inputs
// Input Fields/Recessed Areas: Change to bg-[#e7e8e9] with a border-b-2 border-transparent focus:border-[#00254d] (no full borders).
content = content.replace(
  /className="w-full bg-\[#ffffff\]  text-\[#191c1d\] px-4 py-3 rounded-lg outline-none   transition-colors/g,
  'className="w-full bg-[#e7e8e9] border-b-2 border-transparent focus:border-[#00254d] text-[#191c1d] px-4 py-3 rounded-none outline-none transition-colors'
);
content = content.replace(
  /className="w-full bg-\[#ffffff\]  text-\[#191c1d\] px-4 py-3 rounded-lg outline-none   transition-colors uppercase"/g,
  'className="w-full bg-[#e7e8e9] border-b-2 border-transparent focus:border-[#00254d] text-[#191c1d] px-4 py-3 rounded-none outline-none transition-colors uppercase"'
);

// 8. Elevation & Ambient Shadows
// shadow-[0_12px_32px_rgba(25,28,29,0.06)]
content = content.replace(/shadow-\[0_10px_40px_rgba\(0,0,0,0\.3\)\]/g, 'shadow-[0_12px_32px_rgba(25,28,29,0.06)]');
content = content.replace(/shadow-\[-20px_0_40px_rgba\(0,0,0,0\.5\)\]/g, 'shadow-[-20px_0_40px_rgba(25,28,29,0.06)]');
content = content.replace(/shadow-\[0_0_20px_rgba\(220,38,38,0\.2\)\]/g, 'shadow-[0_12px_32px_rgba(25,28,29,0.06)]');
content = content.replace(/shadow-\[0_0_30px_rgba\(220,38,38,0\.3\)\]/g, 'shadow-[0_12px_32px_rgba(25,28,29,0.06)]');
content = content.replace(/shadow-\[0_0_30px_rgba\(220,38,38,0\.1\)\]/g, 'shadow-[0_12px_32px_rgba(25,28,29,0.06)]');
content = content.replace(/shadow-2xl/g, 'shadow-[0_12px_32px_rgba(25,28,29,0.06)]');

// Glassmorphism: bg-[#f8f9fa]/80 backdrop-blur-[12px]
content = content.replace(/bg-white text-\[#191c1d\] shadow-\[0_12px_32px_rgba\(25,28,29,0\.06\)\]/g, 'bg-[#f8f9fa]/80 backdrop-blur-[12px] text-[#191c1d] shadow-[0_12px_32px_rgba(25,28,29,0.06)]');
content = content.replace(/bg-\[#f8f9fa\]\/80 backdrop-blur-md/g, 'bg-[#f8f9fa]/80 backdrop-blur-[12px]');

// 9. Sharp machined corners
content = content.replace(/rounded-xl/g, 'rounded-md');
content = content.replace(/rounded-2xl/g, 'rounded-md');
content = content.replace(/rounded-lg/g, 'rounded-sm');

// 10. Spec Badges: bg-[#ffedea] text-[#902a1d] font-bold uppercase tracking-wider rounded-sm
content = content.replace(
  /const getWarrantyColor = \(warrantyString\) => \{[\s\S]*?return 'bg-cyan-100\/90 text-cyan-800';\r?\n  \};/m,
  `const getWarrantyColor = (warrantyString) => {
    return 'bg-[#ffedea] text-[#902a1d]';
  };`
);
content = content.replace(
  /const getBestForColor = \(bestForString\) => \{[\s\S]*?return 'bg-\[#ffffff\]-200 text-\[#5a6063\]-800';\r?\n  \};/m,
  `const getBestForColor = (bestForString) => {
    return 'bg-[#ffedea] text-[#902a1d]';
  };`
);


// Write back
fs.writeFileSync('./src/app/page.js', content);
console.log('Done');
