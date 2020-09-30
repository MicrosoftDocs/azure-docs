---

title: Microsoft peering policy
titleSuffix: Azure
description: Microsoft peering policy
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: conceptual
ms.date: 11/27/2019
ms.author: prmitiki

---

# Peering policy
Microsoft's general requirements from your network are explained in the sections below. These are applicable to both Direct peering and Exchange peering requests.

## Technical requirements

* A fully redundant network with sufficient capacity to exchange traffic without congestion.
* Peer will have a publicly routable Autonomous System Number (ASN).
* Both IPv4 and IPv6 are supported and Microsoft expects to establish sessions of both types in each peering location.
* MD5 is not supported.
* **ASN details:**
    * Microsoft manages AS8075 along with the following ASNs: AS8068, AS8069, AS12076. For a complete list of ASNs with AS8075 peering, reference AS-SET MICROSOFT.
    * All parties peering with Microsoft agree not to accept routes from AS12076 (Express Route) under any circumstances, and should filter out AS12076 on all peers.
* **Routing policy:**
    * Peer will have at least one publicly routable /24.
    * Microsoft will overwrite received Multi-Exit Discriminators (MED).
    * Microsoft prefers to receive BGP community-tags from peers to indicate route origination.
    * Peer are expected to register their routes in a public Internet Routing Registry (IRR) database, for the purpose of filtering, and will make good faith efforts to keep this information up to date.
    * We suggest peers set a max-prefix of 1000 (IPv4) and 100 (IPv6) routes on peering sessions with Microsoft.
    * Unless specifically agreed upon beforehand, peers are expected to announce consistent routes in all locations where they peer with Microsoft.
    * In general, peering sessions with AS8075 will advertise all AS-MICROSOFT routes. AS8075 interconnects in Africa and Asia may be limited to routes relevant to the respective region.
    * Neither party will establish a static route, a route of last resort, or otherwise send traffic to the other party for a route not announced via BGP.
    * Peers are expected to adhere to [MANRS](https://www.manrs.org/) industry standards for route security.

## Operational requirements
* A fully staffed 24x7 Network Operations Center (NOC), capable of assisting in the resolution of all technical and performance issues, security violations, denial of service attacks, or any other abuse originating within the peer or their customers.
* Peers are expected to have a complete and up-to-date profile on [PeeringDB](https://www.peeringdb.com) including a 24x7 NOC email from corporate domain and phone number. We use this information to validate the peer's details such as NOC information, technical contact information, and their presence at the peering facilities etc. Personal Yahoo, Gmail and hotmail accounts are not accepted.

## Physical connection requirements
* The locations where you can connect with Microsoft for Direct peering or Exchange peering are listed in [PeeringDB](https://www.peeringdb.com/net/694)
* **Exchange peering:**
    * Interconnection must be over single-mode fiber using the appropriate 10Gbps optics.
    * Peers are expected to upgrade their ports when peak utilization exceeds 50%.
* **Direct peering:**
    * Interconnection must be over single-mode fiber using the appropriate 10Gbps or 100Gbps optics.
    * Microsoft will only establish Direct peering with ISP or Network Service providers.
    * Peers are expected to upgrade their ports when peak utilization exceeds 50% and maintain diverse capacity in each metro, either within a single location or across several locations in a metro.
    * Each Direct peering consists of two connections to two Microsoft edge routers from the Peer's routers located in Peer's edge. Microsoft requires dual BGP sessions across these connections. The peer may choose not to deploy redundant devices at their end.

## Traffic requirements
* Peers over Exchange peering must have at minimum 200Mb of traffic and less than 2Gb.  For traffic exceeding 2Gb Direct peering should be reviewed.
* For Direct peering, traffic from your network to Microsoft must meet below minimum requirement.

    | Geo                      | Minimum traffic to Microsoft   |
    | :----------------------- |:-------------------------------|
    | Africa                   | 500 Mbps                       |
    | APAC (except India)      |   2 Gbps                       |
    | APAC (India only)        | 500 Mbps                       |
    | Europe                   |   2 Gbps                       |
    | LATAM                    |   2 Gbps                       |
    | Middle East              | 500 Mbps                       |
    | NA                       |   2 Gbps                       |

* **Diversity:**
    * In NA, Europe, APAC and LATAM, interconnect in at least three geographically diverse locations if feasible and maintain diverse capacity to allow traffic to failover within each metro.
    * In Africa, Middle East and India, interconnect in as many diverse locations as possible. Must maintain sufficient diverse capacity to ensure traffic remains in region.

## Next steps

* To learn about steps to set up Direct peering with Microsoft, follow [Direct peering walkthrough](walkthrough-direct-all.md).
* To learn about steps to set up Exchange peering with Microsoft, follow [Exchange peering walkthrough](walkthrough-exchange-all.md).