const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const site = JSON.parse(fs.readFileSync(path.join(root, 'data', 'site.json'), 'utf8'));
const publications = JSON.parse(fs.readFileSync(path.join(root, 'data', 'publications.json'), 'utf8'));

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const external = url => /^https?:\/\//.test(url) ? ' target="_blank" rel="noopener noreferrer"' : '';

const iconPaths = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-5.5h5V20"/>',
  publications: '<path d="M6 3.5h9l3 3V20.5H6z"/><path d="M15 3.5v4h4"/><path d="M9 11h6M9 14.5h6M9 18h4"/>',
  research: '<circle cx="6" cy="7" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="m8.4 6.8 7.1-.6M7.4 9.1l3.3 6.7M16.8 8.1l-3.5 7.7"/>',
  network: '<circle cx="6" cy="7" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="m8.4 6.8 7.1-.6M7.4 9.1l3.3 6.7M16.8 8.1l-3.5 7.7"/>',
  service: '<path d="M5 4h14v16H5z"/><path d="M8 2v4M16 2v4M8.5 10h7M8.5 14h7M8.5 18h4"/>',
  education: '<path d="m3 9 9-5 9 5-9 5z"/><path d="M7 12v4.5c2.8 2 7.2 2 10 0V12M21 9v6"/>',
  contact: '<path d="M4 5h16v14H4z"/><path d="m4 7 8 6 8-6"/>',
  academic: '<path d="m3 9 9-5 9 5-9 5z"/><path d="M7 12v4.5c2.8 2 7.2 2 10 0V12M21 9v6"/>',
  database: '<ellipse cx="12" cy="5.5" rx="7" ry="3"/><path d="M5 5.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/><path d="M5 11.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  id: '<rect x="4" y="4.5" width="16" height="15" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M6.5 16c.7-1.7 4.3-1.7 5 0M14 9h3.5M14 13h3.5M14 16h2"/>',
  search: '<circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 4.5 4.5"/>',
  code: '<path d="m9 7-5 5 5 5M15 7l5 5-5 5"/>',
  link: '<path d="M9.5 14.5 8 16a4 4 0 0 1-5.7-5.7l2.3-2.3a4 4 0 0 1 5.7 0"/><path d="m14.5 9.5 1.5-1.5a4 4 0 0 1 5.7 5.7l-2.3 2.3a4 4 0 0 1-5.7 0"/><path d="m8.5 15.5 7-7"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  document: '<path d="M6 3.5h9l3 3V20.5H6z"/><path d="M15 3.5v4h4M9 12h6M9 15.5h6M9 19h4"/>',
  play: '<circle cx="12" cy="12" r="8.5"/><path d="m10 8.5 5.5 3.5-5.5 3.5z"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8z"/>',
  location: '<path d="M19 10c0 4.5-7 10-7 10s-7-5.5-7-10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.3"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="1.5"/><path d="m4.5 7 7.5 6 7.5-6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  collapse: '<path d="m14.5 6-6 6 6 6"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>'
};

// Platform marks use their recognizable silhouettes while inheriting the site theme color.
const brandIconPaths = {
  googleScholar: '<path d="M5.242 13.769 0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>',
  dblp: '<path d="M3.075.002c-.096.013-.154.092-.094.31L4.97 7.73 3.1 8.6s-.56.26-.4.85l2.45 9.159s.16.59.72.33l6.169-2.869 1.3-.61s.52-.24.42-.79l-.01-.06-1.13-4.22-.658-2.45-.672-2.49v-.04s-.16-.59-.84-1L3.5.141s-.265-.16-.425-.139zM18.324 5.03a.724.724 0 0 0-.193.06l-5.602 2.6.862 3.2 1.09 4.08.01.06c.05.47-.411.79-.411.79l-1.88.87.5 1.89.04.1c.07.17.28.6.81.91l6.95 4.269s.68.41.52-.17l-1.981-7.4 1.861-.86s.56-.26.4-.85L18.85 5.42s-.116-.452-.526-.39z"/>',
  orcid: '<path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z"/>',
  scopus: '<path d="M24 19.059l-.14-1.777c-1.426.772-2.945 1.076-4.465 1.076-3.319 0-5.96-2.782-5.96-6.475 0-3.903 2.595-6.31 5.633-6.31 1.917 0 3.39.303 4.792 1.075L24 4.895c-1.286-.608-2.337-.889-4.698-.889-4.534 0-7.97 3.53-7.97 8.017 0 5.12 4.09 7.924 7.9 7.924 1.916 0 3.506-.257 4.768-.888zm-14.954-3.46c0-2.22-1.964-3.225-3.857-4.347C3.716 10.364 2.15 9.756 2.15 8.12c0-1.215.889-2.548 2.642-2.548 1.519 0 2.57.234 3.903 1.029l.117-1.847c-1.239-.514-2.127-.748-4.137-.748C1.8 4.006.047 5.876.047 8.26c0 2.384 2.103 3.413 4.02 4.581 1.426.865 2.922 1.45 2.922 2.992 0 1.496-1.333 2.571-2.922 2.571-1.566 0-2.594-.35-3.786-1.075L0 19.176c1.215.56 2.454.818 4.16.818 2.385 0 4.885-1.473 4.885-4.395z"/>',
  github: '<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
  linkedin: '<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.44-2.14 2.94v5.67H9.34V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.48v6.27zM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.1 20.45H3.54V8.99H7.1v11.46zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.22 0z"/>'
};

function icon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${iconPaths[name]}</svg>`;
}

function brandIcon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">${brandIconPaths[name]}</svg>`;
}

function footerHeading(label, iconName) {
  return `<h2><span class="footer-heading-icon">${icon(iconName)}</span><span>${label}</span></h2>`;
}

function profileIcon(label) {
  return ({'Google Scholar':'googleScholar', DBLP:'dblp', ORCID:'orcid', Scopus:'scopus', GitHub:'github', LinkedIn:'linkedin'})[label] || 'googleScholar';
}

function profileLink(profile, iconClass='profile-link-icon') {
  return `<a href="${profile.url}"${external(profile.url)}><span class="${iconClass}">${brandIcon(profileIcon(profile.label))}</span><span>${esc(profile.label)}</span></a>`;
}

function nav(active) {
  const items = [
    ['index.html','Home','home'],
    ['publications.html','Publications','publications'],
    ['research.html','Research','research'],
    ['experience.html','Academic service','service'],
    ['education.html','Education','education'],
    ['contact.html','Contact','contact']
  ];
  return `<a class="skip-link" href="#main-content">Skip to content</a>
    <button class="mobile-nav-toggle" id="mobile-nav-toggle" type="button" aria-expanded="false" aria-controls="side-navigation" aria-label="Open navigation">${icon('menu')}<span>Menu</span></button>
    <aside class="side-navigation" id="side-navigation" aria-label="Site navigation"><div class="side-panel">
      <a class="side-brand" href="index.html" aria-label="${esc(site.name)} home"><span><strong>${esc(site.shortName)}</strong><small>Navigation systems &amp; graph data</small></span></a>
      <button class="sidebar-toggle" id="sidebar-toggle" type="button" aria-expanded="true" aria-controls="side-navigation" aria-label="Collapse navigation"><span class="sidebar-portrait"><img src="images/about1.png" alt="" width="1122" height="1045"></span><span class="sidebar-identity"><strong>${esc(site.shortName)}</strong><small>Researcher · collaborator</small></span><span class="sidebar-chevron">${icon('collapse')}</span></button>
      <nav class="side-links" aria-label="Primary navigation">${items.map(([href,label,iconName]) => `<a href="${href}" data-label="${esc(label)}"${active === href ? ' class="active" aria-current="page"' : ''}><span class="side-icon">${icon(iconName)}</span><span class="side-label">${esc(label)}</span></a>`).join('')}</nav>
      <div class="side-collaboration"><span class="status-dot" aria-hidden="true"></span><span>Open to collaboration</span></div><p class="side-shortcut"><kbd>Alt</kbd> + <kbd>S</kbd> toggles navigation</p>
    </div></aside><button class="sidebar-scrim" id="sidebar-scrim" type="button" aria-label="Close navigation" tabindex="-1"></button>`;
}

function footer() {
  const links = [['index.html','Home'],['publications.html','Publications'],['research.html','Research'],['experience.html','Academic service'],['education.html','Education'],['contact.html','Contact']];
  return `<footer class="site-footer" data-reveal><div class="footer-grid"><section class="footer-profile" aria-labelledby="footer-name"><div class="footer-identity"><div><h2 id="footer-name">${esc(site.name)}</h2><p>${esc(site.subtitle)}</p></div></div><p>Graph algorithms, spatial and network data management, route planning, and scalable query processing.</p><a class="footer-cv" href="docs/CV.pdf"><span class="footer-link-icon">${icon('document')}</span><span>Download curriculum vitae</span><span class="footer-link-arrow">${icon('arrow')}</span></a></section><nav class="footer-column" aria-label="Footer navigation">${footerHeading('Navigate','compass')}${links.map(([href,label])=>`<a href="${href}">${esc(label)}</a>`).join('')}</nav><nav class="footer-column" aria-label="Academic profiles">${footerHeading('Academic profiles','research')}${site.profiles.map(p=>profileLink(p,'footer-link-icon')).join('')}</nav><section class="footer-column footer-contact">${footerHeading('Contact','mail') }<a href="mailto:${esc(site.email)}"><span class="footer-link-icon">${icon('mail')}</span><span>${esc(site.email)}</span></a>${site.institutionalEmail ? `<a href="mailto:${esc(site.institutionalEmail)}">${esc(site.institutionalEmail)}</a>` : ''}<p><span class="footer-link-icon">${icon('location')}</span><span>${esc(site.location)}</span></p><a href="contact.html">Full contact details <span class="footer-link-arrow">${icon('arrow')}</span></a></section></div><div class="footer-bottom"><p>© 2026 ${esc(site.name)} · Academic profile</p><p>Last updated October 2026</p></div></footer>`;
}

function ambientScene(kind) {
  const paths = {
    home: ['M-80 640 C180 420 360 760 650 490 S1090 150 1520 420','M80 190 C370 80 550 370 820 220 S1190 100 1510 250'],
    publications: ['M80 160 H420 V330 H760 V190 H1110 V430 H1500','M-40 610 H300 V510 H610 V690 H980 V490 H1290 V620 H1510'],
    research: ['M40 630 260 250 520 520 780 170 1050 510 1410 210','M120 130 360 390 690 290 930 620 1230 350 1510 520'],
    service: ['M260 -40 V210 C260 360 520 340 520 510 V920','M940 -40 V180 C940 340 1180 330 1180 500 V920'],
    education: ['M750 880 V610 L430 370 M750 610 1060 340 M430 370 210 170 M430 370 630 130 M1060 340 910 120 M1060 340 1340 180','M70 720 H1430'],
    contact: ['M-100 700 C270 210 520 220 750 450 C980 680 1230 690 1600 190','M-100 210 C260 690 510 680 750 450 C990 220 1240 210 1600 700']
  };
  const chosen = paths[kind] || paths.home;
  return `<div class="ambient-scene ambient-${kind}" aria-hidden="true"><span class="ambient-orb orb-one"></span><span class="ambient-orb orb-two"></span><svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"><defs><pattern id="map-grid-${kind}" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M56 0H0V56" class="ambient-grid-line"/></pattern></defs><rect width="100%" height="100%" fill="url(#map-grid-${kind})"/><path class="ambient-route route-one" d="${chosen[0]}"/><path class="ambient-route route-two" d="${chosen[1]}"/><g class="ambient-nodes"><circle cx="210" cy="210" r="8"/><circle cx="520" cy="520" r="7"/><circle cx="750" cy="450" r="10"/><circle cx="1060" cy="340" r="7"/><circle cx="1260" cy="610" r="8"/></g></svg></div>`;
}

function head(title, description, file, jsonLd = false) {
  const canonical = `https://kousik-kr.github.io/${file === 'index.html' ? '' : file}`;
  const person = jsonLd ? `<script type="application/ld+json">${JSON.stringify({ '@context':'https://schema.org', '@type':'Person', name:site.name, jobTitle:'Computer Science Researcher', url:'https://kousik-kr.github.io/', email:`mailto:${site.email}`, sameAs:site.profiles.map(p=>p.url), affiliation:{'@type':'Organization',name:'Indian Institute of Technology Ropar'} })}</script>` : '';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}"><meta name="theme-color" content="#10233c"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://kousik-kr.github.io/images/about1.png"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="https://kousik-kr.github.io/images/about1.png"><link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png"><link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="manifest" href="site.webmanifest"><link rel="stylesheet" href="style.css"><script>document.documentElement.classList.add('js')</script>${person}</head>`;
}

function page({file, title, description, active, content, jsonLd=false, bodyClass='', scene=''}) {
  const pageKey = ({'index.html':'home','experience.html':'service'}[file] || file.replace('.html',''));
  const resolvedClass = bodyClass || `${pageKey}-page`;
  const resolvedScene = scene || pageKey;
  const cleanedContent = content.replace(/<section class="section publication-note">[\s\S]*?<\/section>/, '');
  const animatedContent = cleanedContent.replace(/<section\b/g, '<section data-reveal');
  return `${head(title, description, file, jsonLd)}<body class="${resolvedClass}">${nav(active)}${ambientScene(resolvedScene)}<div class="site-frame"><main id="main-content">${animatedContent}</main>${footer()}</div><script src="script-modern.js" defer></script></body></html>`;
}

const buttonIcon = label => ({'Download CV':'document','Research interests':'research','Contact':'mail','Email me':'mail'})[label] || 'arrow';
const button = (href, label, primary=false) => `<a class="button ${primary ? 'button-primary' : ''}" href="${href}"${external(href)}><span class="button-icon">${icon(buttonIcon(label))}</span><span>${label}</span></a>`;
const links = p => {
  const out = [];
  if (p.doi) out.push(`<a href="${p.doi}"${external(p.doi)}><span class="pub-link-icon">${icon('link')}</span><span>DOI${p.doiLabel ? ` · ${esc(p.doiLabel)}` : ''}</span></a>`);
  if (p.preprint) out.push(`<a href="${p.preprint}"${external(p.preprint)}><span class="pub-link-icon">${icon('document')}</span><span>Preprint</span></a>`);
  if (p.demo) out.push(`<a href="${p.demo}"${external(p.demo)}><span class="pub-link-icon">${icon('play')}</span><span>Demo video</span></a>`);
  if (p.poster) out.push(`<a href="${p.poster}"><span class="pub-link-icon">${icon('document')}</span><span>Poster PDF</span></a>`);
  return out.length ? `<div class="pub-links">${out.join('')}</div>` : '';
};

function pubCard(p, featured=false) {
  if (p.type === 'Manuscript') return `<article class="pub-card manuscript" data-reveal data-publication="manuscripts" data-type="manuscripts"><div class="pub-card-top"><span class="eyebrow">${esc(p.status)}</span><span class="year">${p.year}</span></div><h3>${esc(p.title)}</h3><p class="authors">${p.authors.map(esc).join(', ')}</p><p class="venue">${esc(p.venue)}</p></article>`;
  const category = p.type === 'Workshop' ? 'workshops' : p.type === 'Journal' ? 'journals' : 'conferences';
  const year = p.publicationYear && p.publicationYear !== p.year ? `${p.year} · published ${p.publicationYear}` : p.year;
  return `<article class="pub-card ${featured ? 'featured' : ''}" data-reveal data-publication="${category}" data-type="${category}"><div class="pub-card-top"><span class="eyebrow">${esc(p.type)}${p.label ? ` · ${esc(p.label)}` : ''}</span><span class="year">${esc(year)}</span></div><h3>${esc(p.title)}</h3><p class="authors">${p.authors.map((author, i) => i === 0 ? `<strong>${esc(author)}</strong>` : esc(author)).join(', ')}</p><p class="venue">${esc(p.venue)}<br><span>${esc(p.citation)}</span></p>${p.metrics ? `<p class="metric"><a href="${p.metricUrl}"${external(p.metricUrl)}>${esc(p.metrics)}</a></p>` : ''}<p class="summary">${esc(p.summary)}</p>${p.note ? `<p class="record-note">${esc(p.note)}</p>` : ''}${links(p)}</article>`;
}

function directionCards(full=false) {
  return `<div class="direction-grid">${site.researchDirections.map(d => `<article class="direction-card" data-reveal><span class="eyebrow">Ongoing research</span><h3>${esc(d.title)}</h3><p>${esc(full ? d.description : d.short)}</p><div class="keywords">${d.keywords.map(k => `<span>${esc(k)}</span>`).join('')}</div></article>`).join('')}</div>`;
}

function home() {
  const news = site.news.slice(0, 6).map(n => `<li><time>${esc(n.date)}</time><span>${esc(n.text)}</span></li>`).join('');
  const selected = publications.filter(p => ['P1','P2','P3','P7'].includes(p.id));
  return page({file:'index.html', title:`${site.name} | ${site.subtitle}`, description:'Academic profile of Dr. Kousik Kumar Dutta, a computer science researcher working on graph algorithms, route planning, and data management.', active:'index.html', jsonLd:true, bodyClass:'home-page', content:`
    <section class="home-masthead" data-home-slideshow><div class="home-slides" aria-hidden="true"><span class="home-slide is-active" data-home-slide style="background-image:url('images/bg1.jpg');background-position:center 62%"></span><span class="home-slide" data-home-slide style="background-image:url('images/bg2.jpg');background-position:center 60%"></span><span class="home-slide" data-home-slide style="background-image:url('images/bg3.jpg');background-position:center"></span><span class="home-slide" data-home-slide style="background-image:url('images/bg4.jpg');background-position:center"></span></div><div class="home-masthead-shade" aria-hidden="true"></div><div class="home-masthead-inner"><h1>${esc(site.name)}</h1><p class="home-masthead-subtitle">${esc(site.subtitle)}</p><p class="home-masthead-intro">Algorithms and systems for preference-aware routing, time-dependent networks, and scalable graph data management.</p><div class="home-expertise" aria-label="Research focus"><span>Graph algorithms</span><span>Network data management</span><span>Route planning</span></div><div class="hero-actions">${button('docs/CV.pdf','Download CV',true)}${button('research.html','Research interests')}${button('contact.html','Contact')}</div><div class="home-slide-status" aria-hidden="true">${[0,1,2,3].map((_,i)=>`<span${i===0?' class="is-active"':''}></span>`).join('')}</div></div></section>
    <section class="home-about-section"><div class="home-about-grid"><div class="home-about-copy"><h2 class="section-title">About</h2><p class="lede">${esc(site.bio)}</p></div><figure class="home-about-portrait"><img src="images/about1.png" alt="Portrait of ${esc(site.name)}" width="1122" height="1045"></figure></div><section class="home-news-panel" aria-labelledby="latest-news-heading"><div class="home-news-heading"><div><h2 id="latest-news-heading" class="section-title">Latest news</h2></div><span>Pause on hover</span></div><div class="home-news-window"><div class="home-news-track"><ol>${news}</ol><ol aria-hidden="true">${news}</ol></div></div></section></section>
    <section class="section"><div class="section-heading"><h2 class="section-title">Research directions</h2></div>${directionCards(false)}<p class="section-link"><a href="research.html">Read the research agenda →</a></p></section>
    <section class="section publications-preview"><div class="section-heading"><h2 class="section-title">Selected publications</h2></div><div class="pub-grid">${selected.map((p,i)=>pubCard(p,i===0)).join('')}</div><p class="section-link"><a href="publications.html">Browse the complete publication record →</a></p></section>
    <section class="section split-section"><div><h2 class="section-title">Academic experience</h2><p>Teaching assistantships at IIT Ropar have included databases, software engineering, and postgraduate software laboratories. I also review for GeoInformatica and contribute to conference service.</p></div><div class="callout"><strong>Open to collaboration</strong><p>I welcome conversations about graph algorithms, data systems, transportation networks, teaching, and joint research.</p><a href="contact.html">Start a conversation →</a></div></section>`, scene:'home'});
}

function research() {
  return page({file:'research.html',title:`Research | ${site.name}`,description:'Research interests and current directions of Dr. Kousik Kumar Dutta in graph algorithms, data management, and route planning.',active:'research.html',bodyClass:'research-page',scene:'research',content:`<section class="page-intro"><h1 class="page-title">Research</h1><p class="lede">My work connects algorithm design with database and systems questions that arise when networks are large, dynamic, and shaped by competing preferences.</p></section><section class="section research-interests-section"><div class="section-heading"><h2 class="section-title">Interests</h2></div><div class="interest-list"><span>Graph algorithms</span><span>Spatial and network data management</span><span>Time-dependent routing</span><span>Query processing</span><span>Scalable computing</span><span>Intelligent transportation</span></div></section><section class="section"><div class="section-heading"><h2 class="section-title">Current directions</h2></div>${directionCards(true)}</section>`});
}

function publicationsPage() {
  const published = publications.filter(p=>p.type !== 'Manuscript');
  const manuscripts = publications.filter(p=>p.type === 'Manuscript');
  return page({file:'publications.html',title:`Publications | ${site.name}`,description:'Published papers, demonstrations, workshop contributions, and restrained manuscript status for Dr. Kousik Kumar Dutta.',active:'publications.html',bodyClass:'publications-page',content:`<section class="page-intro"><h1 class="page-title">Publications</h1><p class="lede">The inventory below records titles, authors, venues, dates, identifiers, and public summaries. Filters enhance browsing when JavaScript is available; every record remains readable in the static page.</p><div class="profile-links">${site.profiles.slice(0,4).map(p=>profileLink(p)).join('')}</div></section><section class="section publication-section"><div class="filter-bar" role="group" aria-label="Filter publications"><button class="filter-button active" type="button" data-filter="all" aria-pressed="true">All</button><button class="filter-button" type="button" data-filter="journals" aria-pressed="false">Journals</button><button class="filter-button" type="button" data-filter="conferences" aria-pressed="false">Conferences</button><button class="filter-button" type="button" data-filter="workshops" aria-pressed="false">Workshops &amp; demos</button><button class="filter-button" type="button" data-filter="manuscripts" aria-pressed="false">Manuscripts</button></div><div class="pub-grid" id="publication-list">${published.map((p,i)=>pubCard(p,i===0)).join('')}${manuscripts.map(p=>pubCard(p)).join('')}</div></section><section class="section publication-note"><p class="eyebrow">Record notes</p><p>Venue classifications and rankings are shown only where the current public source and track support them. The WISE 2024 item is listed as a Posters and Demos contribution; the UIC track is identified for the 2021 wearable-sensing paper. Journal metrics are not applied to manuscripts.</p></section>`});
}

function education() {
  return page({file:'education.html',title:`Education | ${site.name}`,description:'Education, doctoral foundation, fellowships, grants, and awards for Dr. Kousik Kumar Dutta.',active:'education.html',content:`<section class="page-intro"><h1 class="page-title">Education</h1><p class="lede">My academic training has centred on algorithms, data systems, and software, with doctoral work in constrained optimization on time-dependent road networks.</p></section><section class="section"><div class="timeline">${site.education.map(e=>`<article class="timeline-item"><p class="eyebrow">${esc(e.period)}</p><h2>${esc(e.degree)}</h2><p class="institution">${esc(e.school)}</p><dl>${e.details.map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></article>`).join('')}</div></section><section class="section"><div class="section-heading"><h2 class="section-title">Recognition</h2></div><div class="card-grid">${site.awards.map(([h,p])=>`<article class="simple-card"><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('')}</div></section>`});
}

function experience() {
  const teaching = site.teachingTimeline.map((entry, index) => `<li class="teaching-period" style="--stop-index:${index};--stop-delay:${index * 90}ms"><div class="teaching-year"><span>Academic year</span><time>${esc(entry.period)}</time></div><div class="teaching-period-body"><span class="teaching-node" aria-hidden="true"></span><ul>${entry.courses.map(([term,course,role])=>`<li><span class="teaching-term">${esc(term)}</span><strong>${esc(course)}</strong><span class="teaching-role">${esc(role)}</span></li>`).join('')}</ul></div></li>`).join('');
  return page({file:'experience.html',title:`Academic Service | ${site.name}`,description:'Teaching assistantship, reviewing, committee service, and presentations by Dr. Kousik Kumar Dutta.',active:'experience.html',content:`
      <section class="page-intro"><h1 class="page-title">Academic service</h1><p class="lede">My classroom-facing experience has been through teaching assistantships at IIT Ropar, complemented by peer review, committee service, and research presentations.</p></section>
    <section class="section"><div class="section-heading"><h2 class="section-title">Teaching assistantship</h2></div><div class="card-grid">${site.courses.map(([h,m,p])=>`<article class="simple-card"><p class="eyebrow">${esc(m)}</p><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('')}</div></section>
    <section class="section teaching-timeline-section"><div class="section-heading"><h2 class="section-title">Teaching timeline</h2><p class="timeline-intro">Course responsibilities across six academic years at IIT Ropar.</p></div><ol class="teaching-timeline">${teaching}</ol></section>
    <section class="section two-column"><article class="simple-card"><p class="eyebrow">Reviewing</p><h2>GeoInformatica</h2><p>Reviewer since 2023 for manuscripts in spatial databases, graph processing, and route planning.</p></article><article class="simple-card"><p class="eyebrow">Committee service</p><h2>SYNTACS 2026</h2><p>Technical Committee Head, coordinating technical responsibilities and review workflow.</p></article></section>
    <section class="section"><div class="section-heading"><h2 class="section-title">Presentations</h2></div><div class="service-list presentation-list"><div><strong>2026 · MDM</strong><span>User-configurable navigation systems for wideness and turn-aware routing.</span></div><div><strong>2025 · WISE</strong><span>Interval-based constrained path optimization in time-dependent road networks.</span></div><div><strong>2024 · WISE Posters and Demos</strong><span>Constrained path optimization on time-dependent road networks.</span></div></div></section>`});
}

function contact() {
  const profileCards = site.profiles.map(p=>`<a class="contact-card" href="${p.url}"${external(p.url)}><span class="contact-card-icon">${brandIcon(profileIcon(p.label))}</span><span class="contact-label">${esc(p.label)}</span><span>${esc(p.url.replace(/^https?:\/\//,'').replace(/\/$/,''))}</span></a>`).join('');
  return page({file:'contact.html',title:`Contact | ${site.name}`,description:'Contact and academic profile links for Dr. Kousik Kumar Dutta.',active:'contact.html',content:`<section class="page-intro"><h1 class="page-title">Contact</h1><p class="lede">I welcome conversations about research collaboration, graph and data systems, doctoral mentoring, teaching, and academic service.</p><div class="hero-actions">${button(`mailto:${site.email}?subject=Academic%20inquiry%20for%20Dr.%20Kousik%20Kumar%20Dutta`,'Email me',true)}${button('docs/CV.pdf','Download CV')}</div></section><section class="section contact-section"><div class="contact-primary"><h2>Direct contact</h2><p><strong>Primary email</strong><br><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>${site.institutionalEmail ? `<p><strong>Institutional email</strong><br><a href="mailto:${esc(site.institutionalEmail)}">${esc(site.institutionalEmail)}</a></p>` : ''}<p><strong>Location</strong><br>Indian Institute of Technology Ropar<br>${esc(site.location)}</p></div><div class="contact-grid">${profileCards}</div></section>`});
}

function alias(title, target) { return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${target}"><link rel="canonical" href="https://kousik-kr.github.io/${target}"><meta name="robots" content="noindex"><title>${title} moved</title></head><body><main><p>This page has moved to <a href="${target}">${target}</a>.</p></main></body></html>`; }

const pages = {
  'index.html': home(),
  'research.html': research(),
  'publications.html': publicationsPage(),
  'education.html': education(),
  'experience.html': experience(),
  'contact.html': contact(),
  'teaching.html': alias('Teaching','experience.html'),
  'activities.html': alias('Activities','experience.html'),
  'personal.html': alias('Personal','index.html'),
  'resume.html': alias('Resume','docs/CV.pdf'),
  'index-old.html': alias('Home archive','index.html'),
  'research-old.html': alias('Research archive','research.html'),
  'publications-old.html': alias('Publications archive','publications.html'),
  'contact-old.html': alias('Contact archive','contact.html'),
  'personal-old.html': alias('Personal archive','index.html'),
  'teaching-old.html': alias('Teaching archive','experience.html')
};

for (const [file, html] of Object.entries(pages)) fs.writeFileSync(path.join(root, file), html);
console.log(`Generated ${Object.keys(pages).length} HTML pages from ${publications.length} publication records.`);
