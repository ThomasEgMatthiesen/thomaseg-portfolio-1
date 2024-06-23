
// Get the relevant HTML elements
const elements = document.querySelectorAll('.lmnt');
const infoContainer = document.querySelector('.info-cntnr');
const videoContainer = document.querySelector('.video-cntnr');
const backdrop = document.querySelectorAll('.video-backdrop');
const video = document.querySelector('.lmnt-video');
const videoClose = document.querySelector('.video-cls');

const titleElement = document.querySelector('.lmnt-title');
const resumeElement = document.querySelector('.lmnt-resume');
const textElement = document.querySelector('.lmnt-txt');
const genreElement = document.querySelector('.lmnt-genre');
const typeElement = document.querySelector('.lmnt-type');
const yearElement = document.querySelector('.lmnt-year');
let dataForVideo;
let jsonData = null;
let isThereVideo = 0;
let hoerbarLink = document.querySelector('.hoerbar-link');

function getDataFromJson(index) {
  if (jsonData === null) {
    // If the JSON data hasn't been fetched yet, get it from the specified path
    fetch('/js/work.json')
      .then(response => response.json())
      .then(data => {
        jsonData = data;
        fillElementsWithData(index);
      })
      .catch(error => console.error(error));
  } else {
    // If the JSON data has already been fetched, use it to fill the HTML elements
    fillElementsWithData(index);
  }
}

function fillElementsWithData(index) {
  // Find the element with the matching index in the JSON data
  const elementData = jsonData[index];
  // Fill the HTML elements with the data from the JSON
  titleElement.textContent = elementData.title;
  resumeElement.textContent = elementData.resume;
  textElement.textContent = elementData.text;
  genreElement.textContent = '♯ ' + elementData.genre;
  typeElement.textContent = '♯ ' + elementData.type;
  yearElement.textContent = '♯ ' + elementData.year;
  if (elementData.videoUrl) {
    isThereVideo = 1;
    dataForVideo = elementData.videoUrl;
  } else {
    isThereVideo = 0;
    dataForVideo = "";
  }
  
}

elements.forEach((element, index) => {
  element.addEventListener('mouseover', () => {
    getDataFromJson(index);
  });
});

elements.forEach((element) => {
    element.addEventListener('click', () => {
        disableScroll();
        // Reload the video element to update the source
        video.src = dataForVideo;
        video.load();
        infoContainer.classList.add('high');
        infoContainer.classList.add('high-z');
        videoContainer.style.display = "block";
        // Delay backdrops with 50ms
        setTimeout(function() {
            backdrop[0].classList.remove('up');
            backdrop[1].classList.remove('down');
            if (isThereVideo === 1) {
              video.style.display = "block";
            } else {
              video.style.display = "none";
            }
            genreElement.classList.add('largen');
            typeElement.classList.add('largen');
            yearElement.classList.add('largen');
        }, 50);
        setTimeout(function() {
          textElement.style.display = "block";
        }, 400);
        setTimeout(function() {
            textElement.classList.remove('hidden');
            video.classList.remove('hidden');
            videoClose.classList.remove('cls-hide');
            if (isThereVideo === 1) {
              video.play();
            } else {
              hoerbarLink.style.display = "flex";
            }
        }, 500);
    });
});

videoContainer.addEventListener('click', () => {
    hoerbarLink.style.display = "none";
    videoClose.classList.add('cls-hide');
    infoContainer.classList.remove('high');
    setTimeout(function() {
      infoContainer.classList.remove('high-z');
    }, 500);
    textElement.classList.add('hidden');
    video.classList.add('hidden');
    textElement.style.display = "none";
    video.style.display = "none";
    backdrop[0].classList.add('up');
    backdrop[1].classList.add('down');
    genreElement.classList.remove('largen');
    typeElement.classList.remove('largen');
    yearElement.classList.remove('largen');
    // Set the display property to "none" after 500ms
    setTimeout(function() {
        videoContainer.style.display = "none";
        if (window.innerWidth < 992) {
          simulateHover(previousClosestElementIndex);
        }
    }, 500);
    video.pause();
    enableScroll();
});

video.addEventListener("click", (e) => {
    e.stopPropagation();
});

infoContainer.addEventListener("click", () => {
  if (infoContainer.classList.contains('high')) {
    videoContainer.click();
  }
});

videoClose.addEventListener("click", () => {
  videoContainer.click();
});


let animationFrameId;

window.addEventListener('scroll', function() {
  const element = document.querySelector('.portfolio-cntnr');
  const distanceFromTop = element.getBoundingClientRect().top;
  const viewportHeight = window.innerHeight;
  if (distanceFromTop < viewportHeight * 0.5) {

    elements.forEach((element) => { if (element.classList.contains('no-click')) { element.classList.remove('no-click'); } });

    infoContainer.classList.remove('info-hidden');

  } else {
    elements.forEach((element) => { if (!element.classList.contains('no-click')) { element.classList.add('no-click'); } });
    infoContainer.classList.add('info-hidden');       
  }
  if (window.innerWidth < 992) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(getClosestElement);
  }
});

let previousClosestElementIndex = -1;

function getClosestElement() {
  // Get the height of the viewport
  const viewportHeight = window.innerHeight;

  // Calculate the vertical center of the viewport
  const viewportCenter = viewportHeight / 2;

  // Initialize variables to keep track of the closest element and its distance from the center
  let closestElementIndex = -1;
  let closestDistance = Infinity;

  // Loop through each element and check its distance from the center of the viewport
  elements.forEach((element, index) => {
    const boundingRect = element.getBoundingClientRect();
    const top = boundingRect.top;
    const distance = Math.abs(viewportCenter - top);

    if (distance < closestDistance) {
      closestElementIndex = index;
      closestDistance = distance;
    }
  });

  // Only log the index if it has changed
  if (closestElementIndex !== previousClosestElementIndex) {
    simulateHover(closestElementIndex);
    previousClosestElementIndex = closestElementIndex;
  }
}


function simulateHover(index) {
  // Create a new mouseover event
  const mouseoverEvent = new MouseEvent('mouseover', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  // Dispatch the event on the element
  elements[index].dispatchEvent(mouseoverEvent);
}

// SCROLL LOCK AND UNLOCK

const keys = {37: 1, 38: 1, 39: 1, 40: 1};
  
function preventDefault(e) {
    e.preventDefault();
}
  
function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
      preventDefault(e);
      return false;
    }
}

let supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
      get: function () { supportsPassive = true; }
    }));
} catch(e) {}
  
const wheelOpt = supportsPassive ? { passive: false } : false;
const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.addEventListener(wheelEvent, preventDefault, wheelOpt);
    window.addEventListener('touchmove', preventDefault, wheelOpt);
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}