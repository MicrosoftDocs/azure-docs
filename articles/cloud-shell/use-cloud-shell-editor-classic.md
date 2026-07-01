---
description: Overview of how to use the Azure Cloud Shell editor.
ms.date: 03/25/2026
ms.topic: how-to
tags: azure-resource-manager
title: How to use the Azure Cloud Shell editor (Classic)
---

# How to use the Azure Cloud Shell editor (Classic)

Azure Cloud Shell includes an integrated file editor built from the open-source
[Monaco Editor][03]. The Cloud Shell editor supports features such as language highlighting, the
command palette, and a file explorer.

![Cloud Shell editor][06]

## Opening the editor

For simple file creation and editing, launch the editor by running `code .` in the Cloud Shell
terminal. This action opens the editor with your active working directory set in the terminal.

Use the following command to directly open a file for quick editing:

```sh
code <filename>
```

To open the editor, select the **<kbd>{}</kbd>** icon from the toolbar. The file explorer defaults
to the `/home/<user>` directory.

## Closing the editor

To close the editor, open the `...` action panel in the top right of the editor and select
`Close editor`.

![Close editor][04]

## Command palette

To launch the command palette, use the `F1` key when focus is set on the editor. Opening the command
palette can also be done through the action panel.

![Cmd palette][05]

## Next steps

- [Try the quickstart for Bash in Cloud Shell][02]
- [View the full list of integrated Cloud Shell tools][01]

<!-- link references -->
[01]: features.md
[02]: get-started/classic.md
[03]: https://github.com/Microsoft/monaco-editor
[04]: media/use-cloud-shell-editor-classic/close-editor.png
[05]: media/use-cloud-shell-editor-classic/cmd-palette.png
[06]: media/use-cloud-shell-editor-classic/open-editor.png
