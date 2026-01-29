<?php
// Izinkan akses dari mana saja (karena di Vercel frontend & backend satu domain)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Jika request adalah OPTIONS (preflight), stop di sini
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>