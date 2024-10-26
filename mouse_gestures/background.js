chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "switch_tab") {
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
          const activeIndex = activeTabs[0].index;
          let targetTab;
  
          if (request.direction === "right") {
            targetTab = tabs[(activeIndex + 1) % tabs.length];
          } else if (request.direction === "left") {
            targetTab = tabs[(activeIndex - 1 + tabs.length) % tabs.length];
          }
  
          if (targetTab) {
            chrome.tabs.update(targetTab.id, { active: true });
          }
        });
      });
    } else if (request.action === "scroll_page") {
      if (sender.tab?.id !== undefined) {
        chrome.scripting.executeScript({
          target: { tabId: sender.tab.id },
          func: (direction) => {
            if (direction === "up") {
              window.scrollTo(0, 0); // Scroll to the top
            } else if (direction === "down") {
              window.scrollTo(0, document.body.scrollHeight); // Scroll to the bottom
            }
          },
          args: [request.direction]
        });
      }
    }
    sendResponse({ status: "action_completed" });
  });
  