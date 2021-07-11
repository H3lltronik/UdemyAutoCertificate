function activeIcon (tabId) {
    console.log("activeIcon")
    chrome.action.setIcon({
        path: chrome.runtime.getURL("../../images/favicon-32x32.png"),
        tabId: tabId
    })
}
function disableIcon (tabId) {
    console.log("disableIcon")
    chrome.action.setIcon({
        path: chrome.runtime.getURL("../../images/disabled-favicon-32x32.png"),
        tabId: tabId
    })
}

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status != "complete") return;
    const regex = /[a-zA-Z]+:\/\/[a-zA-Z]+.udemy.com\/course\/[a-zA-Z\/-]*\/lecture*/
    const isInUdemyCourse = regex.test(tab.url);
    
    if (isInUdemyCourse) {
        activeIcon (tabId)
    } else {
        disableIcon (tabId)
    }
})

console.log("TEST BACKGROUND WORKING")