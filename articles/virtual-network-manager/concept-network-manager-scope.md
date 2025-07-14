---
title: "Azure Virtual Network Manager Scopes: Understand and Work with Them"
description: Learn how Azure Virtual Network Manager scopes simplify virtual network management. Discover their role, benefits, and key features.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: concept-article
ms.date: 07/11/2025
---

# Understand and work with Azure Virtual Network Manager scopes

Azure Virtual Network Manager simplifies the management of virtual networks by organizing resources into scopes, enabling efficient configuration and control. This article explains how scopes work, their role in managing resources, and how they interact with Azure's hierarchical structure. You also learn about key concepts like network groups, configurations, and features, as well as how to manage cross-tenant scopes and resolve configuration conflicts.

## Azure Virtual Network Manager resource overview

An Azure Virtual Network Manager instance, or network manager, includes the following resources:

- [**Network groups**](concept-network-groups.md): Logical containers for virtual networks or subnets. You apply Azure Virtual Network Manager configurations for connectivity, security, and routing settings onto these network groups to implement desired policies at scale.

- **Configurations**: Collections of settings that can be applied at scale across network resources contained in your network groups. Azure Virtual Network Manager currently provides three types of configurations:
  - [*Connectivity configurations*](concept-connectivity-configuration.md) to create network topologies.
  - [*Security admin configurations*](concept-security-admins.md) to create collections of highly enforced security rules that you can apply across virtual networks.
  - [*Routing configurations*](concept-user-defined-route.md) to create collections of common routing settings across virtual networks and their subnets.

## Scope

A *scope* within Azure Virtual Network Manager represents the boundary of management groups and/or subscriptions that contains the resources that Azure Virtual Network Manager can view and manage. The value for the scope can include multiple management groups and/or multiple subscriptions. To learn how to manage your resource hierarchy, see [Azure management groups](../governance/management-groups/overview.md). When you select a management group as the scope, all child subscriptions and their resources are included within the scope.

> [!NOTE]
> You can't create multiple network managers with an overlapping scope of the same hierarchy and the same features selected.
>
> When you're specifying a scope at the management group level, you need to register the Azure Virtual Network provider at the management group scope before you deploy a network manager. This process is included as part of [Creating a network manager in the Azure portal](./create-virtual-network-manager-portal.md), but not with programmatic methods such as the Azure CLI and Azure PowerShell. [Learn more about registering providers at the management group scope](/rest/api/resources/providers/register-at-management-group-scope).

### How scope applicability works

When you deploy configurations, the network manager applies those settings only to resources within its scope. If you try to add a resource to a network group that's out of scope, such as a virtual network that doesn't belong to a management or subscription in the network manager's scope, it's added to the network group to represent your intent. However, the network manager doesn't actually apply configurations targeting that network group to that external virtual network.

When you create a network manager, you define its scope. You can update the scope of the network manager after its creation. Scope updates trigger an automatic, scope-wide reevaluation. If subscriptions or management groups are added to the scope, resources within that scope addition can automatically receive configuration settings. If subscriptions or management groups are removed from the scope, resources within that scope removal can automatically lose configuration settings.

### Managing cross-tenant scope

The scope of a network manager can span across tenants, although a separate approval flow is required to establish this scope. Learn more about [cross-tenant scopes](concept-cross-tenant.md).

### Features

Features are the [configuration types](#azure-virtual-network-manager-resource-overview) that you enable your network manager to deploy upon its scope. You can enable any number of features on the same network manager. If you don't enable any features, the network manager can't create or deploy any configurations, but it still contains the [IP address management](concept-ip-address-management.md) feature and [network verifier](concept-virtual-network-verifier.md) tool.

## Hierarchy

Azure Virtual Network Manager allows for management of your network resources in a hierarchy. A hierarchy means you can have multiple network managers with overlapping scopes, and subsequently overlapping configurations.

For example, one network manager can have the top-level [management group](../governance/management-groups/overview.md) as its scope, while another network manager has a child management group as its scope. When you have a configuration conflict between network managers containing the same resource, the configuration from the network manager with the higher scope is applied.

## Next steps

- Learn more about [Azure Virtual Network Manager](overview.md).
- Learn how to [create an Azure Virtual Network Manager instance](create-virtual-network-manager-portal.md).
- Learn about [network groups](concept-network-groups.md).
