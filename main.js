let tasks = [];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let editingTaskId = null;
let currentFilter = 'all';

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    if (body.getAttribute('data-theme') === 'dark') {
        body.setAttribute('data-theme', 'light');
        themeToggle.textContent = '🌙';
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }
}

function toggleProfile() {
    document.getElementById('profileDropdown').classList.toggle('show');
}

function viewProfile() {
    document.getElementById('profileModal').classList.add('show');
    document.getElementById('profileDropdown').classList.remove('show');
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.remove('show');
}

function showProfileTab(tabName) {
    document.querySelectorAll('.profile-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.profile-nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');
    document.querySelector(`[onclick="showProfileTab('${tabName}')"]`).classList.add('active');
}

function saveProfile(event) {
    event.preventDefault();
    alert('Profile saved successfully!');
}

function showSettings() {
    viewProfile();
    showProfileTab('notifications');
}

function logout() {
    alert('Logged out successfully!');
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    const overdue = tasks.filter(task => {
        const today = new Date();
        const dueDate = new Date(task.dueDate);
        return task.status === 'pending' && dueDate < today;
    }).length;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('overdueTasks').textContent = overdue;

    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    document.getElementById('progressText').textContent = progressPercentage + '%';
    document.getElementById('progressRing').style.background = `conic-gradient(var(--secondary) ${progressPercentage * 3.6}deg, var(--border) ${progressPercentage * 3.6}deg)`;
}

function renderTasks() {
    const container = document.getElementById('recentTasks');
    let filteredTasks = tasks;

    if (currentFilter !== 'all') {
        filteredTasks = tasks.filter(task => {
            if (currentFilter === 'high') return task.priority === 'high';
            return task.status === currentFilter;
        });
    }

    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <h3>No tasks found</h3>
                <p>Create your first task to get started!</p>
                <button class="btn" onclick="addNewTask()">Add New Task</button>
            </div>`;
        return;
    }

    container.innerHTML = filteredTasks.map(task => `
        <div class="task-item">
            <div class="task-header">
                <div>
                    <div class="task-title">${task.title}</div>
                </div>
                <div class="task-status ${task.status}">
                    <div class="status-icon">${task.status === 'completed' ? '✓' : '○'}</div>
                    ${task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </div>
            </div>
            <div class="task-meta">
                <div class="meta-item">
                    <span>📅</span>
                    ${new Date(task.dueDate).toLocaleDateString()}
                </div>
                <div class="task-priority priority-${task.priority}">
                    ${task.priority}
                </div>
                <div class="task-category">
                    ${task.category}
                </div>
            </div>
            <div class="task-actions">
                <button class="task-action-btn btn-complete" onclick="toggleTaskStatus(${task.id})">
                    ${task.status === 'completed' ? 'Reopen' : 'Complete'}
                </button>
                <button class="task-action-btn btn-edit" onclick="editTask(${task.id})">Edit</button>
                <button class="task-action-btn btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function filterTasks(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    renderTasks();
}

function addNewTask() {
    editingTaskId = null;
    document.getElementById('modalTitle').textContent = 'Add New Task';
    document.getElementById('taskForm').reset();
    document.getElementById('taskModal').classList.add('show');
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    editingTaskId = id;
    document.getElementById('modalTitle').textContent = 'Edit Task';
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskCategory').value = task.category;
    document.getElementById('taskDueDate').value = task.dueDate;
    document.getElementById('taskModal').classList.add('show');
}

function saveTask(event) {
    event.preventDefault();
    
    const taskData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        priority: document.getElementById('taskPriority').value,
        category: document.getElementById('taskCategory').value,
        dueDate: document.getElementById('taskDueDate').value,
        status: 'pending'
    };

    if (editingTaskId) {
        const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
        tasks[taskIndex] = { ...tasks[taskIndex], ...taskData };
    } else {
        taskData.id = Date.now();
        tasks.unshift(taskData);
    }

    closeModal();
    updateStats();
    renderTasks();
    renderCalendar();
}

function toggleTaskStatus(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.status = task.status === 'completed' ? 'pending' : 'completed';
        updateStats();
        renderTasks();
    }
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        updateStats();
        renderTasks();
        renderCalendar();
    }
}

function closeModal() {
    document.getElementById('taskModal').classList.remove('show');
}

function viewAllTasks() {
    renderTasks();
}

function viewDetailedStats() {
    alert('Detailed statistics view coming soon!');
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
    
    document.getElementById('currentMonth').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    
    let calendarHTML = dayNames.map(day => `<div class="calendar-day-header">${day}</div>`).join('');
    
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<div class="calendar-day"></div>';
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const isToday = date.toDateString() === today.toDateString();
        const dateString = date.toISOString().split('T')[0];
        const hasTask = tasks.some(task => task.dueDate === dateString);
        
        calendarHTML += `<div class="calendar-day ${isToday ? 'today' : ''} ${hasTask ? 'has-task' : ''}">${day}</div>`;
    }
    
    calendar.innerHTML = calendarHTML;
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function viewCalendar() {
    document.getElementById('calendarModal').classList.add('show');
}

function closeCalendarModal() {
    document.getElementById('calendarModal').classList.remove('show');
}

document.addEventListener('click', function(event) {
    const profileDropdown = document.getElementById('profileDropdown');
    const profileBtn = document.querySelector('.profile-btn');
    
    if (!profileBtn.contains(event.target)) {
        profileDropdown.classList.remove('show');
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    renderTasks();
    renderCalendar();
    
    const today = new Date();
    document.getElementById('taskDueDate').min = today.toISOString().split('T')[0];
});