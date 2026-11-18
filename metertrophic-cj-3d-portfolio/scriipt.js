const slides = document.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".dots");
const counter = document.querySelector(".counter");

let currentSlide = 0;

slides.forEach((_, index) => {
    const dot = document.createElement("button");

    dot.classList.add("dot");

    dot.addEventListener("click", () => {
        showSlide(index);
    });

    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".dot");

function showSlide(index) {
    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");

    counter.textContent =
        `0${currentSlide + 1} — 0${slides.length}`;
}

document.querySelector(".next").addEventListener("click", () => {
    showSlide(currentSlide + 1);
});

document.querySelector(".prev").addEventListener("click", () => {
    showSlide(currentSlide - 1);
});

showSlide(0);