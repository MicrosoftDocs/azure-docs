---
title: Convert a VM from unmanaged to managed disks - Azure | Microsoft Docs
description: Convert a VM from unmanaged disks to managed disks using PowerShell in the Resource Manager deployment model
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 02/22/2017
ms.author: cynthn

---
# Convert a VM from unmanaged disks to managed disks

If you have existing Azure VMs that use unmanaged disks in storage accounts and you want to be able to take advantage of [Managed Disks](../../storage/storage-managed-disks-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json), you can convert the VMs. The process converts both the OS disk and any attached data disks from using an unmanaged disks in a storage account to using managed disks. The VMs are shut down and deallocated, then you use Powershell to convert the VM to use managed disks. After the conversion, you restart the VM and it will now be using managed disks.

Before starting,  make sure that you review [Plan for the migration to Managed Disks](on-prem-to-azure.md#plan-for-the-migration-to-managed-disks).
Test the migration process by migrating a test virtual machine before performing the migration in production because the migration process is not reversible.


> [!IMPORTANT] 
> During the conversion, you will be deallocating the VM. Deallocating the VM means that it will have a new IP address when it is started after the conversion. If you have a dependency on a fixed IP, you should use a reserved IP.


## Managed Disks and Azure Storage Service Encryption (SSE)

You cannot convert an unmanaged VM created in the Resource Manager deployment model to Managed Disks if any of the attached unmanaged disks is in a storage account that is, or at any time has been, encrypted using [Azure Storage Service Encryption (SSE)](../../storage/storage-service-encryption.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). The following steps detail how to convert unmanaged VM that are, or have been, in an encrypted storage account:

**Data Disks**:
1.	Detach the Data Disk from the VM.
2.	Copy the VHD to a storage account that has never been enabled for SSE. To copy the disk to another storage account, use [AzCopy](../../storage/storage-use-azcopy.md): `AzCopy /Source:https://sourceaccount.blob.core.windows.net/mycontainer1 /Dest:https://destaccount.blob.core.windows.net/mycontainer2 /SourceKey:key1 /DestKey:key2 /Pattern:myDataDisk.vhd`
3.	Attach the copied disk to the VM and convert the VM.

**OS Disk**:
1.	Stop deallocated the VM. Save the VM configuration if needed.
2.	Copy the OS VHD to a storage account that has never been enabled for SSE. To copy the disk to another storage account, use [AzCopy](../../storage/storage-use-azcopy.md): `AzCopy /Source:https://sourceaccount.blob.core.windows.net/mycontainer1 /Dest:https://destaccount.blob.core.windows.net/mycontainer2 /SourceKey:key1 /DestKey:key2 /Pattern:myVhd.vhd`
3.	Create a VM that uses managed disks and attach that VHD file as the OS disk during creation.

## Convert VMs in an availability set to managed disks in a managed availability set

If the VMs that you want to convert to managed disks are in an availability set, you first need to convert the availability set to a managed availability set.

The following script updates the availability set to be a managed availability set, then it deallocates, coverts the disks and then restarts each VM in the availability set.

```powershell
$rgName = 'myResourceGroup'
$avSetName = 'myAvailabilitySet'

$avSet =  Get-AzureRmAvailabilitySet -ResourceGroupName $rgName -Name $avSetName

Update-AzureRmAvailabilitySet -AvailabilitySet $avSet -Managed

foreach($vmInfo in $avSet.VirtualMachinesReferences)
	{
   $vm =  Get-AzureRmVM -ResourceGroupName $rgName | Where-Object {$_.Id -eq $vmInfo.id}

   Stop-AzureRmVM -ResourceGroupName $rgName -Name  $vm.Name -Force

   ConvertTo-AzureRmVMManagedDisk -ResourceGroupName $rgName -VMName $vm.Name
   
	}
```

## Convert existing Azure VMs to managed disks of the same storage type

This section covers how to convert your existing Azure VMs from unmanaged disks in storage accounts to managed disks when you will be using the same storage type. You can use this process to go from Premium (SSD) unmanaged disks to Premium managed disks or from standard (HDD) unmanaged disks to standard managed disks. 

1. Create variables and deallocate the VM. This example sets the resource group name to **myResourceGroup** and the VM name to **myVM**.

    ```powershell
	$rgName = "myResourceGroup"
	$vmName = "myVM"
	Stop-AzureRmVM -ResourceGroupName $rgName -Name $vmName -Force
    ```
   
    The *Status* for the VM in the Azure portal changes from **Stopped** to **Stopped (deallocated)**.
	
2. Convert all of the disks associated with the VM including the OS disk and any data disks.

    ```powershell
    ConvertTo-AzureRmVMManagedDisk -ResourceGroupName $rgName -VMName $vmName
    ```


## Migrate existing Azure VMs using standard unmanaged disks to Premium managed disks

This section will show you how to convert your existing Azure VMs on Standard unmanaged disks to Premium managed disks. In order to use Premium Managed Disks, your VM must use a [VM size](sizes.md) that supports Premium storage.


1.  First, set the common parameters. Make sure the [VM size](sizes.md) you select supports Premium storage.

    ```powershell
    $resourceGroupName = 'YourResourceGroupName'
	$vmName = 'YourVMName'
	$size = 'Standard_DS2_v2'
	```
1.  Get the VM with Unmanaged disks

    ```powershell
    $vm = Get-AzureRmVM -Name $vmName -ResourceGroupName $resourceGroupName
    ```
	
1.  Stop (Deallocate) the VM.

    ```powershell
	Stop-AzureRmVM -ResourceGroupName $resourceGroupName -Name $vmName -Force
	```

1.  Update the size of the VM to Premium Storage capable size available in the region where VM is located.

    ```powershell
	$vm.HardwareProfile.VmSize = $size
	Update-AzureRmVM -VM $vm -ResourceGroupName $resourceGroupName
	```

1.  Convert virtual machine with unmanaged disks to Managed Disks. 

	If you get internal server error, please retry 2-3 times before reaching out to our support team.

    ```powershell
	ConvertTo-AzureRmVMManagedDisk -ResourceGroupName $resourceGroupName -VMName $vmName
	```
1. Stop (deallocate) the VM.

    ```powershell
    Stop-AzureRmVM -ResourceGroupName $resourceGroupName -Name $vmName -Force
    ```
2.  Upgrade all of the disks to Premium Storage.

    ```powershell
	$vmDisks = Get-AzureRmDisk -ResourceGroupName $resourceGroupName 
	foreach ($disk in $vmDisks) 
	    {
	    if($disk.OwnerId -eq $vm.Id)
		    {
		     $diskUpdateConfig = New-AzureRmDiskUpdateConfig –AccountType PremiumLRS
			 Update-AzureRmDisk -DiskUpdate $diskUpdateConfig -ResourceGroupName $resourceGroupName `
			 -DiskName $disk.Name
			}
		}
    ```
1. Start the VM.

    ```powershell
    Start-AzureRmVM -ResourceGroupName $resourceGroupName -Name $vmName
    ```
    
You can also have a mixture of disks that use standard and Premium storage.
	

## Next steps

Take a read-only copy of a VM using [snapshots](snapshot-copy-managed-disk.md).

