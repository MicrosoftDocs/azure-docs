---
title: Microsoft Azure Peering Service partner overview
description: Learn about MAPS and how to become a partner.
services: internet-peering
author: jsaraco
ms.service: internet-peering
ms.topic: overview
ms.date: 04/07/2023
ms.author: jsaraco
ms.custom: template-overview, engagement-fy23
---

# Microsoft Azure Peering Service partner overview

Microsoft Azure Peering Service (MAPS) is a networking service that enhances the connectivity to Microsoft cloud services such as Microsoft 365, Dynamics 365, software as a service (SaaS) services, Azure, or any Microsoft services accessible via the public internet. Microsoft can partner with internet service providers (ISPs), internet exchange partners (IXPs), and software-defined cloud interconnect (SDCI) providers worldwide to provide reliable and high-performing public connectivity with optimal routing from you to the Microsoft network.

With Peering Service, partners can configure local and geo-redundancy with their links. This achieves optimal and reliable routing to the Microsoft cloud over the public network. Public connectivity is optimized for high reliability and minimal latency from cloud services to the end-user location.

:::image type="content" source="./media/maps-partner-overview/peering-service-what.png" alt-text="Diagram showing distributed connectivity to Microsoft cloud."::: 

> [!NOTE]
> This article is intended for network architects in charge of enterprise connectivity to the cloud and to the internet.

## What is Microsoft Azure Peering Service?

MAPS is:

- An IP service that uses the public internet. 
- A value-added service that's intended to offer optimal and reliable routing to the Microsoft cloud over the public network.

## Background

Microsoft 365, Dynamics 365, and any other Microsoft SaaS services are hosted in multiple Microsoft datacenters and can be accessed from any geographic location. The Microsoft global network has Microsoft Edge point-of-presence (PoP) locations around the world where it can connect to an end user via your direct peering interconnects. 

Microsoft ensures that the traffic for the prefixes registered with a MAPS connection enter and exit the nearest Microsoft Edge PoP locations on the Microsoft global network. Microsoft ensures that the networking traffic egressing from the prefixes registered with MAPS connections takes the nearest Microsoft Edge PoP locations on the Microsoft global network.

:::image type="content" source="./media/maps-partner-overview/peering-service-background-final.png" alt-text="Diagram showing Microsoft network and public connectivity.":::

> [!NOTE]
> For more information about the Microsoft global network, see [Microsoft global network](../networking/microsoft-global-network.md).
>

## MAPS partner requirements

To become a MAPS partner, the following technical requirements must be followed:

-	The Peer MUST provide its own Autonomous System Number (ASN), which MUST be public.
-	The Peer MUST have redundant Interconnect (PNI) at each interconnect location to ensure local redundancy.
-	The Peer MUST supply and advertise their own publicly routable IPv4 address space used by Peer's endpoints (for example, SBC). 
-	The Peer MUST supply detail of what class of traffic and endpoints are housed in each advertised subnet.
-	The Peer MUST NOT terminate the peering on a device running a stateful firewall.
-	The Peer CANNOT have two local connections configured on the same router, as diversity is required
-  The Peer CANNOT apply rate limiting to their connection
-  The Peer CANNOT configure a local redundant connection as a backup connection. Backup connections must be in a different location than primary connections.
-  Primary, backup, and redundant sessions all must have the same bandwidth
-	It is recommended to create MAPS peerings in multiple locations so geo-redundancy can be achieved.
-	Microsoft configures all the interconnect links as LAG (link bundles) by default, so, peer MUST support LACP (Link Aggregation Control Protocol) on the interconnect links.

If you can follow all of the requirements listed and would like to become a MAPS partner, an agreement must be signed. Contact peeringservice@microsoft.com to get started.

## Types of MAPS connections

To become a MAPS partner, you must request a direct peering interconnect with Microsoft. They come in three types depending on your use case.

- **AS8075** - A direct peering interconnect enabled for MAPS made for Internet Service providers (ISPs)
- **AS8075 (with Voice)** - A direct peering interconnect enabled for MAPS made for Internet Service providers (ISPs). This type is optimized for communications services (messaging, conferencing, etc.), and allows you to integrate your communications services infrastructure (SBC, SIP gateways, and other infrastructure device) with Azure Communication Services and Microsoft Teams.
- **AS8075 (with exchange route server)** - A direct peering interconnect enabled for MAPS and made for Internet Exchange providers (IXPs) who require a route server.

## Why use MAPS?

Enterprises looking for internet-first access to the cloud or considering SD-WAN architecture or with high usage of Microsoft SaaS services need robust and high-performing internet connectivity. Some of the key customer features are listed here:

- Best public routing over the internet to Microsoft Azure Cloud Services for optimal performance and reliability.
- Traffic insights such as latency reporting and prefix monitoring.
- Optimum network hops (AS hops) from the Microsoft cloud.
- Route analytics and statistics: Events for BGP route anomalies, and suboptimal routing.

### Robust, reliable peering

MAPS uses two types of redundancy:

- **Local redundancy**

   Microsoft interconnects across multiple Microsoft Edge PoP locations to deliver MAPS. In each location, interconnection must support failover across two routers.

   Each peering location must be provisioned with redundant and diverse peering links.

- **Geo-redundancy**

   MAPS can use two peerings in two different locations so that if one of the Edge nodes has degraded performance, the traffic routes to and from Microsoft via alternate sites. Microsoft routes traffic in its global network by using SDN-based routing policies for optimal performance.

    This type of redundancy uses the shortest routing path by always choosing the nearest Microsoft Edge PoP to the end user and ensures that the user is one network hop (AS hops) away from Microsoft​.

    :::image type="content" source="./media/maps-partner-overview/peering-service-geo-shortest.png" alt-text="Diagram showing geo-redundancy.":::

### Optimal routing

The following routing technique is preferred:

-  **Cold-potato routing**

   The software-defined cold-potato routing technique offers control over network traffic that originates from the Microsoft cloud. It ensures that traffic stays on the high-capacity, low-latency, and highly reliable Microsoft global network until it's as close to the destination as possible.
   
   Routing that doesn't use the cold-potato technique is referred to as hot-potato routing. With hot-potato routing, traffic that originates from the Microsoft cloud then goes over the internet.

    :::image type="content" source="./media/maps-partner-overview/peering-service-cold-potato.png" alt-text="Diagram showing cold-potato routing.":::

### Monitoring platform

   Service monitoring is offered to analyze user traffic and routing, and it provides the following capabilities: 

-  **Latency**

   This service monitors the routing performance between the user's location and Microsoft. 
   
   Routing performance is measured by validating the round-trip time taken from the client to reach the Microsoft Edge PoP. Users can view the latency reports for different geographic locations.

   Monitoring captures the events if there's any service degradation.

    :::image type="content" source="./media/maps-partner-overview/peering-service-latency-report.png" alt-text="Diagram showing monitoring platform for MAPS.":::

## Next steps

- To establish a Direct interconnect for MAPS, see [Internet peering for MAPS walkthrough](./walkthrough-peering-service-all.md)
- To establish a Direct interconnect for MAPS Communications Services, see [Internet peering for MAPS Communications Services walkthrough](./walkthrough-communications-services-partner.md)
- To establish a Direct interconnect for MAPS Exchange with Route Server, see [Internet peering for MAPS Exchange with Route Server walkthrough](./walkthrough-exchange-route-server-partner.md)
