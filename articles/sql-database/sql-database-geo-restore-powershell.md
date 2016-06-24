<properties 
    pageTitle="Restore an Azure SQL Database from a geo-redundant backup (PowerShell) | Microsoft Azure" 
    description="Restore an Azure SQL Database into a new server from a geo-redundant backup" 
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

# Restore an Azure SQL Database from a geo-redundant backup using PowerShell


> [AZURE.SELECTOR]
- [Overview](sql-database-geo-restore.md)
- [Azure Portal](sql-database-geo-restore-portal.md)
- [PowerShell](sql-database-geo-restore-powershell.md)

This article shows you how to restore your database into a new server using Geo-Restore using PowerShell.

[AZURE.INCLUDE [Start your PowerShell session](../../includes/sql-database-powershell.md)]

## Geo-Restore your database into a standalone database

1. Get the geo-redundant backup of your database that you want to restore using the [Get-AzureRmSqlDatabaseGeoBackup](https://msdn.microsoft.com/library/azure/mt693388.aspx) cmdlet.

        $GeoBackup = Get-AzureRmSqlDatabaseGeoBackup -ResourceGroupName "resourcegroup01" -ServerName "server01" -DatabaseName "database01"

2. Start the restore from the geo-redundant backup using the [Restore-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390.aspx) cmdlet.
    
        Restore-AzureRmSqlDatabase –FromGeoBackup -ResourceGroupName "TargetResourceGroup" -ServerName "TargetServer" -TargetDatabaseName "RestoredDatabase" –ResourceId $GeoBackup.ResourceID -Edition "Standard" -RequestedServiceObjectiveName "S2"


## Geo-Restore your database into an elastic database pool

1. Get the geo-redundant backup of your database that you want to restore using the [Get-AzureRmSqlDatabaseGeoBackup](https://msdn.microsoft.com/library/azure/mt693388.aspx) cmdlet.

        $GeoBackup = Get-AzureRmSqlDatabaseGeoBackup -ResourceGroupName "resourcegroup01" -ServerName "server01" -DatabaseName "database01"

2. Start the restore from the geo-redundant backup using the [Restore-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390.aspx) cmdlet. Specify the pool name you want to restore your database into.
    
        Restore-AzureRmSqlDatabase –FromGeoBackup -ResourceGroupName "TargetResourceGroup" -ServerName "TargetServer" -TargetDatabaseName "RestoredDatabase" –ResourceId $GeoBackup.ResourceID –ElasticPoolName "elasticpool01"  

## Next steps

- For detailed steps on how to restore an Azure SQL Database using the Azure portal from a geo-redundant backup, see [Geo-Restore using the Azure Portal](sql-database-geo-restore-portal.md)
- For detailed detailed information regarding restoring an Azure SQL Database from a geo-redundant backup, see[Geo-Restore using PowerShell](sql-database-geo-restore.md)
- For a full discussion about how to recover from an outage, see [Recover from an outage](sql-database-disaster-recovery.md)


## Additional resources

- [Business Continuity Scenarios](sql-database-business-continuity-scenarios.md)
