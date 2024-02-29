---
title: Create Azure Backup policies for blobs using data protection REST API
description: In this article, you'll learn how to create and manage backup policies for blobs using REST API.
ms.topic: how-to
ms.date: 10/28/2022
ms.assetid: 472d6a4f-7914-454b-b8e4-062e8b556de3
ms.service: backup
ms.custom: engagement-fy23
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Create Azure Data Protection backup policies for blobs using REST API

Azure Backup policy typically governs the retention and schedule of your backups. As operational backup for blobs is continuous in nature, you don't need a schedule to perform backups. The policy is essentially needed to specify the retention period. You can reuse the backup policy to configure backup for multiple storage accounts to a vault.

> [!IMPORTANT]
> Before you proceed to create the policy and configure backups for Azure blobs, see [this section](blob-backup-configure-manage.md#before-you-start).

This article describes how to create a policy for blobs in a storage account. Learn about [the process to create a backup policy for an Azure Recovery Services vault using REST API](/rest/api/dataprotection/backup-policies/create-or-update).

>[!NOTE]
>Restoring over long durations may lead to restore operations taking longer to complete. Further, the time that it takes to restore a set of data is based on the number of write and delete operations made during the restore period.
>For example, an account with one million objects with 3,000 objects added per day and 1,000 objects deleted per day will require approximately two hours to restore to a point 30 days in the past. A retention period and restoration more than 90 days in the past would not be recommended for an account with this rate of change.

In this article, you'll learn about:

> [!div class="checklist"]
> - Create a policy
> - Create the request body
> - Responses

## Create a policy

To create an Azure Backup policy, use the following *PUT* operation:

```http
PUT https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/backupVaults/{vaultName}/backupPolicies/{policyName}?api-version=2021-01-01
```

The `{policyName}` and `{vaultName}` are provided in the URI. You can find additional information the request body.

> [!IMPORTANT]
> Currently, we don't support updating or modifying an existing policy. So, you can create a new policy with the required details and assign it to the relevant backup instance.

## Create the request body

For example, to create a policy for Blob backup, use the following component of the request body:

|Name  |Required  |Type  |Description  |
|---------|---------|---------|---------|
|`properties`     |   True      |  BaseBackupPolicy:[BackupPolicy](/rest/api/dataprotection/backup-policies/create-or-update#backuppolicy)      | BaseBackupPolicyResource properties        |

For the complete list of definitions in the request body, see the [backup policy REST API document](/rest/api/dataprotection/backup-policies/create-or-update).

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
> The supported time formats is *DateTime* only. They don't support *Time* format alone.

## Responses

The backup policy creation/update is an asynchronous operation and returns *OK* once the operation is successful.

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
