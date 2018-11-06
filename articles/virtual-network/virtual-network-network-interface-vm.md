---
title: Add network interfaces to or remove from Azure virtual machines | Microsoft Docs
description: Learn how to add network interfaces to or remove network interfaces from virtual machines.
services: virtual-network
documentationcenter: na
author: jimdial
manager: jeconnoc
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

Learn how to add an existing network interface when you create an Azure virtual machine (VM), or to add or remove network interfaces from an existing VM in the stopped (deallocated) state. A network interface enables an Azure virtual machine to communicate with internet, Azure, and on-premises resources. A VM can have one or more network interfaces. 

If you need to add, change, or remove IP addresses for a network interface, see [Manage network interface IP addresses](virtual-network-network-interface-addresses.md). If you need to create, change, or delete network interfaces, see [Manage network interfaces](virtual-network-network-interface.md).

## Before you begin

Complete the following tasks before completing steps in any section of this article:

- If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If using the portal, open https://portal.azure.com, and log in with your Azure account.
- If using PowerShell commands to complete tasks in this article, either run the commands in the [Azure Cloud Shell](https://shell.azure.com/powershell), or by running PowerShell from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. This tutorial requires the Azure PowerShell module version 5.2.0 or later. Run `Get-Module -ListAvailable AzureRM` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.
- If using Azure Command-line interface (CLI) commands to complete tasks in this article, either run the commands in the [Azure Cloud Shell](https://shell.azure.com/bash), or by running the CLI from your computer. This tutorial requires the Azure CLI version 2.0.26 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). If you are running the Azure CLI locally, you also need to run `az login` to create a connection with Azure.

## Add existing network interfaces to a new VM

When you create a virtual machine through the portal, the portal creates a network interface with default settings and attaches it to the VM for you. You cannot add existing network interfaces to a new VM, nor create a VM with multiple network interfaces, by using the Azure portal. You can do both by using the CLI or PowerShell, but be sure to familiarize yourself with the [constraints](#constraints). If you create a VM with multiple network interfaces, you must also configure the operating system to use them properly after you create the VM. Learn how to configure [Linux](../virtual-machines/linux/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#configure-guest-os-for-multiple-nics) or [Windows](../virtual-machines/windows/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#configure-guest-os-for-multiple-nics) for multiple network interfaces.

### Commands

Before you create the VM, create a network interface by using the steps in [Create a network interface](virtual-network-network-interface.md#create-a-network-interface).

|Tool|Command|
|---|---|
|CLI|[az vm create](/cli/azure/vm?toc=%2fazure%2fvirtual-network%2ftoc.json#az_vm_create)|
|PowerShell|[New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="vm-add-nic"></a>Add a network interface to an existing VM

1. Sign in to the Azure portal.
2. In the search box at the top of the portal, type the name of the VM to which you want to add the network interface, or browse for the VM by selecting **All services**, and then **Virtual machines**. After you've found the VM, select it. The VM must support the number of network interfaces you want to add. To find out how many network interfaces each VM size supports, see [Sizes for Linux virtual machines in Azure](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Sizes for Windows virtual machines in Azure](../virtual-machines/virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json).  
3. Select **Overview**, under **SETTINGS**. Select **Stop**, and then wait until the **Status** of the VM changes to **Stopped (deallocated)**. 
4. Select **Networking**, under **SETTINGS**.
5. Select **Attach network interface**. From the list of network interfaces that aren't currently attached to another VM, select the one you'd like to attach. 

    >[!NOTE]
    The network interface you select cannot have accelerated networking enabled, cannot have an IPv6 address assigned to it, and must exist in the same virtual network as the one that contains the network interface currently attached to the VM. 

    If you don't have an existing network interface, you must first create one. To do so, select **Create network interface**. To learn more about how to create a network interface, see [Create a network interface](virtual-network-network-interface.md#create-a-network-interface). To learn more about additional constraints when adding network interfaces to virtual machines, see [Constraints](#constraints).

6. Select **OK**.
7. Select **Overview**, under **SETTINGS**, and then **Start** to start the virtual machine.
8. Configure the VM operating system to  use multiple network interfaces properly. Learn how to configure [Linux](../virtual-machines/linux/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#configure-guest-os-for-multiple-nics) or [Windows](../virtual-machines/windows/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#configure-guest-os-for-multiple-nics) for multiple network interfaces.

|Tool|Command|
|---|---|
|CLI|[az vm nic add](/cli/azure/vm/nic?toc=%2fazure%2fvirtual-network%2ftoc.json#az_vm_nic_add) (reference) or [detailed steps](../virtual-machines/linux/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#add-a-nic-to-a-vm)|
|PowerShell|[Add-AzureRmVMNetworkInterface](/powershell/module/azurerm.compute/add-azurermvmnetworkinterface?toc=%2fazure%2fvirtual-network%2ftoc.json) (reference) or [detailed steps](../virtual-machines/windows/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#add-a-nic-to-an-existing-vm)|

## View network interfaces for a VM

You can view the network interfaces currently attached to a VM to learn about each network interface's configuration, and the IP addresses assigned to each network interface. 

1. Sign in to the [Azure portal](https://portal.azure.com) with an account that is assigned the Owner, Contributor, or Network Contributor role for your subscription. To learn more about how to assign roles to accounts, see [Built-in roles for Azure role-based access control](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor).
2. In the box that contains the text **Search resources** at the top of the Azure portal, type **virtual machines**. When **virtual machines** appears in the search results, select it.
3. Select the name of the VM for which you want to view network interfaces.
4. In the **SETTINGS** section for the VM you selected, select **Networking**. To learn about network interface settings and how to change them, see [Manage network interfaces](virtual-network-network-interface.md). To learn about how to add, change, or remove IP addresses assigned to a network interface, see [Manage network interface IP addresses](virtual-network-network-interface-addresses.md).

### Commands

|Tool|Command|
|---|---|
|CLI|[az vm show](/cli/azure/vm?toc=%2fazure%2fvirtual-network%2ftoc.json#az_vm_show)|
|PowerShell|[Get-AzureRmVM](/powershell/module/azurerm.compute/get-azurermvm?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## Remove a network interface from a VM

1. Sign in to the Azure portal.
2. In the search box at the top of the portal, search for the name of the VM you want to remove (detach) the network interface from, or browse for the VM by selecting **All services**, and then **Virtual machines**. After you've found the VM, select it.
3. Select **Overview**, under **SETTINGS**, and then **Stop**. Wait until the **Status** of the VM changes to **Stopped (deallocated)**. 
4. Select **Networking**, under **SETTINGS**.
5. Select **Detach network interface**. From the list of network interfaces currently attached to the virtual machine, select the network interface you'd like to detach. 

    >[!NOTE]
    If only one network interface is listed, you cannot detach it, because a virtual machine must always have at least one network interface attached to it.
6. Select **OK**.

### Commands

|Tool|Command|
|---|---|
|CLI|[az vm nic remove](/cli/azure/vm/nic?toc=%2fazure%2fvirtual-network%2ftoc.json#az_vm_nic_remove) (reference) or [detailed steps](../virtual-machines/linux/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#remove-a-nic-from-a-vm)|
|PowerShell|[Remove-AzureRMVMNetworkInterface](/powershell/module/azurerm.compute/remove-azurermvmnetworkinterface?toc=%2fazure%2fvirtual-network%2ftoc.json) (reference) or [detailed steps](../virtual-machines/windows/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#remove-a-nic-from-an-existing-vm)|

## Constraints

- A VM must have at least one network interface attached to it.
- A VM can only have as many network interfaces attached to it as the VM size supports. To learn more about how many network interfaces each VM size supports, see [Sizes for Linux virtual machines in Azure](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Sizes for Windows virtual machines in Azure](../virtual-machines/virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json). All sizes support at least two network interfaces.
- The network interfaces you add to a VM cannot currently be attached to another VM. To learn more about how to create network interfaces, see [Create a network interface](virtual-network-network-interface.md#create-a-network-interface).
- In the past, network interfaces could only be added to VMs that supported multiple network interfaces and were created with at least two network interfaces. You could not add a network interface to a VM that was created with one network interface, even if the VM size supported multiple network interfaces. Conversely, you could only remove network interfaces from a VM with at least three network interfaces, because VMs created with at least two network interfaces always had to have at least two network interfaces. Neither of these constraints apply anymore. You can now create a VM with any number of network interfaces (up to the number supported by the VM size).
- By default, the first network interface attached to a VM is defined as the *primary* network interface. All other network interfaces in the VM are *secondary* network interfaces.
- Though you can control which network interface you sent outbound traffic to, by default, all outbound traffic from the VM is sent out the IP address assigned to the primary IP configuration of the primary network interface.
- In the past, all VMs within the same availability set were required to have a single, or multiple, network interfaces. VMs with any number of network interfaces can now exist in the same availability set, up to the number supported by the VM size. You can only add a VM to an availability set when it's created. To learn more about availability sets, see [Manage the availability of VMs in Azure](../virtual-machines/windows/manage-availability.md?toc=%2fazure%2fvirtual-network%2ftoc.json#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy).
- While network interfaces in the same VM can be connected to different subnets within a virtual network, the network interfaces must all be connected to the same virtual network.
- You can add any IP address for any IP configuration of any primary or secondary network interface to an Azure Load Balancer back-end pool. In the past, only the primary IP address for the primary network interface could be added to a back-end pool. To learn more about IP addresses and configurations, see [Add, change, or remove IP addresses](virtual-network-network-interface-addresses.md).
- Deleting a VM does not delete the network interfaces that are attached to it. When you delete a VM, the network interfaces are detached from the VM. You can add the network interfaces to different VMs or delete them.
- If a network interface has a private IPv6 address assigned to it, you must add (attach) it to a VM when you create the VM. You cannot add a network interface with an assigned IPv6 address to a VM after you create the VM. If you add a network interface with an assigned private IPv6 address when you create a virtual machine, you can only add that network interface to the virtual machine, regardless of how many network interfaces the VM size supports. See [Manage network interface IP addresses](virtual-network-network-interface-addresses.md) to learn more about how to assign IP addresses to network interfaces.
- As with IPv6, you cannot attach a network interface with accelerated networking enabled to a VM after you create it. Further, to take advantage of accelerated networking, you must also complete steps within the VM operating system. Learn more about accelerated networking, and other constraints when using it, for [Windows](create-vm-accelerated-networking-powershell.md) or [Linux](create-vm-accelerated-networking-cli.md) virtual machines.

## Next steps
To create a VM with multiple network interfaces or IP addresses, read the following articles:

### Commands

|Task|Tool|
|---|---|
|Create a VM with multiple NICs|[CLI](../virtual-machines/linux/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json), [PowerShell](../virtual-machines/windows/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json)|
|Create a single NIC VM with multiple IPv4 addresses|[CLI](virtual-network-multiple-ip-addresses-cli.md), [PowerShell](virtual-network-multiple-ip-addresses-powershell.md)|
|Create a single NIC VM with a private IPv6 address (behind an Azure Load Balancer)|[CLI](../load-balancer/load-balancer-ipv6-internet-cli.md?toc=%2fazure%2fvirtual-network%2ftoc.json), [PowerShell](../load-balancer/load-balancer-ipv6-internet-ps.md?toc=%2fazure%2fvirtual-network%2ftoc.json), [Azure Resource Manager template](../load-balancer/load-balancer-ipv6-internet-template.md?toc=%2fazure%2fvirtual-network%2ftoc.json)|


