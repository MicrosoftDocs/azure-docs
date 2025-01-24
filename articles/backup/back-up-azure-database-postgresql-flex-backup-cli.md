---
title: Back up Azure Database for PostgreSQL - flexible Server using Azure CLI
description: Learn how to back up Azure Database for PostgreSQL - flexible Server using Azure CLI.
ms.topic: how-to
ms.date: 02/17/2025
ms.custom: devx-track-azurecli, ignite-2024
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Back up Azure Database for PostgreSQL - Flexible Server using Azure CLI

This article describes how to back up **Azure Database for PostgreSQL - Flexible Server** using Azure CLI.
Learn about the [supported scenarios and limitations for Azure Database for PostgreSQL - Flexible Server backup](backup-azure-database-postgresql-flex-support-matrix.md).

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

## Create a Backup policy

After the vault is created, let's create a Backup policy to protect Azure PostgreSQL – Flexible Server.

### Understand PostGreSQL backup policy

Disk backup offers multiple backups per day, and blob backup is a continuous backup with no trigger. Now, let's understand the backup policy object for PostgreSQL – Flexible Server.

- PolicyRule
  - BackupRule
    - BackupParameter
        - BackupType (A full database backup in this scenario)
        - Initial Datastore (Where the backups should land initially)
        - Trigger (How the backup is triggered)
          - Schedule based
          - Default tagging criteria (a default 'tag' for all the scheduled backups. This tag links the backups to the retention rule)
  - Default Retention Rule (A rule that is applied to all backups, by default, on the initial datastore)

So, this object defines what type of backups are triggered, how they're triggered (via a schedule), what they're tagged with, where they land (a datastore), and the life cycle of the backup data in a datastore. The default PowerShell object for PostgreSQL – Flexible Server triggers a full backup every week and they reach the vault, where they're stored for **3 months**.

### Retrieve the policy template

To understand the inner components of a Backup policy for Azure PostgreSQL – Flexible Server database backup, retrieve the policy template using the [`az dataprotection backup-policy get-default-policy-template`](/cli/azure/dataprotection/backup-policy?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-policy-get-default-policy-template) command. This command returns a default policy template for a given datasource type. Use this policy template to create a new policy.

```azurecli
az dataprotection backup-policy get-default-policy-template --datasource-type AzureDatabaseForPostgreSQLFlexibleServer

{
  "datasourceTypes": [
    "Microsoft.DBforPostgreSQL/flexibleServers"
  ],
  "name": "OssFlexiblePolicy1",
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
            "R/2021-08-15T06:30:00+00:00/P1W"
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
            "taggingPriority": 99
          }
        ]
      }
    },
    {
      "isDefault": true,
      "lifecycles": [
        {
          "deleteAfter": {
            "duration": "P3M",
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
}

```

The policy template consists of a trigger (decides what triggers the backup) and a lifecycle (decides when to delete, copy, move the backup). In Azure PostgreSQL – Flexible Server database backup, the default value for trigger is a scheduled **Weekly** trigger (one backup every 7 days) and to retain each backup for **3 months**.

**Scheduled trigger:**

```json
"trigger": {
        "objectType": "ScheduleBasedTriggerContext",
        "schedule": {
          "repeatingTimeIntervals": [
            "R/2021-08-15T06:30:00+00:00/P1W"
          ],
          "timeZone": "UTC"
        }

```

**Default retention rule lifecycle:**

```json

{
      "isDefault": true,
      "lifecycles": [
        {
          "deleteAfter": {
            "duration": "P3M",
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

```

### Modify the policy template

> [!IMPORTANT]
>In Azure PowerShell, Objects can be used as staging locations to perform all modifications. In Azure CLI, we have to use files, as there's no notion of Objects. Each **edit** operation should be redirected to a new file, where content is read from the *input* file and redirected to the *output* file. You can later rename the file as required while using in a script.

#### Modify the schedule

The default policy template offers a backup once per week. You can modify the schedule for the backup to happen multiple days per week. To modify the schedule, use the [`az dataprotection backup-policy trigger set`](/cli/azure/dataprotection/backup-policy/trigger?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-policy-trigger-set) command.

The following example modifies the weekly backup to back up happening on every Sunday, Wednesday, and Friday of every week. The schedule date array mentions the dates, and the days of the week of those dates are taken as days of the week. Also, specify that these schedules should repeat every week. So, the schedule interval is *1* and the interval type is *Weekly*.

```azurecli
az dataprotection backup-policy trigger create-schedule --interval-type Weekly --interval-count 1 --schedule-days 2021-08-15T22:00:00 2021-08-18T22:00:00 2021-08-20T22:00:00
[
  "R/2021-08-15T22:00:00+00:00/P1W",
  "R/2021-08-18T22:00:00+00:00/P1W",
  "R/2021-08-20T22:00:00+00:00/P1W"
]

az dataprotection backup-policy trigger set --policy .\OSSPolicy.json  --schedule R/2021-08-15T22:00:00+00:00/P1W R/2021-08-18T22:00:00+00:00/P1W R/2021-08-20T22:00:00+00:00/P1W > EditedOSSPolicy.json

```

#### Add a new retention rule

The default template has a lifecycle for the initial datastore under the default retention rule. In this scenario, the rule deletes the backup data after *3 months*. Use the [`az dataprotection backup-policy retention-rule create-lifecycle`](/cli/azure/dataprotection/backup-policy/retention-rule?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-policy-retention-rule-create-lifecycle) command to create new lifecycles and use the [`az dataprotection backup-policy retention-rule set`](/cli/azure/dataprotection/backup-policy/retention-rule?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-policy-retention-rule-set) command to associate them with the new rules or to the existing rules.

The following example creates a new retention rule named `Monthly`, where the first successful backup of every month should be retained in vault for *6 months*.

```azurecli
az dataprotection backup-policy retention-rule create-lifecycle --retention-duration-count 6 --retention-duration-type Months --source-datastore VaultStore > VaultLifeCycle.JSON

az dataprotection backup-policy retention-rule set --lifecycles .\VaultLifeCycle.JSON --name Monthly --policy .\EditedOSSPolicy.json > AddedRetentionRulePolicy.JSON

```

#### Add a tag and the relevant criteria

Once a retention rule is created, you have to create a corresponding tag in the **Trigger** property of the Backup policy. Use the [`az dataprotection backup-policy tag create-absolute-criteria`](/cli/azure/dataprotection/backup-policy/tag?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-policy-tag-create-absolute-criteria) command to create a new tagging criteria and use the [`az dataprotection backup-policy tag set`](/cli/azure/dataprotection/backup-policy/tag?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-policy-tag-set) command to update the existing tag or create a new tag.

The following example creates a new *tag* along with the criteria, the first successful backup of the month. The tag has the same name as the corresponding retention rule to be applied.

In this example, the tag criteria should be named *Monthly*.

```azurecli
az dataprotection backup-policy tag create-absolute-criteria --absolute-criteria FirstOfMonth > tagCriteria.JSON
az dataprotection backup-policy tag set --criteria .\tagCriteria.JSON --name Monthly --policy .\AddedRetentionRulePolicy.JSON > AddedRetentionRuleAndTag.JSON

```

For example, if the schedule is multiple backups per week (every Sunday, Wednesday, Thursday as specified in the example) and you want to archive the Sunday and Friday backups, then the tagging criteria can be changed as follows, using the [`az dataprotection backup-policy tag create-generic-criteria`](/cli/azure/dataprotection/backup-policy/tag?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-policy-tag-create-generic-criteria) command.

```azurecli
az dataprotection backup-policy tag create-generic-criteria --days-of-week Sunday Friday > tagCriteria.JSON
az dataprotection backup-policy tag set --criteria .\tagCriteria.JSON --name Monthly --policy .\AddedRetentionRulePolicy.JSON > AddedRetentionRuleAndTag.JSON

```

### Create a new PostgreSQL - flexible Server backup policy

Once the template is modified as per the requirements, use the [`az dataprotection backup-policy create`](/cli/azure/dataprotection/backup-policy?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-policy-create) command to create a policy using the modified template.

```azurecli
az dataprotection backup-policy create --backup-policy-name FinalOSSPolicy --policy AddedRetentionRuleAndTag.JSON --resource-group testBkpVaultRG --vault-name TestBkpVault

```

## Configure backup

Once the vault and policy are created, consider the following critical points to protect an Azure PostgreSQL – Flexible Server database:

- PostgreSQL – Flexible Server database for protection
- Backup vault to store the backup data
- Request for backup configuration

### Fetch the ID of the PostgreSQL - Flexible Server to be protected

Fetch the Azure Resource Manager ID (ARM ID) of PostgreSQL – Flexible Server to be protected. This ID serves as the identifier of the database. Let's use an example of a database named `empdb11` under a PostgreSQL - Flexible Server `testposgresql`, which is present in the resource group `ossrg` under a different subscription.

The following example uses bash.

```azurecli
ossId="/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/ossrg/providers/Microsoft.DBforPostgreSQL/flexibleServers/archive-postgresql-ccy/databases/empdb11"

```

### Grant access to the Backup vault

Backup vault has to connect to the PostgreSQL – Flexible Server, and then access the database via the keys present in the key vault. So, it requires access to the PostgreSQL – Flexible server and the key vault. Grant access to the Backup vault's Managed Service Identity (MSI).

Check the [permissions](backup-azure-database-postgresql-flex-overview.md#permissions-for-backup) required for the Backup vault's Managed Service Identity (MSI) on the PostgreSQL – Flexible Server and Azure Key vault that stores keys to the database.

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

- [Restore Azure Database for PostgreSQL - flexible server using Azure CLI](backup-azure-database-postgresql-flex-restore-cli.md)
