---
title: Azure Load Balancer SKUs
description: Overview of Azure Load Balancer SKUs.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: reference
ms.workload: infrastructure-services
ms.date: 07/10/2023
ms.author: mbender
ms.custom: template-reference, engagement-fy23
---

# Azure Load Balancer SKUs

>[!Important]
>On September 30, 2025, Basic Load Balancer will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer/). If you are currently using Basic Load Balancer, make sure to upgrade to Standard Load Balancer prior to the retirement date. For guidance on upgrading, visit [Upgrading from Basic Load Balancer - Guidance](load-balancer-basic-upgrade-guidance.md).

Azure Load Balancer has three SKUs.

## <a name="skus"></a> SKU comparison
Azure Load Balancer has 3 SKUs - Basic, Standard, and Gateway. Each SKU is catered towards a specific scenario and has differences in scale, features, and pricing. 

To compare and understand the differences between Basic and Standard SKU, see the following table. 

| | Standard Load Balancer | Basic Load Balancer |
| --- | --- | --- |
| **Scenario** |  Equipped for load-balancing network layer traffic when high performance and ultra-low latency is needed. Routes traffic within and across regions, and to availability zones for high resiliency. | Equipped for small-scale applications that don't need high availability or redundancy. Not compatible with availability zones. |
| **Backend type** | IP based, NIC based | NIC based |
| **Protocol** | TCP, UDP | TCP, UDP |
| **Backend pool endpoints** | Any virtual machines or virtual machine scale sets in a single virtual network | Virtual machines in a single availability set or virtual machine scale set |
| **[Health probes](./load-balancer-custom-probe-overview.md#probe-protocol)** | TCP, HTTP, HTTPS | TCP, HTTP |
| **[Health probe down behavior](./load-balancer-custom-probe-overview.md#probe-down-behavior)** | TCP connections stay alive on an instance probe down __and__ on all probes down. | TCP connections stay alive on an instance probe down. All TCP connections end when all probes are down. |
| **Availability Zones** | Zone-redundant and zonal frontends for inbound and outbound traffic | Not available |
| **Diagnostics** | [Azure Monitor multi-dimensional metrics](./load-balancer-standard-diagnostics.md) | Not supported |
| **HA Ports** | [Available for Internal Load Balancer](./load-balancer-ha-ports-overview.md) | Not available |
| **Secure by default** | Closed to inbound flows unless allowed by a network security group. Internal traffic from the virtual network to the internal load balancer is allowed. | Open by default. Network security group optional. |
| **Outbound Rules** | [Declarative outbound NAT configuration](./load-balancer-outbound-connections.md#outboundrules) | Not available |
| **TCP Reset on Idle** | [Available on any rule](./load-balancer-tcp-reset.md) | Not available |
| **[Multiple front ends](./load-balancer-multivip-overview.md)** | Inbound and [outbound](./load-balancer-outbound-connections.md) | Inbound only |
| **Management Operations** | Most operations < 30 seconds | 60-90+ seconds typical |
| **SLA** | [99.99%](https://azure.microsoft.com/support/legal/sla/load-balancer/v1_0/) | Not available | 
| **Global VNet Peering Support** | Standard Internal Load Balancer is supported via Global VNet Peering | Not supported | 
| **[NAT Gateway Support](../virtual-network/nat-gateway/nat-overview.md)** | Both Standard Internal Load Balancer and Standard Public Load Balancer are supported via Nat Gateway | Not supported | 
| **[Private Link Support](../private-link/private-link-overview.md)** | Standard Internal Load Balancer is supported via Private Link | Not supported | 
| **[Global tier](./cross-region-overview.md)** | Standard Load Balancer supports the Global tier for Public Load Balancers enabling cross-region load balancing | Not supported | 

For more information, see [Load balancer limits](../azure-resource-manager/management/azure-subscription-service-limits.md#load-balancer). For Standard Load Balancer details, see [overview](./load-balancer-overview.md), [pricing](https://aka.ms/lbpricing), and [SLA](https://aka.ms/lbsla). For information on Gateway SKU - catered for third-party network virtual appliances (NVAs), see [Gateway Load Balancer overview](gateway-overview.md)

## Limitations
- A standalone virtual machine resource, availability set resource, or virtual machine scale set resource can reference one SKU, never both.
- [Move operations](../azure-resource-manager/management/move-resource-group-and-subscription.md):
  - [Resource group move operations](../azure-resource-manager/management/move-support-resources.md#microsoftnetwork) (within same subscription) are **supported** for Standard Load Balancer and Standard Public IP. 
  - [Subscription move operations](../azure-resource-manager/management/move-support-resources.md#microsoftnetwork) are **not supported** for Standard Load Balancers.

## Next steps
- See [Create a public Standard Load Balancer](quickstart-load-balancer-standard-public-portal.md) to get started with using a Load Balancer.
- Learn about using [Standard Load Balancer and Availability Zones](load-balancer-standard-availability-zones.md).
- Learn about [Health Probes](load-balancer-custom-probe-overview.md).
- Learn about using [Load Balancer for outbound connections](load-balancer-outbound-connections.md).
- Learn about [Standard Load Balancer with HA Ports load balancing rules](load-balancer-ha-ports-overview.md).
- Learn more about [Network Security Groups](../virtual-network/network-security-groups-overview.md).
