---
title: Performance counters to track shard map manager
description: ShardMapManager class and data dependent routing performance counters
services: sql-database
ms.service: sql-database
ms.subservice: scale-out
ms.custom: seoapril2019, seo-lt-2019, sqldbrb=1
ms.devlang:
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: 
ms.date: 02/07/2019
---
# Create performance counters to track performance of shard map manager
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

Performance counters are used to track the performance of [data dependent routing](elastic-scale-data-dependent-routing.md) operations. These counters are accessible in the Performance Monitor, under the "Elastic Database: Shard Management" category.

You can capture the performance of a [shard map manager](elastic-scale-shard-map-management.md), especially when using [data dependent routing](elastic-scale-data-dependent-routing.md). Counters are created with methods of the Microsoft.Azure.SqlDatabase.ElasticScale.Client class.  


**For the latest version:** Go to [Microsoft.Azure.SqlDatabase.ElasticScale.Client](https://www.nuget.org/packages/Microsoft.Azure.SqlDatabase.ElasticScale.Client/). See also [Upgrade an app to use the latest elastic database client library](elastic-scale-upgrade-client-library.md).

## Prerequisites

* To create the performance category and counters, the user must be a part of the local **Administrators** group on the machine hosting the application.  
* To create a performance counter instance and update the counters, the user must be a member of either the **Administrators** or **Performance Monitor Users** group.

## Create performance category and counters

To create the counters, call the CreatePerformanceCategoryAndCounters method of the [ShardMapManagementFactory class](https://docs.microsoft.com/dotnet/api/microsoft.azure.sqldatabase.elasticscale.shardmanagement.shardmapmanagerfactory). Only an administrator can execute the method:

    ShardMapManagerFactory.CreatePerformanceCategoryAndCounters()  

You can also use [this](https://gallery.technet.microsoft.com/scriptcenter/Elastic-DB-Tools-for-Azure-17e3d283) PowerShell script to execute the method.
The method creates the following performance counters:  

* **Cached mappings**: Number of mappings cached for the shard map.
* **DDR operations/sec**: Rate of data dependent routing operations for the shard map. This counter is  updated when a call to [OpenConnectionForKey()](https://docs.microsoft.com/dotnet/api/microsoft.azure.sqldatabase.elasticscale.shardmanagement.shardmap.openconnectionforkey) results in a successful connection to the destination shard.
* **Mapping lookup cache hits/sec**: Rate of successful cache lookup operations for mappings in the shard map.
* **Mapping lookup cache misses/sec**: Rate of failed cache lookup operations for mappings in the shard map.
* **Mappings added or updated in cache/sec**: Rate at which mappings are being added or updated in cache for the shard map.
* **Mappings removed from cache/sec**: Rate at which mappings are being removed from cache for the shard map.

Performance counters are created for each cached shard map per process.  

## Notes

The following events trigger the creation of the performance counters:  

* Initialization of the [ShardMapManager](https://docs.microsoft.com/dotnet/api/microsoft.azure.sqldatabase.elasticscale.shardmanagement.shardmapmanager) with [eager loading](https://docs.microsoft.com/dotnet/api/microsoft.azure.sqldatabase.elasticscale.shardmanagement.shardmapmanagerloadpolicy), if the ShardMapManager contains any shard maps. These include the [GetSqlShardMapManager](https://docs.microsoft.com/dotnet/api/microsoft.azure.sqldatabase.elasticscale.shardmanagement.shardmapmanagerfactory.getsqlshardmapmanager) and the [TryGetSqlShardMapManager](https://docs.microsoft.com/dotnet/api/microsoft.azure.sqldatabase.elasticscale.shardmanagement.shardmapmanagerfactory.trygetsqlshardmapmanager) methods.
* Successful lookup of a shard map (using [GetShardMap()](https://msdn.microsoft.com/library/azure/dn824215.aspx), [GetListShardMap()](https://msdn.microsoft.com/library/azure/dn824212.aspx) or [GetRangeShardMap()](https://msdn.microsoft.com/library/azure/dn824173.aspx)).
* Successful creation of shard map using CreateShardMap().

The performance counters will be updated by all cache operations performed on the shard map and mappings. Successful removal of the shard map using DeleteShardMap() results in deletion of the performance counters instance.  

## Best practices

* Creation of the performance category and counters should be performed only once before the creation of ShardMapManager object. Every execution of the command CreatePerformanceCategoryAndCounters() clears the previous counters (losing data reported by all instances) and creates new ones.  
* Performance counter instances are created per process. Any application crash or removal of a shard map from the cache will result in deletion of the performance counters instances.  

### See also

[Elastic Database features overview](elastic-scale-introduction.md)  

[!INCLUDE [elastic-scale-include](../../../includes/elastic-scale-include.md)]

<!--Anchors-->
<!--Image references-->
