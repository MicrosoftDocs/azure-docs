---
title: Using private endpoints for Azure App Configuration
description: Secure your App Configuration store using private endpoints
services: azure-app-configuration
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 11/15/2023

#Customer intent: As a developer using Azure App Configuration, I want to understand how to use private endpoints to enable secure communication with my App Configuration instance.
---
# Using private endpoints for Azure App Configuration

You can use [private endpoints](../private-link/private-endpoint-overview.md) for Azure App Configuration to allow clients on a virtual network (VNet) to securely access data over a [private link](../private-link/private-link-overview.md). The private endpoint uses an IP address from the VNet address space for your App Configuration store. Network traffic between the clients on the VNet and the App Configuration store traverses over the VNet using a private link on the Microsoft backbone network, eliminating exposure to the public internet.

Using private endpoints for your App Configuration store enables you to:
- Secure your application configuration details by configuring the firewall to block all connections to App Configuration on the public endpoint.
- Increase security for the virtual network (VNet) ensuring data doesn't escape from the VNet.
- Securely connect to the App Configuration store from on-premises networks that connect to the VNet using [VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md) or [ExpressRoutes](../expressroute/expressroute-locations.md) with private-peering.

## Conceptual overview

A private endpoint is a special network interface for an Azure service in your [Virtual Network](../virtual-network/virtual-networks-overview.md) (VNet). When you create a private endpoint for your App Configuration store, it provides secure connectivity between clients on your VNet and your configuration store. The private endpoint is assigned an IP address from the IP address range of your VNet. The connection between the private endpoint and the configuration store uses a secure private link.

Applications in the VNet can connect to the configuration store over the private endpoint **using the same connection strings and authorization mechanisms that they would use otherwise**. Private endpoints can be used with all protocols supported by the App Configuration store.

While App Configuration doesn't support service endpoints, private endpoints can be created in subnets that use [Service Endpoints](../virtual-network/virtual-network-service-endpoints-overview.md). Clients in a subnet can connect securely to an App Configuration store using the private endpoint while using service endpoints to access others.  

When you create a private endpoint for a service in your VNet, a consent request is sent for approval to the service account owner. If the user requesting the creation of the private endpoint is also an owner of the account, this consent request is automatically approved.

Service account owners can manage consent requests and private endpoints through the `Private Endpoints` tab of the App Configuration store in the [Azure portal](https://portal.azure.com).

### Private endpoints for App Configuration 

When creating a private endpoint, you must specify the App Configuration store to which it connects. If you enable the geo-replication for an App Configuration store, you can connect to all replicas of the store using the same private endpoint. If you have multiple App Configuration stores, you need a separate private endpoint for each store.

### Connecting to private endpoints

Azure relies upon DNS resolution to route connections from the VNet to the configuration store over a private link. You can quickly find connections strings in the Azure portal by selecting your App Configuration store, then selecting **Settings** > **Access Keys**.  

> [!IMPORTANT]
> Use the same connection string to connect to your App Configuration store using private endpoints as you would use for a public endpoint. Don't connect to the store using its `privatelink` subdomain URL.

> [!NOTE]
> By default, when a private endpoint is added to your App Configuration store, all requests for your App Configuration data over the public network are denied. You can enable public network access by using the following Azure CLI command. It's important to consider the security implications of enabling public network access in this scenario.
>
> ```azurecli-interactive
> az appconfig update -g MyResourceGroup -n MyAppConfiguration --enable-public-network true
> ```

## DNS changes for private endpoints

When you create a private endpoint, the DNS CNAME resource record for the configuration store is updated to an alias in a subdomain with the prefix `privatelink`. Azure also creates a [private DNS zone](../dns/private-dns-overview.md) corresponding to the `privatelink` subdomain, with the DNS A resource records for the private endpoints.

When you resolve the endpoint URL from within the VNet hosting the private endpoint, it resolves to the private endpoint of the store. When resolved from outside the VNet, the endpoint URL resolves to the public endpoint. When you create a private endpoint, the public endpoint is disabled. Enabling geo-replication creates separate DNS records for each replica with unique IP addresses in the private DNS zone. 

If you are using a custom DNS server on your network, you need to configure it to delegate your privatelink subdomain to the private DNS zone for the VNet. Alternatively, you can configure the A records for your store's private link URLs, which are either `[Your-store-name].privatelink.azconfig.io` or `[Your-store-name]-[replica-name].privatelink.azconfig.io` if geo-replication is enabled, with unique private IP addresses of the private endpoint.

## Pricing

Enabling private endpoints requires a [Standard tier](https://azure.microsoft.com/pricing/details/app-configuration/) App Configuration store.  To learn about private link pricing details, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link).

## Next steps

Learn more about creating a private endpoint for your App Configuration store, refer to the following articles:

- [Create a private endpoint using the Private Link Center in the Azure portal](../private-link/create-private-endpoint-portal.md)
- [Create a private endpoint using Azure CLI](../private-link/create-private-endpoint-cli.md)
- [Create a private endpoint using Azure PowerShell](../private-link/create-private-endpoint-powershell.md)

Learn to configure your DNS server with private endpoints:

- [Name resolution for resources in Azure virtual networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server)
- [DNS configuration for Private Endpoints](../private-link/private-endpoint-overview.md#dns-configuration)
