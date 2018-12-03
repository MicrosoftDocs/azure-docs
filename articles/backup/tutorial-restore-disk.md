---
title: Restore a VM disk with Azure Backup
description: Learn how to restore a disk and create a recover a VM in Azure with Backup and Recovery Services.
services: backup
author: markgalioto
manager: carmonm
tags: azure-resource-manager, virtual-machine-backup
ms.service: backup
ms.topic: tutorial
ms.date: 4/17/2018
ms.author: markgal
ms.custom: mvc
---

# Restore a disk and create a recovered VM in Azure
Azure Backup creates recovery points that are stored in geo-redundant recovery vaults. When you restore from a recovery point, you can restore the whole VM or individual files. This article explains how to restore a complete VM using CLI. In this tutorial you learn how to:

> [!div class="checklist"]
> * List and select recovery points
> * Restore a disk from a recovery point
> * Create a VM from the restored disk

For information on using PowerShell to restore a disk and create a recovered VM, see [Back up and restore Azure VMs with PowerShell](backup-azure-vms-automation.md#restore-an-azure-vm).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.18 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli). 


## Prerequisites
This tutorial requires a Linux VM that has been protected with Azure Backup. To simulate an accidental VM deletion and recovery process, you create a VM from a disk in a recovery point. If you need a Linux VM that has been protected with Azure Backup, see [Back up a virtual machine in Azure with the CLI](quick-backup-vm-cli.md).


## Backup overview
When Azure initiates a backup, the backup extension on the VM takes a point-in-time snapshot. The backup extension is installed on the VM when the first backup is requested. Azure Backup can also take a snapshot of the underlying storage if the VM is not running when the backup takes place.

By default, Azure Backup takes a file system consistent backup. Once Azure Backup takes the snapshot, the data is transferred to the Recovery Services vault. To maximize efficiency, Azure Backup identifies and transfers only the blocks of data that have changed since the previous backup.

When the data transfer is complete, the snapshot is removed and a recovery point is created.


## List available recovery points
To restore a disk, you select a recovery point as the source for the recovery data. As the default policy creates a recovery point each day and retains them for 30 days, you can keep a set of recovery points that allows you to select a particular point in time for recovery. 

To see a list of available recovery points, use [az backup recoverypoint list](https://docs.microsoft.com/cli/azure/backup/recoverypoint?view=azure-cli-latest#az-backup-recoverypoint-list). The recovery point **name** is used to recover disks. In this tutorial, we want the most recent recovery point available. The `--query [0].name` parameter selects the most recent recovery point name as follows:

```azurecli-interactive
az backup recoverypoint list \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --container-name myVM \
    --item-name myVM \
    --query [0].name \
    --output tsv
```


## Restore a VM disk
To restore your disk from the recovery point, you first create an Azure storage account. This storage account is used to store the restored disk. In additional steps, the restored disk is used to create a VM.

1. To create a storage account, use [az storage account create](https://docs.microsoft.com/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-create). The storage account name must be all lowercase, and be globally unique. Replace *mystorageaccount* with your own unique name:

    ```azurecli-interactive
    az storage account create \
        --resource-group myResourceGroup \
        --name mystorageaccount \
        --sku Standard_LRS
    ```

2. Restore the disk from your recovery point with [az backup restore restore-disks](https://docs.microsoft.com/cli/azure/backup/restore?view=azure-cli-latest#az-backup-restore-restore-disks). Replace *mystorageaccount* with the name of the storage account you created in the preceding command. Replace *myRecoveryPointName* with the recovery point name you obtained in the output from the previous [az backup recoverypoint list](https://docs.microsoft.com/cli/azure/backup/recoverypoint?view=azure-cli-latest#az-backup-recoverypoint-list) command:

    ```azurecli-interactive
    az backup restore restore-disks \
        --resource-group myResourceGroup \
        --vault-name myRecoveryServicesVault \
        --container-name myVM \
        --item-name myVM \
        --storage-account mystorageaccount \
        --rp-name myRecoveryPointName
    ```


## Monitor the restore job
To monitor the status of restore job, use [az backup job list](https://docs.microsoft.com/cli/azure/backup/job?view=azure-cli-latest#az-backup-job-list):

```azurecli-interactive 
az backup job list \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --output table
```

The output is similar to the following example, which shows the restore job is *InProgress*:

```
Name      Operation        Status      Item Name    Start Time UTC       Duration
--------  ---------------  ----------  -----------  -------------------  --------------
7f2ad916  Restore          InProgress  myvm         2017-09-19T19:39:52  0:00:34.520850
a0a8e5e6  Backup           Completed   myvm         2017-09-19T03:09:21  0:15:26.155212
fe5d0414  ConfigureBackup  Completed   myvm         2017-09-19T03:03:57  0:00:31.191807
```

When the *Status* of the restore job reports *Completed*, the disk has been restored to the storage account.


## Convert the restored disk to a Managed Disk
The restore job creates an unmanaged disk. In order to create a VM from the disk, it must first be converted to a managed disk.

1. Obtain the connection information for your storage account with [az storage account show-connection-string](https://docs.microsoft.com/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-show-connection-string). Replace *mystorageaccount* with the name of your storage account as follows:
    
    ```azurecli-interactive
    export AZURE_STORAGE_CONNECTION_STRING=$( az storage account show-connection-string \
        --resource-group myResourceGroup \
        --output tsv \
        --name mystorageaccount )
    ```

2. Your unmanaged disk is secured in the storage account. The following commands get information about your unmanaged disk and create a variable named *uri* that is used in the next step when you create the Managed Disk.

    ```azurecli-interactive
    container=$(az storage container list --query [0].name -o tsv)
    blob=$(az storage blob list --container-name $container --query [0].name -o tsv)
    uri=$(az storage blob url --container-name $container --name $blob -o tsv)
    ```

3. Now you can create a Managed Disk from your recovered disk with [az disk create](https://docs.microsoft.com/cli/azure/disk?view=azure-cli-latest#az-disk-create). The *uri* variable from the preceding step is used as the source for your Managed Disk.

    ```azurecli-interactive
    az disk create \
        --resource-group myResourceGroup \
        --name myRestoredDisk \
        --source $uri
    ```

4. As you now have a Managed Disk from your restored disk, clean up the unmanaged disk and storage account with [az storage account delete](/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-delete). Replace *mystorageaccount* with the name of your storage account as follows:

    ```azurecli-interactive
    az storage account delete \
        --resource-group myResourceGroup \
        --name mystorageaccount
    ```


## Create a VM from the restored disk
The final step is to create a VM from the Managed Disk.

1. Create a VM from your Managed Disk with [az vm create](/cli/azure/vm?view=azure-cli-latest#az-vm-create) as follows:

    ```azurecli-interactive
    az vm create \
        --resource-group myResourceGroup \
        --name myRestoredVM \
        --attach-os-disk myRestoredDisk \
        --os-type linux
    ```

2. To confirm that your VM has been created from your recovered disk, list the VMs in your resource group with [az vm list](/cli/azure/vm?view=azure-cli-latest#az-vm-list) as follows:

    ```azurecli-interactive
    az vm list --resource-group myResourceGroup --output table
    ```


## Next steps
In this tutorial, you restored a disk from a recovery point and then created a VM from the disk. You learned how to:

> [!div class="checklist"]
> * List and select recovery points
> * Restore a disk from a recovery point
> * Create a VM from the restored disk

Advance to the next tutorial to learn about restoring individual files from a recovery point.

> [!div class="nextstepaction"]
> [Restore files to a virtual machine in Azure](tutorial-restore-files.md)

