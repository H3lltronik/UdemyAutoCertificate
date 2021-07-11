function DOMRegex(regex) {
    let output = [];
    for (let i of document.querySelectorAll('*')) {
        for (let j of i.attributes) {
            if (regex.test(j.value)) {
                output.push({
                    'element': i,
                    'attribute name': j.name,
                    'attribute value': j.value
                });
            }
        }
    }
    return output;
}

function waitforme(ms)  {
    return new Promise( resolve => { setTimeout(resolve, ms); });
}

async function udemyWea () {
    console.log("Auto-Certificate Script")

    const courseSections = DOMRegex(/section-panel-[0-9]+/);
    let sectionCounter = 0;
    for (const section of courseSections) {
        const isSectionOpened = section.element.querySelector(".udi-angle-up");
        const isSectionClosed = section.element.querySelector(".udi-angle-down");

        if (isSectionClosed)
            section.element.querySelector('[role="button"]').click();
        
        const sectionCheckboxes = section.element.querySelectorAll(`input[type='checkbox'][data-purpose="progress-toggle-button"]`);
        // console.log(`The section ${sectionCounter} has ${sectionCheckboxes.length} checkboxes`)

        let checkboxCounter = 0;
        for (const checkbox of sectionCheckboxes) {
            let checkboxAlreadyActive = getComputedStyle(section.element.querySelectorAll('span.toggle-control-label')[checkboxCounter], ':before')['background-color'] == "rgb(0, 95, 116)";
            if (!checkboxAlreadyActive) {
                // console.log(`Checkbox ${checkboxCounter} is NOT active!!`)
                checkbox.click();
            } else {
                // checkbox.click();
            }
            checkboxCounter++;
            waitforme(100);
        }

        sectionCounter++;
        await waitforme(1000);
    }

    // console.log("Finished!");
}

// udemyWea ();

const main = new Main();
main.setup();
main.run();