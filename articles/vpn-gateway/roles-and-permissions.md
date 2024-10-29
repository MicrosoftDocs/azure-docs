---
title: About VPN Gateway roles and permissions
titleSuffix: VPN Gateway
description: Learn about roles and permissions for VPN Gateway.
author: aybatra
ms.service: azure-vpn-gateway
ms.topic: conceptual
ms.date: 10/29/2024
ms.author: cherylmc

---
# About roles and permissions for VPN Gateway

The VPN Gateway utilizes multiple resources, such as virtual networks and IP addresses, during both creation and management operations.
Because of this, it's essential to verify permissions on all involved resources during these operations.

## Azure built-in roles

You can choose to assign [Azure built-in roles](../role-based-access-control/built-in-roles.md) to a user, group, service principal, or managed identity such as [Network contributor](../role-based-access-control/built-in-roles.md#network-contributor), which support all the required permissions for creating the gateway.
For more information, see [Steps to assign an Azure role](../role-based-access-control/role-assignments-steps.md)

## Custom roles

If the [Azure built-in roles](../role-based-access-control/built-in-roles.md) don't meet the specific needs of your organization, you can create your own custom roles.
Just like built-in roles, you can assign custom roles to users, groups, and service principals at management group, subscription, and resource group scopes.
For more information, see [Steps to create a custom role](../role-based-access-control/custom-roles.md#steps-to-create-a-custom-role)  

To ensure proper functionality, check your custom role permissions to confirm user service principals, and managed identities operating the VPN gateway have the necessary permissions.
To add any missing permissions listed here, see [Update a custom role](../role-based-access-control/custom-roles-portal.md#update-a-custom-role)

## Permissions

Depending on whether you're creating new resources or using existing ones, add the appropriate permissions from the following list:

**Permissions table**

|Resource | Resource status | Required Azure permissions |
|---|---|---|
| Subnet | Create new| Microsoft.Network/virtualNetworks/subnets/write |
| Subnet | Use existing| Microsoft.Network/virtualNetworks/subnets/join/action<br>Microsoft.Network/virtualNetworks/subnets/read   |
| IP addresses| Create new| Microsoft.Network/publicIPAddresses/write  |
| IP addresses  | Use existing| Microsoft.Network/publicIPAddresses/join/action<br>Microsoft.Network/publicIPAddresses/read  |

For more information, see [Azure permissions for Networking](../role-based-access-control/permissions/networking.md) and [Virtual network permissions](../virtual-network/virtual-network-manage-subnet.md#permissions)

## Roles scope

In the process of custom role definition, you can specify a role assignment scope at four levels: management group, subscription, resource group, and resources. To grant access, you assign roles to users, groups, service principals, or managed identities at a particular scope.

These scopes are structured in a parent-child relationship, with each level of hierarchy making the scope more specific. You can assign roles at any of these levels of scope, and the level you select determines how widely the role is applied.

For example, a role assigned at the subscription level can cascade down to all resources within that subscription, while a role assigned at the resource group level will only apply to resources within that specific group. Learn more about scope level
For more information, see [Scope levels](../role-based-access-control/scope-overview.md#scope-levels).

> [!NOTE]
> Allow sufficient time for [Azure Resource Manager cache](../role-based-access-control/troubleshooting.md#symptom-role-assignment-changes-are-not-being-detected) to refresh after role assignment changes.

## Next steps

[What is Azure Role Based Access](../role-based-access-control/overview.md)
[Azure Role Based Access Control](../role-based-access-control/role-assignments-list-portal.yml)
