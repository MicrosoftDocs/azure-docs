---
title: Use features of the Remote Desktop client for Android and Chrome OS - Azure Virtual Desktop
description: Learn how to use features of the Remote Desktop client for Android and Chrome OS when connecting to Azure Virtual Desktop.
author: dknappettmsft
ms.topic: how-to
ms.date: 10/04/2022
ms.author: daknappe
---

# Use features of the Remote Desktop client for Android and Chrome OS when connecting to Azure Virtual Desktop

Once you've connected to Azure Virtual Desktop using the Remote Desktop client, it's important to know how to use the features. This article shows you how to use the features available in the Remote Desktop client for Android and Chrome OS. If you want to learn how to connect to Azure Virtual Desktop, see [Connect to Azure Virtual Desktop with the Remote Desktop client for Android and Chrome OS](connect-android-chrome-os.md).

You can find a list of all the Remote Desktop clients at [Remote Desktop clients overview](remote-desktop-clients-overview.md). For more information about the differences between the clients, see [Compare the Remote Desktop clients](../compare-remote-desktop-clients.md).

> [!NOTE]
> Your admin can choose to override some of these settings in Azure Virtual Desktop, such as being able to copy and paste between your local device and your remote session. If some of these settings are disabled, please contact your admin.

## Edit, refresh, or delete a workspace

To edit, refresh or delete a workspace:

1. Open the **RD Client** app on your device, then tap **Workspaces**.

1. Tap the three dots to the right-hand side of the name of a workspace where you'll see a menu with options for **Edit**, **Refresh**, and **Delete**. 

   - **Edit** allows you to specify a user account to use each time you connect to the workspace without having to enter the account each time. To learn more, see [Manage user accounts](#manage-user-accounts).
   - **Refresh** makes sure you have the latest desktops and apps and their settings provided by your admin.
   - **Delete** removes the workspace from the Remote Desktop client.

## User accounts

### Add user credentials to a workspace

You can save a user account and associate it with workspaces to simplify the connection sequence, as the sign-in credentials will be used automatically.

1. Open the **RD Client** app on your device, then tap **Workspaces**.

1. Tap the three dots to the right-hand side of the name of a workspace, then select **Edit**.

1. For **User account**, tap the drop-down menu, then select **Add User Account** to add a new account, or select an account you've previously added.

1. If you selected **Add User Account**, enter a username and password, then tap **Save**.

1. Tap **Save** again to return to Workspaces.

### Manage user accounts

You can save a user account and associate it with workspaces to simplify the connection sequence, as the sign-in credentials will be used automatically. You can also remove accounts you no longer want to use.

To save a user account:

1. Open the **RD Client** app on your device.

1. In the top left-hand corner, tap the menu icon (three horizontal lines), then tap **User Accounts**.

1. Tap the plus icon (**+**).

1. Enter a username and password, then tap **Save**. You can then add this account to a workspace by following the steps in [Add user credentials to a workspace](#add-user-credentials-to-a-workspace).

1. Tap the back arrow (**<**) to return to Workspaces.

To remove an account you no longer want to use:

1. Open the **RD Client** app on your device.

1. In the top left-hand corner, tap the menu icon (three horizontal lines), then tap **User Accounts**.

1. Tap and hold the account you want to remove.

1. Tap delete (the bin icon). Confirm you want to delete the account.

1. Tap the back arrow (**<**) to return to Workspaces.

## Display preferences

### Set orientation

You can set the orientation of the Remote Desktop client to landscape, portrait, or auto-adjust, where it will match the orientation of your device. Auto-adjust is supported when your remote session is running Windows 10 or later. The window will maintain the same scaling and update the resolution to match the new orientation. This setting applies to all workspaces.

 > [!IMPORTANT]
 > Support for Windows Server 2012 R2 ended on October 10, 2023. For more information, view [SQL Server 2012 and Windows Server 2012/2012 R2 end of support](/lifecycle/announcements/sql-server-2012-windows-server-2012-2012-r2-end-of-support).

To set the orientation:

1. Open the **RD Client** app on your device.

1. In the top left-hand corner, tap the menu icon (three horizontal lines), then tap **Display**.

1. For orientation, tap your preference from **Auto-adjust**, **Lock to landscape** or **Lock to portrait**.

1. Tap the back arrow (**<**) to return to Workspaces.

### Set display resolution

You can choose the resolution for your remote session from a predefined list. This setting applies to all workspaces. You'll need to reconnect to remote sessions if you changed the resolution while connected.

To set the resolution:

1. Open the **RD Client** app on your device.

1. In the top left-hand corner, tap the menu icon (three horizontal lines), then tap **Display**.

1. You can tap **Default**, **Match this device**, or tap **+ Customized** for a drop-down list of predefined resolutions. If you choose a customized resolution, you can also choose the scaling percentage.

1. Tap the back arrow (**<**) to return to Workspaces.

## DeX

You can use *Samsung DeX* with a remote session, which enables you to extend your Android or Chromebook device's display to a larger monitor or TV.

## Connection bar and session overview menu

When you've connected to Azure Virtual Desktop, you'll see a bar at the top, which is called the **connection bar**. This gives you quick access to a zoom control, represented by a magnifying glass icon, and the ability to toggle between showing and hiding the on-screen keyboard. You can move the connection bar around the top edge of the display by tapping and dragging it to where you want it.

The middle icon in the connection bar is of the Remote Desktop logo. If you tap this, it shows the *session overview* screen. The *session overview* screen enables you to:

- Go to the *Connection Center* using the **Home** icon.
- Switch inputs between touch and the mouse pointer (when not using a separate mouse).
- Switch between active desktops and apps.
- Disconnect all active sessions.

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
| Mouse pointer | Left-click and drag  | Double-tap and hold with one finger, then drag                                 |
| Mouse pointer | Right-click          | Tap with two fingers, or tap and hold with one finger                                                   |
| Mouse pointer | Right-click drag     | Double-tap and hold with two fingers, then drag                
| Mouse pointer | Mouse wheel          | Tap and hold with two fingers, then drag up or down              |
| Mouse pointer | Zoom                 | With two fingers, pinch to zoom out and spread fingers apart to zoom in |

#### Input Method Editor

The Remote Desktop client supports Input Method Editor (IME) in a remote session for input sources. The local Android or Chrome OS IME experience will be accessible in the remote session.

> [!IMPORTANT]
> For an IME to work, the input mode needs to be in Unicode Mode. To learn more, see [Keyboard modes](#keyboard-modes).

### Keyboard

You can use some familiar keyboard shortcuts when using a keyboard with your Android or Chrome OS device and Azure Virtual Desktop, for example using <kbd>CTRL</kbd>+<kbd>C</kbd> for copy.

Some Windows keyboard shortcuts are also used as shortcuts on Android and Chrome OS devices, for example using <kbd>ALT</kbd>+<kbd>TAB</kbd> to switch between open applications. By default, these shortcuts won't be passed through to a remote session. Depending on your Android or Chrome OS device, you may be able to disable certain shortcuts being used locally, where they'll then be passed through to a remote session.

#### Keyboard modes

There are two different modes you can use that control how keyboard input is interpreted in a remote session: *Scancode* and *Unicode*.

With *Scancode*, user input is redirected by sending key press *up* and *down* information to the remote session. Each key is identified by its physical position on the keyboard and uses the keyboard layout of the remote session, not the keyboard of the local device. For example, scancode 31 is the key next to <kbd>Caps Lock</kbd>. On a US keyboard this key would produce the character "A", while on a French keyboard this key would produce the character "Q".

With *Unicode*, user input is redirected by sending each character to the remote session. When a key is pressed, the locale of the user is used to translate this input to a character. This can be as simple as the character "a" by simply pressing the "a" key, but it can enable an Input Method Editor (IME), allowing you to input multiple keystrokes to create more complex characters, such as for Chinese and Japanese input sources. Below are some examples of when to use each mode.

When to use *Scancode*:

- Dealing with characters that aren't printable, such as <kbd>Arrow Up</kbd> or shortcut combinations.

- Certain applications that don't accept Unicode input for characters such as: Hyper-V VMConnect (for example, no way to input a BitLocker password), VMware Remote Console, all applications written using the *Qt framework* (for example R Studio, TortoiseHg, QtCreator).

- Applications that utilize scancode input for actions, such as <kbd>Space bar</kbd> to check/uncheck a checkbox, or individual keys as shortcuts, for example applications in browser.

When to use *Unicode*:

- To avoid a mismatch in expectations. A user who expects the keyboard to behave in a certain way can run into issues where there are differences for the same locale/region layout.

- When the keyboard layout used on the client might not be available on the server.

By default, the Remote Desktop client uses *Unicode*. To switch between keyboard modes:

1. Open the **RD Client** app on your device.

1. In the top left-hand corner, tap the menu icon (three horizontal lines), then tap **General**.

1. Toggle **Use scancode input when available** to **On** to use *scancode*, or **Off** to use *Unicode*.

## Redirections

You can allow the remote computer to the clipboard on your local device. When you connect to a remote session, you'll be prompted whether you want to allow access to local resources. The Remote Desktop client supports copying and pasting text only.

To use the clipboard between your local device and your remote session:

1. Open the **RD Client** app on your device.

1. Tap one of the icons to launch a session to Azure Virtual Desktop.

1. For the prompt **Make sure you trust the remote PC before you connect**, check the box for **Clipboard**, then select **Connect**.

## General app settings

To set other general settings of the Remote Desktop app to use with Azure Virtual Desktop:

1. Open the **RD Client** app on your device.

1. In the top left-hand corner, tap the menu icon (three horizontal lines), then tap **General**.

1. You can change the following settings:

   | Setting | Value | Description |
   |--|--|--|
   | Show desktop previews | Toggle **On** or **Off** | Show thumbnails of remote sessions. |
   | Use HTTP Proxy | Toggle **On** or **Off** | Use the HTTP proxy specified in Android or Chrome OS network settings. |
   | Help improve Remote Desktop | Toggle **On** or **Off** | Send anonymous data to Microsoft. |
   | Theme | Select from **Light**, **Dark**, or **System** | Set the appearance of the Remote Desktop client. |

## Test the beta client

If you want to help us test new builds before they're released, you should download our beta client. Organizations can use the beta client to validate new versions for their users before they're generally available.

> [!NOTE]
> The beta client shouldn't be used in production environments.

You can download the beta client for Android and Chrome OS from [Google Play](https://play.google.com/apps/testing/com.microsoft.rdc.androidx). You'll need to give consent to access preview versions and download the client. You'll receive preview versions directly through the Google Play Store.

## Provide feedback

If you want to provide feedback to us on the Remote Desktop client for Android and Chrome OS, you can do so in the app:

1. Open the **RD Client** app on your device.

1. In the top left-hand corner, tap the menu icon (three horizontal lines), then tap **General**.

1. Tap **Submit feedback**, which will open the feedback page in your browser.

## Next steps

If you're having trouble with the Remote Desktop client, see [Troubleshoot the Remote Desktop client](../troubleshoot-client-android-chrome-os.md).
