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
ms.date: 05/28/2020
ms.author: allensu
---

# Public IP addresses

Public IP addresses allow Internet resources to communicate inbound to Azure resources. Public IP addresses enable Azure resources to communicate to Internet and public-facing Azure services. The address is dedicated to the resource, until it's unassigned by you. A resource without a public IP assigned can communicate outbound. Azure dynamically assigns an available IP address that isn't dedicated to the resource. For more information about outbound connections in Azure, see [Understand outbound connections](../load-balancer/load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

In Azure Resource Manager, a [public IP](virtual-network-public-ip-address.md) address is a resource that has its own properties. Some of the resources you can associate a public IP address resource with:

* Virtual machine network interfaces
* Internet-facing load balancers
* VPN gateways
* Application gateways
* Azure Firewall

## IP address version

Public IP addresses are created with an IPv4 or IPv6 address. 

## SKU

To learn about SKU upgrade, refer to [Public IP upgrade](../virtual-network/virtual-network-public-ip-address-upgrade.md).

Public IP addresses are created with one of the following SKUs:

>[!IMPORTANT]
> Matching SKUs are required for load balancer and public IP resources. You can't have a mixture of basic SKU resources and standard SKU resources. You can't attach standalone virtual machines, virtual machines in an availability set resource, or a virtual machine scale set resources to both SKUs simultaneously.  New designs should consider using Standard SKU resources.  Please review [Standard Load Balancer](../load-balancer/load-balancer-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) for details.

### Standard

Standard SKU public IP addresses:

- Always use static allocation method.
- Have an adjustable inbound originated flow idle timeout of 4-30 minutes, with a default of 4 minutes, and fixed outbound originated flow idle timeout of 4 minutes.
- Secure by default and closed to inbound traffic. Allow list inbound traffic with a [network security group](./network-security-groups-overview.md#network-security-groups).
- Assigned to network interfaces, standard public load balancers, or Application Gateways. For more information about Standard load balancer, see [Azure Standard Load Balancer](../load-balancer/load-balancer-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
- Can be zone-redundant (advertised from all 3 zones), zonal (guaranteed in a specific pre-selected availability zone), or no-zone (not associated with a specific pre-selected availability zone). To learn more about availability zones, see [Availability zones overview](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [Standard Load Balancer and Availability Zones](../load-balancer/load-balancer-standard-availability-zones.md?toc=%2fazure%2fvirtual-network%2ftoc.json). **Zone redundant IPs can only be created in [regions where 3 availability zones](../availability-zones/az-region.md) are live.** IPs created before zones are live will not be zone redundant.
- Can be used as anycast frontend IPs for [cross-region load balancers](../load-balancer/cross-region-overview.md) (preview functionality).
 
> [!NOTE]
> Inbound communication with a Standard SKU resource fails until you create and associate a [network security group](./network-security-groups-overview.md#network-security-groups) and explicitly allow the desired inbound traffic.

> [!NOTE]
> Only Public IP addresses with basic SKU are available when using [instance metadata service IMDS](../virtual-machines/windows/instance-metadata-service.md). Standard SKU is not supported.

> [!NOTE]
> Diagnostic settings does not appear under the resouce blade when using a Standard SKU Public IP address. To enable logging on your Standard Public IP address resource  navigate to diagnostic settings under the Azure Monitor blade and select your IP address resource.

### Basic

All public IP addresses created before the introduction of SKUs are Basic SKU public IP addresses. 

With the introduction of SKUs, specify which SKU you would like the public IP address to be. 

Basic SKU addresses:

- Assigned with the static or dynamic allocation method.
- Have an adjustable inbound originated flow idle timeout of 4-30 minutes, with a default of 4 minutes, and fixed outbound originated flow idle timeout of 4 minutes.
- Are open by default.  Network security groups are recommended but optional for restricting inbound or outbound traffic.
- Assigned to any Azure resource that can be assigned a public IP address, such as:
    * Network interfaces
    * VPN Gateways
    * Application Gateways
    * Public load balancers
- Don't support Availability Zone scenarios. Use Standard SKU public IP for Availability Zone scenarios. To learn more about availability zones, see [Availability zones overview](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [Standard Load Balancer and Availability Zones](../load-balancer/load-balancer-standard-availability-zones.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

## Allocation method

Basic and standard public IPs support **static** assignment.  The resource is assigned an IP address at the time it's created. The IP address is released when the resource is deleted.

Basic SKU public IP addresses support a **dynamic** assignment. Dynamic is the default assignment method. The IP address **isn't** given to the resource at the time of creation when selecting dynamic.

The IP is assigned when you associate the public IP address resource with a:

* Virtual machine 
* The first virtual machine is associated with the backend pool of a load balancer.

The IP address is released when you stop (or delete) the resource.  

For example, a public IP resource is released from a resource named **Resource A**. **Resource A** receives a different IP on start-up if the public IP resource is reassigned.

The IP address is released when the allocation method is changed from **static** to **dynamic**. To ensure the IP address for the associated resource remains the same, set the allocation method explicitly to **static**. A static IP address is assigned immediately.

> [!NOTE]
> Even when you set the allocation method to **static**, you cannot specify the actual IP address assigned to the public IP address resource. Azure assigns the IP address from a pool of available IP addresses in the Azure location the resource is created in.
>

Static public IP addresses are commonly used in the following scenarios:

* When you must update firewall rules to communicate with your Azure resources.
* DNS name resolution, where a change in IP address would require updating A records.
* Your Azure resources communicate with other apps or services that use an IP address-based security model.
* You use TLS/SSL certificates linked to an IP address.

> [!NOTE]
> Azure allocates public IP addresses from a range unique to each region in each Azure cloud. You can download the list of ranges (prefixes) for the Azure [Public](https://www.microsoft.com/download/details.aspx?id=56519), [US government](https://www.microsoft.com/download/details.aspx?id=57063), [China](https://www.microsoft.com/download/details.aspx?id=57062), and [Germany](https://www.microsoft.com/download/details.aspx?id=57064) clouds.
>

## DNS hostname resolution

Select the option to specify a DNS domain name label for a public IP resource. 

This selection creates a mapping for **domainnamelabel**.**location**.cloudapp.azure.com to the public IP in the Azure-managed DNS. 

For instance, creation of a public IP with:

* **contoso** as a **domainnamelabel**
* **West US** Azure **location**

The fully qualified domain name (FQDN) **contoso.westus.cloudapp.azure.com** resolves to the public IP address of the resource.

> [!IMPORTANT]
> Each domain name label created must be unique within its Azure location.  
>

## DNS Recommendations

If a region move is needed, you can't migrate the FQDN of your public IP. Use the FQDN to create a custom CNAME record pointing to the public IP address. 

If a move to a different public IP is required, update the CNAME record instead of updating the FQDN.

You can use [Azure DNS](../dns/dns-custom-domain.md?toc=%2fazure%2fvirtual-network%2ftoc.json#public-ip-address) or an external DNS provider for your DNS Record. 

## Virtual machines

You can associate a public IP address with a [Windows](../virtual-machines/windows/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine by assigning it to its **network interface**. 

Choose **dynamic** or **static** for the public IP address. Learn more about [assigning IP addresses to network interfaces](virtual-network-network-interface-addresses.md).

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Internet-facing load balancers

You can associate a public IP address of either [SKU](#sku) with an [Azure Load Balancer](../load-balancer/load-balancer-overview.md), by assigning it to the load balancer **frontend** configuration. The public IP serves as a load-balanced IP. 

You can assign either a dynamic or a static public IP address to a load balancer front end. You can assign multiple public IP addresses to a load balancer front end. This configuration enables [multi-VIP](../load-balancer/load-balancer-multivip-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) scenarios like a multi-tenant environment with TLS-based websites. 

For more information about Azure load balancer SKUs, see [Azure load balancer standard SKU](../load-balancer/load-balancer-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## VPN gateways

[Azure VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json) connects an Azure virtual network to:

* Azure virtual networks
* On-premises network(s). 

A public IP address is assigned to the VPN Gateway to enable communication with the remote network. 

* Assign a **dynamic** basic public IP to a VPNGw 1-5 SKU front-end configuration.
* Assign a **static** standard public IP address to a VPNGwAZ 1-5 SKU front-end configuration.

## Application gateways

You can associate a public IP address with an Azure [Application Gateway](../application-gateway/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json), by assigning it to the gateway's **frontend** configuration. 

* Assign a **dynamic** basic public IP to an application gateway V1 front-end configuration. 
* Assign a **static** standard public IP address to a V2 front-end configuration.

## Azure Firewall

[Azure Firewall](../firewall/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) allows you to create, enforce, and log application and network connectivity policies across subscriptions and virtual networks.

You can only associate **static** standard public IP addresses with a firewall. This allows outside firewalls to identify traffic originating from your virtual network. 


## At-a-glance

The following table shows the property through which a public IP can be associated to a top-level resource and the possible allocation methods.

| Top-level resource | IP Address association | Dynamic | Static |
| --- | --- | --- | --- |
| Virtual machine |Network interface |Yes |Yes |
| Internet-facing Load balancer |Front-end configuration |Yes |Yes |
| VPN gateway |Gateway IP configuration |Yes |No |
| Application gateway |Front-end configuration |Yes (V1 only) |Yes (V2 only) |
| Azure Firewall | Front-end configuration | No | Yes|

## Limits

The limits for IP addressing are listed in the full set of [limits for networking](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#networking-limits) in Azure. 

The limits are per region and per subscription. [Contact support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to increase the default limits up to the maximum limits based on your business needs.

## Pricing

Public IP addresses may have a nominal charge. To learn more about IP address pricing in Azure, review the [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses) page.

## Next steps
* Learn about [Private IP Addresses in Azure](private-ip-addresses.md)
* [Deploy a VM with a static public IP using the Azure portal](virtual-network-deploy-static-pip-arm-portal.md)
