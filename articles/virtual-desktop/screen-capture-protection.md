---
title: Screen capture protection in Azure Virtual Desktop
titleSuffix: Azure
description: Learn how to enable screen capture protection in Azure Virtual Desktop (preview) to help prevent sensitive information from being captured on client endpoints.
author: femila
ms.topic: how-to
ms.date: 01/27/2023
ms.author: femila
---

# Screen capture protection in Azure Virtual Desktop

Screen capture protection, alongside [watermarking](watermarking.md), helps prevent sensitive information from being captured on client endpoints. When you enable screen capture protection, remote content will be automatically blocked or hidden in screenshots and screen sharing. Also, the Remote Desktop client will hide content from malicious software that may be capturing the screen.

In Windows 11, version 22H2 or later, you can enable screen capture protection on session host VMs as well as remote clients. Protection on session host VMs works just like protection for remote clients.

## Prerequisites

Screen capture protection is configured on the session host level and enforced on the client. Only clients that support this feature can connect to the remote session.

You must connect to Azure Virtual Desktop with one of the following clients to use support screen capture protection:

- The Remote Desktop client for Windows and the Azure Virtual Desktop Store app support screen capture protection for full desktops. You can also use them with RemoteApps when using the client on Windows 11, version 22H2 or later.
- The Remote Desktop client for macOS (version 10.7.0 or later) supports screen capture protection for both RemoteApps and full desktops.

## Configure screen capture protection

To configure screen capture protection:

1. Download the [Azure Virtual Desktop policy templates file](https://aka.ms/avdgpo) (*AVDGPTemplate.cab*). You can use File Explorer to open *AVDGPTemplate.cab*, then extract the zip archive inside the *AVDGPTemplate.cab* file to a temporary location.
2. Copy the **terminalserver-avd.admx** file to the **%windir%\PolicyDefinitions** folder.
3. Copy the **en-us\terminalserver-avd.adml** file to the **%windir%\PolicyDefinitions\en-us** folder.
4. To confirm the files copied correctly, open the Group Policy Editor and go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**. You should see one or more Azure Virtual Desktop policies, as shown in the following screenshot.

   :::image type="content" source="media/administrative-template/azure-virtual-desktop-gpo.png" alt-text="Screenshot of the group policy editor." lightbox="media/administrative-template/azure-virtual-desktop-gpo.png":::

   > [!TIP]
   > You can also install administrative templates to the group policy Central Store in your Active Directory domain.
   > For more information, see [How to create and manage the Central Store for Group Policy Administrative Templates in Windows](/troubleshoot/windows-client/group-policy/create-and-manage-central-store).

5. Open the **"Enable screen capture protection"** policy and set it to **"Enabled"**. 
6. To configure screen capture for client and server, set the **"Enable screen capture protection"** policy to **"Block Screen capture on client and server"**. By default, the policy will be set to **"Block Screen capture on client"**. 

   >[!NOTE]
   >You can only use screen capture protection on session host VMs that use Windows 11, version 22H2 or later.

## Limitations and known issues

- If a user tries to connect to a capture-protected session host with an unsupported client, the connection won't work and will instead show an error message with the code `0x1151`.
- This feature protects the Remote Desktop window from being captured through a specific set of public operating system features and Application Programming Interfaces (APIs). However, there's no guarantee that this feature will strictly protect content in scenarios where a user were to take a photo of their screen with a physical camera.
- For maximum security, customers should use this feature while also disabling clipboard, drive, and printer redirection. Disabling redirection prevents users from copying any captured screen content from the remote session.
- Users can't share their Remote Desktop window using local collaboration software, such as Microsoft Teams, while this feature is enabled. When they use Microsoft Teams, neither the local Teams app nor Teams with media optimization can share protected content.

## Next steps

Learn about how to secure your Azure Virtual Desktop deployment at [Security best practices](security-guide.md).
