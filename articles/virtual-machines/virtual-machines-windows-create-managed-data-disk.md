---
title: Create a managed disk from a specialized VHD| Microsoft Docs
description: Create a managed disk from a specialized VHD that is currently in an Azure storage account, using the Resource Manager deployment model. 
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
ms.date: 01/12/2016
ms.author: cynthn

---

# Create data disks as managed disks

Create a data disk as a managed disk. The data disk can be created from an existing data disk VHD in an Azure storage account or as a new empty data disk using [New-AzureRmDisk](xxx.md) and [New-AzureRmDiskConfig](xxx.md) cmdlets.

## Create a managed data disk from a VHD in an Azure storage account

In the example we create a data disk from a VHD as managed disk and assign it to the parameter **$dataDisk1** to use later. 

The managed disk will be created in the **West-US** location, in a resource group named **myResourceGroup**. The disk will be named **myDataDisk** and it will be created from a VHD file named **datadisk.vhd** we previously uploaded to a storage account named **mystorageaccount**. The managed disk will be created in premium locally-redundant storage (LRS). StandardLRS and PremiumLRS are the only **-AccountType** options available for managed disks. 

1.  Set some parameters

    ```powershell
    $resourceGroupName = "myResourceGroup"
    $location = "westus"
    $dataDiskName = "myDataDisk"
    $dataVhdUri = "https://mystorageaccount.blob.core.windows.net/vhds/datadisk.vhd"
	```

2. Create the data disk. 
    ```powershell
    $dataDisk1 = New-AzureRmDisk -DiskName $dataDiskName -Disk (New-AzureRmDiskConfig -AccountType PremiumLRS -Location $location -CreateOption Import -SourceUri $dataVhdUri) -ResourceGroupName $resourceGroupName
	```
	
	

### Create an empty data disk as a managed

In the example we create an empty data disk as managed disk and assign it to the parameter **$dataDisk2** to use later. An empty data disk will need to be initialized loggin g in to the VM and using diskmgmt.msc or [remotely using WinRM and a script](virtual-machines-windows-ps-manage.md#add-a-data-disk-to-a-virtual-machine), once it is attached to a running VM.

The empty data disk will be created in the **West-US** location, in a resource group named **myResourceGroup**. The disk will be named **myEmptyDataDisk**. The empty disk will be created in premium locally-redundant storage (LRS). StandardLRS and PremiumLRS are the only **-AccountType** options available for managed disks.

The disk size in this example is 128GB, but you should choosed a size that meets the needs of any applications running on your VM.

1.  Set some parameters

    ```powershell
    $resourceGroupName = "myResourceGroup"
    $location = "westus"
    $dataDiskName = "myEmptyDataDisk"
    ```

2. Create the data disk.
    ```powershell
    $dataDisk2 = New-AzureRmDisk -DiskName $dataDiskName -Disk (New-AzureRmDiskConfig -AccountType PremiumLRS -Location $location -CreateOption Empty -DiskSizeGB 128) -ResourceGroupName $resourceGroupName
	```
	
# Next Steps	
- If you already have a VM, you can [attach a data disk](virtual-machines-windows-attach-disk-portal.md).