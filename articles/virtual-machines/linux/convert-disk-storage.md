---
title: Convert Azure managed disks from Standard to Premium storage or Premium to Standard | Microsoft Docs
description: How to convert Azure managed disks storage from Standard to Premium storage and Premium to Standard by using Azure CLI.
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 07/12/2018
ms.author: cynthn
ms.subservice: disks
---

# Convert Azure managed disks storage from Standard to Premium or Premium to Standard

Managed disks offers four [disk type](disks-types.md) options: Ultra solid state drive (SSD), Premium SSD, Standards SSD, and Standard hard disk drive (HDD). You can easily switch between these options with minimal downtime based on your performance needs. This functionality is not supported for unmanaged disks. But you can easily [convert to managed disks](convert-unmanaged-to-managed-disks.md) to switch between disk types.

This article shows you how to convert managed disks from standard to premium or premium to standard by using Azure CLI. If you need to install or upgrade the tool, [Install Azure CLI](/cli/azure/install-azure-cli).

## Before you begin

* The conversion requires a restart of the VM, so schedule the migration of your disks storage during a pre-existing maintenance window.
* If you're using unmanaged disks, first [convert to managed disks](convert-unmanaged-to-managed-disks.md) so you can switch between storage options.


## Convert all the managed disks of a VM from standard to premium or premium to standard

The following example shows how to switch all the disks of a VM from standard to premium storage or premium to standard. To use premium managed disks, your VM must use a [VM size](sizes.md) that supports premium storage. This example also switches to a size that supports premium storage.

 ```azurecli

#resource group that contains the virtual machine
rgName='yourResourceGroup'

#Name of the virtual machine
vmName='yourVM'

#Premium capable size 
#Required only if converting from standard to premium
size='Standard_DS2_v2'

#Choose between Standard_LRS and Premium_LRS based on your scenario
sku='Premium_LRS'

#Deallocate the VM before changing the size of the VM
az vm deallocate --name $vmName --resource-group $rgName

#Change the VM size to a size that supports premium storage 
#Skip this step if converting storage from premium to standard
az vm resize --resource-group $rgName --name $vmName --size $size

#Update the SKU of all the data disks 
az vm show -n $vmName -g $rgName --query storageProfile.dataDisks[*].managedDisk -o tsv \
 | awk -v sku=$sku '{system("az disk update --sku "sku" --ids "$1)}'

#Update the SKU of the OS disk
az vm show -n $vmName -g $rgName --query storageProfile.osDisk.managedDisk -o tsv \
| awk -v sku=$sku '{system("az disk update --sku "sku" --ids "$1)}'

az vm start --name $vmName --resource-group $rgName

```
## Convert invidiual managed disks from standard to premium or premium to standard

For your dev/test workload, you may want to have mixture of standard and premium disks to reduce your costs. You can choose to upgrade to premium only certain disks that require better performance. The following example shows how to switch a single disk of a VM from standard to premium storage or from premium to standard. To use premium managed disks, your VM must use a [VM size](sizes.md) that supports premium storage. This example also switches to a size that supports premium storage.

 ```azurecli

#resource group that contains the managed disk
rgName='yourResourceGroup'

#Name of your managed disk
diskName='yourManagedDiskName'

#Premium capable size 
#Required only if converting from standard to premium
size='Standard_DS2_v2'

#Choose between Standard_LRS and Premium_LRS based on your scenario
sku='Premium_LRS'

#Get the parent VM Id 
vmId=$(az disk show --name $diskName --resource-group $rgName --query managedBy --output tsv)

#Deallocate the VM before changing the size of the VM
az vm deallocate --ids $vmId 

#Change the VM size to a size that supports premium storage 
#Skip this step if converting storage from premium to standard
az vm resize --ids $vmId --size $size

# Update the sku
az disk update --sku $sku --name $diskName --resource-group $rgName 

az vm start --ids $vmId 
```

## Convert a managed disk from standard HDD to standard SSD or standard SSD to standard HDD

The following example shows how to switch a single disk of a VM from standard HDD to standard SSD.

 ```azurecli

#resource group that contains the managed disk
rgName='yourResourceGroup'

#Name of your managed disk
diskName='yourManagedDiskName'

#Choose between Standard_LRS and StandardSSD_LRS based on your scenario
sku='StandardSSD_LRS'

#Get the parent VM Id 
vmId=$(az disk show --name $diskName --resource-group $rgName --query managedBy --output tsv)

#Deallocate the VM before changing the disk type
az vm deallocate --ids $vmId 

# Update the sku
az disk update --sku $sku --name $diskName --resource-group $rgName 

az vm start --ids $vmId 
```

## Convert managed disks between standard and premium in Azure portal

You can convert managed disks between standard and premium in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select the VM from the list of **Virtual machines** in the portal.
3. If the VM is not stopped, click **Stop** on the top of the VM **Overview** pane, and wait for the VM to stop.
3. In the blade for the VM, select **Disks** from the menu.
4. Select the disk that you want to convert.
5. Select **Configuration** from the menu.
6. Change the **Account type** from **Standard HDD** to **Premium SSD** (or from **Premium SSD to **Standard HDD**).
7. Click **Save**, and close the disk blade.

The update of the disk type is instantaneous. You can restart your VM after the conversion.

## Next steps

Take a read-only copy of a VM by using [snapshots](snapshot-copy-managed-disk.md).