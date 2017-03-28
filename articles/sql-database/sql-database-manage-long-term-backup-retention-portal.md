---
title: 'Azure portal:Manage long-term database backup retention | Microsoft Docs'
description: Quick reference on how to configure, manage, and restore from long-term retention of automated Azure SQL database backups in an Azure Recovery Services vault using the Azure portal
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
# Configure, manage, and restore from long-term retention of database backups in an Azure Recovery Services vault using the Azure portal

In this topic, you learn how to configure, manage, and restore from long-term retention of automated backups in an Azure Recovery Services vault using the Azure portal. You can also perform this task using [PowerShell](sql-database-manage-long-term-backup-retention-powershell.md).

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

## Next steps

- To manage backups in long-term backup retention using PowerShell, see [Manage long-term backup retention using PowerShell](sql-database-manage-long-term-backup-retention-powershell.md)
- To learn about service-generated automatic backups, see [automatic backups](sql-database-automated-backups.md)
- To learn about long-term backup retention, see [long-term backup retention](sql-database-long-term-retention.md)
- To learn about restoring from backups, see [restore from backup](sql-database-recovery-using-backups.md)