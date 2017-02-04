---
title: Convert a VM from unmanged to managed disks - Azure | Microsoft Docs
description: Convert a VM from unmanaged disks to managed disks using PowerShell in the Resource Manager deployment model
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: afdae4a1-6dfb-47b4-902a-f327f9bfe5b4
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 02/03/2017
ms.author: cynthn

---
# Convert a VM from unmanaged disks to managed disks

If you have existing Azure VMs that use unmanaged disks in storage accounts and you want those VMs to be able to take advantage of managed disks, you can convert the VMs. The VMs are shut down and deallocated, then you use Powershell to convert the VM to use managed disks. After the conversion, you restart the VM and it will now be using managed disks.

The process converts both the OS disk and any attached data disks from using a unmanaged disks in a storage account to using managed disks. 

This process requires a restart of the VM, so you can schedule the migration of your VMs during a pre-existing maintenance window.

Test the migration process by migrating a test virtual machine before performing the migration in production because the migration process is not reversible.


> [!IMPORTANT] 
> During the conversion, you will be deallocating the VM. Deallocating the VM means that it will have a new IP address when it is started after the conversion. If you have a dependency on a fixed IP, you should use a reserved IP.

## Convert VMs in an availability set to managed disks in a managed availability set

If the VMs that you want to convert to managed disks are in an availability set, you first need to convert the availability set to a managed availability set.

```powershell
$avsetName = "myAVSet"
$rgName = "myResourceGroup"
$location = "West US"
Update-AzureRmAvailabilitySet -Location $location -Name $avsetName -ResourceGroupName $rgName -Managed
```



## Convert existing Azure VMs to managed disks of the same storage type

This section covers how to convert your existing Azure VMs from unmanaged disks in storage accounts to managed disks when you will be using the same storage type. You can use this process to go from Premium (SDD) unmanaged disks to Premium managed disks or from standard (HDD) unmanaged disks to standard managed disks. 

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

3. Start the VM 

    ```powershell
    Start-AzureRmVM -ResourceGroupName $rgName -VMName $vmName
    ```




## Migrate existing Azure VMs using Standard Unmanaged Disks to Premium Managed Disks

This section will show you how to convert your existing Azure VMs on Standard unmanaged disks to Premium managed disks. 

This process will require the VM to restart few times. You can schedule the migration of your VMs during a pre-existing maintenance window.

**Note:** Test the migration process by migrating a test virtual machine before performing the migration in production as the migration process is not reversible.

Prepare your application for downtime. To do a clean migration, you have to stop all the processing in the current system. Only then you can get it to consistent state which you can migrate to the new platform.


1.  First, set the common parameters. Make sure the [VM size](virtual-machines-windows-sizes.md) you select supports Premium storage.

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
	Stop-AzureRmVM -ResourceGroupName $resourceGroupName -VMName $vmName -Force
	```

1.  Update the size of the VM to Premium Storage capable size available in the region where VM is located.

    ```powershell
	$vm.HardwareProfile.VmSize = $size
	Update-AzureRmVM -VM $vm -ResourceGroupName $resourceGroupName
	```

1.  Convert virtual machine with unmanaged disks to Managed Disks.

    Note: If you get internal server error, please retry 2-3 times before reaching out to our support team.

    ```powershell
	ConvertTo-AzureRmVMManagedDisk -ResourceGroupName $resourceGroupName -VMName
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

    You can also have a mixture of disks that use standard and Premium storage.
	
3. Start the VM 

    ```powershell
    Start-AzureRmVM -ResourceGroupName $rgName -VMName $vmName
    ```

## Next steps

Take a read-only copy of a VM using [snapshots](xxx.md).

