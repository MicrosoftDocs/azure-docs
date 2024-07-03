---
author: AbhishekMallick-MS
ms.service: backup
ms.topic: include
ms.date: 05/30/2024
ms.author: v-abhmallick
---

### Fetch the relevant recovery point

To list all the available recovery points for a backup instance, use the list recovery points API.

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/backupVaults/{vaultName}/backupInstances/{backupInstanceName}/recoveryPoints?api-version=2021-07-01
```

### Prepare the request body to perform restore from vaulted backup.

Following is the request body to restore container bash 2 from a vaulted backup.

```http
{
  "objectType": "AzureBackupRecoveryPointBasedRestoreRequest",
  "sourceDataStoreType": "VaultStore",
  "restoreTargetInfo": {
    "objectType": "itemLevelRestoreTargetInfo",
    "recoveryOption": "FailIfExists",
    "dataSourceInfo": {
      "objectType": "Datasource",
      "resourceID": "/subscriptions/495944b2-66b7-4173-8824-77043bb269be/resourceGroups/Blob-Backup/providers/Microsoft.Storage/storageAccounts/azclitestrestore2",
      "resourceName": "azclitestrestore2",
      "resourceType": "Microsoft.Storage/storageAccounts",
      "resourceLocation": "not specified",
      "resourceUri": "/subscriptions/495944b2-66b7-4173-8824-77043bb269be/resourceGroups/Blob-Backup/providers/Microsoft.Storage/storageAccounts/azclitestrestore2",
      "datasourceType": "Microsoft.Storage/storageAccounts/blobServices",
      "resourceProperties": {}
    },
    "restoreCriteria": [
      {
        "objectType": "ItemPathBasedRestoreCriteria",
        "itemPath": "bash2",
        "isPathRelativeToBackupItem": true,
        "subItemPathPrefix": null
      }
    ],
    "restoreLocation": "eastus2euap"
  },
  "recoveryPointId": "33fdef0e0e2e4594b63092ae9a56f58d"
}
```

If you want to restore blobs with specific prefixes, provide the list of prefixes as value for **subItemPathPrefix**. Here's an example to restore blobs starting with prefixes dd, ee, or ff in container2 of your backed-up storage account.

```http
   {
        "is_path_relative_to_backup_item": true,
        "item_path": "container2",
        "object_type": "ItemPathBasedRestoreCriteria",
        "sub_item_path_prefix": [
          "dd",
          "ee",
          "ff"
        ]
      }
```
