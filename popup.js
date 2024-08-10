console.log('Popup script initialized');

document.getElementById('copyJson').addEventListener('click', async () => {
  console.log('Copy JSON button clicked');
  const statusElement = document.getElementById('status');
  statusElement.textContent = 'Copying JSON...';

  try {
    console.log('Requesting conversation data');
    const response = await chrome.runtime.sendMessage({action: "getConversationData"});
    if (!response.conversationData) {
      throw new Error('No conversation data available');
    }
    console.log('Conversation data received');

    const jsonString = JSON.stringify(response.conversationData, null, 2);
    await navigator.clipboard.writeText(jsonString);
    console.log('JSON copied to clipboard');
    statusElement.textContent = 'JSON copied to clipboard!';
  } catch (error) {
    console.error('Error copying JSON:', error);
    statusElement.textContent = `Error: ${error.message}`;
  }
});

document.getElementById('createGist').addEventListener('click', async () => {
  console.log('Create Gist button clicked');
  const statusElement = document.getElementById('status');
  statusElement.textContent = 'Creating gist...';

  try {
    console.log('Requesting conversation data');
    const response = await chrome.runtime.sendMessage({action: "getConversationData"});
    if (!response.conversationData) {
      throw new Error('No conversation data available');
    }
    console.log('Conversation data received');

    const markdown = convertToMarkdown(response.conversationData);
    console.log('Markdown converted');
    const gistUrl = await createGitHubGist(markdown);
    console.log('Gist created:', gistUrl);
    
    statusElement.textContent = `Gist created: ${gistUrl}`;
  } catch (error) {
    console.error('Error creating gist:', error);
    statusElement.textContent = `Error: ${error.message}`;
  }
});

function convertToMarkdown(conversationData) {
  console.log('Converting to Markdown');
  // TODO: Implement conversion from JSON to Markdown
  return JSON.stringify(conversationData, null, 2);
}

async function createGitHubGist(content) {
  console.log('Creating GitHub Gist');
  // TODO: Implement GitHub Gist creation
  // This will require OAuth implementation or storing a GitHub token
  return 'https://gist.github.com/example';
}
