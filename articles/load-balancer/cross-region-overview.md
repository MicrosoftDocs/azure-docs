---
title: Cross-region load balancer (preview)
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
ms.date: 09/22/2020
ms.author: allensu
ms.custom: references_regions

---
# Cross-region load balancer (Preview)

Azure Load Balancer distributes inbound traffic that arrives at the load balancer frontend to backend pool instances.

Azure Standard Load Balancer supports cross-region load balancing enabling geo-redundant HA scenarios such as:

* Incoming traffic originating from multiple regions.
* [Instant global failover](#regional-redundancy) to the next optimal regional deployment.
* Load distribution across regions to the closest Azure region with [ultra-low latency](#ultra-low-latency).
* Ability to [scale up/down](#ability-to-scale-updown-behind-a-single-endpoint) behind a single endpoint.
* [Static IP](#static-ip)
* [Client IP preservation](#client-ip-preservation)
* [Build on existing load balancer](#build-cross-region-solution-on-existing-azure-load-balancer) solution with no learning curve

> [!IMPORTANT]
> Cross-region load balancer is currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Cross-region load balancing offers the same benefits of high performance and low latency as regional standard load balancer. 

The frontend IP configuration of your cross-region load balancer is static and advertised across [most Azure regions](#participating-regions).

:::image type="content" source="./media/cross-region-overview/cross-region-load-balancer.png" alt-text="Diagram of cross-region load balancer." border="true":::

> [!NOTE]
> The backend port of your load balancing rule on cross-region load balancer should match the frontend port of the load balancing rule/inbound nat rule on regional standard load balancer. 

### Regional redundancy

Configure regional redundancy by adding a global frontend public IP address to your existing load balancers. 

If one region fails, the traffic is routed to the next closest healthy regional load balancer.  

The health probe of the cross-region load balancer gathers information about availability every 20 seconds. If one regional load balancer drops its availability to 0, cross-region load balancer will detect the failure. The regional load balancer is then taken out of rotation. 

:::image type="content" source="./media/cross-region-overview/global-region-view.png" alt-text="Diagram of global region traffic view." border="true":::

### Ultra-low latency

The geo-proximity load-balancing algorithm is based on the geographic location of your users and your regional deployments. 

Traffic started from a client will hit the closest participating region and travel through the Microsoft global network backbone to arrive at the closest regional deployment. 

For example, you have a cross-region load balancer with standard load balancers in Azure regions:

* West US
* North Europe

If a flow is started from Seattle, traffic enters West US. This region is the closest participating region from Seattle. The traffic is routed to the closest region load balancer, which is West US.

Azure cross-region load balancer uses geo-proximity load-balancing algorithm for the routing decision. 

The configured load distribution mode of the regional load balancers is used for making the final routing decision when multiple regional load balancers are used for geo-proximity.

For more information, see [Configure the distribution mode for Azure Load Balancer](./load-balancer-distribution-mode.md).


### Ability to scale up/down behind a single endpoint

When you expose the global endpoint of a cross-region load balancer to customers, you can add or remove regional deployments behind the global endpoint without interruption. 

<!---To learn about how to add or remove a regional deployment from the backend, read more [here](TODO: Insert CLI doc here).--->

### Static IP
Cross-region load balancer comes with a static public IP, which ensures the IP address remains the same. To learn more about static IP, read more [here](../virtual-network/public-ip-addresses.md#allocation-method)

### Client IP Preservation
Cross-region load balancer is a Layer-4 pass-through network load balancer. This pass-through preserves the original IP of the packet.  The original IP is available to the code running on the virtual machine. This preservation allows you to apply logic that is specific to an IP address.

## Build cross region solution on existing Azure Load Balancer
The backend pool of cross-region load balancer contains one or more regional load balancers. 

Add your existing load balancer deployments to a cross-region load balancer for a highly available, cross-region deployment.

**Home region** is where the cross-region load balancer or Public IP Address of Global tier is deployed. 
This region doesn't affect how the traffic will be routed. If a home region goes down, traffic flow is unaffected.

### Home regions
* East US 2
* West US
* West Europe
* Southeast Asia
* Central US
* North Europe
* East Asia

> [!NOTE]
> You can only deploy your cross-region load balancer or Public IP in Global tier in one of the 7 regions above.

A **participating region** is where the Global public IP of the load balancer is available. 

Traffic started by the user will travel to the closest participating region through the Microsoft core network. 

Cross-region load balancer routes the traffic to the appropriate regional load balancer.

### Participating regions
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

* Private or internal load balancer can't be added to the backend pool of a cross-region load balancer 

* Cross-region IPv6 frontend IP configurations aren't supported. 

* A health probe can't be configured currently. A default health probe automatically collects availability information about the regional load balancer every 20 seconds. 

* Integration with Azure Kubernetes Service (AKS) is currently unavailable. Loss of connectivity will occur when deploying a cross-region load balancer with the Standard load balancer with AKS cluster deployed in the backend.

## Pricing and SLA
Cross-region load balancer, shares the [SLA](https://azure.microsoft.com/support/legal/sla/load-balancer/v1_0/ ) of standard load balancer.

 
## Next steps

- See [Tutorial: Create a cross-region load balancer using the Azure portal](tutorial-cross-region-portal.md) to create a cross-region load balancer.
- See [Create a public standard load balancer](quickstart-load-balancer-standard-public-portal.md) to create a standard regional load balancer.
- Learn more about [Azure Load Balancer](load-balancer-overview.md).
