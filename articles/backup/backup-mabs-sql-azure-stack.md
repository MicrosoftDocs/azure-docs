---
title: Back up SQL Server workloads on Azure Stack
description: In this article, learn how to configure Microsoft Azure Backup Server (MABS) to protect SQL Server databases on Azure Stack.
ms.topic: how-to
ms.date: 01/18/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
ms.service: backup
ms.custom: engagement-fy23
---

# Back up SQL Server on Azure Stack

This article describes how to configure Microsoft Azure Backup Server (MABS) to protect SQL Server databases on Azure Stack.

## SQL Server databases protection workflow

The management of SQL Server database backup to Azure and recovery from Azure involves:

1. Create a backup policy to protect SQL Server databases
2. Create on-demand backup copies
3. Recover the database from Disks, and from Azure

## Prerequisites and limitations

* If you've a database with files on a remote file share, protection will fail with Error ID 104. MABS doesn't support protection for SQL Server data on a remote file share.
* MABS can't protect databases that are stored on remote SMB shares.
* Ensure that the [availability group replicas are configured as read-only](/sql/database-engine/availability-groups/windows/configure-read-only-access-on-an-availability-replica-sql-server).
* You must explicitly add the system account **NTAuthority\System** to the Sysadmin group on SQL Server.
* When you perform an alternate location recovery for a partially contained database, you must ensure that the target SQL instance has the [Contained Databases](/sql/relational-databases/databases/migrate-to-a-partially-contained-database#enable) feature enabled.
* When you perform an alternate location recovery for a file stream database, you must ensure that the target SQL instance has the [file stream database](/sql/relational-databases/blob/enable-and-configure-filestream) feature enabled.
* Protection for SQL Server Always On:
  * MABS detects Availability Groups when running inquiry at protection group creation.
  * MABS detects a failover and continues protection of the database.
  * MABS supports multi-site cluster configurations for an instance of SQL Server.
* When you protect databases that use the Always On feature, MABS has the following limitations:
  * MABS will honor the backup policy for availability groups that's set in SQL Server based on the backup preferences, as follows:
    * Prefer secondary - Backups should occur on a secondary replica except when the primary replica is the only replica online. If there are multiple secondary replicas available, then the node with the highest backup priority will be selected for backup. IF only the primary replica is available, then the backup should occur on the primary replica.
    * Secondary only - Backup shouldn't be performed on the primary replica. If the primary replica is the only one online, the backup shouldn't occur.
    * Primary - Backups should always occur on the primary replica.
    * Any Replica - Backups can happen on any of the availability replicas in the availability group. The node to be backed up from will be based on the backup priorities for each of the nodes.
  * Note the following:
    * Backups can happen from any readable replica -  that is, primary, synchronous secondary, asynchronous secondary.
    * If any replica is excluded from backup, for example **Exclude Replica** is enabled or is marked as not readable, then that replica won't be selected for backup under any of the options.
    * If multiple replicas are available and readable, then the node with the highest backup priority will be selected for backup.
    * If the backup fails on the selected node, then the backup operation fails.
    * Recovery to the original location isn't supported.
* SQL Server 2014 or above backup issues:
  * SQL server 2014 added a new feature to create a [database for on-premises SQL Server on Microsoft Azure Blob storage](/sql/relational-databases/databases/sql-server-data-files-in-microsoft-azure). MABS can't be used to protect this configuration.
  * There are some known issues with "Prefer secondary" backup preference for the SQL Always On option. MABS always takes a backup from secondary. If no secondary can be found, then the backup fails.

## Before you start

[Install and prepare Azure Backup Server](backup-mabs-install-azure-stack.md).

## Create a backup policy

To create a backup policy to protect SQL Server databases to Azure, follow these steps:

1. On the Azure Backup Server UI, select the **Protection** workspace.

2. On the tool ribbon, select **New** to create a new protection group.

    ![Screenshot shows how to initiate creating Protection Group.](./media/backup-azure-backup-sql/protection-group.png)

    Azure Backup Server starts the Protection Group wizard, which leads you through creating a **Protection Group**. Select **Next**.

3. On the **Select Protection Group Type** screen, select **Servers**.

    ![Screenshot shows how to select Protection Group Type - Servers.](./media/backup-azure-backup-sql/pg-servers.png)

4. On the **Select Group Members** screen, the Available members list displays the various data sources. Select **+** to expand a folder and reveal the subfolders. Select the checkbox to select an item.

    ![Screenshot shows how to select a SQL database.](./media/backup-azure-backup-sql/pg-databases.png)

    All selected items appear in the Selected members list. After selecting the servers or databases you want to protect, select **Next**.

5. On the **Select Data Protection Method** screen, provide a name for the protection group and select the **I want online Protection** checkbox.

    ![Screenshot shows the Data Protection Method - short-term disk & Online Azure.](./media/backup-azure-backup-sql/pg-name.png)

6. On the **Specify Short-Term Goals** screen, include the necessary inputs to create backup points to disk, and select **Next**.

    In the example, **Retention range** is **5 days**, **Synchronization frequency** is once every **15 minutes**, which is the backup frequency. **Express Full Backup** is set to **8:00 P.M**.

    ![Screenshot shows the short-term goals.](./media/backup-azure-backup-sql/pg-shortterm.png)

   > [!NOTE]
   > In the example shown, at 8:00 PM every day a backup point is created by transferring the modified data from the previous day’s 8:00 PM backup point. This process is called **Express Full Backup**. Transaction logs are synchronized every 15 minutes. If you need to recover the database at 9:00 PM, the point is created from the logs from the last express full backup point (8PM in this case).

7. On the **Review disk allocation** screen, verify the overall storage space available, and the potential disk space. Select **Next**.

8. On the **Choose Replica Creation Method**, choose how to create your first recovery point. You can transfer the initial backup manually (off network) to avoid bandwidth congestion or over the network. If you choose to wait to transfer the first backup, you can specify the time for the initial transfer. Select **Next**.

    ![Screenshot shows the initial replication method.](./media/backup-azure-backup-sql/pg-manual.png)

    The initial backup copy requires transferring the entire data source (SQL Server database) from production server (SQL Server computer) to Azure Backup Server. This data might be large, and transferring the data over the network could exceed bandwidth. For this reason, you can choose to transfer the initial backup: **Manually** (using removable media) to avoid bandwidth congestion, or **Automatically over the network** (at a specified time).

    Once the initial backup is complete, the rest of the backups are incremental backups on the initial backup copy. Incremental backups tend to be small and are easily transferred across the network.

9. Choose when you want the consistency check to run and select **Next**.

    ![Screenshot shows how to schedule the consistency check.](./media/backup-azure-backup-sql/pg-consistent.png)

    Azure Backup Server performs a consistency check on the integrity of the backup point. Azure Backup Server calculates the checksum of the backup file on the production server (SQL Server computer in this scenario) and the backed-up data for that file. If there's a conflict, it's assumed the backed-up file on Azure Backup Server is corrupt. Azure Backup Server rectifies the backed-up data by sending the blocks corresponding to the checksum mismatch. Because consistency checks are performance-intensive, you can schedule the consistency check or run it automatically.

10. To specify online protection of the datasources, select the databases to be protected to Azure and select **Next**.

    ![Screenshot shows how to select data sources.](./media/backup-azure-backup-sql/pg-sqldatabases.png)

11. Choose backup schedules and retention policies that suit the organization policies.

    ![Screenshot shows hot to backup schedule and retention.](./media/backup-azure-backup-sql/pg-schedule.png)

    In this example, backups are taken once a day at 12:00 PM and 8 PM (bottom part of the screen)

    > [!NOTE]
    > It’s a good practice to have a few short-term recovery points on disk, for quick recovery. These recovery points are used for operational recovery. Azure serves as a good offsite location with higher SLAs and guaranteed availability.


    **Best Practice**: If you schedule backups to Azure to start after the local disk backups complete, the latest disk backups are always copied to Azure.

12. Choose the retention policy schedule. The details on how the retention policy works are provided at [Use Azure Backup to replace your tape infrastructure article](backup-azure-backup-cloud-as-tape.md).

    ![Screenshot shows how to choose the retention Policy.](./media/backup-azure-backup-sql/pg-retentionschedule.png)

    In this example:

    * Backups are taken once a day at 12:00 PM and 8 PM (bottom part of the screen) and are retained for 180 days.
    * The backup on Saturday at 12:00 P.M. is retained for 104 weeks
    * The backup on Last Saturday at 12:00 P.M. is retained for 60 months
    * The backup on Last Saturday of March at 12:00 P.M. is retained for 10 years
13. Select **Next** and select the appropriate option for transferring the initial backup copy to Azure. You can choose **Automatically over the network**

14. Once you review the policy details in the **Summary** screen, select **Create group** to complete the workflow. You can select **Close** and monitor the job progress in Monitoring workspace.

    ![Screenshot shows the in-progress job state of the Protection Group creation.](./media/backup-azure-backup-sql/pg-summary.png)

## Run an on-demand backup

A *recovery point* is created only when the first backup occurs. After creating a backup policy, you can trigger the creation of a recovery point manually, rather than waiting for the scheduler to take the backup.

To run an on-demand backup of a SQL Server database, follow these steps:

1. Wait until the protection group status shows **OK** for the database before creating the recovery point.

    ![Screenshot shows the Protection Group members.](./media/backup-azure-backup-sql/sqlbackup-recoverypoint.png)
2. Right-click the database and select **Create Recovery Point**.

    ![Screenshot shows how to start creating the online Recovery Point.](./media/backup-azure-backup-sql/sqlbackup-createrp.png)
3. Choose **Online Protection** in the drop-down menu and select **OK** to start creation of a recovery point in Azure.

    ![Screenshot shows how to choose the Online Protection option.](./media/backup-azure-backup-sql/sqlbackup-azure.png)
4. View the job progress in the **Monitoring** workspace.

    ![Screenshot shows the monitoring console.](./media/backup-azure-backup-sql/sqlbackup-monitoring.png)

## Recover the database from Azure

To recover a protected entity (SQL Server database) from Azure, follow these steps:

1. Open the Azure Backup Server Management Console. Navigate to **Recovery** workspace where you can see the protected servers. Browse the required database (in this case ReportServer$MSDPM2012). Select a **Recovery from** time that's specified as an **Online** point.

    ![Screenshot shows how to select a Recovery point.](./media/backup-azure-backup-sql/sqlbackup-restorepoint.png)
2. Right-click the database name and select **Recover**.

    ![Screenshot shows how to select a database to recover from Azure.](./media/backup-azure-backup-sql/sqlbackup-recover.png)
3. MABS shows the details of the recovery point. Select **Next**. To overwrite the database, select the recovery type **Recover to original instance of SQL Server**. Select **Next**.

    ![Screenshot shows how to recover database to original location.](./media/backup-azure-backup-sql/sqlbackup-recoveroriginal.png)

    In this example, MABS recovers the database to another SQL Server instance, or to a standalone network folder.

4. On the **Specify Recovery options** screen, you can select the recovery options like Network bandwidth usage throttling to throttle the bandwidth used by recovery. Select **Next**.

5. On the **Summary** screen, you see all the recovery configurations provided so far. Select **Recover**.

    The Recovery status shows the database being recovered. You can select **Close** to close the wizard and view the progress in the **Monitoring** workspace.

    ![Screenshot shows how to initiate the recovery process.](./media/backup-azure-backup-sql/sqlbackup-recoverying.png)

    Once the recovery is completed, the restored database is application consistent.

## Next steps

- [Back up files and application](backup-mabs-files-applications-azure-stack.md) article.
- [Back up SharePoint on Azure Stack](backup-mabs-sharepoint-azure-stack.md) article.
