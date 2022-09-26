<?php

error_reporting(0);

if($_SERVER['REQUEST_METHOD'] == 'GET') {
	header('Content-type: application/json; charset=utf-8');

	try {
		$connection = new PDO();

		$query = 'SELECT * FROM users_ajax.user';
		$statement = $connection->prepare($query);
		$statement->execute();
		$response = $statement->fetchAll();

		$users = [];

		for($i = 0; $i < count($response); $i++) {
			$user = [
				'id' => $response[$i]['id'],
				'name' => $response[$i]['name'],
				'age' => $response[$i]['age'],
				'email' => $response[$i]['email'],
				'country' => $response[$i]['country'],
			];

			array_push($users, $user);
		}
		echo json_encode($users);
	} catch (PDOException $e) {
		echo '{"error": true}';
	}
} else {
	function clearData($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = strip_tags($data);
		$data = htmlspecialchars($data);
		return $data;
	}

	$name = clearData($_POST['name']);
	$age = intval(clearData($_POST['age']));
	$email = clearData($_POST['email']);
	$country = clearData($_POST['country']);

	try {
		$connection = new PDO();

		$query = "INSERT INTO users_ajax.user (name, age, email, country) VALUES ('$name', $age, '$email', '$country');";
		$statement = $connection->prepare($query);
		$statement->execute();

		echo '{"error": false}';
	} catch (PDOException $e) {
		echo '{"error": true}';
	}
}

?>
