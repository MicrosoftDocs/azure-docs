<properties title="Shard Map Management" pageTitle="Shard Map Management" description="Shard Map Management, shardmapmanager, elastic scale" metaKeywords="sharding scaling, Azure SQL Database sharding, elastic scale, shardmapmanager" services="sql-database" documentationCenter="sql-database" authors="sidneyh@microsoft.com"/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/02/2014" ms.author="sidneyh" />

#Shard Map Management 

##Shard Maps and Shard Mappings 

In a sharded database environment, a shard map maintains information allowing an application to connect to the correct database based upon the value of the sharding key. In the Elastic Scale Preview, shard maps can be constructed using lists of individual key values or they can be constructed using ranges of sharding keys.  Sharding keys with .Net types of integer, long, guid, or byte[] are supported in the Elastic Scale Preview. 
 

**List Shard Map:**
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
A list shard map is simply an association between the individual key values that identify the shardlets and the databases that serve as shards that contain the shardlets.  List mappings are explicit (i.e., Key 1 maps to Database A) and different key values can be mapped to the same database (key values 3 and 6 both reference Database B).


**Range Shard Map:** 
<table>
   <tr>
    <td>**Key Range**</td>
     <td>**Shard Location**</td>
   </tr>
   <tr>
    <td>(1, 50)</td>
     <td>Database_A</td>
   </tr>
  <tr>
    <td>(50, 100)</td>
     <td>Database_B</td>
   </tr>
  <tr>
    <td>(100, 200)</td>
     <td>Database_C</td>
   </tr>
  <tr>
    <td>(400, 600)</td>
     <td>Database_C</td>
   </tr>
  <tr>
    <td>...</td>
     <td>...</td>
   </tr>
</table> 

In a range shard map, the Key Range is described by a pair [Low Value, High Value) where the Low Value is the minimum key in the range, and the High Value is the first value higher than the range.  So [0, 100) includes all integers greater than or equal 0 and less than 100. Note that multiple ranges can point to the same database, and disjoint ranges are supported (e.g., [100,200) and [400,600) both point to Database C in the example above.) 

Each of the tables shown above is a conceptual example of a ShardMap object.  Each row is a simplified example of an individual PointMapping (for the list shard map) or RangeMapping (for the range shard map) object.

##Shard Map Manager 

In the Elastic Scale APIs, the Shard Map Manager is a collection of shard maps. Referenced in your application as a ShardMapManager .Net object, the data that it contains is actually maintained in three places: 

1. **Global ShardMapManager database** (GSM). When you create a **ShardMapManager**, you specify a database to serve as the repository for all of its shard maps and mappings. Special tables and stored procedures are automatically created in this database to manage the information. While this will typically be a small database and lightly accessed, this database should not be used for other needs of the application.  The tables are in a special schema named “__ShardManagement” 

2. **Local ShardMapManager databases**(LSM). Every database that you specify to be a shard within a shard map will be modified to contain several small tables and special stored procedures that contain and manage shard map information that is specific to that shard. While this information is redundant to the map information in the GSM, it allows the application to validate cached shard map information without placing any concentrated load on the GSM – using the LSM instead to determine if a cached mapping is no longer valid.  As with the GSM, the tables corresponding to the LSM on each shard are in schema “__ShardManagement” 

3. **Application cache**. Each application instance accessing a ShardMapManager object will maintaina local in-memory cache of its mappings. This avoids having to make a database request to the GSM to obtain routing information that has already been retrieved. 

A **ShardMapManager** object in the application is instantiated using a factory pattern.  The **ShardMapManagerFactory.GetSqlShardMapManager** method takes credentials (including the server name and database name holding the GSM) in the form of a **ConnectionString** and returns an instance of a **ShardMapManager**.  

The **ShardMapManager** should be instantiated only once per app domain, within the initialization code for an application. Once created, a **ShardMapManager** can contain any number of shard maps. While a single shard map may be sufficient for many applications, there are times when different sets of databases are used for different schema or for unique purposes, and in those cases multiple shard maps may be preferable. 

In the following code sample, an application tries to open an existing ShardMapManager database for use in manipulating the shard map.  If objects representing a Global ShardMapManager (GSM) do not yet exist inside the database, the client library will create them there.

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
        // The Shard Map Manager does not exist, so create it. 
        ShardMapManagerFactory.CreateSqlShardMapManager(connectionString);
        Console.WriteLine("Created SqlShardMapManager"); 

        shardMapManager = ShardMapManagerFactory.GetSqlShardMapManager(
            connectionString, 
            ShardMapManagerLoadPolicy.Lazy);
    } 
 

The **connectionString** variable in the example above contains server name, database name, and credentials sufficient for admin privileges on both the GSM and the shards themselves. 


##Shard Map Administration  

Typically, applications that administer and manipulate shard maps are different from those that use the maps to route connections. 

For applications that administer shard maps (adding or changing shards, shard maps, shard mappings, etc.) you must instantiate the **ShardMapManager** using credentials that have Read/Write privileges on both the GSM database and on each database that serves as a shard. The credentials must allow for writes against the tables in both the GSM and LSM as shard map information is entered or changed, as well as for creating LSM tables on new shards.  

Note that the methods used for populating or changing the **ShardMapManager** data do not have an effect on the user data stored in the shard databases themselves. For example, methods such as **CreateShard**, **DeleteShard**, **UpdateMapping**, etc. affect the shard map metadata only, they do not remove or add databases from the servers, and they do not physically move database rows from one shard to another.These methods are designed to be used in conjunction with separate operations you perform to create or remove actual databases, or that move rows from one shard to another to rebalance a sharded environment.  (The **Split/Merge** service included with Elastic Scale preview makes use of these APIs along with orchestrating actual data movement between shards.) 

An example sequence of operations to populate a specific shard map is shown below. First, a new Shard Map is created within a Shard Map Manager. Then, the metadata for two different shards is added to the Shard Map. Finally, a variety of key range mappings are added, and the overall contents of the Shard Map are displayed. The code is written in a way that the entire method can be safely rerun in case an unexpected error is encountered – each request tests whether a shard or mapping already exists, before attempting to create it. The code below assumes that databases named **sample_shard_0**, **sample_shard_1** and **sample_shard_2** have already been created in the server referenced by string **shardServer**. 
 
**Example: Populating a shard map**

    public void CreatePopulatedRangeMap(ShardMapManager smm, string mapName) 
        {            
            RangeShardMap<long> sm = null; 

            // check if shardmap exists and if not, create it 
            if (!smm.TryGetRangeShardMap(mapName, out sm)) 
            { 
                sm = smm.CreateRangeShardMap<long>(mapName); 
            } 

            Shard shard0 = null, shard1=null; 
            // check if shard exists and if not, create it (Idempotent / tolerant of re-execute) 

            if (!sm.TryGetShard(new ShardLocation(shardServer, "sample_shard_0"),out shard0)) 
            { 
                Shard0 = sm.CreateShard(new ShardLocation(shardServer, "sample_shard_0")); 
            } 

            if (!sm.TryGetShard(new ShardLocation(shardServer, "sample_shard_1"),out shard1)) 
            { 
                Shard1 = sm.CreateShard(new ShardLocation(shardServer, "sample_shard_1"));  
            } 

            RangeMapping<long> rmpg=null; 

            // Check if mapping exists and if not create it (Idempotent / tolerant of re-execute) 
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
            foreach (Shard s in sm.GetShards().OrderBy(s => s.Location.DataSource).ThenBy(s => s.Location.Database))
            { 
               Console.WriteLine("shard: "+ s.Location); 
            } 

            foreach (RangeMapping<long> rm in sm.GetMappings()) 
            { 
                Console.WriteLine("range: ["+ rm.Value.Low.ToString()+":"+rm.Value.High.ToString()+ ")  ==>" +rm.Shard.Location); 
            } 

        } 
 

As an alternative to using a .Net application to populate or manipulate your shard maps, you can work with PowerShell scripts to achieve the same result.     

Once shard maps have been populated, data access applications can be created or adapted to work with the maps.  Populating or manipulating the maps need not occur again until maplayout needs to change.  

##Data Dependent Routing 

Most use of the shard map manager will come from the applications that require database connections to perform the app-specific data operations. In a sharded application, those connections now must be associated with the correct target database.  This is known as Data Dependent Routing or DDR.  For these applications, instantiate a shard map manager object from the factory using credentials that have read-only access on the GSM database. Individual requests for connections will later supply credentials necessary for connecting to the appropriate shard database.  

Note that these applications (using ShardMapManager opened with read-only credentials) will be unable to make changes to the maps or mappings.  For those needs, create administrative-specific applications or Powershell scripts that supply higher-privileged credentials as discussed earlier.   

More details on Data Dependent Routing functionality is discussed in a separate documentation section. 

##Modifying a Shard Map 

A shard map can be changed in different ways.  All of the following methods modify the metadata describing the shards and their mappings, but they do not physically modify data within the shards, nor do they create or delete the actual databases.  Some of the operations on the shard map described below need to be coordinated with administrative actions that physically move data or that add and remove databases serving as shards.


These methods work together as the building blocks available for modifying the overall distribution of data in your sharded database environment.  

* Adding or removing shards – **CreateShard** and **DeleteShard**.  As noted earlier, the server and database representing the target shard must already exist for these operations to execute.   These methods do not have any impact on the databases themselves, only on metadata in the shard map.

* Creating or removing points or ranges that are mapped to the shards -- **CreateRangeMapping**, **DeleteMapping**, **CreatePointMapping**. Many different points or ranges can be mapped to the same shard. These methods only affect metadata – they do not affect any data that may already be present in shards.  If data needs to be removed from the database in order to be consistent with **DeleteMapping** operations, you will need to perform those operations separately but in conjunction with using these methods.  

* Splitting existing ranges into two, or merging adjacent ranges into one – **SplitMapping** and **MergeMappings**.  Note that split and merge operations do not change the shard to which key values are mapped. A split breaks an existing range into two parts, but leaves both as mapped to the same shard. A merge operates on two adjacent ranges that are already mapped to the same shard, coalescing them into a single range.  The movement of points or ranges themselves between shards needs to be coordinated by using **UpdateMapping** in conjunction with actual data movement -- discussed below. 

* Re-mapping (e.g. “moving”) individual points or ranges to different shards – **UpdateMapping**.  Since data may need to be moved from one shard to another in order to be consistent with **UpdateMapping** operations, you will need to perform that movement separately but in conjunction with using these methods.  

##Updating Mappings and Coordinating Data Movement Between Shards 

Note:  The following section is useful only in situations where you wish to redistribute data among shards without using Elastic Scale Preview’s Split / Merge Service.   If you work with the included service instead, the various metadata operations described below are automatically executed along with the data movement itself. 

To ensure an application using Data Dependent Routing cannot perform operations that create inconsistencies between application data layout and the mappings in the shard map, or return incomplete or incorrect results, certain operations on shard mappings are only allowed when a mapping is in an “offline” state.  This prevents DDR operations from occurring on mappings that are being changed, ensuring that shard data remains consistent with the mappings.  Operations that require a mapping to be offline include **UpdateMapping** and **DeleteMapping**.

To take a mapping offline, use the method **MarkMappingOffline** on the shard map before performing the change.  Following any UpdateMapping and after data movement is completed, be sure to use the MarkMappingOnline method. 

The period while a mapping is marked offline is the time to perform any actual data movement operations – e.g. to copy data in the affected range from the original shard to the target shard of the new mapping. While a range is offline, any connections requested for the range from the DDR API will be rejected. **In addition, when a range is first taken offline, all connections to the affected shard are automatically killed in order to prevent the return of inconsistent or incomplete results from the range being changed.** The impact of this is only momentary -- connections can be immediately retried by the client application and will be allowed as long as they are not associated with a sharding key value in the range that is now offline.  The remainder of the data in the original shard remains online and accessible. 

The code snippet below is an example of the sequence of events in modifying a shard map to move a range to a different shard.  From our earlier script above, there is initially a sharding key range [0,50) mapped to Shard0. Let’s say we now want to move the range [25,50) to Shard2. 


The necessary steps are

1. Split [0,50) into 2 ranges – [0,25) and [25,50) – still mapped to the same shard (Shard0).
2. Take the range [25,50) offline. 
3. Change the mapping of [25,50) to reference Shard2 
4. **Perform any necessary data movement to migrate rows in range [25,50) from Shard0 to Shard2**. 
5. Once any necessary data movement is complete, take the range [25,50) online. 

**All of the steps above are performed automatically by the Split/Merge service. They are illustrated here for developers who wish to build their own data movement operations compatible with Elastic Scale’s shard map Management API.**

The code pattern is shown below. 

**Example: Splitting a range and moving it to a different shard** 

      // Add a new shard to hold the range we will move 
    Shard shard2 = null; 
    if (!sm.TryGetShard(new ShardLocation(shardServer, "sample_shard_2"),out shard2)) 

    { 
        Shard2 = sm.CreateShard(new ShardLocation(shardServer, "sample_shard_2"));  
    } 

    // Split the Range holding Key 25 
    sm.SplitMapping(sm.GetMappingForKey(25), 25); 

        // Map new range holding (25-50] to different shard: 
        // first take existing mapping offline 

        sm.MarkMappingOffline(sm.GetMappingForKey(25)); 

        // now map while offline to a different shard 
        RangeMappingUpdate upd = new RangeMappingUpdate(); 
        upd.Shard = shard2; 
        sm.UpdateMapping(sm.GetMappingForKey(25), upd); 

        // At this point, perform data movement necessary to populate destination shard (shard2) 
        // with rows from the range being moved 
        /*********************************************************************************** 
                  PERFORM DATA MOVEMENT ROUTINES HERE 
        ***********************************************************************************/ 
         // When data movement is complete, bring range mapping online 
         sm.MarkMappingOnline(sm.GetMappingForKey(25)); 
