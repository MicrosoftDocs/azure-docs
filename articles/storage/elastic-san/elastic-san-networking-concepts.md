---
title: Azure Elastic SAN networking Preview overview
description: An overview of Azure Elastic SAN Preview networking options, including storage service endpoints, private endpoints, and iSCSI.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 05/08/2023
ms.author: rogarana
ms.subservice: elastic-san
ms.custom: 
---

# Elastic SAN Preview networking

Azure Elastic storage area network (SAN) preview allows you to secure and control the level of access to your Elastic SAN volumes that your applications and enterprise environments require. This article describes the options for allowing users and applications access to Elastic SAN Preview volumes from an Azure virtual network or an on-premises network.

Volume groups can be configured to allow access only from endpoints on specific virtual network subnets. The allowed subnets may belong to a virtual network in the same subscription, or those in a different subscription, including subscriptions belonging to a different Azure Active Directory tenant. In hybrid environments, on-premises applications can access the Elastic SAN volumes indirectly over a VPN or ExpressRoute connection to the virtual network, depending on the configuration.

There are two types of virtual network endpoints you can configure to allow access to an Elastic SAN volume group:

- [Azure Storage service endpoints](#azure-storage-service-endpoints)
- [Private endpoints](#private-endpoints)

To decide which option is best for your use case, see [Compare Private Endpoints and Service Endpoints](../../virtual-network/vnet-integration-for-azure-services.md#compare-private-endpoints-and-service-endpoints).

Network rules can then be configured to further control access to your Elastic SAN volume group. Once the endpoints and network rules have been configured, clients can connect to volumes in the group to process their workloads.

## Azure Storage service endpoints

Virtual Network (VNet) service endpoints provide secure and direct connectivity to Azure services over an optimized route over the Azure backbone network. Service endpoints allow you to secure your critical Azure service resources to only your virtual networks. Service endpoints enable private IP addresses in the VNet to reach the endpoint of an Azure service without needing a public IP address on the VNet.

> [!IMPORTANT]
> Microsoft recommends using Azure Private Link instead of service endpoints. Private Link offers better capabilities in terms of privately accessing PaaS from on-premises, built-in data-exfiltration protection and mapping a service to a Private IP address in your own network. For more information, see [Azure Private Link](../../private-link/private-link-overview.md).  

To use a [Service endpoint](../../virtual-network/virtual-network-service-endpoints-overview.md) with your Elastic SAN, you must enable it within the virtual network from which you want to grant access. The service endpoint routes traffic from the virtual network through an optimal path to the Azure Storage service. The identities of the subnet and the virtual network are also transmitted with each request. Administrators can then configure network rules for the SAN that allow requests to be received from specific subnets in a virtual network. Clients granted access via these network rules must continue to meet the authorization requirements of the Elastic SAN to access the data.

### Available virtual network regions

Cross-region service endpoints for Azure Storage became generally available in April of 2023. As a result, service endpoints for Azure Storage work between virtual networks and service instances in any region. With cross-region service endpoints, subnets will no longer use a public IP address to communicate with any storage account. Instead, all the traffic from subnets to storage accounts will use a private IP address as a source IP. As a result, any storage accounts that use IP network rules to permit traffic from those subnets will no longer have an effect.

To use cross-region service endpoints, it might be necessary to delete existing **Microsoft.Storage** endpoints and recreate them as cross-region (**Microsoft.Storage.Global**).

## Private endpoints

Azure Private Link enables you to access an Elastic SAN volume group securely over a [private endpoint](../../private-link/private-endpoint-overview.md) from a virtual network. The private endpoint uses a separate set of IP addresses from the VNet address space for each volume group. Traffic between your virtual network and the service traverses the Microsoft backbone network, eliminating the risk of exposing your service to the public internet.

Using a private endpoint has several advantages over using service endpoints, including:

- The scope of the endpoint configuration is restricted to selected instances of just your volume groups - not all storage instances for all customers.
- Built-in data exfiltration protection
- Private Access to your Elastic SAN volumes from on-premises

For a complete comparison of private endpoints to service endpoints, see [Compare Private Endpoints and Service Endpoints](../../virtual-network/vnet-integration-for-azure-services.md#compare-private-endpoints-and-service-endpoints).

## Virtual network rules

You can create virtual network rules for volume groups configured with service endpoints. You don't need network rules to allow traffic from a private endpoint since the storage firewall only controls access through public endpoints.

Each volume group supports up to 200 virtual network rules. If you delete a subnet that has been included in a network rule, it will be removed from the network rules for the volume group. If you create a new subnet with the same name, it won't have access to the volume group. To allow access, you must explicitly authorize the new subnet in the network rules for the volume group.

## Client connections

If a connection between a virtual machine (VM) and an Elastic SAN volume is lost, the connection will retry for 90 seconds until terminating. Losing a connection to an Elastic SAN volume won't cause the VM to restart.

## Next steps

[Configure Elastic SAN networking Preview](elastic-san-networking.md)
