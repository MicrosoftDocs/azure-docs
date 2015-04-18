<properties 
	pageTitle="Multi-shard querying" 
	description="Run queries across shards using the elastic database client library." 
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

# Multi-shard querying

## Overview

**Multi-shard querying** is used for tasks such as data collection/reporting that require running a query that stretches across several shards. (Contrast this to [data-dependent routing](sql-database-elastic-scale-data-dependent-routing.md), which performs all work on a single shard.) 

The elastic database client library introduces a new namespace called **Microsoft.Azure.SqlDatabase.ElasticScale.Query** that provides the ability to query multiple shards using a single query and result. It provides a querying abstraction over a collection of shards. It also provides alternative execution policies, in particular partial results, to deal with failures when querying over many shards.  

The main entry point into multi-shard querying is the **MultiShardConnection** class. As with data-dependent routing, the API follows the familiar experience of the **[System.Data.SqlClient](http://msdn.microsoft.com/library/System.Data.SqlClient(v=vs.110).aspx)** classes and methods. With the **SqlClient** library, the first step is to create a **SqlConnection**, then create a **SqlCommand** for the connection, then execute the command through one of the **Execute** methods. Finally, **SqlDataReader** iterates through the result sets returned from the command execution. The experience with the multi-shard query APIs follows these steps: 

1. Create a **MultiShardConnection**.
2. Create a **MultiShardCommand** for a **MultiShardConnection**.
3. Execute the command.
4. Consume the results through the **MultiShardDataReader**. 

A key difference is the construction of multi-shard connections. Where **SqlConnection** operates on a single database, the **MultiShardConnection** takes a ***collection of shards*** as its input. One can populate the collection of shards from a shard map. The query is then executed on the collection of shards using **UNION ALL** semantics to assemble a single overall result. Optionally, the name of the shard where the row originates from can be added to the output using the **ExecutionOptions** property on command. The following code illustrates the usage of multi-shard querying using a given **ShardMap** named *myShardMap*. 

    using (MultiShardConnection conn = new MultiShardConnection( 
                                        myShardMap.GetShards(), 
                                        myShardConnectionString) 
          ) 
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
 

Note the call to **myShardMap.GetShards()**. This method retrieves all shards from the shard map and provides an easy way to run a query across all relevant databases. The collection of shards for a multi-shard query can be refined further by performing a LINQ query over the collection returned from the call to **myShardMap.GetShards()**. In combination with the partial results policy, the current capability in multi-shard querying has been designed to work well for tens up to hundreds of shards.
A limitation with multi-shard querying is currently the lack of validation for shards and shardlets that are queried. While data-dependent routing verifies that a given shard is part of the shard map at the time of querying, multi-shard queries do not perform this check. This can lead to multi-shard queries running on databases that have since been removed from the shard map.

## Multi-shard queries and split-merge operations

Multi-shard queries do not verify whether shardlets on the queried database are participating in ongoing split-merge operations. This can lead to inconsistencies where rows from the same shardlet show for multiple databases in the same multi-shard query. Be aware of these limitations and consider draining ongoing split-merge operations and changes to the shard map while performing multi-shard queries.

[AZURE.INCLUDE [elastic-scale-include](../includes/elastic-scale-include.md)]
