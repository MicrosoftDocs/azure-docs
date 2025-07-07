---
description: Overview of how to use the new user interface for Azure Cloud Shell.
ms.contributor: jahelmic
ms.date: 01/28/2025
ms.topic: how-to
tags: azure-resource-manager
title: How to use the new user interface for Azure Cloud Shell
---

# How to use the new user interface for Azure Cloud Shell

This document explains how to use the Cloud Shell window. Cloud Shell recently updated the user
interface for the Cloud Shell terminal window. The new toolbar uses text-based menu items rather
than icons, making it easier to find the desired action.

[![Screenshot of the new Cloud Shell user experience.][05i]][05x]

## Switch between Bash and PowerShell

Use the environment selector in the Cloud Shell toolbar to switch between Bash and PowerShell
environments. When Cloud Shell is configured to start in PowerShell, the button is labeled **Switch
to Bash**. When Cloud Shell is configured to start in Bash, the button is labeled **Switch to
PowerShell**.

[![Screenshot of the Switch shells button.][08i]][08x]

## Restart Cloud Shell

Select the restart icon in the Cloud Shell toolbar to reset machine state.

[![Screenshot of the Restart button.][06i]][06x]

> [!WARNING]
> Restarting Cloud Shell resets machine state and any files not persisted in an Azure fileshare are
> lost.

## Settings menu

The **Settings** menu has submenus that allow you to change the size of text, select a different
font, choose a different color scheme, or reset your user settings. Your selection is persisted
across sessions unless you select **Reset User Settings**.

When you select **Reset User Settings**, the current session is closed and your settings are reset.
Cloud Shell restarts the session and takes you through the first time user experience.

[![Screenshot of the Settings menu.][07i]][07x]

When you select **Go to Classic version**, Cloud Shell restarts your session in the Classic user
experience. For a description of the Classic user experience, see
[Using the Azure Cloud Shell window][13].

## Manage files menu

The **Manage files** menu contains items to **Upload** or **Download** files. The **Open file
share** button opens the Azure portal view of your Cloud Shell file share.

[![Screenshot of the Manage files menu.][03i]][03x]

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

[![Screenshot of the New session button.][04i]][04x]

To start a new session, select **New session** button on toolbar. A new browser tab opens with
another session connected to the existing container.

## Cloud Shell editor button

The Cloud Shell editor is a browser-based text editor that is optimized for managing and editing.
The editor uses the Classic user interface. When you select the **Editor** button, Cloud Shell
displays a confirmation form before switching you to the Classic user experience. Select the
**Confirm** button to continue.

[![Screenshot of the Cloud Shell editor button.][02i]][02x]

For more information, see [Using the Azure Cloud Shell editor][11].

## Web preview menu

The **Web preview** feature allows you to open ports on your Cloud Shell container to communicate
with running applications. The **Web preview** menu allows you to enter the port number that you
want to open.

[![Screenshot of the Web preview button.][10i]][10x]

Select **Open port** to only open the port. Select **Open and browse** to open the port and preview
the port in a new browser tab.

After opening a port, the **Web preview** menu allows you to connect to the open port, close the
port, or open another port.

[![Screenshot of Web Preview menu with open ports.][01i]][01x]

To preview an open port in a new tab, select the web preview icon on the top left of the window then
select **Preview port \<number\>**.

To close the open port, select the web preview icon on the top left of the window the select **Close
port \<number\>**.

## Help menu

The **Help** menu contains links to the Cloud Shell and other related documentation and Cloud Shell
feedback form.

[![Screenshot of the Help menu.][11i]][11x]

## Minimize, maximize, or close the Cloud Shell window

The icons on the top right of the window are used to manage the state of the Cloud Shell window.

[![Screenshot of Cloud Shell toolbar.][09i]][09x]

When you select the **Minimize** button, the Cloud Shell terminal is hidden and the Azure portal is
displayed. The Cloud Shell session is still running. Select the Cloud Shell icon again to unhide the
terminal window.

When you select the **Maximize** button, the Azure portal is hidden and the terminal window fills
the browser.

When you select the **Close** button, the Cloud Shell session is terminated.

## Copy and paste

- Windows: <kbd>Ctrl</kbd>+<kbd>c</kbd> to copy is supported but use
  <kbd>Shift</kbd>+<kbd>Insert</kbd> to paste.
  - The Firefox browser might not support clipboard permissions properly.
- macOS: <kbd>Cmd</kbd>+<kbd>c</kbd> to copy and <kbd>Cmd</kbd>+<kbd>v</kbd> to paste.
- Linux: <kbd>Ctrl</kbd>+<kbd>c</kbd> to copy and <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>v</kbd> to paste.

> [!NOTE]
> If no text is selected when you type <kbd>Ctrl</kbd>+<kbd>c</kbd>, Cloud Shell sends the `Ctrl-C`
> character to the shell. Sending `Ctrl-C` can terminate the currently running command.

## Resize Cloud Shell window

Drag the top edge of the toolbar up or down to resize the Cloud Shell window.

## Scrolling text display

Scroll with your mouse or touchpad to move terminal text.

## Exit command

The `exit` command terminates the active session. Cloud Shell also terminates your session after 20
minutes without interaction.

## Next steps

[Using the Azure Cloud Shell editor][12]

<!-- link references -->
[01i]: media/new-ui-shell-window/close-port.png
[02i]: media/new-ui-shell-window/editor.png
[03i]: media/new-ui-shell-window/manage-files.png
[04i]: media/new-ui-shell-window/new-session.png
[05i]: media/new-ui-shell-window/new-ui-fullscreen.png
[06i]: media/new-ui-shell-window/restart-cloud-shell.png
[07i]: media/new-ui-shell-window/settings-menu.png
[08i]: media/new-ui-shell-window/switch-to-bash.png
[09i]: media/new-ui-shell-window/toolbar.png
[10i]: media/new-ui-shell-window/web-preview.png
[11i]: media/new-ui-shell-window/help-menu.png
[01x]: media/new-ui-shell-window/close-port.png#lightbox
[02x]: media/new-ui-shell-window/editor.png#lightbox
[03x]: media/new-ui-shell-window/manage-files.png#lightbox
[04x]: media/new-ui-shell-window/new-session.png#lightbox
[05x]: media/new-ui-shell-window/new-ui-fullscreen.png#lightbox
[06x]: media/new-ui-shell-window/restart-cloud-shell.png#lightbox
[07x]: media/new-ui-shell-window/settings-menu.png#lightbox
[08x]: media/new-ui-shell-window/switch-to-bash.png#lightbox
[09x]: media/new-ui-shell-window/toolbar.png#lightbox
[10x]: media/new-ui-shell-window/web-preview.png#lightbox
[11x]: media/new-ui-shell-window/help-menu.png#lightbox
[12]: using-cloud-shell-editor.md
[13]: using-the-shell-window.md
