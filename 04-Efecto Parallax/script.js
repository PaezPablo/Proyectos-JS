const mountainBlue = document.querySelector('#mountain-blue');
const treesLeft = document.querySelector('#trees-left');
const mountainRed = document.querySelector('#mountain-red');
const treesBottom = document.querySelector('#trees-bottom');
const man = document.querySelector('#man');
const plants = document.querySelector('#plants');

const title = document.querySelector('.titulo');

//Efecto al scrollear
window.addEventListener('scroll', () => {
    let scroll = window.scrollY;

    mountainBlue.style.left = scroll * 1 + "px"
    mountainRed.style.left = scroll * 0.5 + "px"

    treesLeft.style.bottom = scroll * -0.7 + "px"
    treesLeft.style.right = scroll * 2 + "px"

    treesBottom.style.right = scroll * 2 + "px"
    man.style.right = scroll + "px"
    plants.style.right = scroll * 2 + "px"
    title.style.right = scroll * 4 + "px"
    
});