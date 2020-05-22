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
>Media optimization for Microsoft Teams is currently in public preview. We recommend evaluating the optimized Teams user experience before deploying Teams for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Known limitations](link).

>[!NOTE]
>Media optimization for Microsoft Teams is only available for the Windows Desktop client on Windows 10 endpoints.

Microsoft Teams on Windows Virtual Desktop supports chat and collaboration, and with media optimizations, calling and meeting functionality are also supported. To learn more about using Microsoft Teams in VDI environments, check out [Teams for Virtualized Desktop Infrastructure](https://docs.microsoft.com/microsoftteams/teams-for-vdi).

## Prerequisites

Before you can use Microsoft Teams on Windows Virtual Desktop, you'll need to do these things:

- [Prepare your network](https://docs.microsoft.com/microsoftteams/prepare-network) for Microsoft Teams.
- Install [Windows Desktop client](connect-windows-7-and-10.md) on a Windows 10 device that meets the Microsoft Teams [hardware requirements](https://docs.microsoft.com/microsoftteams/hardware-requirements-for-the-teams-app#hardware-requirements-for-teams-on-a-windows-pc).
- Connect to a Windows 10 Multi-session or Windows 10 Enterprise virtual machine (VM).

## Install the Teams desktop app

This section will show you how to install the Teams desktop app on your Windows 10 Multi-session or Windows 10 Enterprise VM image. To learn more, check out [Teams on VDI performance consideration](https://docs.microsoft.com/microsoftteams/teams-for-vdi#teams-on-vdi-performance-considerations).

### Prepare your image for Teams

To enable Teams per-machine installation, set the following registry key on the host:

```shell
  [HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Teams\IsWVDEnvironment]
  Type: REG_DWORD
  Value: 1
```

### Install the Teams WebSocket Service

Install the [WebSocket Service](link) on your VM image. If you encounter an installation error, install the [latest Microsoft Visual C++ Redistributable](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads) and try again.

### Install Microsoft Teams

You can deploy the Teams desktop app using a per-machine installation. To install Microsoft Teams in your Windows Virtual Desktop environment:

1. Download the [Teams MSI package](https://docs.microsoft.com/microsoftteams/teams-for-vdi#deploy-the-teams-desktop-app-to-the-vm) that matches your environment. We recommend using the 64-bit installer on a 64-bit operating system.
2. Run this command to install the MSI to the host VM.

      ```shell
      msiexec /i <msi_name> /l*v < install_logfile_name> ALLUSER=1
      ```

      This will install Teams to either Program Files or Program Files (x86). The next time you sign in and start Teams, the app will ask for your credentials.

      > [!NOTE]
      > Users and admins can't disable automatic launch for Teams during sign-in at this time.

      To uninstall the MSI from the host VM, run this command:

      ```shell
      msiexec /passive /x <msi_name> /l*v <uninstall_logfile_name>
      ```

      > [!NOTE]
      > If you install Teams with the MSI setting ALLUSER=1, automatic updates will be disabled. We recommend you make sure to update Teams at least once a month. To learn more about deploying the Teams desktop app, check out [Deploy the Teams desktop app to the VM](https://docs.microsoft.com/microsoftteams/teams-for-vdi#deploy-the-teams-desktop-app-to-the-vm).

## Customize Remote Desktop Protocol properties for a host pool
Customizing a host pool's Remote Desktop Protocol (RDP) properties, such as multi-monitor experience, enabling Microphone and audio redirection, lets you deliver an optimal experience for your users based on their needs. You can customize RDP properties in Windows Virtual Desktop using the **-CustomRdpProperty** parameter in the **Set-RdsHostPool** cmdlet.
See [supported RDP file settings](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/clients/rdp-files?context=/azure/virtual-desktop/context/context) for a full list of supported properties and their default values.
