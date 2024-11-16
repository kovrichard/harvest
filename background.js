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
    } else if (request.type === 'WRITE_TO_SHEET') {
        const data = [request.data]; // Data to write to the sheet

        // Replace with your Spreadsheet ID and range
        const spreadsheetId = '1YC5G5zEA6fMm28bprYxlKZt-2FTGa5f-5DbJ0aIhS5c';
        const range = 'Sheet1!A1'; // Example range

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW`;

        chrome.identity.getAuthToken({ interactive: true }, function(token) {
            if (chrome.runtime.lastError || !token) {
                console.error('Failed to obtain token:', chrome.runtime.lastError);
                sendResponse({ success: false, error: chrome.runtime.lastError });
                return;
            }
            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    values: [data] // Data should be an array of values
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(responseData => {
                console.log('[Background] Data successfully written to sheet:', responseData);
                sendResponse({ success: true, data: responseData });
            })
            .catch(error => {
                console.error('[Background] Error writing to sheet:', error);
                sendResponse({ success: false, error: error.message });
            });
        });

        // Indicate that the response will be sent asynchronously
        return true;
    }
});
