let conversationData = null;

console.log("Background script initialized");

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    console.log("onBeforeRequest listener triggered:", details.url);
    if (
      details.url.includes("api.claude.ai/api/organizations/") &&
      details.url.includes("/chat_conversations/") &&
      details.method === "GET"
    ) {
      console.log("Matched chat conversation request:", details.url);

      // Use fetch to get the response data
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
          console.log(
            "Conversation data captured successfully:",
            JSON.stringify(conversationData).substring(0, 100) + "...",
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
  ["requestHeaders"],
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
