---
title: Restore an Azure SQL Database to a previous point in time | Microsoft Docs
description: Restore an Azure SQL Database to a previous point in time
services: sql-database
documentationcenter: ''
author: stevestein
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: business continuity
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: powershell
ms.workload: NA
ms.date: 12/08/2016
ms.author: sstein; carlrab

---
# Restore an Azure SQL Database to a previous point in time 

This How To article shows you how to restore your database to an earlier point in time from [SQL Database automated backups](sql-database-automated-backups.md). 

## Restore to a previous point in time using the Azure portal

> [!TIP]
> For a tutorial, see [Get Started with Backup and Restore for data protection and recovery](sql-database-get-started-backup-recovery.md)
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

## Restore to a previous point in time using PowerShell

[!INCLUDE [Start your PowerShell session](../../includes/sql-database-powershell-h3.md)]

### Restore your database to a point in time as a single database
1. Get the database you want to restore by using the [Get-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt603648\(v=azure.300\).aspx) cmdlet.
   
        $Database = Get-AzureRmSqlDatabase -ResourceGroupName "resourcegroup01" -ServerName "server01" -DatabaseName "database01"
2. Restore the database to a point in time by using the [Restore-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390\(v=azure.300\).aspx) cmdlet.
   
        Restore-AzureRmSqlDatabase -FromPointInTimeBackup -PointInTime UTCDateTime -ResourceGroupName $Database.ResourceGroupName -ServerName $Database.ServerName -TargetDatabaseName "RestoredDatabase" -ResourceId $Database.ResourceID -Edition "Standard" -ServiceObjectiveName "S2"

### Restore your database to a point in time into an elastic pool
1. Get the database you want to restore by using the [Get-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt603648\(v=azure.300\).aspx) cmdlet.
   
        $Database = Get-AzureRmSqlDatabase -ResourceGroupName "resourcegroup01" -ServerName "server01" -DatabaseName "database01"
2. Restore the database to a point in time by using the [Restore-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390\(v=azure.300\).aspx) cmdlet.
   
        Restore-AzureRmSqlDatabase -FromPointInTimeBackup -PointInTime UTCDateTime -ResourceGroupName $Database.ResourceGroupName -ServerName $Database.ServerName -TargetDatabaseName "RestoredDatabase" -ResourceId $Database.ResourceID -ElasticPoolName "elasticpool01"

## Next steps
* To learn about Azure SQL Database automated backups, see [SQL Database automated backups](sql-database-automated-backups.md)
* To learn about using automated backups for recovery, see [restore a database from the service-initiated backups](sql-database-recovery-using-backups.md)
* To view the oldest restore point from the service-generated backups of a database, see [View oldest restore point](sql-database-view-oldest-restore-point.md)
* For a business continuity overview and scenarios, see [Business continuity overview](sql-database-business-continuity.md)

