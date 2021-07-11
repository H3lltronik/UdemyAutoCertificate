let loading = false;
let hideOnExecution = null;
let showOnExecution = null;

document.addEventListener('DOMContentLoaded', async function () {
    console.log("TEST POPUP WORKING", window.location.href)

    document.querySelector("#button").addEventListener('click', execute)
    hideOnExecution = document.querySelectorAll(".hideOnExecution");
    showOnExecution = document.querySelectorAll(".showOnExecution");
    
    const notInUdemy = document.querySelector("#notInUdemy")
    const inUdemy = document.querySelector("#inUdemy")
    
    await getLoading ();
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;

        const regex = /[a-zA-Z]+:\/\/[a-zA-Z]+.udemy.com\/course\/[a-zA-Z\/-]*\/lecture*/
        const isInUdemyCourse = regex.test(url);

        if (isInUdemyCourse) {
            notInUdemy.classList.add("hide")
            inUdemy.classList.remove("hide");
        } else {
            notInUdemy.classList.remove("hide");
            inUdemy.classList.add("hide")
        }

        if (loading) loadingIndicators ();
    });

    chrome.runtime.onMessageExternal.addListener(
        function(request, sender, sendResponse) {
          console.log("Hello popup", request);
          if (request.type == 'processDone') {
              restart();
          }
        }
    );

})

function execute () {
    if (loading) {
        console.log("An execution is still working...")
        return;
    }
    else
        console.log("Executing...")
    
    begin();
}

async function begin () {
    setLoading (true);
    loadingIndicators();
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    let res;
    try {
        res = await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ["/src/AutoCertificate.js"],
        });
    } catch (e) {
        return;
    }
}

function loadingIndicators () {
    hideOnExecution.forEach(element => {
        element.classList.add("hide")
    });
    showOnExecution.forEach(element => {
        element.classList.remove("hide")
    });
}

function restart () {
    console.log("Restarting...")
    hideOnExecution.forEach(element => {
        element.classList.remove("hide")
    });
    showOnExecution.forEach(element => {
        element.classList.add("hide")
    });
    setLoading (false);
}

async function getLoading () {
    loading = await new Promise((resolve, reject) => {
        chrome.storage.sync.get(['autoCertificateLoading'], function(result) {
            resolve(result.autoCertificateLoading)
        });
    })
}

function setLoading (value) {
    chrome.storage.sync.set({autoCertificateLoading: value}, function () {
        loading = value
    });
}