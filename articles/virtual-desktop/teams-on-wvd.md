---
title: Microsoft Teams on Windows Virtual Desktop - Azure
description: How to use Microsoft Teams on Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 03/19/2020
ms.author: helohr
manager: lizross
---
# Use Microsoft Teams on Windows Virtual desktop

>[!IMPORTANT]
>Media optimization for Microsoft Teams is currently in public preview. We recommend evaluating the optimized Teams user experience before deploying Teams for production workloads. Certain features might not be supported or might have constrained capabilities.

>[!NOTE]
>Media optimization for Microsoft Teams is only available for the Windows Desktop client on Windows 10 endpoints. Media optimizations require Windows Desktop client version 1.2.1026.0 or later.

Microsoft Teams on Windows Virtual Desktop supports chat and collaboration, and with media optimizations, calling and meeting functionality are also supported. To learn more about using Microsoft Teams in VDI environments, check out [Teams for Virtualized Desktop Infrastructure](https://docs.microsoft.com/microsoftteams/teams-for-vdi).

## Prerequisites

Before you can use Microsoft Teams on Windows Virtual Desktop, you'll need to do these things:

- [Prepare your network](https://docs.microsoft.com/microsoftteams/prepare-network) for Microsoft Teams.
- Install the [Windows Desktop client](connect-windows-7-and-10.md) on a Windows 10 device that meets the Microsoft Teams [hardware requirements](https://docs.microsoft.com/microsoftteams/hardware-requirements-for-the-teams-app#hardware-requirements-for-teams-on-a-windows-pc).
- Connect to a Windows 10 Multi-session or Windows 10 Enterprise virtual machine (VM).

## Install the Teams desktop app

This section will show you how to install the Teams desktop app on your Windows 10 Multi-session or Windows 10 Enterprise VM image. To learn more, check out [Install or update the Teams desktop app on VDI](https://docs.microsoft.com/microsoftteams/teams-for-vdi#install-or-update-the-teams-desktop-app-on-vdi).

### Prepare your image for Teams

To enable Teams per-machine installation, set the following registry key on the host:

1. From the start menu, run **RegEdit** as an administrator. Navigate to **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Teams**.
2. Create the following value for the Teams key:

| Name             | Type   | Data/Value  |
|------------------|--------|-------------|
| IsWVDEnvironment | DWORD  | 1           |

### Install the Teams WebSocket Service

Install the [WebSocket Service](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE4vkL6) on your VM image. If you encounter an installation error, install the [latest Microsoft Visual C++ Redistributable](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads) and try again.

### Install Microsoft Teams

You can deploy the Teams desktop app using a per-machine installation. To install Microsoft Teams in your Windows Virtual Desktop environment:

1. Download the [Teams MSI package](https://docs.microsoft.com/microsoftteams/teams-for-vdi#deploy-the-teams-desktop-app-to-the-vm) that matches your environment. We recommend using the 64-bit installer on a 64-bit operating system.
2. Run this command to install the MSI to the host VM.

      ```console
      msiexec /i <path_to_msi> /l*v <install_logfile_name> ALLUSER=1 ALLUSERS=1
      ```

      This installs Teams to the Program Files (x86) folder on a 64-bit operating system and to the Program Files folder on a 32-bit operating system. At this point, the golden image setup is complete. Installing Teams per-machine is required for non-persistent setups.

      The next interactive logon session starts Teams and asks for credentials.

      > [!NOTE]
      > Users and admins can't disable automatic launch for Teams during sign-in at this time.

      To uninstall the MSI from the host VM, run this command:

      ```shell
      msiexec /passive /x <msi_name> /l*v <uninstall_logfile_name>
      ```

      This uninstalls Teams from the Program Files (x86) folder or Program Files folder, depending on the operating system environment.

      > [!NOTE]
      > When you install Teams with the MSI setting ALLUSER=1, automatic updates will be disabled. We recommend you make sure to update Teams at least once a month. To learn more about deploying the Teams desktop app, check out [Deploy the Teams desktop app to the VM](https://docs.microsoft.com/microsoftteams/teams-for-vdi#deploy-the-teams-desktop-app-to-the-vm).

### Revert to unoptimized teams

To revert to unoptimized Teams in your Windows Virtual Desktop environment, uninstall the Teams WebSocket Service.

## Known issues and limitations

Using Teams in a virtualized environment is different from using Teams in a non-virtualized environment. For more information about the limitations of Teams in virtualized environments, check out [Teams for Virtualized Desktop Infrastructure](https://docs.microsoft.com/microsoftteams/teams-for-vdi#known-issues-and-limitations). There are also several known limitations and user experience differences when using Teams on Windows Virtual Desktop.

### Client deployment, installation, and setup

- With per-machine installation, Teams on VDI isn't automatically updated in the way that non-VDI Teams clients are. You have to update the VM image by installing a new MSI as described in this article.
- Teams shows UTC time zone in chat, channels and calendar. A fix for this issue is coming soon.
- Media optimization for Teams is only supported for the Windows Desktop client on Windows 10 endpoints.
- Use of explicit HTTP proxies defined on an endpoint is not supported.

### Calling and meetings

- The Teams desktop app in Windows Virtual Desktop environments does not support live events. A fix for this issue is coming soon. In the meantime, join live events from the [Teams web client](https://teams.microsoft.com).
- Minimizing the Teams app during a call or meeting may result in the incoming video feed disappearing when the app is expanded.
- Application sharing is not supported in calls or meetings. Desktop sharing is supported in desktop sessions.
- When desktop sharing in a multi-monitor setup, all monitors are shared.
- Give control and take control are not supported.
- Only one video stream from an incoming camera or screen share stream is supported. When there's an incoming screen share, that screen share is shown it instead of the video of the dominant speaker.
- Incoming and outgoing video stream resolution is limited to 720p resolution. This is a WebRTC limitation.
- HID buttons and LED controls between the Teams app and devices are not supported.

For Teams known issues that aren't related to virtualized environments, see [Support Teams in your organization](https://docs.microsoft.com/microsoftteams/known-issues)

## Contact Microsoft Teams support

For issues with Microsoft Teams, check out the [Microsoft 365 admin center](https://docs.microsoft.com/microsoft-365/admin/contact-support-for-business-products?view=o365-worldwide&tabs=online).

## Customize Remote Desktop Protocol properties for a host pool
Customizing a host pool's Remote Desktop Protocol (RDP) properties, such as multi-monitor experience, enabling Microphone and audio redirection, lets you deliver an optimal experience for your users based on their needs. You can customize RDP properties in Windows Virtual Desktop using the **-CustomRdpProperty** parameter in the **Set-RdsHostPool** cmdlet.
See [supported RDP file settings](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/clients/rdp-files?context=/azure/virtual-desktop/context/context) for a full list of supported properties and their default values.
