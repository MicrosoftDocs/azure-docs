---
title: Use features of the Remote Desktop client for macOS - Azure Virtual Desktop
description: Learn how to use features of the Remote Desktop client for macOS when connecting to Azure Virtual Desktop.
author: dknappettmsft
ms.topic: how-to
ms.date: 10/04/2022
ms.author: daknappe
---

# Use features of the Remote Desktop client for macOS when connecting to Azure Virtual Desktop

Once you've connected to Azure Virtual Desktop using the Remote Desktop client, it's important to know how to use the features. This article shows you how to use the features available in the Remote Desktop client for macOS. If you want to learn how to connect to Azure Virtual Desktop, see [Connect to Azure Virtual Desktop with the Remote Desktop client for macOS](connect-macos.md).

You can find a list of all the Remote Desktop clients at [Remote Desktop clients overview](remote-desktop-clients-overview.md). For more information about the differences between the clients, see [Compare the Remote Desktop clients](../compare-remote-desktop-clients.md).

> [!NOTE]
> Some of the settings in this article can be overridden by your admin, such as being able to copy and paste between your local device and your remote session. If some of these settings are disabled, please contact your admin.

## Edit, refresh, or delete a workspace

To edit, refresh or delete a workspace:

1. Open the **Microsoft Remote Desktop** application on your device, then select **Workspaces**.

1. Right-click the name of a workspace or hover your mouse cursor over it and you'll see a menu with options for **Edit**, **Refresh**, and **Delete**. 

   - **Edit** allows you to specify a user account to use each time you connect to the workspace without having to enter the account each time. To learn more, see [Manage user accounts](#manage-user-accounts).
   - **Refresh** makes sure you have the latest desktops and apps and their settings provided by your admin.
   - **Delete** removes the workspace from the Remote Desktop client.

## User accounts

### Add user credentials to a workspace

You can save a user account and associate it with workspaces to simplify the connection sequence, as the sign-in credentials will be used automatically.

1. Open the **Microsoft Remote Desktop** application on your device, then select **Workspaces**.

1. Right-click the name of a workspace, then select **Edit**.

1. For **User account**, select **Add User Account...** to add a new account, or select an account you've previously added.

1. If you selected **Add User Account...**, enter a username, password, and optionally a friendly name, then select **Add**.

1. Select **Save**.

### Manage user accounts

You can save a user account and associate it with workspaces to simplify the connection sequence, as the sign-in credentials will be used automatically. You can also remove accounts you no longer want to use.

To save a user account:

1. Open the **Microsoft Remote Desktop** application on your device.

1. From the macOS menu bar, select **Microsoft Remote Desktop**, then select **Preferences**.

1. Select the **User Accounts** tab, then the **+** (plus) icon.

1. Enter a username, password, and optionally a friendly name, then select **Add**. You can then add this account to a workspace by following the steps in [Add user credentials to a workspace](#add-user-credentials-to-a-workspace).

1. Close Preferences.

To remove an account you no longer want to use:

1. Open the **Microsoft Remote Desktop** application on your device.

1. From the macOS menu bar, select **Microsoft Remote Desktop**, then select **Preferences**.

1. Select the **User Accounts** tab, then select the account you want to remove.

1. Select the **-** (minus) icon, then confirm you want to delete the user account.

1. Close Preferences.

## Display preferences

### Add, remove, or restore display resolutions

To add, remove or restore display resolutions:

1. Open the **Microsoft Remote Desktop** application on your device.

1. From the macOS menu bar, select **Microsoft Remote Desktop**, then select **Preferences**.

1. Select the **Resolutions** tab.

1. To add a custom resolution, select the **+** (plus) icon and enter in the **width** and **height** in pixels, then select **Add**.

1. To remove a resolution, select the resolution you want to remove, then select the **-** (minus) icon. Confirm you want to delete the resolution by selecting **Delete**.

1. To restore default resolutions, select **Restore Defaults**.

### Display settings for each remote desktop

If you want to use different display settings to those specified by your admin, you can configure custom settings.

1. Open the **Microsoft Remote Desktop** application on your device, then select **Workspaces**.

1. Right-click the name of a desktop, for example **SessionDesktop**, then select **Edit**.

1. Check the box for **Use custom settings**.

1. On the **Display** tab, you can select from the following options:

| Option | Description |
|--|--|
| Resolution | Select the resolution to use for the desktop. You can select from a predefined list, or add custom resolutions. |
| Use all monitors | Automatically use all monitors for the desktop. If you have multiple monitors, all of them will be used.<br /><br />For information on limits, see [Compare the features of the Remote Desktop clients](../compare-remote-desktop-clients.md). |
| Start session in full screen | The desktop will be displayed full screen, rather than windowed. |
| Fit session to window | When you resize the window, the scaling of the desktop will automatically adjust to fit the new window size. The resolution will stay the same. |
| Color quality | The quality and number of colors used. Higher quality will use more bandwidth. |
| Optimize for Retina displays | Scale the desktop to match the scaling used on the Mac client. This will use four times more bandwidth. |
| Update the session resolution on resize | When you resize the window, the resolution of the desktop will automatically change to match. |

### Displays have separate spaces

macOS allows you to create extra desktops, called *Spaces*, where only the Windows that are in that space are visible. This is set in macOS **System Preferences** > **Mission Control** > **Displays have separate Spaces**. If this is disabled, macOS will use the same desktop across all monitors.

When separate Spaces are disabled, if the Remote Desktop client has **Start session in full screen** enabled, but **Use all monitors** disabled, only one monitor will be used and the others will be blank. Either enable **Use all monitors** so the remote desktop is displayed on all monitors, or enable **Displays have separate spaces** in Mission Control so that the remote desktop will be displayed full screen on one monitor, but others will show the macOS desktop.

### Sidecar

You can use *Apple Sidecar* during a remote session, allowing you to extend a Mac desktop display using an iPad as an extra monitor.

## Input methods

You can use a built-in or external Mac keyboard, trackpad and mouse to control desktops or apps.

### Keyboard

Mac and Windows keyboard layouts differ slightly - for example, the <kbd>Command</kbd> key on a Mac keyboard equals the <kbd>Windows</kbd> key on a Windows keyboard. To help with the differences this makes when using keyboard shortcuts, the Remote Desktop client automatically maps common shortcuts found in macOS so they'll work in Windows. These are:

| Key combination             | Function   |
|-----------------------------|------------|
| <kbd>CMD</kbd>+<kbd>C</kbd> | Copy       |
| <kbd>CMD</kbd>+<kbd>X</kbd> | Cut        |
| <kbd>CMD</kbd>+<kbd>V</kbd> | Paste      |
| <kbd>CMD</kbd>+<kbd>A</kbd> | Select all |
| <kbd>CMD</kbd>+<kbd>Z</kbd> | Undo       |
| <kbd>CMD</kbd>+<kbd>F</kbd> | Find       |

In addition, the <kbd>Alt</kbd> key to the right of the space bar on a Mac keyboard equals the <kbd>Alt Gr</kbd> in Windows.

### Keyboard language

By default, remote desktops and apps will use the same keyboard language, also known as *locale*, as your Mac. For example, if your Mac uses **en-GB** for *English (United Kingdom)*, that will also be used by Windows in the remote session.

There are some Mac-specific layouts or custom layouts for which an exact match may not be available on the version of Windows you're connecting to. Your Mac keyboard will be matched to the best available on the remote session.

If your keyboard layout is set to a variation of a language, such as *Canadian-French*, and if the remote session can't map you to that exact variation, it will map the closest available language instead. For example, if you chose the *Canadian-French* locale and it wasn't available, the closest language would be *French*. However, some of the Mac keyboard shortcuts you're used to using on your Mac may not work as expected in the remote session.

There are some scenarios where characters in the remote session don't match the characters you typed on the Mac keyboard:

- Using a keyboard that the remote session doesn't recognize. When Azure Virtual Desktop doesn't recognize the keyboard, it defaults to the language last used with the remote PC.
- Connecting to a previously disconnected session from Azure Virtual Desktop where that session uses a different keyboard language than the language you're currently trying to use.
- Needing to switch keyboard modes between unicode and scancode. To learn more, see [Keyboard modes](#keyboard-modes).

You can manually set which keyboard language to use in the remote session by following the steps at [Managing display language settings in Windows](https://support.microsoft.com/windows/manage-display-language-settings-in-windows-219f28b0-9881-cd4c-75ca-dba919c52321). You might need to close and restart the application you're currently using for the keyboard changes to take effect.

#### Keyboard modes

There are two different modes you can use that control how keyboard input is interpreted in a remote session: *Scancode* and *Unicode*.

With *Scancode*, user input is redirected by sending key press *up* and *down* information to the remote session. Each key is identified by its physical position on the keyboard and uses the keyboard layout of the remote session, not the keyboard of the local device. For example, scancode 31 is the key next to <kbd>Caps Lock</kbd>. On a US keyboard this key would produce the character "A", while on a French keyboard this key would produce the character "Q".

With *Unicode*, user input is redirected by sending each character to the remote session. When a key is pressed, the locale of the user is used to translate this input to a character. This can be as simple as the character "a" by simply pressing the "a" key, but it can enable an Input Method Editor (IME), allowing you to input multiple keystrokes to create more complex characters, such as for Chinese and Japanese input sources. Below are some examples of when to use each mode.

When to use *Scancode*:

- Dealing with characters that aren't printable, such as <kbd>Arrow Up</kbd> or shortcut combinations.

- Certain applications that don't accept Unicode input for characters such as: Hyper-V VMConnect (for example, no way to input a BitLocker password), VMware Remote Console, all applications written using the *Qt framework* (for example R Studio, TortoiseHg, QtCreator).

- Applications that utilize scancode input for actions, such as <kbd>Space bar</kbd> to check/uncheck a checkbox, or individual keys as shortcuts, for example applications in browser.

When to use *Unicode*:

- To avoid a mismatch in expectations. A user who expects the keyboard to behave like a Mac keyboard and not like a PC keyboard can run into issues where Mac and PC have differences for the same locale/region layout.

- When the keyboard layout used on the client might not be available on the server.

To switch between keyboard modes:

1. Open the **Microsoft Remote Desktop** application on your device.

1. From the macOS menu bar, select **Connections**, then select **Keyboard Mode**.

1. Choose **Scancode** or **Unicode**.

Alternatively, you can use the following keyboard shortcut to select each mode:

- Scancode: <kbd>Ctrl</kbd>+<kbd>Command</kbd>+<kbd>K</kbd>
- Unicode: <kbd>Ctrl</kbd>+<kbd>Command</kbd>+<kbd>U</kbd>

#### Input Method Editor

The Remote Desktop client supports Input Method Editor (IME) in a remote session for input sources. The local macOS IME experience will be accessible in the remote session.

> [!IMPORTANT]
> For an IME to work, the input mode needs to be in Unicode Mode. To learn more, see [Keyboard modes](#keyboard-modes).

### Mouse and trackpad

You can use a mouse or trackpad with the Remote Desktop client. In order to use the right-click or secondary-click, you may need to configure macOS to enable right-click, or you can plug in a standard PC two-button USB mouse. To enable right-click in macOS:

1. Open **System Preferences**.

1. For the Apple Magic Mouse, select **Mouse**, then check the box for **Secondary click**.

1. For the Apple Magic Trackpad of MacBook Trackpad, select **Trackpad**, then check the box for **Secondary click**.

## Redirections

### Folder redirection

The Remote Desktop client enables you to make local folders available in your remote session. This is known as *folder redirection*. This means you can open files from and save files to your Mac with your remote session. Folders can also be redirected as read-only. Redirected folders appear in the remote session as a network drive in Windows Explorer.

#### All remote sessions

To enable folder redirection for all remote desktops:

1. Open the **Microsoft Remote Desktop** application on your device.

1. From the macOS menu bar, select **Microsoft Remote Desktop**, then select **Preferences**.

1. Select the **General** tab, then for **If folder redirection is enabled for RDP files or managed resources, redirect:**, select **Choose Folder...**.

1. Navigate to the folder you want to be available in all your remote desktop sessions, then select **Choose**.

1. Close the **Preferences** window. Optionally, if you want to make this folder available as read-only, check the box before closing the window.

#### Each remote resource

To enable folder redirection for each remote desktop individually:

If you want to use different display settings to those specified by your admin for the workspace, you can configure custom settings.

1. Open the **Microsoft Remote Desktop** application on your device, then select **Workspaces**.

1. Right-click the name of a desktop, for example **SessionDesktop**, then select **Edit**.

1. Check the box for **Use custom settings**.

1. On the **Folders** tab, check the box **Redirect folders**, then select the **+** (plus) icon.

1. Navigate to the folder you want to be available when accessing this remote resource, then select **Open**. You can add multiple folders by repeating the previous step and this step.

1. Select **Save**. Optionally, if you want to make this folder available as read-only, check the box, then select **Save**.

### Redirect devices, audio, and clipboard

The Remote Desktop client can make your local clipboard and local devices available in your remote desktop where you can copy and paste text, images, and files. You can also redirect the audio from the remote desktop to your local device. You can redirect:

- Printers
- Smart cards
- Clipboard
- Microphones
- Cameras

To enable redirection of devices, audio and the clipboard:

1. Open the **Microsoft Remote Desktop** application on your device, then select **Workspaces**.

1. Right-click the name of a desktop, for example **SessionDesktop**, then select **Edit**.

1. Check the box for **Use custom settings**.

1. On the **Devices & Audio** tab, check the box for each device you want to use in the remote desktop.

1. Select whether you want to play sound **On this computer**, **On the remote PC**, or **Never**.

1. Select **Save**.

## Microsoft Teams optimizations

You can use Microsoft Teams on Azure Virtual Desktop to chat, collaborate, make calls, and join meetings. With media optimization, the Remote Desktop client handles audio and video locally for Teams calls and meetings. For more information, see [Use Microsoft Teams on Azure Virtual Desktop](../teams-on-avd.md).

Starting with version 10.7.7 of the Remote Desktop client for macOS, optimizations for Teams is enabled by default. If you need to enable optimizations for Microsoft Teams:

1. Open the **Microsoft Remote Desktop** application on your device.

1. From the macOS menu bar, select **Microsoft Remote Desktop**, then select **Preferences**.

1. Select the **General** tab, then check the box **Enable optimizations for Microsoft Teams**.

## General app settings

To set other general settings of the Remote Desktop app to use with Azure Virtual Desktop:

1. Open the **Microsoft Remote Desktop** application on your device.

1. From the macOS menu bar, select **Microsoft Remote Desktop**, then select **Preferences**.

1. Select the **General** tab. You can change the following settings:

   | Setting | Value | Description |
   |--|--|--|
   | Show PC thumbnails | Check **On** or **Off**  | Show thumbnails of remote sessions. |
   | Help improve Remote Desktop | Check **On** or **Off**  | Send anonymous data to Microsoft. |
   | Use Mac shortcuts for copy, cut, paste and select all, undo, and find | Check **On** or **Off** | Use these shortcuts in remote sessions. |
   | Use system proxy configuration | Check **On** or **Off**  | Use the proxy specified in macOS network settings. |
   | Graphics interpolation level | Select from **Automatic**, **None**, **Low**, **Medium**, or **High**  | As the interpolation level is increased, most text and graphics appear smoother, but rendering performance will decrease (if hardware acceleration is disabled). |
   | Use hardware acceleration when possible | Check **On** or **Off**  | Use graphics hardware to render graphics. |

## Admin link to subscribe to a workspace

The Remote Desktop client for macOS supports the *ms-rd* Uniform Resource Identifier (URI) scheme. This enables you to use a link that users can help to automatically subscribe to a workspace, rather than them having to manually add the workspace in the Remote Desktop client.

To subscribe to a workspace with a link:

1. Open the following link in a web browser: `ms-rd:subscribe?url=https://rdweb.wvd.microsoft.com`.

1. If you see the prompt **This site is trying to open Microsoft Remote Desktop.app**, select **Open**. The **Microsoft Remote Desktop** application should open and automatically show a sign-in prompt.

1. Enter your user account, then select **Sign in**. After a few seconds, your workspaces should show the desktops and applications that have been made available to you by your admin.

## Test the beta client

If you want to help us test new builds before they're released, you should download our beta client. Organizations can use the beta client to validate new versions for their users before they're generally available.

> [!NOTE]
> The beta client shouldn't be used in production.

You can download the beta client for macOS from our [preview channel on AppCenter](https://aka.ms/rdmacbeta). You don't need to create an account or sign into AppCenter to download the beta client.

If you already have the beta client, you can check for updates to ensure you have the latest version by following these steps:

1. Open the **Microsoft Remote Desktop** application on your device.

1. From the macOS menu bar, select **Microsoft Remote Desktop**, then select **Check for updates**.

## Provide feedback

If you want to provide feedback to us on the Remote Desktop client for macOS, you can do so in the app:

1. Open the **Microsoft Remote Desktop** application on your device.

1. From the macOS menu bar, select **Help**, then select **Submit Feedback**.

## Next steps

If you're having trouble with the Remote Desktop client, see [Troubleshoot the Remote Desktop client](../troubleshoot-client-macos.md).
