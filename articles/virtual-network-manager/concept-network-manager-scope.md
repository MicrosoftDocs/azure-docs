---
title: 'Understand and work with Azure Virtual Network Manager scopes'
description: Learn about Azure Virtual Network Manager scopes and the effects it has on managing virtual networks.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: conceptual
ms.date: 3/22/2023
ms.custom: template-concept
---

# Understand and work with Azure Virtual Network Manager (Preview) scopes

In this article, you learn about how Azure Virtual Network Manager uses the concept of *scope* to enable management groups or subscriptions to use certain features of Virtual Network Manager. Also, you learn about *hierarchy* and how that can affect your users when using Virtual Network Manager. 

> [!IMPORTANT]
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub and spoke connectivity configurations. 
>
> Mesh connectivity configurations and security admin rules remain in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Network Manager

**Network Manager** is the top-level object consisting of child resources such as network groups, configurations, and rules. 

* **Network Groups** - a subset of the overall scope, to which specific connectivity or security admin policies can be applied to.

* **Configurations** - Azure Virtual Network Manager provides two types of configurations, a connectivity configuration and a security configuration. Connectivity configurations enable you to create network topologies, while security configurations enable you to create a collection of rules that you can apply across virtual networks.

* **Rules** - A rule collection, is a set of network security rules that can either allow or deny network traffic at the global level for your virtual networks. 

## Scope

A *scope* within Azure Virtual Network Manager represents the delegated access granted to a network manager where features can be applied to the resources within the scope. When specifying a scope, you're limiting the access to which Network Manager can manage resources for. The value for the scope can be at the management group level or at the subscription level. See [Azure management groups](../governance/management-groups/overview.md), to learn how to manage your resource hierarchy. When you select a management group as the scope, all child resources are included within the scope. 

> [!NOTE]
> You can't create multiple Azure Virtual Network Manager instances with an overlapping scope of the same hierarchy and the same features selected.
> When specifying a scope at the management group level, you need to register the Azure Virtual Network Provider at the management group scope before deploying a virtual network manager. This process is included as part of [Creating a Virtual Network Manager in the Azure portal](./create-virtual-network-manager-portal.md), but not with programmatic methods such as Azure CLI and Azure PowerShell. Learn more about [registering providers at management group scope](/rest/api/resources/providers/register-at-management-group-scope).

### Scope Applicability

When you deploy configurations, Network Manager only applies features to resources within its scope. If you attempt to add a resource to a network group that is out of scope, it's added to the group to represent your intent. But the network manager doesn't apply the changes to the configurations.

The Network Manager's scope can be updated to add or remove scopes from its list. Updates trigger an automatic, scope wide, reevaluation and potentially add features with a scope addition, or remove them with a scope removal.

### Cross-tenant Scope

The Network Manager's scope can span across tenants, however a separate approval flow is required to establish this scope. First, intent for the desired scope must be added from within the Network Manager via the 'Scope Connection' resource. Second, the intent for the management of the Network Manager must be added from the scope (subscription/management group) via the 'Network Manager Connection' resource. These resources contain a state to represent whether the associated scope has been added to the Network Manager scope.

## Features

Features are scope access that you allow the Azure Virtual Network Manager to manage. Azure Virtual Network Manager currently has two feature scopes, which are *Connectivity* and *SecurityAdmin*. You can enable both feature scopes on the same Virtual Network Manager instance. For more information about each feature, see [Connectivity](concept-connectivity-configuration.md) and [SecurityAdmin](concept-security-admins.md).

## Hierarchy

Azure Virtual Network Manager allows for management of your network resources in a hierarchy. A hierarchy means you can have multiple Virtual Network Manager instances manage overlapping scopes and the configurations within each Virtual Network Manager can also overlay one another. For example, you can have the top-level [management group](../governance/management-groups/overview.md) of one Virtual Network Manager and have a child management group as the scope for a different Virtual Network Manager. When you have a configuration conflict between different Virtual Network Manager instances that contains the same resource. The configuration from the Virtual Network Manager that has the higher scope is the one applied.

## Next steps

- Learn how to create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance.
- Learn about [Network groups](concept-network-groups.md).
