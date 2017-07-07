---
title: Add network interfaces to or remove from Azure virtual machines | Microsoft Docs
description: Learn how to add network interfaces (NIC) to or remove NICs from virtual machines.
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

Learn how to add an existing network interface (NIC) when creating a VM or add or remove NICs from an existing VM in the stopped (deallocated) state. A NIC enables an Azure Virtual Machine (VM) to communicate with Internet, Azure, and on-premises resources. A VM can have one or more NICs. 

If you need to add, change, or remove IP addresses for a NIC, read the [Add, change, or remove IP addresses](virtual-network-network-interface-addresses.md) article. If you need to create, change, or delete NICs, read the [NIC settings and tasks](virtual-network-network-interface.md) article.

## <a name="before"></a>Before you begin

Complete the following tasks before completing any steps in any section of this article:

- Learn about how many NICs each Linux and Windows VM size supports by reviewing the [Linux](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Windows](../virtual-machines/virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) VM sizes articles.
- Log in to the Azure portal, Azure command-line interface (CLI), or Azure PowerShell with an Azure account. If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).
- If using PowerShell commands to complete tasks in this article, install and configure Azure PowerShell by completing the steps in the [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs?toc=%2fazure%2fvirtual-network%2ftoc.json) article. Ensure you have the most recent version of the Azure PowerShell commandlets installed. To get help for PowerShell commands, with examples, type `get-help <command> -full`.
- If using Azure Command-line interface (CLI) commands to complete tasks in this article, install and configure the Azure CLI by completing the steps in the [How to install and configure the Azure CLI](/cli/azure/install-azure-cli?toc=%2fazure%2fvirtual-network%2ftoc.json) article. Ensure you have the most recent version of the Azure CLI installed.To get help for CLI commands, type `az <command> --help`.

## <a name="about"></a>About NICs and VMs

You can add (attach) an existing NIC to a VM when you create the VM, provided the NIC isn't currently attached to another VM. You can add a NIC to, or remove (detach) a NIC to from an existing VM, provided the VM is in the stopped (deallocated) state. If you create a VM using the Azure portal, the portal creates a NIC for you with default settings. The portal does not allow you to:

- Specify an existing NIC to add when creating the VM
- Create a VM with multiple NICs
- Specify a name for the NIC (the portal creates the NIC with a default name)

You can use Azure PowerShell or the CLI to create a NIC or VM with all the previous attributes that you cannot use the portal for. Before completing the tasks in the following sections, consider the following constraints and behaviors:

- All VM sizes support at least two NICs, but some VM sizes support more than two NICs. In the past, some VM sizes only supported one NIC. To learn how many NICs each VM size supports, read the [Linux](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Windows](../virtual-machines/virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) VM sizes articles. 
- In the past, NICs could only be added to VMs that supported multiple NICs and were created with at least two NICs. You could not add a NIC to a VM that was created with one NIC, even if the VM size supported multiple NICs. Conversely, you could only remove NICs from a VM with at least three NICs, because VMs created with at least two NICs always had to have at least two NICs. Neither of these constraints apply anymore. You can now create a VM with any number of NICs (up to the number supported by the VM size) and add or remove any number of NICs (from VMs in the stopped (deallocated) state), as long as the VM always has at least one NIC.
- By default, the first NIC in a VM is defined as the *primary* NIC. All other NICs in the VM are *secondary* NICs.
- Primary NICs are assigned a default gateway by the Azure DHCP servers, but secondary NICs are not. Since secondary NICs aren't assigned a default gateway, they cannot communicate with resources outside of their subnet, by default. To enable secondary NICs in a Windows VM to communicate with resources outside their subnet, add routes to the operating system using the `route add` command from a Windows command-line. For Linux VMs, since the default behavior uses weak host routing, we recommend restricting traffic for secondary NICs to a single subnet. If you require connectivity outside the subnet for secondary NICs, enable policy-based routing to ensure that ingress and egress traffic uses the same NIC.
- By default, all outbound traffic from the VM is sent out the IP address assigned to the primary IP configuration of the primary NIC. You control which IP address is used for outbound traffic within the VM's operating system, but by default, it's through the primary NIC.
- In the past, all VMs within the same availability set were required to have a single, or multiple, NICs. VMs with any number of NICs can now exist in the same availability set, up to the number supported by the VM size. You can only add a VM to an availability set when it's created though. To learn more about availability sets, read the [Manage the availability of VMs in Azure](../virtual-machines/windows/manage-availability.md?toc=%2fazure%2fvirtual-network%2ftoc.json#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy) article.
- While NICs in the same VM can be connected to different subnets within a VNet, the NICs must all be connected to the same VNet.
- You can add any IP address for any IP configuration of any primary or secondary NIC to an Azure Load Balancer back-end pool. In the past, only the primary IP address for the primary NIC could be added to a back-end pool. To learn more about IP addresses and configurations, read the [Add, change, or remove IP addresses](virtual-network-network-interface-addresses.md) article.
- Deleting a VM does not delete the NICs that are attached to it. When a VM is deleted, the NICs are detached from the VM. You can add the NICs to different VMs, or delete them.

## <a name="vm-create"></a>Add existing NICs to a new VM
When you create a VM through the portal, the portal creates a NIC with default settings and attaches it to the VM for you. You cannot add existing NICs to a new VM, or create a VM with multiple NICs using the Azure portal. You can do both using the CLI or PowerShell. You can add as many NICs to a VM as the VM size you're creating supports. To learn more about how many NICs each VM size supports, read the [Linux](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Windows](../virtual-machines/virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) VM sizes articles. The NICs you add to a VM cannot currently be attached to another VM. To learn more about creating NICs, read the [NIC settings and tasks](virtual-network-network-interface.md#create-nic) article.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az vm create](/cli/azure/vm?toc=%2fazure%2fvirtual-network%2ftoc.json#create)|
|PowerShell|[New-AzureRmVM](/powershell/resourcemanager/azurerm.compute/v2.5.0/new-azurermvm?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="vm-add-nic"></a>Add existing NICs to an existing VM

You can add as many NICs to a VM as the VM size you're adding NICs to supports. To learn how many NICs each VM size supports, read the [Linux](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Windows](../virtual-machines/virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-network%2ftoc.json) VM sizes articles. The VM you want to add a NIC to must support multiple NICs and be in the stopped (deallocated) state. The NICs you want to add cannot currently be attached to another VM. You cannot add NICs to an existing VM using the Azure portal. You must use the CLI or PowerShell to add NICs to an existing VM.

|Tool|Command|
|---|---|
|CLI|[az vm nic add](/cli/azure/vm/nic?toc=%2fazure%2fvirtual-network%2ftoc.json#add)|
|PowerShell|[Add-AzureRmVMNetworkInterface](/powershell/resourcemanager/azurerm.compute/v2.5.0/add-azurermvmnetworkinterface?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="vm-view-nic"></a> View NICs for a VM

You can view the NICs currently attached to a VM to learn about each NIC's configuration, and the IP addresses assigned to each NIC. 

1. Log in to the [Azure portal](https://portal.azure.com) with an account that is assigned the Owner, Contributor, or Network Contributor role for your subscription. Read the [Built-in roles for Azure role-based access control](../active-directory/role-based-access-built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) article to learn more about assigning roles to accounts.
2. In the box that contains the text *Search resources* at the top of the Azure portal, type *virtual machines*. When **virtual machines** appears in the search results, click it.
3. In the **Virtual machines** blade that appears, click the name of the VM you want to view NICs for.
4. In the **SETTINGS** section of the virtual machine blade that appears for the VM you selected, click **Network interfaces**. To learn about NIC settings and how to change them, read the [NIC settings and tasks](virtual-network-network-interface.md) article. To learn about adding, changing, or removing IP addresses assigned to a NIC, read the [Add, change, or remove IP addresses](virtual-network-network-interface-addresses.md) article.

**Commands**

|Tool|Command|
|---|---|
|CLI|[az vm show](/cli/azure/vm?toc=%2fazure%2fvirtual-network%2ftoc.json#show)|
|PowerShell|[Get-AzureRmVM](/powershell/resourcemanager/azurerm.compute/v1.3.4/get-azurermvm?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="vm-remove-nic"></a> Remove NICs from a VM

The VM you want to remove a NIC from must be in the stopped (deallocated) state and must currently have at least two NICs attached to it. You can remove any NIC, but the VM must always have at least one NIC attached to it. If you remove a primary NIC, Azure assigns the primary attribute to the NIC that's been attached to the VM the longest. You can designate any NIC as the primary yourself. You cannot remove NICs from a VM, nor set the primary attribute for a NIC using the Azure portal, though you can accomplish both operations using the CLI or PowerShell. 

**Commands**

|Tool|Command|
|---|---|
|CLI|[az vm nic remove](/cli/azure/vm/nic?toc=%2fazure%2fvirtual-network%2ftoc.json#remove)|
|PowerShell|[Remove-AzureRMVMNetworkInterface](/powershell/resourcemanager/azurerm.compute/v2.5.0/remove-azurermvmnetworkinterface?toc=%2fazure%2fvirtual-network%2ftoc.json)|

## <a name="next-steps"></a>Next steps
To create a VM with multiple NICs or IP addresses, read the following articles:

**Commands**

|Task|Tool|
|---|---|
|Create a VM with multiple NICs|[CLI](../virtual-machines/linux/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json)|
||[PowerShell](../virtual-machines/windows/multiple-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json)|
|Create a single NIC VM with multiple IP addresses|[CLI](virtual-network-multiple-ip-addresses-cli.md)|
||[PowerShell](virtual-network-multiple-ip-addresses-powershell.md)|
