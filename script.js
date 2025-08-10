const images = [
    'images/bg1.jpg',
    'images/bg2.jpg',
    'images/bg3.jpg'
];

let currentIndex = 0;
const slideshow = document.querySelector('.slideshow');

function changeBackground() {
    slideshow.style.backgroundImage = `url(${images[currentIndex]})`;
    currentIndex = (currentIndex + 1) % images.length;
}

setInterval(changeBackground, 5000); // Change every 5s
changeBackground(); // Initial load
