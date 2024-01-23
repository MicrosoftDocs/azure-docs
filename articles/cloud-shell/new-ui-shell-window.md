---
description: Overview of how to use the new user interface for Azure Cloud Shell.
ms.contributor: jahelmic
ms.date: 01/23/2024
ms.topic: article
tags: azure-resource-manager
title: How to use the new user interface for Azure Cloud Shell
---

# How to use the new user interface for Azure Cloud Shell

This document explains how to use the Cloud Shell window. Cloud Shell recently updated the user
interface for the Cloud Shell terminal window. The new toolbar uses text-based menu items rather
than icons, making it easier to find the desired action.

## Switch between Bash and PowerShell

Use the environment selector in the Cloud Shell toolbar to switch between Bash and PowerShell
environments. When Cloud Shell is configured to start in PowerShell, the button is labeled **Switch
to Bash**. When Cloud Shell is configured to start in Bash, the button is labeled **Switch to
PowerShell**.

![Screenshot of the Switch shells button.][07]

## Restart Cloud Shell

Select the restart icon in the Cloud Shell toolbar to reset machine state.

![Screenshot of the Restart button.][05]

> [!WARNING]
> Restarting Cloud Shell resets machine state and any files not persisted in an Azure fileshare are
> lost.

## Settings menu

The **Settings** menu has submenus that allow you to change the size of text, select a different
font, choose a different color scheme, or reset your user settings. Your selection is persisted
across sessions unless you select **Reset User Settings**.

When you select **Reset User Settings**, the current session is closed and your settings are reset.
You're prompted to restart as if this is your first time using Cloud Shell.

![Screenshot of the Settings menu.][06]

## Manage files menu

The **Manage files** menu contains items to **Upload** or **Download** files. The **Open file
share** button opens the Azure portal view of your Cloud Shell file share.

![Screenshot of the Manage files menu.][03]

- When you select **Upload**, Cloud Shell opens a file dialog box. Use this file dialog to browse
  to the files on your local computer, select the desired file, and select the **Open** button. The
  file is uploaded into the `/home/user` directory.
- When you select **Download**, Cloud Shell displays a form for selecting the file to download.
  Enter the fully qualified file path into the pop-up window. For example, the path under the
  `/home/user` directory that shows up by default. Then, select the **Download** button.

> [!NOTE]
> File and path names are case sensitive in Cloud Shell. Double check your casing in your file
> path.

## New session button

Cloud Shell allows you to have multiple concurrent sessions across browser tabs. Each session runs
as a separate process on the same machine. When exiting Cloud Shell, be sure to exit from each
session window as each process runs independently.

![Screenshot of the New session button][04]

To start a new session, select **New session** button on toolbar. A new browser tab opens with
another session connected to the existing container.

## Cloud Shell editor button

The Cloud Shell editor is a browser-based text editor that is optimized for managing and editing.
The editor uses the Classic user interface. When you select the **Editor** button, Cloud Shell
displays a confirmation form before switching you to the Classic user experience. Select the
**Confirm** button to continue.

![Screenshot of the Cloud Shell editor button][02]

For more information, see [Using the Azure Cloud Shell editor][10].

## Web preview menu

The **Web preview** feature allows you to open ports on your Cloud Shell container to communicate
with running applications. The **Web preview** menu allows you to enter the port number that you
want to open.

![Screenshot of the Web preview button.][09]

Select **Open port** to only open the port. Select **Open and browse** to open the port and preview
the port in a new browser tab.

After opening a port, the **Web preview** menu allows you to connect to the open port, close the
port, or open another port.

![Screenshot of Web Preview menu with open ports.][01]

To preview an open port in a new tab, select the web preview icon on the top left of the window then
select **Preview port <number>**.

To close the open port, select the web preview icon on the top left of the window the select **Close
port <number>**.

## Minimize, maximize, or close the Cloud Shell window

The icons on the top right of the window are used to manage the state of the Cloud Shell window.

![Screenshot of Cloud Shell toolbar.][08]

When you select the **Minimize** button, the Cloud Shell terminal is hidden and the Azure portal is
displayed. The Cloud Shell session is still running. Select the Cloud Shell icon again to unhide the
terminal window.

When you select the **Maximize** button, the Azure portal is hidden and the terminal window fills
the browser.

## Copy and paste

- Windows: <kbd>Ctrl</kbd>+<kbd>c</kbd> to copy is supported but use
  <kbd>Shift</kbd>+<kbd>Insert</kbd> to paste.
  - The FireFox browser might not support clipboard permissions properly.
- macOS: <kbd>Cmd</kbd>+<kbd>c</kbd> to copy and <kbd>Cmd</kbd>+<kbd>v</kbd> to paste.
- Linux: <kbd>Ctrl</kbd>+<kbd>c</kbd> to copy and <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>v</kbd> to paste.

> [!NOTE]
> If no text is selected when you type <kbd>Ctrl</kbd>+<kbd>c</kbd>, Cloud Shell sends the `Ctrl C`
> character to the shell. This could terminate the currently running command.

## Resize Cloud Shell window

Drag the top edge of the toolbar up or down to resize the Cloud Shell window.

## Scrolling text display

Scroll with your mouse or touchpad to move terminal text.

## Exit command

The `exit` command terminates the active session. Cloud Shell also terminates your session after 20
minutes without interaction.

## Next steps

[Using the Azure Cloud Shell editor][10]

<!-- link references -->
[01]: media/new-ui-shell-window/close-port.png
[02]: media/new-ui-shell-window/editor.png
[03]: media/new-ui-shell-window/manage-files.png
[04]: media/new-ui-shell-window/new-session.png
[05]: media/new-ui-shell-window/restart-cloud-shell.png
[06]: media/new-ui-shell-window/settings-menu.png
[07]: media/new-ui-shell-window/switch-to-bash.png
[08]: media/new-ui-shell-window/toolbar.png
[09]: media/new-ui-shell-window/web-preview.png
[10]: using-cloud-shell-editor.md
