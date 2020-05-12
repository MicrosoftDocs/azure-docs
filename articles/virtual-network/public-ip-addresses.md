---
title: Public IP addresses in Azure
titlesuffix: Azure Virtual Network
description: Learn about public IP addresses in Azure.
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
ms.service: virtual-network
ms.subservice: ip-services
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/12/2020
ms.author: allensu

---
# Public IP addresses

Public IP addresses allow Internet resources to communicate inbound to Azure resources. Public IP addresses also enable Azure resources to communicate outbound to Internet and public-facing Azure services with an IP address assigned to the resource. The address is dedicated to the resource, until it is unassigned by you. If a public IP address is not assigned to a resource, the resource can still communicate outbound to the Internet, but Azure dynamically assigns an available IP address that is not dedicated to the resource. For more information about outbound connections in Azure, see [Understand outbound connections](../load-balancer/load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

In Azure Resource Manager, a [public IP](virtual-network-public-ip-address.md) address is a resource that has its own properties. Some of the resources you can associate a public IP address resource with are:

* Virtual machine network interfaces
* Internet-facing load balancers
* VPN gateways
* Application gateways
* Azure Firewall

### IP address version

Public IP addresses are created with an IPv4 or IPv6 address. 

### SKU

Public IP addresses are created with one of the following SKUs:

>[!IMPORTANT]
> Matching SKUs must be used for load balancer and public IP resources. You can't have a mixture of basic SKU resources and standard SKU resources. You can't attach standalone virtual machines, virtual machines in an availability set resource, or a virtual machine scale set resources to both SKUs simultaneously.  New designs should consider using Standard SKU resources.  Please review [Standard Load Balancer](../load-balancer/load-balancer-standard-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) for details.

#### Standard

Standard SKU public IP addresses are:

- Always use static allocation method.
- Have an adjustable inbound originated flow idle timeout of 4-30 minutes, with a default of 4 minutes, and fixed outbound originated flow idle timeout of 4 minutes.
- Are secure by default and closed to inbound traffic. You must explicit whitelist allowed inbound traffic with a [network security group](security-overview.md#network-security-groups).
- Assigned to network interfaces, Standard public Load Balancers, or Application Gateways. For more information about Standard Load Balancer, see [Azure Standard Load Balancer](../load-balancer/load-balancer-standard-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
- Can be zone-redundant or zonal (can be created zonal and guaranteed in a specific availability zone). To learn more about availability zones, see [Availability zones overview](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [Standard Load Balancer and Availability Zones](../load-balancer/load-balancer-standard-availability-zones.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
 
> [!NOTE]
> Inbound communication with a Standard SKU resource fails until you create and associate a [network security group](security-overview.md#network-security-groups) and explicitly allow the desired inbound traffic.

> [!NOTE]
> Only Public IP addresses with basic SKU are available when using [instance metadata service IMDS](../virtual-machines/windows/instance-metadata-service.md). Standard SKU is not supported.

#### Basic

All public IP addresses created before the introduction of SKUs are Basic SKU public IP addresses. With the introduction of SKUs, you have the option to specify which SKU you would like the public IP address to be. Basic SKU addresses are:

- Assigned with the static or dynamic allocation method.
- Have an adjustable inbound originated flow idle timeout of 4-30 minutes, with a default of 4 minutes, and fixed outbound originated flow idle timeout of 4 minutes.
- Are open by default.  Network security groups are recommended but optional for restricting inbound or outbound traffic.
- Assigned to any Azure resource that can be assigned a public IP address, such as network interfaces, VPN Gateways, Application Gateways, and Internet-facing load balancers.
- Do not support Availability Zone scenarios.  You need to use Standard SKU public IP for Availability Zone scenarios. To learn more about availability zones, see [Availability zones overview](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [Standard Load Balancer and Availability Zones](../load-balancer/load-balancer-standard-availability-zones.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

### Allocation method

Both basic and standard SKU public IP addresses support the *static* allocation method.  The resource is assigned an IP address at the time it is created and the IP address is released when the resource is deleted.

Basic SKU public IP addresses also support a *dynamic* allocation method, which is the default if allocation method is not specified.  Selecting *dynamic* allocation method for a basic public IP address resource means the IP address is **not** allocated at the time of the resource creation.  The public IP address is allocated when you associate the public IP address with a virtual machine or when you place the first virtual machine instance into the backend pool of a basic load balancer.   The IP address is released when you stop (or delete) the resource.  After being released from resource A, for example, the IP address can be assigned to a different resource. If the IP address is assigned to a different resource while resource A is stopped, when you restart resource A, a different IP address is assigned. If you change the allocation method of a basic public IP address resource from *static* to *dynamic*, the address is released. To ensure the IP address for the associated resource remains the same, you can set the allocation method explicitly to *static*. A static IP address is assigned immediately.

> [!NOTE]
> Even when you set the allocation method to *static*, you cannot specify the actual IP address assigned to the public IP address resource. Azure assigns the IP address from a pool of available IP addresses in the Azure location the resource is created in.
>

Static public IP addresses are commonly used in the following scenarios:

* When you must update firewall rules to communicate with your Azure resources.
* DNS name resolution, where a change in IP address would require updating A records.
* Your Azure resources communicate with other apps or services that use an IP address-based security model.
* You use TLS/SSL certificates linked to an IP address.

> [!NOTE]
> Azure allocates public IP addresses from a range unique to each region in each Azure cloud. You can download the list of ranges (prefixes) for the Azure [Public](https://www.microsoft.com/download/details.aspx?id=56519), [US government](https://www.microsoft.com/download/details.aspx?id=57063), [China](https://www.microsoft.com/download/details.aspx?id=57062), and [Germany](https://www.microsoft.com/download/details.aspx?id=57064) clouds.
>

### DNS hostname resolution
You can specify a DNS domain name label for a public IP resource, which creates a mapping for *domainnamelabel*.*location*.cloudapp.azure.com to the public IP address in the Azure-managed DNS servers. For instance, if you create a public IP resource with **contoso** as a *domainnamelabel* in the **West US** Azure *location*, the fully qualified domain name (FQDN) **contoso.westus.cloudapp.azure.com** resolves to the public IP address of the resource.

> [!IMPORTANT]
> Each domain name label created must be unique within its Azure location.  
>

### DNS Best Practices
If you ever need to migrate to a different region, you cannot migrate the FQDN of your public IP Address. As a best practice, you can use the FQDN to create a custom domain CNAME record pointing to the public IP address in Azure. If you need to move to a different public IP, it will require an update to the CNAME record instead of having to manually update the FQDN to the new address. You can use [Azure DNS](../dns/dns-custom-domain.md?toc=%2fazure%2fvirtual-network%2ftoc.json#public-ip-address) or an external DNS provider for your DNS Record. 

### Virtual machines

You can associate a public IP address with a [Windows](../virtual-machines/windows/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine by assigning it to its **network interface**. You can assign either a dynamic or a static public IP address to a virtual machine. Learn more about [assigning IP addresses to network interfaces](virtual-network-network-interface-addresses.md).

### Internet-facing load balancers

You can associate a public IP address created with either [SKU](#sku) with an [Azure Load Balancer](../load-balancer/load-balancer-overview.md), by assigning it to the load balancer **frontend** configuration. The public IP address serves as a load-balanced virtual IP address (VIP). You can assign either a dynamic or a static public IP address to a load balancer front-end. You can also assign multiple public IP addresses to a load balancer front-end, which enables [multi-VIP](../load-balancer/load-balancer-multivip-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) scenarios like a multi-tenant environment with TLS-based websites. For more information about Azure load balancer SKUs, see [Azure load balancer standard SKU](../load-balancer/load-balancer-standard-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

### VPN gateways

An [Azure VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json) connects an Azure virtual network to other Azure virtual networks, or to an on-premises network. A public IP address is assigned to the VPN Gateway to enable it to communicate with the remote network. You can only assign a *dynamic* basic public IP address to a VPN gateway.

### Application gateways

You can associate a public IP address with an Azure [Application Gateway](../application-gateway/application-gateway-introduction.md?toc=%2fazure%2fvirtual-network%2ftoc.json), by assigning it to the gateway's **frontend** configuration. This public IP address serves as a load-balanced VIP. You can only assign a *dynamic* basic public IP address to an application gateway V1 front-end configuration, and only a *static* standard SKU address to a V2 front-end configuration.

### At-a-glance
The following table shows the specific property through which a public IP address can be associated to a top-level resource, and the possible allocation methods (dynamic or static) that can be used.

| Top-level resource | IP Address association | Dynamic | Static |
| --- | --- | --- | --- |
| Virtual machine |Network interface |Yes |Yes |
| Internet-facing Load balancer |Front-end configuration |Yes |Yes |
| VPN gateway |Gateway IP configuration |Yes |No |
| Application gateway |Front-end configuration |Yes (V1 only) |Yes (V2 only) |

## Limits
The limits imposed on IP addressing are indicated in the full set of [limits for networking](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#networking-limits) in Azure. The limits are per region and per subscription. You can [contact support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to increase the default limits up to the maximum limits based on your business needs.

## Pricing
Public IP addresses may have a nominal charge. To learn more about IP address pricing in Azure, review the [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses) page.

## Next steps
* Learn about [Private IP Addresses in Azure](private-ip-addresses.md)
* [Deploy a VM with a static public IP using the Azure portal](virtual-network-deploy-static-pip-arm-portal.md)

