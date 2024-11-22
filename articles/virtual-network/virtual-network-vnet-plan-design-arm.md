---
title: Plan Azure virtual networks
description: Learn how to plan for virtual networks based on your isolation, connectivity, and location requirements.
services: virtual-network
author: asudbring
manager: mtillman
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 04/08/2020
ms.author: allensu
---

# Plan virtual networks

Creating a virtual network to experiment with is easy enough, but you're likely to deploy multiple virtual networks over time to support the production needs of your organization. With some planning, you can deploy virtual networks and connect the resources you need more effectively. The information in this article is most helpful if you're already familiar with virtual networks and have some experience working with them. If you aren't familiar with virtual networks, we recommend that you read [Virtual network overview](virtual-networks-overview.md).

## Naming

All Azure resources have a name. The name must be unique within a scope, which might vary for each resource type. For example, the name of a virtual network must be unique within a [resource group](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#resource-group), but you can use a duplicate name within a [subscription](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription) or Azure [region](https://azure.microsoft.com/regions/#services). Defining a naming convention that you can use consistently when you name resources is helpful when you manage several network resources over time. For suggestions, see [Naming conventions](../azure-resource-manager/management/resource-name-rules.md#microsoftnetwork).

## Regions

All Azure resources are created in an Azure region and subscription. You can create a resource only in a virtual network that exists in the same region and subscription as the resource. But you can connect virtual networks that exist in different subscriptions and regions. For more information, see [Connectivity](#connectivity). When you decide which regions in which to deploy resources, consider where consumers of the resources are physically located:

- Do you have low network latency? Consumers of resources typically want the lowest network latency to their resources. To determine relative latencies between a specified location and Azure regions, see [View relative latencies](../network-watcher/view-relative-latencies.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
- Do you have data residency, sovereignty, compliance, or resiliency requirements? If so, choosing the region that aligns to the requirements is critical. For more information, see [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/).
- Do you require resiliency across Azure availability zones within the same Azure region for the resources you deploy? You can deploy resources, such as virtual machines (VMs), to different availability zones within the same virtual network. Not all Azure regions support availability zones. To learn more about availability zones and the regions that support them, see [Availability zones](../reliability/availability-zones-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

## Subscriptions

You can deploy as many virtual networks as required within each subscription, up to the [limit](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#networking-limits). Some organizations have different subscriptions for different departments, for example. For more information and considerations around subscriptions, see [Subscription governance](/azure/cloud-adoption-framework/reference/migration-with-enterprise-scaffold#define-your-hierarchy).

## Segmentation

You can create multiple virtual networks per subscription and per region. You can create multiple subnets within each virtual network. The following considerations help you determine how many virtual networks and subnets you require.

### Virtual networks

A virtual network is a virtual, isolated portion of the Azure public network. Each virtual network is dedicated to your subscription. When you decide whether to create one virtual network or multiple virtual networks in a subscription, consider the following points:

- Do any organizational security requirements exist for isolating traffic into separate virtual networks? You can choose to connect virtual networks or not. If you connect virtual networks, you can implement a network virtual appliance, such as a firewall, to control the flow of traffic between the virtual networks. For more information, see [Security](#security) and [Connectivity](#connectivity).
- Do any organizational requirements exist for isolating virtual networks into separate [subscriptions](#subscriptions) or [regions](#regions)?
- Do you have [network interface](virtual-network-network-interface.md) requirements? A network interface enables a VM to communicate with other resources. Each network interface has one or more private IP addresses assigned to it. How many network interfaces and [private IP addresses](./ip-services/private-ip-addresses.md) do you require in a virtual network? There are [limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#networking-limits) to the number of network interfaces and private IP addresses that you can have within a virtual network.
- Do you want to connect the virtual network to another virtual network or on-premises network? You might decide to connect some virtual networks to each other or on-premises networks, but not to others. For more information, see [Connectivity](#connectivity). Each virtual network that you connect to another virtual network or on-premises network must have a unique address space. Each virtual network has one or more public or private address ranges assigned to its address space. An address range is specified in classless internet domain routing (CIDR) format, such as 10.0.0.0/16. Learn more about [address ranges](manage-virtual-network.yml#add-or-remove-an-address-range) for virtual networks.
- Do you have any organizational administration requirements for resources in different virtual networks? If so, you might separate resources into separate virtual networks to simplify [permission assignment](#permissions) to individuals in your organization or to assign different policies to different virtual networks.
- Do you have requirements for resources that can create their own virtual network? When you deploy some Azure service resources into a virtual network, they create their own virtual network. To determine whether an Azure service creates its own virtual network, see information for each [Azure service that you can deploy into a virtual network](virtual-network-for-azure-services.md#services-that-can-be-deployed-into-a-virtual-network).

### Subnets

You can segment a virtual network into one or more subnets up to the [limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#networking-limits). When you decide whether to create one subnet or multiple virtual networks in a subscription, consider the following points:

- Have a unique address range for each subnet, specified in CIDR format, within the address space of the virtual network. The address range can't overlap with other subnets in the virtual network.
- Be aware that if you plan to deploy some Azure service resources into a virtual network, they might require, or create, their own subnet. There must be enough unallocated space for them to do so. To determine whether an Azure service creates its own subnet, see information for each [Azure service that you can deploy into a virtual network](virtual-network-for-azure-services.md#services-that-can-be-deployed-into-a-virtual-network). For example, if you connect a virtual network to an on-premises network by using an Azure VPN gateway, the virtual network must have a dedicated subnet for the gateway. Learn more about [gateway subnets](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md?toc=%2fazure%2fvirtual-network%2ftoc.json#gwsub).
- Override default routing for network traffic between all subnets in a virtual network. You want to prevent Azure routing between subnets or to route traffic between subnets through a network virtual appliance, for example. If you require that traffic between resources in the same virtual network flows through a network virtual appliance (NVA), deploy the resources to different subnets. Learn more in [Security](#security).
- Limit access to Azure resources, such as an Azure Storage account or Azure SQL Database, to specific subnets with a virtual network service endpoint. You can also deny access to the resources from the internet. You can create multiple subnets and enable a service endpoint for some subnets, but not others. Learn more about [service endpoints](virtual-network-service-endpoints-overview.md) and the Azure resources for which you can enable them.
- Associate zero or one network security group to each subnet in a virtual network. You can associate the same, or a different, network security group to each subnet. Each network security group contains rules, which allow or deny traffic to and from sources and destinations. Learn more about [network security groups](#traffic-filtering).

## Security

You can filter network traffic to and from resources in a virtual network by using network security groups and network virtual appliances. You can control how Azure routes traffic from subnets. You can also limit who in your organization can work with resources in virtual networks.

### Traffic filtering

- To filter network traffic between resources in a virtual network, use a network security group, an NVA that filters network traffic, or both. To deploy an NVA, such as a firewall, to filter network traffic, see [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking?subcategories=appliances&page=1). When you use an NVA, you also create custom routes to route traffic from subnets to the NVA. Learn more about [traffic routing](#traffic-routing).
- A network security group contains several default security rules that allow or deny traffic to or from resources. You can associate a network security group to a network interface, the subnet the network interface is in, or both. To simplify management of security rules, we recommend that you associate a network security group to individual subnets rather than individual network interfaces within the subnet whenever possible.
- If different VMs within a subnet need different security rules applied to them, you can associate the network interface in the VM to one or more application security groups. A security rule can specify an application security group in its source, destination, or both. That rule then applies only to the network interfaces that are members of the application security group. Learn more about [network security groups](./network-security-groups-overview.md) and [application security groups](./network-security-groups-overview.md#application-security-groups).
- When a network security group is associated at the subnet level, it applies to all the network interface controllers in the subnet, not just to the traffic coming from outside the subnet. The traffic between the VMs contained in the subnet might also be affected.
- Azure creates several default security rules within each network security group. One default rule allows all traffic to flow between all resources in a virtual network. To override this behavior, use network security groups, custom routing to route traffic to an NVA, or both. We recommend that you familiarize yourself with all the Azure [default security rules](./network-security-groups-overview.md#default-security-rules) and understand how network security group rules are applied to a resource.

You can view sample designs for implementing a perimeter network (also known as a DMZ) between Azure and the internet by using an [NVA](/azure/architecture/reference-architectures/dmz/secure-vnet-dmz?toc=%2Fazure%2Fvirtual-network%2Ftoc.json).

### Traffic routing

Azure creates several default routes for outbound traffic from a subnet. You can override the Azure default routing by creating a route table and associating it to a subnet. Common reasons for overriding the Azure default routing are:

- You want traffic between subnets to flow through an NVA. Learn more about how to [configure route tables to force traffic through an NVA](tutorial-create-route-table-portal.md).
- You want to force all internet-bound traffic through an NVA, or on-premises, through an Azure VPN gateway. Forcing internet traffic on-premises for inspection and logging is often referred to as forced tunneling. Learn more about how to configure [forced tunneling](../vpn-gateway/vpn-gateway-forced-tunneling-rm.md?toc=%2Fazure%2Fvirtual-network%2Ftoc.json).

If you need to implement custom routing, we recommend that you familiarize yourself with [routing in Azure](virtual-networks-udr-overview.md).

## Connectivity

You can connect a virtual network to other virtual networks by using virtual network peering, or to your on-premises network, by using an Azure VPN gateway.

### Peering

When you use [virtual network peering](virtual-network-peering-overview.md), you can have virtual networks in the same or different supported Azure regions. You can have virtual networks in the same or different Azure subscriptions (even subscriptions that belong to different Microsoft Entra tenants).

Before you create a peering, we recommend that you familiarize yourself with all the peering [requirements and constraints](virtual-network-manage-peering.md#requirements-and-constraints). Bandwidth between resources in virtual networks peered in the same region is the same as if the resources were in the same virtual network.

### VPN gateway

You can use an Azure [VPN gateway](../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md?toc=%2fazure%2fvirtual-network%2ftoc.json) to connect a virtual network to your on-premises network by using a [site-to-site VPN](../vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or a dedicated connection with Azure [ExpressRoute](../expressroute/expressroute-introduction.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

You can combine peering and a VPN gateway to create [hub-and-spoke networks](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?toc=%2fazure%2fvirtual-network%2ftoc.json), where spoke virtual networks connect to a hub virtual network and the hub connects to an on-premises network, for example.

### Name resolution

Resources in one virtual network can't resolve the names of resources in a peered virtual network by using the Azure [built-in Domain Name System (DNS)](virtual-networks-name-resolution-for-vms-and-role-instances.md). To resolve names in a peered virtual network, [deploy your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) or use Azure DNS [private domains](../dns/private-dns-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json). Resolving names between resources in a virtual network and on-premises networks also requires you to deploy your own DNS server.

## Permissions

Azure uses [Azure role-based access control](../role-based-access-control/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json). Permissions are assigned to a [scope](../role-based-access-control/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#scope) in the hierarchy of management group, subscription, resource group, and individual resource. To learn more about the hierarchy, see [Organize your resources](../governance/management-groups/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

To work with Azure virtual networks and all of their related capabilities, such as peering, network security groups, service endpoints, and route tables, assign members of your organization to the built-in [Owner](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#owner), [Contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#contributor), or [Network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) roles. Then assign the role to the appropriate scope. If you want to assign specific permissions for a subset of virtual network capabilities, create a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and assign the specific permissions required for:

- [Virtual networks](manage-virtual-network.yml#permissions)
- [Subnets and service endpoints](virtual-network-manage-subnet.md#permissions)
- [Network interfaces](virtual-network-network-interface.md#permissions)
- [Peering](virtual-network-manage-peering.md#permissions)
- [Network and application security groups](manage-network-security-group.md#permissions)
- [Route tables](manage-route-table.yml#permissions)

## Policy

With Azure Policy, you can create, assign, and manage policy definitions. Policy definitions enforce different rules over your resources, so the resources stay compliant with your organizational standards and service level agreements. Azure Policy runs an evaluation of your resources. It scans for resources that aren't compliant with the policy definitions you have.

For example, you can define and apply a policy that allows creation of virtual networks in only a specific resource group or region. Another policy can require that every subnet has a network security group associated to it. The policies are then evaluated when you create and update resources.

Policies are applied to the following hierarchy: management group, subscription, and resource group. Learn more about [Azure Policy](../governance/policy/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or deploy some virtual network [Azure Policy definitions](./policy-reference.md).

## Related content

Learn about all tasks, settings, and options for a:

- [Virtual network](manage-virtual-network.yml)
- [Subnet and service endpoint](virtual-network-manage-subnet.md)
- [Network interface](virtual-network-network-interface.md)
- [Peering](virtual-network-manage-peering.md) 
- [Network and application security group](manage-network-security-group.md)
- [Route table](manage-route-table.yml)
