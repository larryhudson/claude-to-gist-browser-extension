let conversationData = null;

console.log("Background script initialized");

chrome.webRequest.onCompleted.addListener(
  function (details) {
    console.log("onCompleted listener triggered:", details.url);
    if (
      details.url.includes("api.claude.ai/api/organizations/") &&
      details.url.includes("/chat_conversations/") &&
      // details.url.includes('?tree=True&rendering_mode=raw') &&
      details.method === "GET"
    ) {
      console.log("Matched chat conversation request:", details.url);
      fetch(details.url, {
        headers: details.requestHeaders.reduce((acc, header) => {
          acc[header.name] = header.value;
          return acc;
        }, {}),
      })
        .then((response) => {
          console.log("Fetch response received:", response.status);
          return response.json();
        })
        .then((data) => {
          conversationData = data;
          console.log(
            "Conversation data fetched successfully:",
            JSON.stringify(data).substring(0, 100) + "...",
          );
        })
        .catch((error) => {
          console.error("Error fetching conversation data:", error);
        });
    } else {
      console.log("URL did not match criteria");
    }
  },
  { urls: ["https://api.claude.ai/*"] },
  ["responseHeaders"],
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
