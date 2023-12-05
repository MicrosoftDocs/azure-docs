---
title: Azure Peering Service partner overview
description: Learn how to become an Azure Peering Service partner.
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: concept-article
ms.date: 08/18/2023
---

# Azure Peering Service partner overview

This article helps you understand how to become an Azure Peering Service partner. It also describes the different types of Peering Service connections and the monitoring platform. For more information about Azure Peering Service, see [Azure Peering Service overview](../peering-service/about.md)

## Peering Service partner requirements

To become a Peering Service partner, follow these technical requirements:

-	The Peer MUST provide its own Autonomous System Number (ASN), which MUST be public.
-	The Peer MUST have redundant Interconnect (PNI) at each interconnect location to ensure local redundancy.
-	The Peer MUST supply and advertise their own publicly routable IPv4 address space used by Peer's endpoints. 
-	The Peer MUST supply detail of what class of traffic and endpoints are housed in each advertised subnet.
-	The Peer MUST NOT terminate the peering on a device running a stateful firewall.
-	The Peer CANNOT have two local connections configured on the same router, as diversity is required.
-   The Peer CANNOT apply rate limiting to their connection.
-   The Peer CANNOT configure a local redundant connection as a backup connection. Backup connections must be in a different location than primary connections.
-	It's recommended to create Peering Service peerings in multiple locations so geo-redundancy can be achieved.
-   Primary, backup, and redundant sessions all must have the same bandwidth.
-	All infrastructure prefixes are registered in the Azure portal and advertised with community string 8075:8007.
-	Microsoft configures all the interconnect links as LAG (link bundles) by default, so, peer MUST support LACP (Link Aggregation Control Protocol) on the interconnect links.

If you follow all of the requirements listed and would like to become a Peering Service partner, an agreement must be signed. Contact peeringservice@microsoft.com to get started.

## Types of Peering Service connections

To become a Peering Service partner, you must request a direct peering interconnect with Microsoft. They come in three types depending on your use case.

- **AS8075** - A direct peering interconnect enabled for Peering Service made for Internet Service providers (ISPs)
- **AS8075 (with Voice)** - A direct peering interconnect enabled for Peering Service made for Internet Service providers (ISPs). This type is optimized for communications services (messaging, conferencing, etc.), and allows you to integrate your communications services infrastructure (SBC, SIP gateways, and other infrastructure device) with Azure Communication Services and Microsoft Teams.
- **AS8075 (with exchange route server)** - A direct peering interconnect enabled for Peering Service and made for Internet Exchange providers (IXPs) who require a route server.

### Monitoring platform

Service monitoring is offered to analyze user traffic and routing. Metrics are available in the Azure portal to track the performance and availability of your Peering Service connection. For more information, see [Peering Service monitoring platform](../peering-service/about.md#monitoring-platform)

In addition, Peering Service partners are able to see received routes reported in the Azure portal.

:::image type="content" source="./media/peering-service-partner-overview/peering-service-partner-latency-report.png" alt-text="Diagram showing monitoring platform for Peering Service.":::

## Next steps

- To establish a Direct interconnect for Peering Service, see [Internet peering for Peering Service walkthrough](walkthrough-peering-service-all.md).
- To establish a Direct interconnect for Peering Service Voice, see [Internet peering for Peering Service Voice walkthrough](walkthrough-communications-services-partner.md).
- To establish a Direct interconnect for Communications Exchange with Route Server, see [Internet peering for MAPS Exchange with Route Server walkthrough](walkthrough-exchange-route-server-partner.md).
