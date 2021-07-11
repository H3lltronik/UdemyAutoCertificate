document.addEventListener('DOMContentLoaded', function () {
    console.log("TEST POPUP WORKING", window.location.href)
    document.querySelector("#button").addEventListener('click', execute)
    const notInUdemy = document.querySelector("#notInUdemy")
    const inUdemy = document.querySelector("#inUdemy")

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
    });

})

async function execute () {
    console.log("Executing...")
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    let res;
    try {
        res = await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ["/src/AutoCertificate.js"],
        }, (a) => {
            console.log("Done callback?", a)
        });
    } catch (e) {
        return;
    }
    console.log("Result of script", res)
}