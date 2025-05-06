---
title: "Network Groups in Azure Virtual Network Manager"
description: Discover network groups in Azure Virtual Network Manager, their static and dynamic memberships, and how they simplify managing virtual networks.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: concept-article
ms.date: 05/06/2025
---

# Network Groups in Azure Virtual Network Manager

This article explains *network groups* in Azure Virtual Network Manager, showing how they simplify virtual network management. It also covers *static* and *dynamic group memberships* and their use cases.

## Overview of network groups

A *network group* is a global container that includes a set of virtual network resources from any region. Configurations are applied to target the network group, which then applies the configuration to all members of the group.

## Group membership types for network groups

Group membership is a many-to-many relationship, such that one group holds many virtual networks, and any given virtual network can participate in multiple network groups. As part of a network group, the virtual network receives any configurations applied to the group and deployed to the virtual network's region.

### Static membership of network groups

Static membership allows you to explicitly add virtual networks to a group by manually selecting individual virtual networks. The list of virtual networks is dependent on the scope (management group or subscription) defined at the time of the Azure Virtual Network Manager deployment. This method is useful when you have a few virtual networks to add to the network group. Static membership also allows you to 'patch' the network group contents by adding or removing a virtual network from the group.

### Dynamic membership in network groups

Dynamic membership gives you the flexibility of selecting multiple virtual networks at scale if they meet the conditional statements you defined in Azure Policy. This membership type is useful for scenarios where you have a large number of virtual networks or if membership is dictated by a condition instead of an explicit list. Learn more about [how Azure Policy works with Network Groups](concept-azure-policy-integration.md).

### Membership visibility in Azure Resource Graph

All group membership is recorded in Azure Resource Graph and available for your use. Each virtual network receives a single entry in the graph. This entry specifies all the groups the virtual network is a member of and what contributing sources are responsible for that membership, such as static members or various policy resources. Learn how to [view applied configurations for network group membership](how-to-view-applied-configurations.md#network-group-membership).

## Network Groups and Azure Policy Integration

When you create a network group, an Azure Policy is created so that Azure Virtual Network Manager gets notified about changes made to virtual network membership.

To create, edit, or delete Azure Virtual Network Manager dynamic group policies, you need:

- Read and write role-based access control permissions to the underlying policy.
- Role-based access control permissions to join the network group (Classic Admin authorization isn't supported).

For more information on required permissions for Azure Virtual Network Manager dynamic group policies, review [required permissions for Azure Policy integration](concept-azure-policy-integration.md#required-permissions).

## Frequently Asked Questions (FAQ)

### What is the difference between static and dynamic membership in network groups?

Static membership requires manually adding virtual networks to a group, while dynamic membership uses Azure Policy to automatically include virtual networks based on defined conditions.

### Can a virtual network belong to multiple network groups?

Yes, a virtual network can belong to multiple network groups, and it receives configurations from all the groups it's a member of.

### How can I view the network groups a virtual network belongs to?

You can use Azure Resource Graph to view all the network groups a virtual network belongs to, along with the contributing sources for its membership.

## Next Steps

- Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance using the Azure portal.
- Learn how to create a [Hub and Spoke topology with Azure Virtual Network Manager](how-to-create-hub-and-spoke.md).
- Learn how to block network traffic with a [Security admin configuration](how-to-block-network-traffic-portal.md).
- Review [Azure Policy basics](../governance/policy/overview.md) to understand how policies integrate with network groups.
