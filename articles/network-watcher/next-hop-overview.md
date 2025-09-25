---
title: Next hop overview
titleSuffix: Azure Network Watcher
description: Learn about Azure Network Watcher next hop capability that you can use to diagnose virtual machine routing problems.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: concept-article
ms.date: 03/25/2025
ms.custom: sfi-image-nochange

#CustomerIntent: As an Azure administrator, I want to learn about Next hop feature so I can use it to get the next hop information of any virtual machine (VM) experiencing  routing issues to be able to diagnose and fix the issue.
# Customer intent: As an Azure administrator, I want to understand the Next hop feature so that I can diagnose and resolve routing issues for virtual machines effectively.
---

# Next hop overview

Next hop is a feature of Azure Network Watcher that gives you the *Next hop type*, *IP address*, and *Route table ID* of a specific destination IP address. Knowing the next hop information helps you determine if traffic is being directed to the intended destination, or whether the traffic is being dropped. An improper configuration of routes, where traffic is directed to an on-premises location or a network virtual appliance can lead to connectivity issues.

If the route is defined using a user-defined route, next hop returns the route table that has the route. Otherwise, it returns *System Route* as the route table.

:::image type="content" source="./media/next-hop-overview/next-hop-view.png" alt-text="Screenshot of Azure Network Watcher next hop view in Azure portal.":::

## Next hop types

Network Watcher returns the following next hop types:

* Internet
* VirtualAppliance
* VirtualNetworkGateway
* VirtualNetwork
* VirtualNetworkPeering
* VirtualNetworkServiceEndpoint 
* MicrosoftEdge
* None

To learn more about each next hop type, see [Virtual network traffic routing](../virtual-network/virtual-networks-udr-overview.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).

## Next step

> [!div class="nextstepaction"]
> [Diagnose a virtual machine network routing problem](diagnose-vm-network-routing-problem.md)
