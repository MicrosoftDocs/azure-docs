<properties 
	pageTitle="Azure SQL Elastic Scale FAQ | Microsoft Azure" 
	description="Frequently Asked Questions about Azure SQL Database Elastic Scale." 
	services="sql-database" 
	documentationCenter="" 
	manager="jhubbard" 
	authors="ddove" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/03/2016" 
	ms.author="ddove"/>

# Elastic database tools FAQ 

#### If I have a single-tenant per shard and no sharding key, how do I populate the sharding key for the schema info?

The schema info object is only used to split merge scenarios. If an application is inherently single-tenant, then it does not require the Split Merge tool and thus there is no need to populate the schema info object.

#### I’ve provisioned a database and I already have a Shard Map Manager, how do I register this new database as a shard?

Please see **[Adding a shard to an application using the elastic database client library](sql-database-elastic-scale-add-a-shard.md)**. 

#### How much do elastic database tools cost?

Using the elastic database client library does not incur any costs. Costs accrue only for the Azure SQL databases that you use for shards and the Shard Map Manager, as well as the web/worker roles you provision for the Split Merge tool.

#### Why are my credentials not working when I add a shard from a different server?
Do not use credentials in the form of “User ID=username@servername”, instead simply use “User ID = username”.  Also, be sure that the “username” login has permissions on the shard.

#### Do I need to create a Shard Map Manager and populate shards every time I start my applications?

No—the creation of the Shard Map Manager (for example, **[ShardMapManagerFactory.CreateSqlShardMapManager](http://msdn.microsoft.com/library/azure/microsoft.azure.sqldatabase.elasticscale.shardmanagement.shardmapmanagerfactory.createsqlshardmapmanager.aspx)**) is a one-time operation.  Your application should use the call **[ShardMapManagerFactory.TryGetSqlShardMapManager()](http://msdn.microsoft.com/library/azure/microsoft.azure.sqldatabase.elasticscale.shardmanagement.shardmapmanagerfactory.trygetsqlshardmapmanager.aspx)** at application start-up time.  There should only one such call per application domain.

#### I have questions about using elastic database tools, how do I get them answered? 

Please reach out to us on the [Azure SQL Database forum](https://social.msdn.microsoft.com/forums/azure/home?forum=ssdsgetstarted).

#### When I get a database connection using a sharding key, I can still query data for other sharding keys on the same shard.  Is this by design?

The Elastic Scale APIs give you a connection to the correct database for your sharding key, but do not provide sharding key filtering.  Add **WHERE** clauses to your query to restrict the scope to the provided sharding key, if necessary.

#### Can I use a different Azure Database edition for each shard in my shard set?

Yes, a shard is an individual database, and thus one shard could be a Premium edition while another be a Standard edition. Further, the edition of a shard can scale up or down multiple times during the lifetime of the shard.

#### Does the Split Merge tool provision (or delete) a database during a split or merge operation? 

No. For **split** operations, the target database must exist with the appropriate schema and be registered with the Shard Map Manager.  For **merge** operations, you must delete the shard from the shard map manager and then delete the database.

[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]
 