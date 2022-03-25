---
title: Overview of using private links with Azure Media Services
description: This article gives an overview of using private links with Azure Media Services.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: conceptual
ms.date: 10/22/2021
ms.author: inhenkel
---

# Overview of using Azure Private Link with Azure Media Services

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This article gives an overview of using private links with Azure Media Services.

## When to use Private Link with Media Services

Private Link allows Media Services to be accessed from private networks. When used with the network access controls provided by Media Services, private links can enable Media Services to be used without exposing endpoints to the public internet.

## Azure Private Endpoint and Azure Private Link

An [Azure Private Endpoint](../../private-link/private-endpoint-overview.md) is a network interface that uses a private IP address from your virtual network.  This network interface connects you privately and securely to a service via Azure Private Link.

Media Services endpoints may be accessed from a virtual network using private endpoints. Private endpoints may also be accessed from peered virtual networks or other networks connected to the virtual network using Express Route or VPN.

[Azure Private Links](../../private-link/index.yml) allow access to Media Services private endpoints in your virtual network without exposing them to the public Internet. It routes traffic over the Microsoft backbone network.

## Restricting access

> [!Important]
> Creating a private endpoint **DOES NOT** implicitly disable internet access to it.

Internet access to the endpoints in the Media Services account can be restricted in one of two ways:

- Restricting access to all resources within the Media Services account.
- Restricting access separately for each resource by using the IP allowlist.

## Media Services endpoints

| Endpoint                    | Description                                                               | Supports private link | Internet access control |
| --------------------------- | ------------------------------------------------------------------------- | --------------------- | ----------------------- |
| Streaming Endpoint          | The origin server for streaming video and formats media into HLS and DASH | Yes                   | IP allowlist            |
| Streaming Endpoint with CDN | Stream media to many viewers                                              | No                    | Managed by CDN          |
| Key Delivery                | Provides media content keys and DRM licenses to media viewers             | Yes                   | IP allowlist            |
| Live event                  | Ingests media content for live streaming                                  | Yes                   | IP allowlist            |

> [!NOTE]
> Media Services accounts created with API versions prior to 2020-05-01 also have an endpoint for the legacy RESTv2 API endpoint (pending deprecation).  This endpoint does not support private links.

## Other Private Link enabled Azure services

| Service                | Media Services integration                      | Private link documentation |
| ---------------------- | ----------------------------------------------- | -------------------------- |
| Azure Storage          | Used to store media                             | [Use private endpoints for Azure Storage](../../storage/common/storage-private-endpoints.md) |
| Azure Key Vault        | Used to store [customer managed keys](security-customer-managed-keys-portal-tutorial.md)             | [Configure Azure Key Vault networking settings](../../key-vault/general/how-to-azure-key-vault-network-security.md) |
| Azure Resource Manager | Provides access to Media Services APIs          | [Use REST API to create private link for managing Azure resources](../../azure-resource-manager/management/create-private-link-access-rest.md) |
| Event Grid             | Provides [notifications of Media Services events](./monitoring/job-state-events-cli-how-to.md) | [Configure private endpoints for Azure Event Grid topics or domains](../../event-grid/configure-private-endpoints.md)  |

## Private endpoints are created on the Media Services account

Private Endpoints for Key Delivery, Streaming Endpoints, and Live Events are created on the Media Services account instead of being created individually.

A private IP address is created for each Streaming Endpoint or Live Event in the Media Services account when a Media Services private endpoint resource is created. For example, if you have two started Streaming Endpoints, a single private endpoint should be created to connect both Streaming Endpoints to a virtual network. Resources can be connected to multiple virtual networks at the same time.

Internet access to the Media Services account should be restricted, either for all the resources within the account or separately for each resource.

## Private Link pricing
For pricing details, see [Azure Private Link Pricing](https://azure.microsoft.com/pricing/details/private-link)

## Private Link how-tos and FAQs

- [Create a Media Services and Storage account with a Private Link using an Azure Resource Management template](security-private-link-arm-how-to.md)
- [Create a Private Link for a Streaming Endpoint](security-private-link-streaming-endpoint-how-to.md)