console.log('Popup script initialized');

document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup DOM fully loaded');
});

document.getElementById('copyJson').addEventListener('click', async () => {
  console.log('Copy JSON button clicked');
  const statusElement = document.getElementById('status');
  statusElement.textContent = 'Copying JSON...';

  try {
    console.log('Requesting conversation data');
    const response = await chrome.runtime.sendMessage({action: "getConversationData"});
    console.log('Response received:', response);
    if (!response.conversationData) {
      throw new Error('No conversation data available');
    }
    console.log('Conversation data received:', JSON.stringify(response.conversationData).substring(0, 100) + '...');

    const jsonString = JSON.stringify(response.conversationData, null, 2);
    await navigator.clipboard.writeText(jsonString);
    console.log('JSON copied to clipboard');
    statusElement.textContent = 'JSON copied to clipboard!';
  } catch (error) {
    console.error('Error copying JSON:', error);
    statusElement.textContent = `Error: ${error.message}`;
  }
});

document.getElementById('copyMarkdown').addEventListener('click', async () => {
  console.log('Copy Markdown button clicked');
  const statusElement = document.getElementById('status');
  statusElement.textContent = 'Copying Markdown...';

  try {
    console.log('Requesting conversation data');
    const response = await chrome.runtime.sendMessage({action: "getConversationData"});
    console.log('Response received:', response);
    if (!response.conversationData) {
      throw new Error('No conversation data available');
    }
    console.log('Conversation data received:', JSON.stringify(response.conversationData).substring(0, 100) + '...');

    const markdown = convertToMarkdown(response.conversationData);
    await navigator.clipboard.writeText(markdown);
    console.log('Markdown copied to clipboard');
    statusElement.textContent = 'Markdown copied to clipboard!';
  } catch (error) {
    console.error('Error copying Markdown:', error);
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
    console.log('Response received:', response);
    if (!response.conversationData) {
      throw new Error('No conversation data available');
    }
    console.log('Conversation data received:', JSON.stringify(response.conversationData).substring(0, 100) + '...');

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
  if (!conversationData || !conversationData.chat_messages) {
    return "No conversation data available";
  }

  let markdown = "# Claude Conversation\n\n";

  conversationData.chat_messages.forEach((message, index) => {
    const role = message.sender === 'human' ? 'Human' : 'Assistant';
    const timestamp = new Date(message.created_at).toLocaleString();

    markdown += `## ${role} (${timestamp})\n\n`;
    markdown += `${message.text}\n\n`;

    if (message.attachments && message.attachments.length > 0) {
      markdown += "### Attachments:\n";
      message.attachments.forEach(attachment => {
        markdown += `- ${attachment.file_name}\n`;
      });
      markdown += "\n";
    }

    if (message.files && message.files.length > 0) {
      markdown += "### Files:\n";
      message.files.forEach(file => {
        markdown += `- ${file.file_name}\n`;
      });
      markdown += "\n";
    }
  });

  return markdown;
}

async function createGitHubGist(content) {
  console.log('Creating GitHub Gist');
  const { githubToken } = await chrome.storage.sync.get('githubToken');
  
  if (!githubToken) {
    throw new Error('GitHub token not found. Please set it in the extension options.');
  }

  const response = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      'Authorization': `token ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: 'Claude Conversation',
      public: false,
      files: {
        'claude_conversation.md': {
          content: content
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to create gist: ${response.statusText}`);
  }

  const data = await response.json();
  return data.html_url;
}

// Log when the popup script is loaded
console.log('Popup script loaded and running');
