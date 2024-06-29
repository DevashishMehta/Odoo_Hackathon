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
    let updateIndex = null;

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
                    <td>${task.added}</td>
                    <td>${task.status}</td>
                    <td>
                        <button onclick="deleteTask(${index})">Delete</button>
                        <button onclick="editTask(${index})">Update</button>
                    </td>
                `;
                taskList.appendChild(row);
            });
        }
    };

    // Function to add a task
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
            added: new Date().toLocaleString(),
        };
        if (updateIndex !== null) {
            tasks[updateIndex] = newTask;
            updateIndex = null;
        } else {
            tasks.push(newTask);
        }
        displayTasks(tasks);
        taskForm.reset();
    });

    // Function to delete a task
    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        displayTasks(tasks);
    };

    // Function to edit a task
    window.editTask = (index) => {
        const task = tasks[index];
        taskForm.task.value = task.task;
        taskForm.description.value = task.description;
        taskForm.assignee.value = task.assignee;
        taskForm.priority.value = task.priority;
        taskForm.dueDate.value = task.dueDate;
        taskForm.comments.value = task.comments;
        taskForm.status.value = task.status;
        updateIndex = index;
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

    // Event listeners for filters
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
        displayTasks(tasks);
    });

    displayTasks(tasks); // Initial display
});
