/*
 * The MIT License (MIT)
 * Copyright 2013 Kenneth Sundqvist
 * <eviloatmeal@gmail.com> <http://eviloatmeal.se>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/*jslint vars: true, plusplus: true, devel: true, regexp: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $*/

define(function (require, exports, module) {
    "use strict";

    // Dependencies
    var PreferencesManager  = brackets.getModule("preferences/PreferencesManager"),
        Menus               = brackets.getModule("command/Menus"),
        Editor              = brackets.getModule("editor/Editor").Editor,
        EditorManager       = brackets.getModule("editor/EditorManager"),
        AppInit             = brackets.getModule("utils/AppInit"),
        CommandManager      = brackets.getModule("command/CommandManager"),
        DocumentManager     = brackets.getModule("document/DocumentManager");

    // Constants
    var COMMAND_NAME    = "Detect Indentation",
        COMMAND_ID      = "se.eviloatmeal.detectIndentation.toggleEnabled";

    // Locals
    var _defPrefs   = { enabled: false },
        _prefs      = PreferencesManager.getPreferenceStorage(module, _defPrefs),
        _editMenu   = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU),
        _spacesRegex = /^ +\S?/,
        _tabRegex = /^\t+\S?/;

    // Parse document and set indentation settings
    //
    // Detect indentation to use by counting the number of
    // lines that begin with spaces or tabs. Then change the
    // indentation settings to which occurs more. Don't change
    // the setting if they're equal.
    function _detectIndentation() {
        var editor = EditorManager.getCurrentFullEditor(),
            doc,
            docHalfLineCount,
            spaces = 0,
            tabs = 0;

        if (editor) {
            doc = editor._codeMirror;
            docHalfLineCount = Math.ceil(doc.lineCount() / 2);
        } else {
            return;
        }

        doc.eachLine(function (line) {
            // Detection is completed if there are more spaced or
            // tabbed lines than half of the lines in the document.
            if (!(spaces > docHalfLineCount
                    || tabs > docHalfLineCount)) {
                if (line.text.match(_spacesRegex)) {
                    spaces++;
                } else if (line.text.match(_tabRegex)) {
                    tabs++;
                }
            }

        });

        if (spaces > tabs) {
            Editor.setUseTabChar(false);
        } else if (tabs > spaces) {
            Editor.setUseTabChar(true);
        }
    }

    // Sets or removes detection bindings
    function _updateBindings() {
        var onOrOff = _prefs.getValue("enabled") ? "on" : "off";
        $(DocumentManager)[onOrOff]("currentDocumentChange", _detectIndentation);
    }

    // Handle the menu item
    // Enables or disables the detection
    function _toggleEnabled() {
        var command = CommandManager.get(COMMAND_ID);
        command.setChecked(!command.getChecked());
        _prefs.setValue("enabled", command.getChecked());
        _updateBindings();
    }

    // Initialize
    AppInit.appReady(function () {
        CommandManager.register(COMMAND_NAME, COMMAND_ID, _toggleEnabled);
        CommandManager.get(COMMAND_ID).setChecked(_prefs.getValue("enabled"));
        if (_editMenu) {
            _editMenu.addMenuItem(COMMAND_ID);
        }

        _updateBindings();
        _detectIndentation();
    });
});
