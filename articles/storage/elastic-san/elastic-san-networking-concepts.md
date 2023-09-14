---
title: Azure Elastic SAN networking Preview concepts
description: An overview of Azure Elastic SAN Preview networking options, including storage service endpoints, private endpoints, and iSCSI.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: conceptual
ms.date: 08/16/2023
ms.author: rogarana
ms.custom: references_regions
---

# Elastic SAN Preview networking

Azure Elastic storage area network (SAN) Preview allows you to secure and control the level of access to your Elastic SAN volumes that your applications and enterprise environments require. This article describes the options for allowing users and applications access to Elastic SAN volumes from an [Azure virtual network infrastructure](../../virtual-network/vnet-integration-for-azure-services.md).

You can configure Elastic SAN volume groups to only allow access over specific endpoints on specific virtual network subnets. The allowed subnets may belong to a virtual network in the same subscription, or those in a different subscription, including subscriptions belonging to a different Azure Active Directory tenant. Once network access is configured for a volume group, the configuration is inherited by all volumes belonging to the group.

Depending on your configuration, applications on peered virtual networks or on-premises networks can also access volumes in the group. On-premises networks must be connected to the virtual network by a VPN or ExpressRoute. For more details about virtual network configurations, see [Azure virtual network infrastructure](../../virtual-network/vnet-integration-for-azure-services.md).

There are two types of virtual network endpoints you can configure to allow access to an Elastic SAN volume group:

- [Storage service endpoints](#storage-service-endpoints)
- [Private endpoints](#private-endpoints)

To decide which option is best for you, see [Compare Private Endpoints and Service Endpoints](../../virtual-network/vnet-integration-for-azure-services.md#compare-private-endpoints-and-service-endpoints). Generally, you should use private endpoints instead of service endpoints since Private Link offers better capabilities. For more information, see [Azure Private Link](../../private-link/private-endpoint-overview.md).  

After configuring endpoints, you can configure network rules to further control access to your Elastic SAN volume group. Once the endpoints and network rules have been configured, clients can connect to volumes in the group to process their workloads.

## Storage service endpoints

[Azure Virtual Network (VNet) service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md) provide secure and direct connectivity to Azure services using an optimized route over the Azure backbone network. Service endpoints allow you to secure your critical Azure service resources so only specific virtual networks can access them.

[Cross-region service endpoints for Azure Storage](../common/storage-network-security.md#azure-storage-cross-region-service-endpoints) work between virtual networks and storage service instances in any region. With cross-region service endpoints, subnets no longer use a public IP address to communicate with any storage account, including those in another region. Instead, all the traffic from a subnet to a storage account uses a private IP address as a source IP.

> [!TIP]
> The original local service endpoints, identified as **Microsoft.Storage**, are still supported for backward compatibility, but you should create cross-region endpoints, identified as **Microsoft.Storage.Global**, for new deployments.
>
> Cross-region service endpoints and local ones can't coexist on the same subnet. To use cross-region service endpoints, you might have to delete existing **Microsoft.Storage** endpoints and recreate them as **Microsoft.Storage.Global**.

## Private endpoints

> [!IMPORTANT]
> For Elastic SANs using [locally-redundant storage (LRS)](elastic-san-planning.md#redundancy) as their redundancy option, private endpoints are supported in all regions that Elastic SAN is available. Private endpoints aren't currently supported for elastic SANs using [zone-redundant storage (ZRS)](elastic-san-planning.md#redundancy) as their redundancy option.

Azure [Private Link](../../private-link/private-link-overview.md) enables you to access an Elastic SAN volume group securely over a [private endpoint](../../private-link/private-endpoint-overview.md) from a virtual network subnet. Traffic between your virtual network and the service traverses the Microsoft backbone network, eliminating the risk of exposing your service to the public internet. An Elastic SAN private endpoint uses a set of IP addresses from the subnet address space for each volume group. The maximum number used per endpoint is 20.

Private endpoints have several advantages over service endpoints. For a complete comparison of private endpoints to service endpoints, see [Compare Private Endpoints and Service Endpoints](../../virtual-network/vnet-integration-for-azure-services.md#compare-private-endpoints-and-service-endpoints).

Traffic between the virtual network and the Elastic SAN is routed over an optimal path on the Azure backbone network. Unlike service endpoints, you don't need to configure network rules to allow traffic from a private endpoint since the storage firewall only controls access through public endpoints.

For details on how to configure private endpoints, see [Enable private endpoint](elastic-san-networking.md#configure-a-private-endpoint).

## Virtual network rules

To further secure access to your Elastic SAN volumes, you can create virtual network rules for volume groups configured with service endpoints to allow access from specific subnets. You don't need network rules to allow traffic from a private endpoint since the storage firewall only controls access through public endpoints.

Each volume group supports up to 200 virtual network rules. If you delete a subnet that has been included in a network rule, it will be removed from the network rules for the volume group. If you create a new subnet with the same name, it won't have access to the volume group. To allow access, you must explicitly authorize the new subnet in the network rules for the volume group.

Clients granted access via these network rules must also be granted the appropriate permissions to the Elastic SAN to volume group.

To learn how to define network rules, see [Managing virtual network rules](elastic-san-networking.md#configure-virtual-network-rules).

## Client connections

After you have enabled the desired endpoints and granted access in your network rules, you can connect to the appropriate Elastic SAN volumes using the iSCSI protocol. For more details on how to configure client connections, see [Configure access to Elastic SAN volumes from clients](elastic-san-networking.md#configure-client-connections)

> [!NOTE]
> If a connection between a virtual machine (VM) and an Elastic SAN volume is lost, the connection will retry for 90 seconds until terminating. Losing a connection to an Elastic SAN volume won't cause the VM to restart.

## Next steps

[Configure Elastic SAN networking Preview](elastic-san-networking.md)
