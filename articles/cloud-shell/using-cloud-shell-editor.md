---
description: Overview of how to use the Azure Cloud Shell editor.
ms.contributor: jahelmic
ms.date: 11/14/2022
ms.topic: article
tags: azure-resource-manager
title: Using the Azure Cloud Shell editor
---

# Using the Azure Cloud Shell editor

Azure Cloud Shell includes an integrated file editor built from the open-source
[Monaco Editor][02]. The Cloud Shell editor supports features such as language highlighting, the
command palette, and a file explorer.

![Cloud Shell editor][06]

## Opening the editor

For simple file creation and editing, launch the editor by running `code .` in the Cloud Shell
terminal. This action opens the editor with your active working directory set in the terminal.

To directly open a file for quick editing, run `code <filename>` to open the editor without the file
explorer.

Select the `{}` icon from the toolbar to open the editor and default the file explorer to the
`/home/<user>` directory.

## Closing the editor

To close the editor, open the `...` action panel in the top right of the editor and select
`Close editor`.

![Close editor][04]

## Command palette

To launch the command palette, use the `F1` key when focus is set on the editor. Opening the command
palette can also be done through the action panel.

![Cmd palette][05]

<!--
TODO:
- Why are we talking about contributions here?
- Need to document how to use the editor and the quirks
-->

## Next steps

- [Try the quickstart for Bash in Cloud Shell][07]
- [View the full list of integrated Cloud Shell tools][01]

<!-- link references -->
[01]: features.md
[02]: https://github.com/Microsoft/monaco-editor
[03]: https://github.com/Microsoft/monaco-editor/blob/master/CONTRIBUTING.md
[04]: media/using-cloud-shell-editor/close-editor.png
[05]: media/using-cloud-shell-editor/cmd-palette.png
[06]: media/using-cloud-shell-editor/open-editor.png
[07]: quickstart.md
