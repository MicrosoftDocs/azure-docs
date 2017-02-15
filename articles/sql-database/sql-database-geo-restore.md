---
title: Restore an Azure SQL Database from a geo-redundant backup | Microsoft Docs
description: Restore an Azure SQL Database into a new server from a geo-redundant backup using either the Azure portal or PowerShell
services: sql-database
documentationcenter: ''
author: stevestein
manager: jhubbard
editor: ''

ms.assetid: 4b42bffa-f98c-406a-9a96-51721cc423d4
ms.service: sql-database
ms.custom: business continuity
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: powershell
ms.workload: NA
ms.date: 12/19/2016
ms.author: sstein; carlrab

---
# Restore an Azure SQL Database from a geo-redundant backup

This article shows you how to restore your database into a new server by using geo-restore. This can be done through either the Azure portal or using PowerShell.

## Restore an Azure SQL Database from a geo-redundant backup by using the Azure portal

To geo-restore a database in the Azure portal, do the following steps:

1. Go to the [Azure portal](https://portal.azure.com).
2. On the left side of the screen select **+New** > **Databases** > **SQL Database**:
   
   ![Restore an Azure SQL database](./media/sql-database-geo-restore-portal/new-sql-database.png)
3. Select **Backup** as the source, and then select the backup you want to restore. Specify a database name, a server you want to restore the database into, and then click **Create**:
   
   ![Restore an Azure SQL database](./media/sql-database-geo-restore-portal/geo-restore.png)

4. Monitor the status of the restore operation by clicking the notification icon in the upper right of the page.

## Restore an Azure SQL Database from a geo-redundant backup by using PowerShell

[!INCLUDE [Start your PowerShell session](../../includes/sql-database-powershell-h3.md)]

### Geo-restore your database into a standalone database
1. Get the geo-redundant backup of your database that you want to restore by using the [Get-AzureRmSqlDatabaseGeoBackup](https://msdn.microsoft.com/library/azure/mt693388\(v=azure.300\).aspx) cmdlet.
   
        $GeoBackup = Get-AzureRmSqlDatabaseGeoBackup -ResourceGroupName "resourcegroup01" -ServerName "server01" -DatabaseName "database01"
2. Start the restore from the geo-redundant backup by using the [Restore-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390\(v=azure.300\).aspx) cmdlet.
   
        Restore-AzureRmSqlDatabase –FromGeoBackup -ResourceGroupName "TargetResourceGroup" -ServerName "TargetServer" -TargetDatabaseName "RestoredDatabase" –ResourceId $GeoBackup.ResourceID -Edition "Standard" -RequestedServiceObjectiveName "S2"

### Geo-restore your database into an elastic pool
1. Get the geo-redundant backup of your database that you want to restore by using the [Get-AzureRmSqlDatabaseGeoBackup](https://msdn.microsoft.com/library/azure/mt693388\(v=azure.300\).aspx) cmdlet.
   
        $GeoBackup = Get-AzureRmSqlDatabaseGeoBackup -ResourceGroupName "resourcegroup01" -ServerName "server01" -DatabaseName "database01"
2. Start the restore from the geo-redundant backup by using the [Restore-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt693390\(v=azure.300\).aspx) cmdlet. Specify the pool name you want to restore your database into.
   
        Restore-AzureRmSqlDatabase –FromGeoBackup -ResourceGroupName "TargetResourceGroup" -ServerName "TargetServer" -TargetDatabaseName "RestoredDatabase" –ResourceId $GeoBackup.ResourceID –ElasticPoolName "elasticpool01"  

## Next steps
* For a business continuity overview and scenarios, see [Business continuity overview](sql-database-business-continuity.md).
* To learn about Azure SQL Database automated backups, see [SQL Database automated backups](sql-database-automated-backups.md).
* To learn about using automated backups for recovery, see [Restore a database from the service-initiated backups](sql-database-recovery-using-backups.md).
* To learn about faster recovery options, see [Active-geo-replication](sql-database-geo-replication-overview.md).  
* To learn about using automated backups for archiving, see [Database copy](sql-database-copy.md).

