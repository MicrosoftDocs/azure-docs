---
title: Move Azure Networking resources to new subscription or resource group | Microsoft Docs
description: Use Azure Resource Manager to move virtual networks and other networking resources to a new resource group or subscription.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 08/19/2019
ms.author: tomfitz
---

# Move guidance for networking resources

This article describes how to move virtual networks and other networking resources for specific scenarios.

## Dependent resources

When moving a virtual network, you must also move its dependent resources. For VPN Gateways, you must move IP addresses, virtual network gateways, and all associated connection resources. Local network gateways can be in a different resource group.

To move a virtual machine with a network interface card, you must move all dependent resources. Move the virtual network for the network interface card, all other network interface cards for the virtual network, and the VPN gateways.

## State of dependent resources

If the source or target resource group contains a virtual network, the states of all dependent resources for the virtual network are checked during the move. If any of those resources are in a failed state, the move is blocked. For example, if a virtual machine that uses the virtual network has failed, the move is blocked. The move is blocked even when the virtual machine isn't one of the resources being moved and isn't in one of the resource groups for the move. To avoid this problem, move your resources to a resource group that doesn't have a virtual network.

## Peered virtual network

To move a peered virtual network, you must first disable the virtual network peering. Once disabled, you can move the virtual network. After the move, reenable the virtual network peering.

## Subnet links

You can't move a virtual network to a different subscription if the virtual network contains a subnet with resource navigation links. For example, if an Azure Cache for Redis resource is deployed into a subnet, that subnet has a resource navigation link.

## Next steps

For commands to move resources, see [Move resources to new resource group or subscription](../resource-group-move-resources.md).
