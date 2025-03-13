---
title: Azure API Management with an Azure virtual network
description: Learn about scenarios and requirements to secure inbound or outbound traffic for your API Management instance using an Azure virtual network.
author: dlepow

ms.service: azure-api-management
ms.topic: concept-article
ms.date: 10/16/2024
ms.author: danlep
---
# Use a virtual network to secure inbound or outbound traffic for Azure API Management

[!INCLUDE [api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2.md)]

By default your API Management instance is accessed from the internet at a public endpoint, and acts as a gateway to public backends. API Management provides several options to use an Azure virtual network to secure access to your API Management instance and to backend APIs. Available options depend on the [service tier](api-management-features.md) of your API Management instance. Choose networking capabilities to meet your organization's needs.

  
The following table compares virtual networking options. For more information, see later sections of this article and links to detailed guidance.

|Networking model  |Supported tiers  |Supported components  |Supported traffic  |Usage scenario |
|---------|---------|---------|---------|----|
|**[Virtual network injection (classic tiers) - external](#virtual-network-injection-classic-tiers)**     | Developer, Premium       | Developer portal, gateway, management plane, and Git repository        | Inbound and outbound traffic can be allowed to internet, peered virtual networks, ExpressRoute, and S2S VPN connections.     | External access to private and on-premises backends |
|**[Virtual network injection (classic tiers) - internal](#virtual-network-injection-classic-tiers)**     |  Developer, Premium      |  Developer portal, gateway, management plane, and Git repository       |  Inbound and outbound traffic can be allowed to peered virtual networks, ExpressRoute, and S2S VPN connections.       | Internal access to private and on-premises backends |
|**[Virtual network injection (v2 tiers)](#virtual-network-injection-v2-tiers)**   |  Premium v2        |   Gateway only      |  Inbound and outbound traffic can be allowed to a delegated subnet of a virtual network, peered virtual networks, ExpressRoute, and S2S VPN connections.     | Internal access to private and on-premises backends |
|**[Virtual network integration (v2 tiers)](#virtual-network-integration-v2-tiers)**   | Standard v2, Premium v2        |   Gateway only      |  Outbound request traffic can reach APIs hosted in a delegated subnet of a single connected virtual network.     | External access to private and on-premises backends | 
|**[Inbound private endpoint](#inbound-private-endpoint)**   | Developer, Basic, Standard, Standard v2 (preview), Premium        |   Gateway only (managed gateway supported, self-hosted gateway not supported)      |    Only inbound traffic can be allowed from internet, peered virtual networks, ExpressRoute, and S2S VPN connections.     | Secure client connection to API Management gateway |


## Virtual network injection (classic tiers)

In the API Management classic Developer and Premium tiers, deploy ("inject") your API Management instance in a subnet in a non-internet-routable network to which you control access. In the virtual network, your API Management instance can securely access other networked Azure resources and also connect to on-premises networks using various VPN technologies. 

 You can use the Azure portal, Azure CLI, Azure Resource Manager templates, or other tools for the configuration. You control inbound and outbound traffic into the subnet in which API Management is deployed by using [network security groups](../virtual-network/network-security-groups-overview.md).

For detailed deployment steps and network configuration, see:

* [Deploy your API Management instance to a virtual network - external mode](./api-management-using-with-vnet.md).
* [Deploy your API Management instance to a virtual network - internal mode](./api-management-using-with-internal-vnet.md).
* [Network resource requirements for API Management injection into a virtual network](virtual-network-injection-resources.md).

### Access options
Using a virtual network, you can configure the developer portal, API gateway, and other API Management endpoints to be accessible either from the internet (external mode) or only within the virtual network (internal mode). 

* **External** - The API Management endpoints are accessible from the public internet via an external load balancer. The gateway can access resources within the virtual network.

    :::image type="content" source="media/virtual-network-concepts/api-management-vnet-external.png" alt-text="Diagram showing a connection to external virtual network." :::

    Use API Management in external mode to access backend services deployed in the virtual network.

* **Internal** - The API Management endpoints are accessible only from within the virtual network via an internal load balancer. The gateway can access resources within the virtual network.

    :::image type="content" source="media/virtual-network-concepts/api-management-vnet-internal.png" alt-text="Diagram showing a connection to internal virtual network." lightbox="media/virtual-network-concepts/api-management-vnet-internal.png":::

    Use API Management in internal mode to:

    * Make APIs hosted in your private datacenter securely accessible by third parties by using Azure VPN connections or Azure ExpressRoute.
    * Enable hybrid cloud scenarios by exposing your cloud-based APIs and on-premises APIs through a common gateway.
    * Manage your APIs hosted in multiple geographic locations, using a single gateway endpoint.

## Virtual network injection (v2 tiers)

In the API Management Premium v2 tier, inject your instance into a delegated subnet of a virtual network to secure the gateway's inbound and outbound traffic. Currently, you can configure settings for virtual network injection at the time you create the instance.

In this configuration: 

* The API Management gateway endpoint is accessible through the virtual network at a private IP address.
* API Management can make outbound requests to API backends that are isolated in the network. 

This configuration is recommended for scenarios where you want to isolate both the API Management instance and the backend APIs. Virtual network injection in the Premium v2 tier automatically manages network connectivity to most service dependencies for Azure API Management.

:::image type="content" source="./media/inject-vnet-v2/vnet-injection.png" alt-text="Diagram of injecting an API Management instance in a virtual network to isolate inbound and outbound traffic."  :::

For more information, see [Inject a Premium v2 instance into a virtual network](inject-vnet-v2.md).

## Virtual network integration (v2 tiers)

The Standard v2 and Premium v2 tiers support outbound virtual network integration to allow your API Management instance to reach API backends that are isolated in a single connected virtual network. The API Management gateway, management plane, and developer portal remain publicly accessible from the internet. 

Outbound integration enables the API Management instance to reach both public and network-isolated backend services.

:::image type="content" source="./media/integrate-vnet-outbound/vnet-integration.png" alt-text="Diagram of integrating API Management instance with a delegated subnet."  :::

For more information, see [Integrate an Azure API Management instance with a private virtual network for outbound connections](integrate-vnet-outbound.md).

## Inbound private endpoint

API Management supports [private endpoints](../private-link/private-endpoint-overview.md) for secure inbound client connections to your API Management instance. Each secure connection uses a private IP address from your virtual network and Azure Private Link. 

:::image type="content" source="media/virtual-network-concepts/api-management-private-endpoint.png" alt-text="Diagram showing a secure connection to API Management using private endpoint." lightbox="media/virtual-network-concepts/api-management-private-endpoint.png":::

[!INCLUDE [api-management-private-endpoint](../../includes/api-management-private-endpoint.md)]

For more information, see [Connect privately to API Management using an inbound private endpoint](private-endpoint.md).

## Advanced networking configurations

### Secure API Management endpoints with a web application firewall

You may have scenarios where you need both secure external and internal access to your API Management instance, and flexibility to reach private and on-premises backends. For these scenarios, you may choose to manage external access to the endpoints of an API Management instance with a web application firewall (WAF). 

One example is to deploy an API Management instance in an internal virtual network, and route public access to it using an internet-facing Azure Application Gateway:

:::image type="content" source="media/virtual-network-concepts/api-management-application-gateway.png" alt-text="Diagram showing Application Gateway in front of API Management instance." lightbox="media/virtual-network-concepts/api-management-application-gateway.png":::

For more information, see [Deploy API Management in an internal virtual network with Application Gateway](api-management-howto-integrate-internal-vnet-appgateway.md).


## Related content

Learn more about virtual network configuration with API Management:
* [Deploy your Azure API Management instance to a virtual network - external mode](./api-management-using-with-vnet.md).
* [Deploy your Azure API Management instance to a virtual network - internal mode](./api-management-using-with-internal-vnet.md).
* [Connect privately to API Management using a private endpoint](private-endpoint.md)
* [Inject a Premium v2 instance into a virtual network](inject-vnet-v2.md)
* [Integrate an Azure API Management instance with a private virtual network for outbound connections](integrate-vnet-outbound.md)
* [Defend your Azure API Management instance against DDoS attacks](protect-with-ddos-protection.md)

To learn more about Azure virtual networks, start with the information in the [Azure Virtual Network Overview](../virtual-network/virtual-networks-overview.md).
