---
title: Sharded SQL connector
description: How to configure and use sharded sql connector.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 02/06/2024
---

# Sharded SQL connector

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

The sharded SQL connector allows queries to be executed over data distributed across any number of SQL servers. 

## Prerequisites 

To connect to sharded SQL servers, you need:

   - SQL Server 2012 or higher, or Azure SQL Database.
   - Network access from the Trino coordinator and workers to SQL Server. Port 1433 is the default port.

### General configuration

The connector can query multiple SQL servers as a single data source. Create a catalog properties file and use `connector.name=sharded-sql` to use sharded SQL connector.

Configuration example:

```
connector.name=sharded_sqlserver
connection-user=<user-name>
connection-password=<user-password>
sharded-cluster=true
shard-config-location=<path-to-sharding-schema>
```


|Property|Description|
|--------|-----------|
|connector.name| Name of the connector For sharded SQL, which should be `sharded_sqlserver`|
|connection-user| User name in SQL server|
|connection-password| Password for the user in SQL server|
|sharded-cluster| Required to be set to `TRUE` for sharded-sql connector|
|shard-config-location| location of the config defining sharding schema|

## Data source authentication

The connector uses user-password authentication to query SQL servers. The same user specified in the configuration is expected to authenticate against all the SQL servers.

## Schema definition

Connector assumes a 2D partition/bucketed layout of the physical data across SQL servers. Schema definition describes this layout.
Currently, only file based sharding schema definition is supported. 

You can specify the location of the sharding schema json in the catalog properties like `shard-config-location=etc/shard-schema.json`.
Configure sharding schema json with desired properties to specify the layout.

The following JSON file describes the configuration for a Trino sharded SQL connector. Here's a breakdown of its structure:

- **tables**: An array of objects, each representing a table in the database. Each table object contains:
  - **schema**: The schema name of the table, which corresponds to the database in the SQL server.
  - **name**: The name of the table.
  - **sharding_schema**: The name of the sharding schema associated with the table, which acts as a reference to the `sharding_schema` described in the next steps.

- **sharding_schema**: An array of objects, each representing a sharding schema. Each sharding schema object contains:
  - **name**: The name of the sharding schema.
  - **partitioned_by**: An array containing one or more columns by which the sharding schema is partitioned.
  - **bucket_count(optional)**: An integer representing the total number of buckets the table is distributed, which defaults to 1.
  - **bucketed_by(optional)**: An array containing one or more columns by which the data is bucketed, note the partitioning and bucketing are hierarchical, which means each partition is bucketed.
  - **partition_map**: An array of objects, each representing a partition within the sharding schema. Each partition object contains:
    - **partition**: The partition value specified in the form `partition-key=partitionvalue`
    - **shards**: An array of objects, each representing a shard within the partition, each element of the array represents a replica, trino queries any one of them at random to fetch data for a partition/buckets. Each shard object contains:
      - **connectionUrl**: The JDBC connection URL to the shard's database.

For example, if two tables `lineitem` and `part` that you want to query using this connector, you can specify them as follows.

```json
	"tables": [
		{
			"schema": "dbo",
			"name": "lineitem",
			"sharding_schema": "schema1"
		},
		{
			"schema": "dbo",
			"name": "part",
			"sharding_schema": "schema2"
		}
    ]

```

> [!NOTE]
> Connector expects all the tables to be present in the SQL server defined in the schema for a table, if that's not the case, queries for that table will fail.

In the previous example, you can specify the layout of table `lineitem` as:

```json
	"sharding_schema": [
		{
			"name": "schema1",
			"partitioned_by": [
				"shipmode"
			],
          		  "bucketed_by": [
              		  "partkey"
           		],
			"bucket_count": 10,
			"partition_map": [
				{
					"partition": "shipmode='AIR'",
                    			"buckets": 1-7,
					"shards": [
						{
							"connectionUrl": "jdbc:sqlserver://sampleserver.database.windows.net:1433;database=test1"
						}
					]
				},
				{
					"partition": "shipmode='AIR'",
                   			"buckets": 8-10,
					"shards": [
						{
							"connectionUrl": "jdbc:sqlserver://sampleserver.database.windows.net:1433;database=test2"
						}
					]
				}                
			]
        }
    ]
```

This example describes: 

-  The data for table line item partitioned by `shipmode`.
-  Each partition has 10 buckets. 
-  Each partition is bucketed_by `partkey` column.
-  Buckets `1-7` for partition value `AIR` is located in `test1` database.
-  Buckets `8-10` for partition value `AIR` is located in `test2` database.
-  Shards are an array of `connectionUrl`. Each member of the array represents a replicaSet. During query execution, Trino selects a shard randomly from the array to query data.


### Partition and bucket pruning

Connector evaluates the query constraints during the planning and performs based on the provided query predicates. This helps speed-up query performance, and allows connector to query large amounts of data.

Bucketing formula to determine assignments using murmur hash function implementation described [here](https://commons.apache.org/proper/commons-codec/apidocs/src-html/org/apache/commons/codec/digest/MurmurHash3.html#line.388).

### Type mapping

Sharded SQL connector supports the same type mappings as SQL server connector [type mappings](https://trino.io/docs/current/connector/sqlserver.html#type-mapping).

### Pushdown

The following pushdown optimizations are supported:
-  Limit pushdown
-  Distributive aggregates
-  Join pushdown 

`JOIN` operation can be pushed down to server only when the connector determines the data is colocated for the build and probe table. Connector determines the data is colocated when
	- the sharding_schema for both `left` and the `right` table is the same.
	- join conditions are superset of partitioning and bucketing keys.

 To use `JOIN` pushdown optimization, catalog property `join-pushdown.strategy` should set to `EAGER`

`AGGREGATE` pushdown for this connector can only be done for distributive aggregates. The optimizer config `optimizer.partial-aggregate-pushdown-enabled` needs to be set to `true` to enable this optimization.
