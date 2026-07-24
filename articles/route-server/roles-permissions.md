---
title: Roles and permissions for Azure Route Server
titleSuffix: Azure Route Server
description: Learn about the roles and permissions required to create and manage Azure Route Server resources and understand Azure role-based access control RBAC requirements.
author: siddomala
ms.author: duau
ms.service: azure-route-server
ms.topic: concept-article
ms.date: 09/17/2025
---
# Roles and permissions for Azure Route Server

Azure Route Server requires specific roles and permissions to create and manage its underlying resources. This article explains the Azure role-based access control (RBAC) requirements and helps you configure appropriate permissions for your organization.

## Overview

Azure Route Server utilizes multiple underlying Azure resources during creation and management operations. Because of this dependency, it's essential to verify that users, service principals, and managed identities have the necessary permissions on all involved resources.

Understanding these permission requirements helps you:

- Plan role assignments for Route Server deployment
- Troubleshoot access-related issues
- Implement least-privilege access principles
- Create custom roles tailored to your organization's needs

## Azure built-in roles

Azure provides built-in roles that include the necessary permissions for Azure Route Server operations. You can assign these [Azure built-in roles](../role-based-access-control/built-in-roles.md) to users, groups, service principals, or managed identities.

### Network Contributor role

The [Network Contributor](../role-based-access-control/built-in-roles.md#network-contributor) built-in role provides comprehensive permissions for creating and managing Azure Route Server resources. This role includes all required permissions for:

- Creating Route Server instances
- Managing BGP peering configurations
- Configuring route exchange settings
- Monitoring and troubleshooting

For information about assigning roles, see [Steps to assign an Azure role](../role-based-access-control/role-assignments-steps.md).

## Custom roles

If the [Azure built-in roles](../role-based-access-control/built-in-roles.md) don't meet your organization's specific security requirements, you can create custom roles. Custom roles allow you to implement the principle of least privilege by granting only the minimum permissions required for specific tasks.

You can assign custom roles to users, groups, and service principals at management group, subscription, and resource group scopes. For detailed guidance, see [Steps to create a custom role](../role-based-access-control/custom-roles.md#steps-to-create-a-custom-role).

### Custom role considerations

When creating custom roles for Azure Route Server:

- Ensure users, service principals, and managed identities have the necessary permissions listed in the [Permissions](#permissions) section
- Test custom roles in a development environment before deploying to production
- Regularly review and update custom role permissions as Azure Route Server features evolve
- Document custom role purposes and permission assignments for your organization

To modify existing custom roles, see [Update a custom role](../role-based-access-control/custom-roles-portal.md#update-a-custom-role).

## Permissions

Azure Route Server requires specific permissions on underlying Azure resources. When creating or updating the following resources, ensure the appropriate permissions are assigned:

### Required permissions by resource

| Resource | Required Azure permissions |
|---|---|
| virtualHubs/ipConfigurations | Microsoft.Network/publicIPAddresses/join/action<br>Microsoft.Network/virtualNetworks/subnets/join/action |

### Other permission considerations

- **Public IP addresses**: Route Server requires permissions to create and associate public IP addresses
- **Virtual network subnets**: Access to join the RouteServerSubnet is essential for deployment

For more information about Azure networking permissions, see [Azure permissions for Networking](../role-based-access-control/permissions/networking.md) and [Virtual network permissions](../virtual-network/virtual-network-manage-subnet.md#permissions).

## Role assignment scope

When defining custom roles, you can specify role assignment scope at multiple levels: management group, subscription, resource group, and individual resources. To grant access, assign roles to users, groups, service principals, or managed identities at the appropriate scope.

### Scope hierarchy

These scopes follow a parent-child relationship structure, with each level providing more specific access control:

- **Management group**: Broadest scope, applies to multiple subscriptions
- **Subscription**: Applies to all resources within a subscription
- **Resource group**: Applies only to resources within a specific resource group  
- **Resource**: Most specific scope, applies to individual resources

The scope level you select determines how widely the role applies. For example, a role assigned at the subscription level cascades to all resources within that subscription, while a role assigned at the resource group level only applies to resources within that specific group.

For more information about scope levels, see [Scope levels](../role-based-access-control/scope-overview.md#scope-levels).

> [!NOTE]
> Allow sufficient time for [Azure Resource Manager cache](../role-based-access-control/troubleshooting.md) to refresh after role assignment changes.

## Related Azure services

For roles and permissions information for other Azure networking services, see the following articles:

- [Azure Application Gateway roles and permissions](../application-gateway/configuration-infrastructure.md)
- [Azure ExpressRoute roles and permissions](../expressroute/roles-permissions.md)
- [Azure Firewall roles and permissions](../firewall/roles-permissions.md)
- [Azure Virtual WAN roles and permissions](../virtual-wan/roles-permissions.md)
- [Managed NVA roles and permissions](../virtual-wan/roles-permissions.md#nva-resources)
- [Azure VPN Gateway roles and permissions](../vpn-gateway/roles-permissions.md)

## Related content

- [What is Azure Role Based Access](../role-based-access-control/overview.md)

- [Azure Role Based Access Control](/azure/role-based-access-control/role-assignments-list-portal)
