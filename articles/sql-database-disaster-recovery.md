<properties 
   pageTitle="SQL Database Disaster Recovery" 
   description="Learn how  to recover a database from a regional datacenter outage or failure with the Azure SQL Database Geo-replication and Geo-restore capabilities." 
   services="sql-database" 
   documentationCenter="" 
   authors="elfisher" 
   manager="jeffreyg" 
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management" 
   ms.date="04/13/2015"
   ms.author="elfish"/>

# Recover an Azure SQL Database from an outage

Azure SQL Database's offers a few outage recovery capabilities:

- Active Geo-Replication [(blog)](http://azure.microsoft.com/blog/2014/07/12/spotlight-on-sql-database-active-geo-replication/)
- Standard Geo-Replication [(blog)](http://azure.microsoft.com/blog/2014/09/03/azure-sql-database-standard-geo-replication/)
- Geo-restore [(blog)](http://azure.microsoft.com/blog/2014/09/13/azure-sql-database-geo-restore/)

To learn about preparing for disaster and when to recover your database, visit our [Design for Business Continuity](sql-database-business-continuity-design.md) page. 

##When to initiate recovery 

The recovery operation impacts the application. It requires changing the SQL connection string and could result in permanent data loss. Therefore it should be done only when the outage is likely to last longer than your application's RTO. When the application is deployed to production you should perform regular monitoring of the application health and use the following data points to assert that the recovery is warranted:

1. Permanent connectivity failure from the application tier to the database.
2. Your Azure Portal shows an alert about an incident in the region with broad impact.

## Failover to the Geo-Replicated secondary database
> [AZURE.NOTE] You must configure [Standard Geo-Replication](https://msdn.microsoft.com/library/azure/dn758204.aspx) or [Active Geo-Replication](https://msdn.microsoft.com/library/azure/dn741339.aspx) to have a secondary database to use for failover. Geo-Replication is only available for Standard and Premium databases. 

In the event of an outage on the primary database, you can failover to a secondary database to restore availability. To do this you will need to force terminate the continuous copy relationship. For a full description of terminating continuous copy relationships go [here](https://msdn.microsoft.com/library/azure/dn741323.aspx). 



###Azure Portal
1. Log in to the [Azure Portal](https://portal.Azure.com)
2. On the left side of the screen select **BROWSE** and then select **SQL Databases**
3. Navigate to your database and select it. 
4. At the bottom of your database blade select the **Geo Replication map**.
4. Under **Secondaries** right click on the row with the name of the database you want to recover to and select **Stop**.

After the continuous copy relationship is terminated, you can configure your recovered database to be used by following the [Finalize a Recovered Database](sql-database-recovered-finalize.md) guide.
###PowerShell
Use PowerShell to programmatically perform database recovery.

To terminate the relationship from the secondary database, use the [Stop-AzureSqlDatabaseCopy](https://msdn.microsoft.com/library/dn720223) cmdlet.
		
		$myDbCopy = Get-AzureSqlDatabaseCopy -ServerName "SecondaryServerName" -DatabaseName "SecondaryDatabaseName"
		$myDbCopy | Stop-AzureSqlDatabaseCopy -ServerName "SecondaryServerName" -ForcedTermination
		 
After the continuous copy relationship is terminated, you can configure your recovered database to be used by following the [Finalize a Recovered Database](sql-database-recovered-finalize.md) guide.
###REST API 
Use REST to programmatically perform database recovery.

1. Get the database continuous copy using the [Get Database Copy](https://msdn.microsoft.com/library/azure/dn509570.aspx) operation.
2. Stop the database continuous copy using the [Stop Database Copy](https://msdn.microsoft.com/library/azure/dn509573.aspx) operation.
Use the secondary server name and database name in the Stop Database Copy request URI

 After the continuous copy relationship is terminated, you can configure your recovered database to be used by following the [Finalize a Recovered Database](sql-database-recovered-finalize.md) guide.
## Recovery using Geo-Restore

In the event of an outage of a database, you can recover your database from its latest geo redundant backup using Geo-Restore. 

###Azure Portal
1. Log in to the [Azure Portal](https://portal.Azure.com)
2. On the left side of the screen select **NEW**, then select **Data and Storage**, and then select **SQL Database**
2. Select **BACKUP** as the source  and then select the geo redundant backup you want to recover from.
3. Specify the rest of the database properties and then click **Create**.
4. The database restore process will begin and can be monitored using **NOTIFICATIONS** on the left side of the screen.

After the database is recovered you can configure it to be used by following the [Finalize a Recovered Database](articles/sql-database-recovered-finalize.md) guide.
###PowerShell 
Use PowerShell to programmatically perform database recovery.

To start a Geo-Restore request, use the [start-AzureSqlDatabaseRecovery](https://msdn.microsoft.com/library/azure/dn720224.aspx) cmdlet. For a detailed walk through, please see our [how-to video](http://azure.microsoft.com/documentation/videos/restore-a-sql-database-using-geo-restore-with-microsoft-azure-powershell/).

		$Database = Get-AzureSqlRecoverableDatabase -ServerName "ServerName" –DatabaseName “DatabaseToBeRecovered"
		$RecoveryRequest = Start-AzureSqlDatabaseRecovery -SourceDatabase $Database –TargetDatabaseName “NewDatabaseName” –TargetServerName “TargetServerName”
		Get-AzureSqlDatabaseOperation –ServerName "TargetServerName" –OperationGuid $RecoveryRequest.RequestID

After the database is recovered you can configure it to be used by following the [Finalize a Recovered Database](sql-database-recovered-finalize.md) guide.
###REST API 

Use REST to programmatically perform database recovery.

1.	Get your list of recoverable databases using the [List Recoverable Databases](http://msdn.microsoft.com/library/azure/dn800984.aspx) operation.
	
2.	Get the database you want to recover using the [Get Recoverable Database](http://msdn.microsoft.com/library/azure/dn800985.aspx) operation.
	
3.	Create the recovery request using the [Create Database Recovery Request](http://msdn.microsoft.com/library/azure/dn800986.aspx) operation.
	
4.	Track the status of the recovery using the [Database Operation Status](http://msdn.microsoft.com/library/azure/dn720371.aspx) operation.

After the database is recovered you can configure it to be used by following the [Finalize a Recovered Database](sql-database-recovered-finalize.md) guide.
