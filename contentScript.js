// Function to handle existing and new articles
function handleArticle(article) {
    // Attempt to find the bottom toolbar within the article
    const toolbar = article.querySelector('div[role="group"]');

    if (!toolbar) {
        return;
    }

    if (toolbar.querySelector('.harvest-button')) {
        return;
    }

    const computedStyle = window.getComputedStyle(toolbar);
    if (computedStyle.position === 'static') {
        toolbar.style.position = 'relative';
    }

    const newButton = document.createElement('button');
    newButton.textContent = 'Harvest';
    newButton.className = 'harvest-button';
    
    newButton.style.marginLeft = '8px';
    newButton.style.marginTop = 'auto';
    newButton.style.marginBottom = 'auto';
    newButton.style.padding = '4px 8px';
    newButton.style.height = '22px';
    newButton.style.backgroundColor = '#1D9BF0';
    newButton.style.color = '#fff';
    newButton.style.border = 'none';
    newButton.style.borderRadius = '4px';
    newButton.style.cursor = 'pointer';
    newButton.style.fontSize = '12px';
    newButton.style.fontFamily = 'TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

    newButton.addEventListener('click', () => {
      // Attempt to find the content within the article
      const tweetText = article.querySelector('div[data-testid="tweetText"]').textContent;
      // addPopup(toolbar);

      // Send message to background script to write data
      chrome.runtime.sendMessage({ type: 'WRITE_TO_SHEET', data: tweetText }, (response) => {
          if (response.success) {
              alert('Data successfully written to Google Sheet!');
          } else {
              alert(`Error writing to Google Sheet: ${response.error}`);
          }
      });
    });

    toolbar.appendChild(newButton);
}

function addPopup(parent) {
  // Create the popup element
  const popup = document.createElement('div');
  popup.textContent = 'Hello';
  popup.className = 'harvest-popup';

  // Style the popup
  popup.style.position = 'fixed';
  popup.style.backgroundColor = '#fff';
  popup.style.color = '#333';
  popup.style.width = '200px';
  popup.style.height = '100px';
  popup.style.border = '1px solid #ccc';
  popup.style.padding = '8px';
  popup.style.borderRadius = '4px';
  popup.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
  popup.style.zIndex = '1000';

  popup.style.right = '16px';
  popup.style.bottom = '48px';

  // Append the popup to the body
  parent.appendChild(popup);
}

// Handle existing articles in the DOM
document.querySelectorAll('article').forEach(article => {
    handleArticle(article);
});

// Function to observe new articles added to the DOM
function observeNewArticles() {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.tagName.toLowerCase() === 'article') {
                    handleArticle(node);
                } else if (node.nodeType === 1) {
                    // Check if the added node contains articles within it
                    const articles = node.querySelectorAll('article');
                    articles.forEach(article => {
                        handleArticle(article);
                    });
                }
            });
        });
    });

    // Start observing the document body for new nodes
    observer.observe(document.body, { childList: true, subtree: true });
}

// Start observing for new articles
observeNewArticles();
