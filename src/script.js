const ul = document.querySelector("ul");
const form = document.querySelector("form");
const input = document.querySelector("form > input");

document.addEventListener("DOMContentLoaded", () => {
	loadDarkModePreference();
});

const toggleDarkMode = () => {
  const container = document.querySelector(".container");
  const isDarkMode = container.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDarkMode ? "on" : "off");
};


const loadDarkModePreference = () => {
  const darkModeSetting = localStorage.getItem("darkMode");
  const container = document.querySelector(".container");

  if (darkModeSetting) {
    if (darkModeSetting === "on") {
      container.classList.add("dark-mode");
    } else {
      container.classList.remove("dark-mode");
    }
  } else {
   
    container.classList.add("dark-mode");
    localStorage.setItem("darkMode", "on"); 
  }
};



document.querySelector("#dark-mode-toggle").addEventListener("click", toggleDarkMode);


let todos = [];

const loadTodos = () => {
	try {
		const savedTodos = localStorage.getItem("todos");
		if (savedTodos) {
			todos = JSON.parse(savedTodos);
		}
	} catch (error) {
		console.error("Erreur lors du chargement des tâches :", error);
	}
};

document.addEventListener("DOMContentLoaded", () => {
	loadTodos();
	displayTodo();
});

form.addEventListener("submit", (event) => {
	event.preventDefault();
	const value = input.value;
	input.value = "";
	addTodo(value);
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && todos.find((t) => t.editMode)) {
		todos.find((t) => t.editMode).editMode = false;
		displayTodo();
	}
});

const displayTodo = () => {
	const todosNode = todos.map((todo, index) => {
		if (todo.editMode) {
			return createTodoEditElement(todo, index);
		} else {
			return createTodoElement(todo, index);
		}
	});
	ul.innerHTML = "";
	ul.append(...todosNode);
};

const createTodoElement = (todo, index) => {
	const li = document.createElement("li");

	const buttonDelete = document.createElement("button");
	buttonDelete.innerHTML = "Supprimer";
	buttonDelete.classList.add("danger");
	buttonDelete.setAttribute("aria-label", "Supprimer la tâche");
	buttonDelete.addEventListener("click", (event) => {
		event.stopPropagation();
		deleteTodo(index);
	});

	const buttonEdit = document.createElement("button");
	buttonEdit.innerHTML = "Edit";
	buttonEdit.classList.add("primary");
	buttonEdit.setAttribute("aria-label", "Modifier la tâche");
	buttonEdit.addEventListener("click", (event) => {
		event.stopPropagation();
		toggleEditMode(index);
	});

	li.innerHTML = `
    <span class="todo ${todo.done ? "done" : ""}" role="checkbox" aria-checked="${todo.done}"></span>
    <p class="${todo.done ? "done" : ""}">${todo.text}</p>
  `;

	let timer;
	li.addEventListener("click", (event) => {
		if (event.detail === 1) {
			timer = setTimeout(() => {
				toggleTodo(index);
			}, 200);
		} else if (event.detail > 1) {
			clearTimeout(timer);
			toggleEditMode(index);
		}
	});

	li.append(buttonEdit, buttonDelete);
	return li;
};

const createTodoEditElement = (todo, index) => {
	const li = document.createElement("li");
	const input = document.createElement("input");
	input.type = "text";
	input.value = todo.text;
	input.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
			editTodo(index, input);
		}
	});
	const buttonSave = document.createElement("button");
	buttonSave.innerHTML = "Save";
	buttonSave.classList.add("success");
	const buttonCancel = document.createElement("button");
	buttonCancel.innerHTML = "Cancel";
	buttonCancel.classList.add("danger");
	buttonCancel.addEventListener("click", (event) => {
		event.stopPropagation();
		toggleEditMode(index);
	});
  buttonSave.addEventListener('click', () => {
    editTodo(index, input.value); 
  });
	li.append(input, buttonSave, buttonCancel);
	setTimeout(() => input.focus(), 0);
	return li;
};

const addTodo = (text) => {
	text = text.trim();
	if (!text) {
		alert("La tâche ne peut pas être vide.");
		return; 
	}
	todos.push({
		text: `${text[0].toUpperCase()}${text.slice(1)}`,
		done: false,
	});
	displayTodo();
	saveTodos();
};

const saveTodos = () => {
	try {
		localStorage.setItem("todos", JSON.stringify(todos));
	} catch (error) {
		console.error("Erreur lors de l'enregistrement des tâches :", error);
	}
};

const deleteTodo = (index) => {
	todos.splice(index, 1);
	displayTodo();
	saveTodos();
};

const toggleTodo = (index) => {
	todos[index].done = !todos[index].done;
	displayTodo();
	saveTodos();
};

const toggleEditMode = (index) => {
  todos.forEach((todo, i) => {
    todo.editMode = i === index ? !todo.editMode : false;
  });
  displayTodo();
};


const editTodo = (index, newText) => {
  if (!newText.trim()) {
    alert("La tâche ne peut pas être vide.");
    return;
  }
  todos[index].text = newText;
  todos[index].editMode = false;
  displayTodo();
  saveTodos();
};

displayTodo();
