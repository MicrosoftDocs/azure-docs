---
title: Create backup policies for blobs using data protection REST API
description: In this article, you'll learn how to create and manage backup policies for blobs using REST API.
ms.topic: conceptual
ms.date: 07/09/2021
ms.assetid: 472d6a4f-7914-454b-b8e4-062e8b556de3
---
# Create Azure Data Protection backup policies for blobs using REST API

> [!IMPORTANT]
> Read [this section](blob-backup-configure-manage.md#before-you-start) before proceeding to create the policy and configuring backups for Azure blobs.

A backup policy typically governs the retention and schedule of your backups. Since operational backup for blobs is continuous in nature, you don't need a schedule to perform backups. The policy is essentially needed to specify the retention period. You can reuse the backup policy to configure backup for multiple storage accounts to a vault.

>[!NOTE]
>Restoring over long durations may lead to restore operations taking longer to complete. Furthermore, the time that it takes to restore a set of data is based on the number of write and delete operations made during the restore period. For example, an account with one million objects with 3,000 objects added per day and 1,000 objects deleted per day will require approximately two hours to restore to a point 30 days in the past. A retention period and restoration more than 90 days in the past would not be recommended for an account with this rate of change.

The steps to create a backup policy for an Azure Recovery Services vault are outlined in the policy [REST API document](/rest/api/dataprotection/backup-policies/create-or-update). Let's use this document as a reference to create a policy for blobs in a storage account.

## Create a policy

> [!IMPORTANT]
> Currently, we do not support updating or modifying an existing policy. An alternative is to create a new policy with the required details and assign it to the relevant backup instance.

To create an Azure Backup policy, use the following *PUT* operation

```http
PUT https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/backupVaults/{vaultName}/backupPolicies/{policyName}?api-version=2021-01-01
```

The `{policyName}` and `{vaultName}` are provided in the URI. Additional information is provided in the request body.

## Create the request body

For example, to create a policy for Blob backup, following are the components of the request body.

|Name  |Required  |Type  |Description  |
|---------|---------|---------|---------|
|properties     |   True      |  BaseBackupPolicy:[BackupPolicy](/rest/api/dataprotection/backup-policies/create-or-update#backuppolicy)      | BaseBackupPolicyResource properties        |

For the complete list of definitions in the request body, refer to the [backup policy REST API document](/rest/api/dataprotection/backup-policies/create-or-update).

### Example request body

The following request body defines a backup policy for blob backups.

The policy says:

- Retention period is 30 days.
- Datastore is 'operational store' since the backups are local and no data is stored in the Backup vault.

```json
{
  "properties": {
    "datasourceTypes": [
      "Microsoft.Storage/storageAccounts/blobServices"
    ],
    "objectType": "BackupPolicy",
    "policyRules": [
      {
        "name": "Default",
        "objectType": "AzureRetentionRule",
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
        ]
      }
    ]
  }
}
```

> [!IMPORTANT]
> The time formats for support only DateTime. They don't support Time format alone.

## Responses

The backup policy creation/update is a synchronous operation and returns OK once the operation is successful.

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |     [BaseBackupPolicyResource](/rest/api/dataprotection/backup-policies/create-or-update#basebackuppolicyresource)     |  OK       |

### Example responses

Once the operation completes, it returns 200 (OK) with the policy content in the response body.

```json
{
  "id": "/subscriptions/xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups//TestBkpVaultRG/providers/Microsoft.RecoveryServices/vaults/testBkpVault/backupPolicies/TestBlobPolicy",
  "name": "TestBlobPolicy",
  "type": "Microsoft.DataProtection/backupVaults/backupPolicies",
  "properties": {
    "policyRules": [
      {
        "lifecycles": [
          {
            "deleteAfter": {
              "objectType": "AbsoluteDeleteOption",
              "duration": "P30D"
            },
            "sourceDataStore": {
              "dataStoreType": "OperationalStore",
              "objectType": "DataStoreInfoBase"
            }
          }
        ],
        "isDefault": true,
        "name": "Default",
        "objectType": "AzureRetentionRule"
      }
    ],
    "datasourceTypes": [
      "Microsoft.Storage/storageAccounts/blobServices"
    ],
    "objectType": "BackupPolicy"
  }
}
```

## Next steps

Enable protection for blobs in a storage account.

For more information on the Azure Backup REST APIs, see the following documents:

- [Azure Data Protection REST API](/rest/api/dataprotection/)
- [Get started with Azure REST API](/rest/api/azure/)
