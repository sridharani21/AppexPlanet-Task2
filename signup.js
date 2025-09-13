let users = [];

function handleCreateAccount(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    if (!fullName || !email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        alert('Email already exists');
        return;
    }
    
    users.push({ fullName, email, password });
    alert('Account created successfully!');
    window.location.href = './main.html';
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.querySelector('.password-toggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = '👁️';
    }
}

function goToLogin() {
    window.location.href = './login.html';
}