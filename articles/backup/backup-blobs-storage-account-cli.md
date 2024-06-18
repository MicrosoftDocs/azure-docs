---
title: Back up Azure Blobs using Azure CLI
description: Learn how to back up Azure Blobs using Azure CLI.
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 05/30/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up Azure Blobs in a storage account using Azure CLI

This article describes how to back up [Azure Blobs](./blob-backup-overview.md) using Azure CLI. You can now perform [operational](blob-backup-overview.md?tabs=operational-backup) and [vaulted](blob-backup-overview.md?tabs=vaulted-backup) backups to protect block blobs in your storage accounts using Azure Backup.

For information on the Azure Blobs regions availability, supported scenarios, and limitations, see the [support matrix](blob-backup-support-matrix.md).

## Before you start

See the [prerequisites](./blob-backup-configure-manage.md#before-you-start) and [support matrix](./blob-backup-support-matrix.md) before you get started.

## Create a Backup vault

Backup vault is a storage entity in Azure that stores backup data for various newer workloads that Azure Backup supports, such as Azure Database for PostgreSQL servers, and blobs in a storage account and Azure Disks. Backup vaults make it easy to organize your backup data, while minimizing management overhead. Backup vaults are based on the Azure Resource Manager model of Azure, which provides enhanced capabilities to help secure backup data.

Before creating a Backup vault, choose the storage redundancy of the data within the vault. Then proceed to create the Backup vault with that storage redundancy and the location. In this article, we'll create a Backup vault _TestBkpVault_, in the region _westus_, under the resource group _testBkpVaultRG_. Use the [az dataprotection vault create](/cli/azure/dataprotection/backup-vault#az-dataprotection-backup-vault-create) command to create a Backup vault. Learn more about [creating a Backup vault](./create-manage-backup-vault.md#create-a-backup-vault).

```azurecli-interactive
az dataprotection backup-vault create -g testBkpVaultRG --vault-name TestBkpVault -l westus --type SystemAssigned --storage-settings datastore-type="VaultStore" type="LocallyRedundant"

{
  "eTag": null,
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/testBkpVaultRG/providers/Microsoft.DataProtection/BackupVaults/TestBkpVault",
  "identity": {
    "principalId": "2ca1d5f7-38b3-4b61-aa45-8147d7e0edbc",
    "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "type": "SystemAssigned"
  },
  "location": "westus",
  "name": "TestBkpVault",
  "properties": {
    "provisioningState": "Succeeded",
    "storageSettings": [
      {
        "datastoreType": "VaultStore",
        "type": "LocallyRedundant"
      }
    ]
  },
  "resourceGroup": "testBkpVaultRG",
  "systemData": null,
  "tags": null,
  "type": "Microsoft.DataProtection/backupVaults"
}
```

> [!IMPORTANT]
> Though you'll see the Backup storage redundancy of the vault, the redundancy doesn't apply to the operational backup of blobs. This is because the backup is local in nature and no data is stored in the Backup vault. Here, the Backup vault is the management entity to help you manage the protection of block blobs in your storage accounts.

After creating a vault, let's create a Backup policy to protect Azure Blobs in a storage account.

## Create a backup policy

You can create a backup policy for *operational backup* and *vaulted backup (preview)* for Azure Blobs using Azure CLI.

**Choose a backup tier**:

# [Operational backup](#tab/operational-backup)

Before creating the policy and configuring backups for Azure Blobs, see the [prerequisites](blob-backup-configure-manage.md#before-you-start).

To understand the inner components of a Backup policy for Azure Blobs backup, retrieve the policy template using the [az dataprotection backup-policy get-default-policy-template](/cli/azure/dataprotection/backup-policy#az-dataprotection-backup-policy-get-default-policy-template) command. This command returns a default policy template for a given datasource type. Use this policy template to create a new policy.

```azurecli-interactive
az dataprotection backup-policy get-default-policy-template --datasource-type AzureBlob

{
  "datasourceTypes": [
    "Microsoft.Storage/storageAccounts/blobServices"
  ],
  "name": "BlobPolicy1",
  "objectType": "BackupPolicy",
  "policyRules": [
    {
      "isDefault": true,
      "lifecycles": [
        {
          "deleteAfter": {
            "duration": "P30D",
            "objectType": "AbsoluteDeleteOption"
          },
          "sourceDataStore": {
            "dataStoreType": "OperationalStore",
            "objectType": "DataStoreInfoBase"
          }
        }
      ],
      "name": "Default",
      "objectType": "AzureRetentionRule"
    }
  ]
}

```

The policy template consists of a lifecycle only (which decides when to delete/copy/move the backup). As operational backup for blobs is continuous in nature, you don't need a schedule to perform backups.

```json
"policyRules": [
    {
      "isDefault": true,
      "lifecycles": [
        {
          "deleteAfter": {
            "duration": "P30D",
            "objectType": "AbsoluteDeleteOption"
          },
          "sourceDataStore": {
            "dataStoreType": "OperationalStore",
            "objectType": "DataStoreInfoBase"
          }
        }
      ],
      "name": "Default",
      "objectType": "AzureRetentionRule"
    }
  ]
```

> [!NOTE]
> Restoring over long durations may lead to restore operations taking longer to complete. Also, the time taken to restore a set of data is based on the number of write and delete operations made during the restore period. For example, an account with one million objects with 3,000 objects added per day and 1,000 objects deleted per day will require approximately two hours to restore to a point 30 days in the past.<br><br>We don't recommend a retention period and restoration more than 90 days in the past for an account with this rate of change.

Once the policy JSON has all the required values, proceed to create a new policy from the policy object using the [az dataprotection backup-policy create](/cli/azure/dataprotection/backup-policy#az-dataprotection-backup-policy-create) command.

```azurecli-interactive
az dataprotection backup-policy get-default-policy-template --datasource-type AzureBlob > policy.json
az dataprotection backup-policy create -g testBkpVaultRG --vault-name TestBkpVault -n BlobBackup-Policy --policy policy.json

{
    "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault/backupPolicies/BlobBackup-Policy",
    "name": "BlobBackup-Policy",
    "properties": {
      "datasourceTypes": [
        "Microsoft.Storage/storageAccounts/blobServices"
      ],
      "objectType": "BackupPolicy",
      "policyRules": [
        {
          "isDefault": true,
          "lifecycles": [
            {
              "deleteAfter": {
                "duration": "P2D",
                "objectType": "AbsoluteDeleteOption"
              },
              "sourceDataStore": {
                "dataStoreType": "OperationalStore",
                "objectType": "DataStoreInfoBase"
              },
              "targetDataStoreCopySettings": []
            }
          ],
          "name": "Default",
          "objectType": "AzureRetentionRule"
        }
      ]
    },
    "resourceGroup": "testBkpVaultRG",
    "systemData": null,
    "type": "Microsoft.DataProtection/backupVaults/backupPolicies"
  }
```

# [Vaulted backup (preview)](#tab/vaulted-backup)

[!INCLUDE [blob-backup-create-policy-cli.md](../../includes/blob-backup-create-policy-cli.md)]

---

## Configure backup

[!INCLUDE [blob-backup-configure-policy-cli.md](../../includes/blob-backup-configure-policy-cli.md)]

### Prepare the request to configure blob backup

Once all the relevant permissions are set, configure the backup by running the following commands:

1. Prepare the relevant request by using the relevant vault, policy, storage account using the [az dataprotection backup-instance initialize](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-initialize) command. 

    ```azurecli-interactive
    az dataprotection backup-instance initialize --datasource-type AzureBlob  -l southeastasia --policy-id "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault/backupPolicies/BlobBackup-Policy" --datasource-id "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/blobrg/providers/Microsoft.Storage/storageAccounts/CLITestSA" > backup_instance.json
    ```

2. Submit the request using the [az dataprotection backup-instance create](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-create) command.

    ```azurecli-interactive
    az dataprotection backup-instance create -g testBkpVaultRG --vault-name TestBkpVault --backup-instance backup_instance.json

    {
        "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault/backupInstances/CLITestSA-CLITestSA-c3a2a98c-def8-44db-bd1d-ff6bc86ed036",
        "name": "CLITestSA-CLITestSA-c3a2a98c-def8-44db-bd1d-ff6bc86ed036",
        "properties": {
          "currentProtectionState": "ProtectionConfigured",
          "dataSourceInfo": {
            "datasourceType": "Microsoft.Storage/storageAccounts/blobServices",
            "objectType": "Datasource",
            "resourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/blobrg/providers/Microsoft.Storage/storageAccounts/CLITestSA",
            "resourceLocation": "southeastasia",
            "resourceName": "CLITestSA",
            "resourceType": "Microsoft.Storage/storageAccounts",
            "resourceUri": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/blobrg/providers/Microsoft.Storage/storageAccounts/CLITestSA"
          },
          "dataSourceSetInfo": null,
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
        "resourceGroup": "testBkpVaultRG",
        "systemData": null,
        "type": "Microsoft.DataProtection/backupVaults/backupInstances"
      }
    ```

> [!IMPORTANT]
> Once a storage account is configured for blobs backup, a few capabilities such as change feed and delete lock are affected. [Learn more](blob-backup-configure-manage.md#effects-on-backed-up-storage-accounts).

## Next steps

[Restore Azure Blobs using Azure CLI](restore-blobs-storage-account-cli.md)
