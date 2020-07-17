---
title: System tables – Hyperscale (Citus) - Azure Database for PostgreSQL
description: Metadata for distributed query execution
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: reference
ms.date: 07/17/2020
---

# System tables and views

## Coordinator Metadata

Hyperscale (Citus) divides each distributed table into multiple logical shards
based on the distribution column. The coordinator then maintains metadata
tables to track statistics and information about the health and location of
these shards. In this section, we describe each of these metadata tables and
their schema. You can view and query these tables using SQL after logging into
the coordinator node.

### Partition table {#partition_table}

The pg\_dist\_partition table stores metadata about which tables in the
database are distributed. For each distributed table, it also stores
information about the distribution method and detailed information about
the distribution column.

+---------+-------------+----------------------------------------------+
| Name    | Type        | Description                                  |
+=========+=============+==============================================+
| logical | > regclass  | | Distributed table to which this row        |
| relid   |             |   corresponds. This value references         |
|         |             | | the relfilenode column in the pg\_class    |
|         |             |   system catalog table.                      |
+---------+-------------+----------------------------------------------+
| > partm | > char      | | The method used for partitioning /         |
| ethod   |             |   distribution. The values of this           |
|         |             | | column corresponding to different          |
|         |             |   distribution methods are :-                |
|         |             | | append: \'a\'                              |
|         |             | | hash: \'h\'                                |
|         |             | | reference table: \'n\'                     |
+---------+-------------+----------------------------------------------+
| > partk | > text      | | Detailed information about the             |
| ey      |             |   distribution column including column       |
|         |             | | number, type and other relevant            |
|         |             |   information.                               |
+---------+-------------+----------------------------------------------+
| > coloc | > integer   | | Co-location group to which this table      |
| ationid |             |   belongs. Tables in the same group          |
|         |             | | allow co-located joins and distributed     |
|         |             |   rollups among other                        |
|         |             | | optimizations. This value references the   |
|         |             |   colocationid column in the                 |
|         |             | | pg\_dist\_colocation table.                |
+---------+-------------+----------------------------------------------+
| > repmo | > char      | | The method used for data replication. The  |
| del     |             |   values of this column                      |
|         |             | | corresponding to different replication     |
|         |             |   methods are :-                             |
|         |             | | \* citus statement-based replication:      |
|         |             |   \'c\'                                      |
|         |             | | \* postgresql streaming replication: \'s\' |
|         |             | | \* two-phase commit (for reference         |
|         |             |   tables): \'t\'                             |
+---------+-------------+----------------------------------------------+

```
SELECT * from pg_dist_partition;
 logicalrelid  | partmethod |                                                        partkey                                                         | colocationid | repmodel 
---------------+------------+------------------------------------------------------------------------------------------------------------------------+--------------+----------
 github_events | h          | {VAR :varno 1 :varattno 4 :vartype 20 :vartypmod -1 :varcollid 0 :varlevelsup 0 :varnoold 1 :varoattno 4 :location -1} |            2 | c
 (1 row)
```

### Shard table {#pg_dist_shard}

The pg\_dist\_shard table stores metadata about individual shards of a
table. This includes information about which distributed table the shard
belongs to and statistics about the distribution column for that shard.
For append distributed tables, these statistics correspond to min / max
values of the distribution column. In case of hash distributed tables,
they are hash token ranges assigned to that shard. These statistics are
used for pruning away unrelated shards during SELECT queries.

+---------+-------------+----------------------------------------------+
| Name    | Type        | Description                                  |
+=========+=============+==============================================+
| logical | > regclass  | | Distributed table to which this shard      |
| relid   |             |   belongs. This value references the         |
|         |             | | relfilenode column in the pg\_class system |
|         |             |   catalog table.                             |
+---------+-------------+----------------------------------------------+
| > shard | > bigint    | | Globally unique identifier assigned to     |
| id      |             |   this shard.                                |
+---------+-------------+----------------------------------------------+
| shardst | > char      | | Type of storage used for this shard.       |
| orage   |             |   Different storage types are                |
|         |             | | discussed in the table below.              |
+---------+-------------+----------------------------------------------+
| shardmi | > text      | | For append distributed tables, minimum     |
| nvalue  |             |   value of the distribution column           |
|         |             | | in this shard (inclusive).                 |
|         |             | | For hash distributed tables, minimum hash  |
|         |             |   token value assigned to that               |
|         |             | | shard (inclusive).                         |
+---------+-------------+----------------------------------------------+
| shardma | > text      | | For append distributed tables, maximum     |
| xvalue  |             |   value of the distribution column           |
|         |             | | in this shard (inclusive).                 |
|         |             | | For hash distributed tables, maximum hash  |
|         |             |   token value assigned to that               |
|         |             | | shard (inclusive).                         |
+---------+-------------+----------------------------------------------+

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

+---------+-------------+----------------------------------------------+
| Storage | Shardstorag | Description                                  |
| Type    | e           |                                              |
|         | value       |                                              |
+=========+=============+==============================================+
| > TABLE | > \'t\'     | | Indicates that shard stores data belonging |
|         |             |   to a regular                               |
|         |             | | distributed table.                         |
+---------+-------------+----------------------------------------------+
| > COLUM | > \'c\'     | | Indicates that shard stores columnar data. |
| NAR     |             |   (Used by                                   |
|         |             | | distributed cstore\_fdw tables)            |
+---------+-------------+----------------------------------------------+
| > FOREI | > \'f\'     | | Indicates that shard stores foreign data.  |
| GN      |             |   (Used by                                   |
|         |             | | distributed file\_fdw tables)              |
+---------+-------------+----------------------------------------------+

### Shard placement table {#placements}

The pg\_dist\_placement table tracks the location of shard replicas on
worker nodes. Each replica of a shard assigned to a specific node is
called a shard placement. This table stores information about the health
and location of each shard placement.

+---------+-------------+----------------------------------------------+
| Name    | Type        | Description                                  |
+=========+=============+==============================================+
| shardid | > bigint    | | Shard identifier associated with this      |
|         |             |   placement. This value references           |
|         |             | | the shardid column in the pg\_dist\_shard  |
|         |             |   catalog table.                             |
+---------+-------------+----------------------------------------------+
| shardst | > int       | | Describes the state of this placement.     |
| ate     |             |   Different shard states are                 |
|         |             | | discussed in the section below.            |
+---------+-------------+----------------------------------------------+
| shardle | > bigint    | | For append distributed tables, the size of |
| ngth    |             |   the shard placement on the                 |
|         |             | | worker node in bytes.                      |
|         |             | | For hash distributed tables, zero.         |
+---------+-------------+----------------------------------------------+
| placeme | > bigint    | | Unique auto-generated identifier for each  |
| ntid    |             |   individual placement.                      |
+---------+-------------+----------------------------------------------+
| groupid | > int       | | Identifier used to denote a group of one   |
|         |             |   primary server and zero or more            |
|         |             | | secondary servers, when the streaming      |
|         |             |   replication model is used.                 |
+---------+-------------+----------------------------------------------+

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

Hyperscale (Citus) manages shard health on a per-placement basis and
automatically marks a placement as unavailable if leaving the placement in
service would put the cluster in an inconsistent state. The shardstate column
in the pg\_dist\_placement table is used to store the state of shard
placements. A brief overview of different shard placement states and their
representation is below.

+---------+-------------+----------------------------------------------+
| State   | Shardstate  | Description                                  |
| name    | value       |                                              |
+=========+=============+==============================================+
| > FINAL | > 1         | | This is the state new shards are created   |
| IZED    |             |   in. Shard placements                       |
|         |             | | in this state are considered up-to-date    |
|         |             |   and are used in query                      |
|         |             | | planning and execution.                    |
+---------+-------------+----------------------------------------------+
| > INACT | > 3         | | Shard placements in this state are         |
| IVE     |             |   considered inactive due to                 |
|         |             | | being out-of-sync with other replicas of   |
|         |             |   the same shard. This                       |
|         |             | | can occur when an append, modification     |
|         |             |   (INSERT, UPDATE or                         |
|         |             | | DELETE ) or a DDL operation fails for this |
|         |             |   placement. The query                       |
|         |             | | planner will ignore placements in this     |
|         |             |   state during planning and                  |
|         |             | | execution. Users can synchronize the data  |
|         |             |   in these shards with                       |
|         |             | | a finalized replica as a background        |
|         |             |   activity.                                  |
+---------+-------------+----------------------------------------------+
| > TO\_D | > 4         | | If Hyperscale (Citus) attempts to drop a shard          |
| ELETE   |             |   placement in response to a                 |
|         |             | | master\_apply\_delete\_command call and    |
|         |             |   fails, the placement is                    |
|         |             | | moved to this state. Users can then delete |
|         |             |   these shards as a                          |
|         |             | | subsequent background activity.            |
+---------+-------------+----------------------------------------------+

### Worker node table {#pg_dist_node}

The pg\_dist\_node table contains information about the worker nodes in
the cluster.

+----------+-------------+---------------------------------------------+
| Name     | Type        | Description                                 |
+==========+=============+=============================================+
| nodeid   | > int       | | Auto-generated identifier for an          |
|          |             |   individual node.                          |
+----------+-------------+---------------------------------------------+
| groupid  | > int       | | Identifier used to denote a group of one  |
|          |             |   primary server and zero or more           |
|          |             | | secondary servers, when the streaming     |
|          |             |   replication model is used. By             |
|          |             | | default it is the same as the nodeid.     |
+----------+-------------+---------------------------------------------+
| nodename | > text      | | Host Name or IP Address of the PostgreSQL |
|          |             |   worker node.                              |
+----------+-------------+---------------------------------------------+
| nodeport | > int       | | Port number on which the PostgreSQL       |
|          |             |   worker node is listening.                 |
+----------+-------------+---------------------------------------------+
| noderack | > text      | | (Optional) Rack placement information for |
|          |             |   the worker node.                          |
+----------+-------------+---------------------------------------------+
| hasmetad | > boolean   | | Reserved for internal use.                |
| ata      |             |                                             |
+----------+-------------+---------------------------------------------+
| isactive | > boolean   | | Whether the node is active accepting      |
|          |             |   shard placements.                         |
+----------+-------------+---------------------------------------------+
| noderole | > text      | | Whether the node is a primary or          |
|          |             |   secondary                                 |
+----------+-------------+---------------------------------------------+
| nodeclus | > text      | | The name of the cluster containing this   |
| ter      |             |   node                                      |
+----------+-------------+---------------------------------------------+
| shouldha | > boolean   | | If false, shards will be moved off node   |
| veshards |             |   (drained) when rebalancing,               |
|          |             | | nor will shards from new distributed      |
|          |             |   tables be placed on the node,             |
|          |             | | unless they are colocated with shards     |
|          |             |   already there                             |
+----------+-------------+---------------------------------------------+

```
SELECT * from pg_dist_node;
 nodeid | groupid | nodename  | nodeport | noderack | hasmetadata | isactive | noderole | nodecluster | shouldhaveshards
--------+---------+-----------+----------+----------+-------------+----------+----------+-------------+------------------
	  1 |       1 | localhost |    12345 | default  | f           | t        | primary  | default     | t
	  2 |       2 | localhost |    12346 | default  | f           | t        | primary  | default     | t
	  3 |       3 | localhost |    12347 | default  | f           | t        | primary  | default     | t
(3 rows)
```

### Distributed object table {#pg_dist_object}

The citus.pg\_dist\_object table contains a list of objects such as
types and functions that have been created on the coordinator node and
propagated to worker nodes. When an administrator adds new worker nodes
to the cluster, Hyperscale (Citus) automatically creates copies of the distributed
objects on the new nodes (in the correct order to satisfy object
dependencies).

  ------------------------------------------------------------------------------------
  Name                            Type       Description
  ------------------------------- ---------- -----------------------------------------
  classid                         oid        Class of the distributed object

  objid                           oid        Object id of the distributed object

  objsubid                        integer    Object sub id of the distributed object,
                                             e.g. attnum

  type                            text       Part of the stable address used during pg
                                             upgrades

  object\_names                   text\[\]   Part of the stable address used during pg
                                             upgrades

  object\_args                    text\[\]   Part of the stable address used during pg
                                             upgrades

  distribution\_argument\_index   integer    Only valid for distributed
                                             functions/procedures

  colocationid                    integer    Only valid for distributed
                                             functions/procedures
  ------------------------------------------------------------------------------------

\"Stable addresses\" uniquely identify objects independently of a
specific server. Hyperscale (Citus) tracks objects during a PostgreSQL upgrade using
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

### Co-location group table {#colocation_group_table}

The pg\_dist\_colocation table contains information about which tables\' shards
should be placed together, or `co-located <colocation>`{.interpreted-text
role="ref"}. When two tables are in the same co-location group, Hyperscale
(Citus) ensures shards with the same partition values will be placed on the
same worker nodes. This enables join optimizations, certain distributed
rollups, and foreign key support. Shard co-location is inferred when the shard
counts, replication factors, and partition column types all match between two
tables; however, a custom co-location group may be specified when creating a
distributed table, if so desired.

+-------------+------------+-------------------------------------------+
| Name        | Type       | Description                               |
+=============+============+===========================================+
| colocationi | > int      | | Unique identifier for the co-location   |
| d           |            |   group this row corresponds to.          |
+-------------+------------+-------------------------------------------+
| shardcount  | > int      | | Shard count for all tables in this      |
|             |            |   co-location group                       |
+-------------+------------+-------------------------------------------+
| replication | > int      | | Replication factor for all tables in    |
| factor      |            |   this co-location group.                 |
+-------------+------------+-------------------------------------------+
| distributio | > oid      | | The type of the distribution column for |
| ncolumntype |            |   all tables in this                      |
|             |            | | co-location group.                      |
+-------------+------------+-------------------------------------------+

```
SELECT * from pg_dist_colocation;
  colocationid | shardcount | replicationfactor | distributioncolumntype 
 --------------+------------+-------------------+------------------------
			 2 |         32 |                 2 |                     20
  (1 row)
```

### Rebalancer strategy table {#pg_dist_rebalance_strategy}

This table defines strategies that `rebalance_table_shards`{.interpreted-text
role="ref"} can use to determine where to move shards.

+-----------------+-----------+----------------------------------------+
| Name            | Type      | Description                            |
+=================+===========+========================================+
| name            | > name    | | Unique name for the strategy         |
+-----------------+-----------+----------------------------------------+
| default\_strate | > boolean | | Whether                              |
| gy              |           |   `rebalance_table_shards`{.interprete |
|                 |           | d-text                                 |
|                 |           |   role="ref"} should choose this       |
|                 |           |   strategy by                          |
|                 |           | | default. Use                         |
|                 |           |   `citus_set_default_rebalance_strateg |
|                 |           | y`{.interpreted-text                   |
|                 |           |   role="ref"} to update                |
|                 |           | | this column                          |
+-----------------+-----------+----------------------------------------+
| shard\_cost\_fu | > regproc | | Identifier for a cost function,      |
| nction          |           |   which must take a shardid as bigint, |
|                 |           | | and return its notion of a cost, as  |
|                 |           |   type real                            |
+-----------------+-----------+----------------------------------------+
| node\_capacity\ | > regproc | | Identifier for a capacity function,  |
| _function       |           |   which must take a nodeid as int,     |
|                 |           | | and return its notion of node        |
|                 |           |   capacity as type real                |
+-----------------+-----------+----------------------------------------+
| shard\_allowed\ | > regproc | | Identifier for a function that given |
| _on\_node\_func |           |   shardid bigint, and nodeidarg int,   |
| tion            |           | | returns boolean for whether the      |
|                 |           |   shard is allowed to be stored on the |
|                 |           | | node                                 |
+-----------------+-----------+----------------------------------------+
| default\_thresh | > float4  | | Threshold for deeming a node too     |
| old             |           |   full or too empty, which determines  |
|                 |           | | when the rebalance\_table\_shards    |
|                 |           |   should try to move shards            |
+-----------------+-----------+----------------------------------------+
| minimum\_thresh | > float4  | | A safeguard to prevent the threshold |
| old             |           |   argument of                          |
|                 |           | | rebalance\_table\_shards() from      |
|                 |           |   being set too low                    |
+-----------------+-----------+----------------------------------------+

A Hyperscale (Citus) installation ships with these strategies in the table:

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
to achieve the same disk space on every node. Note the threshold of 0.1
-- it prevents unnecessary shard movement caused by insigificant
differences in disk space.

#### Creating custom rebalancer strategies {#custom_rebalancer_strategies}

Here are examples of functions that can be used within new shard
rebalancer strategies, and registered in the
`pg_dist_rebalance_strategy`{.interpreted-text role="ref"} with the
`citus_add_rebalance_strategy`{.interpreted-text role="ref"} function.

-   Setting a node capacity exception by hostname pattern:

	```postgresql
    CREATE FUNCTION v2_node_double_capacity(nodeidarg int)
        RETURNS boolean AS $$
        SELECT
            (CASE WHEN nodename LIKE '%.v2.worker.citusdata.com' THEN 2 ELSE 1 END)
        FROM pg_dist_node where nodeid = nodeidarg
        $$ LANGUAGE sql;
    ```

-   Rebalancing by number of queries that go to a shard, as measured by
    the `citus_stat_statements`{.interpreted-text role="ref"}:

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

### Query statistics table {#citus_stat_statements}

Hyperscale (Citus) provides `citus_stat_statements` for stats about how queries are
being executed, and for whom. It\'s analogous to (and can be joined
with) the
[pg\_stat\_statements](https://www.postgresql.org/docs/current/static/pgstatstatements.html)
view in PostgreSQL which tracks statistics about query speed.

This view can trace queries to originating tenants in a multi-tenant
application, which helps for deciding when to do
`tenant_isolation`{.interpreted-text role="ref"}.

  -------------------------------------------------------------------------------------
  Name             Type     Description
  ---------------- -------- -----------------------------------------------------------
  queryid          bigint   identifier (good for pg\_stat\_statements joins)

  userid           oid      user who ran the query

  dbid             oid      database instance of coordinator

  query            text     anonymized query string

  executor         text     Hyperscale (Citus)
                            `executor <distributed_query_executor>`{.interpreted-text
                            role="ref"} used: adaptive, real-time, task-tracker,
                            router, or insert-select

  partition\_key   text     value of distribution column in router-executed queries,
                            else NULL

  calls            bigint   number of times the query was run
  -------------------------------------------------------------------------------------

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

-   The stats data is not replicated, and won\'t survive database
    crashes or failover
-   It\'s a coordinator node feature, with no
    `Hyperscale (Citus) MX <mx>`{.interpreted-text role="ref"} support
-   Tracks a limited number of queries, set by the
    `pg_stat_statements.max` GUC (default 5000)
-   To truncate the table, use the `citus_stat_statements_reset()`
    function

### Distributed Query Activity

With `mx`{.interpreted-text role="ref"} users can execute distributed
queries from any node. Examining the standard Postgres
[pg\_stat\_activity](https://www.postgresql.org/docs/current/static/monitoring-stats.html#PG-STAT-ACTIVITY-VIEW)
view on the coordinator won\'t include those worker-initiated queries.
Also queries might get blocked on row-level locks on one of the shards
on a worker node. If that happens then those queries would not show up
in
[pg\_locks](https://www.postgresql.org/docs/current/static/view-pg-locks.html)
on the Hyperscale (Citus) coordinator node.

Hyperscale (Citus) provides special views to watch queries and locks throughout the
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

We can see the query appear in `citus_dist_stat_activity`:

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
shard `users_table_102038` which happens to be stored in localhost:9700. We can
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

To see how `citus_lock_waits` works, we can generate a locking situation
manually. First we\'ll set up a test table from the coordinator:

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
with Hyperscale (Citus) MX for instance).

## Tables on all Nodes

Hyperscale (Citus) has other informational tables and views which are accessible on
all nodes, not just the coordinator.

### Connection Credentials Table {#pg_dist_authinfo}

The `pg_dist_authinfo` table holds authentication parameters used by
Hyperscale (Citus) nodes to connect to one another.

  ----------------------------------------------------------------------
  Name       Type      Description
  ---------- --------- -------------------------------------------------
  nodeid     integer   Node id from `pg_dist_node`{.interpreted-text
                       role="ref"}, or 0, or -1

  rolename   name      Postgres role

  authinfo   text      Space-separated libpq connection parameters
  ----------------------------------------------------------------------

Upon beginning a connection, a node consults the table to see whether a row
with the destination `nodeid` and desired `rolename` exists. If so, the node
includes the corresponding `authinfo` string in its libpq connection. A common
example is to store a password, like `'password=abc123'`, but you can review
the [full
list](https://www.postgresql.org/docs/current/static/libpq-connect.html#LIBPQ-PARAMKEYWORDS)
of possibilities.

The parameters in `authinfo` are space-separated, in the form `key=val`.
To write an empty value, or a value containing spaces, surround it with
single quotes, e.g., `keyword='a value'`. Single quotes and backslashes
within the value must be escaped with a backslash, i.e., `\'` and `\\`.

The `nodeid` column can also take the special values 0 and -1, which
mean *all nodes* or *loopback connections*, respectively. If, for a
given node, both specific and all-node rules exist, the specific rule
has precedence.

```
SELECT * FROM pg_dist_authinfo;

 nodeid | rolename | authinfo
--------+----------+-----------------
	123 | jdoe     | password=abc123
(1 row)
```

### Connection Pooling Credentials

If you want to use a connection pooler to connect to a node, you can specify
the pooler options using `pg_dist_poolinfo`. This metadata table holds the
host, port and database name for Hyperscale (Citus) to use when connecting to a
node through a pooler.

If pool information is present, Hyperscale (Citus) will try to use these values
instead of setting up a direct connection. The pg\_dist\_poolinfo information
in this case supersedes `pg_dist_node <pg_dist_node>`{.interpreted-text
role="ref"}.

  -----------------------------------------------------------------------
  Name       Type      Description
  ---------- --------- --------------------------------------------------
  nodeid     integer   Node id from `pg_dist_node`{.interpreted-text
                       role="ref"}

  poolinfo   text      Space-separated parameters: host, port, or dbname
  -----------------------------------------------------------------------

> [!NOTE]
> In some situations Hyperscale (Citus) ignores the settings in
> pg\_dist\_poolinfo. For instance `Shard rebalancing
> <shard_rebalancing>`{.interpreted-text role="ref"} is not compatible with
> connection poolers such as pgbouncer.  In these scenarios Hyperscale (Citus)
> will use a direct connection.

```sql
-- how to connect to node 1 (as identified in pg_dist_node)

INSERT INTO pg_dist_poolinfo (nodeid, poolinfo)
     VALUES (1, 'host=127.0.0.1 port=5433');
```
