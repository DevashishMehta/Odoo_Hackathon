document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.querySelector('.form form');
    const searchTitleInput = document.getElementById('searchTitle');
    const filterAssigneeInput = document.getElementById('filterAssignee');
    const filterDueDateInput = document.getElementById('filterDueDate');
    const filterPrioritySelect = document.getElementById('filterPriority');
    const filterStatusSelect = document.getElementById('filterStatus');
    const clearFiltersButton = document.getElementById('clearFilters');
    const taskList = document.querySelector('table tbody');
    const noTasksMessage = document.querySelector('.no-tasks-message');

    let tasks = [];
    let updateId = null;

    // Function to display tasks
    const displayTasks = (taskArray) => {
        taskList.innerHTML = ''; // Clear current tasks
        if (taskArray.length === 0) {
            noTasksMessage.style.display = 'block';
        } else {
            noTasksMessage.style.display = 'none';
            taskArray.forEach((task, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${task.task}</td>
                    <td>${task.description}</td>
                    <td>${task.assignee}</td>
                    <td>${task.priority}</td>
                    <td>${task.dueDate}</td>
                    <td>${task.comments}</td>
                    <td>${new Date(task.added).toLocaleString()}</td>
                    <td>${task.status}</td>
                    <td>
                        <button onclick="deleteTask('${task._id}')">Delete</button>
                        <button onclick="editTask('${task._id}', ${index})">Update</button>
                    </td>
                `;
                taskList.appendChild(row);
            });
        }
    };

    // Function to fetch tasks from backend
    const fetchTasks = async () => {
        try {
            const response = await fetch('/tasks');
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            tasks = await response.json();
            displayTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Function to add or update a task
    const saveTask = async (taskData, id = null) => {
        const url = id ? `/tasks/${id}` : '/tasks';
        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });
            if (!response.ok) {
                throw new Error('Failed to save task');
            }
            const updatedTask = await response.json();
            if (id) {
                tasks = tasks.map(task => task._id === id ? updatedTask : task);
            } else {
                tasks.push(updatedTask);
            }
            displayTasks(tasks);
            taskForm.reset();
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    // Function to delete a task
    window.deleteTask = async (id) => {
        try {
            const response = await fetch(`/tasks/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            tasks = tasks.filter(task => task._id !== id);
            displayTasks(tasks);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // Function to edit a task
    window.editTask = (id, index) => {
        const task = tasks.find(task => task._id === id);
        if (!task) {
            console.error('Task not found');
            return;
        }
        taskForm.task.value = task.task;
        taskForm.description.value = task.description;
        taskForm.assignee.value = task.assignee;
        taskForm.priority.value = task.priority;
        taskForm.dueDate.value = task.dueDate ? task.dueDate.slice(0, 10) : ''; // Assuming dueDate is stored as YYYY-MM-DD
        taskForm.comments.value = task.comments;
        taskForm.status.value = task.status;
        updateId = id;
    };

    // Function to filter tasks
    const filterTasks = () => {
        const searchTitle = searchTitleInput.value.toLowerCase();
        const assigneeFilter = filterAssigneeInput.value.toLowerCase();
        const dueDateFilter = filterDueDateInput.value;
        const priorityFilter = filterPrioritySelect.value;
        const statusFilter = filterStatusSelect.value;

        const filteredTasks = tasks.filter(task => {
            return (
                (task.task.toLowerCase().includes(searchTitle) || task.description.toLowerCase().includes(searchTitle)) &&
                (assigneeFilter === "" || task.assignee.toLowerCase().includes(assigneeFilter)) &&
                (dueDateFilter === "" || task.dueDate === dueDateFilter) &&
                (priorityFilter === "" || task.priority === priorityFilter) &&
                (statusFilter === "" || task.status === statusFilter)
            );
        });

        displayTasks(filteredTasks);
    };

    // Event listeners for form submission and filters
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTask = {
            task: taskForm.task.value,
            description: taskForm.description.value,
            assignee: taskForm.assignee.value,
            priority: taskForm.priority.value,
            dueDate: taskForm.dueDate.value,
            comments: taskForm.comments.value,
            status: taskForm.status.value,
        };
        if (updateId) {
            saveTask(newTask, updateId);
        } else {
            saveTask(newTask);
        }
    });

    searchTitleInput.addEventListener('input', filterTasks);
    filterAssigneeInput.addEventListener('input', filterTasks);
    filterDueDateInput.addEventListener('change', filterTasks);
    filterPrioritySelect.addEventListener('change', filterTasks);
    filterStatusSelect.addEventListener('change', filterTasks);
    clearFiltersButton.addEventListener('click', () => {
        searchTitleInput.value = '';
        filterAssigneeInput.value = '';
        filterDueDateInput.value = '';
        filterPrioritySelect.value = '';
        filterStatusSelect.value = '';
        fetchTasks(); // Reload tasks
    });

    fetchTasks(); // Initial fetch of tasks
});
