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
	ms.date="06/09/2016"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Restore a deleted Azure SQL Database using PowerShell

> [AZURE.SELECTOR]
- [Overview](sql-database-restore-deleted-database.md)
- [Azure portal](sql-database-restore-deleted-database-portal.md)
- [PowerShell](sql-database-restore-deleted-database-powershell.md)

[AZURE.INCLUDE [Start your PowerShell session](../../includes/sql-database-powershell.md)]


## Restore your deleted database into a standalone database

1. Get the deleted database backup that you want to restore using the [Get-AzureRmSqlDeletedDatabaseBackup](https://msdn.microsoft.com/library/azure/mt693387.aspx) cmdlet.

        $DeletedDatabase = Get-AzureRmSqlDeletedDatabaseBackup -ResourceGroupName "resourcegroup01" -ServerName "server01" -DatabaseName "database01"

2. Start the restore from the deleted database backup using the [Restore-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390.aspx) cmdlet.
    
        Restore-AzureRmSqlDatabase –FromDeletedDatabaseBackup –DeletionDate $DeletedDatabase.DeletionDate -ResourceGroupName $DeletedDatabase.ResourceGroupName -ServerName $DeletedDatabase.ServerName -TargetDatabaseName "RestoredDatabase" –ResourceId $DeletedDatabase.ResourceID -Edition "Standard" -ServiceObjectiveName "S2"

## Restore your deleted database into an elastic database pool

1. Get the deleted database backup that you want to restore using the [Get-AzureRmSqlDeletedDatabaseBackup](https://msdn.microsoft.com/library/azure/mt693387.aspx) cmdlet.

        $DeletedDatabase = Get-AzureRmSqlDeletedDatabaseBackup -ResourceGroupName "resourcegroup01" -ServerName "server01" -DatabaseName "database01"

2. Start the restore from the deleted database backup using the [Restore-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390.aspx) cmdlet.
    
        Restore-AzureRmSqlDatabase –FromDeletedDatabaseBackup –DeletionDate $DeletedDatabase.DeletionDate -ResourceGroupName $DeletedDatabase.ResourceGroupName -ServerName $DeletedDatabase.ServerName -TargetDatabaseName "RestoredDatabase" –ResourceId $DeletedDatabase.ResourceID –ElasticPoolName "elasticpool01" 

## Next steps

- [Finalize your recovered Azure SQL Database](sql-database-recovered-finalize.md)
- [Restore a deleted database](sql-database-restore-deleted-database.md)
- [Restore a deleted database using the Azure Portal](sql-database-restore-deleted-database-portal.md)
- [Restore a deleted database using the REST API](https://msdn.microsoft.com/library/azure/mt163685.aspx)
- [SQL Database automated backups](sql-database-automated-backups.md)

## Additional Resources

- [Point-in-time restore](sql-database-point-in-time-restore.md)
- [Business Continuity Overview](sql-database-business-continuity.md)
- [Geo-Restore](sql-database-geo-restore.md)
- [Active-Geo-Replication](sql-database-geo-replication-overview.md)
- [Designing applications for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md)



