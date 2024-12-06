document.addEventListener('DOMContentLoaded', function() {
    // Handle profile picture upload
    const avatarUpload = document.getElementById('avatarUpload');
    const profilePic = document.getElementById('profilePic');

    avatarUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePic.src = e.target.result;
                // Here you would typically upload the image to your server
                saveToLocalStorage('profilePic', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });

    // Handle profile form submission
    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Update display name
        document.getElementById('displayName').textContent = username;
        document.getElementById('userEmail').textContent = email;

        // Save to local storage (in a real app, you'd save to a server)
        saveToLocalStorage('userData', {
            username,
            email,
            // Don't store password in local storage in a real app!
            lastUpdated: new Date().toISOString()
        });

        // Show success message
        alert('Profile updated successfully!');
    });

    // Load saved data
    loadSavedData();
});

function saveToLocalStorage(key, value) {
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
}

function loadSavedData() {
    // Load profile picture
    const savedPic = localStorage.getItem('profilePic');
    if (savedPic) {
        document.getElementById('profilePic').src = savedPic;
    }

    // Load user data
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
        const userData = JSON.parse(savedUserData);
        document.getElementById('username').value = userData.username;
        document.getElementById('email').value = userData.email;
        document.getElementById('displayName').textContent = userData.username;
        document.getElementById('userEmail').textContent = userData.email;
    }
}