<?php

$game = $_POST['game'];
$obj = $_POST['myData'];
$done = $_POST['complete'];
echo $done;

$filename = '../data/' . ($done === "false" ? $game . "_backup" : $game) . '.txt';


// In our example we're opening $filename in append mode.
// The file pointer is at the bottom of the file hence
// that's where $somecontent will go when we fwrite() it.
if (!$handle = fopen($filename, 'a')) {
	 echo "Cannot open file ($filename)";
	 exit;
}

// Write $somecontent to our opened file.
if (fwrite($handle, $obj) === FALSE) {
	echo "Cannot write to file ($filename)";
	exit;
}

echo "Success";

fclose($handle);

//buildCommandList
?>