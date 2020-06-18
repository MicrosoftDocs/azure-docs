---
title: Back up SQL Server workloads on Azure Stack
description: In this article, learn how to configure Microsoft Azure Backup Server (MABS) to protect SQL Server databases on Azure Stack.
ms.topic: conceptual
ms.date: 06/08/2018
---
# Back up SQL Server on Azure Stack

Use this article to configure Microsoft Azure Backup Server (MABS) to protect SQL Server databases on Azure Stack.

The management of SQL Server database backup to Azure and recovery from Azure involves three steps:

1. Create a backup policy to protect SQL Server databases
2. Create on-demand backup copies
3. Recover the database from Disks, and from Azure

## Before you start

[Install and prepare Azure Backup Server](backup-mabs-install-azure-stack.md).

## Create a backup policy to protect SQL Server databases to Azure

1. On the Azure Backup Server UI, click the **Protection** workspace.

2. On the tool ribbon, click **New** to create a new protection group.

    ![Create Protection Group](./media/backup-azure-backup-sql/protection-group.png)

    Azure Backup Server starts the Protection Group wizard, which leads you through creating a **Protection Group**. Click **Next**.

3. In the **Select Protection Group Type** screen, select **Servers**.

    ![Select Protection Group Type - 'Servers'](./media/backup-azure-backup-sql/pg-servers.png)

4. In the **Select Group Members** screen, the Available members list displays the various data sources. Click **+** to expand a folder and reveal the subfolders. Click the checkbox to select an item.

    ![Select SQL DB](./media/backup-azure-backup-sql/pg-databases.png)

    All selected items appear in the Selected members list. After selecting the servers or databases you want to protect, click **Next**.

5. In the **Select Data Protection Method** screen, provide a name for the protection group and select the **I want online Protection** checkbox.

    ![Data Protection Method - short-term disk & Online Azure](./media/backup-azure-backup-sql/pg-name.png)

6. In the **Specify Short-Term Goals** screen, include the necessary inputs to create backup points to disk, and click **Next**.

    In the example, **Retention range** is **5 days**, **Synchronization frequency** is once every **15 minutes**, which is the backup frequency. **Express Full Backup** is set to **8:00 P.M**.

    ![Short-term goals](./media/backup-azure-backup-sql/pg-shortterm.png)

   > [!NOTE]
   > In the example shown, at 8:00 PM every day a backup point is created by transferring the modified data from the previous day’s 8:00 PM backup point. This process is called **Express Full Backup**. Transaction logs are synchronized every 15 minutes. If you need to recover the database at 9:00 PM, the point is created from the logs from the last express full backup point (8PM in this case).
   >
   >

7. On the **Review disk allocation** screen, verify the overall storage space available, and the potential disk space. Click **Next**.

8. In the **Choose Replica Creation Method**, choose how to create your first recovery point. You can transfer the initial backup manually (off network) to avoid bandwidth congestion or over the network. If you choose to wait to transfer the first backup, you can specify the time for the initial transfer. Click **Next**.

    ![Initial replication method](./media/backup-azure-backup-sql/pg-manual.png)

    The initial backup copy requires transferring the entire data source (SQL Server database) from production server (SQL Server computer) to Azure Backup Server. This data might be large, and transferring the data over the network could exceed bandwidth. For this reason, you can choose to transfer the initial backup: **Manually** (using removable media) to avoid bandwidth congestion, or **Automatically over the network** (at a specified time).

    Once the initial backup is complete, the rest of the backups are incremental backups on the initial backup copy. Incremental backups tend to be small and are easily transferred across the network.

9. Choose when you want the consistency check to run and click **Next**.

    ![Consistency check](./media/backup-azure-backup-sql/pg-consistent.png)

    Azure Backup Server performs a consistency check on the integrity of the backup point. Azure Backup Server calculates the checksum of the backup file on the production server (SQL Server computer in this scenario) and the backed-up data for that file. If there is a conflict, it's assumed the backed-up file on Azure Backup Server is corrupt. Azure Backup Server rectifies the backed-up data by sending the blocks corresponding to the checksum mismatch. Because consistency checks are performance-intensive, you can schedule the consistency check or run it automatically.

10. To specify online protection of the datasources, select the databases to be protected to Azure and click **Next**.

    ![Select datasources](./media/backup-azure-backup-sql/pg-sqldatabases.png)

11. Choose backup schedules and retention policies that suit the organization policies.

    ![Schedule and Retention](./media/backup-azure-backup-sql/pg-schedule.png)

    In this example, backups are taken once a day at 12:00 PM and 8 PM (bottom part of the screen)

    > [!NOTE]
    > It’s a good practice to have a few short-term recovery points on disk, for quick recovery. These recovery points are used for operational recovery. Azure serves as a good offsite location with higher SLAs and guaranteed availability.
    >
    >

    **Best Practice**: If you schedule backups to Azure to start after the local disk backups complete, the latest disk backups are always copied to Azure.

12. Choose the retention policy schedule. The details on how the retention policy works are provided at [Use Azure Backup to replace your tape infrastructure article](backup-azure-backup-cloud-as-tape.md).

    ![Retention Policy](./media/backup-azure-backup-sql/pg-retentionschedule.png)

    In this example:

    * Backups are taken once a day at 12:00 PM and 8 PM (bottom part of the screen) and are retained for 180 days.
    * The backup on Saturday at 12:00 P.M. is retained for 104 weeks
    * The backup on Last Saturday at 12:00 P.M. is retained for 60 months
    * The backup on Last Saturday of March at 12:00 P.M. is retained for 10 years
13. Click **Next** and select the appropriate option for transferring the initial backup copy to Azure. You can choose **Automatically over the network**

14. Once you review the policy details in the **Summary** screen, click **Create group** to complete the workflow. You can click **Close** and monitor the job progress in Monitoring workspace.

    ![Creation of Protection Group In-Progress](./media/backup-azure-backup-sql/pg-summary.png)

## On-demand backup of a SQL Server database

While the previous steps created a backup policy, a “recovery point” is created only when the first backup occurs. Rather than waiting for the scheduler to kick in, the steps below trigger the creation of a recovery point manually.

1. Wait until the protection group status shows **OK** for the database before creating the recovery point.

    ![Protection Group Members](./media/backup-azure-backup-sql/sqlbackup-recoverypoint.png)
2. Right-click on the database and select **Create Recovery Point**.

    ![Create Online Recovery Point](./media/backup-azure-backup-sql/sqlbackup-createrp.png)
3. Choose **Online Protection** in the drop-down menu and click **OK** to start creation of a recovery point in Azure.

    ![Create recovery point](./media/backup-azure-backup-sql/sqlbackup-azure.png)
4. View the job progress in the **Monitoring** workspace.

    ![Monitoring console](./media/backup-azure-backup-sql/sqlbackup-monitoring.png)

## Recover a SQL Server database from Azure

The following steps are required to recover a protected entity (SQL Server database) from Azure.

1. Open the Azure Backup Server Management Console. Navigate to **Recovery** workspace where you can see the protected servers. Browse the required database (in this case ReportServer$MSDPM2012). Select a **Recovery from** time that is specified as an **Online** point.

    ![Select Recovery point](./media/backup-azure-backup-sql/sqlbackup-restorepoint.png)
2. Right-click the database name and click **Recover**.

    ![Recover from Azure](./media/backup-azure-backup-sql/sqlbackup-recover.png)
3. MABS shows the details of the recovery point. Click **Next**. To overwrite the database, select the recovery type **Recover to original instance of SQL Server**. Click **Next**.

    ![Recover to Original Location](./media/backup-azure-backup-sql/sqlbackup-recoveroriginal.png)

    In this example, MABS recovers the database to another SQL Server instance, or to a standalone network folder.

4. In the **Specify Recovery options** screen, you can select the recovery options like Network bandwidth usage throttling to throttle the bandwidth used by recovery. Click **Next**.

5. In the **Summary** screen, you see all the recovery configurations provided so far. Click **Recover**.

    The Recovery status shows the database being recovered. You can click **Close** to close the wizard and view the progress in the **Monitoring** workspace.

    ![Initiate recovery process](./media/backup-azure-backup-sql/sqlbackup-recoverying.png)

    Once the recovery is completed, the restored database is application consistent.

## Next steps

See the [Backup files and application](backup-mabs-files-applications-azure-stack.md) article.
See the [Backup SharePoint on Azure Stack](backup-mabs-sharepoint-azure-stack.md) article.
