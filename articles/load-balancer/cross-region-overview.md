---
title: Cross-region load balancer (Preview)
titleSuffix: Azure Load Balancer
description: Overview of cross region load balancer tier for Azure Load Balancer.
services: load-balancer
documentationcenter: na
author: asudbring
ms.service: load-balancer
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/01/2020
ms.author: allensu

---
# Cross-region load balancer (Preview)

Azure Load Balancer distributes inbound flows that arrive at the load balancer's frontend to backend pool instances.

Azure Standard Load Balancer supports cross-region load balancing enabling geo-redundant HA scenarios such as:

* Fast and easy region recovery.
* Load distribution across regions to the closest Azure region.
* Ease of adoption.

Cross-region load balancing offers the same benefits a regional standard load balancer:

* High performance
* Low latency 

The frontend IP configuration of your cross-region load balancer is static and advertised across the Azure regions of your choice.  

:::image type="content" source="./media/cross-region-overview/cross-region-load-balancer-1.png" alt-text="Cross-region load balancer" border="true":::

> [!IMPORTANT]
> Cross-region load balancer is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Why use cross region load balancing?

* Ensure business continuity with regional redundancy.
* Enable high-performance traffic routing with ultra-low latency.
* Deploy your solution on existing regional Azure Load Balancers.

### Regional redundancy

Configure regional redundancy by adding a global frontend public IP address to your existing load balancers. 

If a region fails, the traffic is routed to the next healthy regional load balancer.  

The health probe of the cross-region load balancer gathers information about availability every 20 seconds. If one regional load balancer drops its availability to 0, cross-region load balancer will detect the failure. The regional load balancer is taken out of rotation. 

:::image type="content" source="./media/cross-region-overview/cross-region-load-balancer-2.png" alt-text="Global region view" border="true":::

### Ultra-low latency

The geo-proximity load-balancing algorithm based on the geographic location of your users and your regional deployments. 

For example, you have a cross-region load balancer set up with a West US and a North Europe standard public load balancer in the backend pool. 

If a user starts flow from Seattle, the cross-region load balancer will route the traffic to the West US load balancer because it’s located closest to Seattle. 

### Deploy solution on existing regional Azure Load Balancers

Create a highly available, cross region solution from your existing deployment.

An Azure Standard Load Balancer frontend is associated with the backend pool of a cross-region load balancer. Add a cross-region load balancer in front of your existing regional load balancers.

## Availability

**Home region** is where the cross-region load balancer is deployed. 
This region doesn't affect how the traffic will be routed. If a home region goes down, it doesn't impact the flow of traffic.

**Home regions**:
* East US 2
* West US
* West Europe
* Southeast Asia
* Central US
* North Europe
* East Asia

> [!NOTE]
> You can only deploy your cross-region load balancer in one of the 8 regions above.

A **participating region** is where the global public IP of the load balancer is available. 

Traffic started by the user will travel to the closest participating region through the Microsoft core network. 

Cross-region load balancer routes the traffic to the appropriate regional load balancer.

**Participating regions**:
* East US 
* West Europe 
* Central US 
* East US 2 
* West US 
* North Europe 
* South Central US 
* West US 2 
* UK South 
* Southeast Asia 
* North Central US 
* Japan East 
* East Asia 
* West Central US 
* Australia Southeast 
* Australia East 
* Central India 

## Limitations

* Cross-region frontend IP configurations are public only. An internal frontend is currently not supported.

* Cross-region IPv6 frontend IP configurations aren't supported. 

* A health probe can't be configured currently. A default health probe automatically collects availability information about the regional load balancer every 20 seconds. 

## Pricing and SLA
Cross-region load balancer, shares the [SLA](https://azure.microsoft.com/support/legal/sla/load-balancer/v1_0/ ) of standard load balancer.

 
## Next steps

- See [Create a public Standard Load Balancer](quickstart-load-balancer-standard-public-portal.md) to get started with using a load balancer.
- Learn more about [Azure Load Balancer](load-balancer-overview.md).
- Load balancer [FAQs](load-balancer-faqs.md)

