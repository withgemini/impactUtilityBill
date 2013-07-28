<?php 
// start the db with db class
require_once('class.db.php');
$db = new LetterAdsDB();

$row = $db->fetchsql("SELECT * FROM email_ad_table WHERE id = ".$_REQUEST['utility_name']);
if ($row)
{
	
}

if (isset($_POST['save'])) 
{
  $utility = trim($_POST['utility_name']);
  $amount = trim($_POST['amount']);
}
?>
<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<title>Login</title>
</head>

<body>
<form id="form1" method="post" action="">
    <p>
        <label for="utility_name">Utility:</label>
        <input type="text" name="utility_name" id="utility_name">
    </p>
    <p>
        <label for="amount">Amount:</label>
        <input type="password" name="amount" id="amount">
    </p>
    <p>
        <input name="save" type="submit" id="save" value="Save">
    </p>
</form>
</body>
</html>
