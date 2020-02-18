---
title: Back up SQL Server by using Azure Backup Server
description: In this article, learn the configuration steps to back up SQL Server databases by using Microsoft Azure Backup Server (MABS).
ms.topic: conceptual
ms.date: 03/24/2017
---
# Back up SQL Server to Azure by using Azure Backup Server

This article helps you set up backups of SQL Server databases by using Microsoft Azure Backup Server (MABS).

To back up a SQL Server database and recover it from Azure:

1. Create a backup policy to protect SQL Server databases in Azure.
2. Create on-demand backup copies in Azure.
3. Recover a database in Azure.

## Before you start

Before you begin, ensure that you have [installed and prepared Azure Backup Server](backup-azure-microsoft-azure-backup.md).

## Create a backup policy 

To protect SQL Server databases in Azure, first create a backup policy:

1. In Azure Backup Server, select the **Protection** workspace.
2. Select **New** to create a new protection group.

    ![Create a protection group in Azure Backup Server](./media/backup-azure-backup-sql/protection-group.png)
3. MABS shows the start screen and provides guidance about creating a protection group. Select **Next**.
4. Select **Servers**.

    ![Select a protection group type of Servers](./media/backup-azure-backup-sql/pg-servers.png)
5. Expand the SQL Server machine where the databases that you want to back up are located. MABS shows various data sources that can be backed up from that server. Expand **All SQL Shares** and then select the databases that you want to back up. In this example, we select **ReportServer$MSDPM2012** and **ReportServer$MSDPM2012TempDB**. Select **Next**.

    ![Select a SQL Server database](./media/backup-azure-backup-sql/pg-databases.png)
6. Name the protection group and then select the **I want online protection** check box.

    ![Choose a data-protection method - short-term disk protection and online Azure protection](./media/backup-azure-backup-sql/pg-name.png)
7. On the **Specify Short-Term Goals** page, include the necessary inputs to create backup points to the disk.

    In this example, **Retention range** is set to *5 days*. The backup **Synchronization frequency** is set to once every *15 minutes*. **Express Full Backup** is set to *8:00 PM*.

    ![Short-term goals for backup protection](./media/backup-azure-backup-sql/pg-shortterm.png)

   > [!NOTE]
   > In this example, a backup point is created at 8:00 PM every day. The data that has been modified since the previous day's 8:00 PM backup point is transferred. This process is called **Express Full Backup**. Although the transaction logs are synchronized every 15 minutes, if we need to recover the database at 9:00 PM, then the point is created by replaying the logs from the last express full backup point, which is 8:00 PM in this case.
   >
   >

8. Select **Next**.

    MABS shows the overall storage space available and the potential disk space utilization.

    ![Disk allocation](./media/backup-azure-backup-sql/pg-storage.png)

    By default, MABS creates one volume per data source (SQL Server database) which is used for the initial backup copy. Using this approach, the Logical Disk Manager (LDM) limits MABS protection to 300 data sources (SQL Server databases). To work around this limitation, select the **Co-locate data in DPM Storage Pool**, option. If you use this option, MABS uses a single volume for multiple data sources, which allows MABS to protect up to 2000 SQL databases.

    If **Automatically grow the volumes** option is selected, MABS can account for the increased backup volume as the production data grows. If **Automatically grow the volumes** option is not selected, MABS limits the backup storage used to the data sources in the protection group.
9. Administrators are given the choice of transferring this initial backup manually (off network) to avoid bandwidth congestion or over the network. They can also configure the time at which the initial transfer can happen. select **Next**.

    ![Initial replication method](./media/backup-azure-backup-sql/pg-manual.png)

    The initial backup copy requires transfer of the entire data source (SQL Server database) from production server (SQL Server machine) to MABS. This data might be large, and transferring the data over the network could exceed bandwidth. For this reason, administrators can choose to transfer the initial backup: **Manually** (using removable media) to avoid bandwidth congestion, or **Automatically over the network** (at a specified time).

    Once the initial backup is complete, the rest of the backups are incremental backups on the initial backup copy. Incremental backups tend to be small and are easily transferred across the network.
10. Choose when you want the consistency check to run and select **Next**.

    ![Consistency check](./media/backup-azure-backup-sql/pg-consistent.png)

    MABS can perform a consistency check to check the integrity of the backup point. It calculates the checksum of the backup file on the production server (SQL Server machine in this scenario) and the backed-up data for that file at MABS. In the case of a conflict, it is assumed that the backed-up file at MABS is corrupt. MABS rectifies the backed-up data by sending the blocks corresponding to the checksum mismatch. As the consistency check is a performance-intensive operation, administrators have the option of scheduling the consistency check or running it automatically.
11. To specify online protection of the datasources, select the databases to be protected to Azure and select **Next**.

    ![Select datasources](./media/backup-azure-backup-sql/pg-sqldatabases.png)
12. Administrators can choose backup schedules and retention policies that suit their organization policies.

    ![Schedule and Retention](./media/backup-azure-backup-sql/pg-schedule.png)

    In this example, backups are taken once a day at 12:00 PM and 8 PM (bottom part of the screen)

    > [!NOTE]
    > It’s a good practice to have a few short-term recovery points on disk, for quick recovery. These recovery points are used for “operational recovery". Azure serves as a good offsite location with higher SLAs and guaranteed availability.
    >
    >

    **Best Practice**: Make sure that Azure Backups are scheduled after the completion of local disk backups using DPM. This enables the latest disk backup to be copied to Azure.

13. Choose the retention policy schedule. The details on how the retention policy works are provided at [Use Azure Backup to replace your tape infrastructure article](backup-azure-backup-cloud-as-tape.md).

    ![Retention Policy](./media/backup-azure-backup-sql/pg-retentionschedule.png)

    In this example:

    * Backups are taken once a day at 12:00 PM and 8 PM (bottom part of the screen) and are retained for 180 days.
    * The backup on Saturday at 12:00 P.M. is retained for 104 weeks
    * The backup on Last Saturday at 12:00 P.M. is retained for 60 months
    * The backup on Last Saturday of March at 12:00 P.M. is retained for 10 years
14. Select **Next** and select the appropriate option for transferring the initial backup copy to Azure. You can choose **Automatically over the network** or **Offline Backup**.

    * **Automatically over the network** transfers the backup data to Azure as per the schedule chosen for backup.
    * How **Offline Backup** works is explained at [Overview of Offline Backup](offline-backup-overview.md).

    Choose the relevant transfer mechanism to send the initial backup copy to Azure and select **Next**.
15. Once you review the policy details in the **Summary** screen, select on the **Create group** button to complete the workflow. You can select the **Close** button and monitor the job progress in Monitoring workspace.

    ![Creation of Protection Group In-Progress](./media/backup-azure-backup-sql/pg-summary.png)

## On-demand backup of a SQL Server database

While the previous steps created a backup policy, a “recovery point” is created only when the first backup occurs. Rather than waiting for the scheduler to kick in, the steps below trigger the creation of a recovery point manually.

1. Wait until the protection group status shows **OK** for the database before creating the recovery point.

    ![Protection Group Members](./media/backup-azure-backup-sql/sqlbackup-recoverypoint.png)
2. Right-select on the database and select **Create Recovery Point**.

    ![Create Online Recovery Point](./media/backup-azure-backup-sql/sqlbackup-createrp.png)
3. Choose **Online Protection** in the drop-down menu and select **OK**. This starts the creation of a recovery point in Azure.

    ![Create recovery point](./media/backup-azure-backup-sql/sqlbackup-azure.png)
4. You can view the job progress in the **Monitoring** workspace where you'll find an in progress job like the one depicted in the next figure.

    ![Monitoring console](./media/backup-azure-backup-sql/sqlbackup-monitoring.png)

## Recover a SQL Server database from Azure

The following steps are required to recover a protected entity (SQL Server database) from Azure.

1. Open the DPM server Management Console. Navigate to **Recovery** workspace where you can see the servers backed up by DPM. Browse the required database (in this case ReportServer$MSDPM2012). Select a **Recovery from** time that ends with **Online**.

    ![Select Recovery point](./media/backup-azure-backup-sql/sqlbackup-restorepoint.png)
2. Right-select the database name and select **Recover**.

    ![Recover from Azure](./media/backup-azure-backup-sql/sqlbackup-recover.png)
3. DPM shows the details of the recovery point. select **Next**. To overwrite the database, select the recovery type **Recover to original instance of SQL Server**. select **Next**.

    ![Recover to Original Location](./media/backup-azure-backup-sql/sqlbackup-recoveroriginal.png)

    In this example, DPM allows recovery of the database to another SQL Server instance or to a standalone network folder.
4. In the **Specify Recovery options** screen, you can select the recovery options like Network bandwidth usage throttling to throttle the bandwidth used by recovery. select **Next**.
5. In the **Summary** screen, you see all the recovery configurations provided so far. select **Recover**.

    The Recovery status shows the database being recovered. You can select **Close** to close the wizard and view the progress in the **Monitoring** workspace.

    ![Initiate recovery process](./media/backup-azure-backup-sql/sqlbackup-recoverying.png)

    Once the recovery is completed, the restored database is application consistent.

### Next steps

* [Azure Backup FAQ](backup-azure-backup-faq.md)
