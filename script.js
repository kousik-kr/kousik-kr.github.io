// ===== Enhanced Sidebar Toggle with Multiple Features =====
document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("sidebarToggle");
    let isExpanded = localStorage.getItem('sidebarExpanded') !== 'false'; // Default to expanded

    // Initialize sidebar state from localStorage
    if (sidebar) {
        if (isExpanded) {
            sidebar.classList.add("expanded");
            sidebar.classList.remove("collapsed");
        } else {
            sidebar.classList.add("collapsed");
            sidebar.classList.remove("expanded");
        }
    }

    // Toggle sidebar on click
    if (toggle && sidebar) {
        toggle.addEventListener("click", () => {
            isExpanded = !isExpanded;
            sidebar.classList.toggle("expanded");
            sidebar.classList.toggle("collapsed");
            
            // Save state to localStorage
            localStorage.setItem('sidebarExpanded', isExpanded);
        });
    }

    // Auto-collapse on mobile
    function handleResize() {
        if (window.innerWidth <= 768 && sidebar) {
            sidebar.classList.remove("expanded");
            sidebar.classList.add("collapsed");
        } else if (isExpanded && sidebar) {
            sidebar.classList.add("expanded");
            sidebar.classList.remove("collapsed");
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();

    // Active link detection
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".sidebar nav a").forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // Add keyboard navigation (Alt + S to toggle sidebar)
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            if (toggle) toggle.click();
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && sidebar) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            if (!isClickInsideSidebar && sidebar.classList.contains('expanded')) {
                sidebar.classList.remove('expanded');
                sidebar.classList.add('collapsed');
            }
        }
    });

    // Add smooth hover effects to navigation items
    const navLinks = document.querySelectorAll('.sidebar nav a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (sidebar && sidebar.classList.contains('expanded')) {
                this.style.paddingLeft = '35px';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.paddingLeft = '25px';
        });
    });
});

// ===== Typing Effect =====
document.addEventListener("DOMContentLoaded", function () {
    const text = "Ph.D. Scholar | Spatio-temporal Databases | Navigation Systems | Graph Algorithms";
    const typingElement = document.getElementById("typing-text");
    
    if (!typingElement) return;
    
    let index = 0;
    typingElement.textContent = "";

    function typeEffect() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeEffect, 50);
        } else {
            typingElement.style.borderRight = "none";
        }
    }

    setTimeout(typeEffect, 2000);
});

// ===== Background Slideshow =====
document.addEventListener("DOMContentLoaded", function () {
    const slideshow = document.getElementById("slideshow");
    
    if (slideshow) {
        const images = [
            "images/bg1.jpg",
            "images/bg2.jpg",
            "images/bg3.jpg",
            "images/bg4.jpg"
        ];
        let currentIndex = 0;

        function changeBackground() {
            slideshow.style.backgroundImage = `url('${images[currentIndex]}')`;
            currentIndex = (currentIndex + 1) % images.length;
        }

        changeBackground();
        setInterval(changeBackground, 5000);
    }
});

// ===== About Section Reveal Animation =====
document.addEventListener("DOMContentLoaded", function() {
    const aboutSection = document.querySelector('.about-section');
    
    if (!aboutSection) return;

    function revealAboutSection() {
        const sectionTop = aboutSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 100) {
            aboutSection.classList.add('visible');
            window.removeEventListener('scroll', revealAboutSection);
        }
    }

    window.addEventListener('scroll', revealAboutSection);
    revealAboutSection();
});

// ===== About Content Reveal with Intersection Observer =====
document.addEventListener("DOMContentLoaded", function () {
    const aboutContent = document.querySelector('.about-section .about-content');
    
    if (!aboutContent) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                aboutContent.classList.add('visible');
                obs.unobserve(aboutContent);
            }
        });
    }, { threshold: 0.15 });

    observer.observe(aboutContent);
});

// ===== Fade In Animation for Cards =====
document.addEventListener("DOMContentLoaded", function() {
    const cards = document.querySelectorAll('.publication-card, .research-card, .info-section, .contact-card, .timeline-item');
    
    if (cards.length === 0) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
});

// ===== Smooth Scroll for Internal Links =====
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ===== Add Hover Effects to Publication Links =====
document.addEventListener("DOMContentLoaded", function() {
    const pubLinks = document.querySelectorAll('.pub-link');
    
    pubLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});

// ===== PDF Resume Viewer (if needed) =====
if (typeof pdfjsLib !== 'undefined') {
    const url = 'docs/My_CV.pdf';
    let pdfDoc = null,
        pageNum = 1,
        pageRendering = false,
        pageNumPending = null,
        scale = 1.0,
        canvas = document.getElementById('resume-canvas'),
        ctx = canvas ? canvas.getContext('2d') : null;

    if (canvas && ctx) {
        pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
            pdfDoc = pdfDoc_;
            const pageCount = document.getElementById('page_count');
            if (pageCount) {
                pageCount.textContent = pdfDoc.numPages;
            }
            renderPage(pageNum);
        }).catch(function(error) {
            console.log('PDF loading error:', error);
        });

        function renderPage(num) {
            pageRendering = true;
            pdfDoc.getPage(num).then(function (page) {
                let viewport = page.getViewport({ scale: scale });
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                let renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };
                let renderTask = page.render(renderContext);

                renderTask.promise.then(function () {
                    pageRendering = false;
                    if (pageNumPending !== null) {
                        renderPage(pageNumPending);
                        pageNumPending = null;
                    }
                });
            });

            const pageNumElement = document.getElementById('page_num');
            if (pageNumElement) {
                pageNumElement.textContent = num;
            }
        }

        function queueRenderPage(num) {
            if (pageRendering) {
                pageNumPending = num;
            } else {
                renderPage(num);
            }
        }

        const prevButton = document.getElementById('prev');
        const nextButton = document.getElementById('next');
        const zoomInButton = document.getElementById('zoom_in');
        const zoomOutButton = document.getElementById('zoom_out');

        if (prevButton) {
            prevButton.addEventListener('click', function () {
                if (pageNum <= 1) return;
                pageNum--;
                queueRenderPage(pageNum);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', function () {
                if (pageNum >= pdfDoc.numPages) return;
                pageNum++;
                queueRenderPage(pageNum);
            });
        }

        if (zoomInButton) {
            zoomInButton.addEventListener('click', function () {
                scale += 0.2;
                queueRenderPage(pageNum);
            });
        }

        if (zoomOutButton) {
            zoomOutButton.addEventListener('click', function () {
                if (scale > 0.4) {
                    scale -= 0.2;
                    queueRenderPage(pageNum);
                }
            });
        }
    }
}

// ===== Parallax Effect for Hero Section =====
document.addEventListener("DOMContentLoaded", function() {
    const slideshow = document.getElementById("slideshow");
    
    if (slideshow) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = slideshow.querySelector('.slideshow-inner');
            if (parallax && scrolled < window.innerHeight) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
                parallax.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        });
    }
});

// ===== Add Loading Animation =====
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// ===== Console Welcome Message =====
console.log('%c Welcome to Kousik Kumar Dutta\'s Website! ', 
    'background: linear-gradient(135deg, #0a2a66 0%, #1e5a9a 100%); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 5px;');
console.log('%c Interested in the code? Check out the repository! ', 
    'color: #ff6b35; font-size: 14px; font-weight: bold;');

// ===== GitHub Projects Widget =====
function formatDateShort(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString();
}

async function loadGitHubProjects(username = 'kousik-kr', containerId = 'projects-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const cacheKey = 'gh_repos_cache_' + username;
    const cacheTTL = 1000 * 60 * 10; // 10 minutes
    try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.ts < cacheTTL && parsed.repos) {
                renderRepos(parsed.repos, container);
                return;
            }
        }
    } catch (e) {
        console.warn('GitHub cache parse failed', e);
    }

    container.innerHTML = '<div class="projects-loading">Loading projects from GitHub...</div>';

    try {
        const resp = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        if (resp.status === 403) {
            container.innerHTML = '<div class="projects-loading">GitHub API rate limit reached. Try again later or authenticate.</div>';
            return;
        }
        if (!resp.ok) {
            container.innerHTML = '<div class="projects-loading">Unable to fetch projects.</div>';
            return;
        }
        const data = await resp.json();
        const repos = (Array.isArray(data) ? data : []).filter(r => !r.archived).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        try { localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), repos })); } catch (e) {}
        renderRepos(repos, container);
    } catch (err) {
        container.innerHTML = '<div class="projects-loading">Error fetching projects.</div>';
        console.error('GitHub fetch error', err);
    }
}

function renderRepos(repos, container) {
    if (!repos || repos.length === 0) {
        container.innerHTML = '<div class="projects-loading">No public repositories found.</div>';
        return;
    }

    const html = repos.map(r => {
        const desc = r.description ? escapeHtml(r.description) : '';
        const lang = r.language ? `<span class="meta-item"><i class="fas fa-code"></i> ${escapeHtml(r.language)}</span>` : '';
        const stars = `<span class="meta-item"><i class="fas fa-star"></i> ${r.stargazers_count}</span>`;
        const forks = `<span class="meta-item"><i class="fas fa-code-branch"></i> ${r.forks_count}</span>`;
        const updated = `<span class="meta-item"><i class="fas fa-clock"></i> ${formatDateShort(r.updated_at)}</span>`;
        return `<a class="project-card" href="${r.html_url}" target="_blank" rel="noopener noreferrer">
            <div class="project-title"><span>${escapeHtml(r.name)}</span></div>
            <div class="project-desc">${desc}</div>
            <div class="project-meta">${lang}${stars}${forks}${updated}</div>
        </a>`;
    }).join('');

    container.innerHTML = html;
}

function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/[&<>"']/g, function (m) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Load projects on pages that include the container
    loadGitHubProjects('kousik-kr');
});

document.addEventListener('DOMContentLoaded', function () {
    const footerContainers = document.querySelectorAll('.footer-content');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const footerNav = [
        ['index.html', 'Home', 'fa-house'],
        ['research.html', 'Research', 'fa-flask'],
        ['publications.html', 'Publications', 'fa-book-open'],
        ['experience.html', 'Experience', 'fa-briefcase'],
        ['contact.html', 'Contact', 'fa-envelope']
    ];
    const footerProfiles = [
        ['https://scholar.google.com/citations?user=KR_KousikDutta', 'Google Scholar', 'fa-graduation-cap'],
        ['https://dblp.org/pid/297/4783.html', 'DBLP', 'fa-book'],
        ['https://github.com/kousik-kr', 'GitHub', 'fa-github'],
        ['https://www.linkedin.com/in/kousik-kumar-dutta-91595b187/', 'LinkedIn', 'fa-linkedin']
    ];

    const buildLinkList = (links, isExternal = false) => links.map(([href, label, icon]) => {
        const active = !isExternal && href === currentPage ? ' aria-current="page"' : '';
        const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        const iconFamily = icon === 'fa-github' || icon === 'fa-linkedin' ? 'fab' : 'fas';
        return `<a href="${href}"${active}${target}><i class="${iconFamily} ${icon}"></i><span>${label}</span></a>`;
    }).join('');

    footerContainers.forEach(container => {
        container.innerHTML = `
            <div class="footer-grid">
                <div class="footer-block">
                    <h2 class="footer-brand-name">Kousik Kumar Dutta</h2>
                    <p class="footer-role">Ph.D. Scholar, Computer Science and Engineering, IIT Ropar</p>
                    <p class="footer-tagline">Research in spatio-temporal databases, navigation systems, routing algorithms, and scalable graph processing.</p>
                    <a class="footer-cta" href="docs/My_CV.pdf" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-file-arrow-down"></i>
                        <span>Download CV</span>
                    </a>
                </div>
                <div class="footer-block">
                    <h3>Navigation</h3>
                    <div class="footer-link-list">
                        ${buildLinkList(footerNav)}
                    </div>
                </div>
                <div class="footer-block">
                    <h3>Academic Profiles</h3>
                    <div class="footer-link-list">
                        ${buildLinkList(footerProfiles, true)}
                    </div>
                </div>
                <div class="footer-block footer-contact">
                    <h3>Contact</h3>
                    <p><i class="fas fa-envelope"></i><span>kousik.21csz0004@iitrpr.ac.in</span></p>
                    <p><i class="fas fa-location-dot"></i><span>Indian Institute of Technology Ropar, Punjab, India</span></p>
                    <div class="social-links">
                        <a href="https://github.com/kousik-kr" target="_blank" rel="noopener noreferrer" title="GitHub"><i class="fab fa-github"></i></a>
                        <a href="https://www.linkedin.com/in/kousik-kumar-dutta-91595b187/" target="_blank" rel="noopener noreferrer" title="LinkedIn"><i class="fab fa-linkedin"></i></a>
                        <a href="https://scholar.google.com/citations?user=KR_KousikDutta" target="_blank" rel="noopener noreferrer" title="Google Scholar"><i class="fas fa-graduation-cap"></i></a>
                        <a href="https://dblp.org/pid/297/4783.html" target="_blank" rel="noopener noreferrer" title="DBLP"><i class="fas fa-book"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <span>&copy; 2026 Kousik Kumar Dutta. All rights reserved.</span>
                <span>Last updated: May 2026</span>
            </div>
        `;
    });

    let scrollTopButton = document.querySelector('.scroll-top-btn');
    if (!scrollTopButton) {
        scrollTopButton = document.createElement('button');
        scrollTopButton.type = 'button';
        scrollTopButton.className = 'scroll-top-btn';
        scrollTopButton.setAttribute('aria-label', 'Scroll to top');
        scrollTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(scrollTopButton);
    }

    const updateScrollButton = () => {
        if (window.scrollY > 400) {
            scrollTopButton.classList.add('visible');
        } else {
            scrollTopButton.classList.remove('visible');
        }
    };

    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', updateScrollButton, { passive: true });
    updateScrollButton();
});
