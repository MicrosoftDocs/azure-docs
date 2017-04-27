---
title: Create a copy of an Azure Managed Disk for back up | Microsoft Docs
description: Learn how to create a copy of an Azure Managed Disk to use for back up or troubleshooting disk issues.
documentationcenter: ''
author: cwatsonMSFT
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 15eb778e-fc07-45ef-bdc8-9090193a6d20
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 2/9/2017
ms.author: cwatson

---
# Create a copy of a VHD stored as an Azure Managed Disk by using Managed Snapshots
Take a snapshot of a Managed Disk for backup or create a Managed Disk from the snapshot and attach it to a test virtual machine to troubleshoot. A Managed Snapshot is a full point-in-time copy of a VM Managed Disk. It creates a read-only copy of your VHD and, by default, stores it as a Standard Managed Disk. For more information about Managed Disks, see [Azure Managed Disks overview](../../storage/storage-managed-disks-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)

For information about pricing, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/managed-disks/). 

## Before you begin
If you use PowerShell, make sure that you have the latest version of the AzureRM.Compute PowerShell module. Run the following command to install it.

```
Install-Module AzureRM.Compute -RequiredVersion 2.6.0
```
For more information, see [Azure PowerShell Versioning](/powershell/azure/overview).

## Copy the VHD with a snapshot
Use either the Azure portal or PowerShell to take a snapshot of the Managed Disk.

### Use Azure portal to take a snapshot 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Starting in the upper left, click **New** and search for **snapshot**.
3. In the Snapshot blade, click **Create**.
4. Enter a **Name** for the snapshot.
5. Select an existing [Resource group](../../azure-resource-manager/resource-group-overview.md#resource-groups) or type the name for a new one. 
6. Select an Azure datacenter Location.  
7. For **Source disk**, select the Managed Disk to snapshot.
8. Select the **Account type** to use to store the snapshot. We recommend **Standard_LRS** unless you need it stored on a high performing disk.
9. Click **Create**.

### Use PowerShell to take a snapshot
The following steps show you how to get the VHD disk to be copied, create the snapshot configurations, and take a snapshot of the disk by using the New-AzureRmSnapshot cmdlet<!--Add link to cmdlet when available-->. 

1. Set some parameters. 

 ```powershell
$resourceGroupName = 'myResourceGroup' 
$location = 'southeastasia' 
$dataDiskName = 'ContosoMD_datadisk1' 
$snapshotName = 'ContosoMD_datadisk1_snapshot1'  
```
  Replace the parameter values:
  -  "myResourceGroup" with the VM's resource group.
  -  "southeastasia" with the geographic location where you want your Managed Snapshot stored. <!---How do you look these up? -->
  -  "ContosoMD_datadisk1" with the name of the VHD disk that you want to copy.
  -  "ContosoMD_datadisk1_snapshot1" with the name you want to use for the new snapshot.

2. Get the VHD disk to be copied.

 ```powershell
$disk = Get-AzureRmDisk -ResourceGroupName $resourceGroupName -DiskName $dataDiskName 
```
3. Create the snapshot configurations. 

 ```powershell
$snapshot =  New-AzureRmSnapshotConfig -SourceUri $disk.Id -CreateOption Copy -Location $location 
```
4. Take the snapshot.

 ```powershell
New-AzureRmSnapshot -Snapshot $snapshot -SnapshotName $snapshotName -ResourceGroupName $resourceGroupName 
```
If you plan to use the snapshot to create a Managed Disk and attach it a VM that needs to be high performing, use the parameter `-AccountType Premium_LRS` with the New-AzureRmSnapshot command. The parameter creates the snapshot so that it's stored as a Premium Managed Disk. Premium Managed Disks are more expensive than Standard. So be sure you really need Premium before using that parameter.


