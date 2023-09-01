---
title: Screen capture protection in Azure Virtual Desktop
titleSuffix: Azure
description: Learn how to enable screen capture protection in Azure Virtual Desktop (preview) to help prevent sensitive information from being captured on client endpoints.
author: dknappettmsft
ms.topic: how-to
ms.date: 07/21/2023
ms.author: daknappe
---

# Enable screen capture protection in Azure Virtual Desktop

Screen capture protection, alongside [watermarking](watermarking.md), helps prevent sensitive information from being captured on client endpoints through a specific set of operating system (OS) features and Application Programming Interfaces (APIs). When you enable screen capture protection, remote content is automatically blocked in screenshots and screen sharing.

There are two supported scenarios for screen capture protection, depending on the version of Windows you're using:

- **Block screen capture on client**: the session host instructs a supported Remote Desktop client to enable screen capture protection for a remote session. This prevents screen capture from the client of applications running in the remote session.

- **Block screen capture on client and server**: the session host instructs a supported Remote Desktop client to enable screen capture protection for a remote session. This prevents screen capture from the client of applications running in the remote session, but also prevents tools and services within the session host from capturing the screen.

When screen capture protection is enabled, users can't share their Remote Desktop window using local collaboration software, such as Microsoft Teams. With Teams, neither the local Teams app or using [Teams with media optimization](teams-on-avd.md) can share protected content.

> [!TIP]
> - To increase the security of your sensitive information, you should also disable clipboard, drive, and printer redirection. Disabling redirection helps prevent users from copying content from the remote session. To learn about supported redirection values, see [Device redirection](rdp-properties.md#device-redirection).
>
> - To discourage other methods of screen capture, such as taking a photo of a screen with a physical camera, you can enable [watermarking](watermarking.md), where admins can use a QR code to trace the session.

## Prerequisites

- Your session hosts must be running one of the following versions of Windows to use screen capture protection:

   - **Block screen capture on client** is available with a [supported version of Windows 10 or Windows 11](prerequisites.md#operating-systems-and-licenses).
   - **Block screen capture on client and server** is available starting with Windows 11, version 22H2.

- Users must connect to Azure Virtual Desktop with one of the following Remote Desktop clients to use screen capture protection. If a user tries to connect with a different client or version, the connection is denied and shows an error message with the code `0x1151`.

   | Client | Client version | Desktop session | RemoteApp session | 
   |--|--|--|--|
   | Remote Desktop client for Windows | 1.2.1672 or later | Yes | Yes. Client device OS must be Windows 11, version 22H2 or later. |
   | Azure Virtual Desktop Store app | Any | Yes | Yes. Client device OS must be Windows 11, version 22H2 or later. |
   | Remote Desktop client for macOS | 10.7.0 or later | Yes | Yes |

## Enable screen capture protection

Screen capture protection is configured on session hosts and enforced by the client. You configure the settings by using Intune or Group Policy.

To configure screen capture protection:

1. Follow the steps to make the [Administrative template for Azure Virtual Desktop](administrative-template.md) available.

1. Once you've verified that the administrative template is available, open the policy setting **Enable screen capture protection** and set it to **Enabled**.

1. From the drop-down menu, select the screen capture protection scenario you want to use from **Block screen capture on client** or **Block screen capture on client and server**.

1. Apply the policy settings to your session hosts by running a Group Policy update or Intune device sync.

1. Connect to a remote session with a supported client and test screen capture protection is working by taking a screenshot or sharing your screen. The content should be blocked or hidden. Any existing sessions will need to sign out and back in again for the change to take effect.

## Next steps

Learn about how to secure your Azure Virtual Desktop deployment at [Security best practices](security-guide.md).
