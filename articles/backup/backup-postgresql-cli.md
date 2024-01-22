---
title: Back up Azure Database for PostgreSQL with long-term-retention using Azure CLI
description: Learn how to back up Azure Database for PostgreSQL using Azure CLI.
ms.topic: conceptual
ms.date: 02/25/2022
ms.custom: devx-track-azurecli
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up Azure PostgreSQL databases using Azure CLI

This article explains how to back up [Azure PostgreSQL database](../postgresql/overview.md#azure-database-for-postgresql---single-server) using Azure CLI.

In this article, you'll learn how to:

-  Create a Backup vault
-  Create a backup policy
-  Configure a backup of an Azure PostgreSQL database
-  Run an on-demand backup job

For informgreSQL databases supported scenarios and limitations, see the [support matrix](backup-azure-database-postgresql-support-matrix.md).

## Create a Backup vault

Backup vault is a storage entity in Azure. This stores the backup data for new workloads that Azure Backup supports. For example, Azure Database for PostgreSQL servers, blobs in a storage account, and Azure Disks. Backup vaults help to organize your backup data, while minimizing management overhead. Backup vaults are based on the Azure Resource Manager model of Azure, which provides enhanced capabilities to help secure backup data.

Before you create a Backup vault, choose the storage redundancy of the data within the vault. Then proceed to create the Backup vault with that storage redundancy and the location.

In this article, we'll create a Backup vault _TestBkpVault_, in the region _westus_, under the resource group _testBkpVaultRG_. Use the [az dataprotection vault create](/cli/azure/dataprotection/backup-vault#az-dataprotection-backup-vault-create) command to create a Backup vault. Learn more about [creating a Backup vault](./create-manage-backup-vault.md#create-a-backup-vault).

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

After the vault is created, let's create a Backup policy to protect Azure PostgreSQL databases.

## Create a Backup policy

### Understanding PostGreSQL backup policy

While disk backup offers multiple backups per day and blob backup is a _continuous_ backup with no trigger, PostgreSQL backup offers Archive protection. The backup data that's first sent to the vault can be then moved to the _archive_ tier as per a defined rule or a _lifecycle_. In this context, let's understand the backup policy object for PostgreSQL.

- PolicyRule
   -  BackupRule
      - BackupParameter
        -  BackupType (A full database backup in this case)
        -  Initial Datastore (Where will the backups land initially)
        -  Trigger (How the backup is triggered)
           -  Schedule based
           -  Default tagging criteria (a default 'tag' for all the scheduled backups. This tag links the backups to the retention rule)
   -  Default Retention Rule (A rule that will be applied to all backups, by default, on the initial datastore)

So, this object defines what type of backups are triggered, how they are triggered (via a schedule), what they are tagged with, where they land (a datastore), and the life cycle of the backup data in a datastore. The default PowerShell object for PostgreSQL says to trigger a *full* backup every week and they will reach the vault, where they are stored for three months.

If you want to add the *archive* tier to the policy, you have to decide when the data will be moved from vault to archive, how long will the data stay in the archive, and which of the scheduled backups should be tagged as _archivable_. Therefore, you have to add a *retention rule*, where the lifecycle of the backup data will be defined from vault datastore to archive datastore, and how long they will they stay in the *archive* datastore. Then you need add a *tag* that will mark the scheduled backups as _eligible to be archived_.

The resultant PowerShell object is as follows:

-  PolicyRule
   -  BackupRule
      - BackupParameter
        -  BackupType (A full database backup in this case)
        -  Initial Datastore (Where will the backups land initially)
        -  Trigger (How the backup is triggered)
           -  Schedule based
           -  Default tagging criteria (a default 'tag' for all the scheduled backups. This tag links the backups to the retention rule)
           -  New Tagging criteria for the new retention rule with the same name 'X'
   -  Default Retention Rule (A rule that will be applied to all backups, by default, on the initial datastore)
   -  A new Retention rule named as 'X'
      -  Lifecycle
         -  Source datastore
         -  Delete After time period in source datastore
         -  Copy to target datastore

### Retrieve the policy template

To understand the inner components of a Backup policy for Azure PostgreSQL database backup, retrieve the policy template using the [az dataprotection backup-policy get-default-policy-template](/cli/azure/dataprotection/backup-policy#az-dataprotection-backup-policy-get-default-policy-template) command. This command returns a default policy template for a given datasource type. Use this policy template to create a new policy.

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

The policy template consists of a trigger (which decides what triggers the backup) and a lifecycle (which decides when to delete/copy/move the backup). In Azure PostgreSQL database backup, the default value for trigger is a scheduled Weekly trigger (one backup every seven days) and to retain each backup for three months.

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

### Modifying the policy template

> [!IMPORTANT]
> In Azure PowerShell, _Objects_ can be used as staging locations to perform all modifications. In Azure CLI, we have to use files, as there is no notion of *Objects*. Each edit operation should be redirected to a new file, where content is read from the input file and re-directed to the output file. You can later rename the file as required while using in a script.

#### Modify the schedule

The default policy template offers a backup once per week. You can modify the schedule for the backup to happen multiple days per week. To modify the schedule, use the [az dataprotection backup-policy trigger set](/cli/azure/dataprotection/backup-policy/trigger#az-dataprotection-backup-policy-trigger-set) command.

The following example modifies the weekly backup to back up happening on every Sunday, Wednesday, and Friday of every week. The schedule date array mentions the dates, and the days of the week of those dates are taken as days of the week. You also need to specify that these schedules should repeat every week. So, the schedule interval is "1" and the interval type is "Weekly".

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

If you want to add the *archive* protection, you need to modify the policy template as below.

The default template will have a lifecycle for the initial datastore under the default retention rule. In this scenario, the rule says to delete the backup data after three months. You should add a new retention rule that defines when the data is *moved* to *archive* datastore, that is, backup data is first copied to archive datastore, and then deleted in vault datastore. Also, the rule should define for how long the data is kept in the *archive* datastore. Use the [az dataprotection backup-policy retention-rule create-lifecycle](/cli/azure/dataprotection/backup-policy/retention-rule#az-dataprotection-backup-policy-retention-rule-create-lifecycle) command to create new lifecycles and use the [az dataprotection backup-policy retention-rule set](/cli/azure/dataprotection/backup-policy/retention-rule#az-dataprotection-backup-policy-retention-rule-set) command to associate them with the new rules or to the existing rules.

The following example creates a new retention rule named *Monthly*, where the first successful backup of every month should be retained in vault for six months, moved to archive tier, and kept in archive tier for 24 months.

```azurecli
az dataprotection backup-policy retention-rule create-lifecycle --retention-duration-count 6 --retention-duration-type Months --source-datastore VaultStore --target-datastore ArchiveStore --copy-option CopyOnExpiryOption > VaultToArchiveLifeCycle.JSON

az dataprotection backup-policy retention-rule create-lifecycle --retention-duration-count 24 --retention-duration-type Months -source-datastore ArchiveStore > OnArchiveLifeCycle.JSON

az dataprotection backup-policy retention-rule set --lifecycles .\VaultToArchiveLifeCycle.JSON .\OnArchiveLifeCycle.JSON --name Monthly --policy .\EditedOSSPolicy.JSON > AddedRetentionRulePolicy.JSON
```

#### Add a tag and the relevant criteria

Once a retention rule is created, you've to create a corresponding *tag* in the *Trigger* property of the Backup policy. Use the [az dataprotection backup-policy tag create-absolute-criteria](/cli/azure/dataprotection/backup-policy/tag#az-dataprotection-backup-policy-tag-create-absolute-criteria) command to create a new tagging criteria and use the [az dataprotection backup-policy tag set](/cli/azure/dataprotection/backup-policy/tag#az-dataprotection-backup-policy-tag-set) command to update the existing tag or create a new tag.

The following example creates a new *tag* along with the criteria, the first successful backup of the month. The tag has the same name as the corresponding retention rule to be applied.

In this example, the tag criteria should be named *Monthly*.

```azurecli
az dataprotection backup-policy tag create-absolute-criteria --absolute-criteria FirstOfMonth > tagCriteria.JSON
az dataprotection backup-policy tag set --criteria .\tagCriteria.JSON --name Monthly --policy .\AddedRetentionRulePolicy.JSON > AddedRetentionRuleAndTag.JSON
```

Suppose if the schedule is multiple backups per week (every Sunday, Wednesday, Thursday as specified in the above example) and you want to archive the Sunday and Friday backups, then the tagging criteria can be changed as follows, using the [az dataprotection backup-policy tag create-generic-criteria](/cli/azure/dataprotection/backup-policy/tag#az-dataprotection-backup-policy-tag-create-generic-criteria) command.

```azurecli
az dataprotection backup-policy tag create-generic-criteria --days-of-week Sunday Friday > tagCriteria.JSON
az dataprotection backup-policy tag set --criteria .\tagCriteria.JSON --name Monthly --policy .\AddedRetentionRulePolicy.JSON > AddedRetentionRuleAndTag.JSON
```

### Create a new PostgreSQL backup policy

Once the template is modified as per the requirements, use the [az dataprotection backup-policy create](/cli/azure/dataprotection/backup-policy#az-dataprotection-backup-policy-create) command to create a policy using the modified template.

```azurecli
az dataprotection backup-policy create --backup-policy-name FinalOSSPolicy --policy AddedRetentionRuleAndTag.JSON --resource-group testBkpVaultRG --vault-name TestBkpVault
```

## Configure backup

Once the vault and policy are created, there're three critical points that you need to consider to protect an Azure PostgreSQL database.

### Key entities involved

#### PostGreSQL database to be protected

Fetch the Azure Resource Manager ID (ARM ID) of PostgreSQL to be protected. This serves as the identifier of the database. We'll use an example of a database named **empdb11** under a PostgreSQL server **testposgresql**, which is present in the resource group **ossrg** under a different subscription.

The following example uses bash.

```azurecli
ossId="/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/ossrg/providers/Microsoft.DBforPostgreSQL/servers/archive-postgresql-ccy/databases/empdb11"
```

#### Azure key vault

The Azure Backup service doesn't store the username and password to connect to the PostgreSQL database. Instead, the backup admin needs to seed the *keys* into the key vault. Then the Backup service will access the key vault, read the keys, and then access the database. Note the secret identifier of the relevant key.

The following example uses bash.

```azure-cli
keyURI="https://testkeyvaulteus.vault.azure.net/secrets/ossdbkey"
```

#### Backup vault

Backup vault has to connect to the PostgreSQL server, and then access the database via the keys present in the key vault. Therefore, it requires access to the PostgreSQL server and the key vault. Access is granted to the Backup vault's Managed Service Identity (MSI).

See the [permissions](./backup-azure-database-postgresql-overview.md#set-of-permissions-needed-for-azure-postgresql-database-backup) you should grant to the Backup vault's Managed Service Identity (MSI) on the PostgreSQL server and Azure Key vault that stores keys to the database.

### Prepare the request

Once all the relevant permissions are set, the configuration of backup is performed in two steps.

1. We prepare the relevant request by using the relevant vault, policy, PostgreSQL database using the [az dataprotection backup-instance initialize](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-initialize) command.
1. We submit the request to protect the database using the [az dataprotection backup-instance create](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-create) command.

```azurecli
az dataprotection backup-instance initialize --datasource-id $ossId --datasource-type AzureDatabaseForPostgreSQL -l <vault-location> --policy-id <policy_arm_id>  --secret-store-type AzureKeyVault --secret-store-uri $keyURI > OSSBkpInstance.JSON

az dataprotection backup-instance create --resource-group testBkpVaultRG --vault-name TestBkpVault TestBkpvault --backup-instance .\OSSBkpInstance.JSON
```

## Run an on-demand backup

You have to specify a retention rule while you trigger backup. To view the retention rules in policy, navigate through the policy JSON file for retention rules. In the following example, there are two retention rules with names **Default** and **Monthly**. We'll use the **Monthly** rule for the on-demand backup.

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

To trigger an on-demand backup, use the [az dataprotection backup-instance adhoc-backup](/cli/azure/dataprotection/backup-instance#az-dataprotection-backup-instance-adhoc-backup) command.

```azurecli
az dataprotection backup-instance adhoc-backup --name "ossrg-empdb11" --rule-name "Monthly" --resource-group testBkpVaultRG --vault-name TestBkpVault
```

## Track jobs

Track all jobs using the [az dataprotection job list](/cli/azure/dataprotection/job#az-dataprotection-job-list) command. You can list all jobs and fetch a particular job detail.

You can also use _Az.ResourceGraph_ to track all jobs across all Backup vaults. Use the [az dataprotection job list-from-resourcegraph](/cli/azure/dataprotection/job#az-dataprotection-job-list-from-resourcegraph) command to fetch the relevant jobs that are across Backup vaults.

```azurecli
az dataprotection job list-from-resourcegraph --datasource-type AzureDatabaseForPostgreSQL --status Completed
```

## Next steps

- [Restore Azure PostgreSQL database using Azure CLI](restore-postgresql-database-cli.md)