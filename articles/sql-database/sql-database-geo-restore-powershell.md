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
    ms.workload="NA"
    ms.date="07/17/2016"
    ms.author="sstein"/>

# Restore an Azure SQL Database from a geo-redundant backup by using PowerShell


> [AZURE.SELECTOR]
- [Overview](sql-database-recovery-using-backups.md)
- [Geo-Restore: Azure Portal](sql-database-geo-restore-portal.md)

This article shows you how to restore your database into a new server by using geo-restore. This can be done through PowerShell.

[AZURE.INCLUDE [Start your PowerShell session](../../includes/sql-database-powershell.md)]

## Geo-restore your database into a standalone database

1. Get the geo-redundant backup of your database that you want to restore by using the [Get-AzureRmSqlDatabaseGeoBackup](https://msdn.microsoft.com/library/azure/mt693388.aspx) cmdlet.

        $GeoBackup = Get-AzureRmSqlDatabaseGeoBackup -ResourceGroupName "resourcegroup01" -ServerName "server01" -DatabaseName "database01"

2. Start the restore from the geo-redundant backup by using the [Restore-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390.aspx) cmdlet.

        Restore-AzureRmSqlDatabase –FromGeoBackup -ResourceGroupName "TargetResourceGroup" -ServerName "TargetServer" -TargetDatabaseName "RestoredDatabase" –ResourceId $GeoBackup.ResourceID -Edition "Standard" -RequestedServiceObjectiveName "S2"


## Geo-restore your database into an elastic database pool

1. Get the geo-redundant backup of your database that you want to restore by using the [Get-AzureRmSqlDatabaseGeoBackup](https://msdn.microsoft.com/library/azure/mt693388.aspx) cmdlet.

        $GeoBackup = Get-AzureRmSqlDatabaseGeoBackup -ResourceGroupName "resourcegroup01" -ServerName "server01" -DatabaseName "database01"

2. Start the restore from the geo-redundant backup by using the [Restore-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390.aspx) cmdlet. Specify the pool name you want to restore your database into.

        Restore-AzureRmSqlDatabase –FromGeoBackup -ResourceGroupName "TargetResourceGroup" -ServerName "TargetServer" -TargetDatabaseName "RestoredDatabase" –ResourceId $GeoBackup.ResourceID –ElasticPoolName "elasticpool01"  


## Next steps

- For a business continuity overview and scenarios, see [Business continuity overview](sql-database-business-continuity.md).
- To learn about Azure SQL Database automated backups, see [SQL Database automated backups](sql-database-automated-backups.md).
- To learn about using automated backups for recovery, see [restore a database from the service-initiated backups](sql-database-recovery-using-backups.md).
- To learn about faster recovery options, see [Active-Geo-Replication](sql-database-geo-replication-overview.md).  
- To learn about using automated backups for archiving, see [database copy](sql-database-copy.md).
