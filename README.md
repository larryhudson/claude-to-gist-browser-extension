# Browser extension for creating a GitHub gist from a Claude conversation

This extension would:
- run on claude.ai
- keep an eye on network requests that are happening - it would look for URLs that start with `chat_conversations/`, and save the JSON of the thing
- clicking on the button would take the JSON, convert it to Markdown, and then create a private GitHub Gist with the contents.

The extension would need to store a GitHub API token in its settings. Or use OAuth to authenticate?
