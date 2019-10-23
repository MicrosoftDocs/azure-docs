---
title: Using Private Endpoints with Azure Storage | Microsoft Docs
description: Overview of private endpoints for secure access to storage accounts from virtual networks.
services: storage
author: santoshc

ms.service: storage
ms.topic: article
ms.date: 09/25/2019
ms.author: santoshc
ms.reviewer: santoshc
ms.subservice: common
---

# Using Private Endpoints for Azure Storage (Preview)

Azure Storage supports the use of [Azure Private Links](../../private-link/private-link-overview.md) to enable clients on virtual networks to securely access data in a storage account over a [Private Endpoint](../../private-link/private-endpoint-overview.md). The private endpoint assigns a private IP address from the virtual network (VNet) address space to your storage account service, and is connected using a private link to the storage service. Network traffic between the clients on the VNet and the storage account traverses over the virtual network and the Microsoft backbone network, eliminating exposure from the public internet.

Using private endpoints for your storage account enables you to:
- Secure your storage account by configuring the storage firewall to block all connections on the public endpoint for the storage service.
- Increases security for the virtual network (VNet), by enabling you to block exfiltration of data from the VNet.
- Securely connect to storage accounts from on-premises networks that connect to the VNet using [VPN](../../vpn-gateway/vpn-gateway-about-vpngateways.md) or [ExpressRoutes](../../expressroute/expressroute-locations.md) with private-peering.

## Conceptual Overview
![Private Endpoints for Azure Storage Overview](media/storage-private-endpoints/storage-private-endpoints-overview.jpg)

Private endpoints are a special network interface in your [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md) (VNet) that connect your VNet privately and securely to Azure services, such as Azure Storage. A private endpoint uses a private IP address from the private IP address range of your VNet. The connections between the private endpoint and the storage service use secure private links.

Applications in the VNet can connect to the storage service over the private endpoint seamlessly, using the same connection strings and authorization mechanisms that they would use otherwise. Private endpoints can be used with all protocols supported by the storage account, including REST and SMB.

When you create a private endpoint for a storage service in your VNet, a consent request is sent to the storage account owner for approval to create the private endpoint. If the user requesting the creation of the private endpoint is also an owner of the storage account, this consent request is automatically approved.

If you want to secure your storage account to only accept connections from the private VNet, you can [configure the storage firewall](storage-network-security.md#change-the-default-network-access-rule) to deny all access through its public endpoint by default. You do not need a storage firewall rule for allowing traffic from a VNet that has a private endpoint, since the storage firewall rules only apply to its public endpoint.

### Private Endpoints for Storage Service

When you create a private endpoint for a storage account, you must specify the storage account and the specific storage service to which it connects. You must create a separate private endpoint for each storage service in a storage account that you need to access from the VNet, viz. [Blobs](../blobs/storage-blobs-overview.md), [Data Lake Storage Gen2](../blobs/data-lake-storage-introduction.md), [Files](../files/storage-files-introduction.md), [Queues](../queues/storage-queues-introduction.md), [Tables](../tables/table-storage-overview.md), or Static Websites[../blob/storage-blob-static-website.md].

To ensure read availability for a [read-access geo redundant storage account](storage-redundancy-grs.md#read-access-geo-redundant-storage), you must create separate private endpoints for both the primary and secondary instances of the service.

#### Resources

For more detailed information on creating a private endpoint for your storage account, refer to the following articles:

- [Connect privately to a storage account from the Storage Account experience in the Azure portal](../../private-link/create-private-endpoint-storage-portal.md)
- [Create a private endpoint using the Private Link Center in the Azure portal](../../private-link/create-private-endpoint-portal.md)
- [Create a private endpoint using Azure CLI](../../private-link/create-private-endpoint-cli.md)
- [Create a private endpoint using Azure PowerShell](../../private-link/create-private-endpoint-powershell.md)

### DNS changes for Private Endpoints

When a private endpoint is created for a storage service, the DNS CNAME resource record for that storage service endpoint is updated as an alias to an endpoint in a subdomain with the prefix '*privatelink*'. When resolved from outside the VNet in which the private endpoint is created, the '*privatelink*' URL still resolves to the same public endpoint for the storage service. However, when resolved in the VNet in which the private endpoint is created, this URL resolves to the private IP address assigned to the private endpoint.

By default, creating a private endpoint also creates a [private DNS zone](../../dns/private-dns-overview.md) attached to the VNet. This private DNS zone corresponds to the subdomain with the prefix '*privatelink*', and contains the DNS A resource records for the private endpoints.

For the illustrated example above, the DNS resource records for the storage account 'StorageAccountA', when resolved from outside the VNet hosting the private endpoint, will be:

| Name                                                  | Type  | Value                                                 |
| :---------------------------------------------------- | :---: | :---------------------------------------------------- |
| ``StorageAccountA.blob.core.windows.net``             | CNAME | ``StorageAccountA.privatelink.blob.core.windows.net`` |
| ``StorageAccountA.privatelink.blob.core.windows.net`` | CNAME | \<public endpoint\>                                   |
| \<public endpoint\>                                   | A     | \<storage service public IP address\>                 |

As previously mentioned, you can deny all access through the public endpoint using the storage firewall.

The DNS resource records for StorageAccountA, when resolved by a client in the VNet hosting the private endpoint, will be:

| Name                                                  | Type  | Value                                                 |
| :---------------------------------------------------- | :---: | :---------------------------------------------------- |
| ``StorageAccountA.blob.core.windows.net``             | CNAME | ``StorageAccountA.privatelink.blob.core.windows.net`` |
| ``StorageAccountA.privatelink.blob.core.windows.net`` | A     | 10.1.1.5                                              |

This approach enables access to the storage account using the same connection string from the VNet hosting the private endpoints, as well as clients outside the VNet. You can use the storage firewall to deny access to all clients outside the VNet.

## Pricing

For pricing details, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link).

## Known Issues

### Copy Blob failures

Currently, [Copy Blob](https://docs.microsoft.com/en-us/rest/api/storageservices/Copy-Blob) commands issued to storage accounts accessed through private endpoints fail when the source storage account is protected by a firewall.

### Storage access constraints for clients in VNets with Private Endpoints

Storage clients in VNets that have an existing storage private endpoint, face constraints when accessing other storage accounts with private endpoints. Specifically, this constraint applies to a VNet N1 that has a private endpoint for a storage account A1 for, say the blob service. If another storage account A2 has a private endpoint in another VNet N2 for the blob service, then clients in VNet N1 must also access the blob service in account A2 over a private endpoint. If storage account A2 does not have any private endpoints for the blob service, then clients in VNet N1 can access its blob service without a private endpoint.

This constraint is a result of the DNS changes made when account A2 creates a private endpoint.

### NSG rules on subnets with private endpoints

[Network Security Group](../../virtual-network/security-overview.md) (NSG) rules cannot be configured for subnets with private endpoints, at this time. A limited workaround for this is to implement your access rules for the private endpoints on the source subnets, though this may entail a higher management overhead.
