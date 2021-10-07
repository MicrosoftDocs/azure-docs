---
title: "What is a Network group in Azure Virtual Network Manager (Preview)?"
description: Learn about how Network groups can help you manage your virtual networks. 
author: duongau
ms.author: duau
ms.service: virtual-network-manager
ms.topic: conceptual
ms.date: 11/02/2021
ms.custom: template-concept
---

# What is a network group in Azure Virtual Network Manager (Preview)?

In this article, you'll learn about *network groups* and how it will help you group virtual network together that you want to configure as a set. You'll also learn about *Static group membership* and *Dynamic group membership* and how to use each type of membership when selecting your virtual networks.

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Network group

A *network group* is a set of virtual networks selected manually or by using conditional statements. When you select virtual networks manually, it is called *static group members*. Virtual networks selected using conditional statements are called *dynamic group members*. 

## Static group membership

When creating a network group, you can add virtual networks to the group by manually select individual virtual network from a list provided. The list of virtual network is dependent on the scope (management group or subscription level) defined at the time of the Azure Virtual Network Manager deployment. This method is useful when you have a few virtual networks or if you know specific virtual networks you want to add to the network group. Updates to configurations containing static members will need to be deployed again to have the new changes applied.

## <a name="dynamic"></a>Dynamic group membership

Dynamic grouping gives you the flexibility of selecting multiple virtual networks at once if they meet the conditional statements you defined. This is useful for scenarios where you have hundreds or thousands of virtual networks in one or more subscriptions and need to select a handful either by name or tags. Each condition is processed in the ordered they're entered and configurations are also applied to virtual networks to meet those conditions. See [Exclude elements from dynamic membership](how-to-exclude-elements.md), to learn how to configure conditional statements. Updates to configurations containing dynamic members are also automatically applied.

## Next steps

- Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance using the Azure portal.
- Learn how to create a [Hub and spoke topology](how-to-create-hub-and-spoke.md) with Azure Virtual Network Manager.
- Learn how to block network traffic with a [SecurityAdmin configuration](how-to-block-network-traffic-portal.md).