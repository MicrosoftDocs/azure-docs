---
title: Move Azure Networking resources to new subscription or resource group
description: Use Azure Resource Manager to move virtual networks and other networking resources to a new resource group or subscription.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 05/05/2023
---

# Move networking resources to new resource group or subscription

This article describes how to move virtual networks and other networking resources to a new resource group or Azure subscription.

During the move, your networking resources operate without interruption.

If you want to move networking resources to a new region, see [Tutorial: Move Azure VMs across regions](../../../resource-mover/tutorial-move-region-virtual-machines.md).

## Dependent resources

When moving a resource, you must also move its dependent networking resources. However, any resource that is associated with a **Standard SKU** public IP address can't be moved across subscriptions. For example, you can't move a VPN Gateway that is associated with a **Standard SKU** public IP address to a new subscription.

To move a virtual machine with a network interface card to a new subscription, you must move all dependent resources. Move the virtual network for the network interface card, all other network interface cards for the virtual network, and the VPN gateways. If a virtual machine is associated with a **Standard SKU** public IP address, [disassociate the public IP address](../../../virtual-network/ip-services/remove-public-ip-address-vm.md) before moving across subscriptions.

If you move the virtual network for an AKS cluster, the AKS cluster stops working. The local network gateways can be in a different resource group.

For more information, see [Scenario for move across subscriptions](../move-resource-group-and-subscription.md#scenario-for-move-across-subscriptions).

## Peered virtual network

To move a peered virtual network, you must first disable the virtual network peering. Once disabled, you can move the virtual network. After the move, reenable the virtual network peering.

## VPN Gateways

You can't move VPN Gateways across resource groups or subscriptions if they are of Basic SKU. Basic SKU is only meant for test environment usage and doesn't support resource move operation.
A virtual network gateway must always be in the same resource group as its virtual network, they can't be moved separately.

## Subnet links

You can't move a virtual network to a different subscription if the virtual network contains a subnet with resource navigation links. For example, if an Azure Cache for Redis resource is deployed into a subnet, that subnet has a resource navigation link.

## Private endpoints

The following [private-link resources](../../../private-link/private-endpoint-overview.md#private-link-resource) support move:

* Microsoft.aadiam/privateLinkForAzureAD
* Microsoft.DocumentDB/databaseAccounts
* Microsoft.Kusto/clusters
* Microsoft.Search/searchServices
* Microsoft.SignalRService/SignalR
* Microsoft.SignalRService/webPubSub
* Microsoft.Sql/servers
* Microsoft.StorageSync/storageSyncServices
* Microsoft.Synapse/workspaces
* Microsoft.Synapse/privateLinkHubs

All other private-link resources don't support move.

## Next steps

For commands to move resources, see [Move resources to new resource group or subscription](../move-resource-group-and-subscription.md).
