// Function to check if device is mobile
function isMobileDevice() {
    return window.innerWidth <= 768 || (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}


// Initialize Swiper only for non-mobile devices
let swiper;
if (!isMobileDevice()) {
    swiper = new Swiper('.mySwiper', {
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 1000,
        mousewheel: {
            enabled: true,
            sensitivity: 1,
            thresholdDelta: 50,
            thresholdTime: 500,
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        touchRatio: 0, // Disable touch on desktop
        touchAngle: 45,
        grabCursor: false,
        effect: 'slide',
        allowTouchMove: false, // Disable touch move
        preventInteractionOnTransition: true,
        on: {
            init: function () {
                animateContentOnSlideChange(this.activeIndex, null, true);
            },
            slideChangeTransitionStart: function () {
                animateContentOnSlideChange(this.activeIndex, this.previousIndex);
            }
        }
    });

    // For mobile devices, we'll add a class to enable normal scrolling
    document.querySelector('.swiper').classList.add('swiper-desktop-only');
} else {
    // Enable normal scrolling for mobile
    document.querySelector('.swiper')?.classList.add('swiper-mobile-scroll');
    document.querySelector('.swiper-wrapper')?.classList.add('mobile-scroll-wrapper');
    document.querySelectorAll('.swiper-slide').forEach(slide => {
        slide.classList.add('mobile-scroll-slide');
    });
}

// Improved content animation function (works for both desktop and mobile)
function animateContentOnSlideChange(currentIndex, previousIndex, isInit = false) {
    const currentSlide = document.querySelectorAll('.swiper-slide')[currentIndex];
    if (!currentSlide) return;

    const content = currentSlide.querySelector('.animated > div');
    if (!content) return;

    // Reset all content positions first
    document.querySelectorAll('.swiper-slide .animated > div').forEach(el => {
        el.style.transform = '';
        el.style.opacity = '';
        el.style.transition = 'none';
    });

    // Force reflow
    void currentSlide.offsetWidth;

    if (!isInit && previousIndex !== undefined) {
        const previousSlide = document.querySelectorAll('.swiper-slide')[previousIndex];
        const prevContent = previousSlide?.querySelector('.animated > div');

        if (prevContent) {
            // Animate out previous content
            const direction = currentIndex > previousIndex ? -50 : 50;
            prevContent.style.transition = 'transform 1.8s ease, opacity 1.8s ease';
            prevContent.style.transform = `translateY(${direction}px)`;
            prevContent.style.opacity = '0';
        }
    }

    // Set initial state for current content
    const initialY = isInit ? 0 : (previousIndex === undefined ? 0 : (currentIndex > previousIndex ? 50 : -50));
    content.style.transform = `translateY(${initialY}px)`;
    content.style.opacity = '0';

    // Force reflow before animating
    void content.offsetWidth;

    // Animate to final position
    content.style.transition = 'transform 1.8s ease, opacity 1.8s ease';
    content.style.transform = 'translateY(0)';
    content.style.opacity = '1';

    setTimeout(() => {
        content.style.transition = 'none';
    }, 2000);
}

// Initialize background sliders for all sections
function initBackgroundSliders() {
    const sliders = document.querySelectorAll('.background-slider');

    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.bg-slide');
        let currentSlide = 0;

        // Set initial positions for slides
        slides.forEach((slide, index) => {
            slide.style.transform = `translateY(${index * 100}%)`;
        });

        // If this is the hero section, add arrow functionality
        if (slider.closest('.hero-section')) {
            const arrow = document.getElementById('scrollArrow');
            if (arrow) {
                arrow.addEventListener('click', () => {
                    currentSlide = (currentSlide + 1) % slides.length;
                    slider.style.transform = `translateY(-${currentSlide * 100}%)`;
                });
            }
        }
    });
}

// Initialize all background sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initBackgroundSliders();

    // Video controls
    const video = document.querySelector('.video-background video');
    const playBtn = document.getElementById('videoControlBtn');
    if (video && playBtn) {
        const playIcon = playBtn.querySelector('svg path');

        // Initially video is autoplaying (muted)
        let isPlaying = true;

        // Toggle play/pause on button click
        playBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (isPlaying) {
                video.play();
                playIcon.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');
            } else {
                video.pause();
                playIcon.setAttribute('d', 'M8 5v14l11-7z');
            }
            isPlaying = !isPlaying;
        });

        // Change button to pause icon when user clicks directly on video
        video.addEventListener('click', function () {
            if (isPlaying) {
                video.play();
                playIcon.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');
            } else {
                video.pause();
                playIcon.setAttribute('d', 'M8 5v14l11-7z');
            }
            isPlaying = !isPlaying;
        });

        // Update button state when video ends
        video.addEventListener('ended', function () {
            isPlaying = false;
            playIcon.setAttribute('d', 'M8 5v14l11-7z');
        });
    }

    // Smooth scroll behavior for explore button
    const exploreBtn = document.querySelector('.explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            swiper.slideNext();
        });
    }
});

function openPopup(index) {
    const popupContent = document.getElementById('popupContent');
    const popupOverlay = document.getElementById('popupOverlay');

    switch (index) {
        case 1:
            popupContent.innerHTML = `
            <form id="class-registration-form">
            <h1 class="popup_header">JOIN OUR CLASSES</h1>
                    <div class="form-group">
                        <label for="full-name">Full Name *</label>
                        <input type="text" id="full-name" placeholder="Full Name" name="full-name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="email" id="email" placeholder="Email" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Phone *</label>
                        <input type="tel" id="phone" placeholder="Phone Number" name="phone" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Are you asthmatic?</label>
                        <div>
                            <div class="checkbox-group">
                                <input class="popup_checkbox" type="checkbox" id="asthmatic-yes" name="asthmatic" value="yes">
                                <label for="asthmatic-yes">Yes</label>
                            </div>
                            <div class="checkbox-group">
                                <input class="popup_checkbox" type="checkbox" id="asthmatic-no" name="asthmatic" value="no">
                                <label for="asthmatic-no">No</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Do you have any physical injury we should be mindful of?</label>
                        <div>
                            <div class="checkbox-group">
                                <input class="popup_checkbox" type="checkbox" id="injury-yes" name="injury" value="yes">
                                <label for="injury-yes">Yes</label>
                            </div>
                            <div class="checkbox-group">
                                <input class="popup_checkbox" type="checkbox" id="injury-no" name="injury" value="no">
                                <label for="injury-no">No</label>
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" class="submit-btn">SUBMIT & BOOK YOUR GRILL</button>
                    
                    <p class="disclaimer">"By submitting this form, you acknowledge and accept the risks associated with martial training. The instructor and the foundation are not liable for any injuries sustained during practice. We do not share your information with third parties."</p>
                </form>
            `;

            // Call the checkbox function AFTER setting innerHTML
            handleCheckboxGroup('asthmatic-yes', 'asthmatic-no');
            handleCheckboxGroup('injury-yes', 'injury-no');
            break;

        case 2:
            popupContent.textContent = 'Second Popup';
            break;

        case 3:
            popupContent.textContent = 'Third Popup';
            break;
    }

    popupOverlay.style.display = 'flex';

    // Define the handleCheckboxGroup function outside the switch statement
    function handleCheckboxGroup(group1Id, group2Id) {
        const checkbox1 = document.getElementById(group1Id);
        const checkbox2 = document.getElementById(group2Id);

        if (checkbox1 && checkbox2) {
            checkbox1.addEventListener('change', function () {
                if (this.checked) {
                    checkbox2.checked = false;
                }
            });

            checkbox2.addEventListener('change', function () {
                if (this.checked) {
                    checkbox1.checked = false;
                }
            });
        }
    }
}

function closePopup() {
    document.getElementById('popupOverlay').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const closeMenu = document.querySelector('.close-menu');

    mobileMenuToggle.addEventListener('click', function () {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });

    closeMenu.addEventListener('click', function () {
        mobileNav.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    });

    // Close menu when clicking on a link
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
});