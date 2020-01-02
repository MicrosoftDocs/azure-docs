---

title: Microsoft Peering policy
description: Peering policy
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: conceptual
ms.date: 11/27/2019
ms.author: prmitiki

---

# Peering policy
Microsoft's general requirements from your network are explained in the sections below. These are applicable to both Direct Peering and Exchange Peering requests.

## Technical requirements:
* A fully redundant network with sufficient capacity to exchange traffic without congestion.
* Microsoft will overwrite received Multi-Exit Discriminators (MEDs) by default.
* Acceptance of MEDs will be evaluated on a case-by-case basis.
* A publicly routable ASN.
* At least one publicly routable /24.
* Neither party shall establish a static route, a route of last resort, or otherwise send traffic to the other party for a route not announced via BGP.
* Both IPv4 and IPv6 are supported (and expected).
* Unless specifically agreed upon beforehand, peers are expected to announce consistent routes in all locations where they peer with Microsoft.
* Both parties are expected to register their routes in a public Internet Routing Registry (IRR) database, for the purpose of filtering.
* Both parties shall make good faith efforts to keep this information up to date.
* MD5 is not required, nor recommended.
* In general, peering sessions with AS8075 will advertise all AS-MICROSOFT routes.
* AS8075 interconnects in Africa and Asia may be limited to routes relevant to the respective region.
* We suggest peers set a max-prefix of 1000 (IPv4) and 100 (IPv6) routes on peering sessions with Microsoft.
* Microsoft recommends that peers advertise all of their prefixes over all peering sessions, unless other route advertisement policies have been agreed upon. Where possible, Microsoft prefers to carry traffic on its network to interconnection points as close to users as possible.

## Operational requirements:
* A fully staffed 24x7 Network Operations Center (NOC), capable of assisting in the resolution of:
    * All technical and performance issues.
    * All security violations, denial of service attacks, or any other abuse originating within the peer or their customers.
* Peers are expected to have a complete and up-to-date profile on [PeeringDB](https://www.peeringdb.com) including a 24x7 NOC email role account and phone number. We use this information in our registration system to validate the peer's details such as NOC information, technical contact information, and their presence at the peering facilities etc.

## Physical connection requirements:
* Interconnection must be over single-mode fiber using the appropriate 10Gbps optics.
* Peers are expected to upgrade their ports when peak utilization exceeds 50%.
* The locations where you can connect with Microsoft for Direct Peering or Exchange Peering are listed in [Peeringdb](https://www.peeringdb.com/net/694)

## Traffic requirements:
We interconnect in as many diverse locations as possible. Traffic from your network to Microsoft must meet below minimum requirement.

| Geo             | Minimum traffic to Microsoft   |
| :-------------- |:-------------------------------|
| NA              | 2 Gbps                         |
| Europe          | 500 Mbps                       |
| Africa          | N/A                            |
| Middle East     | N/A                            |
| APAC            | 500 Mbps                       |
| LATAM           | N/A                            |


## Additional requirements for Direct Peering

### Physical connection requirements:
* Each Direct Peering consists of two connections to two Microsoft edge routers from the Peer's routers located in Peer's edge. Microsoft requires dual BGP sessions across these connections. The peer may choose not to deploy redundant devices at their end.

## Next steps

* To learn about steps to setup Direct Peering with Microsoft, follow [Direct Peering walkthrough](workflows-direct.md).
* To learn about steps to setup Exchange Peering with Microsoft, follow [Exchange Peering walkthrough](workflows-exchange.md).