<properties title="Adding a Shard To an Elastic Scale Application" pageTitle="Adding a Shard To an Elastic Scale Application" description="Shard Map Management, shardmapmanager, elastic scale" metaKeywords="sharding scaling, Azure SQL Database sharding, elastic scale, shardmapmanager" services="sql-database" documentationCenter="sql-database" authors="sidneyh@microsoft.com"/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/02/2014" ms.author="sidneyh" />

# Adding a Shard To an Elastic Scale Application 


Applications often need to add shards to handle data that is expected from new keys or key ranges, for a shard map that already exists. For example, an application sharded by Tenant ID may need to add a new shard for a new tenant. Or data sharded monthly may need a new shard provisioned before the start of a month. 

If the new range of key values is not already part of an existing mapping, add the new shard and associate the new key or range to that shard. 

### To Add a Shard and its Range to an Existing Shard Map
Here is a database named **sample_shard_2**. All necessary schema objects inside of it have been created to hold range [300, 400).

	// sm is a RangeShardMap object.
	// Add a new shard to hold the range being added. 
    Shard shard2 = null; 

    if (!sm.TryGetShard(new ShardLocation(shardServer, "sample_shard_2"),out shard2)) 
    { 
		Shard2 = sm.CreateShard(new ShardLocation(shardServer, "sample_shard_2"));  
	} 

	// Create the mapping and associate it with the new shard 
    sm.CreateRangeMapping(new RangeMappingCreationInfo<long> 
							(new Range<long>(300, 400), shard2, MappingStatus.Online)); 

### To Add a Shard for an Empty Part of an Existing Range  

You have mapped a range to a shard and partially filled it with data, but upcoming data must be directed to a different shard. For example, you shard by day range and have allocated 50 days to a shard. But on day 24, data should go to a different shard. The [Split/Merge Service](http://go.microsoft.com/?linkid=9862599) can perform this operation, but if data movement is not needed, use the Shard Map Management APIs directly. (For example, data for days 25-50 does not yet exist) .

### To Split a Range and Assign the Empty Portion to a Newly-added Shard

The database is named “sample_shard_2,” and all necessary schema objects inside of it have been created.  
 
	// sm is a RangeShardMap object.
	// Add a new shard to hold the range we will move. 
	Shard shard2 = null; 

	if (!sm.TryGetShard(new ShardLocation(shardServer, "sample_shard_2"),out shard2)) 
	{ 	
		Shard2 = sm.CreateShard(new ShardLocation(shardServer, "sample_shard_2"));  
	} 

	// Split the Range holding Key 25. 

	sm.SplitMapping(sm.GetMappingForKey(25), 25); 

	// Map the new range holding (25-50] to different shard: 
    // First take existing mapping offline. 
    sm.MarkMappingOffline(sm.GetMappingForKey(25)); 
    // While offline, map to a different shard. 
    RangeMappingUpdate upd = new RangeMappingUpdate(); 
    upd.Shard = shard2; 
    // Take online.
    sm.MarkMappingOnline(sm.UpdateMapping(sm.GetMappingForKey(25), upd)); 

**Important**:  Use this technique only if you are certain that the range for the updated mapping is empty. The methods do not check data for the range being moved, so it is best to include checks in your code. If rows exist in the range being moved, the actual data distribution will not match the updated shard map. Instead, use the **Split/Merge** service to perform the operation. 

[AZURE.INCLUDE [elastic-scale-include](../includes/elastic-scale-include.md)]