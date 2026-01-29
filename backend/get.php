<?php
require 'headers.php';

$id = $_GET['id'] ?? null;
$dataFile = '../data/puzzles.json';
$data = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];

if (!is_array($data)) {
    $data = [];
}

foreach ($data as $p) {
    if (isset($p['id']) && $p['id'] === $id) {
        echo json_encode($p);
        exit;
    }
}

http_response_code(404);
echo json_encode(['error' => 'Not found']);
?>
