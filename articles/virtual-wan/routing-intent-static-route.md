---
title: 'Use routing intent with static routes in Azure Virtual WAN'
titleSuffix: Azure Virtual WAN
description: Learn how to combine Azure Virtual WAN routing intent and routing policies with static routes on virtual network connections.
author: wtnlee
ms.service: azure-virtual-wan
ms.topic: concept-article
ms.date: 04/30/2026
ms.author: wellee
ms.custom:
---

# Basic: Use routing intent with static routes

> [!NOTE]
> This design pattern is compatible with any supported next hop security solution deployed in the Virtual WAN hub, including **Azure Firewall**, an **integrated NVA**, or a **Software as a Service (SaaS) solution**. Additionally, use [static route configuration option 1](static-routes.md#configuration-options) when configuring static routes on the virtual network connection to ensure proper propagation of the static routes to the hub and other connected spokes. Configuration option 2 is **not supported** when using routing intent.

## Scenario overview

This design pattern explains how to combine **routing intent and routing policies** with **static routes on a virtual network connection** in Azure Virtual WAN. This pattern is useful when you want a security solution deployed in the virtual hub to inspect traffic first, while still allowing selected destinations to be reached through a network virtual appliance (NVA) deployed in a spoke virtual network.

Typical examples include sending traffic to:

* Indirect spokes that are peered to the NVA virtual network, but not directly connected to the Virtual WAN hub.
* VPN or SDWAN tunnels terminating on the NVA in the spoke virtual network.
* Internet-bound traffic ([forced tunnel](about-internet-routing.md#forced-tunnel-1))


## Traffic patterns

The following connectivity matrix summarizes the common traffic patterns in this design.

| Source/Destination | Direct Spoke | On-premises | Indirect spoke and NVA connected sites  | Internet |
|--|--|--|--|--|
| Direct Spoke | Via routing intent next hop in the hub | Via routing intent next hop in the hub | Via routing intent next hop in the hub, then via the spoke NVA | Via routing intent next hop in the hub, then via the spoke NVA when the hub is configured in [forced tunnel mode](about-internet-routing.md#forced-tunnel-1) |
| On-premises | Via routing intent next hop in the hub | Via routing intent next hop in the hub | Via routing intent next hop in the hub, then via the spoke NVA | Via routing intent next hop in the hub, then via the spoke NVA when the hub is configured in [forced tunnel mode](about-internet-routing.md#forced-tunnel-1) |
| Indirect spoke and NVA connected sites | Via the spoke NVA, then via routing intent next hop in the hub | Via the spoke NVA, then via routing intent next hop in the hub | Via the spoke NVA | Via the spoke NVA |


## Network Diagram

:::image type="content" source="./media/route-scenarios/routing-intent-static-route.png" alt-text="Diagram that shows routing intent in the virtual hub combined with static routes on a spoke virtual network connection to reach indirect spokes, NVA-connected sites, and the internet." lightbox="./media/route-scenarios/routing-intent-static-route.png":::

In the diagram above, there are three types of spokes:

* Directly connected spokes: connected directly to the Virtual WAN hub.
* NVA spoke: connected directly to the Virtual WAN hub and deployed with an NVA.
* Indirect spoke: not connected directly to the Virtual WAN hub. The indirect spoke is peered to the NVA spoke. Traffic to and from these spokes must traverse the NVA before reaching any other connection to the Virtual WAN hub.

## Configuration

### Routing intent and routing policies

The virtual hub must use routing intent. Use a **Private Traffic** routing policy with next hop set to the security solution deployed in the virtual hub, such as Azure Firewall, a supported integrated NVA, or a software-as-a-service (SaaS) security solution.


### Static routes on the NVA virtual network connection

> [!NOTE]
> For routing intent hubs, the only supported static route integration pattern is [static route configuration option 1](static-routes.md#configuration-options). Configure static routes on the **virtual network connection** with **Propagate static route** set to **true**.


| Prefix type | Example prefixes | Reasoning |
|--|--|--|
| Indirect spoke prefixes | 10.20.0.0/16 | Allows traffic inspected in the hub to be forwarded to prefixes that are reachable behind the NVA deployed in the spoke. |
| SDWAN prefixes | 192.168.0.0/24 | Allows traffic inspected in the hub to be forwarded to SDWAN-connected sites or prefixes that are reachable through tunnels terminated on the NVA deployed in the spoke. |


## Additional considerations

* For deployments where static routes are specified on a virtual network connection with **Propagate static route** enabled, the **bypass next hop IP** behavior is ignored when routing intent is applied. For more information, see [Bypass next hop IP for workloads within this VNet](howto-connect-vnet-hub.md#bypassexplained).
* If there are multiple static routes configured where the destination CIDRs are **not** in IANA RFC1918, all static routes with non-RFC1918 destinations must use the **same next hop IP address**.
* Routing intent is the only supported mechanism in Virtual WAN to inspect **inter-hub** traffic through security solutions deployed in the virtual hub.
* If you need a design where an NVA deployed in a spoke is used only for Internet breakout, while the virtual hub security solution inspects private traffic, see [Combining Azure Firewall and NVAs deployed in spokes](hybrid-firewall-spoke-static.md). In this scenario, Internet traffic is only inspected by the NVA deployed in the spoke.
* If you need a design where an NVA deployed in a spoke is used to route traffic to indirect spokes or the Internet without routing intent, see [Route traffic to indirect spokes](indirect-spoke-architecture.md).
