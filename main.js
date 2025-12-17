const { Plugin, PluginSettingTab, Setting } = require('obsidian');

module.exports = class HideSortingNumbersPlugin extends Plugin {
    async onload() {
        this.settings = Object.assign({ hideNumbers: true }, await this.loadData());
        
        this.addSettingTab(new class extends PluginSettingTab {
            constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }
            display() {
                this.containerEl.empty();
                new Setting(this.containerEl)
                    .setName('Hide sorting numbers')
                    .setDesc('Hide "_number " and "z_number " prefixes')
                    .addToggle(t => t.setValue(this.plugin.settings.hideNumbers).onChange(async v => {
                        this.plugin.settings.hideNumbers = v;
                        await this.plugin.saveData(this.plugin.settings);
                        this.plugin.updateState();
                    }));
            }
        }(this.app, this));

        this.updateState();
        
        this.observer = new MutationObserver(() => this.settings.hideNumbers && this.processAll());
        this.observer.observe(document.body, { childList: true, subtree: true });

        this.addCommand({
            id: 'toggle-hide-sorting-numbers',
            name: 'Toggle hide sorting numbers',
            callback: async () => {
                this.settings.hideNumbers = !this.settings.hideNumbers;
                await this.saveData(this.settings);
                this.updateState();
            }
        });
    }

    updateState() {
        document.body.classList.toggle('hide-sorting-numbers', this.settings.hideNumbers);
        this.settings.hideNumbers ? this.processAll() : this.clearAll();
    }

    processAll() {
        document.querySelectorAll('.nav-file-title-content, .nav-folder-title-content, .inline-title, .view-header-title, .titlebar-text, .workspace-tab-header-inner-title').forEach(el => {
            const match = el.textContent.match(/^(_\d+[\.\-\s]+|z_\d+[\.\-\s]+)/i);
            if (match) {
                el.style.setProperty('--original-font-size', el.style.getPropertyValue('--original-font-size') || getComputedStyle(el).fontSize);
                el.setAttribute('data-display-text', el.textContent.substring(match[1].length));
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
