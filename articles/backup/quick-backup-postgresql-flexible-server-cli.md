---
title: Quickstart - Create a backup policy for Azure Database for PostgreSQL - Flexible Server using Azure CLI
description: Learn how to create backup policy to protect Azure Database for PostgreSQL - Flexible server using Azure CLI.
ms.devlang: terraform
ms.custom:
  - ignite-2024
ms.topic: quickstart
ms.date: 02/28/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
# Customer intent: As a database administrator, I want to create a backup policy for Azure Database for PostgreSQL Flexible Server using CLI commands, so that I can ensure data protection and establish a reliable recovery plan for my database.
---

#  Quickstart: Create a backup policy for Azure Database for PostgreSQL - Flexible Server using Azure CLI

This quickstart describes how to create a backup policy to protect Azure Database for  PostgreSQL - Flexible Server using Azure CLI.

Azure Backup policy for Azure Database for PostgreSQL - Flexible Server defines how and when backups are created, the retention period for recovery points, and the rules for data protection and recovery. [Azure Backup](backup-azure-database-postgresql-flex-overview.md) allows you to back up your Azure PostgreSQL - Flexible Server using multiple clients, such as [Azure portal](tutorial-create-first-backup-azure-database-postgresql-flex.md), [PowerShell](back-up-azure-database-postgresql-flex-backup-powershell.md), [CLI](back-up-azure-database-postgresql-flex-backup-cli.md), [Azure Resource Manager](quick-backup-postgresql-flexible-server-arm.md), [Bicep](quick-backup-postgresql-flexible-server-bicep.md), [Terraform](quick-backup-postgresql-flexible-server-terraform.md), and so on. 

## Prerequisites

Before you create a backup policy for Azure Database for PostgreSQL - Flexible Server, ensure that the following prerequisites are met:

- Review the [supported scenarios and limitations for backing up Azure Database for PostgreSQL - Flexible Servers](backup-azure-database-postgresql-flex-support-matrix.md).
- [Create a Backup vault](back-up-azure-database-postgresql-flex-backup-cli.md#create-a-backup-vault) to store the recovery points for the database.

## Create a backup policy

To create a backup policy, follow these steps:

1. Understand PostgreSQL - Flexible Server backup policy
1. Retrieve the policy template
1. Modify the policy template
1. Create the policy

### Understand PostgreSQL - Flexible Server backup policy

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

So, this object defines:
- The type of backups triggered
- The way the policy are triggered (via a schedule)
- The tags implemented to the Backup policy
- The location where the data is stored (a datastore)
- The life cycle of the backup data in a datastore 

The default PowerShell object for PostgreSQL – Flexible Server triggers a full backup every week and they reach the vault, where they're stored for **three months**.

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

The policy template consists of a trigger (decides what triggers the backup) and a lifecycle (decides when to delete, copy, move the backup). In Azure PostgreSQL – Flexible Server database backup, the default value for trigger is a scheduled **Weekly** trigger (one backup every 7 days) and to retain each backup for **three months**.

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

>[!Important]
>The backup schedule follows the ISO 8601 duration format. However, the repeating interval prefix `R` is not supported, as backups are configured to run indefinitely. Any value specified with `R` will be ignored.

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

The default template has a lifecycle for the initial datastore under the default retention rule. In this scenario, the rule deletes the backup data after *three months*. Use the [`az dataprotection backup-policy retention-rule create-lifecycle`](/cli/azure/dataprotection/backup-policy/retention-rule?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-policy-retention-rule-create-lifecycle) command to create new lifecycles and use the [`az dataprotection backup-policy retention-rule set`](/cli/azure/dataprotection/backup-policy/retention-rule?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-policy-retention-rule-set) command to associate them with the new rules or to the existing rules.

The following example creates a new retention rule named `Monthly`, where the first successful backup of every month should be retained in vault for *six months*.

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

### Create the policy

Once the template is modified as per the requirements, use the [`az dataprotection backup-policy create`](/cli/azure/dataprotection/backup-policy?view=azure-cli-latest&preserve-view=true#az-dataprotection-backup-policy-create) command to create a policy using the modified template.

```azurecli
az dataprotection backup-policy create --backup-policy-name FinalOSSPolicy --policy AddedRetentionRuleAndTag.JSON --resource-group testBkpVaultRG --vault-name TestBkpVault

```

## Next steps

[Configure backup for Azure Database for PostgreSQL - flexible server using Azure CLI](back-up-azure-database-postgresql-flex-backup-cli.md#configure-backup).

