---
title: Upgrade Azure Backup Server to v.2 | Microsoft Docs
description: Learn about the new features when you upgrade to Azure Backup Server v.2. This article provides instruction on upgrading your Azure Backup Server installation.
services: backup
documentationcenter: ''
author: markgalioto
manager: carmonm
editor: ''

ms.assetid:
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/15/2017
ms.author: masaran;markgal
---

# Upgrade Azure Backup Server to v.2


You can install Azure Backup Server v.2 on Windows Server 2012 R2, or on Windows Server 2016. However to take advantage of Modern Backup Storage, Azure Backup Server v.2 must be installed on Windows Server 2016. Before you upgrade or install Azure Backup Server v.2, please read the [Installation prerequisites](http://docs.microsoft.com/system-center/dpm/install-dpm.md#setup-prerequisites).

> [!NOTE]
> Azure Backup Server is based on the same code base as System Center Data Protection Manager (DPM). Azure Backup Server v.1 is equivalent to DPM 2012 R2, and Azure Backup Server is equivalent to DPM 2016. This documentation occasionally references the DPM documentation.
>
>

## Upgrade path for Azure Backup Server v.2
If you are going to upgrade Azure Backup Server v.1 to v.2, make sure your installation has the necessary updates:

- Update the agents on the protected servers.
- Upgrade Windows Server 2012 R2 to Windows Server 2016.
- Upgrade Azure Backup Server Remote Administrator on all production servers.
- Backups will continue without rebooting your production server.


### Upgrade steps for Azure Backup Server v.2

1. To install Azure Backup Server v.2, double-click Setup.exe to open the System Center 2016 Wizard.
2. Under Install, click Azure Backup Ser. This starts Setup. Agree to the license terms and conditions and follow the setup wizard.

Some DPM 2016 features, such as Modern Backup Storage, require the Windows Server 2016 RTM build. It is possible to upgrade DPM 2016 from DPM 2012 R2, running on Windows Server 2012 R2. However, customers receiving DPM 2016 will want the latest features, so Microsoft recommends installing DPM 2016 on a new installation of Windows Server 2016 RTM. For instructions on installing DPM, see the article, [Installing DPM 2016](http://docs.microsoft.com/system-center/dpm/install-dpm.md).

## Migrating the DPM database during upgrade

You may want to move the DPM Database as part of an upgrade.  For example, you are merging instances of SQL Server. You are moving to a remote more powerful SQL server. You want to add fault tolerance by using a SQL Server cluster; or you want to move from a remote SQL server to a local SQL server or vice versa. DPM 2016 setup allows you to migrate the DPM database to different SQL Servers during an upgrade.

### Possible database migration scenarios

1. Upgrading DPM 2012 R2 using a local instance and migrating to a remote instance of SQL Server during setup.
2. Upgrading DPM 2012 R2 using a remote instance and migrating to a local instance of SQL Server during setup.
3. Upgrading DPM 2012 R2 using a local instance and migrating to a remote SQL Server Cluster instance during setup.
4. Upgrading DPM 2012 R2 using a local instance and migrating to a different local instance of SQL Server during setup.
5. Upgrading DPM 2012 R2 using a remote instance and migrating to a different remote instance of SQL Server during setup.
6. Upgrading DPM 2012 R2 using a remote instance and migrating to a remote SQL Server Cluster instance during setup.

### Preparing for a database migration

The new SQL Server that you want to use to migrate the DPM database to must have the same SQL Server requirements, setup configuration, firewall rules, and DPM Support files (sqlprep) installed before performing the DPM Upgrade.

Once you have the new instance of SQL Server installed and prepped for being used by DPM, you must make a backup of the current DPM 2012 R2 UR10 KB3143871 (4.2.1473.0) or a later database and restore it on the new SQL Server.

### Pre-upgrade steps: Backup and restore DPM 2012 R2 DPM database to a new SQL instance

In this example, we will prepare a remote SQL Server cluster to use for the migration.

1. On the System Center Data Protection Manager 2012 R2 server or on the remote SQL Server hosting the DPM database, start **Microsoft SQL Management Studio** and connect to the SQL instance hosting the current DPM 2012 R2 DPMDB.
2. Right-click the DPM database, and under **Tasks**, select the **Back Up…** option.

      ![Select Backup](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-select-backup.png)

3. Add a backup destination and file name, and then select **OK** to start the backup.

      ![Confirm](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-confirm.png)

4. After the backup is complete, copy the output file to the remote SQL Server.  If this is a SQL Cluster, copy it to the active node hosting the SQL instance you want to use in the DPM upgrade.  You have to copy it to the Shared Cluster disk before you can restore it.
5. On the Remote SQL Server, start **Microsoft SQL Management Studio** and connect to the SQL instance you want to use in the DPM upgrade.  If this is a SQL Cluster, do this on the Active node that you copied the DPM backup file to.  The backup file should now be located on the shared cluster disk.
6. Right-click the Databases icon, then select the **Restore Database…** option. This starts the restore wizard.

      ![Select restore database](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-select-restore-database.png)        

7. Select **Device** under **Source**, and then locate the database backup file that was copied in the previous step and select it. Verify the restore options and restore location, and then select **OK** to start the restore. Fix any issue that arise until the restore is successful.

      ![Restore database](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-restore-database.png)

8. After the restore is complete, the restored database will be seen under the **Databases** with the original name. This Database will be used during the upgrade. You can exit **Microsoft SQL Management Studio** and start the upgrade process on the original DPM Server.

      ![Select DPMDB](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-select-dpmdb.png)

9. If the new SQL Server is a remote SQL server, install the SQL management tools on the DPM server. The SQL management tools must be the same version matching the SQL server hosting the DPMDB.

### Starting upgrade to migrate DPMDB to a different SQL Server

> [!NOTE]
> If sharing a SQL instance, run the DPM installations (or upgrades) sequentially. Parallel installations may cause errors.

1. After the pre-migration preparation steps are complete, start the DPM 2016 Installation process.  DPM Setup shows the information about current instance of SQL Server pre-populated. This is where you can select a different instance of SQL Server, or change to a Clustered SQL instance used in the migration.

      ![DPM setup](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-data-protection-manager-setup.png)

2. Change the SQL Settings to use the instance of SQL Server you restored the DPM Database to. If it’s a SQL cluster, you must also specify a separate instance of SQL Server  used for SQL reporting. It's presumed that firewall rules and SQLPrep are already ran. You have to enter correct credentials and then click the **Check and Install** button.

      ![Install database](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-install-database.png)

3. Prerequisite check should succeed, press NEXT to continue with the upgrade.

      ![Prerequisites check](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-prerequisites-check.png)

4. Continue the wizard.

5. After setup is complete, the corresponding database name on the instance specified will now be DPMPB_DPMServerName. Because this may be shared with other DPM servers, the naming convention for the DPM database will now be: DPM2016$DPMDB_DPMServerName

## Adding Storage for Modern Backup Storage

To store backups efficiently, DPM 2016 uses Volumes. Disks can also be used to continue storing backups like DPM 2012 R2.

### Add Volumes and Disks
If you run DPM 2016 on Windows Server, you can use volumes to store backup data. Volumes provide storage savings and faster backups. You can give the volume a friendly name, and you can change the name. You apply the friendly name while adding the volume, or later by clicking the **Friendly Name** column of the desired volume. You can also use PowerShell to add or change friendly names for volumes.

To add a volume in the administrator console:

1. In the DPM Administrator console, select the **Management** feature > **Disk Storage** > **Add**.

2. In the **Add Disk Storage** dialog, select an available volume > click **Add** > type a friendly name for the volume ** > click **OK**.

      ![Add volume](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-add-volume.png)

If you want to add a disk, it must belong to a protection group with legacy storage. Those disks can only be used for those protection groups. If the DPM server doesn't have sources with legacy protection, the disk won't appear.
See the topic, [Adding disks to increase legacy storage](http://docs.microsoft.com/system-center/dpm/upgrade-to-dpm-2016.md#adding-disks-to-increase-legacy-storage), for more information on adding disks. You can't give disks a friendly name.


### Assign Workloads to Volumes

DPM 2016 allows the user to specify which kinds of workloads should be assigned to which volumes. For example, expensive volumes that support high IOPS can be configured to store only the workloads that require frequent, high-volume backups like SQL with Transaction Logs.
To update the properties of a volume in the storage pool on a DPM server, use the PowerShell cmdlet, Update-DPMDiskStorage.

**Update-DPMDiskStorage**

**Syntax**

`Parameter Set: Volume`

```
Update-DPMDiskStorage [-Volume] <Volume> [[-FriendlyName] <String> ] [[-DatasourceType] <VolumeTag[]> ] [-Confirm] [-WhatIf] [ <CommonParameters>]
```

The changes made through PowerShell are reflected in the UI.


## Protecting Data Sources
To begin protecting data sources, create a Protection Group. The following procedure highlights changes or additions to the **New Protection Group** wizard.

To create a Protection Group:

1. In the DPM Administrator Console, select the **Protection** feature.

2. On the tool ribbon, click **New**.

    The **Create new Protection Group** wizard opens.

  ![Create protection group](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-protection-wiz.png)

3. Click **Next** to advance the wizard to the **Select Protection Group Type** screen.
4. On the **Select Protection Group Type** screen, select the type of Protection Group to be created and then click **Next**.

  ![Choose server or client](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-protection-group-screen2.png)

5. On the **Select Group Members** screen, in the **Available members** pane, DPM lists the members with protection agents. For the purposes of this example, select volume D:\ and E:\ to add them to the **Selected members** pane. Once you have chosen the members for the protection group, click **Next**.

  ![Select group members for protection group](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-protection-screen3.png)

6. On the **Select Data Protection Method** screen, type a name for the **Protection group**, select the protection method(s) and click **Next**.
    If you want short term protection, you must use Disk backup.

  ![Select data protection method](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-protection-screen4.png)

7. On the **Specify Short-Term Goals** screen specify the details for **Retention Range** and **Synchronization Frequency**, and click **Next**. If desired, click **Modify** to change the schedule when recovery points are taken.

  ![Select data protection method](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-protection-screen5.png)

8. The **Review Disk Storage Allocation** screen provides details about the selected data sources, their size, the **Space to be Provisioned**, and **Target Storage Volume**.

  ![Review Disk Storage Allocation](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-protection-screen6.png)

  The storage volumes are determined based on the workload volume allocation (set using PowerShell) and the available storage. You can change the storage volumes by selecting other volumes from the drop-down menu. If you change the **Target Storage**, the **Available disk storage** dynamically changes to reflect the **Free Space** and **Underprovisioned Space**.

  The **Underprovisioned Space** column in **Available disk storage**, reflects the amount of additional storage needed if the data sources grow as planned. Use this value to help plan your storage needs to enable smooth backups. If the value is zero, then there are no potential problems with storage in the foreseeable future. If the value is a number other than zero, then you do not have sufficient storage allocated  - based on your protection policy and the data size of your protected members.

  ![Underallocated disk storage](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-underprovision-storage.png)

The remainder of the New Protection Group wizard is unchanged from DPM 2012 R2. Continue through the wizard to complete creation of your new protection group.

## Migrating legacy storage to Modern Backup Storage
After upgrading DPM 2012 R2 to DPM 2016 and the operating system to Windows Server 2016, you can update your existing protection groups to the new DPM 2016 features. By default, protection groups are not changed, and continue to function as they were configured in DPM 2012 R2. Updating protection groups to use Modern Backup Storage is optional. To update the protection group, stop protection of all data sources with Retain Data, and add the data sources to a new protection group. DPM begins protecting these data sources the new way.

1. In the Administrator Console, select the **Protection** feature, and in the **Protection Group Member** list, right-click the member, and select **Stop protection of member...**.

  ![Stop protection](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-stop-protection1.png)

  The **Remove from Group** dialog opens.

2. In the **Remove from Group** dialog, review the used disk space and the available free space in the storage pool. The default is to leave the recovery points on the disk and allow them to expire per their associated retention policy. Click **OK**.

    If you want to immediately return the used disk space to the free storage pool, select **Delete replica on disk**. This will delete the backup data (and recovery points) associated with that member.

    ![Retain data](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-retain-data.png)

3. Create a new protection group that uses Modern Backup Storage, and include the unprotected data sources.


## Adding Disks to increase legacy storage

If you want to use legacy storage with DPM 2016, it may become necessary to add disks to increase legacy storage. To add disk storage:

1. On the Administrator Console, click **Management**.

2. Select **Disk Storage**.

3. On the tool ribbon click **Add**.

    The **Add Disk Storage** dialog opens.

    ![Add disks](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-add-disk-storage.png)

4. In the **Add Disk Storage** dialog, click **Add disks**.

    DPM provides a list of available disks.

5. Select the disks, click **Add** to add the disks, and click **OK**.

## New PowerShell cmdlets

For DPM 2016, two new cmdlets: [Mount-DPMRecoveryPoint](https://technet.microsoft.com/library/mt787159.aspx) and [Dismount-DPMRecoveryPoint](https://technet.microsoft.com/library/mt787158.aspx) are available. Click the cmdlet name to see its reference documentation.


## Enable Cloud Protection

You can back up a DPM server to Azure. The high level steps are:
- create an Azure subscription,
- register the server with the Azure Backup service,
- download vault credentials and the Azure Backup Agent,
- configure the server's vault credentials and backup policy,

For more information on backing up DPM to the cloud, see the article, [Preparing to backup workloads to Azure with DPM](http://docs.microsoft.com/system-center/dpm/backup-azure-dpm-introduction).
