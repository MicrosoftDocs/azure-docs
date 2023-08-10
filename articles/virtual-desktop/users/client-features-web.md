---
title: Use features of the Remote Desktop Web client - Azure Virtual Desktop
description: Learn how to use features of the Remote Desktop Web client when connecting to Azure Virtual Desktop.
author: dknappettmsft
ms.topic: how-to
ms.date: 01/25/2023
ms.author: daknappe
---

# Use features of the Remote Desktop Web client when connecting to Azure Virtual Desktop

Once you've connected to Azure Virtual Desktop using the Remote Desktop client, it's important to know how to use the features. This article shows you how to use the features available in the Remote Desktop Web client. If you want to learn how to connect to Azure Virtual Desktop, see [Connect to Azure Virtual Desktop with the Remote Desktop Web client](connect-web.md).

You can find a list of all the Remote Desktop clients at [Remote Desktop clients overview](remote-desktop-clients-overview.md). For more information about the differences between the clients, see [Compare the Remote Desktop clients](../compare-remote-desktop-clients.md).

> [!NOTE]
> Your admin can choose to override some of these settings in Azure Virtual Desktop, such as being able to copy and paste between your local device and your remote session. If some of these settings are disabled, please contact your admin.

## Display preferences

A remote desktop will automatically fit the size of the browser window. If you resize the browser window, the remote desktop will resize with it. You can also enter fullscreen by selecting **fullscreen** (the diagonal arrows icon) on the taskbar.

If you use a high-DPI display, the Remote Desktop Web client supports using native display resolution during remote sessions. In sessions running on a high-DPI display, native resolution can provide higher-fidelity graphics and improved text clarity.

> [!NOTE]
> Enabling native display resolution with a high-DPI display may cause increased CPU or network usage.

Native resolution is set to off by default. To turn on native resolution:

1. Sign in to the Remote Desktop Web client, then select **Settings** on the taskbar.

1. Set **Enable native display resolution** to **On**.

### Preview user interface (preview)

A new user interface is available in preview for you to try. To enable the new user interface:

1. Sign in to the Remote Desktop Web client.

1. Toggle **Try the new client (Preview)** to **On**. To revert to the original user interface, toggle this to **Off**.

### Grid view and list view (preview)

You can change the view of remote resources assigned to you between grid view (default) and list view. To change between grid view and list view:

1. Sign in to the Remote Desktop Web client and make sure you have toggled **Try the new client (Preview)** to **On**.

1. In the top-right hand corner, select **Grid View** icon or the **List View** icon. The change will take effect immediately.

### Light mode and dark mode (preview)

You can change between light mode (default) and dark mode. To change between light mode and dark mode:

1. Sign in to the Remote Desktop Web client and make sure you have toggled **Try the new client (Preview)** to **On**, then select **Settings** on the taskbar.

1. Toggle **Dark Mode** to **On** to use dark mode, or **Off** to use light mode. The change will take effect immediately.

## Input methods

You can use a built-in or external PC keyboard, trackpad and mouse to control desktops or apps.

### Keyboard

There are several keyboard shortcuts you can use to help use some of the features. Most common Windows keyboard shortcuts, such as <kbd>CTRL</kbd>+<kbd>C</kbd> for copy and <kbd>CTRL</kbd>+<kbd>Z</kbd> for undo, are the same when using Azure Virtual Desktop. There are some keyboard shortcuts that are different so Windows knows when to use them in Azure Virtual Desktop or on your local device. These are:

| Windows shortcut | Azure Virtual Desktop shortcut | Description |
|--|--|--|
| <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>DELETE</kbd> | <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>END</kbd> (Windows)<br /><br /><kbd>FN</kbd>+<kbd>Control</kbd>+<kbd>Option</kbd>+<kbd>Delete</kbd> (macOS) | Shows the Windows Security dialog box. |
| <kbd>Windows</kbd> | <kbd>ALT</kbd>+<kbd>F3</kbd> | Sends the *Windows* key to the remote session. |
| <kbd>ALT</kbd>+<kbd>TAB</kbd> | <kbd>ALT</kbd>+<kbd>PAGE UP</kbd> | Switches between programs from left to right. |
| <kbd>ALT</kbd>+<kbd>SHIFT</kbd>+<kbd>TAB</kbd> | <kbd>ALT</kbd>+<kbd>PAGE DOWN</kbd> | Switches between programs from right to left. |

> [!NOTE]
> - You can copy and paste text only. Files can't be copied or pasted to and from the web client. Additionally, you can only use <kbd>CTRL</kbd>+<kbd>C</kbd> and <kbd>CTRL</kbd>+<kbd>V</kbd> to copy and paste text.
>
> - When you're connected to a desktop or app, you can access the resources toolbar at the top of window by using <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>HOME</kbd> on Windows, or <kbd>FN</kbd>+<kbd>Control</kbd>+<kbd>Option</kbd>+<kbd>Home</kbd> on macOS.

#### Input Method Editor

The web client supports Input Method Editor (IME) in the remote session. Before you can use the IME, you must install the language pack for the keyboard you want to use in the remote session must be installed on your session host by your admin. To learn more about setting up language packs in the remote session, see [Add language packs to a Windows 10 multi-session image](../language-packs.md).

To enable IME input using the web client:

1. Sign in to the Remote Desktop Web client, then select **Settings** on the taskbar.

1. Set **Enable Input Method Editor** to **On**.

1. In the drop-down menu, select the keyboard you want to use in a remote session.

1. Connect to a remote session.

The web client will suppress the local IME window when you're focused on the remote session. If you change the IME settings after you've already connected to the remote session, the setting changes won't have any effect.

> [!NOTE]
> The web client doesn't support IME input while using a private browsing window.
> 
> If the language pack isn't installed on the session host, the keyboard in the remote session will default to English (United States).

## Redirections

You can allow the remote computer to access to files, printers, and the clipboard on your local device. When you connect to a remote session, you'll be prompted whether you want to allow access to local resources.

### Transfer files

To transfer files between your local device and your remote session:

1. Sign in to the Remote Desktop Web client and launch a remote session.

1. For the prompt **Access local resources**, check the box for **File transfer**, then select **Allow**.

1. Once you're remote session has started, open **File Explorer**, then select **This PC**.

1. You'll see a redirected drive called **Remote Desktop Virtual Drive on RDWebClient**. Inside this drive are two folders: **Uploads** and **Downloads**

   - **Downloads** prompts your local browser to download any files you copy to this folder.
   - **Uploads** contains the files you uploaded through the Remote Desktop Web client.

1. To download from your remote session to your local device, copy and paste files to the **Downloads** folder. Before the paste can complete, the Remote Desktop Web client will prompt you **Are you sure you want to download *N* file(s)?**. Select **Confirm**. Your browser will download the files in its normal way.

   If you don't want to see this prompt every time you download files from the current browser, check the box for **Don’t ask me again on this browser** before confirming.

1. To upload files from your local device to your remote session, use the button in the Remote Desktop Web client taskbar for **Upload new file** (the upwards arrow icon). Selecting this will open a file explorer window on your local device.

   Browse to and select files you want to upload to the remote session. You can select multiple files by holding down the <kbd>CTRL</kbd> key on your keyboard for Windows, or the <kbd>Command</kbd> key for macOS, then select **Open**. There is a file size limit of 255MB.

> [!IMPORTANT]
> - We recommend using *Copy* rather than *Cut* when transferring files from your remote session to your local device as an issue with the network connection can cause the files to be lost.
>
> - Uploaded files are available in a remote session until you sign out of the Remote Desktop Web client.
>
> - Don't download files directly from your browser in a remote session to the **Remote Desktop Virtual Drive on RDWebClient\Downloads** folder as it triggers your local browser to download the file before it is ready. Download files in a remote session to a different folder, then copy and paste them to the **Remote Desktop Virtual Drive on RDWebClient\Downloads** folder.

### Clipboard

To use the clipboard between your local device and your remote session:

1. Sign in to the Remote Desktop Web client and launch a remote session.

1. For the prompt **Access local resources**, check the box for **Clipboard**, then select **Allow**.

   The Remote Desktop Web client supports copying and pasting text only. Files can't be copied or pasted to and from the web client. To transfer files, see [Transfer files](#transfer-files).

### Printer

You can enable the *Remote Desktop Virtual Printer* in your remote session. When you print to this printer, a PDF file of your print job will be generated for you to download and print on your local device. To enable the *Remote Desktop Virtual Printer*:

1. Sign in to the Remote Desktop Web client and launch a remote session.

1. For the prompt **Access local resources**, check the box for **Printer**, then select **Allow**.

1. Start the printing process as you would normally for the app you want to print from.

1. When prompted to choose a printer, select **Remote Desktop Virtual Printer**.

1. If you wish, you can set the orientation and paper size. When you're ready, select **Print**. A PDF file of your print job will be generated and your browser will download the files in its normal way. You can choose to either open the PDF and print its contents to your local printer or save it to your PC for later use.

## Launch remote session with another Remote Desktop client

If you have another Remote Desktop client installed, you can download an RDP file instead of using the browser window for a remote session. To configure the Remote Desktop Web client to download RDP files:

1. Sign in to the Remote Desktop Web client, then select **Settings** on the taskbar.

1. For **Resources Launch Method**, select **Download the RDP file**.

1. Select the resource you want to open (for example, Excel). Your browser will download the RDP in its normal way.

1. Open the downloaded RDP file in your Remote Desktop client to launch a remote session.

## Reset user settings (preview)

If you want to reset your user settings back to the default, you can do this in the web client for the current browser. To reset user settings:

1. Sign in to the Remote Desktop Web client and make sure you have toggled **Try the new client (Preview)** to **On**, then select **Settings** on the taskbar.

1. Select **Reset user settings**. You'll need to confirm that you want reset the web client settings to default.

## Provide feedback

If you want to provide feedback to us on the Remote Desktop Web client, you can do so in the Web client:

1. Sign in to the Remote Desktop Web client, then select the three dots (**...**) on the taskbar to show the menu.

1. Select **Feedback** to open the Azure Virtual Desktop Feedback page.

## Next steps

If you're having trouble with the Remote Desktop client, see [Troubleshoot the Remote Desktop client](../troubleshoot-client-web.md).
