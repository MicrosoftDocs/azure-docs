---
title: Azure Elastic SAN networking concepts
description: Learn about available Azure Elastic SAN networking options, including storage service endpoints, private endpoints, and iSCSI.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: conceptual
ms.date: 01/28/2025
ms.author: rogarana
---

# Learn about networking configurations for Elastic SAN

Azure Elastic storage area network (SAN) allows you to secure and control the level of access to your Elastic SAN volumes that your applications and enterprise environments require. This article describes the options for allowing users and applications access to Elastic SAN volumes from an [Azure virtual network infrastructure](../../virtual-network/vnet-integration-for-azure-services.md).

You can configure Elastic SAN volume groups to only allow access over specific endpoints on specific virtual network subnets. The allowed subnets can belong to a virtual network in the same subscription, or those in a different subscription, including subscriptions belonging to a different Microsoft Entra tenant. Once network access is configured for a volume group, the configuration is inherited by all volumes belonging to the group.

Depending on your configuration, applications on peered virtual networks or on-premises networks can also access volumes in the group. On-premises networks must be connected to the virtual network by a VPN or ExpressRoute. For more information about virtual network configurations, see [Azure virtual network infrastructure](../../virtual-network/vnet-integration-for-azure-services.md).

There are two types of virtual network endpoints you can configure to allow access to an Elastic SAN volume group:

- [Storage service endpoints](#storage-service-endpoints)
- [Private endpoints](#private-endpoints)

To decide which option is best for you, see [Compare Private Endpoints and Service Endpoints](../../virtual-network/vnet-integration-for-azure-services.md#compare-private-endpoints-and-service-endpoints). Generally, you should use private endpoints instead of service endpoints since Private Link offers better capabilities. For more information, see [Azure Private Link](../../private-link/private-endpoint-overview.md).  

After configuring endpoints, you can configure network rules to further control access to your Elastic SAN volume group. Once the endpoints and network rules have been configured, clients can connect to volumes in the group to process their workloads.

## Public network access

You can enable or disable public Internet access to your Elastic SAN endpoints at the SAN level. Enabling public network access for an Elastic SAN allows you to configure public access to individual volume groups in that SAN over storage service endpoints. By default, public access to individual volume groups is denied even if you allow it at the SAN level. If you disable public access at the SAN level, access to the volume groups within that SAN is only available over private endpoints.

## Data Integrity

Data integrity is important for preventing data corruption in cloud storage. TCP provides a foundational level of data integrity through its checksum mechanism, it can be enhanced over iSCSI with more robust error detection with a cyclic redundancy check (CRC), specifically CRC-32C. CRC-32C can be used to add checksum verification for iSCSI headers and data payloads.

Elastic SAN supports CRC-32C checksum verification when enabled on the client side for connections to Elastic SAN volumes. Elastic SAN also offers the ability to enforce this error detection through a property that can be set at the volume group level, which is inherited by any volume within that volume group. When you enable this property on a volume group, Elastic SAN rejects all client connections to any volumes in the volume group if CRC-32C isn't set for header or data digests on those connections. When you disable this property, Elastic SAN volume checksum verification depends on whether CRC-32C is set for header or data digests on the client, but your Elastic SAN won't reject any connections. To learn how to enable CRC protection, see [Configure networking](elastic-san-networking.md#enable-iscsi-error-detection).

> [!NOTE]
> Some operating systems may not support iSCSI header or data digests. Fedora and its downstream Linux distributions like Red Hat Enterprise Linux, CentOS, Rocky Linux, etc. don't support data digests. Don't enable CRC protection on your volume groups if your clients use operating systems like these that don't support iSCSI header or data digests because connections to the volumes will fail.

## Storage service endpoints

[Azure Virtual Network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md) provide secure and direct connectivity to Azure services using an optimized route over the Azure backbone network. Service endpoints allow you to secure your critical Azure service resources so only specific virtual networks can access them.

[Cross-region service endpoints for Azure Storage](../common/storage-network-security.md#azure-storage-cross-region-service-endpoints) work between virtual networks and storage service instances in any region. With cross-region service endpoints, subnets no longer use a public IP address to communicate with any storage account, including those in another region. Instead, all the traffic from a subnet to a storage account uses a private IP address as a source IP.

> [!TIP]
> The original local service endpoints, identified as **Microsoft.Storage**, are still supported for backward compatibility, but you should create cross-region endpoints, identified as **Microsoft.Storage.Global**, for new deployments.
>
> Cross-region service endpoints and local ones can't coexist on the same subnet. To use cross-region service endpoints, you might have to delete existing **Microsoft.Storage** endpoints and recreate them as **Microsoft.Storage.Global**.

## Private endpoints

Azure [Private Link](../../private-link/private-link-overview.md) enables you to access an Elastic SAN volume group securely over a [private endpoint](../../private-link/private-endpoint-overview.md) from a virtual network subnet. Traffic between your virtual network and the service traverses the Microsoft backbone network, eliminating the risk of exposing your service to the public internet. An Elastic SAN private endpoint uses a set of IP addresses from the subnet address space for each volume group. The maximum number used per endpoint is 20.

Private endpoints have several advantages over service endpoints. For a complete comparison of private endpoints to service endpoints, see [Compare Private Endpoints and Service Endpoints](../../virtual-network/vnet-integration-for-azure-services.md#compare-private-endpoints-and-service-endpoints).


### How it works

Traffic between the virtual network and the Elastic SAN is routed over an optimal path on the Azure backbone network. Unlike service endpoints, you don't need to configure network rules to allow traffic from a private endpoint since the storage firewall only controls access through public endpoints.

For details on how to configure private endpoints, see [Enable private endpoint](elastic-san-networking.md#configure-a-private-endpoint).

## Virtual network rules

To further secure access to your Elastic SAN volumes, you can create virtual network rules for volume groups configured with service endpoints to allow access from specific subnets. You don't need network rules to allow traffic from a private endpoint since the storage firewall only controls access through public endpoints.

Each volume group supports up to 200 virtual network rules. If you delete a subnet that has been included in a network rule, it's removed from the network rules for the volume group. If you create a new subnet with the same name, it won't have access to the volume group. To allow access, you must explicitly authorize the new subnet in the network rules for the volume group.

Clients granted access via these network rules must also be granted the appropriate permissions to the Elastic SAN to volume group.

To learn how to define network rules, see [Managing virtual network rules](elastic-san-networking.md#configure-virtual-network-rules).

## Client connections

After you have enabled the desired endpoints and granted access in your network rules, you can connect to the appropriate Elastic SAN volumes using the iSCSI protocol. To learn how to configure client connections, see the articles on how to connect to [Linux](elastic-san-connect-linux.md), [Windows](elastic-san-connect-windows.md), or [Azure Kubernetes Service cluster](elastic-san-connect-aks.md).

iSCSI sessions can periodically disconnect and reconnect over the course of the day. These disconnects and reconnects are part of regular maintenance or the result of network fluctuations. You shouldn't experience any performance degradation as a result of these disconnects and reconnects, and the connections should re-establish by themselves. If a connection doesn't re-establish itself, or you're experiencing performance degradation, raise a support ticket.

> [!NOTE]
> If a connection between a virtual machine (VM) and an Elastic SAN volume is lost, the connection will retry for 90 seconds until terminating. Losing a connection to an Elastic SAN volume won't cause the VM to restart.

## Next steps

[Configure Elastic SAN networking](elastic-san-networking.md)
