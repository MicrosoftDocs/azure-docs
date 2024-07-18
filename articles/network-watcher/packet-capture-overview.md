---
title: Packet capture overview
titleSuffix: Azure Network Watcher
description: Learn about Azure Network Watcher packet capture tool, supported resources, available configurations, limits, and considerations.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: concept-article
ms.date: 02/23/2024

#CustomerIntent: As an administrator, I want to learn about Azure Network Watcher packet capture tool so that I can use it to capture IP packets to and from virtual machines (VMs) and scale sets to diagnose and solve network problems.
---

# Packet capture overview

Azure Network Watcher packet capture allows you to create packet capture sessions to track traffic to and from a virtual machine (VM) or a scale set. Packet capture helps to diagnose network anomalies both reactively and proactively. Other uses include gathering network statistics, gaining information on network intrusions, debugging client-server communications and more.

Packet capture is an extension that is remotely started through Network Watcher. This capability saves time and eases the burden of running a packet capture manually on the desired virtual machine or virtual machine scale set instances.

You can trigger packet captures through the portal, PowerShell, Azure CLI, or REST API. You can also use virtual machine alerts to trigger packet captures. You can choose to save captured data in the local disk or in Azure storage blob.

> [!IMPORTANT]
> Packet capture requires the Network Watcher agent VM extension `AzureNetworkWatcherExtension`. For more information, see:
> - [Network Watcher Agent VM extension for Windows](../virtual-machines/extensions/network-watcher-windows.md?toc=/azure/network-watcher/toc.json).
> - [Network Watcher Agent VM extension for Linux](../virtual-machines/extensions/network-watcher-linux.md?toc=/azure/network-watcher/toc.json).
> - [Update Network Watcher extension to the latest version](../virtual-machines/extensions/network-watcher-update.md?toc=/azure/network-watcher/toc.json).

## Capture configuration

To control the size of captured data, use the following options:

| Property | Description |
| -------- | ----------- |
| **Maximum bytes per packet (bytes)** | The number of bytes from each packet. All bytes are captured if left blank. Enter 34 if you only need to capture IPv4 header. |
| **Maximum bytes per session (bytes)** | Total number of bytes that are captured, once the value is reached the session ends. |
| **Time limit (seconds)** | Packet capture session time limit, once the value is reached the session ends. The default value is 18000 seconds (5 hours). |

## Filtering (optional)

Use filters to capture only the traffic that you want to monitor. Filters are based on 5-tuple (protocol, local IP address, remote IP address, local port, and remote port) information:

| Property | Description |
| -------- | ----------- |
| **Protocol** | The protocol to filter for the packet capture. The available values are TCP, UDP, and All. |
| **Local IP address** | This value filters the packet capture to packets where the local IP address matches this filter value. |
| **Local port** | This value filters the packet capture to packets where the local port matches this filter value. |
| **Remote IP address** | This value filters the packet capture to packets where the remote IP matches this filter value. |
| **Remote port** | This value filters the packet capture to packets where the remote port matches this filter value. |

## Considerations

There's a limit of 10,000 parallel packet capture sessions per region per subscription. This limit applies only to the sessions and doesn't apply to the saved packet capture files either locally on the VM or in a storage account. See the [Network Watcher service limits page](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-network-watcher-limits) for a full list of limits. 

## Related content

- To learn how to manage packet captures in virtual machines, see [the Azure portal](packet-capture-vm-portal.md), [PowerShell](packet-capture-vm-powershell.md), or [the Azure CLI](packet-capture-vm-cli.md) guides.
- To learn how to manage packet captures in scale sets, see [the Azure portal](network-watcher-packet-capture-manage-portal-vmss.md) or [PowerShell](network-watcher-packet-capture-manage-powershell-vmss.md) guides.
- To learn how to create proactive packet captures based on virtual machine alerts, see [Create an alert triggered packet capture](network-watcher-alert-triggered-packet-capture.md).
