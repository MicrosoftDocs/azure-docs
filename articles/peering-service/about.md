---
title: Azure Peering Service overview
description: Learn about Azure Peering Service concepts and features to optimize network connectivity with Microsoft's global network.
author: halkazwini
ms.author: halkazwini
ms.service: peering-service
ms.topic: overview
ms.date: 09/27/2023

#CustomerIntent: As an administrator, I want learn about Azure Peering Service so I can optimize the connectivity to Microsoft.
---

# Azure Peering Service overview

Azure Peering Service is a networking service that enhances the connectivity to Microsoft cloud services such as Microsoft 365, Dynamics 365, software as a service (SaaS) services, Azure, or any Microsoft services accessible via the public internet. Microsoft has partnered with internet service providers (ISPs), internet exchange partners (IXPs), and software-defined cloud interconnect (SDCI) providers worldwide to provide reliable and high-performing public connectivity with optimal routing from the customer to the Microsoft network.

With Peering Service, customers can select a well-connected partner service provider in a given region. Public connectivity is optimized for high reliability and minimal latency from cloud services to the end-user location.

:::image type="content" source="./media/about/peering-service-what.png" alt-text="Diagram showing distributed connectivity to Microsoft cloud.":::

Customers can also opt for Peering Service telemetry such as user latency measures to the Microsoft network and BGP route monitoring by registering the Peering Service connection in the Azure portal. 

To use Peering Service, customers aren't required to register with Microsoft. The only requirement is to contact a [Peering Service partner](location-partners.md) to get the service. To opt in for Peering Service telemetry, customers must register for it in the Azure portal.

For instructions on how to register a Peering Service, see [Create, change, or delete a Peering Service connection using the Azure portal](azure-portal.md). 

> [!NOTE]
> This article is intended for network architects in charge of enterprise connectivity to the cloud and to the internet.

## What is Peering Service?

Peering Service is:

- An IP service that uses the public internet. 
- A collaboration platform with service providers and a value-added service that's intended to offer optimal and reliable routing via service provider partners to the Microsoft cloud over the public network.

> [!NOTE]
> Peering Service isn't a private connectivity product like Azure ExpressRoute or Azure VPN. For more information, see:
> - [What is Azure ExpressRoute?](../expressroute/expressroute-introduction.md)
> - [What is Azure VPN Gateway?](../vpn-gateway/vpn-gateway-about-vpngateways.md)

## Background

Microsoft 365, Dynamics 365, and any other Microsoft SaaS services are hosted in multiple Microsoft datacenters and can be accessed from any geographic location. The Microsoft global network has Microsoft Edge point-of-presence (PoP) locations around the world where it can connect to an end user via their service providers. 

Microsoft and partner service providers ensure that the traffic for the prefixes registered with a Peering Service connection enters and exits the nearest Microsoft Edge PoP locations on the Microsoft global network. Microsoft ensures that the networking traffic egressing from the prefixes registered with Peering Service connections takes the nearest Microsoft Edge PoP locations on the Microsoft global network.

:::image type="content" source="./media/about/peering-service-background-final.png" alt-text="Diagram showing Microsoft network and public connectivity.":::

> [!NOTE]
> For more information about the Microsoft global network, see [Microsoft global network](../networking/microsoft-global-network.md).
>

## Why use Peering Service?

Enterprises looking for internet-first access to the cloud or considering SD-WAN architecture or with high usage of Microsoft SaaS services need robust and high-performing internet connectivity. Customers can make that transition happen by using Peering Service. Microsoft and service providers have partnered to deliver reliable and performance-centric public connectivity to the Microsoft cloud. Some of the key customer features are listed here:

- Best public routing over the internet to Microsoft Azure Cloud Services for optimal performance and reliability.
- Ability to select the preferred service provider to connect to the Microsoft cloud.
- Traffic insights such as latency reporting and prefix monitoring.
- Optimum network hops (AS hops) from the Microsoft cloud.
- Route analytics and statistics: Events for BGP route anomalies and suboptimal routing.

### Robust, reliable peering

Peering Service uses two types of redundancy:

- **Local redundancy**

   Microsoft and service providers interconnect across multiple Microsoft Edge PoP locations to deliver Peering Service. In each location, interconnection must support failover across two routers.

   Each peering location is provisioned with redundant and diverse peering links.

- **Geo-redundancy**

   Microsoft has interconnected with service providers at multiple metro locations so that if one of the Edge nodes has degraded performance, the traffic routes to and from Microsoft via alternate sites. Microsoft routes traffic in its global network by using SDN-based routing policies for optimal performance.

    This type of redundancy uses the shortest routing path by always choosing the nearest Microsoft Edge PoP to the end user and ensures that the customer is one network hop (AS hops) away from Microsoft​.

    :::image type="content" source="./media/about/peering-service-geo-shortest.png" alt-text="Diagram showing geo-redundancy.":::

### Optimal routing

The following routing technique is preferred:

-  **Cold-potato routing**

   The software-defined cold-potato routing technique offers control over network traffic that originates from the Microsoft cloud. It ensures that traffic stays on the high-capacity, low-latency, and highly reliable Microsoft global network until it's as close to the destination as possible.
   
   Routing that doesn't use the cold-potato technique is referred to as hot-potato routing. With hot-potato routing, traffic that originates from the Microsoft cloud then goes over the internet.

    :::image type="content" source="./media/about/peering-service-cold-potato.png" alt-text="Diagram showing cold-potato routing.":::

### Monitoring platform

Service monitoring is offered to analyze user traffic and routing. The following metrics are available in the Azure portal to track the performance and availability of your Peering Service connection:  

- **Ingress and egress traffic rates**

- **BGP session availability**

- **Packet drops**

- **Flap events**

- **Latency**

- **Prefix events**

    :::image type="content" source="./media/about/peering-service-latency-report.png" alt-text="Diagram showing monitoring platform for Peering Service.":::
    
### Onboarding a Peering Service connection

To onboard a Peering Service connection:

- Work with internet service provider (ISP) or Internet Exchange (IX) Partner to obtain a Peering Service to connect your network with the Microsoft network.

- Ensure the [connectivity provider](location-partners.md) is partnered with Microsoft for Peering Service. 

## FAQ

For frequently asked questions about Peering Service, see [Azure Peering Service frequently asked questions (FAQ)](faq.yml).

## Related content

- To register Peering Service, see [Create, change, or delete a Peering Service connection using the Azure portal](azure-portal.md).
- To learn about Peering Service connections, see [Peering Service connections](connection.md).
- To find a service provider partner, see [Peering Service partners](location-partners.md).
