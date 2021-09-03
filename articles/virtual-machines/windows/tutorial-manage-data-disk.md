---
title: Tutorial - Manage Azure disks with Azure PowerShell 
description: In this tutorial, you learn how to use Azure PowerShell to create and manage Azure disks for virtual machines
author: roygara
ms.author: rogarana
ms.service: storage
ms.subservice: disks
ms.topic: tutorial
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 08/23/2021
ms.custom: mvc, devx-track-azurepowershell
ms.custom: template-tutorial
#Customer intent: As an IT administrator, I want to learn about Azure Managed Disks so that I can create and manage storage for Windows VMs in Azure.
---

<!--

Do we need all this background content on disks in this tutorial? My instinct is to remove it.

Per the contributor guide (https://review.docs.microsoft.com/en-us/help/contribute/contribute-how-to-mvc-tutorial?branch=master):

 *"Tutorials lead a user through creating a proof of concept." *"Tutorials are intended to guide the customer through an end-to-end procedure."

This tutorial seems as though it's primarily a primer on disks. Background info and the disk size table make up roughly 75% of the page.

Most tutorials in this series (creating, configuring, managing VMs) do not have this amount of content prior to the procedural portion. The exception is "Create VM images", which has a separate "Overview" section at the top of the doc. While this seems appropriate, it appears to go against the tutorial guidance (intro, pre-reqs, free trial offer, and the PowerShell include come before the first H2). 

Beyond that, this tutorial has detailed steps to create a VM in the "Create and attach" section, which is handled differently in the other tutorials. 

-->

# Tutorial: Manage Azure disks with Azure PowerShell

Azure virtual machines (VMs) use disks to store their operating systems (OS), applications, and data. When you create a VM, it's important to choose an appropriate disk size and configuration for the expected workload. This tutorial covers deployment and management of VM disks.

In this tutorial, you learn about:

> [!div class="checklist"]

> * OS disks and temporary disks
> * Data disks
> * Standard and Premium disks
> * Disk performance
> * Attaching and preparing data disks

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An existing virtual machine. If needed, you can follow the [PowerShell quickstart](quick-create-powershell.md) to create a VM to use for this tutorial. When working through the tutorial, replace the resource names where needed.

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/powershell](https://shell.azure.com/powershell). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

<!--Propose removing this-->

## Overview

### Default Azure disks

When an Azure virtual machine is created, two disks are automatically attached to the virtual machine.

**Operating system disk** - OS disks host the VM's operating system, and can be sized up to 4 terabytes. The typical OS disk size for VMs created from [Azure Marketplace](https://azure.microsoft.com/marketplace/) images is 127 GB, though some images utilize smaller disks. The OS disk is assigned the drive letter *C:* by default, and its caching configuration is optimized for OS performance. The OS disk **should not** host applications or data. Data disks are better suited for applications and data, and are discussed later in this article.

**Temporary disk** - Temporary disks use a solid-state drive that is located on the same Azure host as the VM. Temporary disks are highly performant and may be used for operations such as temporary data processing. However, if the VM is moved to a new host, any data stored on a temporary disk is removed. The size of the temporary disk is determined by the [VM size](../sizes.md). Temporary disks are assigned a drive letter of *D:* by default.

### Azure data disks

Additional data disks can be added for installing applications and storing data. Data disks should be used in any situation where durable and responsive data storage is needed. The size of the virtual machine determines how many data disks can be attached to a VM. 

Azure provides two types of disks:

**Standard disks** - Standard disks are backed by hard disk drives (HDDs), and deliver cost-effective storage while still remaining performant. Standard disks are ideal for development and test workloads.

**Premium disks** - Premium disks are backed by high-performance, low-latency, solid-state disks (SSDs). Premium disks are the perfect perfect for VMs running production workloads. VM sizes with an  **S** in the [size name](../vm-naming-conventions.md) typically support Premium Storage. For example, DS-series, DSv2-series, GS-series, and FS-series VMs support premium storage. When you select a disk size, the value is rounded up to the next type. For example, if the disk size is more than 64 GB, but less than 128 GB, the disk type is P10.

[!INCLUDE [disk-storage-premium-ssd-sizes](../../../includes/disk-storage-premium-ssd-sizes.md)]

When you provision a premium storage disk, you are guaranteed the capacity, IOPS, and throughput of that disk. For example, when you create a P50 disk, Azure provisions 4,095-GB storage capacity, 7,500 IOPS, and 250-MB/s throughput for that disk. Your application can use all or part of the allocated capacity and performance. Premium SSDs are designed to provide single-digit millisecond latencies and target IOPS and throughput described in the preceding table 99.9% of the time.

While the included table identifies max IOPS per disk, a higher level of performance can be achieved by striping multiple data disks. For instance, up to 64 data disks can be attached to Standard_GS5 VM. If each of these disks is sized as a P30, a maximum of 80,000 IOPS can be achieved. For detailed information on max IOPS per VM, see [VM types and sizes](../sizes.md).

<!--/Propose removing this-->

## Create and attach disks

To complete the example in this tutorial, you must have an existing virtual machine. If needed, create a virtual machine with these commands:

Create the virtual machine with [New-AzVM](/powershell/module/az.compute/new-azvm). You'll be prompted to enter a username and password for the administrator account for the VM.

```azurepowershell-interactive
New-AzVm `
    -ResourceGroupName "myResourceGroupDisk" `
    -Name "myVM" `
    -Location "East US" `
    -VirtualNetworkName "myVnet" `
    -SubnetName "mySubnet" `
    -SecurityGroupName "myNetworkSecurityGroup" `
    -PublicIpAddressName "myPublicIpAddress" 
```

Create the initial configuration with [New-AzDiskConfig](/powershell/module/az.compute/new-azdiskconfig). The following example configures a disk that is 128 gigabytes in size.

```azurepowershell-interactive
$diskConfig = New-AzDiskConfig `
    -Location "EastUS" `
    -CreateOption Empty `
    -DiskSizeGB 128
```

Create the data disk with the [New-AzDisk](/powershell/module/az.compute/new-azdisk) command.

```azurepowershell-interactive
$dataDisk = New-AzDisk `
    -ResourceGroupName "myResourceGroupDisk" `
    -DiskName "myDataDisk" `
    -Disk $diskConfig
```

Get the virtual machine that you want to add the data disk to with the [Get-AzVM](/powershell/module/az.compute/get-azvm) command.

```azurepowershell-interactive
$vm = Get-AzVM -ResourceGroupName "myResourceGroupDisk" -Name "myVM"
```

Add the data disk to the virtual machine configuration with the [Add-AzVMDataDisk](/powershell/module/az.compute/add-azvmdatadisk) command.

```azurepowershell-interactive
$vm = Add-AzVMDataDisk `
    -VM $vm `
    -Name "myDataDisk" `
    -CreateOption Attach `
    -ManagedDiskId $dataDisk.Id `
    -Lun 1
```

Update the virtual machine with the [Update-AzVM](/powershell/module/az.compute/add-azvmdatadisk) command.

```azurepowershell-interactive
Update-AzVM -ResourceGroupName "myResourceGroupDisk" -VM $vm
```

## Prepare data disks

Once a disk has been attached to the virtual machine, the operating system needs to be configured to use the disk. The following example shows how to manually configure the first disk added to the VM. This process can also be automated using the [custom script extension](./tutorial-automate-vm-deployment.md).

### Manual configuration

Create a remote desktop protocol (RDP) connection with the virtual machine. Connect to the VM, open PowerShell, and run the `Get-Disk` cmdlet as shown.

If you no longer have access to an administrative account, set a username and password on the virtual machine with the [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential) cmdlet.

```azurepowershell
Get-Disk | Where partitionstyle -eq 'raw' |
    Initialize-Disk -PartitionStyle MBR -PassThru |
    New-Partition -AssignDriveLetter -UseMaximumSize |
    Format-Volume -FileSystem NTFS -NewFileSystemLabel "myDataDisk" -Confirm:$false
```

### Scripted configuration

TODO: Add the scripted configuration steps.

## Verify the data disk

To verify that the data disk is attached, view the `StorageProfile` for the attached `DataDisks`.

```azurepowershell-interactive
$vm.StorageProfile.DataDisks
```

The output should look something like this example:

```
Name            : myDataDisk
DiskSizeGB      : 128
Lun             : 1
Caching         : None
CreateOption    : Attach
SourceImage     :
VirtualHardDisk :
```

## Clean up resources

When no longer needed, delete the resource group, virtual machine, and all related resources. To do so, select the resource group for the VM and select **Delete**. You may also use the sample code provided.

 ```azurepowershell-interactive

    $rgName=$vm.ResourceGroupName
    Write-Host 'Resource group name: ' $rgName

    $saName = [regex]::match($vm.DiagnosticsProfile.bootDiagnostics.storageUri, '^http[s]?://(.+?)\.').groups[1].value
    Write-Host 'Marking Disks for deletion...'
    $tags = @{"VMName"=$VMName; "Delete Ready"="Yes"}
    $osDiskName = $vm.StorageProfile.OSDisk.Name
    $dataDisks = $vm.StorageProfile.DataDisks
    $resourceID = (Get-Azdisk -Name $osDiskName).Id
    New-AzTag -ResourceId $resourceID -Tag $tags | Out-Null

     if ($vm.StorageProfile.DataDisks.Count -gt 0) 
    {
        foreach ($dataDisk in $dataDisks)
        {
            Write-Host 'Running'
            $dataDiskName=$dataDisk.Name
            Write-Host 'Disk name: ' $dataDiskName
            $resourceID = (Get-Azdisk -Name $dataDiskName).Id
            Write-Host "Resource ID: " $resourceID
            New-AzTag -ResourceId $ResourceID -Tag $tags | Out-Null
        }
    }

     $azResourceParams = @{
        'ResourceName' = $vm.Name
        'ResourceType' = 'Microsoft.Compute/virtualMachines'
        'ResourceGroupName' = $rgName
    }

    $vmResource = Get-AzResource @azResourceParams
    $vmId = $vmResource.Properties.VmId
    $diagContainerName = ('bootdiagnostics-{0}-{1}' -f $vm.Name.ToLower().Substring(0, $i), $vmId)
    $diagSaRg = (Get-AzStorageAccount | where { $_.StorageAccountName -eq $diagSa }).ResourceGroupName
    $saParams = @{
        'ResourceGroupName' = $diagSaRg
        'Name' = $diagSa
    }

    #Remove boot diagnostic disk
    if ($diagSa) { Get-AzStorageAccount @saParams | Get-AzStorageContainer | where {$_.Name-eq $diagContainerName} | Remove-AzStorageContainer -Force }
    
    #Remove VM
    $null = $vm | Remove-AzVM -Force

    #Removing NICs, Public IP(s)
    foreach($nicUri in $vm.NetworkProfile.NetworkInterfaces.Id) 
    {
        $nic = Get-AzNetworkInterface -ResourceGroupName $vm.ResourceGroupName -Name $nicUri.Split('/')[-1]
        Remove-AzNetworkInterface -Name $nic.Name -ResourceGroupName $vm.ResourceGroupName -Force
        foreach($ipConfig in $nic.IpConfigurations) 
        {
            if($ipConfig.PublicIpAddress -ne $null)
            {
                Remove-AzPublicIpAddress -ResourceGroupName $vm.ResourceGroupName -Name $ipConfig.PublicIpAddress.Id.Split('/')[-1] -Force
            }
        }
    }

    #Removing OS and data disk(s)
    Get-AzResource -tag $tags | where{$_.resourcegroupname -eq $rgName}| Remove-AzResource -force | Out-Null
```

## Next steps

In this tutorial, you learned about VM disks topics such as:

> [!div class="checklist"]
> * OS disks and temporary disks
> * Data disks
> * Standard and Premium disks
> * Disk performance
> * Attaching and preparing data disks

Advance to the next tutorial to learn about automating VM configuration.

> [!div class="nextstepaction"]
> [Automate VM configuration](./tutorial-automate-vm-deployment.md)
