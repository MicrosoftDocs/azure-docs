---
title: Azure Elastic SAN networking Preview overview
description: An overview of Azure Elastic SAN Preview networking options, including storage service endpoints, private endpoints, and iSCSI.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 05/07/2023
ms.author: rogarana
ms.subservice: elastic-san
ms.custom: 
---

# Networking options for Elastic SAN Preview

Azure Elastic storage area network (SAN) preview allows you to secure and control the level of access to your Elastic SAN volumes that your applications and enterprise environments demand, based on the type and subset of networks or resources used. When network rules are configured, only applications requesting data over the specified set of networks or through the specified set of Azure resources can access an Elastic SAN Preview. Access to your SAN's volumes are limited to resources in subnets in the same Azure Virtual Network that your SAN's volume group is configured with.

Volume groups are configured to allow access only from specific subnets. The allowed subnets may belong to a virtual network in the same subscription, or those in a different subscription, including subscriptions belonging to a different Azure Active Directory tenant.

There are two ways to configure virtual network access to an Elastic SAN volume group:

- [Azure Storage service endpoints](#azure-storage-service-endpoints)
- [Private endpoints](#private-endpoints)

To decide which option is best for your use case, see [Compare Private Endpoints and Service Endpoints](../../virtual-network/vnet-integration-for-azure-services.md#compare-private-endpoints-and-service-endpoints).

## Azure Storage service endpoints

You must enable a [Service endpoint](../../virtual-network/virtual-network-service-endpoints-overview.md) for Azure Storage within the virtual network. The service endpoint routes traffic from the virtual network through an optimal path to the Azure Storage service. The identities of the subnet and the virtual network are also transmitted with each request. Administrators can then configure network rules for the SAN that allow requests to be received from specific subnets in a virtual network. Clients granted access via these network rules must continue to meet the authorization requirements of the Elastic SAN to access the data.

In your virtual network, enable the Storage service endpoint on your subnet. This ensures traffic is routed optimally to your Elastic SAN. To enable a service endpoint for Azure Storage, you must have the appropriate permissions for the virtual network. This operation can be performed by a user that has been given permission to the Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftnetwork). Permission for this action is included in the Elastic SAN Network Admin role, but can also be granted via a custom Azure role. An Elastic SAN and the virtual networks granted access may be in different subscriptions, including subscriptions that are a part of a different Azure AD tenant.

### Available virtual network regions

Cross-region service endpoints for Azure Storage became generally available in April of 2023. As a result, service endpoints for Azure Storage work between virtual networks and service instances in any region. With cross-region service endpoints, subnets will no longer use a public IP address to communicate with any storage account. Instead, all the traffic from subnets to storage accounts will use a private IP address as a source IP. As a result, any storage accounts that use IP network rules to permit traffic from those subnets will no longer have an effect.

To use cross-region service endpoints, it might be necessary to delete existing **Microsoft.Storage** endpoints and recreate them as cross-region (**Microsoft.Storage.Global**).

## Private endpoints

(private endpoint info here)

## Virtual network rules

You can manage virtual network rules for volume groups through the Azure portal, PowerShell, or CLI.

Each volume group supports up to 200 virtual network rules.

> [!IMPORTANT]
> If you delete a subnet that has been included in a network rule, it will be removed from the network rules for the volume group. If you create a new subnet with the same name, it won't have access to the volume group. To allow access, you must explicitly authorize the new subnet in the network rules for the volume group.

## Client connections

If a connection between a virtual machine (VM) and an Elastic SAN volume is lost, the connection will retry for 90 seconds until terminating. Losing a connection to an Elastic SAN volume won't cause the VM to restart.

## Next steps

[Configure Elastic SAN networking Preview](elastic-san-networking.md)
