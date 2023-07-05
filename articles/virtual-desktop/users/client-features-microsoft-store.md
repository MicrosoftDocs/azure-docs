---
title: Use features of the Remote Desktop app for Windows - Azure Virtual Desktop
description: Learn how to use features of the Remote Desktop app for Windows when connecting to Azure Virtual Desktop.
author: dknappettmsft
ms.topic: how-to
ms.date: 10/04/2022
ms.author: daknappe
---

# Use features of the Remote Desktop app for Windows when connecting to Azure Virtual Desktop

Once you've connected to Azure Virtual Desktop using the Remote Desktop app for Windows, it's important to know how to use the features. This article shows you how to use the features available in the Remote Desktop app for Windows. If you want to learn how to connect to Azure Virtual Desktop, see [Connect to Azure Virtual Desktop with the Remote Desktop app for Windows](connect-microsoft-store.md).

> [!IMPORTANT]
> We're no longer updating the Remote Desktop app for Windows with new features.
>
> For the best Azure Virtual Desktop experience that includes the latest features and updates, we recommend you download the [Azure Virtual Desktop Store app for Windows](connect-windows-azure-virtual-desktop-app.md) instead.

You can find a list of all the Remote Desktop clients at [Remote Desktop clients overview](remote-desktop-clients-overview.md). For more information about the differences between the clients, see [Compare the Remote Desktop clients](../compare-remote-desktop-clients.md).

> [!NOTE]
> Your admin can choose to override some of these settings in Azure Virtual Desktop, such as being able to copy and paste between your local device and your remote session. If some of these settings are disabled, please contact your admin.

## Refresh or unsubscribe from a workspace or see its details

To refresh or unsubscribe from a workspace or see its details:

1. Open the **Remote Desktop** app on your device.

1. Select the three dots to the right-hand side of the name of a workspace where you'll see a menu with options for **Details**, **Refresh**, and **Unsubscribe**. 

   - **Details** shows you details about the workspace, such as:
     - The name of the workspace.
     - The URL and username used to subscribe.
     - The number of desktops and apps.
     - The date and time of the last refresh.
     - The status of the last refresh.
   - **Refresh** makes sure you have the latest desktops and apps and their settings provided by your admin.
   - **Unsubscribe** removes the workspace from the Remote Desktop app.

## Pin desktops and applications to the Start Menu

You can pin your Azure Virtual Desktop desktops and applications to the Start Menu on your local device to make them easier to find and launch:

1. Open the **Remote Desktop** app on your device.

1. Right-click on a desktop or application, select **Pin to Start**, then confirm the prompt.

## User accounts

### Add user credentials to a workspace

You can save a user account and associate it with workspaces to simplify the connection sequence, as the sign-in credentials will be used automatically.

1. Open the **Remote Desktop** app on your device, then select **Workspaces**.

1. Select one of the icons to launch a session to Azure Virtual Desktop.

1. When prompted to choose an account, select **+** for *User Account* to add a new account, or select an account you've previously added.

1. If you selected to add an account, enter a username, password, and optionally a friendly name, then select **Add**.

1. Select **Save**, then select **Connect**.

### Manage user accounts

You can save a user account and associate it with workspaces to simplify the connection sequence, as the sign-in credentials will be used automatically. You can also edit a saved account or remove accounts you no longer want to use.

To save a user account:

1. Open the **Remote Desktop** app on your device.

1. Select **Settings**.

1. Select the **+** (plus) icon next to **User account**.

1. Enter a username, password, and optionally a display name, then select **Save**. You can then add this account to a workspace by following the steps in [Add user credentials to a workspace](#add-user-credentials-to-a-workspace).

To remove an account you no longer want to use:

1. Open the **Remote Desktop** app on your device.

1. Select **Settings**.

1. Select the user account from the drop-down list you want to remove, then select **Edit** (pencil icon).

1. Select **Remove account**, then confirm you want to delete the user account.

To change the user account a remote session is using, you'll need to remove the workspace and add it again.

## Display preferences

If you want to use different display settings to those specified by your admin, you can configure custom settings. Display settings apply to all workspaces.

1. Open the **Remote Desktop** app on your device.

1. Select **Settings**.

1. You can configure the following settings:

   | Setting | Value |
   |--|--|
   | Start connections in full screen | **On** or **off** |
   | Start each connection in a new window | **On** or **off** |
   | When resizing the app | - Stretch the content, preserving aspect ratio<br />- Stretch the content<br />- Show scroll bars |
   | Prevent the screen from timing out | **On** or **off** |

## Connection bar and command menu

When you've connected to Azure Virtual Desktop, you'll see a bar at the top, which is called the **connection bar**. This gives you quick access to a zoom control, represented by a magnifying glass icon, and more options. You can move the connection bar around the top edge of the display by tapping and dragging it to where you want it.

The icon with three dots in the connection bar shows the **command menu** that enables you to:

- Disconnect the remote session.
- Toggle between full screen and a window.
- Toggle between direct touch and mouse input.

## Input methods

You can use touch input, or a built-in or external PC keyboard, trackpad and mouse to control desktops or apps.

### Use touch gestures and mouse modes in a remote session

You can use touch gestures to replicate mouse actions in your remote session. Two mouse modes are available:

- **Direct touch**: where you tap on the screen is the equivalent to clicking a mouse in that position. The mouse pointer isn't shown on screen.
- **Mouse pointer**: The mouse pointer is shown on screen. When you tap the screen and move your finger, the mouse pointer will move. 

If you connect to Windows 10 or later with Azure Virtual Desktop, native Windows touch and multi-touch gestures are supported in direct touch mode.

The following table shows which mouse operations map to which gestures in specific mouse modes:

| Mouse mode    | Mouse operation      | Gesture                                                               |
|:--------------|:---------------------|:----------------------------------------------------------------------|
| Direct touch  | Left-click           | Tap with one finger                                                   |
| Direct touch  | Right-click          | Tap and hold with one finger                                          |
| Mouse pointer | Left-click           | Tap with one finger                                                   |
| Mouse pointer | Left-click and drag  | Double-tap and hold with one finger, then drag                        |
| Mouse pointer | Right-click          | Tap with two fingers                                                  |
| Mouse pointer | Right-click and drag | Double-tap and hold with two fingers, then drag                       |
| Mouse pointer | Mouse wheel          | Tap and hold with two fingers, then drag up or down                   |
| Mouse pointer | Zoom                 | With two fingers, pinch to zoom out and move fingers apart to zoom in |

### Keyboard

There are several keyboard shortcuts you can use to help use some of the features. Most common Windows keyboard shortcuts, such as <kbd>CTRL</kbd>+<kbd>C</kbd> for copy and <kbd>CTRL</kbd>+<kbd>Z</kbd> for undo, are the same when using Azure Virtual Desktop. There are some keyboard shortcuts that are different so Windows knows when to use them in Azure Virtual Desktop or on your local device. These are:

| Windows shortcut | Azure Virtual Desktop shortcut | Description |
|--|--|--|
| <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>DELETE</kbd> | <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>END</kbd> | Shows the Windows Security dialog box. |

You can configure the Remote Desktop app whether to send keyboard commands to the remote session:

1. Open the **Remote Desktop** app on your device.

1. Select **Settings**.

1. For **Use keyboard commands with**, select from one of the following:

   - My local PC only.
   - My remote session when it's in full screen (*default*).
   - My remote session when it's in use.

### Keyboard language

By default, remote desktops and apps will use the same keyboard language, also known as *locale*, as your Windows PC. For example, if your Windows PC uses **en-GB** for *English (United Kingdom)*, that will also be used by Windows in the remote session.

You can manually set which keyboard language to use in the remote session by following the steps at [Managing display language settings in Windows](https://support.microsoft.com/windows/manage-display-language-settings-in-windows-219f28b0-9881-cd4c-75ca-dba919c52321). You might need to close and restart the app you're currently using for the keyboard changes to take effect.

## Redirections

The Remote Desktop app can make your local clipboard and microphone available in your remote session where you can copy and paste text, images, and files. The audio from the remote session can also be redirected to your local device. However, redirection can't be configured using the Remote Desktop app for Windows. This behavior is configured by your admin in Azure Virtual Desktop.

## Update the app

Updates for the Remote Desktop app are delivered through the Microsoft Store. Use the Microsoft Store to check for and download updates.

## App display modes

You can configure the Remote Desktop app to be displayed in light or dark mode, or match the mode of your system:

1. Open the **Remote Desktop** app on your device.

1. Select **Settings**.

1. Under **Theme preference**, select **Light**, **Dark**, or **Use system setting**. Restart the app to apply the change.

## Pin to the Start menu

You can pin your remote desktops to the Start menu on your local device to make them easier to launch:

1. Open the **Remote Desktop** app on your device.

1. Right-click a resource, then select **Pin to Start**.

## Admin link to subscribe to a workspace

The Remote Desktop app for Windows supports the *ms-rd* Uniform Resource Identifier (URI) scheme. This enables you to use a link that users can help to automatically subscribe to a workspace, rather than them having to manually add the workspace in the Remote Desktop app.

To subscribe to a workspace with a link:

1. Open the following link in a web browser: `ms-rd:subscribe?url=https://rdweb.wvd.microsoft.com`.

1. If you see the prompt **This site is trying to open Remote Desktop**, select **Open**. The **Remote Desktop** app should open and automatically show a sign-in prompt.

1. Enter your user account, then select **Sign in**. After a few seconds, your workspaces should show the desktops and applications that have been made available to you by your admin.

## Provide feedback

If you want to provide feedback to us on the Remote Desktop app for Windows, you can do so by selecting the button that looks like a smiley face emoji in the app, as shown in the following image. This will open the **Feedback Hub**.

:::image type="content" source="../media/smiley-face-icon-store.png" alt-text="A screenshot highlighting the feedback button in a red box":::

To best help you, we need you to give us as detailed information as possible. Along with a detailed description, you can include screenshots, attach a file, or make a recording. For more tips about how to provide helpful feedback, see [Feedback](/windows-insider/feedback#add-new-feedback).

## Next steps

If you're having trouble with the Remote Desktop app for Windows, see [Troubleshoot the Remote Desktop app for Windows](../troubleshoot-client-microsoft-store.md).
