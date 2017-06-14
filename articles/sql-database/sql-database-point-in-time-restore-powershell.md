---
title: 'PowerShell:Restore Azure SQL Database to point in time | Microsoft Docs'
description: Restore an Azure SQL Database to a previous point in time using PowerShell
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
# Restore an Azure SQL Database to a previous point in time with PowerShell

This artcile shows you how to restore your database to an earlier point in time from [SQL Database automated backups](sql-database-automated-backups.md) using PowerShell. This task can also be done [with the Azure portal](sql-database-point-in-time-restore-portal.md).  

## Restore to a previous point in time 

> [!TIP]
> For a tutorial, see [Get Started with Backup and Restore for data protection and recovery](sql-database-get-started-backup-recovery-powershell.md)
>


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
* For a business continuity overview and scenarios, see [Business continuity overview](sql-database-business-continuity.md)

