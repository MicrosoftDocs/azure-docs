---
title: Azure Load Balancer SKUs
description: Overview of Azure Load Balancer SKUs
services: load-balancer
documentationcenter: na
author: mbender-ms
ms.service: load-balancer
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/22/2021
ms.author: mbender

---
# Azure Load Balancer SKUs

Azure Load Balancer has three SKUs.

## <a name="skus"></a> SKU comparison
Azure Load Balancer has 3 SKUs - Basic, Standard, and Gateway. Each SKU is catered towards a specific scenario and has differences in scale, features, and pricing. 

To compare and understand the differences between Basic and Standard SKU, see the following table. For more information, see [Azure Standard Load Balancer overview](./load-balancer-overview.md). For information on Gateway SKU - catered for third-party network virtual appliances (NVAs), see [Gateway Load Balancer overview](gateway-overview.md)

>[!NOTE]
> Microsoft recommends Standard load balancer. See [Upgrade from Basic to Standard Load Balancer](upgrade-basic-standard.md) for a guided instruction on upgrading SKUs along with an upgrade script.
> 
> Standalone VMs, availability sets, and virtual machine scale sets can be connected to only one SKU, never both. Load balancer and the public IP address SKU must match when you use them with public IP addresses. Load balancer and public IP SKUs aren't mutable.

| | Standard Load Balancer | Basic Load Balancer |
| --- | --- | --- |
| **Scenario** |  Equipped for load-balancing network layer traffic when high performance and ultra-low latency is needed. Routes traffic within and across regions, and to availability zones for high resiliency. | Equipped for small-scale applications that don't need high availability or redundancy. Not compatible with availability zones. |
| **Backend type** | IP based, NIC based | NIC based |
| **Protocol** | TCP, UDP | TCP, UDP |
| **[Frontend IP Configurations](../azure-resource-manager/management/azure-subscription-service-limits.md#load-balancer)** | Supports up to 600 configurations | Supports up to 200 configurations |
| **[Backend pool size](../azure-resource-manager/management/azure-subscription-service-limits.md#load-balancer)** | Supports up to 5000 instances | Supports up to 300 instances |
| **Backend pool endpoints** | Any virtual machines or virtual machine scale sets in a single virtual network | Virtual machines in a single availability set or virtual machine scale set |
| **[Health probes](./load-balancer-custom-probe-overview.md#probe-types)** | TCP, HTTP, HTTPS | TCP, HTTP |
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
| **Global VNet Peering Support** | Standard ILB is supported via Global VNet Peering | Not supported | 
| **[NAT Gateway Support](../virtual-network/nat-gateway/nat-overview.md)** | Both Standard ILB and Standard Public LB are supported via Nat Gateway | Not supported | 
| **[Private Link Support](../private-link/private-link-overview.md)** | Standard ILB is supported via Private Link | Not supported | 
| **[Global tier (Preview)](./cross-region-overview.md)** | Standard LB supports the Global tier for Public LBs enabling cross-region load balancing | Not supported | 

For more information, see [Load balancer limits](../azure-resource-manager/management/azure-subscription-service-limits.md#load-balancer). For Standard Load Balancer details, see [overview](./load-balancer-overview.md), [pricing](https://aka.ms/lbpricing), and [SLA](https://aka.ms/lbsla).

## Limitations

- A standalone virtual machine resource, availability set resource, or virtual machine scale set resource can reference one SKU, never both.
- [Move operations](../azure-resource-manager/management/move-resource-group-and-subscription.md):
  - Resource group move operations (within same subscription) **are supported** for Standard Load Balancer and Standard Public IP. 
  - [Subscription group move operations](../azure-resource-manager/management/move-support-resources.md) are **not** supported for Standard Load Balancers.

## Next steps

- See [Create a public Standard Load Balancer](quickstart-load-balancer-standard-public-portal.md) to get started with using a Load Balancer.
- Learn about using [Standard Load Balancer and Availability Zones](load-balancer-standard-availability-zones.md).
- Learn about [Health Probes](load-balancer-custom-probe-overview.md).
- Learn about using [Load Balancer for outbound connections](load-balancer-outbound-connections.md).
- Learn about [Standard Load Balancer with HA Ports load balancing rules](load-balancer-ha-ports-overview.md).
- Learn more about [Network Security Groups](../virtual-network/network-security-groups-overview.md).
