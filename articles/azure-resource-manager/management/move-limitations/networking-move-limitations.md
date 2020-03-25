---
title: Move Azure Networking resources to new subscription or resource group
description: Use Azure Resource Manager to move virtual networks and other networking resources to a new resource group or subscription.
ms.topic: conceptual
ms.date: 10/16/2019
---

# Move guidance for networking resources

This article describes how to move virtual networks and other networking resources for specific scenarios.

## Dependent resources

When moving a virtual network, you must also move its dependent resources. For VPN Gateways, you must move IP addresses, virtual network gateways, and all associated connection resources. Local network gateways can be in a different resource group.

To move a virtual machine with a network interface card to a new subscription, you must move all dependent resources. Move the virtual network for the network interface card, all other network interface cards for the virtual network, and the VPN gateways.

For more information, see [Scenario for move across subscriptions](../move-resource-group-and-subscription.md#scenario-for-move-across-subscriptions).

## Peered virtual network

To move a peered virtual network, you must first disable the virtual network peering. Once disabled, you can move the virtual network. After the move, reenable the virtual network peering.

## Subnet links

You can't move a virtual network to a different subscription if the virtual network contains a subnet with resource navigation links. For example, if an Azure Cache for Redis resource is deployed into a subnet, that subnet has a resource navigation link.

## Next steps

For commands to move resources, see [Move resources to new resource group or subscription](../move-resource-group-and-subscription.md).
