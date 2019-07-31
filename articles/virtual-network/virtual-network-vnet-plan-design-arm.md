---
title: Plan Azure virtual networks | Microsoft Docs
description: Learn how to plan for virtual networks based on your isolation, connectivity, and location requirements.
services: virtual-network
documentationcenter: na
author: KumudD
manager: twooley
editor: ''

ms.assetid: 3a4a9aea-7608-4d2e-bb3c-40de2e537200
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/16/2018
ms.author: kumud

---
# Plan virtual networks

Creating a virtual network to experiment with is easy enough, but chances are, you will deploy multiple virtual networks over time to support the production needs of your organization. With some planning, you will be able to deploy virtual networks and connect the resources you need more effectively. The information in this article is most helpful if you're already familiar with virtual networks and have some experience working with them. If you are not familiar with virtual networks, it's recommended that you read [Virtual network overview](virtual-networks-overview.md).

## Naming

All Azure resources have a name. The name must be unique within a scope, that may vary for each resource type. For example, the name of a virtual network must be unique within a [resource group](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#resource-group), but can be duplicated within a [subscription](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription) or Azure [region](https://azure.microsoft.com/regions/#services). Defining a naming convention that you can use consistently when naming resources is helpful when managing several network resources over time. For suggestions, see [Naming conventions](/azure/architecture/best-practices/naming-conventions?toc=%2fazure%2fvirtual-network%2ftoc.json#networking).

## Regions

All Azure resources are created in an Azure region and subscription. A resource can only be created in a virtual network that exists in the same region and subscription as the resource. You can however, connect virtual networks that exist in different subscriptions and regions. For more information, see [connectivity](#connectivity). When deciding which region(s) to deploy resources in, consider where consumers of the resources are physically located:

- Consumers of resources typically want the lowest network latency to their resources. To determine relative latencies between a specified location and Azure regions, see [View relative latencies](../network-watcher/view-relative-latencies.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
- Do you have data residency, sovereignty, compliance, or resiliency requirements? If so, choosing the region that aligns to the requirements is critical. For more information, see [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/).
- Do you require resiliency across Azure Availability Zones within the same Azure region for the resources you deploy? You can deploy resources, such as virtual machines (VM) to different availability zones within the same virtual network. Not all Azure regions support availability zones however. To learn more about availability zones and the regions that support them, see [Availability zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

## Subscriptions

You can deploy as many virtual networks as required within each subscription, up to the [limit](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#networking-limits). Some organizations have different subscriptions for different departments, for example. For more information and considerations around subscriptions, see [Subscription governance](/azure/architecture/cloud-adoption-guide/subscription-governance#define-your-hierarchy).

## Segmentation

You can create multiple virtual networks per subscription and per region. You can create multiple subnets within each virtual network. The considerations that follow help you determine how many virtual networks and subnets you require:

### Virtual networks

A virtual network is a virtual, isolated portion of the Azure public network. Each virtual network is dedicated to your subscription. Things to consider when deciding whether to create one virtual network, or multiple virtual networks in a subscription:

- Do any organizational security requirements exist for isolating traffic into separate virtual networks? You can choose to connect virtual networks or not. If you connect virtual networks, you can implement a network virtual appliance, such as a firewall, to control the flow of traffic between the virtual networks. For more information, see [security](#security) and [connectivity](#connectivity).
- Do any organizational requirements exist for isolating virtual networks into separate [subscriptions](#subscriptions) or [regions](#regions)?
- A [network interface](virtual-network-network-interface.md) enables a VM to communicate with other resources. Each network interface has one or more private IP addresses assigned to it. How many network interfaces and [private IP addresses](virtual-network-ip-addresses-overview-arm.md#private-ip-addresses) do you require in a virtual network? There are [limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#networking-limits) to the number of network interfaces and private IP addresses that you can have within a virtual network.
- Do you want to connect the virtual network to another virtual network or on-premises network? You may choose to connect some virtual networks to each other or on-premises networks, but not others. For more information, see [connectivity](#connectivity). Each virtual network that you connect to another virtual network, or on-premises network, must have a unique address space. Each virtual network has one or more public or private address ranges assigned to its address space. An address range is specified in classless internet domain routing (CIDR) format, such as 10.0.0.0/16. Learn more about [address ranges](manage-virtual-network.md#add-or-remove-an-address-range) for virtual networks.
- Do you have any organizational administration requirements for resources in different virtual networks? If so, you might separate resources into separate virtual network to simplify [permission assignment](#permissions) to individuals in your organization or to assign different policies to different virtual networks.
- When you deploy some Azure service resources into a virtual network, they create their own virtual network. To determine whether an Azure service creates its own virtual network, see information for each [Azure service that can be deployed into a virtual network](virtual-network-for-azure-services.md#services-that-can-be-deployed-into-a-virtual-network).

### Subnets

A virtual network can be segmented into one or more subnets up to the [limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#networking-limits). Things to consider when deciding whether to create one subnet, or multiple virtual networks in a subscription:

- Each subnet must have a unique address range, specified in CIDR format, within the address space of the virtual network. The address range cannot overlap with other subnets in the virtual network.
- If you plan to deploy some Azure service resources into a virtual network, they may require, or create, their own subnet, so there must be enough unallocated space for them to do so. To determine whether an Azure service creates its own subnet, see information for each [Azure service that can be deployed into a virtual network](virtual-network-for-azure-services.md#services-that-can-be-deployed-into-a-virtual-network). For example, if you connect a virtual network to an on-premises network using an Azure VPN Gateway, the virtual network must have a dedicated subnet for the gateway. Learn more about [gateway subnets](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md?toc=%2fazure%2fvirtual-network%2ftoc.json#gwsub).
- Azure routes network traffic between all subnets in a virtual network, by default. You can override Azure's default routing to prevent Azure routing between subnets, or to route traffic between subnets through a network virtual appliance, for example. If you require that traffic between resources in the same virtual network flow through a network virtual appliance (NVA), deploy the resources to different subnets. Learn more in [security](#security).
- You can limit access to Azure resources such as an Azure storage account or Azure SQL database, to specific subnets with a virtual network service endpoint. Further, you can deny access to the resources from the internet. You may create multiple subnets, and enable a service endpoint for some subnets, but not others. Learn more about [service endpoints](virtual-network-service-endpoints-overview.md), and the Azure resources you can enable them for.
- You can associate zero or one network security group to each subnet in a virtual network. You can associate the same, or a different, network security group to each subnet. Each network security group contains rules, which allow or deny traffic to and from sources and destinations. Learn more about [network security groups](#traffic-filtering).

## Security

You can filter network traffic to and from resources in a virtual network using network security groups and network virtual appliances. You can control how Azure routes traffic from subnets. You can also limit who in your organization can work with resources in virtual networks.

### Traffic filtering

- You can filter network traffic between resources in a virtual network using a network security group, an NVA that filters network traffic, or both. To deploy an NVA, such as a firewall, to filter network traffic, see the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking?subcategories=appliances&page=1). When using an NVA, you also create custom routes to route traffic from subnets to the NVA. Learn more about [traffic routing](#traffic-routing).
- A network security group contains several default security rules that allow or deny traffic to or from resources. A network security group can be associated to a network interface, the subnet the network interface is in, or both. To simplify management of security rules, it's recommended that you associate a network security group to individual subnets, rather than individual network interfaces within the subnet, whenever possible.
- If different VMs within a subnet need different security rules applied to them, you can associate the network interface in the VM to one or more application security groups. A security rule can specify an application security group in its source, destination, or both. That rule then only applies to the network interfaces that are members of the application security group. Learn more about [network security groups](security-overview.md) and [application security groups](security-overview.md#application-security-groups).
- Azure creates several default security rules within each network security group. One default rule allows all traffic to flow between all resources in a virtual network. To override this behavior, use network security groups, custom routing to route traffic to an NVA, or both. It's recommended that you familiarize yourself with all of Azure's [default security rules](security-overview.md#default-security-rules) and understand how network security group rules are applied to a resource.

You can view sample designs for implementing a perimeter network (also known as a DMZ) between Azure and the internet using an [NVA](/azure/architecture/reference-architectures/dmz/secure-vnet-dmz?toc=%2Fazure%2Fvirtual-network%2Ftoc.json).

### Traffic routing

Azure creates several default routes for outbound traffic from a subnet. You can override Azure's default routing by creating a route table and associating it to a subnet. Common reasons for overriding Azure's default routing are:
- Because you want traffic between subnets to flow through an NVA. To learn more about how to [configure route tables to force traffic through an NVA](tutorial-create-route-table-portal.md).
- Because you want to force all internet-bound traffic through an NVA, or on-premises, through an Azure VPN gateway. Forcing internet traffic on-premises for inspection and logging is often referred to as forced tunneling. Learn more about how to configure [forced tunneling](../vpn-gateway/vpn-gateway-forced-tunneling-rm.md?toc=%2Fazure%2Fvirtual-network%2Ftoc.json).

If you need to implement custom routing, it's recommended that you familiarize yourself with [routing in Azure](virtual-networks-udr-overview.md).

## Connectivity

You can connect a virtual network to other virtual networks using virtual network peering, or to your on-premises network, using an Azure VPN gateway.

### Peering

When using [virtual network peering](virtual-network-peering-overview.md), the virtual networks can be in the same, or different, supported Azure regions. The virtual networks can be in the same or different Azure subscriptions (even subscriptions belonging to different Azure Active Directory tenants). Before creating a peering, it's recommended that you familiarize yourself with all of the peering [requirements and constraints](virtual-network-manage-peering.md#requirements-and-constraints). Bandwidth between resources in virtual networks peered in the same region is the same as if the resources were in the same virtual network.

### VPN gateway

You can use an Azure [VPN Gateway](../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md?toc=%2fazure%2fvirtual-network%2ftoc.json) to connect a virtual network to your on-premises network using a [site-to-site VPN](../vpn-gateway/vpn-gateway-tutorial-vpnconnection-powershell.md?toc=%2fazure%2fvirtual-network%2ftoc.json), or using a dedicated connection with Azure [ExpressRoute](../expressroute/expressroute-introduction.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

You can combine peering and a VPN gateway to create [hub and spoke networks](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?toc=%2fazure%2fvirtual-network%2ftoc.json), where spoke virtual networks connect to a hub virtual network, and the hub connects to an on-premises network, for example.

### Name resolution

Resources in one virtual network cannot resolve the names of resources in a peered virtual network using Azure's [built-in DNS](virtual-networks-name-resolution-for-vms-and-role-instances.md). To resolve names in a peered virtual network, [deploy your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server), or use Azure DNS [private domains](../dns/private-dns-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json). Resolving names between resources in a virtual network and on-premises networks also requires you to deploy your own DNS server.

## Permissions

Azure utilizes [role based access control](../role-based-access-control/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) (RBAC) to resources. Permissions are assigned to a [scope](../role-based-access-control/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#scope) in the following hierarchy: Subscription, management group, resource group, and individual resource. To learn more about the hierarchy, see [Organize your resources](../azure-resource-manager/management-groups-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json). To work with Azure virtual networks and all of their related capabilities such as peering, network security groups, service endpoints, and route tables, you can assign members of your organization to the built-in [Owner](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#owner), [Contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#contributor), or [Network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) roles, and then assign the role to the appropriate scope. If you want to assign specific permissions for a subset of virtual network capabilities, create a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and assign the specific permissions required for [virtual networks](manage-virtual-network.md#permissions), [subnets and service endpoints](virtual-network-manage-subnet.md#permissions), [network interfaces](virtual-network-network-interface.md#permissions), [peering](virtual-network-manage-peering.md#permissions), [network and application security groups](manage-network-security-group.md#permissions), or [route tables](manage-route-table.md#permissions) to the role.

## Policy

Azure Policy enables you to create, assign, and manage policy definitions. Policy definitions enforce different rules over your resources, so the resources stay compliant with your organizational standards and service level agreements. Azure Policy runs an evaluation of your resources, scanning for resources that are not compliant with the policy definitions you have. For example, you can define and apply a policy that allows creation of virtual networks in only a specific resource group or region. Another policy can require that every subnet has a network security group associated to it. The policies are then evaluated when creating and updating resources.

Policies are applied to the following hierarchy: Subscription, management group, and resource group. Learn more about [Azure policy](../governance/policy/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or deploy some virtual network [policy template](policy-samples.md) samples.

## Next steps

Learn about all tasks, settings, and options for a [virtual network](manage-virtual-network.md), [subnet and service endpoint](virtual-network-manage-subnet.md), [network interface](virtual-network-network-interface.md), [peering](virtual-network-manage-peering.md),  [network and application security group](manage-network-security-group.md), or [route table](manage-route-table.md).
