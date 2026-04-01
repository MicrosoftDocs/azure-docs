---
description: Overview of how to use the Azure Cloud Shell editor in the new interface.
ms.date: 04/01/2026
ms.topic: how-to
tags: azure-resource-manager
title: How to use the Azure Cloud Shell editor (New)
---

# How to use the Azure Cloud Shell editor (New)

Azure Cloud Shell includes an integrated file editor built from the open source [Monaco Editor][03].
The Cloud Shell editor supports features such as language highlighting, the command palette, and a
file explorer.

![Screenshot of the Cloud Shell editor.][04]

## Opening the editor

To open the editor, select **<kbd>&#x1F589; Editor</kbd>** from the toolbar. The file explorer defaults to
the `/home/<user>` directory.

You can also open the editor from the command line. The following command opens the editor with
blank, untitled files and the current working directory displayed in the file explorer:

```sh
code .
```

Use the following command to directly open a file for quick editing:

```sh
code <filename>
```

## File menu

You can use the **File** menu in the top left of the editor to create a new file, open an existing
file, save, save as, open and close the file explorer, and close the editor.

To close the file explorer, open the **File** menu and select **Close file explorer**. You can also
close the file explorer using the <kbd>Ctrl+B</kbd> key.

To close the editor, select the <kbd>X</kbd> in the top right of the editor. Alternatively, open the
**File** menu and select **Close editor**, or use <kbd>Ctrl+Q</kbd>.


:::image type="content" source="media/use-cloud-shell-editor-new/close-editor.png" alt-text="Screenshot of the Close editor menu selection." lightbox="media/use-cloud-shell-editor-new/close-editor-large.png":::

## Command palette

To launch the command palette, use the <kbd>F1</kbd> key when focus is set on the editor.

:::image type="content" source="media/use-cloud-shell-editor-new/command-palette.png" alt-text="Screenshot of the command palette." lightbox="media/use-cloud-shell-editor-new/command-palette-large.png":::

## Keyboard Shortcuts

When the editor is in focus, the following keyboard shortcuts are available.

|                  Shortcut                   |                      Action                      |
| ------------------------------------------- | ------------------------------------------------ |
| <kbd>Ctrl</kbd>+<kbd>`</kbd>                | Toggle focus between the terminal and the editor |
| <kbd>Ctrl</kbd>+<kbd>B</kbd>                | Toggle the file explorer panel                   |
| <kbd>Ctrl</kbd>+<kbd>E</kbd>                | Move focus to the file explorer                  |
| <kbd>Ctrl</kbd>+<kbd>Q</kbd>                | Close the editor                                 |
| <kbd>Ctrl</kbd>+<kbd>S</kbd>                | Save the current file                            |
| <kbd>Escape</kbd>                           | Open the file menu                               |
| <kbd>F1</kbd>                               | Open the command palette                         |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>E</kbd> | Close the editor                                 |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd> | Create a new file                                |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>O</kbd> | Open a file                                      |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd> | Save the current file as a new name              |

## Next steps

- [Try the quickstart for ephemeral sessions in Cloud Shell][02]
- [View the full list of integrated Cloud Shell tools][01]

<!-- link references -->
[01]: features.md
[02]: get-started/ephemeral.md
[03]: https://github.com/Microsoft/monaco-editor
[04]: media/use-cloud-shell-editor-new/open-editor.png
