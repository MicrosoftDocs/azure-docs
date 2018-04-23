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

Learn how to use connection monitor to monitor network connectivity between an Azure Virtual Machine (VM) and an IP address. Connection monitor provides monitoring between source and destination IP address and port. Connection monitor enables scenarios like monitoring connectivity from a VM in a virtual network to a VM running SQL server in the same or different virtual network, over port 1433. Connection monitor provides you connection latency as an Azure Monitor metric, recorded every 60 seconds. It also provides you a hop-by-hop topology, and identifies configuration issues impacting your connection.

## Prerequisites

You must meet the following prerequisites before completing the steps in this article:

* An instance of Network Watcher in the region you want to monitor a connection for. If you don't already have one, you can create one by completing the steps in [Create an Azure Network Watcher instance](network-watcher-create.md).
* A VM to monitor from. To learn how to create a VM, see Create a [Windows](../virtual-machines/windows/quick-create-portal.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json) or [Linux](../virtual-machines/linux/quick-create-portal.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json) VM.
* Have the `AzureNetworkWatcherExtension` installed in the VM you want to monitor a connection from. To install the extension in a Windows VM, see [Azure Network Watcher Agent virtual machine extension for Windows](../virtual-machines/windows/extensions-nwa.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json) and to install the extension in a Linux VM see [Azure Network Watcher Agent virtual machine extension for Linux](../virtual-machines/linux/extensions-nwa.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json). The extension is not required on the destination endpoint you want to monitor.

## Sign in to Azure 

Sign in to the [Azure portal](http://portal.azure.com).

## Create a connection monitor

The following steps enable connection monitoring to a destination VM over ports 80 and 1433:

1. On the left side of the portal, select **All services**.
2. Start typing *network watcher* in the **Filter** box. When **Network Watcher** appears in the search results, select it.
3. Under **MONITORING**, select **Connection monitor**.
4. Select **+ Add**.
5. Enter or select the information for the connection you want to monitor, and then select **Add**. In the example shown in the following picture, the connection monitored is from the *MultiTierApp0* VM to the *Database0* VM over port 80:

    ![Add Connection Monitor](./media/connection-monitor/add-connection-monitor.png)

    Monitoring begins. Connection monitor probes every 60 seconds.
6. Complete step 5 again, specifying the same source and destination VMs, and the following values:
    
    |Setting  |Value          |
    |---------|---------      |
    |Name     | AppToDB(1433) |
    |Port     | 1433          |

## View connection monitoring

1. Complete steps 1-3 in [Create a connection monitor](#create-a-connection-monitor) to view connection monitoring.
2. The following picture shows details for the *AppToDB(80)* connection. The **Status** is reachable. The **Graph view** shows the **Average Round Trip Time** and **% Probes Failed**. The graph provides hop-by-hop information,  and shows that no issues are impacting destination reachability.

    ![Graph view](./media/connection-monitor/view-graph.png)

3. Viewing the *AppToDB(1433)* connection shown in the following picture, you see that for the same source and destination VMs, the status is unreachable over port 1433. The **Grid view** in this scenario provides the hop-by-hop information and the issue impacting reachability. In this case, an NSG rule is blocking all traffic on port 1433 at the second hop.

    ![Grid view](./media/connection-monitor/view-grid.png)

## Next steps

- Learn how to automate packet captures with VM alerts by [Creating an alert-triggered packet capture](network-watcher-alert-triggered-packet-capture.md).
- Determine if certain traffic is allowed in or out of your VM by using [IP flow verify](network-watcher-check-ip-flow-verify-portal.md).