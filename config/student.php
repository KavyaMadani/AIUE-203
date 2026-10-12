<?php
$conn = mysqli_connect("localhost", "root", "", "college1");

if (!$conn) {
    die("Database connection failed: " . mysqli_connect_error());
}

$msg = "";

// SAFE OUTPUT
function e($value) {
    return htmlspecialchars((string)($value ?? ""), ENT_QUOTES, "UTF-8");
}

// ADD STUDENT
if (isset($_POST['add'])) {

    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $course = $_POST['course'];

    $stmt = mysqli_prepare(
        $conn,
        "INSERT INTO students (name, email, course)
         VALUES (?, ?, ?)"
    );

    mysqli_stmt_bind_param($stmt, "sss", $name, $email, $course);

    if (mysqli_stmt_execute($stmt)) {
        header("Location: student.php?msg=added");
        exit;
    } else {
        $msg = "Failed to add student.";
    }
}

// EDIT STUDENT
$edit = null;

if (isset($_GET['edit_name'], $_GET['edit_email'], $_GET['edit_course'])) {

    $old_name = $_GET['edit_name'];
    $old_email = $_GET['edit_email'];
    $old_course = $_GET['edit_course'];

    $stmt = mysqli_prepare(
        $conn,
        "SELECT name, email, course
         FROM students
         WHERE name = ? AND email = ? AND course = ?"
    );

    mysqli_stmt_bind_param(
        $stmt,
        "sss",
        $old_name,
        $old_email,
        $old_course
    );

    mysqli_stmt_execute($stmt);
    $edit_result = mysqli_stmt_get_result($stmt);

    if (mysqli_num_rows($edit_result) == 1) {
        $edit = mysqli_fetch_assoc($edit_result);
    } else {
        $msg = "Student not found or duplicate records exist.";
    }
}

// UPDATE STUDENT
if (isset($_POST['update'])) {

    $old_name = $_POST['old_name'];
    $old_email = $_POST['old_email'];
    $old_course = $_POST['old_course'];

    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $course = $_POST['course'];

    $stmt = mysqli_prepare(
        $conn,
        "UPDATE students
         SET name = ?, email = ?, course = ?
         WHERE name = ? AND email = ? AND course = ?"
    );

    mysqli_stmt_bind_param(
        $stmt,
        "ssssss",
        $name,
        $email,
        $course,
        $old_name,
        $old_email,
        $old_course
    );

    if (mysqli_stmt_execute($stmt)) {

        if (mysqli_stmt_affected_rows($stmt) == 1) {
            header("Location: student.php?msg=updated");
            exit;
        } else {
            $msg = "No record changed. Check whether the student exists or the details are unchanged.";
        }

    } else {
        $msg = "Failed to update student.";
    }
}

// DELETE STUDENT
if (isset($_POST['delete'])) {

    $name = $_POST['delete_name'];
    $email = $_POST['delete_email'];
    $course = $_POST['delete_course'];

    $stmt = mysqli_prepare(
        $conn,
        "DELETE FROM students
         WHERE name = ? AND email = ? AND course = ?"
    );

    mysqli_stmt_bind_param($stmt, "sss", $name, $email, $course);

    if (mysqli_stmt_execute($stmt)) {

        if (mysqli_stmt_affected_rows($stmt) == 1) {
            header("Location: student.php?msg=deleted");
            exit;
        } else {
            $msg = "Student not found or duplicate records exist.";
        }

    } else {
        $msg = "Failed to delete student.";
    }
}

// MESSAGES
if (isset($_GET['msg'])) {

    if ($_GET['msg'] == "added") {
        $msg = "Student added successfully!";
    } elseif ($_GET['msg'] == "updated") {
        $msg = "Student updated successfully!";
    } elseif ($_GET['msg'] == "deleted") {
        $msg = "Student deleted successfully!";
    }
}

// SEARCH AND FILTER
$search = $_GET['search'] ?? "";
$filter_course = $_GET['course'] ?? "";

$search_value = "%" . $search . "%";

if ($filter_course != "") {

    $stmt = mysqli_prepare(
        $conn,
        "SELECT name, email, course
         FROM students
         WHERE (name LIKE ? OR email LIKE ?)
         AND course = ?
         ORDER BY name ASC"
    );

    mysqli_stmt_bind_param(
        $stmt,
        "sss",
        $search_value,
        $search_value,
        $filter_course
    );

} else {

    $stmt = mysqli_prepare(
        $conn,
        "SELECT name, email, course
         FROM students
         WHERE name LIKE ? OR email LIKE ?
         ORDER BY name ASC"
    );

    mysqli_stmt_bind_param(
        $stmt,
        "ss",
        $search_value,
        $search_value
    );
}

mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Student Management System</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 30px;
        }

        input, select, button {
            padding: 8px;
            margin: 5px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th, td {
            border: 1px solid black;
            padding: 10px;
            text-align: left;
        }

        th {
            background: #dddddd;
        }

        .edit {
            background: #0879d9;
            color: white;
            padding: 7px 12px;
            text-decoration: none;
            border-radius: 4px;
        }

        .delete {
            background: #dc3545;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 4px;
        }
    </style>
</head>

<body>

<h2>Student Management System</h2>

<p><b><?php echo e($msg); ?></b></p>

<!-- ADD / EDIT FORM -->

<h3><?php echo $edit ? "Edit Student" : "Add Student"; ?></h3>

<form method="POST" action="student.php">

    <?php if ($edit): ?>

        <input type="hidden" name="old_name"
               value="<?php echo e($edit['name']); ?>">

        <input type="hidden" name="old_email"
               value="<?php echo e($edit['email']); ?>">

        <input type="hidden" name="old_course"
               value="<?php echo e($edit['course']); ?>">

    <?php endif; ?>

    <label>Name:</label>

    <input type="text" name="name"
           value="<?php echo e($edit['name'] ?? ''); ?>"
           required>

    <label>Email:</label>

    <input type="email" name="email"
           value="<?php echo e($edit['email'] ?? ''); ?>"
           required>

    <label>Course:</label>

    <select name="course" required>

        <option value="BCA"
            <?php if (($edit['course'] ?? '') == "BCA") echo "selected"; ?>>
            BCA
        </option>

        <option value="BSc IT"
            <?php if (($edit['course'] ?? '') == "BSc IT") echo "selected"; ?>>
            BSc IT
        </option>

    </select>

    <?php if ($edit): ?>

        <button type="submit" name="update">
            Update Student
        </button>

        <a href="student.php">Cancel</a>

    <?php else: ?>

        <button type="submit" name="add">
            Add Student
        </button>

    <?php endif; ?>

</form>

<hr>

<!-- SEARCH AND FILTER -->

<h3>Search Students</h3>

<form method="GET" action="student.php">

    <input type="text"
           name="search"
           placeholder="Search name or email"
           value="<?php echo e($search); ?>">

    <select name="course">

        <option value="">All Courses</option>

        <option value="BCA"
            <?php if ($filter_course == "BCA") echo "selected"; ?>>
            BCA
        </option>

        <option value="BSc IT"
            <?php if ($filter_course == "BSc IT") echo "selected"; ?>>
            BSc IT
        </option>

    </select>

    <button type="submit">Search</button>

    <a href="student.php">Show All</a>

</form>

<!-- STUDENT TABLE -->

<table>

    <thead>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Action</th>
        </tr>
    </thead>

    <tbody>

    <?php if (mysqli_num_rows($result) > 0): ?>

        <?php while ($row = mysqli_fetch_assoc($result)): ?>

            <tr>

                <td><?php echo e($row['name']); ?></td>

                <td><?php echo e($row['email']); ?></td>

                <td><?php echo e($row['course']); ?></td>

                <td>

                    <!-- EDIT BUTTON -->

                    <a class="edit"
                       href="student.php?edit_name=<?php echo urlencode($row['name']); ?>&edit_email=<?php echo urlencode($row['email']); ?>&edit_course=<?php echo urlencode($row['course']); ?>">
                        Edit
                    </a>

                    <!-- DELETE BUTTON -->

                    <form method="POST"
                          action="student.php"
                          style="display:inline;"
                          onsubmit="return confirm('Are you sure you want to delete this student?');">

                        <input type="hidden" name="delete_name"
                               value="<?php echo e($row['name']); ?>">

                        <input type="hidden" name="delete_email"
                               value="<?php echo e($row['email']); ?>">

                        <input type="hidden" name="delete_course"
                               value="<?php echo e($row['course']); ?>">

                        <button class="delete" type="submit" name="delete">
                            Delete
                        </button>

                    </form>

                </td>

            </tr>

        <?php endwhile; ?>

    <?php else: ?>

        <tr>
            <td colspan="4">No students found.</td>
        </tr>

    <?php endif; ?>

    </tbody>

</table>

</body>
</html>