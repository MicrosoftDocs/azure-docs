<properties 
    pageTitle="Create or move an Azure SQL database into an elastic pool using T-SQL | Microsoft Azure" 
    description="Use T-SQL to create an Azure SQL database in an elastic pool. Or use T-SQL to move the datbase in and out of pools." 
	services="sql-database" 
    documentationCenter="" 
    authors="srinia" 
    manager="jhubbard" 
    editor=""/>

<tags
    ms.service="sql-database"
    ms.devlang="NA"
    ms.topic="article"
    ms.tgt_pltfrm="NA"
    ms.workload="data-management" 
    ms.date="05/27/2016"
    ms.author="srinia"/>

# Monitor and manage an elastic database pool with Transact-SQL  

> [AZURE.SELECTOR]
- [Azure portal](sql-database-elastic-pool-manage-portal.md)
- [PowerShell](sql-database-elastic-pool-manage-powershell.md)
- [C#](sql-database-elastic-pool-manage-csharp.md)
- [T-SQL](sql-database-elastic-pool-manage-tsql.md)

Use the [Create Database (Azure SQL Database)](https://msdn.microsoft.com/library/dn268335.aspx) and [Alter Database(Azure SQL Database)](https://msdn.microsoft.com/library/mt574871.aspx) commands to create and move databases into and out of elastic pools. The elastic pool must exist before you can use these commands. These commands affect only databases. Creation of new pools and the setting of pool properties (such as min and max eDTUs) cannot be changed with T-SQL commands.


> [AZURE.NOTE] Elastic database pools are currently in preview and only available with SQL Database V12 servers. If you have a SQL Database V11 server you can [use PowerShell to upgrade to V12 and create a pool](sql-database-upgrade-server-portal.md) in one step.


## Create a new database in an elastic pool
Use the CREATE DATABASE command with the SERVICE_OBJECTIVE option.   

	CREATE DATABASE db1 ( SERVICE_OBJECTIVE = ELASTIC_POOL (name = [S3M100] ));
	-- Create a database named db1 in a pool named S3M100.

All databases in an elastic pool inherit the service tier of the elastic pool (Basic, Standard, Premium). 


## Move a database between elastic pools
Use the ALTER DATABASE command with the MODIFY and set SERVICE\_OBJECTIVE option as ELASTIC\_POOL; set the name to the name of the target pool.

	ALTER DATABASE db1 MODIFY ( SERVICE_OBJECTIVE = ELASTIC_POOL (name = [PM125] ));
	-- Move the database named db1 to a pool named P1M125  

## Move a database into an elastic pool 
Use the ALTER DATABASE command with the MODIFY and set SERVICE\_OBJECTIVE option as ELASTIC_POOL; set the name to the name of the target pool.

	ALTER DATABASE db1 MODIFY ( SERVICE_OBJECTIVE = ELASTIC_POOL (name = [S3100] ));
	-- Move the database named db1 to a pool named S3100.

## Move a database out of an elastic pool
Use the ALTER DATABASE command and set the SERVICE_OBJECTIVE to one of the performance levels (S0, S1, etc).

	ALTER DATABASE db1 MODIFY ( SERVICE_OBJECTIVE = 'S1');
	-- Changes the database into a stand-alone database with the service objective S1.

## List databases in an elastic pool
Use the [sys.database\_service \_objectives view](https://msdn.microsoft.com/library/mt712619) to list all the databases in an elastic pool. Log in to the master database to query the view.

	SELECT d.name, slo.*  
	FROM sys.databases d 
	JOIN sys.database_service_objectives slo  
	ON d.database_id = slo.database_id
	WHERE elastic_pool_name = 'MyElasticPool'; 

## Get resource usage data for a pool

Use the [sys.elastic\_pool \_resource \_stats view](https://msdn.microsoft.com/library/mt280062.aspx) to examine the resource usage statistics of an elastic pool on a logical server. Log in to the master database to query the view.

	SELECT * FROM sys.elastic_pool_resource_stats 
	WHERE elastic_pool_name = 'MyElasticPool'
	ORDER BY end_time DESC;

## Get resource usage for an elastic database

Use the [sys.dm\_ db\_ resource\_stats view](https://msdn.microsoft.com/library/dn800981.aspx) or [sys.resource \_stats view](https://msdn.microsoft.com/library/dn269979.aspx) to examine the resource usage statistics of a database in an elastic pool. This process is similar to querying resource usage for any single database.

## Next steps

After creating an elastic database pool, you can manage elastic databases in the pool by creating elastic jobs. Elastic jobs facilitate running T-SQL scripts against any number of databases in the pool. For more information, see [Elastic database jobs overview](sql-database-elastic-jobs-overview.md). 

See [Scaling out with Azure SQL Database](sql-database-elastic-scale-introduction.md): use elastic database tools to scale-out, move data, query, or create transactions.