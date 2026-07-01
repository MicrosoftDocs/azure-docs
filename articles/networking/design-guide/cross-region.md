---
title: "Cross-region and multicloud connectivity"
titleSuffix: Azure Virtual Network
description: Connect Azure resources across regions and to other clouds. Compare Global VNet Peering, Virtual WAN, ExpressRoute Global Reach, and cross-cloud VPN options.
author: duongau
ms.author: duau
ms.reviewer: mbender
ms.date: 06/17/2026
ms.topic: concept-article
ms.service: azure-virtual-network
zone_pivot_groups: networking-scenario
#customer intent: As a network architect, I want to understand cross-region and multicloud connectivity options so that I can design resilient, performant network topologies spanning multiple Azure regions or cloud providers.
---

# Cross-region and multicloud connectivity

This article helps you connect Azure workloads across multiple regions and extend connectivity to other cloud providers such as Amazon Web Services (AWS) and Google Cloud.

## What this article covers

This article covers the design decisions for connecting Azure virtual networks (VNets) across regions and establishing network paths to workloads running in other clouds. You learn when to use Global VNet Peering, Virtual WAN, ExpressRoute Global Reach, site-to-site VPN, and Azure Route Server for cross-region and multicloud scenarios.

## Who needs this article

Read this article if one or more of these conditions apply:

- Your architecture spans multiple Azure regions and needs private connectivity between them.
- You need to connect Azure workloads to AWS, Google Cloud, or another external network.
- You need to compare Global VNet Peering, Virtual WAN, ExpressRoute Global Reach, site-to-site VPN, or Azure Route Server.
- You need to design resilient connectivity for disaster recovery, global expansion, or multicloud operations.

> [!TIP]
> **Following a scenario path?** Select your scenario at the top of the page for tailored guidance. The core guidance that follows applies to all readers.

::: zone pivot="lift-shift"

**Lift-and-shift focus:** Include this article in your reading path only if your migration spans multiple Azure regions or connects to another cloud. Most lift-and-shift projects start with a single region and add cross-region connectivity later when disaster recovery or geographic expansion becomes a priority.

::: zone-end

::: zone pivot="modernize"

**Modernization focus:** Include this article if your modernization requires explicit cross-region private connectivity beyond what the [multi-region article](multi-region.md) covers. You need this guidance when spokes in different regions require direct communication paths or when your active-active deployment needs private peering between regional hubs.

::: zone-end

::: zone pivot="cross-cloud"

**Cross-cloud focus:** This article is your central design decision. Read it before choosing between hub-spoke and Virtual WAN for your cross-cloud transit architecture. You use this article to discover your existing multicloud topology, map services between AWS or Google Cloud and Azure, and define how Azure connects to workloads that remain in other clouds during migration.

::: zone-end

## Azure services and features

Azure provides several services for cross-region and multicloud connectivity. Each service addresses different scale, bandwidth, and management requirements.

| Service | What it provides | When to use it |
|---|---|---|
| **Global VNet Peering** | Low-latency private connectivity between VNets in different Azure regions. Traffic stays on the Microsoft backbone. Bandwidth is limited only by the virtual machine (VM) SKU, not by a gateway. | Direct communication between two VNets in different regions without a gateway appliance. |
| **Azure Virtual WAN (Standard tier)** | Microsoft-managed global transit hub that connects VNets, branches, and remote users across all regions. Provides transitive routing between all connected networks. | Organizations with many regions and branch offices that need any-to-any connectivity without managing individual peering connections. |
| **ExpressRoute via Cloud Exchange** | Dedicated cross-cloud connection through a third-party exchange provider (such as Equinix or Megaport). Provides private, high-bandwidth connectivity to AWS or Google Cloud. | Multicloud architectures with bandwidth SLA requirements where traffic must not traverse the public internet. |
| **Site-to-Site VPN to other clouds** | Encrypted IPsec tunnel between Azure VPN Gateway and another cloud provider's VPN gateway (AWS Virtual Private Gateway or Google Cloud VPN). | Multicloud connectivity for testing, development, or production scenarios where dedicated circuits aren't justified. |
| **Azure Route Server** | Enables dynamic BGP route exchange between your VNet and network virtual appliances (NVAs). Injects NVA-learned routes into the Azure SDN routing fabric. | Custom routing with third-party NVAs in a hub VNet, or complex multicloud routing that requires BGP propagation to Azure-connected networks. |

## How Global VNet Peering works

Global VNet Peering creates a direct link between two virtual networks in different Azure regions. The link runs entirely over the Microsoft backbone and never traverses the public internet. After you configure a peering relationship, resources in each VNet can communicate using private IP addresses as if they were in the same network.

Unlike gateway-based approaches, peering doesn't introduce a single choke point. Bandwidth between peered VNets scales with the VM SKU on each side. There's no dedicated gateway appliance limiting throughput. This design makes Global VNet Peering the lowest-latency option for cross-region communication between a small number of VNets.

However, peering is non-transitive by design. If VNet A peers with VNet B, and VNet B peers with VNet C, traffic from VNet A can't reach VNet C through VNet B. Each pair of VNets that needs direct communication requires its own peering link. In a hub-spoke model, this means you typically peer the regional hub VNets to each other and use user-defined routes (UDRs) or NVAs to forward spoke-to-spoke traffic across regions through the hubs.

## Virtual WAN global transit

Azure Virtual WAN (Standard tier) removes the need to manually configure peering between regional hubs. When you deploy Virtual WAN hubs in multiple regions, Microsoft automatically establishes hub-to-hub connections over the backbone. Routes learned in one hub propagate to all other hubs, creating an any-to-any transit fabric.

This automatic routing means that a spoke VNet connected to a hub in East US can reach a spoke VNet connected to a hub in West Europe without any additional peering or route table configuration. Virtual WAN also extends this transitivity to branch offices (connected through site-to-site VPN or ExpressRoute) and remote users (connected through point-to-site VPN). The result is a fully meshed global Microsoft-managed network.

For traffic inspection between regions, enable **Routing Intent** on secured virtual hubs. Routing Intent forces inter-hub traffic through Azure Firewall, giving you centralized visibility and policy enforcement across all regions without deploying and managing individual NVAs in each hub.

## How to choose

Use the following decision tables to select the right connectivity approach for your scenario.

### Cross-region connectivity options

<!-- Diagram: Cross-region connectivity patterns showing Global VNet Peering (direct), Virtual WAN hub-to-hub (transitive), and cross-cloud VPN paths between two Azure regions and a third-party cloud. -->

:::image type="content" source="media/cross-region-connectivity.png" alt-text="Diagram showing cross-region connectivity patterns, including Global VNet Peering, Virtual WAN hub-to-hub transit, and cross-cloud VPN paths." lightbox="media/cross-region-connectivity.png":::

| Your scenario | Recommended approach | Why |
|---|---|---|
| Two VNets in different regions need direct communication | **Global VNet Peering** | Lowest latency relative to internet paths, no gateway bottleneck, simple to configure. Bandwidth scales with VM SKU. |
| Many regions, many branches, managed transit needed | **Azure Virtual WAN (Standard tier)** | Provides transitive any-to-any routing across all connected hubs. Microsoft manages the routing infrastructure. |
| Connect on-premises sites to each other through Azure | **ExpressRoute Global Reach** | Links two ExpressRoute circuits so on-premises traffic traverses the Microsoft backbone. No need to hairpin through Azure VNets. |
| Custom routing or third-party NVAs in a regional hub | **Azure Route Server** | Enables dynamic BGP peering between NVAs and Azure. Routes learned by the NVA are automatically injected into spoke VNets. |

### Multicloud connectivity options

| Your scenario | Recommended approach | Why |
|---|---|---|
| High bandwidth and SLA required for cross-cloud traffic | **ExpressRoute via Cloud Exchange provider** | Provides dedicated capacity with predictable latency. The exchange provider connects your ExpressRoute circuit to the other cloud's direct connect service. |
| Budget-constrained, testing, or low-throughput workloads | **Site-to-Site VPN** | Uses existing internet connectivity with no circuit costs. Suitable when bandwidth requirements are modest. |
| Hybrid plus multicloud (on-premises, Azure, and another cloud) | **ExpressRoute Global Reach + Cloud Exchange** | Combines Global Reach for on-premises-to-Azure transit with a cloud exchange for Azure-to-other-cloud connectivity, creating a unified private backbone. |

## Design considerations

::: zone pivot="lift-shift"

For most lift-and-shift migrations, cross-region connectivity is a future expansion consideration instead of a day-one requirement. Your initial deployment likely targets a single Azure region.

When you plan for future expansion:

- **Global VNet Peering:** Use Global VNet Peering between regional hub VNets when you add a second Azure region. This approach gives you low-latency private connectivity without deploying a gateway appliance. Traffic stays on the Microsoft backbone and scales with your VM SKU.
- **Deferred complexity:** Avoid deploying Virtual WAN or ExpressRoute Global Reach until your estate grows beyond two regions or you add branch connectivity requirements.
- **DR preparation:** Even if cross-region connectivity isn't needed today, document which workloads require disaster recovery and pre-plan the peering topology so you can deploy it quickly when needed.

::: zone-end

::: zone pivot="modernize"

Your modernized architecture uses active-active deployments across regions. Cross-region peering enables direct spoke-to-spoke communication when your application tiers span regional boundaries.

Key design decisions for modernization:

- **Cross-region peering for active-active:** Peer your primary and backup region hub VNets to enable bidirectional traffic flow. Application teams in ContosoBiz and ContosoCare spokes can reach resources in either region through the hub peering path.
- **Routing through hubs:** Since Global VNet Peering is non-transitive, route cross-region spoke traffic through the regional hub NVA or Azure Firewall. Use user-defined routes (UDRs) to direct spoke-to-spoke cross-region traffic through the hub firewall for inspection.
- **Selective peering:** Not all spokes need cross-region connectivity. Peer only the hub VNets and use route propagation to reach specific spoke VNets that participate in active-active workloads.

::: zone-end

::: zone pivot="cross-cloud"

This article is where you design your multicloud connectivity architecture. Before planning Azure infrastructure, you must discover your existing cloud topology and map services between providers.

### Cross-cloud discovery workflow

1. **Discover your existing topology:** Use Workload Discovery on AWS and Google Cloud Network Intelligence Center to map your current Virtual Private Cloud (VPC) topology, peering relationships, and traffic flow patterns.
1. **Identify traffic flows:** Document VPC-to-VPC communication, internet inbound and outbound paths, and branch-to-cloud connections in your AWS or Google Cloud environment.
1. **Map services to Azure equivalents:** The key mappings for connectivity design are:

| AWS / Google Cloud service | Azure equivalent |
|---|---|
| Transit Gateway | Azure Virtual WAN |
| VPC / VPC Network | Azure Virtual Network |
| Security Groups / Firewall Rules | Network Security Groups (NSGs) |

For complete AWS-to-Azure and Google Cloud-to-Azure service mappings, see [Cross-cloud discovery checklist](cross-cloud.md#cross-cloud-discovery-checklist).

### Connectivity architecture decisions

After you complete the discovery and service mapping, decide:

- **Transit model:** Choose Virtual WAN if you have multiple VPCs, branches, regions, or cloud edges. Virtual WAN provides the Azure equivalent of AWS Transit Gateway with managed any-to-any routing.
- **Cross-cloud VPN:** Deploy VPN Gateway connections from your Virtual WAN hub (or hub VNet) to AWS Virtual Private Gateway and Google Cloud VPN. Use IPsec tunnels for encrypted cross-cloud communication.
- **Applications that stay:** Identify workloads that remain in AWS or Google Cloud during migration. These workloads need persistent connectivity through the cross-cloud VPN tunnels until migration completes.

::: zone-end

## Prerequisites

Before you implement cross-region or multicloud connectivity, confirm the following requirements:

- **Two or more Azure regions with deployed VNets:** Your workloads must already exist (or be planned) in multiple regions. See the [VNets and subnets article](vnets-subnets.md) for VNet planning guidance.
- **Hub-spoke or Virtual WAN topology:** Cross-region designs build on an established topology in each region. See the [hub-spoke article](hub-spoke.md) or [Virtual WAN article](virtual-wan.md).
- **ExpressRoute circuits (for Global Reach):** If you plan to connect on-premises sites, you need existing ExpressRoute circuits in each location. See the [hybrid connectivity article](hybrid-connectivity.md).
- **Cross-cloud account access:** For multicloud VPN or exchange connectivity, you need administrative access to the other cloud provider's networking console to configure the remote side of the connection.

## Security considerations

Cross-region and multicloud connectivity introduces specific security concerns that don't exist in single-region deployments.

### Cross-region traffic inspection

Global VNet Peering is non-transitive. Traffic between peered VNets flows directly without passing through a firewall or inspection point. If you need to inspect cross-region traffic, route it through a network virtual appliance (NVA) or Azure Firewall in each regional hub.

For Virtual WAN, enable **Routing Intent** with private traffic policies on secured virtual hubs. Routing Intent forces inter-hub traffic through Azure Firewall Manager-managed firewalls, which provides centralized cross-region traffic inspection. This configuration requires the Standard Virtual WAN tier.

### Encrypt cross-cloud connections

Site-to-site VPN tunnels to other clouds are encrypted by default (IPsec/IKE). However, ExpressRoute connections through a cloud exchange are private but not encrypted at the network layer. If you require encryption over ExpressRoute, deploy MACsec on ExpressRoute Direct circuits or use application-layer TLS encryption.

For cross-cloud traffic that traverses a cloud exchange without VPN overlay, consider deploying an NVA-based IPsec tunnel inside the ExpressRoute path. This approach adds encryption without giving up the bandwidth and latency benefits of a dedicated circuit. Alternatively, use mutual TLS (mTLS) at the application layer so that each service endpoint validates identity and encrypts data regardless of the underlying transport. The choice depends on whether you need network-layer (all-traffic) encryption or can enforce encryption at the application layer.

## Cost considerations

All cross-region connectivity incurs data transfer charges. Global VNet Peering, Virtual WAN inter-hub traffic, and VPN Gateway cross-region tunnels all use egress-based pricing. Rates vary by zone pair:

- **Intra-continental** (for example, East US to West US): Lower per-GB rate, typically in the range of standard egress pricing for the region.
- **Inter-continental** (for example, East US to West Europe): Higher per-GB rate due to longer backbone distances and cross-continental capacity.

Virtual WAN adds a connection unit charge for each spoke VNet or branch attached to a hub, plus a data-processing charge for traffic that transits through a secured hub running Azure Firewall. This layered pricing means Virtual WAN can cost more than simple Global VNet Peering for architectures with only a few regions and few spokes, but it offers better unit economics at scale when dozens of branches and regions connect.

For multicloud connectivity, ExpressRoute through a cloud exchange incurs port charges and cross-connect fees from the exchange provider, plus Azure ExpressRoute circuit charges and the other cloud's direct-connect charges. Site-to-site VPN avoids circuit costs but still incurs standard egress charges for data leaving Azure.

**Guidance:** Colocate high-traffic workloads in the same region when possible. Reserve cross-region paths for control-plane synchronization, asynchronous replication, and disaster recovery failover, which are typically lower-volume flows.

## Disaster recovery patterns

Cross-region connectivity is foundational to disaster recovery (DR). The pattern you choose determines your recovery time objective (RTO) and recovery point objective (RPO).

### Active-active

Both regions serve production traffic simultaneously. A global load balancer (such as Azure Front Door or Azure Traffic Manager) distributes requests across regions. If one region fails, traffic shifts to the surviving region with minimal interruption. This pattern delivers the lowest RTO (seconds to minutes) but requires full infrastructure in both regions and bidirectional data synchronization, which increases cost and complexity.

### Active-passive

One region serves production traffic while the second region remains on standby with predeployed (but potentially scaled-down) infrastructure. Replication keeps the passive region's data current. On failure, you promote the passive region and redirect traffic. RTO depends on how quickly you scale up passive resources and complete DNS or load-balancer failover, typically minutes to tens of minutes.

### Pilot light

A minimal footprint in the secondary region (databases replicating, core networking deployed) with no active compute. On failover, you deploy or scale application compute and switch traffic. This pattern minimizes steady-state cost but increases RTO because compute resources must start before the region can serve traffic.

In all patterns, cross-region connectivity (Global VNet Peering or Virtual WAN inter-hub) provides the private data path for replication traffic. Make sure your DR runbooks account for any route propagation delays and validate that Network Security Group (NSG) rules in the secondary region permit failover traffic.

### Key constraints

| Constraint | Impact |
|---|---|
| Global VNet Peering is non-transitive | VNet A peered to VNet B, and VNet B peered to VNet C, doesn't mean A can reach C. You must peer A to C directly or use a transit solution like Virtual WAN. |
| Virtual WAN Basic tier lacks transitivity | Basic Virtual WAN doesn't support VNet-to-VNet transitive connectivity. Use Standard tier for cross-region transit. |
| ExpressRoute Global Reach requires Premium SKU for cross-geopolitical connections | Circuits in different geopolitical regions (for example, US and Europe) require the Premium add-on. Standard SKU circuits only connect within the same geopolitical boundary. |
| Active-active VPN Gateway recommended for AWS | AWS Virtual Private Gateway creates two tunnels per VPN connection. Configure Azure VPN Gateway in active-active mode to use all available tunnels and avoid asymmetric routing. |

## Related articles

- [VNets and subnets](vnets-subnets.md): VNet planning fundamentals referenced by this article.
- [Hybrid connectivity](hybrid-connectivity.md): ExpressRoute and VPN Gateway foundations that cross-region connectivity builds on.
- [Hub-spoke topology](hub-spoke.md): Regional hub-spoke design patterns that extend to multiregion architectures.
- [Virtual WAN topology](virtual-wan.md): Managed global transit with Virtual WAN hubs.
- [Centralized network management](azure-virtual-network-manager.md): Azure Virtual Network Manager for managing peering at scale across regions.

## Learn more

- [Virtual network peering overview](../../virtual-network/virtual-network-peering-overview.md): Includes Global VNet Peering capabilities, bandwidth behavior, and configuration.
- [Virtual WAN global transit architecture](../../virtual-wan/virtual-wan-global-transit-network-architecture.md): How Virtual WAN enables any-to-any transit across regions.
- [ExpressRoute Global Reach](../../expressroute/expressroute-global-reach.md): Connect on-premises networks through ExpressRoute circuits.
- [Connect Azure to AWS using BGP VPN](../../vpn-gateway/vpn-gateway-howto-aws-bgp.md): Step-by-step tutorial for multicloud VPN to AWS.
- [Azure Route Server overview](../../route-server/overview.md): Dynamic BGP routing with NVAs in Azure.
- [Virtual WAN pricing concepts](../../virtual-wan/pricing-concepts.md): Understand inter-hub and cross-region data transfer charges.

## Next steps

> [!TIP]
> **Exploring on your own?** Return to the [overview navigator](overview.md#business-need-navigator) to find your next article by capability.

::: zone pivot="lift-shift"

**Next in your lift-and-shift journey:**

> [Multi-region networking](multi-region.md): Plan multiregion connectivity and failover if your migration expands beyond one region.

::: zone-end

::: zone pivot="modernize"

**Next in your modernization journey:**

> [Network monitoring and observability](monitor.md): Enable observability across regions for production readiness.

::: zone-end

::: zone pivot="cross-cloud"

**Next in your cross-cloud journey:**

> [Virtual WAN topology](virtual-wan.md): Use Virtual WAN as the transit hub for your multicloud and multibranch connectivity.

::: zone-end
