---
title: Configure Vaulted Backup  for Azure Data Lake Storage using Azure portal, PowerShell, or Azure CLI
description: Learn how to configure vaulted backup for Azure Data Lake Storage using Azure portal, PowerShell, or Azure CLI.
ms.topic: how-to
ms.service: azure-backup
ms.custom:
  - ignite-2025
  - devx-track-azurepowershell-azurecli, devx-track-azurecli, references_regions
zone_pivot_groups: backup-client-portal-powershell-cli
ms.date: 11/18/2025
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a cloud administrator, I want to configure vaulted backup for Azure Data Lake Storage, so that I can ensure data protection and recovery capabilities are in place for my storage accounts.
---

# Configure vaulted backup for Azure Data Lake Storage

::: zone pivot="client-portal"

This article describes how to configure vaulted backups for Azure Data Lake Storage using Azure portal.

## Prerequisites

Before you configure vaulted backup for Azure Data Lake Storage, ensure the following prerequisites are met:

- The storage account must be in a [supported region and of the required types](azure-data-lake-storage-backup-support-matrix.md).
- The target account mustn't have containers with the  names same as the containers in a recovery point; otherwise, the restore operation fails.
- Identify or [create a Backup vault](create-manage-backup-vault.md#create-backup-vault) in the same region as the Azure Data Lake Storage account.
- [Create a backup policy for Azure Data Lake Storage](azure-data-lake-storage-backup-create-policy-quickstart.md?pivots=client-portal) that defines the backup schedule and retention range.
- [Grant permissions to the Backup vault on storage accounts](azure-data-lake-storage-backup-tutorial.md#grant-permissions-to-the-backup-vault-on-storage-accounts).

>[!Note]
>- This feature is currently available in specific regions only. See the [supported regions](azure-data-lake-storage-backup-support-matrix.md#supported-regions).
>- Vaulted backup restores are only possible to a different storage account.

For more information about the supported scenarios, limitations, and availability, see the [support matrix](azure-data-lake-storage-backup-support-matrix.md).


[!INCLUDE [How to configure backup for Azure Data Lake Storage](../../includes/azure-data-lake-storage-configure-backup.md)]


Learn how to [monitor backup jobs](azure-data-lake-storage-backup-tutorial.md#monitor-an-azure-data-lake-storage-backup-job).

::: zone-end


::: zone pivot="client-powershell"

This article describes how to configure vaulted backups for Azure Data Lake Storage using PowerShell.

## Prerequisites

Before you configure vaulted backup for Azure Data Lake Storage, ensure that the following prerequisites are met:

- Install the Azure PowerShell version Az 14.6.0. Learn [how to install Azure PowerShell](/powershell/azure/install-az-ps).
- Identify or [create a Backup vault](backup-blobs-storage-account-ps.md?tabs=operational-backup#create-a-backup-vault) to configure Azure Data Lake Storage backup.
- Review the [supported scenarios](azure-data-lake-storage-backup-support-matrix.md) for Azure Data Lake Storage backup.
- [Create a backup policy for Azure Data Lake Storage](azure-data-lake-storage-backup-create-policy-quickstart.md?pivots=client-powershell) that defines the backup schedule and retention range.

## Configure vaulted backup for the Azure Data Lake Storage using PowerShell

After the vault and backup policy are created, configure vaulted  backup for Azure Data Lake Storage by reviewing the following sections:

1. Fetch the ARM ID of the storage account containing the Data Lake Storage to be protected
1. Grant permissions to the Backup vault
1. Trigger the request for backup configuration

### Fetch the ARM ID of the storage account containing the Data Lake Storage to be protected

The Azure Resource Manager (ARM) ID of the storage account is required to configure vaulted backup for Azure Data Lake Storage. This ID identifies the storage account that contains the Data Lake Storage you want to protect. For example, use the storage account *`PSTestSA`* in the resource group `adlsrg` in a different subscription.

To fetch the ARM ID of the storage account, run the following example cmdlet:

```azurepowershell-interactive
$SAId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/adlsrg/providers/Microsoft.Storage/storageAccounts/PSTestSA"
```

### Grant permissions to the Backup vault on the storage account

The Backup vault requires permissions on the storage account to enable backups on Data Lake Storage present within the storage account. The system-assigned managed identity of the vault is used for assigning such permissions.

You need to assign the required permissions via Azure role-based access control (RBAC) to the created vault (represented by vault Managed System Identity (MSI)) and the relevant storage account.

[Learn how to grant permissions to the Backup vault using Azure portal for Azure Data Lake Storage](azure-data-lake-storage-backup-tutorial.md#grant-permissions-to-the-backup-vault-on-storage-accounts).

### Trigger the request for vaulted backup configuration

After all the relevant permissions are set, configure Azure Date Lake Storage vaulted backup by running the following cmdlets:

1. Create a new backup configuration object to specify the set of containers you want to back up. 

   To back up all containers, pass the *`-IncludeAllContainer`* parameter. For specific containers, pass the list of containers to the *`-VaultedBackupContainer`* parameter.
    ```azurepowershell-interactive
    $backupConfig=New-AzDataProtectionBackupConfigurationClientObject -DatasourceType AzureDataLakeStorage -IncludeAllContainer -StorageAccountResourceGroupName "StorageRG" -StorageAccountName "testpscmd"
    ```

1. Prepare the request by using the relevant vault, policy, storage account, and the backup configuration object you created using the [`Initialize-AzDataProtectionBackupInstance`](/powershell/module/az.dataprotection/initialize-azdataprotectionbackupinstance) cmdlet.

    ```azurepowershell-interactive
    $instance=Initialize-AzDataProtectionBackupInstance -DatasourceType AzureDataLakeStorage -DatasourceLocation $TestBkpVault.Location -PolicyId $adlsBkpPol.Id -DatasourceId $SAId -BackupConfiguration $backupConfig
    ```

1. Submit the request to trigger backup configuration using the [`New-AzDataProtectionBackupInstance`](/powershell/module/az.dataprotection/new-azdataprotectionbackupinstance) cmdlet.

    ```azurepowershell-interactive
    New-AzDataProtectionBackupInstance -ResourceGroupName "StorageRG" -VaultName $TestBkpVault.Name -BackupInstance $instance
    ```

::: zone-end


::: zone pivot="client-cli"

This article describes how to configure vaulted backups for Azure Data Lake Storage using Azure CLI.

## Prerequisites

Before you configure vaulted backup for Azure Data Lake Storage, ensure that the following prerequisites are met:

- Identify or [create a Backup vault](backup-blobs-storage-account-cli.md?tabs=operational-backup#create-a-backup-vault) to configure Azure Data Lake Storage backup.
- Review the [supported scenarios](azure-data-lake-storage-backup-support-matrix.md) for Azure Data Lake Storage backup.
- [Create a backup policy for Azure Data Lake Storage](azure-data-lake-storage-backup-create-policy-quickstart.md?pivots=client-cli) that defines the backup schedule and retention range.

## Configure vaulted backup for the Azure Data Lake Storage using Azure CLI

After the vault and backup policy are created, configure vaulted backup for Azure Data Lake Storage by reviewing the following sections:

1. Fetch the ARM ID of the storage account containing the Data Lake Storage to be protected
1. Grant permissions to the Backup vault
1. Trigger the request for backup configuration

>[!Important]
>After a storage account is configured for Data Lake Storage  backup, a few capabilities, such as **change feed** and **delete lock**, are affected. [Learn more](blob-backup-configure-manage.md?tabs=vaulted-backup#effects-on-backed-up-storage-accounts).

### Fetch the ARM ID of the storage account containing the Data Lake Storage to be protected

The Azure Resource Manager (ARM) ID of the storage account is required to configure vaulted backup for Azure Data Lake Storage. This ID identifies the storage account that contains the Data Lake Storage you want to protect. For example, use the storage account *`CLITestSA`* in the resource group `adlsrg` in a different subscription present in the `Southeast Asia` region.

TO fetch the ARM ID of the storage account, run the following example command:

```azurecli-interactive
"/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/adlsrg/providers/Microsoft.Storage/storageAccounts/CLITestSA"
```

### Grant permissions to the Backup vault on the storage account

The Backup vault requires permissions on the storage account to enable backups on Data Lake Storage present within the storage account. The system-assigned managed identity of the vault is used for assigning such permissions.

You need to assign the required permissions via Azure role-based access control (RBAC) to the created vault (represented by vault Managed System Identity (MSI)) and the relevant storage account.

[Learn how to grant permissions to the Backup vault using Azure portal for Azure Data Lake Storage](azure-data-lake-storage-backup-tutorial.md#grant-permissions-to-the-backup-vault-on-storage-accounts).

### Trigger the request for vaulted backup configuration

After all the relevant permissions are set, configure Azure Date Lake Storage vaulted backup by running the following example cmdlets:

1. Prepare the request by using the relevant vault, policy, storage account, and the backup configuration object you created using the [`az dataprotection backup-instance initialize`](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-initialize) command.

    ```azurecli-interactive
    az dataprotection backup-instance initialize --datasource-type AzureDataLakeStorage  -l southeastasia --policy-id "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault/backupPolicies/AdlsPolicy1" --datasource-id "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/adlsrg/providers/Microsoft.Storage/storageAccounts/CLITestSA" > backup_instance.json
    ```

1. Submit the request to trigger backup configuration using the [`az dataprotection backup-instance create`](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-create) command.

    ```azurecli-interactive
    az dataprotection backup-instance create -g adlsrg--vault-name TestBkpVault --backup-instance backup_instance.json
    ```

   The following example JSON configures an Azure Data Lake Storage backup for a specified storage account with specified policy and container list.

    ```JSON
    {
        "properties": {
            "friendlyName": " adlsbackup",
            "dataSourceInfo": {
                "resourceID": "/subscriptions/ xxxxxxx-xxxx-xxxx-xxxx /resourceGroups/adlsrg/providers/Microsoft.Storage/storageAccounts/adlsbackup",
                "resourceUri": "/subscriptions/ xxxxxxx-xxxx-xxxx-xxxx /resourceGroups/adlsrg/providers/Microsoft.Storage/storageAccounts/adlsbackup",
                "datasourceType": "Microsoft.Storage/storageAccounts/adlsBlobServices",
                "resourceName": " adlsbackup",
                "resourceType": "Microsoft.Storage/storageAccounts",
                "resourceLocation": "francesouth",
                "objectType": "Datasource"
            },
            "policyInfo": {
                "policyId": "/subscriptions/ xxxxxxxx-xxxx-xxxx-xxxx/resourceGroups/adlsrg/providers/Microsoft.DataProtection/backupVaults/ TestBkpVault/backupPolicies/AdlsPolicy1",
                "policyParameters": {
                    "backupDatasourceParametersList": [
                        {
                            "containersList": [
                                "container7",
                                "container8"
                            ],
                            "objectType": "AdlsBlobBackupDatasourceParameters"
                        }
                    ]
                }
            },
            "protectionStatus": {
                "status": "ProtectionConfigured"
            },
            "currentProtectionState": "ProtectionConfigured",
            "provisioningState": "Succeeded",
            "objectType": "BackupInstance"
        },
        "id": "/subscriptions/ xxxxxxxx-xxxx-xxxx-xxxx /resourceGroups/adlsrg/providers/Microsoft.DataProtection/backupVaults/ TestBkpVault/backupInstances/adlsbackup",
        "name": " adlsbackup",
        "type": "Microsoft.DataProtection/backupVaults/backupInstances"
    }

    ```

::: zone-end


## Next steps

- [Restore Azure Data Lake Storage using Azure portal](azure-data-lake-storage-restore.md).
- [Manage vaulted backup for Azure Data Lake Storage using Azure portal](azure-data-lake-storage-backup-manage.md).
- [Troubleshoot Azure Data Lake Storage backup](azure-data-lake-storage-backup-troubleshoot.md). 
 



