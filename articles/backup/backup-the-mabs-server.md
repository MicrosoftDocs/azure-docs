---
title: Back up the MABS server
description: Learn how to back up the Microsoft Azure Backup Server (MABS).
ms.topic: conceptual
ms.date: 09/24/2020
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up the MABS server

To ensure that data can be recovered if Microsoft Azure Backup Server (MABS) fails, you'll need a strategy for backing up the MABS server. If it isn't backed up you'll need to rebuild it manually after a failure, and disk-based recovery points won't be recoverable. You can back up MABS servers by backing up the MABS database.

## Back up the MABS database

As part of your MABS backup strategy, you'll have to back up the MABS database. The MABS database is named DPMDB. This database contains the MABS configuration together with data about backups of MABS. If there's a disaster, you can rebuild most of the functionality of a MABS server by using a recent backup of the database. Assuming you can restore the database, tape-based backups are accessible, and they maintain all protection group settings and backup schedules. If the MABS storage pool disks were not affected by the outage, disk-based backups are also usable after a rebuild. You can back up the database by using several different methods.

|Database backup method|Advantages|Disadvantages|
|--------------------------|--------------|-----------------|
|[Back up to Azure](#back-up-to-azure)|<li>Easily configured and monitored in MABS.<li>Multiple locations of the backup database files.<li>Cloud storage provides a robust solution for disaster recovery.<li>Very secure storage for the database.<li>Supports 120 online recovery points.|<li>Requires Azure account and additional MABS configuration. Incurs some cost for Azure storage.<li> Requires a supported version of Windows Server based system with the Azure agent to gain access to MABS backups stored in the Azure backup vault. This can't be another MABS server.<li>Not an option if the database is hosted locally and you want to enable secondary protection. <li>Some extra preparation and recovery time is incurred.|
|[Back up the database by backing up the MABS storage pool](#back-up-the-database-by-backing-up-the-mabs-storage-pool)|<li>Simple to configure and monitor.<li>The backup is kept on the MABS storage pool disks and is easy to access locally.<li>MABS scheduled backups support 512 express full backups. If you back up hourly, you'll have 21 days of full protection.|<li>Not a good option for disaster recovery. It's online and recovery might not work as expected if the MABS server or storage pool disk fails.<li>Not an option if the database is hosted locally and you want to enable secondary protection. <li>Some preparation and special steps are required to gain access to the recovery points if the MABS service or console isn't running or working.|
|[Back up with native SQL Server backup to a local disk](#back-up-with-native-sql-server-backup-to-a-local-disk)|<li>Built-in to SQL Server.<li>The backup is kept on a local disk that is easily accessible.<li>It can be scheduled to run as often as you like.<li>Totally independent of MABS.<li>You can schedule a backup file cleanup.|<li>Not a good option for disaster recovery unless the backups are copied to a remote location.<li>Requires local storage for backups, which may limit retention and frequency.|
|[Back up with native SQL backup and MABS protection to a share protected by MABS](#back-up-to-a-share-protected-by-mabs)|<li>Easily monitored in MABS.<li>Multiple locations of the backup database files.<li>Easily accessible from any Windows machine on the network.<li>Potentially the fastest recovery method.|<li>Only supports 64 recovery points.<li>Not a good option for site disaster recovery. MABS server or MABS storage pool disk failure may hinder recovery efforts.<li>Not an option if the MABS DB is hosted locally and you want to enable secondary protection. <li>Some extra preparation is needed to get it configured and tested.<li>Some extra preparation and recovery time is needed should the MABS server itself be down but MABS storage pool disks are fine.|

- If you back up by using a MABS protection group, we recommend that you use a unique protection group for the database.

    > [!NOTE]
    > For restore purposes, the MABS installation you want to restore with the MABS database must match the version of the MABS database itself.  For example, if the database you want to recover is from a MABS V3 with Update Rollup 1 installation, the MABS server must be running the same version with Update Rollup 1. This means that you might have to uninstall and reinstall MABS with a compatible version before you restore the database.  To check the database version you might have to mount it manually to a temporary database name and then run a SQL query against the database to check the last installed rollup, based on the major and minor versions.

- To check the MABS database version, follow these steps:

    1. To run the query, open SQL Management Studio, and then connect to the SQL instance that's running the MABS database.

    2. Select the MABS database, and then start a new query.

    3. Paste the following SQL query into the query pane and run it:

        `Select distinct MajorVersionNumber,MinorVersionNumber ,BuildNumber, FileName FROM dbo.tbl\_AM\_AgentPatch order byMajorVersionNumber,MinorVersionNumber,BuildNumber`

    If nothing is returned in the query results, or if the MABS server was upgraded from previous versions but no new update rollup was installed since then, there won't be an entry for the major, minor for a base installation of MABS. To check the MABS versions associated with update rollups see [List of Build Numbers for MABS](https://social.technet.microsoft.com/wiki/contents/articles/36381.microsoft-azure-backup-server-list-of-build-numbers.aspx).

### Back up to Azure

1. Before you start, you'll need to run a script to retrieve the MABS replica volume mount point path so that you know which recovery point contains the MABS backup. Do this after initial replication with Azure Backup. In the script, replace `dplsqlservername%` with the name of the SQL Server instance hosting the MABS database.

    ```SQL
    Select ag.NetbiosName as ServerName,ds.DataSourceName,vol.MountPointPath
    from tbl_IM_DataSource as ds
    join tbl_PRM_LogicalReplica as lr on ds.DataSourceId=lr.DataSourceId
    join tbl_AM_Server as ag on ds.ServerId=ag.ServerId
    join tbl_SPM_Volume as vol on lr.PhysicalReplicaId=vol.VolumeSetID
    and vol.Usage =1
    and lr.Validity in (1,2)
    where ds.datasourcename like '%dpmdb%'
    and servername like '%dpmsqlservername%' --netbios name of server hosting DPMDB
    ```

    Make sure you have the passcode that was specified when the Azure Recovery Services Agent was installed and the MABS server was registered in the Azure Backup vault. You'll need this passcode to restore the backup.

2. Create an Azure Backup vault, download the Azure Backup Agent installation file and vault credentials. Run the installation file to install the agent on the MABS server and use the vault credentials to register the MABS server in the vault. [Learn more](backup-azure-microsoft-azure-backup.md).

3. After the vault is configured, set up a MABS protection group that contains the MABS database. Select to back it up to disk and to Azure.

#### Recover the MABS database from Azure

You can recover the database from Azure using any MABS server that's registered in the Azure Backup vault, as follows:

1. In the MABS console, select **Recovery** > **Add External MABS**.

2. Provide the vault credentials (download from the Azure Backup vault). Note that the credentials are only valid for two days.

3. In **Select External MABS for Recovery**, select the MABS server for which you want to recover the database, type in the encryption passphrase, and select **OK.**

4. Select the recovery point you want to use from the list of available points. Select **Clear External MABS** to return to the local MABS view.

## Back up the MABS database to MABS storage pool

> [!NOTE]  
> This option is applicable for MABS with Modern Backup Storage.

1. In the MABS console, select **Protection** > **Create protection group**.
2. On the **Select Protection Group Type** page, select **Servers**.
3. On the **Select group members** page, select **DPM database**. Expand the MABS server and select DPMDB.
4. On the **Select Data Protection Method** page, select **I want short-term protection using disk**. Specify the short-term protection policy options.
5. After initial replication of the MABS database, run the following SQL script:

```SQL
select AG.NetbiosName, DS.DatasourceName, V.AccessPath, LR.PhysicalReplicaId from tbl_IM_DataSource DS
join tbl_PRM_LogicalReplica as LR
on DS.DataSourceId = LR.DataSourceId
join tbl_AM_Server as AG
on DS.ServerId=AG.ServerId
join tbl_PRM_ReplicaVolume RV
on RV.ReplicaId = LR.PhysicalReplicaId
join tbl_STM_Volume V
on RV.StorageId = V.StorageId
where datasourcename like N'%dpmdb%' and ds.ProtectedGroupId is not null
and LR.Validity in (1,2)
and AG.ServerName like N'%<dpmsqlservername>%' -- <dpmsqlservername> is a placeholder, put netbios name of server hosting DPMDB
```

### Recover MABS database

To reconstruct your MABS with the same DB, you need to first recover the MABS database and sync it with the freshly installed MABS.

#### Use the following steps

1. Open an administrative command prompt and run `psexec.exe -s powershell.exe` to start a PowerShell window in system context.
2. Decide the location from where you want to recover the database:

#### To copy the database from the last backup

1. Navigate to replica VHD path `\<MABSServer FQDN\>\<PhysicalReplicaId\>\<PhysicalReplicaId\>`
2. Mount the **disk0.vhdx** present in it using `mount-vhd disk0.vhdx` command.
3. Once the replica VHD is mounted, use `mountvol.exe` to assign a drive letter to the replica volume using the physical replica ID from the SQL script output. For example: `mountvol X: \?\Volume{}\`

#### To copy the database from a previous recovery point

1. Navigate to the DPMDB container directory  `\<MABSServer FQDN\>\<PhysicalReplicaId\>`. You'll see multiple directories with some unique GUID identifiers under it corresponding recovery points taken for the MABS DB. Other directories represent a PIT/recovery point.
2. Navigate to any PIT vhd path, for example `\<MABSServer FQDN\>\<PhysicalReplicaId\>\<PITId\>` and mount the **disk0.vhdx** present in it using the `mount-vhd disk0.vhdx` command.
3. Once the replica VHD is mounted, use `mountvol.exe` to assign a drive letter to the replica volume, using the physical replica ID from the SQL script output. For example: `mountvol X: \?\Volume{}\`

   All of the terms that appear with angular braces in the above steps are place holders. Replace them with appropriate values as follows:
   - **ReFSVolume** - Access path from the SQL script output
   - **MABSServer FQDN** - Fully qualified name of the MABS server
   - **PhysicalReplicaId** - Physical replica ID from the SQL script out
   - **PITId** - GUID identifier other than the physical replica ID in the container directory.
4. Open another administrative command prompt and run `psexec.exe -s cmd.exe` to start a command prompt in system context.
5. Change the directory to the X: drive and navigate to the location of the MABS database files.
6. Copy them to a location that's easy to restore from. Exit the psexec cmd window after you copy.
7. Go to the psexec PowerShell window opened in step 1, navigate to the VHDX path, and dismount the VHDX by using the command `dismount-vhd disk0.vhdx`.
8. After reinstalling the MABS server, you can use the restored DPMDB to attach to the MABS server by running `DPMSYNC-RESTOREDB` command.
9. Run `DPMSYNC-SYNC` once `DPMSYNC-RESTOREDB` is complete.

### Back up the database by backing up the MABS storage pool

> [!NOTE]
> This option is applicable for MABS with legacy storage.

Before you start, you'll need to run a script to retrieve the MABS replica volume mount point path so that you know which recovery point contains the MABS backup. Do this after initial replication with Azure Backup. In the script, replace `dplsqlservername%` with the name of the SQL Server instance hosting the MABS database.

```SQL
Select ag.NetbiosName as ServerName,ds.DataSourceName,vol.MountPointPath
from tbl_IM_DataSource as ds
join tbl_PRM_LogicalReplica as lr on ds.DataSourceId=lr.DataSourceId
join tbl_AM_Server as ag on ds.ServerId=ag.ServerId
join tbl_SPM_Volume as vol on lr.PhysicalReplicaId=vol.VolumeSetID
and vol.Usage =1
and lr.Validity in (1,2)
where ds.datasourcename like '%dpmdb%'
and servername like '%dpmsqlservername%' --netbios name of server hosting DPMDB
```

1. In the MABS console, select **Protection** > **Create protection group**.

2. On the **Select Protection Group Type** page, select  **Servers**.

3. On the **Select group members** page, select the MABS database. Expand the MABS server item and select **DPMDB**.

4. On the  **Select Data Protection Method** page, select **I want short-term protection using disk**. Specify the short-term protection policy options. We recommend a retention range of two weeks for MABS databases.

#### Recover the database

If the MABS server is still operational and the storage pool is intact (such as problems with the MABS service or console), then copy the database from the replica volume or a shadow copy as follows:

1. Decide from when you want to recover the database.

    - If you want to copy the database from the last backup taken directly from the MABS replica volume, use **mountvol.exe** to assign a drive letter to the replica volume using the GUID from the SQL script output. For example: `C:\Mountvol X: \\?\Volume{d7a4fd76\-a0a8\-11e2\-8fd3\-001c23cb7375}\`

    - If you want to copy the database from a previous recovery point (shadow copy), then you need to list all the shadow copies for the replica using the volume GUID from the SQL script output. This command lists shadow copies for that volume: `C:\>Vssadmin list shadows /for\=\\?\Volume{d7a4fd76-a0a8-11e2-8fd3-001c23cb7375}\`. Note the creation time and the shadow copy ID you want to recover from.

2. Then use **diskshadow.exe** to mount the shadow copy to an unused drive letter X: using the shadow copy ID, so you can copy the database files.

3. Open an administrative command prompt and run `psexec.exe -s cmd.exe` to start a command prompt in system context, so you have permission to navigate to the replica volume (X:) and copy the files.

4. CD to the X: drive and navigate to the location of the MABS database files. Copy them to a location that's easy to restore from. After the copy is complete exist the psexec cmd window, and run **diskshadow.exe** and unexpose the X: volume.

5. Now you can restore the database files by using SQL Management Studio or by running **DPMSYNC\-RESTOREDB**.

## Back up with native SQL Server backup to a local disk

You can back up the MABS database to a local disk with native SQL Server backup, independent of MABS.

- Get an [overview](/sql/relational-databases/backup-restore/back-up-and-restore-of-sql-server-databases) of SQL Server backup.

- [Learn more](/sql/relational-databases/backup-restore/sql-server-backup-and-restore-with-microsoft-azure-blob-storage-service) about backing up SQL Server to the cloud.

## Back up to a share protected by MABS

This backup option uses native SQL to back up the MABS database to a share, protects the share with MABS, and uses Windows VSS previous versions to facilitate the restore.

### Before you start

1. On the SQL Server, make a folder on a drive with enough free space to hold a single copy of a backup. For example: `C:\MABSBACKUP`.

1. Share the folder. For example, share `C:\MABSBACKUP` folder as *DPMBACKUP*.

1. Copy and paste the OSQL command below into Notepad and save it to a file named `C:\MABSACKUP\bkupdb.cmd`. Make sure there's no .txt extension. Modify the SQL_Instance_name and DPMDB_NAME to match the instance and DPMDB name used by your MABS server.

    ```SQL
    OSQL -E -S localhost\SQL_INSTANCE_NAME -Q "BACKUP DATABASE DPMDB_NAME TO DISK='C:\DPMBACKUP\dpmdb.bak' WITH FORMAT"
    ```

1. Using Notepad, open the **ScriptingConfig.xml** file located under the `C:\Program Files\Microsoft System Center\DPM\DPM\Scripting` folder on the MABS server.

1. Modify **ScriptingConfig.xml** and change **DataSourceName=** to be the drive letter that contains the DPMDBBACKUP folder/share. Change the PreBackupScript entry to the full path and name of **bkupdb.cmd** saved in step 3.

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <ScriptConfiguration xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns="https://schemas.microsoft.com/2003/dls/ScriptingConfig.xsd">
    <DatasourceScriptConfig DataSourceName="C:">
    <PreBackupScript>C:\MABSDBBACKUP\bkupdb.cmd</PreBackupScript>
    <TimeOut>120</TimeOut>
    </DatasourceScriptConfig>
    </ScriptConfiguration>
    ```

1. Save the changes to **ScriptingConfig.xml**.

1. Protect the C:\MABSBACKUP folder or the `\sqlservername\MABSBACKUP` share using MABS and wait for the initial replica to be created. There should be a **dpmdb.bak** in the C:\MABSBACKUP folder as a result of the pre-backup script running, which was in turn copied to the MABS replica.

1. If you don't enable self-service recovery, you'll need some additional steps to share out the MABSBACKUP folder on the replica:

    1. In the MABS console > **Protection**, locate the MABSBACKUP data source and select it. In the details section, select **Click to view details** on the link to the replica path and copy the path into Notepad. Remove the source path and retain the destination path. The path should look similar to the following: `C:\Program Files\Microsoft System Center\DPM\DPM\Volumes\Replica\File System\vol_c9aea05f-31e6-45e5-880c-92ce5fba0a58\454d81a0-0d9d-4e07-9617-d49e3f2aa5de\Full\DPMBACKUP`.

    2. Make a share to that path using the share name **MABSSERVERNAME-DPMDB**. You can use the Net Share command below from an administrative command prompt.

        ```cmd
        Net Share MABSSERVERNAME-dpmdb="C:\Program Files\Microsoft System Center\DPM\DPM\Volumes\Replica\File System\vol_c9aea05f-31e6-45e5-880c-92ce5fba0a58\454d81a0-0d9d-4e07-9617-d49e3f2aa5de\Full\DPMBACKUP"
        ```

### Configure the backup

You can back up the MABS database as you would any other SQL Server database using SQL Server native backup.

- Get an [overview](/sql/relational-databases/backup-restore/back-up-and-restore-of-sql-server-databases) of SQL Server backup.

- [Learn more](/sql/relational-databases/backup-restore/sql-server-backup-and-restore-with-microsoft-azure-blob-storage-service) about backing up SQL Server to the cloud.

### Recover the MABS database

1. Connect to the `\\MABSServer\MABSSERVERNAME-dpmdb` share using Explorer from any Windows computer.

2. Right-click the **dpmdb.bak** file to view properties. On the **Previous Versions** tab are all the backups that you can select and copy. There is also the very last backup still located in the C:\MABSBACKUP folder that is also easily accessible.

3. If you need to move a SAN attached MABS storage pool disk to another server to be able to read from the replica volume, or to reinstall Windows to read locally attached disks, you'll need to know the MABS Replica volume Mount point path or Volume GUID beforehand so you know what volume holds the database backup. You can use the SQL script below to extract that information any time after initial protection but before the need to restore. Replace the `%dpmsqlservername%` with the name of the SQL Server hosting the database.

    ```sql
    Select ag.NetbiosName as
    ServerName,ds.DataSourceName,vol.MountPointPath,vol.GuidName
    from tbl_IM_DataSource as ds
    join tbl_PRM_LogicalReplica as lr on ds.DataSourceId=lr.DataSourceId
    join tbl_AM_Server as ag on ds.ServerId=ag.ServerId
    join tbl_SPM_Volume as vol on lr.PhysicalReplicaId=vol.VolumeSetID
    and vol.Usage =1
    and lr.Validity in (1,2)
    where ds.datasourcename like '%C:\%' -- volume drive letter for DPMBACKUP
    and servername like '%dpmsqlservername%' --netbios name of server hosting DPMDB

    ```

4. If you need to recover after moving the MABS storage pool disks or a MABS server rebuild:

    1. You have the volume GUID, so should that volume need to be mounted on another Windows server or after a MABS server rebuild, use **mountvol.exe** to assign it a drive letter using the volume GUID from the SQL script output: `C:\Mountvol X: \\?\Volume{d7a4fd76-a0a8-11e2-8fd3-001c23cb7375}\`.

    2. Reshare the MABSBACKUP folder on the replica volume using the drive letter and portion of the replica path representing the folder structure.

        ```cmd
        net share SERVERNAME-DPMDB="X:\454d81a0-0d9d-4e07-9617-d49e3f2aa5de\Full\DPMBACKUP"
        ```

    3. Connect to the `\\SERVERNAME\MABSSERVERNAME-dpmdb` share using Explorer from any Windows computer.

    4. Right-click the **dpmdb.bak** file to view the properties. On the **Previous Versions** tab are all the backups that you can select and copy.

## Using DPMSync

**DpmSync** is a command-line tool that enables you to synchronize the MABS database with the state of the disks in the storage pool and with the installed protection agents. DpmSync restores the MABS database, synchronizes the MABS database with the replicas in the storage pool, restores the Report database, and reallocates missing replicas.

### Parameters

| Parameter      | Description    |
|----------------|-----------------------------|
| **-RestoreDb**                       | Restores a MABS database from a specified location.|
| **-Sync**                            | Synchronizes restored databases. You must run **DpmSync –Sync** after you restore the databases. After you run **DpmSync –Sync**, some replicas may still be marked as missing. |
| **-DbLoc** *location*                | Identifies the location of the backup of the MABS database.|
| **-InstanceName** <br/>*server\instance*     | Instance to which DPMDB must be restored.|
| **-ReallocateReplica**         | Reallocates all missing replica volumes without synchronization. |
| **-DataCopied**                      | Indicates that you have completed loading data into the newly allocated replica volumes. This is applicable for client computers only. |

**Example 1:** To restore the MABS database from local backup media on the MABS server, run the following command:

```cmd
DpmSync –RestoreDb -DbLoc G:\DPM\Backups\2005\November\DPMDB.bak
```

After you restore the MABS database, to synchronize the databases, run the following command:

```cmd
DpmSync -Sync
```

After you restore and synchronize the MABS database and before you restore the replica, run the following command to reallocate disk space for the replica:

```cmd
DpmSync -ReallocateReplica
```

**Example 2:** To restore the MABS database from a remote database, run the following command on the remote computer:

```cmd
DpmSync –RestoreDb -DbLoc G:\DPM\Backups\2005\November\DPMDB.bak –InstanceName contoso\ms$dpm
```

After you restore the MABS database, to synchronize the databases, run the following command on the MABS server:

```cmd
DpmSync -Sync
```

After you restore and synchronize the MABS database and before you restore the replica, run the following command on the MABS Server to reallocate disk space for the replica:

```cmd
DpmSync -ReallocateReplica
```

## Next steps

- [MABS support matrix](backup-support-matrix-mabs-dpm.md)
- [MABS FAQ](backup-azure-dpm-azure-server-faq.yml)