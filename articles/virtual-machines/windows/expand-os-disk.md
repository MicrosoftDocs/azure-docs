---
title: Expand the OS drive of a Windows VM in an Azure 
description: Expand the size of the OS drive of a virtual machine using Azure Powershell in the  Resource Manager deployment model.
author: mimckitt
manager: vashan
ms.service: virtual-machines-windows
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 07/05/2018
ms.author: mimckitt
ms.subservice: disks

---
# How to expand the OS drive of a virtual machine

When you create a new virtual machine (VM) in a Resource Group by deploying an image from [Azure Marketplace](https://azure.microsoft.com/marketplace/), the default OS drive is often 127 GB (some images have smaller OS disk sizes by default). Even though it’s possible to add data disks to the VM (how many depending upon the SKU you’ve chosen) and moreover it’s recommended to install applications and CPU intensive workloads on these addendum disks, oftentimes customers need to expand the OS drive to support certain scenarios such as following:

- Support legacy applications that install components on OS drive.
- Migrate a physical PC or virtual machine from on-premises with a larger OS drive.


> [!IMPORTANT]
> Resizing the OS Disk of an Azure Virtual Machine requires the virtual machine to be deallocated.
>
> After expanding the disks, you need to [expand the volume within the OS](#expand-the-volume-within-the-os) to take advantage of the larger disk.
> 


 


## Resize a managed disk

Open your Powershell ISE or Powershell window in administrative mode and follow the steps below:

1. Sign in to your Microsoft Azure account in resource management mode and select your subscription as follows:
   
   ```powershell
   Connect-AzAccount
   Select-AzSubscription –SubscriptionName 'my-subscription-name'
   ```
2. Set your resource group name and VM name as follows:
   
   ```powershell
   $rgName = 'my-resource-group-name'
   $vmName = 'my-vm-name'
   ```
3. Obtain a reference to your VM as follows:
   
   ```powershell
   $vm = Get-AzVM -ResourceGroupName $rgName -Name $vmName
   ```
4. Stop the VM before resizing the disk as follows:
   
    ```Powershell
    Stop-AzVM -ResourceGroupName $rgName -Name $vmName
    ```
5. Obtain a reference to the managed OS disk. Set the size of the managed OS disk to the desired value and update the Disk as follows:
   
   ```Powershell
   $disk= Get-AzDisk -ResourceGroupName $rgName -DiskName $vm.StorageProfile.OsDisk.Name
   $disk.DiskSizeGB = 1023
   Update-AzDisk -ResourceGroupName $rgName -Disk $disk -DiskName $disk.Name
   ```   
   > [!WARNING]
   > The new size should be greater than the existing disk size. The maximum allowed is 2048 GB for OS disks. (It is possible to expand the VHD blob beyond that size, but the OS will only be able to work with the first 2048 GB of space.)
   > 
   > 
6. Updating the VM may take a few seconds. Once the command finishes executing, restart the VM as follows:
   
   ```Powershell
   Start-AzVM -ResourceGroupName $rgName -Name $vmName
   ```

And that’s it! Now RDP into the VM, open Computer Management (or Disk Management) and expand the drive using the newly allocated space.

## Resize an unmanaged disk

Open your Powershell ISE or Powershell window in administrative mode and follow the steps below:

1. Sign in to your Microsoft Azure account in resource management mode and select your subscription as follows:
   
   ```Powershell
   Connect-AzAccount
   Select-AzSubscription –SubscriptionName 'my-subscription-name'
   ```
2. Set your resource group name and VM name as follows:
   
   ```Powershell
   $rgName = 'my-resource-group-name'
   $vmName = 'my-vm-name'
   ```
3. Obtain a reference to your VM as follows:
   
   ```Powershell
   $vm = Get-AzVM -ResourceGroupName $rgName -Name $vmName
   ```
4. Stop the VM before resizing the disk as follows:
   
    ```Powershell
    Stop-AzVM -ResourceGroupName $rgName -Name $vmName
    ```
5. Set the size of the unmanaged OS disk to the desired value and update the VM as follows:
   
   ```Powershell
   $vm.StorageProfile.OSDisk.DiskSizeGB = 1023
   Update-AzVM -ResourceGroupName $rgName -VM $vm
   ```
   
   > [!WARNING]
   > The new size should be greater than the existing disk size. The maximum allowed is 2048 GB for OS disks. (It is possible to expand the VHD blob beyond that size, but the OS will only be able to work with the first 2048 GB of space.)
   > 
   > 
   
6. Updating the VM may take a few seconds. Once the command finishes executing, restart the VM as follows:
   
   ```Powershell
   Start-AzVM -ResourceGroupName $rgName -Name $vmName
   ```


## Scripts for OS disk

Below is the complete script for your reference for both managed and unmanaged disks:


**Managed disks**

```Powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionName 'my-subscription-name'
$rgName = 'my-resource-group-name'
$vmName = 'my-vm-name'
$vm = Get-AzVM -ResourceGroupName $rgName -Name $vmName
Stop-AzVM -ResourceGroupName $rgName -Name $vmName
$disk= Get-AzDisk -ResourceGroupName $rgName -DiskName $vm.StorageProfile.OsDisk.Name
$disk.DiskSizeGB = 1023
Update-AzDisk -ResourceGroupName $rgName -Disk $disk -DiskName $disk.Name
Start-AzVM -ResourceGroupName $rgName -Name $vmName
```

**Unmanaged disks**

```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionName 'my-subscription-name'
$rgName = 'my-resource-group-name'
$vmName = 'my-vm-name'
$vm = Get-AzVM -ResourceGroupName $rgName -Name $vmName
Stop-AzVM -ResourceGroupName $rgName -Name $vmName
$vm.StorageProfile.OSDisk.DiskSizeGB = 1023
Update-AzVM -ResourceGroupName $rgName -VM $vm
Start-AzVM -ResourceGroupName $rgName -Name $vmName
```

## Resizing data disks

This article is focused primarily on expanding the OS disk of the VM, but the script can also be used for expanding the data disks attached to the VM. For example, to expand the first data disk attached to the VM, replace the `OSDisk` object of `StorageProfile` with `DataDisks` array and use a numeric index to obtain a reference to first attached data disk, as shown below:

**Managed disk**

```powershell
$disk= Get-AzDisk -ResourceGroupName $rgName -DiskName $vm.StorageProfile.DataDisks[0].Name
$disk.DiskSizeGB = 1023
```


**Unmanaged disk**

```powershell
$vm.StorageProfile.DataDisks[0].DiskSizeGB = 1023
```



Similarly you may reference other data disks attached to the VM, either by using an index as shown above or the **Name** property of the disk:


**Managed disk**

```powershell
(Get-AzDisk -ResourceGroupName $rgName -DiskName ($vm.StorageProfile.DataDisks | Where ({$_.Name -eq 'my-second-data-disk'})).Name).DiskSizeGB = 1023
```

**Unmanaged disk**

```powershell
($vm.StorageProfile.DataDisks | Where ({$_.Name -eq 'my-second-data-disk'}).DiskSizeGB = 1023
```

## Expand the volume within the OS

Once you have expanded the disk for the VM, you need to go into the OS and expand the volume to encompass the new space. There are several methods for expanding a partition. This section covers connecting the VM using an RDP connection to expand the partition using **DiskPart**.

1. Open an RDP connection to your VM.

2.  Open a command prompt and type **diskpart**.

2.  At the **DISKPART** prompt, type `list volume`. Make note of the volume you want to extend.

3.  At the **DISKPART** prompt, type `select volume <volumenumber>`. This selects the volume *volumenumber* that you want to extend into contiguous, empty space on the same disk.

4.  At the **DISKPART** prompt, type `extend [size=<size>]`. This extends the selected volume by *size* in megabytes (MB).


## Next steps

You can also attach disks using the [Azure portal](attach-managed-disk-portal.md).
