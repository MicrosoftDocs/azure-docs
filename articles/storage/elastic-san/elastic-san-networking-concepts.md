---
title: Azure Elastic SAN networking Preview overview
description: An overview of Azure Elastic SAN Preview networking options, including storage service endpoints, private endpoints, and iSCSI.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 05/10/2023
ms.author: rogarana
ms.subservice: elastic-san
ms.custom: 
---

# Elastic SAN Preview networking

Azure Elastic storage area network (SAN) preview allows you to secure and control the level of access to your Elastic SAN volumes that your applications and enterprise environments require. This article describes the options for allowing users and applications access to Elastic SAN volumes from an [Azure virtual network infrastructure](../../virtual-network/vnet-integration-for-azure-services.md).

Elastic SAN volume groups can be configured to only allow access over specific endpoints on specific virtual network subnets. The allowed subnets may belong to a virtual network in the same subscription, or those in a different subscription, including subscriptions belonging to a different Azure Active Directory tenant. Depending on the configuration, applications on peered virtual networks or on-premises networks connected by a VPN or ExpressRoute can also access volumes in the group.

There are two types of virtual network endpoints you can configure to allow access to an Elastic SAN volume group:

- [Azure Storage service endpoints](#azure-storage-service-endpoints)
- [Private endpoints](#private-endpoints)

To decide which option is best for your use case, see [Compare Private Endpoints and Service Endpoints](../../virtual-network/vnet-integration-for-azure-services.md#compare-private-endpoints-and-service-endpoints).

After configuring endpoints, network rules can be configured to further control access to your Elastic SAN volume group. Once the endpoints and network rules have been configured, clients can connect to volumes in the group to process their workloads.

## Azure Storage service endpoints

[Azure Virtual Network (VNet) service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md) provide secure and direct connectivity to Azure services using an optimized route over the Azure backbone network. Service endpoints allow you to secure your critical Azure service resources to only your specific virtual networks.

> [!IMPORTANT]
> Microsoft recommends using Azure Private Link instead of service endpoints. Private Link offers better capabilities in terms of privately accessing PaaS services from on-premises, built-in data exfiltration protection and mapping a service to a Private IP address in your own network. For more information, see [Azure Private Link](../../private-link/private-link-overview.md).  

Service endpoints enable private IP addresses in the virtual network to reach the endpoint of an Azure service without needing a public IP address on the virtual network. The service endpoint routes traffic from the virtual network over an optimal path to the Azure Storage service. The identities of the subnet and the virtual network are also transmitted with each request. Administrators can then configure network rules for the volume group that allow requests to be received from specific subnets in a virtual network.

To use a service endpoint with your Elastic SAN, you must enable it within the virtual network where you want to grant access. The service endpoint names for Azure Storage are:

- **Microsoft.Storage** - classic Azure Storage endpoints
- **Microsoft.Storage.Global** - new cross-region Azure Storage endpoints

For details on how to configure service endpoints, see [Enable Storage service endpoint](elastic-san-networking.md#configure-storage-service-endpoint).

### Available virtual network regions

Cross-region service endpoints for Azure Storage became generally available in April of 2023. Now, service endpoints for Azure Storage work between virtual networks and service instances in different regions. All traffic from subnets with cross-region service endpoints to storage services, such as Elastic SAN, will use a private IP address as a source IP instead of a public one.

To use cross-region service endpoints, it might be necessary to delete existing **Microsoft.Storage** endpoints and recreate them as cross-region (**Microsoft.Storage.Global**).

## Private endpoints

Azure [Private Link](../../private-link/private-link-overview.md) enables you to access an Elastic SAN volume group securely over a [private endpoint](../../private-link/private-endpoint-overview.md) from a virtual network. The private endpoint uses a separate set of IP addresses from the virtual network address space for each volume group. Traffic between your virtual network and the service traverses the Microsoft backbone network, eliminating the risk of exposing your service to the public internet.

Using a private endpoint has several advantages over service endpoints, including:

- The scope of the endpoint configuration is restricted to selected instances of just your volume groups - not all storage instances for all customers.
- Built-in data exfiltration protection
- Private access to your Elastic SAN volumes from on-premises

For a complete comparison of private endpoints to service endpoints, see [Compare Private Endpoints and Service Endpoints](../../virtual-network/vnet-integration-for-azure-services.md#compare-private-endpoints-and-service-endpoints).

Similar to service endpoints, you must enable private endpoints within the virtual network from which you want to allow access. Traffic between the virtual network and the Elastic SAN is routed over an optimal path on the Azure backbone network. Unlike service endpoints, you don't need to configure network rules to allow traffic from a private endpoint since the storage firewall only controls access through public endpoints.

For details on how to configure private endpoints, see [Enable private endpoint](elastic-san-networking.md#configure-private-endpoint).

## Virtual network rules

To further restrict access, you can create virtual network rules for volume groups configured with service endpoints. You don't need network rules to allow traffic from a private endpoint since the storage firewall only controls access through public endpoints.

Each volume group supports up to 200 virtual network rules. If you delete a subnet that has been included in a network rule, it will be removed from the network rules for the volume group. If you create a new subnet with the same name, it won't have access to the volume group. To allow access, you must explicitly authorize the new subnet in the network rules for the volume group.

Clients granted access via these network rules must continue to meet the authorization requirements of the Elastic SAN to access the data.

For details on how to define network rules, see [Managing virtual network rules](elastic-san-networking.md#configure-virtual-network-rules).

## Client connections

After you have enabled the desired endpoints and granted access in your network rules, you can connect to the appropriate Elastic SAN volumes using the iSCSI protocol. For more details on how to configure client connections, see [Configure access to Elastic SAN volumes from clients](elastic-san-networking.md#configure-client-connections)

> [!NOTE]
> If a connection between a virtual machine (VM) and an Elastic SAN volume is lost, the connection will retry for 90 seconds until terminating. Losing a connection to an Elastic SAN volume won't cause the VM to restart.

## Next steps

[Configure Elastic SAN networking Preview](elastic-san-networking.md)
