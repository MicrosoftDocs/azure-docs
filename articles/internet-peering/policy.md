---

title: Microsoft peering policy
titleSuffix: Azure
description: Microsoft peering policy
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: conceptual
ms.date: 12/15/2020
ms.author: prmitiki

---

# Peering policy
Microsoft maintains a selective peering policy designed to ensure the best possible customer experience backed by industry standards and best practices, scaling for future demand and strategic placement of peering. As such, Microsoft reserves the right to make exceptions to the policy as deemed necessary. Microsoft's general requirements from your network are explained in the sections below. These are applicable to both Direct peering and Exchange peering requests. 

## Technical requirements

* A fully redundant network with sufficient capacity to exchange traffic without congestion.
* Peer will have a publicly routable Autonomous System Number (ASN).
* Both IPv4 and IPv6 are supported and Microsoft expects to establish sessions of both types in each peering location.
* MD5 is not supported.
* **ASN details:**

    * Microsoft manages AS8075 along with the following ASNs: AS8068, AS8069, AS12076. For a complete list of ASNs with AS8075 peering, reference AS-SET MICROSOFT.
    * All parties peering with Microsoft agree not to accept routes from AS12076 (Express Route) under any circumstances and should filter out AS12076 on all peers.

* **Routing policy:**
    * Peer will have at least one publicly routable /24.
    * Microsoft will overwrite received Multi-Exit Discriminators (MED).
    * Microsoft prefers to receive BGP community-tags from peers to indicate route origination.
    * We recommend peers set a max-prefix of 2000 (IPv4) and 500 (IPv6) routes on peering sessions with Microsoft.
    * Unless specifically agreed upon beforehand, peers are expected to announce consistent routes in all locations where they peer with Microsoft.
    * In general, peering sessions with AS8075 will advertise all AS-MICROSOFT routes. Microsoft may announce some regional specifics.
    * Neither party will establish a static route, a route of last resort, or otherwise send traffic to the other party for a route not announced via BGP.
    * Peer are required to register their routes in a public Internet Routing Registry (IRR) database, for the purpose of filtering, and will  keep this information up to date.      
    * Peers will adhere to MANRS industry standards for route security.  At its sole discretion, Microsoft may choose: 1.)  not to establish peering with companies that do not have routes signed and registered; 2.) to remove invalid RPKI routes; 3.) not to accept routes from established peers that are not registered and signed. 

## Operational requirements
* A fully staffed 24x7 Network Operations Center (NOC), capable of assisting in the resolution of all technical and performance issues, security violations, denial of service attacks, or any other abuse originating within the peer or their customers.
* Peers are expected to have a complete and up-to-date profile on [PeeringDB](https://www.peeringdb.com) including a 24x7 NOC email from corporate domain and phone number. We use this information to validate the peer's details such as NOC information, technical contact information, and their presence at the peering facilities etc. Personal Yahoo, Gmail, and hotmail accounts are not accepted.

## Physical connection requirements
* The locations where you can connect with Microsoft for Direct peering or Exchange peering are listed in [PeeringDB](https://www.peeringdb.com/net/694)

* **Exchange peering:**
    * Peers are expected to have at minimum a 10 Gb connection to the exchange.
    * Peers are expected to upgrade their ports when peak utilization exceeds 50%.
    * Microsoft encourages peers to maintain diverse connectivity to exchange to support failover scenarios.

* **Direct peering:**
    * Interconnection must be over single-mode fiber using 100 Gbps optics.
    * Microsoft will only establish Direct peering with ISP or Network Service providers.
    * Peers are expected to upgrade their ports when peak utilization exceeds 50% and maintain diverse capacity in each metro, either within a single location or across several locations in a metro.
    * Each Direct peering consists of two connections to two Microsoft edge routers from the Peer's routers located in Peer's edge. Microsoft requires dual BGP sessions across these connections. The peer may choose not to deploy redundant devices at their end.


## Traffic requirements

* Peers over Exchange peering must have at minimum 500 Mb of traffic and less than 2 Gb. For traffic exceeding 2 Gb Direct peering should be established.
* Microsoft requires at minimum 2 Gb for direct peering. Each mutually agreed to peering location must support failover that ensures peering remains localized during a failover scenario. 

## Next steps

* To learn about steps to set up Direct peering with Microsoft, follow [Direct peering walkthrough](walkthrough-direct-all.md).
* To learn about steps to set up Exchange peering with Microsoft, follow [Exchange peering walkthrough](walkthrough-exchange-all.md).
