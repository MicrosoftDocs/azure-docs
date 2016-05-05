<properties 
   pageTitle="SQL Database User Error Recovery" 
   description="Learn how to recover from user error, accidental data corruption, or a deleted database using the Point-in-time Restore (PITR) feature of Azure SQL Database." 
   services="sql-database" 
   documentationCenter="" 
   authors="elfisher" 
   manager="jhubbard" 
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management" 
   ms.date="02/09/2016"
   ms.author="elfish"/>

# Recover an Azure SQL Database from a user error

Azure SQL Database offers two core capabilities for recovering from user error or unintended data modification.

- Point In Time Restore 
- Restore deleted database

You can learn more about these capabilities in this [blog post](https://azure.microsoft.com/blog/2014/10/01/azure-sql-database-point-in-time-restore/).

Azure SQL Database always restores to a new database. These restore capabilities are offered to all Basic, Standard, and Premium databases.

##Point In Time Restore

In the event of a user error or unintended data modification, Point In Time Restore can be used to restore your database to any point in time within your databases retention period. 

Basic databases have 7 days of retention, Standard databases have 14 days of retention, and Premium databases have 35 days of retention. To learn more about database retention, please see [Business continuity overview](sql-database-business-continuity.md).

> [AZURE.NOTE] Restoring a database creates a new database. It is important to make sure the server you are restoring to has enough DTU capacity for the new database. You can request an increase of this quota by [contacting support](https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests/).

###Azure Portal
> [AZURE.NOTE] For databases in elastic database pools, the Azure Portal only supports point in time restore into the same pool. If you would like to point in time restore a database as a stand alone database, please use the REST API.

To use Point In Time Restore in the Azure Portal, use the following steps.

1. Log in to the [Azure Portal](https://portal.Azure.com)
2. On the left side of the screen select **BROWSE** and then select **SQL Databases**.
3. Navigate to your database and select it.
4. At the top of your database's blade, select **Restore**.
5. Specify a database name, point in time and then click **Create**.
6. The database restore process will begin and can be monitored using **NOTIFICATIONS** on the left side of the screen.

###PowerShell
Use PowerShell to programmatically perform a Point In Time Restore with the [Start-AzureSqlDatabaseRestore](https://msdn.microsoft.com/library/dn720218.aspx?f=255&MSPPError=-2147217396) cmdlet. For a detailed walk through, please [watch the video of this procedure](https://azure.microsoft.com/documentation/videos/restore-a-sql-database-using-point-in-time-restore-with-microsoft-azure-powershell/).

> [AZURE.IMPORTANT] This article contains commands for versions of Azure PowerShell up to *but not including* versions 1.0 and later. You can check your version of Azure PowerShell with the **Get-Module azure | format-table version** command.

		$Database = Get-AzureSqlDatabase -ServerName "YourServerName" –DatabaseName “YourDatabaseName”
		$RestoreRequest = Start-AzureSqlDatabaseRestore -SourceDatabase $Database –TargetDatabaseName “NewDatabaseName” –PointInTime “2015-01-01 06:00:00”
		Get-AzureSqlDatabaseOperation –ServerName "YourServerName" –OperationGuid $RestoreRequest.RequestID
		 

###REST API 
Use REST to programmatically perform database restore. To do this create the restore request using the [Create Database](https://msdn.microsoft.com/library/azure/mt163685.aspx) operation, and specify the **create mode** to be **PointInTimeRestore**.

##Restore a deleted database
In the event a database is deleted, Azure SQL Database allows you to restore the deleted database to the point in time of deletion. Azure SQL Database stores the deleted database backup for the retention period of the database.

The retention period of a deleted database is determined by the service tier of the database while it existed or the number of days where the database exists, whichever is less. To learn more about database retention read our [business continuity overview](sql-database-business-continuity.md).

> [AZURE.NOTE] Restoring a database creates a new database. It is important to make sure the server you are restoring to has enough DTU capacity for the new database. You can request an increase of this quota by [contacting support](https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests/).

###Azure Portal
To restore a deleted database using the Azure Portal, use the following steps.

1. Log in to the [Azure Portal](https://portal.Azure.com)
2. On the left side of the screen select **BROWSE** and then select **SQL Servers**.
3. Navigate to your sever and select it.
4. Scroll down to **Operations** on you server's blade, click the **Deleted Databases** tile.
5. Select the deleted database you want to restore.
6. Specify a database name and click **Create**.
7. The database restore process will begin and can be monitored using **NOTIFICATIONS** on the left side of the screen.

###PowerShell
To restore a deleted database using PowerShell, use the [Start-AzureSqlDatabaseRestore](https://msdn.microsoft.com/library/dn720218.aspx?f=255&MSPPError=-2147217396) cmdlet.  For a detailed walk through, please [watch a video of this procedure](https://azure.microsoft.com/documentation/videos/restore-a-deleted-sql-database-with-microsoft-azure-powershell/).

1. Find the deleted database and its deletion date from the list of deleted databases.
		
		Get-AzureSqlDatabase -RestorableDropped -ServerName "YourServerName"

2. Get the specific deleted database and start the restore.

		$Database = Get-AzureSqlDatabase -RestorableDropped -ServerName "YourServerName" –DatabaseName “YourDatabaseName” -DeletionDate "1/01/2015 12:00:00 AM""
		$RestoreRequest = Start-AzureSqlDatabaseRestore -SourceRestorableDroppedDatabase $Database –TargetDatabaseName “NewDatabaseName”
		Get-AzureSqlDatabaseOperation –ServerName "YourServerName" –OperationGuid $RestoreRequest.RequestID
		 

###REST API 
Use REST to programmatically perform database restore.

1.	List all of your restorable deleted databases by using the [List Restorable Dropped Databases](http://msdn.microsoft.com/library/azure/dn509562.aspx) operation.
	
2.	Get the details for the deleted database you want to restore by using the [Get Restorable Dropped Database](http://msdn.microsoft.com/library/azure/dn509574.aspx) operation.

3.	Begin your restore by using the [Create Database Restore Request](http://msdn.microsoft.com/library/azure/dn509571.aspx) operation.
	
4.	Track the status of your restore by using the [Database Operation Status](http://msdn.microsoft.com/library/azure/dn720371.aspx) operation.
