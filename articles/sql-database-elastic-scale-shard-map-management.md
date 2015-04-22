<properties 
	pageTitle="Shard map management" 
	description="How to use the ShardMapManager, elastic database client library" 
	services="sql-database" 
	documentationCenter="" 
	manager="jeffreyg" 
	authors="sidneyh" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/17/2015" 
	ms.author="sidneyh"/>

# Shard map management
In a sharded database environment, a **shard map** maintains information allowing an application to connect to the correct database based upon the value of the **sharding key**. Understanding how these maps are constructed is crucial to managing shards with the elastic database client library.

## Shard maps and shard mappings
 
### Supported .Net types for sharding keys

Elastic Scale support the following .Net Framework types as sharding keys:

* integer
* long
* guid
* byte[]  
* datetime
* timespan
* datetimeoffset

### List and range shard maps
Shard maps can be constructed using **lists of individual sharding key values**, or they can be constructed using **ranges of sharding key values**. 

###List shard maps
**Shards** contain **shardlets** and the mapping of shardlets to shards is maintained by a shard map. A **list shard map** is an association between the individual key values that identify the shardlets and the databases that serve as shards.  **List mappings** are explicit (for example, key 1 maps to Database A) and different key values can be mapped to the same database (key values 3 and 6 both reference Database B).
<table>
   <tr>
    <td>Key</td>
     <td>Shard Location</td>
   </tr>
   <tr>
    <td>1</td>
     <td>Database_A</td>
   </tr>
  <tr>
    <td>3</td>
     <td>Database_B</td>
   </tr>
  <tr>
    <td>4</td>
     <td>Database_C</td>
   </tr>
  <tr>
    <td>6</td>
     <td>Database_B</td>
   </tr>
  <tr>
    <td>...</td>
     <td>...</td>
   </tr>
</table> 

### Range shard maps 
In a **range shard map**, the key range is described by a pair **[Low Value, High Value)** where the *Low Value* is the minimum key in the range, and the *High Value* is the first value higher than the range. 

For example, **[0, 100)** includes all integers greater than or equal 0 and less than 100. Note that multiple ranges can point to the same database, and disjoint ranges are supported (e.g., [100,200) and [400,600) both point to Database C in the example below.)
<table>
   <tr>
    <td><b>Key Range</b></td>
     <td><b>Shard Location</b></td>
   </tr>
   <tr>
    <td>[1, 50)</td>
     <td>Database_A</td>
   </tr>
  <tr>
    <td>[50, 100)</td>
     <td>Database_B</td>
   </tr>
  <tr>
    <td>[100, 200)</td>
     <td>Database_C</td>
   </tr>
  <tr>
    <td>[400, 600)</td>
     <td>Database_C</td>
   </tr>
  <tr>
    <td>...</td>
     <td>...</td>
   </tr>
</table> 

Each of the tables shown above is a conceptual example of a **ShardMap** object.  Each row is a simplified example of an individual **PointMapping** (for the list shard map) or **RangeMapping** (for the range shard map) object.

## Shard map manager 

In the client library, the Shard Map Manager is a collection of shard maps. The data managed by a **ShardMapManager** .Net object is kept in three places: 

1. **Global Shard Map (GSM)**: When you create a **ShardMapManager**, you specify a database to serve as the repository for all of its shard maps and mappings. Special tables and stored procedures are automatically created to manage the information. This is typically a small database and lightly accessed, but it should not be used for other needs of the application. The tables are in a special schema named **__ShardManagement**. 

2. **Local Shard Map (LSM)**: Every database that you specify to be a shard within a shard map will be modified to contain several small tables and special stored procedures that contain and manage shard map information specific to that shard. This information is redundant to the information in the GSM, but it allows the application to validate cached shard map information without placing any load on the GSM; the application uses the LSM to determine if a cached mapping is still valid. The tables corresponding to the LSM on each shard are in schema **__ShardManagement**.

3. **Application cache**: Each application instance accessing a **ShardMapManager** object maintains a local in-memory cache of its mappings. It stores routing information that has recently been retrieved. 

## Constructing a ShardMapManager
A **ShardMapManager** object in the application is instantiated using a factory pattern. The **ShardMapManagerFactory.GetSqlShardMapManager** method takes credentials (including the server name and database name holding the GSM) in the form of a **ConnectionString** and returns an instance of a **ShardMapManager**.  

The **ShardMapManager** should be instantiated only once per app domain, within the initialization code for an application. A **ShardMapManager** can contain any number of shard maps. While a single shard map may be sufficient for many applications, there are times when different sets of databases are used for different schema or for unique purposes, and in those cases multiple shard maps may be preferable. 

In this code, an application tries to open an existing **ShardMapManager**.  If objects representing a Global **ShardMapManager** (GSM) do not yet exist inside the database, the client library creates them there.

    // Try to get a reference to the Shard Map Manager via the Shard Map Manager database.  
    // If it doesn't already exist, then create it. 
    ShardMapManager shardMapManager; 
    bool shardMapManagerExists = ShardMapManagerFactory.TryGetSqlShardMapManager(
                                        connectionString, 
                                        ShardMapManagerLoadPolicy.Lazy, 
                                        out shardMapManager); 

    if (shardMapManagerExists) 
     { 
        Console.WriteLine("Shard Map Manager already exists");
    } 
    else
    {
        // Create the Shard Map Manager. 
        ShardMapManagerFactory.CreateSqlShardMapManager(connectionString);
        Console.WriteLine("Created SqlShardMapManager"); 

        shardMapManager = ShardMapManagerFactory.GetSqlShardMapManager(
            connectionString, 
            ShardMapManagerLoadPolicy.Lazy);

        // The connectionString contains server name, database name, and admin credentials 
        // for privileges on both the GSM and the shards themselves.
    } 
 

### Shard map administration credentials

Typically, applications that administer and manipulate shard maps are different from those that use the shard maps to route connections. 

For applications that administer shard maps (adding or changing shards, shard maps, shard mappings, etc.) you must instantiate the **ShardMapManager** using **credentials that have read/write privileges on both the GSM database and on each database that serves as a shard**. The credentials must allow for writes against the tables in both the GSM and LSM as shard map information is entered or changed, as well as for creating LSM tables on new shards.  

### Only metadata affected 

Methods used for populating or changing the **ShardMapManager** data do not alter the user data stored in the shards themselves. For example, methods such as **CreateShard**, **DeleteShard**, **UpdateMapping**, etc. affect the shard map metadata only. They do not remove, add, or alter user data contained in the shards. Instead, these methods are designed to be used in conjunction with separate operations you perform to create or remove actual databases, or that move rows from one shard to another to rebalance a sharded environment.  (The **split-merge** tool included with elastic database tools makes use of these APIs along with orchestrating actual data movement between shards.) 

## Populating a shard map: example
 
An example sequence of operations to populate a specific shard map is shown below. The code performs these steps: 

1. A new shard map is created within a shard map manager. 
2. The metadata for two different shards is added to the shard map. 
3. A variety of key range mappings are added, and the overall contents of the shard map are displayed. 

The code is written in a way that the entire method can be safely rerun in case an unexpected error is encountered – each request tests whether a shard or mapping already exists, before attempting to create it. The code below assumes that databases named **sample_shard_0**, **sample_shard_1** and **sample_shard_2** have already been created in the server referenced by string **shardServer**. 

    public void CreatePopulatedRangeMap(ShardMapManager smm, string mapName) 
        {            
            RangeShardMap<long> sm = null; 

            // check if shardmap exists and if not, create it 
            if (!smm.TryGetRangeShardMap(mapName, out sm)) 
            { 
                sm = smm.CreateRangeShardMap<long>(mapName); 
            } 

            Shard shard0 = null, shard1=null; 
            // check if shard exists and if not, 
            // create it (Idempotent / tolerant of re-execute) 
            if (!sm.TryGetShard(new ShardLocation(shardServer, "sample_shard_0"), out shard0)) 
            { 
                Shard0 = sm.CreateShard(new ShardLocation(shardServer, "sample_shard_0")); 
            } 

            if (!sm.TryGetShard(new ShardLocation(shardServer, "sample_shard_1"), out shard1)) 
            { 
                Shard1 = sm.CreateShard(new ShardLocation(shardServer, "sample_shard_1"));  
            } 

            RangeMapping<long> rmpg=null; 

            // Check if mapping exists and if not,
            // create it (Idempotent / tolerant of re-execute) 
            if (!sm.TryGetMappingForKey(0, out rmpg)) 
            { 
                sm.CreateRangeMapping(new RangeMappingCreationInfo<long> 
                    (new Range<long>(0, 50), shard0, MappingStatus.Online)); 
            } 

            if (!sm.TryGetMappingForKey(50, out rmpg)) 
            { 
                sm.CreateRangeMapping(new RangeMappingCreationInfo<long> 
                    (new Range<long>(50, 100), shard1, MappingStatus.Online)); 
            } 

            if (!sm.TryGetMappingForKey(100, out rmpg)) 
            { 
                sm.CreateRangeMapping(new RangeMappingCreationInfo<long> 
                    (new Range<long>(100, 150), shard0, MappingStatus.Online)); 
            } 

            if (!sm.TryGetMappingForKey(150, out rmpg)) 
            { 
                sm.CreateRangeMapping(new RangeMappingCreationInfo<long> 
                    (new Range<long>(150, 200), shard1, MappingStatus.Online)); 
            } 

            if (!sm.TryGetMappingForKey(200, out rmpg)) 
            { 
               sm.CreateRangeMapping(new RangeMappingCreationInfo<long> 
                   (new Range<long>(200, 300), shard0, MappingStatus.Online)); 
            } 

            // List the shards and mappings 
            foreach (Shard s in sm.GetShards()
                                    .OrderBy(s => s.Location.DataSource)
                                    .ThenBy(s => s.Location.Database))
            { 
               Console.WriteLine("shard: "+ s.Location); 
            } 

            foreach (RangeMapping<long> rm in sm.GetMappings()) 
            { 
                Console.WriteLine("range: [" + rm.Value.Low.ToString() + ":" 
                        + rm.Value.High.ToString()+ ")  ==>" +rm.Shard.Location); 
            } 
        } 
 
As an alternative you can use PowerShell scripts to achieve the same result.     

Once shard maps have been populated, data access applications can be created or adapted to work with the maps. Populating or manipulating the maps need not occur again until **map layout** needs to change.  

## Data dependent routing 

Most use of the shard map manager will come from the applications that require database connections to perform the app-specific data operations. In a sharded application, those connections now must be associated with the correct target database. This is known as **Data Dependent Routing**.  For these applications, instantiate a shard map manager object from the factory using credentials that have read-only access on the GSM database. Individual requests for connections will later supply credentials necessary for connecting to the appropriate shard database.

Note that these applications (using **ShardMapManager** opened with read-only credentials) will be unable to make changes to the maps or mappings.  For those needs, create administrative-specific applications or PowerShell scripts that supply higher-privileged credentials as discussed earlier.   

For more details, see [Data dependent routing](sql-database-elastic-scale-data-dependent-routing.md). 

## Modifying a shard map 

A shard map can be changed in different ways. All of the following methods modify the metadata describing the shards and their mappings, but they do not physically modify data within the shards, nor do they create or delete the actual databases.  Some of the operations on the shard map described below may need to be coordinated with administrative actions that physically move data or that add and remove databases serving as shards.

These methods work together as the building blocks available for modifying the overall distribution of data in your sharded database environment.  

* To add or remove shards: use **CreateShard** and **DeleteShard**. 
    
    The server and database representing the target shard must already exist for these operations to execute. These methods do not have any impact on the databases themselves, only on metadata in the shard map.

* To create or remove points or ranges that are mapped to the shards: use **CreateRangeMapping**, **DeleteMapping**, **CreatePointMapping**. 
    
    Many different points or ranges can be mapped to the same shard. These methods only affect metadata – they do not affect any data that may already be present in shards. If data needs to be removed from the database in order to be consistent with **DeleteMapping** operations, you will need to perform those operations separately but in conjunction with using these methods.  

* To split existing ranges into two, or merge adjacent ranges into one: use **SplitMapping** and **MergeMappings**.  

    Note that split and merge operations **do not change the shard to which key values are mapped**. A split breaks an existing range into two parts, but leaves both as mapped to the same shard. A merge operates on two adjacent ranges that are already mapped to the same shard, coalescing them into a single range.  The movement of points or ranges themselves between shards needs to be coordinated by using **UpdateMapping** in conjunction with actual data movement.  You can use the **Split/Merge** service that is part of elastic database tools to coordinate shard map changes with data movement, when movement is needed. 

* To re-map (or move) individual points or ranges to different shards: use **UpdateMapping**.  

    Since data may need to be moved from one shard to another in order to be consistent with **UpdateMapping** operations, you will need to perform that movement separately but in conjunction with using these methods.

* To take mappings online and offline: use **MarkMappingOffline** and **MarkMappingOnline** to control the online state of a mapping. 

    Certain operations on shard mappings are only allowed when a mapping is in an “offline” state, including UpdateMapping and DeleteMapping. When a mapping is offline, a data-dependent request based on a key included in that mapping will return an error. In addition, when a range is first taken offline, all connections to the affected shard are automatically killed in order to prevent inconsistent or incomplete results for queries directed against ranges being changed. 

## Adding a shard 

Applications often need to simply add new shards to handle data that is expected from new keys or key ranges, for a shard map that already exists. For example, an application sharded by Tenant ID may need to provision a new shard for a new tenant, or data sharded monthly may need a new shard provisioned before the start of each new month. 

If the new range of key values is not already part of an existing mapping and no data movement is necessary, it is very simple to add the new shard and associate the new key or range to that shard. For details on adding new shards, see [Adding a new shard](sql-database-elastic-scale-add-a-shard.md).

For scenarios that require data movement, however, the split-merge tool is needed to orchestrate the data movement between shards in combination with the necessary shard map updates. For details on using the split-merge yool, see [Overview of split-merge](sql-database-elastic-scale-overview-split-and-merge.md) 

[AZURE.INCLUDE [elastic-scale-include](../includes/elastic-scale-include.md)]
