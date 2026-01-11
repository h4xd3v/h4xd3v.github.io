/**
 * About Me Logic
 * Handles Hacker Text Effect, JSON Rendering, and Carousel
 */

const AboutMe = {
  init: () => {
    // Init Nav Toggle
    const navToggle = document.getElementById('navToggle');
    const navList = document.querySelector('.nav-list');
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
      });
    }

    // Init Components
    AboutMe.startHackerText("VICENTE-H4X");
    AboutMe.renderProfileJSON();
    AboutMe.initCarousel();
  },

  /* Hacker Text Effect */
  startHackerText: (finalText) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    const element = document.getElementById("hackerTextOutput");
    if (!element) return;

    let iteration = 0;
    let interval = null;

    clearInterval(interval);

    interval = setInterval(() => {
      element.innerText = finalText
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return finalText[index];
          }
          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");

      if (iteration >= finalText.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);
  },

  /* JSON Profile Rendering */
  renderProfileJSON: () => {
    const profileData = {
      name: "Vicente/H4X",
      description: "I work in the IT sector, working in the area of cybersecurity. Applying the Kaizen methodology for a better performance in my daily life.",
      hobbies: [
        "Swimming",
        "HTB",
        "Coding"
      ],
      certifications: [
        "eJPT",
        "eWPT",
        "eWPTX",
        "eCPPT",
        "eMAPT"
      ],
      achievements: {
        EH: "Government entities, healthcare, banking, mining, and maritime logistics",
        github: "IOC Tool"
      },
      status: "Focus/Kaizen"
    };

    const container = document.getElementById('jsonProfile');
    if (!container) return;

    const jsonString = JSON.stringify(profileData, null, 4);

    const highlighted = jsonString.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      }
    );

    container.innerHTML = highlighted;
  },

  /* Carousel Logic */
  initCarousel: () => {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');

    if (!track) return;

    let currentIndex = 0;
    const totalSlides = 5; // We have 5 dummy images
    let autoPlayInterval;

    const updateCarousel = () => {
      const width = track.clientWidth; // Get dynamic width of container logic if needed, but here images are fixed size roughly
      // Actually, best to use % or verify image width. CSS sets width to 500px or 90vw.
      // Let's assume the slide moves by the width of the container/image.
      // Since we set carousel-img width to match container width in CSS, we can just use percentage translate or calc.

      track.style.transform = `translateX(-${currentIndex * 100}%)`; // Move by 100% of container width per slide

      // Update indicators
      indicators.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    };

    const goToSlide = (index) => {
      currentIndex = index;
      updateCarousel();
    };

    // Event Listeners
    if (nextBtn) nextBtn.addEventListener('click', () => {
      nextSlide();
      resetTimer();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
      prevSlide();
      resetTimer();
    });

    indicators.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetTimer();
      });
    });

    // Auto Play: Static for 2 seconds, then move.
    // setInterval runs every X ms. User wants image "static 2 seconds".
    // This effectively means interval = 2000ms.
    const startTimer = () => {
      autoPlayInterval = setInterval(nextSlide, 2000);
    };

    const resetTimer = () => {
      clearInterval(autoPlayInterval);
      startTimer();
    };

    // Initialize styles to be sure
    // Since we used translateX(-...%), we need to ensure the track width accommodates all images.
    // CSS `display: flex` on track does this, but keeping `width: max-content` might break % logic relative to parent.
    // Let's ensure track width logic is sound. 
    // Actually `transform: translateX(-100%)` moves the element by 100% of ITS OWN width by default? No, usually it's relative to element size.
    // But if track is wide, moving -100% moves it entirely out.
    // We want to move -1 * ContainerWidth.
    // So we should change logic to pixel based or use calc properly. 
    // For simplicity, let's update style: transform = translateX(-Index * 100 / TotalSlides %) if track is 500% wide.
    // Or cleaner: `translateX(-${currentIndex * 100}%)` works if applied to the SLIDE, but here we apply to TRACK.
    // If applying to TRACK, and TRACK is flex container of all images...
    // We should move by (100 / totalSlides) % if track is 100% * N wide?
    // Let's do pixel calculation for safety or switch to safer CSS.
    // Let's modify logic to use `clientWidth`.

    // Re-defining update for robustness:
    const saferUpdate = () => {
      // Check first image width
      const firstImg = track.firstElementChild;
      const slideWidth = firstImg.clientWidth; // Should account for 500px or 90vw
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

      indicators.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    // Monkey patch saferUpdate over updateCarousel
    // (Just rewriting it here for clarity in final file)

    startTimer();
  }
};

// Redefine initCarousel inside object before writing file to implement saferUpdate logic cleanly.
AboutMe.initCarousel = () => {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicators = document.querySelectorAll('.indicator');

  if (!track) return;

  let currentIndex = 0;
  const totalSlides = track.children.length; // Dynamic count
  let autoPlayInterval;

  const updateCarousel = () => {
    const firstImg = track.firstElementChild;
    // Ensure we handle potential load delay resizing, though defined in CSS it should be fine.
    const slideWidth = firstImg ? firstImg.clientWidth : 0;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    indicators.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  };

  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  };

  const goToSlide = (index) => {
    currentIndex = index;
    updateCarousel();
  };

  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    resetTimer();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    resetTimer();
  });

  indicators.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetTimer();
    });
  });

  const startTimer = () => {
    autoPlayInterval = setInterval(nextSlide, 2000);
  };

  const resetTimer = () => {
    clearInterval(autoPlayInterval);
    startTimer();
  };

  // Handle resize to fix offsets
  window.addEventListener('resize', updateCarousel);

  startTimer();
};

document.addEventListener('DOMContentLoaded', AboutMe.init);
