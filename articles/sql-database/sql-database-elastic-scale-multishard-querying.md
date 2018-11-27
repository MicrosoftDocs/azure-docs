---
title: Query sharded Azure SQL databases | Microsoft Docs
description: Run queries across shards using the elastic database client library.
services: sql-database
ms.service: sql-database
ms.service: sql-database
ms.subservice: elastic-scale
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer:
manager: craigg
ms.date: 10/05/2018
---
# Multi-shard querying using elastic database tools

## Overview

With the [Elastic Database tools](sql-database-elastic-scale-introduction.md), you can create sharded database solutions. **Multi-shard querying** is used for tasks such as data collection/reporting that require running a query that stretches across several shards. (Contrast this to [data-dependent routing](sql-database-elastic-scale-data-dependent-routing.md), which performs all work on a single shard.) 

1. Get a **RangeShardMap** ([Java](/java/api/com.microsoft.azure.elasticdb.shard.map._range_shard_map), [.NET](https://msdn.microsoft.com/library/azure/dn807318.aspx)) or **ListShardMap** ([Java](/java/api/com.microsoft.azure.elasticdb.shard.map._list_shard_map), [.NET](https://msdn.microsoft.com/library/azure/dn807370.aspx)) using the **TryGetRangeShardMap** ([Java](/java/api/com.microsoft.azure.elasticdb.shard.mapmanager._shard_map_manager.trygetrangeshardmap), [.NET](https://msdn.microsoft.com/library/azure/microsoft.azure.sqldatabase.elasticscale.shardmanagement.shardmapmanager.trygetrangeshardmap.aspx)), the **TryGetListShardMap** ([Java](/java/api/com.microsoft.azure.elasticdb.shard.mapmanager._shard_map_manager.trygetlistshardmap), [.NET](https://msdn.microsoft.com/library/azure/microsoft.azure.sqldatabase.elasticscale.shardmanagement.shardmapmanager.trygetlistshardmap.aspx)), or the **GetShardMap** ([Java](/java/api/com.microsoft.azure.elasticdb.shard.mapmanager._shard_map_manager.getshardmap), [.NET](https://msdn.microsoft.com/library/azure/microsoft.azure.sqldatabase.elasticscale.shardmanagement.shardmapmanager.getshardmap.aspx)) method. See **[Constructing a ShardMapManager](sql-database-elastic-scale-shard-map-management.md#constructing-a-shardmapmanager)** and **[Get a RangeShardMap or ListShardMap](sql-database-elastic-scale-shard-map-management.md#get-a-rangeshardmap-or-listshardmap)**.
2. Create a **MultiShardConnection** ([Java](/java/api/com.microsoft.azure.elasticdb.query.multishard._multi_shard_connection), [.NET](https://msdn.microsoft.com/library/azure/microsoft.azure.sqldatabase.elasticscale.query.multishardconnection.aspx)) object.
3. Create a **MultiShardStatement or MultiShardCommand** ([Java](/java/api/com.microsoft.azure.elasticdb.query.multishard._multi_shard_statement), [.NET](https://msdn.microsoft.com/library/azure/microsoft.azure.sqldatabase.elasticscale.query.multishardcommand.aspx)). 
4. Set the **CommandText property** ([Java](/java/api/com.microsoft.azure.elasticdb.query.multishard._multi_shard_statement), [.NET](https://msdn.microsoft.com/library/azure/microsoft.azure.sqldatabase.elasticscale.query.multishardcommand.commandtext.aspx#P:Microsoft.Azure.SqlDatabase.ElasticScale.Query.MultiShardCommand.CommandText)) to a T-SQL command.
5. Execute the command by calling the **ExecuteQueryAsync or ExecuteReader** ([Java](/java/api/com.microsoft.azure.elasticdb.query.multishard._multi_shard_statement.executeQueryAsync), [.NET](https://msdn.microsoft.com/library/azure/microsoft.azure.sqldatabase.elasticscale.query.multishardcommand.executereader.aspx)) method.
6. View the results using the **MultiShardResultSet or MultiShardDataReader** ([Java](/java/api/com.microsoft.azure.elasticdb.query.multishard._multi_shard_result_set), [.NET](https://msdn.microsoft.com/library/azure/microsoft.azure.sqldatabase.elasticscale.query.multisharddatareader.aspx)) class. 

## Example

The following code illustrates the usage of multi-shard querying using a given **ShardMap** named *myShardMap*. 

```csharp
using (MultiShardConnection conn = new MultiShardConnection(myShardMap.GetShards(), myShardConnectionString)) 
{ 
    using (MultiShardCommand cmd = conn.CreateCommand())
    { 
        cmd.CommandText = "SELECT c1, c2, c3 FROM ShardedTable"; 
        cmd.CommandType = CommandType.Text; 
        cmd.ExecutionOptions = MultiShardExecutionOptions.IncludeShardNameColumn; 
        cmd.ExecutionPolicy = MultiShardExecutionPolicy.PartialResults; 

        using (MultiShardDataReader sdr = cmd.ExecuteReader()) 
        { 
            while (sdr.Read())
            { 
                var c1Field = sdr.GetString(0); 
                var c2Field = sdr.GetFieldValue<int>(1); 
                var c3Field = sdr.GetFieldValue<Int64>(2);
            } 
        } 
    } 
} 
```

A key difference is the construction of multi-shard connections. Where **SqlConnection** operates on a single database, the **MultiShardConnection** takes a ***collection of shards*** as its input. Populate the collection of shards from a shard map. The query is then executed on the collection of shards using **UNION ALL** semantics to assemble a single overall result. Optionally, the name of the shard where the row originates from can be added to the output using the **ExecutionOptions** property on command. 

Note the call to **myShardMap.GetShards()**. This method retrieves all shards from the shard map and provides an easy way to run a query across all relevant databases. The collection of shards for a multi-shard query can be refined further by performing a LINQ query over the collection returned from the call to **myShardMap.GetShards()**. In combination with the partial results policy, the current capability in multi-shard querying has been designed to work well for tens up to hundreds of shards.

A limitation with multi-shard querying is currently the lack of validation for shards and shardlets that are queried. While data-dependent routing verifies that a given shard is part of the shard map at the time of querying, multi-shard queries do not perform this check. This can lead to multi-shard queries running on databases that have  been removed from the shard map.

## Multi-shard queries and split-merge operations

Multi-shard queries do not verify whether shardlets on the queried database are participating in ongoing split-merge operations. (See [Scaling using the Elastic Database split-merge tool](sql-database-elastic-scale-overview-split-and-merge.md).) This can lead to inconsistencies where rows from the same shardlet show for multiple databases in the same multi-shard query. Be aware of these limitations and consider draining ongoing split-merge operations and changes to the shard map while performing multi-shard queries.

[!INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]