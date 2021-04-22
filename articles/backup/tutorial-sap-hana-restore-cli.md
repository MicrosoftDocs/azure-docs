---
title: Tutorial - SAP HANA DB restore on Azure using CLI 
description: In this tutorial, learn how to restore SAP HANA databases running on an Azure VM from an Azure Backup Recovery Services vault using Azure CLI.
ms.topic: tutorial
ms.date: 12/4/2019 
ms.custom: devx-track-azurecli
---

# Tutorial: Restore SAP HANA databases in an Azure VM using Azure CLI

Azure CLI is used to create and manage Azure resources from the command line or through scripts. This documentation details how to restore a backed-up SAP HANA database on an Azure VM - using Azure CLI. You can also perform these steps using the [Azure portal](./sap-hana-db-restore.md).

Use [Azure Cloud Shell](tutorial-sap-hana-backup-cli.md) to run CLI commands.

By the end of this tutorial you'll be able to:

> [!div class="checklist"]
>
> * View restore points for a backed-up database
> * Restore a database

This tutorial assumes you have an SAP HANA database running on Azure VM that's backed-up using Azure Backup. If you've used [Back up an SAP HANA database in Azure using CLI](tutorial-sap-hana-backup-cli.md) to back up your SAP HANA database, then you're using the following resources:

* a resource group named *saphanaResourceGroup*
* a vault named *saphanaVault*
* protected container named *VMAppContainer;Compute;saphanaResourceGroup;saphanaVM*
* backed-up database/item named *saphanadatabase;hxe;hxe*
* resources in the *westus2* region

## View restore points for a backed-up database

To view the list of all the recovery points for a database, use the [az backup recoverypoint list](/cli/azure/backup/recoverypoint#az_backup_recoverypoint_show_log_chain) cmdlet as follows:

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

>[!NOTE]
>You can also view the start and end points of every unbroken log backup chain, using the [az backup recoverypoint show-log-chain](/cli/azure/backup/recoverypoint#az_backup_recoverypoint_show_log_chain) cmdlet.

## Prerequisites to restore a database

Ensure that the following prerequisites are met before restoring a database:

* You can restore the database only to an SAP HANA instance that's in the same region
* The target instance must be registered with the same vault as the source
* Azure Backup can't identify two different SAP HANA instances on the same VM. Therefore, restoring data from one instance to another on the same VM isn't possible.

## Restore a database

Azure Backup can restore SAP HANA databases that are running on Azure VMs as follows:

* Restore to a specific date or time (to the second) by using log backups. Azure Backup automatically determines the appropriate full, differential backups and the chain of log backups that are required to restore based on the selected time.
* Restore to a specific full or differential backup to restore to a specific recovery point.

To restore a database, use the [az restore restore-azurewl](/cli/azure/backup/restore#az_backup_restore_restore_azurewl) cmdlet, which requires a recovery config object as one of the inputs. This object can be generated using the [az backup recoveryconfig show](/cli/azure/backup/recoveryconfig#az_backup_recoveryconfig_show) cmdlet. The recovery config object contains all the details to perform a restore. One of them being the restore mode – **OriginalWorkloadRestore** or **AlternateWorkloadRestore**.

>[!NOTE]
> **OriginalWorkloadRestore** - Restore the data to the same SAP HANA instance as the original source. This option overwrites the original database. <br>
> **AlternateWorkloadRestore** - Restore the database to an alternate location and keep the original source database.

## Restore to alternate location

To restore a database to an alternate location, use **AlternateWorkloadRestore** as the restore mode. You must then choose the restore point, which could either be a previous point-in-time or any of the previous restore points.

In this tutorial, you'll restore to a previous restore point. [View the list of restore points](#view-restore-points-for-a-backed-up-database) for the database and choose the point you want to restore to. This tutorial will use the restore point with the name *7660777527047692711*.

Using the above restore point name and the restore mode, let's create the recovery config object using the [az backup recoveryconfig show](/cli/azure/backup/recoveryconfig#az_backup_recoveryconfig_show) cmdlet. Let's look at what each of the remaining parameters in this cmdlet mean:

* **--target-item-name** This is the name that the restored database will be using. In this case, we used the name *restored_database*.
* **--target-server-name** This is the name of an SAP HANA server that's successfully registered to a Recovery Services vault and lies in the same region as the database to be restored. For this tutorial, we'll restore the database to the same SAP HANA server that we've protected, named *hxehost*.
* **--target-server-type** For the restore of SAP HANA databases, **HANAInstance** must be used.

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

```output
{"restore_mode": "AlternateLocation", "container_uri": " VMAppContainer;Compute;saphanaResourceGroup;saphanaVM ", "item_uri": "SAPHanaDatabase;hxe;hxe", "recovery_point_id": "7660777527047692711", "item_type": "SAPHana", "source_resource_id": "/subscriptions/ef4ab5a7-c2c0-4304-af80-af49f48af3d1/resourceGroups/saphanaResourceGroup/providers/Microsoft.Compute/virtualMachines/saphanavm", "database_name": null, "container_id": null, "alternate_directory_paths": null}
```

Now, to restore the database run the [az restore restore-azurewl](/cli/azure/backup/restore#az_backup_restore_restore_azurewl) cmdlet. To use this command, we'll enter the above json output that's saved to a file named *recoveryconfig.json*.

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

The response will give you the job name. This job name can be used to track the job status using [az backup job show](/cli/azure/backup/job#az_backup_job_show) cmdlet.

## Restore and overwrite

To restore to the original location, we'll use **OrignialWorkloadRestore** as the restore mode. You must then choose the restore point, which could either be a previous point-in-time or any of the previous restore points.

For this tutorial, we'll choose the previous point-in-time “28-11-2019-09:53:00” to restore to. You can provide this restore point in the following formats: dd-mm-yyyy, dd-mm-yyyy-hh:mm:ss. To choose a valid point-in-time to restore to, use the [az backup recoverypoint show-log-chain](/cli/azure/backup/recoverypoint#az_backup_recoverypoint_show_log_chain) cmdlet, which lists the intervals of unbroken log chain backups.

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

Now, to restore the database run the [az restore restore-azurewl](/cli/azure/backup/restore#az_backup_restore_restore_azurewl) cmdlet. To use this command, we'll enter the above json output that's saved to a file named *recoveryconfig.json*.

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

The response will give you the job name. This job name can be used to track the job status using the [az backup job show](/cli/azure/backup/job#az_backup_job_show) cmdlet.

## Restore as files

To restore the backup data as files instead of a database, we'll use **RestoreAsFiles** as the restore mode. Then choose the restore point, which can either be a previous point-in-time or any of the previous restore points. Once the files are dumped to a specified path, you can take these files to any SAP HANA machine where you want to restore them as a database. Because you can move these files to any machine, you can now restore the data across subscriptions and regions.

For this tutorial, we'll choose the previous point-in-time `28-11-2019-09:53:00` to restore to, and the location to dump backup files as `/home/saphana/restoreasfiles` on the same SAP HANA server. You can provide this restore point in either of the following formats: **dd-mm-yyyy** or **dd-mm-yyyy-hh:mm:ss**. To choose a valid point-in-time to restore to, use the [az backup recoverypoint show-log-chain](/cli/azure/backup/recoverypoint#az_backup_recoverypoint_show_log_chain) cmdlet, which lists the intervals of unbroken log chain backups.

Using the restore point name above and the restore mode, let's create the recovery config object using the [az backup recoveryconfig show](/cli/azure/backup/recoveryconfig#az_backup_recoveryconfig_show) cmdlet. Let's look at what each of the remaining parameters in this cmdlet mean:

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

Now, to restore the database as files run the [az restore restore-azurewl](/cli/azure/backup/restore#az_backup_restore_restore_azurewl) cmdlet. To use this command, we'll enter the json output above which is saved to a file named *recoveryconfig.json*.

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

The response will give you the job name. This job name can be used to track the job status using the [az backup job show](/cli/azure/backup/job#az_backup_job_show) cmdlet.

The files that are dumped onto the target container are:

* Database backup files
* Catalog files
* JSON metadata files (for each backup file that's involved)

Typically, a network share path, or path of a mounted Azure file share when specified as the destination path, enables easier access to these files by other machines in the same network or with the same Azure file share mounted on them.

>[!NOTE]
>To restore the database backup files on an Azure file share mounted on the target registered VM, make sure that root account has read/ write permissions on the Azure file share.

Based on the type of restore point chosen (**Point in time** or **Full & Differential**), you'll see one or more folders created in the destination path. One of the folders named `Data_<date and time of restore>` contains the full and differential backups, and the other folder named `Log` contains the log backups.

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
    * `<LogFilesDir>` - the folder that contains the log backups
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
        * `<LogFilesDir>` - the folder that contains the log backups
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
        * `<LogFilesDir>` - the folder that contains the log backups
        * `<BackupIdFromJsonFile>` - the **BackupId** extracted in **Step 3**

## Next steps

* To learn how to manage SAP HANA databases that are backed up using Azure CLI, continue to the tutorial [Manage an SAP HANA database in Azure VM using CLI](tutorial-sap-hana-backup-cli.md)

* To learn how to restore an SAP HANA database running in Azure VM using the Azure portal, refer to [Restore an SAP HANA databases on Azure VMs](./sap-hana-db-restore.md)
