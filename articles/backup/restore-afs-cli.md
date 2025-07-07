---
title: Restore Azure Files with the Azure CLI
description: Learn how to use the Azure CLI to restore backed-up Azure Files in the Recovery Services vault
ms.topic: how-to
ms.custom: devx-track-azurecli, engagement-fy24
ms.date: 06/03/2025
author: jyothisuri
ms.author: jsuri
# Customer intent: As a cloud administrator, I want to restore backed-up Azure Files using the command line, so that I can efficiently recover entire shares or specific files as needed, ensuring quick restoration and minimal impact on operations.
---

# Restore Azure Files with the Azure CLI

The Azure CLI provides a command-line experience for managing Azure resources. It's a great tool for building custom automation to use Azure resources. This article explains how to restore an entire File Share or specific files from a restore point created by [Azure Backup](./backup-overview.md) by using the Azure CLI. You can also restore Azure Files using [Azure portal](restore-afs.md), [Azure PowerShell](restore-afs-powershell.md), [REST API](restore-azure-file-share-rest-api.md).

By the end of this article, you'll learn how to perform the following operations with the Azure CLI:

* View the restore points for a backed-up Azure Files.
* Restore a full Azure Files.
* Restore individual files or folders.

>[!NOTE]
>- Azure Files restore is only supported within the same subscription when using PowerShell or CLI.
>- Azure Backup now supports restoring multiple files or folders to the original or an alternate location using Azure CLI. Refer to the [Restore multiple files or folders to original or alternate location](#restore-multiple-files-or-folders-to-original-or-alternate-location) section of this document to learn more.

## Prerequisites

This article assumes that you already have an Azure Files that's backed up by Azure Backup. If you don't have one, see [Back up Azure Files with the CLI](backup-afs-cli.md) to configure backup for your File Share. For this article, you use the following resources:

| File Share | Storage account | Region | Details |
|---|---|---|---|
| `azurefiles` | *afsaccount* | EastUS | Original source backed up by using Azure Backup |
| *azurefiles1* | *afaccount1* | EastUS | Destination source used for alternate location recovery |

You can use a similar structure for your File Shares to try out the different types of restores explained in this article.

[!INCLUDE [azure-cli-prepare-your-environment-h3.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-h3.md)]

 - This tutorial requires version 2.0.18 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Fetch recovery points for the Azure Files

Use the [`az backup recoverypoint list`](/cli/azure/backup/recoverypoint#az-backup-recoverypoint-list) cmdlet to list all recovery points for the backed-up File Share.

The following example fetches the list of recovery points for the `azurefiles` File Share in the *afsaccount* storage account.

```azurecli-interactive
az backup recoverypoint list --vault-name azurefilesvault --resource-group azurefiles --container-name "StorageContainer;Storage;AzureFiles;afsaccount" --backup-management-type azurestorage --item-name "AzureFileShare;azurefiles" --workload-type azurefileshare --out table
```

You can also run the previous cmdlet by using the friendly name for the container and the item by providing the following two additional parameters:

* **--backup-management-type**: `azurestorage`
* **--workload-type**: `azurefileshare`

```azurecli-interactive
az backup recoverypoint list --vault-name azurefilesvault --resource-group azurefiles --container-name afsaccount --backup-management-type azurestorage --item-name azurefiles --workload-type azurefileshare --out table
```

The result set is a list of recovery points with time and consistency details for each restore point.

```output
Name                Time                        Consistency
------------------  -------------------------   --------------------
932887541532871865  2020-01-05T07:08:23+00:00   FileSystemConsistent
932885927361238054  2020-01-05T07:08:10+00:00   FileSystemConsistent
932879614553967772  2020-01-04T21:33:04+00:00   FileSystemConsistent
```

The **Name** attribute in the output corresponds to the recovery point name that can be used as a value for the **--rp-name** parameter in recovery operations.

## Full share recovery by using the Azure CLI

You can use this restore option to restore the complete File Share in the original or an alternate location.

Define the following parameters to perform restore operations:

* **--container-name**: The name of the storage account that hosts the backed-up original File Share. To retrieve the name or friendly name of your container, use the [az backup container list](/cli/azure/backup/container#az-backup-container-list) command.
* **--item-name**: The name of the backed-up original File Share you want to use for the restore operation. To retrieve the name or friendly name of your backed-up item, use the [az backup item list](/cli/azure/backup/item#az-backup-item-list) command.

### Restore a full share to the original location

When you restore to an original location, you don't need to specify target-related parameters. Only **Resolve Conflict** must be provided.

The following example uses the [`az backup restore restore-azurefileshare`](/cli/azure/backup/restore#az-backup-restore-restore-azurefileshare) cmdlet with restore mode set to `originallocation` to restore the `azurefiles` File Share in the original location. You use the recovery point 932883129628959823, which you obtained in [Fetch recovery points for the Azure Files](#fetch-recovery-points-for-the-azure-files):

```azurecli-interactive
az backup restore restore-azurefileshare --vault-name azurefilesvault --resource-group azurefiles --rp-name 932887541532871865   --container-name "StorageContainer;Storage;AzureFiles;afsaccount" --item-name "AzureFileShare;azurefiles" --restore-mode originallocation --resolve-conflict overwrite --out table
```

```output
Name                                  ResourceGroup
------------------------------------  ---------------
6a27cc23-9283-4310-9c27-dcfb81b7b4bb  azurefiles
```

The **Name** attribute in the output corresponds to the name of the job that's created by the backup service for your restore operation. To track the status of the job, use the [az backup job show](/cli/azure/backup/job#az-backup-job-show) cmdlet.

### Restore a full share to an alternate location

You can use this option to restore a File Share to an alternate location and keep the original File Share as is. Specify the following parameters for alternate location recovery:

* **--target-storage-account**: The storage account to which the backed-up content is restored. The target storage account must be in the same location as the vault.
* **--target-file-share**: The File Share within the target storage account to which the backed-up content is restored.
* **--target-folder**: The folder under the File Share to which data is restored. If the backed-up content is to be restored to a root folder, give the target folder values as an empty string.
* **--resolve-conflict**: Instruction if there's a conflict with the restored data. Accepts **Overwrite** or **Skip**.

The following example uses [`az backup restore restore-azurefileshare`](/cli/azure/backup/restore#az-backup-restore-restore-azurefileshare) with restore mode as `alternatelocation` to restore the `azurefiles` File Share in the *afsaccount* storage account to the *azurefiles1"* File Share in the *afaccount1* storage account.

```azurecli-interactive
az backup restore restore-azurefileshare --vault-name azurefilesvault --resource-group azurefiles --rp-name 932883129628959823 --container-name "StorageContainer;Storage;AzureFiles;afsaccount" --item-name "AzureFileShare;azurefiles" --restore-mode alternatelocation --target-storage-account afaccount1 --target-file-share azurefiles1 --target-folder restoredata --resolve-conflict overwrite --out table
```

```output
Name                                  ResourceGroup
------------------------------------  ---------------
babeb61c-d73d-4b91-9830-b8bfa83c349a  azurefiles
```

The **Name** attribute in the output corresponds to the name of the job that's created by the backup service for your restore operation. To track the status of the job, use the [az backup job show](/cli/azure/backup/job#az-backup-job-show) cmdlet.

## Item-level recovery

You can use this restore option to restore individual files or folders in the original or an alternate location.

Define the following parameters to perform restore operations:

* **--container-name**: The name of the storage account that hosts the backed-up original File Share. To retrieve the name or friendly name of your container, use the [az backup container list](/cli/azure/backup/container#az-backup-container-list) command.
* **--item-name**: The name of the backed-up original File Share you want to use for the restore operation. To retrieve the name or friendly name of your backed-up item, use the [az backup item list](/cli/azure/backup/item#az-backup-item-list) command.

Specify the following parameters for the items you want to recover:

* **SourceFilePath**: The absolute path of the file, to be restored within the File Share, as a string. This path is the same path used in the [az storage file download](/cli/azure/storage/file#az-storage-file-download) or [az storage file show](/cli/azure/storage/file#az-storage-file-show) CLI commands.
* **SourceFileType**: Choose whether a directory or a file is selected. Accepts **Directory** or **File**.
* **ResolveConflict**: Instruction if there's a conflict with the restored data. Accepts **Overwrite** or **Skip**.

### Restore individual files or folders to the original location

Use the [`az backup restore restore-azurefiles`](/cli/azure/backup/restore#az-backup-restore-restore-azurefiles) cmdlet with restore mode set to `originallocation` to restore specific files or folders to their original location.

The following example restores the *RestoreTest.txt* file in its original location: the `azurefiles` File Share.

```azurecli-interactive
az backup restore restore-azurefiles --vault-name azurefilesvault --resource-group azurefiles --rp-name 932881556234035474 --container-name "StorageContainer;Storage;AzureFiles;afsaccount" --item-name "AzureFileShare;azurefiles" --restore-mode originallocation  --source-file-type file --source-file-path "Restore/RestoreTest.txt" --resolve-conflict overwrite  --out table
```

```output
Name                                  ResourceGroup
------------------------------------  ---------------
df4d9024-0dcb-4edc-bf8c-0a3d18a25319  azurefiles
```

The **Name** attribute in the output corresponds to the name of the job that's created by the backup service for your restore operation. To track the status of the job, use the [az backup job show](/cli/azure/backup/job#az-backup-job-show) cmdlet.

### Restore individual files or folders to an alternate location

To restore specific files or folders to an alternate location, use the [`az backup restore restore-azurefiles`](/cli/azure/backup/restore#az-backup-restore-restore-azurefiles) cmdlet with restore mode set to `alternatelocation` and specify the following target-related parameters:

* **--target-storage-account**: The storage account to which the backed-up content is restored. The target storage account must be in the same location as the vault.
* **--target-file-share**: The File Share within the target storage account to which the backed-up content is restored.
* **--target-folder**: The folder under the File Share to which data is restored. If the backed-up content is to be restored to a root folder, give the target folder's value as an empty string.

The following example restores the *RestoreTest.txt* file originally present in the `azurefiles` File Share to an alternate location: the `restoredata` folder in the *azurefiles1* File Share hosted in the *afaccount1* storage account.

```azurecli-interactive
az backup restore restore-azurefiles --vault-name azurefilesvault --resource-group azurefiles --rp-name 932881556234035474 --container-name "StorageContainer;Storage;AzureFiles;afsaccount" --item-name "AzureFileShare;azurefiles" --restore-mode alternatelocation --target-storage-account afaccount1 --target-file-share azurefiles1 --target-folder restoredata --resolve-conflict overwrite --source-file-type file --source-file-path "Restore/RestoreTest.txt" --out table
```

```output
Name                                  ResourceGroup
------------------------------------  ---------------
df4d9024-0dcb-4edc-bf8c-0a3d18a25319  azurefiles
```

The **Name** attribute in the output corresponds to the name of the job that's created by the backup service for your restore operation. To track the status of the job, use the [az backup job show](/cli/azure/backup/job#az-backup-job-show) cmdlet.

## Restore multiple files or folders to original or alternate location

To perform restore for multiple items, pass the value for the **source-file-path** parameter as **space separated** paths of all files or folders you want to restore.

The following example restores the *Restore.txt* and *AFS testing Report.docx* files in their original location.

```azurecli-interactive
az backup restore restore-azurefiles --vault-name azurefilesvault --resource-group azurefiles --rp-name 932889937058317910 --container-name "StorageContainer;Storage;AzureFiles;afsaccount" --item-name "AzureFileShare;azurefiles" --restore-mode originallocation  --source-file-type file --source-file-path "Restore Test.txt" "AFS Testing Report.docx" --resolve-conflict overwrite  --out table
```

The output will be similar to the following:

```output
Name                                          ResourceGroup
------------------------------------          ---------------
649b0c14-4a94-4945-995a-19e2aace0305          azurefiles
```

The **Name** attribute in the output corresponds to the name of the job that's created by the backup service for your restore operation. To track the status of the job, use the [az backup job show](/cli/azure/backup/job#az-backup-job-show) cmdlet.

If you want to restore multiple items to an alternate location, use the command above by specifying target-related parameters as explained in the [Restore individual files or folders to an alternate location](#restore-individual-files-or-folders-to-an-alternate-location) section.

## Next steps

Manage Azure Files backups using [Azure portal](manage-afs-backup.md), [Azure PowerShell](manage-afs-powershell.md), [Azure CLI](manage-afs-backup-cli.md), [REST API](manage-azure-file-share-rest-api.md).
