---
title: Configure device redirections - Azure
description: How to configure device redirections for Windows Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 09/30/2020
ms.author: helohr
manager: lizross
---
# Configure device redirections

Configuring device redirections for your Windows Virtual Desktop environment allows you to use printers, USB devices, microphones and other peripheral devices in the remote session. Some device redirections require changes to both Remote Desktop Protocol (RDP) properties and Group Policy settings.

## Supported device redirections

Each client supports different device redirections. Check out [Compare the clients](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/clients/remote-desktop-app-compare) for the full list of supported device redirections for each client.

## Customizing RDP properties for a host pool

To learn more about customizing RDP properties for a host pool using PowerShell or the Azure Portal, check out [RDP properties](customize-rdp-properties.md). For the full list of supported RDP properties, see [Supported RDP file settings](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/clients/rdp-files?context=/azure/virtual-desktop/context/context).

## Setup device redirections

You can use the following RDP properties and Group Policy settings to enable device redirections.

### Audio input redirection

Set the following RDP property to enable audio input (microphone) redirection:

- `audiocapturemode:i:1` enables audio input redirection.
- `audiocapturemode:i:0` disables audio input redirection.

### Audio output redirection

Set the following RDP property to enable audio output (speaker) redirection:

- `audiomode:i:0` enable audio output redirection.
- `audiomode:i:0` enable audio output redirection.

### Camera redirection

Set the following RDP property to enable camera redirection:

- `camerastoredirect:s:*` redirects all cameras.

You can also redirect specific cameras using a semicolon-delimited list of KSCATEGORY_VIDEO_CAMERA interfaces, such as `camerastoredirect:s:\?\usb#vid_0bda&pid_58b0&mi`.

### Clipboard redirection

Set the following RDP property to enable clipboard redirection:

- `redirectclipboard:i:1` enables clipboard redirection.
- `redirectclipboard:i:0` disables clipboard redirection.

### COM port redirections

Set the following RDP property to enable COM port redirection:

- `redirectcomports:i:1` enables COM port redirection.
- `redirectcomports:i:0` disables COM port redirection.

### USB redirection

First, set the following RDP property to enable USB device redirection:

- `usbdevicestoredirect:s:*` enables USB device redirection.

Second, set the following Group Policy on the session host:

- Navigate to **Computer Configuration** > **Policies**> **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Connection Client** > **RemoteFX USB Device Redirection**.
- Select **Allows RDP redirection of other supported RemoteFX USB devices from this computer**.
- Select the **Enabled** option, and then select the **Administrators and Users in RemoteFX USB Redirection Access Rights** box.
- Select **OK**.

### Local drive redirection

Set the following RDP property to enable local drive redirection:

- `drivestoredirect:s:*` enables redirection of all disk drives.

You can also select specific drives using a semicolon-delimited list, such as `drivestoredirect:s:C:;E:;`.

### Printer redirection

- `redirectprinters:i:1` enables printer redirection.
- `redirectprinters:i:0` disables printer redirection.

### Smart card redirection

Set the following RDP property to enable smart card redirection:

- `redirectsmartcards:i:1` enables smart card redirection.
- `redirectsmartcards:i:0` disables smart card redirection.
