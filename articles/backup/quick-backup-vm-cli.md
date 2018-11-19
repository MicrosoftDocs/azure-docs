---
title: Azure Quick Start - Back up a VM with Azure CLI
description: Learn how to back up your virtual machines with the Azure CLI
services: backup
author: markgalioto
manager: carmonm
tags: azure-resource-manager, virtual-machine-backup
ms.service: backup
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 8/3/2018
ms.author: markgal
ms.custom: mvc
---

# Back up a virtual machine in Azure with the CLI
The Azure CLI is used to create and manage Azure resources from the command line or in scripts. You can protect your data by taking backups at regular intervals. Azure Backup creates recovery points that can be stored in geo-redundant recovery vaults. This article details how to back up a virtual machine (VM) in Azure with the Azure CLI. You can also perform these steps with [Azure PowerShell](quick-backup-vm-powershell.md) or in the [Azure portal](quick-backup-vm-portal.md).

This quick start enables backup on an existing Azure VM. If you need to create a VM, you can [create a VM with the Azure CLI](../virtual-machines/linux/quick-create-cli.md).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

To install and use the CLI locally, you must run Azure CLI version 2.0.18 or later. To find the CLI version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 


## Create a recovery services vault
A Recovery Services vault is a logical container that stores the backup data for each protected resource, such as Azure VMs. When the backup job for a protected resource runs, it creates a recovery point inside the Recovery Services vault. You can then use one of these recovery points to restore data to a given point in time.

Create a Recovery Services vault with [az backup vault create](https://docs.microsoft.com/cli/azure/backup/vault#az-backup-vault-create). Specify the same resource group and location as the VM you wish to protect. If you used the [VM quickstart](../virtual-machines/linux/quick-create-cli.md), then you created:

- a resource group named *myResourceGroup*,
- a VM named *myVM*,
- resources in the *eastus* location.

```azurecli-interactive 
az backup vault create --resource-group myResourceGroup \
    --name myRecoveryServicesVault \
    --location eastus
```

By default, the Recovery Services vault is set for Geo-Redundant storage. Geo-Redundant storage ensures your backup data is replicated to a secondary Azure region that is hundreds of miles away from the primary region.


## Enable backup for an Azure VM
Create a protection policy to define: when a backup job runs, and how long the recovery points are stored. The default protection policy runs a backup job each day and retains recovery points for 30 days. You can use these default policy values to quickly protect your VM. To enable backup protection for a VM, use [az backup protection enable-for-vm](https://docs.microsoft.com/cli/azure/backup/protection#az-backup-protection-enable-for-vm). Specify the resource group and VM to protect, then the policy to use:

```azurecli-interactive 
az backup protection enable-for-vm \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --vm myVM \
    --policy-name DefaultPolicy
```

> [!NOTE]
If the VM is not in the same resource group as that of vault, then myResourceGroup refers to the resource group where vault was created. Instead of VM name, provide the VM ID as indicated below.

```azurecli-interactive 
az backup protection enable-for-vm \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --vm $(az vm show -g VMResourceGroup -n MyVm --query id) \
    --policy-name DefaultPolicy
```

## Start a backup job
To start a backup now rather than wait for the default policy to run the job at the scheduled time, use [az backup protection backup-now](https://docs.microsoft.com/cli/azure/backup/protection#az-backup-protection-backup-now). This first backup job creates a full recovery point. Each backup job after this initial backup creates incremental recovery points. Incremental recovery points are storage and time-efficient, as they only transfer changes made since the last backup.

The following parameters are used to back up the VM:

- `--container-name` is the name of your VM
- `--item-name` is the name of your VM
- `--retain-until` value should be set to the last available date, in UTC time format (**dd-mm-yyyy**), that you wish the recovery point to be available

The following example backs up the VM named *myVM* and sets the expiration of the recovery point to October 18, 2017:

```azurecli-interactive 
az backup protection backup-now \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --container-name myVM \
    --item-name myVM \
    --retain-until 18-10-2017
```


## Monitor the backup job
To monitor the status of backup jobs, use [az backup job list](https://docs.microsoft.com/cli/azure/backup/job#az-backup-job-list):

```azurecli-interactive 
az backup job list \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --output table
```

The output is similar to the following example, which shows the backup job is *InProgress*:

```
Name      Operation        Status      Item Name    Start Time UTC       Duration
--------  ---------------  ----------  -----------  -------------------  --------------
a0a8e5e6  Backup           InProgress  myvm         2017-09-19T03:09:21  0:00:48.718366
fe5d0414  ConfigureBackup  Completed   myvm         2017-09-19T03:03:57  0:00:31.191807
```

When the *Status* of the backup job reports *Completed*, your VM is protected with Recovery Services and has a full recovery point stored.


## Clean up deployment
When no longer needed, you can disable protection on the VM, remove the restore points and Recovery Services vault, then delete the resource group and associated VM resources. If you used an existing VM, you can skip the final [az group delete](/cli/azure/group?view=azure-cli-latest#az-group-delete) command to leave the resource group and VM in place.

If you want to try a Backup tutorial that explains how to restore data for your VM, go to [Next steps](#next-steps). 

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
> [Back up multiple Azure VMs](./tutorial-backup-vm-at-scale.md)
