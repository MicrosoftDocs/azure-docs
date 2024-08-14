---
author: AbhishekMallick-MS
ms.service: backup
ms.topic: include
ms.date: 05/30/2024
ms.author: v-abhmallick
---

Once all the relevant permissions are set, configure the blob backup by running the following commands: 

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
> Once a storage account is configured for blobs backup, a few capabilities, such as change feed and delete lock are affected. [Learn more](../articles/backup/blob-backup-configure-manage.md?tabs=vaulted-backup#effects-on-backed-up-storage-accounts).
