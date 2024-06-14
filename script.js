document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo');
    const todoList = document.getElementById('todos');
    let userPoints = 100; // Contoh nilai awal poin pengguna

    // Load todos from LocalStorage and ensure it's an array
    let todos = JSON.parse(localStorage.getItem('todos'));
    if (!Array.isArray(todos)) {
        todos = [];
    }

    addTodoBtn.addEventListener('click', addTodo);
    todoList.addEventListener('click', handleTodoClick);

    function addTodo() {
        const todoText = todoInput.value.trim();
        if (todoText === "") return;

        const newTodo = {
            id: Date.now(),
            text: todoText,
            completed: false,
            deleted: false,
            updated: false,
            dueDate: new Date(Date.now() + 2 * 60 * 1000).toISOString() // 2 menit dari sekarang
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos();
        todoInput.value = '';
    }

    function handleTodoClick(e) {
        const target = e.target;
        const id = parseInt(target.closest('li').dataset.id);

        if (target.classList.contains('delete')) {
            deleteTodo(id);
        } else if (target.classList.contains('complete')) {
            toggleComplete(id);
        } else if (target.classList.contains('update')) {
            updateTodoText(id);
        }
    }

    function deleteTodo(id) {
        const todo = todos.find(todo => todo.id === id);
        if (todo) {
            todo.deleted = true;
            saveTodos();
            renderTodos();
        }
    }

    function toggleComplete(id) {
        const todo = todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            if (todo.completed) {
                userPoints += 10; // Tambah poin jika selesai
            }
            saveTodos();
            saveUserPoints();
            renderTodos();
        }
    }

    function updateTodoText(id) {
        const newText = prompt("Update your task:");
        if (newText) {
            const todo = todos.find(todo => todo.id === id);
            if (todo) {
                todo.text = newText;
                todo.updated = true;
                saveTodos();
                renderTodos();
            }
        }
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function saveUserPoints() {
        localStorage.setItem('userPoints', userPoints);
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            if (!todo.deleted) {
                const todoItem = document.createElement('li');
                todoItem.dataset.id = todo.id;
                todoItem.className = todo.completed ? 'completed' : '';

                todoItem.innerHTML = `
                    <span>${todo.text}</span>
                    <div class="todo-actions">
                        <button class="complete">${todo.completed ? 'Undo' : 'Complete'}</button>
                        <button class="update">Update</button>
                        <button class="delete">Delete</button>
                    </div>
                `;

                todoList.appendChild(todoItem);
            }
        });
    }

    function checkDueDates() {
        const now = Date.now();
        todos.forEach(todo => {
            if (!todo.completed && !todo.deleted && todo.dueDate && now > new Date(todo.dueDate).getTime()) {
                // Kurangi poin dan tampilkan notifikasi
                userPoints -= 10; // Misalnya, kurangi 10 poin
                alert(`You Missed For Deadline ${todo.text}`);
            }
        });
        saveTodos();
        saveUserPoints();
    }

    function sendReminder() {
        const now = Date.now();
        todos.forEach(todo => {
            if (!todo.completed && !todo.deleted && todo.dueDate && new Date(todo.dueDate).getTime() - now < 100000) {
                // Tampilkan notifikasi jika kurang dari 1 jam
                alert(`Reminder ${todo.text} is due soon!`);
            }
        });
    }

    renderTodos();

    setInterval(() => {
        checkDueDates();
        sendReminder();
    }, 10000); // Periksa setiap 10 detik
});