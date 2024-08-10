let conversationData = null;

console.log('Background script initialized');

chrome.webRequest.onCompleted.addListener(
  function(details) {
    if (details.url.includes('api.claude.ai/api/organizations/') && 
        details.url.includes('/chat_conversations/') && 
        details.url.includes('?tree=True&rendering_mode=raw') &&
        details.method === 'GET') {
      console.log('Intercepted chat conversation request:', details.url);
      fetch(details.url, {
        headers: details.requestHeaders.reduce((acc, header) => {
          acc[header.name] = header.value;
          return acc;
        }, {})
      })
      .then(response => response.json())
      .then(data => {
        conversationData = data;
        console.log('Conversation data fetched successfully');
      })
      .catch(error => {
        console.error('Error fetching conversation data:', error);
      });
    }
  },
  {urls: ["https://api.claude.ai/*"]},
  ["responseHeaders"]
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  if (request.action === "getConversationData") {
    console.log('Sending conversation data');
    sendResponse({conversationData: conversationData});
  }
  return true; // Indicates that the response is sent asynchronously
});
