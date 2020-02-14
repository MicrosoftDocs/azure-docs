---
title: Introduction to Packet capture in Azure Network Watcher | Microsoft Docs
description: This page provides an overview of the Network Watcher packet capture capability
services: network-watcher
documentationcenter: na
author: damendo
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: damendo

---

# Introduction to variable packet capture in Azure Network Watcher

Network Watcher variable packet capture allows you to create packet capture sessions to track traffic to and from a virtual machine. Packet capture helps to diagnose network anomalies both reactively and proactively. Other uses include gathering network statistics, gaining information on network intrusions, to debug client-server communications and much more.

Packet capture is a virtual machine extension that is remotely started through Network Watcher. This capability eases the burden of running a packet capture manually on the desired virtual machine, which saves valuable time. Packet capture can be triggered through the portal, PowerShell, CLI, or REST API. One example of how packet capture can be triggered is with Virtual Machine alerts. Filters are provided for the capture session to ensure you capture traffic you want to monitor. Filters are based on 5-tuple (protocol, local IP address, remote IP address, local port, and remote port) information. The captured data is stored in the local disk or a storage blob. There is a limit of 10 packet capture sessions per region per subscription. This limit applies only to the sessions and does not apply to the saved packet capture files either locally on the VM or in a storage account.

> [!IMPORTANT]
> Packet capture requires a virtual machine extension `AzureNetworkWatcherExtension`. For installing the extension on a Windows VM visit [Azure Network Watcher Agent virtual machine extension for Windows](../virtual-machines/windows/extensions-nwa.md) and for Linux VM visit [Azure Network Watcher Agent virtual machine extension for Linux](../virtual-machines/linux/extensions-nwa.md).

To reduce the information you capture to only the information you want, the following options are available for a packet capture session:

**Capture configuration**

|Property|Description|
|---|---|
|**Maximum bytes per packet (bytes)** | The number of bytes from each packet that are captured, all bytes are captured if left blank. The number of bytes from each packet that are captured, all bytes are captured if left blank. If you need only the IPv4 header – indicate 34 here |
|**Maximum bytes per session (bytes)** | Total number of bytes in that are captured, once the value is reached the session ends.|
|**Time limit (seconds)** | Sets a time constraint on the packet capture session. The default value is 18000 seconds or 5 hours.|

**Filtering (optional)**

|Property|Description|
|---|---|
|**Protocol** | The protocol to filter for the packet capture. The available values are TCP, UDP, and All.|
|**Local IP address** | This value filters the packet capture to packets where the local IP address matches this filter value.|
|**Local port** | This value filters the packet capture to packets where the local port matches this filter value.|
|**Remote IP address** | This value filters the packet capture to packets where the remote IP matches this filter value.|
|**Remote port** | This value filters the packet capture to packets where the remote port matches this filter value.|

### Next steps

Learn how you can manage packet captures through the portal by visiting [Manage packet capture in the Azure portal](network-watcher-packet-capture-manage-portal.md) or with PowerShell by visiting [Manage Packet Capture with PowerShell](network-watcher-packet-capture-manage-powershell.md).

Learn how to create proactive packet captures based on virtual machine alerts by visiting [Create an alert triggered packet capture](network-watcher-alert-triggered-packet-capture.md)

<!--Image references-->
[1]: ./media/network-watcher-packet-capture-overview/figure1.png













