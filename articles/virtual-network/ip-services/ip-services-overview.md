---
title: What is Azure Virtual Network IP Services?
description: Overview of Azure Virtual Network IP Services. Learn how IP services work and how to use IP resources in Azure.
author: mbender-ms
ms.author: mbender
ms.date: 08/24/2023
ms.service: virtual-network
ms.subService: ip-services
ms.topic: overview
ms.custom: template-overview
---

# What is Azure Virtual Network IP Services?

IP services are a collection of IP address related services that enable communication in an Azure Virtual Network. Public and private IP addresses are used in Azure for communication between resources. The communication with resources can occur in a private Azure Virtual Network and the public Internet.

IP services consist of:

* Public IP addresses

* Public IP address prefixes

* Custom IP address prefixes (BYOIP)

* Private IP addresses

* Routing preference

* Routing preference unmetered

## Public IP addresses

Public IPs are used by internet resources to communicate inbound to resources in Azure. Public IP addresses can be created with an IPv4 or IPv6 address. You may be given the option to create a dual-stack deployment with a IPv4 and IPv6 address. Public IP addresses are available in **Standard** and **Basic** SKUs. Public IP addresses can be static or dynamically assigned.

A public IP address is a resource with its own properties. Some of the resources that you can associate with a public IP address are:

* Virtual machine network interfaces

* Internet-facing load balancers

* Virtual Network gateways (VPN/ER)

* NAT gateways

* Application gateways

* Azure Firewall

* Bastion Host

For more information about public IP addresses, see [Public IP addresses](./public-ip-addresses.md) and [Create, change, or delete an Azure public IP address](./virtual-network-public-ip-address.md)

## Public IP address prefixes

Public IP prefixes are reserved ranges of IP addresses in Azure. Public IP address prefixes consist of IPv4 or IPv6 addresses.  In regions with Availability Zones, Public IP address prefixes can be created as zone-redundant or associated with a specific availability zone. After the public IP prefix is created, you can create public IP addresses.

The following public IP prefix sizes are available:

-  /28 (IPv4) or /124 (IPv6) = 16 addresses

-  /29 (IPv4) or /125 (IPv6) = 8 addresses

-  /30 (IPv4) or /126 (IPv6) = 4 addresses

-  /31 (IPv4) or /127 (IPv6) = 2 addresses

Prefix size is specified as a Classless Inter-Domain Routing (CIDR) mask size.

There aren't limits as to how many prefixes created in a subscription. The number of ranges created can't exceed more static public IP addresses than allowed in your subscription. For more information, see [Azure limits](../../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

For more information about public IP address prefixes, see [Public IP address prefix](./public-ip-address-prefix.md) and [Create, change, or delete a public IP address prefix](./manage-public-ip-address-prefix.md)

## Private IP addresses

Private IPs allow communication between resources in Azure. Azure assigns private IP addresses to resources from the address range of the virtual network subnet where the resource is. Private IP addresses in Azure are static or dynamically assigned.

Some of the resources that you can associate a private IP address with are:

* Virtual machines

* Internal load balancers

* Application gateways

* Private endpoints

For more information about private IP addresses, see [Private IP addresses](./private-ip-addresses.md).

## Routing preference

Azure routing preference enables you to choose how your traffic routes between Azure and the Internet. You can choose to route traffic either via the Microsoft network, or, via the ISP network (public internet). You can choose the routing option while creating a public IP address. By default, traffic is routed via the Microsoft global network for all Azure services.

Routing preference choices include:

* **Microsoft Network** - Both ingress and egress traffic stays bulk of the travel on the Microsoft global network. This routing is also known as *cold potato* routing.

* **Public Internet (ISP network)** - The new routing choice Internet routing minimizes travel on the Microsoft global network, and uses the transit ISP network to route your traffic. This routing is also known as *hot potato* routing.

For more information about routing preference, see [What is routing preference?](./routing-preference-overview.md).

## Routing preference unmetered

Routing Preference unmetered is available for Content Delivery Network (CDN) providers whose customers host their origin contents in Azure. The service allows CDN providers to establish direct peering connection with Microsoft global network edge routers at various locations.

Your network traffic egressing from origin in Azure destined to CDN provider benefits from the direct connectivity.

* Data transfer bill for traffic egressing from your Azure resources that are routed through these direct links are free.

* Direct connect between CDN provider and origin in Azure provides optimal performance as there are no hops in between. This connection benefits the CDN workload that frequently fetches data from the origin.

For more information about routing preference unmetered, see [What is Routing Preference Unmetered?](./routing-preference-unmetered.md)

## Next steps

Get started creating IP services resources:

- [Create a public IP address using the Azure portal](./create-public-ip-portal.md).

- [Create a public IP address prefix using the Azure portal](./create-public-ip-prefix-portal.md).

- [Configure a private IP address for a VM using the Azure portal](./virtual-networks-static-private-ip-arm-pportal.md).

- [Configure routing preference for a public IP address using the Azure portal](./routing-preference-portal.md).
