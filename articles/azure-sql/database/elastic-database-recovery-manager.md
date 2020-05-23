---
title: Recovery Manager to fix shard map problems
description: Use the RecoveryManager class to solve problems with shard maps
services: sql-database
ms.service: sql-database
ms.subservice: scale-out
ms.custom: seo-lt-2019, sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: 
ms.date: 01/03/2019
---
# Using the RecoveryManager class to fix shard map problems
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

The [RecoveryManager](https://docs.microsoft.com/dotnet/api/microsoft.azure.sqldatabase.elasticscale.shardmanagement.recovery.recoverymanager) class provides ADO.NET applications the ability to easily detect and correct any inconsistencies between the global shard map (GSM) and the local shard map (LSM) in a sharded database environment.

The GSM and LSM track the mapping of each database in a sharded environment. Occasionally, a break occurs between the GSM and the LSM. In that case, use the RecoveryManager class to detect and repair the break.

The RecoveryManager class is part of the [Elastic Database client library](elastic-database-client-library.md).

![Shard map][1]

For term definitions, see [Elastic Database tools glossary](elastic-scale-glossary.md). To understand how the **ShardMapManager** is used to manage data in a sharded solution, see [Shard map management](elastic-scale-shard-map-management.md).

## Why use the recovery manager

In a sharded database environment, there is one tenant per database, and many databases per server. There can also be many servers in the environment. Each database is mapped in the shard map, so calls can be routed to the correct server and database. Databases are tracked according to a **sharding key**, and each shard is assigned a **range of key values**. For example, a sharding key may represent the customer names from "D" to "F." The mapping of all shards (also known as databases) and their mapping ranges are contained in the **global shard map (GSM)**. Each database also contains a map of the ranges contained on the shard that is known as the **local shard map (LSM)**. When an app connects to a shard, the mapping is cached with the app for quick retrieval. The LSM is used to validate cached data.

The GSM and LSM may become out of sync for the following reasons:

1. The deletion of a shard whose range is believed to no longer be in use, or renaming of a shard. Deleting a shard results in an **orphaned shard mapping**. Similarly, a renamed database can cause an orphaned shard mapping. Depending on the intent of the change, the shard may need to be removed or the shard location needs to be updated. To recover a deleted database, see [Restore a deleted database](recovery-using-backups.md).
2. A geo-failover event occurs. To continue, one must update the server name, and database name of shard map manager in the application and then update the shard-mapping details for all shards in a shard map. If there is a geo-failover, such recovery logic should be automated within the failover workflow. Automating recovery actions enables a frictionless manageability for geo-enabled databases and avoids manual human actions. To learn about options to recover a database if there is a data center outage, see [Business Continuity](business-continuity-high-availability-disaster-recover-hadr-overview.md) and [Disaster Recovery](disaster-recovery-guidance.md).
3. Either a shard or the ShardMapManager database is restored to an earlier point-in time. To learn about point in time recovery using backups, see [Recovery using backups](recovery-using-backups.md).

For more information about Azure SQL Database Elastic Database tools, geo-replication and Restore, see the following:

* [Overview: Cloud business continuity and database disaster recovery with SQL Database](business-continuity-high-availability-disaster-recover-hadr-overview.md)
* [Get started with elastic database tools](elastic-scale-get-started.md)  
* [ShardMap Management](elastic-scale-shard-map-management.md)

## Retrieving RecoveryManager from a ShardMapManager

The first step is to create a RecoveryManager instance. The [GetRecoveryManager method](https://docs.microsoft.com/dotnet/api/microsoft.azure.sqldatabase.elasticscale.shardmanagement.shardmapmanager.getrecoverymanager) returns the recovery manager for the current [ShardMapManager](https://docs.microsoft.com/dotnet/api/microsoft.azure.sqldatabase.elasticscale.shardmanagement.shardmapmanager) instance. To address any inconsistencies in the shard map, you must first retrieve the RecoveryManager for the particular shard map.

   ```java
    ShardMapManager smm = ShardMapManagerFactory.GetSqlShardMapManager(smmConnectionString,  
             ShardMapManagerLoadPolicy.Lazy);
             RecoveryManager rm = smm.GetRecoveryManager();
   ```

In this example, the RecoveryManager is initialized from the ShardMapManager. The ShardMapManager containing a ShardMap is also already initialized.

Since this application code manipulates the shard map itself, the credentials used in the factory method (in the preceding example, smmConnectionString) should be credentials that have read-write permissions on the GSM database referenced by the connection string. These credentials are typically different from credentials used to open connections for data-dependent routing. For more information, see [Using credentials in the elastic database client](elastic-scale-manage-credentials.md).

## Removing a shard from the ShardMap after a shard is deleted

The [DetachShard method](https://docs.microsoft.com/previous-versions/azure/dn842083(v=azure.100)) detaches the given shard from the shard map and deletes mappings associated with the shard.  

* The location parameter is the shard location, specifically server name and database name, of the shard being detached.
* The shardMapName parameter is the shard map name. This is only required when multiple shard maps are managed by the same shard map manager. Optional.

> [!IMPORTANT]
> Use this technique only if you are certain that the range for the updated mapping is empty. The methods above do not check data for the range being moved, so it is best to include checks in your code.

This example removes shards from the shard map.

   ```java
   rm.DetachShard(s.Location, customerMap);
   ```

The shard map reflects the shard location in the GSM before the deletion of the shard. Because the shard was deleted, it is assumed this was intentional, and the sharding key range is no longer in use. If not, you can execute point-in time restore. to recover the shard from an earlier point-in-time. (In that case, review the following section to detect shard inconsistencies.) To recover, see [Point in time recovery](recovery-using-backups.md).

Since it is assumed the database deletion was intentional, the final administrative cleanup action is to delete the entry to the shard in the shard map manager. This prevents the application from inadvertently writing information to a range that is not expected.

## To detect mapping differences

The [DetectMappingDifferences method](https://docs.microsoft.com/dotnet/api/microsoft.azure.sqldatabase.elasticscale.shardmanagement.recovery.recoverymanager.detectmappingdifferences) selects and returns one of the shard maps (either local or global) as the source of truth and reconciles mappings on both shard maps (GSM and LSM).

   ```java
   rm.DetectMappingDifferences(location, shardMapName);
   ```

* The *location* specifies the server name and database name.
* The *shardMapName* parameter is the shard map name. This is only required if multiple shard maps are managed by the same shard map manager. Optional.

## To resolve mapping differences

The [ResolveMappingDifferences method](https://docs.microsoft.com/dotnet/api/microsoft.azure.sqldatabase.elasticscale.shardmanagement.recovery.recoverymanager.resolvemappingdifferences) selects one of the shard maps (either local or global) as the source of truth and reconciles mappings on both shard maps (GSM and LSM).

   ```java
   ResolveMappingDifferences (RecoveryToken, MappingDifferenceResolution.KeepShardMapping);
   ```

* The *RecoveryToken* parameter enumerates the differences in the mappings between the GSM and the LSM for the specific shard.
* The [MappingDifferenceResolution enumeration](https://docs.microsoft.com/dotnet/api/microsoft.azure.sqldatabase.elasticscale.shardmanagement.recovery.mappingdifferenceresolution) is used to indicate the method for resolving the difference between the shard mappings.
* **MappingDifferenceResolution.KeepShardMapping** is recommended that when the LSM contains the accurate mapping and therefore the mapping in the shard should be used. This is typically the case if there is a failover: the shard now resides on a new server. Since the shard must first be removed from the GSM (using the RecoveryManager.DetachShard method), a mapping no longer exists on the GSM. Therefore, the LSM must be used to re-establish the shard mapping.

## Attach a shard to the ShardMap after a shard is restored

The [AttachShard method](https://docs.microsoft.com/dotnet/api/microsoft.azure.sqldatabase.elasticscale.shardmanagement.recovery.recoverymanager.attachshard) attaches the given shard to the shard map. It then detects any shard map inconsistencies and updates the mappings to match the shard at the point of the shard restoration. It is assumed that the database is also renamed to reflect the original database name (before the shard was restored), since the point-in time restoration defaults to a new database appended with the timestamp.

   ```java
   rm.AttachShard(location, shardMapName)
   ```

* The *location* parameter is the server name and database name, of the shard being attached.
* The *shardMapName* parameter is the shard map name. This is only required when multiple shard maps are managed by the same shard map manager. Optional.

This example adds a shard to the shard map that has been recently restored from an earlier point-in time. Since the shard (namely the mapping for the shard in the LSM) has been restored, it is potentially inconsistent with the shard entry in the GSM. Outside of this example code, the shard was restored and renamed to the original name of the database. Since it was restored, it is assumed the mapping in the LSM is the trusted mapping.

   ```java
   rm.AttachShard(s.Location, customerMap);
   var gs = rm.DetectMappingDifferences(s.Location);
      foreach (RecoveryToken g in gs)
       {
       rm.ResolveMappingDifferences(g, MappingDifferenceResolution.KeepShardMapping);
       }
   ```

## Updating shard locations after a geo-failover (restore) of the shards

If there is a geo-failover, the secondary database is made write accessible and becomes the new primary database. The name of the server, and potentially the database (depending on your configuration), may be different from the original primary. Therefore the mapping entries for the shard in the GSM and LSM must be fixed. Similarly, if the database is restored to a different name or location, or to an earlier point in time, this might cause inconsistencies in the shard maps. The Shard Map Manager handles the distribution of open connections to the correct database. Distribution is based on the data in the shard map and the value of the sharding key that is the target of the applications request. After a geo-failover, this information must be updated with the accurate server name, database name and shard mapping of the recovered database.

## Best practices

Geo-failover and recovery are operations typically managed by a cloud administrator of the application intentionally utilizing Azure SQL Database business continuity features. Business continuity planning requires processes, procedures, and measures to ensure that business operations can continue without interruption. The methods available as part of the RecoveryManager class should be used within this work flow to ensure the GSM and LSM are kept up-to-date based on the recovery action taken. There are five basic steps to properly ensuring the GSM and LSM reflect the accurate information after a failover event. The application code to execute these steps can be integrated into existing tools and workflow.

1. Retrieve the RecoveryManager from the ShardMapManager.
2. Detach the old shard from the shard map.
3. Attach the new shard to the shard map, including the new shard location.
4. Detect inconsistencies in the mapping between the GSM and LSM.
5. Resolve differences between the GSM and the LSM, trusting the LSM.

This example performs the following steps:

1. Removes shards from the Shard Map that reflect shard locations before the failover event.
2. Attaches shards to the Shard Map reflecting the new shard locations (the parameter "Configuration.SecondaryServer" is the new server name but the same database name).
3. Retrieves the recovery tokens by detecting mapping differences between the GSM and the LSM for each shard.
4. Resolves the inconsistencies by trusting the mapping from the LSM of each shard.

   ```java
   var shards = smm.GetShards();
   foreach (shard s in shards)
   {
     if (s.Location.Server == Configuration.PrimaryServer)
         {
          ShardLocation slNew = new ShardLocation(Configuration.SecondaryServer, s.Location.Database);
          rm.DetachShard(s.Location);
          rm.AttachShard(slNew);
          var gs = rm.DetectMappingDifferences(slNew);
          foreach (RecoveryToken g in gs)
            {
               rm.ResolveMappingDifferences(g, MappingDifferenceResolution.KeepShardMapping);
            }
        }
    }
   ```

[!INCLUDE [elastic-scale-include](../../../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/elastic-database-recovery-manager/recovery-manager.png
