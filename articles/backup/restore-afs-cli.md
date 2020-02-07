---
title: Restore Azure File shares with Azure CLI
description: Learn how to use Azure CLI to restore backed-up Azure file shares in the Recovery Services Vault
ms.topic: conceptual
ms.date: 01/16/2020
---

# Restore Azure file shares with CLI

The Azure command-line interface (CLI) provides a command-line experience for managing Azure resources. It's a great tool for building custom automation to use Azure resources. This article explains how to restore an entire file share or specific files from a restore point created by the [Azure Backup](https://docs.microsoft.com/azure/backup/backup-overview) service using Azure CLI. You can also perform these steps with [Azure PowerShell](https://docs.microsoft.com/azure/backup/backup-azure-afs-automation) or in the [Azure portal](backup-afs.md).

By the end of this tutorial, you'll learn how to perform below operations with Azure CLI:

* View restore points for a backed-up Azure file share
* Restore a full Azure file share
* Restore individual files or folders

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

To install and use the CLI locally, you must run Azure CLI version 2.0.18 or later. To find the CLI version, `run az --version`. If you need to install or upgrade, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

## Prerequisites

This article assumes that you already have an Azure file share that is backed up by the Azure Backup service. If you don’t have one, refer to [Backup Azure file shares with CLI](backup-afs-cli.md)  to configure backup for your file share. For this article we will be using the following resources:

| File Share  | Storage Account | Region | Details                                                      |
| ----------- | --------------- | ------ | ------------------------------------------------------------ |
| *azurefiles*  | *afsaccount*      | EastUS | Original source backed up using Azure Backup                 |
| *azurefiles1* | *afaccount1*      | EastUS | Destination source used for alternate location recovery |

You can use a similar structure for your file shares to try out the different types of restores explained in this document.

## Fetch Recovery Points for the Azure file share

Use the [az backup recoverypoint list](https://docs.microsoft.com/cli/azure/backup/recoverypoint?view=azure-cli-latest#az-backup-recoverypoint-list) cmdlet to list all recovery points for the backed-up file share.

The following example fetches the list of recovery points for *azurefiles* file share in the *afsaccount* storage account.

```azurecli-interactive
az backup recoverypoint list --vault-name azurefilesvault --resource-group azurefiles --container-name "StorageContainer;Storage;AzureFiles;afsaccount” --backup-management-type azurestorage --item-name “AzureFileShare;azurefiles” --workload-type azurefileshare --out table
```

You can also execute the cmdlet above using the “friendly name” for container and item by providing the following two additional parameters:

* **--backup-management-type**: *azurestorage*
* **--workload-type**: *azurefileshare*

```azurecli-interactive
az backup recoverypoint list --vault-name azurefilesvault --resource-group azurefiles --container-name afsaccount --backup-management-type azurestorage --item-name azurefiles --workload-type azurefileshare --out table
```

The result set will be a list of recovery points with time and consistency details for each restore point.

```output
Name                Time                        Consistency
------------------  -------------------------   --------------------
932887541532871865  2020-01-05T07:08:23+00:00   FileSystemConsistent
932885927361238054  2020-01-05T07:08:10+00:00   FileSystemConsistent
932879614553967772  2020-01-04T21:33:04+00:00   FileSystemConsistent
```

The **Name** attribute in the output corresponds to the recovery point name that can be used as a value for the **--rp-name** parameter in recovery operations.

## Full Share Recovery using Azure CLI

You can use this restore option to restore the complete file share in the original or an alternate location.

Define the following parameters to perform restore operations:

* **--container-name** is the name of the storage account hosting the backed-up original file share. To retrieve the **name** or **friendly name** of your container, use the [az backup container list](https://docs.microsoft.com/cli/azure/backup/container?view=azure-cli-latest#az-backup-container-list) command.
* **--item-name** is the name of the backed-up original file share you want to use for the restore operation. To retrieve the **name** or **friendly name** of your backed-up item, use the [az backup item list](https://docs.microsoft.com/cli/azure/backup/item?view=azure-cli-latest#az-backup-item-list) command.

### Restore full share to the original location

When you restore to an original location, you don't need to specify target-related parameters. Only **Resolve Conflict** must be provided.

The following example uses the [az backup restore restore-azurefileshare](https://docs.microsoft.com/cli/azure/backup/restore?view=azure-cli-latest#az-backup-restore-restore-azurefileshare) cmdlet with restore mode set to *originallocation* to restore the *azurefiles* file share in the original location, using the recovery point 932883129628959823, which we obtained with [Fetch Recovery Points for the Azure File share](#fetch-recovery-points-for-the-azure-file-share):

```azurecli-interactive
az backup restore restore-azurefileshare --vault-name azurefilesvault --resource-group azurefiles --rp-name 932887541532871865   --container-name "StorageContainer;Storage;AzureFiles;afsaccount” --item-name “AzureFileShare;azurefiles” --restore-mode originallocation --resolve-conflict overwrite --out table
```

```output
Name                                  ResourceGroup
------------------------------------  ---------------
6a27cc23-9283-4310-9c27-dcfb81b7b4bb  azurefiles
```

The **Name** attribute in the output corresponds to the name of the job that is created by the backup service for your “restore” operation. To track the status of the job, use the [az backup job show](https://docs.microsoft.com/cli/azure/backup/job?view=azure-cli-latest#az-backup-job-show) cmdlet.

### Restore full share to an alternate location

You can use this option to restore a file share to an alternate location and keep the original file share as is. Specify the following parameters for alternate location recovery:

* **--target-storage-account**: The storage account to which the backed-up content is restored. The target storage account must be in the same location as the vault.
* **--target-file-share**: The file share within the target storage account to which the backed-up content is restored.
* **--target-folder**: The folder under the file share to which data is restored. If the backed-up content is to be restored to a root folder, give the target folder values as an empty string.
* **--resolve-conflict**: Instruction if there's a conflict with the restored data. Accepts **Overwrite** or **Skip**.

The following example uses [az backup restore restore-azurefileshare](https://docs.microsoft.com/cli/azure/backup/restore?view=azure-cli-latest#az-backup-restore-restore-azurefileshare) with restore mode as *alternatelocation* to restore the *azurefiles* file share in the *afsaccount* storage account to *azurefiles1”* file share in the *afaccount1* storage account.

```azurecli-interactive
az backup restore restore-azurefileshare --vault-name azurefilesvault --resource-group azurefiles --rp-name 932883129628959823 --container-name "StorageContainer;Storage;AzureFiles;afsaccount” --item-name “AzureFileShare;azurefiles” --restore-mode alternatelocation --target-storage-account afaccount1 --target-file-share azurefiles1 --target-folder restoredata --resolve-conflict overwrite --out table
```

```output
Name                                  ResourceGroup
------------------------------------  ---------------
babeb61c-d73d-4b91-9830-b8bfa83c349a  azurefiles
```

The **Name** attribute in the output corresponds to the name of the job that is created by the backup service for your “restore” operation. To track the status of the job, use the [az backup job show](https://docs.microsoft.com/cli/azure/backup/job?view=azure-cli-latest#az-backup-job-show) cmdlet.

## Item Level Recovery

You can use this restore option to restore individual files or folders in the original or an alternate location.

Define the following parameters to perform restore operations:

* **--container-name** is the name of the storage account hosting the backed-up original file share. To retrieve the **name** or **friendly name** of your container, use the [az backup container list](https://docs.microsoft.com/cli/azure/backup/container?view=azure-cli-latest#az-backup-container-list) command.
* **--item-name** is the name of the backed up original file share you want to use for the restore operation. To retrieve the **name** or **friendly name** of your backed-up item, use the [az backup item list](https://docs.microsoft.com/cli/azure/backup/item?view=azure-cli-latest#az-backup-item-list) command.

Specify the following parameters for the items you want to recover:

* **SourceFilePath**: The absolute path of the file, to be restored within the file share, as a string. This path is the same path used in the [az storage file download](https://docs.microsoft.com/cli/azure/storage/file?view=azure-cli-latest#az-storage-file-download) or [az storage file show](https://docs.microsoft.com/cli/azure/storage/file?view=azure-cli-latest#az-storage-file-show) CLI commands.
* **SourceFileType**: Choose whether a directory or a file is selected. Accepts **Directory** or **File**.
* **ResolveConflict**: Instruction if there's a conflict with the restored data. Accepts **Overwrite** or **Skip**.

### Restore individual files/folders to the original Location

Use the [az backup restore restore-azurefiles](https://docs.microsoft.com/cli/azure/backup/restore?view=azure-cli-latest#az-backup-restore-restore-azurefiles) cmdlet with restore mode set to *originallocation* to restore specific files/folders to their original location.

The following example restores the *“RestoreTest.txt”* file in original location: the *azurefiles* fileshare.

```azurecli-interactive
az backup restore restore-azurefiles --vault-name azurefilesvault --resource-group azurefiles --rp-name 932881556234035474 --container-name "StorageContainer;Storage;AzureFiles;afsaccount” --item-name “AzureFileShare;azurefiles” --restore-mode originallocation  --source-file-type file --source-file-path "Restore/RestoreTest.txt" --resolve-conflict overwrite  --out table
```

```output
Name                                  ResourceGroup
------------------------------------  ---------------
df4d9024-0dcb-4edc-bf8c-0a3d18a25319  azurefiles
```

The **Name** attribute in the output corresponds to the name of the job that is created by the backup service for your “restore” operation. To track the status of the job, use the [az backup job show](https://docs.microsoft.com/cli/azure/backup/job?view=azure-cli-latest#az-backup-job-show) cmdlet.

### Restore individual files/folders to an alternate location

To restore specific files/folders to an alternate location, use the [az backup restore restore-azurefiles](https://docs.microsoft.com/cli/azure/backup/restore?view=azure-cli-latest#az-backup-restore-restore-azurefiles) cmdlet with restore mode set to *alternatelocation* and specify the following target-related parameters:

* **--target-storage-account**: The storage account to which the backed-up content is restored. The target storage account must be in the same location as the vault.
* **--target-file-share**: The file share within the target storage account to which the backed-up content is restored.
* **--target-folder**: The folder under the file share to which data is restored. If the backed-up content is to be restored to a root folder, give the target folder's value as an empty string.

The following example restores the *RestoreTest.txt* file originally present in the *azurefiles* fileshare to an alternate location: the *restoredata* folder in the *azurefiles1* fileshare hosted in the *afaccount1* storage account.

```azurecli-interactive
az backup restore restore-azurefiles --vault-name azurefilesvault --resource-group azurefiles --rp-name 932881556234035474 --container-name "StorageContainer;Storage;AzureFiles;afsaccount” --item-name “AzureFileShare;azurefiles” --restore-mode alternatelocation --target-storage-account afaccount1 --target-file-share azurefiles1 --target-folder restoredata --resolve-conflict overwrite --source-file-type file --source-file-path "Restore/RestoreTest.txt" --out table
```

```output
Name                                  ResourceGroup
------------------------------------  ---------------
df4d9024-0dcb-4edc-bf8c-0a3d18a25319  azurefiles
```

The **Name** attribute in the output corresponds to the name of the job that is created by the backup service for your “restore” operation. To track the status of the job, use the [az backup job show](https://docs.microsoft.com/cli/azure/backup/job?view=azure-cli-latest#az-backup-job-show) cmdlet.

## Next steps

Learn how to [Manage Azure file share backups with Azure CLI](manage-afs-backup-cli.md)
