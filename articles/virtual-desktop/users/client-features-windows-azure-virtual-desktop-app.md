---
title: Use features of the Azure Virtual Desktop Store app for Windows (preview) - Azure Virtual Desktop
description: Learn how to use features of the Azure Virtual Desktop Store app for Windows (preview) when connecting to Azure Virtual Desktop.
author: dknappettmsft
ms.topic: how-to
ms.date: 10/04/2022
ms.author: daknappe
---

# Use features of the Azure Virtual Desktop Store app for Windows (preview)

> [!IMPORTANT]
> The Azure Virtual Desktop Store app for Windows is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Once you've connected to Azure Virtual Desktop using the Azure Virtual Desktop Store app for Windows (preview), it's important to know how to use the features. This article shows you how to use the features available in the Azure Virtual Desktop Store app for Windows. If you want to learn how to connect to Azure Virtual Desktop, see [Connect to Azure Virtual Desktop with the Azure Virtual Desktop Store app for Windows](connect-windows-azure-virtual-desktop-app.md).

You can find a list of all the Remote Desktop clients at [Remote Desktop clients overview](remote-desktop-clients-overview.md). For more information about the differences between the clients, see [Compare the Remote Desktop clients](../compare-remote-desktop-clients.md).

> [!NOTE]
> Your admin can choose to override some of these settings in Azure Virtual Desktop, such as being able to copy and paste between your local device and your remote session. If some of these settings are disabled, please contact your admin.

## Refresh or unsubscribe from a workspace or see its details

To refresh or unsubscribe from a workspace or see its details:

1. Open the **Azure Virtual Desktop** app on your device.

1. Select the three dots to the right-hand side of the name of a workspace where you'll see a menu with options for **Details**, **Refresh**, and **Unsubscribe**.

   - **Details** shows you details about the workspace, such as:
     - The name of the workspace.
     - The URL and username used to subscribe.
     - The number of desktops and apps.
     - The date and time of the last refresh.
     - The status of the last refresh.
   - **Refresh** makes sure you have the latest desktops and apps and their settings provided by your admin.
   - **Unsubscribe** removes the workspace from the Azure Virtual Desktop app.

## Pin desktops and applications to the Start Menu

You can pin your Azure Virtual Desktop desktops and applications to the Start Menu on your local device to make them easier to find and launch:

1. Open the **Azure Virtual Desktop** app on your device.

1. Right-click on a desktop or application, select **Pin to Start Menu**, then confirm the prompt.

## User accounts

### Manage user accounts

You can save a user account and associate it with workspaces to simplify the connection sequence, as the sign-in credentials will be used automatically. You can also edit a saved account or remove accounts you no longer want to use.

User accounts are stored and managed in *Credential Manager* in Windows as a *generic credential*.

To save a user account:

1. Open the **Azure Virtual Desktop** app on your device.

1. Double-click one of the icons to launch a session to Azure Virtual Desktop. If you're prompted to enter the password for your user account again, enter the password and check the box **Remember me**, then select **OK**.

To edit or remove a saved user account:

1. Open **Credential Manager** from the Control Panel. You can also open Credential Manager by searching the Start menu.

1. Select **Windows Credentials**.

1. Under **Generic Credentials**, find your saved user account and expand its details. It will begin with **RDPClient**.

1. To edit the user account, select **Edit**. You can update the username and password. Once you're done, select **Save**.

1. To remove the user account, select **Remove** and confirm that you want to delete it.

## Display preferences

### Display settings for each remote desktop

If you want to use different display settings to those specified by your admin, you can configure custom settings.

1. Open the **Azure Virtual Desktop** app on your device.

1. Right-click the name of a desktop or app, for example **SessionDesktop**, then select **Settings**.

1. Toggle **Use default settings** to off.

1. On the **Display** tab, you can select from the following options:

   | Display configuration | Description |
   |--|--|
   | All displays | Automatically use all displays for the desktop. If you have multiple displays, all of them will be used. <br /><br />For information on limits, see [Compare the features of the Remote Desktop clients](../compare-remote-desktop-clients.md).|
   | Single display | Only a single display will be used for the remote desktop. |
   | Select displays | Only select displays will be used for the remote desktop. |

   Each display configuration in the table above has its own settings. Use the following table to understand each setting:

   | Setting | Display configurations | Description |
   |--|--|--|
   | Single display when in windowed mode | All displays<br />Select displays | Only use a single display when running in windows mode, rather than full screen. |
   | Start in full screen | Single display | The desktop will be displayed full screen. |
   | Fit session to window | All displays<br />Single display<br />Select displays | When you resize the window, the scaling of the desktop will automatically adjust to fit the new window size. The resolution will stay the same. |
   | Update the resolution on resize | Single display | When you resize the window, the resolution of the desktop will automatically change to match.<br /><br />If this is disabled, a new option for **Resolution** is displayed where you can select from a pre-defined list of resolutions.  |
   | Choose which display to use for this session | Select displays | Select which displays you want to use. All selected displays must be next to each other. |
   | Maximize to current displays | Select displays | The remote desktop will show full screen on the current display(s) the window is on, even if this isn't the display selected in the settings. If this is off, the remote desktop will show full screen the same display(s) regardless of the current display the window is on. If your window overlaps multiple displays, those displays will be used when maximizing the remote desktop. |

## Input methods

You can use touch input, or a built-in or external PC keyboard, trackpad and mouse to control desktops or apps.

### Use touch gestures and mouse modes in a remote session

You can use touch gestures to replicate mouse actions in your remote session. If you connect to Windows 10 or later with Azure Virtual Desktop, native Windows touch and multi-touch gestures are supported.

The following table shows which mouse operations map to which gestures:

| Mouse operation      | Gesture                                                               |
|:---------------------|:----------------------------------------------------------------------|
| Left-click           | Tap with one finger                                                   |
| Right-click          | Tap and hold with one finger                                          |
| Left-click and drag  | Double-tap and hold with one finger, then drag                        |
| Right-click          | Tap with two fingers                                                  |
| Right-click and drag | Double-tap and hold with two fingers, then drag                       |
| Mouse wheel          | Tap and hold with two fingers, then drag up or down                   |
| Zoom                 | With two fingers, pinch to zoom out and move fingers apart to zoom in |

### Keyboard

There are several keyboard shortcuts you can use to help use some of the features. Some of these are for controlling how the Azure Virtual Desktop Store app displays the session. These are:

| Key combination | Description |
|--|--|
| <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>HOME</kbd> | Activates the connection bar when in full-screen mode and the connection bar isn't pinned. |
| <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>PAUSE</kbd> | Switches the client between full-screen mode and window mode. |

Most common Windows keyboard shortcuts, such as <kbd>CTRL</kbd>+<kbd>C</kbd> for copy and <kbd>CTRL</kbd>+<kbd>Z</kbd> for undo, are the same when using Azure Virtual Desktop. When you're using a remote desktop or app in windowed mode, there are some keyboard shortcuts that are different so Windows knows when to use them in Azure Virtual Desktop or on your local device. These are:

| Windows shortcut | Azure Virtual Desktop shortcut | Description |
|--|--|--|
| <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>DELETE</kbd> | <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>END</kbd> | Shows the Windows Security dialog box. Also applicable in fullscreen mode. |
| <kbd>ALT</kbd>+<kbd>TAB</kbd> | <kbd>ALT</kbd>+<kbd>PAGE UP</kbd> | Switches between programs from left to right. |
| <kbd>ALT</kbd>+<kbd>SHIFT</kbd>+<kbd>TAB</kbd> | <kbd>ALT</kbd>+<kbd>PAGE DOWN</kbd> | Switches between programs from right to left. |
| <kbd>WINDOWS</kbd> key, or <br /><kbd>CTRL</kbd>+<kbd>ESC</kbd> | <kbd>ALT</kbd>+<kbd>HOME</kbd> | Shows the Start menu. |
| <kbd>ALT</kbd>+<kbd>SPACE BAR</kbd> | <kbd>ALT</kbd>+<kbd>DELETE</kbd> | Shows the system menu. |
| <kbd>PRINT SCREEN</kbd> | <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>+</kbd> (plus sign) | Takes a snapshot of the entire remote session, and places it in the clipboard. |
| <kbd>ALT</kbd>+<kbd>PRINT SCREEN</kbd> | <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>-</kbd> (minus sign) | Takes a snapshot of the active window in the remote session, and places it in the clipboard. |

> [!NOTE]
> Keyboard shortcuts will not work when using remote desktop or RemoteApp sessions that are nested.

### Keyboard language

By default, remote desktops and apps will use the same keyboard language, also known as *locale*, as your Windows PC. For example, if your Windows PC uses **en-GB** for *English (United Kingdom)*, that will also be used by Windows in the remote session.

You can manually set which keyboard language to use in the remote session by following the steps at [Managing display language settings in Windows](https://support.microsoft.com/windows/manage-display-language-settings-in-windows-219f28b0-9881-cd4c-75ca-dba919c52321). You might need to close and restart the application you're currently using for the keyboard changes to take effect.

## Redirections

### Folder redirection

The Azure Virtual Desktop Store app can make local folders available in your remote session. This is known as *folder redirection*. This means you can open files from and save files to your Windows PC with your remote session. Redirected folders appear as a network drive in Windows Explorer.

Folder redirection can't be configured using the Azure Virtual Desktop app. This behavior is configured by your admin in Azure Virtual Desktop. By default, all local drives are redirected to a remote session.

### Redirect devices, audio, and clipboard

The Azure Virtual Desktop Store app can make your local clipboard and local devices available in your remote session where you can copy and paste text, images, and files. The audio from the remote session can also be redirected to your local device. However, redirection can't be configured using the Azure Virtual Desktop app. This behavior is configured by your admin in Azure Virtual Desktop. Here's a list of some of the devices and resources that can be redirected. For the full list, see [Compare the features of the Remote Desktop clients when connecting to Azure Virtual Desktop](../compare-remote-desktop-clients.md?toc=%2Fazure%2Fvirtual-desktop%2Fusers%2Ftoc.json#redirections-comparison).

- Printers
- USB devices
- Audio output
- Smart cards
- Clipboard
- Microphones
- Cameras

## Update the Azure Virtual Desktop app

Updates for the Azure Virtual Desktop Store app are available in the Microsoft Store. You can also check for updates through the app directly.

To check for updates through the app:

1. Open the **Azure Virtual Desktop** app on your device.

1. Select the three dots in the top right-hand of the app to show a menu, then select **About**.

1. For the section **App Update** select each link to open the Microsoft Store where you'll be prompted to install any updates once available.

1. If there's an update to either app available, select **Update**. The apps can be updated in any order.

While installing an update, the Azure Virtual Desktop Store app may close. Once the update is complete, you can reopen the app and continue where you left off. For more information about how to get updates in the Microsoft Store, see [Get updates for apps and games in Microsoft Store](https://support.microsoft.com/account-billing/get-updates-for-apps-and-games-in-microsoft-store-a1fe19c0-532d-ec47-7035-d1c5a1dd464f) and [Turn on automatic app updates](https://support.microsoft.com/windows/turn-on-automatic-app-updates-70634d32-4657-dc76-632b-66048978e51b).

## App display modes

You can configure the Azure Virtual Desktop Store app to be displayed in light or dark mode, or match the mode of your system:

1. Open the **Azure Virtual Desktop** app on your device.

1. Select **Settings**.

1. Under **App mode**, select **Light**, **Dark**, or **Use System Mode**. The change is applied instantly.

## Views

You can view your remote desktops and apps as either a tile view (default) or list view:

1. Open the **Azure Virtual Desktop** app on your device.

1. If you want to switch to List view, select **Tile**, then select **List view**.

1. If you want to switch to Tile view, select **List**, then select **Tile view**.

## Enable Insider releases

If you want to help us test new builds of the Azure Virtual Desktop app before they're released, you should download our Insider releases. Organizations can use the Insider releases to validate new versions for their users before they're generally available.

> [!NOTE]
> Insider releases shouldn't be used in production.

Insider releases are made available in the Azure Virtual Desktop Store app once you've configured it to use Insider releases. To configure the app to use Insider releases:

1. Open the **Azure Virtual Desktop** app on your device.

1. Select the three dots in the top right-hand of the app to show a menu.

1. Select **Join the insider group**, then wait while the app is configured.

1. Restart your local device.

1. Open the **Azure Virtual Desktop** app. The title in the top left-hand corner should be **Azure Virtual Desktop (Insider)**:

   :::image type="content" source="../media/client-features-windows-azure-virtual-desktop-app/azure-virtual-desktop-app-insider.png" alt-text="A screenshot of the Azure Virtual Desktop Store app with Insider features enabled. The title is highlighted in a red box.":::

If you already have configured the Azure Virtual Desktop Store app to use Insider releases, you can check for updates to ensure you have the latest Insider release by checking for updates in the normal way. For more information, see [Update the Azure Virtual Desktop app](#update-the-azure-virtual-desktop-app).

## Admin management

### Enterprise deployment

To deploy the Azure Virtual Desktop Store app in an enterprise, you can use Microsoft Intune or Configuration Manager. For more information, see:

- [Add Microsoft Store apps to Microsoft Intune](/mem/intune/apps/store-apps-microsoft).

- [Manage apps from the Microsoft Store for Business and Education with Configuration Manager](/mem/configmgr/apps/deploy-use/manage-apps-from-the-windows-store-for-business)

### URI to subscribe to a workspace

The Azure Virtual Desktop Store app supports Uniform Resource Identifier (URI) schemes to invoke the Remote Desktop client with specific commands, parameters, and values for use with Azure Virtual Desktop. For example, you can subscribe to a workspace or connect to a particular desktop or RemoteApp.

For more information, see [Uniform Resource Identifier schemes with the Remote Desktop client for Azure Virtual Desktop](../uri-scheme.md).

## Azure Virtual Desktop (HostApp)

The Azure Virtual Desktop (HostApp) is a platform component containing a set of predefined user interfaces and APIs that Azure Virtual Desktop developers can use to deploy and manage Remote Desktop connections to their Azure Virtual Desktop resources. If this application is required on a device for another application to work correctly, it will automatically be downloaded by the Azure Virtual Desktop app. There should be no need for user interaction.

The purpose of the Azure Virtual Desktop (HostApp) is to provide core functionality to the Azure Virtual Desktop Store app in the Microsoft Store. This is known as the *Hosted App Model*. For more information, see [Hosted App Model](https://blogs.windows.com/windowsdeveloper/2020/03/19/hosted-app-model/).

## Provide feedback

If you want to provide feedback to us on the Azure Virtual Desktop app, you can do so by selecting the button that looks like a smiley face emoji in the app, as shown in the following image. This will open the **Feedback Hub**.

:::image type="content" source="../media/smiley-face-icon.png" alt-text="A screenshot highlighting the feedback button in a red box.":::

To best help you, we need you to give us as detailed information as possible. Along with a detailed description, you can include screenshots, attach a file, or make a recording. For more tips about how to provide helpful feedback, see [Feedback](/windows-insider/feedback#add-new-feedback).

## Next steps

If you're having trouble with the Azure Virtual Desktop app, see [Troubleshoot the Azure Virtual Desktop app](../troubleshoot-client-windows-azure-virtual-desktop-app.md).
