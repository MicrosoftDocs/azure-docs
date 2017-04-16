---
title: 'Azure portal: Restore a Azure SQL database | Microsoft Docs'
description: Restore an Azure SQL database (Azure portal).
services: sql-database
documentationcenter: ''
author: stevestein
manager: jhubbard
editor: ''

ms.assetid: 33b0c9e6-1cd2-4fd9-9b0d-70ecf6e54821
ms.service: sql-database
ms.custom: business continuity
ms.devlang: NA
ms.date: 10/12/2016
ms.author: sstein
ms.workload: NA
ms.topic: article
ms.tgt_pltfrm: NA

---
# Restore an Azure SQL database using the Azure portal

The following steps show how to restore an Azure SQL database to a point-in-time, from a deleted database, and from a geo-redundant backup.

## Restore an Azure SQL database to a previous point in time 

> [!TIP]
> For a tutorial, see [Get Started with Backup and Restore for data protection and recovery](sql-database-get-started-backup-recovery-portal.md)
>

Select a database to restore in the Azure portal:

1. Open the [Azure portal](https://portal.azure.com).
2. On the left side of the screen, select **More services** > **SQL databases**.
3. Click the database you want to restore.
4. At the top of your database's page, select **Restore**:
   
   ![Restore an Azure SQL database](./media/sql-database-point-in-time-restore-portal/restore.png)
5. On the **Restore** page, select the date and time (in UTC time) to restore the database to, and then click **OK**:
   
   ![Restore an Azure SQL database](./media/sql-database-point-in-time-restore-portal/restore-details.png)

6. After clicking **OK** in the previous step, click the notification icon at the upper right of the page, and click the **Restoring SQL database** notification for details.
   
    ![Restore an Azure SQL database](./media/sql-database-point-in-time-restore-portal/notification-icon.png)
7. The Restoring SQL database page opens with information about the status of the restore. You can click the line-item for more details:
   
    ![Restore an Azure SQL database](./media/sql-database-point-in-time-restore-portal/inprogress.png)


## Restore a deleted Azure SQL database from backups
To restore a deleted database in the Azure portal:

1. In the [Azure portal](https://portal.azure.com), click **More services** > **SQL servers**.
2. Select the server that contained the database you want to restore.
3. Scroll down to the **operations** section of your server blade and select **Deleted databases**:
   ![Restore an Azure SQL database](./media/sql-database-restore-deleted-database-portal/restore-deleted-trashbin.png)
4. Select the database you want to restore.
5. Specify a database name, and click **OK**:
   
   ![Restore an Azure SQL database](./media/sql-database-restore-deleted-database-portal/restore-deleted.png)

## Restore an Azure SQL database from a geo-redundant backup

To geo-restore a database in the Azure portal, do the following steps:

1. Go to the [Azure portal](https://portal.azure.com).
2. On the left side of the screen select **+New** > **Databases** > **SQL Database**:
   
   ![Restore an Azure SQL database](./media/sql-database-geo-restore-portal/new-sql-database.png)
3. Select **Backup** as the source, and then select the backup you want to restore. Specify a database name, a server you want to restore the database into, and then click **Create**:
   
   ![Restore an Azure SQL database](./media/sql-database-geo-restore-portal/geo-restore.png)

4. Monitor the status of the restore operation by clicking the notification icon in the upper right of the page.

## Next steps
* For a business continuity overview and scenarios, see [Business continuity overview](sql-database-business-continuity.md)
* To learn about Azure SQL Database automated backups, see [SQL Database automated backups](sql-database-automated-backups.md)
* To learn about using automated backups for recovery, see [restore a database from the service-initiated backups](sql-database-recovery-using-backups.md)
* To learn about faster recovery options, see [Active-Geo-Replication](sql-database-geo-replication-overview.md)  
* To learn about using automated backups for archiving, see [database copy](sql-database-copy.md)

