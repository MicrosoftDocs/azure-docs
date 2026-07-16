---
description: Overview of how to use the Azure Cloud Shell window in the Classic interface.
ms.date: 03/25/2026
ms.topic: how-to
tags: azure-resource-manager
title: How to use the Azure Cloud Shell window (Classic)
---

# How to use the Azure Cloud Shell window (Classic)

This document explains how to use the Cloud Shell window.

## Swap between Bash and PowerShell environments

Use the environment selector in the Cloud Shell toolbar to switch between Bash and PowerShell
environments.

![Select environment][01]

## Restart Cloud Shell

Select the restart icon in the Cloud Shell toolbar to reset machine state.

![Restart Cloud Shell][07]

> [!WARNING]
> Restarting Cloud Shell resets machine state and any files not persisted in your Azure fileshare
> are lost.

## Change the text size

Select the settings icon on the top left of the window, then hover over the **Text size** option and
select your desired text size. Your selection is persisted across sessions.

![Text size][09]

## Change the font

Select the settings icon on the top left of the window, then hover over the **Font** option and select
your desired font. Your selection is persisted across sessions.

![Font][08]

## Upload and download files

Select the upload/download files icon on the top left of the window, then select **Upload** or
**Download**.

![Upload/download files][10]

- For uploading files, use the pop-up to browse to the file on your local computer, select the
  desired file, and select the **Open** button. The file is uploaded into the `/home/user`
  directory.
- For downloading file, enter the fully qualified file path into the pop-up window. For example, the
  path under the `/home/user` directory that shows up by default. Then, select the **Download**
  button.

> [!NOTE]
> File and path names are case sensitive in Cloud Shell. Double check your casing in your file
> path.

You can also drag files from your local computer into the Cloud Shell window to upload them. The
files are uploaded into the `/home/user` directory. You can select multiple files to upload at once.
This feature only supports uploading files, not folders.

## Open another Cloud Shell window

Cloud Shell enables multiple concurrent sessions across browser tabs by allowing each session to
exist as a separate process. If exiting a session, be sure to exit from each session window as each
process runs independently although they run on the same machine. Select the open new session icon on
the top left of the window. A new tab opens with another session connected to the existing
container.

![Open new session][03]

## Cloud Shell editor

Refer to the [Using the Azure Cloud Shell editor][11] page.

## Web preview

Select the web preview icon on the top left of the window, select **Configure**, specify the desired
port to open.

![Web preview][06]

Select either **Open port** to only open the port, or **Open and browse** to open the
port and preview the port in a new tab.

![Configure port][04]

To preview an open port in a new tab, select the web preview icon on the top left of the window then
select **Preview port**.

To close the open port, select the web preview icon on the top left of the window the select
**Close port**.

![Preview/close port][05]

## Minimize & maximize Cloud Shell window

Select the minimize icon on the top right of the window to hide it. Select the Cloud Shell icon again
to unhide. Select the maximize icon to set window to max height. To restore window to previous size,
select restore.

![Minimize or maximize the window][02]

## Copy and paste

- Windows: Use <kbd>Ctrl</kbd>+<kbd>c</kbd> to copy and
  <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>v</kbd> or <kbd>Shift</kbd>+<kbd>Insert</kbd> to paste.
  - Firefox and Internet Explorer may not support clipboard permissions properly.
- macOS: <kbd>Cmd</kbd>+<kbd>C</kbd> to copy and <kbd>Cmd</kbd>+<kbd>V</kbd> to paste.
- Linux: <kbd>Ctrl</kbd>+<kbd>C</kbd> to copy and <kbd>Ctrl</kbd>+<kbd>SHIFT</kbd>+<kbd>V</kbd> to
  paste.

> [!NOTE]
> If no text is selected when you type <kbd>Ctrl</kbd>-<kbd>C</kbd>, Cloud Shell sends the `Ctrl-C`
> character to the shell. This could terminate the currently running command.

## Resize Cloud Shell window

Drag the top edge of the toolbar up or down to resize the Cloud Shell window.

## Scrolling text display

Scroll with your mouse or touchpad to move terminal text.

## Exit command

The `exit` command terminates the active session. Cloud Shell also terminates your session after 20
minutes without interaction.

<!-- link references -->
[01]: media/use-the-shell-window-classic/env-selector.png
[02]: media/use-the-shell-window-classic/minmax.png
[03]: media/use-the-shell-window-classic/newsession.png
[04]: media/use-the-shell-window-classic/preview-configure.png
[05]: media/use-the-shell-window-classic/preview-options.png
[06]: media/use-the-shell-window-classic/preview.png
[07]: media/use-the-shell-window-classic/restart.png
[08]: media/use-the-shell-window-classic/text-font.png
[09]: media/use-the-shell-window-classic/text-size.png
[10]: media/use-the-shell-window-classic/uploaddownload.png
[11]: use-cloud-shell-editor-classic.md
