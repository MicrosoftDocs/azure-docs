<properties
	pageTitle="Restore a deleted Azure SQL Database (PowerShell) | Microsoft Azure"
	description="Restore a deleted Azure SQL Database (PowerShell)."
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="05/01/2016"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Restore a deleted Azure SQL Database using PowerShell


> [AZURE.SELECTOR]
- [Azure Portal](sql-database-restore-deleted-database-azure-portal.md)
- [PowerShell](sql-database-restore-deleted-database-powershell.md)

This article shows you how to restore a deleted Azure SQL Database.

In the event a database is deleted, Azure SQL Database allows you to restore the deleted database to the point in time of deletion. Azure SQL Database stores the deleted database backup for the retention period of the database.

The retention period of a deleted database is determined by the service tier of the database while it existed or the number of days where the database exists, whichever is less. To learn more about database retention read our [Business Continuity Overview](sql-database-business-continuity.md).



## Restore your deleted database into a standalone database

1. Get the deleted database backup that you want to restore using the [Get-AzureRMSqlDeletedDatabaseBackup](https://msdn.microsoft.com/library/azure/mt693387.aspx) cmdlet.

    $DeletedDatabase = Get-AzureRmSqlDeletedDatabaseBackup -ResourceGroupName "resourcegroup01" -ServerName "server01" -DatabaseName "database01"

2. Start the restore from the deleted database backup using the [Restore-AzureRMSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390.aspx) cmdlet.
    
    Restore-AzureRmSqlDatabase –FromDeletedDatabaseBackup –DeletionDate $DeletedDatabase.DeletionDate -ResourceGroupName $DeletedDatabase.ResourceGroupName -ServerName $DeletedDatabase.ServerName -TargetDatabaseName "RestoredDatabase" –ResourceId $DeletedDatabase.ResourceID -Edition "Standard" -ServiceObjectiveName "S2"

## Restore your deleted database into an elastic database pool

1. Get the deleted database backup that you want to restore using the [Get-AzureRMSqlDeletedDatabaseBackup](https://msdn.microsoft.com/library/azure/mt693387.aspx) cmdlet.

    $DeletedDatabase = Get-AzureRmSqlDeletedDatabaseBackup -ResourceGroupName "resourcegroup01" -ServerName "server01" -DatabaseName "database01"

2. Start the restore from the deleted database backup using the [Restore-AzureRMSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390.aspx) cmdlet.
    
    Restore-AzureRmSqlDatabase –FromDeletedDatabaseBackup –DeletionDate $DeletedDatabase.DeletionDate -ResourceGroupName $DeletedDatabase.ResourceGroupName -ServerName $DeletedDatabase.ServerName -TargetDatabaseName "RestoredDatabase" –ResourceId $DeletedDatabase.ResourceID –ElasticPoolName "elasticpool01" 

## Next steps

- [Connect to SQL Database with SQL Server Management Studio and perform a sample T-SQL query](sql-database-connect-query-ssms.md)



## Additional resources
- [Get-AzureRMSqlDeletedDatabaseBackup](https://msdn.microsoft.com/library/azure/mt693387.aspx)
- [Restore-AzureRMSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390.aspx)
- [Business Continuity Overview](sql-database-business-continuity.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)


