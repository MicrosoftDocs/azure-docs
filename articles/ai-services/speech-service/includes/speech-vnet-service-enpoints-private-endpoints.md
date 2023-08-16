---
author: alexeyo26
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 03/19/2021
ms.author: alexeyo
---

## Private endpoints and Virtual Network service endpoints

Azure provides private endpoints and Virtual Network service endpoints for traffic that tunnels via the [private Azure backbone network](https://azure.microsoft.com/global-infrastructure/global-network/). The purpose and underlying technologies of these endpoint types are similar. But there are differences between the two technologies. We recommend that you learn about the pros and cons of both before you design your network.

There are a few things to consider when you decide which technology to use:
- Both technologies ensure that traffic between the virtual network and the Speech resource doesn't travel over the public internet.
- A private endpoint provides a dedicated private IP address for your Speech resource. This IP address is accessible only within a specific virtual network and subnet. You have full control of the access to this IP address within your network infrastructure.
- Virtual Network service endpoints don't provide a dedicated private IP address for the Speech resource. Instead, they encapsulate all packets sent to the Speech resource and deliver them directly over the Azure backbone network.
- Both technologies support on-premises scenarios. By default, when they use Virtual Network service endpoints, Azure service resources secured to virtual networks can't be reached from on-premises networks. But you can [change that behavior](../../../virtual-network/virtual-network-service-endpoints-overview.md#secure-azure-service-access-from-on-premises).
- Virtual Network service endpoints are often used to restrict the access for a Speech resource based on the virtual networks from which the traffic originates.
- For Azure AI services, enabling the Virtual Network service endpoint forces the traffic for all Azure AI services resources to go through the private backbone network. That requires explicit network access configuration. (For more information, see [Configure virtual networks and the Speech resource networking settings](../speech-service-vnet-service-endpoint.md#configure-virtual-networks-and-the-speech-resource-networking-settings).) Private endpoints don't have this limitation and provide more flexibility for your network configuration. You can access one resource through the private backbone and another through the public internet by using the same subnet of the same virtual network.
- Private endpoints incur [extra costs](https://azure.microsoft.com/pricing/details/private-link). Virtual Network service endpoints are free.
- Private endpoints require [extra DNS configuration](../speech-services-private-link.md#turn-on-private-endpoints).
- One Speech resource can work simultaneously with both private endpoints and Virtual Network service endpoints.

We recommend that you try both endpoint types before you make a decision about your production design. 

For more information, see these resources:

- [Azure Private Link and private endpoint documentation](../../../private-link/private-link-overview.md)
- [Virtual Network service endpoints documentation](../../../virtual-network/virtual-network-service-endpoints-overview.md)
