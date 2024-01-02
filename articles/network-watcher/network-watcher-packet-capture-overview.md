---
title: Packet capture overview
titleSuffix: Azure Network Watcher
description: Learn about Azure Network Watcher packet capture capability.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 03/22/2023
ms.author: halkazwini
ms.custom: template-concept, engagement-fy23
---

# Packet capture overview

Azure Network Watcher packet capture allows you to create packet capture sessions to track traffic to and from a virtual machine (VM) or a scale set. Packet capture helps to diagnose network anomalies both reactively and proactively. Other uses include gathering network statistics, gaining information on network intrusions, to debug client-server communications and much more.

Packet capture is an extension that is remotely started through Network Watcher. This capability eases the burden of running a packet capture manually on the desired virtual machine or virtual machine scale set instance(s), which saves valuable time. Packet capture can be triggered through the portal, PowerShell, Azure CLI, or REST API. One example of how packet capture can be triggered is with virtual machine alerts. Filters are provided for the capture session to ensure you capture traffic you want to monitor. Filters are based on 5-tuple (protocol, local IP address, remote IP address, local port, and remote port) information. The captured data can be stored in the local disk or a storage blob. 

> [!IMPORTANT]
> Packet capture requires a virtual machine extension `AzureNetworkWatcherExtension`.
> - To install the extension on a Windows virtual machine, see [Network Watcher Agent VM extension for Windows](../virtual-machines/extensions/network-watcher-windows.md).
> - To install the extension on a Linux virtual machine, see [Network Watcher Agent VM extension for Linux](../virtual-machines/extensions/network-watcher-linux.md).

To control the size of captured data and only capture required information, use the following options:

#### Capture configuration

|Property|Description|
|---|---|
|**Maximum bytes per packet (bytes)** | The number of bytes from each packet. All bytes are captured if left blank. Enter 34 if you only need to capture IPv4 header.|
|**Maximum bytes per session (bytes)** | Total number of bytes that are captured, once the value is reached the session ends.|
|**Time limit (seconds)** | Packet capture session time limit, once the value is reached the session ends. The default value is 18000 seconds (5 hours).|

#### Filtering (optional)

|Property|Description|
|---|---|
|**Protocol** | The protocol to filter for the packet capture. The available values are TCP, UDP, and All.|
|**Local IP address** | This value filters the packet capture to packets where the local IP address matches this filter value.|
|**Local port** | This value filters the packet capture to packets where the local port matches this filter value.|
|**Remote IP address** | This value filters the packet capture to packets where the remote IP matches this filter value.|
|**Remote port** | This value filters the packet capture to packets where the remote port matches this filter value.|


## Considerations

There's a limit of 10,000 parallel packet capture sessions per region per subscription. This limit applies only to the sessions and doesn't apply to the saved packet capture files either locally on the VM or in a storage account. See the [Network Watcher service limits page](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-network-watcher-limits) for a full list of limits. 

## Next steps

- To learn how to manage packet captures using the Azure portal, see [Manage packet captures in virtual machines using the Azure portal](network-watcher-packet-capture-manage-portal.md) and [Manage packet captures in Virtual Machine Scale Sets using the Azure portal](network-watcher-packet-capture-manage-portal-vmss.md).
- To learn how to manage packet captures using Azure PowerShell, see [Manage packet captures in virtual machines using PowerShell](network-watcher-packet-capture-manage-powershell.md) and [Manage packet captures in Virtual Machine Scale Sets using PowerShell](network-watcher-packet-capture-manage-powershell-vmss.md).
- To learn how to create proactive packet captures based on virtual machine alerts, see [Create an alert triggered packet capture](network-watcher-alert-triggered-packet-capture.md).


