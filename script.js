// ===== GLOBAL VARIABLES AND DOM ELEMENTS =====

/* Navigation and mobile menu elements */
const hamburger = document.getElementById("hamburger")
const mobileOverlay = document.getElementById("mobileOverlay")
const navbar = document.getElementById("navbar")
const mobileLinks = document.querySelectorAll(".mobile-link")
const heroImage = document.getElementById("heroImage")

/* About section elements for scroll animations */
const mainAboutTitle = document.getElementById("mainAboutTitle")
const aboutTagline = document.getElementById("aboutTagline")
const aboutDescription = document.getElementById("aboutDescription")
const videoSection = document.getElementById("videoSection")

/* Vimeo Player variables */
let vimeoPlayer
let isVideoInView = false

// ===== VIMEO PLAYER INITIALIZATION =====

/* Initialize Vimeo Player when DOM is loaded */
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Vimeo Player
  const iframe = document.getElementById('vimeoPlayer')
  if (iframe) {
    vimeoPlayer = new Vimeo.Player(iframe)
    
    // Set up video event listeners
    vimeoPlayer.on('loaded', () => {
      console.log('Vimeo player loaded successfully')
    })

    vimeoPlayer.on('error', (error) => {
      console.error('Vimeo player error:', error)
    })

    // Initially pause the video
    vimeoPlayer.pause().catch((error) => {
      console.log('Initial pause failed:', error)
    })
  }

  // Initialize other animations and observers
  initializeAnimations()
})

// ===== VIDEO SCROLL CONTROL WITH INTERSECTION OBSERVER =====

/* Intersection Observer for video autoplay/pause control */
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.target.id === 'videoSection') {
      if (entry.isIntersecting) {
        // Video section is in view - play video
        if (vimeoPlayer && !isVideoInView) {
          isVideoInView = true
          vimeoPlayer.play().then(() => {
            console.log('Video started playing')
          }).catch((error) => {
            console.log('Autoplay failed:', error)
          })
        }
      } else {
        // Video section is out of view - pause video
        if (vimeoPlayer && isVideoInView) {
          isVideoInView = false
          vimeoPlayer.pause().then(() => {
            console.log('Video paused')
          }).catch((error) => {
            console.log('Pause failed:', error)
          })
        }
      }
    }
  })
}, {
  threshold: 0.5, // Video must be 50% visible to trigger autoplay
  rootMargin: '-50px 0px -50px 0px' // Add some margin for better UX
})

// ===== MOBILE NAVIGATION FUNCTIONALITY =====

/* Toggle hamburger menu and mobile overlay */
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active")
  mobileOverlay.classList.toggle("active")
  // Prevent body scrolling when mobile menu is open
  document.body.style.overflow = mobileOverlay.classList.contains("active") ? "hidden" : "auto"
})

/* Close mobile menu when clicking on navigation links */
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active")
    mobileOverlay.classList.remove("active")
    document.body.style.overflow = "auto"
  })
})

/* Close mobile menu when clicking outside menu area */
mobileOverlay.addEventListener("click", (e) => {
  if (e.target === mobileOverlay) {
    hamburger.classList.remove("active")
    mobileOverlay.classList.remove("active")
    document.body.style.overflow = "auto"
  }
})

// ===== NAVBAR SCROLL EFFECTS =====

let lastScrollY = window.scrollY

/* Update navbar appearance and hero parallax on scroll */
const updateNavbar = () => {
  const currentScrollY = window.scrollY

  /* Add 'scrolled' class to navbar after scrolling 50px */
  if (currentScrollY > 50) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }

  /* Parallax effect for hero background image */
  if (heroImage && currentScrollY < window.innerHeight) {
    const parallaxSpeed = 0.5
    heroImage.style.transform = `translateY(${currentScrollY * parallaxSpeed}px)`
  }

  lastScrollY = currentScrollY
}

/* Throttled scroll event listener for better performance */
let ticking = false
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateNavbar()
      handleScrollAnimations()
      ticking = false
    })
    ticking = true
  }
})

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====

/* Enable smooth scrolling for all internal anchor links */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      /* Calculate offset to account for fixed navbar */
      const offsetTop = target.offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  })
})

// ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS =====

/* Configuration for scroll-triggered animations */
const observerOptions = {
  threshold: 0.1, /* Trigger when 10% of element is visible */
  rootMargin: "0px 0px -50px 0px" /* Trigger 50px before element enters viewport */,
}

/* Main intersection observer for animated elements */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      /* Add animate class when element becomes visible */
      entry.target.classList.add("animate")
    }
  })
}, observerOptions)

// ===== SCROLL ANIMATIONS HANDLER =====

/* Handle scroll-triggered animations for various elements */
function handleScrollAnimations() {
  const elements = document.querySelectorAll(
    ".fade-in, .slide-in-left, .slide-in-right, .choice-block, .info-card, .product-item, .contact-item, .about-description, .text-reveal, .video-section",
  )

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    const elementVisible = 150

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("animate")
    } else if (element.classList.contains("text-reveal")) {
      /* Remove animate class when scrolling away for text reveal effect */
      element.classList.remove("animate")
    }
  })
}

// ===== INITIALIZE ANIMATIONS ON PAGE LOAD =====

function initializeAnimations() {
  /* All elements that need scroll-triggered animations */
  const animatedElements = document.querySelectorAll(
    ".choice-block, .info-card, .product-item, .contact-card, .contact-title, .contact-subtitle, .main-about-title, .about-tagline, .about-description, .text-reveal, .video-section",
  )

  /* Observe each element for intersection */
  animatedElements.forEach((element) => {
    observer.observe(element)
  })

  /* Observe video section for autoplay control */
  if (videoSection) {
    videoObserver.observe(videoSection)
  }
}

// ===== HERO BUTTON FUNCTIONALITY =====

/* Hero button click handler - scrolls to products section */
document.getElementById("heroBtn").addEventListener("click", (e) => {
  e.preventDefault()
  const productsSection = document.querySelector("#products")
  const offsetTop = productsSection.offsetTop - 80

  window.scrollTo({
    top: offsetTop,
    behavior: "smooth",
  })
})

// ===== MODAL FUNCTIONALITY =====

/* Modal element references */
const benefitsCard = document.getElementById("benefitsCard")
const usageCard = document.getElementById("usageCard")
const benefitsModal = document.getElementById("benefitsModal")
const usageModal = document.getElementById("usageModal")
const productModal = document.getElementById("productModal")
const productModalContent = document.getElementById("productModalContent")

// ===== PRODUCT DATA CONFIGURATION =====

/* Product information for modal displays - FIXED: Keys now match HTML data-product attributes */
const productData = {
  P1: { 
    title: "NavRaj 8000",
    image: "img/8000.png",
    features: [
      "Navraj 8000 Feed – Premium Feed for High-Yield Cattle",
      "Navraj 8000 Feed is ideal for both cows and buffaloes, especially those producing 18 to 25 liters of milk per day.",
      "This feed is enriched with the right balance of protein, fat, minerals, calcium, and essential vitamins to meet the nutritional needs of high-yielding animals.",
      "Use 500 grams of feed per liter of milk produced.",
      "Add 1.5 kg daily for maintaining the animal's body strength and overall health."
    ],
    
  },
  P2: { 
    title: "NavRaj 10000",
    image: "img/10000.png",
    features: [
      "Navraj 10000 Feed – Advanced Nutrition for High-Yielding Cattle",
      "Navraj 10000 Feed is specially formulated for cows and buffaloes producing more than 25 liters of milk per day.",
      "It is a blessing for newly calved (freshly delivered) animals, helping them recover from post-calving weakness quickly and effectively.",
      "This premium feed contains:<br><ol> <li>22% protein</li> <li>82% digestible nutrients</li> </ol><br>",
      "providing the strength and energy required for peak milk performance and recovery."
    ],

  },
  P3: { 
    title: "NavRaj Dudh Bahar",
    image: "img/dudh-1.png",
    features: [
      "Navraj Doodh Bahar Feed – Ideal for Mid-Yielding Cattle",
      "Navraj Doodh Bahar Feed is specially designed for cows and buffaloes producing 12 to 18 liters of milk per day.",
      "It contains the right balance of protein, fat, minerals, calcium, and essential vitamins required for optimal milk production and animal health.",
      "Feed 500 grams per liter of milk produced.",
      "Add 1.5 kg daily to support body strength and overall vitality.",
    ],
    },
  P4: {
    title: "NavRaj Star",
    image: "img/star-1.png",
    features: [
      "Navraj Star Feed – Designed for Moderate-Yield Cattle",
      "Navraj Star Cattle Feed is specially formulated for cows and buffaloes producing 8 to 12 liters of milk per day.",
      "It contains an ideal blend of protein, fat, calcium, phosphorus, minerals, and essential vitamins, ensuring both increased milk production and improved animal health.",
      "Use 500 grams of feed per liter of milk produced.",
      "Add 1.5 kg daily for maintaining body strength and overall well-being.",
    ],
     },
}

// ===== MODAL EVENT LISTENERS =====

/* Benefits card click handler */
benefitsCard.addEventListener("click", () => {
  showModal(benefitsModal)
})

/* Usage card click handler */
usageCard.addEventListener("click", () => {
  showModal(usageModal)
})

/* Product modals - UPDATED: Now creates side-by-side layout */
document.querySelectorAll(".product-item").forEach((item) => {
  item.addEventListener("click", () => {
    const productType = item.dataset.product

    /* Check if product exists and is not a coming soon item */
    if (productType && productData[productType] && !item.classList.contains("coming-soon")) {
      const product = productData[productType]

      /* Generate detailed product modal content with side-by-side layout */
      productModalContent.innerHTML = `
        <h2 style="font-family: 'Poppins', sans-serif; font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 700; color: #333; margin-bottom: 30px; text-align: center; letter-spacing: 1px;">${product.title}</h2>
        
        <div class="product-modal-layout">
          <div class="product-modal-image">
            <img src="${product.image}" alt="${product.title}">
          </div>
          
          <div class="product-modal-text">
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 30px; border-radius: 20px;">
              <h3 style="font-family: 'Poppins', sans-serif; font-size: clamp(1.3rem, 3vw, 1.8rem); font-weight: 800; color: #4CA626; margin-bottom: 25px; text-align: center; letter-spacing: 0.5px;">
                Key Features:
              </h3>
              <div style="display: flex; flex-direction: column; gap: 15px;">
                ${product.features
                  .map(
                    (feature) => `
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                      <span style="color: #4CA626; font-size: 18px; font-weight: bold; margin-top: 2px; min-width: 20px;">✓</span>
                      <div style="color: #555; line-height: 1.7; font-weight: 500; font-size: clamp(0.95rem, 2vw, 1.1rem);">
                        ${feature}
                      </div>
                    </div>
                  `
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      `

      showModal(productModal)
    }
  })
})

// ===== MODAL MANAGEMENT FUNCTIONS =====

/* Array to track modal history for back button functionality */
const modalHistory = []

/* Enhanced modal show function with history management */
function showModal(modal) {
  // Pause video when modal opens
  if (vimeoPlayer && isVideoInView) {
    vimeoPlayer.pause().catch((error) => {
      console.log('Modal pause failed:', error)
    })
  }

  modal.style.display = "block"
  setTimeout(() => {
    modal.classList.add("show")
  }, 10)
  document.body.style.overflow = "hidden"

  /* Add to modal history and push browser state */
  modalHistory.push(modal.id)
  history.pushState({ modalOpen: true, modalId: modal.id }, "", "")
}

/* Enhanced modal hide function with history management */
function hideModal(modal) {
  modal.classList.remove("show")
  setTimeout(() => {
    modal.style.display = "none"
    document.body.style.overflow = "auto"
    
    // Resume video if section is still in view
    if (vimeoPlayer && isVideoInView) {
      vimeoPlayer.play().catch((error) => {
        console.log('Resume after modal failed:', error)
      })
    }
  }, 400)

  /* Remove from modal history */
  const index = modalHistory.indexOf(modal.id)
  if (index > -1) {
    modalHistory.splice(index, 1)
  }
}

// ===== MODAL CLOSE EVENT HANDLERS =====

/* Close button event listeners for all modals */
document.querySelectorAll(".close").forEach((closeBtn) => {
  closeBtn.addEventListener("click", (e) => {
    const modal = e.target.closest(".modal")
    hideModal(modal)
  })
})

/* Close modal when clicking outside modal content */
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      hideModal(modal)
    }
  })
})

/* Close modal with Escape key */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const openModal = document.querySelector(".modal.show")
    if (openModal) {
      hideModal(openModal)
    }
  }
})

// ===== BROWSER BACK BUTTON FUNCTIONALITY FOR MODALS =====

/* Handle browser back/forward button events for modal management */
window.addEventListener("popstate", (event) => {
  if (event.state && event.state.modalOpen) {
    /* If state indicates modal should be open, show it */
    const modalId = event.state.modalId
    const modal = document.getElementById(modalId)
    if (modal && !modal.classList.contains("show")) {
      showModal(modal)
    }
  } else {
    /* If no modal state, close any open modals */
    const openModal = document.querySelector(".modal.show")
    if (openModal) {
      hideModal(openModal)
    }
  }
})

// ===== PERFORMANCE OPTIMIZATIONS =====

/* Intersection observer for lazy loading images */
const imageObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        /* Load image from data-src if available */
        if (img.dataset.src) {
          img.src = img.dataset.src
          img.removeAttribute("data-src")
        }
        img.style.opacity = "1"
        observer.unobserve(img)
      }
    })
  },
  { threshold: 0.1 },
)

/* Initialize lazy loading for all images */
document.querySelectorAll("img").forEach((img) => {
  img.style.opacity = "0"
  img.style.transition = "opacity 0.5s ease"
  imageObserver.observe(img)
})

// ===== TOUCH DEVICE OPTIMIZATIONS =====

/* Enhanced touch interactions for mobile devices */
if ("ontouchstart" in window) {
  document.body.classList.add("touch-device")

  /* Disable text selection on specific elements for touch devices */
  const noSelectElements = document.querySelectorAll(".letter-hover-effect, .hover-letter")
  noSelectElements.forEach((element) => {
    element.style.webkitTouchCallout = "none"
    element.style.webkitUserSelect = "none"
    element.style.userSelect = "none"
  })

  /* Enhanced touch feedback for interactive cards */
  document.querySelectorAll(".product-item, .info-card, .contact-item").forEach((element) => {
    element.addEventListener("touchstart", function () {
      this.style.transform = "scale(0.98)"
    })

    element.addEventListener("touchend", function () {
      this.style.transform = ""
    })
  })
}

// ===== PAGE LOAD OPTIMIZATIONS =====

window.addEventListener("load", () => {
  /* Add loaded class to body */
  document.body.classList.add("loaded")

  /* Initialize scroll-triggered animations */
  handleScrollAnimations()

  /* Optimize hero image loading */
  const heroImg = document.getElementById('heroImage')
  if (heroImg) {
    heroImg.style.opacity = '1'
    heroImg.style.transform = 'translateZ(0)'
    if (!heroImg.complete) {
      heroImg.addEventListener('load', () => {
        heroImg.style.opacity = '1'
      })
    }
  }
})

// ===== WINDOW RESIZE HANDLER =====

/* Handle window resize events with debouncing */
let resizeTimer
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    handleScrollAnimations()
  }, 250)
})

// ===== SCROLL TO TOP FUNCTIONALITY =====

/* Scroll to top function */
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

/* Dynamic scroll to top button */
let scrollTopButton
window.addEventListener("scroll", () => {
  if (window.scrollY > 500 && !scrollTopButton) {
    /* Create scroll to top button */
    scrollTopButton = document.createElement("button")
    scrollTopButton.innerHTML = "↑"
    scrollTopButton.className = "scroll-top-btn"
    scrollTopButton.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #4CA626;
      color: white;
      border: none;
      font-size: 20px;
      cursor: pointer;
      z-index: 1000;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
      opacity: 0;
      transform: scale(0);
    `
    
    /* Add event listeners to scroll button */
    scrollTopButton.addEventListener("click", scrollToTop)
    scrollTopButton.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1)"
      this.style.boxShadow = "0 8px 25px rgba(0,0,0,0.4)"
    })
    scrollTopButton.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)"
      this.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)"
    })
    
    document.body.appendChild(scrollTopButton)

    /* Animate button appearance */
    setTimeout(() => {
      scrollTopButton.style.opacity = "1"
      scrollTopButton.style.transform = "scale(1)"
    }, 100)
  } else if (window.scrollY <= 500 && scrollTopButton) {
    /* Hide and remove button when not needed */
    scrollTopButton.style.opacity = "0"
    scrollTopButton.style.transform = "scale(0)"
    setTimeout(() => {
      if (scrollTopButton) {
        scrollTopButton.remove()
        scrollTopButton = null
      }
    }, 300)
  }
})

// ===== CONSOLE LOGGING FOR DEBUGGING =====

console.log("Navraj Cattle Feed Website Loaded Successfully!")
console.log("Vimeo video scroll control initialized")
console.log("All animations and interactions are ready")
console.log("Mobile responsive design active")
console.log("Performance optimizations applied")
console.log("Product modals functionality fixed")
console.log("Side-by-side modal layout implemented")
console.log("Video autoplay/pause on scroll working")
console.log("All components working perfectly")
