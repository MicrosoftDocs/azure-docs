---
title: Use Private Endpoints for Azure App Configuration
description: Become familiar with private endpoints in Azure App Configuration. Find out how clients in a virtual network can access configuration data over a private link.
services: azure-app-configuration
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: concept-article
ms.date: 07/29/2025

# customer intent: As a developer using Azure App Configuration, I want to find out how to use private endpoints so that I can improve the security of communication with my App Configuration instance.
---
# Use private endpoints for Azure App Configuration

You can use [private endpoints](../private-link/private-endpoint-overview.md) for Azure App Configuration to allow clients in a virtual network to access data over a [private link](../private-link/private-link-overview.md). The private endpoint uses an IP address from the virtual network address space for your App Configuration store. Network traffic between the clients on the virtual network and the App Configuration store traverses the virtual network by using a private link on the Microsoft backbone network. This arrangement eliminates exposure to the public internet.

When you use private endpoints for your App Configuration store, you can:

- Help secure your application configuration details by configuring a firewall to block all connections to App Configuration on the public endpoint.
- Increase security for the virtual network, helping to ensure data doesn't escape from the virtual network.
- Improve the security of connections between the App Configuration store and on-premises networks that use [Azure VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) or [Azure ExpressRoute](../expressroute/expressroute-locations.md) with private peering to connect to the virtual network.

The availability of private endpoints depends on the App Configuration tier:

| Tier | Maximum number of private endpoints |
| --- | --- |
| Free | 0 |
| Developer | 1 |
| Standard | 10 |
| Premium | 40 |

For more information about pricing, see [Azure App Configuration pricing](https://azure.microsoft.com/pricing/details/app-configuration/).

## Conceptual overview

A private endpoint is a special network interface for an Azure service in [Azure Virtual Network](../virtual-network/virtual-networks-overview.md). When you create a private endpoint for your App Configuration store, it helps to provide secure connectivity between clients on your virtual network and your configuration store. The private endpoint is assigned an IP address from the IP address range of your virtual network. The connection between the private endpoint and the configuration store uses a private link to optimize security.

Applications in the virtual network can connect to the configuration store over the private endpoint **by using the same connection strings and authorization mechanisms that they use otherwise**. You can use private endpoints with all protocols supported by the App Configuration store.

App Configuration doesn't support service endpoints, but you can create private endpoints in subnets that use [service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md). Clients in a subnet can use a private endpoint to connect to an App Configuration store while using service endpoints to access other services.

When you create a private endpoint for a service in your virtual network, a consent request is sent for approval to the service account owner. If the user requesting the creation of the private endpoint is also an owner of the account, this consent request is automatically approved.

Service account owners can manage consent requests and private endpoints in the [Azure portal](https://portal.azure.com). You can find private endpoint settings by going to your App Configuration store, selecting **Settings** > **Networking**, and then going to the **Private Access** tab.

### Private endpoints for App Configuration 

When you create a private endpoint, you must specify the App Configuration store to which it connects. If you enable geo-replication for an App Configuration store, you can connect to all replicas of the store by using the same private endpoint. If you have multiple App Configuration stores, you need a separate private endpoint for each store.

### Considerations for geo-replicated App Configuration stores

When geo-replication is enabled for your App Configuration store, you can use a single private endpoint to connect to all replicas. However, private endpoints are regional resources. As a result, this approach might not ensure connectivity during a regional outage.

For enhanced resilience, consider creating a private endpoint for each replica of your geo-replicated store, besides a private endpoint for the origin store. If one region becomes unavailable, clients can access the store through a private endpoint provisioned in the same region as a replica. When you use this setup, you need to make [Domain Name System (DNS) changes](#dns-changes-for-private-endpoints). Specifically, the endpoint for each replica should resolve to the relevant IP address for the private endpoint in that replica's region.

### Private endpoint connections

Azure relies on DNS resolution to route connections from the virtual network to the configuration store over a private link. You can find connection strings in the Azure portal by selecting your App Configuration store and then selecting **Settings** > **Access settings**.  

> [!IMPORTANT]
> When you connect to your App Configuration store by using a private endpoint, use the same connection string that you use for a public endpoint. Don't connect to the store by using its `privatelink` subdomain URL.

> [!NOTE]
> By default, when you add a private endpoint to your App Configuration store, all requests for your App Configuration data over the public network are denied. You can enable public network access by using the following Azure CLI command. It's important to consider the security implications of enabling public network access in this scenario.
>
> ```azurecli-interactive
> az appconfig update --resource-group <resource-group-name> --name <App-Configuration-store-name> --enable-public-network true
> ```

## DNS changes for private endpoints

When you create a private endpoint, the DNS CNAME resource record for the configuration store is updated to an alias in a subdomain with the prefix `privatelink`. Azure also creates a [private DNS zone](../dns/private-dns-overview.md) corresponding to the `privatelink` subdomain. The private DNS zone contains a DNS A resource record for the private endpoint. When you enable geo-replication, Azure creates a separate DNS record for each replica. Each record has a unique IP address in the private DNS zone.

When you resolve the endpoint URL from within the virtual network that hosts the private endpoint, the endpoint URL resolves to the private endpoint of the store. When you resolve the endpoint URL from outside the virtual network, the endpoint URL resolves to the public endpoint. When you create a private endpoint, the public endpoint is disabled.

If you use a custom DNS server on your network, you need to configure it to delegate your `privatelink` subdomain to the private DNS zone for the virtual network. Alternatively, you can configure the A records for your store's private link URLs. Those A records use the following formats:

- `<App-Configuration-store-name>.privatelink.azconfig.io` for your origin store.
- `<App-Configuration-store-name>-<replica-name>.privatelink.azconfig.io` for each replica if geo-replication is enabled. Each private endpoint has a unique private IP address.

## Pricing

Enabling private endpoints requires an App Configuration store with a [Developer, Standard, or Premium tier](https://azure.microsoft.com/pricing/details/app-configuration/). For more information about private link pricing, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link).

## Troubleshoot resource provider registration errors

If you connect a private endpoint to an App Configuration store in a subscription where the App Configuration resource provider isn't registered, the following message appears:

"The private endpoint's subscription 'aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e' is not registered to use resource provider 'Microsoft.AppConfiguration.'"

This message typically appears when the private endpoint and the App Configuration store are in different subscriptions. To resolve the situation, take the following steps:

1. Register the `Microsoft.AppConfiguration` resource provider in the private endpoint's subscription.
1. Reconnect the private endpoint to the App Configuration store.

For more information about registering a subscription to a resource provider, see [Register resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).

## Next steps

To find out how to create a private endpoint for your App Configuration store, see the following articles:

- [Create a private endpoint by using the Azure portal](../private-link/create-private-endpoint-portal.md)
- [Create a private endpoint by using the Azure CLI](../private-link/create-private-endpoint-cli.md)
- [Create a private endpoint by using Azure PowerShell](../private-link/create-private-endpoint-powershell.md)

To find out how to configure your DNS server with private endpoints, see the following articles:

- [Name resolution for resources in Azure virtual networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server)
- [DNS configuration for private endpoints](../private-link/private-endpoint-overview.md#dns-configuration)