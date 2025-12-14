# Hide Sorting Numbers - Obsidian Plugin

This plugin automatically hides leading numbers (prefixed with underscore) in file and folder names in Obsidian's file explorer while keeping them in the actual file names for sorting purposes.

## Features

- **Automatic Detection**: Detects and hides underscore-prefixed numbers at the beginning of file/folder names
- **Flexible Patterns**: Supports various number formats with underscore prefix:
  - `_1 Control Seminars` → `Control Seminars`
  - `_01 Notes` → `Notes`
  - `_1. Introduction` → `Introduction`
  - `_1- Chapter` → `Chapter`
- **Hides in Multiple Places**: Numbers are hidden in:
  - File explorer sidebar
  - Page headings when files are opened
  - View headers
- **Preserves Sorting**: The actual file names remain unchanged, so sorting by name still works
- **Non-Destructive**: Numbers are only hidden visually; the actual file names are not modified
- **Dynamic Updates**: Automatically processes new files and folders as they appear

## Installation

### Manual Installation

1. Download the plugin files (`main.js`, `manifest.json`, and `styles.css`)
2. Create a new folder in your vault: `.obsidian/plugins/hide-sorting-numbers/`
3. Copy all three files into this folder
4. Restart Obsidian or reload the app
5. Go to Settings → Community plugins
6. Enable "Hide Sorting Numbers"

### Directory Structure

```
YourVault/
└── .obsidian/
    └── plugins/
        └── hide-sorting-numbers/
            ├── main.js
            ├── manifest.json
            └── styles.css
```

## How It Works

The plugin scans the file explorer for elements with the class `.tree-item-inner.nav-file-title-content` and `.tree-item-inner.nav-folder-title-content`. When it finds a name starting with a number followed by a space, dot, or dash, it:

1. Splits the text into the number part and the display part
2. Wraps each part in a separate span element
3. Hides the number span using CSS
4. Displays only the text part

The original file names remain unchanged in your vault, so:
- Sorting continues to work based on the numbers
- Links and references remain intact
- The actual files are never modified

## Supported Number Patterns

- `_1 ` (underscore + number + space)
- `_01 ` (underscore + zero-padded number + space)
- `_1. ` (underscore + number + dot + space)
- `_1- ` (underscore + number + dash + space)

## Customization

You can customize the behavior by editing the `main.js` file:

- **Change the pattern**: Modify the `numberPattern` regex in the `processFileExplorer()` method
- **Adjust update frequency**: Change the interval in `registerInterval()` (default: 1000ms)

## Troubleshooting

**Numbers not hiding?**
- Make sure the plugin is enabled in Settings → Community plugins
- Try restarting Obsidian
- Check that your file names match one of the supported patterns

**Performance issues?**
- Increase the interval in the `registerInterval()` call (e.g., from 1000 to 2000)

**Want to disable temporarily?**
- Simply toggle off the plugin in Settings → Community plugins

## Uninstalling

1. Disable the plugin in Settings → Community plugins
2. Delete the `.obsidian/plugins/hide-sorting-numbers/` folder
3. Restart Obsidian

The plugin will restore all original file name displays when disabled.

## License

MIT License - Feel free to modify and distribute as needed.

## Support

If you encounter any issues or have suggestions, please feel free to reach out!

