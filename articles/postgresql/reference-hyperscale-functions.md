---
title: SQL functions – Hyperscale (Citus) - Azure Database for PostgreSQL
description: Functions in the Hyperscale (Citus) SQL API
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: reference
ms.date: 04/07/2021
---

# Functions in the Hyperscale (Citus) SQL API

This section contains reference information for the user-defined functions
provided by Hyperscale (Citus). These functions help in providing
distributed functionality to Hyperscale (Citus).

> [!NOTE]
>
> Hyperscale (Citus) server groups running older versions of the Citus Engine may not
> offer all the functions listed below.

## Table and Shard DDL

### create\_distributed\_table

The create\_distributed\_table() function is used to define a distributed table
and create its shards if it's a hash-distributed table. This function takes in
a table name, the distribution column, and an optional distribution method and
inserts appropriate metadata to mark the table as distributed. The function
defaults to 'hash' distribution if no distribution method is specified. If the
table is hash-distributed, the function also creates worker shards based on the
shard count and shard replication factor configuration values. If the table
contains any rows, they are automatically distributed to worker nodes.

This function replaces usage of master\_create\_distributed\_table() followed
by master\_create\_worker\_shards().

#### Arguments

**table\_name:** Name of the table that needs to be distributed.

**distribution\_column:** The column on which the table is to be
distributed.

**distribution\_type:** (Optional) The method according to which the
table is to be distributed. Permissible values are append or hash, with
a default value of 'hash'.

**colocate\_with:** (Optional) include current table in the colocation group
of another table. By default tables are colocated when they are distributed by
columns of the same type, have the same shard count, and have the same
replication factor. Possible values for `colocate_with` are `default`, `none`
to start a new colocation group, or the name of another table to colocate
with that table.  (See [table colocation](concepts-hyperscale-colocation.md).)

Keep in mind that the default value of `colocate_with` does implicit
colocation. [Colocation](concepts-hyperscale-colocation.md)
can be a great thing when tables are related or will be joined.  However when
two tables are unrelated but happen to use the same datatype for their
distribution columns, accidentally colocating them can decrease performance
during [shard rebalancing](howto-hyperscale-scale-rebalance.md).  The
table shards will be moved together unnecessarily in a \"cascade.\"

If a new distributed table is not related to other tables, it's best to
specify `colocate_with => 'none'`.

#### Return Value

N/A

#### Example

This example informs the database that the github\_events table should
be distributed by hash on the repo\_id column.

```postgresql
SELECT create_distributed_table('github_events', 'repo_id');

-- alternatively, to be more explicit:
SELECT create_distributed_table('github_events', 'repo_id',
                                colocate_with => 'github_repo');
```

### create\_reference\_table

The create\_reference\_table() function is used to define a small
reference or dimension table. This function takes in a table name, and
creates a distributed table with just one shard, replicated to every
worker node.

#### Arguments

**table\_name:** Name of the small dimension or reference table that
needs to be distributed.

#### Return Value

N/A

#### Example

This example informs the database that the nation table should be
defined as a reference table

```postgresql
SELECT create_reference_table('nation');
```

### upgrade\_to\_reference\_table

The upgrade\_to\_reference\_table() function takes an existing distributed
table that has a shard count of one, and upgrades it to be a recognized
reference table. After calling this function, the table will be as if it had
been created with [create_reference_table](#create_reference_table).

#### Arguments

**table\_name:** Name of the distributed table (having shard count = 1)
which will be distributed as a reference table.

#### Return Value

N/A

#### Example

This example informs the database that the nation table should be
defined as a reference table

```postgresql
SELECT upgrade_to_reference_table('nation');
```

### mark\_tables\_colocated

The mark\_tables\_colocated() function takes a distributed table (the
source), and a list of others (the targets), and puts the targets into
the same colocation group as the source. If the source is not yet in a
group, this function creates one, and assigns the source and targets to
it.

Colocating tables ought to be done at table distribution time via the
`colocate_with` parameter of
[create_distributed_table](#create_distributed_table), but
`mark_tables_colocated` can take care of it later if necessary.

#### Arguments

**source\_table\_name:** Name of the distributed table whose colocation
group the targets will be assigned to match.

**target\_table\_names:** Array of names of the distributed target
tables, must be non-empty. These distributed tables must match the
source table in:

> -   distribution method
> -   distribution column type
> -   replication type
> -   shard count

If none of the above apply, Hyperscale (Citus) will raise an error. For
instance, attempting to colocate tables `apples` and `oranges` whose
distribution column types differ results in:

```
ERROR:  XX000: cannot colocate tables apples and oranges
DETAIL:  Distribution column types don't match for apples and oranges.
```

#### Return Value

N/A

#### Example

This example puts `products` and `line_items` in the same colocation
group as `stores`. The example assumes that these tables are all
distributed on a column with matching type, most likely a \"store id.\"

```postgresql
SELECT mark_tables_colocated('stores', ARRAY['products', 'line_items']);
```

### create\_distributed\_function

Propagates a function from the coordinator node to workers, and marks it for
distributed execution. When a distributed function is called on the
coordinator, Hyperscale (Citus) uses the value of the \"distribution argument\"
to pick a worker node to run the function. Executing the function on workers
increases parallelism, and can bring the code closer to data in shards for
lower latency.

The Postgres search path is not propagated from the coordinator to workers
during distributed function execution, so distributed function code should
fully qualify the names of database objects. Also notices emitted by the
functions will not be displayed to the user.

#### Arguments

**function\_name:** Name of the function to be distributed. The name
must include the function's parameter types in parentheses, because
multiple functions can have the same name in PostgreSQL. For instance,
`'foo(int)'` is different from `'foo(int, text)'`.

**distribution\_arg\_name:** (Optional) The argument name by which to
distribute. For convenience (or if the function arguments do not have
names), a positional placeholder is allowed, such as `'$1'`. If this
parameter is not specified, then the function named by `function_name`
is merely created on the workers. If worker nodes are added in the
future, the function will automatically be created there too.

**colocate\_with:** (Optional) When the distributed function reads or writes to
a distributed table (or, more generally, colocation group), be sure to name
that table using the `colocate_with` parameter. Then each invocation of the
function will run on the worker node containing relevant shards.

#### Return Value

N/A

#### Example

```postgresql
-- an example function which updates a hypothetical
-- event_responses table which itself is distributed by event_id
CREATE OR REPLACE FUNCTION
  register_for_event(p_event_id int, p_user_id int)
RETURNS void LANGUAGE plpgsql AS $fn$
BEGIN
  INSERT INTO event_responses VALUES ($1, $2, 'yes')
  ON CONFLICT (event_id, user_id)
  DO UPDATE SET response = EXCLUDED.response;
END;
$fn$;

-- distribute the function to workers, using the p_event_id argument
-- to determine which shard each invocation affects, and explicitly
-- colocating with event_responses which the function updates
SELECT create_distributed_function(
  'register_for_event(int, int)', 'p_event_id',
  colocate_with := 'event_responses'
);
```

### alter_columnar_table_set

The alter_columnar_table_set() function changes settings on a [columnar
table](concepts-hyperscale-columnar.md). Calling this function on a
non-columnar table gives an error. All arguments except the table name are
optional.

To view current options for all columnar tables, consult this table:

```postgresql
SELECT * FROM columnar.options;
```

The default values for columnar settings for newly created tables can be
overridden with these GUCs:

* columnar.compression
* columnar.compression_level
* columnar.stripe_row_count
* columnar.chunk_row_count

#### Arguments

**table_name:** Name of the columnar table.

**chunk_row_count:** (Optional) The maximum number of rows per chunk for
newly inserted data. Existing chunks of data will not be changed and may have
more rows than this maximum value. The default value is 10000.

**stripe_row_count:** (Optional) The maximum number of rows per stripe for
newly inserted data. Existing stripes of data will not be changed and may have
more rows than this maximum value. The default value is 150000.

**compression:** (Optional) `[none|pglz|zstd|lz4|lz4hc]` The compression type
for newly inserted data. Existing data will not be recompressed or
decompressed. The default and suggested value is zstd (if support has
been compiled in).

**compression_level:** (Optional) Valid settings are from 1 through 19. If the
compression method does not support the level chosen, the closest level will be
selected instead.

#### Return value

N/A

#### Example

```postgresql
SELECT alter_columnar_table_set(
  'my_columnar_table',
  compression => 'none',
  stripe_row_count => 10000);
```

## Metadata / Configuration Information

### master\_get\_table\_metadata

The master\_get\_table\_metadata() function can be used to return
distribution-related metadata for a distributed table. This metadata includes
the relation ID, storage type, distribution method, distribution column,
replication count, maximum shard size, and shard placement policy for the
table. Behind the covers, this function queries Hyperscale (Citus) metadata
tables to get the required information and concatenates it into a tuple before
returning it to the user.

#### Arguments

**table\_name:** Name of the distributed table for which you want to
fetch metadata.

#### Return Value

A tuple containing the following information:

**logical\_relid:** Oid of the distributed table. It references
the relfilenode column in the pg\_class system catalog table.

**part\_storage\_type:** Type of storage used for the table. May be
't' (standard table), 'f' (foreign table) or 'c' (columnar table).

**part\_method:** Distribution method used for the table. May be 'a'
(append), or 'h' (hash).

**part\_key:** Distribution column for the table.

**part\_replica\_count:** Current shard replication count.

**part\_max\_size:** Current maximum shard size in bytes.

**part\_placement\_policy:** Shard placement policy used for placing the
table's shards. May be 1 (local-node-first) or 2 (round-robin).

#### Example

The example below fetches and displays the table metadata for the
github\_events table.

```postgresql
SELECT * from master_get_table_metadata('github_events');
 logical_relid | part_storage_type | part_method | part_key | part_replica_count | part_max_size | part_placement_policy 
---------------+-------------------+-------------+----------+--------------------+---------------+-----------------------
         24180 | t                 | h           | repo_id  |                  2 |    1073741824 |                     2
(1 row)
```

### get\_shard\_id\_for\_distribution\_column

Hyperscale (Citus) assigns every row of a distributed table to a shard based on
the value of the row's distribution column and the table's method of
distribution. In most cases, the precise mapping is a low-level detail that the
database administrator can ignore. However it can be useful to determine a
row's shard, either for manual database maintenance tasks or just to satisfy
curiosity. The `get_shard_id_for_distribution_column` function provides this
info for hash-distributed, range-distributed, and reference tables. It
does not work for the append distribution.

#### Arguments

**table\_name:** The distributed table.

**distribution\_value:** The value of the distribution column.

#### Return Value

The shard ID Hyperscale (Citus) associates with the distribution column value
for the given table.

#### Example

```postgresql
SELECT get_shard_id_for_distribution_column('my_table', 4);

 get_shard_id_for_distribution_column
--------------------------------------
                               540007
(1 row)
```

### column\_to\_column\_name

Translates the `partkey` column of `pg_dist_partition` into a textual column
name. The translation is useful to determine the distribution column of a
distributed table.

For a more detailed discussion, see [choosing a distribution
column](concepts-hyperscale-choose-distribution-column.md).

#### Arguments

**table\_name:** The distributed table.

**column\_var\_text:** The value of `partkey` in the `pg_dist_partition`
table.

#### Return Value

The name of `table_name`'s distribution column.

#### Example

```postgresql
-- get distribution column name for products table

SELECT column_to_column_name(logicalrelid, partkey) AS dist_col_name
  FROM pg_dist_partition
 WHERE logicalrelid='products'::regclass;
```

Output:

```
┌───────────────┐
│ dist_col_name │
├───────────────┤
│ company_id    │
└───────────────┘
```

### citus\_relation\_size

Get the disk space used by all the shards of the specified distributed table.
The disk space includes the size of the \"main fork,\" but excludes the
visibility map and free space map for the shards.

#### Arguments

**logicalrelid:** the name of a distributed table.

#### Return Value

Size in bytes as a bigint.

#### Example

```postgresql
SELECT pg_size_pretty(citus_relation_size('github_events'));
```

```
pg_size_pretty
--------------
23 MB
```

### citus\_table\_size

Get the disk space used by all the shards of the specified distributed table,
excluding indexes (but including TOAST, free space map, and visibility map).

#### Arguments

**logicalrelid:** the name of a distributed table.

#### Return Value

Size in bytes as a bigint.

#### Example

```postgresql
SELECT pg_size_pretty(citus_table_size('github_events'));
```

```
pg_size_pretty
--------------
37 MB
```

### citus\_total\_relation\_size

Get the total disk space used by the all the shards of the specified
distributed table, including all indexes and TOAST data.

#### Arguments

**logicalrelid:** the name of a distributed table.

#### Return Value

Size in bytes as a bigint.

#### Example

```postgresql
SELECT pg_size_pretty(citus_total_relation_size('github_events'));
```

```
pg_size_pretty
--------------
73 MB
```

### citus\_stat\_statements\_reset

Removes all rows from
[citus_stat_statements](reference-hyperscale-metadata.md#query-statistics-table).
This function works independently from `pg_stat_statements_reset()`. To reset
all stats, call both functions.

#### Arguments

N/A

#### Return Value

None

## Server group management and repair

### master\_copy\_shard\_placement

If a shard placement fails to be updated during a modification command or a DDL
operation, then it gets marked as inactive. The master\_copy\_shard\_placement
function can then be called to repair an inactive shard placement using data
from a healthy placement.

To repair a shard, the function first drops the unhealthy shard placement and
recreates it using the schema on the coordinator. Once the shard placement is
created, the function copies data from the healthy placement and updates the
metadata to mark the new shard placement as healthy. This function ensures that
the shard will be protected from any concurrent modifications during the
repair.

#### Arguments

**shard\_id:** ID of the shard to be repaired.

**source\_node\_name:** DNS name of the node on which the healthy shard
placement is present (\"source\" node).

**source\_node\_port:** The port on the source worker node on which the
database server is listening.

**target\_node\_name:** DNS name of the node on which the invalid shard
placement is present (\"target\" node).

**target\_node\_port:** The port on the target worker node on which the
database server is listening.

#### Return Value

N/A

#### Example

The example below will repair an inactive shard placement of shard
12345, which is present on the database server running on 'bad\_host'
on port 5432. To repair it, it will use data from a healthy shard
placement present on the server running on 'good\_host' on port
5432.

```postgresql
SELECT master_copy_shard_placement(12345, 'good_host', 5432, 'bad_host', 5432);
```

### master\_move\_shard\_placement

This function moves a given shard (and shards colocated with it) from one node
to another. It is typically used indirectly during shard rebalancing rather
than being called directly by a database administrator.

There are two ways to move the data: blocking or nonblocking. The blocking
approach means that during the move all modifications to the shard are paused.
The second way, which avoids blocking shard writes, relies on Postgres 10
logical replication.

After a successful move operation, shards in the source node get deleted. If
the move fails at any point, this function throws an error and leaves the
source and target nodes unchanged.

#### Arguments

**shard\_id:** ID of the shard to be moved.

**source\_node\_name:** DNS name of the node on which the healthy shard
placement is present (\"source\" node).

**source\_node\_port:** The port on the source worker node on which the
database server is listening.

**target\_node\_name:** DNS name of the node on which the invalid shard
placement is present (\"target\" node).

**target\_node\_port:** The port on the target worker node on which the
database server is listening.

**shard\_transfer\_mode:** (Optional) Specify the method of replication,
whether to use PostgreSQL logical replication or a cross-worker COPY
command. The possible values are:

> -   `auto`: Require replica identity if logical replication is
>     possible, otherwise use legacy behaviour (e.g. for shard repair,
>     PostgreSQL 9.6). This is the default value.
> -   `force_logical`: Use logical replication even if the table
>     doesn't have a replica identity. Any concurrent update/delete
>     statements to the table will fail during replication.
> -   `block_writes`: Use COPY (blocking writes) for tables lacking
>     primary key or replica identity.

#### Return Value

N/A

#### Example

```postgresql
SELECT master_move_shard_placement(12345, 'from_host', 5432, 'to_host', 5432);
```

### rebalance\_table\_shards

The rebalance\_table\_shards() function moves shards of the given table to make
them evenly distributed among the workers. The function first calculates the
list of moves it needs to make in order to ensure that the server group is
balanced within the given threshold. Then, it moves shard placements one by one
from the source node to the destination node and updates the corresponding
shard metadata to reflect the move.

Every shard is assigned a cost when determining whether shards are \"evenly
distributed.\" By default each shard has the same cost (a value of 1), so
distributing to equalize the cost across workers is the same as equalizing the
number of shards on each. The constant cost strategy is called
\"by\_shard\_count\" and is the default rebalancing strategy.

The default strategy is appropriate under these circumstances:

*  The shards are roughly the same size
*  The shards get roughly the same amount of traffic
*  Worker nodes are all the same size/type
*  Shards haven't been pinned to particular workers

If any of these assumptions don't hold, then the default rebalancing
can result in a bad plan. In this case you may customize the strategy,
using the `rebalance_strategy` parameter.

It's advisable to call
[get_rebalance_table_shards_plan](#get_rebalance_table_shards_plan) before
running rebalance\_table\_shards, to see and verify the actions to be
performed.

#### Arguments

**table\_name:** (Optional) The name of the table whose shards need to
be rebalanced. If NULL, then rebalance all existing colocation groups.

**threshold:** (Optional) A float number between 0.0 and 1.0 that
indicates the maximum difference ratio of node utilization from average
utilization. For example, specifying 0.1 will cause the shard rebalancer
to attempt to balance all nodes to hold the same number of shards ±10%.
Specifically, the shard rebalancer will try to converge utilization of
all worker nodes to the (1 - threshold) \* average\_utilization \... (1
+ threshold) \* average\_utilization range.

**max\_shard\_moves:** (Optional) The maximum number of shards to move.

**excluded\_shard\_list:** (Optional) Identifiers of shards that
shouldn't be moved during the rebalance operation.

**shard\_transfer\_mode:** (Optional) Specify the method of replication,
whether to use PostgreSQL logical replication or a cross-worker COPY
command. The possible values are:

> -   `auto`: Require replica identity if logical replication is
>     possible, otherwise use legacy behaviour (e.g. for shard repair,
>     PostgreSQL 9.6). This is the default value.
> -   `force_logical`: Use logical replication even if the table
>     doesn't have a replica identity. Any concurrent update/delete
>     statements to the table will fail during replication.
> -   `block_writes`: Use COPY (blocking writes) for tables lacking
>     primary key or replica identity.

**drain\_only:** (Optional) When true, move shards off worker nodes who have
`shouldhaveshards` set to false in
[pg_dist_node](reference-hyperscale-metadata.md#worker-node-table); move no
other shards.

**rebalance\_strategy:** (Optional) the name of a strategy in
[pg_dist_rebalance_strategy](reference-hyperscale-metadata.md#rebalancer-strategy-table).
If this argument is omitted, the function chooses the default strategy, as
indicated in the table.

#### Return Value

N/A

#### Example

The example below will attempt to rebalance the shards of the
github\_events table within the default threshold.

```postgresql
SELECT rebalance_table_shards('github_events');
```

This example usage will attempt to rebalance the github\_events table
without moving shards with ID 1 and 2.

```postgresql
SELECT rebalance_table_shards('github_events', excluded_shard_list:='{1,2}');
```

### get\_rebalance\_table\_shards\_plan

Output the planned shard movements of
[rebalance_table_shards](#rebalance_table_shards) without performing them.
While it's unlikely, get\_rebalance\_table\_shards\_plan can output a slightly
different plan than what a rebalance\_table\_shards call with the same
arguments will do. They are not executed at the same time, so facts about the
server group \-- for example, disk space \-- might differ between the calls.

#### Arguments

The same arguments as rebalance\_table\_shards: relation, threshold,
max\_shard\_moves, excluded\_shard\_list, and drain\_only. See
documentation of that function for the arguments' meaning.

#### Return Value

Tuples containing these columns:

-   **table\_name**: The table whose shards would move
-   **shardid**: The shard in question
-   **shard\_size**: Size in bytes
-   **sourcename**: Hostname of the source node
-   **sourceport**: Port of the source node
-   **targetname**: Hostname of the destination node
-   **targetport**: Port of the destination node

### get\_rebalance\_progress

Once a shard rebalance begins, the `get_rebalance_progress()` function lists
the progress of every shard involved. It monitors the moves planned and
executed by `rebalance_table_shards()`.

#### Arguments

N/A

#### Return Value

Tuples containing these columns:

-   **sessionid**: Postgres PID of the rebalance monitor
-   **table\_name**: The table whose shards are moving
-   **shardid**: The shard in question
-   **shard\_size**: Size in bytes
-   **sourcename**: Hostname of the source node
-   **sourceport**: Port of the source node
-   **targetname**: Hostname of the destination node
-   **targetport**: Port of the destination node
-   **progress**: 0 = waiting to be moved; 1 = moving; 2 = complete

#### Example

```sql
SELECT * FROM get_rebalance_progress();
```

```
┌───────────┬────────────┬─────────┬────────────┬───────────────┬────────────┬───────────────┬────────────┬──────────┐
│ sessionid │ table_name │ shardid │ shard_size │  sourcename   │ sourceport │  targetname   │ targetport │ progress │
├───────────┼────────────┼─────────┼────────────┼───────────────┼────────────┼───────────────┼────────────┼──────────┤
│      7083 │ foo        │  102008 │    1204224 │ n1.foobar.com │       5432 │ n4.foobar.com │       5432 │        0 │
│      7083 │ foo        │  102009 │    1802240 │ n1.foobar.com │       5432 │ n4.foobar.com │       5432 │        0 │
│      7083 │ foo        │  102018 │     614400 │ n2.foobar.com │       5432 │ n4.foobar.com │       5432 │        1 │
│      7083 │ foo        │  102019 │       8192 │ n3.foobar.com │       5432 │ n4.foobar.com │       5432 │        2 │
└───────────┴────────────┴─────────┴────────────┴───────────────┴────────────┴───────────────┴────────────┴──────────┘
```

### citus\_add\_rebalance\_strategy

Append a row to
[pg_dist_rebalance_strategy](reference-hyperscale-metadata.md?#rebalancer-strategy-table)
.

#### Arguments

For more about these arguments, see the corresponding column values in
`pg_dist_rebalance_strategy`.

**name:** identifier for the new strategy

**shard\_cost\_function:** identifies the function used to determine the
\"cost\" of each shard

**node\_capacity\_function:** identifies the function to measure node
capacity

**shard\_allowed\_on\_node\_function:** identifies the function that
determines which shards can be placed on which nodes

**default\_threshold:** a floating point threshold that tunes how
precisely the cumulative shard cost should be balanced between nodes

**minimum\_threshold:** (Optional) a safeguard column that holds the
minimum value allowed for the threshold argument of
rebalance\_table\_shards(). Its default value is 0

#### Return Value

N/A

### citus\_set\_default\_rebalance\_strategy

Update the
[pg_dist_rebalance_strategy](reference-hyperscale-metadata.md#rebalancer-strategy-table)
table, changing the strategy named by its argument to be the default chosen
when rebalancing shards.

#### Arguments

**name:** the name of the strategy in pg\_dist\_rebalance\_strategy

#### Return Value

N/A

#### Example

```postgresql
SELECT citus_set_default_rebalance_strategy('by_disk_size');
```

### citus\_remote\_connection\_stats

The citus\_remote\_connection\_stats() function shows the number of
active connections to each remote node.

#### Arguments

N/A

#### Example

```postgresql
SELECT * from citus_remote_connection_stats();
```

```
	hostname    | port | database_name | connection_count_to_node
----------------+------+---------------+--------------------------
 citus_worker_1 | 5432 | postgres      |                        3
(1 row)
```

### master\_drain\_node

The master\_drain\_node() function moves shards off the designated node and
onto other nodes who have `shouldhaveshards` set to true in
[pg_dist_node](reference-hyperscale-metadata.md#worker-node-table). Call the
function prior to removing a node from the server group and turning off the
node's physical server.

#### Arguments

**nodename:** The hostname name of the node to be drained.

**nodeport:** The port number of the node to be drained.

**shard\_transfer\_mode:** (Optional) Specify the method of replication,
whether to use PostgreSQL logical replication or a cross-worker COPY
command. The possible values are:

> -   `auto`: Require replica identity if logical replication is
>     possible, otherwise use legacy behaviour (e.g. for shard repair,
>     PostgreSQL 9.6). This is the default value.
> -   `force_logical`: Use logical replication even if the table
>     doesn't have a replica identity. Any concurrent update/delete
>     statements to the table will fail during replication.
> -   `block_writes`: Use COPY (blocking writes) for tables lacking
>     primary key or replica identity.

**rebalance\_strategy:** (Optional) the name of a strategy in
[pg_dist_rebalance_strategy](reference-hyperscale-metadata.md#rebalancer-strategy-table).
If this argument is omitted, the function chooses the default strategy, as
indicated in the table.

#### Return Value

N/A

#### Example

Here are the typical steps to remove a single node (for example
'10.0.0.1' on a standard PostgreSQL port):

1.  Drain the node.

    ```postgresql
    SELECT * from master_drain_node('10.0.0.1', 5432);
    ```

2.  Wait until the command finishes

3.  Remove the node

When draining multiple nodes, it's recommended to use
[rebalance_table_shards](#rebalance_table_shards) instead. Doing so allows
Hyperscale (Citus) to plan ahead and move shards the minimum number of times.

1.  Run for each node that you want to remove:

    ```postgresql
    SELECT * FROM master_set_node_property(node_hostname, node_port, 'shouldhaveshards', false);
    ```

2.  Drain them all at once with
    [rebalance_table_shards](#rebalance_table_shards)

    ```postgresql
    SELECT * FROM rebalance_table_shards(drain_only := true);
    ```

3.  Wait until the draining rebalance finishes

4.  Remove the nodes

### replicate\_table\_shards

The replicate\_table\_shards() function replicates the under-replicated shards
of the given table. The function first calculates the list of under-replicated
shards and locations from which they can be fetched for replication. The
function then copies over those shards and updates the corresponding shard
metadata to reflect the copy.

#### Arguments

**table\_name:** The name of the table whose shards need to be
replicated.

**shard\_replication\_factor:** (Optional) The desired replication
factor to achieve for each shard.

**max\_shard\_copies:** (Optional) Maximum number of shards to copy to
reach the desired replication factor.

**excluded\_shard\_list:** (Optional) Identifiers of shards that
shouldn't be copied during the replication operation.

#### Return Value

N/A

#### Examples

The example below will attempt to replicate the shards of the
github\_events table to shard\_replication\_factor.

```postgresql
SELECT replicate_table_shards('github_events');
```

This example will attempt to bring the shards of the github\_events table to
the desired replication factor with a maximum of 10 shard copies. The
rebalancer will copy a maximum of 10 shards in its attempt to reach the desired
replication factor.

```postgresql
SELECT replicate_table_shards('github_events', max_shard_copies:=10);
```

### isolate\_tenant\_to\_new\_shard

This function creates a new shard to hold rows with a specific single value in
the distribution column. It is especially handy for the multi-tenant Hyperscale
(Citus) use case, where a large tenant can be placed alone on its own shard and
ultimately its own physical node.

#### Arguments

**table\_name:** The name of the table to get a new shard.

**tenant\_id:** The value of the distribution column that will be
assigned to the new shard.

**cascade\_option:** (Optional) When set to \"CASCADE,\" also isolates a shard
from all tables in the current table's [colocation
group](concepts-hyperscale-colocation.md).

#### Return Value

**shard\_id:** The function returns the unique ID assigned to the newly
created shard.

#### Examples

Create a new shard to hold the lineitems for tenant 135:

```postgresql
SELECT isolate_tenant_to_new_shard('lineitem', 135);
```

```
┌─────────────────────────────┐
│ isolate_tenant_to_new_shard │
├─────────────────────────────┤
│                      102240 │
└─────────────────────────────┘
```

## Next steps

* Many of the functions in this article modify system [metadata tables](reference-hyperscale-metadata.md)
* [Server parameters](reference-hyperscale-parameters.md) customize the behavior of some functions
