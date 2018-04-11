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
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/15/2017
ms.author: jdial

---

# Add network interfaces to or remove network interfaces from virtual machines

Learn how to add an existing network interface when creating a VM or add or remove network interfaces from an existing VM in the stopped (deallocated) state. A network interface enables an Azure Virtual Machine (VM) to communicate with Internet, Azure, and on-premises resources. A VM can have one or more network interfaces. 

If you need to add, change, or remove IP addresses for a network interface, read the [Manage network interface IP addresses](virtual-network-network-interface-addresses.md) article. If you need to create, change, or delete network interfaces, read the [Manage network interfaces](virtual-network-network-interface.md) article.

## <a name="before"></a>Before you begin

Complete the following tasks before completing any steps in any section of this article:

- Log in to the Azure [portal](https://portal.azure.com), Azure command-line interface (CLI), or Azure PowerShell with an Azure account. If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If using PowerShell commands to complete tasks in this article, [install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs?toc=%2fazure%2fvirtual-network%2ftoc.json). Ensure you have the most recent version of the Azure PowerShell commandlets installed. To get help for PowerShell commands, with examples, type `get-help <command> -full`. Rather than installing Azure PowerShell, you can use the Azure Cloud Shell. The Azure Cloud Shell is a free PowerShell that you can run directly within the Azure portal. It has Azure PowerShell preinstalled and configured to use with your account. To use the Cloud Shell, click the Cloud Shell **>_** button at the top of the [portal](https://portal.azure.com) and select PowerShell in the top left corner, when the shell window appears.
- If using Azure command-line interface (CLI) commands to complete tasks in this article, [install and configure the Azure CLI](/cli/azure/install-azure-cli?toc=%2fazure%2fvirtual-network%2ftoc.json). Ensure you have the most recent version of the Azure CLI installed. To get help for CLI commands, type `az <command> --help`. Rather than installing the CLI and its pre-requisites, you can use the Azure Cloud Shell. The Azure Cloud Shell is a free Bash shell that you can run directly within the Azure portal. It has the Azure CLI preinstalled and configured to use with your account. To use the Cloud Shell, click the Cloud Shell **>_** button at the top of the [portal](https://portal.azure.com) and select Bash in the top left corner, when the shell window appears.

## <a name="vm-create"></a>Add existing network interfaces to a new VM

When you create a VM through the portal, the portal creates a network interface with default settings and attaches it to the VM for you. You cannot add existing network interfaces to a new VM, or create a VM with multiple network interfaces, using the Azure portal. You can do both using the CLI or PowerShell. Before using PowerShell or the CLI to create a VM with an existing network interface however, familiarize yourself with the [constraints](#constraints). If you create a virtual machine with multiple network interfaces, you must also configure the operating system to properly use them once the VM is created. For details, see Configure [Linux](../virtual-machines/linux/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#configure-guest-os-for-multiple-nics) or [Windows](../virtual-machines/windows/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#configure-guest-os-for-multiple-nics) for multiple network interfaces.

**Commands**
Before creating the VM, create a network interface using the steps in [Create a network interface](virtual-network-network-interface.md#create-a-network-interface).

|Tool|Command|
|---|---|
|CLI|[az vm create](/cli/azure/vm?toc=%2fazure%2fvirtual-network%2ftoc.json#create)|
|PowerShell|[New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="vm-add-nic"></a>Add a network interface to an existing VM

1. Log in to the Azure portal.
2. In the search box at the top of the portal, search for the name of the VM you want to add the network interface to, or browse for the VM by clicking **All services**, then **Virtual machines**. Once you've found the VM, click it. The VM you want to add a network interface to must support the number of network interfaces you want to add. To learn how many network interfaces each VM size supports, read the [Linux](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Windows](../virtual-machines/virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) VM sizes articles.  
3. Click **Overview**, under **SETTINGS**. Click **Stop**, and wait until the **Status** of the VM changes to *Stopped (deallocated)*. 
4. Click **Networking**, under **SETTINGS**.
5. Click **Attach network interface**. From the list of existing network interfaces that aren't currently attached to another VM, click the network interface you'd like to attach. The network interface you select cannot have accelerated networking enabled, cannot have an IPv6 address assigned to it, and must exist in the same virtual network as the virtual network the network interface currently attached to the VM is in. If you don't have an existing network interface, you must first create one. To create a network interface, click **Create network interface**. To learn more about creating a network interface, see [Create a network interface](virtual-network-network-interface.md#create-a-network-interface). To learn more about additional constraints when adding network interfaces to virtual machines, see [Constraints](#constraints).
6. Click **OK**.
7. Click **Overview**, under **SETTINGS**. Click **Start** to start the virtual machine.
8. Configure the VM operating system to properly use multiple network interfaces. For details, see Configure [Linux](../virtual-machines/linux/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#configure-guest-os-for-multiple-nics) or [Windows](../virtual-machines/windows/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#configure-guest-os-for-multiple-nics) for multiple network interfaces.

|Tool|Command|
|---|---|
|CLI|[az vm nic add](/cli/azure/vm/nic?toc=%2fazure%2fvirtual-network%2ftoc.json#add) (reference) or [detailed steps](../virtual-machines/linux/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#add-a-nic-to-a-vm)|
|PowerShell|[Add-AzureRmVMNetworkInterface](/powershell/module/azurerm.compute/add-azurermvmnetworkinterface?toc=%2fazure%2fvirtual-network%2ftoc.json) (reference) or [detailed steps](../virtual-machines/windows/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#add-a-nic-to-an-existing-vm)|

## <a name="vm-view-nic"></a> View network interfaces for a VM

You can view the network interfaces currently attached to a VM to learn about each network interface's configuration, and the IP addresses assigned to each network interface. 

1. Log in to the [Azure portal](https://portal.azure.com) with an account that is assigned the Owner, Contributor, or Network Contributor role for your subscription. To learn more about assigning roles to accounts, see [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor).
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *virtual machines*. When **virtual machines** appears in the search results, click it.
3. Click the name of the VM you want to view network interfaces for.
4. In the **SETTINGS** section for the VM you selected, click **Networking**. To learn about network interface settings and how to change them, see [Manage network interfaces](virtual-network-network-interface.md). To learn about adding, changing, or removing IP addresses assigned to a network interface, see [Manage IP addresses](virtual-network-network-interface-addresses.md).

**Commands**

|Tool|Command|
|---|---|
|CLI|[az vm show](/cli/azure/vm?toc=%2fazure%2fvirtual-network%2ftoc.json#show)|
|PowerShell|[Get-AzureRmVM](/powershell/module/azurerm.compute/get-azurermvm?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="vm-remove-nic"></a> Remove a network interface from a VM

1. Log in to the Azure portal.
2. In the search box at the top of the portal, search for the name of the VM you want to remove (detach) the network interface from, or browse for the VM by clicking **All services**, then **Virtual machines**. Once you've found the VM, click it.
3. Click **Overview**, under **SETTINGS**. Click **Stop**, and wait until the **Status** of the VM changes to *Stopped (deallocated)*. 
4. Click **Networking**, under **SETTINGS**.
5. Click **Detach network interface**. From the list of network interfaces currently attached to the virtual machine, click the network interface you'd like to detach. If only one network interface is listed, you cannot detach it, because a virtual machine must always have at least one network interface attached to it.
6. Click **OK**.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az vm nic remove](/cli/azure/vm/nic?toc=%2fazure%2fvirtual-network%2ftoc.json#remove) (reference) or [detailed steps](../virtual-machines/linux/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#remove-a-nic-from-a-vm)|
|PowerShell|[Remove-AzureRMVMNetworkInterface](/powershell/module/azurerm.compute/remove-azurermvmnetworkinterface?toc=%2fazure%2fvirtual-network%2ftoc.json) (reference) or [detailed steps](../virtual-machines/windows/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#remove-a-nic-from-an-existing-vm)|

## <a name="next-steps"></a>Next steps
To create a VM with multiple network interfaces or IP addresses, read the following articles:

**Commands**

|Task|Tool|
|---|---|
|Create a VM with multiple NICs|[CLI](../virtual-machines/linux/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json), [PowerShell](../virtual-machines/windows/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json)|
|Create a single NIC VM with multiple IPv4 addresses|[CLI](virtual-network-multiple-ip-addresses-cli.md), [PowerShell](virtual-network-multiple-ip-addresses-powershell.md)|
|Create a single NIC VM with a private IPv6 address (behind an Azure Load Balancer)|[CLI](../load-balancer/load-balancer-ipv6-internet-cli.md?toc=%2fazure%2fvirtual-network%2ftoc.json), [PowerShell](../load-balancer/load-balancer-ipv6-internet-ps.md?toc=%2fazure%2fvirtual-network%2ftoc.json), [Azure Resource Manager template](../load-balancer/load-balancer-ipv6-internet-template.md?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## Constraints

- A VM must have at least one network interface attached to it.
- A VM can only have as many network interfaces attached to it as the VM size supports. To learn more about how many network interfaces each VM size supports, see [Linux](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [Windows](../virtual-machines/virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) VM sizes. All sizes support at least two network interfaces.
- The network interfaces you add to a VM cannot currently be attached to another VM. To learn more about creating network interfaces, see [Create a network interface](virtual-network-network-interface.md#create-a-network-interface).
- In the past, network interfaces could only be added to VMs that supported multiple network interfaces and were created with at least two network interfaces. You could not add a network interface to a VM that was created with one network interface, even if the VM size supported multiple network interfaces. Conversely, you could only remove network interfaces from a VM with at least three network interfaces, because VMs created with at least two network interfaces always had to have at least two network interfaces. Neither of these constraints apply anymore. You can now create a VM with any number of network interfaces (up to the number supported by the VM size).
- By default, the first network interface attached to a VM is defined as the *primary* network interface. All other network interfaces in the VM are *secondary* network interfaces.
- Though you can control which network interface you sent outbound traffic to, by default, all outbound traffic from the VM is sent out the IP address assigned to the primary IP configuration of the primary network interface.
- In the past, all VMs within the same availability set were required to have a single, or multiple, network interfaces. VMs with any number of network interfaces can now exist in the same availability set, up to the number supported by the VM size. You can only add a VM to an availability set when it's created though. To learn more about availability sets, read the [Manage the availability of VMs in Azure](../virtual-machines/windows/manage-availability.md?toc=%2fazure%2fvirtual-network%2ftoc.json#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy) article.
- While network interfaces in the same VM can be connected to different subnets within a VNet, the network interfaces must all be connected to the same VNet.
- You can add any IP address for any IP configuration of any primary or secondary network interface to an Azure Load Balancer back-end pool. In the past, only the primary IP address for the primary network interface could be added to a back-end pool. To learn more about IP addresses and configurations, read the [Add, change, or remove IP addresses](virtual-network-network-interface-addresses.md) article.
- Deleting a VM does not delete the network interfaces that are attached to it. When a VM is deleted, the network interfaces are detached from the VM. You can add the network interfaces to different VMs, or delete them.
- If a network interface has a private IPv6 address assigned to it, you must add (attach) it to a VM when creating the VM. You cannot add a network interface with an assigned IPv6 address to a VM after the VM is created. If you add a network interface with an assigned private IPv6 address when creating a virtual machine, you can only add that network interface to the virtual machine, regardless of how many network interfaces the VM size supports. See [Network interface IP addresses](virtual-network-network-interface-addresses.md) to learn more about assigning IP addresses to network interfaces.
- Similar to IPv6, you cannot attach a network interface with accelerated networking enabled to a VM after the VM is created. Further, to take advantage of accelerated networking, you must also complete steps within the VM operating system. To learn more about accelerated networking, and other constraints when using it, see [Create a VM with accelerated networking](virtual-network-create-vm-accelerated-networking.md).
