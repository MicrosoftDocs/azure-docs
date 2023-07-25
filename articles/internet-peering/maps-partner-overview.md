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

## Background

For an overview of the Microsoft Azure Peering Service product, see [MAPS Overview](../peering-service/about.md)

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

### Monitoring platform

   Service monitoring is offered to analyze user traffic and routing. The following metrics are available in the Azure portal to track the performance and availability of your MAPS peering: 

- **Ingress and egress traffic rates**

- **BGP session availability**

- **Packet drops**

- **Flap events**

- **Latency**

- **Received routes**

:::image type="content" source="./media/maps-partner-overview/maps-partner-latency-report.png" alt-text="Diagram showing monitoring platform for MAPS.":::

## Next steps

- To establish a Direct interconnect for MAPS, see [Internet peering for MAPS walkthrough](./walkthrough-peering-service-all.md)
- To establish a Direct interconnect for MAPS Communications Services, see [Internet peering for MAPS Communications Services walkthrough](./walkthrough-communications-services-partner.md)
- To establish a Direct interconnect for MAPS Exchange with Route Server, see [Internet peering for MAPS Exchange with Route Server walkthrough](./walkthrough-exchange-route-server-partner.md)
