---
title: 'About Azure ExpressRoute Direct link groups in Preview'
description: Learn how Azure ExpressRoute Direct link groups in preview aggregate physical links into a single logical resource for scalable and resilient private connectivity.
services: expressroute
author: rmareddy
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 11/24/2026
ms.author: rmareddy
---

# About Azure ExpressRoute Direct link groups (preview)

Azure ExpressRoute Direct link groups let you aggregate multiple physical ExpressRoute Direct links and manage them as a single logical resource.

Link groups provide higher aggregate bandwidth while retaining the existing ExpressRoute circuit and connectivity model. They're designed for high-throughput workloads such as AI, large-scale data movement, and high-performance computing.

> [!IMPORTANT]
> ExpressRoute Direct link groups are currently in **preview**. Link groups are supported for new deployments at locations where ExpressRoute Direct is available.

## Key benefits

ExpressRoute Direct link groups provide the following benefits:

- **Higher aggregate bandwidth:** Combine multiple ExpressRoute Direct physical links into a single logical resource.
- **Simplified operations:** Manage aggregated physical connectivity through one link group instead of managing each physical connection independently.
- **Built-in resiliency:** Use Link Aggregation Control Protocol (LACP) for dynamic link aggregation and failure detection.
- **Configurable failure detection:** Choose fast or slow LACP timers based on your network requirements.
- **Flexible availability:** Use minimum link members to specify the minimum number of active members required for the link group to remain operational.
- **ExpressRoute compatibility:** Continue to use supported ExpressRoute circuits, peerings, gateways, FastPath, and other ExpressRoute capabilities with the link group.

## Supported configurations

The following configurations are supported during public preview:

| ExpressRoute Direct port speed | Maximum port pairs | Maximum aggregate capacity |
| --- | ---: | ---: |
| 10 Gbps | 4 | 40 Gbps |
| 100 Gbps | 2 | 200 Gbps |
| 400 Gbps | 2 | 800 Gbps |

The available configuration depends on physical capacity at the selected ExpressRoute Direct peering location.

All physical members of a link group must:

- Use the same port speed.
- Be provisioned at the same ExpressRoute Direct peering location.
- Terminate on the same router pair.

You can't aggregate physical links that terminate on different router pairs into the same link group.

## Link aggregation and resiliency

ExpressRoute Direct link groups use **Link Aggregation Control Protocol (LACP)** to aggregate physical members into a logical connection and detect member failures.

Apply LACP configuration between the link group and your network devices. Configure compatible LACP settings on your network devices for the physical members that participate in the link group.

### LACP timers

Link groups support configurable LACP timers:

- **Fast:** Provides faster link-failure detection.
- **Slow:** Uses a longer failure-detection interval.

Use matching LACP timer settings between your network equipment and the link group.

### Minimum link members

**Minimum link members** specifies the minimum number of active physical members required for a link group to remain operational.

For example, consider a link group that contains two physical members and has Minimum link members set to `1`.

If one member becomes unavailable, the link group can remain operational with reduced aggregate bandwidth because one active member still satisfies the configured minimum.

If the number of active members falls below the configured Minimum link members value, the link group is taken down. This behavior can allow traffic to transition to the redundant ExpressRoute path.

Configure Minimum link members based on the minimum physical capacity your workload requires to remain operational.

## Compatibility with ExpressRoute

Link groups change how the underlying ExpressRoute Direct physical connectivity is aggregated. They don't change the existing ExpressRoute circuit and virtual network connectivity model.

Supported ExpressRoute capabilities and workflows continue to apply, including:

- ExpressRoute circuit creation
- Azure private peering
- Microsoft peering
- BGP peering
- ExpressRoute virtual network gateway connections
- ExpressRoute FastPath, where supported
- Circuit authorizations
- Cross-subscription connectivity
- MACsec, where supported
- Dot1Q and QinQ encapsulation

Using a Link Group increases available physical connectivity bandwidth. It doesn't increase existing ExpressRoute service limits or quotas.

Existing limits for circuits, routes, virtual network gateways, FastPath, and other ExpressRoute capabilities continue to apply.

## Availability

ExpressRoute Direct link groups are available in **preview for new deployments at locations where ExpressRoute Direct is supported**.

Availability is subject to sufficient capacity at the selected peering location.

## Limitations

The following limitations apply during preview:

- Only new deployments are supported.
- You can't convert existing ExpressRoute Direct ports to a link group.
- You can't add existing ExpressRoute Direct ports to a new link group.
- All members of a Link Group must use the same port speed.
- You can't aggregate physical links across different Microsoft router pairs into the same link group.
- You can't change the physical port speed of an existing link group.
- You can't change the peering location of an existing link group.


## Next steps

- [About ExpressRoute Direct](expressroute-erdirect-about.md)
- [Configure ExpressRoute Direct](how-to-expressroute-direct-portal.md)
- [ExpressRoute frequently asked questions](expressroute-faqs.md)
- [ExpressRoute locations and connectivity providers](expressroute-locations-providers.md)
- [Configure MACsec for ExpressRoute Direct](expressroute-howto-macsec.md)
