/* ==========================================
   STUDENTHUB - PRACTICAL 6
   Fetch API + JSON + Search + Filter
   Sort + Pagination
   ========================================== */

let eventsData = [];
let studentsData = [];
let faqsData = [];

let eventPage = 1;
let studentPage = 1;
let faqPage = 1;

const recordsPerPage = 4;


/* ==========================================
   PAGE LOAD
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    setupMenu();
    setupTheme();

    loadEvents();
    loadStudents();
    loadFAQs();

});


/* ==========================================
   HAMBURGER MENU
   ========================================== */

function setupMenu() {

    const button = document.getElementById("menuButton");
    const nav = document.getElementById("mainNav");

    if (!button || !nav) return;

    button.addEventListener("click", () => {

        nav.classList.toggle("show");

        const opened = nav.classList.contains("show");

        button.setAttribute(
            "aria-expanded",
            opened
        );

    });

}


/* ==========================================
   DARK MODE
   ========================================== */

function setupTheme() {

    const button =
        document.getElementById("themeButton");

    if (!button) return;

    const saved =
        localStorage.getItem("studenthub-theme");

    if (saved === "dark") {

        document.body.classList.add("dark-theme");

        button.textContent = "☀ Light Mode";

    }

    button.addEventListener("click", () => {

        document.body.classList.toggle("dark-theme");

        const dark =
            document.body.classList.contains(
                "dark-theme"
            );

        localStorage.setItem(
            "studenthub-theme",
            dark ? "dark" : "light"
        );

        button.textContent =
            dark ? "☀ Light Mode" : "🌙 Dark Mode";

    });

}


/* ==========================================
   EVENTS - FETCH
   ========================================== */

async function loadEvents() {

    const container =
        document.getElementById("eventsContainer");

    if (!container) return;

    showLoading(container);

    try {

        const response =
            await fetch("events.json");

        if (!response.ok) {
            throw new Error("Events JSON could not be loaded.");
        }

        eventsData =
            await response.json();

        createEventCategoryOptions();

        displayEvents();

        setupEventControls();

    } catch (error) {

        showError(container, error.message);

        console.error(error);

    }

}


/* ==========================================
   EVENT CATEGORY OPTIONS
   ========================================== */

function createEventCategoryOptions() {

    const select =
        document.getElementById("eventCategory");

    if (!select) return;

    const categories =
        [...new Set(
            eventsData.map(event => event.category)
        )];

    select.innerHTML =
        `<option value="All">All Categories</option>`;

    categories.forEach(category => {

        select.innerHTML += `
            <option value="${category}">
                ${category}
            </option>
        `;

    });

}


/* ==========================================
   DISPLAY EVENTS
   ========================================== */

function displayEvents() {

    const container =
        document.getElementById("eventsContainer");

    if (!container) return;

    let data = [...eventsData];

    const searchInput =
        document.getElementById("eventSearch");

    const category =
        document.getElementById("eventCategory");

    const sort =
        document.getElementById("eventSort");


    const search =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    /* SEARCH */

    if (search) {

        data = data.filter(event =>

            event.title.toLowerCase().includes(search) ||

            event.description.toLowerCase().includes(search) ||

            event.organizer.toLowerCase().includes(search)

        );

    }


    /* FILTER */

    if (category && category.value !== "All") {

        data = data.filter(event =>
            event.category === category.value
        );

    }


    /* SORT */

    if (sort) {

        if (sort.value === "dateAsc") {

            data.sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            );

        }

        if (sort.value === "dateDesc") {

            data.sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            );

        }

        if (sort.value === "nameAsc") {

            data.sort(
                (a, b) =>
                    a.title.localeCompare(b.title)
            );

        }

    }


    /* PAGINATION */

    const totalPages =
        Math.ceil(data.length / recordsPerPage);

    if (eventPage > totalPages) {
        eventPage = Math.max(totalPages, 1);
    }

    const start =
        (eventPage - 1) * recordsPerPage;

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
            pageData.map(event => `

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

            `).join("");

    }


    renderPagination(
        "eventPagination",
        eventPage,
        totalPages,
        page => {

            eventPage = page;
            displayEvents();

        }
    );

}


/* ==========================================
   EVENT CONTROLS
   ========================================== */

function setupEventControls() {

    const search =
        document.getElementById("eventSearch");

    const category =
        document.getElementById("eventCategory");

    const sort =
        document.getElementById("eventSort");


    if (search) {

        search.addEventListener("input", () => {

            eventPage = 1;
            displayEvents();

        });

    }


    if (category) {

        category.addEventListener("change", () => {

            eventPage = 1;
            displayEvents();

        });

    }


    if (sort) {

        sort.addEventListener("change", () => {

            eventPage = 1;
            displayEvents();

        });

    }

}


/* ==========================================
   STUDENTS - FETCH
   ========================================== */

async function loadStudents() {

    const container =
        document.getElementById("studentsContainer");

    if (!container) return;

    showLoading(container);

    try {

        const response =
            await fetch("students.json");

        if (!response.ok) {
            throw new Error(
                "Students JSON could not be loaded."
            );
        }

        studentsData =
            await response.json();

        createCourseOptions();

        displayStudents();

        setupStudentControls();

    } catch (error) {

        showError(container, error.message);

        console.error(error);

    }

}


/* ==========================================
   COURSE OPTIONS
   ========================================== */

function createCourseOptions() {

    const select =
        document.getElementById("studentCourse");

    if (!select) return;

    const courses =
        [...new Set(
            studentsData.map(student => student.course)
        )];

    select.innerHTML =
        `<option value="All">All Courses</option>`;

    courses.forEach(course => {

        select.innerHTML += `
            <option value="${course}">
                ${course}
            </option>
        `;

    });

}


/* ==========================================
   DISPLAY STUDENTS
   ========================================== */

function displayStudents() {

    const container =
        document.getElementById("studentsContainer");

    if (!container) return;

    let data = [...studentsData];

    const searchInput =
        document.getElementById("studentSearch");

    const course =
        document.getElementById("studentCourse");

    const sort =
        document.getElementById("studentSort");


    const search =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    /* SEARCH */

    if (search) {

        data = data.filter(student =>

            student.name.toLowerCase().includes(search) ||

            student.course.toLowerCase().includes(search) ||

            student.city.toLowerCase().includes(search)

        );

    }


    /* FILTER */

    if (course && course.value !== "All") {

        data = data.filter(student =>
            student.course === course.value
        );

    }


    /* SORT */

    if (sort) {

        if (sort.value === "nameAsc") {

            data.sort(
                (a, b) =>
                    a.name.localeCompare(b.name)
            );

        }

        if (sort.value === "nameDesc") {

            data.sort(
                (a, b) =>
                    b.name.localeCompare(a.name)
            );

        }

        if (sort.value === "yearAsc") {

            data.sort(
                (a, b) =>
                    a.year - b.year
            );

        }

    }


    /* PAGINATION */

    const totalPages =
        Math.ceil(data.length / recordsPerPage);

    if (studentPage > totalPages) {
        studentPage = Math.max(totalPages, 1);
    }

    const start =
        (studentPage - 1) * recordsPerPage;

    const pageData =
        data.slice(
            start,
            start + recordsPerPage
        );


    if (pageData.length === 0) {

        container.innerHTML =
            `<p class="no-data">
                No students found.
            </p>`;

    } else {

        container.innerHTML =
            pageData.map(student => `

                <article class="data-card">

                    <h3>${student.name}</h3>

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

            `).join("");

    }


    renderPagination(
        "studentPagination",
        studentPage,
        totalPages,
        page => {

            studentPage = page;
            displayStudents();

        }
    );

}


/* ==========================================
   STUDENT CONTROLS
   ========================================== */

function setupStudentControls() {

    const search =
        document.getElementById("studentSearch");

    const course =
        document.getElementById("studentCourse");

    const sort =
        document.getElementById("studentSort");


    if (search) {

        search.addEventListener("input", () => {

            studentPage = 1;
            displayStudents();

        });

    }


    if (course) {

        course.addEventListener("change", () => {

            studentPage = 1;
            displayStudents();

        });

    }


    if (sort) {

        sort.addEventListener("change", () => {

            studentPage = 1;
            displayStudents();

        });

    }

}


/* ==========================================
   FAQ - FETCH
   ========================================== */

async function loadFAQs() {

    const container =
        document.getElementById("faqContainer");

    if (!container) return;

    showLoading(container);

    try {

        const response =
            await fetch("faqs.json");

        if (!response.ok) {
            throw new Error(
                "FAQ JSON could not be loaded."
            );
        }

        faqsData =
            await response.json();

        createFAQCategories();

        displayFAQs();

        setupFAQControls();

    } catch (error) {

        showError(container, error.message);

        console.error(error);

    }

}


/* ==========================================
   FAQ CATEGORIES
   ========================================== */

function createFAQCategories() {

    const select =
        document.getElementById("faqCategory");

    if (!select) return;

    const categories =
        [...new Set(
            faqsData.map(faq => faq.category)
        )];

    select.innerHTML =
        `<option value="All">All Categories</option>`;

    categories.forEach(category => {

        select.innerHTML += `
            <option value="${category}">
                ${category}
            </option>
        `;

    });

}


/* ==========================================
   DISPLAY FAQs
   ========================================== */

function displayFAQs() {

    const container =
        document.getElementById("faqContainer");

    if (!container) return;

    let data = [...faqsData];

    const searchInput =
        document.getElementById("faqSearch");

    const category =
        document.getElementById("faqCategory");


    const search =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    if (search) {

        data = data.filter(faq =>

            faq.question.toLowerCase().includes(search) ||

            faq.answer.toLowerCase().includes(search)

        );

    }


    if (category && category.value !== "All") {

        data = data.filter(faq =>
            faq.category === category.value
        );

    }


    const totalPages =
        Math.ceil(data.length / recordsPerPage);

    if (faqPage > totalPages) {
        faqPage = Math.max(totalPages, 1);
    }

    const start =
        (faqPage - 1) * recordsPerPage;

    const pageData =
        data.slice(
            start,
            start + recordsPerPage
        );


    if (pageData.length === 0) {

        container.innerHTML =
            `<p class="no-data">
                No FAQs found.
            </p>`;

    } else {

        container.innerHTML =
            pageData.map(faq => `

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

                        <p>${faq.answer}</p>

                    </div>

                </article>

            `).join("");


        document
            .querySelectorAll(".faq-question")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const answer =
                        button.nextElementSibling;

                    const open =
                        button.getAttribute(
                            "aria-expanded"
                        ) === "true";

                    button.setAttribute(
                        "aria-expanded",
                        !open
                    );

                    answer.hidden = open;

                });

            });

    }


    renderPagination(
        "faqPagination",
        faqPage,
        totalPages,
        page => {

            faqPage = page;
            displayFAQs();

        }
    );

}


/* ==========================================
   FAQ CONTROLS
   ========================================== */

function setupFAQControls() {

    const search =
        document.getElementById("faqSearch");

    const category =
        document.getElementById("faqCategory");


    if (search) {

        search.addEventListener("input", () => {

            faqPage = 1;
            displayFAQs();

        });

    }


    if (category) {

        category.addEventListener("change", () => {

            faqPage = 1;
            displayFAQs();

        });

    }

}


/* ==========================================
   PAGINATION
   ========================================== */

function renderPagination(
    id,
    currentPage,
    totalPages,
    callback
) {

    const container =
        document.getElementById(id);

    if (!container) return;

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


    container
        .querySelectorAll(".page-button")
        .forEach(button => {

            button.addEventListener("click", () => {

                callback(
                    Number(button.dataset.page)
                );

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            });

        });

}


/* ==========================================
   LOADING
   ========================================== */

function showLoading(container) {

    container.innerHTML = `
        <div class="loading">
            Loading data from JSON...
        </div>
    `;

}


/* ==========================================
   ERROR
   ========================================== */

function showError(container, message) {

    container.innerHTML = `
        <div class="error-message">

            <strong>Error:</strong>

            <p>${message}</p>

            <p>
                Check that the JSON file is
                present in the project folder.
            </p>

        </div>
    `;

}