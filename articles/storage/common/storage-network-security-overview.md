---
title: Azure Storage Network security
description: Learn about how to set up network security for Azure Storage accounts.
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 06/18/2025
ms.author: normesta

---

# Azure Storage network security

Azure Storage provides multiple layers of network security to protect your data and control access to your storage accounts. This article provides an overview of the key network security features and configuration options available for Azure Storage accounts. You can secure your storage account by requiring HTTPS connections, implementing private endpoints for maximum isolation, or configuring public endpoint access through firewall rules and network security perimeters. Each approach offers different levels of security and complexity, allowing you to choose the right combination based on your specific requirements, network architecture, and security policies.

> [!NOTE]
> Clients that make requests from allowed sources must also meet the authorization requirements of the storage account. To learn more about account authorization, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md).

## Secure connections (HTTPS)

By default, storage accounts accept requests over HTTPS only. Any requests made over HTTP are rejected. We recommend that you require secure transfer for all of your storage accounts, except when NFS Azure file shares are used with network-level security. To verify that your account accepts requests only from secure connections, ensure that the **Secure transfer required** property of the storage account is enabled. To learn more, see [Require secure transfer to ensure secure connections](storage-require-secure-transfer.md).

## Private endpoints

Where possible, create private links to your storage account to secure access through a *private endpoint*. A private endpoint assigns a private IP address from your virtual network to your storage account. Clients connect to your storage account using the private link. Traffic is routed over the Microsoft backbone network, ensuring it doesn't travel over the public internet. You can fine-tune access rules using [Network policies for private endpoints](../../private-link/disable-private-endpoint-network-policy.md). To permit traffic only from private links, you can block all access over the public endpoint. Private endpoints incur extra costs but provide maximum network isolation.

To learn more about using a private endpoint to secure traffic to your storage account, see [Use private endpoints for Azure Storage](storage-private-endpoints.md).

## Public endpoints

The *public endpoint* of your storage account is accessed through a public IP address. If you block all access over the public endpoint, you disable all traffic to the storage account's public IP address. However, if there are clients that can't access your storage account over a private link, or if you choose not to use private endpoints for cost or other reasons, then you can secure the public endpoint of your storage account by using firewall rules or by adding your storage account to a network security perimeter.

### Firewall rules

Firewall rules enable you to limit traffic to your public endpoint. They don't affect traffic to a private endpoint. 

You must enable firewall rules before you can configure them. Enabling firewall rules blocks all incoming requests by default. Requests are permitted only if they originate from a client or service that operates within a source that you specify. You enable firewall rules by setting the default public network access rule of the storage account. To learn how to do this, see [Set the default public network access rule of an Azure Storage account](storage-network-security-set-default-access.md). 

Use firewall rules to allow traffic from any of the following sources:

- Specific subnets in one or more Azure Virtual networks
- IP address ranges
- Resource instances
- Trusted Azure services

To learn more, see [Azure Storage firewall rules](storage-network-security.md).

Firewall settings are specific to a storage account. If you want to manage a single set of inbound and outbound rules around a group of storage accounts and other resources, consider setting up a network security perimeter.

### Network security perimeter

Another way to limit traffic to your public endpoint is to include your storage account in a network security perimeter. A network security perimeter also protects against data exfiltration by enabling you to define outbound rules. A network security perimeter can be particularly useful when you want to establish a security boundary around a collection of resources. This could include multiple storage accounts and other platform as a service (PaaS) resources. A network security perimeter provides a more complete set of inbound, outbound, and PaaS-to-PaaS controls that can be applied to the entire perimeter, rather than being configured individually on each resource. It can also reduce some of the complexity in auditing traffic. 

To learn more, see [Network security perimeter for Azure Storage](storage-network-security-perimeter.md).

## Copy operation scopes (preview)

You can use the **Permitted scope for copy operations** preview feature to restrict data copying to storage accounts by limiting sources to the same Microsoft Entra tenant or virtual network with private links. This can help prevent unwanted data infiltration from untrusted environments. To learn more, see [Restrict the source of copy operations to a storage account](security-restrict-copy-operations.md).

## See also

- [Compare Private Endpoints and Service Endpoints](../../virtual-network/vnet-integration-for-azure-services.md#compare-private-endpoints-and-service-endpoints).
- [Security recommendations for Azure Blob storage](../blobs/security-recommendations.md).
- [Network routing preference](network-routing-preference.md)