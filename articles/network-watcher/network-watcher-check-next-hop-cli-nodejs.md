---
title: Find next hop with Azure Network Watcher Next Hop - Azure CLI 1.0 | Microsoft Docs
description: This article will describe how you can find what the next hop type is and ip address using Next Hop using Azure CLI.
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor:

ms.assetid: 0700c274-3e0d-4dca-acfa-3ceac8990613
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace

---

# Find out what the next hop type is using the Next Hop capability in Azure Network Watcher using Azure CLI 1.0

> [!div class="op_single_selector"]
> - [Azure portal](network-watcher-check-next-hop-portal.md)
> - [PowerShell](network-watcher-check-next-hop-powershell.md)
> - [CLI 1.0](network-watcher-check-next-hop-cli-nodejs.md)
> - [CLI 2.0](network-watcher-check-next-hop-cli.md)
> - [Azure REST API](network-watcher-check-next-hop-rest.md)

Next hop is a feature of Network Watcher that provides the ability get the next hop type and IP address based on a specified virtual machine. This feature is useful in determining if traffic leaving a virtual machine traverses a gateway, internet, or virtual networks to get to its destination.

This article uses cross-platform Azure CLI 1.0, which is available for Windows, Mac and Linux.

## Before you begin

In this scenario, you will use the Azure CLI to find the next hop type and IP address.

This scenario assumes you have already followed the steps in [Create a Network Watcher](network-watcher-create.md) to create a Network Watcher. The scenario also assumes that a Resource Group with a valid virtual machine exists to be used.

## Scenario

The scenario covered in this article uses Next Hop, a feature of Network Watcher that finds out the next hop type and IP address for a resource. To learn more about Next Hop, visit [Next Hop Overview](network-watcher-next-hop-overview.md).


## Get Next Hop

To get the next hop we call the `azure netowrk watcher next-hop` cmdlet. We pass the cmdlet the Network Watcher resource group, the NetworkWatcher, virtual machine Id, source IP address, and destination IP address. In this example, the destination IP address is to a VM in another virtual network. There is a virtual network gateway between the two virtual networks. 

```azurecli
azure network watcher next-hop -g resourceGroupName -n networkWatcherName -t targetResourceId -a <source-ip> -d <destination-ip>
```

> [!NOTE]
If the VM has multiple NICs and IP forwarding is enabled on any of the NICs, then the NIC parameter (-i nic-id) must be specified. Otherwise it is optional.

## Review results

When complete, the results are provided. The next hop IP address is returned as well as the type of resource it is.

```
data:    Next Hop Ip Address             : 10.0.1.2
info:    network watcher next-hop command OK
```

The following list shows the currently available NextHopType values:

**Next Hop Type**

* Internet
* VirtualAppliance
* VirtualNetworkGateway
* VnetLocal
* HyperNetGateway
* VnetPeering
* None

## Next steps

Learn how to review your network security group settings programmatically by visiting [NSG Auditing with Network Watcher](network-watcher-nsg-auditing-powershell.md)
