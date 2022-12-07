---
title: Limit the port range when using RDP Shortpath for public networks - Azure Virtual Desktop
description: Learn how to limit the port range used by clients when using RDP Shortpath for public networks for Azure Virtual Desktop, which establishes a UDP-based transport between a Remote Desktop client and session host.
author: dknappettmsft
ms.topic: how-to
ms.date: 09/06/2022
ms.author: daknappe
---
# Limit the port range when using RDP Shortpath for public networks

By default, RDP Shortpath for public networks uses an ephemeral port range of 49152 to 65535 to establish a direct path between server and client. However, you may want to configure your session hosts to use a smaller, predictable port range.

You can set a smaller default range of ports 38300 to 39299, or you can specify your own port range to use. When enabled on your session hosts, the Remote Desktop client will randomly select the port from the range you specify for every connection. If this range is exhausted, clients will fall back to using the default port range (49152-65535).

When choosing the base and pool size, consider the number of ports you choose. The range must be between 1024 and 49151, after which the ephemeral port range begins.

## Prerequisites

- A client device running the [Remote Desktop client for Windows](users/connect-windows.md), version 1.2.3488 or later. Currently, non-Windows clients aren't supported.
- Internet access for both clients and session hosts. Session hosts require outbound UDP connectivity from your session hosts to the internet. For more information you can use to configure firewalls and Network Security Group, see [Network configurations for RDP Shortpath](rdp-shortpath.md#network-configuration). 

## Enable a limited port range

1. To enable a limited port range when using RDP Shortpath for public networks, open PowerShell as an administrator on your session hosts and run the following command to add the required registry value. This will change the default port range to the smaller default range of ports 38300 to 39299.

   ```powershell
   New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server" -Name ICEEnableClientPortRange -PropertyType DWORD -Value 1
   ```

2. Once you have enabled a limited port range to be set, you can further specify the port range to use. Open PowerShell as an administrator on your session hosts and run the following commands, where the value for `ICEClientPortBase` is the start of the range, and `ICEClientPortRange` is the number of ports to use from the start of the range. For example, if you select 25000 as a port base and 1000 as pool size, the upper bound will be 25999.

   ```powershell
   New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" -Name ICEClientPortBase -PropertyType DWORD -Value 25000
   New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" -Name ICEClientPortRange -PropertyType DWORD -Value 1000
   ```
