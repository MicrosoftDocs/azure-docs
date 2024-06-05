---
title: Restore Azure Blobs via Azure CLI
description: Learn how to restore Azure Blobs to any point-in-time using Azure CLI.
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 05/30/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore Azure Blobs using Azure CLI

This article describes how to restore [blobs](blob-backup-overview.md) using Azure Backup.

You can restore Azure Blobs to point-in-time using *operational backups* and *vaulted backups (preview)* for Azure Blobs via Azure CLI. Here, let's use an existing Backup vault `TestBkpVault`, under the resource group `testBkpVaultRG` in the examples.

> [!IMPORTANT]
> Before you restore Azure Blobs using Azure Backup, see [important points](blob-restore.md#before-you-start).

## Fetch details to restore a blob backup

To restore a blob backup, you need to *fetch the valid time range for *operational backup* and *fetch the list of recovery points* for *vaulted backup (preview)*.

**Choose a backup tier**:

# [Operational backup](#tab/operational-backup)

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

# [Vaulted backup (preview)](#tab/vaulted-backup)

To fetch the list of recovery points available to restore vaulted backup (preview), use the `az dataprotection recovery-point list` command.

To fetch the name of the backup instance corresponding to your backed-up storage account, use the `az dataprotection backup-instance list` command.

```azurecli-interactive
az dataprotection recovery-point list --backup-instance-name "contosoaccounting-contosoaccounting-xxxxxxxxxx " --resource-group StorageRG  --vault-name TestBkpvault
[
  {
    "id": "/subscriptions/c3d3eb0c-9ba7-4d4c-828e-cb6874714034/resourceGroups/StorageRG/providers/Microsoft.DataProtection/backupVaults/contosobackupvault/backupInstances/contosoaccounting-contosoaccounting-e69dfa84-16d1-40de-9c8b-f8c0a36c602a/recoveryPoints/ce0cc687b23049f298324e732996c052",
    "name": "ce0cc687b23049f298324e732996c052",
    "properties": {
      "friendlyName": "ce0cc687b23049f298324e732996c052",
      "objectType": "AzureBackupDiscreteRecoveryPoint",
      "policyName": "testingpolicy890",
      "recoveryPointDataStoresDetails": [
        {
          "creationTime": "2024-05-12T19:32:31.3330061Z",
          "id": "c506fa1f-4a94-48a5-8fc1-eab1e9f7dabd",
          "state": "COMMITTED",
          "type": "VaultStore",
          "visible": true
        }
      ],
      "recoveryPointId": "ce0cc687b23049f298324e732996c052",
      "recoveryPointState": "Completed",
      "recoveryPointTime": "2024-05-12T19:32:31.3303086Z",
      "recoveryPointType": "Full",
      "retentionTagName": "Default",
      "retentionTagVersion": "638350187371578530"
    },
    "resourceGroup": "StorageRG",
    "type": "Microsoft.DataProtection/backupVaults/backupInstances/recoveryPoints"
  },
  {
    "id": "/subscriptions/c3d3eb0c-9ba7-4d4c-828e-cb6874714034/resourceGroups/StorageRG/providers/Microsoft.DataProtection/backupVaults/contosobackupvault/backupInstances/contosoaccounting-contosoaccounting-e69dfa84-16d1-40de-9c8b-f8c0a36c602a/recoveryPoints/abfdaf7bd9364ed394cd8a299f74af36",
    "name": "abfdaf7bd9364ed394cd8a299f74af36",
    "properties": {
      "friendlyName": "abfdaf7bd9364ed394cd8a299f74af36",
      "objectType": "AzureBackupDiscreteRecoveryPoint",
      "policyName": "testingpolicy890",
      "recoveryPointDataStoresDetails": [
        {
          "creationTime": "2024-05-11T19:31:07.7202941Z",
          "id": "c506fa1f-4a94-48a5-8fc1-eab1e9f7dabd",
          "state": "COMMITTED",
          "type": "VaultStore",
          "visible": true
        }
      ],
      "recoveryPointId": "abfdaf7bd9364ed394cd8a299f74af36",
      "recoveryPointState": "Completed",
      "recoveryPointTime": "2024-05-11T19:31:07.7039530Z",
      "recoveryPointType": "Full",
      "retentionTagName": "Default",
      "retentionTagVersion": "638350187371578530"
    },
    "resourceGroup": "StorageRG",
    "type": "Microsoft.DataProtection/backupVaults/backupInstances/recoveryPoints"
  },
  {
    "id": "/subscriptions/c3d3eb0c-9ba7-4d4c-828e-cb6874714034/resourceGroups/StorageRG/providers/Microsoft.DataProtection/backupVaults/contosobackupvault/backupInstances/contosoaccounting-contosoaccounting-e69dfa84-16d1-40de-9c8b-f8c0a36c602a/recoveryPoints/b1cc8fea90cd438ea1a3a7cd37be120e",
    "name": "b1cc8fea90cd438ea1a3a7cd37be120e",
    "properties": {
      "friendlyName": "b1cc8fea90cd438ea1a3a7cd37be120e",
      "objectType": "AzureBackupDiscreteRecoveryPoint",
      "policyName": "testingpolicy890",
      "recoveryPointDataStoresDetails": [
        {
          "creationTime": "2024-05-10T19:31:09.4791885Z",
          "id": "c506fa1f-4a94-48a5-8fc1-eab1e9f7dabd",
          "state": "COMMITTED",
          "type": "VaultStore",
          "visible": true
        }
      ],
      "recoveryPointId": "b1cc8fea90cd438ea1a3a7cd37be120e",
      "recoveryPointState": "Completed",
      "recoveryPointTime": "2024-05-10T19:31:09.4863074Z",
      "recoveryPointType": "Full",
      "retentionTagName": "Default",
      "retentionTagVersion": "638350187371578530"
    },
    "resourceGroup": "StorageRG",
    "type": "Microsoft.DataProtection/backupVaults/backupInstances/recoveryPoints"
  },
  {
    "id": "/subscriptions/c3d3eb0c-9ba7-4d4c-828e-cb6874714034/resourceGroups/StorageRG/providers/Microsoft.DataProtection/backupVaults/contosobackupvault/backupInstances/contosoaccounting-contosoaccounting-e69dfa84-16d1-40de-9c8b-f8c0a36c602a/recoveryPoints/5f799518096f4197a9fca2d764e4f1e1",
    "name": "5f799518096f4197a9fca2d764e4f1e1",
    "properties": {
      "friendlyName": "5f799518096f4197a9fca2d764e4f1e1",
      "objectType": "AzureBackupDiscreteRecoveryPoint",
      "policyName": "testingpolicy890",
      "recoveryPointDataStoresDetails": [
        {
          "creationTime": "2024-05-09T19:31:52.4857818Z",
          "id": "c506fa1f-4a94-48a5-8fc1-eab1e9f7dabd",
          "state": "COMMITTED",
          "type": "VaultStore",
          "visible": true
        }
      ],
      "recoveryPointId": "5f799518096f4197a9fca2d764e4f1e1",
      "recoveryPointState": "Completed",
      "recoveryPointTime": "2024-05-09T19:31:52.4782110Z",
      "recoveryPointType": "Full",
      "retentionTagName": "Default",
      "retentionTagVersion": "638350187371578530"
    },
    "resourceGroup": "StorageRG",
    "type": "Microsoft.DataProtection/backupVaults/backupInstances/recoveryPoints"
  },
  {
    "id": "/subscriptions/c3d3eb0c-9ba7-4d4c-828e-cb6874714034/resourceGroups/StorageRG/providers/Microsoft.DataProtection/backupVaults/contosobackupvault/backupInstances/contosoaccounting-contosoaccounting-e69dfa84-16d1-40de-9c8b-f8c0a36c602a/recoveryPoints/07f1e4db5e344d169880a1a43c270eb4",
    "name": "07f1e4db5e344d169880a1a43c270eb4",
    "properties": {
      "friendlyName": "07f1e4db5e344d169880a1a43c270eb4",
      "objectType": "AzureBackupDiscreteRecoveryPoint",
      "policyName": "testingpolicy890",
      "recoveryPointDataStoresDetails": [
        {
          "creationTime": "2024-05-08T19:31:18.8136397Z",
          "id": "c506fa1f-4a94-48a5-8fc1-eab1e9f7dabd",
          "state": "COMMITTED",
          "type": "VaultStore",
          "visible": true
        }
      ],
      "recoveryPointId": "07f1e4db5e344d169880a1a43c270eb4",
      "recoveryPointState": "Completed",
      "recoveryPointTime": "2024-05-08T19:31:18.8020266Z",
      "recoveryPointType": "Full",
      "retentionTagName": "Default",
      "retentionTagVersion": "638350187371578530"
    },
    "resourceGroup": "StorageRG",
    "type": "Microsoft.DataProtection/backupVaults/backupInstances/recoveryPoints"
  },
  {
    "id": "/subscriptions/c3d3eb0c-9ba7-4d4c-828e-cb6874714034/resourceGroups/StorageRG/providers/Microsoft.DataProtection/backupVaults/contosobackupvault/backupInstances/contosoaccounting-contosoaccounting-e69dfa84-16d1-40de-9c8b-f8c0a36c602a/recoveryPoints/0a41f6c71e614022a44843b0c34e9c64",
    "name": "0a41f6c71e614022a44843b0c34e9c64",
    "properties": {
      "friendlyName": "0a41f6c71e614022a44843b0c34e9c64",
      "objectType": "AzureBackupDiscreteRecoveryPoint",
      "policyName": "testingpolicy890",
      "recoveryPointDataStoresDetails": [
        {
          "creationTime": "2024-05-07T19:31:07.2551426Z",
          "id": "c506fa1f-4a94-48a5-8fc1-eab1e9f7dabd",
          "state": "COMMITTED",
          "type": "VaultStore",
          "visible": true
        }
      ],
      "recoveryPointId": "0a41f6c71e614022a44843b0c34e9c64",
      "recoveryPointState": "Completed",
      "recoveryPointTime": "2024-05-07T19:31:07.2540319Z",
      "recoveryPointType": "Full",
      "retentionTagName": "Default",
      "retentionTagVersion": "638350187371578530"
    },
    "resourceGroup": "StorageRG",
    "type": "Microsoft.DataProtection/backupVaults/backupInstances/recoveryPoints"
  },
  {
    "id": "/subscriptions/c3d3eb0c-9ba7-4d4c-828e-cb6874714034/resourceGroups/StorageRG/providers/Microsoft.DataProtection/backupVaults/contosobackupvault/backupInstances/contosoaccounting-contosoaccounting-e69dfa84-16d1-40de-9c8b-f8c0a36c602a/recoveryPoints/1d67915bc70b42989123e3ede0734e21",
    "name": "1d67915bc70b42989123e3ede0734e21",
    "properties": {
      "friendlyName": "1d67915bc70b42989123e3ede0734e21",
      "objectType": "AzureBackupDiscreteRecoveryPoint",
      "policyName": "testingpolicy890",
      "recoveryPointDataStoresDetails": [
        {
          "creationTime": "2024-05-06T19:31:30.1398339Z",
          "id": "c506fa1f-4a94-48a5-8fc1-eab1e9f7dabd",
          "state": "COMMITTED",
          "type": "VaultStore",
          "visible": true
        }
      ],
      "recoveryPointId": "1d67915bc70b42989123e3ede0734e21",
      "recoveryPointState": "Completed",
      "recoveryPointTime": "2024-05-06T19:31:30.1370319Z",
      "recoveryPointType": "Full",
      "retentionTagName": "Default",
      "retentionTagVersion": "638350187371578530"
    },
    "resourceGroup": "StorageRG",
    "type": "Microsoft.DataProtection/backupVaults/backupInstances/recoveryPoints"
  },
  {
    "id": "/subscriptions/c3d3eb0c-9ba7-4d4c-828e-cb6874714034/resourceGroups/StorageRG/providers/Microsoft.DataProtection/backupVaults/contosobackupvault/backupInstances/contosoaccounting-contosoaccounting-e69dfa84-16d1-40de-9c8b-f8c0a36c602a/recoveryPoints/86ea58e94b264814b9c48fec21a6bee9",
    "name": "86ea58e94b264814b9c48fec21a6bee9",
    "properties": {
      "friendlyName": "86ea58e94b264814b9c48fec21a6bee9",
      "objectType": "AzureBackupDiscreteRecoveryPoint",
      "policyName": "testingpolicy890",
      "recoveryPointDataStoresDetails": [
        {
          "creationTime": "2024-05-05T19:31:49.6877893Z",
          "id": "c506fa1f-4a94-48a5-8fc1-eab1e9f7dabd",
          "state": "COMMITTED",
          "type": "VaultStore",
          "visible": true
        }
      ],
      "recoveryPointId": "86ea58e94b264814b9c48fec21a6bee9",
      "recoveryPointState": "Completed",
      "recoveryPointTime": "2024-05-05T19:31:49.6674807Z",
      "recoveryPointType": "Full",
      "retentionTagName": "Default",
      "retentionTagVersion": "638350187371578530"
    },
    "resourceGroup": "StorageRG",
    "type": "Microsoft.DataProtection/backupVaults/backupInstances/recoveryPoints"
  },
  {
    "id": "/subscriptions/c3d3eb0c-9ba7-4d4c-828e-cb6874714034/resourceGroups/StorageRG/providers/Microsoft.DataProtection/backupVaults/contosobackupvault/backupInstances/contosoaccounting-contosoaccounting-e69dfa84-16d1-40de-9c8b-f8c0a36c602a/recoveryPoints/3d5031df19e84f2b80446950448738d0",
    "name": "3d5031df19e84f2b80446950448738d0",
    "properties": {
      "friendlyName": "3d5031df19e84f2b80446950448738d0",
      "objectType": "AzureBackupDiscreteRecoveryPoint",
      "policyName": "testingpolicy890",
      "recoveryPointDataStoresDetails": [
        {
          "creationTime": "2024-05-04T19:31:07.0919607Z",
          "id": "c506fa1f-4a94-48a5-8fc1-eab1e9f7dabd",
          "state": "COMMITTED",
          "type": "VaultStore",
          "visible": true
        }
      ],
      "recoveryPointId": "3d5031df19e84f2b80446950448738d0",
      "recoveryPointState": "Completed",
      "recoveryPointTime": "2024-05-04T19:31:07.0923263Z",
      "recoveryPointType": "Full",
      "retentionTagName": "Default",
      "retentionTagVersion": "638350187371578530"
    },
    "resourceGroup": "StorageRG",
    "type": "Microsoft.DataProtection/backupVaults/backupInstances/recoveryPoints"
  },
  {
    "id": "/subscriptions/c3d3eb0c-9ba7-4d4c-828e-cb6874714034/resourceGroups/StorageRG/providers/Microsoft.DataProtection/backupVaults/contosobackupvault/backupInstances/contosoaccounting-contosoaccounting-e69dfa84-16d1-40de-9c8b-f8c0a36c602a/recoveryPoints/31e7ab6b0db94c1eacacf8a5a4ddbf19",
    "name": "31e7ab6b0db94c1eacacf8a5a4ddbf19",
    "properties": {
      "friendlyName": "31e7ab6b0db94c1eacacf8a5a4ddbf19",
      "objectType": "AzureBackupDiscreteRecoveryPoint",
      "policyName": "testingpolicy890",
      "recoveryPointDataStoresDetails": [
        {
          "creationTime": "2024-05-03T19:30:51.2920289Z",
          "id": "c506fa1f-4a94-48a5-8fc1-eab1e9f7dabd",
          "state": "COMMITTED",
          "type": "VaultStore",
          "visible": true
        }
      ],
      "recoveryPointId": "31e7ab6b0db94c1eacacf8a5a4ddbf19",
      "recoveryPointState": "Completed",
      "recoveryPointTime": "2024-05-03T19:30:51.3135771Z",
      "recoveryPointType": "Full",
      "retentionTagName": "Default",
      "retentionTagVersion": "638350187371578530"
    },
    "resourceGroup": "StorageRG",
    "type": "Microsoft.DataProtection/backupVaults/backupInstances/recoveryPoints"
  }
]

```

---

## Prepare the restore request

**Choose a backup tier**:

# [Operational backup](#tab/operational-backup)
Once you fix the point-in-time to restore, there are multiple options to restore.

### Restore all the blobs to a point-in-time

You can restore all block blobs in the storage account by rolling them back to the selected point in time. Storage accounts containing large amounts of data or witnessing a high churn may take longer times to restore. To restore all block blobs, use the [az dataprotection backup-instance restore initialize-for-data-recovery](/cli/azure/dataprotection/backup-instance/restore#az-dataprotection-backup-instance-restore-initialize-for-data-recovery) command. The restore location and the target resource ID will be the same as the protected storage account.

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

### Restore selected containers

You can browse and select up to 10 containers to restore. To restore selected containers, use the [az dataprotection backup-instance restore initialize-for-item-recovery](/cli/azure/dataprotection/backup-instance/restore#az-dataprotection-backup-instance-restore-initialize-for-item-recovery) command.

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

### Restore containers using a prefix match

You can restore a subset of blobs using a prefix match. You can specify up to 10 lexicographical ranges of blobs within a single container or across multiple containers to return those blobs to their previous state at a given point-in-time. Here are a few things to keep in mind:

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

# [Vaulted backup (preview)](#tab/vaulted-backup)

Prepare the request body for the following restore scenarios supported by Azure Blobs vaulted backup (preview).

### Restore all containers

To restore all the containers of a recovery point, use the `az dataprotection backup-instance restore initialize-for-data-recovery` command.

```azurecli-interactive
az dataprotection backup-instance restore initialize-for-data-recovery --datasource-type AzureBlob --restore-location EastUS --source-datastore VaultStore --target-resource-id /subscriptions/xxxxxxxx /resourceGroups/StorageRG/providers/Microsoft.Storage/storageAccounts/contosohr --recovery-point-id 31e7ab6b0db94c1eacacf8a5a4ddbf19
```

### Restore specific containers

To restore specific containers from a recovery point, use the `az dataprotection backup-instance restore initialize-for-item-recovery` command.

```azurecli-interactive
az dataprotection backup-instance restore initialize-for-item-recovery --datasource-type AzureBlob --restore-location EastUS --source-datastore VaultStore --target-resource-id /subscriptions/xxxxxxxx /resourceGroups/StorageRG/providers/Microsoft.Storage/storageAccounts/contosohr --recovery-point-id 31e7ab6b0db94c1eacacf8a5a4ddbf19 –container-list container1 container2 container3
```

### Restore specific blobs within a container

Prepare a JSON file with the details of the containers and the prefixes you want to restore within each container.

```azurecli-interactive

{
  "containers": [
    {"name": "container1", "prefixmatch": ["aa", "bb", "cc""]},
    {"name": "container2", "prefixmatch": ["dd", "ee", "ff"]}
  ]
}
```

Run the `az dataprotection backup-instance restore initialize-for-item-recovery` command with the JSON (container_prefix.json) you created previously.

```azurecli-interactive
az dataprotection backup-instance restore initialize-for-item-recovery --datasource-type AzureBlob --restore-location EastUS --source-datastore VaultStore --target-resource-id /subscriptions/xxxxxxxx /resourceGroups/StorageRG/providers/Microsoft.Storage/storageAccounts/contosohr --recovery-point-id 31e7ab6b0db94c1eacacf8a5a4ddbf19 --vaulted-blob-prefix-pattern .\container_prefix.json
```

---

## Trigger the restore

Use the [az dataprotection backup-instance restore trigger](/cli/azure/dataprotection/backup-instance/restore#az-dataprotection-backup-instance-restore-trigger) command to trigger the restore with the request prepared above.

```azurecli-interactive
az dataprotection backup-instance restore trigger -g testBkpVaultRG --vault-name TestBkpVault --backup-instance-name CLITestSA-CLITestSA-c3a2a98c-def8-44db-bd1d-ff6bc86ed036 --restore-request-object restore.json
```

## Track a job

You can track all the jobs using the [az dataprotection job list](/cli/azure/dataprotection/job#az-dataprotection-job-list) command. You can list all jobs and fetch a particular job detail.

You can also use Az.ResourceGraph to track all jobs across all Backup vaults. Use the [az dataprotection job list-from-resourcegraph](/cli/azure/dataprotection/job#az-dataprotection-job-list-from-resourcegraph) command to get the relevant job which can be across any Backup vault.

```azurecli-interactive
az dataprotection job list-from-resourcegraph --datasource-type AzureBlob --operation Restore
```

## Next steps

[Support matrix for Azure Blobs backup](blob-backup-support-matrix.md)
