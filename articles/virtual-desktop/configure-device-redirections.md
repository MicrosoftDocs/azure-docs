---
title: Configure device redirection - Azure
description: How to configure device redirection for Azure Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 03/06/2023
ms.author: helohr
manager: femila
---
# Configure device redirection

Configuring device redirection for your Azure Virtual Desktop environment allows you to use printers, USB devices, microphones, and other peripheral devices in the remote session. Some device redirections require changes to both Remote Desktop Protocol (RDP) properties and Group Policy settings.

## Supported device redirection

Each client supports different kinds of device redirections. Check out [Compare the clients](compare-remote-desktop-clients.md) for the full list of supported device redirections for each client.

>[!IMPORTANT]
>You can only enable redirections with binary settings that apply to both to and from the remote machine.

## Customizing RDP properties for a host pool

To learn more about customizing RDP properties for a host pool using PowerShell or the Azure portal, check out [RDP properties](customize-rdp-properties.md). For the full list of supported RDP properties, see [Supported RDP file settings](rdp-properties.md).

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
>To redirect a mass storage USB device connected to your local computer to a remote session host that uses a supported operating system for Azure Virtual Desktop, you'll need to configure the **Drive/storage redirection** RDP property. Enabling the **USB redirection** RDP property by itself won't work.

To configure the property, open the Azure portal and set the following RDP property to enable USB device redirection:

- `usbdevicestoredirect:s:*` enables USB device redirection for all supported devices on the client.
- `usbdevicestoredirect:s:` disables USB device redirection.

For more information, see [Local drive redirection](#local-drive-redirection).

In order to use USB redirection, you'll need to enable Plug and Play device redirection on your session host first. To enable Plug and Play:

1. Next, decide whether you want to configure Group Policy centrally from your domain or locally for each session host:

   - To configure it from an Active Directory (AD) Domain, open the Group Policy Management Console (GPMC) and create or edit a policy that targets your session hosts.
   - To configure it locally, open the Local Group Policy Editor on the session host.

1. Go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and resource redirection**.
1. Select **Do not allow supported Plug and Play device redirection** and set it to **Disabled**.
1. Restart your VM.

After that, to enable USB redirection:

1. For client devices, apply the following Group Policy setting. You can apply this policy centrally for devices joined to an Active Directory domain or [managed by Intune](/mem/intune/configuration/administrative-templates-windows), or locally on the device using the Local Group Policy editor:
   
    **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Connection Client** > **RemoteFX USB Device Redirection**.

1. Select **Allows RDP redirection of other supported RemoteFX USB devices from this computer**.
1. Select the **Enabled** option, and then select the **Administrators and Users in RemoteFX USB Redirection Access Rights** box.
1. Select **OK**.
1. Open an elevated Command Prompt and run the following command: 
    
    ```cmd
    gpupdate /force
    ```

1. Restart the local device.

>[!NOTE]
>If the USB device you're looking for isn't appearing, check out our troubleshooting article at [Some USB devices are not available through RemoteFX USB redirection](/troubleshoot/windows-client/remote/usb-devices-unavailable-remotefx-usb-redirection).

Next, make sure the USB device you're trying to connect to is compatible with Azure Virtual Desktop. To check compatibility:

1. Connect the USB device to your local machine.
1. Run **mstsc.exe** to open the Remote Desktop client.
    
    >[!NOTE]
    >Although you can use mstc.exe to confirm the device supports redirection, you can't use the program to connect to Azure Virtual Desktop.

1. Select **Show Options**.
1. Select the **Local Resources** tab.
1. Under **Local devices and resources**, select **More**.
1. If your device is compatible, it should appear under **Other supported Remote FX USB devices**. You can only use USB redirection on USB devices that appear in this list.

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

## Disable drive redirection

If you're making RDP connections from personal resources to corporate ones on the Terminal Server or Windows Desktop clients, you can disable drive redirection for security purposes. To disable drive redirection:

1. Open the **Registry Editor (regedit)**.

2. Go to **HKEY_LOCAL_MACHINE** > **SOFTWARE** > **Microsoft** > **Terminal Server Client**.

3. Create the following registry key:

   - **Key**: HKLM\\Software\\Microsoft\\Terminal Server Client
   - **Type**: REG_DWORD
   - **Name**: DisableDriveRedirection

4. Set the value of the registry key to **0**.

## Disable printer redirection

If you're making RDP connections from personal resources to corporate ones on the Terminal Server or Windows Desktop clients, you can disable printer redirection for security purposes. To disable printer redirection:

1. Open the **Registry Editor (regedit)**.

1. Go to **HKEY_LOCAL_MACHINE** > **SOFTWARE** > **Microsoft** > **Terminal Server Client**.

1. Create the following registry key:

   - **Key**: HKLM\\Software\\Microsoft\\Terminal Server Client
   - **Type**: REG_DWORD
   - **Name**: DisablePrinterRedirection

1. Set the value of the registry key to **0**.

## Disable clipboard redirection

If you're making RDP connections from personal resources to corporate ones on the Terminal Server or Windows Desktop clients, you can disable clipboard redirection for security purposes. To disable clipboard redirection:

1. Open the **Registry Editor (regedit)**.

1. Go to **HKEY_LOCAL_MACHINE** > **SOFTWARE** > **Microsoft** > **Terminal Server Client**.

1. Create the following registry key:

   - **Key**: HKLM\\Software\\Microsoft\\Terminal Server Client
   - **Type**: REG_DWORD
   - **Name**: DisableClipboardRedirection

1. Set the value of the registry key to **0**.

## Next steps

- For more information about how to configure RDP settings, see [Customize RDP properties](customize-rdp-properties.md).
- For a list of RDP settings you can change, see [Supported RDP properties for Azure Virtual Desktop](rdp-properties.md).
