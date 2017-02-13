---
title: 'Azure portal:View backups in Recovery Services vault | Microsoft Docs'
description: Quick reference on how use the Azure portal to view the backups in the Azure Recovery Services vault and the space used by those backups
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
# View information about your database backups in long-term backup retention using the Azure portal

In this topic, you learn how to use the Azure portal to view information about your database backups in long-term backup retention. You can perform this same task using [PowerShell](sql-database-view-backups-in-vault-powershell).

For more information about long-term backup retention, see [Long-term backup retention](sql-database-long-term-retention.md).

> [!TIP]
> For a tutorial, see [Get Started with Backup and Restore for Data Protection and Recovery using the Azure portal](sql-database-get-started-backup-recovery-portal.md).
>


## View long-term backup retention information using the Azure portal 

1. Open the blade for the Azure Recovery Services vault (go to **All resources** and select it from the list of resources for your subscription) to view the amount of storage used by your database backups in the vault.

   ![view recovery services vault with backups](./media/sql-database-get-started-backup-recovery/view-recovery-services-vault-with-data.png)

2. Open the **SQL database** blade for your database.

    ![new sample db blade](./media/sql-database-get-started/new-sample-db-blade.png)

3. On the toolbar, click **Restore**.

    ![restore toolbar](./media/sql-database-get-started-backup-recovery/restore-toolbar.png)

4. On the Restore blade, click **Long-term**.

5. Under Azure vault backups, click **Select a backup** to view the available database backups in long-term backup retention.

    ![backups in vault](./media/sql-database-get-started-backup-recovery/view-backups-in-vault.png)

> [!TIP]
> For a tutorial, see [Get Started with Backup and Restore for Data Protection and Recovery](sql-database-get-started-backup-recovery-portal.md)
>

## Next steps

- To delete long-term retention backups, see [delete long-term-retention backups](sql-database-long-term-retention-delete.md)
- To configure long-term retention of automated backups in an Azure Recovery Services vault using the Azure portal, see [configure long-term retention using the Azure portal](sql-database-configure-long-term-retention-portal.md)
- To restore a database from a backup in long-term backup retention using the Azure portal, see [restore from long-term retention using the Azure portal](sql-database-restore-from-long-term-retention-portal.md)
- To learn about service-generated automatic backups, see [automatic backups](sql-database-automated-backups.md)
- To learn about long-term backup retention, see [long-term backup retention](sql-database-long-term-retention.md)
- To learn about restoring from backups, see [restore from backup](sql-database-recovery-using-backups.md)