---
author: alexeyo26
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 03/19/2021
ms.author: alexeyo
---

## Private endpoints and VNet service endpoints

Azure offers private endpoints and VNet service endpoints for traffic tunneling using the [private Azure backbone network](https://azure.microsoft.com/global-infrastructure/global-network/). These endpoint types are similar in the purpose, and the technologies they are based on. However there are differences between the two technologies, and we recommend learning more about the pros and cons of each before designing your network.

These are a few things that you should consider when making a choice:
- Both technologies ensure the traffic between the VNet and the Speech resource is *not* going through the public internet.
- A private endpoint provides a dedicated private IP address for your Speech resource. This IP address is accessible only within a specific VNet and subnet. You have full control of the access to this IP address within your network infrastructure.
- VNet service endpoints do *not* provide a dedicated private IP address for the Speech resource, but instead encapsulate all packets sent to the Speech resource and deliver them directly through the Azure backbone network.
- Both technologies support on-premises scenarios. By default, when using VNet service endpoints Azure service resources secured to virtual networks aren't reachable from on-premises networks, but this [can be set up](../../../virtual-network/virtual-network-service-endpoints-overview.md#secure-azure-service-access-from-on-premises).
- VNet service points are often used when you want to restrict the access for your Speech resource based on the VNet(s) where the traffic originates from.
- In case of Cognitive Services, enabling the VNet service endpoint forces the traffic for **all** Cognitive Services resources to go through the private backbone network. That requires explicit network access configuration (see details [here](../speech-service-vnet-service-endpoint.md#configure-vnets-and-the-speech-resource-networking-settings)). Private endpoints do not have this limitation and provide more flexibility for your network configuration - you can access one resource through the private backbone and another through the public internet using the same subnet of the same VNet.
- Private endpoints incur [extra costs](https://azure.microsoft.com/pricing/details/private-link). VNet service endpoints are free.
- Private endpoints require [extra DNS configuration](../speech-services-private-link.md#turn-on-private-endpoints).
- One Speech resource may simultaneously work with both private endpoints and VNet service endpoints.

We recommend that you try both endpoint types before deciding on your production design. 

- [Private Link and private endpoint documentation](../../../private-link/private-link-overview.md)
- [VNet service endpoint documentation](../../../virtual-network/virtual-network-service-endpoints-overview.md)
