---
title: Azure Quick Start - Back up a VM with Azure CLI | Microsoft Docs
description: Learn how to back up your virtual machines with the Azure CLI
services: virtual-machines-linux, azure-backup
documentationcenter: virtual-machines
author: iainfoulds
manager: jeconnoc
editor: 
tags: azure-resource-manager, virtual-machine-backup

ms.assetid: 
ms.service: virtual-machines-linux, azure-backup
ms.devlang: azurecli
ms.topic: hero-article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/18/2017
ms.author: iainfou
ms.custom: mvc
---

# Back up a virtual machine in Azure with the CLI
The Azure CLI is used to create and manage Azure resources from the command line or in scripts. You can protect your data by taking backups at regular intervals. Azure Backup creates recovery points that are stored in geo-redundant recovery vaults. This article details how to back up a virtual machine (VM) in Azure with the Azure CLI. You can also perform these steps with [Azure PowerShell](quick-backup-vm-powershell.md) or [Azure portal](quick-backup-vm-portal.md).

This quick start enables backup on an existing Azure VM. If you need to create a VM, you can [create a VM with the Azure CLI](../virtual-machines/scripts/virtual-machines-linux-cli-sample-create-vm-quick-create.md?toc=%2fcli%2fazure%2ftoc.json).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 


## Register the Azure Backup resource provider
The first time you use Azure Backup, you must register the Azure Recovery Service provider with your subscription with [az provider register]().

```azurecli-interactive
az provider register –-namespace Microsoft.RecoveryServices
```


## Create a recovery services vault
A Recovery Services vault is a logical container that stores the backup data for each protected resource, such as Azure VMs. When the backup job for a protected resource runs, it creates a recovery point inside the Recovery Services vault. These recovery points are used to then restore data to a given point in time as needed.

Create a Recovery Services vault with [az backup vault create](). Specify the same resource group and location as the VM you wish to protect. If you used the sample script, the resource group is named *myResourceGroup*, the VM is named *myVM*, and the resources are in the *westeurope* location.

```azurecli-interactive 
az backup vault create --resource-group myResourceGroup \
    --name myRecoveryServicesVault \
    --location westeurope
```

By default, the vault is set for Geo-Redundant storage. To further protect your data, this storage redundancy level ensures that your backup data is replicated to a secondary Azure region that is hundreds of miles away from the primary region.


## Enable backup for an Azure VM
You create and use policies to define when a backup job runs and how long the recovery points are stored. The default protection policy runs a backup job each day at midnight and retains recovery points for 30 days. You can use these default policy values to quickly protect your VM. To enable backup protection for a VM, use [az backup protection enable—for-vm](). Specify the policy to use, then the resource group and VM to protect:

```azurecli-interactive 
az backup protection enable-for-vm \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --vm myVM \
    --policy-name DefaultPolicy
```


## Start a backup job
To start a backup now rather than wait for the default policy to run the job at midnight, use [az backup protection backup-now](). This first backup job creates a full recovery point. Each backup job after this initial backup creates incremental recovery points. Incremental recovery points are storage and time-efficient, as they only transfer changes made since the last backup.

The `--container-name` and `--item-name` parameters are the name of your VM. The `--retain-until` value should be set to the last available date, in UTC time format (**dd-mm-yyy**), that you wish the recovery point to be available. The following example backs up the VM named *myVM* and sets the expiration of the recovery point to October 18, 2017:

```azurecli-interactive 
az backup protection backup-now \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --container-name myVM \
    --item-name myVM \
    --retain-until 18-10-2017
```

As this first backup job creates a full recovery point, the process can take up to 20 minutes.


## Monitor a backup job
To monitor the status of backup jobs, use [az backup job list]():

```azurecli-interactive 
az backup job list \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --output table
```

The output is similar to the following example, which shows the backup job is **InProgress**:

```azurecli
Name             Operation        Status      Item Name    Start Time UTC       Duration
---------------  ---------------  ----------  -----------  -------------------  --------------
a0a8e5e6-{snip}  Backup           InProgress  myvm         2017-09-19T03:09:21  0:00:48.718366
fe5d0414-{snip}  ConfigureBackup  Completed   myvm         2017-09-19T03:03:57  0:00:31.191807
```

When the *Status* of the backup job reports *Completed*, your VM is protected with Recovery Services and has a full recovery point stored.


## Clean up deployment
When no longer needed, you can disable protection on the VM, remove the restore points and Recovery Services vault, then delete the resource group and associated VM resources:

```azurecli-interactive 
az backup protection disable \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --container-name myVM \
    --item-name myVM \
    --delete-backup-data true
az backup vault delete \
    --resource-group myResourceGroup \
    --name myRecoveryServicesVault \
az group delete --name myResourceGroup
```


## Next steps
In this quick start, you created a Recovery Services vault, enabled protection on a VM, and created the initial recovery point. To learn more about Azure Backup and Recovery Services, continue to the tutorials.

> [!div class="nextstepaction"]
> [Restore VMs using templates](./tutorial-backup-azure-vm.md)
