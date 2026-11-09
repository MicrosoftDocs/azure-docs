---
title: Restore SQL server databases in Azure VMs using Azure Backup via CLI
description: Learn how to use CLI to restore SQL server databases in Azure VMs in the Recovery Services vault.
ms.topic: how-to
ms.date: 08/28/2026
ms.service: azure-backup
ms.custom: devx-track-azurecli, engagement-fy24
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a database administrator, I want to restore SQL server databases in Azure VMs using the command line, so that I can efficiently manage backups and recover data based on specific scenarios or requirements."
---

# Restore SQL databases in an Azure VM using Azure CLI

Azure CLI is used to create and manage Azure resources from the Command Line or through scripts. This article describes how to restore a backed-up SQL database on an Azure VM using Azure CLI. You can also perform these actions using the [Azure portal](restore-sql-database-azure-vm.md).

Use [Azure Cloud Shell](../cloud-shell/overview.md) to run CLI commands.

This article assumes you have an SQL database running on Azure VM that's backed-up using Azure Backup. If you've used [Back up an SQL database in Azure using CLI](backup-azure-sql-backup-cli.md) to back up your SQL database, then you're using the following resources:

* A resource group named `SQLResourceGroup`.
* A vault named `SQLVault`.
* Protected container named `VMAppContainer;Compute;SQLResourceGroup;testSQLVM`.
* A backed-up database/item named `sqldatabase;mssqlserver;testdb`.
* Resources in the `westus` region.

To view the backup and restore scenarios that we support today, see the [support matrix](sql-support-matrix.md#scenario-support). For common questions, see the [frequently asked questions](faq-backup-sql-server.yml).

## View restore points for a backed-up database

To view the list of all recovery points for a database, use the [az backup recoverypoint list](/cli/azure/backup/recoverypoint#az-backup-recoverypoint-show-log-chain) command as:

```azurecli-interactive
az backup recoverypoint list --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --container-name "VMAppContainer;Compute;SQLResourceGroup;testSQLVM" \
    --item-name "sqldatabase;mssqlserver;testdb" \
   --output table
```

The list of recovery points appears as:

```output
Name                      Time                               BackupManagementType   Item Name               		RecoveryPointType
-------------------       ---------------------------------  ---------------------  ----------------------  		------------------
7660777527047692711       2019-12-10T04:00:32.346000+00:00   AzureWorkload          sqldatabase;mssqlserver;testdb  Full
7896624824685666836       2019-12-15T10:33:32.346000+00:00   AzureWorkload          sqldatabase;mssqlserver;testdb  Differential
DefaultRangeRecoveryPoint                                    AzureWorkload          sqldatabase;mssqlserver;testdb  Log
```

The list above contains three recovery points: each for full, differential, and log backup.

>[!NOTE]
>You can also view the start and end points of every unbroken log backup chain, using the [az backup recoverypoint show-log-chain](/cli/azure/backup/recoverypoint#az-backup-recoverypoint-show-log-chain) command.

## Prerequisites to restore a database

Ensure that the following prerequisites are met before restoring a database:

* You can restore the database only to an SQL instance in the same region or to a different region if Cross Region Restore is enabled on the vault.
* The target instance must be registered with the same vault as the source, except during Cross Region Restore and Cross Subscription Restore. .

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
    --container-name "VMAppContainer;Compute;SQLResourceGroup;testSQLVM" \
    --item-name "SQLDataBase;mssqlserver;testdb" \
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
  "item_uri": "SQLDataBase;mssqlserver;testdb",
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
be7ea4a4-0752-4763-8570-a306b0a0106f  Restore      InProgress  testdb [testSQLVM]  				  AzureWorkload             2022-06-21T03:51:06.898981+00:00  0:00:05.652967
```

The response provides you with the job name. You can use this job name to track the job status using [az backup job show](/cli/azure/backup/job#az-backup-job-show) command.

## Restore and overwrite

To restore to the original location, use **OriginalWorkloadRestore** as the restore mode. You must then choose the restore point, which could be a previous point-in-time or any of the previous restore points.

As an example, let's choose the previous point-in-time "28-11-2019-09:53:00" to restore to. You can provide this restore point in the following formats: *dd-mm-yyyy, dd-mm-yyyy-hh:mm:ss*. To choose a valid point-in-time to restore, use the [az backup recoverypoint show-log-chain](/cli/azure/backup/recoverypoint#az-backup-recoverypoint-show-log-chain) command, which lists the intervals of unbroken log chain backups.

```azurecli-interactive
az backup recoveryconfig show --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --container-name "VMAppContainer;Compute;SQLResourceGroup;testSQLVM" \
    --item-name "sqldatabase;mssqlserver;testdb" \
    --restore-mode OriginalWorkloadRestore \
    --log-point-in-time 20-06-2022-09:02:41 \
    --output json
```

The response to the above query is a recovery config object that appears as:

```output
{
  "alternate_directory_paths": null,
  "container_id": null,
  "container_uri": "VMAppContainer;Compute;SQLResourceGroup;testSQLVM",
  "database_name": null,
  "filepath": null,
  "item_type": "SQL",
  "item_uri": "SQLDataBase;mssqlserver;testdb",
  "log_point_in_time": "20-06-2022-09:02:41",
  "recovery_mode": null,
  "recovery_point_id": "DefaultRangeRecoveryPoint",
  "restore_mode": "OriginalLocation",
  "source_resource_id": "/subscriptions/62b829ee-7936-40c9-a1c9-47a93f9f3965/resourceGroups/SQLResourceGroup/providers/Microsoft.Compute/virtualMachines/testSQLVM",
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
1730ec49-166a-4bfd-99d5-93027c2d8480  Restore      InProgress  testdb [testSQLVM]  				AzureWorkload             2022-06-21T04:04:11.161411+00:00  0:00:03.118076
```

The response provides you with the job name. You can use this job name to track the job status using the [az backup job show](/cli/azure/backup/job#az-backup-job-show) command.

## Restore to a secondary region

To restore a database to the secondary region, specify a target vault and server located in the secondary region, in the restore configuration.

```azurecli-interactive
az backup recoveryconfig show --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --container-name "VMAppContainer;compute;SQLResourceGroup;testSQLVM" \
    --item-name "sqldatabase;mssqlserver;testdb" \
    --restore-mode AlternateWorkloadRestore \
    --from-full-rp-name 293170069256531 \
    --rp-name 293170069256531 \
    --target-server-name targetSQLServer \
    --target-container-name "VMAppContainer;compute;SQLResourceGroup;targetSQLServer" \
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
  "database_name": "MSSQLSERVER/testdb_restore_1",
  "filepath": null,
  "item_type": "SQL",
  "item_uri": "SQLDataBase;mssqlserver;testdb",
  "log_point_in_time": null,
  "recovery_mode": null,
  "recovery_point_id": "293170069256531",
  "restore_mode": "AlternateLocation",
  "source_resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLResourceGroup/providers/Microsoft.Compute/virtualMachines/testSQLVM",
  "workload_type": "SQLDataBase",
  "alternate_directory_paths": []
}
```

Use this recovery configuration in the [az restore restore-azurewl](/cli/azure/backup/restore#az-backup-restore-restore-azurewl) command. Select the `--use-secondary-region` flag to restore the database to the secondary region.

```azurecli-interactive
az backup restore restore-azurewl --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --recovery-config recoveryconfig.json \
    --use-secondary-region \
    --output table
```

The output appears as:

```output
Name                                  Operation           Status      Item Name                  Backup Management Type    Start Time UTC                    Duration
------------------------------------  ------------------  ----------  -------------------------  ------------------------  --------------------------------  --------------
0d863259-b0fb-4935-8736-802c6667200b  CrossRegionRestore  InProgress  testdb [testSQLVM] 		 AzureWorkload             2022-06-21T08:29:24.919138+00:00  0:00:12.372421
```
>[!Note]
>The RPO for the backup data to be available in secondary region is 12 hours. Therefore, when you turn on CRR, the RPO for the secondary region is 12 hours + log frequency duration (that can be set to a minimum of 15 minutes).

## Restore as files

To restore the backup data as files instead of a database, use **RestoreAsFiles** as the restore mode. Then choose the restore point, which can be a previous point-in-time or any previous restore points. Once the files are dumped to a specified path, you can take these files to any SQL machine where you want to restore them as a database. Because you can move these files to any machine, you can now restore the data across subscriptions and regions.

Choose the previous point-in-time `28-11-2019-09:53:00` to restore and the location to dump backup files as `C:\restoreasfiles` on the same SQL server. You can provide this restore point in one of the following formats: **dd-mm-yyyy** or **dd-mm-yyyy-hh:mm:ss**. To choose a valid point-in-time to restore, use the [az backup recoverypoint show-log-chain](/cli/azure/backup/recoverypoint#az-backup-recoverypoint-show-log-chain) command, which lists the intervals of unbroken log chain backups.

With the above restore point name and the restore mode, create the recovery config object using the [az backup recoveryconfig show](/cli/azure/backup/recoveryconfig#az-backup-recoveryconfig-show) command. Check each of the remaining parameters in this command:

* **--target-container-name**: The name of a SQL server that's successfully registered to a Recovery Services vault and present in the same region as per the database to be restored. Let's restore the database as files to the same SQL server that you protected, named *mssqlserver*.
* **--rp-name**: For a point-in-time restore, the restore point name is **DefaultRangeRecoveryPoint**.

```azurecli-interactive
az backup recoveryconfig show --resource-group SQLResourceGroup \
    --vault-name SQLVault \
    --container-name "VMAppContainer;Compute;SQLResourceGroup;testSQLVM" \
    --item-name "sqldatabase;mssqlserver;testdb" \
    --restore-mode RestoreAsFiles \
    --rp-name 932606668166874635 \
    --target-container-name "VMAppContainer;Compute;SQLResourceGroup;testSQLVM" \
    --filepath "C:\restoreasfiles" \
    --output json
```

The response to the query above js a recovery config object that appears as:

```output
{
  "alternate_directory_paths": null,
  "container_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLResourceGroup/providers/Microsoft.RecoveryServices/vaults/SQLVault/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLResourceGroup;testSQLVM",
  "container_uri": "VMAppContainer;compute;SQLResourceGroup;testSQLVM",
  "database_name": null,
  "filepath": "C:\restoreasfiles",
  "item_type": "SQL",
  "item_uri": "SQLDataBase;mssqlserver;testdb",
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
    --recovery-config recoveryconfig.json \
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
    "entityFriendlyName": "testdb [testSQLVM]",
    "errorDetails": null,
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
   az backup vault create -g {rg_name} -n {vault_name} -l {location} --cross-subscription-restore-state Enable
   az backup recoveryconfig show --restore-mode alternateworkloadrestore --backup-management-type azureworkload -r {rp} --target-container-name {target_container} --target-item-name {target_item} --target-resource-group {target_rg} --target-server-name {target_server} --target-server-type SQLInstance --target-subscription-id {target_subscription} --target-vault-name {target_vault} --workload-type SQLDataBase --ids {source_item_id}

```

## Restore SQL instance snapshots

The following examples use **PowerShell shell syntax**, not Bash. Use an Azure CLI version that exposes the snapshot options shown in this article. Review the [snapshot restore prerequisites](back-up-sql-server-instance-snapshot-restore.md) and [support matrix](sql-support-matrix.md#sql-server-instance-snapshot-backups-supported-scenarios).

Replace placeholders before use. Complete the common setup and choose only the required restore scenario. The following examples are alternatives, not a script to execute in full. Restore commands can overwrite data or change disk attachments.

### Set up snapshot restore variables

Use the **vault's** subscription for `$vaultSubscription`. Prepare the target resource group and user-assigned managed identity with the required permissions:

```powershell
$vaultSubscription = "<vault-subscription-id>"
$vaultRg = "<vault-rg>"
$vaultName = "<vault-name>"
$sourceVm = "<source-vm-name>"
$targetVm = "<target-vm-name>"
$targetInstanceName = "<target-instance-name>"
$restoreRg = "<restore-resource-group>"
$uamiId = "/subscriptions/<subscription-id>/resourceGroups/<identity-rg>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>"
$vaultArgs = @("--subscription", $vaultSubscription, "--resource-group", $vaultRg, "--vault-name", $vaultName)

az backup vault show --subscription $vaultSubscription --resource-group $vaultRg --name $vaultName
az backup container list @vaultArgs --backup-management-type AzureWorkload `
  --query "[].{Name:name,VM:properties.friendlyName}" --output table
$containerName = "<native-source-container-name>"
$targetContainerName = "<native-target-container-name>"
$sourceArgs = $vaultArgs + @("--container-name", $containerName, "--backup-management-type", "AzureWorkload")

az backup item list @sourceArgs --workload-type SQLInstance --output json
$instanceItemName = "<native-protected-instance-item-name>"
$instanceArgs = $sourceArgs + @("--item-name", $instanceItemName, "--workload-type", "SQLInstance")
```

Copy exact native container and protected item names from the service output. The source and destination setup above uses the same vault. For alternate-location restores, verify that the target instance is discoverable:

```powershell
az backup protectable-item show @vaultArgs --workload-type MSSQL `
  --protectable-item-type SQLInstance --name $targetInstanceName --server-name $targetVm
```

The long options in these examples also support the following shorter aliases:

| Long option | Alias |
| --- | --- |
| `--restore-point-query-type` | `--rp-query-type` |
| `--get-latest-recovery-point-only` | `--latest-rp-only` |
| `--base-snapshot-recovery-point-id` | `--base-snapshot-rp-id` |
| `--base-recovery-point-datasource-id` | `--base-datasource-id` |

### Query snapshot recovery points

List all requested recovery-point types for a time window, only snapshots, or only the latest snapshot:

```powershell
$startDate = (Get-Date).ToUniversalTime().AddDays(-7).ToString("dd-MM-yyyy-HH:mm:ss")
$endDate = (Get-Date).ToUniversalTime().ToString("dd-MM-yyyy-HH:mm:ss")
az backup recoverypoint list @instanceArgs --start-date $startDate --end-date $endDate `
  --restore-point-query-type FullDifferentialAndSnapshot --output json
az backup recoverypoint list @instanceArgs --restore-point-query-type Snapshot --output json
az backup recoverypoint list @instanceArgs --restore-point-query-type Snapshot `
  --get-latest-recovery-point-only true --output json
```

Choose a recovery point explicitly; don't assume list ordering. Retrieve its full details to inspect included databases and filesystem information:

```powershell
$snapshotRpName = "<selected-snapshot-recovery-point-name>"
$snapshotJson = az backup recoverypoint show @instanceArgs --name $snapshotRpName --output json
if ($LASTEXITCODE -ne 0) { throw "Could not read the selected snapshot recovery point." }
$snapshotRp = $snapshotJson | ConvertFrom-Json

$snapshotRp.properties.extendedInfo.includedDatabases | Select-Object datasourceName, datasourceId
$snapshotRp.properties.extendedInfo.snapshotRecoveryPointInfo.snapshotResourceGroup
$snapshotRp.properties.extendedInfo.snapshotRecoveryPointInfo.sourceFilesystemInfo |
  Select-Object label, fileSystemType, accessPaths, isOnStorageSpace, storageSpaceInfo, diskInfoList
```

### Query snapshot-based log ranges

Retrieve the **instance's** `protectedItemDataSourceId`. This ID is the base data source for log queries, not the data source ID of an individual database.

```powershell
$instanceJson = az backup item show @sourceArgs --name $instanceItemName `
  --workload-type SQLInstance --output json
if ($LASTEXITCODE -ne 0) { throw "Could not read the protected instance." }
$instanceItem = $instanceJson | ConvertFrom-Json
$instanceDatasourceId = $instanceItem.properties.protectedItemDataSourceId

az backup item list @sourceArgs --workload-type MSSQL --output json
$dbItemName = "<selected-native-database-item-name>"
$databaseArgs = $sourceArgs + @("--item-name", $dbItemName, "--workload-type", "MSSQL")
az backup recoverypoint show-log-chain @databaseArgs `
  --recovery-mode SnapshotAttachAndRecover `
  --base-snapshot-recovery-point-id $snapshotRpName `
  --base-recovery-point-datasource-id $instanceDatasourceId --output json
```

Select a database item that corresponds to one of the snapshot's included databases. Use `show-log-chain` for continuous recovery time ranges, rather than treating individual recovery points as log ranges.

### Instance original-location restore

Generate the original-location restore (OLR) configuration.

```powershell
$configFile = ".\instance-olr.json"
az backup recoveryconfig show @instanceArgs --rp-name $snapshotRpName `
  --restore-mode OriginalWorkloadRestore --recovery-mode SnapshotAttachAndRecover `
  --snapshot-rg $restoreRg --identity-arm-id $uamiId --output json |
  Set-Content -Encoding utf8 $configFile
```

Before submitting, [inspect the volume mappings](#review-and-submit-a-snapshot-restore). Original-location restore can overwrite the original databases.

### Instance alternate-location restore

Use the destination container, server, and SQL instance. Set `--target-item-name` to the required target database name or a service-supported instance naming pattern:

```powershell
$configFile = ".\instance-alr.json"
az backup recoveryconfig show @instanceArgs --rp-name $snapshotRpName `
  --restore-mode AlternateWorkloadRestore --recovery-mode SnapshotAttachAndRecover `
  --target-container-name $targetContainerName --target-server-name $targetVm `
  --target-server-type SQLInstance --target-instance-name $targetInstanceName `
  --target-item-name "<target-database-name-or-service-supported-instance-pattern>" `
  --snapshot-rg $restoreRg --identity-arm-id $uamiId --output json |
  Set-Content -Encoding utf8 $configFile
```

### Instance point-in-time restore

Use the selected instance snapshot and its base datasource ID from the earlier queries. Resolve every included database to a unique protected item, then query its log ranges above that snapshot:

```powershell
$includedDatabases = @($snapshotRp.properties.extendedInfo.includedDatabases)
if ($includedDatabases.Count -eq 0) { throw "The snapshot has no included databases." }
$itemsJson = az backup item list @sourceArgs --workload-type MSSQL --output json
if ($LASTEXITCODE -ne 0) { throw "Could not list protected databases." }
$databaseItems = @($itemsJson | ConvertFrom-Json)
$logRangesPerDb = @{}
foreach ($database in $includedDatabases) {
  $matchingItems = @($databaseItems | Where-Object {
    $_.properties.protectedItemDataSourceId -eq $database.datasourceId
  })
  if ($matchingItems.Count -eq 0) {
    $matchingItems = @($databaseItems | Where-Object {
      $_.name -eq "SQLDataBase;$($database.datasourceName)" -or
      $_.properties.friendlyName -eq $database.datasourceName
    })
  }
  if ($matchingItems.Count -ne 1) {
    throw "Could not uniquely resolve included database $($database.datasourceName)."
  }
  $rangesJson = az backup recoverypoint show-log-chain @sourceArgs `
    --item-name $matchingItems[0].name --workload-type MSSQL `
    --recovery-mode SnapshotAttachAndRecover `
    --base-snapshot-recovery-point-id $snapshotRpName `
    --base-recovery-point-datasource-id $instanceDatasourceId `
    --query "[].properties.timeRanges[]" --output json
  if ($LASTEXITCODE -ne 0) { throw "Could not query snapshot-based log ranges." }
  $logRangesPerDb[$database.datasourceName] = @(
    foreach ($range in ($rangesJson | ConvertFrom-Json)) {
      if (-not $range.startTime -or -not $range.endTime) {
        throw "The service returned a log range without startTime or endTime."
      }
      [PSCustomObject]@{
        ItemName = $matchingItems[0].name
        StartTime = ([DateTimeOffset]$range.startTime).UtcDateTime
        EndTime = ([DateTimeOffset]$range.endTime).UtcDateTime
      }
    }
  )
  if ($logRangesPerDb[$database.datasourceName].Count -eq 0) {
    throw "No snapshot-based log ranges for $($database.datasourceName)."
  }
}
```

Inspect a database's ranges and choose a UTC time. The following example chooses the latest end time for that database, then verifies that the time is also available for **every included database**. If validation fails, select a time within the common available ranges and rerun the check:

```powershell
$selectedDatabase = "<instance-name>;<database-name>"
if (-not $logRangesPerDb.ContainsKey($selectedDatabase)) {
  throw "Select a database from logRangesPerDb.Keys."
}
$selectedRanges = @($logRangesPerDb[$selectedDatabase] | Sort-Object EndTime)
$selectedRanges | Format-Table ItemName, StartTime, EndTime
$rangeIndex = -1
$pointInTime = $selectedRanges[$rangeIndex].EndTime
foreach ($databaseName in $logRangesPerDb.Keys) {
  $matchingRanges = @($logRangesPerDb[$databaseName] | Where-Object {
    $_.StartTime -le $pointInTime -and $_.EndTime -ge $pointInTime
  })
  if ($matchingRanges.Count -eq 0) {
    throw "The chosen restore time is unavailable for $databaseName."
  }
}
$pit = $pointInTime.ToString("dd-MM-yyyy-HH:mm:ss")
```

Generate the PITR configuration using the base snapshot and the validated log replay time:

```powershell
$configFile = ".\instance-pit.json"
az backup recoveryconfig show @instanceArgs --rp-name $snapshotRpName --log-point-in-time $pit `
  --restore-mode AlternateWorkloadRestore --recovery-mode SnapshotAttachAndRecover `
  --target-container-name $targetContainerName --target-server-name $targetVm `
  --target-server-type SQLInstance --target-instance-name $targetInstanceName `
  --target-item-name "<target-database-name-or-service-supported-instance-pattern>" `
  --snapshot-rg $restoreRg --identity-arm-id $uamiId --no-recovery-mode `
  --output json | Set-Content -Encoding utf8 $configFile
```

`--no-recovery-mode` requests that databases remain nonrecovered for subsequent recovery steps. Review whether that behavior is appropriate for your recovery plan.

### Instance restore as disks

Use `SnapshotAttach` for restore as disks (RAD), rather than snapshot attachment followed by database recovery:

```powershell
$configFile = ".\instance-rad.json"
az backup recoveryconfig show @instanceArgs --rp-name $snapshotRpName `
  --restore-mode AlternateWorkloadRestore --recovery-mode SnapshotAttach `
  --target-container-name $targetContainerName --target-server-name $targetVm `
  --target-server-type SQLInstance --target-instance-name $targetInstanceName `
  --snapshot-rg $restoreRg --identity-arm-id $uamiId --output json |
  Set-Content -Encoding utf8 $configFile
```

### Restore a database protected under an instance

Select the exact native database item name from the source container. For recovery-point restores, choose a database snapshot explicitly:

```powershell
az backup item list @sourceArgs --workload-type MSSQL --output json
$dbItemName = "<native-protected-database-item-name>"
$databaseArgs = $sourceArgs + @("--item-name", $dbItemName, "--workload-type", "MSSQL")
az backup recoverypoint list @databaseArgs --restore-point-query-type Snapshot --output json
$dbSnapshotRpName = "<chosen-database-snapshot-recovery-point-name>"
az backup recoverypoint show @databaseArgs --name $dbSnapshotRpName --output json
```

#### Database alternate-location restore

```powershell
$configFile = ".\database-alr.json"
az backup recoveryconfig show @databaseArgs --rp-name $dbSnapshotRpName `
  --restore-mode AlternateWorkloadRestore --recovery-mode SnapshotAttachAndRecover `
  --target-container-name $targetContainerName --target-server-name $targetVm `
  --target-server-type SQLInstance --target-instance-name $targetInstanceName `
  --target-item-name "<restored-db-name>" --snapshot-rg $restoreRg `
  --identity-arm-id $uamiId --no-recovery-mode --output json |
  Set-Content -Encoding utf8 $configFile
```

#### Database point-in-time restore

Query available log ranges and choose a UTC time inside a returned range. Use the `dd-MM-yyyy-HH:mm:ss` format:

```powershell
az backup recoverypoint show-log-chain @databaseArgs --output json
$pit = "<dd-MM-yyyy-HH:mm:ss-in-UTC-within-a-returned-range>"
$configFile = ".\database-pit.json"
az backup recoveryconfig show @databaseArgs --log-point-in-time $pit `
  --restore-mode AlternateWorkloadRestore --recovery-mode SnapshotAttachAndRecover `
  --target-container-name $targetContainerName --target-server-name $targetVm `
  --target-server-type SQLInstance --target-instance-name $targetInstanceName `
  --target-item-name "<restored-db-name>" --snapshot-rg $restoreRg `
  --identity-arm-id $uamiId --no-recovery-mode --output json |
  Set-Content -Encoding utf8 $configFile
```

The preceding database restore examples also use `--no-recovery-mode`. Review that setting before submission.

#### Database restore as disks

```powershell
$configFile = ".\database-rad.json"
az backup recoveryconfig show @databaseArgs --rp-name $dbSnapshotRpName `
  --restore-mode AlternateWorkloadRestore --recovery-mode SnapshotAttach `
  --target-container-name $targetContainerName --target-server-name $targetVm `
  --target-server-type SQLInstance --target-instance-name $targetInstanceName `
  --snapshot-rg $restoreRg --identity-arm-id $uamiId --output json |
  Set-Content -Encoding utf8 $configFile
```

#### Database restore as disks with logs as files

Set `$pit` to a valid UTC time from the database log ranges, as in the database PITR example. Generate the disk-attachment configuration, then set the destination for log files:

```powershell
$configFile = ".\database-rad-logs.json"
az backup recoveryconfig show @databaseArgs --log-point-in-time $pit `
  --restore-mode AlternateWorkloadRestore --recovery-mode SnapshotAttach `
  --target-container-name $targetContainerName --target-server-name $targetVm `
  --target-server-type SQLInstance --target-instance-name $targetInstanceName `
  --snapshot-rg $restoreRg --identity-arm-id $uamiId --output json |
  Set-Content -Encoding utf8 $configFile
```

After confirming that configuration generation succeeded, edit the generated mappings:

```powershell
$cfg = Get-Content -Raw $configFile | ConvertFrom-Json
$cfg.target_directory_mapping = @{ all = 'C:\temp' }
($cfg.target_physical_path | Where-Object source_path -eq 'E:\').target_path = 'M:\'
$cfg | ConvertTo-Json -Depth 100 | Set-Content -Encoding utf8 $configFile
```

### Review and submit a snapshot restore

For **each** selected scenario, confirm that `az backup recoveryconfig show` succeeds before using its output. Inspect the generated file and volume mappings. Remap only source volumes that require a different target path. Replace the example drive letters with actual paths:

```powershell
$cfg = Get-Content -Raw $configFile | ConvertFrom-Json
$cfg.target_physical_path | Format-Table source_path, target_path
($cfg.target_physical_path | Where-Object source_path -eq 'E:\').target_path = 'X:\'
$cfg | ConvertTo-Json -Depth 100 | Set-Content -Encoding utf8 $configFile
```

The preceding remapping is optional. Preserve the intended mappings for your selected scenario, including any database disk-and-log-file configuration.

If disk detachment is required to resolve a filesystem clash, add only explicitly approved disk IDs to the generated configuration:

```powershell
$cfg = Get-Content -Raw $configFile | ConvertFrom-Json
$cfg.disks_to_detach_on_clash = @(
  "/subscriptions/<subscription-id>/resourceGroups/<disk-rg>/providers/Microsoft.Compute/disks/<disk-name>"
)
$cfg | ConvertTo-Json -Depth 100 | Set-Content -Encoding utf8 $configFile
```

> [!WARNING]
> Detaching existing disks can disrupt destination workloads. Verify every disk ID and the full recovery configuration before submitting the restore. Don't apply the optional disk-detach example unless the operation is required and approved.

Submit only the configuration file for the chosen operation:

```powershell
az backup restore restore-azurewl @vaultArgs --recovery-config $configFile
```

Track the returned job name with `az backup job show`. For stop-protection and unregister commands, see [Manage SQL instance snapshot backups](backup-azure-sql-manage-cli.md#manage-sql-instance-snapshot-backups).

## Next step

* [Manage SQL databases that are backed up using Azure CLI](backup-azure-sql-manage-cli.md).


## Related content

- [Back up SQL server databases in Azure VMs using Azure Backup via REST API](backup-azure-sql-vm-rest-api.md).
- [Restore SQL Server databases in Azure VMs with REST API](restore-azure-sql-vm-rest-api.md).
- Manage SQL server databases in Azure VMs with [Azure portal](manage-monitor-sql-database-backup.md), [Azure CLI](backup-azure-sql-manage-cli.md), [REST API](manage-azure-sql-vm-rest-api.md).
