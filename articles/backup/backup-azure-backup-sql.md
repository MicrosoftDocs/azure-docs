---
title: Back up SQL Server to Azure as a DPM workload
description: An introduction to backing up SQL Server databases by using the Azure Backup service
ms.topic: how-to
ms.date: 12/24/2024
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
ms.custom: engagement-fy24
---

# Back up SQL Server to Azure as a DPM workload

This article describes how to back up and restore the SQL Server databases using Azure Backup.

Azure Backup helps you to back up SQL Server databases to Azure via an Azure account. If you don't have one, you can create a free account in just a few minutes. For more information, see [Create your Azure free account](https://azure.microsoft.com/pricing/free-trial/).

[!INCLUDE [The functionality of Azure Backup trim process.](../../includes/backup-trim-process-notification.md)]

## Backup flow for SQL Server database

To back up a SQL Server database to Azure and to recover it from Azure:

1. Create a backup policy to protect SQL Server databases in Azure.
1. Create on-demand backup copies in Azure.
1. Recover the database from Azure.

## Supported scenarios

- DPM 2019 UR2 supports SQL Server Failover Cluster Instances (FCI) using Cluster Shared Volumes (CSV).<br><br>
- Protection of [SQL Server failover cluster instance with Storage Spaces Direct on Azure](/azure/azure-sql/virtual-machines/windows/failover-cluster-instance-storage-spaces-direct-manually-configure)  and [SQL Server failover cluster instance with Azure shared disks](/azure/azure-sql/virtual-machines/windows/failover-cluster-instance-azure-shared-disks-manually-configure) is supported with this feature. The DPM server must be deployed in the Azure Virtual Machine to protect SQL FCI instance deployed on Azure VMs.

## Prerequisites and limitations

* If you've a database with files on a remote file share, protection will fail with Error ID 104. DPM doesn't support protection for SQL Server data on a remote file share.
* DPM can't protect databases that are stored on remote SMB shares.
* Ensure that the [availability group replicas are configured as read-only](/sql/database-engine/availability-groups/windows/configure-read-only-access-on-an-availability-replica-sql-server).
* You must explicitly add the system account **NTAuthority\System** to the Sysadmin group on SQL Server.
* When you perform an alternate location recovery for a partially contained database, you must ensure that the target SQL instance has the [Contained Databases](/sql/relational-databases/databases/migrate-to-a-partially-contained-database#enable) feature enabled.
* When you perform an alternate location recovery for a file stream database, you must ensure that the target SQL instance has the [file stream database](/sql/relational-databases/blob/enable-and-configure-filestream) feature enabled.
* Protection for SQL Server Always On:
  * DPM detects Availability Groups when running inquiry at protection group creation.
  * DPM detects a failover and continues protection of the database.
  * DPM supports multi-site cluster configurations for an instance of SQL Server.
* When you protect databases that use the Always On feature, DPM has the following limitations:
  * DPM will honor the backup policy for availability groups that's set in SQL Server based on the backup preferences, as follows:
    * Prefer secondary - Backups should occur on a secondary replica except when the primary replica is the only replica online. If there are multiple secondary replicas available, then the node with the highest backup priority will be selected for backup. If only the primary replica is available, then the backup should occur on the primary replica.
    * Secondary only - Backup shouldn't be performed on the primary replica. If the primary replica is the only one online, the backup shouldn't occur.
    * Primary - Backups should always occur on the primary replica.
    * Any Replica - Backups can happen on any of the availability replicas in the availability group. The node to be backed up from will be based on the backup priorities for each of the nodes.
    >[!Note]
    >- Backups can happen from any readable replica -  that is, primary, synchronous secondary, asynchronous secondary.
    >- If any replica is excluded from backup, for example **Exclude Replica** is enabled or is marked as not readable, then that replica won't be selected for backup under any of the options.
    >- If multiple replicas are available and readable, then the node with the highest backup priority will be selected for backup.
    >- If the backup fails on the selected node, then the backup operation fails.
    >- Recovery to the original location isn't supported.
* SQL Server 2014 or above backup issues:
  * SQL server 2014 added a new feature to create a [database for on-premises SQL Server in Microsoft Azure Blob storage](/sql/relational-databases/databases/sql-server-data-files-in-microsoft-azure). DPM can't be used to protect this configuration.
  * There are some known issues with "Prefer secondary" backup preference for the SQL Always On option. DPM always takes a backup from secondary. If no secondary can be found, then the backup fails.

## Before you start

Before you begin, ensure you've met the [prerequisites](backup-azure-dpm-introduction.md#prerequisites-and-limitations) for using Azure Backup to protect workloads. Here are some of the prerequisite tasks:

* Create a backup vault.
* Download vault credentials.
* Install the Azure Backup agent.
* Register the server with the vault.

## Create a backup policy

To protect SQL Server databases in Azure, first create a backup policy:

1. On the Data Protection Manager (DPM) server, select the **Protection** workspace.
1. Select **New** to create a protection group.

    ![Screenshot shows how to start creating a protection group.](./media/backup-azure-backup-sql/protection-group.png)
1. On the start page, review the guidance about creating a protection group. Then select **Next**.
1. Select **Servers**.

    ![Screenshot shows how to select the Servers protection group type.](./media/backup-azure-backup-sql/pg-servers.png)
1. Expand the SQL Server virtual machine where the databases that you want to back up are located. You see the data sources that can be backed up from that server. Expand **All SQL Shares** and then select the databases that you want to back up. In this example, we select ReportServer$MSDPM2012 and ReportServer$MSDPM2012TempDB. Then select **Next**.

    ![Screenshot shows how to select a SQL Server database.](./media/backup-azure-backup-sql/pg-databases.png)
1. Name the protection group and then select **I want online protection**.

    ![Screenshot shows how to choose a data-protection method - short-term disk protection or online Azure protection.](./media/backup-azure-backup-sql/pg-name.png)
1. On the **Specify Short-Term Goals** page, include the necessary inputs to create backup points to the disk.

    In this example, **Retention range** is set to *5 days*. The backup **Synchronization frequency** is set to once every *15 minutes*. **Express Full Backup** is set to *8:00 PM*.

    ![Screenshot shows how to set up short-term goals for backup protection.](./media/backup-azure-backup-sql/pg-shortterm.png)

   > [!NOTE]
   > In this example, a backup point is created at 8:00 PM every day. The data that has been modified since the previous day's 8:00 PM backup point is transferred. This process is called **Express Full Backup**. Although the transaction logs are synchronized every 15 minutes, if we need to recover the database at 9:00 PM, then the point is created by replaying the logs from the last express full backup point, which is 8:00 PM in this example.

1. Select **Next**. DPM shows the overall storage space available. It also shows the potential disk space utilization.

    ![Screenshot shows how to set up disk allocation.](./media/backup-azure-backup-sql/pg-storage.png)

    By default, DPM creates one volume per data source (SQL Server database). The volume is used for the initial backup copy. In this configuration, Logical Disk Manager (LDM) limits DPM protection to 300 data sources (SQL Server databases). To work around this limitation, select **Co-locate data in DPM Storage Pool**. If you use this option, DPM uses a single volume for multiple data sources. This setup allows DPM to protect up to 2,000 SQL Server databases.

    If you select **Automatically grow the volumes**, then DPM can account for the increased backup volume as the production data grows. If you don't select **Automatically grow the volumes**, then DPM limits the backup storage to the data sources in the protection group.

1. If you're an administrator, you can choose to transfer this initial backup **Automatically over the network** and choose the time of transfer. Or choose to **Manually** transfer the backup. Then select **Next**.

    ![Screenshot shows how to choose a replica-creation method.](./media/backup-azure-backup-sql/pg-manual.png)

    The initial backup copy requires the transfer of the entire data source (SQL Server database). The backup data moves from the production server (SQL Server computer) to the DPM server. If this backup is large, then transferring the data over the network could cause bandwidth congestion. For this reason, administrators can choose to use removable media to transfer the initial backup **Manually**. Or they can transfer the data **Automatically over the network** at a specified time.

    After the initial backup finishes, backups continue incrementally on the initial backup copy. Incremental backups tend to be small and are easily transferred across the network.

1. Choose when to run a consistency check. Then select **Next**.

    ![Screenshot shows how to choose the schedule to run a consistency check.](./media/backup-azure-backup-sql/pg-consistent.png)

    DPM can run a consistency check on the integrity of the backup point. It calculates the checksum of the backup file on the production server (the SQL Server computer in this example) and the backed-up data for that file in DPM. If the check finds a conflict, then the backed-up file in DPM is assumed to be corrupt. DPM fixes the backed-up data by sending the blocks that correspond to the checksum mismatch. Because the consistency check is a performance-intensive operation, administrators can choose to schedule the consistency check or run it automatically.

1. Select the data sources to protect in Azure. Then select **Next**.

    ![Screenshot shows how to select data sources to protect in Azure.](./media/backup-azure-backup-sql/pg-sqldatabases.png)
1. If you're an administrator, you can choose backup schedules and retention policies that suit your organization's policies.

    ![Screenshot shows how to choose schedules and retention policies.](./media/backup-azure-backup-sql/pg-schedule.png)

    In this example, backups are taken daily at 12:00 PM and 8:00 PM.

    > [!TIP]
    > For quick recovery, keep a few short-term recovery points on your disk. These recovery points are used for operational recovery. Azure serves as a good offsite location, providing higher SLAs and guaranteed availability.
    >
    > Use DPM to schedule Azure Backups after the local disk backups finish. When you follow this practice, the latest disk backup is copied to Azure.
    >

1. Choose the retention policy schedule. For more information about how the retention policy works, see [Use Azure Backup to replace your tape infrastructure](backup-azure-backup-cloud-as-tape.md).

    ![Screenshot shows how to choose a retention policy.](./media/backup-azure-backup-sql/pg-retentionschedule.png)

    In this example:

    * Backups are taken daily at 12:00 PM and 8:00 PM. They're kept for 180 days.
    * The backup on Saturday at 12:00 PM is kept for 104 weeks.
    * The backup from the last Saturday of the month at 12:00 PM is kept for 60 months.
    * The backup from the last Saturday of March at 12:00 PM is kept for 10 years.

    After you choose a retention policy, select **Next**.

1. Choose how to transfer the initial backup copy to Azure.

    * The **Automatically over the network** option follows your backup schedule to transfer the data to Azure.
    * For more information about **Offline Backup**, see [Overview of Offline Backup](offline-backup-overview.md).

    After you choose a transfer mechanism, select **Next**.

1. On the **Summary** page, review the policy details. Then select **Create group**. You can select **Close** and watch the job progress in the **Monitoring** workspace.

    ![Screenshot shows the progress of the protection group creation.](./media/backup-azure-backup-sql/pg-summary.png)

## Create on-demand backup copies of a SQL Server database

A recovery point is created when the first backup occurs. Rather than waiting for the schedule to run, you can manually trigger the creation of a recovery point:

1. In the protection group, make sure the database status is **OK**.

    ![Screenshot shows the database status in a protection group.](./media/backup-azure-backup-sql/sqlbackup-recoverypoint.png)
1. Right-click the database and then select **Create recovery point**.

    ![Screenshot shows how to choose creating an online recovery point.](./media/backup-azure-backup-sql/sqlbackup-createrp.png)
1. In the drop-down menu, select **Online protection**. Then select **OK** to start the creation of a recovery point in Azure.

    ![Screenshot shows how to start creating a recovery point in Azure.](./media/backup-azure-backup-sql/sqlbackup-azure.png)
1. You can view the job progress in the **Monitoring** workspace.

    ![Screenshot shows how to view job progress in the Monitoring console.](./media/backup-azure-backup-sql/sqlbackup-monitoring.png)

## Recover a SQL Server database from Azure

To recover a protected entity, such as a SQL Server database, from Azure:

1. Open the DPM server management console. Go to the **Recovery** workspace to see the servers that DPM backs up. Select the database (in this example, ReportServer$MSDPM2012). Select a **Recovery time** that ends with **Online**.

    ![Screenshot shows how to select a recovery point.](./media/backup-azure-backup-sql/sqlbackup-restorepoint.png)
1. Right-click the database name and select **Recover**.

    ![Screenshot shows how to recover a database from Azure.](./media/backup-azure-backup-sql/sqlbackup-recover.png)
1. DPM shows the details of the recovery point. Select **Next**. To overwrite the database, select the recovery type **Recover to original instance of SQL Server**. Then select **Next**.

    ![Screenshot shows how to recover a database to its original location.](./media/backup-azure-backup-sql/sqlbackup-recoveroriginal.png)

    In this example, DPM allows the database to be recovered to another SQL Server instance or to a standalone network folder.
1. On the **Specify Recovery Options** page, you can select the recovery options. For example, you can choose **Network bandwidth usage throttling** to throttle the bandwidth that recovery uses. Then select **Next**.
1. On the **Summary** page, you see the current recovery configuration. Select **Recover**.

    The recovery status shows the database being recovered. You can select **Close** to close the wizard and view the progress in the **Monitoring** workspace.

    ![Screenshot shows how to start the recovery process.](./media/backup-azure-backup-sql/sqlbackup-recoverying.png)

    When the recovery is complete, the restored database is consistent with the application.

## Next steps

For more information, see [Azure Backup FAQ](backup-azure-backup-faq.yml).