---
title: Expand the OS drive of a Windows VM in an Azure 
description: Expand the size of the OS drive of a virtual machine using Azure PowerShell in the  Resource Manager deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: kirpasingh
manager: roshar
editor: ''
tags: azure-resource-manager

ms.assetid: d9edfd9f-482f-4c0b-956c-0d2c2c30026c
ms.service: virtual-machines-windows

ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 09/02/2020
ms.author: kirpas
ms.subservice: disks

---
# How to expand the OS drive of a virtual machine

When you create a new virtual machine (VM) in a resource group by deploying an image from [Azure Marketplace](https://azure.microsoft.com/marketplace/), the default OS drive is often 127 GB (some images have smaller OS disk sizes by default). Even though it's possible to add data disks to the VM (the number depends on the SKU you chose) and we recommend installing applications and CPU-intensive workloads on these addendum disks, often, customers need to expand the OS drive to support specific scenarios:

- To support legacy applications that install components on the OS drive.
- To migrate a physical PC or VM from on-premises with a larger OS drive.

> [!IMPORTANT]
> Resizing an OS or Data Disk of an Azure Virtual Machine requires the virtual machine to be deallocated.
>
> After expanding the disks, you need to [expand the volume within the OS](#expand-the-volume-within-the-os) to take advantage of the larger disk.
> 

## Resize a managed disk in the Azure portal

1. In the [Azure portal](https://portal.azure.com), go to the virtual machine in which you want to expand the disk. Select **Stop** to deallocate the VM.
2. When the VM is stopped, in the left menu under **Settings**, select **Disks**.

    :::image type="content" source="./media/expand-os-disk/select-disks.png" alt-text="Screenshot that shows the Disks option selected in the Settings section of the menu.":::

 
3. Under **Disk name**, select the disk you want to resize.

    :::image type="content" source="./media/expand-os-disk/disk-name.png" alt-text="Screenshot that shows the Disks pane with a disk name selected.":::

4. In the left menu under **Settings**, select **Configuration**.

    :::image type="content" source="./media/expand-os-disk/configuration.png" alt-text="Screenshot that shows the Configuration option selected in the Settings section of the menu.":::

5. In **Size (GiB)**, select the disk size you want.
   
   > [!WARNING]
   > The new size should be greater than the existing disk size. The maximum allowed is 2,048 GB for OS disks. (It's possible to expand the VHD blob beyond that size, but the OS works only with the first 2,048 GB of space.)
   > 

    :::image type="content" source="./media/expand-os-disk/size.png" alt-text="Screenshot that shows the Configuration pane with the disk size selected.":::

6. Select **Save**.

    :::image type="content" source="./media/expand-os-disk/save.png" alt-text="Screenshot that shows the Configuration pane with the Save button selected.":::


## Resize a managed disk by using PowerShell

Open your PowerShell ISE or PowerShell window in administrative mode and follow the steps below:

1. Sign in to your Microsoft Azure account in resource management mode and select your subscription:
   
    ```powershell
    Connect-AzAccount
    Select-AzSubscription –SubscriptionName 'my-subscription-name'
    ```

2. Set your resource group name and VM name:
   
    ```powershell
    $rgName = 'my-resource-group-name'
    $vmName = 'my-vm-name'
    ```

3. Obtain a reference to your VM:
   
    ```powershell
    $vm = Get-AzVM -ResourceGroupName $rgName -Name $vmName
    ```

4. Stop the VM before resizing the disk:
   
    ```powershell
    Stop-AzVM -ResourceGroupName $rgName -Name $vmName
    ```

5. Obtain a reference to the managed OS disk. Set the size of the managed OS disk to the desired value and update the Disk:
   
    ```powershell
    $disk= Get-AzDisk -ResourceGroupName $rgName -DiskName $vm.StorageProfile.OsDisk.Name
    $disk.DiskSizeGB = 1023
    Update-AzDisk -ResourceGroupName $rgName -Disk $disk -DiskName $disk.Name
    ```   
    > [!WARNING]
    > The new size should be greater than the existing disk size. The maximum allowed is 2,048 GB for OS disks. (It is possible to expand the VHD blob beyond that size, but the OS works only with the first 2,048 GB of space.)
    > 
         
6. Updating the VM might take a few seconds. When the command finishes executing, restart the VM:
   
    ```powershell
    Start-AzVM -ResourceGroupName $rgName -Name $vmName
    ```

And that’s it! Now RDP into the VM, open Computer Management (or Disk Management) and expand the drive using the newly allocated space.

## Resize an unmanaged disk by using PowerShell

Open your PowerShell ISE or PowerShell window in administrative mode and follow the steps below:

1. Sign in to your Microsoft Azure account in resource management mode and select your subscription:
   
    ```powershell
    Connect-AzAccount
    Select-AzSubscription –SubscriptionName 'my-subscription-name'
    ```

2. Set your resource group name and VM names:
   
    ```powershell
    $rgName = 'my-resource-group-name'
    $vmName = 'my-vm-name'
    ```

3. Obtain a reference to your VM:
   
    ```powershell
    $vm = Get-AzVM -ResourceGroupName $rgName -Name $vmName
    ```

4. Stop the VM before resizing the disk:
   
    ```powershell
    Stop-AzVM -ResourceGroupName $rgName -Name $vmName
    ```

5. Set the size of the unmanaged OS disk to the desired value and update the VM:
   
    ```powershell
    $vm.StorageProfile.OSDisk.DiskSizeGB = 1023
    Update-AzVM -ResourceGroupName $rgName -VM $vm
    ```
   
    > [!WARNING]
    > The new size should be greater than the existing disk size. The maximum allowed is 2,048 GB for OS disks. (It's possible to expand the VHD blob beyond that size, but the OS will only be able to work with the first 2,048 GB of space.)
    > 
    > 
   
6. Updating the VM might take a few seconds. When the command finishes executing, restart the VM:
   
    ```powershell
    Start-AzVM -ResourceGroupName $rgName -Name $vmName
    ```


## Scripts for OS disk

Below is the complete script for your reference for both managed and unmanaged disks:


**Managed disks**

```powershell
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

Similarly, you can reference other data disks attached to the VM, either by using an index as shown above or the **Name** property of the disk:


**Managed disk**

```powershell
(Get-AzDisk -ResourceGroupName $rgName -DiskName ($vm.StorageProfile.DataDisks | Where ({$_.Name -eq 'my-second-data-disk'})).Name).DiskSizeGB = 1023
```

**Unmanaged disk**

```powershell
($vm.StorageProfile.DataDisks | Where ({$_.Name -eq 'my-second-data-disk'}).DiskSizeGB = 1023
```

## Expand the volume within the OS

When you have expanded the disk for the VM, you need to go into the OS and expand the volume to encompass the new space. There are several methods for expanding a partition. This section covers connecting the VM using an RDP connection to expand the partition using **DiskPart**.

1. Open an RDP connection to your VM.

2. Open a command prompt and type **diskpart**.

3. At the **DISKPART** prompt, type `list volume`. Make note of the volume you want to extend.

4. At the **DISKPART** prompt, type `select volume <volumenumber>`. This selects the volume *volumenumber* that you want to extend into contiguous, empty space on the same disk.

5. At the **DISKPART** prompt, type `extend [size=<size>]`. This extends the selected volume by *size* in megabytes (MB).


## Next steps

You can also attach disks using the [Azure portal](attach-managed-disk-portal.md).
