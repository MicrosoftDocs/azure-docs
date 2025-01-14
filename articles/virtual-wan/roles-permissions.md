---
title: About virtual hub roles and permissions
titleSuffix: Azure Virtual WAN
description: Learn about roles and permissions for a Virtual WAN Hub.
author: siddomala
ms.service: azure-virtual-wan
ms.topic: conceptual
ms.date: 12/13/2024
ms.author: cherylmc

---
# About roles and permissions for Azure Virtual WAN

The Virtual WAN hub utilizes multiple underlying resources during both creation and management operations.
Because of this, it's essential to verify permissions on all involved resources during these operations.

## Azure built-in roles

You can choose to assign [Azure built-in roles](../role-based-access-control/built-in-roles.md) to a user, group, service principal, or managed identity such as [Network contributor](../role-based-access-control/built-in-roles.md#network-contributor), which support all the required permissions for creating resources related to Virtual WAN.

For more information, see [Steps to assign an Azure role](../role-based-access-control/role-assignments-steps.md).

## Custom roles

If the [Azure built-in roles](../role-based-access-control/built-in-roles.md) don't meet the specific needs of your organization, you can create your own custom roles.
Just like built-in roles, you can assign custom roles to users, groups, and service principals at management group, subscription, and resource group scopes.
For more information, see [Steps to create a custom role](../role-based-access-control/custom-roles.md#steps-to-create-a-custom-role)  .

To ensure proper functionality, check your custom role permissions to confirm user service principals, and managed identities interacting with Virtual WAN have the necessary permissions.
To add any missing permissions listed here, see [Update a custom role](../role-based-access-control/custom-roles-portal.md#update-a-custom-role).

The following custom roles are a few example roles you can create in your tenant if you don't want to leverage more generic built-in roles such as Network Contributor or Contributor. 

### Virtual WAN Administrator

The Virtual WAN Administrator role has the ability to perform all operations related to the Virtual Hub, including managing connections to Virtual WAN and configuring routing.

```
{
  "Name": "Virtual WAN Administrator",
  "IsCustom": true,
  "Description": "Can perform all operations related to the Virtual WAN, including managing connections to Virtual WAN and configuring routing in each hub.",
  "Actions": [
    "Microsoft.Network/virtualWans/*",
    "Microsoft.Network/virtualHubs/*",
    "Microsoft.Network/azureFirewalls/read",
    "Microsoft.Network/networkVirtualAppliances/*/read",
    "Microsoft.Network/securityPartnerProviders/*/read",
    "Microsoft.Network/expressRouteGateways/*",
    "Microsoft.Network/vpnGateways/*",
    "Microsoft.Network/p2sVpnGateways/*",
    "Microsoft.Network/virtualNetworks/peer/action"

  ],
  "NotActions": [],
  "DataActions": [],
  "NotDataActions": [],
  "AssignableScopes": [
    "/subscriptions/{subscriptionId1}",
    "/subscriptions/{subscriptionId2}"
  ]
}
```

### Virtual WAN Reader

The Virtual WAN reader role has the ability to view and monitor all Virtual WAN-related resources, but can't perform any updates.

```
{
  "Name": "Virtual WAN Reader",
  "IsCustom": true,
  "Description": "Can read and monitor all Virtual WAN resources, but cannot modify Virtual WAN resources.",
  "Actions": [
    "Microsoft.Network/virtualWans/*/read",
    "Microsoft.Network/virtualHubs/*/read",
    "Microsoft.Network/expressRouteGateways/*/read",
    "Microsoft.Network/vpnGateways/*/read",
    "Microsoft.Network/p2sVpnGateways/*/read"
    "Microsoft.Network/networkVirtualAppliances/*/read
  ],
  "NotActions": [],
  "DataActions": [],
  "NotDataActions": [],
  "AssignableScopes": [
    "/subscriptions/{subscriptionId1}",
    "/subscriptions/{subscriptionId2}"
  ]
}
```
## Required Permissions

Creating or updating Virtual WAN resources requires you to have the proper permission(s) to create that Virtual WAN resource type. In some scenarios, having permissions to create or update that resource type is sufficient. However, in many scenarios, updating a Virtual WAN resource that has a **reference** to another Azure resource requires you to have permissions over both the created resource **and** any referenced resources.

### Error Message

A user or service principal must have sufficient permissions to execute an operation on a Virtual WAN resource. If the user does not have sufficient permissions to perform the operation, the operation will fail with an error message similar to the one below.

|Error Code| Message|
|--|--|
|LinkedAccessCheckFailed| The client with object id 'xxx' does not have authorization to perform action 'xxx' over scope 'zzz resource' or the scope is invalid. For details on the required permissions, please visit 'zzz'. If access was recently granted, please refresh your credentials.|

> [!NOTE]
> A user or service principal may be missing multiple permissions needed to manage a Virtual WAN resource. The returned error message only references one missing permission. As a result, you may see a different  missing permission after you update the permissions assigned to your service principal or user.  

To fix this error, grant the user or service principal that is managing your Virtual WAN resource(s) the additional permission described in the error message and retry.

### Example 1

When a connection is created between a Virtual WAN hub and a spoke Virtual Network, Virtual WAN's control plane creates a Virutal Network peering between the Virtual WAN hub and your spoke Virtual Network. You can also specify the Virtual WAN route tables to which the Virtual Network connection is associating to or propagating to.

Therefore, to create a Virtual Network connection to the Virtual WAN hub, you must have the following permissions:

* Create a Hub Virtual Network connection (Microsoft.Network/virtualHubs/hubVirtualNetworkConnections/write)
* Create a Virtual Network peering with the spoke Virtual Network (Microsoft.Network/virtualNetworks/peer/action)
* Read the route table(s) that the Virtual Network connections are referencing (Microsoft.Network/virtualhubs/hubRouteTables/read)

If you want to associate an inbound or out-bound route map is associated with the Virtual Network connection, you need an additional permission:

* Read the route map(s) that is applied to the Virtual Network connection (Microsoft.Network/virtualHubs/routeMaps/read).

### Example 2

To create or modify routing intent, a routing intent resource is created with a reference to the next hop resources specified in the routing intent's routing policy. This means that to create or modify routing intent, you need permissions over any referenced Azure Firewall or Network Virtual Appliance resource(s).

If the next hop for a hub's private routing intent policy is a Network Virtual Appliance  and the next hop for a hub's internet policy is an Azure Firewall, creating or updating a routing intent resource requires the following permisisons.

* Create routing intent resource. (Microsoft.Network/virtualhubs/routingIntents/write)
* Reference (read) the Network Virtual Appliance resource (Microsoft.Network/networkVirtualAppliances/read)
* Reference (read) the Azure Firewall resource (Microsoft.Network/azureFirewalls)

In this example, you do **not** need permissions to read Microsoft.Network/securityPartnerProviders resources because the routing intent configured does not reference a third-party security provider resource.

## Additional permissions required due to referenced resources

The following section describes the set of possible permisisons that are needed to create or modify Virtual WAN resources.

Depending on your Virtual WAN configuration, the user or service principal that is managing your Virtual WAN deployments may need all, a subset or none of the below permissions over referenced resources.

### Virtual hub resources

|Resource | Required Azure permissions due to resource references |
|---|---|
| virtualHubs | Microsoft.Network/virtualNetworks/peer/action <br>Microsoft.Network/virtualWans/join/action  |
| virtualHubs/hubVirtualNetworkConnections | Microsoft.Network/virtualNetworks/peer/action <br>Microsoft.Network/virtualHubs/routeMaps/read <br>Microsoft.Network/virtualHubs/hubRouteTables/read |
| virtualHubs/bgpConnections | Microsoft.Network/virtualHubs/hubVirtualNetworkConnections/read |
| virtualHubs/hubRouteTables  |  Microsoft.Network/securityPartnerProviders/read <br>Microsoft.Network/virtualHubs/hubVirtualNetworkConnections/read <br>Microsoft.Network/networkVirtualAppliances/read <br>Microsoft.Network/azurefirewalls/read |
| virtualHubs/routingIntent |  Microsoft.Network/securityPartnerProviders/read <br>Microsoft.Network/networkVirtualAppliances/read <br>Microsoft.Network/azurefirewalls/read |

### ExpressRoute gateway resources

|Resource | Required Azure permissions due to resource references |
|---|---|
| expressroutegateways | Microsoft.Network/virtualHubs/read  <br>Microsoft.Network/virtualHubs/hubRouteTables/read <br>Microsoft.Network/virtualHubs/routeMaps/read <br>Microsoft.Network/expressRouteGateways/expressRouteConnections/read <br>Microsoft.Network/expressRouteCircuits/join/action |
| expressRouteGateways/expressRouteConnections | Microsoft.Network/virtualHubs/hubRouteTables/read <br>Microsoft.Network/virtualHubs/routeMaps/read <br>Microsoft.Network/expressRouteCircuits/join/action | 


### VPN resources

|Resource | Required Azure permissions due to resource references |
|---|---|
| p2svpngateways  | Microsoft.Network/virtualHubs/read  <br>Microsoft.Network/virtualHubs/hubRouteTables/read <br>Microsoft.Network/virtualHubs/routeMaps/read <br>Microsoft.Network/vpnServerConfigurations/read  |
| p2sVpnGateways/p2sConnectionConfigurations  | Microsoft.Network/virtualHubs/hubRouteTables/read <br>Microsoft.Network/virtualHubs/routeMaps/read | 
| vpnGateways  | Microsoft.Network/virtualHubs/read  <br>Microsoft.Network/virtualHubs/hubRouteTables/read <br>Microsoft.Network/virtualHubs/routeMaps/read <br>Microsoft.Network/vpnGateways/vpnConnections/read | 
| vpnsites  | Microsoft.Network/virtualWans/read  | 
| vpnGateways/vpnConnections | Microsoft.Network/virtualHubs/read <br>Microsoft.Network/virtualHubs/hubRouteTables/read <br>Microsoft.Network/virtualHubs/routeMaps/read |

### NVA resources

NVAs (Network Virtual Appliances) in Virtual WAN are typically deployed through Azure managed applications or directly via NVA orchestration software. For more information on how to properly assign permissions to managed applications or NVA orchestration software, see instructions [here](https://aka.ms/nvadeployment).

|Resource | Required Azure permissions due to resource references |
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
