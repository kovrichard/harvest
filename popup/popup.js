// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('authButton');

    authButton.addEventListener('click', () => {
        chrome.identity.getAuthToken({ interactive: true }, function(token) {
            if (chrome.runtime.lastError || !token) {
                alert('Authentication failed. Please try again.');
                return;
            }

			alert('Authentication');

			// Send message to background script to fetch user info
            chrome.runtime.sendMessage({ type: 'FETCH_USER_INFO', token }, (response) => {
                if (response.success) {
                    alert(`Hello, ${response.data.name}!`);
                } else {
                    alert('Error fetching user info.');
                }
            });
        });
    });
});

// Optional: Close the popup when clicking outside
document.addEventListener('click', (event) => {
    const popup = document.querySelector('.popup-container');
    if (popup && !popup.contains(event.target)) {
        window.close();
    }
});
