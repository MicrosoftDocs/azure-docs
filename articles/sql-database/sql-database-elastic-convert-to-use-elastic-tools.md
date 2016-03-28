<properties
   pageTitle="Convert existing databases to use elastic database tools"
   description="Convert sharded databases to use elastic database tools by creating a shard map manager"
   services="sql-database"
   documentationCenter=""
   authors="SilviaDoomra"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management"
   ms.date="03/28/2016"
   ms.author="SilviaDoomra"/>

# Convert existing databases to use elastic database tools

If you have an existing scaled-out, sharded solution, you can take advantage of the Elastic database tools by using the techniques described here. Using the tools includes the [Elastic Database client library](sql-database-elastic-database-client-library.md). The techniques are implemented using either C# or the PowerShell scripts found at [Azure SQL DB - Elastic Database tools scripts](https://gallery.technet.microsoft.com/scriptcenter/Azure-SQL-DB-Elastic-731883db). 

There are four steps:

1. The process starts with **preparation of the shard map manager database**.
2. Create either a list mapping or range mapping.
3. Prepare the individual shards.  
2. Add the mappings to the shard map.

For more information about the ShardMapManager, see [Shard map management](sql-database-elastic-scale-shard-map-management.md). For an overview of the elastic database tools, see [Elastic Database features overview](sql-database-elastic-scale-introduction.md).

## Create the shard map manager database
* First create a shard map manager, which can be done using either C#, or a PowerShell cmdlet.  This is a one-time operation. 

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

After creation, you can retrieve the shard map manager with this cmdlet. This step is needed every time you need to recreate the ShardMapManager object.

	# Try to get a reference to the Shard Map Manager  
	$ShardMapManager = Get-ShardMapManager -UserName '<user_name>' 
	-Password '<password>' 
	-SqlServerName '<server_name>' 
	-SqlDatabaseName '<smm_db_name>' 

  
## Step 2:  List mapping or range mapping?
The question is now whether to create one of the following options: 

1. List mapping
2. Range mapping
3. List mapping on a single database 

If you are using a single-tenant database model, use the list mapping. The single-tenant model assigns one database per tenant. This is an effective model for SaaS developers as it simplifies management.

![List mapping][1]

In contrast, the multi-tenant database model assigns several tenants to a database (and you can distribute groups of tenants across multiple databases. This is a viable model when the amount of data per tenant is expected to be small. 

![Range mapping][2]

A third option is to use a list mapping to assign multiple ranges to a single database. For example, DB1 is used to store information about tenant id 1 and 5, and DB2 stores data for tenant 7 and tenant 10. 

![Muliple tenants on single DB][3] 


## Step 2, option 1: create a shard map for a list mapping
The first step is to create a shard map using the ShardMapManager object. Here's an example using the PowerShell script:

	# $ShardMapManager is the shard map manager object. 
	$ShardMap = New-ListShardMap -KeyType $([int]) 
	-ListShardMapName 'ListShardMap' 
	-ShardMapManager $ShardMapManager 
 


 
## Step 2, option 2: create a shard map for a range mapping

When the data for a single tenant becomes small enough, it's possible to use the multiple tenant per database model. The model stores data for multiple tenants in a single database. In this model, we assign a range of tenants to a database using *range mapping*. 

Note that to utilize this mapping pattern, tenant id values needs to be continuous ranges, and it is acceptable to have gap in the ranges by simply skipping the range when creating the databases.

	# $ShardMapManager is the shard map manager object 
	# 'RangeShardMap' is the unique identifier for the range shard map.  
	$ShardMap = New-RangeShardMap 
	-KeyType $([int]) 
	-RangeShardMapName 'RangeShardMap' 
	-ShardMapManager $ShardMapManager 

## Step 2, option 3: List mappings on a single database
Setting up this pattern follows the same steps as setting up a single tenant per database model using a list mapping.

## Step 3: Prepare individual shards

Add each shard (database) to the shard map manager. This prepares the individual databases with new tables for mapping the data.

	# Add a new shard to hold the data for partitioning. 
	Add-Shard 
	-ShardMap $ShardMap 
	-SqlServerName '<shard_server_name>' 
	-SqlDatabaseName '<shard_database_name>'
	# The $ShardMap is the shard map created in step 2.
 

## Step 4: add mappings

The addition of mappings depends on the kind of shard map you created. If you created a list map, you add list mappings. If you created a range map, you add range mappings.

### Step 4 option 1: map the data for a list mapping

Map the data by adding a list mapping for each tenant.  

	# Create the mappings and associate it with the new shards 
	Add-ListMapping 
	-KeyType $([int]) 
	-ListPoint '<tenant_id>' 
	-ListShardMap $ShardMap 
	-SqlServerName '<shard_server_name>' 
	-SqlDatabaseName '<shard_database_name>' 

### Step 4 option 2: map the data for a range mapping

Add the range mappings for all the tenant id range – database associations:

	# Create the mappings and associate it with the new shards 
	Add-RangeMapping 
	-KeyType $([int]) 
	-RangeHigh '5' 
	-RangeLow '1' 
	-RangeShardMap $ShardMap 
	-SqlServerName '<shard_server_name>' 
	-SqlDatabaseName '<shard_database_name>' 


### Step 4 option 3: map the data for multiple tenants on a single database

For each tenant, run the Add-ListMapping (option 1, above). 


## Checking the mappings

Information about the existing shards and the mappings associated with them can be queried using following commands:  

	# List the shards and mappings 
	Get-Shards -ShardMap $ShardMap 
	Get-Mappings -ShardMap $ShardMap 



## Next steps
Get the PowerShell scripts from [Azure SQL DB-Elastic Database tools sripts](https://gallery.technet.microsoft.com/scriptcenter/Azure-SQL-DB-Elastic-731883db).

The tools are also on GitHub: [Azure/elastic-db-tools](https://github.com/Azure/elastic-db-tools).

[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]  

<!--Image references-->
[1]: ./media/sql-database-elastic-convert-to-use-elastic-tools/listmapping.png
[2]: ./media/sql-database-elastic-convert-to-use-elastic-tools/rangemapping.png
[3]: ./media/sql-database-elastic-convert-to-use-elastic-tools/multipleonsingledb.png
 