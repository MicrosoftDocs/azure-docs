---
title: Understand and work with Azure Virtual Network Manager scopes
description: Learn about Azure Virtual Network Manager scopes and the effects that they have on managing virtual networks.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: conceptual
ms.date: 03/22/2024
ms.custom: template-concept
---

# Understand and work with Azure Virtual Network Manager scopes

In this article, you learn how scopes enable management groups or subscriptions to use certain features of Azure Virtual Network Manager. You also learn about the concept of hierarchy and how it can affect Azure Virtual Network Manager users.

[!INCLUDE [virtual-network-manager-preview](../../includes/virtual-network-manager-preview.md)]

## Virtual Network Manager resources

An Azure Virtual Network Manager instance includes the following resources:

- **Network groups**: A network group is a logical container where you can apply configuration policies for networking.

- **Configurations**: Azure Virtual Network Manager provides two types of configurations:
  - Use *connectivity configurations* to create network topologies.
  - Use *security configurations* to create a collection of rules that you can apply across virtual networks.

- **Rules**: You can set network security rules that can either allow or deny network traffic at the global level for your virtual networks.

## Scope

A *scope* within Azure Virtual Network Manager represents the level of access granted for managing resources. The value for the scope can be at the *management group* level or at the *subscription* level. To learn how to manage your resource hierarchy, see [Azure management groups](../governance/management-groups/overview.md). When you select a management group as the scope, all child resources are included within the scope.

> [!NOTE]
> You can't create multiple Azure Virtual Network Manager instances with an overlapping scope of the same hierarchy and the same features selected.
>
> When you're specifying a scope at the management group level, you need to register the Azure Virtual Network provider at the management group scope before you deploy a Virtual Network Manager instance. This process is included as part of [creating a Virtual Network Manager instance in the Azure portal](./create-virtual-network-manager-portal.md), but not with programmatic methods such as the Azure CLI and Azure PowerShell. [Learn more about registering providers at the management group scope](/rest/api/resources/providers/register-at-management-group-scope).

### Scope applicability

When you deploy configurations, the Virtual Network Manager instance applies features only to resources within its scope. If you try to add a resource to a network group that's out of scope, it's added to the group to represent your intent. But the Virtual Network Manager instance doesn't apply the changes to the configurations.

You can update the scope of the Virtual Network Manager instance. Updates trigger an automatic, scope-wide reevaluation, and they potentially add features with a scope addition or remove features with a scope removal.

### Cross-tenant scope

The scope of a Virtual Network Manager instance can span across tenants, although a separate approval flow is required to establish this scope.

First, add an intent for the desired scope from within the Virtual Network Manager instance by using the **Scope Connection** resource. Second, add an intent for the management of the Virtual Network Manager instance from the scope (subscription or management group) by using the **Network Manager Connection** resource. These resources contain a state to represent whether the associated scope was added to the scope of the Virtual Network Manager instance.

### Features

Features are scope access that you allow Azure Virtual Network Manager to manage. Azure Virtual Network Manager currently has two feature scopes: [connectivity](concept-connectivity-configuration.md) and [security admin](concept-security-admins.md). You can enable both feature scopes on the same Virtual Network Manager instance.

## Hierarchy

Azure Virtual Network Manager allows for management of your network resources in a hierarchy. A hierarchy means that you can have multiple Virtual Network Manager instances manage overlapping scopes, and the configurations within each Virtual Network Manager instance can also overlay one another.

For example, you can have the top-level [management group](../governance/management-groups/overview.md) as the scope for one Virtual Network Manager instance and have a child management group as the scope for a different Virtual Network Manager instance. When you have a configuration conflict between Virtual Network Manager instances that contain the same resource, the configuration from the Virtual Network Manager instance that has the higher scope is the one that's applied.

## Next steps

- Learn how to create an [Azure Virtual Network Manager instance](create-virtual-network-manager-portal.md).
- Learn about [network groups](concept-network-groups.md).
