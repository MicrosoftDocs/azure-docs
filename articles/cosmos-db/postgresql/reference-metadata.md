---
title: System tables – Azure Cosmos DB for PostgreSQL
description: Metadata for distributed query execution
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: reference
ms.date: 02/18/2022
---

# Azure Cosmos DB for PostgreSQL system tables and views

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Azure Cosmos DB for PostgreSQL creates and maintains special tables that contain
information about distributed data in the cluster. The coordinator node
consults these tables when planning how to run queries across the worker nodes.

## Coordinator Metadata

Azure Cosmos DB for PostgreSQL divides each distributed table into multiple logical shards
based on the distribution column. The coordinator then maintains metadata
tables to track statistics and information about the health and location of
these shards.

In this section, we describe each of these metadata tables and their schema.
You can view and query these tables using SQL after logging into the
coordinator node.

> [!NOTE]
>
> clusters running older versions of the Citus Engine may not
> offer all the tables listed below.

### Partition table

The pg\_dist\_partition table stores metadata about which tables in the
database are distributed. For each distributed table, it also stores
information about the distribution method and detailed information about
the distribution column.

| Name         | Type     | Description                                                                                                                                                                                                                                           |
|--------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| logicalrelid | regclass | Distributed table to which this row corresponds. This value references the relfilenode column in the pg_class system catalog table.                                                                                                                   |
| partmethod   | char     | The method used for partitioning / distribution. The values of this column corresponding to different distribution methods are append: ‘a’, hash: ‘h’, reference table: ‘n’                                                                          |
| partkey      | text     | Detailed information about the distribution column including column number, type and other relevant information.                                                                                                                                      |
| colocationid | integer  | Colocation group to which this table belongs. Tables in the same group allow colocated joins and distributed rollups among other optimizations. This value references the colocationid column in the pg_dist_colocation table.                      |
| repmodel     | char     | The method used for data replication. The values of this column corresponding to different replication methods are: Citus statement-based replication: ‘c’, postgresql streaming replication: ‘s’, two-phase commit (for reference tables): ‘t’ |

```
SELECT * from pg_dist_partition;
 logicalrelid  | partmethod |                                                        partkey                                                         | colocationid | repmodel 
---------------+------------+------------------------------------------------------------------------------------------------------------------------+--------------+----------
 github_events | h          | {VAR :varno 1 :varattno 4 :vartype 20 :vartypmod -1 :varcollid 0 :varlevelsup 0 :varnoold 1 :varoattno 4 :location -1} |            2 | c
 (1 row)
```

### Shard table

The pg\_dist\_shard table stores metadata about individual shards of a
table. Pg_dist_shard has information about which distributed table shards
belong to, and statistics about the distribution column for shards.
For append distributed tables, these statistics correspond to min / max
values of the distribution column. For hash distributed tables,
they're hash token ranges assigned to that shard. These statistics are
used for pruning away unrelated shards during SELECT queries.

| Name          | Type     | Description                                                                                                                                                                                  |
|---------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| logicalrelid  | regclass | Distributed table to which this row corresponds. This value references the relfilenode column in the pg_class system catalog table.                                                          |
| shardid       | bigint   | Globally unique identifier assigned to this shard.                                                                                                                                           |
| shardstorage  | char     | Type of storage used for this shard. Different storage types are discussed in the table below.                                                                                               |
| shardminvalue | text     | For append distributed tables, minimum value of the distribution column in this shard (inclusive). For hash distributed tables, minimum hash token value assigned to that shard (inclusive). |
| shardmaxvalue | text     | For append distributed tables, maximum value of the distribution column in this shard (inclusive). For hash distributed tables, maximum hash token value assigned to that shard (inclusive). |

```
SELECT * from pg_dist_shard;
 logicalrelid  | shardid | shardstorage | shardminvalue | shardmaxvalue 
---------------+---------+--------------+---------------+---------------
 github_events |  102026 | t            | 268435456     | 402653183
 github_events |  102027 | t            | 402653184     | 536870911
 github_events |  102028 | t            | 536870912     | 671088639
 github_events |  102029 | t            | 671088640     | 805306367
 (4 rows)
```

#### Shard Storage Types

The shardstorage column in pg\_dist\_shard indicates the type of storage
used for the shard. A brief overview of different shard storage types
and their representation is below.

| Storage Type | Shardstorage value | Description                                                                        |
|--------------|--------------------|------------------------------------------------------------------------------------|
| TABLE        | 't'                | Indicates that shard stores data belonging to a regular distributed table.         |
| COLUMNAR     | 'c'                | Indicates that shard stores columnar data. (Used by distributed cstore_fdw tables) |
| FOREIGN      | 'f'                | Indicates that shard stores foreign data. (Used by distributed file_fdw tables)    |


### Shard information view

In addition to the low-level shard metadata table described above, Azure Cosmos
DB for PostgreSQL provides a `citus_shards` view to easily check:

* Where each shard is (node, and port),
* What kind of table it belongs to, and
* Its size

This view helps you inspect shards to find, among other things, any size
imbalances across nodes.

```postgresql
SELECT * FROM citus_shards;
.
 table_name | shardid | shard_name   | citus_table_type | colocation_id | nodename  | nodeport | shard_size
------------+---------+--------------+------------------+---------------+-----------+----------+------------
 dist       |  102170 | dist_102170  | distributed      |            34 | localhost |     9701 |   90677248
 dist       |  102171 | dist_102171  | distributed      |            34 | localhost |     9702 |   90619904
 dist       |  102172 | dist_102172  | distributed      |            34 | localhost |     9701 |   90701824
 dist       |  102173 | dist_102173  | distributed      |            34 | localhost |     9702 |   90693632
 ref        |  102174 | ref_102174   | reference        |             2 | localhost |     9701 |       8192
 ref        |  102174 | ref_102174   | reference        |             2 | localhost |     9702 |       8192
 dist2      |  102175 | dist2_102175 | distributed      |            34 | localhost |     9701 |     933888
 dist2      |  102176 | dist2_102176 | distributed      |            34 | localhost |     9702 |     950272
 dist2      |  102177 | dist2_102177 | distributed      |            34 | localhost |     9701 |     942080
 dist2      |  102178 | dist2_102178 | distributed      |            34 | localhost |     9702 |     933888
```

The colocation_id refers to the colocation group.

### Shard placement table

The pg\_dist\_placement table tracks the location of shard replicas on
worker nodes. Each replica of a shard assigned to a specific node is
called a shard placement. This table stores information about the health
and location of each shard placement.

| Name        | Type   | Description                                                                                                                               |
|-------------|--------|-------------------------------------------------------------------------------------------------------------------------------------------|
| shardid     | bigint | Shard identifier associated with this placement. This value references the shardid column in the pg_dist_shard catalog table.             |
| shardstate  | int    | Describes the state of this placement. Different shard states are discussed in the section below.                                         |
| shardlength | bigint | For append distributed tables, the size of the shard placement on the worker node in bytes. For hash distributed tables, zero.            |
| placementid | bigint | Unique autogenerated identifier for each individual placement.                                                                           |
| groupid     | int    | Denotes a group of one primary server and zero or more secondary servers when the streaming replication model is used. |

```
SELECT * from pg_dist_placement;
  shardid | shardstate | shardlength | placementid | groupid
 ---------+------------+-------------+-------------+---------
   102008 |          1 |           0 |           1 |       1
   102008 |          1 |           0 |           2 |       2
   102009 |          1 |           0 |           3 |       2
   102009 |          1 |           0 |           4 |       3
   102010 |          1 |           0 |           5 |       3
   102010 |          1 |           0 |           6 |       4
   102011 |          1 |           0 |           7 |       4
```

#### Shard Placement States

Azure Cosmos DB for PostgreSQL manages shard health on a per-placement basis. If a placement
puts the system in an inconsistent state, Azure Cosmos DB for PostgreSQL automatically marks it as unavailable. Placement state is recorded in the pg_dist_shard_placement table,
within the shardstate column. Here's a brief overview of different shard placement states:

| State name | Shardstate value | Description                                                                                                                                                                                                                                                                                                                                                                                                                         |
|------------|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| FINALIZED  | 1                | The state new shards are created in. Shard placements in this state are considered up to date and are used in query planning and execution.                                                                                                                                                                                                                                                                                 |
| INACTIVE   | 3                | Shard placements in this state are considered inactive due to being out-of-sync with other replicas of the same shard. The state can occur when an append, modification (INSERT, UPDATE, DELETE), or a DDL operation fails for this placement. The query planner will ignore placements in this state during planning and execution. Users can synchronize the data in these shards with a finalized replica as a background activity. |
| TO_DELETE  | 4                | If Azure Cosmos DB for PostgreSQL attempts to drop a shard placement in response to a master_apply_delete_command call and fails, the placement is moved to this state. Users can then delete these shards as a subsequent background activity.                                                                                                                                                                                                              |

### Worker node table

The pg\_dist\_node table contains information about the worker nodes in
the cluster.

| Name             | Type    | Description                                                                                                                                                                                |
|------------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| nodeid           | int     | Autogenerated identifier for an individual node.                                                                                                                                          |
| groupid          | int     | Identifier used to denote a group of one primary server and zero or more secondary servers, when the streaming replication model is used. By default it's the same as the nodeid.         |
| nodename         | text    | Host Name or IP Address of the PostgreSQL worker node.                                                                                                                                     |
| nodeport         | int     | Port number on which the PostgreSQL worker node is listening.                                                                                                                              |
| noderack         | text    | (Optional) Rack placement information for the worker node.                                                                                                                                 |
| hasmetadata      | boolean | Reserved for internal use.                                                                                                                                                                 |
| isactive         | boolean | Whether the node is active accepting shard placements.                                                                                                                                     |
| noderole         | text    | Whether the node is a primary or secondary                                                                                                                                                 |
| nodecluster      | text    | The name of the cluster containing this node                                                                                                                                               |
| shouldhaveshards | boolean | If false, shards will be moved off node (drained) when rebalancing, nor will shards from new distributed tables be placed on the node, unless they're colocated with shards already there |

```
SELECT * from pg_dist_node;
 nodeid | groupid | nodename  | nodeport | noderack | hasmetadata | isactive | noderole | nodecluster | shouldhaveshards
--------+---------+-----------+----------+----------+-------------+----------+----------+-------------+------------------
      1 |       1 | localhost |    12345 | default  | f           | t        | primary  | default     | t
      2 |       2 | localhost |    12346 | default  | f           | t        | primary  | default     | t
      3 |       3 | localhost |    12347 | default  | f           | t        | primary  | default     | t
(3 rows)
```

### Distributed object table

The citus.pg\_dist\_object table contains a list of objects such as
types and functions that have been created on the coordinator node and
propagated to worker nodes. When an administrator adds new worker nodes
to the cluster, Azure Cosmos DB for PostgreSQL automatically creates copies of the distributed
objects on the new nodes (in the correct order to satisfy object
dependencies).

| Name                        | Type    | Description                                          |
|-----------------------------|---------|------------------------------------------------------|
| classid                     | oid     | Class of the distributed object                      |
| objid                       | oid     | Object ID of the distributed object                  |
| objsubid                    | integer | Object sub ID of the distributed object, for example, attnum |
| type                        | text    | Part of the stable address used during pg upgrades   |
| object_names                | text[]  | Part of the stable address used during pg upgrades   |
| object_args                 | text[]  | Part of the stable address used during pg upgrades   |
| distribution_argument_index | integer | Only valid for distributed functions/procedures      |
| colocationid                | integer | Only valid for distributed functions/procedures      |

\"Stable addresses\" uniquely identify objects independently of a
specific server. Azure Cosmos DB for PostgreSQL tracks objects during a PostgreSQL upgrade using
stable addresses created with the
[pg\_identify\_object\_as\_address()](https://www.postgresql.org/docs/current/functions-info.html#FUNCTIONS-INFO-OBJECT-TABLE)
function.

Here\'s an example of how `create_distributed_function()` adds entries
to the `citus.pg_dist_object` table:

```psql
CREATE TYPE stoplight AS enum ('green', 'yellow', 'red');

CREATE OR REPLACE FUNCTION intersection()
RETURNS stoplight AS $$
DECLARE
        color stoplight;
BEGIN
        SELECT *
          FROM unnest(enum_range(NULL::stoplight)) INTO color
         ORDER BY random() LIMIT 1;
        RETURN color;
END;
$$ LANGUAGE plpgsql VOLATILE;

SELECT create_distributed_function('intersection()');

-- will have two rows, one for the TYPE and one for the FUNCTION
TABLE citus.pg_dist_object;
```

```
-[ RECORD 1 ]---------------+------
classid                     | 1247
objid                       | 16780
objsubid                    | 0
type                        |
object_names                |
object_args                 |
distribution_argument_index |
colocationid                |
-[ RECORD 2 ]---------------+------
classid                     | 1255
objid                       | 16788
objsubid                    | 0
type                        |
object_names                |
object_args                 |
distribution_argument_index |
colocationid                |
```

### Distributed tables view

The `citus_tables` view shows a summary of all tables managed by Azure Cosmos
DB for PostgreSQL (distributed and reference tables). The view combines
information from Azure Cosmos DB for PostgreSQL metadata tables for an easy,
human-readable overview of these table properties:

* Table type
* Distribution column
* Colocation group ID
* Human-readable size
* Shard count
* Owner (database user)
* Access method (heap or columnar)

Here’s an example:

```postgresql
SELECT * FROM citus_tables;
┌────────────┬──────────────────┬─────────────────────┬───────────────┬────────────┬─────────────┬─────────────┬───────────────┐
│ table_name │ citus_table_type │ distribution_column │ colocation_id │ table_size │ shard_count │ table_owner │ access_method │
├────────────┼──────────────────┼─────────────────────┼───────────────┼────────────┼─────────────┼─────────────┼───────────────┤
│ foo.test   │ distributed      │ test_column         │             1 │ 0 bytes    │          32 │ citus       │ heap          │
│ ref        │ reference        │ <none>              │             2 │ 24 GB      │           1 │ citus       │ heap          │
│ test       │ distributed      │ id                  │             1 │ 248 TB     │          32 │ citus       │ heap          │
└────────────┴──────────────────┴─────────────────────┴───────────────┴────────────┴─────────────┴─────────────┴───────────────┘
```

### Time partitions view

Azure Cosmos DB for PostgreSQL provides UDFs to manage partitions for the Timeseries Data
use case. It also maintains a `time_partitions` view to inspect the partitions
it manages.

Columns:

* **parent_table** the table that is partitioned
* **partition_column** the column on which the parent table is partitioned
* **partition** the name of a partition table
* **from_value** lower bound in time for rows in this partition
* **to_value** upper bound in time for rows in this partition
* **access_method** heap for row-based storage, and columnar for columnar
  storage

```postgresql
SELECT * FROM time_partitions;
┌────────────────────────┬──────────────────┬─────────────────────────────────────────┬─────────────────────┬─────────────────────┬───────────────┐
│      parent_table      │ partition_column │                partition                │     from_value      │      to_value       │ access_method │
├────────────────────────┼──────────────────┼─────────────────────────────────────────┼─────────────────────┼─────────────────────┼───────────────┤
│ github_columnar_events │ created_at       │ github_columnar_events_p2015_01_01_0000 │ 2015-01-01 00:00:00 │ 2015-01-01 02:00:00 │ columnar      │
│ github_columnar_events │ created_at       │ github_columnar_events_p2015_01_01_0200 │ 2015-01-01 02:00:00 │ 2015-01-01 04:00:00 │ columnar      │
│ github_columnar_events │ created_at       │ github_columnar_events_p2015_01_01_0400 │ 2015-01-01 04:00:00 │ 2015-01-01 06:00:00 │ columnar      │
│ github_columnar_events │ created_at       │ github_columnar_events_p2015_01_01_0600 │ 2015-01-01 06:00:00 │ 2015-01-01 08:00:00 │ heap          │
└────────────────────────┴──────────────────┴─────────────────────────────────────────┴─────────────────────┴─────────────────────┴───────────────┘
```

### Colocation group table

The pg\_dist\_colocation table contains information about which tables\' shards
should be placed together, or [colocated](concepts-colocation.md).  When two
tables are in the same colocation group, Azure Cosmos DB for PostgreSQL ensures shards with
the same distribution column values will be placed on the same worker nodes.
Colocation enables join optimizations, certain distributed rollups, and foreign
key support. Shard colocation is inferred when the shard counts, replication
factors, and partition column types all match between two tables; however, a
custom colocation group may be specified when creating a distributed table, if
so desired.

| Name                   | Type | Description                                                                   |
|------------------------|------|-------------------------------------------------------------------------------|
| colocationid           | int  | Unique identifier for the colocation group this row corresponds to.          |
| shardcount             | int  | Shard count for all tables in this colocation group                          |
| replicationfactor      | int  | Replication factor for all tables in this colocation group.                  |
| distributioncolumntype | oid  | The type of the distribution column for all tables in this colocation group. |

```
SELECT * from pg_dist_colocation;
  colocationid | shardcount | replicationfactor | distributioncolumntype 
 --------------+------------+-------------------+------------------------
			 2 |         32 |                 2 |                     20
  (1 row)
```

### Rebalancer strategy table

This table defines strategies that
[rebalance_table_shards](reference-functions.md#rebalance_table_shards)
can use to determine where to move shards.

| Name                           | Type    | Description                                                                                                                                       |
|--------------------------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| default_strategy               | boolean | Whether rebalance_table_shards should choose this strategy by default. Use citus_set_default_rebalance_strategy to update this column             |
| shard_cost_function            | regproc | Identifier for a cost function, which must take a shardid as bigint, and return its notion of a cost, as type real                                |
| node_capacity_function         | regproc | Identifier for a capacity function, which must take a nodeid as int, and return its notion of node capacity as type real                          |
| shard_allowed_on_node_function | regproc | Identifier for a function that given shardid bigint, and nodeidarg int, returns boolean for whether Azure Cosmos DB for PostgreSQL may store the shard on the node |
| default_threshold              | float4  | Threshold for deeming a node too full or too empty, which determines when the rebalance_table_shards should try to move shards                    |
| minimum_threshold              | float4  | A safeguard to prevent the threshold argument of rebalance_table_shards() from being set too low                                                  |

By default Cosmos DB for PostgreSQL ships with these strategies in the table:

```postgresql
SELECT * FROM pg_dist_rebalance_strategy;
```

```
-[ RECORD 1 ]-------------------+-----------------------------------
Name                            | by_shard_count
default_strategy                | true
shard_cost_function             | citus_shard_cost_1
node_capacity_function          | citus_node_capacity_1
shard_allowed_on_node_function  | citus_shard_allowed_on_node_true
default_threshold               | 0
minimum_threshold               | 0
-[ RECORD 2 ]-------------------+-----------------------------------
Name                            | by_disk_size
default_strategy                | false
shard_cost_function             | citus_shard_cost_by_disk_size
node_capacity_function          | citus_node_capacity_1
shard_allowed_on_node_function  | citus_shard_allowed_on_node_true
default_threshold               | 0.1
minimum_threshold               | 0.01
```

The default strategy, `by_shard_count`, assigns every shard the same
cost. Its effect is to equalize the shard count across nodes. The other
predefined strategy, `by_disk_size`, assigns a cost to each shard
matching its disk size in bytes plus that of the shards that are
colocated with it. The disk size is calculated using
`pg_total_relation_size`, so it includes indices. This strategy attempts
to achieve the same disk space on every node. Note the threshold of 0.1--it prevents unnecessary shard movement caused by insignificant
differences in disk space.

#### Creating custom rebalancer strategies

Here are examples of functions that can be used within new shard rebalancer
strategies, and registered in the
[pg_dist_rebalance_strategy](reference-metadata.md?#rebalancer-strategy-table)
with the
[citus_add_rebalance_strategy](reference-functions.md#citus_add_rebalance_strategy)
function.

-   Setting a node capacity exception by hostname pattern:

    ```postgresql
    CREATE FUNCTION v2_node_double_capacity(nodeidarg int)
        RETURNS boolean AS $$
        SELECT
            (CASE WHEN nodename LIKE '%.v2.worker.citusdata.com' THEN 2 ELSE 1 END)
        FROM pg_dist_node where nodeid = nodeidarg
        $$ LANGUAGE sql;
    ```

-   Rebalancing by number of queries that go to a shard, as measured by the
    [citus_stat_statements](reference-metadata.md#query-statistics-table):

    ```postgresql
    -- example of shard_cost_function

    CREATE FUNCTION cost_of_shard_by_number_of_queries(shardid bigint)
        RETURNS real AS $$
        SELECT coalesce(sum(calls)::real, 0.001) as shard_total_queries
        FROM citus_stat_statements
        WHERE partition_key is not null
            AND get_shard_id_for_distribution_column('tab', partition_key) = shardid;
    $$ LANGUAGE sql;
    ```

-   Isolating a specific shard (10000) on a node (address \'10.0.0.1\'):

    ```postgresql
    -- example of shard_allowed_on_node_function

    CREATE FUNCTION isolate_shard_10000_on_10_0_0_1(shardid bigint, nodeidarg int)
        RETURNS boolean AS $$
        SELECT
            (CASE WHEN nodename = '10.0.0.1' THEN shardid = 10000 ELSE shardid != 10000 END)
        FROM pg_dist_node where nodeid = nodeidarg
        $$ LANGUAGE sql;

    -- The next two definitions are recommended in combination with the above function.
    -- This way the average utilization of nodes is not impacted by the isolated shard.
    CREATE FUNCTION no_capacity_for_10_0_0_1(nodeidarg int)
        RETURNS real AS $$
        SELECT
            (CASE WHEN nodename = '10.0.0.1' THEN 0 ELSE 1 END)::real
        FROM pg_dist_node where nodeid = nodeidarg
        $$ LANGUAGE sql;
    CREATE FUNCTION no_cost_for_10000(shardid bigint)
        RETURNS real AS $$
        SELECT
            (CASE WHEN shardid = 10000 THEN 0 ELSE 1 END)::real
        $$ LANGUAGE sql;
    ```

### Query statistics table

Azure Cosmos DB for PostgreSQL provides `citus_stat_statements` for stats about how queries are
being executed, and for whom. It\'s analogous to (and can be joined
with) the
[pg\_stat\_statements](https://www.postgresql.org/docs/current/static/pgstatstatements.html)
view in PostgreSQL, which tracks statistics about query speed.

This view can trace queries to originating tenants in a multi-tenant
application, which helps for deciding when to do tenant isolation.

| Name          | Type   | Description                                                                      |
|---------------|--------|----------------------------------------------------------------------------------|
| queryid       | bigint | identifier (good for pg_stat_statements joins)                                   |
| userid        | oid    | user who ran the query                                                           |
| dbid          | oid    | database instance of coordinator                                                 |
| query         | text   | anonymized query string                                                          |
| executor      | text   | Citus executor used: adaptive, real-time, task-tracker, router, or insert-select |
| partition_key | text   | value of distribution column in router-executed queries, else NULL               |
| calls         | bigint | number of times the query was run                                                |

```sql
-- create and populate distributed table
create table foo ( id int );
select create_distributed_table('foo', 'id');
insert into foo select generate_series(1,100);

-- enable stats
-- pg_stat_statements must be in shared_preload libraries
create extension pg_stat_statements;

select count(*) from foo;
select * from foo where id = 42;

select * from citus_stat_statements;
```

Results:

```
-[ RECORD 1 ]-+----------------------------------------------
queryid       | -909556869173432820
userid        | 10
dbid          | 13340
query         | insert into foo select generate_series($1,$2)
executor      | insert-select
partition_key |
calls         | 1
-[ RECORD 2 ]-+----------------------------------------------
queryid       | 3919808845681956665
userid        | 10
dbid          | 13340
query         | select count(*) from foo;
executor      | adaptive
partition_key |
calls         | 1
-[ RECORD 3 ]-+----------------------------------------------
queryid       | 5351346905785208738
userid        | 10
dbid          | 13340
query         | select * from foo where id = $1
executor      | adaptive
partition_key | 42
calls         | 1
```

Caveats:

-   The stats data isn't replicated, and won\'t survive database
    crashes or failover
-   Tracks a limited number of queries, set by the
    `pg_stat_statements.max` GUC (default 5000)
-   To truncate the table, use the `citus_stat_statements_reset()`
    function

### Distributed Query Activity

Azure Cosmos DB for PostgreSQL provides special views to watch queries and locks throughout the
cluster, including shard-specific queries used internally to build
results for distributed queries.

-   **citus\_dist\_stat\_activity**: shows the distributed queries that
    are executing on all nodes. A superset of `pg_stat_activity`, usable
    wherever the latter is.
-   **citus\_worker\_stat\_activity**: shows queries on workers,
    including fragment queries against individual shards.
-   **citus\_lock\_waits**: Blocked queries throughout the cluster.

The first two views include all columns of
[pg\_stat\_activity](https://www.postgresql.org/docs/current/static/monitoring-stats.html#PG-STAT-ACTIVITY-VIEW)
plus the host host/port of the worker that initiated the query and the
host/port of the coordinator node of the cluster.

For example, consider counting the rows in a distributed table:

```postgresql
-- run from worker on localhost:9701

SELECT count(*) FROM users_table;
```

We can see that the query appears in `citus_dist_stat_activity`:

```postgresql
SELECT * FROM citus_dist_stat_activity;

-[ RECORD 1 ]----------+----------------------------------
query_hostname         | localhost
query_hostport         | 9701
master_query_host_name | localhost
master_query_host_port | 9701
transaction_number     | 1
transaction_stamp      | 2018-10-05 13:27:20.691907+03
datid                  | 12630
datname                | postgres
pid                    | 23723
usesysid               | 10
usename                | citus
application\_name      | psql
client\_addr           | 
client\_hostname       | 
client\_port           | -1
backend\_start         | 2018-10-05 13:27:14.419905+03
xact\_start            | 2018-10-05 13:27:16.362887+03
query\_start           | 2018-10-05 13:27:20.682452+03
state\_change          | 2018-10-05 13:27:20.896546+03
wait\_event_type       | Client
wait\_event            | ClientRead
state                  | idle in transaction
backend\_xid           | 
backend\_xmin          | 
query                  | SELECT count(*) FROM users_table;
backend\_type          | client backend
```

This query requires information from all shards. Some of the information is in
shard `users_table_102038`, which happens to be stored in `localhost:9700`. We can
see a query accessing the shard by looking at the `citus_worker_stat_activity`
view:

```postgresql
SELECT * FROM citus_worker_stat_activity;

-[ RECORD 1 ]----------+-----------------------------------------------------------------------------------------
query_hostname         | localhost
query_hostport         | 9700
master_query_host_name | localhost
master_query_host_port | 9701
transaction_number     | 1
transaction_stamp      | 2018-10-05 13:27:20.691907+03
datid                  | 12630
datname                | postgres
pid                    | 23781
usesysid               | 10
usename                | citus
application\_name      | citus
client\_addr           | ::1
client\_hostname       | 
client\_port           | 51773
backend\_start         | 2018-10-05 13:27:20.75839+03
xact\_start            | 2018-10-05 13:27:20.84112+03
query\_start           | 2018-10-05 13:27:20.867446+03
state\_change          | 2018-10-05 13:27:20.869889+03
wait\_event_type       | Client
wait\_event            | ClientRead
state                  | idle in transaction
backend\_xid           | 
backend\_xmin          | 
query                  | COPY (SELECT count(*) AS count FROM users_table_102038 users_table WHERE true) TO STDOUT
backend\_type          | client backend
```

The `query` field shows data being copied out of the shard to be
counted.

> [!NOTE]
> If a router query (e.g. single-tenant in a multi-tenant application, `SELECT
> * FROM table WHERE tenant_id = X`) is executed without a transaction block,
> then master\_query\_host\_name and master\_query\_host\_port columns will be
> NULL in citus\_worker\_stat\_activity.

Here are examples of useful queries you can build using
`citus_worker_stat_activity`:

```postgresql
-- active queries' wait events on a certain node

SELECT query, wait_event_type, wait_event
  FROM citus_worker_stat_activity
 WHERE query_hostname = 'xxxx' and state='active';

-- active queries' top wait events

SELECT wait_event, wait_event_type, count(*)
  FROM citus_worker_stat_activity
 WHERE state='active'
 GROUP BY wait_event, wait_event_type
 ORDER BY count(*) desc;

-- total internal connections generated per node by Azure Cosmos DB for PostgreSQL

SELECT query_hostname, count(*)
  FROM citus_worker_stat_activity
 GROUP BY query_hostname;

-- total internal active connections generated per node by Azure Cosmos DB for PostgreSQL

SELECT query_hostname, count(*)
  FROM citus_worker_stat_activity
 WHERE state='active'
 GROUP BY query_hostname;
```

The next view is `citus_lock_waits`. To see how it works, we can generate a
locking situation manually. First we'll set up a test table from the
coordinator:

```postgresql
CREATE TABLE numbers AS
  SELECT i, 0 AS j FROM generate_series(1,10) AS i;
SELECT create_distributed_table('numbers', 'i');
```

Then, using two sessions on the coordinator, we can run this sequence of
statements:

```postgresql
-- session 1                           -- session 2
-------------------------------------  -------------------------------------
BEGIN;
UPDATE numbers SET j = 2 WHERE i = 1;
                                       BEGIN;
                                       UPDATE numbers SET j = 3 WHERE i = 1;
                                       -- (this blocks)
```

The `citus_lock_waits` view shows the situation.

```postgresql
SELECT * FROM citus_lock_waits;

-[ RECORD 1 ]-------------------------+----------------------------------------
waiting_pid                           | 88624
blocking_pid                          | 88615
blocked_statement                     | UPDATE numbers SET j = 3 WHERE i = 1;
current_statement_in_blocking_process | UPDATE numbers SET j = 2 WHERE i = 1;
waiting_node_id                       | 0
blocking_node_id                      | 0
waiting_node_name                     | coordinator_host
blocking_node_name                    | coordinator_host
waiting_node_port                     | 5432
blocking_node_port                    | 5432
```

In this example the queries originated on the coordinator, but the view
can also list locks between queries originating on workers (executed
with Azure Cosmos DB for PostgreSQL MX for instance).

## Next steps

* Learn how some [Azure Cosmos DB for PostgreSQL functions](reference-functions.md) alter system tables
* Review the concepts of [nodes and tables](concepts-nodes.md)
