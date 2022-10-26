---
title: Restore SAP HANA databases on Azure VMs
description: In this article, discover how to restore SAP HANA databases that are running on Azure Virtual Machines. You can also use Cross Region Restore to restore your databases to a secondary region.
ms.topic: conceptual
ms.date: 10/07/2022
author: v-amallick
ms.service: backup
ms.custom: ignite-2022
ms.author: v-amallick
---

# Restore SAP HANA databases on Azure VMs

This article describes how to restore SAP HANA databases running on an Azure Virtual Machine (VM), which the Azure Backup service has backed up to a Recovery Services vault. You can use the restore data to create copies of the data for development/ test scenarios or to return to a previous state.

Azure Backup now supports backup/restore of SAP HANA System Replication (HSR) databases (preview).

>[!Note]
>The restore process of HANA databases with HANA System Replication (HSR) is the same as restore of HANA databases without HSR. As per SAP advisories, you can restore databases with HANA System Replication mode as *standalone* databases. If the target system has the HANA System Replication mode enabled, first disable this mode, and then restore the database.

For information about the supported configurations and scenarios, see [SAP HANA backup support matrix](sap-hana-backup-support-matrix.md).

## Restore to a point in time or to a recovery point

Azure Backup can restore SAP HANA databases that are running on Azure VMs as follows:

* Restore to a specific date or time (to the second) by using log backups. Azure Backup automatically determines the appropriate full, differential backups and the chain of log backups that are required to restore based on the selected time.

* Restore to a specific full or differential backup to restore to a specific recovery point.

## Prerequisites

Before restoring a database, note the following:

* You can restore the database only to an SAP HANA instance that's in the same region.

* The target instance must be registered with the same vault as the source. [Learn more](backup-azure-sap-hana-database.md#discover-the-databases).

* Azure Backup can't identify two different SAP HANA instances on the same VM. So restoring data from one instance to another on the same VM isn't possible.

* To ensure that the target SAP HANA instance is ready for restore, check its **Backup readiness** status:

  1. In the Azure portal, go to **Backup center** and click **+Backup**.

     :::image type="content" source="./media/sap-hana-db-restore/backup-center-configure-inline.png" alt-text="Screenshot showing to start the process to check if the target SAP HANA instance is ready for restore." lightbox="./media/sap-hana-db-restore/backup-center-configure-expanded.png":::

  1. Select **SAP HANA in Azure VM** as the datasource type, select the vault to which the SAP HANA instance is registered, and then click **Continue**.

     :::image type="content" source="./media/sap-hana-db-restore/hana-select-vault.png" alt-text="Screenshot showing to select SAP HANA in Azure VM.":::

  1. Under **Discover DBs in VMs**, select **View details**.

     :::image type="content" source="./media/sap-hana-db-restore/hana-discover-databases.png" alt-text="Screenshot showing to view database details.":::

  1. Review the **Backup Readiness** of the target VM.

     :::image type="content" source="./media/sap-hana-db-restore/hana-select-virtual-machines-inline.png" alt-text="Screenshot showing protected servers." lightbox="./media/sap-hana-db-restore/hana-select-virtual-machines-expanded.png":::

* To learn more about the restore types that SAP HANA supports, refer to the SAP HANA Note [1642148](https://launchpad.support.sap.com/#/notes/1642148)

## Restore a database

To restore, you need the following permissions:

* **Backup Operator** permissions in the vault where you're doing the restore.
* **Contributor (write)** access to the source VM that's backed up.
* **Contributor (write**) access to the target VM:
  * If you're restoring to the same VM, this is the source VM.
  * If you're restoring to an alternate location, this is the new target VM.

1. In the Azure portal, go to **Backup center** and click **Restore**.

   :::image type="content" source="./media/sap-hana-db-restore/backup-center-restore-inline.png" alt-text="Screenshot showing to start restoring an SAP HANA database." lightbox="./media/sap-hana-db-restore/backup-center-restore-expanded.png":::

1. Select **SAP HANA in Azure VM** as the datasource type, select the database you wish to restore, and then click **Continue**.

   :::image type="content" source="./media/sap-hana-db-restore/hana-restore-select-database.png" alt-text="Screenshot showing to restore the backup items.":::

1. Under **Restore Configuration**, specify where (or how) to restore data:

   * **Alternate Location**: Restore the database to an alternate location and keep the original source database.

   * **Overwrite DB**: Restore the data to the same SAP HANA instance as the original source. This option overwrites the original database.

   :::image type="content" source="./media/sap-hana-db-restore/hana-restore-configuration.png" alt-text="Screenshot showing to restore configuration.":::

### Restore to alternate location

1. In the **Restore Configuration** menu, under **Where to Restore**, select **Alternate Location**.

   :::image type="content" source="./media/sap-hana-db-restore/hana-alternate-location-recovery.png" alt-text="Screenshot showing to restore to alternate location.":::

1. Select the SAP HANA host name and instance name to which you want to restore the database.
1. Check if the target SAP HANA instance is ready for restore by ensuring its **Backup Readiness.** Refer to the [prerequisites section](#prerequisites) for more details.
1. In the **Restored DB Name** box, enter the name of the target database.

    > [!NOTE]
    > Single Database Container (SDC) restores must follow these [checks](backup-azure-sap-hana-database-troubleshoot.md#single-container-database-sdc-restore).

1. If applicable, select **Overwrite if the DB with the same name already exists on selected HANA instance**.

1. In **Select restore point**, select **Logs (Point in Time)** to [restore to a specific point in time](#restore-to-a-specific-point-in-time). Or select **Full & Differential** to [restore to a specific recovery point](#restore-to-a-specific-recovery-point).

### Restore and overwrite

1. In the **Restore Configuration** menu, under **Where to Restore**, select **Overwrite DB** > **OK**.

   :::image type="content" source="./media/sap-hana-db-restore/hana-overwrite-database.png" alt-text="Screenshot showing to overwrite database.":::

1. In **Select restore point**, select **Logs (Point in Time)** to [restore to a specific point in time](#restore-to-a-specific-point-in-time). Or select **Full & Differential** to [restore to a specific recovery point](#restore-to-a-specific-recovery-point).

### Restore as files

>[!Note]
>Restore as files doesn't work on CIFS share, but works for NFS.

To restore the backup data as files instead of a database, choose **Restore as Files**. Once the files are dumped to a specified path, you can take these files to any SAP HANA machine where you want to restore them as a database. Because you can move these files to any machine, you can now restore the data across subscriptions and regions.

1. In the **Restore Configuration** menu, under **Where and how to Restore**, select **Restore as files**.
1. Select the **host** / HANA Server name to which you want to restore the backup files.
1. In the **Destination path on the server**, enter the folder path on the server selected in step 2. This is the location where the service will dump all the necessary backup files.

    The files that are dumped are:

    * Database backup files
    * JSON metadata files (for each backup file that's involved)

    Typically, a network share path, or path of a mounted Azure file share when specified as the destination path, enables easier access to these files by other machines in the same network or with the same Azure file share mounted on them.

    >[!NOTE]
    >To restore the database backup files on an Azure file share mounted on the target registered VM, make sure that root account has read/ write permissions on the Azure file share.

   :::image type="content" source="./media/sap-hana-db-restore/hana-restore-as-files.png" alt-text="Screenshot showing to choose destination path.":::

1. Select the **Restore Point** corresponding to which all the backup files and folders will be restored.

   :::image type="content" source="./media/sap-hana-db-restore/hana-select-recovery-point-inline.png" alt-text="Screenshot showing to select restore point." lightbox="./media/sap-hana-db-restore/hana-select-recovery-point-expanded.png":::

1. All the backup files associated with the selected restore point are dumped into the destination path.
1. Based on the type of restore point chosen (**Point in time** or **Full & Differential**), you'll see one or more folders created in the destination path. One of the folders named `Data_<date and time of restore>` contains the full backups, and the other folder named `Log` contains the log backups and other backups (such as differential, and incremental).

   >[!Note]
   >If you've selected **Restore to a point in time**, the log files (dumped to the target VM) may sometimes contain logs beyond the point-in-time chosen for restore. Azure Backup does this to ensure that log backups for all HANA services are available for consistent and successful restore to the chosen point-in-time.

1. Move these restored files to the SAP HANA server where you want to restore them as a database.
1. Then follow these steps:
    1. Set permissions on the folder / directory where the backup files are stored using the following command:

        ```bash
        chown -R <SID>adm:sapsys <directory>
        ```

    1. Run the next set of commands as `<SID>adm`

        ```bash
        su - <sid>adm
        ```

    1. Generate the catalog file for restore. Extract the **BackupId** from the JSON metadata file for the full backup, which will be used later in the restore operation. Make sure that the full and log backups (not present for Full Backup Recovery) are in different folders and delete the JSON metadata files in these folders.

        ```bash
        hdbbackupdiag --generate --dataDir <DataFileDir> --logDirs <LogFilesDir> -d <PathToPlaceCatalogFile>
        ```

        In the command above:

        * `<DataFileDir>` - the folder that contains the full backups.
        * `<LogFilesDir>` - the folder that contains the log backups, differential and incremental backups. For Full BackUp Restore, Log folder isn't created. Add an empty directory in that case.
        * `<PathToPlaceCatalogFile>` - the folder where the catalog file generated must be placed.

    1. Restore using the newly generated catalog file through HANA Studio or run the HDBSQL restore query with this newly generated catalog. HDBSQL queries are listed below:

     * To open hdsql prompt, run the following command:

        ```bash
        hdbsql -U AZUREWLBACKUPHANAUSER -d systemDB
        ```

     * To restore to a point-in-time:

        If you're creating a new restored database, run the HDBSQL command to create a new database `<DatabaseName>` and then stop the database for restore using the command `ALTER SYSTEM STOP DATABASE <db> IMMEDIATE`. However, if you're only restoring an existing database, run the HDBSQL command to stop the database.

        Then run the following command to restore the database:

        ```hdbsql
        RECOVER DATABASE FOR <db> UNTIL TIMESTAMP <t1> USING CATALOG PATH <path> USING LOG PATH <path> USING DATA PATH <path> USING BACKUP_ID <bkId> CHECK ACCESS USING FILE
        ```

        * `<DatabaseName>` - Name of the new database or existing database that you want to restore
        * `<Timestamp>` - Exact timestamp of the Point in time restore
        * `<DatabaseName@HostName>` - Name of the database whose backup is used for restore and the **host** / SAP HANA server name on which this database resides. The `USING SOURCE <DatabaseName@HostName>` option specifies that the data backup (used for restore) is of a database with a different SID or name than the target SAP HANA machine. So, it doesn't need to be specified for restores done on the same HANA server from where the backup is taken.
        * `<PathToGeneratedCatalogInStep3>` - Path to the catalog file generated in **Step C**
        * `<DataFileDir>` - the folder that contains the full backups
        * `<LogFilesDir>` - the folder that contains the log backups, differential and incremental backups (if any)
        * `<BackupIdFromJsonFile>` - the **BackupId** extracted in **Step C**

    * To restore to a particular full or differential backup:

        If you're creating a new restored database, run the HDBSQL command to create a new database `<DatabaseName>` and then stop the database for restore using the command `ALTER SYSTEM STOP DATABASE <db> IMMEDIATE`. However, if you're only restoring an existing database, run the HDBSQL command to stop the database:

        ```hdbsql
        RECOVER DATA FOR <DatabaseName> USING BACKUP_ID <BackupIdFromJsonFile> USING SOURCE '<DatabaseName@HostName>'  USING CATALOG PATH ('<PathToGeneratedCatalogInStep3>') USING DATA PATH ('<DataFileDir>')  CLEAR LOG
        ```

        * `<DatabaseName>` - the name of the new database or existing database that you want to restore
        * `<Timestamp>` - the exact timestamp of the Point in time restore
        * `<DatabaseName@HostName>` - the name of the database whose backup is used for restore and the **host** / SAP HANA server name on which this database resides. The `USING SOURCE <DatabaseName@HostName>`  option specifies that the data backup (used for restore) is of a database with a different SID or name than the target SAP HANA machine. So it need not be specified for restores done on the same HANA server from where the backup is taken.
        * `<PathToGeneratedCatalogInStep3>` - the path to the catalog file generated in **Step C**
        * `<DataFileDir>` - the folder that contains the full backups
        * `<LogFilesDir>` - the folder that contains the log backups, differential and incremental backups (if any)
        * `<BackupIdFromJsonFile>` - the **BackupId** extracted in **Step C**
    * To restore using backup ID:

        ```hdbsql
        RECOVER DATA FOR <db> USING BACKUP_ID <bkId> USING CATALOG PATH <path> USING LOG PATH <path> USING DATA PATH <path>  CHECK ACCESS USING FILE
        ```
 
      Examples:

      SAP HANA SYSTEM restoration on same server

        ```hdbsql
        RECOVER DATABASE FOR SYSTEM UNTIL TIMESTAMP '2022-01-12T08:51:54.023' USING CATALOG PATH ('/restore/catalo_gen') USING LOG PATH ('/restore/Log/') USING DATA PATH ('/restore/Data_2022-01-12_08-51-54/') USING BACKUP_ID 1641977514020 CHECK ACCESS USING FILE
        ```

      SAP HANA tenant restoration on same server

        ```hdbsql
        RECOVER DATABASE FOR DHI UNTIL TIMESTAMP '2022-01-12T08:51:54.023' USING CATALOG PATH ('/restore/catalo_gen') USING LOG PATH ('/restore/Log/') USING DATA PATH ('/restore/Data_2022-01-12_08-51-54/') USING BACKUP_ID 1641977514020 CHECK ACCESS USING FILE
        ```

      SAP HANA SYSTEM restoration on different server

        ```hdbsql
        RECOVER DATABASE FOR SYSTEM UNTIL TIMESTAMP '2022-01-12T08:51:54.023' USING SOURCE <sourceSID> USING CATALOG PATH ('/restore/catalo_gen') USING LOG PATH ('/restore/Log/') USING DATA PATH ('/restore/Data_2022-01-12_08-51-54/') USING BACKUP_ID 1641977514020 CHECK ACCESS USING FILE
        ```

      SAP HANA tenant restoration on different server

        ```hdbsql
        RECOVER DATABASE FOR DHI UNTIL TIMESTAMP '2022-01-12T08:51:54.023' USING SOURCE <sourceSID> USING CATALOG PATH ('/restore/catalo_gen') USING LOG PATH ('/restore/Log/') USING DATA PATH ('/restore/Data_2022-01-12_08-51-54/') USING BACKUP_ID 1641977514020 CHECK ACCESS USING FILE
        ```

### Partial restore as files

The Azure Backup service decides the chain of files to be downloaded during restore as files. But there are scenarios where you might not want to download the entire content again.

For eg., when you have a backup policy of weekly fulls, daily differentials and logs, and you already downloaded files for a particular differential. You found that this is not the right recovery point and decided to download the next day's differential. Now you just need the differential file since you already have the starting full. With the partial restore as files ability, provided by Azure Backup, you can now exclude the full from the download chain and download only the differential.

#### Excluding backup file types

The **ExtensionSettingOverrides.json** is a JSON (JavaScript Object Notation) file that contains overrides for multiple settings of the Azure Backup service for SQL. For "Partial Restore as files" operation, a new JSON field ` RecoveryPointsToBeExcludedForRestoreAsFiles ` must be added. This field holds a string value that denotes which recovery point types should be excluded in the next restore as files operation.

1. In the target machine where files are to be downloaded, go to "opt/msawb/bin" folder
2. Create a new JSON file named "ExtensionSettingOverrides.JSON", if it doesn't already exist.
3. Add the following JSON key value pair

    ```json
    {
    "RecoveryPointsToBeExcludedForRestoreAsFiles": "ExcludeFull"
    }
    ```

4. Change the permissions and ownership of the file as follows:
   
    ```bash
    chmod 750 ExtensionSettingsOverrides.json
    chown root:msawb ExtensionSettingsOverrides.json
    ```

5. No restart of any service is required. The Azure Backup service will attempt to exclude backup types in the restore chain as mentioned in this file.

The ``` RecoveryPointsToBeExcludedForRestoreAsFiles ``` only takes specific values which denote the recovery points to be excluded during restore. For SAP HANA, these values are:

- ExcludeFull (Other backup types such as differential, incremental and logs will be downloaded, if they are present in the restore point chain.
- ExcludeFullAndDifferential (Other backup types such as incremental and logs will be downloaded, if they are present in the restore point chain)
- ExcludeFullAndIncremental (Other backup types such as differential and logs will be downloaded, if they are present in the restore point chain)
- ExcludeFullAndDifferentialAndIncremental (Other backup types such as logs will be downloaded, if they are present in the restore point chain)

### Restore to a specific point in time

If you've selected **Logs (Point in Time)** as the restore type, do the following:

1. Select a recovery point from the log graph and select **OK** to choose the point of restore.

    ![Restore point](media/sap-hana-db-restore/restore-point.png)

1. On the **Restore** menu, select **Restore** to start the restore job.

    ![Select restore](media/sap-hana-db-restore/restore-restore.png)

1. Track the restore progress in the **Notifications** area or track it by selecting **Restore jobs** on the database menu.

    ![Restore triggered successfully](media/sap-hana-db-restore/restore-triggered.png)

### Restore to a specific recovery point

If you've selected **Full & Differential** as the restore type, do the following:

1. Select a recovery point from the list and select **OK** to choose the point of restore.

    ![Restore specific recovery point](media/sap-hana-db-restore/specific-recovery-point.png)

1. On the **Restore** menu, select **Restore** to start the restore job.

    ![Start restore job](media/sap-hana-db-restore/restore-specific.png)

1. Track the restore progress in the **Notifications** area or track it by selecting **Restore jobs** on the database menu.

    ![Restore progress](media/sap-hana-db-restore/restore-progress.png)

    > [!NOTE]
    > In Multiple Database Container (MDC) restores after the system DB is restored to a target instance, one needs to run the pre-registration script again. Only then the subsequent tenant DB restores will succeed. To learn more refer to [Troubleshooting – MDC Restore](backup-azure-sap-hana-database-troubleshoot.md#multiple-container-database-mdc-restore).

## Cross Region Restore

As one of the restore options, Cross Region Restore (CRR) allows you to restore SAP HANA databases hosted on Azure VMs in a secondary region, which is an Azure paired region.

To onboard to the feature, read the [Before You Begin section](./backup-create-rs-vault.md#set-cross-region-restore).

To see if CRR is enabled, follow the instructions in [Configure Cross Region Restore](backup-create-rs-vault.md#set-cross-region-restore)

### View backup items in secondary region

If CRR is enabled, you can view the backup items in the secondary region.

1. From the portal, go to **Recovery Services vault** > **Backup items**.
1. Select **Secondary Region** to view the items in the secondary region.

>[!NOTE]
>Only Backup Management Types supporting the CRR feature will be shown in the list. Currently, only support for restoring secondary region data to a secondary region is allowed.

![Backup items in secondary region](./media/sap-hana-db-restore/backup-items-secondary-region.png)

![Databases in secondary region](./media/sap-hana-db-restore/databases-secondary-region.png)

### Restore in secondary region

The secondary region restore user experience will be similar to the primary region restore user experience. When configuring details in the Restore Configuration pane to configure your restore, you'll be prompted to provide only secondary region parameters. A vault should exist in the secondary region and the SAP HANA server should be registered to the vault in the secondary region.

![Where and how to restore](./media/sap-hana-db-restore/restore-secondary-region.png)

![Trigger restore in progress notification](./media/backup-azure-arm-restore-vms/restorenotifications.png)

>[!NOTE]
>* After the restore is triggered and in the data transfer phase, the restore job can't be cancelled.
>* The role/access level required to perform restore operation in cross-regions are _Backup Operator_ role in the subscription and _Contributor(write)_ access on the source and target virtual machines. To view backup jobs, _ Backup reader_ is the minimum premission required in the subscription.
>* The RPO for the backup data to be available in secondary region is 12 hours. Therefore, when you turn on CRR, the RPO for the secondary region is 12 hours + log frequency duration (that can be set to a minimum of 15 minutes).

### Monitoring secondary region restore jobs

1. In the Azure portal, go to **Backup center** > **Backup Jobs**.
1. Filter **Operation** for value **CrossRegionRestore** to view the jobs in the secondary region.

   :::image type="content" source="./media/sap-hana-db-restore/hana-view-jobs-inline.png" alt-text="Screenshot showing filtered Backup jobs." lightbox="./media/sap-hana-db-restore/hana-view-jobs-expanded.png":::

## Next steps

- [Learn how](sap-hana-db-manage.md) to manage SAP HANA databases backed up using Azure Backup
- [About backup of SAP HANA databases in Azure VMs](sap-hana-database-about.md).
