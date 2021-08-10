---
title: Public IP addresses in Azure
titleSuffix: Azure Virtual Network
description: Learn about public IP addresses in Azure.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: conceptual
ms.date: 04/29/2021
ms.author: allensu
---

# Public IP addresses

Public IP addresses allow Internet resources to communicate inbound to Azure resources. Public IP addresses enable Azure resources to communicate to Internet and public-facing Azure services. The address is dedicated to the resource, until it's unassigned by you. A resource without a public IP assigned can communicate outbound. Azure dynamically assigns an available IP address that isn't dedicated to the resource. For more information about outbound connections in Azure, see [Understand outbound connections](../load-balancer/load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

In Azure Resource Manager, a [public IP](virtual-network-public-ip-address.md) address is a resource that has its own properties. Some of the resources you can associate a public IP address resource with:

* Virtual machine network interfaces
* Internet-facing load balancers
* Virtual Network gateways (VPN/ER)
* NAT gateways
* Application gateways
* Azure Firewall
* Bastion Host

For Virtual Machine Scale Sets, use [Public IP Prefixes](public-ip-address-prefix.md).

## At-a-glance

The following table shows the property a public IP can be associated to a resource and the allocation methods. Note that public IPv6 support isn't available for all resource types at this time.

| Top-level resource | IP Address association | Dynamic IPv4 | Static IPv4 | Dynamic IPv6 | Static IPv6 |
| --- | --- | --- | --- | --- | --- |
| Virtual machine |Network interface |Yes | Yes | Yes | Yes |
| Internet-facing Load balancer |Front-end configuration |Yes | Yes | Yes |Yes |
| Virtual Network gateway (VPN) |Gateway IP configuration |Yes (non-AZ only) |Yes (AZ only) | No |No |
| Virtual Network gateway (ER) |Gateway IP configuration |Yes | No | Yes (preview) |No |
| NAT gateway |Gateway IP configuration |No |Yes | No |No |
| Application gateway |Front-end configuration |Yes (V1 only) |Yes (V2 only) | No | No |
| Azure Firewall | Front-end configuration | No | Yes | No | No |
| Bastion Host | Public IP configuration | No | Yes | No | No |

## IP address version

Public IP addresses can be created with an IPv4 or IPv6 address. You may be given the option to create a dual-stack deployment with a IPv4 and IPv6 address.

## SKU

Public IP addresses are created with one of the following SKUs:

### Standard

Standard SKU public IP addresses:

- Always use static allocation method.
- Have an adjustable inbound originated flow idle timeout of 4-30 minutes, with a default of 4 minutes, and fixed outbound originated flow idle timeout of 4 minutes.
- Secure by default and closed to inbound traffic. Allowlist inbound traffic with a [network security group](./network-security-groups-overview.md#network-security-groups).
- Assigned to network interfaces, standard public load balancers, or Application Gateways. For more information about Azure load balancer, see [Azure Standard Load Balancer](../load-balancer/load-balancer-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
- Can be zone-redundant, which is advertised from all three zones. Zonal, which is guaranteed in a specific pre-selected availability zone. No-zone, which isn't associated with a specific pre-selected availability zone. To learn more about availability zones, see [Availability zones overview](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [Standard Load Balancer and Availability Zones](../load-balancer/load-balancer-standard-availability-zones.md?toc=%2fazure%2fvirtual-network%2ftoc.json). **Zone redundant IPs can only be created in [regions where three availability zones](../availability-zones/az-region.md) are live.** IPs created before zones are live won't be zone redundant.
- Can be utilized with the [routing preference](routing-preference-overview.md) to enable more granular control of how traffic is routed between Azure and the Internet.
- Can be used as anycast frontend IPs for [cross-region load balancers](../load-balancer/cross-region-overview.md) (preview functionality).
 
> [!NOTE]
> Inbound communication with a standard SKU resource fails until you create and associate a [network security group](./network-security-groups-overview.md#network-security-groups) and explicitly allow the desired inbound traffic.

> [!NOTE]
> Only public IP addresses with basic SKU are available when using [instance metadata service IMDS](../virtual-machines/windows/instance-metadata-service.md). Standard SKU is not supported.

> [!NOTE]
> Diagnostic settings don't appear under the resource blade when using a standard SKU public IP address. To enable logging on your standard public IP address resource, navigate to diagnostic settings under the Azure Monitor blade and select your IP address resource.

### Basic

Basic SKU addresses:

- For IPv4: Can be assigned using the dynamic or static allocation method.  For IPv6: Can only be assigned using the dynamic allocation method.
- Have an adjustable inbound originated flow idle timeout of 4-30 minutes, with a default of 4 minutes, and fixed outbound originated flow idle timeout of 4 minutes.
- Are open by default.  Network security groups are recommended but optional for restricting inbound or outbound traffic.
- Don't support Availability Zone scenarios. Use standard SKU public IP for Availability Zone scenarios in applicable regions. To learn more about availability zones, see [Availability zones overview](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [Standard Load Balancer and Availability Zones](../load-balancer/load-balancer-standard-availability-zones.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
- Don't support [routing preference](routing-preference-overview.md) or [cross-region load balancers](../load-balancer/cross-region-overview.md) functionality.

> [!NOTE]
> Basic SKU IPv4 addresses can be upgraded after creation to standard SKU.  To learn about SKU upgrade, refer to [Public IP upgrade](./public-ip-upgrade-portal.md).

>[!IMPORTANT]
> Matching SKUs are required for load balancer and public IP resources. You can't have a mixture of basic SKU resources and standard SKU resources. You can't attach standalone virtual machines, virtual machines in an availability set resource, or a virtual machine scale set resources to both SKUs simultaneously.  New designs should consider using Standard SKU resources.  Please review [Standard Load Balancer](../load-balancer/load-balancer-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) for details.

## IP address assignment

 Standard public IPv4, Basic public IPv4, and Standard public IPv6 addresses all support **static** assignment.  The resource is assigned an IP address at the time it's created. The IP address is released when the resource is deleted.  

> [!NOTE]
> Even when you set the allocation method to **static**, you cannot specify the actual IP address assigned to the public IP address resource. Azure assigns the IP address from a pool of available IP addresses in the Azure location the resource is created in.
>

Static public IP addresses are commonly used in the following scenarios:

* When you must update firewall rules to communicate with your Azure resources.
* DNS name resolution, where a change in IP address would require updating A records.
* Your Azure resources communicate with other apps or services that use an IP address-based security model.
* You use TLS/SSL certificates linked to an IP address.

Basic public IPv4 and IPv6 addresses support a **dynamic** assignment.  The IP address **isn't** given to the resource at the time of creation when selecting dynamic.  The IP is assigned when you associate the public IP address with a resource. The IP address is released when you stop, or delete the resource.   For example, a public IP resource is released from a resource named **Resource A**. **Resource A** receives a different IP on start-up if the public IP resource is reassigned. Any associated IP address is released if the allocation method is changed from **static** to **dynamic**. Set the allocation method to **static** to ensure the IP address remains the same.

> [!NOTE]
> Azure allocates public IP addresses from a range unique to each region in each Azure cloud. You can download the list of ranges (prefixes) for the Azure [Public](https://www.microsoft.com/download/details.aspx?id=56519), [US government](https://www.microsoft.com/download/details.aspx?id=57063), [China](https://www.microsoft.com/download/details.aspx?id=57062), and [Germany](https://www.microsoft.com/download/details.aspx?id=57064) clouds.
>

## DNS Name Label

Select this option to specify a DNS label for a public IP resource. This functionality works for both IPv4 addresses (32-bit A records) and IPv6 addresses (128-bit AAAA records).

### DNS hostname resolution

This selection creates a mapping for **domainnamelabel**.**location**.cloudapp.azure.com to the public IP in the Azure-managed DNS. 

For instance, creation of a public IP with:

* **contoso** as a **domainnamelabel**
* **West US** Azure **location**

The fully qualified domain name (FQDN) **contoso.westus.cloudapp.azure.com** resolves to the public IP address of the resource.

> [!IMPORTANT]
> Each domain name label created must be unique within its Azure location.  

### DNS Recommendations

You can't migrate the FQDN of your public IP between regions. Use the FQDN to create a custom CNAME record pointing to the public IP address. If a move to a different public IP is required, update the CNAME record.

You can use [Azure DNS](../dns/dns-custom-domain.md?toc=%2fazure%2fvirtual-network%2ftoc.json#public-ip-address) or an external DNS provider for your DNS Record.

## Other public IP address features

There are other attributes that can be used for a public IP address.  

* The Global **Tier** allows a public IP address to be used with cross-region load balancers. 
* The Internet **Routing Preference** option minimizes the time that traffic spends on the Microsoft network, lowering the egress data transfer cost.

> [!NOTE]
> At this time, both the **Tier** and **Routing Preference** feature are available for standard SKU IPv4 addresses only.  They also cannot be utilized on the same IP address concurrently.
>

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Limits 

The limits for IP addressing are listed in the full set of [limits for networking](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#networking-limits) in Azure. The limits are per region and per subscription. [Contact support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to increase above the default limits based on your business needs.

## Pricing

Public IP addresses have a nominal charge. To learn more about IP address pricing in Azure, review the [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses) page.

## Limitations for IPv6

* VPN gateways cannot be used in a virtual network with IPv6 enabled, either directly or peered with "UseRemoteGateway".
* Public IPv6 addresses are locked at an idle timeout of 4 minutes.
* Azure doesn't support IPv6 communication for containers.
* Use of IPv6-only virtual machines or virtual machines scale sets aren't supported. Each NIC must include at least one IPv4 IP configuration (dual-stack).
* When adding IPv6 to existing IPv4 deployments, IPv6 ranges can't be added to a virtual network with existing resource navigation links.
* Forward DNS for IPv6 is supported for Azure public DNS. Reverse DNS isn't supported.
* Routing Preference and cross-region load-balancing isn't supported.

For more information on IPv6 in Azure, see [here](./ipv6-overview.md).

## Next steps
* Learn about [Private IP Addresses in Azure](private-ip-addresses.md)
* [Deploy a VM with a static public IP using the Azure portal](virtual-network-deploy-static-pip-arm-portal.md)