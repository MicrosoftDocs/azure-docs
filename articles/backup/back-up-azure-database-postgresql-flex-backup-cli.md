---
title: Back up Azure Database for PostgreSQL - Flexible Server using Azure CLI
description: Learn how to back up Azure Database for PostgreSQL - Flexible Server using Azure CLI.
ms.topic: how-to
ms.date: 02/28/2025
ms.custom: devx-track-azurecli, ignite-2024
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
# Customer intent: "As a database administrator, I want to back up Azure Database for PostgreSQL - Flexible Server using Azure CLI, so that I can ensure data protection and recovery options for my database workloads."
---

# Back up Azure Database for PostgreSQL - Flexible Server using Azure CLI

This article describes how to back up Azure Database for PostgreSQL - Flexible Server using Azure CLI.

## Prerequisites

Before you back up Azure Database for PostgreSQL - Flexible Server, review the [supported scenarios and limitations for backing up Azure Database for PostgreSQL - Flexible Servers](backup-azure-database-postgresql-flex-support-matrix.md).

## Create a Backup vault

Backup vault is a storage entity in Azure. This stores the backup data for new workloads that Azure Backup supports. For example, Azure Database for PostgreSQL – Flexible servers, blobs in a storage account, and Azure Disks. Backup vaults help to organize your backup data, while minimizing management overhead. Backup vaults are based on the Azure Resource Manager model of Azure, which provides enhanced capabilities to help secure backup data.

Before you create a Backup vault, choose the storage redundancy of the data within the vault. Then proceed to create the Backup vault with that storage redundancy and the location.


In this article, let's create a Backup vault `TestBkpVault`, in the region `westus`, under the resource group `testBkpVaultRG`. Use the [`az dataprotection vault create`](/cli/azure/dataprotection/backup-vault?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-vault-create) command to create a Backup vault. Learn more about [creating a Backup vault](create-manage-backup-vault.md#create-a-backup-vault).

```azurecli
az dataprotection backup-vault create -g testBkpVaultRG --vault-name TestBkpVault -l westus --type SystemAssigned --storage-settings datastore-type="VaultStore" type="LocallyRedundant"

{
  "eTag": null,
  "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/testBkpVaultRG/providers/Microsoft.DataProtection/BackupVaults/TestBkpVault",
  "identity": {
    "principalId": "aaaaaaaa-bbbb-cccc-1111-222222222222",
    "tenantId": "aaaabbbb-0000-cccc-1111-dddd2222eeee",
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

## Configure backup

Before you configure protection for the database, ensure that you [create a Backup policy](quick-backup-postgresql-flexible-server-cli.md#create-a-backup-policy). Once the vault and policy are created, protect the Azure Database for PostgreSQL - Flexible Server by following these steps:

- Fetch the ARM ID of the PostgreSQL - Flexible Server to be protected
- Grant access to the Backup vault
- Prepare the backup configuration request

### Fetch the ARM ID of the PostgreSQL - Flexible Server to be protected

Fetch the Azure Resource Manager ID (ARM ID) of PostgreSQL – Flexible Server to be protected. This ID serves as the identifier of the database. Let's use an example of a database named `empdb11` under a PostgreSQL - Flexible Server `testposgresql`, which is present in the resource group `ossrg` under a different subscription.

The following example uses bash.

```azurecli
ossId="/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/ossrg/providers/Microsoft.DBforPostgreSQL/flexibleServers/archive-postgresql-ccy/databases/empdb11"

```

### Grant access to the Backup vault

Backup vault has to connect to the PostgreSQL – Flexible Server, and then access the database via the keys present in the key vault. So, it requires access to the PostgreSQL – Flexible server and the key vault. Grant access to the Backup vault's Managed-Service Identity (MSI).

Check the [permissions](backup-azure-database-postgresql-flex-overview.md#permissions-for-backup) required for the Backup vault's Managed-Service Identity (MSI) on the PostgreSQL – Flexible Server and Azure Key vault that stores keys to the database.

### Prepare the backup configuration request

Once all the relevant permissions are set, configure the backup by running the following commands:

1. Prepare the relevant request by using the relevant vault, policy, PostgreSQL – Flexible server database using the [`az dataprotection backup-instance initialize`](/cli/azure/dataprotection/backup-instance?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-instance-initialize) command.

    ```azurecli-interactive
    az dataprotection backup-instance initialize --datasource-id $ossId --datasource-type AzureDatabaseForPostgreSQLFlexibleServer -l <vault-location> --policy-id <policy_arm_id>  --secret-store-type AzureKeyVault --secret-store-uri $keyURI > OSSBkpInstance.JSON
    ```

1. Submit the request to protect the database using the [`az dataprotection backup-instance create`](/cli/azure/dataprotection/backup-instance?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-instance-create) command.

    ```azurecli-interactive
    az dataprotection backup-instance create --resource-group testBkpVaultRG --vault-name TestBkpVault TestBkpvault --backup-instance .\OSSBkpInstance.JSON
    ```

## Run an on-demand backup

Specify a retention rule while you trigger backup. To view the retention rules in policy, go to the **policy JSON** file for retention rules. In the following example, there are two retention rules with names **Default** and **Monthly**. Let's use the **Monthly rule** for the on-demand backup.

```azurecli
az dataprotection backup-policy show  -g ossdemorg --vault-name ossdemovault-1 --subscription e3d2d341-4ddb-4c5d-9121-69b7e719485e --name osspol5

{
  "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e-69b7e719485e/resourceGroups/ossdemorg/providers/Microsoft.DataProtection/backupVaults/ossdemovault-1/backupPolicies/osspol5",
  "name": "osspol5",
  "properties": {
    "datasourceTypes": [
      " Microsoft.DBforPostgreSQL/flexibleServers/databases" 
    ],
    "objectType": "BackupPolicy",
    "policyRules": [
      {
        "backupParameters": {
          "backupType": "Full",
          "objectType": "AzureBackupParams"
        },
        "dataStore": {
          "dataStoreType": "VaultStore",
          "objectType": "DataStoreInfoBase"
        },
        "name": "BackupWeekly",
        "objectType": "AzureBackupRule",
        "trigger": {
          "objectType": "ScheduleBasedTriggerContext",
          "schedule": {
            "repeatingTimeIntervals": [
              "R/2020-04-04T20:00:00+00:00/P1W",
              "R/2020-04-01T20:00:00+00:00/P1W"
            ],
            "timeZone": "UTC"
          },
          "taggingCriteria": [
            {
              "criteria": [
                {
                  "absoluteCriteria": [
                    "FirstOfMonth"
                  ],
                  "daysOfMonth": null,
                  "daysOfTheWeek": null,
                  "monthsOfYear": null,
                  "objectType": "ScheduleBasedBackupCriteria",
                  "scheduleTimes": null,
                  "weeksOfTheMonth": null
                }
              ],
              "isDefault": false,
              "tagInfo": {
                "eTag": null,
                "id": "Monthly_",
                "tagName": "Monthly"
              },
              "taggingPriority": 15
            },
            {
              "criteria": null,
              "isDefault": true,
              "tagInfo": {
                "eTag": null,
                "id": "Default_",
                "tagName": "Default"
              },
              "taggingPriority": 99
            }
          ]
        }
      },
      {
        "isDefault": false,
        "lifecycles": [
          {
            "deleteAfter": {
              "duration": "P10Y",
              "objectType": "AbsoluteDeleteOption"
            },
            "sourceDataStore": {
              "dataStoreType": "VaultStore",
              "objectType": "DataStoreInfoBase"
            },
            "targetDataStoreCopySettings": []
          }
        ],
        "name": "Monthly",
        "objectType": "AzureRetentionRule"
      },
      {
        "isDefault": true,
        "lifecycles": [
          {
            "deleteAfter": {
              "duration": "P1Y",
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
      }
    ]
  },
  "resourceGroup": "ossdemorg",
  "systemData": null,
  "type": "Microsoft.DataProtection/backupVaults/backupPolicies"
}

```

To trigger an on-demand backup, use the [`az dataprotection backup-instance adhoc-backup`](/cli/azure/dataprotection/backup-instance?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-instance-adhoc-backup) command.

```azurecli
az dataprotection backup-instance adhoc-backup --name "ossrg-empdb11" --rule-name "Monthly" --resource-group testBkpVaultRG --vault-name TestBkpVault
```

## Track jobs

Track all jobs using the [`az dataprotection job list`](/cli/azure/dataprotection/job?view=azure-cli-latest&preserve-view=true#az-dataprotection-job-list) command. You can list all jobs and fetch a particular job detail.

You can also use Az.ResourceGraph to track all jobs across all Backup vaults. Use the [`az dataprotection job list-from-resourcegraph`](/cli/azure/dataprotection/job?view=azure-cli-latest&preserve-view=true#az-dataprotection-job-list-from-resourcegraph) command to fetch the relevant jobs that are across Backup vaults.

```azurecli
az dataprotection job list-from-resourcegraph --datasource-type AzureDatabaseForPostgreSQLFlexibleServer --status Completed
```

## Next steps

- [Restore Azure Database for PostgreSQL - Flexible Server using Azure CLI](backup-azure-database-postgresql-flex-restore-cli.md).
