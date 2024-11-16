// Function to create a new Google Spreadsheet
async function createSpreadsheet(token, title = 'Harvest by Data Rush') {
    const url = 'https://sheets.googleapis.com/v4/spreadsheets';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            properties: {
                title: title
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create spreadsheet: ${errorData.error.message}`);
    }

    const data = await response.json();
    return data.spreadsheetId;
}

// Function to append data to the spreadsheet
async function appendDataToSheet(token, spreadsheetId, data, sheetName = 'Sheet1') {
    const range = `${sheetName}!A1`; // Adjust as needed
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            values: [data] // Each sub-array represents a row
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to append data: ${errorData.error.message}`);
    }

    const responseData = await response.json();
    return responseData;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'FETCH_USER_INFO') {
        const token = request.token;

        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            sendResponse({ success: true, data });
        })
        .catch(error => {
            sendResponse({ success: false, error: error.message });
        });

        // Indicate that the response will be sent asynchronously
        return true;
    } else if (request.type === 'WRITE_TO_SHEET') {
        const data = [request.data]; // Data to write to the sheet

        // Retrieve the stored Spreadsheet ID
        chrome.storage.local.get(['spreadsheetId'], async (result) => {
            let spreadsheetId = result.spreadsheetId;

            try {
                // Obtain an access token
                chrome.identity.getAuthToken({ interactive: true }, async (token) => {
                    if (chrome.runtime.lastError || !token) {
                        sendResponse({ success: false, error: chrome.runtime.lastError.message || 'Failed to obtain token.' });
                        return;
                    }

                    // If Spreadsheet ID does not exist, create a new Spreadsheet
                    if (!spreadsheetId) {
                        spreadsheetId = await createSpreadsheet(token, 'Harvest Data');

                        // Store the new Spreadsheet ID for future use
                        chrome.storage.local.set({ spreadsheetId: spreadsheetId }, () => {
                            console.log('New Spreadsheet ID stored:', spreadsheetId);
                        });
                    }

                    // Append data to the Spreadsheet
                    const appendResponse = await appendDataToSheet(token, spreadsheetId, data, 'Sheet1');

                    sendResponse({ success: true, data: appendResponse });
                });
            } catch (error) {
                sendResponse({ success: false, error: error.message });
            }
        });

        // Indicate that the response will be sent asynchronously
        return true;
    }
});
