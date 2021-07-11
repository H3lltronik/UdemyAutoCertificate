(async function () {

    function Section (element, sectionId) {
        this.element = element;
        this.checkboxCounter = 0;
        this.sectionId = sectionId;
        this.checkboxActiveIndicator = "rgb(0, 95, 116)";
        this.isSectionOpened = this.element.querySelector(".udi-angle-up")
        this.isSectionClosed = this.element.querySelector(".udi-angle-down")
    }
    
    Section.prototype = {
        getCheckboxes: function () {
            return this.element.querySelectorAll(`input[type='checkbox'][data-purpose="progress-toggle-button"]`)
        },
        toggleSection: function () {
            this.element.querySelector('[role="button"]').click();
        }
    }
    
    function Main () {
        this.enableDebug = false;
        this.courseSections = null;
    }
    
    Main.prototype = {
        setup: function (enableDebug = false) {
            console.log("Auto-Certificate Script");
    
            this.enableDebug = enableDebug;
            this.courseSections = this.DOMRegex(/section-panel-[0-9]+/);
        },
        run: async function () {
            if (this.courseSections <= 0) {
                // TODO: handle no courses
                this.debug("No sections in this course");
                return;
            }
            for (const [sectionIndex, auxSection] of this.courseSections.entries()) {
                if (sectionIndex > 1) return

                const section = new Section(auxSection.element, sectionIndex);
    
                if (section.isSectionClosed)
                    section.toggleSection()
                
                const sectionCheckboxes = section.getCheckboxes ();
                this.debug(`The section ${section.sectionId} has ${sectionCheckboxes.length} checkboxes`)
    
                for (const [checkboxIndex, checkbox] of sectionCheckboxes.entries()) {
                    let checkboxAlreadyActive = this.hasACheckBoxActive(section, checkboxIndex);
                    if (!checkboxAlreadyActive) {
                        this.debug(`Checkbox ${checkboxIndex} is NOT active!!`)
                        checkbox.click();
                    } else {
                        // checkbox.click();
                    }
                    await this.waitforme(1000);
                }
    
                await this.waitforme(1000);
            }
        },
        hasACheckBoxActive: function (section, index) {
            return getComputedStyle(
                section.element
                .querySelectorAll('span.toggle-control-label')[index], 
                    ':before')['background-color'] == section.checkboxActiveIndicator;
        },
        waitforme: function (ms)  {
            return new Promise( resolve => { setTimeout(resolve, ms); });
        },
        DOMRegex: function (regex) {
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
        },
        debug: function (msg) {
            if (this.debug)
                console.log(msg);
        }
    }
    
    const main = new Main();
    
    main.setup();
    await main.run();
    console.log("Certificated! Finished")
})()