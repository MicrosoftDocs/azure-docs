---
title: Azure Public IP address prefix
description: Learn about what an Azure public IP address prefix is and how it can help you assign predictable public IP addresses to your resources.
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.subservice: ip-services
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/08/2020
ms.author: allensu

---

# Public IP address prefix

A public IP address prefix is a reserved range of IP addresses for your public endpoints in Azure. Azure allocates a contiguous range of addresses to your subscription based on how many you specify. If you're not familiar with public addresses, see [Public IP addresses.](virtual-network-ip-addresses-overview-arm.md#public-ip-addresses)

Public IP addresses are assigned from a pool of addresses in each Azure region. You can [download](https://www.microsoft.com/download/details.aspx?id=56519) the list of ranges Azure uses for each region. For example, 40.121.0.0/16 is one of over 100 ranges Azure uses in the East US region. The range includes the usable addresses of 40.121.0.1 - 40.121.255.254.

You create a public IP address prefix in an Azure region and subscription by specifying a name, and how many addresses you want the prefix to include. For example, If you create a public IP address prefix of /28, Azure allocates 16 addresses from one of its ranges for you. You don't know which range Azure will assign until you create the range, but the addresses are contiguous. Public IP address prefixes have a fee. For details, see [public IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses).

## Why create a public IP address prefix?

When you create public IP address resources, Azure assigns an available public IP address from any of the ranges used in the region. Once Azure assigns the address, you know what the address is, but until Azure assigns the address, you don't know what address might be assigned. This can be problematic when, for example, you, or your business partners, setup firewall rules that allow specific IP addresses. Each time you assign a new public IP address to a resource, the address has to be added to the firewall rule. When you assign addresses to your resources from a public IP address prefix, firewall rules don't need to be updated each time you assign one of the addresses, because the whole range could be added to a rule.

## Benefits

- You can create public IP address resources from a known range.
- You, or your business partners can create firewall rules with ranges that include public IP addresses you've currently assigned, as well as addresses you haven't assigned yet. This eliminates the need to change firewall rules as you assign IP addresses to new resources.
- The default size of a range you can create is /28 or 16 IP addresses.
- There are no limits as to how many ranges you can create, however, there are limits on the maximum number of static public IP addresses you can have in an Azure subscription. As a result, the number of ranges you create can't encompass more static public IP addresses than you can have in your subscription. For more information, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits).
- The addresses that you create using addresses from the prefix can be assigned to any Azure resource that you can assign a public IP address to.
- You can easily see which IP addresses that are allocated and not yet allocated within the range.

## Scenarios
You can associate the following resources to a static public IP address from a prefix:

|Resource|Scenario|Steps|
|---|---|---|
|Virtual Machines| Associating public IPs from a prefix to your virtual machines in Azure reduces management overhead when it comes to whitelisting IPs in a firewall. You can simply whitelist an entire prefix with a single firewall rule. As you scale with virtual machines in Azure, you can associate IPs from the same prefix saving cost, time, and management overhead.| To associate IPs from a prefix to your virtual machine: 1. [Create a prefix.](manage-public-ip-address-prefix.md) 2. [Create an IP from the prefix.](manage-public-ip-address-prefix.md) 3. [Associate the IP to your virtual machine's network interface.](virtual-network-network-interface-addresses.md#add-ip-addresses) You can also [associate the IPs to a Virtual Machine Scale Set](https://azure.microsoft.com/resources/templates/101-vmms-with-public-ip-prefix/).
| Standard Load Balancers | Associating public IPs from a prefix to your frontend IP configuration or outbound rule of a Load Balancer ensures simplification of your Azure public IP address space. You can simplify your scenario by grooming outbound connections to be originated from a range of contiguous IP addresses defined by  public IP prefix. | To associate IPs from a prefix to your Load balancer: 1. [Create a prefix.](manage-public-ip-address-prefix.md) 2. [Create an IP from the prefix.](manage-public-ip-address-prefix.md) 3. When creating the Load Balancer, select or update the IP created in step 2 above as the frontend IP of your Load Balancer. |
| Azure Firewall | You can use a public IP from a prefix for outbound SNAT. This means all outbound virtual network traffic is translated to the [Azure Firewall](../firewall/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) public IP. Since this IP comes from a predetermined prefix, it is very easy to know ahead of time what your public IP footprint in Azure will look like. | 1. [Create a prefix.](manage-public-ip-address-prefix.md) 2. [Create an IP from the prefix.](manage-public-ip-address-prefix.md) 3. When you [deploy the Azure firewall](../firewall/tutorial-firewall-deploy-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json#deploy-the-firewall), be sure to select the IP you previously allocated from the prefix.|
| Application Gateway v2 | You can use a public IP from a prefix for your autoscaling and zone-redundant Application gateway v2. Since this IP comes from a predetermined prefix, it is very easy to know ahead of time what your public IP footprint in Azure will look like. | 1. [Create a prefix.](manage-public-ip-address-prefix.md) 2. [Create an IP from the prefix.](manage-public-ip-address-prefix.md) 3. When you [deploy the Application Gateway](../application-gateway/quick-create-portal.md#create-an-application-gateway), be sure to select the IP you previously allocated from the prefix.|

## Constraints

- You can't specify the IP addresses for the prefix. Azure allocates the IP addresses for the prefix, based on the size that you specify.
- You can create a prefix of up to 16 IP addresses or a /28 by default. Review [Network limits increase requests](https://docs.microsoft.com/azure/azure-portal/supportability/networking-quota-requests) and [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) for more information.
- You can't change the range, once you've created the prefix.
- Only static public IP addresses created with the Standard SKU can be assigned from the prefix's range. To learn more about public IP address SKUs, see [public IP address](virtual-network-ip-addresses-overview-arm.md#public-ip-addresses).
- Addresses from the range can only be assigned to Azure Resource Manager resources. Addresses cannot be assigned to resources in the classic deployment model.
- All public IP addresses created from the prefix must exist in the same Azure region and subscription as the prefix, and must be assigned to resources in the same region and subscription.
- You can't delete a prefix if any addresses within it are assigned to public IP address resources associated to a resource. Dissociate all public IP address resources that are assigned IP addresses from the prefix first.


## Next steps

- [Create](manage-public-ip-address-prefix.md) a public IP address prefix
