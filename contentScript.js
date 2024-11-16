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

    const newButton = document.createElement('button');
    newButton.textContent = 'Harvest';
    newButton.className = 'harvest-button';
    
    newButton.style.marginLeft = '8px';
    newButton.style.padding = '4px 8px';
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
      console.log(tweetText);
    });

    toolbar.appendChild(newButton);
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
