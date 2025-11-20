---
title: 'Cross-tenant support in Azure Virtual Network Manager'
description: Learn how cross-tenant support in Azure Virtual Network Manager helps manage virtual networks across multiple tenants. Explore scenarios and benefits.
author: mbender-ms    
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: concept-article
ms.date: 07/11/2025
---


# Cross-Tenant Support in Azure Virtual Network Manager

Cross-tenant support in Azure Virtual Network Manager lets organizations centrally manage virtual networks across multiple tenants and their subscriptions. This article describes scenarios, benefits, and how to establish cross-tenant connections.

## Overview of cross-tenant support

Cross-tenant support in Azure Virtual Network Manager allows you to add subscriptions and management groups from other tenants to your Azure Virtual Network Manager instance, or network manager. You can establish cross-tenant support in your network manager by establishing a two-way connection between the network manager and target tenants. Once connected, the network manager can deploy configurations to virtual networks across those connected cross-tenant subscriptions and management groups.

Cross-tenant support assists organizations that fit the following scenarios:

- **Acquisitions**: In instances where organizations merge through acquisition and have multiple tenants, cross-tenant support lets a central network manager manage virtual networks across the tenants.

- **Managed service provider**: In managed service provider scenarios, an organization can manage the resources of other organizations. Cross-tenant support allows central management of virtual networks by a central service provider for multiple clients.

## Establish cross-tenant connection 

Establishing cross-tenant support begins with creating a cross-tenant connection between two tenants. Cross-tenant support requires two-way consent -- one from the network manager and the other from the target tenant's virtual network manager hub. The connections are:

| Connection Type | Description |
|----------------|-------------|
| Network manager connection | You create a cross-tenant connection from your network manager. The connection includes the exact scope of the tenant's subscriptions and management groups to manage in your network manager. |
| Virtual network manager hub connection | The tenant creates a cross-tenant connection from their virtual network manager hub. This connection includes the exact same scope of subscriptions and management groups managed by the central network manager. |

Once both cross-tenant connections exist and the scopes are exactly the same, a true connection is established. Administrators can use their network manager to add cross-tenant resources to their [network groups](concept-network-groups.md) and to manage virtual networks included in the connection scope. Configurations can then be deployed onto those cross-tenant virtual networks.

You can establish and maintain a cross-tenant connection only when both connections from each party exist. When one of the connections is removed, the cross-tenant connection is broken. If you need to delete a cross-tenant connection, follow these steps:

- Remove the cross-tenant connection from the network manager side through the **Cross-tenant connections** settings in the Azure portal.
- Remove the cross-tenant connection from the tenant side through the *Virtual network manager hub*'s **Cross-tenant connections** settings in the Azure portal.

> [!NOTE] 
> Once a cross-tenant connection is removed from either side, the network manager can't view or manage the tenant's resources under that former connection's scope.

## Connection states
The resources required to create the cross-tenant connection have a state that represents whether the associated scope is added to the network manager scope. Possible state values include:

| State | Description |
|-------|-------------|
| Connected | Both the network manager connection and the tenant-side virtual network manager hub connection exist with matching scopes. The cross-tenant scope is added to the network manager's scope. |
| Pending | One of the two connection resources isn't created. The cross-tenant scope isn't yet added to the network manager's scope. |
| Conflict | A network manager with this subscription or management group defined with the cross-tenant scope already exists. Two network managers with the same scope access can't directly manage the same scope, so this subscription or management group can't be added to the network manager scope. To fix the conflict, remove the cross-tenant scope from the conflicting network manager's scope and recreate the appropriate connection resource. |
| Revoked | The cross-tenant scope was at one time added to the network manager's scope, but the removal of a connection resource caused the cross-tenant connection to be revoked. |

*Connected* is the only state that represents that the cross-tenant scope is added to the network manager scope.

## Required permissions 

To use cross-tenant connections in Azure Virtual Network Manager, users need the following permissions: 

- The administrator of the central management tenant has a guest account in the target managed tenant. 

- The administrator guest account has *Network Contributor* permissions applied at the appropriate scope level (management group, subscription, or virtual network).

Need help setting up permissions? Check out how to [add guest users in the Azure portal](../active-directory/external-identities/b2b-quickstart-add-guest-users-portal.md) and how to [assign user roles to resources in Azure portal](/azure/role-based-access-control/role-assignments-portal) 

## Known limitations 

Currently, cross-tenant virtual networks can only be [added to network groups manually](concept-network-groups.md#static-membership). Adding cross-tenant virtual networks to network groups conditionally through Azure Policy is a future capability.

## Next steps 
- Learn how to [configure a cross-tenant connection with Azure Virtual Network Manager using the Azure portal](how-to-configure-cross-tenant-portal.md).
- Learn how to [create an Azure Virtual Network Manager](./create-virtual-network-manager-portal.md) instance.
- Check out the [Azure Virtual Network Manager FAQ](faq.md).
