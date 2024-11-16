document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const signOutButton = document.getElementById('signOutButton');
    const loginView = document.getElementById('login-view');
    const authenticatedView = document.getElementById('authenticated-view');

    // Function to check authentication status
    function checkAuthStatus() {
        chrome.identity.getAuthToken({ interactive: false }, (token) => {
            if (chrome.runtime.lastError || !token) {
                // Not authenticated
                showLoginView();
            } else {
                // Authenticated
                showAuthenticatedView();
            }
        });
    }

    // Function to show login view
    function showLoginView() {
        loginView.classList.remove('hidden');
        authenticatedView.classList.add('hidden');
    }

    // Function to show authenticated view
    function showAuthenticatedView() {
        loginView.classList.add('hidden');
        authenticatedView.classList.remove('hidden');
    }

    // Handle Login Button Click
    loginButton.addEventListener('click', () => {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError || !token) {
                console.error('Authentication failed:', chrome.runtime.lastError);
                alert('Authentication failed. Please try again.');
                return;
            }

            // Successfully authenticated
            showAuthenticatedView();
            console.log('Authentication successful. Token:', token);
        });
    });

    // Handle Sign Out Button Click
    signOutButton.addEventListener('click', () => {
        // Get the current token to remove it
        chrome.identity.getAuthToken({ interactive: false }, (token) => {
            if (chrome.runtime.lastError || !token) {
                console.error('Failed to get token for sign out:', chrome.runtime.lastError);
                return;
            }

            // Remove the token
            chrome.identity.removeCachedAuthToken({ token: token }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Failed to remove token:', chrome.runtime.lastError);
                } else {
                    console.log('User signed out successfully.');
                    showLoginView();
                }
            });
        });
    });

    // Initial check on load
    checkAuthStatus();
});
