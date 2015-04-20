<properties 
	pageTitle="Azure SQL Database Elastic Pool" 
	description="Create a single pool of resources to share across a group of Azure SQL Databases." 
	services="sql-database" 
	documentationCenter="" 
	authors="stevestein" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="04/01/2015" 
	ms.author="sstein" 
	ms.workload="data-management" 
	ms.topic="article" 
	ms.tgt_pltfrm="NA"/>


# Azure SQL Database - Elastic Database Pool

Elastic pools provide performance adaptability for a group of databases, while also providing the ability to control price within a set budget.

## Overview

An *elastic database pool* is a single pool of available resources that are shared by a group of databases. The shared resources consist of database throughput units (DTUs), and storage. The pool shares these resources and accommodates unpredictable periods of increased activity for databases in the pool while at the same time, provides a minimum amount of resources for all databases to reliably accommodate the average use for each database.


> [AZURE.NOTE] Elastic Pools are in preview and only available for databases in V12 SQL Database Servers. For this preview, Elastic Pools can only be set to the Elastic Standard pricing tier, and you can only configure and manage Elastic Pools using the Azure Preview Portal, REST APIs, and PowerShell.


For customers who have a large number of databases, where each database’s usage is varied and unpredictable, Elastic Pools provide a simple cost effective solution to maintain a reliable level of performance goals.

For example, when hosting large numbers of databases, it is common to only have a subset of databases concurrently active at any given time. The actual databases that are simultaneously active change unpredictably throughout each month. By sharing resources in an Elastic Pool, the databases with increased activity are accommodated while maintaining a guaranteed level of resources for all other databases in the pool. 

The resources that are guaranteed to the pool are set by the user and shared by all databases in the pool. The performance of all databases in the pool is guaranteed by setting a DTU guarantee (or DTU MIN) per database. This prevents individual databases from consuming all resources in the pool. 

The pool also sets the service tier (pricing tier?) of all databases in the pool. So if a pool is set to Elastic Standard, then all databases in the pool have all features available to the Standard tier, for example, Point in Time Restore (any restore point within the last 14 days) and Geo-Restore.

## Create an elastic pool

Create an Elastic Pool by adding a new Elastic Pool to a SQL Database Server. You can add multiple Elastic Pools to a server, but only 1 server can be associated with each elastic pool. Additionally, all or some of the databases on a server can be in an elastic pool.


1.	Select a SQL Database Server that contains the databases you want to add to the elastic pool.
2.	Create an Elastic Pool by selecting **add new elastic pool** at the top of the **SQL Server** blade.

   ![Create Elastic Pool][1]

## Configure an Elastic Pool

Configure an Elastic Pool by setting the pricing tier, adding databases, and setting the performance characteristics of the pool.

   ![Configure Elastic Pool][2]


### Pricing tier

An Elastic Pool's pricing tier is somewhat analogous to a SQL Database's service tier. The pricing tier determines the features available to each database in the pool, and the maximum number of DTUs (DTU MAX) available to each database. 

> [AZURE.NOTE] The Elastic Pool preview is limited to the **Elastic Standard** pricing tier. Geo-replication is not supported in the current preview.

| Pricing Tier | DTU MAX per Database | Supported Features |
| :--- | :--- | :--- |
| Elastic Standard | 100 MAX DTUs per database | Point in time restore (any point last 14 days) <br> Geo-Restore |

### Add databases

At any time, you can select the specific databases you want to be included in the pool.  When you create a new elastic pool, Azure recommends the databases that will benefit from being in a pool and marks them for inclusion. You can add all the databases available on the server or you can select or clear databases from the initial list as desired.

When you select a database to be added to a pool, the following conditions must be met:

- The pool must have room for the database (cannot already contain the maximum number of databases). More specifically, the pool must have enough available DTUs to cover the DTU guarantee per database (for example, if the DTU guarantee for the group is 200, and the DTU guarantee for each database is 20, then the maximum number of databases that are allowed in the pool is 10 (10 DBs x 20 DTUs guaranteed per DB = 200 DTUs).
- The current features used by the database must be available in the pool. In other words, if a database is currently set up with Standard Geo-Replication, then the pool must be a pricing tier that offers Standard Geo-Replication.

The Max Databases and Pool Storage values are dynamic values that change depending on the pool's specific performance configuration.  


### Configure performance

You configure the performance of an **Elastic Pool** by setting the performance parameters for both the pool, and the databases that are in the pool. Keep in mind, that the **per database** settings apply globally to all databases in the pool.

   ![Configure Elastic Pool][3]

There are three parameters you can set that define the performance for the pool; the DTU Guarantee for the pool, and the DTU MIN and DTU MAX for the databases in the pool. The following table describes each, and provides some guidance for how to set them.

| Performance Parameter | Description |
| :--- | :--- |
| **POOL DTU/GB** - DTU guarantee for the pool | The DTU guarantee for the pool is the guaranteed number of DTUs available and shared by all databases in the pool. <br> You can set this to 100, 200, 400, 800, or 1200. <br> The specific size of the DTU guarantee for a group should be provisioned by considering the historical DTU utilization of the group.  Alternatively, this size can be set by the desired DTU guarantee per database and utilization of concurrently active databases. The DTU guarantee for the pool also correlates to the amount of storage available for the pool, for every DTU that you allocate to the pool, you get 1 GB of database storage (1 DTU = 1 GB of storage). <br> **What should I set the DTU guarantee of the pool to?** <br>At minimum, you should set the DTU guarantee of the pool to ([# of databases] x [average DTU utilization per database]) |
| **DTU MIN** - DTU guarantee for each database | The DTU guarantee per database is the number of DTUs that a single database in the pool is guaranteed. You can set this guarantee up to the DTU limit for the pricing tier that the pool is set to (100 DTUs for Elastic Standard), or you can choose not to provide a guarantee to databases in the group (DTU MIN=0). <br> **What should I set the DTU guarantee per database?** <br> At minimum, you should set the DTU guarantee per database (DTU MIN) to the ([average utilization per database]). The DTU guarantee per database is a global setting that sets the DTU guarantee for all databases in the pool. |
| **DTU MAX** - DTU cap per database | The DTU MAX per database is the maximum number of DTUs that a single database in the Pool may use. Set the DTU cap per database high enough to handle  max bursts or spikes that your databases may experience. You can set this cap up to the system limit, which depends on the pricing tier of the pool (100 DTUs for Elastic Standard), and in all cases is no greater than the capacity of a single machine.  Choice in the specific size of this cap is informed by peak utilization patterns of databases within the group and the tolerance for overcommitting the DTU guarantee of the group.  Some degree of overcommitting the group is expected since Elastic Pool generally assumes hot and cold usage patterns for databases where all databases are not simultaneously peaking.<br> **What should I set the DTU cap per database to?** <br> Set the DTU MAX or DTU cap per database, to ([database peak utilization]). For example, suppose the peak utilization per database is 50 DTUs and only 20% of the 100 databases in the group simultaneously spike to the peak.  If the DTU cap per database is set to 50 DTUs, then it is reasonable to overcommit the group by 5x and set the DTU guarantee for the group to 1,000 DTUs. Also worth noting, is that the DTU cap is not a resource guarantee for a database, it is a DTU ceiling that can be hit if available. |


## Adding databases into an elastic pool

You can create new databases, add or copy existing databases, and restore deleted databases into Elastic Pools.


## Monitor an elastic pool

After creating an Elastic Pool, you can monitor and manage the pool by adjusting the available performance parameters.

![Monitor Elastic Pool][4]


## Business continuity features for pooled databases
Elastic Standard supports all business continuity features that are available to Standard tier databases except for geo-replication.

### Backing up and restoring databases (point in time restore)
Databases in Elastic Pools are backed up and retained under the same point in time restore policy as Standard tier databases. You can restore any database in an Elastic Standard pool from any point in time over the last 14 days.

### Geo-restore
Geo-restore considerations?

## Limitations related to the preview
- DTU guarantee for a pool is limited to the following values: 100, 200, 400, 800, 1200, and 1400.
- The maximum DTUs per database is limited to 100 DTUs.
- The maximum number of databases per pool is limited to 100.
- You can only reconfigure the size of a pool once per day.


## Summary
Elastic pool provides a single pool of available resources to share across a group of databases. Sharing a single resource pool for a group of databases with widely varying usage patterns provides large scale SaaS cloud service vendors a simple cost effective solution to achieve performance goals.   
   


## Next steps
- [Create Jobs against all databases in a pool]()

## Related
- [Manage Elastic Pools with REST API]()
- [Manage Elastic Pools with PowerShell]()
- [Create Databases in Elastic Pools with T-SQL]()


<!--Image references-->
[1]: ./media/sql-database-elastic-pool/new-elastic-pool.png
[2]: ./media/sql-database-elastic-pool/configure-elastic-pool.png
[3]: ./media/sql-database-elastic-pool/configure-performance-blade.png
[4]: ./media/sql-database-elastic-pool/monitor-elastic-pool.png


