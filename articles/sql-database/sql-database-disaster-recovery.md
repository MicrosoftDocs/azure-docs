<properties 
   pageTitle="SQL Database disaster recovery" 
   description="Learn how to recover a database from a regional datacenter outage or failure with the Azure SQL Database Active Geo-Replication, Standard Geo-Replication, and Geo-Restore capabilities." 
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

# Recover an Azure SQL Database from an outage

Azure SQL Database's offers the following capabilities for recovering from an outage:

- Active Geo-Replication [(blog)](http://azure.microsoft.com/blog/2014/07/12/spotlight-on-sql-database-active-geo-replication/)
- Standard Geo-Replication [(blog)](http://azure.microsoft.com/blog/2014/09/03/azure-sql-database-standard-geo-replication/)
- Geo-Restore [(blog)](http://azure.microsoft.com/blog/2014/09/13/azure-sql-database-geo-restore/)
- New Geo-replication capabilities [(blog)](https://azure.microsoft.com/blog/spotlight-on-new-capabilities-of-azure-sql-database-geo-replication/)

To learn about preparing for disaster and when to recover your database, visit our [Design for business continuity](sql-database-business-continuity-design.md) page. 

##When to initiate recovery 

The recovery operation impacts the application. It requires changing the SQL connection string and could result in permanent data loss. Therefore it should be done only when the outage is likely to last longer than your application's RTO. When the application is deployed to production you should perform regular monitoring of the application health and use the following data points to assert that the recovery is warranted:

1. Permanent connectivity failure from the application tier to the database.
2. Your Azure Portal shows an alert about an incident in the region with broad impact.

> [AZURE.NOTE] After your database is recovered you can configure it to be used by following the [Configure your database after recovery](#postrecovery) guide.

## Failover to geo-replicated secondary database
> [AZURE.NOTE] You must configure to have a secondary database to use for failover. Geo-Replication is only available for Standard and Premium databases. Learn [how to configure Geo-Replication](sql-database-business-continuity-design.md)

###Azure Portal
Use the Azure Portal to terminate the continuous copy relationship with the Geo-Replicated secondary database.

1. Log in to the [Azure Portal](https://portal.Azure.com)
2. On the left side of the screen select **BROWSE** and then select **SQL Databases**
3. Navigate to your database and select it. 
4. At the bottom of your database blade select the **Geo Replication map**.
4. Under **Secondaries** right click on the row with the name of the database you want to recover to and select **Failover**.

###PowerShell
Use PowerShell to initiate failover to Geo-Replicated secondary database by using the [Set-AzureRMSqlDatabaseSecondary](https://msdn.microsoft.com/library/mt619393.aspx) cmdlet.
		
		$database = Get-AzureRMSqlDatabase –DatabaseName "mydb” –ResourceGroupName "rg2” –ServerName "srv2”
		$database | Set-AzureRMSqlDatabaseSecondary –Failover -AllowDataLoss

###REST API 
Use REST to programmatically initiate failover to a secondary database.

1. Get replication link to a specific secondary using the [Get Replication Link](https://msdn.microsoft.com/library/mt600778.aspx) operation.
2. Failover to the secondary using the [Set Secondary Database As Primary](https://msdn.microsoft.com/library/mt582027.aspx) with data loss allowed. 

## Recover using Geo-Restore

In the event of an outage of a database, you can recover your database from its latest geo redundant backup using Geo-Restore. 

> [AZURE.NOTE] Recovering a database creates a new database. It is important to make sure the server you are recovering to has enough DTU capacity for the new database. You can request an increase of this quota by [contacting support](https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests/).

###Azure Portal (Recovery to a Stand Alone Database)
To restore a SQL Database using Geo-Restore in the Azure Portal, use the following steps.

1. Log in to the [Azure Portal](https://portal.Azure.com)
2. On the left side of the screen select **NEW**, then select **Data and Storage**, and then select **SQL Database**
2. Select **BACKUP** as the source  and then select the geo redundant backup you want to recover from.
3. Specify the rest of the database properties and then click **Create**.
4. The database restore process will begin and can be monitored using **NOTIFICATIONS** on the left side of the screen.

###Azure Portal (Recovery into an Elastic Database Pool)
To restore a SQL Database using Geo-Restore into an Elastic Database Pool using the portal, follow the instructions below.

1. Log in to the [Azure Portal](https://portal.Azure.com)
2. On the left side of the screen select **Browse**, then select **SQL elastic pools**.
3. Select the pool you want to Geo-Restore the database into.
4. At the top of the elastic pool blade, select **Create database**
5. Select **BACKUP** as the source  and then select the geo redundant backup you want to recover from.
6. Specify the rest of the database properties and then click **Create**.
7. The database restore process will begin and can be monitored using **NOTIFICATIONS** on the left side of the screen.

###PowerShell 
> [AZURE.NOTE] Currently using Geo-Restore with PowerShell only supports restoring into a stand alone database. To Geo-Restore into an elastic database pool please use the [Azure Portal](https://portal.Azure.com).

To restore a SQL Database using Geo-Restore with PowerShell, start a Geo-Restore request with the [start-AzureSqlDatabaseRecovery](https://msdn.microsoft.com/library/azure/dn720224.aspx) cmdlet.

		$Database = Get-AzureSqlRecoverableDatabase -ServerName "ServerName" –DatabaseName “DatabaseToBeRecovered"
		$RecoveryRequest = Start-AzureSqlDatabaseRecovery -SourceDatabase $Database –TargetDatabaseName “NewDatabaseName” –TargetServerName “TargetServerName”
		Get-AzureSqlDatabaseOperation –ServerName "TargetServerName" –OperationGuid $RecoveryRequest.RequestID

###REST API 

Use REST to programmatically perform database recovery.

1.	Get your list of recoverable databases using the [List Recoverable Databases](http://msdn.microsoft.com/library/azure/dn800984.aspx) operation.
	
2.	Get the database you want to recover using the [Get Recoverable Database](http://msdn.microsoft.com/library/azure/dn800985.aspx) operation.
	
3.	Create the recovery request using the [Create Database Recovery Request](http://msdn.microsoft.com/library/azure/dn800986.aspx) operation.
	
4.	Track the status of the recovery using the [Database Operation Status](http://msdn.microsoft.com/library/azure/dn720371.aspx) operation.
 
## Configure your database after recovery<a name="postrecovery"></a>

This is a checklist of tasks which can be used to help get your recovered database production ready.

### Update Connection Strings

Verify connection strings of your application are pointing to the newly recovered database. Update your connection strings if one of the below situations applies:

  + The recovered database uses a different name from the source database name
  + The recovered database is on a different server from the source server

For more information about changing connection strings, see [Connections to Azure SQL Database: Central Recommendations ](sql-database-connect-central-recommendations.md).
 
### Modify Firewall Rules
Verify the firewall rules at server-level and database-level, and make sure connections from your client computers or Azure to the server and the newly recovered database are enabled. For more information, see [How to: Configure Firewall Settings (Azure SQL Database)](sql-database-configure-firewall-settings.md).

### Verify Server Logins and Database Users

Verify if all the logins used by your application exist on the server which is hosting your recovered database. Re-create the missing logins and grant them appropriate permissions on the recovered database. For more information, see [Managing Databases and Logins in Azure SQL Database](sql-database-manage-logins.md).

Verify if each database users in the recovered database is associated with a valid server login. Use ALTER USER statement to map user to valid server login. For more information, see [ALTER USER](http://go.microsoft.com/fwlink/?LinkId=397486). 


### Setup Telemetry Alerts

Verify if your existing alert rule settings are map to your recovered database. Update the setting if one of below situations applies:

  + The recovered database uses a different name from the source database name
  + The recovered database is on a different server from the source server

For more information about database alert rules, see [Receive Alert Notifications](../azure-portal/insights-receive-alert-notifications.md) and [Track Service Health](../azure-portal/insights-service-health.md).


### Enable Auditing

If auditing is required to access your database, you need to enable Auditing after the database recovery. A good indicator of auditing is required is that client applications use secure connection strings in a pattern of *.database.secure.windows.net. For more information, see [Get started with SQL database auditing](sql-database-auditing-get-started.md). 
