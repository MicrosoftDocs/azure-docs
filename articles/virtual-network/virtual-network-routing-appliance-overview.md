---
title: Overview of Routing Appliances
titleSuffix: Azure Virtual Network
description: Learn about routing appliances, a high-performance routing solution for low latency, high throughput, and seamless Azure-native management of virtual networks.
#customer intent: As a network administrator, I want to understand what a routing appliance is so that I can determine its use cases for my organization's virtual networks.
author: asudbring
ms.author: allensu
ms.reviewer: allensu
ms.date: 08/27/2026
ms.topic: concept-article
ms.service: azure-virtual-network
ms.custom: references_regions
---

# Overview of Azure Virtual Network routing appliances

An Azure Virtual Network routing appliance is a high-performance solution that provides a managed, scalable forwarding layer for your virtual networks. A routing appliance runs on specialized networking hardware to deliver low latency and high throughput for your traffic flows.

As a top-level Azure resource, a routing appliance integrates with the Azure management model. You can deploy, configure, and govern it by using familiar Azure tools and processes. You deploy the appliance in a dedicated subnet within your virtual network, where it acts as a high-bandwidth forwarding layer for routed traffic.

A routing appliance can help organizations that need to:

- Scale routing capacity horizontally to meet growing bandwidth demands.
- Reduce latency for east-to-west traffic flows.
- Eliminate routing bottlenecks in network topologies.
- Maintain Azure-native management and governance.

A routing appliance is an Azure-managed network routing device that you deploy inside your virtual network. It acts as a high-bandwidth forwarding layer for routed traffic flows, so you don't need to run your own virtual machines as the forwarding layer.

:::image type="content" source="media/virtual-network-routing-appliance-overview/virtual-network-appliance-diagram.png" alt-text="Diagram that shows the architecture of routing appliances for virtual networks in Azure.":::

Key characteristics:  

- You create and manage a routing appliance as an Azure resource, similar to other networking resources.  
- You host a routing appliance in a dedicated subnet named `VirtualNetworkApplianceSubnet`.  
- A routing appliance forwards traffic in the data path.
- A routing appliance supports IPv4, IPv6, and dual-stack configurations, including IPv6 access control list enforcement.
- A routing appliance supports global and cross-region private endpoints.
- A routing appliance emits throughput and flow metrics to Azure Monitor by default.

## Common routing patterns (hub and spoke)

Most deployments use a virtual network routing appliance in a hub virtual network to provide scalable spoke-to-spoke (east-west) transit. Common patterns include:

### Pattern 1: Route Azure private address space to the appliance

Use UDRs on spoke subnets to route your Azure private address space (for example, RFC1918) to the routing appliance, while routing internet egress and on-premises prefixes to other next hops as appropriate.

This pattern is useful when:
- You want the routing appliance to carry east-west traffic, but not become the default next hop for all traffic.
- You already have an established egress design (for example, Azure Firewall or NAT Gateway) that you don’t want to change.

### Pattern 2: Default-route spokes to the appliance (simplified spoke UDRs)

Use a 0.0.0.0/0 UDR on spoke subnets with the routing appliance as the next hop, and then route on-premises and internet traffic from the hub according to your architecture.

This pattern is useful when:
- You want “cookie cutter” spoke route tables (simpler to operate at scale).
- You want to avoid maintaining many per-prefix UDR entries in spokes.

> [!IMPORTANT]
> Review the limitations section carefully before using a default route to the appliance, especially for Azure Private Link / Private Endpoint traffic.

### Pattern 3: RFC1918-to-appliance, default-to-egress

Use RFC1918 routes to the routing appliance to handle spoke-to-spoke and private transit, and send 0.0.0.0/0 to your chosen egress solution.

This pattern is useful when:
- You want predictable east-west routing via the appliance.
- You want to keep internet egress flows pinned to your egress solution and reduce the risk of asymmetric routing through a firewall.

## Benefits

### High throughput and maximum connections

A routing appliance is a lightweight, high-performance forwarding layer. It reduces the risk of the forwarding layer becoming the choke point for traffic flows. You configure each appliance with a bandwidth of 10, 50, 100, or 200 Gbps when you create it. The following table shows the connection and flow scale for each tier.

| Bandwidth tier | Maximum connections per second | Maximum concurrent flows |
|----------------|--------------------------------|--------------------------|
| 10 Gbps        | 100,000                        | 1,000,000                |
| 50 Gbps        | 250,000                        | 2,000,000                |
| 100 Gbps       | 600,000                        | 4,000,000                |
| 200 Gbps       | 1,500,000                      | 8,000,000                |

### Horizontal scaling and accelerated east-to-west flows

A routing appliance is purpose built for horizontal scaling, accelerated east-to-west flows, and low latency to meet massive bandwidth demands.

### Azure-native management model

Because a routing appliance is a top-level Azure resource, you can manage and govern it like other Azure networking resources. In addition, it provides native support for virtual network features such as network security groups, admin rules, user-defined routes, and Azure NAT Gateway.

## Monitoring and metrics

A routing appliance sends platform metrics to Azure Monitor without needing any diagnostic configuration. You can view these metrics on the **Metrics** page of the appliance in the Azure portal, chart them in dashboards, query them through the Azure Monitor REST API, and set alerts on throughput or flow thresholds.

| Metric | Unit | Description |
|--------|------|-------------|
| Bytes sent | Bytes | Egress traffic volume through the appliance. |
| Bytes received | Bytes | Ingress traffic volume through the appliance. |
| Packets sent | Count | Egress packet count. |
| Packets received | Count | Ingress packet count. |
| Inbound flows | Count | Current active inbound flow count. |
| Outbound flows | Count | Current active outbound flow count. |
| Inbound flow creation rate | Count/sec | Rate of new inbound flow creation. |
| Outbound flow creation rate | Count/sec | Rate of new outbound flow creation. |

## High-availability and load-balancing guidance

A routing appliance provides built-in high availability and is resilient to availability zones by default. It also offers high bandwidth without requiring an additional load balancer in front of it. If you place a load balancer in front of it, the load balancer won't forward traffic to it.

## Region availability

Routing appliances are generally available in the following Azure regions. Microsoft adds more regions as capacity becomes available.

- Australia East
- Brazil South
- Brazil Southeast
- Central India
- Central US
- East Asia
- East US
- East US 2
- Germany West Central
- North Central US
- North Europe
- South Central US
- South India
- Southeast Asia
- Spain Central
- Sweden Central
- UK South
- West Central US
- West Europe
- West US
- West US 2
- West US 3

## Limitations

- Each subscription can have up to two routing appliances per region.

- Each routing appliance supports up to 200 Gbps of configurable bandwidth.

- You can't change the configured bandwidth in place. To change bandwidth, delete the appliance and redeploy it with the new value.

- Placing a routing appliance behind an internal load balancer isn't supported.

- For Terraform, use the AzAPI provider; the AzureRM provider doesn't support routing appliances currently.

- VNet flow logs isn't supported yet.

- Traffic that traverses the appliance isn't encrypted by virtual network encryption.

- Virtual network routing appliance chaining in the same region isn't supported.

- Service endpoints and service tunneling through a routing appliance require a network security group on the appliance subnet. The network security group must allow inbound traffic from the VirtualNetwork service tag and outbound traffic to the VirtualNetwork tag and to the service tag of the destination service.

- Azure Private Link over IPv6 requires a user-defined route that sends the private endpoint prefix to the routing appliance. Without that route, IPv6 private endpoint traffic doesn't traverse the appliance.

## Get started

Create a subnet named `VirtualNetworkApplianceSubnet` in the virtual network that hosts the appliance. Deploy the routing appliance into that subnet with a bandwidth of 10, 50, 100, or 200 Gbps. Then use user-defined routes with a next hop type of virtual appliance to steer traffic to its private IP address.

You can't change the configured bandwidth of an existing routing appliance. To change bandwidth, delete the appliance and redeploy it with the new value.
