<?php
$path = "img/wallpapers/";

$dirs = array_filter(glob($path.'*'), 'is_dir');

foreach($dirs as &$directory){
	$directory = str_replace($path, "", $directory);
}

echo json_encode($dirs);