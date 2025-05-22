---
title: Reliability in Azure Virtual Network
description: Find out about reliability in Azure Virtual Network, including availability zones and multi-region deployments.
author: asudbring
ms.author: allensu
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-virtual-network
ms.date: 05/20/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand who need to understand the details of how Azure Virtual Network works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Virtual Network

This article describes reliability support in Azure Virtual Network, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

A virtual network is a logical representation of your network in the cloud. With a virtual network, you can define your own private IP address space and segment the network into subnets. Virtual networks serve as a trust boundary to host your compute resources such as Azure Virtual Machines and load balancers. A virtual network allows direct private IP communication between the resources that are hosted in it.  To enable hybrid cloud scenarios and securely extend your datacenter into Azure, you can link a virtual network to an on-premises network through a VPN Gateway or ExpressRoute, 

## Production deployment recommendations

As you build your virtual network in Azure, it's important to improve the reliability of your solution, by keeping in mind the following universal design principles:

- Ensure address spaces don't overlap. Make sure your virtual network address space (CIDR block) doesn't overlap with your organization's other network ranges.
- Your subnets shouldn't cover the entire address space of the virtual network. Plan ahead and reserve some address space for the future.
- To reduce management overhead, use a few large virtual networks instead of multiple small ones.
- Secure your virtual networks by assigning Network Security Groups (NSGs) to the subnets beneath them.

To learn more about how to design your Azure virtual network with reliability principles in mind, as well as other important best practices, see [Architecture best practices for Azure Virtual Network](/azure/well-architected/service-guides/virtual-network).

## Reliability architecture overview

A virtual network is one of several core networking components in Azure. When you create a virtual network, you create a set of resources that collectively define your networking configuration. These resources include:

- Network security groups (NSGs) and application security groups (ASGs), which restrict communication between parts of your network.
- User-defined routes, which control how traffic flows.
- Load balancers, which distribute traffic within your network.
- Public IP addresses, which provide connectivity to and from the internet.
- Network interface cards (NICs), which provide network connectivity to Azure virtual machines.
- Private endpoints, which provide private connectivity to Azure services and to resources outside of your own virtual network.

You might also deploy *appliances*, such as ExpressRoute gateways, VPN gateways, and firewalls. Appliances provide services to support your networking requirements, such as connecting to on-premises environments or providing sophisticated controls on traffic flow.

Finally, you deploy your own components, like virtual machines that run applications or databases, as well as other Azure services that provide virtual network integration.

> [!IMPORTANT]
> This guide focuses on Azure virtual networks, which are just one component in your network architecture.
>
> From a reliability perspective, it's important that you consider each component in your solution individually as well as how they behave together. Many core Azure networking services provide high resiliency by default, but you might need to consider how other network appliances, virtual machines, and other components can support your reliability needs. Review the [reliability guides for each Azure service](./overview-reliability-guidance.md) you use to understand how that service supports reliability.

To learn more about networking in Azure, see [Networking architecture design](/azure/architecture/networking/).

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Virtual networks themselves aren't usually affected by transient faults. However, transient faults might affect resources deployed within a virtual network. Review the [reliability guide for each resource](./overview-reliability-guidance.md) you use to understand their transient fault handling behaviors.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

A virtual network, as well as the subnets within that virtual network, spans across all availability zones within the region in which it's deployed. You do not have to configure anything to enable this support.
You don't need to divide your virtual networks or subnets by availability zones to accommodate zonal resources. For example, if you configure a zonal VM, you don't have to take into consideration the virtual network when selecting the availability zone for the VM. The same is true for other zonal resources.

### Region support

Zone-redundant virtual networks can be deployed in [any region that supports availability zones](./regions-list.md).

### Cost

There is no extra cost for zone redundancy for Azure Virtual Networks.

### Configure availability zone support

Zone redundancy is configured automatically when a virtual network is deployed in a region that supports availability zones.

### Zone-down experience

Azure virtual networks are designed to be resilient to zone failures. When a zone becomes unavailable, Azure Virtual Network automatically reroutes virtual network requests to the remaining zones. This process is seamless and doesn't require any action from you.

However, any resources within the virtual network need to be considered individually, because each resource might have a different set of behaviors during the loss of an availability zone. Consult the [reliability guide for each resource(./overview-reliability-guidance.md) you use to understand their availability zone support and behavior when a zone is unavailable.

### Failback

When the zone recovers, Microsoft initiates a failback process to ensure that virtual networks continue to work in the recovered zone. The failback process is automatic and doesn't require any action from you.

However, you should verify the failback behaviors of any resources you deploy within the virtual network. For more information, consult the [reliability guide for each resource(./overview-reliability-guidance.md).

### Testing for zone failures

The Azure Virtual Network platform manages traffic routing, failover, and failback for virtual networks across availability zones.  Because this feature is fully managed, you don't need to validate availability zone failure processes.

## Multi-region support

Azure Virtual Network is a single-region service. If the region becomes unavailable, your virtual network is also unavailable.

### Alternative multi-region approaches

You can create virtual networks in multiple regions. You can also choose to connect those networks by *peering* them together.

By creating virtual networks and other resources in multiple regions, you can be resilient to regional outages. However, you need to consider many factors, including:

- **Traffic routing:** If you host internet-facing services in the virtual network, you need to decide how to route incoming traffic among your regions and components. With services such as Azure Traffic Manager and Azure Front Door, you can route internet traffic based on rules you specify.

- **Failover:** If an Azure region is unavailable, you typically need to *fail over* by processing traffic in healthy regions. Azure Traffic Manager and Azure Front Door provide failover capabilities for internet applications.      

- **Management:** Each virtual network is a separate resource and needs to be configured and managed independently from other virtual networks.

- **IP address space:** You need to decide how to allocate IP addresses when you create multiple virtual networks. You can create multiple virtual networks using the same private IP address space in different regions. However, you can't peer (connect) two virtual networks with the same address space to your on-premises network, as it would cause routing issues. If you plan to create a multi-network design, IP address planning is an important consideration.

Virtual networks are fairly lightweight resources. You can invoke Azure APIs to create a virtual network with the same address space in a different region. However, to recreate the same environment that was present in the affected region, you must redeploy the virtual machines and other resources. If you have on-premises connectivity, such as in a hybrid deployment, you have to deploy a new VPN Gateway, and connect to your on-premises network.

For an example of a multi-region networking architecture for web applications, see [Multi-region load balancing with Traffic Manager, Azure Firewall, and Application Gateway](/azure/architecture/high-availability/reference-architecture-traffic-manager-application-gateway).

## Service-level agreement

Due to the nature of the service provided, there isn't a defined SLA for Azure Virtual Network.

## Related content

[What are availability zones?](/azure/reliability/availability-zones-overview)
