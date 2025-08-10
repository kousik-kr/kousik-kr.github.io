document.addEventListener("DOMContentLoaded", function () {
    const images = [
        "images/bg1.jpg",
        "images/bg2.jpg",
        "images/bg3.jpg",
        "images/bg4.jpg"
    ];

    let currentIndex = 0;
    const slideshow = document.querySelector(".slideshow");

    function changeBackground() {
        slideshow.style.backgroundImage = `url('${images[currentIndex]}')`;
        currentIndex = (currentIndex + 1) % images.length;
    }

    // Change every 5 seconds
    setInterval(changeBackground, 5000);

    // Load first image immediately
    changeBackground();
});
