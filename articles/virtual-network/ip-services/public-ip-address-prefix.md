---
title: Azure Public IP address prefix
titleSuffix: Azure Virtual Network
description: Learn about what an Azure public IP address prefix is and how it can help you assign public IP addresses to your resources.
services: virtual-network
author: mbender-ms
ms.author: mbender
ms.date: 08/24/2023
ms.service: virtual-network
ms.subservice: ip-services
ms.custom: devx-track-linux
ms.topic: conceptual
---

# Public IP address prefix

A public IP address prefix is a reserved range of [public IP addresses](public-ip-addresses.md#public-ip-addresses) in Azure. Public IP prefixes are assigned from a pool of addresses in each Azure region. 
You create a public IP address prefix in an Azure region and subscription by specifying a name and prefix size. The prefix size is the number of addresses available for use. Public IP address prefixes consist of IPv4 or IPv6 addresses.  In regions with Availability Zones, Public IP address prefixes can be created as zone-redundant or associated with a specific availability zone.  After the public IP prefix is created, you can create public IP addresses.

## Benefits

- Creation of static public IP address resources from a known range. Addresses that you create using from the prefix can be assigned to any Azure resource that you can assign a standard SKU public IP address.

- When you delete the individual public IPs, they're *returned* to your reserved range for later reuse. The IP addresses in your public IP address prefix are reserved for your use until you delete your prefix.

- You can see which IP addresses that are given and available within the prefix range.

## Prefix sizes

The following public IP prefix sizes are available:

-  /28 (IPv4) or /124 (IPv6) = 16 addresses

-  /29 (IPv4) or /125 (IPv6) = 8 addresses

-  /30 (IPv4) or /126 (IPv6) = 4 addresses

-  /31 (IPv4) or /127 (IPv6) = 2 addresses

Prefix size is specified as a Classless Inter-Domain Routing (CIDR) mask size.

>[!NOTE]
>If you are [deriving a Public IP Prefix from a Custom IP Prefix (BYOIP range)](manage-custom-ip-address-prefix.md#create-a-public-ip-prefix-from-a-custom-ip-prefix), the prefix size can be as large as the Custom IP Prefix.

There aren't limits as to how many prefixes created in a subscription. The number of ranges created can't exceed more static public IP addresses than allowed in your subscription. For more information, see [Azure limits](../../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

## Scenarios
You can associate the following resources to a static public IP address from a prefix:

|Resource|Scenario|Steps|
|---|---|---|
|Virtual machines| Associating public IPs from a prefix to your virtual machines in Azure reduces management overhead when adding IP addresses to an allowlist in the firewall. You can add an entire prefix with a single firewall rule. As you scale with virtual machines in Azure, you can associate IPs from the same prefix saving cost, time, and management overhead.| To associate IPs from a prefix to your virtual machine: </br> 1. [Create a prefix.](manage-public-ip-address-prefix.md) </br> 2. [Create an IP from the prefix.](manage-public-ip-address-prefix.md) </br> 3. [Associate the IP to your virtual machine's network interface.](./virtual-network-network-interface-addresses.md#add-ip-addresses) </br> You can also [associate the IPs to a Virtual Machine Scale Set](https://azure.microsoft.com/resources/templates/vmss-with-public-ip-prefix/).
| Standard load balancers | Associating public IPs from a prefix to your frontend IP configuration or outbound rule of a load balancer ensures simplification of your Azure public IP address space. Simplify your scenario by grooming outbound connections from a range of contiguous IP addresses. | To associate IPs from a prefix to your load balancer: </br> 1. [Create a prefix.](manage-public-ip-address-prefix.md) </br> 2. [Create an IP from the prefix.](manage-public-ip-address-prefix.md) </br> 3. When creating the load balancer, select or update the IP created in step 2 above as the frontend IP of your load balancer. |
| Azure Firewall | You can use a public IP from a prefix for outbound SNAT. All outbound virtual network traffic is translated to the [Azure Firewall](../../firewall/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) public IP. | To associate an IP from a prefix to your firewall: </br> 1. [Create a prefix.](manage-public-ip-address-prefix.md) </br> 2. [Create an IP from the prefix.](manage-public-ip-address-prefix.md) </br> 3. When you [deploy the Azure firewall](../../firewall/tutorial-firewall-deploy-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json#deploy-the-firewall), be sure to select the IP you previously gave from the prefix.|
| VPN Gateway (AZ SKU), Application Gateway v2, NAT Gateway | You can use a public IP from a prefix for your gateway | To associate an IP from a prefix to your gateway: </br> 1. [Create a prefix.](manage-public-ip-address-prefix.md) </br> 2. [Create an IP from the prefix.](manage-public-ip-address-prefix.md) </br> 3. When you deploy the [VPN Gateway](../../vpn-gateway/tutorial-create-gateway-portal.md), [Application Gateway](../../application-gateway/quick-create-portal.md#create-an-application-gateway), or [NAT Gateway](../nat-gateway/quickstart-create-nat-gateway-portal.md), be sure to select the IP you previously gave from the prefix.|

The following resources utilize a public IP address prefix:

Resource|Scenario|Steps|
|---|---|---|
|Virtual Machine Scale Sets | You can use a public IP address prefix to generate instance-level IPs in a Virtual Machine Scale Set. Individual public IP resources aren't created. | Use a [template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/vmss-with-public-ip-prefix) with instructions to use this prefix for public IP configuration as part of the scale set creation. (Zonal properties of the prefix are passed to the instance IPs and aren't shown in the output. For more information, see [Networking for Virtual Machine Scale Sets](../../virtual-machine-scale-sets/virtual-machine-scale-sets-networking.md#public-ipv4-per-virtual-machine)) |
| Standard load balancers | A public IP address prefix can be used to scale a load balancer by [using all IPs in the range for outbound connections](../../load-balancer/outbound-rules.md#scale). | To associate a prefix to your load balancer: </br> 1. [Create a prefix.](manage-public-ip-address-prefix.md) </br> 2. When creating the load balancer, select the IP prefix as associated with the frontend of your load balancer. |
| NAT Gateway | A public IP prefix can be used to scale a NAT gateway by using the public IPs in the prefix for outbound connections. | To associate a prefix to your NAT Gateway: </br> 1. [Create a prefix.](manage-public-ip-address-prefix.md) </br> 2. When creating the NAT Gateway, select the IP prefix as the Outbound IP.  (A NAT Gateway can have no more than 16 IPs in total. A public IP prefix of /28 length is the maximum size that can be used.) |

## Limitations

- You can't specify the set of IP addresses for the prefix (though you can [specify which IP you want from the prefix](manage-public-ip-address-prefix.md#create-a-static-public-ip-address-from-a-prefix)). Azure gives the IP addresses for the prefix, based on the size that you specify.  Additionally, all public IP addresses created from the prefix must exist in the same Azure region and subscription as the prefix. Addresses must be assigned to resources in the same region and subscription.

- You can create a prefix of up to 16 IP addresses for Microsoft owned prefixes. Review [Network limits increase requests](../../azure-portal/supportability/networking-quota-requests.md) and [Azure limits](../../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) for more information.

- The size of the range can't be modified after the prefix has been created.

- Only static public IP addresses created with the standard SKU can be assigned from the prefix's range. To learn more about public IP address SKUs, see [public IP address](public-ip-addresses.md#public-ip-addresses).

- Addresses from the range can only be assigned to Azure Resource Manager resources. Addresses can't be assigned to resources in the classic deployment model.

- You can't delete a prefix if any addresses within it are assigned to public IP address resources associated to a resource. Dissociate all public IP address resources that are assigned IP addresses from the prefix first. For more information on disassociating public IP addresses, see [Manage public IP addresses](virtual-network-public-ip-address.md#view-modify-settings-for-or-delete-a-public-ip-address).

- IPv6 is supported on basic public IPs with **dynamic** allocation only. Dynamic allocation means the IPv6 address changes if you delete and redeploy your resource in Azure. 

- Standard IPv6 public IPs support static (reserved) allocation. 

- Standard internal load balancers support dynamic allocation from within the subnet to which they're assigned.

## Pricing
 
For costs associated with using Azure Public IPs, both individual IP addresses and IP ranges, see [Public IP Address pricing](https://azure.microsoft.com/pricing/details/ip-addresses/).

## Next steps

- [Create](manage-public-ip-address-prefix.md) a public IP address prefix
