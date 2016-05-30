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
    ms.workload="data-management" 
    ms.date="05/10/2016"
    ms.author="sstein"/>

# Restore an Azure SQL Database to a previous point in time with PowerShell

> [AZURE.SELECTOR]
- [Azure Portal](sql-database-point-in-time-restore-portal.md)
- [PowerShell](sql-database-point-in-time-restore-powershell.md)

This article shows you how to restore your database to an earlier point in time using PowerShell.

[**Point-in-Time Restore**](sql-database-point-in-time-restore.md) is a self-service capability, allowing you to restore a database from the automatic backups we take for all databases to any point within your database's retention period. To learn more about automatic backups and database retention periods, see [Business Continuity Overview](sql-database-business-continuity.md).

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

- [Finalize your recovered Azure SQL Database](sql-database-recovered-finalize.md)
- [Connect to SQL Database with SQL Server Management Studio and perform a sample T-SQL query](sql-database-connect-query-ssms.md)


## Additional resources

- [Business Continuity Overview](sql-database-business-continuity.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)
