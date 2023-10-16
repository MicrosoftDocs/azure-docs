---
title: Next hop
titleSuffix: Azure Network Watcher
description: Learn about Azure Network Watcher next hop capability that you can use to diagnose virtual machine routing problems.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 03/28/2023
ms.author: halkazwini
ms.custom: template-concept, engagement-fy23
---

# Azure Network Watcher next hop

Traffic from a virtual machine (VM) is sent to a destination based on the effective routes associated with the virtual machines' network interface (NIC). Azure Network Watcher next hop gives you the *Next hop type*, *IP address*, and *Route table ID* of a specific destination IP address. Knowing the next hop helps you determine if traffic is being directed to the intended destination, or whether the traffic is being sent nowhere. An improper configuration of routes, where traffic is directed to an on-premises location, or a network virtual appliance, can lead to connectivity issues. If the route is defined using a user-defined route, the route table that has the route is returned. Otherwise, next hop returns *System Route* as the route table.

:::image type="content" source="./media/network-watcher-next-hop-overview/next-hop-view.png" alt-text="Screenshot of Azure Network Watcher next hop view in Azure portal.":::

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

## Next steps

To learn how to use next hop to diagnose virtual machine routing problems, see Diagnose VM network routing problems using the [Azure portal](diagnose-vm-network-routing-problem.md), [PowerShell](diagnose-vm-network-routing-problem-powershell.md), or the [Azure CLI](diagnose-vm-network-routing-problem-cli.md).
