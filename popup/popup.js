// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('authButton');

    authButton.addEventListener('click', () => {
        console.log('Auth button clicked');
        chrome.identity.getAuthToken({ interactive: true }, function(token) {
            if (chrome.runtime.lastError || !token) {
                console.error('Authentication failed:', chrome.runtime.lastError);
                alert('Authentication failed. Please try again.');
                return;
            }

			alert('Authentication');

            console.log('Authentication successful. Token:', token);

            // Optionally, fetch user information
            fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`)
            .then(response => response.json())
            .then(data => {
                console.log('User info:', data);
                alert(`Hello, ${data.name}!`);
            })
            .catch(error => {
				console.error('Error fetching user info:', error);
				alert(`Error fetching user info, ${token}`);
				alert(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);
            });

            // Close the popup after successful authentication
            window.close();
        });
    });
});

// Optional: Close the popup when clicking outside
document.addEventListener('click', (event) => {
    const popup = document.querySelector('.popup-container');
    if (popup && !popup.contains(event.target)) {
        console.log('Popup closed by clicking outside.');
        window.close();
    }
});
