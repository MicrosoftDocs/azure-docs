---
title: Restore a VM disk with Azure Backup | Microsoft Docs
description: Learn how to restore a disk and create a recover a VM in Azure with Backup and Recovery Services.
services: virtual-machines, azure-backup
documentationcenter: virtual-machines
author: iainfoulds
manager: jeconnoc
editor:
tags: azure-resource-manager, virtual-machine-backup

ms.assetid: 
ms.service: virtual-machines, azure-backup
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/19/2017
ms.author: iainfou
ms.custom: mvc
---

# Restore a disk and create a recovered VM in Azure
Azure Backup creates recovery points that are stored in geo-redundant recovery vaults. When you restore from a recovery point, you can restore the whole VM or individual files. This article explains how to restore a complete VM. You can also [restore individual files](tutorial-restore-files.md). In this tutorial you learn how to:

> [!div class="checklist"]
> * List and select recovery points
> * Restore a disk from a recovery point
> * Create a VM from the restored disk

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 


## Backup overview
When Azure initiates a backup, the backup extension on the VM takes a point-in-time snapshot. The backup extension is installed on the VM when the first backup is requested. As no application writes occur while the VM is stopped, Azure Backup can also take a snapshot of the underlying storage if the VM is not running when the backup takes place

By default, Azure Backup takes a file system consistent backup. Once Azure Backup takes the snapshot, the data is transferred to the Recovery Services vault. To maximize efficiency, Azure Backup identifies and transfers only the blocks of data that have changed since the previous backup.

When the data transfer is complete, the snapshot is removed and a recovery point is created.


## Prerequisites
This tutorial requires a Linux VM that has been protected with Azure Backup. To simulate an accidental VM deletion and recovery process, you create a VM from disk in a recovery point. If you need a Linux VM VM that has been protected with Azure Backup, see [Back up a virtual machine in Azure with the CLI](quick-backup-vm-cli.md).


## List available recovery points
You may accidentally delete a VM, or wish to regularly test your backups. To restore a VM, you select a recovery point as the source for the recovery data. As the default policy creates a recovery point every evening and retains them for 30 days, you can keep a set of recovery points to allow you to select a particular point in time for recovery. 

To see a list of available recovery points, use [az backup recoverypoint list](). The following example list the recovery points for the VM named *myVM* in the *myRecoveryServicesVault* vault:

```azurecli-interactive
az backup recoverypoint list \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --container-name myVM \
    --item-name myVM
```

The recovery point **name** is used to recover disks. In this tutorial, we use the most recent recovery point available. Add the `--query` parameter to select the most recent recovery point name:

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
To restore your disk from the recovery point, you need to create an Azure storage account. The storage account is used to separate the recovered disks from existing Azure resources. In additional steps, we then use the recovered disk to create a VM.

1. To create a storage account, use [az storage account create](). The storage account name must be all lowercase, and be globally unique. The following example creates a storage account in the *myResourceGroup* resource group. Replaced *mystorageaccount* with your own unique name:

    ```azurecli-interactive
    az storage account create \
        --resource-group myResourceGroup \
        --name mystorageaccount \
        --sku Standard_LRS
    ```

2. Restore the disk from your recovery point with [az backup restore restore-disks](). Replace *mystorageaccount* with the name of the storage account you created in the preceding command. Replace *myRecoveryPointName* with the recovery point name you obtained in the output from the [az backup recoverypoint list]() command:

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
To monitor the status of backup jobs, use [az backup job list]():

```azurecli-interactive 
az backup job list \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --output table
```

The output is similar to the following example, which shows the restore job is **InProgress**:

```
Name             Operation        Status      Item Name    Start Time UTC       Duration
---------------  ---------------  ----------  -----------  -------------------  --------------
7f2ad916-{snip}  Restore          InProgress  myvm         2017-09-19T19:39:52  0:00:34.520850
a0a8e5e6-{snip}  Backup           Completed   myvm         2017-09-19T03:09:21  0:15:26.155212
fe5d0414-{snip}  ConfigureBackup  Completed   myvm         2017-09-19T03:03:57  0:00:31.191807
```

When the *Status* of the restore job reports *Completed*, the disk has been restored to the storage account.


## Create a VM from the restored disk
To create a VM, you need to convert the restored disk to an Azure Managed Disk. The restore job created an unmanaged disk in a storage account so that you have options as to what operations you can then perform on the disk. To use with a VM, convert to a Managed Disk. 

1. Obtain the URI of your restored disk:
    
    ```azurecli-interactive
    
    ```

2. Create a Managed Disk from your recovered disk with [az disk create](). Replace *myRecoverDiskURI* with the URI to your recovered disk that obtained in the preceding command:

    ```azurecli-interactive
    az disk create \
        --resource-group myResourceGroup \
        --name myRestoredDisk \
        --source
    ```

3. Create a VM from your Managed Disk with [az vm create]() as follows:

    ```azurecli-interactive
    az vm create
        --resource-group myResourceGroup \
        --name myRestoredVM \
        --attach-os-disk myRestoredDisk \
        --os-type linux
    ```

4. To confirm that your VM has been created from your recovered disk, list the VMs in your resource group with [az vm show]() as follows:

    ```azurecli-interactive
    az vm show --resource-group myResourceGroup
    ```


## Next steps

In this tutorial, you restore a disk from a recovery point and created a VM from the disk. You learned how to:

> [!div class="checklist"]
> * List and select recovery points
> * Restore a disk from a recovery point
> * Create a VM from the restored disk

Advance to the next tutorial to learn about restoring individual files from a recovery point.

> [!div class="nextstepaction"]
> [Restore files to a virtual machine in Azure](tutorial-restore-files.md)

