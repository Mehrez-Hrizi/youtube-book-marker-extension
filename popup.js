import { getCurrentTab } from "./utils.js";

const addNewBookmark = (bookmarksElement, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");
  const newBoomarkElement = document.createElement("div");
  const controlsElement = document.createElement("div");

  bookmarkTitleElement.textContent = bookmark.desc;
  bookmarkTitleElement.className = "bookmark-title";

  newBoomarkElement.id = "bookmark-" + bookmark.time;
  newBoomarkElement.className = "bookmark";
  newBoomarkElement.setAttribute("timestamp", bookmark.time);

  controlsElement.className = "bookmark-controls";
  setBookmarkAttributes("fa-solid fa-play", onPlay, controlsElement);
  setBookmarkAttributes("fa-solid fa-trash", onDelete, controlsElement);

  newBoomarkElement.appendChild(bookmarkTitleElement);
  newBoomarkElement.appendChild(controlsElement);
  bookmarksElement.appendChild(newBoomarkElement);
};

const viewBookmarks = (videoBookmars = []) => {
  const bookmarksElement = document.getElementById("bookmarks");
  bookmarksElement.innerHTML = "";

  if (videoBookmars.length > 0) {
    for (let i = 0; i < videoBookmars.length; i++) {
      const bookmark = videoBookmars[i];
      addNewBookmark(bookmarksElement, bookmark);
    }
  } else {
    bookmarksElement.innerHTML =
      '<i class="empty-bookmarks">No Bookmarks for this video</i>';
  }
};

const onPlay = async (e) => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await getCurrentTab();
  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: bookmarkTime
  });
};

const onDelete = (e) => {};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("i");
  controlElement.className = src;
  controlElement.addEventListener("click", eventListener);

  controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getCurrentTab();

  const queryParameters = activeTab.url.split("?")[1];
  const urlParams = new URLSearchParams(queryParameters);

  const currentVideo = urlParams.get("v");

  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookmarks = data[currentVideo]
        ? JSON.parse(data[currentVideo])
        : [];
      viewBookmarks(currentVideoBookmarks);
    });
  } else {
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML = '<div class="title">This is not a Youtube page</div>';
  }
});
