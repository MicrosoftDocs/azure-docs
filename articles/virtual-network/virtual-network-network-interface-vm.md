---
title: Add network interfaces to or remove from Azure virtual machines | Microsoft Docs
description: Learn how to add network interfaces to or remove network interfaces from virtual machines.
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

# Add network interfaces to or remove from virtual machines

Learn how to add an existing network interface when creating a VM or add or remove network interfaces from an existing VM in the stopped (deallocated) state. A network interface enables an Azure Virtual Machine (VM) to communicate with Internet, Azure, and on-premises resources. A VM can have one or more network interfaces. 

If you need to add, change, or remove IP addresses for a network interface, read the [Add, change, or remove IP addresses](virtual-network-network-interface-addresses.md) article. If you need to create, change, or delete network interfaces, read the [Manage network interfaces](virtual-network-network-interface.md) article.

## <a name="before"></a>Before you begin

Complete the following tasks before completing any steps in any section of this article:

- Learn about how many network interfaces each Linux and Windows VM size supports by reviewing the [Linux](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Windows](../virtual-machines/virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) VM sizes articles.
- Log in to the Azure portal, Azure command-line interface (CLI), or Azure PowerShell with an Azure account. If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If using PowerShell commands to complete tasks in this article, install and configure Azure PowerShell by completing the steps in the [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs?toc=%2fazure%2fvirtual-network%2ftoc.json) article. Ensure you have the most recent version of the Azure PowerShell commandlets installed. To get help for PowerShell commands, with examples, type `get-help <command> -full`.
- If using Azure Command-line interface (CLI) commands to complete tasks in this article, install and configure the Azure CLI by completing the steps in the [How to install and configure the Azure CLI](/cli/azure/install-azure-cli?toc=%2fazure%2fvirtual-network%2ftoc.json) article. Ensure you have the most recent version of the Azure CLI installed. To get help for CLI commands, type `az <command> --help`.

## <a name="about"></a>About network interfaces and VMs

You can add (attach) an existing network interface to a VM when you create the VM, provided the network interface isn't currently attached to another VM. You can add a network interface to, or remove (detach) a network interface to from an existing VM, provided the VM is in the stopped (deallocated) state. If you create a VM using the Azure portal, the portal creates a network interface for you with default settings. The portal does not allow you to:

- Specify an existing network interface to add when creating the VM
- Create a VM with multiple network interfaces
- Specify a name for the network interface (the portal creates the network interface with a default name)

You can use Azure PowerShell or the CLI to create a network interface or VM with all the previous attributes that you cannot use the portal for. Before completing the tasks in the following sections, consider the following constraints and behaviors:

- All VM sizes support at least two network interfaces, but some VM sizes support more than two network interfaces. In the past, some VM sizes only supported one network interface. To learn how many network interfaces each VM size supports, read the [Linux](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Windows](../virtual-machines/virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) VM sizes articles. 
- In the past, network interfaces could only be added to VMs that supported multiple network interfaces and were created with at least two network interfaces. You could not add a network interface to a VM that was created with one network interface, even if the VM size supported multiple network interfaces. Conversely, you could only remove network interfaces from a VM with at least three network interfaces, because VMs created with at least two network interfaces always had to have at least two network interfaces. Neither of these constraints apply anymore. You can now create a VM with any number of network interfaces (up to the number supported by the VM size) and add or remove any number of network interfaces (from VMs in the stopped (deallocated) state), as long as the VM always has at least one network interface.
- By default, the first network interface in a VM is defined as the *primary* network interface. All other network interfaces in the VM are *secondary* network interfaces.
- Primary network interfaces are assigned a default gateway by the Azure DHCP servers, but secondary network interfaces are not. Since secondary network interfaces aren't assigned a default gateway, they cannot communicate with resources outside of their subnet, by default. To enable secondary network interfaces in a Windows VM to communicate with resources outside their subnet, add routes to the operating system using the `route add` command from a Windows command-line. For Linux VMs, since the default behavior uses weak host routing, we recommend restricting traffic for secondary network interfaces to a single subnet. If you require connectivity outside the subnet for secondary network interfaces, enable policy-based routing to ensure that ingress and egress traffic uses the same network interface.
- By default, all outbound traffic from the VM is sent out the IP address assigned to the primary IP configuration of the primary network interface. You control which IP address is used for outbound traffic within the VM's operating system, but by default, it's through the primary network interface.
- In the past, all VMs within the same availability set were required to have a single, or multiple, network interfaces. VMs with any number of network interfaces can now exist in the same availability set, up to the number supported by the VM size. You can only add a VM to an availability set when it's created though. To learn more about availability sets, read the [Manage the availability of VMs in Azure](../virtual-machines/windows/manage-availability.md?toc=%2fazure%2fvirtual-network%2ftoc.json#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy) article.
- While network interfaces in the same VM can be connected to different subnets within a VNet, the network interfaces must all be connected to the same VNet.
- You can add any IP address for any IP configuration of any primary or secondary network interface to an Azure Load Balancer back-end pool. In the past, only the primary IP address for the primary network interface could be added to a back-end pool. To learn more about IP addresses and configurations, read the [Add, change, or remove IP addresses](virtual-network-network-interface-addresses.md) article.
- Deleting a VM does not delete the network interfaces that are attached to it. When a VM is deleted, the network interfaces are detached from the VM. You can add the network interfaces to different VMs, or delete them.

## <a name="vm-create"></a>Add existing network interfaces to a new VM
When you create a VM through the portal, the portal creates a network interface with default settings and attaches it to the VM for you. You cannot add existing network interfaces to a new VM, or create a VM with multiple network interfaces using the Azure portal. You can do both using the CLI or PowerShell. You can add as many network interfaces to a VM as the VM size you're creating supports. To learn more about how many network interfaces each VM size supports, read the [Linux](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Windows](../virtual-machines/virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) VM sizes articles. The network interfaces you add to a VM cannot currently be attached to another VM. To learn more about creating network interfaces, read the [Manage network interfaces](virtual-network-network-interface.md#create-nic) article.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az vm create](/cli/azure/vm?toc=%2fazure%2fvirtual-network%2ftoc.json#create)|
|PowerShell|[New-AzureRmVM](/powershell/resourcemanager/azurerm.compute/v2.5.0/new-azurermvm?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="vm-add-nic"></a>Add an existing network interface to an existing VM

You can add as many network interfaces to a VM as the VM size you're adding network interfaces to supports. To learn how many network interfaces each VM size supports, read the [Linux](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Windows](../virtual-machines/virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) VM sizes articles. The VM you want to add a network interface to must support multiple network interfaces and be in the stopped (deallocated) state. The network interfaces you want to add cannot currently be attached to another VM. You cannot add network interfaces to an existing VM using the Azure portal. You must use the CLI or PowerShell to add network interfaces to an existing VM.

|Tool|Command|
|---|---|
|CLI|[az vm nic add](/cli/azure/vm/nic?toc=%2fazure%2fvirtual-network%2ftoc.json#add)|
|PowerShell|[Add-AzureRmVMNetworkInterface](/powershell/resourcemanager/azurerm.compute/v2.5.0/add-azurermvmnetworkinterface?toc=%2fazure%2fvirtual-network%2ftoc.json)|
|Detailed steps to [add a NIC to a VM](../virtual-machines/windows/multiple-nics.md#add-a-nic-to-an-existing-vm)|

## <a name="vm-view-nic"></a> View network interfaces for a VM

You can view the network interfaces currently attached to a VM to learn about each network interface's configuration, and the IP addresses assigned to each network interface. 

1. Log in to the [Azure portal](https://portal.azure.com) with an account that is assigned the Owner, Contributor, or Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *virtual machines*. When **virtual machines** appears in the search results, click it.
3. In the **Virtual machines** blade that appears, click the name of the VM you want to view network interfaces for.
4. In the **SETTINGS** section of the virtual machine blade that appears for the VM you selected, click **Network interfaces**. To learn about network interface settings and how to change them, read the [Manage network interfaces](virtual-network-network-interface.md) article. To learn about adding, changing, or removing IP addresses assigned to a network interface, read the [Add, change, or remove IP addresses](virtual-network-network-interface-addresses.md) article.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az vm show](/cli/azure/vm?toc=%2fazure%2fvirtual-network%2ftoc.json#show)|
|PowerShell|[Get-AzureRmVM](/powershell/resourcemanager/azurerm.compute/v1.3.4/get-azurermvm?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="vm-remove-nic"></a> Remove network interfaces from a VM

The VM you want to remove a network interface from must be in the stopped (deallocated) state and must currently have at least two network interfaces attached to it. You can remove any network interface, but the VM must always have at least one network interface attached to it. If you remove a primary network interface, Azure assigns the primary attribute to the network interface that's been attached to the VM the longest. You can designate any network interface as the primary yourself. You cannot remove network interfaces from a VM, nor set the primary attribute for a network interface using the Azure portal, though you can accomplish both operations using the CLI or PowerShell. 

**Commands**

|Tool|Command|
|---|---|
|CLI|[az vm nic remove](/cli/azure/vm/nic?toc=%2fazure%2fvirtual-network%2ftoc.json#remove)|
|PowerShell|[Remove-AzureRMVMNetworkInterface](/powershell/resourcemanager/azurerm.compute/v2.5.0/remove-azurermvmnetworkinterface?toc=%2fazure%2fvirtual-network%2ftoc.json)|
|Detailed steps to [remove a NIC to a VM](../virtual-machines/windows/multiple-nics.md#remove-a-nic-from-an-existing-vm)|
## <a name="next-steps"></a>Next steps
To create a VM with multiple network interfaces or IP addresses, read the following articles:

**Commands**

|Task|Tool|
|---|---|
|Create a VM with multiple NICs|[CLI](../virtual-machines/linux/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json)|
||[PowerShell](../virtual-machines/windows/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json)|
|Create a single NIC VM with multiple IP addresses|[CLI](virtual-network-multiple-ip-addresses-cli.md)|
||[PowerShell](virtual-network-multiple-ip-addresses-powershell.md)|
