---
title: Azure Virtual Desktop screen capture protection
titleSuffix: Azure
description: How to set up screen capture protection for Azure Virtual Desktop.
author: femila
ms.topic: conceptual
ms.date: 09/14/2022
ms.author: femila
ms.service: virtual-desktop
---

# Screen capture protection

The screen capture protection feature prevents sensitive information from being captured on the client endpoints. When you enable this feature, remote content will be automatically blocked or hidden in screenshots and screen shares. Also, the Remote Desktop client will hide content from malicious software that may be capturing the screen.

## Prerequisites

The screen capture protection feature is configured on the session host level and enforced on the client. Only clients that support this feature can connect to the remote session.

The following clients currently support screen capture protection:

- The Windows Desktop client supports screen capture protection for full desktops only.
- The macOS client (version 10.7.0 or later) supports screen capture protection for both RemoteApps and full desktops.

If a user tries to connect to a capture-protected session host with an unsupported client, the connection won't work and will instead show an error message labeled "0x1151."

## Configure screen capture protection

To configure screen capture protection:

1. Download the [Azure Virtual Desktop policy templates file](https://aka.ms/avdgpo) (AVDGPTemplate.cab) and extract the contents of the cab file and zip archive.
2. Copy the **terminalserver-avd.admx** file to the **%windir%\PolicyDefinitions** folder.
3. Copy the **en-us\terminalserver-avd.adml** file to the **%windir%\PolicyDefinitions\en-us** folder.
4. To confirm the files copied correctly, open the Group Policy Editor and go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**. You should see one or more Azure Virtual Desktop policies, as shown in the following screenshot.

   :::image type="content" source="media/azure-virtual-desktop-gpo.png" alt-text="Screenshot of the group policy editor" lightbox="media/azure-virtual-desktop-gpo.png":::

   > [!TIP]
   > You can also install administrative templates to the group policy Central Store in your Active Directory domain.
   > For more information, see [How to create and manage the Central Store for Group Policy Administrative Templates in Windows](/troubleshoot/windows-client/group-policy/create-and-manage-central-store).

5. Finally, open the **"Enable screen capture protection"** policy and set it to **"Enabled"**.

## Limitations and known issues

- This feature protects the Remote Desktop window from being captured through a specific set of public operating system features and Application Programming Interfaces (APIs). However, there's no guarantee that this feature will strictly protect content in scenarios where a user were to take a photo of their screen with a physical camera.
- For maximum security, customers should use this feature while also disabling clipboard, drive, and printer redirection. Disabling redirection prevents users from copying any captured screen content from the remote session.
- Users can't share their Remote Desktop window using local collaboration software, such as Microsoft Teams, while this feature is enabled. When they use Microsoft Teams, neither the local Teams app nor Teams with media optimization can share protected content.

## Next steps

Learn about how to secure your Azure Virtual Desktop deployment at [Security best practices](security-guide.md).
