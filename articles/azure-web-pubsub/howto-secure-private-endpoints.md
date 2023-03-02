---
title: How to secure the traffic between VNet and Azure Web PubSub service via Azure Private Endpoints
description: Overview of private endpoints for secure access to Azure Web PubSub service from virtual networks.
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: how-to 
ms.date: 11/08/2021
---

# Use private endpoints for Azure Web PubSub service

You can use [private endpoints](../private-link/private-endpoint-overview.md) for your Azure Web PubSub service to allow clients in a virtual network (VNet) to securely access data over a [Private Link](../private-link/private-link-overview.md). The private endpoint uses an IP address from the VNet address space for your Azure Web PubSub service. Network traffic between the clients on the VNet and Azure Web PubSub service traverses over a private link on the Microsoft backbone network, eliminating exposure from the public internet.

Using private endpoints for your Azure Web PubSub service enables you to:

- Secure your Azure Web PubSub service using the network access control to block all connections on the public endpoint for Azure Web PubSub service.
- Increase security for the virtual network (VNet), by enabling you to block exfiltration of data from the VNet.
- Securely connect to Azure Web PubSub service from on-premises networks that connect to the VNet using [VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md) or [ExpressRoutes](../expressroute/expressroute-locations.md) with private-peering.

## Conceptual overview

:::image type="content" source="./media/howto-secure-private-endpoints/private-endpoint-overview.png" alt-text="Overview of private endpoints for Azure Web PubSub service.":::

A private endpoint is a special network interface for an Azure service in your [Virtual Network](../virtual-network/virtual-networks-overview.md) (VNet). When you create a private endpoint for your Azure Web PubSub service, it provides secure connectivity between clients on your VNet and your service. The private endpoint is assigned an IP address from the IP address range of your VNet. The connection between the private endpoint and Azure Web PubSub service uses a secure private link.

Applications in the VNet can connect to Azure Web PubSub service over the private endpoint seamlessly, **using the same connection strings and authorization mechanisms that they would use otherwise**. Private endpoints can be used with all protocols supported by the Azure Web PubSub service, including REST API.

When you create a private endpoint for an Azure Web PubSub service in your VNet, a consent request is sent for approval to the Azure Web PubSub service owner. If the user requesting the creation of the private endpoint is also an owner of the Azure Web PubSub service, this consent request is automatically approved.

Azure Web PubSub service owners can manage consent requests and the private endpoints, through the '*Private endpoints*' tab for the Azure Web PubSub service in the [Azure portal](https://portal.azure.com).

> [!TIP]
> If you want to restrict access to your Azure Web PubSub service through the private endpoint only, [configure the Network Access Control](howto-secure-network-access-control.md) to deny or control access through the public endpoint.

### Connecting to private endpoints

Clients on a VNet using the private endpoint should use the same connection string for the Azure Web PubSub service, as clients connecting to the public endpoint. We rely upon DNS resolution to automatically route the connections from the VNet to Azure Web PubSub service over a private link.

> [!IMPORTANT]
> Use the same connection string to connect to Azure Web PubSub service using private endpoints, as you'd use otherwise. Please don't connect to Azure Web PubSub service using its `privatelink` subdomain URL.

We create a [private DNS zone](../dns/private-dns-overview.md) attached to the VNet with the necessary updates for the private endpoints, by default. However, if you're using your own DNS server, you may need to make other changes to your DNS configuration. The section on [DNS changes](#dns-changes-for-private-endpoints) below describes the updates required for private endpoints.

## DNS changes for private endpoints

When you create a private endpoint, the DNS CNAME resource record for your Azure Web PubSub service is updated to an alias in a subdomain with the prefix `privatelink`. By default, we also create a [private DNS zone](../dns/private-dns-overview.md), corresponding to the `privatelink` subdomain, with the DNS A resource records for the private endpoints.

When you resolve your Azure Web PubSub service domain name from outside the VNet with the private endpoint, it resolves to the public endpoint of the Azure Web PubSub service. When resolved from the VNet hosting the private endpoint, the domain name resolves to the private endpoint's IP address.

For the illustrated example above, the DNS resource records for the Azure Web PubSub service 'foobar', when resolved from outside the VNet hosting the private endpoint, will be:

| Name                                                  | Type  | Value                                                 |
| :---------------------------------------------------- | :---: | :---------------------------------------------------- |
| ``foobar.webpubsub.azure.com``                        | CNAME | ``foobar.privatelink.webpubsub.azure.com``            |
| ``foobar.privatelink.webpubsub.azure.com``            | A     | \<Azure Web PubSub service public IP address\>           |

As previously mentioned, you can deny or control access for clients outside the VNet through the public endpoint using the network access control.

The DNS resource records for 'foobar', when resolved by a client in the VNet hosting the private endpoint, will be:

| Name                                                  | Type  | Value                                                 |
| :---------------------------------------------------- | :---: | :---------------------------------------------------- |
| ``foobar.webpubsub.azure.com``                        | CNAME | ``foobar.privatelink.webpubsub.azure.com``            |
| ``foobar.privatelink.webpubsub.azure.com``            | A     | 10.1.1.5                                              |

This approach enables access to Azure Web PubSub service **using the same connection string** for clients on the VNet hosting the private endpoints, and clients outside the VNet.

If you are using a custom DNS server on your network, clients must be able to resolve the FQDN for the Azure Web PubSub service endpoint to the private endpoint IP address. You should configure your DNS server to delegate your private link subdomain to the private DNS zone for the VNet, or configure the A records for `foobar.privatelink.webpubsub.azure.com` with the private endpoint IP address.

> [!TIP]
> When using a custom or on-premises DNS server, you should configure your DNS server to resolve the Azure Web PubSub service name in the `privatelink` subdomain to the private endpoint IP address. You can do this by delegating the `privatelink` subdomain to the private DNS zone of the VNet, or configuring the DNS zone on your DNS server and adding the DNS A records.

The recommended DNS zone name for private endpoints for Azure Web PubSub service is: `privatelink.webpubsub.azure.com`.

For more information on configuring your own DNS server to support private endpoints, see the following articles:

- [Name resolution for resources in Azure virtual networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server)
- [DNS configuration for private endpoints](../private-link/private-endpoint-overview.md#dns-configuration)

## Create a private endpoint

### Create a private endpoint along with a new Azure Web PubSub service in the Azure portal

1. When creating a new Azure Web PubSub service, select **Networking** tab. Choose **Private endpoint** as connectivity method.

    :::image type="content" source="./media/howto-secure-private-endpoints/portal-create-blade-networking-tab.png" alt-text="Create Azure Web PubSub service - Networking tab.":::

1. Select **Add**. Fill in subscription, resource group, location, name for the new private endpoint. Choose a virtual network and subnet.

1. Select **Review + create**.

### Create a private endpoint for an existing Azure Web PubSub service in the Azure portal

1. Go to the Azure Web PubSub service.

1. Select on the settings menu called **Private endpoint connections**.

1. Select the button **+ Private endpoint** on the top.

1. Fill in subscription, resource group, resource name, and region for the new private endpoint.

1. Choose target Azure Web PubSub service resource.

1. Choose target virtual network

1. Select **Review + create**.

## Pricing

For pricing details, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link).

## Known Issues

Keep in mind the following known issues about private endpoints for Azure Web PubSub service.

### Free tier

The Azure Web PubSub service free tier instance cannot integrate with private endpoint.

### Access constraints for clients in VNets with private endpoints

Clients in VNets with existing private endpoints face constraints when accessing other Azure Web PubSub service instances that have private endpoints. For instance, suppose a VNet N1 has a private endpoint for an Azure Web PubSub service instance W1. If Azure Web PubSub service W2 has a private endpoint in a VNet N2, then clients in VNet N1 must also access Azure Web PubSub service W2 using a private endpoint. If Azure Web PubSub service W2 does not have any private endpoints, then clients in VNet N1 can access Azure Web PubSub service in that account without a private endpoint.

This constraint is a result of the DNS changes made when Azure Web PubSub service W2 creates a private endpoint.

### Network Security Group rules for subnets with private endpoints

Currently, you can't configure [Network Security Group](../virtual-network/network-security-groups-overview.md) (NSG) rules and user-defined routes for private endpoints. NSG rules applied to the subnet hosting the private endpoint are applied to the private endpoint. A limited workaround for this issue is to implement your access rules for private endpoints on the source subnets, though this approach may require a higher management overhead.

