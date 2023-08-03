---
title: Tutorial - SAP HANA DB restore on Azure using CLI 
description: In this tutorial, learn how to restore SAP HANA databases running on an Azure VM from an Azure Backup Recovery Services vault using Azure CLI.
ms.topic: tutorial
ms.date: 07/18/2023
ms.custom: devx-track-azurecli
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Tutorial: Restore SAP HANA databases in an Azure VM using Azure CLI

This tutorial describes how to restore SAP HANA database instance and SAP HANA System Replication (HSR) instance using Azure CLI.

Azure CLI is used to create and manage Azure resources from the command line or through scripts. This documentation details how to restore a backed-up SAP HANA database on an Azure VM - using Azure CLI. You can also perform these steps using the [Azure portal](./sap-hana-db-restore.md).

>[!Note]
>- Original Location Recovery (OLR) is currently not supported for HSR.
>- Restore to HSR instance isn't supported. However, restore only to HANA instance is supported.

Use [Azure Cloud Shell](tutorial-sap-hana-backup-cli.md) to run CLI commands.

This tutorial assumes you have an SAP HANA database running on Azure VM that's backed-up using Azure Backup. If you've used [Back up an SAP HANA database in Azure using CLI](tutorial-sap-hana-backup-cli.md) to back up your SAP HANA database, then you're using the following resources:

* A resource group named `saphanaResourceGroup`.
* A vault named `saphanaVault`.
* Protected container named `VMAppContainer;Compute;saphanaResourceGroup;saphanaVM`.
* Backed-up database/item named `saphanadatabase;hxe;hxe`.
* Resources in the `westus2` region.

For more information on the supported configurations and scenarios, see the [SAP HANA backup support matrix](sap-hana-backup-support-matrix.md).

## View restore points for a backed-up database

To view the list of all the recovery points for a database, use the [az backup recoverypoint list](/cli/azure/backup/recoverypoint#az-backup-recoverypoint-show-log-chain) cmdlet as follows:

**Choose a database type**:

# [HANA database](#tab/hana-database)

To view the available recovery points, run the following command:

```azurecli-interactive
az backup recoverypoint list --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --container-name VMAppContainer;Compute;saphanaResourceGroup;saphanaVM \
    --item-name saphanadatabase;hxe;hxe \
   --output table
```

The list of recovery points will look as follows:

```output
Name                      Time                               BackupManagementType   Item Name               RecoveryPointType
-------------------       ---------------------------------  ---------------------  ----------------------  ------------------
7660777527047692711       2019-12-10T04:00:32.346000+00:00   AzureWorkload          SAPHanaDtabase;hxe;hxe  Full
7896624824685666836       2019-12-15T10:33:32.346000+00:00   AzureWorkload          SAPHanaDtabase;hxe;hxe  Differential
DefaultRangeRecoveryPoint                                    AzureWorkload          SAPHanaDtabase;hxe;hxe  Log
```

As you can see, the list above contains three recovery points: one each for full, differential, and log backup.

# [HSR](#tab/hsr)

To view the available recovery points, run the following command:

```azurecli
az backup recoverypoint list --resource-group hanarghsr2 --vault-name hanavault10 --container-name "hanahsrcontainer;hsrtestps2" --item-name "saphanadatabase;hsrtestpradeep2;db1" --output table

abc@Azure:~$ az backup recoverypoint list --resource-group hanarghsr2 --vault-name hanavault10 --container-name "hanahsrcontainer;hsrtestps2" --item-name "saphanadatabase;hsrtestps2;db1" --output table
```

The list of recovery points will look as follows:

```Output
Name                       Time                              BackupManagementType    Item Name                            RecoveryPointType
-------------------------  --------------------------------  ----------------------  -----------------------------------  -------------------
62640091676331             2023-05-04T08:13:09.469000+00:00  AzureWorkload           SAPHanaDatabase;hsrtestps2;db1  Full
68464937558101             2023-05-04T07:49:02.988000+00:00  AzureWorkload           SAPHanaDatabase;hsrtestps2;db1  Full
56015648627567             2023-05-04T07:27:54.425000+00:00  AzureWorkload           SAPHanaDatabase;hsrtestps2;db1  Full
DefaultRangeRecoveryPoint                                    AzureWorkload           SAPHanaDatabase;hsrtestps2;db1  Log
arvind@Azure:~$
```

---

>[!NOTE]
>You can also view the start and end points of every unbroken log backup chain, using the [az backup recoverypoint show-log-chain](/cli/azure/backup/recoverypoint#az-backup-recoverypoint-show-log-chain) cmdlet.

## Prerequisites to restore a database

Ensure that the following prerequisites are met before restoring a database:

* You can restore the database only to an SAP HANA instance that's in the same region
* The target instance must be registered with the same vault as the source
* Azure Backup can't identify two different SAP HANA instances on the same VM. Therefore, restoring data from one instance to another on the same VM isn't possible.

## Restore a database

Azure Backup can restore SAP HANA databases that are running on Azure VMs as follows:

* Restore to a specific date or time (to the second) by using log backups. Azure Backup automatically determines the appropriate full, differential backups and the chain of log backups that are required to restore based on the selected time.
* Restore to a specific full or differential backup to restore to a specific recovery point.

To restore a database, use the [az restore restore-azurewl](/cli/azure/backup/restore#az-backup-restore-restore-azurewl) cmdlet, which requires a recovery config object as one of the inputs. This object can be generated using the [az backup recoveryconfig show](/cli/azure/backup/recoveryconfig#az-backup-recoveryconfig-show) cmdlet. The recovery config object contains all the details to perform a restore. One of them being the restore mode – **OriginalWorkloadRestore** or **AlternateWorkloadRestore**.

>[!NOTE]
> **OriginalWorkloadRestore** - Restore the data to the same SAP HANA instance as the original source. This option overwrites the original database. <br>
> **AlternateWorkloadRestore** - Restore the database to an alternate location and keep the original source database.

## Restore to alternate location

To restore a database to an alternate location, use **AlternateWorkloadRestore** as the restore mode. You must then choose the restore point, which could either be a previous point-in-time or any of the previous restore points.

In this tutorial, you'll restore to a previous restore point. [View the list of restore points](#view-restore-points-for-a-backed-up-database) for the database and choose the point you want to restore to. This tutorial will use the restore point with the name *7660777527047692711*.

By using the above restore point name and the restore mode, let's create the recovery config object using the [az backup recoveryconfig show](/cli/azure/backup/recoveryconfig#az-backup-recoveryconfig-show) cmdlet. Let's look at what each of the remaining parameters in this cmdlet mean:

* **--target-item-name** This is the name that the restored database will be using. In this case, we used the name *restored_database*.
* **--target-server-name** This is the name of an SAP HANA server that's successfully registered to a Recovery Services vault and lies in the same region as the database to be restored. For this tutorial, we'll restore the database to the same SAP HANA server that we've protected, named *hxehost*.
* **--target-server-type** For the restore of SAP HANA databases, **HANAInstance** must be used.

**Choose a database type**:

# [HANA database](#tab/hana-database)

To start the restore operation, run the following command:

```azurecli-interactive

az backup recoveryconfig show --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --container-name VMAppContainer;Compute;saphanaResourceGroup;saphanaVM \
    --item-name saphanadatabase;hxe;hxe \
    --restore-mode AlternateWorkloadRestore \
    --rp-name 7660777527047692711 \
    --target-item-name restored_database \
    --target-server-name hxehost \
    --target-server-type HANAInstance \
    --workload-type SAPHANA \
    --output json
```

The response to the above query will be a recovery config object that looks something like this:

```Output
{"restore_mode": "AlternateLocation", "container_uri": " VMAppContainer;Compute;saphanaResourceGroup;saphanaVM ", "item_uri": "SAPHanaDatabase;hxe;hxe", "recovery_point_id": "7660777527047692711", "item_type": "SAPHana", "source_resource_id": "/subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/saphanaResourceGroup/providers/Microsoft.Compute/virtualMachines/saphanavm", "database_name": null, "container_id": null, "alternate_directory_paths": null}
```

Now, to restore the database run the [az restore restore-azurewl](/cli/azure/backup/restore#az-backup-restore-restore-azurewl) cmdlet. To use this command, we'll enter the above json output that's saved to a file named *recoveryconfig.json*.

```azurecli-interactive
az backup restore restore-azurewl --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --restore-config recoveryconfig.json \
    --output table
```

The output will look like this:

```output
Name                                  Resource
------------------------------------  -------
5b198508-9712-43df-844b-977e5dfc30ea  SAPHANA
```

The response will give you the job name. This job name can be used to track the job status using [az backup job show](/cli/azure/backup/job#az-backup-job-show) cmdlet.

# [HSR](#tab/hsr)

To start the restore operation, run the following command:

```azurecli
az backup recoveryconfig show --resource-group hanarghsr2 --vault-name hanavault10 --container-name "hanahsrcontainer;hsrtestps2" --item-name "saphanadatabase;hsrtestps2;db1" --restore-mode AlternateWorkloadRestore --log-point-in-time 04-05-2023-08:27:54 --target-item-name restored_DB_pradeep  --target-server-name hsr-primary --target-container-name  hsr-primary --target-server-type HANAInstance --backup-management-type AzureWorkload --workload-type SAPHANA --output json > recoveryInput.json

 arvind@Azure:~$ cat recoveryInput.json
{
  "alternate_directory_paths": null,
  "container_id": "/subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/hanarghsr2/providers/Microsoft.RecoveryServices/vaults/hanavault10/backupFabrics/Azure/protectionContainers/vmappcontainer;compute;hanarghsr2;hsr-primary",
  "container_uri": "HanaHSRContainer;hsrtestps2",
  "database_name": "ARV/restored_DB_p2",
  "filepath": null,
  "item_type": "SAPHana",
  "item_uri": "SAPHanaDatabase;hsrtestps2;db1",
  "log_point_in_time": "04-05-2023-08:27:54",
  "recovery_mode": null,
  "recovery_point_id": "DefaultRangeRecoveryPoint",
  "restore_mode": "AlternateLocation",
  "source_resource_id": null,
  "workload_type": "SAPHanaDatabase"
}
arvind@Azure:~$

az backup restore restore-azurewl --resource-group hanarghsr2 --vault-name hanavault10 --recovery-config recoveryInput.json --output table
```

### Restore as files:

To restore the database as files, run the following command:

```azurecli
az backup recoveryconfig show --resource-group hanarghsr2 \
    --vault-name hanavault10 \
    --container-name "hanahsrcontainer;hsrtestps2" \
    --item-name "saphanadatabase;hsrtestps2;arv" \
    --restore-mode RestoreAsFiles \
    --log-point-in-time 18-04-2023-09:53:00 \
    --rp-name DefaultRangeRecoveryPoint \
    --target-container-name "VMAppContainer;Compute;hanarghsr2;hsr-primary"  \
    --filepath /home/abc \
    --output json
	
	az backup restore restore-azurewl --resource-group hanarghsr2 \
    --vault-name hanavault10 \
    --restore-config recoveryconfig.json \
    --output json

az backup recoveryconfig show --resource-group hanarghsr2     --vault-name hanavault10     --container-name "hanahsrcontainer;hsrtestps2"     --item-name "saphanadatabase;hsrtestps2;arv"     --restore-mode RestoreAsFiles     --log-point-in-time 18-04-2023-09:53:00     --rp-name DefaultRangeRecoveryPoint     --target-container-name "VMAppContainer;Compute;hanarghsr2;hsr-primary"      --filepath /home/abc     --output json  > recoveryconfig.json
```

---

## Restore and overwrite

To restore to the original location, we'll use **OrignialWorkloadRestore** as the restore mode. You must then choose the restore point, which could either be a previous point-in-time or any of the previous restore points.

For this tutorial, we'll choose the previous point-in-time “28-11-2019-09:53:00” to restore to. You can provide this restore point in the following formats: dd-mm-yyyy, dd-mm-yyyy-hh:mm:ss. To choose a valid point-in-time to restore to, use the [az backup recoverypoint show-log-chain](/cli/azure/backup/recoverypoint#az-backup-recoverypoint-show-log-chain) cmdlet, which lists the intervals of unbroken log chain backups.

```azurecli-interactive
az backup recoveryconfig show --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --container-name VMAppContainer;Compute;saphanaResourceGroup;saphanaVM \
    --item-name saphanadatabase;hxe;hxe \
    --restore-mode OriginalWorkloadRestore \
    --log-point-in-time 28-11-2019-09:53:00 \
    --output json
```

The response to the above query will be a recovery config object that looks as follows:

```output
{"restore_mode": "OriginalLocation", "container_uri": " VMAppContainer;Compute;saphanaResourceGroup;saphanaVM ", "item_uri": "SAPHanaDatabase;hxe;hxe", "recovery_point_id": "DefaultRangeRecoveryPoint", "log_point_in_time": "28-11-2019-09:53:00", "item_type": "SAPHana", "source_resource_id": "/subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/saphanaResourceGroup/providers/Microsoft.Compute/virtualMachines/saphanavm", "database_name": null, "container_id": null, "alternate_directory_paths": null}"
```

Now, to restore the database run the [az restore restore-azurewl](/cli/azure/backup/restore#az-backup-restore-restore-azurewl) cmdlet. To use this command, we'll enter the above json output that's saved to a file named *recoveryconfig.json*.

```azurecli-interactive
az backup restore restore-azurewl --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --restore-config recoveryconfig.json \
    --output table
```

The output will look like this:

```output
Name                                  Resource
------------------------------------  --------
5b198508-9712-43df-844b-977e5dfc30ea  SAPHANA
```

The response will give you the job name. This job name can be used to track the job status using the [az backup job show](/cli/azure/backup/job#az-backup-job-show) cmdlet.

## Restore to secondary region

To restore a database to the secondary region, specify a target vault and server located in the secondary region, in the restore configuration.

```azurecli-interactive
az backup recoveryconfig show --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --container-name VMAppContainer;compute;hanasnapshotcvtmachines;hanasnapcvt01 \
    --item-name SAPHanaDatabase;h10;h10 \
    --restore-mode AlternateWorkloadRestore \
    --from-full-rp-name 293170069256531 \
    --rp-name 293170069256531 \
    --target-server-name targethanaserver \
    --target-container-name VMAppContainer;compute;saphanaTargetRG;targethanaserver \
    --target-item-name h10 \
    --target-server-type HANAInstance \
    --workload-type SAPHANA \
    --target-resource-group saphanaTargetRG \
    --target-vault-name targetVault \
    --backup-management-type AzureWorkload
```

Following is the response to the above command that will be a recovery configuration object:

```output
{
  "alternate_directory_paths": null,
  "container_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/saphanaTargetRG/providers/Microsoft.RecoveryServices/vaults/targetVault/backupFabrics/Azure/protectionContainers/vmappcontainer;compute;saphanaTargetRG;targethanaserver",
  "container_uri": "VMAppContainer;compute;hanasnapshotcvtmachines;hanasnapcvt01",
  "database_name": "SAPHanaDatabase;h10;h10",
  "filepath": null,
  "item_type": "SAPHana",
  "item_uri": "SAPHanaDatabase;h10;h10",
  "log_point_in_time": null,
  "recovery_mode": null,
  "recovery_point_id": "293170069256531",
  "restore_mode": "AlternateLocation",
  "source_resource_id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/saphanaResourceGroup/providers/Microsoft.Compute/virtualMachines/hanasnapcvt01",
  "workload_type": "SAPHanaDatabase"
}
```

Use this recovery configuration in the [az restore restore-azurewl](/cli/azure/backup/restore#az-backup-restore-restore-azurewl) cmdlet. Select the `--use-secondary-region` flag to restore the database to the secondary region.

```azurecli-interactive
az backup restore restore-azurewl --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --recovery-config recoveryconfig.json \
    --use-secondary-region \
    --output table
```

The output will be as follows:

```output
Name                                  Operation           Status      Item Name            Backup Management Type    Start Time UTC                    Duration
------------------------------------  ------------------  ----------  -------------------  ------------------------  --------------------------------  --------------
00000000-0000-0000-0000-000000000000  CrossRegionRestore  InProgress  H10 [hanasnapcvt01]  AzureWorkload             2021-12-22T05:21:34.165617+00:00  0:00:05.665470
```

>[!Note]
>The RPO for the backup data to be available in secondary region is 12 hours. Therefore, when you turn on CRR, the RPO for the secondary region is 12 hours + log frequency duration (that can be set to a minimum of 15 minutes).

## Restore as files

To restore the backup data as files instead of a database, we'll use **RestoreAsFiles** as the restore mode. Then choose the restore point, which can either be a previous point-in-time or any of the previous restore points. Once the files are dumped to a specified path, you can take these files to any SAP HANA machine where you want to restore them as a database. Because you can move these files to any machine, you can now restore the data across subscriptions and regions.

For this tutorial, we'll choose the previous point-in-time `28-11-2019-09:53:00` to restore to, and the location to dump backup files as `/home/saphana/restoreasfiles` on the same SAP HANA server. You can provide this restore point in either of the following formats: **dd-mm-yyyy** or **dd-mm-yyyy-hh:mm:ss**. To choose a valid point-in-time to restore to, use the [az backup recoverypoint show-log-chain](/cli/azure/backup/recoverypoint#az-backup-recoverypoint-show-log-chain) cmdlet, which lists the intervals of unbroken log chain backups.

Using the restore point name above and the restore mode, let's create the recovery config object using the [az backup recoveryconfig show](/cli/azure/backup/recoveryconfig#az-backup-recoveryconfig-show) cmdlet. Let's look at what each of the remaining parameters in this cmdlet mean:

* **--target-container-name** This is the name of an SAP HANA server that's successfully registered to a Recovery Services vault and lies in the same region as the database to be restored. For this tutorial, we'll restore the database as files to the same SAP HANA server that we've protected, named *hxehost*.
* **--rp-name** For a point-in-time restore the restore point name will be **DefaultRangeRecoveryPoint**

```azurecli-interactive
az backup recoveryconfig show --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --container-name VMAppContainer;Compute;saphanaResourceGroup;saphanaVM \
    --item-name saphanadatabase;hxe;hxe \
    --restore-mode RestoreAsFiles \
    --log-point-in-time 28-11-2019-09:53:00 \
    --rp-name DefaultRangeRecoveryPoint \
    --target-container-name VMAppContainer;Compute;saphanaResourceGroup;saphanaVM \
    --filepath /home/saphana/restoreasfiles \
    --output json
```

The response to the query above will be a recovery config object that looks as follows:

```output
{
  "alternate_directory_paths": null,
  "container_id": "/Subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/saphanaResourceGroup/providers/Microsoft.RecoveryServices/vaults/SAPHANAVault/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SAPHANA;hanamachine",
  "container_uri": "VMAppContainer;compute;saphana;hanamachine",
  "database_name": null,
  "filepath": "/home/",
  "item_type": "SAPHana",
  "item_uri": "SAPHanaDatabase;hxe;hxe",
  "log_point_in_time": "04-07-2020-09:53:00",
  "recovery_mode": "FileRecovery",
  "recovery_point_id": "DefaultRangeRecoveryPoint",
  "restore_mode": "AlternateLocation",
  "source_resource_id": "/subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/saphanaResourceGroup/providers/Microsoft.Compute/virtualMachines/hanamachine"
}
```

Now, to restore the database as files run the [az restore restore-azurewl](/cli/azure/backup/restore#az-backup-restore-restore-azurewl) cmdlet. To use this command, we'll enter the json output above which is saved to a file named *recoveryconfig.json*.

```azurecli-interactive
az backup restore restore-azurewl --resource-group saphanaResourceGroup \
    --vault-name saphanaVault \
    --restore-config recoveryconfig.json \
    --output json
```

The output will look like this:

```output
{
  "eTag": null,
  "id": "/Subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/SAPHANARESOURCEGROUP/providers/Microsoft.RecoveryServices/vaults/SAPHANAVault/backupJobs/608e737e-c001-47ca-8c37-57d909c8a704",
  "location": null,
  "name": "608e737e-c001-47ca-8c37-57d909c8a704",
  "properties": {
    "actionsInfo": [
      "Cancellable"
    ],
    "activityId": "7ddd3c3a-c0eb-11ea-a5f8-54ee75ec272a",
    "backupManagementType": "AzureWorkload",
    "duration": "0:00:01.781847",
    "endTime": null,
    "entityFriendlyName": "HXE [hxehost]",
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
    "jobType": "AzureWorkloadJob",
    "operation": "Restore",
    "startTime": "2020-07-08T07:20:29.336434+00:00",
    "status": "InProgress",
    "workloadType": "SAPHanaDatabase"
  },
  "resourceGroup": "saphanaResourceGroup",
  "tags": null,
  "type": "Microsoft.RecoveryServices/vaults/backupJobs"
}
```

The response will give you the job name. This job name can be used to track the job status using the [az backup job show](/cli/azure/backup/job#az-backup-job-show) cmdlet.

The files that are dumped onto the target container are:

* Database backup files
* Catalog files
* JSON metadata files (for each backup file that's involved)

Typically, a network share path, or path of a mounted Azure file share when specified as the destination path, enables easier access to these files by other machines in the same network or with the same Azure file share mounted on them.

>[!NOTE]
>To restore the database backup files on an Azure file share mounted on the target registered VM, make sure that root account has read/ write permissions on the Azure file share.

Based on the type of restore point chosen (**Point in time** or **Full & Differential**), you'll see one or more folders created in the destination path. One of the folders named `Data_<date and time of restore>` contains the full backups, and the other folder named `Log` contains the log backups and other backups (such as differential and incremental).

>[!Note]
>If you've selected **Restore to a point in time**, the log files (dumped to the target VM) may sometimes contain logs beyond the point-in-time chosen for restore. Azure Backup does this to ensure that log backups for all HANA services are available for consistent and successful restore to the chosen point-in-time.

> [!NOTE]
> If you don't want to restore the entire chain but only a subset of files, follow the steps as documented [here](sap-hana-db-restore.md#partial-restore-as-files).

Move these restored files to the SAP HANA server where you want to restore them as a database. Then follow these steps to restore the database:

1. Set permissions on the folder / directory where the backup files are stored using the following command:

    ```bash
    chown -R <SID>adm:sapsys <directory>
    ```

1. Run the next set of commands as `<SID>adm`

    ```bash
    su - <sid>adm
    ```

1. Generate the catalog file for restore. Extract the **BackupId** from the JSON metadata file for the full backup, which will be used later in the restore operation. Make sure that the full and log backups are in different folders and delete the catalog files and JSON metadata files in these folders.

    ```bash
    hdbbackupdiag --generate --dataDir <DataFileDir> --logDirs <LogFilesDir> -d <PathToPlaceCatalogFile>
    ```

    In the command above:

    * `<DataFileDir>` - the folder that contains the full backups
    * `<LogFilesDir>` - the folder that contains the log backups, differential and incremental backups (if any)
    * `<PathToPlaceCatalogFile>` - the folder where the catalog file generated must be placed

1. Restore using the newly generated catalog file through HANA Studio or run the HDBSQL restore query with this newly generated catalog. HDBSQL queries are listed below:

    * To restore to a point in time:

        If you're creating a new restored database, run the HDBSQL command to create a new database `<DatabaseName>` and then stop the database for restore. However, if you're only restoring an existing database, run the HDBSQL command to stop the database.

        Then run the following command to restore the database:

        ```hdbsql
        RECOVER DATABASE FOR <DatabaseName> UNTIL TIMESTAMP '<TimeStamp>' CLEAR LOG USING SOURCE '<DatabaseName@HostName>'  USING CATALOG PATH ('<PathToGeneratedCatalogInStep3>') USING LOG PATH (' <LogFileDir>') USING DATA PATH ('<DataFileDir>') USING BACKUP_ID <BackupIdFromJsonFile> CHECK ACCESS USING FILE
        ```

        * `<DatabaseName>` - Name of the new database or existing database that you want to restore
        * `<Timestamp>` - Exact timestamp of the Point in time restore
        * `<DatabaseName@HostName>` - Name of the database whose backup is used for restore and the **host** / SAP HANA server name on which this database resides. The `USING SOURCE <DatabaseName@HostName>` option specifies that the data backup (used for restore) is of a database with a different SID or name than the target SAP HANA machine. So it doesn't need to be specified for restores done on the same HANA server from where the backup is taken.
        * `<PathToGeneratedCatalogInStep3>` - Path to the catalog file generated in **Step 3**
        * `<DataFileDir>` - the folder that contains the full backups
        * `<LogFilesDir>` - the folder that contains the log backups, differential and incremental backups (if any)
        * `<BackupIdFromJsonFile>` - the **BackupId** extracted in **Step 3**

    * To restore to a particular full or differential backup:

        If you're creating a new restored database, run the HDBSQL command to create a new database `<DatabaseName>` and then stop the database for restore. However, if you're only restoring an existing database, run the HDBSQL command to stop the database:

        ```hdbsql
        RECOVER DATA FOR <DatabaseName> USING BACKUP_ID <BackupIdFromJsonFile> USING SOURCE '<DatabaseName@HostName>'  USING CATALOG PATH ('<PathToGeneratedCatalogInStep3>') USING DATA PATH ('<DataFileDir>')  CLEAR LOG
        ```

        * `<DatabaseName>` - the name of the new database or existing database that you want to restore
        * `<Timestamp>` - the exact timestamp of the Point in time restore
        * `<DatabaseName@HostName>` - the name of the database whose backup is used for restore and the **host** / SAP HANA server name on which this database resides. The `USING SOURCE <DatabaseName@HostName>`  option specifies that the data backup (used for restore) is of a database with a different SID or name than the target SAP HANA machine. So it need not be specified for restores done on the same HANA server from where the backup is taken.
        * `<PathToGeneratedCatalogInStep3>` - the path to the catalog file generated in **Step 3**
        * `<DataFileDir>` - the folder that contains the full backups
        * `<LogFilesDir>` - the folder that contains the log backups, differential and incremental backups (if any)
        * `<BackupIdFromJsonFile>` - the **BackupId** extracted in **Step 3**

## Cross Subscription Restore

With Cross Subscription Restore (CSR), you have the flexibility of restoring to any subscription and any vault under your tenant if restore permissions are available. By default, CSR is enabled on all Recovery Services vaults (existing and newly created vaults). 

>[!Note]
>- You can trigger Cross Subscription Restore from Recovery Services vault.
>- CSR is supported only for streaming/Backint-based backups and is not supported for snapshot-based backup.
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

* To learn how to manage SAP HANA databases that are backed up using Azure CLI, continue to the tutorial [Manage an SAP HANA database in Azure VM using CLI](tutorial-sap-hana-backup-cli.md)

* To learn how to restore an SAP HANA database running in Azure VM using the Azure portal, refer to [Restore an SAP HANA databases on Azure VMs](./sap-hana-db-restore.md)
