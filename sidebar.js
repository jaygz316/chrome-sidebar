const bookmarksUl = document.getElementById('bookmarksUl');
const bookmarkFrame = document.getElementById('bookmarkFrame');
const bookmarksListDiv = document.getElementById('bookmarksList');
const iframeContainerDiv = document.getElementById('iframeContainer');
const closeIframeBtn = document.getElementById('closeIframeBtn');

function displayBookmarks(bookmarkNodes) {
  bookmarkNodes.forEach(node => {
    if (node.url) { // It's a bookmark
      const listItem = document.createElement('li');
      listItem.textContent = node.title || node.url;
      listItem.title = `${node.title}\n${node.url}`;
      listItem.dataset.url = node.url;
      listItem.addEventListener('click', () => {
        bookmarkFrame.src = node.url;
        bookmarksListDiv.classList.add('hidden');
        iframeContainerDiv.classList.remove('hidden');
        iframeContainerDiv.style.display = 'flex';
        bookmarkFrame.style.display = 'block';
        closeIframeBtn.style.display = 'block';
      });
      bookmarksUl.appendChild(listItem);
    } else if (node.children) { // It's a folder
      const folderItem = document.createElement('li');
      folderItem.textContent = `📁 ${node.title}`;
      folderItem.classList.add('folder');
      bookmarksUl.appendChild(folderItem);
      // Recursively display bookmarks in this folder (optional: add indentation or collapsible sections)
      // For simplicity, this example lists them flatly or you can implement nested lists.
      // To keep it simple, we'll list them flat for now, or you can choose to only show top-level bookmarks.
      // displayBookmarks(node.children); // Uncomment to recursively list all bookmarks
    }
  });
}

// Get top-level bookmarks (or use getTree for all)
chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
  // The tree's first node is a root, its children are the main bookmark items/folders
  if (bookmarkTreeNodes && bookmarkTreeNodes.length > 0 && bookmarkTreeNodes[0].children) {
    // Iterate over 'Bookmarks Bar', 'Other Bookmarks', 'Mobile Bookmarks'
    bookmarkTreeNodes[0].children.forEach(folder => {
        if (folder.children) {
            const folderTitle = document.createElement('li');
            folderTitle.textContent = `📘 ${folder.title}`;
            folderTitle.classList.add('folder');
            bookmarksUl.appendChild(folderTitle);
            displayBookmarks(folder.children);
        }
    });
  } else {
    bookmarksUl.innerHTML = '<li>No bookmarks found.</li>';
  }
});

closeIframeBtn.addEventListener('click', () => {
  bookmarkFrame.src = 'about:blank'; // Clear the iframe
  bookmarkFrame.style.display = 'none';
  closeIframeBtn.style.display = 'none';
  iframeContainerDiv.classList.add('hidden');
  iframeContainerDiv.style.display = 'none';
  bookmarksListDiv.classList.remove('hidden');
});

// Optional: Set behavior to open sidebar on action icon click
// This needs to be in a service worker (background.js) if you want it to
// control the panel opening without the user having to select it from the side panel menu.
// However, the side_panel API allows setting a default_path, which makes it available.
// For explicit opening on click:
// In manifest.json, add:
// "background": {
//   "service_worker": "background.js"
// }
//
// Then create background.js:
// chrome.sidePanel
//   .setPanelBehavior({ openPanelOnActionClick: true })
//   .catch((error) => console.error(error));