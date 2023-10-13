---
title: Use features of the Remote Desktop client for iOS and iPadOS - Azure Virtual Desktop
description: Learn how to use features of the Remote Desktop client for iOS and iPadOS when connecting to Azure Virtual Desktop.
author: dknappettmsft
ms.topic: how-to
ms.date: 10/04/2022
ms.author: daknappe
---

# Use features of the Remote Desktop client for iOS and iPadOS when connecting to Azure Virtual Desktop

Once you've connected to Azure Virtual Desktop using the Remote Desktop client, it's important to know how to use the features. This article shows you how to use the features available in the Remote Desktop client for iOS and iPadOS. If you want to learn how to connect to Azure Virtual Desktop, see [Connect to Azure Virtual Desktop with the Remote Desktop client for iOS and iPadOS](connect-ios-ipados.md).

You can find a list of all the Remote Desktop clients at [Remote Desktop clients overview](remote-desktop-clients-overview.md). For more information about the differences between the clients, see [Compare the Remote Desktop clients](../compare-remote-desktop-clients.md).

> [!NOTE]
> Your admin can choose to override some of these settings in Azure Virtual Desktop, such as being able to copy and paste between your local device and your remote session. If some of these settings are disabled, please contact your admin.

## Edit, refresh, or delete a workspace

To edit, refresh or delete a workspace:

1. Open the **RD Client** application on your device, then tap **Workspaces**.

1. Tap and hold the name of a workspace and you'll see a menu with options for **Edit**, **Refresh**, and **Delete**. You can also pull down to refresh all workspaces.

   - **Edit** allows you to specify a user account to use each time you connect to the workspace without having to enter the account each time. To learn more, see [Manage user accounts](#manage-user-accounts).
   - **Refresh** makes sure you have the latest desktops and apps and their settings provided by your admin.
   - **Delete** removes the workspace from the Remote Desktop client.

## User accounts

Learn how to add user credentials to a workspace and manage them.

### Add user credentials to a workspace

You can save a user account and associate it with workspaces to simplify the connection sequence, as the sign-in credentials will be used automatically.

1. Open the **RD Client** application on your device, then tap **Workspaces**.

1. Tap and hold the name of a workspace, then select **Edit**.

1. Tap **User account**, then select **Add User Account** to add a new account, or select an account you've previously added.

1. If you selected **Add User Account**, enter a username, password, and optionally a friendly name, then tap the back arrow (**<**).

1. Tap the **X** mark to return to Workspaces.

### Manage user accounts

You can save a user account and associate it with workspaces to simplify the connection sequence, as the sign-in credentials will be used automatically. You can also remove accounts you no longer want to use.

To save a user account:

1. Open the **RD Client** application on your device.

1. In the top left-hand corner, tap the menu icon (the circle with three dots inside), then tap **Settings**.

1. Tap **User Accounts**, then tap **Add User Account**.

1. Enter a username, password, and optionally a friendly name, then tap the back arrow (**<**). You can then add this account to a workspace by following the steps in [Add user credentials to a workspace](#add-user-credentials-to-a-workspace).

1. Tap the back arrow (**<**), then tap the **X** mark.

To remove an account you no longer want to use:

1. Open the **RD Client** application on your device.

1. In the top left-hand corner, tap the menu icon (the circle with three dots inside), then tap **Settings**.

1. Tap **User Accounts**, then select the account you want to remove.

1. Tap **Delete**. The account will be removed immediately.

1. Tap the back arrow (**<**), then tap the **X** mark.

## Display preferences

Learn how to set display preferences, such as orientation and resolution.

### Set orientation

You can set the orientation of the Remote Desktop client to landscape, portrait, or auto-adjust, where it will match the orientation of your device. Auto-adjust is supported when your remote session is running Windows 10 or later. The window will maintain the same scaling and update the resolution to match the new orientation. This setting applies to all workspaces.

   > [!IMPORTANT]
   > Support for Windows Server 2012 R2 ended on October 10, 2023. For more information, view [SQL Server 2012 and Windows Server 2012/2012 R2 end of support](/lifecycle/announcements/sql-server-2012-windows-server-2012-2012-r2-end-of-support).

To set the orientation:

1. Open the **RD Client** application on your device.

1. In the top left-hand corner, tap the menu icon (the circle with three dots inside), then tap **Settings**.

1. Tap **Display**, then tap **Orientation**.

1. Tap your preference from **Auto-adjust**, **Lock to Landscape** or **Lock to Portrait**.

1. You can also set **Use Home Indicator Area**. Toggling this on will show graphics from the remote session in the area at the bottom of the screen occupied by the Home indicator. This setting only applies in landscape orientation.

1. Tap the back arrow (**<**), then tap the **X** mark.

### Set display resolution

You can choose the resolution for your remote session from a predefined list. This setting applies to all workspaces.

> [!NOTE]
> Changes to the display resolution only take effect for new connections. For current connections, you'll need to disconnect and reconnect from a remote session

To set the resolution:

1. Open the **RD Client** application on your device.

1. In the top left-hand corner, tap the menu icon (the circle with three dots inside), then tap **Settings**.

1. Tap **Display**.

1. Tap a resolution from the list.

1. Tap the back arrow (**<**), then tap the **X** mark.

### Use full display or home indicator area

On iPadOS, you can set **Use Full Display**. Toggling this on will use the full display of your device, but will result in some content from the remote session being obscured, such as graphics n the rounded corners of the screen.

1. Open the **RD Client** application on your device.

1. In the top left-hand corner, tap the menu icon (the circle with three dots inside), then tap **Settings**.

1. Tap **Display**.

1. Toggle **Use Full Display**.

1. Tap the back arrow (**<**), then tap the **X** mark.

On iOS, you can set **Use Home Indicator Area**. Toggling this on will show graphics from the remote session in the area at the bottom of the screen occupied by the Home indicator. This setting only applies in landscape orientation. For more information about display orientation, see [Set orientation](#set-orientation). To set **Use Home Indicator Area**:

1. Open the **RD Client** application on your device.

1. In the top left-hand corner, tap the menu icon (the circle with three dots inside), then tap **Settings**.

1. Tap **Display**.

1. Toggle **Use Home Indicator Area**.

1. Tap the back arrow (**<**), then tap the **X** mark.

## Connection bar and session overview menu

When you've connected to Azure Virtual Desktop, you'll see a bar at the top, which is called the **connection bar**. This gives you quick access to a zoom control, represented by a magnifying glass icon, and the ability to toggle between showing and hiding the on-screen keyboard. You can move the connection bar around the top and side edges of the display by tapping and dragging it to where you want it. If you tap and hold the zoom control, you can choose the percentage by which to zoom by using the slider. If you use a keyboard, you can also show and hide the connection bar by pressing <kbd>Shift</kbd>+<kbd>CMD</kbd>+<kbd>Space bar</kbd>.

The middle icon in the connection bar is of the Remote Desktop logo. If you tap this, it shows the *session overview* screen. The *session overview* screen enables you to:

- Go to the *Connection Center* using the **Home** icon.
- Switch inputs between touch and the mouse pointer (when not using a separate mouse).
- Switch between active desktops and apps.
- Disconnect all active sessions.

Pressing <kbd>Tab</kbd> on a keyboard will switch between the PCs and Apps tab in the *session overview* menu. You can also use arrow keys to navigate and select an active session to open.

You can return back to an active session from the Connection Center using the **Return Arrow** button found in the bottom right corner of the Connection Center.

## Input methods

The Remote Desktop client supports native touch gestures, keyboard, mouse, and trackpad.

### Use touch gestures and mouse modes in a remote session

You can use touch gestures to replicate mouse actions in your remote session. Two mouse modes are available:

- **Direct touch**: where you tap on the screen is the equivalent to clicking a mouse in that position. The mouse pointer isn't shown on screen.
- **Mouse pointer**: The mouse pointer is shown on screen. When you tap the screen and move your finger, the mouse pointer will move. 

If you connect to Windows 10 or later with Azure Virtual Desktop, native Windows touch and multi-touch gestures are supported in direct touch mode.

The following table shows which mouse operations map to which gestures in specific mouse modes:

| Mouse mode    | Mouse operation      | Gesture                                                                 |
|:--------------|:---------------------|:------------------------------------------------------------------------|
| Direct touch  | Left-click           | Tap with one finger                                                     |
| Direct touch  | Right-click          | Tap and hold with one finger                                            |
| Mouse pointer | Left-click           | Tap with one finger                                                     |
| Mouse pointer | Left-click and drag  | Double-tap and hold with one finger, then drag                          |
| Mouse pointer | Right-click          | Tap with two fingers, or tap and hold with one finger                   |
| Mouse pointer | Right-click drag     | Double-tap and hold with two fingers, then drag                         |
| Mouse pointer | Mouse wheel          | Tap and hold with two fingers, then drag up or down                     |
| Mouse pointer | Zoom                 | With two fingers, pinch to zoom out and spread fingers apart to zoom in |

### Keyboard

You can use familiar keyboard shortcuts when using a keyboard with your iPad or iPhone and Azure Virtual Desktop. Mac and Windows keyboard layouts differ slightly - for example, the <kbd>Command</kbd> key on a Mac keyboard equals the <kbd>Windows</kbd> key on a Windows keyboard. To help with the differences this makes when using keyboard shortcuts, the Remote Desktop client automatically maps common shortcuts found in iOS and iPadOS so they'll work in Windows. These are:

| Key combination             | Function   |
|-----------------------------|------------|
| <kbd>CMD</kbd>+<kbd>C</kbd> | Copy       |
| <kbd>CMD</kbd>+<kbd>X</kbd> | Cut        |
| <kbd>CMD</kbd>+<kbd>V</kbd> | Paste      |
| <kbd>CMD</kbd>+<kbd>A</kbd> | Select all |
| <kbd>CMD</kbd>+<kbd>Z</kbd> | Undo       |
| <kbd>CMD</kbd>+<kbd>F</kbd> | Find       |
| <kbd>CMD</kbd>+<kbd>+</kbd> | Zoom in    |
| <kbd>CMD</kbd>+<kbd>-</kbd> | Zoom out   |

In addition, the <kbd>Alt</kbd> key to the right of the space bar on a Mac keyboard equals the <kbd>Alt Gr</kbd> in Windows.

### Mouse and trackpad

You can use a mouse or trackpad with the Remote Desktop client. However, support for these devices depends on whether you're using iOS or iPadOS. iPadOS natively supports a mouse and trackpad as an input method, whereas support can only be enabled in iOS with *AssistiveTouch*. For more information, see [Connect a Bluetooth mouse or trackpad to your iPad](https://support.apple.com/HT211009) or [How to use a pointer device with AssistiveTouch on your iPhone, iPad, or iPod touch](https://support.apple.com/HT210546).

## Redirections

The Remote Desktop client enables you to make your local clipboard available in your remote session. By default, text you copy on your iOS or iPadOS device is available to paste in your remote session, and text you copy in your remote session is available to paste on your iOS or iPadOS device.

## General app settings

To set other general settings of the Remote Desktop app to use with Azure Virtual Desktop:

1. Open the **RD Client** application on your device.

1. In the top left-hand corner, tap the menu icon (the circle with three dots inside), then tap **Settings**.

1. You can change the following settings:

   | Setting | Value | Description |
   |--|--|--|
   | Show PC Thumbnails | Toggle **On** or **Off** | Show thumbnails of remote sessions. |
   | Allow Display Auto-Lock | Toggle **On** or **Off** | Allow your device to turn off its screen. |
   | Use HTTP Proxy | Toggle **On** or **Off** | Use the HTTP proxy specified in iOS/iPadOS network settings. |
   | Appearance | Select from **Light**, **Dark**, or **System** | Set the appearance of the Remote Desktop client. |
   | Send Data to Microsoft | Toggle **On** or **Off** | Help improve the Remote Desktop client by sending anonymous data to Microsoft. |

## Test the beta client

If you want to help us test new builds before they're released, you should download our beta client. Organizations can use the beta client to validate new versions for their users before they're generally available.

> [!NOTE]
> The beta client shouldn't be used in production.

You can download the beta client for iOS and iPadOS from TestFlight. To get started, see [Microsoft Remote Desktop for iOS](https://testflight.apple.com/join/vkLIflUJ).

## Provide feedback

If you want to provide feedback to us on the Remote Desktop client for iOS and iPadOS, you can do so in the app:

1. Open the **RD Client** application on your device.

1. In the top left-hand corner, tap the menu icon (the circle with three dots inside), then tap **Settings**.

1. Tap **Submit feedback**, which will open the feedback page in your browser.

## Next steps

If you're having trouble with the Remote Desktop client, see [Troubleshoot the Remote Desktop client](../troubleshoot-client-ios-ipados.md).
