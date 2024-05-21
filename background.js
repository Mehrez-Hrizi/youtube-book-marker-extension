chrome.tabs.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    const videoId = tab.url.split("?")[1];
    const urlParams = new URLSearchParams(videoId);

    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId: urlParams.get("v"),
    });
  }
});
