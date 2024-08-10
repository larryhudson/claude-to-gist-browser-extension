document.getElementById('copyJson').addEventListener('click', async () => {
  const statusElement = document.getElementById('status');
  statusElement.textContent = 'Copying JSON...';

  try {
    const response = await chrome.runtime.sendMessage({action: "getConversationData"});
    if (!response.conversationData) {
      throw new Error('No conversation data available');
    }

    const jsonString = JSON.stringify(response.conversationData, null, 2);
    await navigator.clipboard.writeText(jsonString);
    statusElement.textContent = 'JSON copied to clipboard!';
  } catch (error) {
    statusElement.textContent = `Error: ${error.message}`;
  }
});

document.getElementById('createGist').addEventListener('click', async () => {
  const statusElement = document.getElementById('status');
  statusElement.textContent = 'Creating gist...';

  try {
    const response = await chrome.runtime.sendMessage({action: "getConversationData"});
    if (!response.conversationData) {
      throw new Error('No conversation data available');
    }

    const markdown = convertToMarkdown(response.conversationData);
    const gistUrl = await createGitHubGist(markdown);
    
    statusElement.textContent = `Gist created: ${gistUrl}`;
  } catch (error) {
    statusElement.textContent = `Error: ${error.message}`;
  }
});

function convertToMarkdown(conversationData) {
  // TODO: Implement conversion from JSON to Markdown
  return JSON.stringify(conversationData, null, 2);
}

async function createGitHubGist(content) {
  // TODO: Implement GitHub Gist creation
  // This will require OAuth implementation or storing a GitHub token
  return 'https://gist.github.com/example';
}
