let conversationData = null;

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.url.includes('chat_conversations/') && details.method === 'POST') {
      try {
        conversationData = JSON.parse(decodeURIComponent(String.fromCharCode.apply(null,
          new Uint8Array(details.requestBody.raw[0].bytes))));
      } catch (error) {
        console.error('Error parsing conversation data:', error);
      }
    }
  },
  {urls: ["https://claude.ai/*"]},
  ["requestBody"]
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getConversationData") {
    sendResponse({conversationData: conversationData});
  }
});
