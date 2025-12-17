const { Plugin } = require('obsidian');

module.exports = class HideSortingNumbersPlugin extends Plugin {
    async onload() {
        document.body.classList.add('hide-sorting-numbers');
        
        this.processAll();
        
        // Use MutationObserver to catch all DOM changes
        this.observer = new MutationObserver(() => this.processAll());
        this.observer.observe(document.body, { childList: true, subtree: true });
    }

    processAll() {
        const selectors = [
            '.nav-file-title-content',
            '.nav-folder-title-content', 
            '.inline-title',
            '.view-header-title',
            '.titlebar-text',
            '.workspace-tab-header-inner-title'
        ];
        
        document.querySelectorAll(selectors.join(', ')).forEach(el => {
            const text = el.textContent;
            const match = text.match(/^(_\d+[\.\-\s]+)/);
            
            if (match) {
                // Store original font size before hiding
                if (!el.style.getPropertyValue('--original-font-size')) {
                    const fontSize = getComputedStyle(el).fontSize;
                    el.style.setProperty('--original-font-size', fontSize);
                }
                el.setAttribute('data-display-text', text.substring(match[1].length));
            } else {
                el.removeAttribute('data-display-text');
                el.style.removeProperty('--original-font-size');
            }
        });
    }

    onunload() {
        document.body.classList.remove('hide-sorting-numbers');
        this.observer?.disconnect();
        document.querySelectorAll('[data-display-text]').forEach(el => {
            el.removeAttribute('data-display-text');
        });
    }
};
