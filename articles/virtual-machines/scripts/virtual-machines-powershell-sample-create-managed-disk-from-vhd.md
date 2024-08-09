---
title: Create a managed disk from a VHD file in a storage account in a subscription - PowerShell Sample
description: Azure PowerShell Script Sample -  Create a managed disk from a VHD file in a storage account in same or different subscription
author: roygara
ms.service: azure-disk-storage
ms.topic: sample
ms.custom: devx-track-azurepowershell
ms.date: 07/01/2024
ms.author: rogarana
---

# Create a managed disk from a VHD file in a storage account in same or different subscription with PowerShell

This script creates a managed disk from a VHD file in a storage account in same or different subscription. Use this script to import a specialized (not generalized/sysprepped) VHD to managed OS disk to create a virtual machine. Also, use it to import a data VHD to managed data disk. 

Don't create multiple identical managed disks from a VHD file in small amount of time. To create managed disks from a vhd file, blob snapshot of the vhd file is created and then it is used to create managed disks. Only one blob snapshot can be created in a minute that causes disk creation failures due to throttling. To avoid this throttling, create a [managed snapshot from the vhd file](virtual-machines-powershell-sample-create-snapshot-from-vhd.md?toc=%2fpowershell%2fmodule%2ftoc.json) and then use the managed snapshot to create multiple managed disks in short amount of time. 

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Sample script

```powershell

<#

.DESCRIPTION

This sample demonstrates how to create a Managed Disk from a VHD file. 
Create Managed Disks from VHD files in following scenarios:
1. Create a Managed OS Disk from a specialized VHD file. A specialized VHD is a copy of VHD from an exisitng VM that maintains the user accounts, applications and other state data from your original VM. 
   Attach this Managed Disk as OS disk to create a new virtual machine.
2. Create a Managed data Disk from a VHD file. Attach the Managed Disk to an existing VM or attach it as data disk to create a new virtual machine.

.NOTES

1. Before you use this sample, please install the latest version of Azure PowerShell from here: http://go.microsoft.com/?linkid=9811175&clcid=0x409
2. Provide the appropriate values for each variable. Note: The angled brackets should not be included in the values you provide.


#>

#Provide the subscription Id
$subscriptionId = 'yourSubscriptionId'

#Provide the name of your resource group
$resourceGroupName ='yourResourceGroupName'

#Provide the name of the Managed Disk
$diskName = 'yourDiskName'

#Provide the size of the disks in GB. It should be greater than the VHD file size.
$diskSize = '128'

#Provide the URI of the VHD file that will be used to create Managed Disk. 
# VHD file can be deleted as soon as Managed Disk is created.
# e.g. https://contosostorageaccount1.blob.core.windows.net/vhds/contoso-um-vm120170302230408.vhd 
$vhdUri = 'https://contosoststorageaccount1.blob.core.windows.net/vhds/contosovhd123.vhd' 

#Provide the resource Id of the storage account where VHD file is stored.
#e.g. /subscriptions/6472s1g8-h217-446b-b509-314e17e1efb0/resourceGroups/MDDemo/providers/Microsoft.Storage/storageAccounts/contosostorageaccount
$storageAccountId = '/subscriptions/yourSubscriptionId/resourceGroups/yourResourceGroupName/providers/Microsoft.Storage/storageAccounts/yourStorageAccountName'

#Provide the storage type for the Managed Disk. PremiumLRS or StandardLRS.
$sku = 'Premium_LRS'

#Provide the Azure location (e.g. westus) where Managed Disk will be located. 
#The location should be same as the location of the storage account where VHD file is stored.
#Get all the Azure location using command below:
#Get-AzureRmLocation
$location = 'westus'

#Set the context to the subscription Id where Managed Disk will be created
Set-AzContext -Subscription $subscriptionId

#If you're creating an OS disk, add the following lines
#Acceptable values are either Windows or Linux
#$OSType = 'yourOSType'
#Acceptable values are either V1 or V2
#$HyperVGeneration = 'yourHyperVGen'

#If you're creating an OS disk, add -HyperVGeneration and -OSType parameters
$diskConfig = New-AzDiskConfig -SkuName $sku -Location $location -DiskSizeGB $diskSize -SourceUri $vhdUri -CreateOption Import

#Create Managed disk
New-AzDisk -DiskName $diskName -Disk $diskConfig -ResourceGroupName $resourceGroupName -StorageAccountId $storageAccountId
```

## Script explanation

This script uses following commands to create a managed disk from a VHD in different subscription. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzDiskConfig](/powershell/module/az.compute/new-azdiskconfig) | Creates disk configuration that is used for disk creation. It includes storage type, location, resource ID of the storage account where the parent VHD is stored, VHD URI of the parent VHD. |
| [New-AzDisk](/powershell/module/az.compute/new-azdisk) | Creates a disk using disk configuration, disk name, and resource group name passed as parameters. |

## Next steps

[Create a virtual machine by attaching a managed disk as OS disk](virtual-machines-powershell-sample-create-vm-from-managed-os-disks.md)

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Additional virtual machine PowerShell script samples can be found in the [Azure Windows VM documentation](../windows/powershell-samples.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
