---
title: Back up Azure file shares with Azure CLI
description: Learn how to use Azure CLI to back up Azure file shares in the Recovery Services vault
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 01/14/2020
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up Azure file shares with Azure CLI

The Azure CLI provides a command-line experience for managing Azure resources. It's a great tool for building custom automation to use Azure resources. This article details how to back up Azure file shares with Azure CLI. You can also perform these steps via [Azure PowerShell](./backup-azure-afs-automation.md) or the [Azure portal](backup-afs.md).

By the end of this tutorial, you'll learn how to perform the operations below with Azure CLI:

* Create a Recovery Services vault
* Enable backup for Azure file shares
* Trigger an on-demand backup for file shares

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0.18 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a Recovery Services vault

A Recovery Services vault is an entity that gives you a consolidated view and management capability across all backup items. When the backup job for a protected resource runs, it creates a recovery point inside the Recovery Services vault. You can then use one of these recovery points to restore data to a given point in time.

Follow these steps to create a Recovery Services vault:

1. A vault is placed in a resource group. If you don’t have an existing resource group, create a new one with [az group create](/cli/azure/group#az-group-create) . In this tutorial, we create the new resource group *azurefiles* in the East US region.

    ```azurecli-interactive
    az group create --name AzureFiles --location eastus --output table
    ```

    ```output
    Location    Name
    ----------  ----------
    eastus      AzureFiles
    ```

1. Use the [az backup vault create](/cli/azure/backup/vault#az-backup-vault-create) cmdlet to create the vault. Specify the same location for the vault as was used for the resource group.

    The following example creates a Recovery Services vault named *azurefilesvault* in the East US region.

    ```azurecli-interactive
    az backup vault create --resource-group azurefiles --name azurefilesvault --location eastus --output table
    ```

    ```output
    Location    Name                ResourceGroup
    ----------  ----------------    ---------------
    eastus      azurefilesvault     azurefiles
    ```

## Enable backup for Azure file shares

This section assumes that you already have an Azure file share for which you want to configure backup. If you don't have one, create an Azure file share using the [az storage share create](/cli/azure/storage/share#az-storage-share-create) command.

To enable backup for file shares, you need to create a protection policy that defines when a backup job runs and how long recovery points are stored. You can create a backup policy using the [az backup policy create](/cli/azure/backup/policy#az-backup-policy-create) cmdlet.

The following example uses the [az backup protection enable-for-azurefileshare](/cli/azure/backup/protection#az-backup-protection-enable-for-azurefileshare) cmdlet to enable backup for the *azurefiles* file share in the *afsaccount* storage account using the *schedule 1* backup policy:

```azurecli-interactive
az backup protection enable-for-azurefileshare --vault-name azurefilesvault --resource-group  azurefiles --policy-name schedule1 --storage-account afsaccount --azure-file-share azurefiles  --output table
```

```output
Name                                  ResourceGroup
------------------------------------  ---------------
0caa93f4-460b-4328-ac1d-8293521dd928  azurefiles
```

The **Name** attribute in the output corresponds to the name of the job that's created by the backup service for your **enable backup** operation. To track status of the job, use the [az backup job show](/cli/azure/backup/job#az-backup-job-show) cmdlet.

## Trigger an on-demand backup for file share

If you want to trigger an on-demand backup for your file share instead of waiting for the backup policy to run the job at the scheduled time, use the [az backup protection backup-now](/cli/azure/backup/protection#az-backup-protection-backup-now) cmdlet.

You need to define the following parameters to trigger an on-demand backup:

* **--container-name** is the name of the storage account hosting the file share. To retrieve the **name** or **friendly name** of your container, use the [az backup container list](/cli/azure/backup/container#az-backup-container-list) command.
* **--item-name** is the name of the file share for which you want to trigger an on-demand backup. To retrieve the **name** or **friendly name** of your backed-up item, use the [az backup item list](/cli/azure/backup/item#az-backup-item-list) command.
* **--retain-until** specifies the date until when you want to retain the recovery point. The value should be set in UTC time format (dd-mm-yyyy).

The following example triggers an on-demand backup for the *azurefiles* fileshare in the *afsaccount* storage account with retention until *20-01-2020*.

```azurecli-interactive
az backup protection backup-now --vault-name azurefilesvault --resource-group azurefiles --container-name "StorageContainer;Storage;AzureFiles;afsaccount" --item-name "AzureFileShare;azurefiles" --retain-until 20-01-2020 --output table
```

```output
Name                                  ResourceGroup
------------------------------------  ---------------
9f026b4f-295b-4fb8-aae0-4f058124cb12  azurefiles
```

The **Name** attribute in the output corresponds to the name of the job that's created by the backup service for your “on-demand backup” operation. To track the status of a job, use the [az backup job show](/cli/azure/backup/job#az-backup-job-show) cmdlet.

## Next steps

* Learn how to [Restore Azure file shares with CLI](restore-afs-cli.md)
* Learn how to [Manage Azure file share backups with CLI](manage-afs-backup-cli.md)
