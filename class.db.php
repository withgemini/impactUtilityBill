<?php

class LetterAdsDB extends SQLite3
{
	var $result, $row;
	
    public function __construct()
    {
		$this->open('ad_tool_db.db');
		
		$this->exec("CREATE TABLE IF NOT EXISTS utility_table (
			id INTEGER PRIMARY KEY AUTOINCREMENT, 
			utility_name STRING, 
			bill_date STRING)"
			);
    }

	public function execsql($asql) {
	    // use a prepared statement instead for insert/replace/delete
		$statement = $this->prepare($asql);
		$this->result = $statement->execute();
		
	    if (!$this->result) {
			try {
				$error = 'There was an error:\n';
			    throw new Exception($this->lastErrorMsg());
			} catch (Exception $e) {
			    echo 'Caught exception: ', $e->getMessage(), "\n";
			}
			// Continue execution
			echo 'Something executed incorrectly and there\'s nobody to blame.';
	    } else {
	        return $this->result;
	    }
	}
	
	public function fetchsql($asql){
		$result = $this->query($asql);
		$this->row = $result->fetchArray();
		
		if (!$this->row) {
			try {
				$error = 'There was an error:\n';
			    throw new Exception($this->lastErrorMsg());
			} catch (Exception $e) {
			    echo 'Caught exception: ', $e->getMessage(), "\n";
			}
			// Continue execution
			echo 'Something executed incorrectly and there\'s nobody to blame.';
	    } else {
	        return $this->row;
	    }
	}
}

?>