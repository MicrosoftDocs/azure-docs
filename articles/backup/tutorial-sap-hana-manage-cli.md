---
title: 'Tutorial: Manage backed-up SAP HANA DB using CLI' 
description: In this tutorial, learn how to manage backed-up SAP HANA databases running on an Azure VM using Azure CLI.
ms.topic: tutorial
ms.date: 12/4/2019 
ms.custom: devx-track-azurecli
---

# Tutorial: Manage SAP HANA databases in an Azure VM using Azure CLI

Azure CLI is used to create and manage Azure resources from the Command Line or through scripts. This documentation details how to manage a backed-up SAP HANA database on Azure VM - all using Azure CLI. You can also perform these steps using [the Azure portal](./sap-hana-db-manage.md).

Use [Azure Cloud Shell](tutorial-sap-hana-backup-cli.md) to run CLI commands.

By the end of this tutorial, you'll be able to:

> [!div class="checklist"]
>
> * Monitor backup and restore jobs
> * Protect new databases added to an SAP HANA instance
> * Change the policy
> * Stop protection
> * Resume protection

If you've used [Back up an SAP HANA database in Azure using CLI](tutorial-sap-hana-backup-cli.md) to back up your SAP HANA database, then you're using the following resources:

* a resource group named *saphanaResourceGroup*
* a vault named *saphanaVault*
* protected container named *VMAppContainer;Compute;saphanaResourceGroup;saphanaVM*
* backed-up database/item named *saphanadatabase;hxe;hxe*
* resources in the *westus2* region

Azure CLI makes it easy to manage an SAP HANA database running on an Azure VM that's backed-up using Azure Backup. This tutorial details each of the management operations.

## Monitor backup and restore jobs

To monitor completed or currently running jobs (backup or restore), use the [az backup job list](/cli/azure/backup/job#az_backup_job_list) cmdlet. CLI also allows you to [suspend a currently running job](/cli/azure/backup/job#az_backup_job_stop) or [wait until a job completes](/cli/azure/backup/job#az_backup_job_wait).

```azurecli-interactive
az backup job list --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --output table
```

The output will look something like this:

```output
Name                                  Operation              Status      Item Name       Start Time UTC
------------------------------------  ---------------        ---------   ----------      -------------------  
e0f15dae-7cac-4475-a833-f52c50e5b6c3  ConfigureBackup        Completed   hxe             2019-12-03T03:09:210831+00:00  
ccdb4dce-8b15-47c5-8c46-b0985352238f  Backup (Full)          Completed   hxe [hxehost]   2019-12-01T10:30:58.867489+00:00
4980af91-1090-49a6-ab96-13bc905a5282  Backup (Differential)  Completed   hxe [hxehost]   2019-12-01T10:36:00.563909+00:00
F7c68818-039f-4a0f-8d73-e0747e68a813  Restore (Log)          Completed   hxe [hxehost]   2019-12-03T05:44:51.081607+00:00
```

## Change policy

To change the policy underlying the SAP HANA backup configuration, use the [az backup policy set](/cli/azure/backup/policy#az_backup_policy_set) cmdlet. The name parameter in this cmdlet refers to the backup item whose policy we want to change. For this tutorial, we'll be replacing the policy of our SAP HANA database *saphanadatabase;hxe;hxe* with a new policy *newsaphanaPolicy*. New policies can be created using the [az backup policy create](/cli/azure/backup/policy#az_backup_policy_create) cmdlet.

```azurecli-interactive
az backup item set policy --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --container-name VMAppContainer;Compute;saphanaResourceGroup;saphanaVM \
    --policy-name newsaphanaPolicy \
    --name saphanadatabase;hxe;hxe \
```

The output should look like this:

```output
Name                                  Resource Group
------------------------------------- --------------
cb110094-9b15-4c55-ad45-6899200eb8dd  SAPHANA
```

## Create incremental backup policy

To create an incremental backup policy, execute the [az backup policy create](/cli/azure/backup/policy#az_backup_policy_create) command with the following parameters:

* **--backup-management-type** – Azure Workload
* **--workload-type** - SAPHana
* **--name** – Name of the policy
* **--policy** - JSON file with appropriate details for schedule and retention
* **--resource-group** - Resource group of the vault
* **--vault-name** – Name of the vault

Example:

```azurecli
az backup policy create --resource-group saphanaResourceGroup --vault-name saphanaVault --name sappolicy --backup-management-type AzureWorkload --policy sappolicy.json --workload-type SAPHana
```

Sample JSON (sappolicy.json):

```json
  "eTag": null,
  "id": "/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/saphanaResourceGroup/providers/Microsoft.RecoveryServices/vaults/saphanaVault/backupPolicies/sappolicy",
  "location": null,
  "name": "sappolicy",
  "properties": {
    "backupManagementType": "AzureWorkload",
    "makePolicyConsistent": null,
    "protectedItemsCount": 0,
    "settings": {
      "isCompression": false,
      "issqlcompression": false,
      "timeZone": "UTC"
    },
    "subProtectionPolicy": [
      {
        "policyType": "Full",
        "retentionPolicy": {
          "dailySchedule": null,
          "monthlySchedule": {
            "retentionDuration": {
              "count": 60,
              "durationType": "Months"
            },
            "retentionScheduleDaily": null,
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
              "2021-01-19T00:30:00+00:00"
            ]
          },
          "retentionPolicyType": "LongTermRetentionPolicy",
          "weeklySchedule": {
            "daysOfTheWeek": [
              "Sunday"
            ],
            "retentionDuration": {
              "count": 104,
              "durationType": "Weeks"
            },
            "retentionTimes": [
              "2021-01-19T00:30:00+00:00"
            ]
          },
          "yearlySchedule": {
            "monthsOfYear": [
              "January"
            ],
            "retentionDuration": {
              "count": 10,
              "durationType": "Years"
            },
            "retentionScheduleDaily": null,
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
              "2021-01-19T00:30:00+00:00"
            ]
          }
        },
        "schedulePolicy": {
          "schedulePolicyType": "SimpleSchedulePolicy",
          "scheduleRunDays": [
            "Sunday"
          ],
          "scheduleRunFrequency": "Weekly",
          "scheduleRunTimes": [
            "2021-01-19T00:30:00+00:00"
          ],
          "scheduleWeeklyFrequency": 0
        }
      },
      {
        "policyType": "Incremental",
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
      },
      {
        "policyType": "Log",
        "retentionPolicy": {
          "retentionDuration": {
            "count": 15,
            "durationType": "Days"
          },
          "retentionPolicyType": "SimpleRetentionPolicy"
        },
        "schedulePolicy": {
          "scheduleFrequencyInMins": 120,
          "schedulePolicyType": "LogSchedulePolicy"
        }
      }
    ],
    "workLoadType": "SAPHanaDatabase"
  },
  "resourceGroup": "saphanaResourceGroup",
  "tags": null,
  "type": "Microsoft.RecoveryServices/vaults/backupPolicies"
} 
```

Once the policy is created successfully, the output of the command will display the policy JSON that you passed as a parameter while executing the command.

You can modify the following section of the policy to specify the desired backup frequency and retention for incremental backups.

For example:

```json
{
  "policyType": "Incremental",
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

If you want to have incremental backups only on Saturday and retain them for 60 days, make the following changes in the policy:

* Update **retentionDuration** count to 60 days
* Specify only Saturday as **ScheduleRunDays**

```json
 {
  "policyType": "Incremental",
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

## Protect new databases added to an SAP HANA instance

[Registering an SAP HANA instance with a Recovery Services vault](tutorial-sap-hana-backup-cli.md#register-and-protect-the-sap-hana-instance) automatically discovers all the databases on this instance.

However, in cases when new databases are added to the SAP HANA instance later, use the [az backup protectable-item initialize](/cli/azure/backup/protectable-item#az_backup_protectable_item_initialize) cmdlet. This cmdlet discovers the new databases added.

```azurecli-interactive
az backup protectable-item initialize --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --container-name VMAppContainer;Compute;saphanaResourceGroup;saphanaVM \
    --workload-type SAPHANA
```

Then use the [az backup protectable-item list](/cli/azure/backup/protectable-item#az_backup_protectable_item_list) cmdlet to list all the databases that have been discovered on your SAP HANA instance. This list, however, excludes those databases on which backup has already been configured. Once the database to be backed-up is discovered, refer to  [Enable backup on SAP HANA database](tutorial-sap-hana-backup-cli.md#enable-backup-on-sap-hana-database).

```azurecli-interactive
az backup protectable-item list --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --workload-type SAPHANA \
    --output table
```

The new database that you want to back up will show up in this list, which will look as follows:

```output
Name                            Protectable Item Type    ParentName    ServerName    IsProtected
---------------------------     ----------------------   ------------  -----------   ------------
saphanasystem;hxe               SAPHanaSystem            HXE           hxehost       NotProtected  
saphanadatabase;hxe;systemdb    SAPHanaDatabase          HXE           hxehost       NotProtected
saphanadatabase;hxe;newhxe      SAPHanaDatabase          HXE           hxehost       NotProtected
```

## Stop protection for an SAP HANA database

You can stop protecting an SAP HANA database in a couple of ways:

* Stop all future backup jobs and delete all recovery points.
* Stop all future backup jobs and leave the recovery points intact.

If you choose to leave recovery points, keep these details in mind:

* All recovery points will remain intact forever, and all pruning will stop at stop protection with retain data.
* You'll be charged for the protected instance and the consumed storage.
* If you delete a data source without stopping backups, new backups will fail.

Let's look at each of the ways to stop protection in more detail.

### Stop protection with retain data

To stop protection with retain data, use the [az backup protection disable](/cli/azure/backup/protection#az_backup_protection_disable) cmdlet.

```azurecli-interactive
az backup protection disable --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --container-name VMAppContainer;Compute;saphanaResourceGroup;saphanaVM \
    --item-name saphanadatabase;hxe;hxe \
    --workload-type SAPHANA \
    --output table
```

The output should look like this:

```output
Name                                  ResourceGroup
------------------------------------  ---------------  
g0f15dae-7cac-4475-d833-f52c50e5b6c3  saphanaResourceGroup
```

To check the status of this operation, use the [az backup job show](/cli/azure/backup/job#az_backup_job_show) cmdlet.

### Stop protection without retain data

To stop protection without retain data, use the [az backup protection disable](/cli/azure/backup/protection#az_backup_protection_disable) cmdlet.

```azurecli-interactive
az backup protection disable --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --container-name VMAppContainer;Compute;saphanaResourceGroup;saphanaVM \
    --item-name saphanadatabase;hxe;hxe \
    --workload-type SAPHANA \
    --delete-backup-data true \
    --output table
```

The output should look like this:

```output
Name                                  ResourceGroup
------------------------------------  ---------------  
g0f15dae-7cac-4475-d833-f52c50e5b6c3  saphanaResourceGroup
```

To check the status of this operation, use the [az backup job show](/cli/azure/backup/job#az_backup_job_show) cmdlet.

## Resume protection

When you stop protection for the SAP HANA database with retain data, you can later resume protection. If you don't retain the backed-up data, you won't be able to resume protection.

To resume protection, use the [az backup protection resume](/cli/azure/backup/protection#az_backup_protection_resume) cmdlet.

```azurecli-interactive
az backup protection resume --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --container-name VMAppContainer;Compute;saphanaResourceGroup;saphanaVM \
    --policy-name saphanaPolicy \
    --output table
```

The output should look like this:

```output
Name                                  ResourceGroup
------------------------------------  ---------------  
b2a7f108-1020-4529-870f-6c4c43e2bb9e  saphanaResourceGroup
```

To check the status of this operation, use the [az backup job show](/cli/azure/backup/job#az_backup_job_show) cmdlet.

## Next steps

* To learn how to back up an SAP HANA database running on Azure VM using the Azure portal, refer to [Backup SAP HANA databases on Azure VMs](./backup-azure-sap-hana-database.md)

* To learn how to manage a backed-up SAP HANA database running on Azure VM using the Azure portal, refer to [Manage Backed up SAP HANA databases on Azure VM](./sap-hana-db-manage.md)