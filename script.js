// ============================================
// STUDENTHUB COMMON JAVASCRIPT
// ============================================


// ---------- MENU ----------

const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");

if (menuButton && mainNav) {

    menuButton.addEventListener("click", function () {

        mainNav.classList.toggle("show");

        const isOpen =
            mainNav.classList.contains("show");

        menuButton.setAttribute(
            "aria-expanded",
            isOpen
        );

    });

}


// ---------- DARK MODE ----------

const themeButton =
    document.getElementById("themeButton");

if (themeButton) {

    themeButton.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

        if (
            document.body.classList.contains("dark-mode")
        ) {

            themeButton.textContent =
                "☀️ Light Mode";

        } else {

            themeButton.textContent =
                "🌙 Dark Mode";

        }

    });

}


// =================================================
// PRACTICAL 5 REGISTRATION VALIDATION
// =================================================

const registrationForm =
    document.getElementById("registrationForm");


if (registrationForm) {


    // ---------- REGEX ----------

    const nameRegex =
        /^[A-Za-z ]{2,50}$/;

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const mobileRegex =
        /^[6-9][0-9]{9}$/;

    /*
       Password rules:
       At least 8 characters
       One uppercase letter
       One lowercase letter
       One number
       One special character
    */

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;


    // ---------- ELEMENTS ----------

    const name =
        document.getElementById("name");

    const email =
        document.getElementById("email");

    const mobile =
        document.getElementById("mobile");

    const password =
        document.getElementById("password");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const course =
        document.getElementById("course");

    const year =
        document.getElementById("year");

    const terms =
        document.getElementById("terms");


    // ---------- ERROR FUNCTION ----------

    function showError(
        input,
        errorId,
        message
    ) {

        const error =
            document.getElementById(errorId);

        error.textContent = message;

        input.classList.add("invalid");
        input.classList.remove("valid");

        input.setAttribute(
            "aria-invalid",
            "true"
        );

    }


    // ---------- SUCCESS FUNCTION ----------

    function showSuccess(
        input,
        errorId
    ) {

        const error =
            document.getElementById(errorId);

        error.textContent = "";

        input.classList.remove("invalid");
        input.classList.add("valid");

        input.setAttribute(
            "aria-invalid",
            "false"
        );

    }


    // =================================================
    // NAME VALIDATION
    // =================================================

    function validateName() {

        const value =
            name.value.trim();

        if (value === "") {

            showError(
                name,
                "nameError",
                "Name is required."
            );

            return false;
        }

        if (!nameRegex.test(value)) {

            showError(
                name,
                "nameError",
                "Name should contain only letters and spaces."
            );

            return false;
        }

        showSuccess(
            name,
            "nameError"
        );

        return true;
    }


    // =================================================
    // EMAIL VALIDATION
    // =================================================

    function validateEmail() {

        const value =
            email.value.trim();

        if (value === "") {

            showError(
                email,
                "emailError",
                "Email is required."
            );

            return false;
        }

        if (!emailRegex.test(value)) {

            showError(
                email,
                "emailError",
                "Enter a valid email address."
            );

            return false;
        }

        showSuccess(
            email,
            "emailError"
        );

        return true;
    }


    // =================================================
    // MOBILE VALIDATION
    // =================================================

    function validateMobile() {

        const value =
            mobile.value.trim();

        if (value === "") {

            showError(
                mobile,
                "mobileError",
                "Mobile number is required."
            );

            return false;
        }

        if (!mobileRegex.test(value)) {

            showError(
                mobile,
                "mobileError",
                "Enter a valid 10-digit Indian mobile number."
            );

            return false;
        }

        showSuccess(
            mobile,
            "mobileError"
        );

        return true;
    }


    // =================================================
    // PASSWORD VALIDATION
    // =================================================

    function validatePassword() {

        const value =
            password.value;

        if (value === "") {

            showError(
                password,
                "passwordError",
                "Password is required."
            );

            return false;
        }

        if (!passwordRegex.test(value)) {

            showError(
                password,
                "passwordError",
                "Password must contain 8+ characters, uppercase, lowercase, number and special character."
            );

            return false;
        }

        showSuccess(
            password,
            "passwordError"
        );

        return true;
    }


    // =================================================
    // PASSWORD STRENGTH METER
    // =================================================

    password.addEventListener(
        "input",
        function () {

            const value =
                password.value;

            const strength =
                document.getElementById(
                    "passwordStrength"
                );

            let score = 0;

            if (value.length >= 8)
                score++;

            if (/[a-z]/.test(value))
                score++;

            if (/[A-Z]/.test(value))
                score++;

            if (/[0-9]/.test(value))
                score++;

            if (/[@$!%*?&]/.test(value))
                score++;


            if (value.length === 0) {

                strength.textContent =
                    "Password strength: —";

            } else if (score <= 2) {

                strength.textContent =
                    "Password strength: Weak";

            } else if (score === 3) {

                strength.textContent =
                    "Password strength: Medium";

            } else if (score === 4) {

                strength.textContent =
                    "Password strength: Good";

            } else {

                strength.textContent =
                    "Password strength: Strong";

            }

            validatePassword();

        }
    );


    // =================================================
    // CONFIRM PASSWORD
    // =================================================

    function validateConfirmPassword() {

        const value =
            confirmPassword.value;

        if (value === "") {

            showError(
                confirmPassword,
                "confirmPasswordError",
                "Please confirm your password."
            );

            return false;
        }

        if (
            value !== password.value
        ) {

            showError(
                confirmPassword,
                "confirmPasswordError",
                "Passwords do not match."
            );

            return false;
        }

        showSuccess(
            confirmPassword,
            "confirmPasswordError"
        );

        return true;
    }


    // =================================================
    // COURSE
    // =================================================

    function validateCourse() {

        if (course.value === "") {

            showError(
                course,
                "courseError",
                "Please select your course."
            );

            return false;
        }

        showSuccess(
            course,
            "courseError"
        );

        return true;
    }


    // =================================================
    // YEAR
    // =================================================

    function validateYear() {

        if (year.value === "") {

            showError(
                year,
                "yearError",
                "Please select your year."
            );

            return false;
        }

        showSuccess(
            year,
            "yearError"
        );

        return true;
    }


    // =================================================
    // GENDER
    // =================================================

    function validateGender() {

        const gender =
            document.querySelector(
                'input[name="gender"]:checked'
            );

        const error =
            document.getElementById(
                "genderError"
            );

        if (!gender) {

            error.textContent =
                "Please select your gender.";

            return false;
        }

        error.textContent = "";

        return true;
    }


    // =================================================
    // TERMS
    // =================================================

    function validateTerms() {

        if (!terms.checked) {

            const error =
                document.getElementById(
                    "termsError"
                );

            error.textContent =
                "You must accept the Terms and Conditions.";

            return false;
        }

        document.getElementById(
            "termsError"
        ).textContent = "";

        return true;
    }


    // =================================================
    // REAL-TIME VALIDATION
    // =================================================

    name.addEventListener(
        "blur",
        validateName
    );

    email.addEventListener(
        "blur",
        validateEmail
    );

    mobile.addEventListener(
        "blur",
        validateMobile
    );

    password.addEventListener(
        "blur",
        validatePassword
    );

    confirmPassword.addEventListener(
        "blur",
        validateConfirmPassword
    );

    course.addEventListener(
        "change",
        validateCourse
    );

    year.addEventListener(
        "change",
        validateYear
    );

    terms.addEventListener(
        "change",
        validateTerms
    );


    // =================================================
    // FORM SUBMISSION
    // =================================================

    registrationForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const validName =
                validateName();

            const validEmail =
                validateEmail();

            const validMobile =
                validateMobile();

            const validPassword =
                validatePassword();

            const validConfirm =
                validateConfirmPassword();

            const validCourse =
                validateCourse();

            const validYear =
                validateYear();

            const validGender =
                validateGender();

            const validTerms =
                validateTerms();


            const allValid =
                validName &&
                validEmail &&
                validMobile &&
                validPassword &&
                validConfirm &&
                validCourse &&
                validYear &&
                validGender &&
                validTerms;


            const summary =
                document.getElementById(
                    "formSummary"
                );


            if (!allValid) {

                summary.hidden = false;

                summary.textContent =
                    "❌ Please correct the errors in the form before submitting.";

                return;
            }


            // SUCCESS

            summary.hidden = true;

            const success =
                document.getElementById(
                    "successMessage"
                );

            success.hidden = false;

            success.textContent =
                "✅ Registration successful! Welcome to StudentHub.";

            registrationForm.reset();


            // Remove validation classes

            const inputs =
                registrationForm.querySelectorAll(
                    "input, select"
                );

            inputs.forEach(
                function (input) {

                    input.classList.remove(
                        "valid",
                        "invalid"
                    );

                    input.removeAttribute(
                        "aria-invalid"
                    );

                }
            );


            document.getElementById(
                "passwordStrength"
            ).textContent =
                "Password strength: —";

        }
    );


    // =================================================
    // RESET FORM
    // =================================================

    registrationForm.addEventListener(
        "reset",
        function () {

            setTimeout(
                function () {

                    const errors =
                        registrationForm.querySelectorAll(
                            ".error-message"
                        );

                    errors.forEach(
                        function (error) {
                            error.textContent = "";
                        }
                    );


                    const inputs =
                        registrationForm.querySelectorAll(
                            "input, select"
                        );

                    inputs.forEach(
                        function (input) {

                            input.classList.remove(
                                "valid",
                                "invalid"
                            );

                            input.removeAttribute(
                                "aria-invalid"
                            );

                        }
                    );


                    document.getElementById(
                        "formSummary"
                    ).hidden = true;


                    document.getElementById(
                        "successMessage"
                    ).hidden = true;


                    document.getElementById(
                        "passwordStrength"
                    ).textContent =
                        "Password strength: —";

                },
                0
            );

        }
    );

}


// =================================================
// CONTACT FORM
// =================================================

const contactForm =
    document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            alert(
                "Your message has been submitted successfully."
            );

            contactForm.reset();

        }
    );

}


// =================================================
// FEEDBACK FORM
// =================================================

const feedbackForm =
    document.getElementById("feedbackForm");

if (feedbackForm) {

    feedbackForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            alert(
                "Thank you for your valuable feedback!"
            );

            feedbackForm.reset();

        }
    );

}


// =================================================
// LOGIN FORM
// =================================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            alert(
                "Login successful! Welcome to StudentHub."
            );

        }
    );

}