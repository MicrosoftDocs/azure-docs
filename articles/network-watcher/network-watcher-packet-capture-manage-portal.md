---
title: Manage packet captures with Azure Network Watcher - Azure portal | Microsoft Docs
description: This page explains how to manage the packet capture feature of Network Watcher using Azure portal
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: 59edd945-34ad-4008-809e-ea904781d918
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace
---

# Manage packet captures with Azure Network Watcher using the portal

> [!div class="op_single_selector"]
> - [Azure portal](network-watcher-packet-capture-manage-portal.md)
> - [PowerShell](network-watcher-packet-capture-manage-powershell.md)
> - [CLI 1.0](network-watcher-packet-capture-manage-cli-nodejs.md)
> - [CLI 2.0](network-watcher-packet-capture-manage-cli.md)
> - [Azure REST API](network-watcher-packet-capture-manage-rest.md)

Network Watcher packet capture allows you to create capture sessions to track traffic to and from a virtual machine. Filters are provided for the capture session to ensure you capture only the traffic you want. Packet capture helps to diagnose network anomalies both reactively and proactively. Other uses include gathering network statistics, gaining information on network intrusions, to debug client-server communications and much more. By being able to remotely trigger packet captures, this capability eases the burden of running a packet capture manually and on the desired machine, which saves valuable time.

This article takes you through the different management tasks that are currently available for packet capture.

- [**Start a packet capture**](#start-a-packet-capture)
- [**Stop a packet capture**](#stop-a-packet-capture)
- [**Delete a packet capture**](#delete-a-packet-capture)
- [**Download a packet capture**](#download-a-packet-capture)

## Before you begin

This article assumes that you have the following resources:

- An instance of Network Watcher in the region you want to create a packet capture
- A virtual machine with the packet capture extension enabled.

> [!IMPORTANT]
> Packet capture requires a virtual machine extension `AzureNetworkWatcherExtension`. For installing the extension on a Windows VM visit [Azure Network Watcher Agent virtual machine extension for Windows](../virtual-machines/windows/extensions-nwa.md) and for Linux VM visit [Azure Network Watcher Agent virtual machine extension for Linux](../virtual-machines/linux/extensions-nwa.md).

### Packet Capture agent extension through the portal

To install the packet capture VM agent through the portal, navigate to your virtual machine, click **Extensions** > **Add** and search for **Network Watcher Agent for Windows**

![agent view][agent]

## Packet Capture overview

Navigate to the [Azure portal](https://portal.azure.com) and click **Networking** > **Network Watcher** > **Packet Capture**

The overview page shows a list of all packet captures that exist no matter the state.

> [!NOTE]
> Packet capture requires connectivity to the storage account over port 443.

![packet capture overview screen][1]

## Start a packet capture

Click **Add** to create a packet capture.

The properties that can be defined on a packet capture are:

**Main settings**

- **Subscription** - This value is the subscription that is used, an instance of network watcher is needed in each subscription.
- **Resource group** - The resource group of the virtual machine that is being targeted.
- **Target virtual machine** - The virtual machine that is running the packet capture
- **Packet capture name** - This value is the name of the packet capture.

**Capture configuration**

- **Storage Account** - Determines if packet capture is saved in a storage account.
- **File** - Determines if a packet capture is saved locally on the virtual machine.
- **Storage Accounts** - The selected storage account to save the packet capture in. Default location is https://{storage account name}.blob.core.windows.net/network-watcher-logs/subscriptions/{subscription id}/resourcegroups/{resource group name}/providers/microsoft.compute/virtualmachines/{virtual machine name}/{YY}/{MM}/{DD}/packetcapture_{HH}_{MM}_{SS}_{XXX}.cap. (Only enabled if **Storage** is selected)
- **Local file path** - The local path on a virtual machine to save the packet capture. (Only enabled if **File** is selected). A Valid path must be supplied
- **Maximum bytes per packet** - The number of bytes from each packet that are captured, all bytes are captured if left blank.
- **Maximum bytes per session** - Total number of bytes that are captured, once the value is reached the packet capture stops.
- **Time limit (seconds)** - Sets a time limit for the packet capture to stop. Default is 18000 seconds.

> [!NOTE]
> Premium storage accounts are currently not supported for storing packet captures.

**Filtering (Optional)**

- **Protocol** - The protocol to filter for the packet capture. The available values are TCP, UDP, and Any.
- **Local IP address** - This value filters the packet capture to packets where the local IP address matches this filter value.
- **Local port** - This value filters the packet capture to packets where the local port matches this filter value.
- **Remote IP address** - This value filters the packet capture to packets where the remote IP matches this filter value.
- **Remote port** - This value filters the packet capture to packets where the remote port matches this filter value.

> [!NOTE]
> Port and IP address values can be a single value, range of values, or a set. (that is, 80-1024 for port)
> You can define as many filters as you want.

Once the values are filled out, click **OK** to create the packet capture.

![create a packet capture][2]

After the time limit set on the packet capture has expired, the packet capture will stop and can be reviewed. You can also manually stop the packet captures sessions.

## Delete a packet capture

In the packet capture view, click the **context menu** (...) or right click, and click **delete** to stop the packet capture

![delete a packet capture][3]

> [!NOTE]
> Deleting a packet capture does not delete the file in the storage account.

You are asked to confirm you want to delete the packet capture, click **Yes**

![confirmation][4]

## Stop a packet capture

In the packet capture view, click the **context menu** (...) or right click, and click **Stop** to stop the packet capture

## Download a packet capture

Once your packet capture session has completed, the capture file is uploaded to blob storage or to a local file on the VM. The storage location of the packet capture is defined at creation of the session. A convenient tool to access these capture files saved to a storage account is Microsoft Azure Storage Explorer, which can be downloaded here:  http://storageexplorer.com/

If a storage account is specified, packet capture files are saved to a storage account at the following location:
```
https://{storageAccountName}.blob.core.windows.net/network-watcher-logs/subscriptions/{subscriptionId}/resourcegroups/{storageAccountResourceGroup}/providers/microsoft.compute/virtualmachines/{VMName}/{year}/{month}/{day}/packetCapture_{creationTime}.cap
```

## Next steps

Learn how to automate packet captures with Virtual machine alerts by viewing [Create an alert triggered packet capture](network-watcher-alert-triggered-packet-capture.md)

Find if certain traffic is allowed in or out of your VM by visiting [Check IP flow verify](network-watcher-check-ip-flow-verify-portal.md)

<!-- Image references -->
[1]: ./media/network-watcher-packet-capture-manage-portal/figure1.png
[2]: ./media/network-watcher-packet-capture-manage-portal/figure2.png
[3]: ./media/network-watcher-packet-capture-manage-portal/figure3.png
[4]: ./media/network-watcher-packet-capture-manage-portal/figure4.png
[agent]: ./media/network-watcher-packet-capture-manage-portal/agent.png













