---
title: About virtual hub roles and permissions
titleSuffix: Azure Virtual WAN
description: Learn about roles and permissions for a Virtual WAN Hub.
author: siddomala
ms.service: azure-virtual-wan
ms.topic: concept-article
ms.date: 12/13/2024
ms.author: cherylmc

---
# About roles and permissions for Azure Virtual WAN

The Virtual WAN hub utilizes multiple underlying resources during both creation and management operations.
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

### Virtual hub resources

|Resource | Required Azure permissions |
|---|---|
| virtualHubs | Microsoft.Network/virtualNetworks/peer/action <br>Microsoft.Network/virtualWans/join/action  |
| virtualHubs/hubVirtualNetworkConnections | Microsoft.Network/virtualNetworks/peer/action <br>Microsoft.Network/virtualHubs/routeMaps/read <br>Microsoft.Network/virtualHubs/hubRouteTables/read |
| virtualHubs/bgpConnections | Microsoft.Network/virtualHubs/hubVirtualNetworkConnections/read |
| virtualHubs/hubRouteTables  |  Microsoft.Network/securityPartnerProviders/read <br>Microsoft.Network/virtualHubs/hubVirtualNetworkConnections/read <br>Microsoft.Network/networkVirtualAppliances/read <br>Microsoft.Network/azurefirewalls/read |
| virtualHubs/routingIntent |  Microsoft.Network/securityPartnerProviders/read <br>Microsoft.Network/networkVirtualAppliances/read <br>Microsoft.Network/azurefirewalls/read |

### ExpressRoute gateway resources

|Resource | Required Azure permissions |
|---|---|
| expressroutegateways | Microsoft.Network/virtualHubs/read  <br>Microsoft.Network/virtualHubs/hubRouteTables/read <br>Microsoft.Network/virtualHubs/routeMaps/read <br>Microsoft.Network/expressRouteGateways/expressRouteConnections/read <br>Microsoft.Network/expressRouteCircuits/join/action |
| expressRouteGateways/expressRouteConnections | Microsoft.Network/virtualHubs/hubRouteTables/read <br>Microsoft.Network/virtualHubs/routeMaps/read <br>Microsoft.Network/expressRouteCircuits/join/action | 


### VPN resources

|Resource | Required Azure permissions |
|---|---|
| p2svpngateways  | Microsoft.Network/virtualHubs/read  <br>Microsoft.Network/virtualHubs/hubRouteTables/read <br>Microsoft.Network/virtualHubs/routeMaps/read <br>Microsoft.Network/vpnServerConfigurations/read  |
| p2sVpnGateways/p2sConnectionConfigurations  | Microsoft.Network/virtualHubs/hubRouteTables/read <br>Microsoft.Network/virtualHubs/routeMaps/read | 
| vpngateways  | Microsoft.Network/virtualHubs/read  <br>Microsoft.Network/virtualHubs/hubRouteTables/read <br>Microsoft.Network/virtualHubs/routeMaps/read <br>Microsoft.Network/vpnGateways/vpnConnections/read | 
| vpnsites  | Microsoft.Network/virtualWans/read  | 

### NVA resources

NVAs (Network Virtual Appliances) in Virtual WAN are typically deployed through Azure managed applications or directly via NVA orchestration software. For more information on how to properly assign permissions to managed applications or NVA orchestration software, see instructions [here](https://aka.ms/nvadeployment).

|Resource | Required Azure permissions |
|---|---|
| networkVirtualAppliances  | Microsoft.Network/virtualHubs/read  |
| networkVirtualAppliances/networkVirtualApplianceConnections  | Microsoft.Network/virtualHubs/routeMaps/read <br>Microsoft.Network/virtualHubs/hubRouteTables/read | 


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

- [Azure Route Server](../route-server/roles-permissions.md)

- [Azure VPN Gateway](../vpn-gateway/roles-permissions.md)

## Next steps

- [What is Azure Role Based Access](../role-based-access-control/overview.md)

- [Azure Role Based Access Control](../role-based-access-control/role-assignments-list-portal.yml)
