---
title: Use private endpoints 
titleSuffix: Azure Storage
description: Overview of private endpoints for secure access to storage accounts from virtual networks.
services: storage
author: santoshc

ms.service: storage
ms.topic: article
ms.date: 03/12/2020
ms.author: santoshc
ms.reviewer: santoshc
ms.subservice: common
---

# Use private endpoints for Azure Storage

You can use [private endpoints](../../private-link/private-endpoint-overview.md) for your Azure Storage accounts to allow clients on a virtual network (VNet) to securely access data over a [Private Link](../../private-link/private-link-overview.md). The private endpoint uses an IP address from the VNet address space for your storage account service. Network traffic between the clients on the VNet and the storage account traverses over the VNet and a private link on the Microsoft backbone network, eliminating exposure from the public internet.

Using private endpoints for your storage account enables you to:

- Secure your storage account by configuring the storage firewall to block all connections on the public endpoint for the storage service.
- Increase security for the virtual network (VNet), by enabling you to block exfiltration of data from the VNet.
- Securely connect to storage accounts from on-premises networks that connect to the VNet using [VPN](../../vpn-gateway/vpn-gateway-about-vpngateways.md) or [ExpressRoutes](../../expressroute/expressroute-locations.md) with private-peering.

## Conceptual overview

![Overview of private endpoints for Azure Storage](media/storage-private-endpoints/storage-private-endpoints-overview.jpg)

A private endpoint is a special network interface for an Azure service in your [Virtual Network](../../virtual-network/virtual-networks-overview.md) (VNet). When you create a private endpoint for your storage account, it provides secure connectivity between clients on your VNet and your storage. The private endpoint is assigned an IP address from the IP address range of your VNet. The connection between the private endpoint and the storage service uses a secure private link.

Applications in the VNet can connect to the storage service over the private endpoint seamlessly, **using the same connection strings and authorization mechanisms that they would use otherwise**. Private endpoints can be used with all protocols supported by the storage account, including REST and SMB.

Private endpoints can be created in subnets that use [Service Endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md). Clients in a subnet can thus connect to one storage account using private endpoint, while using service endpoints to access others.

When you create a private endpoint for a storage service in your VNet, a consent request is sent for approval to the storage account owner. If the user requesting the creation of the private endpoint is also an owner of the storage account, this consent request is automatically approved.

Storage account owners can manage consent requests and the private endpoints, through the '*Private endpoints*' tab for the storage account in the [Azure portal](https://portal.azure.com).

> [!TIP]
> If you want to restrict access to your storage account through the private endpoint only, configure the storage firewall to deny or control access through the public endpoint.

You can secure your storage account to only accept connections from your VNet, by [configuring the storage firewall](storage-network-security.md#change-the-default-network-access-rule) to deny access through its public endpoint by default. You don't need a firewall rule to allow traffic from a VNet that has a private endpoint, since the storage firewall only controls access through the public endpoint. Private endpoints instead rely on the consent flow for granting subnets access to the storage service.

### Private endpoints for Azure Storage

When creating the private endpoint, you must specify the storage account and the storage service to which it connects. You need a separate private endpoint for each storage service in a storage account that you need to access, namely [Blobs](../blobs/storage-blobs-overview.md), [Data Lake Storage Gen2](../blobs/data-lake-storage-introduction.md), [Files](../files/storage-files-introduction.md), [Queues](../queues/storage-queues-introduction.md), [Tables](../tables/table-storage-overview.md), or [Static Websites](../blobs/storage-blob-static-website.md).

> [!TIP]
> Create a separate private endpoint for the secondary instance of the storage service for better read performance on RA-GRS accounts.

For read access to the secondary region with a storage account configured for geo-redundant storage, you need separate private endpoints for both the primary and secondary instances of the service. You don't need to create a private endpoint for the secondary instance for **failover**. The private endpoint will automatically connect to the new primary instance after failover. For more information about storage redundancy options, see [Azure Storage redundancy](storage-redundancy.md).

For more detailed information on creating a private endpoint for your storage account, refer to the following articles:

- [Connect privately to a storage account from the Storage Account experience in the Azure portal](../../private-link/create-private-endpoint-storage-portal.md)
- [Create a private endpoint using the Private Link Center in the Azure portal](../../private-link/create-private-endpoint-portal.md)
- [Create a private endpoint using Azure CLI](../../private-link/create-private-endpoint-cli.md)
- [Create a private endpoint using Azure PowerShell](../../private-link/create-private-endpoint-powershell.md)

### Connecting to private endpoints

Clients on a VNet using the private endpoint should use the same connection string for the storage account, as clients connecting to the public endpoint. We rely upon DNS resolution to automatically route the connections from the VNet to the storage account over a private link.

> [!IMPORTANT]
> Use the same connection string to connect to the storage account using private endpoints, as you'd use otherwise. Please don't connect to the storage account using its '*privatelink*' subdomain URL.

We create a [private DNS zone](../../dns/private-dns-overview.md) attached to the VNet with the necessary updates for the private endpoints, by default. However, if you're using your own DNS server, you may need to make additional changes to your DNS configuration. The section on [DNS changes](#dns-changes-for-private-endpoints) below describes the updates required for private endpoints.

## DNS changes for private endpoints

When you create a private endpoint, the DNS CNAME resource record for the storage account is updated to an alias in a subdomain with the prefix '*privatelink*'. By default, we also create a [private DNS zone](../../dns/private-dns-overview.md), corresponding to the '*privatelink*' subdomain, with the DNS A resource records for the private endpoints.

When you resolve the storage endpoint URL from outside the VNet with the private endpoint, it resolves to the public endpoint of the storage service. When resolved from the VNet hosting the private endpoint, the storage endpoint URL resolves to the private endpoint's IP address.

For the illustrated example above, the DNS resource records for the storage account 'StorageAccountA', when resolved from outside the VNet hosting the private endpoint, will be:

| Name                                                  | Type  | Value                                                 |
| :---------------------------------------------------- | :---: | :---------------------------------------------------- |
| ``StorageAccountA.blob.core.windows.net``             | CNAME | ``StorageAccountA.privatelink.blob.core.windows.net`` |
| ``StorageAccountA.privatelink.blob.core.windows.net`` | CNAME | \<storage service public endpoint\>                   |
| \<storage service public endpoint\>                   | A     | \<storage service public IP address\>                 |

As previously mentioned, you can deny or control access for clients outside the VNet through the public endpoint using the storage firewall.

The DNS resource records for StorageAccountA, when resolved by a client in the VNet hosting the private endpoint, will be:

| Name                                                  | Type  | Value                                                 |
| :---------------------------------------------------- | :---: | :---------------------------------------------------- |
| ``StorageAccountA.blob.core.windows.net``             | CNAME | ``StorageAccountA.privatelink.blob.core.windows.net`` |
| ``StorageAccountA.privatelink.blob.core.windows.net`` | A     | 10.1.1.5                                              |

This approach enables access to the storage account **using the same connection string** for clients on the VNet hosting the private endpoints, as well as clients outside the VNet.

If you are using a custom DNS server on your network, clients must be able to resolve the FQDN for the storage account endpoint to the private endpoint IP address. You should configure your DNS server to delegate your private link subdomain to the private DNS zone for the VNet, or configure the A records for '*StorageAccountA.privatelink.blob.core.windows.net*' with the private endpoint IP address.

> [!TIP]
> When using a custom or on-premises DNS server, you should configure your DNS server to resolve the storage account name in the 'privatelink' subdomain to the private endpoint IP address. You can do this by delegating the 'privatelink' subdomain to the private DNS zone of the VNet, or configuring the DNS zone on your DNS server and adding the DNS A records.

The recommended DNS zone names for private endpoints for storage services are:

| Storage service        | Zone name                            |
| :--------------------- | :----------------------------------- |
| Blob service           | `privatelink.blob.core.windows.net`  |
| Data Lake Storage Gen2 | `privatelink.dfs.core.windows.net`   |
| File service           | `privatelink.file.core.windows.net`  |
| Queue service          | `privatelink.queue.core.windows.net` |
| Table service          | `privatelink.table.core.windows.net` |
| Static Websites        | `privatelink.web.core.windows.net`   |

For more information on configuring your own DNS server to support private endpoints, refer to the following articles:

- [Name resolution for resources in Azure virtual networks](/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances#name-resolution-that-uses-your-own-dns-server)
- [DNS configuration for private endpoints](/azure/private-link/private-endpoint-overview#dns-configuration)

## Pricing

For pricing details, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link).

## Known Issues

Keep in mind the following known issues about private endpoints for Azure Storage.

### Copy Blob support

If the storage account is protected by a firewall and the account is accessed through private endpoints, then that account cannot serve as the source of a [Copy Blob](/rest/api/storageservices/copy-blob) operation.

### Storage access constraints for clients in VNets with private endpoints

Clients in VNets with existing private endpoints face constraints when accessing other storage accounts that have private endpoints. For instance, suppose a VNet N1 has a private endpoint for a storage account A1 for Blob storage. If storage account A2 has a private endpoint in a VNet N2 for Blob storage, then clients in VNet N1 must also access Blob storage in account A2 using a private endpoint. If storage account A2 does not have any private endpoints for Blob storage, then clients in VNet N1 can access Blob storage in that account without a private endpoint.

This constraint is a result of the DNS changes made when account A2 creates a private endpoint.

### Network Security Group rules for subnets with private endpoints

Currently, you can't configure [Network Security Group](../../virtual-network/security-overview.md) (NSG) rules and user-defined routes for private endpoints. NSG rules applied to the subnet hosting the private endpoint are only applied to other endpoints (e.g. NICs) than the private endpoint. A limited workaround for this issue is to implement your access rules for private endpoints on the source subnets, though this approach may require a higher management overhead.

## Next steps

- [Configure Azure Storage firewalls and virtual networks](storage-network-security.md)
- [Security recommendations for Blob storage](../blobs/security-recommendations.md)
