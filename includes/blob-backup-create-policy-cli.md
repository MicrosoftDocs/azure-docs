---
author: AbhishekMallick-MS
ms.service: backup
ms.topic: include
ms.date: 05/30/2024
ms.author: v-abhmallick
---

To create a backup policy for blob vaulted backup, run the following commands:

1. To understand the inner components of a Backup policy for Azure Blobs backup, retrieve the policy template using the `az dataprotection backup-policy get-default-policy-template` command.

    This command returns a default policy template for a given datasource type. Use this policy template to create a new policy.

2. Once you have saved the policy JSON with  all the required values, proceed to create a new policy from the policy object using the `az dataprotection backup-policy create` command.

   ```azurecli-interactive
   Az dataprotection backup-policy create -g testBkpVaultRG –vault-name TestBkpVault -n BlobBackup-Policy –policy policy.json
   ```

   The following JSON is to configure a policy with *30 days retention* for *operational backup* and *30 days default retention* for *vaulted backup*. The vaulted backup is scheduled every day at *7:30 UTC*.

    ```json
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
              },
              "targetDataStoreCopySettings": []
            }
          ],
          "name": "Default",
          "objectType": "AzureRetentionRule"
        },
        {
          "isDefault": true,
          "lifecycles": [
            {
              "deleteAfter": {
                "duration": "P30D",
                "objectType": "AbsoluteDeleteOption"
              },
              "sourceDataStore": {
                "dataStoreType": "VaultStore",
                "objectType": "DataStoreInfoBase"
              },
              "targetDataStoreCopySettings": []
            }
          ],
          "name": "Default",
          "objectType": "AzureRetentionRule"
        },
        {
          "backupParameters": {
            "backupType": "Discrete",
            "objectType": "AzureBackupParams"
          },
          "dataStore": {
            "dataStoreType": "VaultStore",
            "objectType": "DataStoreInfoBase"
          },
          "name": "BackupDaily",
          "objectType": "AzureBackupRule",
          "trigger": {
            "objectType": "ScheduleBasedTriggerContext",
            "schedule": {
              "repeatingTimeIntervals": [
                "R/2023-06-28T07:30:00+00:00/P1D"
              ],
              "timeZone": "UTC"
            },
            "taggingCriteria": [
              {
                "isDefault": true,
                "tagInfo": {
                  "id": "Default_",
                  "tagName": "Default"
                },
                "taggingPriority": 93
              }
            ]
          }
        }
      ]
    }

    ```