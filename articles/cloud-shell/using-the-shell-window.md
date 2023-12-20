---
description: Overview of how to use the Azure Cloud Shell window.
ms.contributor: jahelmic
ms.date: 11/14/2022
ms.topic: article
tags: azure-resource-manager
title: Using the Azure Cloud Shell window
---

# Using the Azure Cloud Shell window

This document explains how to use the Cloud Shell window.

## Swap between Bash and PowerShell environments

Use the environment selector in the Cloud Shell toolbar to switch between Bash and PowerShell
environments.

![Select environment][02]

## Restart Cloud Shell

Select the restart icon in the Cloud Shell toolbar to reset machine state.

![Restart Cloud Shell][08]

> [!WARNING]
> Restarting Cloud Shell resets machine state and any files not persisted in your Azure fileshare
> are lost.

## Change the text size

Select the settings icon on the top left of the window, then hover over the **Text size** option and
select your desired text size. Your selection is persisted across sessions.

![Text size][10]

## Change the font

Select the settings icon on the top left of the window, then hover over the **Font** option and select
your desired font. Your selection is persisted across sessions.

![Font][09]

## Upload and download files

Select the upload/download files icon on the top left of the window, then select **Upload** or
**Download**.

![Upload/download files][11]

- For uploading files, use the pop-up to browse to the file on your local computer, select the
  desired file, and select the **Open** button. The file is uploaded into the `/home/user`
  directory.
- For downloading file, enter the fully qualified file path into the pop-up window. For example, the
  path under the `/home/user` directory that shows up by default. Then, select the **Download**
  button.

> [!NOTE]
> File and path names are case sensitive in Cloud Shell. Double check your casing in your file
> path.

## Open another Cloud Shell window

Cloud Shell enables multiple concurrent sessions across browser tabs by allowing each session to
exist as a separate process. If exiting a session, be sure to exit from each session window as each
process runs independently although they run on the same machine. Select the open new session icon on
the top left of the window. A new tab opens with another session connected to the existing
container.

![Open new session][04]

## Cloud Shell editor

Refer to the [Using the Azure Cloud Shell editor][14] page.

## Web preview

Select the web preview icon on the top left of the window, select **Configure**, specify the desired
port to open.

![Web preview][07]

Select either **Open port** to only open the port, or **Open and browse** to open the
port and preview the port in a new tab.

![Configure port][05]

To preview an open port in a new tab, select the web preview icon on the top left of the window then
select **Preview port**.

To close the open port, select the web preview icon on the top left of the window the select
**Close port**.

![Preview/close port][06]

## Minimize & maximize Cloud Shell window

Select the minimize icon on the top right of the window to hide it. Select the Cloud Shell icon again
to unhide. Select the maximize icon to set window to max height. To restore window to previous size,
select restore.

![Minimize or maximize the window][03]

## Copy and paste

- Windows: <kbd>Ctrl</kbd>-<kbd>C</kbd> to copy is supported but use
  <kbd>Shift</kbd>-<kbd>Insert</kbd> to paste.
  - FireFox/IE may not support clipboard permissions properly.
- macOS: <kbd>Cmd</kbd>-<kbd>C</kbd> to copy and <kbd>Cmd</kbd>-<kbd>V</kbd> to paste.
- Linux: <kbd>CTRL</kbd>-<kbd>C</kbd> to copy and <kbd>CTRL</kbd>-<kbd>SHIFT</kbd>-<kbd>V</kbd> to paste.

> [!NOTE]
> If no text is selected when you type <kbd>Ctrl</kbd>-<kbd>C</kbd>, Cloud Shell sends the `Ctrl C`
> character to the shell. This could terminate the currently running command.

## Resize Cloud Shell window

Drag the top edge of the toolbar up or down to resize the Cloud Shell window.

## Scrolling text display

Scroll with your mouse or touchpad to move terminal text.

## Exit command

The `exit` command terminates the active session. Cloud Shell also terminates your session after 20
minutes without interaction.

## Next steps

- [Bash in Cloud Shell Quickstart][13]
- [PowerShell in Cloud Shell Quickstart][12]

<!-- link references -->
[02]: media/using-the-shell-window/env-selector.png
[03]: media/using-the-shell-window/minmax.png
[04]: media/using-the-shell-window/newsession.png
[05]: media/using-the-shell-window/preview-configure.png
[06]: media/using-the-shell-window/preview-options.png
[07]: media/using-the-shell-window/preview.png
[08]: media/using-the-shell-window/restart.png
[09]: media/using-the-shell-window/text-font.png
[10]: media/using-the-shell-window/text-size.png
[11]: media/using-the-shell-window/uploaddownload.png
[12]: quickstart-powershell.md
[13]: quickstart.md
[14]: using-cloud-shell-editor.md
