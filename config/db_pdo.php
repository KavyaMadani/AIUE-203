<?php

$host = "localhost";
$username = "root";
$password = "";
$database = "college1";

try {
    // Connect to MySQL database
    $conn = new PDO(
        "mysql:host=$host;dbname=$database;charset=utf8mb4",
        $username,
        $password
    );

    // Enable error reporting
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "<h2>Connection Successful!</h2>";

    echo "<h3>Database Tables:</h3>";

    // Fetch all tables
    $result = $conn->query("SHOW TABLES");

    $tables = $result->fetchAll(PDO::FETCH_COLUMN);

    if (count($tables) > 0) {
        echo "<ul>";

        foreach ($tables as $table) {
            echo "<li>" . htmlspecialchars($table) . "</li>";
        }

        echo "</ul>";
    } else {
        echo "No tables found in the database.";
    }

} catch (PDOException $e) {
    die("<h3>Connection Failed!</h3>" .
        htmlspecialchars($e->getMessage()));
}

?>