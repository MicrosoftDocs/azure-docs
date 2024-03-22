---
title: Public IP addresses in Azure
titleSuffix: Azure Virtual Network
description: Learn about public IP addresses in Azure.
services: virtual-network
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: conceptual
author: mbender-ms
ms.author: mbender
ms.date: 08/24/2023
---

# Public IP addresses

>[!Important]
>On September 30, 2025, Basic SKU public IPs will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired/). If you are currently using Basic SKU public IPs, make sure to upgrade to Standard SKU public IPs prior to the retirement date. For guidance on upgrading, visit [Upgrading a basic public IP address to Standard SKU - Guidance](public-ip-basic-upgrade-guidance.md).

Public IP addresses allow Internet resources to communicate inbound to Azure resources. Public IP addresses enable Azure resources to communicate to Internet and public-facing Azure services. You dedicate the address to the resource until you unassign it. A resource without a public IP assigned can communicate outbound. Azure dynamically assigns an available IP address that isn't dedicated to the resource. For more information about outbound connections in Azure, see [Understand outbound connections](../../load-balancer/load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

In Azure Resource Manager, a [public IP](virtual-network-public-ip-address.md) address is a resource that has its own properties. 

The following resources can be associated with a public IP address:

* Virtual machine network interfaces

* Virtual Machine Scale Sets

* Public Load Balancers

* Virtual Network Gateways (VPN/ER)

* NAT gateways

* Application Gateways

* Azure Firewalls

* Bastion Hosts

* Route Servers

* Api Management

For Virtual Machine Scale Sets, use [Public IP Prefixes](public-ip-address-prefix.md).

## At-a-glance

The following table shows the property a public IP can be associated to a resource and the allocation methods. Public IPv6 support isn't available for all resource types at this time.

| Top-level resource | IP Address association | Dynamic IPv4 | Static IPv4 | Dynamic IPv6 | Static IPv6 |
| --- | --- | --- | --- | --- | --- |
| Virtual machine |Network interface |Yes | Yes | Yes | Yes |
| Public Load balancer |Front-end configuration |Yes | Yes | Yes |Yes |
| Virtual Network gateway (VPN) |Gateway IP configuration |Yes (non-AZ only) |Yes | No |No |
| Virtual Network gateway (ER) |Gateway IP configuration |Yes | Yes | Yes (preview) |No |
| NAT gateway |Gateway IP configuration |No |Yes | No |No |
| Application Gateway |Front-end configuration |Yes (V1 only) |Yes (V2 only) | No | No |
| Azure Firewall | Front-end configuration | No | Yes | No | No |
| Bastion Host | Public IP configuration | No | Yes | No | No |
| Route Server | Front-end configuration | No | Yes | No | No |
| Api Management | Front-end configuration | No | Yes | No | No |

## IP address version

Public IP addresses can be created with an IPv4 or IPv6 address. You may be given the option to create a dual-stack deployment with a IPv4 and IPv6 address.

## SKU

Public IP addresses are created with a SKU of **Standard** or **Basic**.  The SKU determines their functionality including allocation method, feature support, and resources they can be associated with.  Full details are listed in the table below:

| Public IP address | Standard  | Basic |
| --- | --- | --- |
| Allocation method| Static | For IPv4: Dynamic or Static; For IPv6: Dynamic.| 
| Idle Timeout | Have an adjustable inbound originated flow idle timeout of 4-30 minutes, with a default of 4 minutes, and fixed outbound originated flow idle timeout of 4 minutes.|Have an adjustable inbound originated flow idle timeout of 4-30 minutes, with a default of 4 minutes, and fixed outbound originated flow idle timeout of 4 minutes.|
| Security | Secure by default model and be closed to inbound traffic when used as a frontend.  Allow traffic with [network security group](../../virtual-network/network-security-groups-overview.md#network-security-groups) (NSG) is required (for example, on the NIC of a virtual machine with a Standard SKU Public IP attached).| Open by default.  Network security groups are recommended but optional for restricting inbound or outbound traffic.| 
| [Availability zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) | Supported. Standard IPs can be nonzonal, zonal, or zone-redundant. **Zone redundant IPs can only be created in [regions where 3 availability zones](../../availability-zones/az-region.md) are live.** IPs created before availability zones aren't zone redundant. | Not supported. | 
| [Routing preference](routing-preference-overview.md)| Supported to enable more granular control of how traffic is routed between Azure and the Internet. | Not supported.| 
| Global tier | Supported via [cross-region load balancers](../../load-balancer/cross-region-overview.md).| Not supported. |

> [!NOTE]
> Basic SKU IPv4 addresses can be upgraded after creation to Standard SKU.  To learn about SKU upgrade, refer to [Public IP upgrade](public-ip-upgrade-portal.md).

>[!IMPORTANT]
> Matching SKUs are required for load balancer and public IP resources. You can't have a mixture of basic SKU resources and standard SKU resources. You can't attach standalone virtual machines, virtual machines in an availability set resource, or a virtual machine scale set resources to both SKUs simultaneously.  New designs should consider using Standard SKU resources. For more information about a standard load balancer, see [Standard Load Balancer](../../load-balancer/load-balancer-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

## IP address assignment

Public IPs have two types of assignments:

- **Static** - The resource is assigned an IP address at the time it's created. The IP address is released when the resource is deleted. 

- **Dynamic** - The IP address **isn't** given to the resource at the time of creation when selecting dynamic.  The IP is assigned when you associate the public IP address with a resource. The IP address is released when you stop, or delete the resource.

**Static public IP addresses** are commonly used in the following scenarios:

* When you must update firewall rules to communicate with your Azure resources.

* DNS name resolution, where a change in IP address would require updating A records.

* Your Azure resources communicate with other apps or services that use an IP address-based security model.

* You use TLS/SSL certificates linked to an IP address.

> [!NOTE]
> Even when you set the allocation method to **static**, you cannot specify the actual IP address assigned to the public IP address resource. Azure assigns the IP address from a pool of available IP addresses in the Azure location the resource is created in.

**Basic public IP addresses** are commonly used for when there's no dependency on the IP address. 

For example, a public IP resource is released from a resource named **Resource A**. **Resource A** receives a different IP on start-up if the public IP resource is reassigned. Any associated IP address is released if the allocation method is changed from **static** to **dynamic**. Any associated IP address is unchanged if the allocation method is changed from **dynamic** to **static**. Set the allocation method to **static** to ensure the IP address remains the same.

| Resource | Static  | Dynamic |
| --- | --- | --- |
| Standard public IPv4 | :white_check_mark: | x |
| Standard public IPv6 | :white_check_mark: | x |
| Basic public IPv4 | :white_check_mark: | :white_check_mark: |
| Basic public IPv6 | x | :white_check_mark: |

## Domain Name Label

Select this option to specify a DNS label for a public IP resource. This functionality works for both IPv4 addresses (32-bit A records) and IPv6 addresses (128-bit AAAA records). This selection creates a mapping for **domainnamelabel**.**location**.cloudapp.azure.com to the public IP in the Azure-managed DNS. 

For instance, creation of a public IP with the following settings:

* **contoso** as a **domainnamelabel**

* **West US** Azure **location**

The fully qualified domain name (FQDN) **contoso.westus.cloudapp.azure.com** resolves to the public IP address of the resource.

> [!IMPORTANT]
> Each domain name label created must be unique within its Azure location.  

If a custom domain is desired for services that use a public IP, you can use [Azure DNS](../../dns/dns-custom-domain.md?toc=%2fazure%2fvirtual-network%2ftoc.json#public-ip-address) or an external DNS provider for your DNS Record.

## Domain Name Label Scope (preview)

Public IPs also have an optional parameter for **Domain Name Label Scope**, which defines what domain label an object with the same name will use. This feature can help to prevent "dangling DNS names" which can be reused by malicious actors.  When this option is chosen, the public IP address' DNS name will have an additional string in between the **domainnamelabel** and **location** fields, e.g. **contoso.fjdng2acavhkevd8.westus.cloudapp.Azure.com**.  (This string is a hash generated from input specific to your subscription, resource group, domain name label, and other properties.)

>[!Important]
> Domain Name Label Scope is currently in public preview.  It's provided without a service-level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The value of the **Domain Name Label Scope** must match one of the options below:

| Value | Behavior |
| --- | --- |
| TenantReuse |	Object with the same name in the same tenant will receive the same Domain Label |
| SubscriptionReuse	| Object with the same name in the same subscription will receive the same Domain Label |
| ResourceGroupReuse | Object with the same name in the same Resource Group will receive the same Domain Label |
| NoReuse | Object with the same name will receive a new Domain Label for each new instance |

For example, if **SubscriptionReuse** is selected as the option, and a customer who has the example domain name label **contoso.fjdng2acavhkevd8.westus.cloudapp.Azure.com** deletes and re-deploys a public IP address using the same template as before, the domain name label will remain the same.  If the customer deploys a public IP address using this same template under a different subscription, the domain name label would change (e.g. **contoso.c9ghbqhhbxevhzg9.westus.cloudapp.Azure.com**).

> [!IMPORTANT]
> The domain name label scope can only be specified at the creation of a public IP address.

## Availability Zone

Public IP addresses with a standard SKU can be created as nonzonal, zonal, or zone-redundant in [regions that support availability zones](../../availability-zones/az-region.md). 

A zone-redundant IP is created in all zones for a region and can survive any single zone failure. A zonal IP is tied to a specific availability zone, and shares fate with the health of the zone. A "nonzonal" public IP address is placed into a zone for you by Azure and doesn't give a guarantee of redundancy.

In regions without availability zones, all public IP addresses are created as nonzonal. Public IP addresses created in a region that is later upgraded to have availability zones remain nonzonal.  A public IP's availability zone can't be changed after the public IP's creation.

> [!NOTE]
> All basic SKU public IP addresses are created as non-zonal.  Any IP that is upgraded from a basic SKU to standard SKU remains non-zonal.

## Other public IP address features

There are other attributes that can be used for a public IP address.  

* The Global **Tier** option creates a global anycast IP that can be used with cross-region load balancers.

* The Internet **Routing Preference** option minimizes the time that traffic spends on the Microsoft network, lowering the egress data transfer cost.

> [!NOTE]
> At this time, both the **Tier** and **Routing Preference** feature are available for standard SKU IPv4 addresses only. They can't be utilized on the same IP address concurrently.
>

[!INCLUDE [ephemeral-ip-note.md](../../../includes/ephemeral-ip-note.md)]

## Limits 

The limits for IP addressing are listed in the full set of [limits for networking](../../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#networking-limits) in Azure. The limits are per region and per subscription. 

[Contact support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to increase above the default limits based on your business needs.

## Pricing

Public IPv4 addresses have a nominal charge; Public IPv6 addresses have no charge.

To learn more about IP address pricing in Azure, review the [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses) page.

## Limitations for IPv6

* VPN gateways can't be used in a virtual network with IPv6 enabled, either directly or peered with "UseRemoteGateway".

* Azure doesn't support IPv6 communication for containers.

* Use of IPv6-only virtual machines or virtual machines scale sets aren't supported. Each NIC must include at least one IPv4 IP configuration (dual-stack).

* IPv6 ranges can't be added to a virtual network with existing resource navigation links when adding IPv6 to existing IPv4 deployments.

* Forward DNS for IPv6 is supported for Azure public DNS. Reverse DNS isn't supported.

* Routing Preference Internet isn't supported.

For more information on IPv6 in Azure, see [here](ipv6-overview.md).

## Next steps

* Learn about [Private IP Addresses in Azure](private-ip-addresses.md)

* [Deploy a VM with a static public IP using the Azure portal](./virtual-network-deploy-static-pip-arm-portal.md)
