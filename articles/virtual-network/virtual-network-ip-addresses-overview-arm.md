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
ms.date: 11/16/2017
ms.author: jdial

---
# IP address types and allocation methods in Azure

You can assign IP addresses to Azure resources to communicate with other Azure resources, your on-premises network, and the Internet. There are two types of IP addresses you can use in Azure:

* **Public IP addresses**: Used for communication with the Internet, including Azure public-facing services.
* **Private IP addresses**: Used for communication within an Azure virtual network (VNet), and your on-premises network, when you use a VPN gateway or ExpressRoute circuit to extend your network to Azure.

> [!NOTE]
> Azure has two different deployment models for creating and working with resources:  [Resource Manager and classic](../azure-resource-manager/resource-manager-deployment-model.md?toc=%2fazure%2fvirtual-network%2ftoc.json).  This article covers using the Resource Manager deployment model, which Microsoft recommends for most new deployments instead of the [classic deployment model](virtual-network-ip-addresses-overview-classic.md).
> 

If you are familiar with the classic deployment model, check the [differences in IP addressing between classic and Resource Manager](virtual-network-ip-addresses-overview-classic.md#differences-between-resource-manager-and-classic-deployments).

## Public IP addresses

Public IP addresses allow Internet resources to communicate inbound to Azure resources. Public IP addresses also enable Azure resources to communicate outbound to Internet and public-facing Azure services with an IP address assigned to the resource. The address is dedicated to the resource, until it is unassigned by you. If a public IP address is not assigned to a resource, the resource can still communicate outbound to the Internet, but Azure dynamically assigns an available IP address that is not dedicated to the resource. For more information about outbound connections in Azure, see [Understand outbound connections](../load-balancer/load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

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
- Can be assigned to a specific zone.
- Not zone redundant. To learn more about availability zones, see [Availability zones overview](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

#### Standard

Standard SKU public IP addresses are:

- Assigned with the static allocation method only.
- Assigned to network interfaces or Standard Internet-facing load balancers. For more information about Azure load balancer SKUs, see [Azure load balancer standard SKU](../load-balancer/load-balancer-standard-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
- Zone redundant by default. Can be created zonal and guaranteed in a specific availability zone.  To learn more about availability zones, see [Availability zones overview](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
 
> [!NOTE]
> When you assign a standard SKU public IP address to a virtual machine’s network interface, you must explicitly allow the intended traffic with a [network security group](security-overview.md#network-security-groups).  Communication with the resource fails until you create and associate a network security group and explicitly allow the desired traffic.

The standard SKU is in preview release. Before creating a Standard SKU public IP address, you must first register for the preview, and create the address in a supported location. To register for the preview, see [register for the standard SKU preview](virtual-network-public-ip-address.md#register-for-the-standard-sku-preview). For a list of supported locations (regions), see [Region availability](../load-balancer/load-balancer-standard-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#region-availability) and monitor the [Azure Virtual Network updates](https://azure.microsoft.com/updates/?product=virtual-network) page for additional region support.


### Allocation method

There are two methods in which an IP address is allocated to a public IP address resource - *dynamic* or *static*. The default allocation method is *dynamic*, where an IP address is **not** allocated at the time of its creation. Instead, the public IP address is allocated when you start (or create) the associated resource (like a VM or load balancer). The IP address is released when you stop (or delete) the resource. After being released from resource A, for example, the IP address can be assigned to a different resource. If the IP address is assigned to a different resource while resource A is stopped, when you restart resource A, a different IP address is assigned.

To ensure the IP address for the associated resource remains the same, you can set the allocation method explicitly to *static*. A static IP address is assigned immediately. The address is released only when you delete the resource or change its allocation method to *dynamic*.

> [!NOTE]
> Even when you set the allocation method to *static*, you cannot specify the actual IP address assigned to the public IP address resource. Azure assigns the IP address from a pool of available IP addresses in the Azure location the resource is created in.
>

Static public IP addresses are commonly used in the following scenarios:

* When you must update firewall rules to communicate with your Azure resources.
* DNS name resolution, where a change in IP address would require updating A records.
* Your Azure resources communicate with other apps or services that use an IP address-based security model.
* You use SSL certificates linked to an IP address.

> [!NOTE]
> Azure allocates public IP addresses from a range unique to each Azure region. For details, see [Azure Datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).
>

### DNS hostname resolution
You can specify a DNS domain name label for a public IP resource, which creates a mapping for *domainnamelabel*.*location*.cloudapp.azure.com to the public IP address in the Azure-managed DNS servers. For instance, if you create a public IP resource with **contoso** as a *domainnamelabel* in the **West US** Azure *location*, the fully-qualified domain name (FQDN) **contoso.westus.cloudapp.azure.com** resolves to the public IP address of the resource. You can use the FQDN to create a custom domain CNAME record pointing to the public IP address in Azure. Instead of, or in addition to, using the DNS name label with the default suffix, you can use the Azure DNS service to configure a DNS name with a custom suffix that resolves to the public IP address. For more information, see [Use Azure DNS with an Azure public IP address](../dns/dns-custom-domain?toc=%2fazure%2fvirtual-network%2ftoc.json#public-ip-address).

> [!IMPORTANT]
> Each domain name label created must be unique within its Azure location.  
>

### Virtual machines

You can associate a public IP address with a [Windows](../virtual-machines/windows/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine by assigning it to its **network interface**. You can assign either a dynamic or a static public IP address to a virtual machine. Learn more about [assigning IP addresses to network interfaces](virtual-network-network-interface-addresses.md).

### Internet-facing load balancers

You can associate a public IP address created with either [SKU](#SKU) with an [Azure Load Balancer](../load-balancer/load-balancer-overview.md), by assigning it to the load balancer **frontend** configuration. The public IP address serves as a load-balanced virtual IP address (VIP). You can assign either a dynamic or a static public IP address to a load balancer front end. You can also assign multiple public IP addresses to a load balancer front end, which enables [multi-VIP](../load-balancer/load-balancer-multivip-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) scenarios like a multi-tenant environment with SSL-based websites. For more information about Azure load balancer SKUs, see [Azure load balancer standard SKU](../load-balancer/load-balancer-standard-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

### VPN gateways

An [Azure VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json) connects an Azure virtual network to other Azure virtual networks, or to an on-premises network. A public IP address is assigned to the VPN Gateway to enable it to communicate with the remote network. You can only assign a *dynamic* public IP address to a VPN gateway.

### Application gateways

You can associate a public IP address with an Azure [Application Gateway](../application-gateway/application-gateway-introduction.md?toc=%2fazure%2fvirtual-network%2ftoc.json), by assigning it to the gateway's **frontend** configuration. This public IP address serves as a load-balanced VIP. You can only assign a *dynamic* public IP address to an application gateway frontend configuration.

### At-a-glance
The following table shows the specific property through which a public IP address can be associated to a top-level resource, and the possible allocation methods (dynamic or static) that can be used.

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

A private IP address is allocated from the address range of the virtual network subnet a resource is deployed in. Azure reserves the first four addresses in each subnet address range, so the addresses cannot be assigned to resources. For example, if the subnet's address range is 10.0.0.0/16, addresses 10.0.0.0-10.0.0.3 cannot be assigned to resources. IP addresses within the subnet's address range can only be assigned to one resource at a time. 

There are two methods in which a private IP address is allocated:

- **Dynamic**: Azure assigns the next available unassigned or unreserved IP address in the subnet's address range. For example, Azure assigns 10.0.0.10 to a new resource, if addresses 10.0.0.4-10.0.0.9 are already assigned to other resources. Dynamic is the default allocation method. Once assigned, dynamic IP addresses are only released if a network interface is deleted, assigned to a different subnet within the same virtual network, or the allocation method is changed to static, and a different IP address is specified. By default, Azure assigns the previous dynamically-assigned address as the static address when you change the allocation method from dynamic to static.
- **Static**: You select and assign any unassigned or unresered IP address in the subnet's address range. For example if a subnet's address range is 10.0.0.0/16 and addresses 10.0.0.4-10.0.0.9 are already assigned to other resources, you can assign any address between 10.0.0.10 - 10.0.255.254. Static addresses are only released if a network interface is deleted. If you change the allocation method to static, Azure dynamically assigns the previously-assigned static IP address as the dynamic address, even if the address isn't the next available address in the subnet's address range. The address also changes if the network interface is assigned to a different subnet within the same virtual network, but to assign the network interface to a different subnet, you must first change the allocation method from static to dynamic. Once you've assigned the network interface to a different subnet, you can change the allocation method back to static, and assign an IP address from the new subnet's address range.

### Virtual machines

One or more private IP addresses are assigned to one or more **network interfaces** of a [Windows](../virtual-machines/windows/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine. You can specify the allocation method as either dynamic or static for each private IP address.

#### Internal DNS hostname resolution (for virtual machines)

All Azure virtual machines are configured with [Azure-managed DNS servers](virtual-networks-name-resolution-for-vms-and-role-instances.md#azure-provided-name-resolution) by default, unless you explicitly configure custom DNS servers. These DNS servers provide internal name resolution for virtual machines that reside within the same virtual network.

When you create a virtual machine, a mapping for the hostname to its private IP address is added to the Azure-managed DNS servers. If a virtual machine has multiple network interfaces, or multiple IP configurations for a network interface the hostname is mapped to the private IP address of the primary IP configuration of the primary network interface.

Virtual machines configured with Azure-managed DNS servers are able to resolve the hostnames of all virtual machines within the same virtual network to their private IP addresses. To resolve host names of virtual machines in connected virtual networks, you must use a custom DNS server.

### Internal load balancers (ILB) & Application gateways

You can assign a private IP address to the **front end** configuration of an [Azure Internal Load Balancer](../load-balancer/load-balancer-internal-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) (ILB) or an [Azure Application Gateway](../application-gateway/application-gateway-introduction.md?toc=%2fazure%2fvirtual-network%2ftoc.json). This private IP address serves as an internal endpoint, accessible only to the resources within its virtual network and the remote networks connected to the virtual network. You can assign either a dynamic or static private IP address to the front-end configuration.

### At-a-glance
The following table shows the specific property through which a private IP address can be associated to a top-level resource, and the possible allocation methods (dynamic or static) that can be used.

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
