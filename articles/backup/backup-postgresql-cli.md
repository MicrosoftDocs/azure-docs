---
title: Back Up a PostgreSQL Databases by Using the Azure CLI
description: Learn how to back up PostgreSQL databases in Azure Virtual Machines by using the Azure CLI.
ms.topic: how-to
ms.date: 05/20/2025
ms.custom:
  - devx-track-azurecli
  - build-2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Back up PostgreSQL databases by using the Azure CLI

This article describes how to back up PostgreSQL databases in [Azure Virtual Machines](/azure/postgresql/overview#azure-database-for-postgresql---single-server) by using the Azure CLI. You can also configure backup using [Azure portal](backup-azure-database-postgresql.md), [Azure PowerShell](backup-postgresql-ps.md), and [REST API](backup-azure-data-protection-use-rest-api-backup-postgresql.md) for PostgreSQL databases. 

Learn more about the [supported scenarios](backup-azure-database-postgresql-support-matrix.md) and [frequently asked questions](/azure/backup/backup-azure-database-postgresql-server-faq) for backing up Azure Database for PostgreSQL.

## Create a Backup vault

A Backup vault is a storage entity in Azure. It stores the backup data for new workloads that Azure Backup supports, such as Azure Database for PostgreSQL servers, blobs in a storage account, and Azure disks. Backup vaults help to organize your backup data, while minimizing management overhead. Backup vaults are based on the Azure Resource Manager model of Azure, which provides enhanced capabilities to help secure backup data.

Before you create a Backup vault, choose the storage redundancy of the data within the vault. Then proceed to create the Backup vault with that storage redundancy and the location.

In this article, you create a Backup vault with the name `TestBkpVault`, in the `westus` region, under the resource group `testBkpVaultRG`. Use the [`az dataprotection vault create`](/cli/azure/dataprotection/backup-vault#az-dataprotection-backup-vault-create) command to create a Backup vault. [Learn more about creating a Backup vault](./create-manage-backup-vault.md#create-a-backup-vault).

```azurecli-interactive
az dataprotection backup-vault create -g testBkpVaultRG --vault-name TestBkpVault -l westus --type SystemAssigned --storage-settings datastore-type="VaultStore" type="LocallyRedundant"

{
  "eTag": null,
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/testBkpVaultRG/providers/Microsoft.DataProtection/BackupVaults/TestBkpVault",
  "identity": {
    "principalId": "aaaaaaaa-bbbb-cccc-1111-222222222222",
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

## Create a backup policy

After you create a vault, you can create a backup policy to help protect PostgreSQL databases. You can also [create a backup policy for PostgreSQL databases using REST API](backup-azure-data-protection-use-rest-api-create-update-postgresql-policy.md).

### Understand the PostgreSQL backup policy

Whereas disk backup offers multiple backups per day and blob backup is a *continuous* backup with no trigger, PostgreSQL backup offers archive protection. The backup data that's first sent to the vault can be moved to the archive tier in accordance with a defined rule or a life cycle.

In this context, the following hierarchy can help you understand the backup policy object for PostgreSQL:

- Policy rule
  - Backup rule
    - Backup parameter
      - Backup type (a full database backup in this case)
      - Initial datastore (where the backups land initially)
      - Trigger (how the backup is triggered)
        - Schedule
        - Default tagging criteria (a default tag that links all scheduled backups to the retention rule)
  - Default retention rule (a rule that's applied to all backups, by default, on the initial datastore)

The policy object defines what types of backups are triggered, how they're triggered (via a schedule), what they're tagged with, where they land (a datastore), and the life cycle of their data in a datastore.

The default PowerShell object for PostgreSQL says to trigger a *full* backup every week. The backups reach the vault, where they're stored for three months.

If you want to add the archive tier to the policy, you have to decide when the data will be moved from the vault to the archive, how long the data will stay in the archive, and which of the scheduled backups should be tagged as archivable. You have to add a retention rule that defines the life cycle of the backup data from the vault datastore to the archive datastore. The retention rule also defines how long the backup data will stay in the archive datastore. Then you need to add a tag that marks the scheduled backups as eligible to be archived.

The resultant PowerShell object is as follows:

- Policy rule
  - Backup rule
    - Backup parameter
      - Backup type (a full database backup in this case)
      - Initial datastore (where the backups land initially)
      - Trigger (how the backup is triggered)
        - Schedule
        - Default tagging criteria (a default tag that links all the scheduled backups to the retention rule)
        - New tagging criteria for the new retention rule with the same name
  - Default retention rule (a rule that's applied to all backups, by default, on the initial datastore)
  - New retention rule
    - Life cycle
      - Source datastore
      - Time period for deletion in the source datastore
      - Copy to the target datastore

### Retrieve the policy template

To understand the inner components of a backup policy for PostgreSQL database backup, retrieve the policy template by using the [`az dataprotection backup-policy get-default-policy-template`](/cli/azure/dataprotection/backup-policy#az-dataprotection-backup-policy-get-default-policy-template) command. This command returns the default policy template for a data-source type. Use this policy template to create a new policy.

```azurecli-interactive
az dataprotection backup-policy get-default-policy-template --datasource-type AzureDatabaseForPostgreSQL
{
  "datasourceTypes": [
    "Microsoft.DBforPostgreSQL/servers/databases"
  ],
  "name": "OssPolicy1",
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

The policy template consists of a trigger (which decides what triggers the backup) and a life cycle (which decides when to delete, copy, or move the backup). In a PostgreSQL database backup, the default value for the trigger is a scheduled weekly trigger (one backup every seven days). Each backup is retained for three months.

#### Scheduled trigger

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

#### Default life cycle for the detention rule

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

In Azure PowerShell, you can use objects as staging locations to perform all modifications. In the Azure CLI, you have to use files, because there's no notion of objects. Each edit operation should be redirected to a new file, where content is read from the input file and redirected to the output file. You can later rename the file as required while using it in a script.

#### Modify the schedule

The default policy template offers a backup once per week. You can modify the schedule for the backup to happen multiple days per week. To modify the schedule, use the [`az dataprotection backup-policy trigger set`](/cli/azure/dataprotection/backup-policy/trigger#az-dataprotection-backup-policy-trigger-set) command.

The following example modifies the weekly backup to Sunday, Wednesday, and Friday of every week. The schedule date array mentions the dates, and the days of the week for those dates are taken as days of the week. You also need to specify that these schedules should repeat every week. So, the schedule interval is `1` and the interval type is `Weekly`.

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

If you want to add archive protection, you need to modify the policy template.

The default template has a life cycle for the initial datastore under the default retention rule. In this scenario, the rule says to delete the backup data after three months. You should add a new retention rule that defines when the data is moved to the archive datastore. That is, backup data is first copied to the archive datastore, and then it's deleted in the vault datastore.

Also, the rule should define how long to keep the data in the archive datastore. To create new life cycles, use the [`az dataprotection backup-policy retention-rule create-lifecycle`](/cli/azure/dataprotection/backup-policy/retention-rule#az-dataprotection-backup-policy-retention-rule-create-lifecycle) command. To associate those life cycles with new or existing rules, use the [`az dataprotection backup-policy retention-rule set`](/cli/azure/dataprotection/backup-policy/retention-rule#az-dataprotection-backup-policy-retention-rule-set) command.

The following example creates a new retention rule named `Monthly`. In this rule, the first successful backup of every month is retained in the vault for six months, moved to the archive tier, and kept in the archive tier for 24 months.

```azurecli
az dataprotection backup-policy retention-rule create-lifecycle --retention-duration-count 6 --retention-duration-type Months --source-datastore VaultStore --target-datastore ArchiveStore --copy-option CopyOnExpiryOption > VaultToArchiveLifeCycle.JSON

az dataprotection backup-policy retention-rule create-lifecycle --retention-duration-count 24 --retention-duration-type Months -source-datastore ArchiveStore > OnArchiveLifeCycle.JSON

az dataprotection backup-policy retention-rule set --lifecycles .\VaultToArchiveLifeCycle.JSON .\OnArchiveLifeCycle.JSON --name Monthly --policy .\EditedOSSPolicy.JSON > AddedRetentionRulePolicy.JSON
```

#### Add a tag and the relevant criteria

After you create a retention rule, you have to create a corresponding tag in the `Trigger` property of the backup policy. To create new tagging criteria, use the [`az dataprotection backup-policy tag create-absolute-criteria`](/cli/azure/dataprotection/backup-policy/tag#az-dataprotection-backup-policy-tag-create-absolute-criteria) command. To update the existing tag or create a new tag, use the [`az dataprotection backup-policy tag set`](/cli/azure/dataprotection/backup-policy/tag#az-dataprotection-backup-policy-tag-set) command.

The following example creates a new tag along with the criteria, which is the first successful backup of the month. The tag has the same name as the corresponding retention rule to be applied.

In this example, the tag criteria are named `Monthly`:

```azurecli
az dataprotection backup-policy tag create-absolute-criteria --absolute-criteria FirstOfMonth > tagCriteria.JSON
az dataprotection backup-policy tag set --criteria .\tagCriteria.JSON --name Monthly --policy .\AddedRetentionRulePolicy.JSON > AddedRetentionRuleAndTag.JSON
```

If the schedule is multiple backups per week (every Sunday, Wednesday, and Thursday, as specified in the preceding example) and you want to archive the Sunday and Friday backups, you can change the tagging criteria by using the [`az dataprotection backup-policy tag create-generic-criteria`](/cli/azure/dataprotection/backup-policy/tag#az-dataprotection-backup-policy-tag-create-generic-criteria) command:

```azurecli
az dataprotection backup-policy tag create-generic-criteria --days-of-week Sunday Friday > tagCriteria.JSON
az dataprotection backup-policy tag set --criteria .\tagCriteria.JSON --name Monthly --policy .\AddedRetentionRulePolicy.JSON > AddedRetentionRuleAndTag.JSON
```

### Create a new PostgreSQL backup policy

After you modify the template according to the requirements, use the [`az dataprotection backup-policy create`](/cli/azure/dataprotection/backup-policy#az-dataprotection-backup-policy-create) command to create a policy by using the modified template:

```azurecli
az dataprotection backup-policy create --backup-policy-name FinalOSSPolicy --policy AddedRetentionRuleAndTag.JSON --resource-group testBkpVaultRG --vault-name TestBkpVault
```

## Configure backup

After you create the vault and policy, you need to consider three critical points to back up a PostgreSQL database in Azure Database for PostgreSQL.

### Understand key entities

#### PostgreSQL database to be backed up

Fetch the Resource Manager ID of the PostgreSQL database to be backed up. This ID serves as the identifier of the database. The following example uses a database named `empdb11` under the PostgreSQL server `testposgresql`, which is present in the resource group `ossrg` under a different subscription. The example uses Bash.

```azurecli
ossId="/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/ossrg/providers/Microsoft.DBforPostgreSQL/servers/archive-postgresql-ccy/databases/empdb11"
```

#### Key vault

The Azure Backup service doesn't store the username and password to connect to the PostgreSQL database. Instead, the backup admin seeds the *keys* into the key vault. The Azure Backup service then accesses the key vault, reads the keys, and accesses the database.

The following example uses Bash. Note the secret identifier of the relevant key.

```azure-cli
keyURI="https://testkeyvaulteus.vault.azure.net/secrets/ossdbkey"
```

#### Backup vault

A Backup vault has to connect to the PostgreSQL server and then access the database via the keys present in the key vault. So, the Backup vault requires access to the PostgreSQL server and the key vault. Access is granted to the Backup vault's managed identity.

[Read about the permissions](./backup-azure-database-postgresql-overview.md#permissions-needed-for-postgresql-database-backup) that you should grant to the Backup vault's managed identity on the PostgreSQL server and the key vault that stores the keys to the database.

### Prepare the request

After you set all the relevant permissions, perform the configuration of the backup in two steps:

1. Prepare the request by using the relevant vault, policy, and PostgreSQL database in the [`az dataprotection backup-instance initialize`](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-initialize) command.
1. Submit the request to back up the database by using the  [`az dataprotection backup-instance create`](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-create) command.

```azurecli
az dataprotection backup-instance initialize --datasource-id $ossId --datasource-type AzureDatabaseForPostgreSQL -l <vault-location> --policy-id <policy_arm_id>  --secret-store-type AzureKeyVault --secret-store-uri $keyURI > OSSBkpInstance.JSON

az dataprotection backup-instance create --resource-group testBkpVaultRG --vault-name TestBkpVault TestBkpvault --backup-instance .\OSSBkpInstance.JSON
```

## Run an on-demand backup

You have to specify a retention rule while you trigger the backup. To view the retention rules in a policy, browse through the policy JSON file. In the following example, there are two retention rules with the names `Default` and `Monthly`. This article uses the `Monthly` rule for the on-demand backup.

```azurecli
az dataprotection backup-policy show  -g ossdemorg --vault-name ossdemovault-1 --subscription e3d2d341-4ddb-4c5d-9121-69b7e719485e --name osspol5
{
  "id": "/subscriptions/e3d2d341-4ddb-4c5d-9121-69b7e719485e/resourceGroups/ossdemorg/providers/Microsoft.DataProtection/backupVaults/ossdemovault-1/backupPolicies/osspol5",
  "name": "osspol5",
  "properties": {
    "datasourceTypes": [
      "Microsoft.DBforPostgreSQL/servers/databases"
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

To trigger an on-demand backup, use the [`az dataprotection backup-instance adhoc-backup`](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-adhoc-backup) command:

```azurecli
az dataprotection backup-instance adhoc-backup --name "ossrg-empdb11" --rule-name "Monthly" --resource-group testBkpVaultRG --vault-name TestBkpVault
```

## Track jobs

Track all jobs by using the [`az dataprotection job list`](/cli/azure/dataprotection/job#az-dataprotection-job-list) command. You can list all jobs and fetch a particular job detail.

You can also use `Az.ResourceGraph` to track all jobs across all Backup vaults. Use the [`az dataprotection job list-from-resourcegraph`](/cli/azure/dataprotection/job#az-dataprotection-job-list-from-resourcegraph) command to fetch the relevant jobs across Backup vaults:

```azurecli
az dataprotection job list-from-resourcegraph --datasource-type AzureDatabaseForPostgreSQL --status Completed
```

## Related content

- [Restore PostgreSQL databases by using the Azure CLI](restore-postgresql-database-cli.md).
- Restore a PostgreSQL database using [Azure portal](restore-azure-database-postgresql.md), [Azure PowerShell](restore-postgresql-database-ps.md), and [REST API](restore-postgresql-database-use-rest-api.md).

