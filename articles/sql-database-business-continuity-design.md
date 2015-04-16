<properties 
   pageTitle="SQL Database Design for Business Continuity" 
   description="Guidance for choosing In this section, guidance will be provided for how to choose which BCDR features should be used and when. This will include descriptions of what you automatically get by using SQL DB."
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

#Design for business continuity

Designing your application for business continuity requires you to answer the following questions:

1. Which business continuity feature is appropriate for protecting my application from outages?
2. What level of redundancy and replication topology do I use?

##When to use Geo-restore

SQL Database provides a built-in basic protection of every database by default. It is done by storing the database backups in the geo-redundant Azure storage (GRS). No special configuration or additional resource allocation necessary if you choose this method. It allows you to recover your database in any region using the geo-restore command. Use [Recover from an outage](sql-database-business-continuity-recovery.md) section for the details of using geo-restore to recover your application. 

You should use the built-in protection if your application meets the following criteria:

1. It is not considered mission critical. It doesn't have a binding SLA therefore the downtime of 24 hrs or longer will not result in financial liability.
2. The rate of data change is low (transactions per hour). The RPO of 1 hr will not result in a massive data loss.
3. The application is cost sensitive and cannot justify the additional cost of geo-replication 

> [AZURE.NOTE] Geo-restore does not pre-allocate the compute capacity in any particular region to restore active databases from the backup during the outage. The service will manage the workload associated with the geo-restore requests in a manner that minimizes the impact on the existing databases in that region and their capacity demands will have priority. Therefore, the recovery time of your database will depend on how many other databases will be recovering in the same region at the same time. 

##When to use Geo-replication

Geo-replication creates a replica database (secondary) in a different region from your primary. It guarantees that your database will have the necessary data and compute resources to support the application's workload after the recovery. Refer to [Recover from an outage](sql-database-business-continuity-recovery.md) section for using failover to recover your application.

You should use the geo-replication if your application meets the following criteria:

1. It is mission critical. It has a binding SLA with aggressive RPO and RTO. Loss of data and availability will result in financial liability. 
2. The rate of data change is high (transactions per minute or seconds). The RPO of 1 hr associated with the default protection will result in unacceptable data loss.
3. The cost associated with using geo-replication is significantly lower than the potential financial liability and associated loss of business.

> [AZURE.NOTE] if your application uses Basic tier database(s) geo-repliation is not supported

##When to choose standard vs. active geo-replication

Standard tier databases do not have the option of using active geo-replication so if your application uses standard databases and meets the above criteria it should enable standard geo-replication. Premium databases on the other hand can choose either option. Standard geo-replication has been designed as a simpler and less expensive DR solution, particularly suited to applications that use it only to protect from unplanned events such as outages. With standard geo-replication you can only use the DR paired region for the recovery and do have the ability to create more than one secondary. This latter feature is critical for the application upgrade scenario. So if it is critical for you application you should enable active geo-replication instead. Please refer to [Upgrade application without downtime](sql-database-business-continuity-application-upgrade.md) for additional details. 

> [AZURE.NOTE] Active geo-replication also supports read-only access to the secondary database thus providing additional capacity for the read-only workloads. 

##How to enable geo-replication

You can enable geo-replicatiom using Azure Portal or by calling REST API or PowerShell command.

###Azure Portal

1. Log in to the [Azure Portal](https://portal.Azure.com)
2. On the left side of the screen select **BROWSE** and then select **SQL Databases**
3. Navigate to your database blade, select the **Geo Replication map** and click **Configure geo-replication**.
4. Navigate to Geo-Replication blade. Select the target region. 
5. Navigate to the Create Secondary blade. Select an existing server in the target region or create a new one.
6. Select the secondary type (*Readable* or *Non-readable*)
7. Click **Create** to complete the configuration

> [AZURE.NOTE] The DR paired region on the Geo-Replication blade will be marked as *recommended*. If you use a Premium tier database you can choose a different region. If you are using a Standard database you cannot change it. The Premium database will  have a choice of the secondary type (*Readable* or *Non-readable*). Standard database can only select a *Non-readable* secondary.
 
###PowerShell

Use the [Start-AzureSqlDatabaseCopy](https://msdn.microsoft.com/library/dn720220.aspx) PowerShell cmdlet to automate geo-replication configuration.

To create geo-replication with a non-readable secondary for a Premium or Standard database:
		
		$myDbCopy = Get-AzureSqlDatabaseCopy -ServerName "SecondaryServerName" -DatabaseName "SecondaryDatabaseName" -OfflineSecondary
To create geo-replication with a readable secondary for a Premium database:

		$myDbCopy | Start-AzureSqlDatabaseCopy -ServerName "PrimaryServerName" -DatabaseName "PrimaryDatabaseName" -PartnerServer "SecondaryServerName" -ContinuousCopy
		 
This command is asynchronous. After it returns use the [Get-AzureSqlDatabaseCopy](https://msdn.microsoft.com/library/dn720235.aspx) cmdlet to check the status of this operation. The ReplicationState field of the returned object will have the value CATCH_UP when the operation is completed.

		Get-AzureSqlDatabaseCopy -ServerName "PrimaryServerName" -DatabaseName "PrimaryDatabaseName" -PartnerServer "SecondaryServerName"


###REST API 

Use [Start Database Copy](https://msdn.microsoft.com/library/azure/dn509576.aspx) API to programmatically create a geo-replication configuration.

This API is asynchronous. After it returns use the [Get Database Copy](https://msdn.microsoft.com/library/azure/dn509570.aspx) API check the status of this operation. The ReplicationState field of the response body will have the value CATCH_UP when the operation is completed.


##How to choose the failover configuration 

When designing your application for business continuity you should consider several configuration options. The choice will depend on the application deployment topology and what parts of your applications are most vulnerable to an outage. Please refer to [Designing Cloud Solutions for Disaster Recovery Using Active Geo-Replication](https://msdn.microsoft.com/library/azure/dn741328.aspx) for guidance which options bets fit your application pattern. 


