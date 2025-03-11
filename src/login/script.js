document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Define valid credentials
    const validEmail = 'admin123@gmail.com';
    const validPassword = 'admin123';

    // Check credentials
    if (email === validEmail && password === validPassword) {
        // Store remember preference if checked (e.g., in localStorage for simplicity)
        if (remember) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
        } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
        }

        // Redirect to dashboard
        window.location.href = '/src/dashboard/dashboard.html';
    } else {
        showErrorModal();
    }

    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Remember:', remember);
});

// Function to show the error modal
function showErrorModal() {
    const modal = document.getElementById('errorModal');
    modal.style.display = 'flex';
}

// Function to close the error modal
document.getElementById('closeModalBtn').addEventListener('click', function() {
    const modal = document.getElementById('errorModal');
    modal.style.display = 'none';
});

// Optional: Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('errorModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Optional: Pre-fill fields if "Remember Password" was checked previously
window.addEventListener('load', function() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedEmail && rememberedPassword) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('password').value = rememberedPassword;
        document.getElementById('remember').checked = true;
    }
});