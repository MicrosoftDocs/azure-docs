---
title: Using Private Endpoints for Azure App Configuration
description: Understand how to secure your Azure App Configuration store using private endpoints
services: azure-app-configuration
author: lisaguthrie
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 1/29/2020
ms.author: lcozzens

#Customer intent: As a developer using Azure App Configuration, I want to understand how to use private endpoints to enable secure communication with my App Configuration instance.
---
# Using Private Endpoints for Azure App Configuration

You can use [Private Endpoints](../../private-link/private-endpoint-overview.md) for your Azure App Configuration service to allow clients on a virtual network (VNet) to securely access data over a [Private Link](../../private-link/private-link-overview.md). The private endpoint uses an IP address from the VNet address space for your App Configuration service. Network traffic between the clients on the VNet and the App Configuration instance account traverses over the VNet and a private link on the Microsoft backbone network, eliminating exposure from the public internet.

Using private endpoints for your App Configuration service enables you to:
- Secure your application configuration details by configuring the firewall to block all connections on the public endpoint App Configuration service.
- Increase security for the virtual network (VNet), by enabling you to block exfiltration of data from the VNet.
- Securely connect to the App Configuration service from on-premises networks that connect to the VNet using [VPN](../../vpn-gateway/vpn-gateway-about-vpngateways.md) or [ExpressRoutes](../../expressroute/expressroute-locations.md) with private-peering.

## Conceptual Overview

A Private Endpoint is a special network interface for an Azure service in your [Virtual Network](../../virtual-network/virtual-networks-overview.md) (VNet). When you create a private endpoint for your App Config instance, it provides secure connectivity between clients on your VNet and your configuration store. The private endpoint is assigned an IP address from the IP address range of your VNet. The connection between the private endpoint and the configuration service uses a secure private link.

Applications in the VNet can connect to the configuration service over the private endpoint **using the same connection strings and authorization mechanisms that they would use otherwise**. Private endpoints can be used with all protocols supported by the App Configuration instance, including REST and SMB.

Private endpoints can be created in subnets that use [Service Endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md). Clients in a subnet can connect securely to an App Configuration instance using private endpoint while using service endpoints to access others.

When you create a private endpoint for a service in your VNet, a consent request is sent for approval to the  service account owner. If the user requesting the creation of the private endpoint is also an owner of the account, this consent request is automatically approved.

Service account owners can manage consent requests and the private endpoints, through the '*Private Endpoints*' tab for the storage account in the [Azure portal](https://portal.azure.com).

> [!TIP]
> If you want to restrict access to your App Configuration instance through the private endpoint only, configure the firewall to deny or control access through the public endpoint.

---- /// Remove or update /// ----
You can secure your storage account to only accept connections from your VNet, by [configuring the storage firewall](storage-network-security.md#change-the-default-network-access-rule) to deny access through its public endpoint by default. You don't need a firewall rule to allow traffic from a VNet that has a private endpoint, since the storage firewall only controls access through the public endpoint. Private endpoints instead rely on the consent flow for granting subnets access to the storage service.
---- /// /// ----

### Private Endpoints for App Configuration 

When creating a private endpoint, you must specify the account and the App Configuration instance to which it connects. If you have multiple App Configuration instances within an account, you need a separate private endpoint for each App Configuration instance in the account.

#### Resources

For more detailed information on creating a private endpoint for your App Configuration instance, refer to the following articles:

- [Create a private endpoint using the Private Link Center in the Azure portal](../../private-link/create-private-endpoint-portal.md)
- [Create a private endpoint using Azure CLI](../../private-link/create-private-endpoint-cli.md)
- [Create a private endpoint using Azure PowerShell](../../private-link/create-private-endpoint-powershell.md)

### Connecting to Private Endpoints

Clients on a VNet using the private endpoint should use the same connection string as clients connecting to the public endpoint. We rely upon DNS resolution to automatically route the connections from the VNet to the storage account over a private link. You can quickly find connections strings in the Azure Portal by selecting your App Configuration instance, then selecting **Settings** > **Access Keys**.  

> [!IMPORTANT]
> Use the same connection string to connect to your App Configuration instance using private endpoints as you would use for a public endpoint. Please don't connect to the storage account using its '*privatelink*' subdomain URL.

## DNS changes for Private Endpoints

When you create a private endpoint, the DNS CNAME resource record for the storage account is updated to an alias in a subdomain with the prefix '*privatelink*'. Azure also creates a [private DNS zone](../../dns/private-dns-overview.md), corresponding to the '*privatelink*' subdomain, with the DNS A resource records for the private endpoints.

When you resolve the endpoint URL from outside the VNet with the private endpoint, it resolves to the public endpoint of the service. When resolved from within the VNet hosting the private endpoint, the endpoint URL resolves to the private endpoint.

You can control access for clients outside the VNet through the public endpoint using the Azure Firewall service.

This approach enables access to the storage account **using the same connection string** for clients on the VNet hosting the private endpoints as well as clients outside the VNet.

If you are using a custom DNS server on your network, clients must be able to resolve the FQDN for the storage account endpoint to the private endpoint IP address. You should configure your DNS server to delegate your private link subdomain to the private DNS zone for the VNet, or configure the A records for '*AppConfigInstanceA.privatelink.blob.core.windows.net*' with the private endpoint IP address.

> [!TIP]
> When using a custom or on-premises DNS server, you should configure your DNS server to resolve the storage account name in the 'privatelink' subdomain to the private endpoint IP address. You can do this by delegating the 'privatelink' subdomain to the private DNS zone of the VNet, or configuring the DNS zone on your DNS server and adding the DNS A records.

#### Resources

For more information on configuring your own DNS server to support private endpoints, refer to the following articles:

- [Name resolution for resources in Azure virtual networks](/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances#name-resolution-that-uses-your-own-dns-server)
- [DNS configuration for Private Endpoints](/azure/private-link/private-endpoint-overview#dns-configuration)

## Pricing

For pricing details, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link).