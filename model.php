<?php
$dbhandle = sqlite_open('billing.db', 0666, $error);
if (!$dbhandle) 
  die ($error);

$createBillInfo = "CREATE TABLE BillInfo(Id integer PRIMARY KEY,
	UtilityName text NOT NULL, 
	BilledAmount integer NOT NULL, 
	BilledDate integer NOT NULL)";

$createSurvey = "CREATE TABLE Survey(Id integer PRIMARY KEY,
	Shower integer NOT NULL,
	Bath integer NOT NULL,
	Dishwasher integer NOT NULL,
	Laundry integer NOT NULL,
	Gardening integer NOT NULL)";

$createGoal = "CREATE TABLE Goal(ID integer PRIMARY KEY,
	CurrentGoal text)";

$okBillInfo = sqlite_exec($dbhandle, $createBillInfo, $error);
$okSurvey = sqlite_exec($dbhandle, $createSurvey, $error);
$okGoal = sqlite_exec($dbhandle, $createGoal, $error);


if (!$okBillInfo || !$okSurvey || !$okGoal)
	die("Cannot execute query. $error");

echo "Database 'Bill Info' created successfully";

sqlite_close($dbhandle);
?>
