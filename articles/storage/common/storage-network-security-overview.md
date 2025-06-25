---
title: Azure Storage Network security overview
description: Learn about how to set up network security for Azure Storage accounts.
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 06/18/2025
ms.author: normesta

---

# Azure Storage network security overview

Introduction. Mention that folks will still need to authorize to use data.

## Relevant conceptual material

Azure Storage provides a layered security model. This model enables you to control the level of access to your storage accounts that your applications and enterprise environments demand, based on the type and subset of networks or resources that you use.

## General approach

- Enable secure transfer first.
- Where possible use a private endpoint. Here's why.
- If traffic is needed over a public endpoint, limit by setting network rules - or set up a network security perimeter.
- Finally, you can tighten up security by using a copy protection scope.

## Transport Layer security

Put something here.

## Private endpoints

Storage accounts have a public endpoint that's accessible through the internet. You can also create [private endpoints for your storage account](storage-private-endpoints.md). Creating private endpoints assigns a private IP address from your virtual network to the storage account. It helps secure traffic between your virtual network and the storage account over a private link.

## Public endpoints

What is a public endpoint? Explain that. Put stuff here for how to secure that public endpoint.

The Azure Storage firewall provides access control for the public endpoint of your storage account. You can also use the firewall to block all access through the public endpoint when you're using private endpoints. Your firewall configuration also enables trusted Azure platform services to access the storage account.

Turning on firewall rules for your storage account blocks incoming requests for data by default, unless the requests originate from a service that operates within an Azure virtual network or from allowed public IP addresses. Requests that are blocked include those from other Azure services, from the Azure portal, and from logging and metrics services.

To secure your storage account, you should first configure a rule to deny access to traffic from all networks (including internet traffic) on the public endpoint, by default. Then, you should configure rules that grant access to traffic from specific virtual networks. You can also configure rules to grant access to traffic from selected public internet IP address ranges, enabling connections from specific internet or on-premises clients. This configuration helps you build a secure network boundary for your applications.

You can combine firewall rules that allow access from specific virtual networks and from public IP address ranges on the same storage account. You can apply storage firewall rules to existing storage accounts or when you create new storage accounts.

Storage firewall rules apply to the public endpoint of a storage account. You don't need any firewall access rules to allow traffic for private endpoints of a storage account. The process of approving the creation of a private endpoint grants implicit access to traffic from the subnet that hosts the private endpoint.

## Copy operation scopes

Put something here.

### Authorization

Clients granted access via network rules must continue to meet the authorization requirements of the storage account to access the data. Authorization is supported with Microsoft Entra credentials for blobs and queues, with a valid account access key, or with a shared access signature (SAS) token.

When you configure a blob container for anonymous public access, requests to read data in that container don't need to be authorized, but the firewall rules remain in effect and will block anonymous traffic.

An application that accesses a storage account when network rules are in effect still requires proper authorization for the request. Authorization is supported with Microsoft Entra credentials for blobs, tables, file shares and queues, with a valid account access key, or with a shared access signature (SAS) token. When you configure a blob container for anonymous access, requests to read data in that container don't need to be authorized. The firewall rules remain in effect and will block anonymous traffic.


## Stuff from original article

## Scenarios

> [!IMPORTANT]
> Azure Storage firewall rules only apply to [data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md#data-plane) operations. [Control plane](../../azure-resource-manager/management/control-plane-and-data-plane.md#control-plane) operations are not subject to the restrictions specified in firewall rules.
>
> Some operations, such as blob container operations, can be performed through both the control plane and the data plane. So if you attempt to perform an operation such as listing containers from the Azure portal, the operation will succeed unless it is blocked by another mechanism. Attempts to access blob data from an application such as Azure Storage Explorer are controlled by the firewall restrictions.
>
> For a list of data plane operations, see the [Azure Storage REST API Reference](/rest/api/storageservices/).
> For a list of control plane operations, see the [Azure Storage Resource Provider REST API Reference](/rest/api/storagerp/).

### About virtual network endpoints

There are two types of virtual network endpoints for storage accounts:

- [Virtual Network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md)
- [Private endpoints](storage-private-endpoints.md)

Virtual network service endpoints are public and accessible via the internet. The Azure Storage firewall provides the ability to control access to your storage account over such public endpoints. When you disable public network access to your storage account, all incoming requests for data are blocked by default. Only applications that request data from allowed sources that you configure in your storage account firewall settings will be able to access your data. Sources can include the source IP address or virtual network subnet of a client, or an Azure service or resource instance through which clients or services access your data. Requests that are blocked include those from other Azure services, from the Azure portal, and from logging and metrics services, unless you explicitly allow access in your firewall configuration.

A private endpoint uses a private IP address from your virtual network to access a storage account over the Microsoft backbone network. With a private endpoint, traffic between your virtual network and the storage account are secured over a private link. Storage firewall rules only apply to the public endpoints of a storage account, not private endpoints. The process of approving the creation of a private endpoint grants implicit access to traffic from the subnet that hosts the private endpoint. You can use [Network Policies](../../private-link/disable-private-endpoint-network-policy.md) to control traffic over private endpoints if you want to refine access rules. If you want to use private endpoints exclusively, you can use the firewall to block all access through the public endpoint.

To help you decide when to use each type of endpoint in your environment, see [Compare Private Endpoints and Service Endpoints](../../virtual-network/vnet-integration-for-azure-services.md#compare-private-endpoints-and-service-endpoints).

### How to approach network security for your storage account

To secure your storage account and build a secure network boundary for your applications:

1. Start by disabling all public network access for the storage account under the **Public network access** setting in the storage account firewall.
1. Where possible, configure private links to your storage account from private endpoints on virtual network subnets where the clients reside that require access to your data.
1. If client applications require access over the public endpoints, change the **Public network access** setting to **Enabled from selected virtual networks and IP addresses**. Then, as needed:

    1. Specify the virtual network subnets from which you want to allow access.
    1. Specify the public IP address ranges of clients from which you want to allow access, such as those on on-premises networks.
    1. Allow access from selected Azure resource instances.
    1. Add exceptions to allow access from trusted services required for operations such as backing up data.
    1. Add exceptions for logging and metrics.

After you apply network rules, they're enforced for all requests. SAS tokens that grant access to a specific IP address serve to limit the access of the token holder, but they don't grant new access beyond configured network rules.



## Next steps

- Learn more about [Azure network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).
- Dig deeper into [security recommendations for Azure Blob storage](../blobs/security-recommendations.md).
