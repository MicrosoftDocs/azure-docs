---
title: Restore Azure Blobs via Azure CLI
description: Learn how to restore Azure Blobs to any point-in-time using Azure CLI.
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 06/18/2021
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore Azure Blobs to point-in-time using Azure CLI

This article describes how to restore [blobs](blob-backup-overview.md) to any point-in-time using Azure Backup.

> [!IMPORTANT]
> Support for Azure Blobs backup and restore via CLI is in preview and available as an extension in Az 2.15.0 version and later. The extension is automatically installed when you run the **az dataprotection** commands. [Learn more](/cli/azure/azure-cli-extensions-overview) about extensions.

> [!IMPORTANT]
> Before you restore Azure Blobs using Azure Backup, see [important points](blob-restore.md#before-you-start).

In this article, you'll learn how to:

- Restore Azure Blobs to point-in-time

- Track the restore operation status

We'll refer to an existing Backup vault _TestBkpVault_, under the resource group _testBkpVaultRG_ in the examples.

## Restoring Azure Blobs within a storage account

### Fetching the valid time range for restore

As the operational backup for blobs is continuous, there are no distinct points to restore from. Instead, we need to fetch the valid time-range under which blobs can be restored to any point-in-time. In this example, let's check for valid time-ranges to restore within the last 30 days.

First, we need to fetch the relevant backup instance ID. List all backup instances within a vault using the [az dataprotection backup-instance list](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-list) command, and then fetch the relevant instance using [az dataprotection backup-instance show](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-show) command. Alternatively, for at-scale scenarios, you can list backup instances across vaults and subscriptions using the [az dataprotection backup-instance list-from-resourcegraph](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-list-from-resourcegraph) command.

```azurecli-interactive
az dataprotection backup-instance list-from-resourcegraph --datasource-type AzureBlob --datasource-id "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/blobrg/providers/Microsoft.Storage/storageAccounts/CLITestSA"
```

```output
[
  {
    "datasourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/blobrg/providers/Microsoft.Storage/storageAccounts/CLITestSA",
    "extendedLocation": null,
    "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault/backupInstances/CLITestSA-CLITestSA-c3a2a98c-def8-44db-bd1d-ff6bc86ed036",
    "identity": null,
    "kind": "",
    "location": "",
    "managedBy": "",
    "name": "CLITestSA-CLITestSA-c3a2a98c-def8-44db-bd1d-ff6bc86ed036",
    "plan": null,
    "properties": {
      "currentProtectionState": "ProtectionConfigured",
      "dataSourceInfo": {
        "baseUri": null,
        "datasourceType": "Microsoft.Storage/storageAccounts/blobServices",
        "objectType": "Datasource",
        "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/blobrg/providers/Microsoft.Storage/storageAccounts/CLITestSA",
        "resourceLocation": "southeastasia",
        "resourceName": "CLITestSA",
        "resourceType": "Microsoft.Storage/storageAccounts",
        "resourceUri": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/blobrg/providers/Microsoft.Storage/storageAccounts/CLITestSA"
      },
      "dataSourceProperties": null,
      "dataSourceSetInfo": null,
      "datasourceAuthCredentials": null,
      "friendlyName": "CLITestSA",
      "objectType": "BackupInstance",
      "policyInfo": {
        "policyId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault/backupPolicies/BlobBackup-Policy",
        "policyParameters": {
          "dataStoreParametersList": [
            {
              "dataStoreType": "OperationalStore",
              "objectType": "AzureOperationalStoreParameters",
              "resourceGroupId": ""
            }
          ]
        },
        "policyVersion": ""
      },
      "protectionErrorDetails": null,
      "protectionStatus": {
        "errorDetails": null,
        "status": "ProtectionConfigured"
      },
      "provisioningState": "Succeeded"
    },
    "protectionState": "ProtectionConfigured",
    "resourceGroup": "rg-bv",
    "sku": null,
    "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx",
    "tags": null,
    "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx",
    "type": "microsoft.dataprotection/backupvaults/backupinstances",
    "vaultName": "TestBkpVault",
    "zones": null
  }
]
```

Once the instance is identified, fetch the relevant recovery range using the [az dataprotection restorable-time-range find](/cli/azure/dataprotection/restorable-time-range#az-dataprotection-restorable-time-range-find) command.

```azurecli-interactive
az dataprotection restorable-time-range find --start-time 2021-05-30T00:00:00 --end-time 2021-05-31T00:00:00 --source-data-store-type OperationalStore -g testBkpVaultRG --vault-name TestBkpVault --backup-instances CLITestSA-CLITestSA-c3a2a98c-def8-44db-bd1d-ff6bc86ed036
```

```output
{
  "id": "CLITestSA-CLITestSA-c3a2a98c-def8-44db-bd1d-ff6bc86ed036",
  "name": null,
  "properties": {
    "objectType": "AzureBackupFindRestorableTimeRangesResponse",
    "restorableTimeRanges": [
      {
        "endTime": "2021-05-31T00:00:00.0000000Z",
        "objectType": "RestorableTimeRange",
        "startTime": "2021-06-13T18:53:44.4465407Z"
      }
    ]
  },
  "systemData": null,
  "type": "Microsoft.DataProtection/backupVaults/backupInstances/findRestorableTimeRanges"
}
```

### Preparing the restore request

Once the point-in-time to restore is fixed, there are multiple options to restore.

#### Restoring all the blobs to a point-in-time

Using this option, you can restore all block blobs in the storage account by rolling them back to the selected point in time. Storage accounts containing large amounts of data or witnessing a high churn may take longer times to restore. To restore all block blobs, use the [az dataprotection backup-instance restore initialize-for-data-recovery](/cli/azure/dataprotection/backup-instance/restore#az-dataprotection-backup-instance-restore-initialize-for-data-recovery) command. The restore location and the target resource ID will be the same as the protected storage account.

```azurecli-interactive
az dataprotection backup-instance restore initialize-for-data-recovery --datasource-type AzureBlob --restore-location southeastasia --source-datastore OperationalStore --target-resource-id "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/blobrg/providers/Microsoft.Storage/storageAccounts/CLITestSA" --point-in-time 2021-06-02T18:53:44.4465407Z
```

```output
{
  "object_type": "AzureBackupRecoveryTimeBasedRestoreRequest",
  "recovery_point_time": "2021-06-02T18:53:44.4465407Z.0000000Z",
  "restore_target_info": {
    "datasource_info": {
      "datasource_type": "Microsoft.Storage/storageAccounts/blobServices",
      "object_type": "Datasource",
      "resource_id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/blobrg/providers/Microsoft.Storage/storageAccounts/CLITestSA",
      "resource_location": "southeastasia",
      "resource_name": "CLITestSA",
      "resource_type": "Microsoft.Storage/storageAccounts",
      "resource_uri": ""
    },
    "object_type": "RestoreTargetInfo",
    "recovery_option": "FailIfExists",
    "restore_location": "southeastasia"
  },
  "source_data_store_type": "OperationalStore"
}
```

```azurecli-interactive
az dataprotection backup-instance restore initialize-for-data-recovery --datasource-type AzureBlob --restore-location southeastasia --source-datastore OperationalStore --target-resource-id "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/blobrg/providers/Microsoft.Storage/storageAccounts/CLITestSA" --point-in-time 2021-06-02T18:53:44.4465407Z > restore.json
```

#### Restoring selected containers

Using this option, you can browse and select up to 10 containers to restore. To restore selected containers, use the [az dataprotection backup-instance restore initialize-for-item-recovery](/cli/azure/dataprotection/backup-instance/restore#az-dataprotection-backup-instance-restore-initialize-for-item-recovery) command.

```azurecli-interactive
az dataprotection backup-instance restore initialize-for-item-recovery --datasource-type AzureBlob --restore-location southeastasia --source-datastore OperationalStore --backup-instance-id "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault/backupInstances/CLITestSA-CLITestSA-c3a2a98c-def8-44db-bd1d-ff6bc86ed036" --point-in-time 2021-06-02T18:53:44.4465407Z --container-list container1 container2
```

```output
{
  "object_type": "AzureBackupRecoveryTimeBasedRestoreRequest",
  "recovery_point_time": "2021-06-02T18:53:44.4465407Z.0000000Z",
  "restore_target_info": {
    "datasource_info": {
      "datasource_type": "Microsoft.Storage/storageAccounts/blobServices",
      "object_type": "Datasource",
      "resource_id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/blobrg/providers/Microsoft.Storage/storageAccounts/CLITestSA",
      "resource_location": "southeastasia",
      "resource_name": "CLITestSA",
      "resource_type": "Microsoft.Storage/storageAccounts",
      "resource_uri": ""
    },
    "object_type": "ItemLevelRestoreTargetInfo",
    "recovery_option": "FailIfExists",
    "restore_criteria": [
      {
        "max_matching_value": "container1-0",
        "min_matching_value": "container1",
        "object_type": "RangeBasedItemLevelRestoreCriteria"
      },
      {
        "max_matching_value": "container2-0",
        "min_matching_value": "container2",
        "object_type": "RangeBasedItemLevelRestoreCriteria"
      }
    ],
    "restore_location": "southeastasia"
  },
  "source_data_store_type": "OperationalStore"
}
```

```azurecli-interactive
az dataprotection backup-instance restore initialize-for-item-recovery --datasource-type AzureBlob --restore-location southeastasia --source-datastore OperationalStore --backup-instance-id "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault/backupInstances/CLITestSA-CLITestSA-c3a2a98c-def8-44db-bd1d-ff6bc86ed036" --point-in-time 2021-06-02T18:53:44.4465407Z --container-list container1 container2 > restore.json
```

#### Restoring containers using a prefix match

This option lets you restore a subset of blobs using a prefix match. You can specify up to 10 lexicographical ranges of blobs within a single container or across multiple containers to return those blobs to their previous state at a given point-in-time. Here are a few things to keep in mind:

- You can use a forward slash (/) to delineate the container name from the blob prefix.
- The start of the range specified is inclusive, however the specified range is exclusive.

[Learn more](blob-restore.md#use-prefix-match-for-restoring-blobs) about using prefixes to restore blob ranges.

To restore selected containers, use the [az dataprotection backup-instance restore initialize-for-item-recovery](/cli/azure/dataprotection/backup-instance/restore#az-dataprotection-backup-instance-restore-initialize-for-item-recovery) command.

```azurecli-interactive
az dataprotection backup-instance restore initialize-for-item-recovery --datasource-type AzureBlob --restore-location southeastasia --source-datastore OperationalStore --backup-instance-id "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault/backupInstances/CLITestSA-CLITestSA-c3a2a98c-def8-44db-bd1d-ff6bc86ed036" --point-in-time 2021-06-02T18:53:44.4465407Z --from-prefix-pattern container1/text1 container2/text4 --to-prefix-pattern container1/text4 container2/text41
```

```output
{
  "object_type": "AzureBackupRecoveryTimeBasedRestoreRequest",
  "recovery_point_time": "2021-06-02T18:53:44.4465407Z.0000000Z",
  "restore_target_info": {
    "datasource_info": {
      "datasource_type": "Microsoft.Storage/storageAccounts/blobServices",
      "object_type": "Datasource",
      "resource_id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/blobrg/providers/Microsoft.Storage/storageAccounts/CLITestSA",
      "resource_location": "southeastasia",
      "resource_name": "CLITestSA",
      "resource_type": "Microsoft.Storage/storageAccounts",
      "resource_uri": ""
    },
    "object_type": "ItemLevelRestoreTargetInfo",
    "recovery_option": "FailIfExists",
    "restore_criteria": [
       {
        "max_matching_value": "container1/text4",
        "min_matching_value": "container1/text1",
        "object_type": "RangeBasedItemLevelRestoreCriteria"
      },
      {
        "max_matching_value": "container2/text41",
        "min_matching_value": "container2/text4",
        "object_type": "RangeBasedItemLevelRestoreCriteria"
      }
    ],
    "restore_location": "southeastasia"
  },
  "source_data_store_type": "OperationalStore"
}
```

```azurecli-interactive
az dataprotection backup-instance restore initialize-for-item-recovery --datasource-type AzureBlob --restore-location southeastasia --source-datastore OperationalStore --backup-instance-id "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault/backupInstances/CLITestSA-CLITestSA-c3a2a98c-def8-44db-bd1d-ff6bc86ed036" --point-in-time 2021-06-02T18:53:44.4465407Z --from-prefix-pattern container1/text1 container2/text4 --to-prefix-pattern container1/text4 container2/text41 > restore.json
```

### Trigger the restore

Use the [az dataprotection backup-instance restore trigger](/cli/azure/dataprotection/backup-instance/restore#az-dataprotection-backup-instance-restore-trigger) command to trigger the restore with the request prepared above.

```azurecli-interactive
az dataprotection backup-instance restore trigger -g testBkpVaultRG --vault-name TestBkpVault --backup-instance-name CLITestSA-CLITestSA-c3a2a98c-def8-44db-bd1d-ff6bc86ed036 --restore-request-object restore.json
```

## Tracking job

Track all the jobs using the [az dataprotection job list](/cli/azure/dataprotection/job#az-dataprotection-job-list) command. You can list all jobs and fetch a particular job detail.

You can also use Az.ResourceGraph to track all jobs across all Backup vaults. Use the [az dataprotection job list-from-resourcegraph](/cli/azure/dataprotection/job#az-dataprotection-job-list-from-resourcegraph) command to get the relevant job which can be across any Backup vault.

```azurecli-interactive
az dataprotection job list-from-resourcegraph --datasource-type AzureBlob --operation Restore
```

## Next steps

[Support matrix for Azure Blobs backup](blob-backup-support-matrix.md)
