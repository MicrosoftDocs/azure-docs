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

Intro sentance here.

First, configure account to accept requests only from secure connections (HTTPS). Then, where possible, create private links to your storage account which secure access over a *private endpoint*. If your storage account must accept traffic over the *public endpoint*, then add rules network rules or include your storage account in a network security perimeter. 

After you secure the network boundary, you can increased protection against infiltration of data by restricting the the source of copy operations. To learn more, [Restrict the source of copy operations to a storage account](security-restrict-copy-operations.md).

This article describes the configuration options for securing traffic to and from your storage account.

> [!NOTE]
> Clients that make requests from allowed sources must also meet the authorization requirements of the storage account. To learn more about account authorization, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md).

## Secure connections (HTTPS)

By default, storage accounts accept requests over HTTPS only. Any requests made over HTTP is rejected. We recommend that you require secure transfer for all of your storage accounts, except in certain cases where NFS Azure file shares are used with network-level security. To verify that your account accepts requests only from secure connections, make sure that the **Secure transfer required** property of the storage account is set. To learn more, see [Require secure transfer to ensure secure connections](storage-require-secure-transfer.md).

## Private endpoints

A private endpoint assigns a private IP address from your virtual network to your storage account. Clients connect to your storage account by using a private link to the private endpoint. Traffic is routed over the Microsoft backbone network so traffic does not travel over the public internet. You can fine-tune access rules by using [Network policies for private endpoints](../../private-link/disable-private-endpoint-network-policy.md). If you want to permit traffic to originate only from private links, you can block all access over the public endpoint. Private endpoints have cost meters, but provide maximum network isolation.

To learn more about using a private endpoint to secure traffic to your storage account, see [Use private endpoints for Azure Storage](storage-private-endpoints.md).

## Public endpoints

The *public endpoint* of your storage account is accessed through a public IP address. If you block all access over the public endpoint, you disable all traffic to the storage accounts public IP address. That said, if there are clients that are unable to access your storage account over a private link or you choose not to use private endpoints for cost or over reasons, then you can secure the public endpoint of your storage account by using firewall rules or by adding your storage account to a network security perimeter.

### Firewall rules

Firewall rules enable you to limit traffic to your public endpoint. They do not affect traffic to a private endpoint. 

You must enable firewall rules before you can set them. Enabling firewall rules blocks all incoming requests by default. Requests are permitted only if they originate from a client or service that operates within an source that you specify. You enable firewall rules by setting the default public network access rule of the storage account. To learn how to do this, see [Set the default public network access rule of a Azure Storage account](storage-network-security-set-default-access.md). 

Use firewall rules to allow traffic from any of the following sources:

- Specific subnets in one or more Azure Virtual networks
- IP address ranges
- Resource instances
- Trusted Azure services

To learn more, see [Azure Storage firewall rules](storage-network-security.md).

Firewall settings are specific to a storage account. If you want to manage single set of inbound and outbound rules around a group of storage accounts and other resources, consider setting up a network security perimeter.

### Network security perimeter

Another way to limit traffic to your public endpoint is to include your storage account in a network security perimeter. A network security perimeter also protects against data exfiltration by enabling you to define outbound rules. A network security perimeter can be particularly useful in cases where you want to establish a security boundary around a collection of resources. This could be multiple storage accounts and other platform as a service (PaaS) resources. Network security perimeter provides a more complete set of inbound, outbound and PaaS to PaaS controls that can be applied to the entire perimeter as opposed to being configured individually on each resource. It can also reduce some of the complexity in auditing traffic. 

To learn more, see [Network security perimeter for Azure Storage](storage-network-security-perimeter.md).

### Authorization

Clients granted access via network rules must continue to meet the authorization requirements of the storage account to access the data. Authorization is supported with Microsoft Entra credentials for blobs and queues, with a valid account access key, or with a shared access signature (SAS) token.

When you configure a blob container for anonymous public access, requests to read data in that container don't need to be authorized, but the firewall rules remain in effect and will block anonymous traffic.

An application that accesses a storage account when network rules are in effect still requires proper authorization for the request. Authorization is supported with Microsoft Entra credentials for blobs, tables, file shares and queues, with a valid account access key, or with a shared access signature (SAS) token. When you configure a blob container for anonymous access, requests to read data in that container don't need to be authorized. The firewall rules remain in effect and will block anonymous traffic.

## See also

- [Compare Private Endpoints and Service Endpoints](../../virtual-network/vnet-integration-for-azure-services.md#compare-private-endpoints-and-service-endpoints).
- [Security recommendations for Azure Blob storage](../blobs/security-recommendations.md).
- [Network routing preference](network-routing-preference.md)