const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const files = ['index.html','research.html','publications.html','education.html','experience.html','contact.html'];
const forbidden = /operator-ready|hierarchical.{0,20}closure|loopless path closure|reusable path records|\bSCOPE\b|\bParallel-Spatial-RG\b|\bPACE\b|\bSIGSPATIAL\b|\bJournal of Scheduling\b/ig;
let failed = false;
for (const file of files) {
  const text = fs.readFileSync(path.join(root,file),'utf8');
  if (!/<main id="main-content">/.test(text)) { console.error(`${file}: missing main landmark`); failed = true; }
  if (forbidden.test(text)) { console.error(`${file}: confidential or excluded research text found`); failed = true; }
  if (!/Dr\. Kousik Kumar Dutta|Kousik Kumar Dutta/.test(text)) { console.error(`${file}: name missing`); failed = true; }
  if (!/id="side-navigation"/.test(text)) { console.error(`${file}: left navigation missing`); failed = true; }
  if (!/images\/about1\.png/.test(text)) { console.error(`${file}: requested profile portrait missing`); failed = true; }
  if (!/Open to Collaboration/i.test(text)) { console.error(`${file}: collaboration status missing`); failed = true; }
  if (/faculty opportunit/i.test(text)) { console.error(`${file}: outdated faculty-opportunity advertising found`); failed = true; }
  const sideBrand = text.match(/<a class="side-brand"[\s\S]*?<\/a>/)?.[0] || '';
  const footerIdentity = text.match(/<div class="footer-identity">[\s\S]*?<\/div><\/div>/)?.[0] || '';
  if (/<img\b/i.test(sideBrand)) { console.error(`${file}: favicon artwork remains in navigation brand`); failed = true; }
  if (/<img\b/i.test(footerIdentity)) { console.error(`${file}: favicon artwork remains in footer identity`); failed = true; }
  if (file === 'publications.html' && /Record notes|publication-note/i.test(text)) { console.error(`${file}: record notes section should be absent`); failed = true; }
  if (file === 'index.html' && !['bg1.jpg','bg2.jpg','bg3.jpg','bg4.jpg'].every(image => text.includes(`images/${image}`))) { console.error(`${file}: restored background sequence is incomplete`); failed = true; }
  if (file === 'experience.html' && (text.match(/class="teaching-period"/g) || []).length !== 6) { console.error(`${file}: expected six teaching timeline periods`); failed = true; }
}
if (!fs.existsSync(path.join(root, 'docs', 'CV.pdf'))) { console.error('Current CV PDF is missing'); failed = true; }
if (!fs.existsSync(path.join(root, 'docs', 'posters', 'pcmax-geoinformatica-2026.pdf'))) { console.error('PC-Max poster asset is missing'); failed = true; }
for (const icon of ['favicon.ico','favicon-16x16.png','favicon-32x32.png','apple-touch-icon.png']) if (!fs.existsSync(path.join(root, icon))) { console.error(`${icon}: favicon asset missing`); failed = true; }
const pubs = JSON.parse(fs.readFileSync(path.join(root,'data','publications.json'),'utf8'));
if (pubs.length !== 10) { console.error(`Expected 10 records, found ${pubs.length}`); failed = true; }
for (const p of pubs.filter(p=>p.type !== 'Manuscript')) if (!p.summary || p.summary.split(/\s+/).length < 30 || p.summary.split(/\s+/).length > 80) { console.error(`${p.id}: summary length outside 30–80 words`); failed = true; }
if (failed) process.exit(1);
console.log('Static content checks passed.');
