<?php
$category = $_GET["c"];
$directory = "/img/wallpapers/$category/thumbs";

$img_arr = array();

$handle = opendir(dirname(realpath(__FILE__)).$directory);
while($file = readdir($handle)){
    if($file !== '.' && $file !== '..'){
        array_push($img_arr, $directory."/".$file);
    }
}

echo json_encode($img_arr);