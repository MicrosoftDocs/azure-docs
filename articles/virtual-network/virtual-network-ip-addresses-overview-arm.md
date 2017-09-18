---
title: IP address types in Azure | Microsoft Docs
description: Learn about public and private IP addresses in Azure.
services: virtual-network
documentationcenter: na
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 610b911c-f358-4cfe-ad82-8b61b87c3b7e
ms.service: virtual-network
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/18/2017
ms.author: jdial

---
# IP address types and allocation methods in Azure

You can assign IP addresses to Azure resources to communicate with other Azure resources, your on-premises network, and the Internet. There are two types of IP addresses you can use in Azure:

* **Public IP addresses**: Used for communication with the Internet, including Azure public-facing services.
* **Private IP addresses**: Used for communication within an Azure virtual network (VNet), and your on-premises network when you use a VPN gateway or ExpressRoute circuit to extend your network to Azure.

> [!NOTE]
> Azure has two different deployment models for creating and working with resources:  [Resource Manager and classic](../azure-resource-manager/resource-manager-deployment-model.md?toc=%2fazure%2fvirtual-network%2ftoc.json).  This article covers using the Resource Manager deployment model, which Microsoft recommends for most new deployments instead of the [classic deployment model](virtual-network-ip-addresses-overview-classic.md).
> 

If you are familiar with the classic deployment model, check the [differences in IP addressing between classic and Resource Manager](virtual-network-ip-addresses-overview-classic.md#differences-between-resource-manager-and-classic-deployments).

## Public IP addresses

Public IP addresses allow Azure resources to communicate with Internet and Azure public-facing services such as [Azure Redis Cache](https://azure.microsoft.com/services/cache), [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs), [SQL databases](../sql-database/sql-database-technical-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json), and [Azure storage](../storage/common/storage-introduction.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

In Azure Resource Manager, a [public IP](virtual-network-public-ip-address.md) address is a resource that has its own properties. Some of the resources you can associate a public IP address resource with are:

* Virtual machine network interfaces
* Internet-facing load balancers
* VPN gateways
* Application gateways

### IP address version

Public IP addresses are created with an IPv4 or IPv6 address. Public IPv6 addresses can only be assigned to Internet-facing load balancers.

### SKU

Public IP addresses are created with one of the following SKUs:

#### Basic

All public IP addresses created before the introduction of SKUs are Basic SKU public IP addresses. With the introduction of SKUs, you have the option to specify which SKU you would like the public IP address to be. Basic SKU addresses are:

- Assigned with the static or dynamic allocation method.
- Assigned to any Azure resource that can be assigned a public IP address, such as network interfaces, VPN Gateways, Application Gateways, and Internet-facing load balancers.
- Are not availability zone resilient. To learn more about availability zones, see [Availability zones overview](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

#### Standard

Standard SKU public IP addresses are:

- Assigned with the static allocation method only.
- Assigned to Standard Internet-facing load balancers only. See [Azure load balancer standard SKU](../load-balancer/load-balancer-standard-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) for more details about Azure load balancer SKUs.
- Are zone resilient.

The standard SKU is in preview release. Before creating a Standard SKU public IP address, you must first register for the preview, and create the address in a supported location. To register for the preview, see [register for the standard SKU preview](virtual-network-public-ip-address.md#register-for-the-standard-sku-preview). For a list of supported locations (regions), see [Region availability](../load-balancer/load-balancer-standard-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#region-availability) and monitor the [Azure Virtual Network updates](https://azure.microsoft.com/updates/?product=virtual-network) page for additional region support.


### Allocation method

There are two methods in which an IP address is allocated to a public IP address resource - *dynamic* or *static*. The default allocation method is *dynamic*, where an IP address is **not** allocated at the time of its creation. Instead, the public IP address is allocated when you start (or create) the associated resource (like a VM or load balancer). The IP address is released when you stop (or delete) the resource. This causes the IP address to change when you stop and start a resource.

To ensure the IP address for the associated resource remains the same, you can set the allocation method explicitly to *static*. In this case an IP address is assigned immediately. It is released only when you delete the resource or change its allocation method to *dynamic*.

> [!NOTE]
> Even when you set the allocation method to *static*, you cannot specify the actual IP address assigned to the public IP address resource. Instead, it gets allocated from a pool of available IP addresses in the Azure location the resource is created in.
>

Static public IP addresses are commonly used in the following scenarios:

* End-users need to update firewall rules to communicate with your Azure resources.
* DNS name resolution, where a change in IP address would require updating A records.
* Your Azure resources communicate with other apps or services that use an IP address-based security model.
* You use SSL certificates linked to an IP address.

> [!NOTE]
> The list of IP ranges from which public IP addresses (dynamic/static) are allocated to Azure resources is published at [Azure Datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).
>

### DNS hostname resolution
You can specify a DNS domain name label for a public IP resource, which creates a mapping for *domainnamelabel*.*location*.cloudapp.azure.com to the public IP address in the Azure-managed DNS servers. For instance, if you create a public IP resource with **contoso** as a *domainnamelabel* in the **West US** Azure *location*, the fully-qualified domain name (FQDN) **contoso.westus.cloudapp.azure.com** resolves to the public IP address of the resource. You can use the FQDN to create a custom domain CNAME record pointing to the public IP address in Azure.

> [!IMPORTANT]
> Each domain name label created must be unique within its Azure location.  
>

### Virtual machines

You can associate a public IP address with a [Windows](../virtual-machines/windows/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine by assigning it to its **network interface**. In the case of a VM with multiple network interfaces, you can assign it to the *primary* network interface only. You can assign either a dynamic or a static public IP address to a virtual machine. Learn more about [assigning IP addresses to network interfaces](virtual-network-network-interface-addresses.md).

### Internet-facing load balancers

You can associate a public IP address created with either [SKU](#SKU) with an [Azure Load Balancer](../load-balancer/load-balancer-overview.md), by assigning it to the load balancer **frontend** configuration. The public IP address serves as a load-balanced virtual IP address (VIP). You can assign either a dynamic or a static public IP address to a load balancer front-end. You can also assign multiple public IP addresses to a load balancer front-end, which enables [multi-VIP](../load-balancer/load-balancer-multivip.md?toc=%2fazure%2fvirtual-network%2ftoc.json) scenarios like a multi-tenant environment with SSL-based websites. See [Azure load balancer standard SKU](../load-balancer/load-balancer-standard-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) for more details about Azure load balancer SKUs.

### VPN gateways

An [Azure VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json) connects an Azure virtual network (VNet) to other Azure virtual networks or to an on-premises network. You need to assign a public IP address to its **IP configuration** to enable it to communicate with the remote network. You can only assign a *dynamic* public IP address to a VPN gateway.

### Application gateways

You can associate a public IP address with an Azure [Application Gateway](../application-gateway/application-gateway-introduction.md?toc=%2fazure%2fvirtual-network%2ftoc.json), by assigning it to the gateway's **frontend** configuration. This public IP address serves as a load-balanced VIP. You can only assign a *dynamic* public IP address to an application gateway frontend configuration.

### At-a-glance
The table below shows the specific property through which a public IP address can be associated to a top-level resource, and the possible allocation methods (dynamic or static) that can be used.

| Top-level resource | IP Address association | Dynamic | Static |
| --- | --- | --- | --- |
| Virtual machine |Network interface |Yes |Yes |
| Internet-facing Load balancer |Front-end configuration |Yes |Yes |
| VPN gateway |Gateway IP configuration |Yes |No |
| Application gateway |Front end configuration |Yes |No |

## Private IP addresses
Private IP addresses allow Azure resources to communicate with other resources in a [virtual network](virtual-networks-overview.md) or an on-premises network through a VPN gateway or ExpressRoute circuit, without using an Internet-reachable IP address.

In the Azure Resource Manager deployment model, a private IP address is associated to the following types of Azure resources:

* Virtual machine network interfaces
* Internal load balancers (ILBs)
* Application gateways

### IP address version

Private IP addresses are created with an IPv4 or IPv6 address. Private IPv6 addresses can only be assigned with the dynamic allocation method. You cannot communicate between private IPv6 addresses on a virtual network. You can communicate inbound to a private IPv6 address from the Internet, through an Internet-facing load balancer. See [Create an Internet-facing load balancer with IPv6](../load-balancer/load-balancer-ipv6-internet-ps.md?toc=%2fazure%2fvirtual-network%2ftoc.json) for details.

### Allocation method

A private IP address is allocated from the address range of the subnet to which the resource is attached. The address range of the subnet itself is a part of the virtual network's address range.

There are two methods in which a private IP address is allocated: *dynamic* or *static*. The default allocation method is *dynamic*, where the IP address is automatically allocated from the resource's subnet (using DHCP). This IP address can change when you stop and start the resource.

You can set the allocation method to *static* to ensure the IP address remains the same. In this case, you also need to provide a valid IP address that is part of the resource's subnet.

Static private IP addresses are commonly used for:

* Virtual machines that act as domain controllers or DNS servers.
* Resources that require firewall rules using IP addresses.
* Resources accessed by other apps/resources through an IP address.

### Virtual machines

A private IP address is assigned to the **network interface** of a [Windows](../virtual-machines/windows/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine. In case of a multi-network interface virtual machine, each network interface gets a private IP address assigned. You can specify the allocation method as either dynamic or static for a network interface.

#### Internal DNS hostname resolution (for virtual machines)

All Azure virtual machines are configured with [Azure-managed DNS servers](virtual-networks-name-resolution-for-vms-and-role-instances.md#azure-provided-name-resolution) by default, unless you explicitly configure custom DNS servers. These DNS servers provide internal name resolution for virtual machines that reside within the same virtual network.

When you create a virtual machine, a mapping for the hostname to its private IP address is added to the Azure-managed DNS servers. In case of a multi-network interface virtual machine, the hostname is mapped to the private IP address of the primary network interface.

Virtual machines configured with Azure-managed DNS servers are able to resolve the hostnames of all virtual machines within the same virtual network to their private IP addresses.

### Internal load balancers (ILB) & Application gateways

You can assign a private IP address to the **front end** configuration of an [Azure Internal Load Balancer](../load-balancer/load-balancer-internal-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) (ILB) or an [Azure Application Gateway](../application-gateway/application-gateway-introduction.md?toc=%2fazure%2fvirtual-network%2ftoc.json). This private IP address serves as an internal endpoint, accessible only to the resources within its virtual network and the remote networks connected to the virtual network. You can assign either a dynamic or static private IP address to the front-end configuration.

### At-a-glance
The table below shows the specific property through which a private IP address can be associated to a top-level resource, and the possible allocation methods (dynamic or static) that can be used.

| Top-level resource | IP address association | Dynamic | Static |
| --- | --- | --- | --- |
| Virtual machine |Network interface |Yes |Yes |
| Load balancer |Front end configuration |Yes |Yes |
| Application gateway |Front end configuration |Yes |Yes |

## Limits
The limits imposed on IP addressing are indicated in the full set of [limits for networking](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#networking-limits) in Azure. The limits are per region and per subscription. You can [contact support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to increase the default limits up to the maximum limits based on your business needs.

## Pricing
Public IP addresses may have a nominal charge. To learn more about IP address pricing in Azure, review the [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses) page.

## Next steps
* [Deploy a VM with a static public IP using the Azure portal](virtual-network-deploy-static-pip-arm-portal.md)
* [Deploy a VM with a static public IP using a template](virtual-network-deploy-static-pip-arm-template.md)
* [Deploy a VM with a static private IP address using the Azure portal](virtual-networks-static-private-ip-arm-pportal.md)
