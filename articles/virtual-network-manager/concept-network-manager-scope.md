---
title: 'Understand and work with Azure Virtual Network Manager scopes'
description: Learn about Azure Virtual Network Manager scopes and the effects it has on managing virtual networks. 
author: duongau
ms.author: duau
ms.service: virtual-network-manager
ms.topic: conceptual
ms.date: 11/02/2021
ms.custom: template-concept
---

# Understand and work with Azure Virtual Network Manager (Preview) scopes

In this article, you'll learn about how Azure Virtual Network Manager uses the concept of *Network Manager* and *scope* to enable management groups or subscriptions to use certain features of Virtual Network Manager. You'll also learn about *hierarchy* and how that can affect your users when using AVNM. 

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Network Manager

*Network Manager* is the top-level object consisting of child resources such as *network groups*, *configurations, and *rules*. 

* Network Groups - a subset of the overall scope to which specific connectivity or security admin policies can be applied to.

* Configurations - AVNM provides two types of configurations, connectivity policy and security policy. Connectivity policies enable you to establish communication between your virtual networks, while security policies enable you to create a collection of rules that you can apply across virtual networks.

* Rules - A rule collection, is a set of network security rules that can either allow or deny network traffic applied to a group of networks. 

> [!NOTE]
> Azure Virtual Network Manager requires all child resources to be removed before it can be deleted.
>

## <a name="scope"></a> Scope

A *scope* within Azure Virtual Network Manager is a set of resources where features can be applied to. When specifying a scope, you're limiting the access to which Network Manager can manage resources for. The value for the scope can be at the management group level or at the subscription level. See [Azure management groups](../governance/management-groups/overview.md), to learn how to manage your resource hierarchy. When you select a management group as the scope, all child resources are included within the scope. 

> [!NOTE]
> Creating multiple Network Manager with an overlapping scope of the same hierarchy is not supported.
> 

## <a name="features"></a> Scope Access

The scope access is a list of features that you can allow the Network Manager to manage. Azure Virtual Network Manager currently has two feature scopes, which are *Connectivity* and *SecurityAdmin*. You can enable both feature scopes on the same Network Manager instance. 

> [!NOTE]
> Scope access is enabled only during deployment of Network Manager. If you deploy an Network Manager instance with only one feature scope, you will need to redeploy a new Network Manager to enable both features.
>

## Hierarchy

Azure Virtual Network Manager allows for management of your network resources in a hierarchy. A hierarchy means you can have multiple Virtual Network Manager instances manage overlapping scopes and the configurations within each Virtual Network Manager can also overlay one another. For example, you can the top-level management group of one Virtual Network Manager and have a child management group as the scope for a different Virtual Network Manager. When you have a configuration conflict between different Virtual Network Manager instances that contains the same resource. The configuration from the Virtual Network Manager that has the higher scope will be the one that gets applied.

## Next steps

- Learn how to create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance.
- Learn about [Network groups](concept-network-groups.md).
