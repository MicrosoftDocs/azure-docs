---
title: "What is a network group in Azure Virtual Network Manager (Preview)?"
description: Learn about how Network groups can help you manage your virtual networks.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: conceptual
ms.date: 07/11/2022
ms.custom: template-concept, ignite-fall-2021
---

# What is a network group in Azure Virtual Network Manager (Preview)?

In this article, you'll learn about *network groups* and how they can help you group virtual networks together for easier management. You'll also learn about *Static group membership* and *Dynamic group membership* and how to use each type of membership.

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Network group

A *network group* is a set of virtual networks selected manually or by using conditional statements. When you select virtual networks manually, it's called *static members*. Virtual networks selected using conditional statements are called *dynamic members*.

## Static membership

When you create a network group, you can add virtual networks to a group by manually selecting individual virtual networks from a provided list. The list of virtual networks is dependent on the scope (management group or subscription) defined at the time of the Azure Virtual Network Manager deployment. This method is useful when you have a few virtual networks you want to add to the network group.

## Dynamic membership

Dynamic membership gives you the flexibility of selecting multiple virtual networks at once if they meet the conditional statements you defined. This method is useful for scenarios where you have hundreds or thousands of virtual networks in one or more subscriptions and need to select a handful either by name, IDs, or tags. Each condition gets processed in the order listed and configurations are applied to virtual networks to meet those conditions. See [Exclude elements from dynamic membership](how-to-exclude-elements.md), to learn how to configure conditional statements.

## Network group and Azure Policy

When you create a network group, an Azure Policy is created so that Azure Virtual Network Manager gets notified about changes made to virtual network membership. The policies defined are available for you to see, but they are not editable by users today. Creating, changing, and deleting Azure Policy definitions and assignments for network groups is only possible through the Azure Network Manager today.

To create an Azure Policy initiative definition and assignment for Azure Virtual Network Manager resources, create and deploy a network group with the necessary configurations. To update an existing Azure Policy initiative definition or corresponding assignment, you'll need to change and deploy changes to the network group within the Azure Virtual Network Manager resource. To delete an Azure Policy initiative definition and assignment, you'll need to undeploy and delete the Azure Virtual Network Manager resources associated with your policy. This may include removing a configuration, deleting a configuration, and deleting a network group. For more information on deletion, review the Azure Virtual Network Manager [checklist for removing components](concept-remove-components-checklist.md).

## Next steps

- Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance using the Azure portal
- Learn how to create a [Hub and spoke topology](how-to-create-hub-and-spoke.md) with Azure Virtual Network Manager
- Learn how to block network traffic with a [SecurityAdmin configuration](how-to-block-network-traffic-portal.md)
- Review [Azure Policy basics](../governance/policy/overview.md)