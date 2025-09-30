---
title: Anycast routing with Azure Route Server
titleSuffix: Azure Route Server
description: Learn how to implement anycast routing to advertise the same route from different regions using Azure Route Server for improved application availability and performance.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: concept-article
ms.date: 09/17/2025
---

# Anycast routing with Azure Route Server

Anycast routing enables you to advertise the same IP address from multiple Azure regions, providing improved application availability, performance, and resilience. With Azure Route Server, you can implement anycast routing to automatically direct traffic to the closest or most optimal application instance based on routing metrics.

This article explains how to implement anycast routing with Azure Route Server for multi-region application deployments over private networks.

## What is anycast routing?

Anycast routing is a network addressing and routing methodology where the same IP address is assigned to multiple servers or application instances in different locations. When a client sends a request to an anycast IP address, the network infrastructure automatically routes the traffic to the nearest or most optimal server based on routing protocols and metrics.

### Benefits of anycast routing

Anycast routing provides several advantages for multi-region deployments:

- **Improved performance**: Traffic is automatically routed to the closest application instance, reducing latency
- **Enhanced availability**: If one region becomes unavailable, traffic automatically fails over to other regions
- **Load distribution**: Traffic can be distributed across multiple regions based on routing metrics
- **Simplified client configuration**: Clients connect to a single IP address regardless of the actual server location
- **Private network support**: Unlike DNS-based solutions, anycast works with private IP addresses and networks

### Anycast vs. other multi-region approaches

While Azure offers several services for multi-region deployments like [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md?toc=/azure/route-server/toc.json), [Azure Front Door](../frontdoor/front-door-overview.md?toc=/azure/route-server/toc.json), and [Azure Cross-Region Load Balancer](../load-balancer/cross-region-overview.md?toc=/azure/route-server/toc.json), these services are designed for public internet traffic and public IP addressing.

Anycast routing with Azure Route Server is designed for:

- **Private network scenarios**: Applications that require private IP addressing
- **Hybrid connectivity**: Scenarios involving ExpressRoute or VPN connections to on-premises networks
- **Routing-based traffic management**: Where DNS caching or client behavior might interfere with DNS-based solutions

## Anycast implementation with Azure Route Server

Azure Route Server enables anycast routing by facilitating the advertisement of identical routes from multiple Azure regions to on-premises networks through ExpressRoute or VPN connections.

### Architecture overview

The anycast implementation uses the following components:

- **Multiple Azure regions**: Each region hosts an instance of your application
- **Azure Route Server**: Deployed in each region to manage route advertisements
- **Network virtual appliances (NVAs)**: Advertise the anycast IP address in each region
- **Hub-and-spoke topology**: Provides connectivity between the NVA and application instances
- **ExpressRoute or VPN**: Connects Azure regions to on-premises networks

### Implementation topology

The following diagram shows a typical anycast implementation with two Azure regions. Each region contains:

- A hub virtual network with an NVA and Azure Route Server
- A spoke virtual network hosting the application instance
- ExpressRoute connectivity to on-premises networks

:::image type="content" source="./media/anycast/anycast.png" alt-text="Diagram showing anycast routing implementation with Azure Route Server across two regions, demonstrating how the same IP address is advertised from multiple locations.":::

### How anycast routing works

1. **Route advertisement**: NVAs in each region advertise the same IP address prefix (for example, `a.b.c.d/32`) to their local Azure Route Server
2. **Route propagation**: Azure Route Server propagates these routes to on-premises networks through ExpressRoute or VPN connections
3. **Route selection**: On-premises routing protocols select the best path to reach the anycast IP address based on routing metrics
4. **Traffic distribution**: Client traffic is automatically routed to the optimal region based on the selected path

### Route selection and load balancing

The selection of which region receives traffic depends on routing attributes:

- **Equal-cost multi-path (ECMP)**: When routes from multiple regions have identical metrics, traffic is distributed evenly across all available paths
- **BGP path preferences**: You can influence routing decisions by adjusting BGP attributes such as AS path length, local preference, or MED values
- **AS path prepending**: Artificially lengthen the AS path for specific routes to make them less preferred, creating a primary/backup scenario

> [!IMPORTANT]
> NVAs must implement health checking mechanisms to stop advertising routes when the local application instance becomes unavailable. This prevents traffic from being routed to failed instances (blackholing).

## Return traffic considerations

Proper handling of return traffic is crucial for successful anycast implementations. The method depends on how the NVA processes incoming traffic.

### Traffic processing methods

- **Reverse proxy mode** provides the most predictable traffic flow when the NVA operates as a reverse proxy. In this configuration, the NVA terminates the original connection from the client and establishes a new connection to the application instance. Return traffic naturally flows back through the same NVA because the NVA manages both sides of the connection.

- **Network Address Translation (NAT) mode** requires different considerations when the NVA performs Destination Network Address Translation (DNAT). The NVA translates the destination IP address from the anycast IP to the application's actual IP address. If the NVA also performs Source NAT (SNAT), return traffic flows back through the same NVA. However, if no SNAT is performed, extra configuration is required to ensure proper return traffic routing.

### Return traffic routing

When the application receives traffic with the original client IP address (no SNAT), you must ensure return traffic flows through the correct NVA. User-defined routes (UDRs) can be configured in the application's subnet to direct traffic back to the NVA. These UDRs must cover the on-premises IP address ranges and work well for single NVA deployments.

For deployments with multiple NVA instances per region, asymmetric traffic considerations become important. Stateless NVAs can handle asymmetric traffic where inbound and outbound flows go through different instances. However, stateful NVAs require symmetric traffic flow to maintain connection state. Solutions for stateful NVAs include using connection affinity mechanisms, implementing session sharing between NVA instances, or configuring load balancers with session persistence.

### Best practices for traffic flow

Health monitoring should implement robust health checks to detect application and NVA failures quickly. Failover timing requires configuring appropriate BGP timers to balance between quick failover and stability. Traffic engineering can use BGP communities or other attributes to implement traffic policies. Comprehensive monitoring and alerting should track route advertisements and traffic patterns across regions to ensure optimal performance and quick issue detection.

## Implementation considerations

### Prerequisites and requirements

Before implementing anycast routing with Azure Route Server, you should carefully plan your IP address allocation to ensure the anycast IP address doesn't conflict with existing Azure or on-premises networks. A solid understanding of BGP routing policies and their effect on traffic distribution is essential for successful deployment. Your application architecture must be designed to handle traffic from multiple regions effectively, and you need to implement comprehensive health monitoring for both applications and network virtual appliances to ensure reliable operation.

### Deployment best practices

When deploying anycast routing, we recommend starting with a simple two-region deployment before expanding to other regions. Regular testing of failover scenarios helps ensure the system meets your availability requirements and behaves as expected during outages. Monitoring performance metrics such as latency and throughput from different on-premises locations provides valuable insights into the effectiveness of your routing configuration. Maintaining clear documentation of your BGP policies and their intended effects is crucial for ongoing management and troubleshooting.

### Limitations and considerations

Several factors should be considered when implementing anycast routing with Azure Route Server. BGP convergence times can introduce delays during failover events, potentially affecting recovery time objectives. The added complexity of network-layer routing compared to DNS-based solutions requires more expertise and careful planning. Troubleshooting network-layer routing issues can be more challenging than diagnosing application-layer problems, requiring specialized knowledge and tools. Additionally, the infrastructure costs increase due to the need for more network virtual appliance and Route Server instances across multiple regions.

## Next steps

- Learn about [Azure Route Server support for ExpressRoute and Azure VPN](expressroute-vpn-support.md)
- Learn how to [configure peering between Azure Route Server and network virtual appliances](peer-route-server-with-virtual-appliance.md)
- Learn about [hub routing preference with Azure Route Server](hub-routing-preference.md)
