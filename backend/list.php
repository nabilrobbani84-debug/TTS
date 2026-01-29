<?php
require 'headers.php';

$dataFile = '../data/puzzles.json';
$data = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];

if (!is_array($data)) {
    $data = [];
}

// Return only metadata
$list = array_map(function($p) {
    return [
        'id' => isset($p['id']) ? $p['id'] : 'unknown',
        'title' => isset($p['title']) ? $p['title'] : 'Untitled',
        'createdAt' => isset($p['createdAt']) ? $p['createdAt'] : '',
        'wordCount' => isset($p['words']) ? count($p['words']) : 0
    ];
}, $data);

// Sort by createdAt desc
usort($list, function($a, $b) {
    return strcmp($b['createdAt'], $a['createdAt']);
});

echo json_encode($list);
?>
