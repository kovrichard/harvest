chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'FETCH_USER_INFO') {
        const token = request.token;
        console.log('[Background] Fetching user info with token:', token);

        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('[Background] Received response:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('[Background] User info:', data);
            sendResponse({ success: true, data });
        })
        .catch(error => {
            console.error('[Background] Error fetching user info:', error);
            sendResponse({ success: false, error: error.message });
        });

        // Indicate that the response will be sent asynchronously
        return true;
    }
});
