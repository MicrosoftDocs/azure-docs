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

> Applies to: Windows 10, and Windows 10 IoT Enterprise

Virtualized environments present a unique set of challenges for collaboration apps like Microsoft Teams, including increased latency, high host CPU usage, and poor overall audio and video performance. To learn more about using Microsoft Teams in VDI environments, check out [Teams for Virtualized Desktop Infrastructure](https://docs.microsoft.com/microsoftteams/teams-for-vdi).

## Prerequisites

Before you can use Microsoft Teams on Windows Virtual Desktop, you'll need to do these things:

- Install [Windows Desktop client](connect-windows-7-and-10.md) on a Windows 10 device that meets the Microsoft Teams [hardware requirements](https://docs.microsoft.com/microsoftteams/hardware-requirements-for-the-teams-app).
- Connect to a Windows 10 Multi-session or Windows 10 Enterprise virtual machine (VM).
- [Prepare your network](https://docs.microsoft.com/microsoftteams/prepare-network) for Microsoft Teams.

## Use unoptimized Microsoft Teams

You can use unoptimized Microsoft Teams in your Windows Virtual Desktop environments to leverage the full chat and collaboration features of Microsoft Teams as well as audio calling. Audio quality in calls will vary based on your host configuration because unoptimized calls use more of your host CPU.

### Prepare your image for Teams

To enable Teams per-machine installation, set the following registry key on the host:

```shell
  [HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Teams\IsWVDEnvironment]
  Type: REG_DWORD
  Value: 1
```

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
      > If you install Teams with the MSI setting ALLUSER=1, automatic updates will be disabled. We recommend you make sure to update Teams at least once a month.
      
### Customize Remote Desktop Protocol properties for a host pool
Customizing a host pool's Remote Desktop Protocol (RDP) properties, such as multi-monitor experience, enabling Microphone and audio redirection, lets you deliver an optimal experience for your users based on their needs. You can customize RDP properties in Windows Virtual Desktop using the **-CustomRdpProperty** parameter in the **Set-RdsHostPool** cmdlet.
See [supported RDP file settings](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/clients/rdp-files?context=/azure/virtual-desktop/context/context) for a full list of supported properties and their default values.
