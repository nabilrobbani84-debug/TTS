<?php
require 'headers.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$dataFile = '../data/puzzles.json';
$currentData = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];

if (!is_array($currentData)) {
    $currentData = [];
}

$newId = uniqid();
$input['id'] = $newId;
$input['createdAt'] = date('c');

$currentData[] = $input;

file_put_contents($dataFile, json_encode($currentData, JSON_PRETTY_PRINT));

echo json_encode(['success' => true, 'id' => $newId]);
?>
