let conversationData = null;

console.log('Background script initialized');

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.url.includes('chat_conversations/') && details.method === 'POST') {
      console.log('Intercepted chat conversation request:', details.url);
      try {
        conversationData = JSON.parse(decodeURIComponent(String.fromCharCode.apply(null,
          new Uint8Array(details.requestBody.raw[0].bytes))));
        console.log('Conversation data parsed successfully');
      } catch (error) {
        console.error('Error parsing conversation data:', error);
      }
    }
  },
  {urls: ["https://claude.ai/*"]},
  ["requestBody"]
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  if (request.action === "getConversationData") {
    console.log('Sending conversation data');
    sendResponse({conversationData: conversationData});
  }
});
