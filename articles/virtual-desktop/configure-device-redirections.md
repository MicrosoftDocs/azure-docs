---
title: Configure device redirection - Azure
description: How to configure device redirection for Azure Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 08/24/2022
ms.author: helohr
manager: femila
---
# Configure device redirection

Configuring device redirection for your Azure Virtual Desktop environment allows you to use printers, USB devices, microphones, and other peripheral devices in the remote session. Some device redirections require changes to both Remote Desktop Protocol (RDP) properties and Group Policy settings.

## Supported device redirection

Each client supports different kinds of device redirections. Check out [Compare the clients](/windows-server/remote/remote-desktop-services/clients/remote-desktop-app-compare) for the full list of supported device redirections for each client.

>[!IMPORTANT]
>You can only enable redirections with binary settings that apply to both to and from the remote machine. The service doesn't currently support one-way blocking of redirections from only one side of the connection.

## Customizing RDP properties for a host pool

To learn more about customizing RDP properties for a host pool using PowerShell or the Azure portal, check out [RDP properties](customize-rdp-properties.md). For the full list of supported RDP properties, see [Supported RDP file settings](/windows-server/remote/remote-desktop-services/clients/rdp-files?context=%2fazure%2fvirtual-desktop%2fcontext%2fcontext).

## Setup device redirection

You can use the following RDP properties and Group Policy settings to configure device redirection.

### Audio input (microphone) redirection

Set the following RDP property to configure audio input redirection:

- `audiocapturemode:i:1` enables audio input redirection.
- `audiocapturemode:i:0` disables audio input redirection.

### Audio output (speaker) redirection

Set the following RDP property to configure audio output redirection:

- `audiomode:i:0` enables audio output redirection.
- `audiomode:i:1` or `audiomode:i:2` disable audio output redirection.

### Camera redirection

Set the following RDP property to configure camera redirection:

- `camerastoredirect:s:*` redirects all cameras.
- `camerastoredirect:s:` disables camera redirection.

>[!NOTE]
>Even if the `camerastoredirect:s:` property is disabled, local cameras may be redirected through the `devicestoredirect:s:` property. To fully disable camera redirection set `camerastoredirect:s:` and either set `devicestoredirect:s:` or define some subset of plug and play devices that does not include any camera.

You can also redirect specific cameras using a semicolon-delimited list of KSCATEGORY_VIDEO_CAMERA interfaces, such as `camerastoredirect:s:\?\usb#vid_0bda&pid_58b0&mi`.

### Clipboard redirection

Set the following RDP property to configure clipboard redirection:

- `redirectclipboard:i:1` enables clipboard redirection.
- `redirectclipboard:i:0` disables clipboard redirection.

### COM port redirection

Set the following RDP property to configure COM port redirection:

- `redirectcomports:i:1` enables COM port redirection.
- `redirectcomports:i:0` disables COM port redirection.

### USB redirection

>[!IMPORTANT]
>To redirect a mass storage USB device connected to your local computer to the remote session host, you'll need to configure the **Drive/storage redirection** RDP property. Enabling the **USB redirection** RDP property by itself won't work. For more information, see [Local drive redirection](#local-drive-redirection).

First, set the following RDP property to enable USB device redirection:

- `usbdevicestoredirect:s:*` enables USB device redirection.
- `usbdevicestoredirect:s:` disables USB device redirection.

Second, set the following Group Policy on the user's local device:

- Navigate to **Computer Configuration** > **Policies**> **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Connection Client** > **RemoteFX USB Device Redirection**.
- Select **Allows RDP redirection of other supported RemoteFX USB devices from this computer**.
- Select the **Enabled** option, and then select the **Administrators and Users in RemoteFX USB Redirection Access Rights** box.
- Select **OK**.

### Plug and play device redirection

Set the following RDP property to configure plug and play device redirection:

- `devicestoredirect:s:*` enables redirection of all plug and play devices.
- `devicestoredirect:s:` disables redirection of plug and play devices.

You can also select specific plug and play devices using a semicolon-delimited list, such as `devicestoredirect:s:root\*PNP0F08`.

### Local drive redirection

Set the following RDP property to configure local drive redirection:

- `drivestoredirect:s:*` enables redirection of all disk drives.
- `drivestoredirect:s:` disables local drive redirection.

You can also select specific drives using a semicolon-delimited list, such as `drivestoredirect:s:C:;E:;`.

To enable web client file transfer, set `drivestoredirect:s:*`. If you set any other value for this RDP property, web client file transfer will be disabled.

### Location redirection

Set the following RDP property to configure location redirection:

- `redirectlocation:i:1` enables location redirection.
- `redirectlocation:i:0` disables location redirection.

When enabled, the location of the local device is sent to the session host and set as its location. Location redirection lets applications like Maps or Printer Search use your physical location. When you disable location redirection, these applications will use the location of the session host instead.

### Printer redirection

Set the following RDP property to configure printer redirection:

- `redirectprinters:i:1` enables printer redirection.
- `redirectprinters:i:0` disables printer redirection.

### Smart card redirection

Set the following RDP property to configure smart card redirection:

- `redirectsmartcards:i:1` enables smart card redirection.
- `redirectsmartcards:i:0` disables smart card redirection.

### WebAuthn redirection

Set the following RDP property to configure WebAuthn redirection:

- `redirectwebauthn:i:1` enables WebAuthn redirection.
- `redirectwebauthn:i:0` disables WebAuthn redirection.

When enabled, WebAuthn requests from the session are sent to the local PC to be completed using the local Windows Hello for Business or security devices like FIDO keys. For more information, see [In-session passwordless authentication](authentication.md#in-session-passwordless-authentication-preview).