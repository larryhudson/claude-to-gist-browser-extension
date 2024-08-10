# Claude to GitHub Gist Browser Extension

This browser extension allows you to easily create GitHub Gists from your conversations with Claude AI. It captures the conversation data, converts it to Markdown, and creates a private GitHub Gist with a single click.

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

1. The extension monitors network requests on claude.ai, capturing conversation data from specific API endpoints.
2. When you interact with the popup, it retrieves this captured data.
3. For Markdown conversion, it formats the conversation with timestamps, roles (Human/Assistant), and includes any attachments or files.
4. When creating a Gist, it uses your GitHub token to authenticate and create a private Gist via the GitHub API.

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
