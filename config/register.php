<?php

$conn = new mysqli("localhost", "root", "", "newcollege");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$msg = "";

if (isset($_POST['register'])) {

    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    // Backend validation
    if ($username == "" || $email == "" || $password == "") {

        $msg = "All fields are required.";

    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

        $msg = "Please enter a valid email address.";

    } elseif (strlen($password) < 6) {

        $msg = "Password must contain at least 6 characters.";

    } else {

        // Check whether username or email already exists
        $check = $conn->prepare(
            "SELECT id FROM users WHERE username = ? OR email = ?"
        );

        $check->bind_param("ss", $username, $email);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {

            $msg = "Username or email already exists.";

        } else {

            // Hash the password before storing it
            $hashed_password = password_hash(
                $password,
                PASSWORD_DEFAULT
            );

            // Insert user into database
            $stmt = $conn->prepare(
                "INSERT INTO users (username, email, password)
                 VALUES (?, ?, ?)"
            );

            $stmt->bind_param(
                "sss",
                $username,
                $email,
                $hashed_password
            );

            if ($stmt->execute()) {

                $msg = "Registration successful!";

            } else {

                $msg = "Registration failed.";
            }

            $stmt->close();
        }

        $check->close();
    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>User Registration</title>
</head>

<body>

    <h2>User Registration Form</h2>

    <p>
        <?php echo htmlspecialchars($msg, ENT_QUOTES, 'UTF-8'); ?>
    </p>

    <form method="post" action="register.php">

        <label>Username:</label>
        <input type="text" name="username" required maxlength="100">

        <br><br>

        <label>Email:</label>
        <input type="email" name="email" required maxlength="150">

        <br><br>

        <label>Password:</label>
        <input type="password" name="password" required minlength="6">

        <br><br>

        <button type="submit" name="register">
            Register
        </button>

    </form>

</body>
</html>