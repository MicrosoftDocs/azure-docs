---
title: Reliability in Azure Virtual Network
description: Find out about reliability in Azure Virtual Network, including availability zones and multi-region deployments.
author: asudbring
ms.author: allensu
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-virtual-network
ms.date: 05/20/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand who needs to understand the details of how Azure Virtual Network works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.

---

# Reliability in Azure Virtual Network

This article describes reliability support in Azure Virtual Network, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

A virtual network is a logical representation of your network in the cloud. You can use a virtual network to define your own private IP address space and segment the network into subnets. Virtual networks serve as a trust boundary to host your compute resources such as Azure Virtual Machines and load balancers. A virtual network enables direct private IP communication between the resources that it hosts. To enable hybrid cloud scenarios and securely extend your datacenter into Azure, you can link a virtual network to an on-premises network through Azure VPN Gateway or Azure ExpressRoute. 

## Production deployment recommendations

As you build your virtual network in Azure, it's important to improve the reliability of your solution by keeping in mind the following universal design principles:

- **Avoid overlapping address spaces.** Ensure that your virtual network address space, defined as a Classless Inter-Domain Routing (CIDR) block, doesn't overlap with your organization's other network ranges.

- **Reserve address space for future growth.** Your subnets shouldn't cover the entire address space of the virtual network. Plan ahead and reserve some address space for the future.

- **Consolidate your networks.** To reduce management overhead, use a few large virtual networks instead of multiple small virtual networks.

- **Secure your networks.** Secure your virtual networks by assigning network security groups (NSGs) to the subnets beneath them.

For more information about how to design your Azure virtual network with reliability principles in mind, see [Architecture best practices for Virtual Network](/azure/well-architected/service-guides/virtual-network).

## Reliability architecture overview

A virtual network is one of several core networking components in Azure. When you create a virtual network, you create a set of resources that collectively define your networking configuration. These resources include the following network components:

- NSGs and application security groups, which restrict communication between parts of your network

- User-defined routes, which control how traffic flows

- Load balancers, which distribute traffic within your network

- Public IP addresses, which provide connectivity to and from the internet

- Network interface cards, which provide network connectivity to Azure virtual machines (VMs)

- Private endpoints, which provide private connectivity to Azure services and to resources outside of your virtual network

You might also deploy *appliances*, such as ExpressRoute gateways, VPN gateways, and firewalls. Appliances provide services to support your networking requirements, such as connecting to on-premises environments or providing sophisticated controls on traffic flow.

Finally, you deploy your own components, like VMs that run applications or databases, and other Azure services that provide virtual network integration.

> [!IMPORTANT]
> This guide focuses on Azure virtual networks, which are only one component in your network architecture.
>
> From a reliability perspective, it's important that you consider each component in your solution individually and how they operate together. Many core Azure networking services provide high resiliency by default. However, you might need to consider how other network appliances, VMs, and other components can support your reliability needs. For more information about how services support reliability, see [Azure service reliability guides](./overview-reliability-guidance.md).

For more information about networking in Azure, see [Networking architecture design](/azure/architecture/networking/).

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Transient faults don't usually affect virtual networks. However, transient faults might affect resources deployed within a virtual network. Review the [reliability guide for each resource](./overview-reliability-guidance.md) that you use to understand their transient fault handling behaviors.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

A virtual network and its subnets span all availability zones within the region where it's deployed. You don't have to configure anything to enable this support.

You don't need to divide your virtual networks or subnets by availability zones to accommodate zonal resources. For example, if you configure a zonal VM, you don't have to consider the virtual network when you select the availability zone for the VM. The same is true for other zonal resources.

### Region support

Zone-redundant virtual networks can be deployed into any [region that supports availability zones](./regions-list.md).

### Cost

There's no extra cost for zone redundancy for Azure virtual networks.

### Configure availability zone support

Zone redundancy is configured automatically when a virtual network is deployed in a region that supports availability zones.

### Zone-down experience

Azure virtual networks are designed to be resilient to zone failures. When a zone becomes unavailable, Virtual Network automatically reroutes virtual network requests to the remaining zones. This process is seamless and doesn't require any action from you.

However, any resources within the virtual network need to be considered individually, because each resource might have a different set of behaviors during the loss of an availability zone. Review the [reliability guide for each resource](./overview-reliability-guidance.md) that you use to understand their availability zone support and behavior when a zone is unavailable.

### Failback

When the zone recovers, Microsoft initiates a failback process to ensure that virtual networks continue to work in the recovered zone. The failback process is automatic and doesn't require any action from you.

However, you should verify the failback behaviors of any resources that you deploy within the virtual network. For more information, see the [reliability guide for each resource](./overview-reliability-guidance.md).

### Testing for zone failures

The Virtual Network platform manages traffic routing, failover, and failback for virtual networks across availability zones. Because this feature is fully managed, you don't need to validate availability zone failure processes.

## Multi-region support

Virtual Network is a single-region service. If the region becomes unavailable, your virtual network is also unavailable.

### Alternative multi-region approaches

You can create virtual networks in multiple regions. You can also choose to connect those networks by *peering* them together.

By creating virtual networks and other resources in multiple regions, you can be resilient to regional outages. However, you need to consider the following factors:

- **Traffic routing:** If you host internet-facing services in the virtual network, you need to decide how to route incoming traffic among your regions and components. With services such as Azure Traffic Manager and Azure Front Door, you can route internet traffic based on rules that you specify.

- **Failover:** If an Azure region is unavailable, you typically need to fail over by processing traffic in healthy regions. Traffic Manager and Azure Front Door provide failover capabilities for internet applications.      

- **Management:** Each virtual network is a separate resource and needs to be configured and managed independently from other virtual networks.

- **IP address space:** Determine how to allocate IP addresses when you create multiple virtual networks. You can create multiple virtual networks by using the same private IP address space in different regions. However, you can't peer, or connect, two virtual networks with the same address space to your on-premises network because it causes routing problems. If you plan to create a multi-network design, IP address planning is an important consideration.

Virtual networks don't require a lot of resources to run. You can invoke Azure APIs to create a virtual network with the same address space in a different region. However, to recreate a similar environment to the one that exists in the affected region, you must redeploy the VMs and other resources. If you have on-premises connectivity, such as in a hybrid deployment, you have to deploy a new VPN Gateway instance and connect to your on-premises network.

For more information about a multi-region networking architecture for web applications, see [Multi-region load balancing with Traffic Manager, Azure Firewall, and Azure Application Gateway](/azure/architecture/high-availability/reference-architecture-traffic-manager-application-gateway).

## Backups

Azure virtual networks don't store any data that requires backup. However, you can use Bicep, Azure Resource Manager templates, or Terraform to take a snapshot of the configuration of a virtual network if you need to recreate it. For more information, see [Create an Azure virtual network](../virtual-network/quickstart-create-virtual-network.md).

## Service-level agreement

Because of the nature of the service provided, there isn't a defined service-level agreement for Virtual Network.

## Related content

- [Availability zones](availability-zones-overview.md)
