---
title: "Azure ExpressRoute FastPath: Features, availability, and limitations"
description: Learn how Azure ExpressRoute FastPath enhances network performance by bypassing the gateway. Explore its features, availability, IP limits, and configuration steps.
services: expressroute
ms.service: azure-expressroute
ms.topic: concept-article
ms.author: rmareddy
author: duongau
ms.date: 11/05/2025
ms.custom: references_regions
# Customer intent: As a network administrator, I want to understand the features of ExpressRoute FastPath so that I can determine if it meets my organization's performance needs.
---

# Azure ExpressRoute FastPath: Features, availability, and limitations

Your ExpressRoute virtual network gateway exchanges network routes and directs traffic between your on-premises network and Azure virtual networks. When you enable FastPath, network traffic bypasses the gateway and goes directly to virtual machines in your virtual network, improving data path performance.

This article helps you understand FastPath features, requirements, and limitations so you can determine if it's suitable for your network architecture.

:::image type="content" source=".\media\about-fastpath\fastpath-vnet-peering.png" alt-text="Diagram of an ExpressRoute connection with ExpressRoute FastPath and virtual network peering.":::

## When to use FastPath

Use FastPath when you need:

- **Improved latency**: Direct connectivity to virtual machines reduces network hops and improves response times
- **Higher throughput**: Bypass the gateway to achieve better data transfer rates for your applications
- **Optimized performance**: Reduce processing overhead for high-volume data transfers between on-premises and Azure

FastPath is available in all Azure public cloud regions and supports both ExpressRoute Direct and provider circuits.

## Prerequisites

Before you configure FastPath, ensure your environment meets the following requirements.

### Supported circuit types

You can use FastPath with the following circuit types:

- **ExpressRoute Direct**: Supports FastPath with IPv4 connectivity for User-Defined Routes (UDR) and Private Link. Supports FastPath with both IPv4 and IPv6 connectivity for VNET Peering
- **ExpressRoute provider circuits**: Supports FastPath with IPv4 connectivity

The following table shows feature availability for each circuit type:

| Feature | ExpressRoute Direct | ExpressRoute provider |
|---------|--------------------|-----------------------|
| FastPath to hub virtual network (IPv4) | ✓ | ✓ |
| FastPath to hub virtual network (IPv6) | ✓ | ✗ |
| Virtual network peering over FastPath | ✓ | ✗ |
| User-Defined Routes (UDR) over FastPath | ✓ | ✗ |
| Private Link and private endpoints | ✓ (limited GA) | ✗ |

### Gateway SKUs

To use FastPath, you need an ExpressRoute virtual network gateway to exchange routes between your virtual network and on-premises network. The gateway must be one of the following SKUs:

- Ultra Performance
- ErGw3AZ
- ErGwScale with a minimum of 10 scale units

For more information about gateway performance and available SKUs, see [ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md).

### IP address capacity

FastPath has IP address limits based on your circuit type. Plan your deployment to ensure you don't exceed these limits.

| Circuit type | Bandwidth | IP address limit |
|--------------|-----------|------------------|
| ExpressRoute Direct | 100 Gbps | 200,000 |
| ExpressRoute Direct | 10 Gbps | 100,000 |
| ExpressRoute provider | 10 Gbps or lower | 25,000 |

> [!IMPORTANT]
> ExpressRoute Direct applies IP limits cumulatively at the port level. When you reach the limit, FastPath stops configuring new routes and traffic flows through the ExpressRoute gateway instead. All standard limits for the gateway, circuit, and virtual network still apply.

> [!TIP]
> Configure alerts using Azure Monitor to get notified when FastPath routes approach the threshold limit.

## FastPath features

FastPath offers several advanced networking features to optimize your connectivity between on-premises and Azure.

### Virtual network peering (ExpressRoute Direct only)

You can use FastPath with virtual network peering to extend connectivity to spoke virtual networks. All virtual networks must be in the same Azure region.

**Requirements:**

- Hub virtual network and spoke virtual networks must be in the same region
- Global virtual network peering isn't supported

### Private Link and private endpoints (ExpressRoute Direct only)

> [!IMPORTANT]
> This feature is in limited general availability and requires enrollment. Complete the [enrollment form](https://aka.ms/FPlimitedga) to get started. Deployment takes 4-6 weeks after approval.

FastPath supports Private Link connectivity for ExpressRoute Direct circuits (100 Gbps and 10 Gbps) in specific scenarios.

#### Supported regions

- Australia East
- Central Korea
- East Asia
- East US / East US 2
- Japan East
- North Central US / South Central US
- North Europe / West Europe
- South East Asia
- UK South
- West Central US
- West US / West US 2 / West US 3

#### Supported services

- Azure Cosmos DB
- Azure Key Vault
- Azure Storage
- Third-party Private Link services

#### Important considerations for Private Link

- FastPath supports private endpoints deployed in spoke virtual networks that are peered to your hub virtual network
- FastPath supports up to 100-Gbps connectivity to a single availability zone
- Cross-region connectivity for virtual networks, private endpoints, and Private Link services isn't supported. Traffic to cross-region resources flows through the ExpressRoute gateway
- Azure Private Link pricing doesn't apply to traffic sent over FastPath. For more information, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/)
- If FastPath becomes unavailable, traffic automatically flows through the ExpressRoute gateway to maintain connectivity
- We perform regular host and operating system maintenance on the ExpressRoute virtual network gateway to ensure service reliability. During these maintenance windows, you may experience brief or intermittent connectivity interruptions to private endpoint resources.

### User-Defined Routes (ExpressRoute Direct only)

You can use User-Defined Routes (UDRs) with FastPath on ExpressRoute Direct circuits. UDRs allow you to control traffic routing within your virtual network while maintaining FastPath performance benefits. This feature is available in all Azure public cloud regions.

## Limitations

FastPath doesn't support all scenarios. Review the following limitations when planning your deployment.

### Load balancers and PaaS services in spoke networks

FastPath doesn't support traffic to Azure internal load balancers or Azure PaaS services deployed in spoke virtual networks. Traffic to these services flows through the ExpressRoute gateway instead.

Internal load balancers deployed in the hub virtual network work with FastPath and traffic bypasses the gateway.

### Azure Firewall 

You can use Azure Firewall with FastPath in the hub virtual network. However, Azure Firewall deployed in spoke virtual networks isn't supported. Traffic to Azure Firewall in spoke networks flows through the ExpressRoute gateway instead of FastPath.

### Virtual network peering configurations

When using FastPath with virtual network peering, be aware of the following limitations:

- **Gateway transit**: If you peer two hub virtual networks and connect them to the same ExpressRoute circuit, set **Allow Gateway Transit** to false in the peering configuration to avoid connectivity issues.
- **Remote gateway**: If you peer a spoke virtual network to two different hub virtual networks, use only one hub gateway as the remote gateway. Configuring both as remote gateways causes connectivity issues.

### DNS Private Resolver

You can use Azure DNS Private Resolver with FastPath in the hub virtual network. However, DNS Private Resolver deployed in spoke virtual networks isn't supported. Traffic to DNS Private Resolver in spoke networks flows through the ExpressRoute gateway instead of FastPath.

For more information, see [What is Azure DNS Private Resolver?](../dns/dns-private-resolver-overview.md)

### Azure NetApp Files

To use FastPath with Azure NetApp Files, upgrade your volumes to use Standard network features. Basic network features aren't supported with FastPath.

For more information, see [Supported network topologies for Azure NetApp Files](../azure-netapp-files/azure-netapp-files-network-topologies.md#supported-network-topologies).

### IPv6 support

IPv6 support for FastPath is only available on ExpressRoute Direct circuits. ExpressRoute provider circuits support IPv4 only.

## Next steps

To enable FastPath, see:

- [Configure ExpressRoute FastPath using the Azure portal](expressroute-howto-linkvnet-portal-resource-manager.md#configure-expressroute-fastpath)
- [Configure ExpressRoute FastPath using Azure PowerShell](expressroute-howto-linkvnet-arm.md#configure-expressroute-fastpath)
