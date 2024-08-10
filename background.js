let conversationData = null;

console.log("Background script initialized");

chrome.webRequest.onCompleted.addListener(
  function (details) {
    console.log("onCompleted listener triggered:", details.url);
    if (
      details.url.includes("api.claude.ai/api/organizations/") &&
      details.url.includes("/chat_conversations/") &&
      details.method === "GET"
    ) {
      console.log("Matched chat conversation request:", details.url);
      chrome.webRequest.filterResponseData(details.requestId).ondata = (event) => {
        const decoder = new TextDecoder("utf-8");
        const str = decoder.decode(event.data, {stream: true});
        try {
          conversationData = JSON.parse(str);
          console.log(
            "Conversation data captured successfully:",
            JSON.stringify(conversationData).substring(0, 100) + "...",
          );
        } catch (error) {
          console.error("Error parsing conversation data:", error);
        }
      };
    } else {
      console.log("URL did not match criteria");
    }
  },
  { urls: ["https://api.claude.ai/*"] },
  ["responseHeaders"]
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request);
  if (request.action === "getConversationData") {
    console.log(
      "Sending conversation data:",
      conversationData ? "Data available" : "No data",
    );
    sendResponse({ conversationData: conversationData });
  }
  return true; // Indicates that the response is sent asynchronously
});

// Log when the background script is loaded
console.log("Background script loaded and running");
