---
title: Manage Azure file share backups with the Azure CLI
description: Learn how to use the Azure CLI to manage and monitor Azure file shares backed up by Azure Backup.
ms.topic: conceptual
ms.date: 01/15/2020
---

# Manage Azure file share backups with the Azure CLI

The Azure CLI provides a command-line experience for managing Azure resources. It's a great tool for building custom automation to use Azure resources. This article explains how to perform tasks for managing and monitoring the Azure file shares that are backed up by [Azure Backup](https://docs.microsoft.com/azure/backup/backup-overview). You can also perform these steps with the [Azure portal](https://portal.azure.com/).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

To install and use the CLI locally, you must run the Azure CLI version 2.0.18 or later. To find the CLI version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

## Prerequisites

This article assumes you already have an Azure file share backed up by [Azure Backup](https://docs.microsoft.com/azure/backup/backup-overview). If you don't have one, see [Back up Azure file shares with the CLI](backup-afs-cli.md) to configure backup for your file shares. For this article, you use the following resources:

* **Resource group**: *azurefiles*
* **RecoveryServicesVault**: *azurefilesvault*
* **Storage Account**: *afsaccount*
* **File Share**: *azurefiles*

## Monitor jobs

When you trigger backup or restore operations, the backup service creates a job for tracking. To monitor completed or currently running jobs, use the [az backup job list](https://docs.microsoft.com/cli/azure/backup/job?view=azure-cli-latest#az-backup-job-list) cmdlet. With the CLI, you also can [suspend a currently running job](https://docs.microsoft.com/cli/azure/backup/job?view=azure-cli-latest#az-backup-job-stop) or [wait until a job finishes](https://docs.microsoft.com/cli/azure/backup/job?view=azure-cli-latest#az-backup-job-wait).

The following example displays the status of backup jobs for the *azurefilesvault* Recovery Services vault:

```azurecli-interactive
az backup job list --resource-group azurefiles --vault-name azurefilesvault
```

```output
[
  {
    "eTag": null,
    "id": "/Subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/azurefiles/providers/Microsoft.RecoveryServices/vaults/azurefilesvault/backupJobs/d477dfb6-b292-4f24-bb43-6b14e9d06ab5",
    "location": null,
    "name": "d477dfb6-b292-4f24-bb43-6b14e9d06ab5",
    "properties": {
      "actionsInfo": null,
      "activityId": "3cef43ed-0af4-43e2-b9cb-1322c496ccb4",
      "backupManagementType": "AzureStorage",
      "duration": "0:00:29.718011",
      "endTime": "2020-01-13T08:05:29.180606+00:00",
      "entityFriendlyName": "azurefiles",
      "errorDetails": null,
      "extendedInfo": null,
      "jobType": "AzureStorageJob",
      "operation": "Backup",
      "startTime": "2020-01-13T08:04:59.462595+00:00",
      "status": "Completed",
      "storageAccountName": "afsaccount",
      "storageAccountVersion": "MicrosoftStorage"
    },
    "resourceGroup": "azurefiles",
    "tags": null,
    "type": "Microsoft.RecoveryServices/vaults/backupJobs"
  },
  {
    "eTag": null,
    "id": "/Subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/azurefiles/providers/Microsoft.RecoveryServices/vaults/azurefilesvault/backupJobs/1b9399bf-c23c-4caa-933a-5fc2bf884519",
    "location": null,
    "name": "1b9399bf-c23c-4caa-933a-5fc2bf884519",
    "properties": {
      "actionsInfo": null,
      "activityId": "2663449c-94f1-4735-aaf9-5bb991e7e00c",
      "backupManagementType": "AzureStorage",
      "duration": "0:00:28.145216",
      "endTime": "2020-01-13T08:05:27.519826+00:00",
      "entityFriendlyName": "azurefilesresource",
      "errorDetails": null,
      "extendedInfo": null,
      "jobType": "AzureStorageJob",
      "operation": "Backup",
      "startTime": "2020-01-13T08:04:59.374610+00:00",
      "status": "Completed",
      "storageAccountName": "afsaccount",
      "storageAccountVersion": "MicrosoftStorage"
    },
    "resourceGroup": "azurefiles",
    "tags": null,
    "type": "Microsoft.RecoveryServices/vaults/backupJobs"
  }
]
```

## Modify policy

You can modify a backup policy to change backup frequency or retention range by using [az backup item set-policy](https://docs.microsoft.com/cli/azure/backup/item?view=azure-cli-latest#az-backup-item-set-policy).

To change the policy, define the following parameters:

* **--container-name**: The name of the storage account that hosts the file share. To retrieve the **name** or **friendly name** of your container, use the [az backup container list](https://docs.microsoft.com/cli/azure/backup/container?view=azure-cli-latest#az-backup-container-list) command.
* **--name**: The name of the file share for which you want to change the policy. To retrieve the **name** or **friendly name** of your backed-up item, use the [az backup item list](https://docs.microsoft.com/cli/azure/backup/item?view=azure-cli-latest#az-backup-item-list) command.
* **--policy-name**: The name of the backup policy you want to set for your file share. You can use [az backup policy list](https://docs.microsoft.com/cli/azure/backup/policy?view=azure-cli-latest#az-backup-policy-list) to view all the policies for your vault.

The following example sets the *schedule2* backup policy for the *azurefiles* file share present in the *afsaccount* storage account.

```azurecli-interactive
az backup item set-policy --policy-name schedule2 --name azurefiles --vault-name azurefilesvault --resource-group azurefiles --container-name "StorageContainer;Storage;AzureFiles;afsaccount" --name "AzureFileShare;azurefiles" --backup-management-type azurestorage --out table
```

You can also run the previous command by using the friendly names for the container and the item by providing the following two additional parameters:

* **--backup-management-type**: *azurestorage*
* **--workload-type**: *azurefileshare*

```azurecli-interactive
az backup item set-policy --policy-name schedule2 --name azurefiles --vault-name azurefilesvault --resource-group azurefiles --container-name afsaccount --name azurefiles --backup-management-type azurestorage --out table
```

```output
Name                                  ResourceGroup
------------------------------------  ---------------
fec6f004-0e35-407f-9928-10a163f123e5  azurefiles
```

The **Name** attribute in the output corresponds to the name of the job that's created by the backup service for your change policy operation. To track the status of the job, use the [az backup job show](https://docs.microsoft.com/cli/azure/backup/job?view=azure-cli-latest#az-backup-job-show) cmdlet.

## Stop protection on a file share

There are two ways to stop protecting Azure file shares:

* Stop all future backup jobs and *delete* all recovery points.
* Stop all future backup jobs but *leave* the recovery points.

There might be a cost associated with leaving the recovery points in storage, because the underlying snapshots created by Azure Backup will be retained. The benefit of leaving the recovery points is the option to restore the file share later, if you want. For information about the cost of leaving the recovery points, see the [pricing details](https://azure.microsoft.com/pricing/details/storage/files). If you choose to delete all recovery points, you can't restore the file share.

To stop protection for the file share, define the following parameters:

* **--container-name**: The name of the storage account that hosts the file share. To retrieve the **name** or **friendly name** of your container, use the [az backup container list](https://docs.microsoft.com/cli/azure/backup/container?view=azure-cli-latest#az-backup-container-list) command.
* **--item-name**: The name of the file share for which you want to stop protection. To retrieve the **name** or **friendly name** of your backed-up item, use the [az backup item list](https://docs.microsoft.com/cli/azure/backup/item?view=azure-cli-latest#az-backup-item-list) command.

### Stop protection and retain recovery points

To stop protection while retaining data, use the [az backup protection disable](https://docs.microsoft.com/cli/azure/backup/protection?view=azure-cli-latest#az-backup-protection-disable) cmdlet.

The following example stops protection for the *azurefiles* file share but retains all recovery points.

```azurecli-interactive
az backup protection disable --vault-name azurefilesvault --resource-group azurefiles --container-name "StorageContainer;Storage;AzureFiles;afsaccount" --item-name “AzureFileShare;azurefiles” --out table
```

You can also run the previous command by using the friendly name for the container and the item by providing the following two additional parameters:

* **--backup-management-type**: *azurestorage*
* **--workload-type**: *azurefileshare*

```azurecli-interactive
az backup protection disable --vault-name azurefilesvault --resource-group azurefiles --container-name afsaccount --item-name azurefiles --workload-type azurefileshare --backup-management-type Azurestorage --out table
```

```output
Name                                  ResourceGroup
------------------------------------  ---------------
fec6f004-0e35-407f-9928-10a163f123e5  azurefiles
```

The **Name** attribute in the output corresponds to the name of the job that's created by the backup service for your stop protection operation. To track the status of the job, use the [az backup job show](https://docs.microsoft.com/cli/azure/backup/job?view=azure-cli-latest#az-backup-job-show) cmdlet.

### Stop protection without retaining recovery points

To stop protection without retaining recovery points, use the [az backup protection disable](https://docs.microsoft.com/cli/azure/backup/protection?view=azure-cli-latest#az-backup-protection-disable) cmdlet with the **delete-backup-data** option set to **true**.

The following example stops protection for the *azurefiles* file share without retaining recovery points.

```azurecli-interactive
az backup protection disable --vault-name azurefilesvault --resource-group azurefiles --container-name "StorageContainer;Storage;AzureFiles;afsaccount" --item-name “AzureFileShare;azurefiles” --delete-backup-data true --out table
```

You can also run the previous command by using the friendly name for the container and the item by providing the following two additional parameters:

* **--backup-management-type**: *azurestorage*
* **--workload-type**: *azurefileshare*

```azurecli-interactive
az backup protection disable --vault-name azurefilesvault --resource-group azurefiles --container-name afsaccount --item-name azurefiles --workload-type azurefileshare --backup-management-type Azurestorage --delete-backup-data true --out table
```

## Resume protection on a file share

If you stopped protection for an Azure file share but retained recovery points, you can resume protection later. If you don't retain the recovery points, you can't resume protection.

To resume protection for the file share, define the following parameters:

* **--container-name**: The name of the storage account that hosts the file share. To retrieve the **name** or **friendly name** of your container, use the [az backup container list](https://docs.microsoft.com/cli/azure/backup/container?view=azure-cli-latest#az-backup-container-list) command.
* **--item-name**: The name of the file share for which you want to resume protection. To retrieve the **name** or **friendly name** of your backed-up item, use the [az backup item list](https://docs.microsoft.com/cli/azure/backup/item?view=azure-cli-latest#az-backup-item-list) command.
* **--policy-name**: The name of the backup policy for which you want to resume the protection for the file share.

The following example uses the [az backup protection resume](https://docs.microsoft.com/cli/azure/backup/protection?view=azure-cli-latest#az-backup-protection-resume) cmdlet to resume protection for the *azurefiles* file share by using the *schedule1* backup policy.

```azurecli-interactive
az backup protection resume --vault-name azurefilesvault --resource-group azurefiles --container-name "StorageContainer;Storage;AzureFiles;afsaccount” --item-name “AzureFileShare;azurefiles” --policy-name schedule2 --out table
```

You can also run the previous command by using the friendly name for the container and the item by providing the following two additional parameters:

* **--backup-management-type**: *azurestorage*
* **--workload-type**: *azurefileshare*

```azurecli-interactive
az backup protection resume --vault-name azurefilesvault --resource-group azurefiles --container-name afsaccount --item-name azurefiles --workload-type azurefileshare --backup-management-type Azurestorage --policy-name schedule2 --out table
```

```output
Name                                  ResourceGroup
------------------------------------  ---------------
75115ab0-43b0-4065-8698-55022a234b7f  azurefiles
```

The **Name** attribute in the output corresponds to the name of the job that's created by the backup service for your resume protection operation. To track the status of the job, use the [az backup job show](https://docs.microsoft.com/cli/azure/backup/job?view=azure-cli-latest#az-backup-job-show) cmdlet.

## Unregister a storage account

If you want to protect your file shares in a particular storage account by using a different Recovery Services vault, first [stop protection for all file shares](#stop-protection-on-a-file-share) in that storage account. Then unregister the account from the Recovery Services vault currently used for protection.

You need to provide a container name to unregister the storage account. To retrieve the **name** or the **friendly name** of your container, use the [az backup container list](https://docs.microsoft.com/cli/azure/backup/container?view=azure-cli-latest#az-backup-container-list) command.

The following example unregisters the *afsaccount* storage account from *azurefilesvault* by using the [az backup container unregister](https://docs.microsoft.com/cli/azure/backup/container?view=azure-cli-latest#az-backup-container-unregister) cmdlet.

```azurecli-interactive
az backup container unregister --vault-name azurefilesvault --resource-group azurefiles --container-name "StorageContainer;Storage;AzureFiles;afsaccount" --out table
```

You can also run the previous cmdlet by using the friendly name for the container by providing the following additional parameter:

* **--backup-management-type**: *azurestorage*

```azurecli-interactive
az backup container unregister --vault-name azurefilesvault --resource-group azurefiles --container-name afsaccount --backup-management-type azurestorage --out table
```

## Next steps

For more information, see [Troubleshoot Azure file shares backup](troubleshoot-azure-files.md).
