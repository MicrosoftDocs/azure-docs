---
title: 'Cross-tenant support in Azure Virtual Network Manager'
description: Learn how cross-tenant support in Azure Virtual Network Manager helps manage virtual networks across multiple tenants. Explore scenarios and benefits.
author: mbender-ms    
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: concept-article
ms.date: 05/06/2025
---


# Cross-Tenant Support in Azure Virtual Network Manager

Cross-tenant support in Azure Virtual Network Manager enables organizations to centrally manage virtual networks across multiple tenants and subscriptions. This article describes scenarios, benefits, and how to establish cross-tenant connections.

## Overview of cross-tenant support

Cross-tenant support in Azure Virtual Network Manager allows you to add subscriptions or management groups from other tenants to your network manager. This is done by establishing a two-way connection between the network manager and target tenants. Once connected, the central manager can deploy connectivity and/or security admin rules to virtual networks across those connected subscriptions or management groups. 

This support assists organizations that fit the following scenarios: 

- Acquisitions – In instances where organizations merge through acquisition and have multiple tenants, cross tenant support allows a central network manager to manage virtual networks across the tenants. 

- Managed service provider – In managed service provider scenarios, an organization can manage the resources of other organizations. Cross-tenant support allows central management of virtual networks by a central service provider for multiple clients. 

## Establish cross-tenant connection 

Establishing cross-tenant support begins with creating a cross tenant connection between two tenants. Cross-tenant support requires two-way consent--one from the network manager, the other from the target tenant's virtual network manager hub. The connections are as follows:

| Connection Type | Description |
|----------------|-------------|
| Network manager connection | You create a cross-tenant connection from your network manager. The connection includes the exact scope of the tenant's subscriptions or management groups to manage in your network manager. |
| Virtual network manager hub connection | The tenant creates a cross-tenant connection from their virtual network manager hub. This connection includes the scope of subscriptions or management groups managed the central network manager. |

Once both cross-tenant connections exist and the scopes are exactly the same, a true connection is established. Administrators can use their network manager to add cross-tenant resources to their [network groups](concept-network-groups.md) and to manage virtual networks included in the connection scope. Existing connectivity and/or security admin rules are applied to the resources based on existing configurations.

A cross-tenant connection can only be established and maintained when both objects from each party exist. When one of the connections is removed, the cross-tenant connection is broken. If you need to delete a cross-tenant connection, you perform the following steps:

- Remove cross-tenant connection from the network manager side via Cross-tenant connections settings in the Azure portal.
- Remove cross-tenant connection from the tenant side via Virtual network manager hub's Cross-tenant connections settings in the Azure portal.

> [!NOTE] 
> Once a connection is removed from either side, the network manager can't view or manage the tenant's resources under that former connection's scope.

## Connection states
The resources required to create the cross-tenant connection contain a state, which represents whether the associated scope is added to the Network Manager scope. Possible state values include:

| State | Description |
|-------|-------------|
| Connected | Both the Scope Connection and Network Manager Connection resources exist. The scope is added to the Network Manager's scope. |
| Pending | One of the two approval resources isn't created. The scope isn't added to the Network Manager's scope yet. |
| Conflict | There's already a network manager with this subscription or management group defined within its scope. Two network managers with the same scope access can't directly manage the same scope, therefore this subscription/management group can't be added to the Network Manager scope. To resolve the conflict, remove the scope from the conflicting network manager's scope and recreate the connection resource. |
| Revoked | The scope was at one time added to the Network Manager scope, but the removal of an approval resource caused revocation. |

The only state that represents the scope is added to the Network Manager scope is 'Connected'.

## Required permissions 

To use cross-tenant connection in Azure Virtual Network Manager, users need the following permissions: 

- Administrator of central management tenant has guest account in target managed tenant. 

- Administrator guest account has *Network Contributor* permissions applied at appropriate scope level(Management group, subscription, or virtual network). 

Need help with setting up permissions? Check out how to [add guest users in the Azure portal](../active-directory/external-identities/b2b-quickstart-add-guest-users-portal.md), and how to [assign user roles to resources in Azure portal](../role-based-access-control/role-assignments-portal.yml) 

## Known limitations 

Currently, cross-tenant virtual networks can only be [added to network groups manually](concept-network-groups.md#group-membership). Adding cross-tenant virtual networks to network groups dynamically through Azure Policy is a future capability. 

## Next steps 
- Learn how to [configure a cross-tenant connection with Azure Virtual Network Manager using the Azure portal](how-to-configure-cross-tenant-portal.md)
- Check out the [Azure Virtual Network Manager FAQ](faq.md)
