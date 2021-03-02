---
title: Azure Public IP address prefix
description: Learn about what an Azure public IP address prefix is and how it can help you assign predictable public IP addresses to your resources.
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.subservice: ip-services
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/29/2020
ms.author: allensu

---

# Public IP address prefix

A public IP address prefix is a reserved range of IP addresses in Azure. Azure gives a contiguous range of addresses to your subscription based on how many you specify. 

If you're not familiar with public addresses, see [Public IP addresses.](./public-ip-addresses.md#public-ip-addresses)

Public IP addresses are assigned from a pool of addresses in each Azure region. You can [download](https://www.microsoft.com/download/details.aspx?id=56519) the list of ranges Azure uses for each region. For example, 40.121.0.0/16 is one of over 100 ranges Azure uses in the East US region. The range includes the usable addresses of 40.121.0.1 - 40.121.255.254.

You create a public IP address prefix in an Azure region and subscription by specifying a name, and how many addresses you want the prefix to include. 

Public IP address ranges are assigned with a prefix of your choosing. If you create a prefix of /28, Azure gives 16 ip addresses from one of its ranges.

You don't know which range Azure will assign until you create the range, but the addresses are contiguous. 

Public IP address prefixes have a fee, for more information, see [public IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses).

## Why create a public IP address prefix?

When you create public IP address resources, Azure assigns an available public IP address from any of the ranges used in that region. 

Until Azure assigns the IP address, you won't know the exact IP. This process can be problematic when you create firewall rules that allow specific IP addresses. For every IP address added, a corresponding firewall rule must be added.

When you assign addresses to your resources from a public IP address prefix, firewall rule updates aren't required. The entire range is added to the rule.

## Benefits

- Creation of public IP address resources from a known range.
- Firewall rule configuration with ranges that include public IP addresses you've currently assigned, and addresses you haven't assigned yet. This configuration eliminates the need to change firewall rules as you assign IP addresses to new resources.
- The default size of a range you can create is /28 or 16 IP addresses.
- There aren't limits as to how many ranges you can create. There are limits on the maximum number of static public IP addresses you can have in an Azure subscription. The number of ranges you create can't encompass more static public IP addresses than you can have in your subscription. For more information, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).
- The addresses that you create using addresses from the prefix can be assigned to any Azure resource that you can assign a public IP address to.
- You can easily see which IP addresses that are given and not given within the range.

## Scenarios
You can associate the following resources to a static public IP address from a prefix:

|Resource|Scenario|Steps|
|---|---|---|
|Virtual machines| Associating public IPs from a prefix to your virtual machines in Azure reduces management overhead when adding IP addresses to an allow list in the firewall. You can add an entire prefix with a single firewall rule. As you scale with virtual machines in Azure, you can associate IPs from the same prefix saving cost, time, and management overhead.| To associate IPs from a prefix to your virtual machine: </br> 1. [Create a prefix.](manage-public-ip-address-prefix.md) </br> 2. [Create an IP from the prefix.](manage-public-ip-address-prefix.md) </br> 3. [Associate the IP to your virtual machine's network interface.](virtual-network-network-interface-addresses.md#add-ip-addresses) </br> You can also [associate the IPs to a Virtual Machine Scale Set](https://azure.microsoft.com/resources/templates/101-vmms-with-public-ip-prefix/).
| Standard load balancers | Associating public IPs from a prefix to your frontend IP configuration or outbound rule of a load balancer ensures simplification of your Azure public IP address space. Simplify your scenario by grooming outbound connections from a range of contiguous IP addresses. | To associate IPs from a prefix to your load balancer: </br> 1. [Create a prefix.](manage-public-ip-address-prefix.md) </br> 2. [Create an IP from the prefix.](manage-public-ip-address-prefix.md) </br> 3. When creating the load balancer, select or update the IP created in step 2 above as the frontend IP of your load balancer. |
| Azure Firewall | You can use a public IP from a prefix for outbound SNAT. All outbound virtual network traffic is translated to the [Azure Firewall](../firewall/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) public IP. | To associate an IP from a prefix to your firewall: </br> 1. [Create a prefix.](manage-public-ip-address-prefix.md) </br> 2. [Create an IP from the prefix.](manage-public-ip-address-prefix.md) </br> 3. When you [deploy the Azure firewall](../firewall/tutorial-firewall-deploy-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json#deploy-the-firewall), be sure to select the IP you previously gave from the prefix.|
| VPN Gateway (AZ SKU) or Application Gateway v2 | You can use a public IP from a prefix for your zone-redundant VPN or Application gateway v2. | To associate an IP from a prefix to your gateway: </br> 1. [Create a prefix.](manage-public-ip-address-prefix.md) </br> 2. [Create an IP from the prefix.](manage-public-ip-address-prefix.md) </br> 3. When you deploy the [VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/tutorial-create-gateway-portal) or [Application Gateway](../application-gateway/quick-create-portal.md#create-an-application-gateway), be sure to select the IP you previously gave from the prefix.|

## Constraints

- You can't specify the IP addresses for the prefix. Azure gives the IP addresses for the prefix, based on the size that you specify.
- You can create a prefix of up to 16 IP addresses or a /28 by default. Review [Network limits increase requests](../azure-portal/supportability/networking-quota-requests.md) and [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) for more information.
- You can't change the range, once you've created the prefix.
- Only static public IP addresses created with the Standard SKU can be assigned from the prefix's range. To learn more about public IP address SKUs, see [public IP address](./public-ip-addresses.md#public-ip-addresses).
- Addresses from the range can only be assigned to Azure Resource Manager resources. Addresses can't be assigned to resources in the classic deployment model.
- All public IP addresses created from the prefix must exist in the same Azure region and subscription as the prefix. Addresses must be assigned to resources in the same region and subscription.
- You can't delete a prefix if any addresses within it are assigned to public IP address resources associated to a resource. Dissociate all public IP address resources that are assigned IP addresses from the prefix first.


## Next steps

- [Create](manage-public-ip-address-prefix.md) a public IP address prefix