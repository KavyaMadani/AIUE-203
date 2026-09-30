/* ============================================
   STUDENTHUB - PRACTICAL 6
   Fetch API + JSON + Search + Filter
   Sort + Pagination + Error Handling
   ============================================ */


/* ============================================
   GLOBAL VARIABLES
   ============================================ */

let eventsData = [];
let studentsData = [];
let faqsData = [];

let eventPage = 1;
let studentPage = 1;
let faqPage = 1;

const recordsPerPage = 5;


/* ============================================
   COMMON INITIALIZATION
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {

    setupNavigation();
    setupTheme();

    loadEvents();
    loadStudents();
    loadFAQs();

});


/* ============================================
   NAVIGATION
   ============================================ */

function setupNavigation() {

    const menuButton =
        document.getElementById("menuButton");

    const mainNav =
        document.getElementById("mainNav");

    if (menuButton && mainNav) {

        menuButton.addEventListener(
            "click",
            function () {

                mainNav.classList.toggle("show");

                const isOpen =
                    mainNav.classList.contains("show");

                menuButton.setAttribute(
                    "aria-expanded",
                    isOpen
                );

            }
        );

    }

}


/* ============================================
   DARK / LIGHT THEME
   ============================================ */

function setupTheme() {

    const themeButton =
        document.getElementById("themeButton");

    const savedTheme =
        localStorage.getItem(
            "studenthub-theme"
        );

    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

        if (themeButton) {

            themeButton.textContent =
                "☀️ Light Mode";

        }

    }

    if (themeButton) {

        themeButton.addEventListener(
            "click",
            function () {

                document.body.classList.toggle(
                    "dark-theme"
                );

                const isDark =
                    document.body.classList.contains(
                        "dark-theme"
                    );

                if (isDark) {

                    localStorage.setItem(
                        "studenthub-theme",
                        "dark"
                    );

                    themeButton.textContent =
                        "☀️ Light Mode";

                } else {

                    localStorage.setItem(
                        "studenthub-theme",
                        "light"
                    );

                    themeButton.textContent =
                        "🌙 Dark Mode";

                }

            }
        );

    }

}


/* ============================================
   FETCH EVENTS
   ============================================ */

async function loadEvents() {

    const container =
        document.getElementById("eventsContainer");

    if (!container) {
        return;
    }

    showLoading(container);

    try {

        const response =
            await fetch("events.json");

        if (!response.ok) {

            throw new Error(
                "Unable to load events."
            );

        }

        eventsData =
            await response.json();

        displayEvents();

        setupEventControls();

    } catch (error) {

        showError(
            container,
            error.message
        );

        console.error(
            "Events Error:",
            error
        );

    }

}


/* ============================================
   DISPLAY EVENTS
   ============================================ */

function displayEvents() {

    const container =
        document.getElementById(
            "eventsContainer"
        );

    if (!container) {
        return;
    }

    const searchInput =
        document.getElementById(
            "eventSearch"
        );

    const categoryFilter =
        document.getElementById(
            "eventCategory"
        );

    const sortSelect =
        document.getElementById(
            "eventSort"
        );


    let data =
        [...eventsData];


    /* SEARCH */

    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    if (search) {

        data =
            data.filter(function (event) {

                return (
                    event.title
                        .toLowerCase()
                        .includes(search)

                    ||

                    event.description
                        .toLowerCase()
                        .includes(search)

                    ||

                    event.organizer
                        .toLowerCase()
                        .includes(search)
                );

            });

    }


    /* FILTER */

    const category =
        categoryFilter
            ? categoryFilter.value
            : "All";


    if (category !== "All") {

        data =
            data.filter(function (event) {

                return event.category === category;

            });

    }


    /* SORT */

    const sort =
        sortSelect
            ? sortSelect.value
            : "dateAsc";


    if (sort === "dateAsc") {

        data.sort(function (a, b) {

            return new Date(a.date) -
                   new Date(b.date);

        });

    }


    if (sort === "dateDesc") {

        data.sort(function (a, b) {

            return new Date(b.date) -
                   new Date(a.date);

        });

    }


    if (sort === "nameAsc") {

        data.sort(function (a, b) {

            return a.title.localeCompare(
                b.title
            );

        });

    }


    /* PAGINATION */

    const totalPages =
        Math.ceil(
            data.length / recordsPerPage
        );


    if (eventPage > totalPages) {

        eventPage =
            Math.max(totalPages, 1);

    }


    const start =
        (eventPage - 1) *
        recordsPerPage;


    const pageData =
        data.slice(
            start,
            start + recordsPerPage
        );


    /* RENDER */

    if (pageData.length === 0) {

        container.innerHTML =
            `<p class="no-data">
                No events found.
            </p>`;

    } else {

        container.innerHTML =
            pageData
                .map(function (event) {

                    return `
                        <article class="data-card">

                            <h3>${event.title}</h3>

                            <p>
                                <strong>Category:</strong>
                                ${event.category}
                            </p>

                            <p>
                                <strong>Date:</strong>
                                ${event.date}
                            </p>

                            <p>
                                <strong>Venue:</strong>
                                ${event.venue}
                            </p>

                            <p>
                                <strong>Organizer:</strong>
                                ${event.organizer}
                            </p>

                            <p>
                                ${event.description}
                            </p>

                        </article>
                    `;

                })
                .join("");

    }


    renderPagination(
        "eventPagination",
        eventPage,
        totalPages,
        function (page) {

            eventPage = page;

            displayEvents();

        }
    );

}


/* ============================================
   EVENT CONTROLS
   ============================================ */

function setupEventControls() {

    const searchInput =
        document.getElementById(
            "eventSearch"
        );

    const categoryFilter =
        document.getElementById(
            "eventCategory"
        );

    const sortSelect =
        document.getElementById(
            "eventSort"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                eventPage = 1;

                displayEvents();

            }
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            function () {

                eventPage = 1;

                displayEvents();

            }
        );

    }


    if (sortSelect) {

        sortSelect.addEventListener(
            "change",
            function () {

                eventPage = 1;

                displayEvents();

            }
        );

    }

}


/* ============================================
   FETCH STUDENTS
   ============================================ */

async function loadStudents() {

    const container =
        document.getElementById(
            "studentsContainer"
        );

    if (!container) {
        return;
    }

    showLoading(container);

    try {

        const response =
            await fetch("students.json");

        if (!response.ok) {

            throw new Error(
                "Unable to load students."
            );

        }

        studentsData =
            await response.json();

        displayStudents();

        setupStudentControls();

    } catch (error) {

        showError(
            container,
            error.message
        );

        console.error(
            "Students Error:",
            error
        );

    }

}


/* ============================================
   DISPLAY STUDENTS
   ============================================ */

function displayStudents() {

    const container =
        document.getElementById(
            "studentsContainer"
        );

    if (!container) {
        return;
    }


    const searchInput =
        document.getElementById(
            "studentSearch"
        );

    const courseFilter =
        document.getElementById(
            "studentCourse"
        );

    const sortSelect =
        document.getElementById(
            "studentSort"
        );


    let data =
        [...studentsData];


    /* SEARCH */

    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    if (search) {

        data =
            data.filter(function (student) {

                return (

                    student.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    student.course
                        .toLowerCase()
                        .includes(search)

                    ||

                    student.city
                        .toLowerCase()
                        .includes(search)

                );

            });

    }


    /* FILTER */

    const course =
        courseFilter
            ? courseFilter.value
            : "All";


    if (course !== "All") {

        data =
            data.filter(function (student) {

                return student.course === course;

            });

    }


    /* SORT */

    const sort =
        sortSelect
            ? sortSelect.value
            : "nameAsc";


    if (sort === "nameAsc") {

        data.sort(function (a, b) {

            return a.name.localeCompare(
                b.name
            );

        });

    }


    if (sort === "nameDesc") {

        data.sort(function (a, b) {

            return b.name.localeCompare(
                a.name
            );

        });

    }


    if (sort === "yearAsc") {

        data.sort(function (a, b) {

            return a.year - b.year;

        });

    }


    /* PAGINATION */

    const totalPages =
        Math.ceil(
            data.length / recordsPerPage
        );


    if (studentPage > totalPages) {

        studentPage =
            Math.max(totalPages, 1);

    }


    const start =
        (studentPage - 1) *
        recordsPerPage;


    const pageData =
        data.slice(
            start,
            start + recordsPerPage
        );


    /* RENDER */

    if (pageData.length === 0) {

        container.innerHTML =
            `<p class="no-data">
                No students found.
            </p>`;

    } else {

        container.innerHTML =
            pageData
                .map(function (student) {

                    return `
                        <article class="data-card">

                            <h3>
                                ${student.name}
                            </h3>

                            <p>
                                <strong>Course:</strong>
                                ${student.course}
                            </p>

                            <p>
                                <strong>Year:</strong>
                                ${student.year}
                            </p>

                            <p>
                                <strong>Department:</strong>
                                ${student.department}
                            </p>

                            <p>
                                <strong>Email:</strong>
                                ${student.email}
                            </p>

                            <p>
                                <strong>City:</strong>
                                ${student.city}
                            </p>

                        </article>
                    `;

                })
                .join("");

    }


    renderPagination(
        "studentPagination",
        studentPage,
        totalPages,
        function (page) {

            studentPage = page;

            displayStudents();

        }
    );

}


/* ============================================
   STUDENT CONTROLS
   ============================================ */

function setupStudentControls() {

    const searchInput =
        document.getElementById(
            "studentSearch"
        );

    const courseFilter =
        document.getElementById(
            "studentCourse"
        );

    const sortSelect =
        document.getElementById(
            "studentSort"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                studentPage = 1;

                displayStudents();

            }
        );

    }


    if (courseFilter) {

        courseFilter.addEventListener(
            "change",
            function () {

                studentPage = 1;

                displayStudents();

            }
        );

    }


    if (sortSelect) {

        sortSelect.addEventListener(
            "change",
            function () {

                studentPage = 1;

                displayStudents();

            }
        );

    }

}


/* ============================================
   FETCH FAQs
   ============================================ */

async function loadFAQs() {

    const container =
        document.getElementById(
            "faqContainer"
        );

    if (!container) {
        return;
    }

    showLoading(container);

    try {

        const response =
            await fetch("faqs.json");

        if (!response.ok) {

            throw new Error(
                "Unable to load FAQs."
            );

        }

        faqsData =
            await response.json();

        displayFAQs();

        setupFAQControls();

    } catch (error) {

        showError(
            container,
            error.message
        );

        console.error(
            "FAQ Error:",
            error
        );

    }

}


/* ============================================
   DISPLAY FAQs
   ============================================ */

function displayFAQs() {

    const container =
        document.getElementById(
            "faqContainer"
        );

    if (!container) {
        return;
    }


    const searchInput =
        document.getElementById(
            "faqSearch"
        );

    const categoryFilter =
        document.getElementById(
            "faqCategory"
        );


    let data =
        [...faqsData];


    /* SEARCH */

    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    if (search) {

        data =
            data.filter(function (faq) {

                return (

                    faq.question
                        .toLowerCase()
                        .includes(search)

                    ||

                    faq.answer
                        .toLowerCase()
                        .includes(search)

                );

            });

    }


    /* FILTER */

    const category =
        categoryFilter
            ? categoryFilter.value
            : "All";


    if (category !== "All") {

        data =
            data.filter(function (faq) {

                return faq.category === category;

            });

    }


    /* PAGINATION */

    const totalPages =
        Math.ceil(
            data.length / recordsPerPage
        );


    if (faqPage > totalPages) {

        faqPage =
            Math.max(totalPages, 1);

    }


    const start =
        (faqPage - 1) *
        recordsPerPage;


    const pageData =
        data.slice(
            start,
            start + recordsPerPage
        );


    /* RENDER */

    if (pageData.length === 0) {

        container.innerHTML =
            `<p class="no-data">
                No FAQs found.
            </p>`;

    } else {

        container.innerHTML =
            pageData
                .map(function (faq) {

                    return `
                        <article class="faq-item">

                            <button
                                class="faq-question"
                                type="button"
                                aria-expanded="false">

                                ${faq.question}

                            </button>

                            <div
                                class="faq-answer"
                                hidden>

                                <p>
                                    ${faq.answer}
                                </p>

                            </div>

                        </article>
                    `;

                })
                .join("");


        /* FAQ CLICK EVENTS */

        const buttons =
            container.querySelectorAll(
                ".faq-question"
            );


        buttons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const answer =
                        button.nextElementSibling;

                    const isOpen =
                        button.getAttribute(
                            "aria-expanded"
                        ) === "true";


                    button.setAttribute(
                        "aria-expanded",
                        !isOpen
                    );


                    answer.hidden =
                        isOpen;

                }
            );

        });

    }


    renderPagination(
        "faqPagination",
        faqPage,
        totalPages,
        function (page) {

            faqPage = page;

            displayFAQs();

        }
    );

}


/* ============================================
   FAQ CONTROLS
   ============================================ */

function setupFAQControls() {

    const searchInput =
        document.getElementById(
            "faqSearch"
        );

    const categoryFilter =
        document.getElementById(
            "faqCategory"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                faqPage = 1;

                displayFAQs();

            }
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            function () {

                faqPage = 1;

                displayFAQs();

            }
        );

    }

}


/* ============================================
   PAGINATION
   ============================================ */

function renderPagination(
    containerId,
    currentPage,
    totalPages,
    changePage
) {

    const container =
        document.getElementById(
            containerId
        );

    if (!container) {
        return;
    }


    if (totalPages <= 1) {

        container.innerHTML = "";

        return;

    }


    let html = "";


    if (currentPage > 1) {

        html += `
            <button
                class="page-button"
                data-page="${currentPage - 1}">

                Previous

            </button>
        `;

    }


    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        html += `
            <button
                class="page-button ${
                    i === currentPage
                        ? "active-page"
                        : ""
                }"
                data-page="${i}">

                ${i}

            </button>
        `;

    }


    if (currentPage < totalPages) {

        html += `
            <button
                class="page-button"
                data-page="${currentPage + 1}">

                Next

            </button>
        `;

    }


    container.innerHTML = html;


    const buttons =
        container.querySelectorAll(
            ".page-button"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const page =
                    Number(
                        button.dataset.page
                    );

                changePage(page);

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    });

}


/* ============================================
   LOADING
   ============================================ */

function showLoading(container) {

    container.innerHTML = `
        <div class="loading">
            Loading data...
        </div>
    `;

}


/* ============================================
   ERROR
   ============================================ */

function showError(
    container,
    message
) {

    container.innerHTML = `
        <div class="error-message">

            <h3>
                Unable to load data
            </h3>

            <p>
                ${message}
            </p>

            <p>
                Please check the JSON file
                and try again.
            </p>

        </div>
    `;

}