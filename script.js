document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("sidebarToggle");

    // Sidebar toggle
    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("expanded");
        sidebar.classList.toggle("collapsed");
    });

    // Active page highlight
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".sidebar nav a").forEach(link => {
        if (link.getAttribute("data-page") === currentPage) {
            link.classList.add("active");
        }
    });

    // Slideshow (only runs if slideshow element exists)
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
