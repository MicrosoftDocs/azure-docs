---
title: Tokens and the Token Function in Azure Cosmos DB for Apache Cassandra
description: Tokens and the Token Function in Azure Cosmos DB for Apache Cassandra.
author: IriaOsara
ms.author: iriaosara
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: overview
ms.date: 11/04/2022
---

# Tokens and the Token Function in Azure Cosmos DB for Apache Cassandra

[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

This article discusses tokens and token function in Azure Cosmos DB for Apache Cassandra and clarifies the difference between the computation and usage of token in native Cassandra.

## What is a Token

A token is a hashed partition key used to distribute data across the cluster. When data is distributed in Apache Cassandra, a range of tokens are assigned to each node, and you can either assign a token range or this can be done by Cassandra. So, when data is ingested, Cassandra can calculate the token and use that in finding the node to store the newly ingested data. 

## What is the Token Function

The Token Function is a function available via the CQL API of a Cassandra cluster. It provides a means to expose the partitioning function used by the cluster. As a cql function, Token differs from most other functions, since it restricts the parameters passed to it based on the table that you are querying. The number of parameters allowed for the function equates to the number of partition keys for the table being queried, and the data type of the parameters are also restricted to the data types of the corresponding partition keys. 

Note though, this type of restriction on Apache Cassandra is arbitrary, and is only applied on constant values being passed to the function. The most notable usage of the Token function is with applying relations on the token of the partition key. Azure Cosmos DB for Apache Cassandra allows for `SELECT` queries to make use of a `WHERE` clause filtering on the tokens of your data instead of the data itself.

```sql
SELECT token(accountid) FROM uprofile.accounts;

system.token(accountid)
-------------------------
     2601062599670757427
     2976626013207263698

```

```sql
SELECT token(accountid) 
FROM uprofile.accounts 
WHERE token(accountid)=2976626013207263698;

 name  | accountid | state | country
-------+-----------+-------+-------+
 Devon |       405 | NYC   |  USA  |   

```

> [!NOTE] 
> In this usage, only the partition key columns can be specified as parameters to the Token function. 
> This usage of the function is merely a placeholder to allow you make filters directly on the partition hash, instead of the partition key value. This is very useful for breaking up scans into sub parts and parallelizing the read of data from a table.
> Also, Azure Cosmos DB for Apache Cassandra does not allow range queries on partition key.   

## How Token works in Azure Cosmos DB for Apache Cassandra

Azure Cosmos DB for Apache Cassandra uses the default partitioner, Murmur3Partitioner for native Cassandra. It has better performance than other partitioners and hashes key(s) faster. We use the same Murmur3Partitioner function while having some variants to ensure cross-compatibility across the host of 3rd party tools that work against the default Murmur3Partitioner in Apache Cassandra. 

There are certain limitations on usage of the Token function in Cosmos DB’s Cassandra API:

1.	The Token function can only be used as a projection on the partition key columns. That is, it can only be used to project the token of the row(s). 
2.	For a given partition key value, the token value generated on Cosmos DB’s Cassandra API will be different from the token value generated on Apache Cassandra. 
3. The usage of the Token function `WHERE` clauses is the same for both Cosmos DB Cassandra and Apache Cassandra. 

> [!NOTE] 
> The token function should only be used for projecting the actual token(pk) of the row, or for token scans (where it's used in the LHS of where clauses).

### What scenarios are unsupported for Cosmos DB Cassandra API (but are supported on Apache Cassandra)? 
The following scenarios are unsupported for Azure Cosmos DB for Apache Cassandra:
1.	Token Function used as a projection on non-partition key columns. 
2.	Token Function used as a projection on constant values.
3.	Token Function used on the right-hand side of a Token where clause. 

## Next steps

- Get started with [creating a API for Cassandra account, database, and a table](manage-data-python.md) by using a Java application