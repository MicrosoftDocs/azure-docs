---
title: Back up SQL Server by using Azure Backup Server
description: In this article, learn the configuration to back up SQL Server databases by using Microsoft Azure Backup Server (MABS).
ms.topic: conceptual
ms.date: 03/24/2017
---
# Back up SQL Server to Azure by using Azure Backup Server

This article helps you set up backups of SQL Server databases by using Microsoft Azure Backup Server (MABS).

To back up a SQL Server database and recover it from Azure:

1. Create a backup policy to protect SQL Server databases in Azure.
1. Create on-demand backup copies in Azure.
1. Recover the database in Azure.

## Before you start

Before you begin, ensure that you have [installed and prepared Azure Backup Server](backup-azure-microsoft-azure-backup.md).

## Create a backup policy

To protect SQL Server databases in Azure, first create a backup policy:

1. In Azure Backup Server, select the **Protection** workspace.
1. Select **New** to create a protection group.

    ![Create a protection group in Azure Backup Server](./media/backup-azure-backup-sql/protection-group.png)
1. On the start page, review the guidance about creating a protection group. Then select **Next**.
1. For the protection group type, select **Servers**.

    ![Select the Servers protection group type](./media/backup-azure-backup-sql/pg-servers.png)
1. Expand the SQL Server instance where the databases that you want to back up are located. You see the data sources that can be backed up from that server. Expand **All SQL Shares** and then select the databases that you want to back up. In this example, we select ReportServer$MSDPM2012 and ReportServer$MSDPM2012TempDB. Select **Next**.

    ![Select a SQL Server database](./media/backup-azure-backup-sql/pg-databases.png)
1. Name the protection group and then select **I want online protection**.

    ![Choose a data-protection method - short-term disk protection or online Azure protection](./media/backup-azure-backup-sql/pg-name.png)
1. On the **Specify Short-Term Goals** page, include the necessary inputs to create backup points to the disk.

    In this example, **Retention range** is set to *5 days*. The backup **Synchronization frequency** is set to once every *15 minutes*. **Express Full Backup** is set to *8:00 PM*.

    ![Set up short-term goals for backup protection](./media/backup-azure-backup-sql/pg-shortterm.png)

   > [!NOTE]
   > In this example, a backup point is created at 8:00 PM every day. The data that has been modified since the previous day's 8:00 PM backup point is transferred. This process is called **Express Full Backup**. Although the transaction logs are synchronized every 15 minutes, if we need to recover the database at 9:00 PM, then the point is created by replaying the logs from the last express full backup point, which is 8:00 PM in this example.
   >
   >

1. Select **Next**. MABS shows the overall storage space available. It also shows the potential disk space utilization.

    ![Set up disk allocation in MABS](./media/backup-azure-backup-sql/pg-storage.png)

    By default, MABS creates one volume per data source (SQL Server database). The volume is used for the initial backup copy. In this configuration, Logical Disk Manager (LDM) limits MABS protection to 300 data sources (SQL Server databases). To work around this limitation, select **Co-locate data in DPM Storage Pool**. If you use this option, MABS uses a single volume for multiple data sources. This setup allows MABS to protect up to 2,000 SQL Server databases.

    If you select **Automatically grow the volumes**, then MABS can account for the increased backup volume as the production data grows. If you don't select **Automatically grow the volumes**, then MABS limits the backup storage to the data sources in the protection group.
1. If you're an administrator, you can choose to transfer this initial backup **Automatically over the network** and choose the time of transfer. Or choose to **Manually** transfer the backup. Then select **Next**.

    ![Choose a replica-creation method in MABS](./media/backup-azure-backup-sql/pg-manual.png)

    The initial backup copy requires the transfer of the entire data source (SQL Server database). The backup data moves from the production server (SQL Server computer) to MABS. If this backup is large, then transferring the data over the network could cause bandwidth congestion. For this reason, administrators can choose to use removable media to transfer the initial backup **Manually**. Or they can transfer the data **Automatically over the network** at a specified time.

    After the initial backup finishes, backups continue incrementally on the initial backup copy. Incremental backups tend to be small and are easily transferred across the network.
1. Choose when to run a consistency check. Then select **Next**.

    ![Choose when to run a consistency check](./media/backup-azure-backup-sql/pg-consistent.png)

    MABS can run a consistency check on the integrity of the backup point. It calculates the checksum of the backup file on the production server (the SQL Server computer in this example) and the backed-up data for that file in MABS. If the check finds a conflict, then the backed-up file in MABS is assumed to be corrupt. MABS fixes the backed-up data by sending the blocks that correspond to the checksum mismatch. Because the consistency check is a performance-intensive operation, administrators can choose to schedule the consistency check or run it automatically.
1. Select the data sources to protect in Azure. Then select **Next**.

    ![Select data sources to protect in Azure](./media/backup-azure-backup-sql/pg-sqldatabases.png)
1. If you're an administrator, you can choose backup schedules and retention policies that suit your organization's policies.

    ![Choose schedules and retention policies](./media/backup-azure-backup-sql/pg-schedule.png)

    In this example, backups are taken daily at 12:00 PM and 8:00 PM.

    > [!TIP]
    > For quick recovery, keep a few short-term recovery points on your disk. These recovery points are used for operational recovery. Azure serves as a good offsite location, providing higher SLAs and guaranteed availability.
    >
    > Use Data Protection Manager (DPM) to schedule Azure Backups after the local disk backups finish. When you follow this practice, the latest disk backup is copied to Azure.
    >

1. Choose the retention policy schedule. For more information about how the retention policy works, see [Use Azure Backup to replace your tape infrastructure](backup-azure-backup-cloud-as-tape.md).

    ![Choose a retention policy in MABS](./media/backup-azure-backup-sql/pg-retentionschedule.png)

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

    ![The progress of the protection group creation](./media/backup-azure-backup-sql/pg-summary.png)

## Create on-demand backup copies of a SQL Server database

A recovery point is created when the first backup occurs. Rather than waiting for the schedule to run, you can manually trigger the creation of a recovery point:

1. In the protection group, make sure the database status is **OK**.

    ![A protection group, showing the database status](./media/backup-azure-backup-sql/sqlbackup-recoverypoint.png)
1. Right-click the database and then select **Create recovery point**.

    ![Choose to create an online recovery point](./media/backup-azure-backup-sql/sqlbackup-createrp.png)
1. In the drop-down menu, select **Online protection**. Then select **OK** to start the creation of a recovery point in Azure.

    ![Start creating a recovery point in Azure](./media/backup-azure-backup-sql/sqlbackup-azure.png)
1. You can view the job progress in the **Monitoring** workspace.

    ![View job progress in the Monitoring console](./media/backup-azure-backup-sql/sqlbackup-monitoring.png)

## Recover a SQL Server database from Azure

To recover a protected entity, such as a SQL Server database, from Azure:

1. Open the DPM server management console. Go to the **Recovery** workspace to see the servers that DPM backs up. Select the database (in this example, ReportServer$MSDPM2012). Select a **Recovery time** that ends with **Online**.

    ![Select a recovery point](./media/backup-azure-backup-sql/sqlbackup-restorepoint.png)
1. Right-click the database name and select **Recover**.

    ![Recover a database from Azure](./media/backup-azure-backup-sql/sqlbackup-recover.png)
1. DPM shows the details of the recovery point. Select **Next**. To overwrite the database, select the recovery type **Recover to original instance of SQL Server**. Then select **Next**.

    ![Recover a database to its original location](./media/backup-azure-backup-sql/sqlbackup-recoveroriginal.png)

    In this example, DPM allows the recovery of the database to another SQL Server instance or to a standalone network folder.
1. On the **Specify Recovery Options** page, you can select the recovery options. For example, you can choose **Network bandwidth usage throttling** to throttle the bandwidth that recovery uses. Then select **Next**.
1. On the **Summary** page, you see the current recovery configuration. Select **Recover**.

    The recovery status shows the database being recovered. You can select **Close** to close the wizard and view the progress in the **Monitoring** workspace.

    ![Start the recovery process](./media/backup-azure-backup-sql/sqlbackup-recoverying.png)

    When the recovery is complete, the restored database is consistent with the application.

### Next steps

For more information, see [Azure Backup FAQ](backup-azure-backup-faq.md).
