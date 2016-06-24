<properties 
    pageTitle="Restore an Azure SQL Database to a previous point in time (PowerShell) | Microsoft Azure" 
    description="Restore an Azure SQL Database to a previous point in time" 
    services="sql-database" 
    documentationCenter="" 
    authors="stevestein" 
    manager="jhubbard" 
    editor=""/>

<tags
    ms.service="sql-database"
    ms.devlang="NA"
    ms.topic="article"
    ms.tgt_pltfrm="powershell"
    ms.workload="sqldb-bcdr" 
    ms.date="06/17/2016"
    ms.author="sstein"/>

# Restore an Azure SQL Database to a previous point in time with PowerShell

> [AZURE.SELECTOR]
- [Overview](sql-database-point-in-time-restore.md)
- [Azure portal](sql-database-point-in-time-restore-portal.md)
- [PowerShell](sql-database-point-in-time-restore-powershell.md)

This article shows you how to restore your database to an earlier point in time from [SQL Database automated backups](sql-database-automated-backups.md) using PowerShell.

[AZURE.INCLUDE [Start your PowerShell session](../../includes/sql-database-powershell.md)]

## Restore your database to a point in time as a standalone database

1. Get the database you want to restore using the [Get-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt603648.aspx) cmdlet.

        $Database = Get-AzureRmSqlDatabase -ResourceGroupName "resourcegroup01" -ServerName "server01" -DatabaseName "database01"

2. Restore the database to a point in time using the [Restore-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390.aspx) cmdlet.
    
        Restore-AzureRmSqlDatabase –FromPointInTimeBackup –PointInTime UTCDateTime -ResourceGroupName $Database.ResourceGroupName -ServerName $Database.ServerName -TargetDatabaseName "RestoredDatabase" –ResourceId $Database.ResourceID -Edition "Standard" -ServiceObjectiveName "S2"


## Restore your database to a point in time into an elastic database pool
   
1. Get the database you want to restore using the [Get-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt603648.aspx) cmdlet.

        $Database = Get-AzureRmSqlDatabase -ResourceGroupName "resourcegroup01" -ServerName "server01" -DatabaseName "database01"

2. Restore the database to a point in time using the [Restore-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390.aspx) cmdlet.
    
        Restore-AzureRmSqlDatabase –FromPointInTimeBackup –PointInTime UTCDateTime -ResourceGroupName $Database.ResourceGroupName -ServerName $Database.ServerName -TargetDatabaseName "RestoredDatabase" –ResourceId $Database.ResourceID –ElasticPoolName "elasticpool01"

## Next steps

- For detailed steps to recover to a point in time using the Azure portal, see [Point-In-Time Restore using the Azure portal](sql-database-point-in-time-restore-portal.md).
- For information about how to recover to a point in time using the REST API, see [Point-In-Time Restore using the REST API](https://msdn.microsoft.com/library/azure/mt163685.aspx).
- For an overview of point in time restore, see [Point-In-Time Restore](sql-database-point-in-time-restore.md)
- For a full discussion about how to recover from a user or application error, see [User error recovery](sql-database-user-error-recovery.md).

## Additional resources

- [Business continuity scenarios](sql-database-business-continuity-scenarios.md)