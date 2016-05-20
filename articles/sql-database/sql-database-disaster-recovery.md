<properties 
   pageTitle="SQL Database disaster recovery" 
   description="Learn how to recover a database from a regional datacenter outage or failure with the Azure SQL Database Active Geo-Replication, and Geo-Restore capabilities." 
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
   ms.date="05/10/2016"
   ms.author="elfish"/>

# Restore an Azure SQL Database or failover to a secondary

Azure SQL Database offers the following capabilities for recovering from an outage:

- [Active Geo-Replication](sql-database-geo-replication-overview.md)
- [Geo-Restore](sql-database-geo-restore.md)

To learn about preparing for disaster and when to recover your database, visit our [Design for business continuity](sql-database-business-continuity-design.md) page. 

## When to initiate recovery

The recovery operation impacts the application. It requires changing the SQL connection string and could result in permanent data loss. Therefore, it should be done only when the outage is likely to last longer than your application's RTO. When the application is deployed to production you should perform regular monitoring of the application health and use the following data points to assert that the recovery is warranted:

1.	Permanent connectivity failure from the application tier to the database.
2.	The Azure Portal shows an alert about an incident in the region with broad impact.
3.	The Azure SQL Database Server is marked as degraded. 

Depending on your application tolerance to downtime and possible business liability you can consider the following recovery options.

## Wait for service recovery

The Azure teams work diligently to restore service availability as quickly as possible but depending on the root cause it can take hours or days.  If your application can tolerate significant downtime you can simply wait for the recovery to complete. In this case, no action on your part is required.  You can see the current service status on our [Azure Service Health Dashboard](https://azure.microsoft.com/status/). After the recovery of the region your application’s availability will be restored.

## Failover to geo-replicated secondary database

If your application’s downtime can result in business liability you should be using geo-replicated database(s) in your application. It will enable the application to quickly restore availability in a different region in case of an outage. Learn how to [configure Geo-Replication](sql-database-geo-replication-portal.md).

To restore availability of the database(s) you need to initiate the failover to the geo-replicated secondary using one of the supported methods. 


Use one of the following guides to failover to a geo-replicated secondary database:

- [Failover to a geo-replicated secondary using Azure Portal](sql-database-geo-replication-portal.md)
- [Failover to a geo-replicated secondary using PowerShell](sql-database-geo-replication-powershell.md)
- [Failover to a geo-replicated secondary using T-SQL](sql-database-geo-replication-transact-sql.md) 



## Recover using Geo-Restore

If your application’s downtime does not result in business liability you can use Geo-Restore as a method to recover your application database(s). It creates a copy of the database from its latest geo-redundant backup. 

Use one of the following guides to geo-restore a database into a new region:

- [Geo-Restore a database to a new region using Azure Portal](sql-database-geo-restore-portal.md)
- [Geo-Restore a database to a new region using PowerShell](sql-database-geo-restore-powershell.md) 


## Configure your database after recovery

If you are using geo-replication failover of geo-restore options to recover your application from an outage you must make sure that the connectivity to the new databases is properly configured so that the normal application function can be resumed. This is a checklist of tasks to get your recovered database production ready.

### Update Connection Strings

Because your recovered database will reside in a different server you need to update your application’s connection string to point to that server.

For more information about changing connection strings, see [Connections to Azure SQL Database: Central Recommendations](sql-database-connect-central-recommendations.md).

### Configure Firewall Rules

You need to make sure that  the firewall rules configured on server and on the database match those that were configured on the primary server and primary database. For more information, see [How to: Configure Firewall Settings (Azure SQL Database)](sql-database-configure-firewall-settings.md).


### Configure Logins and Database Users

You need to make sure that all the logins used by your application exist on the server which is hosting your recovered database. For more information, see  How to manage security during disaster recovery. For more information, see [Security Configuration for Geo-Replication](sql-database-geo-replication-security-config.md)

>[AZURE.NOTE] If you are using the geo-restore option to recover from outage you should configure your server firewall rules and logins during the DR drill to make sure the primary server is still available to retrieve its configuration. Because geo-restore uses the database backups the server level configuration may not be available during the outage. After the drill you can remove the restored databases but keep the server and its configuration ready for the recovery process. For more information about DR drills, see [Performing Disaster Recovery Drills](sql-database-disaster-recovery-drills.md).

### Setup Telemetry Alerts

You need to make sure your existing alert rule settings are updated to map to the recovered database and the different server. 

For more information about database alert rules, see [Receive Alert Notifications](../azure-portal/insights-receive-alert-notifications.md) and [Track Service Health](../azure-portal/insights-service-health.md).

### Enable Auditing

If auditing is required to access your database, you need to enable Auditing after the database recovery. A good indicator that auditing is required is that client applications use secure connection strings in a pattern of *.database.secure.windows.net. For more information, see [Get started with SQL database auditing](sql-database-auditing-get-started.md). 




## Additional Resources


- [SQL Database business continuity and disaster recovery](sql-database-business-continuity.md)
- [Point-in-Time Restore](sql-database-point-in-time-restore.md)
- [Geo-Restore](sql-database-geo-restore.md)
- [Active-Geo-Replication](sql-database-geo-replication-overview.md)
- [Designing applications for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
- [Finalize your recovered Azure SQL Database](sql-database-recovered-finalize.md)
- [Security Configuration for Geo-Replication](sql-database-geo-replication-security-config.md)
- [SQL Database BCDR FAQ](sql-database-bcdr-faq.md)
