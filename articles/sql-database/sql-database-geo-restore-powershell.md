<properties 
    pageTitle="Geo-Restore an Azure SQL Database from a geo-redundant backup (PowerShell) | Microsoft Azure" 
    description="Geo-Restore an Azure SQL Database from a geo-redundant backup (PowerShell)" 
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

# Geo-Restore an Azure SQL Database from a geo-redundant backup using the PowerShell

> [AZURE.SELECTOR]
- [Azure portal](sql-database-geo-restore-portal.md)
- [PowerShell](sql-database-geo-restore-powershell.md)

This article shows you how to restore your database into a new server using geo-restore using PowerShell.

Geo-restore provides the ability to restore a database from a geo-redundant backup to create a new database. The database can be created on any server in any Azure region. Because it uses a geo-redundant backup as its source it can be used to recover a database even if the database is inaccessible due to an outage. Geo-restore is automatically enabled for all service tiers at no extra cost.



## Geo-Restore your database into a standalone database

1. Get the geo-redundant backup of your database that you want to restore using the [Get-AzureRMSqlDatabaseGeoBackup](https://msdn.microsoft.com/library/azure/mt693388.aspx) cmdlet.

    $GeoBackup = Get-AzureRmSqlDatabaseGeoBackup -ResourceGroupName "resourcegroup01" -ServerName "server01" -DatabaseName "database01"

2. Start the restore from the geo-redundant backup using the [Restore-AzureRMSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390.aspx) cmdlet.
    
    Restore-AzureRmSqlDatabase –FromGeoBackup -ResourceGroupName "TargetResourceGroup" -ServerName "TargetServer" -TargetDatabaseName "RestoredDatabase" –ResourceId $GeoBackup.ResourceID -Edition "Standard" -RequestedServiceObjectiveName "S2"


## Geo-Restore your database into an elastic database pool

1. Get the geo-redundant backup of your database that you want to restore using the [Get-AzureRMSqlDatabaseGeoBackup](https://msdn.microsoft.com/library/azure/mt693388.aspx) cmdlet.

    $GeoBackup = Get-AzureRmSqlDatabaseGeoBackup -ResourceGroupName "resourcegroup01" -ServerName "server01" -DatabaseName "database01"

2. Start the restore from the geo-redundant backup using the [Restore-AzureRMSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390.aspx) cmdlet. Specify the pool name you want to restore your database into.
    
    Restore-AzureRmSqlDatabase –FromGeoBackup -ResourceGroupName "TargetResourceGroup" -ServerName "TargetServer" -TargetDatabaseName "RestoredDatabase" –ResourceId $GeoBackup.ResourceID –ElasticPoolName "elasticpool01"  

## Next steps

- [Disaster Recovery Drills](sql-database-disaster-recovery-drills.md)

## Additional resources

- [Get-AzureRMSqlDatabaseGeoBackup](https://msdn.microsoft.com/library/azure/mt693388.aspx)
- [Restore-AzureRMSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390.aspx)
- [Spotlight on new geo-replication capabilities](https://azure.microsoft.com/blog/spotlight-on-new-capabilities-of-azure-sql-database-geo-replication/)
- [Designing cloud applications for business continuity using geo-replication](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
- [Business Continuity Overview](sql-database-business-continuity.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)
