const { Plugin } = require('obsidian');

module.exports = class HideSortingNumbersPlugin extends Plugin {
    async onload() {
        console.log('Loading Hide Sorting Numbers plugin');

        // Add CSS class to body for styling
        document.body.classList.add('hide-sorting-numbers-enabled');

        // Process all file/folder names to hide numbers
        this.processFileExplorer();

        // Watch for DOM changes to handle dynamically loaded files
        this.registerDomEvent(document, 'click', () => {
            // Small delay to allow DOM to update after clicks (expanding folders, etc.)
            setTimeout(() => this.processFileExplorer(), 50);
        });

        // Also process on layout change
        this.app.workspace.onLayoutReady(() => {
            this.processFileExplorer();
        });

        // Process when active file changes
        this.registerEvent(
            this.app.workspace.on('active-leaf-change', () => {
                setTimeout(() => this.processFileExplorer(), 100);
            })
        );

        // Process when file is opened
        this.registerEvent(
            this.app.workspace.on('file-open', () => {
                setTimeout(() => this.processFileExplorer(), 100);
            })
        );

        // Register an interval to periodically check for new elements
        this.registerInterval(
            window.setInterval(() => this.processFileExplorer(), 1000)
        );
    }

    processFileExplorer() {
        // Process file explorer items (can modify DOM)
        const explorerElements = document.querySelectorAll('.tree-item-inner.nav-file-title-content, .tree-item-inner.nav-folder-title-content');
        
        explorerElements.forEach(element => {
            // Skip if already processed
            if (element.hasAttribute('data-number-hidden')) {
                return;
            }

            const originalText = element.textContent;
            
            // Match patterns like "_1 ", "_01 ", "_1. ", "_01. ", "_1- ", etc.
            const numberPattern = /^(_\d+[\.\-\s]+)/;
            const match = originalText.match(numberPattern);
            
            if (match) {
                const numberPart = match[1];
                const textPart = originalText.substring(numberPart.length);
                
                // Store original text as data attribute
                element.setAttribute('data-original-text', originalText);
                element.setAttribute('data-number-hidden', 'true');
                
                // Clear content and rebuild with hidden number
                element.textContent = '';
                
                // Create span for number (hidden)
                const numberSpan = document.createElement('span');
                numberSpan.className = 'sorting-number-hidden';
                numberSpan.textContent = numberPart;
                numberSpan.style.display = 'none';
                
                // Create span for visible text
                const textSpan = document.createElement('span');
                textSpan.className = 'sorting-text-visible';
                textSpan.textContent = textPart;
                
                element.appendChild(numberSpan);
                element.appendChild(textSpan);
            }
        });

        // Process inline titles and view headers (use CSS-based approach)
        const headingElements = document.querySelectorAll('.inline-title, .view-header-title');
        headingElements.forEach(element => {
            const text = element.textContent || element.innerText;
            const numberPattern = /^(_\d+[\.\-\s]+)/;
            const match = text.match(numberPattern);
            
            if (match) {
                const numberPart = match[1];
                const textPart = text.substring(numberPart.length);
                
                // Add data attributes that CSS can use
                element.setAttribute('data-has-sort-number', 'true');
                element.setAttribute('data-display-text', textPart);
            } else {
                element.removeAttribute('data-has-sort-number');
                element.removeAttribute('data-display-text');
            }
        });
    }

    onunload() {
        console.log('Unloading Hide Sorting Numbers plugin');
        
        // Remove CSS class from body
        document.body.classList.remove('hide-sorting-numbers-enabled');
        
        // Restore original text to all modified elements
        const modifiedElements = document.querySelectorAll('[data-number-hidden]');
        modifiedElements.forEach(element => {
            const originalText = element.getAttribute('data-original-text');
            if (originalText) {
                element.textContent = originalText;
                element.removeAttribute('data-original-text');
                element.removeAttribute('data-number-hidden');
            }
        });
    }
};

