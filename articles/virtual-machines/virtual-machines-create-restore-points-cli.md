---
title: Creating Virtual Machine Restore Points using Azure CLI
description: Creating Virtual Machine Restore Points using Azure CLI
author: mamccrea
ms.author: mamccrea
ms.service: virtual-machines
ms.subservice: recovery
ms.topic: tutorial
ms.date: 06/30/2022
ms.custom: template-tutorial, devx-track-azurecli
---


# Create virtual machine restore points using Azure CLI

You can protect your data and guard against extended downtime by creating [VM restore points](virtual-machines-create-restore-points.md#about-vm-restore-points) at regular intervals. You can create VM restore points, and [exclude disks](#exclude-disks-when-creating-a-restore-point) while creating the restore point, using Azure CLI. Azure CLI is used to create and manage Azure resources using command line or scripts. Alternatively, you can create VM restore points using the [Azure portal](virtual-machines-create-restore-points-portal.md) or using [PowerShell](virtual-machines-create-restore-points-powershell.md).

The [az restore-point](/cli/azure/restore-point) module is used to create and manage restore points from the command line or in scripts.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * [Create a VM restore point collection](#step-1-create-a-vm-restore-point-collection)
> * [Create a VM restore point](#step-2-create-a-vm-restore-point)
> * [Track the progress of Copy operation](#step-3-track-the-status-of-the-vm-restore-point-creation)
> * [Restore a VM](#restore-a-vm-from-vm-restore-point)

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]
- Learn more about the [support requirements](concepts-restore-points.md) and [limitations](virtual-machines-create-restore-points.md#limitations) before creating a restore point.

## Step 1: Create a VM restore point collection

Use the [az restore-point collection create](/cli/azure/restore-point/collection#az-restore-point-collection-create) command to create a VM restore point collection, as shown below:
```
az restore-point collection create --location "norwayeast" --source-id "/subscriptions/{subscription-id}/resourceGroups/ExampleRg/providers/Microsoft.Compute/virtualMachines/ExampleVM" --tags myTag1="tagValue1" --resource-group "ExampleRg" --collection-name "ExampleRpc"
```
## Step 2: Create a VM restore point

Create a VM restore point with the [az restore-point create](/cli/azure/restore-point#az-restore-point-create) command as follows:

```
az restore-point create --resource-group "ExampleRg" --collection-name "ExampleRpc" --name "ExampleRp"
```
### Exclude disks when creating a restore point
Exclude the disks that you do not want to be a part of the restore point with the `--exclude-disks` parameter, as follows:
```
az restore-point create --exclude-disks "/subscriptions/{subscription-id}/resourceGroups/ExampleRg/providers/Microsoft.Compute/disks/ExampleDisk1" --resource-group "ExampleRg" --collection-name "ExampleRpc" --name "ExampleRp"
```
## Step 3: Track the status of the VM restore point creation
Use the [az restore-point show](/cli/azure/restore-point#az-restore-point-show) command to track the progress of the VM restore point creation.
```
az restore-point show --resource-group "ExampleRg" --collection-name "ExampleRpc" --name "ExampleRp"
```
## Restore a VM from VM restore point
To restore a VM from a VM restore point, first restore individual disks from each disk restore point. You can also use the [ARM template](https://github.com/Azure/Virtual-Machine-Restore-Points/blob/main/RestoreVMFromRestorePoint.json) to restore a full VM along with all the disks.
```
# Create Disks from disk restore points 
$osDiskRestorePoint = az restore-point show --resource-group "ExampleRg" --collection-name "ExampleRpc" --name "ExampleRp" --query "sourceMetadata.storageProfile.dataDisks[0].diskRestorePoint.id"
$dataDisk1RestorePoint = az restore-point show --resource-group "ExampleRg" --collection-name "ExampleRpcTarget" --name "ExampleRpTarget" –query "sourceMetadata.storageProfile.dataDisks[0].diskRestorePoint.id"
$dataDisk2RestorePoint = az restore-point show --resource-group "ExampleRg" --collection-name "ExampleRpcTarget" --name "ExampleRpTarget" –query "sourceMetadata.storageProfile.dataDisks[0].diskRestorePoint.id"
 
az disk create --resource-group “ExampleRg” --name “ExampleOSDisk” --sku Premium_LRS --size-gb 128 --source $osDiskRestorePoint

az disk create --resource-group “ExampleRg” --name “ExampleDataDisk1” --sku Premium_LRS --size-gb 128 --source $dataDisk1RestorePoint

az disk create --resource-group “ExampleRg” --name “ExampleDataDisk1” --sku Premium_LRS --size-gb 128 --source $dataDisk2RestorePoint
```
Once you have created the disks, [create a new VM](./scripts/create-vm-from-managed-os-disks.md) and [attach these restored disks](./linux/add-disk.md#attach-an-existing-disk) to the newly created VM.

## Next steps
[Learn more](./backup-recovery.md) about Backup and restore options for virtual machines in Azure.
