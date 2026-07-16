---
description: Overview of how to use Azure Cloud Shell in the new user interface.
ms.date: 05/11/2026
ms.topic: how-to
tags: azure-resource-manager
title: How to use Azure Cloud Shell in the new user interface
---

# How to use Azure Cloud Shell in the new user interface

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

You can also drag files from your local computer into the Cloud Shell window to upload them. The
files are uploaded into the `/home/user` directory. You can select multiple files to upload at once.
This feature only supports uploading files, not folders.

## New session button

Cloud Shell allows you to have multiple concurrent sessions across browser tabs. Each session runs
as a separate process on the same machine. When exiting Cloud Shell, be sure to exit from each
session window as each process runs independently.

[![Screenshot of the New session button.][04i]][04x]

To start a new session, select **New session** button on toolbar. A new browser tab opens with
another session connected to the existing container.

## Cloud Shell editor button

The Cloud Shell editor is a browser-based text editor that's optimized for managing and editing
files in your Cloud Shell environment. When you select the **<kbd>&#x1F589; Editor</kbd>** button,
Cloud Shell opens the editor in the top half of the Cloud Shell window.

For more information, see [Using the Azure Cloud Shell editor][12].

[![Screenshot of the Editor button.][12i]][12x]

If you select the **Open in VS Code for the Web** button, Cloud Shell opens a new browser tab with a
Visual Studio Code environment connected to Azure. This environment gives you access to the full VS
Code interface, including the file explorer, editor, and integrated terminal, while still using the
same Cloud Shell container and authentication. For more information about using VS Code for the Web
with Azure, see [VS Code for the Web - Azure][14].

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

- Windows: Use <kbd>Ctrl</kbd>+<kbd>c</kbd> to copy and <kbd>Ctrl</kbd>+<kbd>v</kbd> or
  <kbd>Shift</kbd>+<kbd>Insert</kbd> to paste.
  - Firefox might not support clipboard permissions properly.
- macOS: <kbd>Cmd</kbd>+<kbd>c</kbd> to copy and <kbd>Cmd</kbd>+<kbd>v</kbd> to paste.
- Linux: <kbd>Ctrl</kbd>+<kbd>c</kbd> to copy and <kbd>Ctrl</kbd>+<kbd>v</kbd> to paste.

> [!NOTE]
> If no text is selected when you type <kbd>Ctrl</kbd>+<kbd>C</kbd>, Cloud Shell sends the `Ctrl-c`
> character to the shell. The shell can interpret `Ctrl-c` as a **Break** signal and terminate the
> currently running command.

When using the Bash shell, pasted text is automatically highlighted due to bracketed paste mode. To
disable highlighting, run the following command:

```bash
bind 'set enable-bracketed-paste off'
```

This setting only persists if you have a mounted storage account.

## Resize Cloud Shell window

Drag the top edge of the toolbar up or down to resize the Cloud Shell window.

## Scrolling text display

Scroll with your mouse or touchpad to move terminal text.

## Exit command

The `exit` command terminates the active session. Cloud Shell also terminates your session after 20
minutes without interaction.

## Keyboard shortcuts

The Cloud Shell terminal has the following keyboard shortcuts available when the terminal is in focus.

|                  Shortcut                   |                           Action                           |
| ------------------------------------------- | ---------------------------------------------------------- |
| <kbd>Ctrl</kbd>+<kbd>C</kbd>                | Copy selected text                                         |
| <kbd>Ctrl</kbd>+<kbd>V</kbd>                | Paste from clipboard                                       |
| <kbd>Ctrl</kbd>+<kbd>`</kbd>                | Toggle focus between the terminal and the editor           |
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>E</kbd> | Toggle the editor panel - same as using the toolbar button |
| <kbd>Shift</kbd>+<kbd>Tab</kbd>             | Move focus out of the terminal to toolbar                  |

## Next steps

[Using the Azure Cloud Shell editor][12]

<!-- link references -->
[01i]: media/use-the-shell-window-new/close-port.png
[01x]: media/use-the-shell-window-new/close-port.png#lightbox
[03i]: media/use-the-shell-window-new/manage-files.png
[03x]: media/use-the-shell-window-new/manage-files.png#lightbox
[04i]: media/use-the-shell-window-new/new-session.png
[04x]: media/use-the-shell-window-new/new-session.png#lightbox
[05i]: media/use-the-shell-window-new/new-ui-fullscreen.png
[05x]: media/use-the-shell-window-new/new-ui-fullscreen.png#lightbox
[06i]: media/use-the-shell-window-new/restart-cloud-shell.png
[06x]: media/use-the-shell-window-new/restart-cloud-shell.png#lightbox
[07i]: media/use-the-shell-window-new/settings-menu.png
[07x]: media/use-the-shell-window-new/settings-menu.png#lightbox
[08i]: media/use-the-shell-window-new/switch-to-bash.png
[08x]: media/use-the-shell-window-new/switch-to-bash.png#lightbox
[09i]: media/use-the-shell-window-new/toolbar.png
[09x]: media/use-the-shell-window-new/toolbar.png#lightbox
[10i]: media/use-the-shell-window-new/web-preview.png
[10x]: media/use-the-shell-window-new/web-preview.png#lightbox
[11i]: media/use-the-shell-window-new/help-menu.png
[11x]: media/use-the-shell-window-new/help-menu.png#lightbox
[12i]: media/use-the-shell-window-new/editor.png
[12x]: media/use-the-shell-window-new/editor.png#lightbox
[12]: using-cloud-shell-editor.md
[13]: using-the-shell-window.md
[14]: https://code.visualstudio.com/docs/azure/vscodeforweb
