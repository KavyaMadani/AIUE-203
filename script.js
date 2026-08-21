/* =========================================
   StudentHub - Practical 4
   JavaScript DOM Manipulation
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       1. HAMBURGER MENU
       ===================================== */

    const menuButton = document.getElementById("menuButton");
    const mainNav = document.getElementById("mainNav");

    if (menuButton && mainNav) {

        menuButton.addEventListener("click", function () {

            mainNav.classList.toggle("show");

            const isOpen = mainNav.classList.contains("show");

            menuButton.setAttribute("aria-expanded", isOpen);

        });
    }


    /* =====================================
       2. DARK / LIGHT THEME
       ===================================== */

    const themeButton = document.getElementById("themeButton");

    // Restore saved theme
    const savedTheme = localStorage.getItem("studenthub-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");

        if (themeButton) {
            themeButton.textContent = "☀️ Light Mode";
        }
    }

    if (themeButton) {

        themeButton.addEventListener("click", function () {

            document.body.classList.toggle("dark-theme");

            const darkMode =
                document.body.classList.contains("dark-theme");

            if (darkMode) {

                localStorage.setItem(
                    "studenthub-theme",
                    "dark"
                );

                themeButton.textContent = "☀️ Light Mode";

            } else {

                localStorage.setItem(
                    "studenthub-theme",
                    "light"
                );

                themeButton.textContent = "🌙 Dark Mode";
            }

        });
    }


    /* =====================================
       3. NOTIFICATION BANNER
       ===================================== */

    const notification = document.getElementById("notification");
    const closeNotification =
        document.getElementById("closeNotification");

    if (notification && closeNotification) {

        closeNotification.addEventListener("click", function () {

            notification.style.display = "none";

        });
    }


    /* =====================================
       4. MODAL POPUP
       ===================================== */

    const modal = document.getElementById("eventModal");
    const openModal = document.getElementById("openModal");
    const closeModal = document.getElementById("closeModal");

    if (modal && openModal) {

        openModal.addEventListener("click", function () {

            modal.classList.add("active");

            document.body.style.overflow = "hidden";

            if (closeModal) {
                closeModal.focus();
            }

        });
    }

    if (modal && closeModal) {

        closeModal.addEventListener("click", function () {

            modal.classList.remove("active");

            document.body.style.overflow = "";

            if (openModal) {
                openModal.focus();
            }

        });
    }

    // Close modal by clicking outside
    if (modal) {

        modal.addEventListener("click", function (event) {

            if (event.target === modal) {

                modal.classList.remove("active");

                document.body.style.overflow = "";

            }

        });
    }

    // Close modal using Escape
    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape" && modal) {

            modal.classList.remove("active");

            document.body.style.overflow = "";

        }

    });


    /* =====================================
       5. FAQ COLLAPSIBLE
       ===================================== */

    const faqButtons =
        document.querySelectorAll(".faq-question");

    faqButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const answer =
                button.nextElementSibling;

            const isOpen =
                button.getAttribute("aria-expanded") === "true";

            // Close all other answers
            faqButtons.forEach(function (otherButton) {

                if (otherButton !== button) {

                    otherButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    const otherAnswer =
                        otherButton.nextElementSibling;

                    if (otherAnswer) {
                        otherAnswer.hidden = true;
                    }
                }

            });

            // Toggle selected answer
            button.setAttribute(
                "aria-expanded",
                !isOpen
            );

            if (answer) {
                answer.hidden = isOpen;
            }

        });

    });


    /* =====================================
       6. CONTENT SLIDER
       ===================================== */

    const slides =
        document.querySelectorAll(".slide");

    const previousButton =
        document.getElementById("previousSlide");

    const nextButton =
        document.getElementById("nextSlide");

    let currentSlide = 0;


    function showSlide(index) {

        if (slides.length === 0) {
            return;
        }

        slides.forEach(function (slide) {

            slide.classList.remove("active-slide");

        });

        slides[index].classList.add("active-slide");

    }


    if (nextButton) {

        nextButton.addEventListener("click", function () {

            currentSlide++;

            if (currentSlide >= slides.length) {
                currentSlide = 0;
            }

            showSlide(currentSlide);

        });

    }


    if (previousButton) {

        previousButton.addEventListener("click", function () {

            currentSlide--;

            if (currentSlide < 0) {
                currentSlide = slides.length - 1;
            }

            showSlide(currentSlide);

        });

    }


    // Automatically change slide
    if (slides.length > 1) {

        setInterval(function () {

            currentSlide++;

            if (currentSlide >= slides.length) {
                currentSlide = 0;
            }

            showSlide(currentSlide);

        }, 5000);

    }


    /* =====================================
       7. BUTTON CLICK DEMO
       ===================================== */

    const welcomeButton =
        document.getElementById("welcomeButton");

    if (welcomeButton) {

        welcomeButton.addEventListener("click", function () {

            alert(
                "Welcome to StudentHub! 🎓"
            );

        });

    }


    /* =====================================
       8. FORM SUBMISSION DEMO
       ===================================== */

    const demoForm =
        document.getElementById("demoForm");

    if (demoForm) {

        demoForm.addEventListener("submit", function (event) {

            event.preventDefault();

            alert(
                "Form submitted successfully!"
            );

        });

    }

});