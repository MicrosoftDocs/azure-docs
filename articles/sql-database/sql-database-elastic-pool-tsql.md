<properties 
    pageTitle="Create or move an Azure SQL database into an elastic pool using T-SQL | Microsoft Azure" 
    description="Use T-SQL to create an Azure SQL database in an elastic pool. Or use T-SQL to move the datbase in and out of pools." 
	keywords="multiple databases,elastic, scale-out"    
	services="sql-database" 
    documentationCenter="" 
    authors="sidneyh" 
    manager="jhubbard" 
    editor=""/>

<tags
    ms.service="sql-database"
    ms.devlang="NA"
    ms.topic="get-started-article"
    ms.tgt_pltfrm="powershell"
    ms.workload="data-management" 
    ms.date="03/30/2016"
    ms.author="sidneyh"/>

# Create or move an Azure SQL database into an elastic pool using T-SQL  

> [AZURE.SELECTOR]
- [Azure portal](sql-database-elastic-pool-create-portal.md)
- [C#](sql-database-elastic-pool-csharp.md)
- [PowerShell](sql-database-elastic-pool-powershell.md)

Use the [Create Database (Azure SQL Database)](https://msdn.microsoft.com/library/dn268335.aspx) and [Alter Database(Azure SQL Database)](https://msdn.microsoft.com/library/mt574871.aspx) commands to create and move databases into and out of elastic pools. The elastic pool exist before you can use these commands. Use the Azure portal or C# or PowerShell to create the pool. These commands affect only databases, therefore properties of the 
pool itself (such as min and max eDTUs) cannot be changed with these T-SQL commands.

Tip: To monitor the service objectives of all databases, use the [sys.database\_service \_objectives](https://msdn.microsoft.com/library/mt712619(SQL.130).aspx) view. 

> [AZURE.NOTE] Elastic database pools are currently in preview and only available with SQL Database V12 servers. If you have a SQL Database V11 server you can [use PowerShell to upgrade to V12 and create a pool](sql-database-upgrade-server-portal.md) in one step.


## Create a new database inside an elastic pool
Use the CREATE DATABASE command with the SERVICE_OBJECTIVE option.   

	CREATE DATABASE db28 ( SERVICE_OBJECTIVE = ELASTIC_POOL (name = [standard-100] ));
	-- db28 is the new database name. 
	-- standard-100 is an existing pool.

All databases in an elastic pool inherit pricing tier of the elastic pool (standard, basic, or premium). 


## Move a database from one pool into another pool
Use the ALTER DATABASE command with the MODIFY and SERVICE_OBJECTIVE option; set the name to the target pool.

	ALTER DATABASE db28 MODIFY ( SERVICE_OBJECTIVE = ELASTIC_POOL (name = [premium-200] )); 


## Move a database out of an elastic pool to become a single database
Use the ALTER DATABASE command and set the SERVICE_OBJECTIVE to one of the service levels (S0, S1, etc).

	ALTER DATABASE db28 MODIFY ( SERVICE_OBJECTIVE = 'S1');
	-- Changes the database into a stand-alone database with the service objective S1.

## To move a single database into a pool 
Use the ALTER DATABASE command with the MODIFY and SERVICE_OBJECTIVE option; set the name to the target pool.

	ALTER DATABASE db28 MODIFY ( SERVICE_OBJECTIVE = ELASTIC_POOL (name = [standard-100] )); 

## To check the service objectives of databases
While creating or moving databases, you can use the [sys.database\_service \_objectives](https://msdn.microsoft.com/library/mt712619(SQL.130).aspx) view. Log in to the master database, and run this query:

	SELECT d.name, 
    slo.*  
	FROM sys.databases d 
	JOIN sys.database_service_objectives slo  
	ON d.database_id = slo.database_id;

## Next steps

After creating an elastic database pool, you can manage elastic databases in the pool by creating elastic jobs. Elastic jobs facilitate running T-SQL scripts against any number of databases in the pool. For more information, see [Elastic database jobs overview](sql-database-elastic-jobs-overview.md).
