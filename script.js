document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("sidebarToggle");

    // Toggle sidebar
    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("expanded");
        sidebar.classList.toggle("collapsed");
    });

    // Active link detection
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".sidebar nav a").forEach(link => {
        if (link.getAttribute("data-page") === currentPage) {
            link.classList.add("active");
        }
    });

    // Slideshow
    const slideshow = document.querySelector(".slideshow");
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
        setInterval(changeBackground, 5000);
        changeBackground();
    }
});

// ===== Typing Effect =====
document.addEventListener("DOMContentLoaded", function () {
    const text = "Ph.D. Scholar | Spatio-temporal Databases | Navigation Systems | Graph Algorithms";
    const typingElement = document.getElementById("typing-text");
    if (!typingElement) return; // Only run on index page
    let index = 0;

    // Make sure to clear the text first
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

    setTimeout(typeEffect, 2000); // wait for fade-in
});


// ===== Background Slideshow =====
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

    changeBackground(); // first image
    setInterval(changeBackground, 5000); // every 5 sec
}

const url = 'My_CV.pdf';
let pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1.0,
    canvas = document.getElementById('resume-canvas'),
    ctx = canvas.getContext('2d');

pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById('page_count').textContent = pdfDoc.numPages;
    renderPage(pageNum);
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

    document.getElementById('page_num').textContent = num;
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

document.getElementById('prev').addEventListener('click', function () {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
});

document.getElementById('next').addEventListener('click', function () {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
});

document.getElementById('zoom_in').addEventListener('click', function () {
    scale += 0.2;
    queueRenderPage(pageNum);
});

document.getElementById('zoom_out').addEventListener('click', function () {
    if (scale > 0.4) {
        scale -= 0.2;
        queueRenderPage(pageNum);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const aboutSection = document.querySelector('.about-section');

    function revealAboutSection() {
        const sectionTop = aboutSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        // When top of section is within viewport
        if (sectionTop < windowHeight - 60) { // adjust threshold if desired
            aboutSection.classList.add('visible');
            window.removeEventListener('scroll', revealAboutSection); // only reveal once
        }
    }

    window.addEventListener('scroll', revealAboutSection);
    // Reveal right away if already visible on load
    revealAboutSection();
});
