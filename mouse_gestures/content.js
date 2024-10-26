let isRightClickHeld = false;
let startX = null;
let startY = null;
let isGesture = false;

document.addEventListener("mousedown", (event) => {
  if (event.button === 2) { // Right-click
    isRightClickHeld = true;
    isGesture = false; // Reset gesture status
    startX = event.clientX;
    startY = event.clientY;
  }
});

document.addEventListener("mousemove", (event) => {
  if (isRightClickHeld && startX !== null && startY !== null) {
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    // Detect a horizontal or vertical gesture
    if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal gesture
      isGesture = true; // Set gesture flag
      const direction = deltaX > 0 ? "right" : "left";
      chrome.runtime.sendMessage({ action: "switch_tab", direction });

      // Reset the starting point after detecting the gesture
      isRightClickHeld = false;
      startX = null;
      startY = null;
    } else if (Math.abs(deltaY) > 30 && Math.abs(deltaY) > Math.abs(deltaX)) {
      // Vertical gesture
      isGesture = true; // Set gesture flag
      const direction = deltaY > 0 ? "down" : "up";
      chrome.runtime.sendMessage({ action: "scroll_page", direction });

      // Reset the starting point after detecting the gesture
      isRightClickHeld = false;
      startX = null;
      startY = null;
    }
  }
});

document.addEventListener("mouseup", (event) => {
  if (event.button === 2) { // Right-click release
    isRightClickHeld = false;
    startX = null;
    startY = null;
  }
});

// Prevent the context menu from appearing if it was a gesture
document.addEventListener("contextmenu", (event) => {
  if (isGesture) {
    event.preventDefault(); // Stop the default context menu
    isGesture = false; // Reset gesture flag
  }
});
