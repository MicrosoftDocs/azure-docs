---
title: Convert managed disks storage between different disk types using Azure CLI
description: How to convert Azure managed disks between the different disks types by using the Azure CLI.
author: roygara
ms.service: storage
ms.collection: linux
ms.topic: how-to
ms.date: 02/09/2023
ms.author: albecker
ms.subservice: disks
ms.custom: devx-track-azurecli
---

# Change the disk type of an Azure managed disk - CLI

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

There are four disk types of Azure managed disks: Azure ultra disks, premium SSD, standard SSD, and standard HDD. You can switch between premium SSD, standard SSD, and standard HDD based on your performance needs. You are not yet able to switch from or to an ultra disk, you must deploy a new one.

This functionality is not supported for unmanaged disks. But you can easily [convert an unmanaged disk to a managed disk](convert-unmanaged-to-managed-disks.md) to be able to switch between disk types.

This article shows how to convert managed disks from one disk type to another by using the Azure CLI. To install or upgrade the tool, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Before you begin

Conversion requires a restart of the virtual machine (VM), so schedule the migration of your disk during a pre-existing maintenance window.

## Restrictions

- You can only change disk type once per day.
- You can only change the disk type of managed disks. If your disk is unmanaged, [convert it to a managed disk](convert-unmanaged-to-managed-disks.md) to switch between disk types.


## Switch all managed disks of a VM between from one account to another

This example shows how to convert all of a VM's disks to premium storage. However, by changing the sku variable in this example, you can convert the VM's disks type to standard SSD or standard HDD. Please note that To use Premium managed disks, your VM must use a [VM size](../sizes.md) that supports Premium storage. This example also switches to a size that supports Premium storage.

 ```azurecli

#resource group that contains the virtual machine
$rgName='yourResourceGroup'

#Name of the virtual machine
vmName='yourVM'

#Premium capable size 
#Required only if converting from Standard to Premium
size='Standard_DS2_v2'

#Choose between Standard_LRS, StandardSSD_LRS and Premium_LRS based on your scenario
sku='Premium_LRS'

#Deallocate the VM before changing the size of the VM
az vm deallocate --name $vmName --resource-group $rgName

#Change the VM size to a size that supports Premium storage 
#Skip this step if converting storage from Premium to Standard
az vm resize --resource-group $rgName --name $vmName --size $size

#Update the SKU of all the data disks 
az vm show -n $vmName -g $rgName --query storageProfile.dataDisks[*].managedDisk -o tsv \
 | awk -v sku=$sku '{system("az disk update --sku "sku" --ids "$1)}'

#Update the SKU of the OS disk
az vm show -n $vmName -g $rgName --query storageProfile.osDisk.managedDisk -o tsv \
| awk -v sku=$sku '{system("az disk update --sku "sku" --ids "$1)}'

az vm start --name $vmName --resource-group $rgName

```
## Switch individual managed disks from one disk type to another

For your dev/test workload, you might want to have a mix of Standard and Premium disks to reduce your costs. You can choose to upgrade only those disks that need better performance. This example shows how to convert a single VM disk from Standard to Premium storage. However, by changing the sku variable in this example, you can convert the VM's disks type to standard SSD or standard HDD. To use Premium managed disks, your VM must use a [VM size](../sizes.md) that supports Premium storage. This example also switches to a size that supports Premium storage.

 ```azurecli

#resource group that contains the managed disk
$rgName='yourResourceGroup'

#Name of your managed disk
diskName='yourManagedDiskName'

#Premium capable size 
#Required only if converting from Standard to Premium
size='Standard_DS2_v2'

#Choose between Standard_LRS, StandardSSD_LRS and Premium_LRS based on your scenario
sku='Premium_LRS'

#Get the parent VM Id 
vmId=$(az disk show --name $diskName --resource-group $rgName --query managedBy --output tsv)

#Deallocate the VM before changing the size of the VM
az vm deallocate --ids $vmId 

#Change the VM size to a size that supports Premium storage 
#Skip this step if converting storage from Premium to Standard
az vm resize --ids $vmId --size $size

# Update the SKU
az disk update --sku $sku --name $diskName --resource-group $rgName 

az vm start --ids $vmId 
```

## Switch managed disks from one disk type to another

Follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select the VM from the list of **Virtual machines**.
3. If the VM isn't stopped, select **Stop** at the top of the VM **Overview** pane, and wait for the VM to stop.
4. In the pane for the VM, select **Disks** from the menu.
5. Select the disk that you want to convert.
6. Select **Configuration** from the menu.
7. Change the **Account type** from the original disk type to the desired disk type.
8. Select **Save**, and close the disk pane.

The update of the disk type is instantaneous. You can restart your VM after the conversion.

## Next steps

Make a read-only copy of a VM by using [snapshots](snapshot-copy-managed-disk.md).
