---
title: 'Azure portal:Restore SQL database-long-term backup retention | Microsoft Docs'
description: Quick reference on how to restore a database from a backup in the Azure Recovery Services vault and the space used by those backups using the Azure portal
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: business continuity
ms.devlang: NA
ms.workload: data-management
ms.topic: article
ms.tgt_pltfrm: NA
ms.date: 12/22/2016
ms.author: carlrab

---
# Restore a database from a backup in the Azure Recovery Services vault using the Azure portal

In this topic, you learn how to restore a database from a backup in the Azure Recovery Services vault using the Azure portal. This task can also be performed using [PowerShell](sql-database-restore-deleted-database-powershell.md).

For more information on storing backups in the Azure Recovery Services vault, see [Storing Azure SQL Database Backups for up to 10 years](sql-database-long-term-retention.md).

> [!TIP]
> For a tutorial, see [Get Started with Backup and Restore for Data Protection and Recovery](sql-database-get-started-backup-recovery-portal.md)
>

## Restore from long-term backup retention using the Azure portal

1. On the **Azure vault backups** blade, click the backup to restore and then click **Select**.

    ![select backup in vault](./media/sql-database-get-started-backup-recovery/select-backup-in-vault.png)

2. In the **Database name** text box, provide the name for the restored database.

    ![new database name](./media/sql-database-get-started-backup-recovery/new-database-name.png)

3. Click **OK** to restore your database from the backup in the vault to the new database.

4. On the toolbar, click the notification icon to view the status of the restore job.

    ![restore job progress from vault](./media/sql-database-get-started-backup-recovery/restore-job-progress-long-term.png)

5. When the restore job is completed, open the **SQL databases** blade to view the newly restored database.

    ![restored database from vault](./media/sql-database-get-started-backup-recovery/restored-database-from-vault.png)


## Next steps

- To configure long-term retention of automated backups in an Azure Recovery Services vault, see [configure long-term backup retention](sql-database-configure-long-term-retention.md)
- To view backups in the Azure Recovery Services vault, see [view backups in long-term retention](sql-database-view-backups-in-vault.md)
- To learn about service-generated automatic backups, see [automatic backups](sql-database-automated-backups.md)
- To learn about long-term backup retention, see [long-term backup retention](sql-database-long-term-retention.md)
- To learn about restoring from backups, see [restore from backup](sql-database-recovery-using-backups.md)
- To delete long-term retention backups, see [delete long-term retention backups](sql-database-long-term-retention-delete.md)
