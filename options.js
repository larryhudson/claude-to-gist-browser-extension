document.addEventListener('DOMContentLoaded', () => {
  const tokenInput = document.getElementById('github-token');
  const saveButton = document.getElementById('save');
  const statusDiv = document.getElementById('status');

  // Load saved token
  chrome.storage.sync.get('githubToken', (data) => {
    if (data.githubToken) {
      tokenInput.value = data.githubToken;
    }
  });

  // Save token
  saveButton.addEventListener('click', () => {
    const token = tokenInput.value;
    chrome.storage.sync.set({ githubToken: token }, () => {
      statusDiv.textContent = 'Token saved successfully!';
      setTimeout(() => {
        statusDiv.textContent = '';
      }, 3000);
    });
  });
});
