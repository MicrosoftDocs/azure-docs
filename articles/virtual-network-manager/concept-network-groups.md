---
title: "What is a network group in Azure Virtual Network Manager (Preview)?"
description: Learn about how Network groups can help you manage your virtual networks. 
author: duongau
ms.author: duau
ms.service: virtual-network-manager
ms.topic: conceptual
ms.date: 11/02/2021
ms.custom: template-concept
---

# What is a network group in Azure Virtual Network Manager (Preview)?

In this article, you'll learn about *network groups* and how they can help you group virtual networks together for easier management. You'll also learn about *Static group membership* and *Dynamic group membership* and how to use each type of membership.

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Network group

A *network group* is a set of virtual networks selected manually or by using conditional statements. When you select virtual networks manually, it's called *static group members*. Virtual networks selected using conditional statements are called *dynamic group members*. 

## Static group membership

When you create a network group, you can add virtual networks to a group by manually selecting individual virtual network from a provided list. The list of virtual network is dependent on the scope (management group or subscription level) defined at the time of the Azure Virtual Network Manager deployment. This method is useful when you have a few virtual networks you want to add to the network group. Updates to configurations containing static members will need to be deployed again to have the new changes applied.

## <a name="dynamic"></a>Dynamic group membership

Dynamic grouping gives you the flexibility of selecting multiple virtual networks at once if they meet the conditional statements you defined. This method is useful for scenarios where you have hundreds or thousands of virtual networks in one or more subscriptions and need to select a handful either by name or tags. Each condition gets processed in the order listed and configurations are applied to virtual networks to meet those conditions. See Exclude elements from dynamic membership, to learn how to configure conditional statements. Updates to configurations containing dynamic members are also automatically applied.

## Network group and Azure policy

When you create a network group, an Azure policy is created so that Azure Virtual Network Manager gets notified about changes made to virtual network membership. These policies defined are available for you to see.

## Next steps

- Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance using the Azure portal.
