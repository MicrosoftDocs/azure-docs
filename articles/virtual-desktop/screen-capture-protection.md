---
title: Azure Virtual Desktop screen capture protection
titleSuffix: Azure
description: How to set up screen capture protection for Azure Virtual Desktop.
author: femila
ms.topic: conceptual
ms.date: 08/30/2021
ms.author: femila
ms.service: virtual-desktop
---

# Screen capture protection

The screen capture protection feature prevents sensitive information from being captured on the client endpoints. When you enable this feature, remote content will be automatically blocked or hidden in screenshots and screen shares. Also, the Remote Desktop client will hide content from malicious software that may be capturing the screen.

## Prerequisites

The screen capture protection feature is configured on the session host level and enforced on the client. Only clients that support this feature can connect to the remote session.
Following clients currently support screen capture protection:

* Windows Desktop client supports screen capture protection for full desktops only.
* macOS client version 10.7.0 or later supports screen capture protection for both RemoteApp and full desktops.

Suppose the user attempts to use an unsupported client to connect to the protected session host. In that case, the connection will fail with error 0x1151.

## Configure screen capture protection

1. To configure screen capture protection, you need to install administrative templates that add rules and settings for Azure Virtual Desktop.
2. Download the [Azure Virtual Desktop policy templates file](https://aka.ms/avdgpo) (AVDGPTemplate.cab) and extract the contents of the cab file and zip archive.
3. Copy the **terminalserver-avd.admx** file to **%windir%\PolicyDefinitions** folder.
4. Copy the **en-us\terminalserver-avd.adml** file to **%windir%\PolicyDefinitions\en-us** folder.
5. To confirm the files copied correctly, open the Group Policy Editor and navigate to **Computer Configuration** -> **Administrative Templates** -> **Windows Components** -> **Remote Desktop Services** -> **Remote Desktop Session Host** -> **Azure Virtual Desktop**
6. You should see one or more Azure Virtual Desktop policies, as shown below.

   :::image type="content" source="media/azure-virtual-desktop-gpo.png" alt-text="Screenshot of the group policy editor" lightbox="media/azure-virtual-desktop-gpo.png":::

   > [!TIP]
   > You can also install administrative templates to the group policy Central Store in your Active Directory domain.
   > For more information about Central Store for Group Policy Administrative Templates, see [How to create and manage the Central Store for Group Policy Administrative Templates in Windows](/troubleshoot/windows-client/group-policy/create-and-manage-central-store).

7. Open the **"Enable screen capture protection"** policy and set it to **"Enabled"**.

## Limitations and known issues

* This feature protects the Remote Desktop window from being captured through a specific set of public operating system features and APIs. However, there's no guarantee that this feature will strictly protect content, for example, where someone takes photography of the screen.
* Customers should use the feature together with disabling clipboard, drive, and printer redirection. Disabling redirection will help to prevent the user from copying the captured screen content from the remote session.
* Users can't share the Remote Desktop window using local collaboration software, such as Microsoft Teams, when the feature is enabled. If Microsoft Teams is used, both the local Teams app and Teams running with media optimizations can't share the protected content.

## Next steps

* To learn about Azure Virtual Desktop security best practices, see [Azure Virtual Desktop security best practices](security-guide.md).
