---
author: AbhishekMallick-MS
ms.service: azure-backup
ms.topic: include
ms.date: 07/02/2024
ms.author: v-abhmallick
---

Once all the relevant permissions are set, configure the blob backup by running the following commands: 

1. Prepare the relevant request by using the relevant vault, policy, storage account using the [az dataprotection backup-instance initialize](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-initialize) command. 


    ```azurecli-interactive
    az dataprotection backup-instance initialize --datasource-type AzureBlob  -l southeastasia --policy-id "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault/backupPolicies/BlobBackup-Policy" --datasource-id "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/blobrg/providers/Microsoft.Storage/storageAccounts/CLITestSA" > backup_instance.json
    ```

2. Submit the request using the [az dataprotection backup-instance create](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-create) command.
 
    ```azurecli-interactive
    az dataprotection backup-instance create -g testBkpVaultRG --vault-name TestBkpVault --backup-instance backup_instance.json

    The following JSON configures a blob backup for a specified storage account with specified policy and container list.
    {
      "backup_instance_name": "sample-backup-instance",
      "properties": {
        "data_source_info": {
          "datasource_type": "Microsoft.Storage/storageAccounts/blobServices",
          "object_type": "BlobBackupDatasourceParameters",
          "resource_id": "/subscriptions//resourceGroups//providers/Microsoft.Storage/storageAccounts/",
          "resource_location": "",
          "resource_name": "",
          "resource_type": "Microsoft.Storage/storageAccounts",
          "resource_uri": "/subscriptions//resourceGroups//providers/Microsoft.Storage/storageAccounts/"
        },
        "data_source_set_info": null,
        "datasource_auth_credentials": null,
        "friendly_name": "",
        "object_type": "BackupInstance",
        "policy_info": {
          "policyId": "/subscriptions//resourceGroups//providers/Microsoft.DataProtection/backupVaults//backupPolicies/",
          "policyParameters": {
            "backupDatasourceParametersList": [
              {
                "objectType": "BlobBackupDatasourceParameters",
                "containersList": [
                  ""
                ]
              }
            ]
          }
        }
      }
    }


    {

    "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault/backupInstances/CLITestSA-CLITestSA-aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e", "name": "CLITestSA-CLITestSA-aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e", "properties":

    ```


> [!IMPORTANT]
> Once a storage account is configured for blobs backup, a few capabilities, such as change feed and delete lock are affected. [Learn more](../articles/backup/blob-backup-configure-manage.md?tabs=vaulted-backup#effects-on-backed-up-storage-accounts).
