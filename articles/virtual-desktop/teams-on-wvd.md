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

Virtualized environments like Windows Virtual Desktop present a unique set of challenges for collaboration apps like Microsoft Teams, including increased latency, high host CPU usage, and poor overall audio and video performance. With Windows Virtual Desktop optimizations for Microsoft Teams, we provide high-performance peer-to-peer audio-video calling based on WebRTC. To learn more about using Microsoft Teams in VDI environments, check out [Teams for Virtualized Desktop Infrastructure](https://go.microsoft.com/fwlink/?linkid=2123169&clcid=0x409).

> [!NOTE]
> Microsoft Teams audio-video calling optimizations are currently available in Private Preview and will be publicly available later this year.

## Environment requirements

To use Microsoft Teams calling on Windows Virtual Desktop:

- Use the [Windows Desktop client](connect-windows-7-and-10.md) on a Windows 10 device that meets the Microsoft Teams [hardware requirements](https://go.microsoft.com/fwlink/?linkid=2123901&clcid=0x409).
- Connect to a Windows 10 Multi-Session or Windows 10 Enterprise VM.
- [Prepare your network](https://go.microsoft.com/fwlink/?linkid=2123167&clcid=0x409) for Microsoft Teams.

## Use unoptimized Microsoft Teams

You can use unoptimized Microsoft Teams in your Windows Virtual Desktop environments to leverage the full chat and collaboration features of Microsoft Teams as well as audio calling. Audio calling performance will vary based on your host configuration as it will increase your host CPU utilization.

### Install Microsoft Teams

To install Microsoft Teams in your Windows Virtual Desktop environment:

1. Download the [Teams MSI package](https://go.microsoft.com/fwlink/?linkid=2123170&clcid=0x409) that matches your environment. We recommend using the 64-bit installer on a 64-bit operating system.
2. Install the MSI to the host VM:

```
msiexec /i <msi_name> /l*v < install_logfile_name> ALLUSER=1
```

This will install Teams to either Program Files or Program Files (x86). The next interactive logon session will start Teams and ask for credentials.

> [!NOTE]
> It is not possible for the user or administrator to disable automatic launch of Teams during sign-in to Windows.

To uninstall the MSI from the host VM:

```
msiexec /passive /x <msi_name> /l*v <uninstall_logfile_name>
```

> [!NOTE]
> If Teams is installed with the MSI setting ALLUSER=1, automatic updates are disabled.  Teams must be manually updated regularly, and it is recommended to be done at least once a month.
