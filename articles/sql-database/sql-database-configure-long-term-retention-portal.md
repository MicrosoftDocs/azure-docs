---
title: 'Azure portal:Configure long-term database backup retention | Microsoft Docs'
description: Quick reference on how to configure long-term retention of automated Azure SQL database backups in an Azure Recovery Services vault using PowerShell
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
ms.author: carlrab; sstein

---
# Configure long-term retention of database backups in an Azure Recovery Services vault using the Azure portal

In this topic, you learn how to configure long-term retention of automated backups in an Azure Recovery Services vault using the Azure portal. You can also perform this task using [PowerShell](sql-database-configure-long-term-retention-powershell.md).

For more information about long-term backup retention, see [Long-term backup retention](sql-database-long-term-retention.md).

> [!TIP]
> For a tutorial, see [Get Started with Backup and Restore for Data Protection and Recovery using the Azure portal](sql-database-get-started-backup-recovery-portal.md).
>

## Configure long-term retention using the Azure portal

1. Open the **SQL Server** blade for your server.

    ![sql server blade](./media/sql-database-get-started/sql-server-blade.png)

2. Click **Long-term backup retention**.

   ![long-term backup retention link](./media/sql-database-get-started-backup-recovery/long-term-backup-retention-link.png)

3. On the **Long-term backup retention** blade, review and accept the preview terms (unless you have already done so - or this feature is no longer in preview).

   ![accept the preview terms](./media/sql-database-get-started-backup-recovery/accept-the-preview-terms.png)

4. To configure long-term backup retention for a database, select that database in the grid and then click **Configure** on the toolbar.

   ![select database for long-term backup retention](./media/sql-database-get-started-backup-recovery/select-database-for-long-term-backup-retention.png)

5. On the **Configure** blade, click **Configure required settings** under **Recovery service vault**.

   ![configure vault link](./media/sql-database-get-started-backup-recovery/configure-vault-link.png)

6. On the **Recovery services vault** blade, select an existing vault, if any. Otherwise, if no recovery services vault found for your subscription, click to exit the flow and create a recovery services vault.

   ![create new vault link](./media/sql-database-get-started-backup-recovery/create-new-vault-link.png)

7. On the **Recovery Services vaults** blade, click **Add**.

   ![add new vault link](./media/sql-database-get-started-backup-recovery/add-new-vault-link.png)
   
8. On the **Recovery Services vault** blade, provide a valid name for the new Recovery Services vault.

   ![new vault name](./media/sql-database-get-started-backup-recovery/new-vault-name.png)

9. Select your subscription and resource group, and then select the location for the vault. When done, click **Create**.

   ![create new vault](./media/sql-database-get-started-backup-recovery/create-new-vault.png)

   > [!IMPORTANT]
   > The vault must be located in the same region as the Azure SQL logical server, and must use the same resource group as the logical server.
   >

10. After the new vault is created, execute the necessary steps to return to the **Recovery services vault** blade.

11. On the **Recovery services vault** blade, click the vault and then click **Select**.

   ![select existing vault](./media/sql-database-get-started-backup-recovery/select-existing-vault.png)

12. On the **Configure** blade, provide a valid name for the new retention policy, modify the default retention policy as appropriate and then click **OK**.

   ![define retention policy](./media/sql-database-get-started-backup-recovery/define-retention-policy.png)

13. On the **Long-term backup retention** blade, click **Save** and then click **OK** to apply the long-term backup retention policy to all selected databases.

   ![define retention policy](./media/sql-database-get-started-backup-recovery/save-retention-policy.png)

14. Click **Save** to enable long-term backup retention using this new policy to the Azure Recovery Services vault that you configured.

   ![define retention policy](./media/sql-database-get-started-backup-recovery/enable-long-term-retention.png)

14. After long-term backup retention has been enabled, open the **Recovery Services vault** blade (go to **All resources** and select it from the list of resources for your subscription).

   ![view recovery services vault](./media/sql-database-get-started-backup-recovery/view-recovery-services-vault.png)

## Next steps

- To recover a database from a backup in long-term retention using the Azure portal, see [recover from a backup in long-term retention using the Azure portal](sql-database-restore-from-long-term-retention-portal.md)
- To recover a database from a backup in long-term retention using PowerShell, see [recover from a backup in long-term retention using PowerShell](sql-database-restore-from-long-term-retention-powershell.md)
- To view backups in the Azure Recovery Services vault, see [view backups in long-term retention](sql-database-view-backups-in-vault.md)
- To learn about service-generated automatic backups, see [automatic backups](sql-database-automated-backups.md)
- To learn about long-term backup retention, see [long-term backup retention](sql-database-long-term-retention.md)
- To learn about restoring from backups, see [restore from backup](sql-database-recovery-using-backups.md)
- To delete long-term retention backups, see [delete long-term retention backups](sql-database-long-term-retention-delete.md)