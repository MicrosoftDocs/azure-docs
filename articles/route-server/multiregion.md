---
title: Multi-region networking with Azure Route Server
description: Learn how to design multi-region network architectures using Azure Route Server for high availability and disaster recovery scenarios.
services: route-server
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: concept-article
ms.date: 09/17/2025

#CustomerIntent: As an Azure administrator, I want to design multi-region network topologies with Azure Route Server to enable cross-region communication while maintaining centralized network appliance control and avoiding routing loops.
---

# Multi-region networking with Azure Route Server

Modern applications often require deployment across multiple Azure regions to meet high availability, disaster recovery, and performance requirements. Azure Route Server enables sophisticated multi-region network architectures that provide dynamic routing capabilities while maintaining centralized network control through network virtual appliances (NVAs).

This article explains how to design and implement multi-region topologies using Azure Route Server, including integration with ExpressRoute and considerations for avoiding routing loops.

## Key concepts

Multi-region networking with Azure Route Server involves several important concepts:

- **Dynamic route propagation**: Azure Route Server automatically exchanges routing information between regions through Border Gateway Protocol (BGP), eliminating the need for manual route table management as your network topology evolves.

- **Centralized network control**: Unlike direct virtual network peering between regions, Route Server enables traffic to flow through hub-based NVAs, maintaining security policies and network visibility across regions.

- **Automatic adaptation**: The architecture automatically adapts to topology changes, such as adding new spoke networks or modifying connectivity, without manual intervention.

## Architecture overview

The multi-region architecture uses a hub-and-spoke topology in each region, connected through global virtual network peering and coordinated by Azure Route Server instances:

:::image type="content" source="./media/multiregion/multiregion.png" alt-text="Diagram showing multi-region network architecture with Azure Route Server in each hub virtual network.":::

### Core components

The multi-region architecture consists of several key components that work together to provide dynamic routing capabilities. Each region contains a hub virtual network that hosts both Azure Route Server and network virtual appliances (NVAs) to manage routing decisions. Application workloads are deployed in spoke virtual networks within each region, maintaining separation between networking infrastructure and applications. Hub virtual networks are connected across regions using global virtual network peering to enable inter-region communication. Network appliances communicate between regions using secure tunnels to maintain routing information synchronization.

### Traffic flow

The traffic flow follows a structured pattern that ensures efficient routing across the multi-region topology. Route Server learns routes from both local spoke networks and NVAs within its region to build a comprehensive routing table. NVAs establish secure tunnels between regions to share routing information and enable cross-region connectivity. Each Route Server propagates the learned routes to local spoke networks, ensuring that workloads can reach destinations in remote regions. When topology changes occur, such as adding new spoke networks or modifying connectivity, the architecture automatically triggers route updates across all regions without requiring manual intervention.

## Configuration requirements

To implement this architecture successfully, configure the following components:

### Virtual network peering settings

Enable the **Use remote virtual network's gateway or Route Server** setting when peering spoke networks to hub networks. This configuration allows:

- Route Server to advertise spoke network prefixes to NVAs
- Learned routes to be injected into spoke network route tables
- Dynamic route propagation across the entire topology

### NVA tunnel configuration

Establish secure communication between NVAs using encapsulation technologies:

- **IPsec tunnels**: Provide encrypted communication between regional NVAs
- **VXLAN overlays**: Enable layer 2 extension across regions

### BGP AS path manipulation

Configure NVAs to modify BGP AS paths to prevent routing loops:

> [!IMPORTANT]
> NVAs must remove the autonomous system number (ASN) 65515 from the AS path when advertising routes learned from remote regions. This process, known as "AS override" or "AS-path rewrite," prevents BGP loop prevention mechanisms from blocking route learning. Without this configuration, Route Server doesn't learn routes that contain its own ASN (65515).

#### Common AS path techniques

**AS path prepending** - Makes paths appear longer to influence routing decisions:

```bash
# Example for Cisco NVA
route-map PREPEND-AS permit 10
 set as-path prepend 65001 65001
```

**AS path filtering** - Blocks routes with specific AS paths:

```bash
# Filter specific AS paths
ip as-path access-list 1 deny _65002_
route-map FILTER-AS permit 10
 match as-path 1
```

### High availability considerations

For resilient multi-region connectivity:
- **Multiple NVAs**: Deploy multiple NVAs in each region (Route Server supports up to eight BGP peers)
- **AS path prepending**: Use AS path prepending to establish active/standby NVA relationships
- **Redundant tunnels**: Configure multiple tunnel connections between regions for failover

## ExpressRoute integration

Multi-region Route Server architectures can integrate with ExpressRoute circuits to extend connectivity to on-premises networks:

:::image type="content" source="./media/multiregion/multiregion-with-expressroute.png" alt-text="Diagram showing multi-region architecture with Azure Route Server and ExpressRoute connectivity to on-premises networks.":::

### Benefits of ExpressRoute integration

- **Simplified routing**: On-premises prefixes appear in Azure only through NVA advertisements
- **Centralized control**: All traffic flows through hub NVAs for consistent policy enforcement
- **Overlay optimization**: ExpressRoute circuit supports overlay networks between NVAs

### Design considerations

- **Route advertisement**: Configure NVAs to advertise on-premises routes rather than relying solely on ExpressRoute gateway
- **Bandwidth planning**: Ensure ExpressRoute circuits can handle cross-region traffic loads
- **Redundancy**: Consider multiple ExpressRoute circuits for high availability

## Alternative design without overlay networks

While overlay tunnels are the recommended approach, you can implement multi-region connectivity without tunnels using user-defined routes (UDRs):

### Why tunnels are recommended

Overlay tunnels provide essential protection against routing loops in multi-region architectures. Without overlay tunnels, routing loops can occur when an NVA in Region 1 learns prefixes from Region 2 and advertises them to the local Route Server. The Route Server then programs these routes in all Region 1 subnets with the NVA as the next hop. When the NVA attempts to send traffic to Region 2, its own subnet routes point back to itself, creating a routing loop that prevents successful cross-region communication. Overlay tunnels solve this problem by creating a logical separation between the underlay network (used for tunnel establishment) and the overlay network (used for application traffic), ensuring that traffic can flow correctly between regions without creating loops.

### UDR-based alternative

If overlay tunnels aren't feasible in your environment, you can implement an alternative approach using user-defined routes (UDRs). This method requires disabling BGP route propagation in the NVA subnets to prevent automatic route learning that could cause conflicts. You must then configure static routes by creating UDRs that explicitly direct cross-region traffic through the appropriate network paths. While this approach can work, you should accept the operational overhead of manually maintaining these static routes as your network topology changes over time.

### Trade-offs

| Approach | Advantages | Disadvantages |
|----------|------------|---------------|
| **Overlay tunnels** | Dynamic routing, automatic adaptation, security | More configuration complexity |
| **UDR-based** | Simpler initial setup | Manual route management, limited scalability |

## Next steps

Explore these resources to implement and optimize your multi-region Route Server architecture:

- [Azure Route Server support for ExpressRoute and Azure VPN](expressroute-vpn-support.md)
- [Configure peering between Azure Route Server and network virtual appliance](tutorial-configure-route-server-with-quagga.md)
- [What is Azure Route Server?](overview.md)
- [Monitor Azure Route Server with Azure Monitor](monitor-route-server.md)
