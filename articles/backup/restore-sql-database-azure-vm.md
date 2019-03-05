---
title: Restore backed up SQL Server databases on an Azure VM with Azure Backup | Microsoft Docs
description: This article describes how to restore SQL Server databases running on an Azure VM that are backed up with Azure Backup
services: backup
author: rayne-wiselman
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 02/19/2018
ms.author: raynew


---
# Restore SQL Server databases on Azure VMs 


This article describes how to restore a SQL Server database running on an Azure VM that's been backed up to an Azure Backup Recovery Services vault with the [Azure Backup](backup-overview.md) service.


> [!NOTE]
> Backup of SQl Server databases running on an Azure VM with Azure Backup is currently in public preview.


This article describes how to restore SQL Server databases. If you haven't configured backup for the databases, follow the instructions in [this article](backup-azure-sql-database.md)



## About restoring databases

Azure Backup can restore SQL Server databases running on Azure VMs as follows:

- Restore to a specific date or time (to the second), using transaction log backups. Azure Backup automatically determines the appropriate full differential backup, and the chain of log backups, that are required to restore based on the selected time.
- Restore a specific full or differential backup to restore to a specific recovery point, rather than a specific time.


### Prerequisites

Before restoring a database note the following:

- You can restore the database to an instance of a SQL Server in the same Azure region.
- The destination server must be registered to the same vault as the source.
- To restore a TDE encrypted database to another SQL Server, you need to first [restore the certificate to the destination server](https://docs.microsoft.com/sql/relational-databases/security/encryption/move-a-tde-protected-database-to-another-sql-server?view=sql-server-2017).
- Before you trigger a restore of the "master" database, start the SQL Server instance in single-user mode with startup option **-m AzureWorkloadBackup**.
    - The value for **-m**  is the name of the client.
    - Only the specified client name is allowed to open the connection.
- For all system databases (model, master, msdb), stop the SQL Agent service before you trigger the restore.
- Close any applications that might try to steal a connection to any of these databases.

## Restore a database

To restore you need the following permissions:

* **Backup Operator** permissions in vault the which you are doing the restore.
* **Contributor (write)** access to the source VM that's backed up.
* **Contributor (write)** access to the target VM:
    - If you're restoring to the same VM this will be the source VM.
    - If you're restoring to an alternate location this will be the new target VM. 

Restore as follows:
1. Open the vault in which the SQL Server VM is registered.
2. On the vault dashboard, under **Usage**, select **Backup Items**.

    ![Open the Backup Items menu](./media/backup-azure-sql-database/restore-sql-vault-dashboard.png).

3. In **Backup Items**, under **Backup Management Type**, select **SQL in Azure VM**.

    ![Select SQL in Azure VM](./media/backup-azure-sql-database/sql-restore-backup-items.png)

4. Select the database to restore.

    ![Select the database to restore](./media/backup-azure-sql-database/sql-restore-sql-in-vm.png)

5. Review the database menu. It provides information about the database backup, including: 

    * The oldest and latest restore points.
    * Log backup status for the last 24 hours, for databases in full and bulk-logged recovery mode, if configured for transactional log backups.

6. Click **Restore DB**. 

    ![Select Restore DB](./media/backup-azure-sql-database/restore-db-button.png)

7. In **Restore Configuration**, specify where you want to restore the data to:
    - **Alternate Location**: Restore the database to an alternate location and retain the original source database.
    - **Overwrite DB**: Restore the data to the same SQL Server instance as the original source. The effect of this option is to overwrite the original database.

    > [!Important]
    > If the selected database belongs to an Always On Availability group, SQL Server doesn't allow the database to be overwritten. Only **Alternate Location** is available.
    >

    ![Restore Configuration menu](./media/backup-azure-sql-database/restore-restore-configuration-menu.png)

### Restore to an alternate location

1. In the **Restore Configuration** menu, Under **Where to Restore**, select **Alternate Location**.
2. Select the SQL Server name and instance to which you want to restore the database.
3. In **Restored DB Name** box, enter the name of the target database.
4. If applicable, select **Overwrite if the DB with the same name already exists on selected SQL instance**.
5. Click **OK**.

    ![Provide values for the Restore Configuration menu](./media/backup-azure-sql-database/restore-configuration-menu.png)

2. In **Select restore point**, select whether to [restore to a specific point in time](#restore-to-a-specific-point-in-time), or to restore to a [specific recovery point](#restore-to-a-specific-restore-point).

    > [!NOTE]
    > The point-in-time restore is available only for log backups for databases with full and bulk-logged recovery mode. 


### Restore and overwrite

1. In the **Restore Configuration** menu, Under **Where to Restore**, select **Overwrite DB** > **OK**.

    ![Select Overwrite DB](./media/backup-azure-sql-database/restore-configuration-overwrite-db.png)

2. In **Select restore point**, select **Logs (Point in Time) to [restore to a specific point in time](#restore-to-a-specific-point-in-time), or **Full & Differential** to restore to a [specific recovery point](#restore-to-a-specific-restore-point).

    > [!NOTE]
    > The point-in-time restore is available only for log backups for databases with a full and bulk-logged recovery model. 




    
### Restore to a specific point in time

If you've selected **Logs (Point in Time)** as the restore type, do the following:

1.  Under **Restore Date/Time**, select the mini calendar. On the **Calendar**, the bold dates have recovery points, and the current date is highlighted.
2. Select a date with recovery points. Dates without recovery points can't be selected.

    ![Open the Calendar](./media/backup-azure-sql-database/recovery-point-logs-calendar.png)

3. After you select a date, the timeline graph displays the available recovery points in a continuous range.
4. Specify a time for the recovery using the timeline graph, or select a time. Then click **OK**.

    ![Open the Calendar](./media/backup-azure-sql-database/recovery-point-logs-graph.png)

 
4. On the **Advanced Configuration** menu, if you want to keep the database non-operational after the restore, enable **Restore with NORECOVERY**.
5. If you want to change the restore location on the destination server, enter a new target path.
6. Click **OK**.

    ![Advanced configuration menu](./media/backup-azure-sql-database/restore-point-advanced-configuration.png)


7. On the **Restore** menu, select **Restore** to start the restore job.
8. Track the restore progress in the **Notifications** area, or select **Restore jobs** on the database menu.

    ![Restore job progress](./media/backup-azure-sql-database/restore-job-notification.png)



### Restore to a specific restore point

If you've selected **Full & Differential** as the restore type, do the following:


1. Select a recovery point from the list, and click **OK** to complete the restore point procedure.

    ![Choose a full recovery point](./media/backup-azure-sql-database/choose-fd-recovery-point.png)
        
2. On the **Advanced Configuration** menu, if you want to keep the database non-operational after the restore, enable **Restore with NORECOVERY**.
3. If you want to change the restore location on the destination server, enter a new target path. 
4. Click **OK**.

    ![Advanced Configuration menu](./media/backup-azure-sql-database/restore-point-advanced-configuration.png)

7. On the **Restore** menu, select **Restore** to start the restore job.
8. Track the restore progress in the **Notifications** area, or select **Restore jobs** on the database menu.

    ![Restore job progress](./media/backup-azure-sql-database/restore-job-notification.png)

## Next steps

[Manage and monitor](manage-monitor-sql-database-backup.md) SQL Server databases backed up by Azure Backup.
