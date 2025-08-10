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
            "images/bg3.jpg"
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
