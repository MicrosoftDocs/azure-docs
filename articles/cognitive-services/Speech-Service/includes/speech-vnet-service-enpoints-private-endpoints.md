---
author: alexeyo26
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 01/08/2021
ms.author: alexeyo
---

## Private endpoints and VNet service endpoints

Azure offers private endpoints and VNet service endpoints for the traffic tunneling through the [private Azure backbone network](https://azure.microsoft.com/global-infrastructure/global-network/). These endpoint types are similar both in the purpose and in the technologies they are based upon.

However there are specifics of both technologies, which we strongly recommend studying before designing your network:
- [Private Link and private endpoint documentation](../../../private-link/private-link-overview.md)
- [VNet service endpoint documentation](../../../virtual-network/virtual-network-service-endpoints-overview.md)

In particular, consider the following:
- Both technologies ensure the traffic between the VNet and the Speech resource is *not* going through the public internet
- Private endpoint provides a dedicated private IP address for your Speech resource. You have complete flexibility of controlling the access to this IP address, etc.
- VNet service endpoints do *not* provide a dedicated private IP address for the Speech resource, but instead encapsulate all packets sent to the Speech resource and deliver them directly through the Azure backbone network
- Both technologies support on-premises scenarios. By default, when using VNet service endpoints Azure service resources secured to virtual networks aren't reachable from on-premises networks, but this [can be set up](../../../virtual-network/virtual-network-service-endpoints-overview.md#secure-azure-service-access-from-on-premises)
- VNet service points are often used in cases, when you want to restrict the access for your Speech resource, based on the VNet(s) where the traffic originates from
- In case of Cognitive Services enabling the VNet service endpoint forces the traffic for **all** Cognitive Services resources to go through the private backbone network. That requires explicit network access configuration (see details [here](../speech-service-vnet-service-endpoint.md#configure-vnets-and-the-speech-resource-networking-settings)). Private endpoints do not have this limitation and provide more flexibility for your network configuration - you can access one resource through the private backbone and another through the public internet using the same subnet of the same VNet.
- Private endpoints involve [extra cost](https://azure.microsoft.com/pricing/details/private-link). VNet service endpoints are free
- Private endpoints involve [extra DNS configuration](../speech-services-private-link.md#enable-private-endpoints)
- One Speech resource may simultaneously work with both private endpoints and VNet service endpoints

We recommend you try both endpoint types before deciding on your production design. 