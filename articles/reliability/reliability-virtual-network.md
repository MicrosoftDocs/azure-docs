---
title: Reliability in Azure Virtual Network
description: Find out about reliability in Azure Virtual Network, including availability zones and multi-region deployments.
author: asudbring
ms.author: allensu
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-virtual-network
ms.date: 05/20/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand who need to understand the details of how Azure Virtual Network works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations. 

---

# Reliability in Azure Virtual Network

This article describes reliability support in Azure Virtual Network, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Resiliency is a shared responsibility between you and Microsoft and so this article also covers ways for you to create a resilient solution that meets your needs.

A Virtual Network is a logical representation of your network in the cloud. It allows you to define your own private IP address space and segment the network into subnets. Virtual networks serve as a trust boundary to host your compute resources such as Azure Virtual Machines and load balancers. A virtual network allows direct private IP communication between the resources hosted in it. You can link a virtual network to an on-premises network through a VPN Gateway, or ExpressRoute.

## Production deployment recommendations

A virtual network is created within the scope of a region. You can create virtual networks with the same address space in two different regions, but because they have the same address space, you can't connect them together.

Use virtual networks to:

* Create a dedicated, private, cloud-only virtual network. Sometimes you don't require a cross-premises configuration for your solution. When you create a virtual network, your services and virtual machines (VMs) within your virtual network can communicate directly and securely with each other in the cloud. You can still configure endpoint connections for the VMs and services that require internet communication, as part of your solution.

* Securely extend your datacenter. With virtual networks, you can build traditional site-to-site (S2S) VPNs to securely scale your datacenter capacity. S2S VPNs use IPsec to provide a secure connection between your corporate VPN gateway and Azure.

* Enable hybrid cloud scenarios. You can securely connect cloud-based applications to any type of on-premises system, including mainframes and Unix systems.

## Reliability architecture overview

Virtual networks and subnets span all availability zones in a region. You don't need to divide them by availability zones to accommodate zonal resources. For example, if you configure a zonal VM, you don't have to take into consideration the virtual network when selecting the availability zone for the VM. The same is true for other zonal resources.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

When a transient fault occurs, resources within an Azure Virtual Network automatically retry communication attempts. This built-in resiliency ensures that temporary disruptions, such as brief network interruptions or service unavailability, do not result in permanent failures. By leveraging retry logic, resources can recover from transient issues without requiring manual intervention, helping to maintain connectivity and application reliability.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)] 

A virtual network deployed in a region is spanned across availability zones within that region. User intervention isn't required to enable this support.

### Region support 

Azure Virtual Network is available in all Azure regions. Azure Virtual Networks are limited to a single region when deployed.

### Considerations 

If an outage occurs for an entire region, the virtual network and the resources in the affected region remain inaccessible during the time of the service disruption.

### Cost

Region zone redundancy for Azure Virtual Networks doesn't incur a charge.

### Configure availability zone support 

Zone redundancy is configured automatically when a virtual network is deployed in a region.

### Capacity planning and management 

As you build your network in Azure, it's important to keep in mind the following universal design principles:

* Ensure address spaces don't overlap. Make sure your virtual network address space (CIDR block) doesn't overlap with your organization's other network ranges.

* Your subnets shouldn't cover the entire address space of the virtual network. Plan ahead and reserve some address space for the future.

* Use a few large virtual networks instead of multiple small ones to reduce management overhead.

* Secure your virtual networks by assigning Network Security Groups (NSGs) to the subnets beneath them.

### Zone-down experience

Azure virtual networks are designed to be resilient to zone failures. When a zone becomes unavailable, Azure Virtual Network automatically reroutes traffic to the remaining zones. This process is seamless and doesn't require any action from you.

* Any active requests are dropped and should be retried by the client.

* A zone failure isn't expected to cause any data loss.

* A zone failure isn't expected to cause downtime to your resources.

### Failback

When the zone recovers, Microsoft initiates a failback process. The failback process is automatic and doesn't require any action from you.

### Testing for zone failures 

The Azure Virtual Network platform manages traffic routing, failover, and failback for the virtual network. You don't need to initiate anything. Because this feature is fully managed, you don't need to validate availability zone failure processes.

## Multi-region support

Azure Virtual Network is a single-region service. You can create virtual networks in multiple regions, but they are separate resources.

### Region-down experience 
 
The virtual network and the resources in the affected region remains inaccessible during the time of the service disruption.

### Alternative multi-region approaches 

You can create two virtual networks using the same private IP address space and resources in two different regions ahead of time. If you're hosting internet-facing services in the virtual network, you could have set up Traffic Manager to geo-route traffic to the region that is active. However, you can't connect two virtual networks with the same address space to your on-premises network, as it would cause routing issues. At the time of a disaster and loss of a virtual network in one region, you can connect the other virtual network in the available region, with the matching address space to your on-premises network.

Virtual networks are fairly lightweight resources. You can invoke Azure APIs to create a virtual network with the same address space in a different region. To recreate the same environment that was present in the affected region, redeploy the virtual machines and other resources. If you have on-premises connectivity, such as in a hybrid deployment, you have to deploy a new VPN Gateway, and connect to your on-premises network.

## Service-level agreement

There isn't a defined SLA for Azure Virtual Network due to the nature of the service. However, the SLA for the resources that are deployed in a virtual network is defined in the SLA for that resource.

## Related content

[What are availability zones?](/azure/reliability/availability-zones-overview)