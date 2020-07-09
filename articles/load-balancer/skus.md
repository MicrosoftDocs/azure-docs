---
title: Azure Load Balancer SKUs
description: Overview of Azure Load Balancer SKUs
services: load-balancer
documentationcenter: na
author: asudbring
ms.service: load-balancer
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/01/2020
ms.author: allensu

---
# Azure Load Balancer SKUs

Azure Load Balancer has two flavors or SKUs.

## <a name="skus"></a> SKU comparison

Load balancer supports both Basic and Standard SKUs. These SKUs differ in scenario scale, features, and pricing. Any scenario that's possible with Basic load balancer can be created with Standard load balancer.

To compare and understand the differences, see the following table. For more information, see [Azure Standard Load Balancer overview](load-balancer-standard-overview.md).

>[!NOTE]
> Microsoft recommends Standard load balancer.
Standalone VMs, availability sets, and virtual machine scale sets can be connected to only one SKU, never both. Load balancer and the public IP address SKU must match when you use them with public IP addresses. Load balancer and public IP SKUs aren't mutable.

| | Standard Load Balancer | Basic Load Balancer |
| --- | --- | --- |
| [Backend pool size](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#load-balancer) | Supports up to 1000 instances. | Supports up to 300 instances. |
| Backend pool endpoints | Any virtual machines or virtual machine scale sets in a single virtual network. | Virtual machines in a single availability set or virtual machine scale set. |
| [Health probes](./load-balancer-custom-probe-overview.md#types) | TCP, HTTP, HTTPS | TCP, HTTP |
| [Health probe down behavior](./load-balancer-custom-probe-overview.md#probedown) | TCP connections stay alive on an instance probe down __and__ on all probes down. | TCP connections stay alive on an instance probe down. All TCP connections terminate when all probes are down. |
| Availability Zones | Zone-redundant and zonal frontends for inbound and outbound traffic. | Not available |
| Diagnostics | [Azure Monitor multi-dimensional metrics](./load-balancer-standard-diagnostics.md) | [Azure Monitor logs](./load-balancer-monitor-log.md) |
| HA Ports | [Available for Internal Load Balancer](./load-balancer-ha-ports-overview.md) | Not available |
| Secure by default | Closed to inbound flows unless allowed by a network security group. Please note that internal traffic from the VNet to the internal load balancer is allowed. | Open by default. Network security group optional. |
| Outbound Rules | [Declarative outbound NAT configuration](./load-balancer-outbound-rules-overview.md) | Not available |
| TCP Reset on Idle | [Available on any rule](./load-balancer-tcp-reset.md) | Not available |
| [Multiple front ends](./load-balancer-multivip-overview.md) | Inbound and [outbound](./load-balancer-outbound-connections.md) | Inbound only |
| Management Operations | Most operations < 30 seconds | 60-90+ seconds typical |
| SLA | [99.99%](https://azure.microsoft.com/support/legal/sla/load-balancer/v1_0/) | Not available | 

For more information, see [Load balancer limits](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#load-balancer). For Standard Load Balancer details, see [overview](load-balancer-standard-overview.md), [pricing](https://aka.ms/lbpricing), and [SLA](https://aka.ms/lbsla).

## Limitations

- SKUs aren't mutable. You can't change the SKU of an existing resource.
- A standalone virtual machine resource, availability set resource, or virtual machine scale set resource can reference one SKU, never both.
- [Move subscription operations](../azure-resource-manager/management/move-resource-group-and-subscription.md) aren't supported for Standard Load Balancer and Standard Public IP resources.

## Next steps

- See [Create a public Standard Load Balancer](quickstart-load-balancer-standard-public-portal.md) to get started with using a Load Balancer.
- Learn about using [Standard Load Balancer and Availability Zones](load-balancer-standard-availability-zones.md).
- Learn about [Health Probes](load-balancer-custom-probe-overview.md).
- Learn about using [Load Balancer for outbound connections](load-balancer-outbound-connections.md).
- Learn about [Standard Load Balancer with HA Ports load balancing rules](load-balancer-ha-ports-overview.md).
- Learn more about [Network Security Groups](../virtual-network/security-overview.md).
