# Claude to GitHub Gist Browser Extension

This browser extension allows you to easily create GitHub Gists from your conversations with Claude AI. It captures the conversation data, converts it to Markdown, and creates a private GitHub Gist with a single click.

This project was inspired by Simon Willison's tool that turns Claude's JSON into Markdown using an Observable notebook: https://simonwillison.net/2024/Aug/8/convert-claude-json-to-markdown/

This project was developed using Aider, an AI pair programming tool: https://aider.chat/

Note: this has not been thoroughly tested yet!

## Features

- Runs on claude.ai
- Automatically captures conversation data from network requests
- Converts conversation data to Markdown format
- Creates private GitHub Gists with conversation content
- Copies JSON or Markdown to clipboard
- Automatically copies the created Gist URL to clipboard

## Installation

1. Clone this repository or download the source code.
2. Open your browser's extension management page:
   - Chrome: chrome://extensions
   - Edge: edge://extensions
3. Enable "Developer mode".
4. Click "Load unpacked" and select the directory containing the extension files.

## Setup

1. Get a GitHub Personal Access Token:
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Generate a new token with the `gist` scope
2. Open the extension options:
   - Click on the extension icon in your browser
   - Select "Options" or "Settings"
3. Paste your GitHub Personal Access Token in the provided field and click "Save".

## Usage

1. Visit https://claude.ai and start or open a conversation.
2. Once you're ready to create a Gist, click on the extension icon to open the popup.
3. You'll see three options:
   - "Copy JSON": Copies the raw conversation data as JSON to your clipboard.
   - "Copy Markdown": Converts the conversation to Markdown and copies it to your clipboard.
   - "Create Gist": Converts the conversation to Markdown, creates a private GitHub Gist, and copies the Gist URL to your clipboard.
4. Click your desired option. The extension will process your request and display a status message.

## How It Works

The extension works by intercepting network requests, processing conversation data, and interacting with the GitHub API. Here's a detailed breakdown of its functionality:

### 1. Capturing Conversation Data

The extension uses a background script to monitor network requests on claude.ai. It captures conversation data from specific API endpoints:

```javascript
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (
      !isExtensionFetch &&
      details.url.includes("api.claude.ai/api/organizations/") &&
      details.url.includes("/chat_conversations/") &&
      details.method === "GET"
    ) {
      // Fetch and store conversation data
      fetch(details.url, {
        method: "GET",
        headers: details.requestHeaders.reduce((acc, header) => {
          acc[header.name] = header.value;
          return acc;
        }, {}),
      })
        .then((response) => response.json())
        .then((data) => {
          conversationData = data;
        });
    }
  },
  { urls: ["https://api.claude.ai/*"] },
  ["requestBody"]
);
```

### 2. Converting to Markdown

When the user requests a Markdown conversion, the extension processes the captured conversation data:

```javascript
function convertToMarkdown(conversationData) {
  const conversationName = conversationData.name || "Untitled Conversation";
  let markdown = `# ${conversationName}\n\n`;

  conversationData.chat_messages.forEach((message) => {
    const role = message.sender === 'human' ? 'Human' : 'Assistant';
    const timestamp = new Date(message.created_at).toLocaleString();

    markdown += `## ${role} (${timestamp})\n\n`;
    markdown += `${message.text}\n\n`;

    // Add attachments and files if present
    // ...
  });

  return markdown;
}
```

### 3. Creating GitHub Gists

When the user clicks "Create Gist", the extension uses the GitHub API to create a new Gist:

```javascript
async function createGitHubGist(content, conversationName) {
  const { githubToken } = await chrome.storage.sync.get('githubToken');
  
  const fileName = `${conversationName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;

  const response = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      'Authorization': `token ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: `Claude Conversation: ${conversationName}`,
      public: false,
      files: {
        [fileName]: {
          content: content
        }
      }
    })
  });

  const data = await response.json();
  return data.html_url;
}
```

### 4. User Interface

The extension's popup provides a simple interface for users to interact with these features:

```html
<body>
  <h2>Claude to GitHub Gist</h2>
  <button id="copyJson">Copy JSON</button>
  <button id="copyMarkdown">Copy Markdown</button>
  <button id="createGist">Create Gist</button>
  <div id="status"></div>
  <script src="popup.js"></script>
</body>
```

Each button triggers the corresponding action in the `popup.js` file.

## Troubleshooting

- If you encounter any issues with creating Gists, ensure your GitHub token is correctly set in the extension options.
- Make sure you're on a claude.ai conversation page when using the extension.
- Check the browser console for any error messages if the extension isn't working as expected.

## Privacy and Security

- Your GitHub token is stored securely in the browser's extension storage.
- Conversation data is only stored temporarily in the extension's background script and is not persisted.
- Gists are created as private by default, ensuring your conversations remain confidential.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)
