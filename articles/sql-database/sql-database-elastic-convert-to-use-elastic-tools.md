<properties
   pageTitle="Convert existing databases to use elastic database tools"
   description="Convert sharded databases to use elastic database tools by creating a shard map manager"
   services="sql-database"
   documentationCenter=""
   authors="jhubbard"
   manager="silvia doomra"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management"
   ms.date="03/23/2016"
   ms.author="carlrab"/>

# Convert existing databases to use elastic database tools

If you have an existing database solution, you can take advantage of the Elastic database tools by using the techniques described here. Using the tools includes the [Elastic Database client library](sql-database-elastic-database-client-library.md). The techniques are implemented using the PowerShell scripts found at [Azure SQL DB - Elastic Database tools scripts](https://gallery.technet.microsoft.com/scriptcenter/Azure-SQL-DB-Elastic-731883db). The scripts simplify the creation of a ShardMapManager using either the *list mapping* or the *range mapping* method. Once a shard map is created, the tenant data must be mapped, also simplified using a PowerShell script.

The process starts with **preparation of the databases**, then proceeds by adding list mapping to a ShardMapManager.

For more information about the ShardMapManager, see [Shard map management](sql-database-elastic-scale-shard-map-management.md). For an overview of the elastic database tools, see [Elastic Database features overview](sql-database-elastic-scale-introduction.md).

## Preparation of the databases
* First create a shard map manager, which can be done using either C#, or a PowerShell cmdlet.  This is a one-time operation. 
* Prepare the individual databases by using the Add-Shard cmdlet.

## Preparation step 1: create a shard map manager
Note that a database acting as shard map manager shouldn’t be the same database as a shard. 

	# Create a shard map manager. 
	New-ShardMapManager -UserName '<user_name>' 
	-Password '<password>' 
	-SqlServerName '<server_name>' 
	-SqlDatabaseName '<smm_db_name>' 
	#<server_name> and <smm_db_name> are the server name and database name 
	# for the new or existing database that should be used for storing 
	# tenant-database mapping information.

### To retrieve the shard map manager
After creation, you can retrieve the shard map manager with this cmdlet:

	# Try to get a reference to the Shard Map Manager  
	$ShardMapManager = Get-ShardMapManager -UserName '<user_name>' 
	-Password '<password>' 
	-SqlServerName '<server_name>' 
	-SqlDatabaseName '<smm_db_name>' 

## Preparation step 2: Add shards

Add each shard (database) to the shard map manager. This prepares the individual databases with new tables for mapping the data.

	# Add a new shard to hold the data for partitioning. 
	Add-Shard 
	-ShardMap $ShardMap 
	-SqlServerName '<shard_server_name>' 
	-SqlDatabaseName '<shard_database_name>' 
  
## List mapping or range mapping?
The question is now whether to create one of the following options: 

1. List mapping
2. Range mapping
3. List mapping on a single database 

If you are using a single-tenant database model, use the list mapping. The single-tenant model assigns one database per tenant. This is an effective model for SaaS developers as it simplifies management

In contrast, the multi-tenant database model assigns several tenants to a database (and you can distribute groups of tenants across multiple databases. This is a viable model when the amount of data per tenant is expected to be small. 

A third option is to use a list mapping to assign multiple ranges to a single database. For example, DB1 is used to store information about tenant id 1 and 5, and DB2 stores data for tenant 7 and tenant 10.  


## Option 1: create a shard map for a list mapping
The first step is to create a shard map using the ShardMapManager object. Here's an example using the PowerShell script:

	# $ShardMapManager is the shard map manager object. 
	$ShardMap = New-ListShardMap -KeyType $([int]) 
	-ListShardMapName 'ListShardMap' 
	-ShardMapManager $ShardMapManager 
 

## Map the data for a list mapping

Once a new shard map manager is created, you must map the data.  

	# Create the mappings and associate it with the new shards 
	Add-ListMapping 
	-KeyType $([int]) 
	-ListPoint '<tenant_id>' 
	-ListShardMap $ShardMap 
	-SqlServerName '<shard_server_name>' 
	-SqlDatabaseName '<shard_database_name>' 

 
## Option 2: create a shard map for a range mapping

When the data for a single tenant becomes small enough, it's possible to use the multiple tenant per database model. The model stores data for multiple tenants in a single database. In this model, we assign a range of tenants to a database using *range mapping*. 

Note that to utilize this mapping pattern, tenant id values needs to be continuous ranges, and it is acceptable to have gap in the ranges by simply skipping the range when creating the databases.

	# $ShardMapManager is the shard map manager object 
	# 'RangeShardMap' is the unique identifier for the range shard map.  
	$ShardMap = New-RangeShardMap 
	-KeyType $([int]) 
	-RangeShardMapName 'RangeShardMap' 
	-ShardMapManager $ShardMapManager 

## Map the data for a range mapping

After the creation of shard map, the next step involves adding the range mappings for all the tenant id range – database associations:

# Create the mappings and associate it with the new shards 

	Add-RangeMapping 
	-KeyType $([int]) 
	-RangeHigh '5' 
	-RangeLow '1' 
	-RangeShardMap $ShardMap 
	-SqlServerName '<shard_server_name>' 
	-SqlDatabaseName '<shard_database_name>' 

## Option 3: List mappings on a single database

Setting up this pattern follows the same steps as setting up a single tenant per database model, with the extra step of adding list mapping command the number of times an additional tenant id needs to be mapped to the database.

Information about the existing shards and the mappings associated with them can be queried using following commands:  

	# List the shards and mappings 
	Get-Shards -ShardMap $ShardMap 
	Get-Mappings -ShardMap $ShardMap 

## Next steps
Get the PowerShell scripts from [Azure SQL DB-Elastic Database tools sripts](https://gallery.technet.microsoft.com/scriptcenter/Azure-SQL-DB-Elastic-731883db).

The tools are also on GitHub: [Azure/elastic-db-tools](https://github.com/Azure/elastic-db-tools).