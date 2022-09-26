const reloadUsers = document.querySelector("#reload-users");
const loader = document.querySelector("#loader");
const addUserForm = document.querySelector("#add-user");
const containerTable = document.querySelector(".users");
const table = document.querySelector("#table-users .users__table-body");
const errorText = document.querySelector(".error-text");

window.addEventListener("DOMContentLoaded", () => getUsers());
reloadUsers.addEventListener("click", () => getUsers());
addUserForm.addEventListener("submit", addUser);

function getUsers() {
	const petition = new XMLHttpRequest();
	petition.open("GET", "php/users.php");

	loader.classList.add("--active");

	petition.onload = () => {
		const data = JSON.parse(petition.responseText);
		printUsers(data);
	};

	petition.onreadystatechange = () => {
		if (petition.readyState == 4 && petition.status == 200) {
			loader.classList.remove("--active");
		}
	};

	petition.send();
}

function printUsers(data) {
	if (data.error === true) {
		errorText.classList.add("--active");
		containerTable.classList.add("--inactive");
		return;
	}

	errorText.classList.remove("--active");
	containerTable.classList.remove("--inactive");

	table.innerHTML = "";
	data.forEach((user) => {
		const item = document.createElement("tr");
		const id = document.createElement("td");
		id.innerText = user.id;
		const name = document.createElement("td");
		name.innerText = user.name;
		const age = document.createElement("td");
		age.innerText = user.age;
		const email = document.createElement("td");
		email.innerText = user.email;
		const country = document.createElement("td");
		country.innerText = user.country;

		item.appendChild(id);
		item.appendChild(name);
		item.appendChild(age);
		item.appendChild(email);
		item.appendChild(country);

		table.appendChild(item);
	});
}

function addUser(e) {
	e.preventDefault();

	const name = e.target["name"].value.trim();
	const age = e.target["age"].value.trim();
	const country = e.target["country"].value.trim();
	const email = e.target["email"].value.trim();

	if (name === "" || age === "" || country === "" || email === "") return;

	const parameters = `name=${name}&age=${age}&country=${country}&email=${email}`;

	const petition = new XMLHttpRequest();
	petition.open("POST", "php/users.php");
	petition.setRequestHeader(
		"Content-Type",
		"application/x-www-form-urlencoded"
	);

	loader.classList.add("--active");

	petition.onload = () => {
		const data = JSON.parse(petition.responseText);

		if (data.error) {
			errorText.classList.add("--active");
			return;
		}

		e.target.reset();
		errorText.classList.remove("--active");
		getUsers();
	};

	petition.onreadystatechange = () => {
		if (petition.readyState == 4 && petition.status == 200) {
			loader.classList.remove("--active");
		}
	};

	petition.send(parameters);
}
