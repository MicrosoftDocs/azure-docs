---
title: Peering policy
titleSuffix: Internet Peering
description: Learn about Microsoft's peering policy.
services: internet-peering
author: halkazwini
ms.service: internet-peering
ms.topic: conceptual
ms.date: 03/08/2023
ms.author: halkazwini
ms.custom: template-concept, engagement-fy23
---

# Peering policy
Microsoft maintains a selective peering policy designed to ensure the best possible customer experience backed by industry standards and best practices, scaling for future demand and strategic placement of peering. As such, Microsoft reserves the right to make exceptions to the policy as deemed necessary. Microsoft's general requirements from your network are explained in the following sections. These requirements are applicable to both Direct peering and Exchange peering requests. 

## Technical requirements

* A fully redundant network with sufficient capacity to exchange traffic without congestion.
* Peer has a publicly routable Autonomous System Number (ASN).
* Both IPv4 and IPv6 are supported and Microsoft expects to establish sessions of both types in each peering location.
* MD5 isn't supported.
* **ASN details:**

    * Microsoft manages AS8075 and other ASNs as described in AS-SET RADb:AS-MICROSOFT.
    * All parties peering with Microsoft agree not to accept routes from AS12076 (ExpressRoute) under any circumstances and should filter out AS12076 on all peers.

* **Routing policy:**
    * Peer has at least one publicly routable /24 prefix.
    * Microsoft overwrites received Multi Exit Discriminators (MED).
    * Microsoft prefers to receive BGP community tags from peers to indicate route origination.
    * We recommend peers set a max-prefix of 2000 (IPv4) and 500 (IPv6) routes on peering sessions with Microsoft.
    * Unless specifically agreed upon beforehand, peers are expected to announce consistent routes in all locations where they peer with Microsoft.
    * In general, Microsoft advertises all Microsoft routes, with some regional specifics as appropriate.  All prefixes are properly registered within the RADb.
    * Microsoft also announces 3rd party address space under “Bring Your Own IP” and “Bring Your Own ASN” products. BYOIP prefixes are all properly registered as AS8075, and BYOASN ASNs will be included in AS-SET AS-MICROSOFT.
    * Neither party will establish a static route, a route of last resort, or otherwise send traffic to the other party for a route not announced via BGP.
    * Peers are required to register their routes in a public Internet Routing Registry (IRR) database, for the purposes of filtering, and keep this information up to date.      
    * Peers adhere to MANRS industry standards for route security.  At its sole discretion, Microsoft may choose:
        1. not to establish peering with companies that don't have routes signed and registered
        1. to remove invalid RPKI routes
        1. not to accept routes from established peers that aren't registered and signed

## Operational requirements
* A fully staffed 24x7 Network Operations Center (NOC) that's capable of assisting in the resolution of all technical and performance issues, security violations, denial of service attacks, or any other abuse originating within the peer or their customers.
* Peers are expected to have a complete and up-to-date profile on [PeeringDB](https://www.peeringdb.com) including a 24x7 NOC email from corporate domain and phone number. We use this information to validate the peer's details such as NOC information, technical contact information, and their presence at the peering facilities etc. Personal Yahoo, Gmail, and Hotmail accounts aren't accepted.

## Physical connection requirements
* The locations where you can connect with Microsoft for Direct peering or Exchange peering are listed in [PeeringDB](https://www.peeringdb.com/net/694)

* **Exchange peering:**
    * Peers are expected to have at minimum a 10 Gbps connection to the exchange.
    * Peers are expected to upgrade their ports when peak utilization exceeds 50%.
    * Microsoft encourages peers to maintain diverse connectivity to exchange to support failover scenarios.

* **Direct peering:**
    * Interconnection must be over 100 Gbps single-mode fiber.
    * Microsoft only establishes Direct peering with internet service providers (ISPs) or network service providers (NSPs).
    * Peers are expected to upgrade their ports when peak utilization exceeds 50% and maintain diverse capacity in each metro, either within a single location or across several locations in a metro.
    * Each Direct peering consists of two connections to two Microsoft edge routers from the peer edge routers. Microsoft requires dual BGP sessions across these connections. The peer may choose not to deploy redundant devices at their end.


## Traffic requirements

* Peers over Exchange peering must have at minimum 500 MB of traffic and less than 2 GB. For traffic exceeding 2 GB, Direct peering should be established.
* Microsoft requires at minimum 2 GB for direct peering. Each mutually agreed to peering location must support failover that ensures peering remains localized during a failover scenario. 

## Next steps

* To learn how to set up Direct peering with Microsoft, see [Direct peering walkthrough](walkthrough-direct-all.md).
* To learn how to set up Exchange peering with Microsoft, see [Exchange peering walkthrough](walkthrough-exchange-all.md).
