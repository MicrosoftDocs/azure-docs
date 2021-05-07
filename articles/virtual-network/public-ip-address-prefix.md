---
title: Azure Public IP address prefix
titleSuffix: Azure Virtual Network
description: Learn about what an Azure public IP address prefix is and how it can help you assign public IP addresses to your resources.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: conceptual
ms.date: 05/20/2021
ms.author: allensu

---

# Public IP address prefix

A public IP address prefix is a reserved, contiguous range of [public IP addresses](./public-ip-addresses.md#public-ip-addresses) in Azure.  Public IP prefixes are assigned from a [pool of addresses](https://www.microsoft.com/download/details.aspx?id=56519) in each Azure region. 

You create a public IP address prefix in an Azure region and subscription by specifying a name, and how many addresses you want the prefix to include.  Public IP address prefixes consist of IPv4 or IPv6 addresses.  Once you have the public IP address prefix, you can generate individual public IP addresses.

## Benefits

- Creation of static public IP address resources from a known range. Addresses that you create using from the prefix can be assigned to any Azure resource that you can assign a standard SKU public IP address.
- When you delete the individual public IPs, they are *returned* to your reserved range for later reuse. The IP addresses in your public IP address prefix are reserved for your use until you delete your prefix.
- You can see which IP addresses that are given and and available within the prefix range.

## Prefix sizes

The following public IP prefix sizes are available:

-  /28 (IPv4) or /127 (IPv6) = 16 addresses
-  /29 (IPv4) or /127 (IPv6) = 8 addresses
-  /30 (IPv4) or /127 (IPv6) = 4 addresses
-  /31 (IPv4) or /127 (IPv6) = 2 addresses

Prefix size is specified as a Classless Inter-Domain Routing (CIDR) mask size. For example, a mask of /128 represents an individual IPv6 address as IPv6 addresses are composed of 128 bits.

While there are no limits as to how many prefixes you can create, there are limits on the maximum number of static public IP addresses you can have in an Azure subscription. The number of ranges you create can't exceed more static public IP addresses than you can have in your subscription. For more information, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).

## Scenarios
You can associate the following resources to a static public IP address from a prefix:

|Resource|Scenario|Steps|
|---|---|---|
|Virtual machines| Associating public IPs from a prefix to your virtual machines in Azure reduces management overhead when adding IP addresses to an allow list in the firewall. You can add an entire prefix with a single firewall rule. As you scale with virtual machines in Azure, you can associate IPs from the same prefix saving cost, time, and management overhead.| To associate IPs from a prefix to your virtual machine: </br> 1. [Create a prefix.](manage-public-ip-address-prefix.md) </br> 2. [Create an IP from the prefix.](manage-public-ip-address-prefix.md) </br> 3. [Associate the IP to your virtual machine's network interface.](virtual-network-network-interface-addresses.md#add-ip-addresses) |
| Standard load balancers | Associating public IPs from a prefix to your frontend IP configuration or outbound rule of a load balancer ensures simplification of your Azure public IP address space. Simplify your scenario by grooming outbound connections from a range of contiguous IP addresses. | To associate IPs from a prefix to your load balancer: </br> 1. [Create a prefix.](manage-public-ip-address-prefix.md) </br> 2. [Create an IP from the prefix.](manage-public-ip-address-prefix.md) </br> 3. When creating the load balancer, select or update the IP created in step 2 above as the frontend IP of your load balancer. |
| Azure Firewall | You can use a public IP from a prefix for outbound SNAT. All outbound virtual network traffic is translated to the [Azure Firewall](../firewall/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) public IP. | To associate an IP from a prefix to your firewall: </br> 1. [Create a prefix.](manage-public-ip-address-prefix.md) </br> 2. [Create an IP from the prefix.](manage-public-ip-address-prefix.md) </br> 3. When you [deploy the Azure firewall](../firewall/tutorial-firewall-deploy-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json#deploy-the-firewall), be sure to select the IP you previously gave from the prefix.|
| VPN Gateway (AZ SKU), Application Gateway v2, NAT Gateway | You can use a public IP from a prefix for your gateway | To associate an IP from a prefix to your gateway: </br> 1. [Create a prefix.](manage-public-ip-address-prefix.md) </br> 2. [Create an IP from the prefix.](manage-public-ip-address-prefix.md) </br> 3. When you deploy the [VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/tutorial-create-gateway-portal), [Application Gateway](../application-gateway/quick-create-portal.md#create-an-application-gateway), or [NAT Gateway](https://docs.microsoft.com/azure/virtual-network/tutorial-create-nat-gateway-portal), be sure to select the IP you previously gave from the prefix.|

Additionally, the Public IP address prefix resource can be utilized directly by certain resources:

Resource|Scenario|Steps|
|---|---|---|
|Virtual machine scale sets | You can use a public IP address Prefix to generate instance-level IPs in a Virtual Machine Scale Set, though individual Public IP resources will not be created. | Utilize a [template](https://azure.microsoft.com/resources/templates/101-vmms-with-public-ip-prefix/) with instructions to use this prefix for public IP configuration as part of the scale set creation. |
| Standard load balancers | A public IP address prefix can be use to scale a load balancer deployment by [utilizing all public IP addresses in the range for outbound connections](https://docs.microsoft.com/azure/load-balancer/outbound-rules#scale). | To associate a prefix to your load balancer: </br> 1. [Create a prefix.](manage-public-ip-address-prefix.md) </br> 2. When creating the load balancer, select the IP prefix as associated with the frontend of your load balancer. |
| NAT Gateway | Similarly to a load balancer, a public IP address prefix can be used to scale a NAT gateway deployment by utilizing the public IP addresses in the range for outbound flows. | To associate a prefix to your NAT Gateway: </br> 1. [Create a prefix.](manage-public-ip-address-prefix.md) </br> 2. When creating the NAT Gateway, select the IP prefix as the Outbound IP. |
| VPN Gateway (AZ SKU) or Application Gateway v2 | You can use a public IP from a prefix for your zone-redundant VPN or Application gateway v2. | To associate an IP from a prefix to your gateway: </br> 1. [Create a prefix.](manage-public-ip-address-prefix.md) </br> 2. [Create an IP from the prefix.](manage-public-ip-address-prefix.md) </br> 3. When you deploy the [VPN Gateway](../vpn-gateway/tutorial-create-gateway-portal.md) or [Application Gateway](../application-gateway/quick-create-portal.md#create-an-application-gateway), be sure to select the IP you previously gave from the prefix.|

## Constraints

- You can't specify the IP addresses for the prefix. Azure gives the IP addresses for the prefix, based on the size that you specify.  Additionally, all public IP addresses created from the prefix must exist in the same Azure region and subscription as the prefix. Addresses must be assigned to resources in the same region and subscription.
- You can create a prefix of up to 16 IP addresses. Review [Network limits increase requests](../azure-portal/supportability/networking-quota-requests.md) and [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) for more information.
- The size of the range cannot be modified after the prefix has been created.
- Only static public IP addresses created with the Standard SKU can be assigned from the prefix's range. To learn more about public IP address SKUs, see [public IP address](./public-ip-addresses.md#public-ip-addresses).
- Addresses from the range can only be assigned to Azure Resource Manager resources. Addresses can't be assigned to resources in the classic deployment model.
- You can't delete a prefix if any addresses within it are assigned to public IP address resources associated to a resource. Dissociate all public IP address resources that are assigned IP addresses from the prefix first.  For more information on disassociating public IP addresses, see[Manage public IP addresses](https://docs.microsoft.com/azure/virtual-network/virtual-network-public-ip-address#view-modify-settings-for-or-delete-a-public-ip-address).
- Public IP address prefixes are not currently compatible with *Internet* **Routing Preference** or *Global* **Tier** (for Cross-Region Load Balancing).

## Pricing
 
For costs associated with using Azure Public IPs, both individual IP addresses and IP ranges, see [Public IP Address pricing](https://azure.microsoft.com/pricing/details/ip-addresses/).

## Next steps

- [Create](manage-public-ip-address-prefix.md) a public IP address prefix