<properties 
	pageTitle="Create and manage a SQL Database elastic database pool (preview)" 
	description="Create a single pool of resources to share across a group of Azure SQL Databases." 
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


# Create and manage a SQL Database elastic pool (preview)

> [AZURE.SELECTOR]
- [Azure portal](sql-database-elastic-pool-portal.md)
- [PowerShell](sql-database-elastic-pool-powershell.md)

This article shows you how to create an elastic pool with the [Azure portal](https://portal.azure.com).

Elastic pools simplify the process of creating, maintaining, and managing both performance and cost for large numbers of databases.
 

> [AZURE.NOTE] Elastic pools are currently in preview, and only available with SQL Database V12  Servers.

 


## Prerequisites

To create an elastic pool you need an the following:

- An Azure subscription! If you need an Azure subscription simply click FREE TRIAL at the top of this page, and then come back to finish this article.
- An Azure SQL Database version 12 server. If you do not have a V12 server, create one following the steps: [Create your first Azure SQL Database](sql-database-get-started.md).



## Create an elastic pool

Create an elastic pool by adding a new pool to a server. You can add multiple pools to a server, but only 1 server can be associated with each pool. Additionally, all or some of the databases on a server can be added to a pool.


1.	Select a SQL Database V12 server that contains the databases you want to add to the pool.
2.	Create the pool by selecting **add pool** at the top of the **SQL Server** blade.

   ![Create Elastic Pool][1]

## Configure an elastic pool

Configure the pool by setting the pricing tier, adding databases, and configuring the performance characteristics of the pool.

*When you select the **Add pool** command you must accept the terms of the preview by selecting **PREVIEW TERMS** and completing the **Preview Terms** blade. You only need to accept the terms once for each subscription.*

   ![Configure elastic pool][2]


### Pricing tier

An elastic pool's pricing tier is somewhat analogous to a SQL database's service tier. The pricing tier determines the features available to the elastic databases in the pool, and the maximum number of DTUs (DTU MAX), and storage (GBs) available to each database. 

> [AZURE.NOTE] The preview is currently limited to the **Standard** pricing tier. 

| Pricing Tier | DTU MAX per Database |
| :--- | :--- |
| Standard | 100 MAX DTUs per database |

### Add databases

At any time, you can select the specific databases you want to be included in the pool.  When you create a new pool, Azure recommends the databases that will benefit from being in a pool and marks them for inclusion. You can add all the databases available on the server or you can select or clear databases from the initial list as desired.

   ![Add databases][5]

When you select a database to be added to a pool, the following conditions must be met:

- The pool must have room for the database (cannot already contain the maximum number of databases). More specifically, the pool must have enough available DTUs to cover the DTU guarantee per database (for example, if the DTU guarantee for the group is 400, and the DTU guarantee for each database is 10, then the maximum number of databases that are allowed in the pool is 40 (400 DTUs/10 DTUs guaranteed per DB = 40 Max databases).
- The current features used by the database must be available in the pool. 


### Configure performance

You configure the performance of the pool by setting the performance parameters for both the pool, and the elastic databases in the pool. Keep in mind, that the **Elastic database settings** apply to all databases in the pool.

   ![Configure Elastic Pool][3]

There are three parameters you can set that define the performance for the pool; the DTU Guarantee for the pool, and the DTU MIN and DTU MAX for elastic databases in the pool. The following table describes each, and provides some guidance for how to set them.

| Performance Parameter | Description |
| :--- | :--- |
| **POOL DTU/GB** - DTU guarantee for the pool | The DTU guarantee for the pool is the guaranteed number of DTUs available and shared by all databases in the pool. <br> Currently, you can set this to 200, 400, 800, or 1200. <br> The specific size of the DTU guarantee for a group should be provisioned by considering the historical DTU utilization of the group.  Alternatively, this size can be set by the desired DTU guarantee per database and utilization of concurrently active databases. The DTU guarantee for the pool also correlates to the amount of storage available for the pool, for every DTU that you allocate to the pool, you get 1 GB of database storage (1 DTU = 1 GB of storage). <br> **What should I set the DTU guarantee of the pool to?** <br>At minimum, you should set the DTU guarantee of the pool to ([# of databases] x [average DTU utilization per database]) |
| **DTU MIN** - DTU guarantee for each database | The DTU guarantee per database is the number of DTUs that a single database in the pool is guaranteed. Currently, you can set this guarantee to 0, 10, 20, or 50 DTUs, or you can choose not to provide a guarantee to databases in the group (DTU MIN=0). <br> **What should I set the DTU guarantee per database?** <br> At minimum, you should set the DTU guarantee per database (DTU MIN) to the ([average utilization per database]). The DTU guarantee per database is a global setting that sets the DTU guarantee for all databases in the pool. |
| **DTU MAX** - DTU cap per database | The DTU MAX per database is the maximum number of DTUs that a single database in the Pool may use. Set the DTU cap per database high enough to handle  max bursts or spikes that your databases may experience. You can set this cap up to the system limit, which depends on the pricing tier of the pool (100 DTUs for Standard).  The specific size of this cap should accommodate peak utilization patterns of databases within the group.  Some degree of overcommitting the group is expected since the pool generally assumes hot and cold usage patterns for databases where all databases are not simultaneously peaking.<br> **What should I set the DTU cap per database to?** <br> Set the DTU MAX or DTU cap per database, to ([database peak utilization]). For example, suppose the peak utilization per database is 50 DTUs and only 20% of the 100 databases in the group simultaneously spike to the peak.  If the DTU cap per database is set to 50 DTUs, then it is reasonable to overcommit the group by 5x and set the DTU guarantee for the group to 1,000 DTUs. Also worth noting, is that the DTU cap is not a resource guarantee for a database, it is a DTU ceiling that can be hit if available. |


## Adding databases into an elastic pool

After the pool is created, you can add or remove databases in and out of the pool


## Monitor and manage an elastic pool

After creating an elastic pool, you can monitor and manage the pool in the portal by browsing to the list of existing pools and selecting the desired pool.

After creating a pool, you can:

- Select **Configure pool** to change the pool DTU and DTU per database settings.
- Select **Create job** and manage the databases in the pool by creating elastic jobs. Elastic jobs facilitate running T-SQL scripts against any number of databases in the pool. For more information, see [Elastic database jobs overview](sql-database-elastic-jobs-overview.md).
- Select **Manage jobs** to administer existing elastic jobs.



![Monitor elastic pool][8]




![Monitor elastic pool][4]

When you select an existing pool you can see resource utilization of the pool.
Click the **Resource Utilization** chart to open the **Metric** blade where you can customize the chart and setup alerts.


![resource utilization][6]

Click **Edit chart** to add parameters so you can easily view telemetry data for the pool.


![edit chart][7]







## Next steps
After creating an elastic pool, you can manage the databases in the pool by creating elastic jobs. Elastic jobs facilitate running T-SQL scripts against any number of databases in the pool.

For more information, see [Elastic database jobs overview](sql-database-elastic-jobs-overview.md).



## Related

- [SQL Database elastic pool](sql-database-elastic-pool.md)
- [Create a SQL Database elastic pool with PowerShell](sql-database-elastic-pool-powershell.md)
- [Elastic database reference](sql-database-elastic-pool-reference.md)


<!--Image references-->
[1]: ./media/sql-database-elastic-pool-portal/new-elastic-pool.png
[2]: ./media/sql-database-elastic-pool-portal/configure-elastic-pool.png
[3]: ./media/sql-database-elastic-pool-portal/configure-performance.png
[4]: ./media/sql-database-elastic-pool-portal/monitor-elastic-pool.png
[5]: ./media/sql-database-elastic-pool-portal/add-databases.png
[6]: ./media/sql-database-elastic-pool-portal/metric.png
[7]: ./media/sql-database-elastic-pool-portal/edit-chart.png
[8]: ./media/sql-database-elastic-pool-portal/configure-pool.png
