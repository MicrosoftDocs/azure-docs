---
title: Restore SQL server databases in Azure VMs using Azure Backup via CLI
description: Learn how to use CLI to restore SQL server databases in Azure VMs in the Recovery Services vault.
ms.topic: how-to
ms.date: 07/18/2023
ms.service: backup
ms.custom: devx-track-azurecli
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore SQL databases in an Azure VM using Azure CLI

\Azure CLI is used to create and manage Azure resources from the Command Line or through scripts. This article describes how to restore a backed-up SQL database on an Azure VM using Azure CLI. You can also perform these actions using the [Azure portal](restore-sql-database-azure-vm.md).

Use [Azure Cloud Shell](../cloud-shell/overview.md) to run CLI commands.

In this article, you'll learn how to:

> [!div class="checklist"]
>
> * View restore points for a backed-up database
> * Restore a database

This article assumes you've an SQL database running on Azure VM that's backed-up using Azure Backup. If you've used [Back up an SQL database in Azure using CLI](backup-azure-sql-backup-cli.md) to back up your SQL database, then you're using the following resources:

* A resource group named `SQLResourceGroup`.
* A vault named `SQLVault`.
* Protected container named `VMAppContainer;Compute;SQLResourceGroup;testSQLVM`.
* Backed-up database/item named `sqldatabase;mssqlserver;master`.
* Resources in the `westus` region.

>[!Note]
>See the [SQL backup support matrix](sql-support-matrix.md) to know more about the supported configurations and scenarios.

## View restore points for a backed-up database

To view the list of all recovery points for a database, use the [az backup recoverypoint list](/cli/azure/backup/recoverypoint#az-backup-recoverypoint-show-log-chain) command as:

```azurecli-interactive
az backup recoverypoint list --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --container-name VMAppContainer;Compute;SQLResourceGroup;testSQLVM \
    --item-name sqldatabase;mssqlserver;master \
   --output table
```

The list of recovery points appears as:

```output
Name                      Time                               BackupManagementType   Item Name               		RecoveryPointType
-------------------       ---------------------------------  ---------------------  ----------------------  		------------------
7660777527047692711       2019-12-10T04:00:32.346000+00:00   AzureWorkload          sqldatabase;mssqlserver;master  Full
7896624824685666836       2019-12-15T10:33:32.346000+00:00   AzureWorkload          sqldatabase;mssqlserver;master  Differential
DefaultRangeRecoveryPoint                                    AzureWorkload          sqldatabase;mssqlserver;master  Log
```

The list above contains three recovery points: each for full, differential, and log backup.

>[!NOTE]
>You can also view the start and end points of every unbroken log backup chain, using the [az backup recoverypoint show-log-chain](/cli/azure/backup/recoverypoint#az-backup-recoverypoint-show-log-chain) command.

## Prerequisites to restore a database

Ensure that the following prerequisites are met before restoring a database:

* You can restore the database only to an SQL instance in the same region.
* The target instance must be registered with the same vault as the source.

## Restore a database

Azure Backup can restore SQL databases that are running on Azure VMs as:

* Restore to a specific date or time (to the second) by using log backups. Azure Backup automatically determines the appropriate full, differential backups and the chain of log backups that are required to restore based on the selected time.
* Restore to a specific full or differential backup to restore to a specific recovery point.

To restore a database, use the [az restore restore-azurewl](/cli/azure/backup/restore#az-backup-restore-restore-azurewl) command, which requires a recovery config object as one of the inputs. You can generate this object using the [az backup recoveryconfig show](/cli/azure/backup/recoveryconfig#az-backup-recoveryconfig-show) command. The recovery config object contains all details to perform a restore. One of them is the restore mode – **OriginalWorkloadRestore** or **AlternateWorkloadRestore**.

>[!NOTE]
> **OriginalWorkloadRestore**: Restores data to the same SQL instance as the original source. This option overwrites the original database.
> **AlternateWorkloadRestore**: Restores database to an alternate location and keep the original source database.

## Restore to alternate location

To restore a database to an alternate location, use **AlternateWorkloadRestore** as the restore mode. You must then choose the restore point, which could be a previous point-in-time or any previous restore points.

Let's proceed to restore to a previous restore point. [View the list of restore points](#view-restore-points-for-a-backed-up-database) for the database and choose the point you want to restore. Here, let's use the restore point with the name *7660777527047692711*.

With the above restore point name and the restore mode, create the recovery config object using the [az backup recoveryconfig show](/cli/azure/backup/recoveryconfig#az-backup-recoveryconfig-show) command. Check the remaining parameters in this command:

* **--target-item-name**: The name to be used by the restored database. In this scenario, we used the name *restored_database*.
* **--target-server-name**: The name of an SQL server that's successfully registered to a Recovery Services vault and stays the same region as per the database to be restored. Here, you're restoring the database to the same SQL server that you've protected, named *testSQLVM*.
* **--target-server-type**: For the restore of SQL databases, you must use **SQLInstance**.

```azurecli-interactive

az backup recoveryconfig show --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --container-name VMAppContainer;Compute;SQLResourceGroup;testSQLVM \
    --item-name SQLDataBase;mssqlserver;master \
    --restore-mode AlternateWorkloadRestore \
    --rp-name 7660777527047692711 \
    --target-item-name restored_database \
    --target-server-name testSQLVM \
    --target-server-type SQLInstance \
    --workload-type SQLDataBase \
    --output json
```

The response to the above query is a recovery config object that appears as:

```output
{
  "container_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLResourceGroup/providers/Microsoft.RecoveryServices/vaults/SQLVault/backupFabrics/Azure/protectionContainers/vmappcontainer;compute;SQLResourceGroup;testSQLVM",
  "container_uri": "VMAppContainer;compute;SQLResourceGroup;testSQLVM",
  "database_name": "MSSQLSERVER/restored_database",
  "filepath": null,
  "item_type": "SQL",
  "item_uri": "SQLDataBase;mssqlserver;master",
  "log_point_in_time": null,
  "recovery_mode": null,
  "recovery_point_id": "7660777527047692711",
  "restore_mode": "AlternateLocation",
  "source_resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLResourceGroup/providers/Microsoft.Compute/virtualMachines/testSQLVM",
  "workload_type": "SQLDataBase",
  "alternate_directory_paths": []
}
```

Now, to restore the database, run the [az restore restore-azurewl](/cli/azure/backup/restore#az-backup-restore-restore-azurewl) command. To use this command, enter the above JSON output that's saved to a file named *recoveryconfig.json*.

```azurecli-interactive
az backup restore restore-azurewl --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --recovery-config recoveryconfig.json \
    --output table
```

The output appears as:

```output
Name                                  Operation    Status      Item Name                          Backup Management Type    Start Time UTC                    Duration
------------------------------------  -----------  ----------  ---------------------------------  ------------------------  --------------------------------  --------------
be7ea4a4-0752-4763-8570-a306b0a0106f  Restore      InProgress  master [testSQLVM]  				  AzureWorkload             2022-06-21T03:51:06.898981+00:00  0:00:05.652967
```

The response provides you with the job name. You can use this job name to track the job status using [az backup job show](/cli/azure/backup/job#az-backup-job-show) command.

## Restore and overwrite

To restore to the original location, use **OriginalWorkloadRestore** as the restore mode. You must then choose the restore point, which could be a previous point-in-time or any of the previous restore points.

As an example, let's choose the previous point-in-time "28-11-2019-09:53:00" to restore to. You can provide this restore point in the following formats: *dd-mm-yyyy, dd-mm-yyyy-hh:mm:ss*. To choose a valid point-in-time to restore, use the [az backup recoverypoint show-log-chain](/cli/azure/backup/recoverypoint#az-backup-recoverypoint-show-log-chain) command, which lists the intervals of unbroken log chain backups.

```azurecli-interactive
az backup recoveryconfig show --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --container-name VMAppContainer;Compute;SQLResourceGroup;testSQLVM \
    --item-name sqldatabase;mssqlserver;master \
    --restore-mode OriginalWorkloadRestore \
    --log-point-in-time 20-06-2022-09:02:41 \
    --output json
```

The response to the above query is a recovery config object that appears as:

```output
{
  "alternate_directory_paths": null,
  "container_id": null,
  "container_uri": "VMAppContainer;compute;petronasinternaltest;sqlserver-11",
  "database_name": null,
  "filepath": null,
  "item_type": "SQL",
  "item_uri": "SQLDataBase;mssqlserver;msdb",
  "log_point_in_time": "20-06-2022-09:02:41",
  "recovery_mode": null,
  "recovery_point_id": "DefaultRangeRecoveryPoint",
  "restore_mode": "OriginalLocation",
  "source_resource_id": "/subscriptions/62b829ee-7936-40c9-a1c9-47a93f9f3965/resourceGroups/petronasinternaltest/providers/Microsoft.Compute/virtualMachines/sqlserver-11",
  "workload_type": "SQLDataBase"
}
```

Now, to restore the database, run the [az restore restore-azurewl](/cli/azure/backup/restore#az-backup-restore-restore-azurewl) command. To use this command, enter the above JSON output that's saved to a file named *recoveryconfig.json*.

```azurecli-interactive
az backup restore restore-azurewl --resource-group sqlResourceGroup \
    --vault-name sqlVault \
    --recovery-config recoveryconfig.json \
    --output table
```

The output appears as:

```output
Name                                  Operation    Status      Item Name                        Backup Management Type    Start Time UTC                    Duration
------------------------------------  -----------  ----------  -------------------------------  ------------------------  --------------------------------  --------------
1730ec49-166a-4bfd-99d5-93027c2d8480  Restore      InProgress  master [testSQLVM]  				AzureWorkload             2022-06-21T04:04:11.161411+00:00  0:00:03.118076
```

The response provides you with the job name. You can use this job name to track the job status using the [az backup job show](/cli/azure/backup/job#az-backup-job-show) command.

## Restore to a secondary region

To restore a database to the secondary region, specify a target vault and server located in the secondary region, in the restore configuration.

```azurecli-interactive
az backup recoveryconfig show --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --container-name VMAppContainer;compute;SQLResourceGroup;testSQLVM \
    --item-name sqldatabase;mssqlserver;master \
    --restore-mode AlternateWorkloadRestore \
    --from-full-rp-name 293170069256531 \
    --rp-name 293170069256531 \
    --target-server-name targetSQLServer \
    --target-container-name VMAppContainer;compute;SQLResourceGroup;targetSQLServer \
    --target-item-name testdb_restore_1 \
    --target-server-type SQLInstance \
    --workload-type SQLDataBase \
    --target-resource-group SQLResourceGroup \
    --target-vault-name targetVault \
    --backup-management-type AzureWorkload
```

The response is a recovery configuration object that appears as:

```output
 {
  "container_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLResourceGroup/providers/Microsoft.RecoveryServices/vaults/targetVault/backupFabrics/Azure/protectionContainers/vmappcontainer;compute;SQLResourceGroup;targetSQLServer",
  "container_uri": "VMAppContainer;compute;SQLResourceGroup;testSQLVM",
  "database_name": "MSSQLSERVER/sqldatabase;mssqlserver;testdb_restore_1",
  "filepath": null,
  "item_type": "SQL",
  "item_uri": "SQLDataBase;mssqlserver;master",
  "log_point_in_time": null,
  "recovery_mode": null,
  "recovery_point_id": "932606668166874635",
  "restore_mode": "AlternateLocation",
  "source_resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLResourceGroup/providers/Microsoft.Compute/virtualMachines/testSQLVM",
  "workload_type": "SQLDataBase",
  "alternate_directory_paths": [],
}
```

Use this recovery configuration in the [az restore restore-azurewl](/cli/azure/backup/restore#az-backup-restore-restore-azurewl) command. Select the `--use-secondary-region` flag to restore the database to the secondary region.

```azurecli-interactive
az backup restore restore-azurewl --resource-group SQLResourceGroup \
    --vault-name testSQLVault \
    --recovery-config recoveryconfig.json \
    --use-secondary-region \
    --output table
```

The output appears as:

```output
Name                                  Operation           Status      Item Name                  Backup Management Type    Start Time UTC                    Duration
------------------------------------  ------------------  ----------  -------------------------  ------------------------  --------------------------------  --------------
0d863259-b0fb-4935-8736-802c6667200b  CrossRegionRestore  InProgress  master [testSQLVM] 		 AzureWorkload             2022-06-21T08:29:24.919138+00:00  0:00:12.372421
```
>[!Note]
>The RPO for the backup data to be available in secondary region is 12 hours. Therefore, when you turn on CRR, the RPO for the secondary region is 12 hours + log frequency duration (that can be set to a minimum of 15 minutes).

## Restore as files

To restore the backup data as files instead of a database, use **RestoreAsFiles** as the restore mode. Then choose the restore point, which can be a previous point-in-time or any previous restore points. Once the files are dumped to a specified path, you can take these files to any SQL machine where you want to restore them as a database. Because you can move these files to any machine, you can now restore the data across subscriptions and regions.

Here, choose the previous point-in-time `28-11-2019-09:53:00` to restore and the location to dump backup files as `/home/sql/restoreasfiles` on the same SQL server. You can provide this restore point in one of the following formats: **dd-mm-yyyy** or **dd-mm-yyyy-hh:mm:ss**. To choose a valid point-in-time to restore, use the [az backup recoverypoint show-log-chain](/cli/azure/backup/recoverypoint#az-backup-recoverypoint-show-log-chain) command, which lists the intervals of unbroken log chain backups.

With the above restore point name and the restore mode, create the recovery config object using the [az backup recoveryconfig show](/cli/azure/backup/recoveryconfig#az-backup-recoveryconfig-show) command. Check each of the remaining parameters in this command:

* **--target-container-name**: The name of a SQL server that's successfully registered to a Recovery Services vault and present in the same region as per the database to be restored. Let's restore the database as files to the same SQL server that you've protected, named *hxehost*.
* **--rp-name**: For a point-in-time restore, the restore point name is **DefaultRangeRecoveryPoint**.

```azurecli-interactive
az backup recoveryconfig show --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --container-name VMAppContainer;Compute;SQLResourceGroup;testSQLVM \
    --item-name sqldatabase;mssqlserver;master \
    --restore-mode RestoreAsFiles \
    --rp-name 932606668166874635 \
    --target-container-name VMAppContainer;Compute;SQLResourceGroup;testSQLVM \
    --filepath /sql/restoreasfiles \
    --output json
```

The response to the query above js a recovery config object that appears as:

```output
{
  "alternate_directory_paths": null,
  "container_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLResourceGroup/providers/Microsoft.RecoveryServices/vaults/SQLVault/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLResourceGroup;testSQLVM",
  "container_uri": "VMAppContainer;compute;SQLResourceGroup;testSQLVM",
  "database_name": null,
  "filepath": "/sql/restoreasfiles",
  "item_type": "SQL",
  "item_uri": "SQLDataBase;mssqlserver;master",
  "log_point_in_time": null,
  "recovery_mode": "FileRecovery",
  "recovery_point_id": "932606668166874635",
  "restore_mode": "AlternateLocation",
  "source_resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLResourceGroup/providers/Microsoft.Compute/virtualMachines/testSQLVM",
  "workload_type": "SQLDataBase"
}
```

Now, to restore the database as files run the [az restore restore-azurewl](/cli/azure/backup/restore#az-backup-restore-restore-azurewl) command. To use this command, enter the JSON output above that's saved to a file named *recoveryconfig.json*.

```azurecli-interactive
az backup restore restore-azurewl --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --restore-config recoveryconfig.json \
    --output json
```

The output appears as:

```output
{
  "eTag": null,
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLResourceGroup/providers/Microsoft.RecoveryServices/vaults/SQLVault/backupJobs/e9cd9e73-e3a3-425a-86a9-8dd1c500ff56",
  "location": null,
  "name": "e9cd9e73-e3a3-425a-86a9-8dd1c500ff56",
  "properties": {
    "actionsInfo": [
      "1"
    ],
    "activityId": "9e7c8ee4-f1ef-11ec-8a2c-3c52826c1a9a",
    "backupManagementType": "AzureWorkload",
    "duration": "0:00:04.304322",
    "endTime": null,
    "entityFriendlyName": "master [testSQLVM]",
    "errorDetails": > [!NOTE]
> Information the user should notice even if skimmingnull,
    "extendedInfo": {
      "dynamicErrorMessage": null,
      "propertyBag": {
        "Job Type": "Restore as files"
      },
      "tasksList": [
        {
          "status": "InProgress",
          "taskId": "Transfer data from vault"
        }
      ]
    },
    "isUserTriggered": true,
    "jobType": "AzureWorkloadJob",
    "operation": "Restore",
    "startTime": "2022-06-22T05:53:32.951666+00:00",
    "status": "InProgress",
    "workloadType": "SQLDataBase"
  },
  "resourceGroup": "SQLResourceGroup",
  "tags": null,
  "type": "Microsoft.RecoveryServices/vaults/backupJobs"
}
```

The response provides you with the job name. You can use this job name to track the job status using the [az backup job show](/cli/azure/backup/job#az-backup-job-show) command.

> [!NOTE]
> If you don't want to restore the entire chain but only a subset of files, follow the steps as documented [here](restore-sql-database-azure-vm.md#partial-restore-as-files).

## Cross Subscription Restore

With Cross Subscription Restore (CSR), you have the flexibility of restoring to any subscription and any vault under your tenant if restore permissions are available. By default, CSR is enabled on all Recovery Services vaults (existing and newly created vaults). 

>[!Note]
>- You can trigger Cross Subscription Restore from Recovery Services vault.
>- CSR is supported only for streaming based backup and is not supported for snapshot-based backup.
>- Cross Regional Restore (CRR) with CSR is not supported.


```azurecli
az backup vault create

```

Add the parameter `cross-subscription-restore-state` that enables you to set the CSR state of the vault during vault creation and updating.

```azurecli
az backup recoveryconfig show

```

Add the parameter `--target-subscription-id` that enables you to provide the target subscription as the input while triggering Cross Subscription Restore for SQL or HANA datasources.

**Example**:

```azurecli
   az backup vault create -g {rg_name} -n {vault_name} -l {location} --cross-subscription-restore-state Disable
   az backup recoveryconfig show --restore-mode alternateworkloadrestore --backup-management-type azureworkload -r {rp} --target-container-name {target_container} --target-item-name {target_item} --target-resource-group {target_rg} --target-server-name {target_server} --target-server-type SQLInstance --target-subscription-id {target_subscription} --target-vault-name {target_vault} --workload-type SQLDataBase --ids {source_item_id}

```

## Next steps

* Learn how to [manage SQL databases that are backed up using Azure CLI](backup-azure-sql-manage-cli.md).
* Learn how to [restore an SQL database running in Azure VM using the Azure portal](./restore-sql-database-azure-vm.md).
