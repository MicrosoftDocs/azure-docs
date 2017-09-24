---
title: Configure IP addresses for an Azure network interface | Microsoft Docs
description: Learn how to add, change, and remove private and public IP addresses for a network interface.
services: virtual-network
documentationcenter: na
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/24/2017
ms.author: jdial

---

# Add, change, or remove IP addresses for an Azure network interface

Learn how to add, change, and remove public and private IP addresses for a network interface. Private IP addresses assigned to a network interface enable a virtual machine to communicate with other resources in an Azure virtual network and connected networks. A private IP address also enables outbound communication to the Internet using an unpredictable IP address. A [Public IP address](virtual-network-public-ip-address.md) assigned to a network interface enables inbound communication to a virtual machine from the Internet. The address also enables outbound communication from the virtual machine to the Internet using a predictable IP address. For details, see [Understanding outbound connections in Azure](../load-balancer/load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json). 

If you need to create, change, or delete a network interface, read the [Manage a network interface](virtual-network-network-interface.md) article. If you need to add network interfaces to or remove network interfaces from a virtual machine, read the [Add or remove network interfaces](virtual-network-network-interface-vm.md) article. 


## Before you begin

Complete the following tasks before completing any steps in any section of this article:

- Review the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article to learn about limits for public and private IP addresses.
- Log in to the Azure [portal](https://portal.azure.com), Azure command-line interface (CLI), or Azure PowerShell with an Azure account. If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If using PowerShell commands to complete tasks in this article, [install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs?toc=%2fazure%2fvirtual-network%2ftoc.json). Ensure you have the most recent version of the Azure PowerShell commandlets installed. To get help for PowerShell commands, with examples, type `get-help <command> -full`.
- If using Azure command-line interface (CLI) commands to complete tasks in this article, [install and configure the Azure CLI](/cli/azure/install-azure-cli?toc=%2fazure%2fvirtual-network%2ftoc.json). Ensure you have the most recent version of the Azure CLI installed. To get help for CLI commands, type `az <command> --help`. Rather than installing the CLI and its pre-requisites, you can use the Azure Cloud Shell. The Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. It has the Azure CLI preinstalled and configured to use with your account. To use the Cloud Shell, click the Cloud Shell **>_** button at the top of the [portal](https://portal.azure.com).

## Add IP addresses

You can add as many [private](#private) and [public](#public) [IPv4](#ipv4) addresses as necessary to a network interface, within the limits listed in the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article. You cannot use the portal to add an IPv6 address to an existing network interface (though you can use the portal to add a private IPv6 address to a network interface when you create the network interface). You can use PowerShell or the CLI to add a private IPv6 address to one [secondary IP configuration](#secondary) (as long as there are no existing secondary IP configurations) for an existing network interface that is not attached to a virtual machine. You cannot use any tool to add a public IPv6 address to a network interface. See [IPv6](#ipv6) for details about using IPv6 addresses. 

1. Log in to the [Azure portal](https://portal.azure.com) with an account that is assigned (at a minimum) permissions for the Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles and permissions to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *network interfaces*. When **network interfaces** appears in the search results, click it.
3. In the **Network interfaces** blade that appears, click the network interface you want to add an IPv4 address for.
4. Click **IP configurations** in the **SETTINGS** section of the blade for the network interface you selected.
5. Click **+ Add** in the blade that opens for IP configurations.
6. Specify the following, then click **OK** to close the **Add IP configuration** blade:

	|Setting|Required?|Details|
	|---|---|---|
	|Name|Yes|Must be unique for the network interface|
	|Type|Yes|Since you're adding an IP configuration to an existing network interface, and each network interface must have a [primary](#primary) IP configuration, your only option is **Secondary**.|
	|Private IP address assignment method|Yes|[**Dynamic**](#dynamic) addresses can change if the virtual machine is restarted after having been in the stopped (deallocated) state. Azure assigns an available address from the address space of the subnet the network interface is connected to. [**Static**](#static) addresses aren't released until the network interface is deleted. Specify an IP address from the subnet address space range that is not currently in use by another IP configuration.|
	|Public IP address|No|**Disabled:** No public IP address resource is currently associated to the IP configuration. **Enabled:** Select an existing IPv4 Public IP address, or create a new one. To learn how to create a public IP address, read the [Public IP addresses](virtual-network-public-ip-address.md#create-a-public-ip-address) article.|
7. Manually add secondary private IP addresses to the virtual machine operating system by completing the instructions in the [Assign multiple IP addresses to virtual machine operating systems](virtual-network-multiple-ip-addresses-portal.md#os-config) article. See [private](#private) IP addresses for special considerations before manually adding IP addresses to a virtual machine operating system. Do not add any public IP addresses to the virtual machine operating system.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network nic ip-config create](/cli/azure/network/nic/ip-config?toc=%2fazure%2fvirtual-network%2ftoc.json#create)|
|PowerShell|[Add-AzureRmNetworkInterfaceIpConfig](/powershell/module/azurerm.network/add-azurermnetworkinterfaceipconfig?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## Change IP address settings

You may need to change the assignment method of an IPv4 address, change the static IPv4 address, or change the public IP address assigned to a network interface. If you're changing the private IPv4 address of a secondary IP configuration associated with a secondary network interface in a virtual machine (learn more about [primary and secondary network interfaces](virtual-network-network-interface-vm.md#about)), place the virtual machine into the stopped (deallocated) state before completing the following steps: 

1. Log in to the [Azure portal](https://portal.azure.com) with an account that is assigned (at a minimum) permissions for the Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles and permissions to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *network interfaces*. When **network interfaces** appears in the search results, click it.
3. In the **Network interfaces** blade that appears, click the network interface you want to view or change IP address settings for.
4. Click **IP configurations** in the **SETTINGS** section of the blade for the network interface you selected.
5. Click the IP configuration you want to modify from the list in the blade that opens for IP configurations.
6. Change the settings, as desired, using the information about the settings in step 6 of the [Add an IP configuration](#create-ip-config) section of this article. Click **Save** to close the blade for the IP configuration you changed.

>[!NOTE]
>If the primary network interface has multiple IP configurations and you change the private IP address of the primary IP configuration, you must manually reassign the primary and secondary IP addresses to the network interface within Windows (not required for Linux). To manually assign IP addresses to a network interface within an operating system, read the [Assign multiple IP addresses to virtual machines](virtual-network-multiple-ip-addresses-portal.md#os-config) article. See [private](#private) IP addresses for special considerations before manually adding IP addresses to a virtual machine operating system. Do not add any public IP addresses to the virtual machine operating system.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network nic ip-config update](/cli/azure/network/nic/ip-config?toc=%2fazure%2fvirtual-network%2ftoc.json#update)|
|PowerShell|[Set-AzureRMNetworkInterfaceIpConfig](/powershell/module/azurerm.network/set-azurermnetworkinterfaceipconfig?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## Remove IP addresses

You can remove [private](#private) and [public](#public) IP addresses from a network interface, but a network interface must always have at least one private IPv4 address assigned to it.

1. Log in to the [Azure portal](https://portal.azure.com) with an account that is assigned (at a minimum) permissions for the Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles and permissions to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *network interfaces*. When **network interfaces** appears in the search results, click it.
3. In the **Network interfaces** blade that appears, click the network interface you want to remove IP addresses from.
4. Click **IP configurations** in the **SETTINGS** section of the blade for the network interface you selected.
5. Right-click a [secondary](#secondary) IP configuration (you cannot delete the [primary](#primary) configuration) you want to delete, click **Delete**, then click **Yes** to confirm the deletion. If the configuration had a public IP address resource associated to it, the resource is dissociated from the IP configuration, but the resource is not deleted.
6. Close the **IP configurations** blade.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az network nic ip-config delete](/cli/azure/network/nic/ip-config?toc=%2fazure%2fvirtual-network%2ftoc.json#delete)|
|PowerShell|[Remove-AzureRmNetworkInterfaceIpConfig](/powershell/module/azurerm.network/remove-azurermnetworkinterfaceipconfig?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## IP configurations

[Private](#private) and (optionally) [public](#public) IP addresses are assigned to one or more IP configurations assigned to a network interface. There are two types of IP configurations:

### Primary

Each network interface is assigned one primary IP configuration. A primary IP configuration:

- Has a [private](#private) [IPv4](#ipv4) address assigned to it. You cannot assign a private [IPv6](#ipv6) address to a primary IP configuration.
- May also have a [public](#public) IPv4 address assigned to it. You cannot assign a public IPv6 address to a primary or secondary IP configuration. You can however, assign a public IPv6 address to an Azure load balancer, which can load balance traffic to a virtual machine's private IPv6 address. For more information, see [details and limitations for IPv6](../load-balancer/load-balancer-ipv6-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#details-and-limitations).

### Secondary

In addition to a primary IP configuration, a network interface may have zero or more secondary IP configurations assigned to it. A secondary IP configuration:

- Must have a private IPv4 or IPv6 address assigned to it. If the address is IPv6, the network interface can only have one secondary IP configuration. If the address is IPv4, the network interface may have multiple secondary IP configurations assigned to it. To learn more about how many private and public IPv4 addresses can be assigned to a network interface, see the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article.  
- May also have a public IPv4 address assigned to it, if the private IP address is IPv4. If the private IP address is IPv6, you cannot assign a public IPv4 or IPv6 address to the IP configuration. Assigning multiple IP addresses to a network interface is helpful in scenarios such as:
    - Hosting multiple websites or services with different IP addresses and SSL certificates on a single server.
    - A virtual machine serving as a network virtual appliance, such as a firewall or load balancer.
    - The ability to add any of the private IPv4 addresses for any of the network interfaces to an Azure Load Balancer back-end pool. In the past, only the primary IPv4 address for the primary network interface could be added to a back-end pool. To learn more about how to load balance multiple IPv4 configurations, see the [Load balancing multiple IP configurations](../load-balancer/load-balancer-multiple-ip.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article. 
    - The ability to load balance one IPv6 address assigned to a network interface. To learn more about how to load balance to a private IPv6 address, see the [Load balance IPv6 addresses](../load-balancer/load-balancer-ipv6-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article.


## Address types

You can assign the following types of IP addresses to an [IP configuration](#ip-configurations):

### Private

Private [IPv4](#ipv4) addresses enable a virtual machine to communicate with other resources in a virtual network or other connected networks. A virtual machine cannot be communicated inbound to, nor can the virtual machine communicate outbound with a private [IPv6](#ipv6) address, with one exception. A virtual machine can communicate with the Azure load balancer using an IPv6 address. For more information, see [details and limitations for IPv6](../load-balancer/load-balancer-ipv6-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#details-and-limitations). 

By default, the Azure DHCP servers assign the private IPv4 address for the [primary IP configuration](#primary) of the network interface to the network interface within the virtual machine operating system. Unless necessary, you should never manually set the IP address of a network interface within the virtual machine's operating system. 

> [!WARNING]
> If the IPv4 address set as the primary IP address of a network interface within a virtual machine's operating system is ever different than the private IPv4 address assigned to the primary IP configuration of the primary network interface attached to a virtual machine within Azure, you lose connectivity to the virtual machine.

There are scenarios where it's necessary to manually set the IP address of a network interface within the virtual machine's operating system. For example, you must manually set the primary and secondary IP addresses of a Windows operating system when adding multiple IP addresses to an Azure virtual machine. For a Linux virtual machine, you may only need to manually set the secondary IP addresses. See [Add IP addresses to a VM operating system](virtual-network-multiple-ip-addresses-portal.md#os-config) for details. When you manually set the IP address within the operating system, it's recommended that you always assign the addresses to the IP configuration for a network interface using the static (rather than dynamic) assignment method. Assigning the address using the static method ensures that the address does not change within Azure. If you ever need to change the address assigned to an IP configuration, it's recommended that you:

1. To ensure the virtual machine is receiving an address from the Azure DHCP servers, change the assignment of the IP address back to DHCP within the operating system and restart the virtual machine.
2. Stop (deallocate) the virtual machine.
3. Change the IP address for the IP configuration within Azure.
4. Start the virtual machine.
5. [Manually configure](virtual-network-multiple-ip-addresses-portal.md#os-config) the secondary IP addresses within the operating system (and also the primary IP address within Windows) to match what you set within Azure.
 
By following the previous steps, the private IP address assigned to the network interface within Azure, and within a virtual machine's operating system, remain the same. To keep track of which virtual machines within your subscription that you've manually set IP addresses within an operating system for, consider adding an Azure [tag](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#tags) to the virtual machines. You might use "IP address assignment: Static", for example. This way, you can easily find the virtual machines within your subscription that you've manually set the IP address for within the operating system.

In addition to enabling a virtual machine to communicate with other resources within the same, or connected virtual networks, a private IP address also enables a virtual machine to communicate outbound to the Internet. Outbound connections are source network address translated by Azure to an unpredictable public IP address. To learn more about Azure outbound Internet connectivity, read the [Azure outbound Internet connectivity](../load-balancer/load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article. You cannot communicate inbound to a virtual machine's private IP address from the Internet.

### Public

Public IP addresses enable inbound connectivity to a virtual machine from the Internet. Outbound connections to the Internet use a predictable IP address. See [Understanding outbound connections in Azure](../load-balancer/load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json) for details. You may assign a public IP address to an IP configuration, but aren't required to. If you don't assign a public IP address to a virtual machine, it can still communicate outbound to the Internet using its private IP address. To learn more about public IP addresses, read the [Public IP address](virtual-network-public-ip-address.md) article.

There are limits to the number of private and public IP addresses that you can assign to a network interface. For details, read the [Azure limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article.

> [!NOTE]
> Azure translates a virtual machine's private IP address to a public IP address. As a result, the operating system is unaware of any public IP addresses assigned to it, so there is no need to ever manually assign a public IP address within the operating system.

## Assignment methods

Public and private IP addresses are assigned using the following assignment methods:

### Dynamic

Dynamic private IPv4 and IPv6 (optionally) addresses are assigned by default. Dynamic addresses can change if the virtual machine is put into the stopped (deallocated) state, then started. If you don't want IPv4 addresses to change for the life of the virtual machine, assign the addresses using the static method. You can only assign a private IPv6 address using the dynamic assignment method. You cannot assign a public IPv6 address to an IP configuration using either method.

### Static

Addresses assigned using the static method do not change until a virtual machine is deleted. You manually assign a static private IPv4 address to an IP configuration from the address space for the subnet the network interface is in. You can (optionally) assign a public or private static IPv4 address to an IP configuration. You cannot assign a static public or private IPv6 address to an IP configuration. To learn more about how Azure assigns static public IPv4 addresses, see the [Public IP address](virtual-network-public-ip-address.md) article.

## IP address versions

You can specify the following versions when assigning addresses:

### IPv4

Each network interface must have one [primary](#primary) IP configuration with an assigned [private](#private) [IPv4](#ipv4) address. You can add one or more [secondary](#secondary) IP configurations that each have an IPv4 private and (optionally) an IPv4 [public](#public) IP address.

### IPv6

You can assign zero or one private [IPv6](#ipv6) address to one secondary IP configuration of a network interface. The network interface cannot have any existing secondary IP configurations. You cannot add an IP configuration with an IPv6 address using the portal. Use PowerShell or the CLI to add an IP configuration with a private IPv6 address to an existing network interface. The network interface cannot be attached to an existing VM.

> [!NOTE]
> Though you can create a network interface with an IPv6 address using the portal, you can't add an existing network interface to a new, or existing virtual machine, using the portal. Use PowerShell or the Azure CLI 2.0 to create a network interface with a private IPv6 address, then attach the network interface when creating a virtual machine. You cannot attach a network interface with a private IPv6 address assigned to it to an existing virtual machine. You cannot add a private IPv6 address to an IP configuration for any network interface attached to a virtual machine using any tools (portal, CLI, or PowerShell).

You can't assign a public IPv6 address to a primary or secondary IP configuration.

## Next steps
To create a virtual machine with different IP configurations, read the following articles:

|Task|Tool|
|---|---|
|Create a VM with multiple NICs|[CLI](../virtual-machines/linux/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json), [PowerShell](../virtual-machines/windows/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json)|
|Create a single NIC VM with multiple IPv4 addresses|[CLI](virtual-network-multiple-ip-addresses-cli.md), [PowerShell](virtual-network-multiple-ip-addresses-powershell.md)|
|Create a single NIC VM with a private IPv6 address (behind an Azure Load Balancer)|[CLI](../load-balancer/load-balancer-ipv6-internet-cli.md?toc=%2fazure%2fvirtual-network%2ftoc.json), [PowerShell](../load-balancer/load-balancer-ipv6-internet-ps.md?toc=%2fazure%2fvirtual-network%2ftoc.json), [Azure Resource Manager template](../load-balancer/load-balancer-ipv6-internet-template.md?toc=%2fazure%2fvirtual-network%2ftoc.json)|
