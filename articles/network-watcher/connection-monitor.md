---
title: Monitor network connections with Azure Network Watcher - Azure portal | Microsoft Docs
description: Learn how to monitor network connectivity with Azure Network Watcher using the Azure portal.
services: network-watcher
documentationcenter: na
author: jimdial
manager: jeconnoc
editor: 

ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/16/2018
ms.author: jdial
---

# Monitor network connections with Azure Network Watcher using the Azure portal

Learn how to use connection monitor to monitor network connectivity between an Azure virtual machine and an IP address. The IP address can be assigned to another Azure resource, or an Internet or on-premises resource.

## Prerequisites

You must meet the following prerequisites before completing the steps in this article:

* An instance of Network Watcher in the region you want to monitor a connection for. If you don't already have one, you can create one by completing the steps in [Create an Azure Network Watcher instance](network-watcher-create.md).
* A virtual machine to monitor from.
* Have the `AzureNetworkWatcherExtension` installed in the virtual machine you want to monitor a connection from. To install the extension in a Windows virtual machine, see [Azure Network Watcher Agent virtual machine extension for Windows](../virtual-machines/windows/extensions-nwa.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json) and to install the extension in a Linux virtual machine see [Azure Network Watcher Agent virtual machine extension for Linux](../virtual-machines/linux/extensions-nwa.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).

## Sign in to Azure 

Sign in to the [Azure portal](http://portal.azure.com).

## Create a connection monitor

1. On the left side of the portal, select **More services**.
2. Start typing *network watcher*. When **Network Watcher** appears in the search results, select it.
3. Under **MONITORING**, select **Connection monitor (Preview)**. Features in preview release do not have the same level of reliability or region availability as features in general release.
4. Select **+ Add**.
5. Enter or select the appropriate information for the connection you want to monitor, and then select **Add**. In this example, a connection between the *myVmSource* and *myVmDestination* virtual machines is monitored over port 80.
    
    |  Setting                                 |  Value               |
    |  -------------------------------------   |  ------------------- |
    |  Name                                    |  myConnectionMonitor |
    |  Source virtual machine                  |  myVmSource          |
    |  Source port                             |                      |
    |  Destination, Select a virtual machine   |  myVmDestination     |
    |  Destination port                        |  80                  |

6. Monitoring begins. Connection monitor probes every 60 seconds.
7. Connection monitor shows you the average round trip time and percentage probes that fail. You can view monitor data in a grid, or a graph.

## Next steps

- Learn how to automate packet captures with virtual machine alerts by [Creating an alert-triggered packet capture](network-watcher-alert-triggered-packet-capture.md).

- Determine if certain traffic is allowed in or out of your virtual machine by using [IP flow verify](network-watcher-check-ip-flow-verify-portal.md).