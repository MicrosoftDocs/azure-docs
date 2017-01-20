---
title: Manage packet captures with Azure Network Watcher using the portal | Microsoft Docs
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
ms.date: 01/30/2017
ms.author: gwallace
---

# Manage packet captures with Azure Network Watcher using the portal

Network Watcher packet capture creates capture sessions to track traffic in and out of a virtual machine. The capture file is based on a filter that is defined to track only the traffic you need. This data is then stored in a storage blob or locally on the guest machine.

This article takes you through the different management tasks that are currently available for packet capture.

- [**Start a packet capture**](#start-a-packet-capture)
- [**Stop a packet capture**](#stop-a-packet-capture)
- [**Delete a packet capture**](#delete-a-packet-capture)
- [**Download a packet capture**](#download-a-packet-capture)

## Before you begin

This article assumes the you have the following:

- An instance of Network Watcher in the region you want to create a packet capture
- A virtual machine with the packet capture extension enabled.

## Packet Capture overview

Navigate to the [Azure portal](https://portal.azure.com) and click **Networking** > **Network Watcher** > **Packet Capture**

The overview page shows a list of all packet captures that exist no matter what their state.

![packet capture overview screen][1]

## Start a packet capture

Click **Add** to create a packet capture.

The properties that can be defined on a packet capture are:

**Main Settings**

- **Subscription** - This value is the subscription that is used, network watcher can span multiple subscriptions
- **Resource group** - The resource group of the virtual machine that is being targeted.
- **Target virtual machine** - The virtual machine that is running the packet capture
- **Packet capture name** - This value is the name of the packet capture.

**Storage**

- **Storage** - Determines if packet capture is saved in a storage account.
- **File** - Determines if a packet capture is saved locally on the virtual machine.
- **Storage Accounts** - The selected storage account to save the packet capture in. Default location is https://{storage account name}.blob.core.windows.net/network-watcher-logs/subscriptions/{subscription id}/resourcegroups/{resource group name}/providers/microsoft.compute/virtualmachines/{virtual machine name}/{YY}/{MM}/{DD}/packetcapture_{HH}_{MM}_{SS}_{XXX}.cap. (Only enabled if **Storage** is selected)
- **Local file path** - The local path on a virtual machine to save the packet capture. (Only enabled if **File** is selected)

**Filtering (Optional)**

- **Protocol** - The protocol to filter for the packet capture. The available values are TCP, UDP, and Any.
- **Local IP address** - This value filters the packet capture to packets where the local IP address matches this filter value.
- **Local port** - This value filters the packet capture to packets where the local port matches this filter value.
- **Remote IP address** - This value filters the packet capture to packets where the remote IP matches this filter value.
- **Remote port** - This value filters the packet capture to packets where the remote port matches this filter value.

**Advanced**

- **Maximum bytes per packet** - The number of bytes from each packet that are captured, all bytes are captured if left blank.
- **Maximum bytes per session** - Total number of bytes in (MB) that are captured, once the value is reached old packets drop.
- **Time limit (seconds)** - Sets a time limit for the packet capture to stop.

Once the values are filled out, click **Create** to create the packet capture.

![create a packet capture][2]

After the time limit set on the packet capture has expired, the packet capture will stop and can be reviewed.

## Delete a packet capture

In the packet capture view, click the **context menu** (...) or right click, and click **delete** to stop the packet capture

![delete a packet capture][3]

You are asked to confirm you want to delete the packet capture, click **Yes**

![confirmation][4]

## Stop a packet capture

In the packet capture view, click the **context menu** (...) or right click, and click **Stop** to stop the packet capture

## Download a packet capture

Once your packet capture session has completed, the capture file can be uploaded to blob storage or to a local file on the VM. A convenient tool to access these capture files saved to a storage account is Microsoft Azure Storage Explorer, which can be downloaded here:  http://storageexplorer.com/ 

By default, packet capture files are saved to a storage account at the following location:
https://{storageAccountName}.blob.core.windows.net/network-watcher-logs/subscriptions/{subscriptionId}/resourcegroups/{storageAccountResourceGroup}/providers/microsoft.compute/virtualmachines/{VMName}/{year}/{month}/{day}/packetCapture_{creationTime}.cap

## Next Steps

Learn how to automate packet captures with Virtual machine alerts by viewing [Create an alert triggered packet capture](network-watcher-alert-triggered-packet-capture.md)

Find if certain traffic is allowed in our out of your VM by visiting [Check IP flow verify](network-watcher-check-ip-flow-verify-portal.md)

<!-- Image references -->
[1]: ./media/network-watcher-packet-capture-manage-portal/figure1.png
[2]: ./media/network-watcher-packet-capture-manage-portal/figure2.png
[3]: ./media/network-watcher-packet-capture-manage-portal/figure3.png
[4]: ./media/network-watcher-packet-capture-manage-portal/figure4.png













