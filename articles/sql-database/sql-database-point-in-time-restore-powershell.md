<properties 
    pageTitle="Restore an Azure SQL Database to a previous point in time (PowerShell) | Microsoft Azure" 
    description="Restore an Azure SQL Database to a previous point in time using PowerShell" 
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
    ms.date="05/01/2016"
    ms.author="sstein"/>

# Restore an Azure SQL Database to a previous point in time with PowerShell

> [AZURE.SELECTOR]
- [Azure portal](sql-database-point-in-time-restore-portal.md)
- [PowerShell](sql-database-point-in-time-restore-powershell.md)

This article shows you how to restore your database to a point in time using PowerShell.

Point-in-time restore is a self-service capability, allowing you to restore a database the automatic backups we take for all database to any point within your database retention period. To learn more about automatic backups and database retention period please see our [Business Continuity Overview](sql-database-business-continuity.md).


## Restore your database to a point in time as a standalone database

1. Get the database you want to restore using the [Get-AzureRMSqlDatabase](https://msdn.microsoft.com/library/azure/mt603648.aspx) cmdlet.

    $Database = Get-AzureRmSqlDatabase -ResourceGroupName "resourcegroup01" -ServerName "server01" -DatabaseName "database01"

2. Restore the database to a point in time using the [Restore-AzureRMSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390.aspx) cmdlet.
    
    Restore-AzureRmSqlDatabase –FromPointInTimeBackup –PointInTime UTCDateTime -ResourceGroupName $Database.ResourceGroupName -ServerName $Database.ServerName -TargetDatabaseName "RestoredDatabase" –ResourceId $Database.ResourceID -Edition "Standard" -ServiceObjectiveName "S2"


## Restore your database to a point in time into an elastic database pool
   
1. Get the database you want to restore using the [Get-AzureRMSqlDatabase](https://msdn.microsoft.com/library/azure/mt603648.aspx) cmdlet.

    $Database = Get-AzureRmSqlDatabase -ResourceGroupName "resourcegroup01" -ServerName "server01" -DatabaseName "database01"

2. Restore the database to a point in time using the [Restore-AzureRMSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390.aspx) cmdlet.
    
    Restore-AzureRmSqlDatabase –FromPointInTimeBackup –PointInTime UTCDateTime -ResourceGroupName $Database.ResourceGroupName -ServerName $Database.ServerName -TargetDatabaseName "RestoredDatabase" –ResourceId $Database.ResourceID –ElasticPoolName "elasticpool01"

## Next steps

- [Connect to SQL Database with SQL Server Management Studio and perform a sample T-SQL query](sql-database-connect-query-ssms.md)


## Additional resources

- [Restore-AzureRMSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390.aspx)
- [Business Continuity Overview](sql-database-business-continuity.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)
