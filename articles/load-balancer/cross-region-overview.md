---
title: Cross-region load balancer
titleSuffix: Azure Load Balancer
description: Overview of cross region load balancer tier for Azure Load Balancer.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: concept-article
ms.date: 06/26/2024
ms.author: mbender
ms.custom: references_regions
---

# Global Load Balancer

Azure Standard Load Balancer supports cross-region load balancing enabling geo-redundant high availability scenarios such as:

* Incoming traffic originating from multiple regions.
* [Instant global failover](#regional-redundancy) to the next optimal regional deployment.
* Load distribution across regions to the closest Azure region with [ultra-low latency](#ultra-low-latency).
* Ability to [scale up/down](#ability-to-scale-updown-behind-a-single-endpoint) behind a single endpoint.
* Static anycast global IP address
* [Client IP preservation](#client-ip-preservation)
* [Build on existing load balancer](#build-cross-region-solution-on-existing-azure-load-balancer) solution with no learning curve

The frontend IP configuration of your global load balancer is static and advertised across [most Azure regions](#participating-regions-in-azure).

:::image type="content" source="./media/cross-region-overview/cross-region-load-balancer.png" alt-text="Diagram of global load balancer." border="true":::

> [!NOTE]
> The backend port of your load balancing rule on global load balancer should match the frontend port of the load balancing rule/inbound nat rule on regional standard load balancer. 

### Regional redundancy

Configure regional redundancy by seamlessly linking a global load balancer to your existing regional load balancers. 

If one region fails, the traffic is routed to the next closest healthy regional load balancer.  

The health probe of the global load balancer gathers information about availability of each regional load balancer every 5 seconds. If one regional load balancer drops its availability to 0, global load balancer detects the failure. The regional load balancer is then taken out of rotation. 

:::image type="content" source="./media/cross-region-overview/global-region-view.png" alt-text="Diagram of global region traffic view." border="true":::

### Ultra-low latency

The geo-proximity load-balancing algorithm is based on the geographic location of your users and your regional deployments. 

Traffic started from a client hits the closest participating region and travel through the Microsoft global network backbone to arrive at the closest regional deployment. 

For example, you have a global load balancer with standard load balancers in Azure regions:

* West US
* North Europe

If a flow is started from Seattle, traffic enters West US. This region is the closest participating region from Seattle. The traffic is routed to the closest region load balancer, which is West US.

Azure global load balancer uses geo-proximity load-balancing algorithm for the routing decision. 

The configured load distribution mode of the regional load balancers is used for making the final routing decision when multiple regional load balancers are used for geo-proximity.  

For more information, see [Configure the distribution mode for Azure Load Balancer](./load-balancer-distribution-mode.md).

Egress traffic follows the routing preference set on the regional load balancers.

### Ability to scale up/down behind a single endpoint

When you expose the global endpoint of a global load balancer to customers, you can add or remove regional deployments behind the global endpoint without interruption. 

<!---To learn about how to add or remove a regional deployment from the backend, read more [here](TODO: Insert CLI doc here).--->

### Static anycast global IP address

Global load balancer comes with a static public IP, which ensures the IP address remains the same. Both IPv4 and IPv6 configurations are supported. To learn more about static IP, read more [here.](../virtual-network/ip-services/public-ip-addresses.md#ip-address-assignment)

### Client IP Preservation

Global load balancer is a Layer-4 pass-through network load balancer. This pass-through preserves the original IP of the packet.  The original IP is available to the code running on the virtual machine. This preservation allows you to apply logic that is specific to an IP address.

### Floating IP

Floating IP can be configured at both the global IP level and regional IP level. For more information, visit [Multiple frontends for Azure Load Balancer.](./load-balancer-multivip-overview.md)

It's important to note that floating IP configured on the Azure global Load Balancer operates independently of floating IP configurations on backend regional load balancers. If floating IP is enabled on the global load balancer, the appropriate loopback interface needs to be added to the backend VMs. 

### Health Probes

Azure global Load Balancer utilizes the health of the backend regional load balancers when deciding where to distribute traffic to. Health checks by global load balancer are done automatically every 5 seconds, given that health probes are set up on their regional load balancer.  

## Build cross region solution on existing Azure Load Balancer

The backend pool of global load balancer contains one or more regional load balancers. 

Add your existing load balancer deployments to a global load balancer for a highly available, global deployment.

### Home regions and participating regions

**Home region** is where the global load balancer or Public IP Address of Global tier is deployed. 
This region doesn't affect how the traffic is routed. If a home region goes down, traffic flow is unaffected.

#### Home regions in Azure
* Central US
* East Asia
* East US 2
* North Europe
* Southeast Asia
* UK South
* US Gov Virginia
* West Europe
* West US
* China North 2

> [!NOTE]
> You can only deploy your global load balancer or Public IP in Global tier in one of the listed Home regions.

A **participating region** is where the Global public IP of the load balancer is being advertised.

Traffic started by the user travels to the closest participating region through the Microsoft core network. 

Global load balancer routes the traffic to the appropriate regional load balancer.

:::image type="content" source="./media/cross-region-overview/multiple-region-global-traffic.png" alt-text="Diagram of multiple region global traffic.":::

#### Participating regions in Azure

* Australia East 
* Australia Southeast 
* Central India 
* Central US 
* East Asia 
* East US 
* East US 2 
* Japan East 
* North Central US 
* North Europe 
* South Central US 
* Southeast Asia 
* UK South 
* US DoD Central
* US DoD East
* US Gov Arizona
* US Gov Texas
* US Gov Virginia
* West Central US 
* West Europe 
* West US 
* West US 2 

> [!NOTE]
> The backend regional load balancers can be deployed in any publicly available Azure Region and is not limited to just participating regions.

## Limitations of global load balancer

* Global frontend IP configurations are public only. An internal frontend is currently not supported.

* Private or internal load balancer can't be added to the backend pool of a global load balancer 

* NAT64 translation isn't supported at this time. The frontend and backend IPs must be of the same type (v4 or v6).

* UDP traffic on port 3 isn't supported on global load balancer

* Outbound rules aren't supported on global load balancer. For outbound connections, utilize [outbound rules](./outbound-rules.md) on the regional load balancer or [NAT gateway](../nat-gateway/nat-overview.md).

* Regional load balancers can't be upgraded to the global tier. Only new load balancers can be created as the global tier. 

## Pricing and SLA
Global load balancer shares the [SLA](https://azure.microsoft.com/support/legal/sla/load-balancer/v1_0/) of standard load balancer.

 ## Next steps

- See [Tutorial: Create a global load balancer using the Azure portal](tutorial-cross-region-portal.md) to create a global load balancer.
- Learn more about [global load balancer](https://www.youtube.com/watch?v=3awUwUIv950).
- Learn more about [Azure Load Balancer](load-balancer-overview.md).
