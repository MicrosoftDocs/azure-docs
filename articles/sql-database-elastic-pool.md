<properties 
	pageTitle="Azure SQL Database elastic database pool (preview)" 
	description="An elastic database pool is a collection of available resources that are shared by a group of elastic databases." 
	services="sql-database" 
	documentationCenter="" 
	authors="stevestein" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="04/29/2015" 
	ms.author="sstein" 
	ms.workload="data-management" 
	ms.topic="article" 
	ms.tgt_pltfrm="NA"/>


# SQL Database elastic pools (preview)

If you’re a SaaS developer with tens, hundreds, or even thousands of databases, an elastic pool simplifies the process of creating, maintaining, and managing performance across these databases within a budget that you control. A common SaaS application pattern is for each database to have a different customer, each with varying and unpredictable usage patterns. With peaks and valleys of demand that can be difficult to predict, you’re faced with two options; either over-provision database resources based on peak usage--and overpay. Or under-provision to save cost--at the expense of performance and customer satisfaction during peaks. Microsoft created elastic pools specifically to help you solve this problem.

An elastic pool is a collection of available resources shared by the databases in the pool, called elastic databases. You can add databases to the pool or remove them at any time. Elastic databases share the compute power (expressed as database throughput units, or DTUs) and storage resources of the pool, but each elastic database uses only the resources it needs when it needs them, leaving resources free for other elastic databases when they need them. Instead of over-provisioning individual databases and paying for resources that sit idle, you allocate and pay a predictable price for resources of the elastic pool in aggregate. This spreads the cost so you can achieve a competitive business model, and each elastic database gains performance adaptability.

You can create an elastic pool in minutes using the Microsoft Azure portal or PowerShell. For details, see [Create and manage an elastic pool](sql-database-elastic-pool-portal.md). For detailed information about elastic database pools, including API and error details, see the [Elastic database reference](sql-database-elastic-pool-reference.md).


> [AZURE.NOTE] Elastic pools are currently in preview, and only available with SQL Database V12 Servers.

## Easily manage large numbers of databases with elastic tools

In addition to providing more efficient resource utilization and predictable performance, elastic pools make SaaS application development easier with tools that simplify building and managing your data-tier. Performing maintenance tasks and implementing changes across a large set of databases, a historically time-consuming and complex process, has been reduced to running scripts in elastic jobs. The ability to create and run an elastic job eliminates most all of the heavy lifting associated with administering hundreds or even thousands of databases. For information about the elastic jobs service that enables running T-SQL scripts across all elastic databases in a pool, see [Elastic database jobs overview](sql-database-elastic-jobs-overview.md).

A rich and powerful set of developer tools for implementing elastic database application patterns is also available. For sharded databases, other tools such as the split-merge tool gives you the ability to split data from one shard and merge it into another. This greatly reduces the work of managing large-scale sharded databases. For more information, see the [Elastic database tools topics map](sql-database-elastic-scale-documentation-map.md).

## Business continuity features for elastic databases

Currently in the preview, elastic databases (in the elastic standard tier) support most features that are available to Standard tier databases.

### Backing up and restoring databases (Point in Time Restore)

Elastic databases are backed up automatically by the system and the backup retention policy is the same as Standard tier databases. During preview, elastic databases in a pool will be restored as new elastic databases in the same pool; dropped elastic databases will always be restored as a standalone database outside the pool as a Standard S0 database.  
You can perform database restore operations through the Azure Portal or programmatically using REST API. PowerShell cmdlet support is coming soon.

### Geo-Restore

Geo-Restore allows you to recover a database in a pool to a server in a different region. During the preview, to restore a database in a pool on a different server, the target server needs to have a pool with the same name as the source pool. If needed, create a new pool on the target server and give it the same name prior to restoring the database. If a pool with the same name on the target server doesn’t exist the Geo-Restore operation will fail.
You can perform Geo-Restore operations using the Azure Portal or REST API. PowerShell cmdlet support is coming soon.


### Geo-Replication

Databases that already have Geo-Replication enabled can be moved in and out of an elastic pool and replication will continue to work as always. Currently in the preview, you cannot enable Geo-Replication on an elastic database that is already in a pool.



