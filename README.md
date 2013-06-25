# Detect Indentation for Brackets

An extension for [Brackets](https://github.com/adobe/brackets/)
to detect the indentation used in the current file and set your
editor settings accordingly.

### How to Install

1. Select **Brackets > File > Extension Manager...**
2. Click on **Install from URL...**
3. Paste https://github.com/eviloatmeal/brackets-detect-indentation
   into the Extension URL field.
4. Click on the **Install** button.

### How to Use Extension

Toggle the detection with **Brackets > Edit > Detect Indentation**.

Detection is run when the active document changes.

### How the indentation is detected

Lines indented with spaces or tabs are counted and then the indentation
setting is set to the type that occurs the most. If there is an equal
amount of lines with spaces and tabs the setting is not changed.

The extension does **not** detect the amount of spaces to use.

### License

MIT-licensed -- see `main.js` for details.
