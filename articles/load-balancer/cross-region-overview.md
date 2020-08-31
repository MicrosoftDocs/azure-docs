---
title: Cross-region load balancer Preview
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
# Cross-region load balancer Preview

Azure Load Balancer distributes inbound flows that arrive at the load balancer's front end to backend pool instances.

Azure Standard Load Balancer supports cross-region load balancing enabling geo-redundant HA scenarios such as:

* Fast and easy region recovery.
* Load distribution across regions to the closest Azure region.
* Ease of adoption.

In addition, cross-region load balancing offers the same benefits of high performance and low latency of your regional Standard Load Balancer. The Frontend IP configuration of your cross-region Load Balancer is static and advertised across the Azure regions of your choice.  

:::image type="content" source="./media/cross-region-overview/cross-region-load-balancer-1.png" alt-text="Cross-region load balancer" border="true":::

> [!IMPORTANT]
> Cross-region load balancer is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Why use cross region load balancing?

* Ensure business continuity with regional redundancy.
* Enable high performance traffic routing with ultra-low latency.
* Deploy your solution on existing regional Azure Load Balancers.

### Regional redundancy
Regional redundancy can be achieved by adding a global frontend Public IP address to your existing Load Balancers. If a region goes down, the inbound traffic is routed to the next optimal healthy regional Load Balancer.  

The health probe of the Global Public Load Balancer gathers information about availability of the regional Load Balancer every 20 seconds. If one regional Load Balancer drops its availability to 0, Global Public Load Balancer will detect the failure using health probe, and take the regional Load Balancer out of rotation. 

:::image type="content" source="./media/cross-region-overview/cross-region-load-balancer-2.png" alt-text="Global region view" border="true":::

### Ultra-low latency
The geo-proximity load balancing algorithm based on the geographic location of your users and your regional deployments. For example, let’s say you have a Global Public Load Balancer set up with a West US and a North Europe Standard Public Load Balancer in the backend pool. If a user initiates flow from Seattle, the Global Public Load Balancer will route the traffic to the West US Load Balancer because it’s located closest to Seattle. 

### Deploy solution on existing regional Azure Load Balancers

The backend pool of Global Load Balancer is composed of frontends of Azure Standard Load Balancer. You can extend your existing solution for a highly available cross region solution by simply adding a Global Load Balancer in front of the existing Azure Load Balancers.

## Availability
**Home region** is a region where you specify you’d like your cross-region Load Balancer to reside. This is merely an artifact of Azure Resource Manager and doesn’t imply  
It does not affect how the traffic will be routed. If a home region goes down, it does not impact the data flow.

**Home Regions**:
* East US 2
* West US
* West Europe
* Southeast Asia
* Central US
* North Europe
* East Asia

> [!NOTE]
> You can only deploy your cross-region load balancer in one of the 8 regions above.

A **participating region** is a region where the Global Public IP of the Load Balancer is available. Traffic initiated by user will hit the closest participating region through Microsoft Core Network and be routed accordingly by Global Public Load Balancer.

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

* Cross-region frontend IP configurations can only be public. Private or internal frontends are not currently supported. 

* Cross-region IPv6 frontend IP configurations are not supported. 

* A health probe cannot be configured for now. Currently we use a default health probe which automatically collects availability information about the regional load balancer every 20 seconds. 

## Pricing and SLA
Cross-region load balancer, shares the [SLA](https://azure.microsoft.com/support/legal/sla/load-balancer/v1_0/ ) of standard load balancer.

 
## Next steps

- See [Create a public Standard Load Balancer](quickstart-load-balancer-standard-public-portal.md) to get started with using a Load Balancer.
- Learn more about [Azure Load Balancer](load-balancer-overview.md).
- Load balancer [FAQs](load-balancer-faqs.md)

