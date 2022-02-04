---
title: Private Endpoint connections overview
description: This article is an overview of Private Endpoint connections with Media Services.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: conceptual
ms.date: 10/22/2021
ms.author: inhenkel
---

# Private Endpoint connections overview

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This article is an overview of Private Endpoint connections with Media Services.

## Clients using VNet

Clients on a VNet using the private endpoint should use the same DNS name to connect to Media Services as clients connecting to the public Media Services endpoints. Media Services relies upon DNS resolution to automatically route the connections from the VNet to the Media Services endpoints over a private link.

> [!IMPORTANT]
> Use the same DNS names to the Media Services endpoints when using private endpoints as you’d otherwise use. Please don't connect to the Media Services endpoints using its privatelink subdomain URL.

Media Services creates a [private DNS zone](../../dns/private-dns-overview.md) attached to the VNet with the necessary updates for the private endpoints, by default. However, if you're using your own DNS server, you may need to make additional changes to your DNS configuration. The section on DNS changes below describes the updates required for private endpoints.

## DNS changes for private endpoints

When you create a private endpoint, the **DNS CNAME** resource record for each of the Media Services endpoints is updated to an alias in a subdomain with the prefix `privatelink`. By default, we also create a private DNS zone, corresponding to the `privatelink` subdomain, with the DNS A resource records for the private endpoints.

When you resolve a Media Services DNS name from outside the VNet with the private endpoint, it resolves to the public endpoint of the Media Services endpoint. When resolved from the VNet hosting the private endpoint, the Media Services URL resolves to the private endpoint's IP address.

For example, the DNS resource records for a Streaming Endpoint in the Media Services `MediaAccountA`, when resolved from outside the VNet hosting the private endpoint, will be:

| Name | Type | Value |
| ---- | ---- | ----- |
| mediaaccounta-uswe1.streaming.media.azure.net | CNAME | mediaaccounta-uswe1.streaming.privatelink.media.azure.net |
|mediaaccounta-uswe1.streaming.privatelink.media.azure.net | CNAME | `<Streaming Endpoint public endpoint>` |
| `<Streaming Endpoint public endpoint>` | CNAME | `<Streaming Endpoint internal endpoint>` |
| `<Streaming Endpoint internal endpoint>` | A | `<Streaming Endpoint public IP address>` |

You can deny or restrict public internet access to Media Services endpoints using IP allowlists, or by disabling public network access for all resources within the account.

The DNS resource records for the example Streaming Endpoint in 'MediaAccountA', when resolved by a client in the VNet hosting the private endpoint, will be:

| Name | Type | Value |
| ---- | ---- | ----- |
| mediaaccounta-uswe1.streaming.media.azure.net | CNAME | mediaaccounta-uswe1.streaming.privatelink.media.azure.net |
|mediaaccounta-uswe1.streaming.privatelink.media.azure.net | A | `<Streaming Endpoint public endpoint>`, for example" 10.0.0.9 |

This approach enables access to the Media Services endpoint using the same DNS name for clients within the VNet hosting the private endpoints. It does the same thing for clients outside the VNet.

If you're using a custom DNS server on your network, clients must resolve the FQDN for the Media Services endpoint to the private endpoint IP address. Configure your DNS server to delegate your private link subdomain to the private DNS zone for the VNet, or configure the A records for `mediaaccounta-usw22.streaming.privatelink.media.azure.net` with the private endpoint IP address.

> [!TIP]
> When using a custom or on-premises DNS server, you should configure your DNS server to resolve the Media Services endpoint name in the privatelink subdomain to the private endpoint IP address. You can do this by delegating the privatelink subdomain to the private DNS zone of the VNet, or configuring the DNS zone on your DNS server and adding the DNS A records.

The recommended DNS zone names for private endpoints for storage services, and the associated endpoint target subresources, are:

| Media Services Endpoint | Private Link Group ID | DNS Zone Name |
| ----------------------- | --------------------- | ------------- |
| Streaming Endpoint | streamingendpoint | privatelink.media.azure.net |
| Key Delivery | streamingendpoint | privatelink.media.azure.net |
| Live Event | liveevent | privatelink.media.azure.net |

For more information about configuring your own DNS server to support private endpoints, refer to the following articles:

- [Name resolution for resources in Azure virtual networks](../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server)
- [DNS configuration for private endpoints](../../private-link/private-endpoint-overview.md#dns-configuration)

## Public network access flag

The `publicNetworkAccess` flag on the Media Services account can be used to allow or block access to Media Services endpoints from the public internet. When `publicNetworkAccess` is disabled, requests to any Media Services endpoint from the public internet are blocked; requests to private endpoints are still allowed.  

## Service level IP allowlists

When `publicNetworkAccess` is enabled, requests from the public internet are allowed, subject to service level IP allowlists. If `publicNetworkAccess` is disabled, requests from the public internet are blocked, regardless of the IP allowlist settings. IP allowlists only apply to requests from the public internet; requests to private endpoints are not filtered by the IP allowlists.