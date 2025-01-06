---
title: About route server roles and permissions
titleSuffix: Azure Route Server
description: Learn about roles and permissions for Azure Route Server
author: siddomala
ms.author: halkazwini
ms.service: azure-route-server
ms.topic: concept-article
ms.date: 12/13/2024
---

---
# About roles and permissions for Azure Route Server

Azure Route Server utilizes multiple underlying resources during both creation and management operations.
Because of this, it's essential to verify permissions on all involved resources during these operations.

## Azure built-in roles

You can choose to assign [Azure built-in roles](../role-based-access-control/built-in-roles.md) to a user, group, service principal, or managed identity such as [Network contributor](../role-based-access-control/built-in-roles.md#network-contributor), which support all the required permissions for creating the gateway.
For more information, see [Steps to assign an Azure role](../role-based-access-control/role-assignments-steps.md).

## Custom roles

If the [Azure built-in roles](../role-based-access-control/built-in-roles.md) don't meet the specific needs of your organization, you can create your own custom roles.
Just like built-in roles, you can assign custom roles to users, groups, and service principals at management group, subscription, and resource group scopes.
For more information, see [Steps to create a custom role](../role-based-access-control/custom-roles.md#steps-to-create-a-custom-role)  .

To ensure proper functionality, check your custom role permissions to confirm user service principals, and managed identities operating the VPN gateway have the necessary permissions.
To add any missing permissions listed here, see [Update a custom role](../role-based-access-control/custom-roles-portal.md#update-a-custom-role).

## Permissions

When creating or updating the resources below, add the appropriate permissions from the following list:

|Resource | Required Azure permissions |
|---|---|
| virtualHubs/ipConfigurations  | Microsoft.Network/publicIPAddresses/join/action <br>Microsoft.Network/virtualNetworks/subnets/join/action  |

For more information, see [Azure permissions for Networking](../role-based-access-control/permissions/networking.md) and [Virtual network permissions](../virtual-network/virtual-network-manage-subnet.md#permissions).

## Roles scope

In the process of custom role definition, you can specify a role assignment scope at four levels: management group, subscription, resource group, and resources. To grant access, you assign roles to users, groups, service principals, or managed identities at a particular scope.

These scopes are structured in a parent-child relationship, with each level of hierarchy making the scope more specific. You can assign roles at any of these levels of scope, and the level you select determines how widely the role is applied.

For example, a role assigned at the subscription level can cascade down to all resources within that subscription, while a role assigned at the resource group level will only apply to resources within that specific group. Learn more about scope level
For more information, see [Scope levels](../role-based-access-control/scope-overview.md#scope-levels).

> [!NOTE]
> Allow sufficient time for [Azure Resource Manager cache](../role-based-access-control/troubleshooting.md) to refresh after role assignment changes.

## Additional services

To view roles and permissions for other services, see the following links:

- [Azure Application Gateway](../application-gateway/configuration-infrastructure.md)

- [Azure ExpressRoute](../expressroute/roles-permissions.md) 

- [Azure Firewall](../firewall/roles-permissions.md) 

- [Azure Virtual WAN](../virtual-wan/roles-permissions.md)

- [Managed NVA](../virtual-wan/roles-permissions.md#nva-resources)

- [Azure VPN Gateway](../vpn-gateway/roles-permissions.md)

## Related content

- [What is Azure Role Based Access](../role-based-access-control/overview.md)

- [Azure Role Based Access Control](../role-based-access-control/role-assignments-list-portal.yml)
