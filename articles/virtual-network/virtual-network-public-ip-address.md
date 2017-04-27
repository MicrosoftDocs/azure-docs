---
title: Azure public IP addresses | Microsoft Docs
description: Learn how to create, modify, and delete public IP addresses.
services: virtual-network
documentationcenter: na
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: bb71abaf-b2d9-4147-b607-38067a10caf6 
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/14/2017
ms.author: jdial

---

# Public IP addresses

Learn about public IP addresses and how to create, change, and delete them. A public IP address is a resource with its own configurable settings. Assigning a public IP address to other Azure resources enables:
- Inbound Internet connectivity to resources such as Azure Virtual Machines (VM), Azure Virtual Machine Scale Sets, Azure VPN Gateway, and Internet-facing Azure Load Balancers.
- Outbound connectivity to the Internet that is not network address translated (NAT). For example, a VM can communicate outbound to the Internet without a public IP address assigned to it, but its address is network address translated by Azure. To learn more about outbound connections from Azure resources, read the [Understand outbound connections](../load-balancer/load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article.

This article explains how to work with public IP addresses. This article applies to resources deployed through the Azure Resource Manager deployment model. Though public IP addresses can be assigned to resources deployed through the classic deployment model, the addresses are applied differently than they are through Resource Manager. Read the [Understand Azure deployment models](../azure-resource-manager/resource-manager-deployment-model.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article if you're not familiar with the differences between the two models.

The remaining sections of this article list steps to complete all public IP address-related tasks. Each section lists:
- Steps to complete the task within the Azure portal. To complete the steps, you must be logged in to the [Azure portal](http://portal.azure.com). Sign up for a [free trial account](https://azure.microsoft.com/free) if you don't already have one.
- Commands to complete the task using Azure PowerShell with links to the command reference for the command. Install and configure PowerShell by completing the steps in the [How to Install and Configure Azure PowerShell](/powershell/azure/overview) article. To get help for PowerShell commands, with examples, type `get-help <command> -full`.
- Commands to complete the task using the Azure Command-line interface (CLI) with links to the command reference for the command. Install the Azure CLI by completing the steps in the [How to Install and Configure the Azure CLI 2.0](/cli/azure/install-azure-cli?toc=%2fazure%2fvirtual-network%2ftoc.json) article. To get help for CLI commands, type `az <command> -h`.

Public IP addresses have a nominal charge. To view the pricing, read the [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses) page. There are limits to the number of public IP addresses you can use within a subscription. To view the limits, read the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article. 

Complete the steps in the following sections to create, change, or delete public IP address resources:

## <a name="create"></a>Create a public IP address

To create a public IP address, complete the following steps:
1. Log in to the [Azure portal](https://portal.azure.com) with an account that is assigned (at a minimum) permissions for the Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles and permissions to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *public ip address*. When **Public IP addresses** appears in the search results, click it.
3. Click **+ Add** in the **Public IP address** blade that appears.
4. Enter or select values for the following settings in the **Create public IP address** blade that appears, then click **Create**:

	|**Setting**|Required?|**Details**|
	|---|---|---|
	|**Name**|Yes|The name must be unique within the resource group you select.|
	|**IP address assignment**|Yes|**Dynamic:** Dynamic addresses are assigned only after the public IP address is associated to a NIC attached to a VM and the VM is started for the first time. Dynamic addresses can change if the VM the NIC is attached to is stopped (deallocated). The address remains the same if the VM is rebooted or stopped (but not deallocated). **Static:** Static addresses are assigned when the public IP address is created. Static addresses do not change even if the VM is put in the stopped (deallocated) state. The address is only released when the NIC is deleted. You can change the assignment method after the NIC is created.|
	|**Idle timeout (minutes)**|No|How many minutes to keep a TCP or HTTP connection open without relying on clients to send keep-alive messages.|
	|**DNS name label**|No|Must be unique within the Azure location you create the name in (across all subscriptions and all customers). The Azure public DNS service automatically registers the name and IP address so you can connect to a resource with the name. Azure appends *location.cloudapp.azure.com* (where location is the location you select) to the name you provide to create the fully-qualifed DNS name. |
	|**Subscription**|Yes|Must exist in the same subscription as the resource you want to associate the public IP address to.|
	|**Resource group**|Yes|Can exist in the same, or different, resource group as the resource you want to associate the public IP address to.|
	|**Location**|Yes|Must exist in the same location as the resource you want to associate the public IP address to.|

|**Tool**|**Command**|
|---|---|
|**CLI**|[az network public-ip-create](/cli/azure/network/public-ip?toc=%2fazure%2fvirtual-network%2ftoc.json#create)|
|**PowerShell**|[New-AzureRmPublicIpAddress](/powershell/module/azurerm.network/new-azurermpublicipaddress)|

## <a name="change"></a>Change settings or delete a public IP address

To change or delete a public IP address, complete the following steps:

1. Log in to the [Azure portal](https://portal.azure.com) with an account that is assigned (at a minimum) permissions for the Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles and permissions to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *public ip address*. When **Public IP addresses** appears in the search results, click it.
3. In the **Public IP addresses** blade that appears, click the name of the public IP address you want to change settings for or delete.
4. In the blade that appears for the public IP address, complete one of the following options depending on whether you want to delete or change the public IP address.
	- **Delete:** To delete the public IP address, click **Delete** in the **Overview** section of the blade. If the address is currently associated to an IP configuration, it cannot be deleted. If the address is currently associated with a configuration, click **Dissociate** to dissociate the address from the IP configuration.
	- **Change:** Click **Configuration**. Change settings using the information in step 4 of the [Create a public IP address](#create) section of this article. To change the assignment from static to dynamic, you must first dissociate the public IP address from the IP configuration it's associated to. You can then change the assignment method to dynamic and click **Associate** to associate the IP address to the same IP configuration, a different configuration, or you can leave it dissociated. To dissociate a public IP address, in the **Overview** section, click **Dissociate**.

>[!WARNING]
>When you change the assignment method from static to dynamic, you lose the IP address that was assigned to the public IP address. While the Azure public DNS servers maintain a mapping between static or dynamic addresses and any DNS name label (if you defined one), a dynamic IP address can change when the VM is started after being in the stopped (deallocated) state. To prevent the address from changing, assign a static IP address.

|**Tool**|**Command**|
|---|---|
|**CLI**|[az network public-ip update](/cli/azure/network/public-ip?toc=%2fazure%2fvirtual-network%2ftoc.json#update) to update; [az network public-ip delete](/cli/azure/network/public-ip?toc=%2fazure%2fvirtual-network%2ftoc.json#delete) to delete|
|**PowerShell**|[Set-AzureRmPublicIpAddress](/powershell/resourcemanager/azurerm.network/v3.4.0/set-azurermpublicipaddress?toc=%2fazure%2fvirtual-network%2ftoc.json) to update; [Remove-AzureRmPublicIpAddress](/powershell/module/azurerm.network/remove-azurermpublicipaddress) to delete|

## <a name="next-steps"></a>Next steps
Assign public IP addresses when creating the following Azure resources:

- [Windows](../virtual-machines/virtual-machines-windows-hero-tutorial.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machines
- [Internet-facing Azure Load Balancer](../load-balancer/load-balancer-get-started-internet-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [Azure Application Gateway](../application-gateway/application-gateway-create-gateway-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [Site-to-site connection using an Azure VPN Gateway](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [Azure Virtual Machine Scale Set](../virtual-machine-scale-sets/virtual-machine-scale-sets-portal-create.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
