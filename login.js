let users = [
    { email: 'test@example.com', password: '123456', fullName: 'Test User' }
];

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorMessage = document.getElementById('error-message');
    
    errorMessage.style.display = 'none';
    
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        window.location.href = './main.html';
    } else {
        showError('Invalid email or password');
    }
});

function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function togglePassword() {
    const passwordInput = document.getElementById('login-password');
    const toggleButton = document.querySelector('.password-toggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = '👁️';
    }
}