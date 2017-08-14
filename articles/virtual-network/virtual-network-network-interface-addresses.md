---
title: Configure IP addresses for Azure network interfaces | Microsoft Docs
description: Learn how to add, change, and remove public and private IP addresses to NICs.
services: virtual-network
documentationcenter: na
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/04/2017
ms.author: jdial

---

# Add, change, or remove IP addresses for Azure network interfaces

Learn how to add, change, and remove public and private IP addresses for network interfaces (NIC). Private IP addresses assigned to a NIC enable a VM to communicate to the Internet and with other resources connected to an Azure virtual network (VNet). Public IP addresses assigned to a NIC enable inbound communication to a VM from the Internet. 

If you need to create, change, or delete NICs, read the [NIC settings and tasks](virtual-network-network-interface.md) article. If you need to add NICs to or remove NICs from virtual machines, read the [Add or remove NICs](virtual-network-network-interface-vm.md) article. 


## <a name="before"></a>Before you begin

Complete the following tasks before completing any steps in any section of this article:

- Review the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article to learn about limits for public and private IP addresses.
- Log in to the Azure portal, Azure command-line interface (CLI), or Azure PowerShell with an Azure account. If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If using PowerShell commands to complete tasks in this article, install and configure Azure PowerShell by completing the steps in the [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs?toc=%2fazure%2fvirtual-network%2ftoc.json) article. Ensure you have the most recent version of the Azure PowerShell commandlets installed. To get help for PowerShell commands, with examples, type `get-help <command> -full`.
- If using Azure Command-line interface (CLI) commands to complete tasks in this article, install and configure the Azure CLI by completing the steps in the [How to install and configure the Azure CLI](/cli/azure/install-azure-cli?toc=%2fazure%2fvirtual-network%2ftoc.json) article. Ensure you have the most recent version of the Azure CLI installed. To get help for CLI commands, type `az <command> --help`.

## <a name="about"></a>About NICs and IP addresses

Each NIC can be assigned multiple private and public IP addresses, within the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits). Assigning multiple IP addresses to a NIC is helpful in scenarios such as:
- Hosting multiple websites or services with different IP addresses and SSL certificates on a single server.
- A VM serving as a network virtual appliance, such as a firewall or load balancer.
- The ability to add any of the private IP addresses for any of the NICs to an Azure Load Balancer back-end pool. In the past, only the primary IP address for the primary NIC could be added to a back-end pool. To learn more about how to load balance multiple IP configurations, read the [Load balancing multiple IP configurations](../load-balancer/load-balancer-multiple-ip.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article.

IP addresses are assigned to an IP configuration. A NIC is always assigned a **primary** IP configuration, but may also have multiple **secondary** configurations assigned to it. Each IP configuration is assigned one or both of the following types of addresses:
- **Private:** Private IP addresses enable a VM to communicate with other resources connected to the VNet the NIC is in. An IP configuration must have one private IP address assigned to it. The Azure DHCP servers assign the private IP address for the primary IP configuration of the NIC to the NIC within the VM operating system. A private IP address also enables the VM to communicate outbound to the Internet. Outbound connections are source network address translated (SNAT). To learn more about Azure outbound Internet connectivity, read the [Azure outbound Internet connectivity](../load-balancer/load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article. You cannot communicate inbound to a VM's private IP address from the Internet.
- **Public:** Public IP addresses enable inbound connectivity to a VM from the Internet. Outbound connections to the Internet are not SNATed. You may assign a public IP address to an IP configuration, but aren't required to. To learn more about public IP addresses, read the [Public IP address](virtual-network-public-ip-address.md) article.

There are limits to the number of public and private IP addresses that you can assign to a NIC. For details, read the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article.

Public and private IP addresses can be assigned using the following allocation methods:
- **Dynamic:** Dynamic private and public IP addresses are assigned by default. Dynamic addresses can change if the VM is put into the stopped (deallocated) state, then restarted. If you don't want the IP address to change for the life of the VM, use a static address.
- **Static:** Static addresses do not change until a VM is deleted. You assign a static private IP address from the address space for the subnet the NIC is attached to. To learn more about how Azure assigns static public IP addresses, read the [Public IP address](virtual-network-public-ip-address.md) article.

## <a name="create-ip-config"></a>Add IP addresses

You can add as many IP addresses as necessary to a NIC, within the limits listed in the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article.

1. Log in to the [Azure portal](https://portal.azure.com) with an account that is assigned (at a minimum) permissions for the Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles and permissions to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *network interfaces*. When **network interfaces** appears in the search results, click it.
3. In the **Network interfaces** blade that appears, click the NIC you want to add an IP address for.
4. Click **IP configurations** in the **SETTINGS** section of the blade for the NIC you selected.
5. Click **+ Add** in the blade that opens for IP configurations.
6. Specify the following, then click **OK** to close the **Add IP configuration** blade:

	|Setting|Required?|Details|
	|---|---|---|
	|Name|Yes|Must be unique for the NIC|
	|Type|Yes|Since you're adding an IP configuration to an existing NIC, and each NIC must have a primary IP configuration, your only option is **Secondary**.|
	|Private IP address assignment method|Yes|**Dynamic** addresses can change if the VM is restarted after having been in the stopped (deallocated) state. Azure assigns an available address from the address space of the subnet the NIC is connected to. **Static** addresses aren't released until the NIC is deleted. Specify an IP address from the subnet address space range that is not currently in use by another IP configuration.|
	|Public IP address|No|**Disabled:** No public IP address resource is currently associated to the IP configuration. **Enabled:** Select an existing Public IP address, or create a new one. To learn how to create a public IP address, read the [Public IP addresses](virtual-network-public-ip-address.md#create) article.|
7. Manually add secondary private IP addresses to the VM operating system by completing the instructions in the [Assign multiple IP addresses to virtual machines](virtual-network-multiple-ip-addresses-portal.md#os-config) article. Do not add any public IP addresses to the VM operating system.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network nic ip-config create](/cli/azure/network/nic/ip-config?toc=%2fazure%2fvirtual-network%2ftoc.json#create)|
|PowerShell|[Add-AzureRmNetworkInterfaceIpConfig](/powershell/resourcemanager/azurerm.network/v3.4.0/add-azurermnetworkinterfaceipconfig?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="change-ip-config"></a>Change IP address settings

You may need to change the assignment method of an IP address, change the static IP address, or change the public IP address assigned to a NIC. If you're changing the private IP address of a secondary IP configuration associated with a secondary NIC in a VM (learn more about [primary and secondary NICs](virtual-network-network-interface-vm.md#about)), place the VM into the stopped (deallocated) state before completing the following steps: 

1. Log in to the [Azure portal](https://portal.azure.com) with an account that is assigned (at a minimum) permissions for the Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles and permissions to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *network interfaces*. When **network interfaces** appears in the search results, click it.
3. In the **Network interfaces** blade that appears, click the NIC you want to view or change IP address settings for.
4. Click **IP configurations** in the **SETTINGS** section of the blade for the NIC you selected.
5. Click the IP configuration you want to modify from the list in the blade that opens for IP configurations.
6. Change the settings, as desired, using the information about the settings in step 6 of the [Add an IP configuration](#create-ip-config) section of this article. Click **Save** to close the blade for the IP configuration you changed.

>[!NOTE]
>If the primary NIC has multiple IP configurations and you change the private IP address of the primary IP configuration, you must manually reassign all secondary IP addresses to the NIC within Windows (not required for Linux). To manually assign IP addresses to a NIC within an operating system, read the [Assign multiple IP addresses to virtual machines](virtual-network-multiple-ip-addresses-portal.md#os-config) article. Do not add any public IP addresses to the VM operating system.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network nic ip-config update](/cli/azure/network/nic/ip-config?toc=%2fazure%2fvirtual-network%2ftoc.json#update)|
|PowerShell|[Set-AzureRMNetworkInterfaceIpConfig](/powershell/resourcemanager/azurerm.network/v3.4.0/set-azurermnetworkinterfaceipconfig?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="delete-ip-config"></a>Remove IP addresses

You can remove private and public IP addresses from a NIC, but a NIC must always have at least one private IP address assigned to it.

1. Log in to the [Azure portal](https://portal.azure.com) with an account that is assigned (at a minimum) permissions for the Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles and permissions to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *network interfaces*. When **network interfaces** appears in the search results, click it.
3. In the **Network interfaces** blade that appears, click the NIC you want to remove IP addresses from.
4. Click **IP configurations** in the **SETTINGS** section of the blade for the NIC you selected.
5. Right-click a secondary IP configuration (you cannot delete the primary configuration) you want to delete, click **Delete**, then click **Yes** to confirm the deletion. If the configuration had a public IP address resource associated to it, the resource is dissociated from the IP configuration, but the resource is not deleted.
6. Close the **IP configurations** blade.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network nic ip-config delete](/cli/azure/network/nic/ip-config?toc=%2fazure%2fvirtual-network%2ftoc.json#delete)|
|PowerShell|[Remove-AzureRmNetworkInterfaceIpConfig](/powershell/resourcemanager/azurerm.network/v3.4.0/remove-azurermnetworkinterfaceipconfig?toc=%2fazure%2fvirtual-network%2ftoc.json)|


## <a name="next-steps"></a>Next steps
To create a VM with multiple NICs or IP addresses, read the following articles:

**Commands**

|Task|Tool|
|---|---|
|Create a VM with multiple NICs|[CLI](../virtual-machines/linux/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json)|
||[PowerShell](../virtual-machines/windows/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json)|
|Create a single NIC VM with multiple IP addresses|[CLI](virtual-network-multiple-ip-addresses-cli.md)|
||[PowerShell](virtual-network-multiple-ip-addresses-powershell.md)|
