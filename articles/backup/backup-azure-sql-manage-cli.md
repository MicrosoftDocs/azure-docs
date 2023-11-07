---
title: Manage SQL server databases in Azure VMs using Azure Backup via CLI
description: Learn how to use CLI to manage SQL server databases in Azure VMs in the Recovery Services vault.
ms.topic: how-to
ms.date: 08/11/2022
ms.service: backup
ms.custom: devx-track-azurecli
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Manage SQL databases in an Azure VM using Azure CLI

Azure CLI is used to create and manage Azure resources from the Command Line or through scripts. This article describes how to manage a backed-up SQL database on Azure VM using Azure CLI. You can also perform these actions using [the Azure portal](./manage-monitor-sql-database-backup.md).

In this article, you'll learn how to:

> [!div class="checklist"]
>
> * Monitor backup and restore jobs
> * Protect new databases added to an SQL instance
> * Change the policy
> * Stop protection
> * Resume protection

If you've used [Back up an SQL database in Azure using CLI](backup-azure-sql-backup-cli.md) to back up your SQL database, then you're- using the following resources:

* A resource group named *SQLResourceGroup*
* A vault named *SQLVault*
* Protected container named *VMAppContainer;Compute;SQLResourceGroup;testSQLVM*
* Backed-up database/item named *sqldatabase;mssqlserver;master*
* Resources in the *westus2* region

Azure CLI eases the process of managing an SQL database running on an Azure VM that's backed-up using Azure Backup. The following sections describe each of the management operations.

>[!Note]
>See the [SQL backup support matrix](sql-support-matrix.md) to know more about the supported configurations and scenarios.

## Monitor backup and restore jobs

Use the [az backup job list](/cli/azure/backup/job#az-backup-job-list) command to monitor completed or currently running jobs (backup or restore). CLI also allows you to [suspend a currently running job](/cli/azure/backup/job#az-backup-job-stop) or [wait until a job completes](/cli/azure/backup/job#az-backup-job-wait).

```azurecli-interactive
az backup job list --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --output table
```

The output appears as:

```output
Name                                  Operation              Status      Item Name       			Start Time UTC
------------------------------------  ---------------        ---------   ----------      			-------------------  
e0f15dae-7cac-4475-a833-f52c50e5b6c3  ConfigureBackup        Completed   master [testSQLVM]         2019-12-03T03:09:210831+00:00  
ccdb4dce-8b15-47c5-8c46-b0985352238f  Backup (Full)          Completed   master [testSQLVM]   		2019-12-01T10:30:58.867489+00:00
4980af91-1090-49a6-ab96-13bc905a5282  Backup (Differential)  Completed   master [testSQLVM]			2019-12-01T10:36:00.563909+00:00
F7c68818-039f-4a0f-8d73-e0747e68a813  Restore (Log)          Completed   master [testSQLVM]			2019-12-03T05:44:51.081607+00:00
```

## Change a policy

To change the policy underlying the SQL backup configuration, use the [az backup policy set](/cli/azure/backup/policy#az-backup-policy-set) command. The name parameter in this command refers to the backup item whose policy you want to change. Here, replace the policy of the SQL database *sqldatabase;mssqlserver;master* with a new policy *newSQLPolicy*. You can create new policies using the [az backup policy create](/cli/azure/backup/policy#az-backup-policy-create) command.

```azurecli-interactive
az backup item set policy --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --container-name VMAppContainer;Compute;SQLResourceGroup;testSQLVM \
    --policy-name newSQLPolicy \
    --name sqldatabase;mssqlserver;master \
```

The output appears as:

```output
Name                                  Operation        Status     Item Name    Backup Management Type    Start Time UTC                    Duration
------------------------------------  ---------------  ---------  -----------  ------------------------  --------------------------------  --------------
ba350996-99ea-46b1-aae2-e2096c1e28cd  ConfigureBackup  Completed  master       AzureWorkload             2022-06-22T08:24:03.958001+00:00  0:01:12.435765
```

## Create a differential backup policy

To create a differential backup policy, use the [az backup policy create](/cli/azure/backup/policy#az-backup-policy-create) command with the following parameters:

* **--backup-management-type**: Azure Workload.
* **--workload-type**: SQL DataBase.
* **--name**: Name of the policy.
* **--policy**: JSON file with appropriate details for schedule and retention.
* **--resource-group**: Resource group of the vault.
* **--vault-name**: Name of the vault/

Example:

```azurecli
az backup policy create --resource-group SQLResourceGroup --vault-name SQLVault --name SQLPolicy --backup-management-type AzureWorkload --policy SQLPolicy.json --workload-type SQLDataBase
```

Sample JSON (sqlpolicy.json):

```json
  "eTag": null,
  "id": "/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLResourceGroup/providers/Microsoft.RecoveryServices/vaults/SQLVault/backupPolicies/SQLPolicy",
  "location": null,
  "name": "sqlpolicy",
  "properties": {
    "backupManagementType": "AzureWorkload",
    "workLoadType": "SQLDataBase",
    "settings": {
      "timeZone": "UTC",
      "issqlcompression": false,
      "isCompression": false
    },
    "subProtectionPolicy": [
      {
        "policyType": "Full",
        "schedulePolicy": {
          "schedulePolicyType": "SimpleSchedulePolicy",
          "scheduleRunFrequency": "Weekly",
          "scheduleRunDays": [
            "Sunday"
          ],
          "scheduleRunTimes": [
            "2022-06-13T19:30:00Z"
          ],
          "scheduleWeeklyFrequency": 0
        },
        "retentionPolicy": {
          "retentionPolicyType": "LongTermRetentionPolicy",
          "weeklySchedule": {
            "daysOfTheWeek": [
              "Sunday"
            ],
            "retentionTimes": [
              "2022-06-13T19:30:00Z"
            ],
            "retentionDuration": {
              "count": 104,
              "durationType": "Weeks"
            }
          },
          "monthlySchedule": {
            "retentionScheduleFormatType": "Weekly",
            "retentionScheduleWeekly": {
              "daysOfTheWeek": [
                "Sunday"
              ],
              "weeksOfTheMonth": [
                "First"
              ]
            },
            "retentionTimes": [
              "2022-06-13T19:30:00Z"
            ],
            "retentionDuration": {
              "count": 60,
              "durationType": "Months"
            }
          },
          "yearlySchedule": {
            "retentionScheduleFormatType": "Weekly",
            "monthsOfYear": [
              "January"
            ],
            "retentionScheduleWeekly": {
              "daysOfTheWeek": [
                "Sunday"
              ],
              "weeksOfTheMonth": [
                "First"
              ]
            },
            "retentionTimes": [
              "2022-06-13T19:30:00Z"
            ],
            "retentionDuration": {
              "count": 10,
              "durationType": "Years"
            }
          }
        }
      },
      {
        "policyType": "Differential",
        "schedulePolicy": {
          "schedulePolicyType": "SimpleSchedulePolicy",
          "scheduleRunFrequency": "Weekly",
          "scheduleRunDays": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          "scheduleRunTimes": [
            "2022-06-13T02:00:00Z"
          ],
          "scheduleWeeklyFrequency": 0
        },
        "retentionPolicy": {
          "retentionPolicyType": "SimpleRetentionPolicy",
          "retentionDuration": {
            "count": 30,
            "durationType": "Days"
          }
        }
      },
      {
        "policyType": "Log",
        "schedulePolicy": {
          "schedulePolicyType": "LogSchedulePolicy",
          "scheduleFrequencyInMins": 120
        },
        "retentionPolicy": {
          "retentionPolicyType": "SimpleRetentionPolicy",
          "retentionDuration": {
            "count": 15,
            "durationType": "Days"
          }
        }
      }
    ],
    "protectedItemsCount": 0
  },
  "resourceGroup": "SQLResourceGroup",
  "tags": null,
  "type": "Microsoft.RecoveryServices/vaults/backupPolicies"
} 
```

Once the policy is created successfully, the output of the command shows the policy JSON that you passed as a parameter while executing the command.

You can modify the following section of the policy to specify the required backup frequency and retention for differential backups.

For example:

```json
{
  "policyType": "Differential",
  "retentionPolicy": {
    "retentionDuration": {
      "count": 30,
      "durationType": "Days"
    },
    "retentionPolicyType": "SimpleRetentionPolicy"
  },
  "schedulePolicy": {
    "schedulePolicyType": "SimpleSchedulePolicy",
    "scheduleRunDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "scheduleRunFrequency": "Weekly",
    "scheduleRunTimes": [
      "2017-03-07T02:00:00+00:00"
    ],
    "scheduleWeeklyFrequency": 0
  }
}
```

Example:

If you want to have differential backups only on *Saturday* and retain them for *60 days*, do the following changes in the policy:

* Update **retentionDuration** count to 60 days.
* Specify only Saturday as **ScheduleRunDays**.

```json
 {
  "policyType": "Differential",
  "retentionPolicy": {
    "retentionDuration": {
      "count": 60,
      "durationType": "Days"
    },
    "retentionPolicyType": "SimpleRetentionPolicy"
  },
  "schedulePolicy": {
    "schedulePolicyType": "SimpleSchedulePolicy",
    "scheduleRunDays": [
      "Saturday"
    ],
    "scheduleRunFrequency": "Weekly",
    "scheduleRunTimes": [
      "2017-03-07T02:00:00+00:00"
    ],
    "scheduleWeeklyFrequency": 0
  }
}
```

## Protect the new databases added to a SQL instance

[Registering a SQL instance with a Recovery Services vault](backup-azure-sql-backup-cli.md#register-and-protect-the-sql-server) automatically discovers all databases in this instance.

However, if you've added new databases to the SQL instance later, use the [az backup protectable-item initialize](/cli/azure/backup/protectable-item#az-backup-protectable-item-initialize) command. This command discovers the new databases added.

```azurecli-interactive
az backup protectable-item initialize --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --container-name VMAppContainer;Compute;SQLResourceGroup;testSQLVM \
    --workload-type SQLDataBase
```

Then use the [az backup protectable-item list](/cli/azure/backup/protectable-item#az-backup-protectable-item-list) cmdlet to list all the databases that have been discovered on your SQL instance. This list, however, excludes those databases on which backup has already been configured. Once the database to be backed-up is discovered, refer to  [Enable backup on SQL database](backup-azure-sql-backup-cli.md#enable-backup-on-the-sql-database).

```azurecli-interactive
az backup protectable-item list --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --workload-type SQLDataBase \
	--protectable-item-type SQLDataBase \
    --output table
```

The new database that you want to back up shows in this list, which appears as:

```output
Name                            Protectable Item Type    ParentName    ServerName    IsProtected
---------------------------     ----------------------   ------------  -----------   ------------
sqldatabase;mssqlserver;db1     SQLDataBase              mssqlserver   testSQLVM	 NotProtected  
sqldatabase;mssqlserver;db2     SQLDataBase              mssqlserver   testSQLVM	 NotProtected
```

## Stop protection for an SQL database

You can stop protecting an SQL database in the following processes:

* Stop all future backup jobs and delete all recovery points.
* Stop all future backup jobs and leave the recovery points intact.

If you choose to leave recovery points, keep in mind these details:

* All recovery points remain intact forever, and all pruning stops at stop protection with retain data.
* You'll be charged for the protected instance and the consumed storage.
* If you delete a data source without stopping backups, new backups will fail.

The processes to stop protection are detailed below.

### Stop protection with retain data

To stop protection with retain data, use the [az backup protection disable](/cli/azure/backup/protection#az-backup-protection-disable)` command.

```azurecli-interactive
az backup protection disable --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --container-name VMAppContainer;Compute;SQLResourceGroup;testSQLVM \
    --item-name sqldatabase;mssqlserver;master \
    --workload-type SQLDataBase \
    --output table
```

The output appears as:

```output
Name                                  ResourceGroup
------------------------------------  ---------------  
g0f15dae-7cac-4475-d833-f52c50e5b6c3  SQLResourceGroup
```

To verify the status of this operation, use the [az backup job show](/cli/azure/backup/job#az-backup-job-show) command.

### Stop protection without retain data

To stop protection without retain data, use the [az backup protection disable](/cli/azure/backup/protection#az-backup-protection-disable) command.

```azurecli-interactive
az backup protection disable --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --container-name VMAppContainer;Compute;SQLResourceGroup;testSQLVM \
    --item-name sqldatabase;mssqlserver;master \
    --workload-type SQLDataBase \
    --delete-backup-data true \
    --output table
```

The output appears as:

```output
Name                                  ResourceGroup
------------------------------------  ---------------  
g0f15dae-7cac-4475-d833-f52c50e5b6c3  SQLResourceGroup
```

To verify the status of this operation, use the [az backup job show](/cli/azure/backup/job#az-backup-job-show) command.

## Resume protection

When you stop protection for the SQL database with retain data, you can resume protection later. If you don't retain the backed-up data, you won't be able to resume protection.

To resume protection, use the [az backup protection resume](/cli/azure/backup/protection#az-backup-protection-resume) command.

```azurecli-interactive
az backup protection resume --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --container-name VMAppContainer;Compute;SQLResourceGroup;testSQLVM \
    --policy-name SQLPolicy \
    --output table
```

The output appears as:

```output
Name                                  ResourceGroup
------------------------------------  ---------------  
b2a7f108-1020-4529-870f-6c4c43e2bb9e  SQLResourceGroup
```

To verify the status of this operation, use the [az backup job show](/cli/azure/backup/job#az-backup-job-show) command.

## Next steps

* Learn how to [back up an SQL database running on Azure VM using the Azure portal](backup-sql-server-database-azure-vms.md).
* Learn how to [manage a backed-up SQL database running on Azure VM using the Azure portal](manage-monitor-sql-database-backup.md).
