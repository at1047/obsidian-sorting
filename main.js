const { Plugin, PluginSettingTab, Setting, Notice } = require('obsidian');

module.exports = class HideSortingNumbersPlugin extends Plugin {
    async onload() {
        this.settings = Object.assign({ hideNumbers: true }, await this.loadData());
        
        this.addSettingTab(new class extends PluginSettingTab {
            constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }
            display() {
                this.containerEl.empty();
                new Setting(this.containerEl)
                    .setName('Hide sorting numbers')
                    .setDesc('Hide "_number " and "Ω_number " prefixes')
                    .addToggle(t => t.setValue(this.plugin.settings.hideNumbers).onChange(async v => {
                        this.plugin.settings.hideNumbers = v;
                        await this.plugin.saveData(this.plugin.settings);
                        this.plugin.updateState();
                    }));
                
                const infoDiv = this.containerEl.createDiv({ cls: 'setting-item-description' });
                infoDiv.appendText('To type Ω: Mac: Option+Z | Windows: Alt+234 | Or copy: ');
                const copyInput = infoDiv.createEl('input', { type: 'text', value: 'Ω' });
                copyInput.style.width = '30px';
                copyInput.style.textAlign = 'center';
                copyInput.readOnly = true;
            }
        }(this.app, this));

        this.updateState();
        
        this.observer = new MutationObserver(() => this.settings.hideNumbers && this.processAll());
        this.observer.observe(document.body, { childList: true, subtree: true });

        // Update when switching tabs/panes
        this.registerEvent(this.app.workspace.on('active-leaf-change', () => {
            this.processAll();
        }));

        this.addCommand({
            id: 'toggle-hide-sorting-numbers',
            name: 'Toggle hide sorting numbers',
            callback: async () => {
                console.log('Toggle command triggered');
                this.settings.hideNumbers = !this.settings.hideNumbers;
                await this.saveData(this.settings);
                this.updateState();
                new Notice(`Hide sorting numbers: ${this.settings.hideNumbers ? 'ON' : 'OFF'}`, 5000);
                console.log('Notice should have appeared');
            }
        });

        this.addCommand({
            id: 'debug-notice',
            name: 'Debug: Show test notice',
            callback: () => {
                new Notice('Debug notice works!');
            }
        });
    }

    updateState() {
        document.body.classList.toggle('hide-sorting-numbers', this.settings.hideNumbers);
        this.settings.hideNumbers ? this.processAll() : this.clearAll();
    }

    processAll() {
        document.querySelectorAll('.nav-file-title-content, .nav-folder-title-content, .inline-title, .view-header-title, .titlebar-text, .workspace-tab-header-inner-title').forEach(el => {
            const match = el.textContent.match(/^(_\d+[\.\-\s]+|Ω_\d+[\.\-\s]+)/i);
            if (match) {
                el.style.setProperty('--original-font-size', el.style.getPropertyValue('--original-font-size') || getComputedStyle(el).fontSize);
                el.setAttribute('data-display-text', el.textContent.substring(match[1].length));
            } else if (el.hasAttribute('data-display-text')) {
                // Clear attribute if element no longer has a sorting prefix
                el.removeAttribute('data-display-text');
                el.style.removeProperty('--original-font-size');
            }
        });
    }

    clearAll() {
        document.querySelectorAll('[data-display-text]').forEach(el => {
            el.removeAttribute('data-display-text');
            el.style.removeProperty('--original-font-size');
        });
    }

    onunload() {
        document.body.classList.remove('hide-sorting-numbers');
        this.observer?.disconnect();
        this.clearAll();
    }
};
