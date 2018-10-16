---
title: Tutorial - Create and manage Windows VMs with Azure PowerShell | Microsoft Docs
description: In this tutorial, you learn how to use Azure PowerShell to create and manage Windows VMs in Azure
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 08/10/2018
ms.author: cynthn
ms.custom: mvc

#Customer intent: As an IT administrator, I want to learn about common maintenance tasks so that I can create and manage Windows VMs in Azure
---

# Tutorial: Create and Manage Windows VMs with Azure PowerShell

Azure virtual machines provide a fully configurable and flexible computing environment. This tutorial covers basic Azure virtual machine deployment items such as selecting a VM size, selecting a VM image, and deploying a VM. You learn how to:

> [!div class="checklist"]
> * Create and connect to a VM
> * Select and use VM images
> * View and use specific VM sizes
> * Resize a VM
> * View and understand VM state

[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 5.7.0 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.

## Create resource group

Create a resource group with the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) command.

An Azure resource group is a logical container into which Azure resources are deployed and managed. A resource group must be created before a virtual machine. In the following example, a resource group named *myResourceGroupVM* is created in the *EastUS* region:

```azurepowershell-interactive
New-AzureRmResourceGroup -ResourceGroupName "myResourceGroupVM" -Location "EastUS"
```

The resource group is specified when creating or modifying a VM, which can be seen throughout this tutorial.

## Create virtual machine

When creating a virtual machine, several options are available such as operating system image, network configuration, and administrative credentials. In this example, a virtual machine is created with a name of *myVM* running the default latest version of Windows Server 2016 Datacenter.

Set the username and password needed for the administrator account on the virtual machine with [Get-Credential](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.security/get-credential?view=powershell-6):

```azurepowershell-interactive
$cred = Get-Credential
```

Create the virtual machine with [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm).

```azurepowershell-interactive
New-AzureRmVm `
    -ResourceGroupName "myResourceGroupVM" `
    -Name "myVM" `
    -Location "EastUS" `
    -VirtualNetworkName "myVnet" `
    -SubnetName "mySubnet" `
    -SecurityGroupName "myNetworkSecurityGroup" `
    -PublicIpAddressName "myPublicIpAddress" `
    -Credential $cred
```

## Connect to VM

After the deployment has completed, create a remote desktop connection with the virtual machine.

Run the following commands to return the public IP address of the virtual machine. Take note of this IP Address so you can connect to it with your browser to test web connectivity in a future step.

```azurepowershell-interactive
Get-AzureRmPublicIpAddress -ResourceGroupName "myResourceGroupVM"  | Select IpAddress
```

Use the following command, on your local machine, to create a remote desktop session with the virtual machine. Replace the IP address with the *publicIPAddress* of your virtual machine. When prompted, enter the credentials used when creating the virtual machine.

```powershell
mstsc /v:<publicIpAddress>
```

In the **Windows Security** window, select **More choices** and then **Use a different account**. Type the username and password you created for the virtual machine and then click **OK**.

## Understand VM images

The Azure marketplace includes many virtual machine images that can be used to create a new virtual machine. In the previous steps, a virtual machine was created using the Windows Server 2016 Datacenter image. In this step, the PowerShell module is used to search the marketplace for other Windows images, which can also be used as a base for new VMs. This process consists of finding the publisher, offer, SKU, and optionally a version number to [identify](cli-ps-findimage.md#terminology) the image.

Use the [Get-AzureRmVMImagePublisher](/powershell/module/azurerm.compute/get-azurermvmimagepublisher) command to return a list of image publishers:

```azurepowershell-interactive
Get-AzureRmVMImagePublisher -Location "EastUS"
```

Use the [Get-AzureRmVMImageOffer](/powershell/module/azurerm.compute/get-azurermvmimageoffer) to return a list of image offers. With this command, the returned list is filtered on the specified publisher:

```azurepowershell-interactive
Get-AzureRmVMImageOffer -Location "EastUS" -PublisherName "MicrosoftWindowsServer"
```

```azurepowershell-interactive
Offer             PublisherName          Location
-----             -------------          --------
Windows-HUB       MicrosoftWindowsServer EastUS
WindowsServer     MicrosoftWindowsServer EastUS
WindowsServer-HUB MicrosoftWindowsServer EastUS
```

The [Get-AzureRmVMImageSku](/powershell/module/azurerm.compute/get-azurermvmimagesku) command will then filter on the publisher and offer name to return a list of image names.

```azurepowershell-interactive
Get-AzureRmVMImageSku -Location "EastUS" -PublisherName "MicrosoftWindowsServer" -Offer "WindowsServer"
```

```azurepowershell-interactive
Skus                                      Offer         PublisherName          Location
----                                      -----         -------------          --------
2008-R2-SP1                               WindowsServer MicrosoftWindowsServer EastUS  
2008-R2-SP1-smalldisk                     WindowsServer MicrosoftWindowsServer EastUS  
2012-Datacenter                           WindowsServer MicrosoftWindowsServer EastUS  
2012-Datacenter-smalldisk                 WindowsServer MicrosoftWindowsServer EastUS  
2012-R2-Datacenter                        WindowsServer MicrosoftWindowsServer EastUS  
2012-R2-Datacenter-smalldisk              WindowsServer MicrosoftWindowsServer EastUS  
2016-Datacenter                           WindowsServer MicrosoftWindowsServer EastUS  
2016-Datacenter-Server-Core               WindowsServer MicrosoftWindowsServer EastUS  
2016-Datacenter-Server-Core-smalldisk     WindowsServer MicrosoftWindowsServer EastUS
2016-Datacenter-smalldisk                 WindowsServer MicrosoftWindowsServer EastUS
2016-Datacenter-with-Containers           WindowsServer MicrosoftWindowsServer EastUS
2016-Datacenter-with-Containers-smalldisk WindowsServer MicrosoftWindowsServer EastUS
2016-Datacenter-with-RDSH                 WindowsServer MicrosoftWindowsServer EastUS
2016-Nano-Server                          WindowsServer MicrosoftWindowsServer EastUS
```

This information can be used to deploy a VM with a specific image. This example deploys a virtual machine using the latest version of a Windows Server 2016 with Containers image.

```azurepowershell-interactive
New-AzureRmVm `
    -ResourceGroupName "myResourceGroupVM" `
    -Name "myVM2" `
    -Location "EastUS" `
    -VirtualNetworkName "myVnet" `
    -SubnetName "mySubnet" `
    -SecurityGroupName "myNetworkSecurityGroup" `
    -PublicIpAddressName "myPublicIpAddress2" `
    -ImageName "MicrosoftWindowsServer:WindowsServer:2016-Datacenter-with-Containers:latest" `
    -Credential $cred `
    -AsJob
```

The `-AsJob` parameter creates the VM as a background task, so the PowerShell prompts return to you. You can view details of background jobs with the `Get-Job` cmdlet.

## Understand VM sizes

A virtual machine size determines the amount of compute resources such as CPU, GPU, and memory that are made available to the virtual machine. Virtual machines need to be created with a size appropriate for the expect workload. If workload increases, an existing virtual machine can be resized.

### VM Sizes

The following table categorizes sizes into use cases.  
| Type                     | Common sizes           |    Description       |
|--------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------|
| [General purpose](sizes-general.md)         |Dsv3, Dv3, DSv2, Dv2, DS, D, Av2, A0-7| Balanced CPU-to-memory. Ideal for dev / test and small to medium applications and data solutions.  |
| [Compute optimized](sizes-compute.md)   | Fs, F             | High CPU-to-memory. Good for medium traffic applications, network appliances, and batch processes.        |
| [Memory optimized](sizes-memory.md)    | Esv3, Ev3, M, GS, G, DSv2, DS, Dv2, D   | High memory-to-core. Great for relational databases, medium to large caches, and in-memory analytics.                 |
| [Storage optimized](sizes-storage.md)      | Ls                | High disk throughput and IO. Ideal for Big Data, SQL, and NoSQL databases.                                                         |
| [GPU](sizes-gpu.md)          | NV, NC            | Specialized VMs targeted for heavy graphic rendering and video editing.       |
| [High performance](sizes-hpc.md) | H, A8-11          | Our most powerful CPU VMs with optional high-throughput network interfaces (RDMA). |

### Find available VM sizes

To see a list of VM sizes available in a particular region, use the [Get-AzureRmVMSize](/powershell/module/azurerm.compute/get-azurermvmsize) command.

```azurepowershell-interactive
Get-AzureRmVMSize -Location "EastUS"
```

## Resize a VM

After a VM has been deployed, it can be resized to increase or decrease resource allocation.

Before resizing a VM, check if the desired size is available on the current VM cluster. The [Get-AzureRmVMSize](/powershell/module/azurerm.compute/get-azurermvmsize) command returns a list of sizes.

```azurepowershell-interactive
Get-AzureRmVMSize -ResourceGroupName "myResourceGroupVM" -VMName "myVM"
```

If the desired size is available, the VM can be resized from a powered-on state, however it is rebooted during the operation.

```azurepowershell-interactive
$vm = Get-AzureRmVM -ResourceGroupName "myResourceGroupVM"  -VMName "myVM"
$vm.HardwareProfile.VmSize = "Standard_D4"
Update-AzureRmVM -VM $vm -ResourceGroupName "myResourceGroupVM"
```

If the desired size is not on the current cluster, the VM needs to be deallocated before the resize operation can occur. Note, when the VM is powered back on, any data on the temp disk are removed, and the public IP address change unless a static IP address is being used.

```azurepowershell-interactive
Stop-AzureRmVM -ResourceGroupName "myResourceGroupVM" -Name "myVM" -Force
$vm = Get-AzureRmVM -ResourceGroupName "myResourceGroupVM"  -VMName "myVM"
$vm.HardwareProfile.VmSize = "Standard_F4s"
Update-AzureRmVM -VM $vm -ResourceGroupName "myResourceGroupVM"
Start-AzureRmVM -ResourceGroupName "myResourceGroupVM"  -Name $vm.name
```

## VM power states

An Azure VM can have one of many power states. This state represents the current state of the VM from the standpoint of the hypervisor.

### Power states

| Power State | Description
|----|----|
| Starting | Indicates the virtual machine is being started. |
| Running | Indicates that the virtual machine is running. |
| Stopping | Indicates that the virtual machine is being stopped. |
| Stopped | Indicates that the virtual machine is stopped. Note that virtual machines in the stopped state still incur compute charges.  |
| Deallocating | Indicates that the virtual machine is being deallocated. |
| Deallocated | Indicates that the virtual machine is completely removed from the hypervisor but still available in the control plane. Virtual machines in the Deallocated state do not incur compute charges. |
| - | Indicates that the power state of the virtual machine is unknown. |

### Find power state

To retrieve the state of a particular VM, use the [Get-AzureRmVM](/powershell/module/azurerm.compute/get-azurermvm) command. Be sure to specify a valid name for a virtual machine and resource group.

```azurepowershell-interactive
Get-AzureRmVM `
    -ResourceGroupName "myResourceGroupVM" `
    -Name "myVM" `
    -Status | Select @{n="Status"; e={$_.Statuses[1].Code}}
```

Output:

```azurepowershell-interactive
Status
------
PowerState/running
```

## Management tasks

During the lifecycle of a virtual machine, you may want to run management tasks such as starting, stopping, or deleting a virtual machine. Additionally, you may want to create scripts to automate repetitive or complex tasks. Using Azure PowerShell, many common management tasks can be run from the command line or in scripts.

### Stop virtual machine

Stop and deallocate a virtual machine with [Stop-AzureRmVM](/powershell/module/azurerm.compute/stop-azurermvm):

```azurepowershell-interactive
Stop-AzureRmVM -ResourceGroupName "myResourceGroupVM" -Name "myVM" -Force
```

If you want to keep the virtual machine in a provisioned state, use the -StayProvisioned parameter.

### Start virtual machine

```azurepowershell-interactive
Start-AzureRmVM -ResourceGroupName "myResourceGroupVM" -Name "myVM"
```

### Delete resource group

Deleting a resource group also deletes all resources contained within.

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name "myResourceGroupVM" -Force
```

## Next steps

In this tutorial, you learned about basic VM creation and management such as how to:

> [!div class="checklist"]
> * Create and connect to a VM
> * Select and use VM images
> * View and use specific VM sizes
> * Resize a VM
> * View and understand VM state

Advance to the next tutorial to learn about VM disks.  

> [!div class="nextstepaction"]
> [Create and Manage VM disks](./tutorial-manage-data-disk.md)
