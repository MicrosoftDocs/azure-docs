---
title: Create a managed disk from a VHD in Azure| Microsoft Docs
description: Create a managed disk from a VHD that is currently in an Azure storage account, using the Resource Manager deployment model. 
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 02/05/2017
ms.author: cynthn

---

# Create managed disks from unmanaged disks in a storage account

A managed disk can be created from an existing data disk or an OS disk that is currently in an Azure storage account. You can also create an empty disk that can be used as a new data disk for a VM. 

## Before you begin
If you use PowerShell, make sure that you have the latest version of the AzureRM.Compute PowerShell module. Run the following command to install it.

```powershell
Install-Module AzureRM.Compute -RequiredVersion 2.6.0
```
For more information, see [Azure PowerShell Versioning](/powershell/azure/overview).


## Create a managed disk from a VHD in an Azure storage account

In the example we create a disk from a VHD as managed disk and assign it to the parameter **$disk1** to use later. 

The managed disk will be created in the **West-US** location, in a resource group named **myResourceGroup**. The disk will be named **myDisk** and it will be created from a VHD file named **myDisk.vhd** we previously uploaded to a storage account named **mystorageaccount**. The managed disk will be created in premium locally-redundant storage (LRS). StandardLRS and PremiumLRS are the only **-AccountType** options available for managed disks. 

1.  Set some parameters

    ```powershell
    $rgName = "myResourceGroup"
    $location = "West Central US"
    $diskName = "myDisk"
    $vhdUri = "https://mystorageaccount.blob.core.windows.net/vhds/myDisk.vhd"
	```

2. Create the data disk. 
    ```powershell
    $disk1 = New-AzureRmDisk -DiskName $diskName -Disk (New-AzureRmDiskConfig -AccountType PremiumLRS -Location $location -CreateOption Import -SourceUri $vhdUri) -ResourceGroupName $rgName
	```
	
	

## Create an empty data disk as a managed disk

In the example we create an empty data disk as managed disk and assign it to the parameter **$dataDisk2** to use later. An empty data disk will need to be initialized logging in to the VM and using diskmgmt.msc or [remotely using WinRM and a script](attach-disk-ps.md#initialize-the-disk), once it is attached to a running VM.

The empty data disk will be created in the **West Central US** location, in a resource group named **myResourceGroup**. The disk will be named **myEmptyDataDisk**. The empty disk will be created in premium locally-redundant storage (LRS). StandardLRS and PremiumLRS are the only **-AccountType** options available for managed disks.

The disk size in this example is 128GB, but you should choose a size that meets the needs of any applications running on your VM.

1.  Set some parameters

    ```powershell
    $rgName = "myResourceGroup"
    $location = "West Central US"
    $dataDiskName = "myEmptyDataDisk"
    ```

2. Create the data disk.
    ```powershell
    $dataDisk2 = New-AzureRmDisk -DiskName $dataDiskName -Disk (New-AzureRmDiskConfig -AccountType PremiumLRS -Location $location -CreateOption Empty -DiskSizeGB 128) -ResourceGroupName $rgName
	```
	
## Next Steps	
- If you already have a VM, you can [attach a data disk](attach-disk-portal.md).
