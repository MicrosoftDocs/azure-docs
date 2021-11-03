---
title: Expand virtual hard disks attached to a Windows VM in an Azure
description: Expand the size of the virtual hard disks attached to a virtual machine using Azure PowerShell in the Resource Manager deployment model.
author: kirpasingh
manager: roshar
ms.service: virtual-machines
ms.collection: windows
ms.topic: article
ms.date: 11/02/2021
ms.author: kirpas
ms.subservice: disks
ms.custom: devx-track-azurepowershell, references_regions, ignite-fall-2021
---
# How to expand virtual hard disks attached to a Windows virtual machine

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 

When you create a new virtual machine (VM) in a resource group by deploying an image from [Azure Marketplace](https://azure.microsoft.com/marketplace/), the default OS drive is often 127 GB (some images have smaller OS disk sizes by default). Even though it's possible to add data disks to the VM (the number depends on the SKU you chose) and we recommend installing applications and CPU-intensive workloads on these addendum disks, often, customers need to expand the OS drive to support specific scenarios:

- To support legacy applications that install components on the OS drive.
- To migrate a physical PC or VM from on-premises with a larger OS drive.

> [!IMPORTANT]
> Resizing an OS or Data Disk of an Azure Virtual Machine requires the virtual machine to be deallocated.
>
> Shrinking an existing disk isn’t supported, and can potentially result in data loss.
> 
> After expanding the disks, you need to [expand the volume within the OS](#expand-the-volume-within-the-os) to take advantage of the larger disk.

## Resize without downtime (preview)

You can now resize your managed disks without deallocating your VM.

The preview for this has the following limitations:

[!INCLUDE [virtual-machines-disks-expand-without-downtime-restrictions](../../../includes/virtual-machines-disks-expand-without-downtime-restrictions.md)]

To register for the feature, use the following command:

```azurepowershell
Register-AzProviderFeature -FeatureName "LiveResize" -ProviderNamespace "Microsoft.Compute"
```

It may take a few minutes for registration to take complete. To confirm that you've registered, use the following command:

```azurepowershell
Register-AzProviderFeature -FeatureName "LiveResize" -ProviderNamespace "Microsoft.Compute"
```

## Resize a managed disk in the Azure portal

> [!IMPORTANT]
> If you've enabled **LiveResize** and your disk meets the requirements in [Resize without downtime (preview)](#resize-without-downtime-preview), you can skip step 1. To resize a disk without downtime in the Azure portal, you must use the following link: [https://aka.ms/iaasexp/DiskLiveResize](https://aka.ms/iaasexp/DiskLiveResize)

1. In the [Azure portal](https://aka.ms/iaasexp/DiskLiveResize), go to the virtual machine in which you want to expand the disk. Select **Stop** to deallocate the VM.
1. In the left menu under **Settings**, select **Disks**.

    :::image type="content" source="./media/expand-os-disk/select-disks.png" alt-text="Screenshot that shows the Disks option selected in the Settings section of the menu.":::

 
1. Under **Disk name**, select the disk you want to resize.

    :::image type="content" source="./media/expand-os-disk/disk-name.png" alt-text="Screenshot that shows the Disks pane with a disk name selected.":::

1. In the left menu under **Settings**, select **Size + performance**.

    :::image type="content" source="./media/expand-os-disk/configuration.png" alt-text="Screenshot that shows the Size and performance option selected in the Settings section of the menu.":::

1. In **Size + performance**, select the disk size you want.
   
   > [!WARNING]
   > The new size should be greater than the existing disk size. The maximum allowed is 4,095 GB for OS disks. (It's possible to expand the VHD blob beyond that size, but the OS works only with the first 4,095 GB of space.)
   > 

    :::image type="content" source="./media/expand-os-disk/size.png" alt-text="Screenshot that shows the Size and performance pane with the disk size selected.":::

1. Select **Resize** at the bottom of the page.

    :::image type="content" source="./media/expand-os-disk/save.png" alt-text="Screenshot that shows the Size and performance pane with the Resize button selected.":::


## Resize a managed disk by using PowerShell

Open your PowerShell ISE or PowerShell window in administrative mode and follow the steps below:

1. Sign in to your Microsoft Azure account in resource management mode and select your subscription:
   
    ```powershell
    Connect-AzAccount
    Select-AzSubscription –SubscriptionName 'my-subscription-name'
    ```

1. Set your resource group name and VM name:
   
    ```powershell
    $rgName = 'my-resource-group-name'
    $vmName = 'my-vm-name'
    ```

1. Obtain a reference to your VM:
   
    ```powershell
    $vm = Get-AzVM -ResourceGroupName $rgName -Name $vmName
    ```

    > [!IMPORTANT]
    > If you've enabled **LiveResize** and your disk meets the requirements in [Resize without downtime (preview)](#resize-without-downtime-preview), you can skip step 4 and 6.

1. Stop the VM before resizing the disk:
   
    ```powershell
    Stop-AzVM -ResourceGroupName $rgName -Name $vmName
    ```

1. Obtain a reference to the managed OS disk. Set the size of the managed OS disk to the desired value and update the Disk:
   
    ```powershell
    $disk= Get-AzDisk -ResourceGroupName $rgName -DiskName $vm.StorageProfile.OsDisk.Name
    $disk.DiskSizeGB = 1023
    Update-AzDisk -ResourceGroupName $rgName -Disk $disk -DiskName $disk.Name
    ```   
    > [!WARNING]
    > The new size should be greater than the existing disk size. The maximum allowed is 4,095 GB for OS disks. (It is possible to expand the VHD blob beyond that size, but the OS works only with the first 4,095 GB of space.)
    > 
         
1. Updating the VM might take a few seconds. When the command finishes executing, restart the VM:
   
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

1. Set your resource group name and VM names:
   
    ```powershell
    $rgName = 'my-resource-group-name'
    $vmName = 'my-vm-name'
    ```

1. Obtain a reference to your VM:
   
    ```powershell
    $vm = Get-AzVM -ResourceGroupName $rgName -Name $vmName
    ```

1. Stop the VM before resizing the disk:
   
    ```powershell
    Stop-AzVM -ResourceGroupName $rgName -Name $vmName
    ```

1. Set the size of the unmanaged OS disk to the desired value and update the VM:
   
    ```powershell
    $vm.StorageProfile.OSDisk.DiskSizeGB = 1023
    Update-AzVM -ResourceGroupName $rgName -VM $vm
    ```
   
    > [!WARNING]
    > The new size should be greater than the existing disk size. The maximum allowed is 2,048 GB for OS disks. (It's possible to expand the VHD blob beyond that size, but the OS will only be able to work with the first 2,048 GB of space.)
    > 
    > 
   
1. Updating the VM might take a few seconds. When the command finishes executing, restart the VM:
   
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
($vm.StorageProfile.DataDisks | Where ({$_.Name -eq 'my-second-data-disk'})).DiskSizeGB = 1023
```

## Expand the volume within the OS

When you have expanded the disk for the VM, you need to go into the OS and expand the volume to encompass the new space. There are several methods for expanding a partition. This section covers connecting the VM using an RDP connection to expand the partition using **DiskPart**.

1. Open an RDP connection to your VM.

1. Open a command prompt and type **diskpart**.

1. At the **DISKPART** prompt, type `list volume`. Make note of the volume you want to extend.

1. At the **DISKPART** prompt, type `select volume <volumenumber>`. This selects the volume *volumenumber* that you want to extend into contiguous, empty space on the same disk.

1. At the **DISKPART** prompt, type `extend [size=<size>]`. This extends the selected volume by *size* in megabytes (MB).


## Next steps

You can also attach disks using the [Azure portal](attach-managed-disk-portal.md).
