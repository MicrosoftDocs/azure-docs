<properties 
	pageTitle="Tame explosive growth with elastic databases" 
	description="An Azure SQL Database elastic database pool is a collection of available resources that are shared by a group of elastic databases." 
	services="sql-database" 
	documentationCenter="" 
	authors="stevestein" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="08/14/2015" 
	ms.author="sstein" 
	ms.workload="data-management" 
	ms.topic="article" 
	ms.tgt_pltfrm="NA"/>


# Tame explosive growth with elastic databases

If you’re a SaaS developer with tens, hundreds, or even thousands of databases, an elastic database pool simplifies the process of creating, maintaining, and managing performance across these databases within a budget that you control. 

A common SaaS application pattern is for each database to have a different customer, each with varying and unpredictable resource consumption (CPU/IO/Memory summarized with DTU). With these peaks and valleys of demand for each database, it can be difficult to predict and therefore provision resources. You're faced with two options; either over-provision database resources based on peak usage--and overpay. Or under-provision to save cost--at the expense of performance and customer satisfaction during peaks. 

Microsoft created elastic database pools specifically to help you solve this problem.

> [AZURE.VIDEO elastic-databases-helps-saas-developers-tame-explosive-growth]


Elastic database pools provide a solution for customers who need to ensure that their databases get the performance resources they need, when they need it, while also providing a simple resource allocation mechanism and a predictable budget. The on-demand performance scaling of individual databases within an elastic database pool is possible because each database within a pool uses eDTUs from a shared set associated with the pool. This allows databases under heavy load to consume more to meet demand, while databases under light load consume less, and databases under no load don’t consume any eDTUs. By provisioning resources for the pool rather than for single databases you not only simplify the management of multiple databases, you also have a predictable budget for an otherwise unpredictable workload. 

If more eDTUs are needed to accommodate the needs of a pool (additional databases are added to a pool or the existing databases start using more eDTUs), additional eDTUs can be added to an existing pool with no database downtime or negative impact on the databases. Similarly, if extra eDTUs are no longer needed they can be removed from an existing pool at any point in time.  

![databases sharing eDTUs][1]

Databases that are great candidates for elastic database pools typically have periods of activity and other periods of inactivity. Consider the example above where you can see the activity of a single database, 4 databases and finally an elastic database pool with 20 databases. These databases with varying activity over time are great candidates for elastic database pools because they are not all active at the same time and can share eDTUs. Not all databases fit this pattern. There are databases that have a more constant resource demand and these databases are better suited to the Basic, Standard, and Premium service tiers where resources are individually assigned. For assistance in determining if your databases would benefit in an elastic database pool, see [Price and performance considerations for an elastic database pool](sql-database-elastic-pool-guidance.md).

You can create an elastic database pool in minutes using the Microsoft Azure portal, PowerShell, or C#. For details, see [Create and manage an elastic database pool](sql-database-elastic-pool-portal.md). For detailed information about elastic database pools, including API and error details, see [Elastic database pool reference](sql-database-elastic-pool-reference.md).


> [AZURE.NOTE] Elastic database pools are currently in preview and only available with SQL Database V12 servers.

## Easily manage large numbers of databases with elastic database tools

In addition to providing more efficient resource utilization and predictable performance, elastic database pools make SaaS application development easier with tools that simplify building and managing your data-tier. Performing maintenance tasks and implementing changes across a large set of databases, a historically time-consuming and complex process, has been reduced to running scripts in elastic jobs. The ability to create and run an elastic database job eliminates most all of the heavy lifting associated with administering hundreds or even thousands of databases. For information about the elastic database jobs service that enables running Transact-SQL scripts across all elastic databases in a pool, see [Elastic database jobs overview](sql-database-elastic-jobs-overview.md).

A rich and powerful set of developer tools for implementing elastic database application patterns is also available. For sharded databases, other tools such as the split-merge tool gives you the ability to split data from one shard and merge it into another. This greatly reduces the work of managing large-scale sharded databases. For more information, see the [Elastic database tools topics map](sql-database-elastic-scale-documentation-map.md).

## Business continuity features for databases in a pool

Currently in the preview, elastic databases support most [business continuity features](https://msdn.microsoft.com/library/azure/hh852669.aspx) that are available to single databases on V12 servers.

### Backing up and restoring databases ([Point in Time Restore](https://msdn.microsoft.com/library/azure/hh852669.aspx#BKMK_PITR))

Databases in an elastic database pool are backed up automatically by the system and the backup retention policy is the same as the corresponding service tier for single databases. More specifically, an elastic database in a Basic pool can be restored to any restore point within the last 7 days, an elastic database in a Standard pool can be restored to any restore point within the last 14 days, and an elastic database in a Premium pool can be restored to any restore point within the last 35 days. During preview, databases in a pool will be restored to a new database in the same pool. Dropped databases will always be restored as a standalone database outside the pool into the lowest performance level for that service tier. For example, an elastic database in a Standard pool that is dropped will be restored as an S0 database. You can perform database restore operations through the Azure Portal or programmatically using REST API. PowerShell cmdlet support is coming soon.

### [Geo-Restore](https://msdn.microsoft.com/library/azure/hh852669.aspx#BKMK_GEO)

Geo-Restore allows you to recover a database in a pool to a server in a different region. During the preview, to restore a database in a pool on a different server, the target server needs to have a pool with the same name as the source pool. If needed, create a new pool on the target server and give it the same name prior to restoring the database. If a pool with the same name on the target server doesn’t exist the Geo-Restore operation will fail.
You can perform Geo-Restore operations using the Azure Portal or REST API. PowerShell cmdlet support is coming soon.


### [Geo-Replication](https://msdn.microsoft.com/library/azure/dn783447.aspx)

Databases that already have Geo-Replication enabled can be moved in and out of an elastic database pool and replication will continue to work as always. You can enable Geo-Replication on a database that is already in a pool if the target server you specify has a pool with the same name as the source pool. 

### Import and Export

Export of a database from within a pool is supported. Currently, import of a database directly into a pool is not supported, but you can import into a single database and then move the database into a pool. 


<!--Image references-->
[1]: ./media/sql-database-elastic-pool/databases.png
