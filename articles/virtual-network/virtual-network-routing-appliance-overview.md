---
title: Overview of Routing Appliances
titleSuffix: Azure Virtual Network
description: Learn about routing appliances, a high-performance routing solution for low latency, high throughput, and seamless Azure-native management of virtual networks.
#customer intent: As a network administrator, I want to understand what a routing appliance is so that I can determine its use cases for my organization's virtual networks.
author: asudbring
ms.author: allensu
ms.reviewer: allensu
ms.date: 02/04/2026
ms.topic: concept-article
ms.service: azure-virtual-network
---

# Overview of Azure Virtual Network routing appliances

An Azure Virtual Network routing appliance is a high-performance solution that provides a managed, scalable forwarding layer for your virtual networks. A routing appliance runs on specialized networking hardware to deliver low latency and high throughput for your traffic flows.

As a top-level Azure resource, a routing appliance integrates with the Azure management model. You can deploy, configure, and govern it by using familiar Azure tools and processes. You deploy the appliance in a dedicated subnet within your virtual network, where it acts as a high-bandwidth forwarding layer for routed traffic.

A routing appliance can help organizations that need to:

- Scale routing capacity horizontally to meet growing bandwidth demands.
- Reduce latency for east-to-west traffic flows.
- Eliminate routing bottlenecks in network topologies.
- Maintain Azure-native management and governance.

> [!IMPORTANT]
> Azure Virtual Network routing appliances are currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

A routing appliance is an Azure-managed network routing device that you deploy inside your virtual network. It acts as a high-bandwidth forwarding layer for routed traffic flows, so you don't need to run your own virtual machines as the forwarding layer.

:::image type="content" source="media/virtual-network-routing-appliance-overview/virtual-network-appliance-diagram.png" alt-text="Diagram that shows the architecture of routing appliances for virtual networks in Azure.":::

Key characteristics:  

- You create and manage a routing appliance as an Azure resource, similar to other networking resources.  
- You host a routing appliance in a dedicated subnet named `VirtualNetworkApplianceSubnet`.  
- A routing appliance forwards traffic in the data path.

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

A routing appliance is a lightweight, high-performance forwarding layer. It reduces the risk of the forwarding layer becoming the choke point for traffic flows.

| Bandwidth tier | Maximum connections per second | Maximum concurrent flows |
|----------------|--------------------------------|--------------------------|
| 50 Gbps        | 250,000                        | 2,000,000                |
| 100 Gbps       | 600,000                        | 4,000,000                |
| 200 Gbps       | 1,500,000                      | 8,000,000                |

### Horizontal scaling and accelerated east-to-west flows

A routing appliance is purpose built for horizontal scaling, accelerated east-to-west flows, and low latency to meet massive bandwidth demands.

### Azure-native management model

Because a routing appliance is a top-level Azure resource, you can manage and govern it like other Azure networking resources. In addition, it provides native support for virtual network features such as network security groups, admin rules, user-defined routes, and Azure NAT Gateway.

## High-availability and load-balancing guidance

A routing appliance provides built-in high availability and is resilient to availability zones by default. It also offers high bandwidth without requiring an additional load balancer in front of it. If you place a load balancer in front of it, the load balancer won't forward traffic to it.

## Region availability

During the preview, routing appliances are available in a limited set of Azure regions:  

- East US  
- East US 2  
- West Central US  
- West US  
- North Europe  
- UK South  
- West Europe  
- East Asia

## Limitations

- This preview is intended for testing, evaluation, and feedback purposes. Don't use the preview for production workloads.

- Each subscription can have up to two routing appliances. If you want more instances per subscription, request them in [this form](https://forms.office.com/r/kqEKRr5mpB).

- During the preview, each routing appliance supports up to 200 Gbps of configurable bandwidth.

- Global and cross-region private endpoints aren't supported.

- IPv4 is supported. IPv6 isn't in scope for this preview.

- During the preview, a routing appliance doesn't provide metrics or logs.

- During the preview, client tools such as the Azure CLI, PowerShell, and Terraform aren't supported.

## Cost

The preview is free. We'll provide advance notice before billing is enabled.

## Registration

> [!NOTE]
> Bandwidth and scaling behavior in preview are subject to change. If you need to change the configured bandwidth after deployment, you will need to redeploy the resource.

## How to request support and provide feedback
After you submit your Azure Feature Exposure Control (AFEC)  registration for `Microsoft.network/AllowVirtualNetworkAppliance`, finish the preview [sign-up form](https://forms.office.com/r/kqEKRr5mpB).

## Support

During the preview, the product group provides support services. To request support, fill out [this form](https://forms.office.com/r/pvamBMUx25).

## Feature feedback

To provide feedback, fill out [this form](https://forms.office.com/r/pvamBMUx25).
