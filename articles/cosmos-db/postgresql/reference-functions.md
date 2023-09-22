---
title: SQL functions – Azure Cosmos DB for PostgreSQL
description: Functions in the Azure Cosmos DB for PostgreSQL SQL API
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: reference
ms.date: 11/01/2022
---

# Azure Cosmos DB for PostgreSQL functions

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

This section contains reference information for the user-defined functions
provided by Azure Cosmos DB for PostgreSQL. These functions help in providing
distributed functionality to Azure Cosmos DB for PostgreSQL.

> [!NOTE]
>
> clusters running older versions of the Citus Engine may not
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
contains any rows, they're automatically distributed to worker nodes.

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
of another table. By default tables are colocated when they're distributed by
columns of the same type, have the same shard count, and have the same
replication factor. Possible values for `colocate_with` are `default`, `none`
to start a new colocation group, or the name of another table to colocate
with that table.  (See [table colocation](concepts-colocation.md).)

Keep in mind that the default value of `colocate_with` does implicit
colocation. [Colocation](concepts-colocation.md)
can be a great thing when tables are related or will be joined.  However when
two tables are unrelated but happen to use the same datatype for their
distribution columns, accidentally colocating them can decrease performance
during [shard rebalancing](howto-scale-rebalance.md).  The
table shards will be moved together unnecessarily in a \"cascade.\"

If a new distributed table isn't related to other tables, it's best to
specify `colocate_with => 'none'`.

**shard\_count:** (Optional) the number of shards to create for the new
distributed table. When specifying `shard_count` you can't specify a value of
`colocate_with` other than none. To change the shard count of an existing table
or colocation group, use the [alter_distributed_table](#alter_distributed_table) function.

Possible values for `shard_count` are between 1 and 64000. For guidance on
choosing the optimal value, see [Shard Count](howto-shard-count.md).

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

### create\_distributed\_table\_concurrently

This function has the same interface and purpose as
[create_distributed_function](#create_distributed_table), but doesn't block
writes during table distribution.

However, `create_distributed_table_concurrently` has a few limitations:

* You can't use the function in a transaction block, which means you can only
  distribute one table at a time. (You *can* use the function on
  time-partitioned tables, though.)
* You can't use `create_distributed_table_concurrently` when the table is
  referenced by a foreign key, or references another local table. However,
  foreign keys to reference tables work, and you can create foreign keys to other
  distributed tables after table distribution completes.
* If you don't have a primary key or replica identity on your table, then
  update and delete commands will fail during the table distribution due to
  limitations on logical replication.

### truncate\_local\_data\_after\_distributing\_table

Truncate all local rows after distributing a table, and prevent constraints
from failing due to outdated local records. The truncation cascades to tables
having a foreign key to the designated table. If the referring tables aren't themselves distributed, then truncation is forbidden until they are, to protect
referential integrity:

```
ERROR:  cannot truncate a table referenced in a foreign key constraint by a local table
```

Truncating local coordinator node table data is safe for distributed tables
because their rows, if any, are copied to worker nodes during
distribution.

#### Arguments

**table_name:** Name of the distributed table whose local counterpart on the
coordinator node should be truncated.

#### Return Value

N/A

#### Example

```postgresql
-- requires that argument is a distributed table
SELECT truncate_local_data_after_distributing_table('public.github_events');
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

### alter_distributed_table

The alter_distributed_table() function can be used to change the distribution
column, shard count or colocation properties of a distributed table.

#### Arguments

**table\_name:** Name of the table that will be altered.

**distribution\_column:** (Optional) Name of the new distribution column.

**shard\_count:** (Optional) The new shard count.

**colocate\_with:** (Optional) The table that the current distributed table
will be colocated with. Possible values are `default`, `none` to start a new
colocation group, or the name of another table with which to colocate. (See
[table colocation](concepts-colocation.md).)

**cascade_to_colocated:** (Optional) When this argument is set to "true",
`shard_count` and `colocate_with` changes will also be applied to all of the
tables that were previously colocated with the table, and the colocation will
be preserved. If it is "false", the current colocation of this table will be
broken.

#### Return Value

N/A

#### Example

```postgresql
-- change distribution column
SELECT alter_distributed_table('github_events', distribution_column:='event_id');

-- change shard count of all tables in colocation group
SELECT alter_distributed_table('github_events', shard_count:=6, cascade_to_colocated:=true);

-- change colocation
SELECT alter_distributed_table('github_events', colocate_with:='another_table');
```

### update_distributed_table_colocation

The update_distributed_table_colocation() function is used to update colocation
of a distributed table. This function can also be used to break colocation of a
distributed table. Azure Cosmos DB for PostgreSQL will implicitly colocate two tables if the
distribution column is the same type, this can be useful if the tables are
related and will do some joins. If tables A and B are colocated, and table A
gets rebalanced, table B will also be rebalanced. If table B doesn't have a
replica identity, the rebalance will fail. Therefore, this function can be
useful breaking the implicit colocation in that case.

This function doesn't move any data around physically.

#### Arguments

**table_name:** Name of the table colocation of which will be updated.

**colocate_with:** The table to which the table should be colocated with.

If you want to break the colocation of a table, you should specify
`colocate_with => 'none'`.

#### Return Value

N/A

#### Example

This example shows that colocation of table A is updated as colocation of table
B.

```postgresql
SELECT update_distributed_table_colocation('A', colocate_with => 'B');
```

Assume that table A and table B are colocated (possibly implicitly), if you
want to break the colocation:

```postgresql
SELECT update_distributed_table_colocation('A', colocate_with => 'none');
```

Now, assume that table A, table B, table C and table D are colocated and you
want to colocate table A and table B together, and table C and table D
together:

```postgresql
SELECT update_distributed_table_colocation('C', colocate_with => 'none');
SELECT update_distributed_table_colocation('D', colocate_with => 'C');
```

If you have a hash distributed table named none and you want to update its
colocation, you can do:

```postgresql
SELECT update_distributed_table_colocation('"none"', colocate_with => 'some_other_hash_distributed_table');
```

### undistribute\_table

The undistribute_table() function undoes the action of create_distributed_table
or create_reference_table. Undistributing moves all data from shards back into
a local table on the coordinator node (assuming the data can fit), then deletes
the shards.

Azure Cosmos DB for PostgreSQL won't undistribute tables that have--or are referenced by--foreign
keys, unless the cascade_via_foreign_keys argument is set to true. If this
argument is false (or omitted), then you must manually drop the offending
foreign key constraints before undistributing.

#### Arguments

**table_name:** Name of the distributed or reference table to undistribute.

**cascade_via_foreign_keys:** (Optional) When this argument set to "true,"
undistribute_table also undistributes all tables that are related to table_name
through foreign keys. Use caution with this parameter, because it can
potentially affect many tables.

#### Return Value

N/A

#### Example

This example distributes a `github_events` table and then undistributes it.

```postgresql
-- first distribute the table
SELECT create_distributed_table('github_events', 'repo_id');

-- undo that and make it local again
SELECT undistribute_table('github_events');
```

### create\_distributed\_function

Propagates a function from the coordinator node to workers, and marks it for
distributed execution. When a distributed function is called on the
coordinator, Azure Cosmos DB for PostgreSQL uses the value of the \"distribution argument\"
to pick a worker node to run the function. Executing the function on workers
increases parallelism, and can bring the code closer to data in shards for
lower latency.

The Postgres search path isn't propagated from the coordinator to workers
during distributed function execution, so distributed function code should
fully qualify the names of database objects. Also notices emitted by the
functions won't be displayed to the user.

#### Arguments

**function\_name:** Name of the function to be distributed. The name
must include the function's parameter types in parentheses, because
multiple functions can have the same name in PostgreSQL. For instance,
`'foo(int)'` is different from `'foo(int, text)'`.

**distribution\_arg\_name:** (Optional) The argument name by which to
distribute. For convenience (or if the function arguments don't have
names), a positional placeholder is allowed, such as `'$1'`. If this
parameter isn't specified, then the function named by `function_name`
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
table](concepts-columnar.md). Calling this function on a
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
newly inserted data. Existing chunks of data won't be changed and may have
more rows than this maximum value. The default value is 10000.

**stripe_row_count:** (Optional) The maximum number of rows per stripe for
newly inserted data. Existing stripes of data won't be changed and may have
more rows than this maximum value. The default value is 150000.

**compression:** (Optional) `[none|pglz|zstd|lz4|lz4hc]` The compression type
for newly inserted data. Existing data won't be recompressed or
decompressed. The default and suggested value is zstd (if support has
been compiled in).

**compression_level:** (Optional) Valid settings are from 1 through 19. If the
compression method doesn't support the level chosen, the closest level will be
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

### alter_table_set_access_method

The alter_table_set_access_method() function changes access method of a table
(for example, heap or columnar).

#### Arguments

**table_name:** Name of the table whose access method will change.

**access_method:** Name of the new access method.

#### Return Value

N/A

#### Example

```postgresql
SELECT alter_table_set_access_method('github_events', 'columnar');
```

### create_time_partitions

The create_time_partitions() function creates partitions of a given interval to
cover a given range of time.

#### Arguments

**table_name:** (regclass) table for which to create new partitions. The table
must be partitioned on one column, of type date, timestamp, or timestamptz.

**partition_interval:** an interval of time, such as `'2 hours'`, or `'1
month'`, to use when setting ranges on new partitions.

**end_at:** (timestamptz) create partitions up to this time. The last partition
will contain the point end_at, and no later partitions will be created.

**start_from:** (timestamptz, optional) pick the first partition so that it
contains the point start_from. The default value is `now()`.

#### Return Value

True if it needed to create new partitions, false if they all existed already.

#### Example

```postgresql
-- create a year's worth of monthly partitions
-- in table foo, starting from the current time

SELECT create_time_partitions(
  table_name         := 'foo',
  partition_interval := '1 month',
  end_at             := now() + '12 months'
);
```

### drop_old_time_partitions

The drop_old_time_partitions() function removes all partitions whose intervals
fall before a given timestamp. In addition to using this function, you might
consider
[alter_old_partitions_set_access_method](#alter_old_partitions_set_access_method)
to compress the old partitions with columnar storage.

#### Arguments

**table_name:** (regclass) table for which to remove partitions. The table must
be partitioned on one column, of type date, timestamp, or timestamptz.

**older_than:** (timestamptz) drop partitions whose upper range is less than or
equal to older_than.

#### Return Value

N/A

#### Example

```postgresql
-- drop partitions that are over a year old

CALL drop_old_time_partitions('foo', now() - interval '12 months');
```

### alter_old_partitions_set_access_method

In a timeseries use case, tables are often partitioned by time, and old
partitions are compressed into read-only columnar storage.

#### Arguments

**parent_table_name:** (regclass) table for which to change partitions. The
table must be partitioned on one column, of type date, timestamp, or
timestamptz.

**older_than:** (timestamptz) change partitions whose upper range is less than
or equal to older_than.

**new_access_method:** (name) either 'heap' for row-based storage, or
'columnar' for columnar storage.

#### Return Value

N/A

#### Example

```postgresql
CALL alter_old_partitions_set_access_method(
  'foo', now() - interval '6 months',
  'columnar'
);
```

## Metadata / Configuration Information

### get\_shard\_id\_for\_distribution\_column

Azure Cosmos DB for PostgreSQL assigns every row of a distributed table to a shard based on
the value of the row's distribution column and the table's method of
distribution. In most cases, the precise mapping is a low-level detail that the
database administrator can ignore. However it can be useful to determine a
row's shard, either for manual database maintenance tasks or just to satisfy
curiosity. The `get_shard_id_for_distribution_column` function provides this
info for hash-distributed, range-distributed, and reference tables. It
doesn't work for the append distribution.

#### Arguments

**table\_name:** The distributed table.

**distribution\_value:** The value of the distribution column.

#### Return Value

The shard ID Azure Cosmos DB for PostgreSQL associates with the distribution column value
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
column](howto-choose-distribution-column.md).

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
[citus_stat_statements](reference-metadata.md#query-statistics-table).
This function works independently from `pg_stat_statements_reset()`. To reset
all stats, call both functions.

#### Arguments

N/A

#### Return Value

None

### citus_get_active_worker_nodes

The citus_get_active_worker_nodes() function returns a list of active worker
host names and port numbers.

#### Arguments

N/A

#### Return Value

List of tuples where each tuple contains the following information:

**node_name:** DNS name of the worker node

**node_port:** Port on the worker node on which the database server is
listening

#### Example

```postgresql
SELECT * from citus_get_active_worker_nodes();
 node_name | node_port
-----------+-----------
 localhost |      9700
 localhost |      9702
 localhost |      9701

(3 rows)
```

## Cluster management and repair

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
to another. It's typically used indirectly during shard rebalancing rather
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

The rebalance\_table\_shards() function moves shards of the given table to
distribute them evenly among the workers. The function first calculates the
list of moves it needs to make in order to ensure that the cluster is
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
[pg_dist_node](reference-metadata.md#worker-node-table); move no
other shards.

**rebalance\_strategy:** (Optional) the name of a strategy in
[pg_dist_rebalance_strategy](reference-metadata.md#rebalancer-strategy-table).
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
arguments will do. They aren't executed at the same time, so facts about the
cluster \-- for example, disk space \-- might differ between the calls.

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
[pg_dist_rebalance_strategy](reference-metadata.md?#rebalancer-strategy-table)
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
[pg_dist_rebalance_strategy](reference-metadata.md#rebalancer-strategy-table)
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

### isolate\_tenant\_to\_new\_shard

This function creates a new shard to hold rows with a specific single value in
the distribution column. It's especially handy for the multi-tenant
use case, where a large tenant can be placed alone on its own shard and
ultimately its own physical node.

#### Arguments

**table\_name:** The name of the table to get a new shard.

**tenant\_id:** The value of the distribution column that will be
assigned to the new shard.

**cascade\_option:** (Optional) When set to \"CASCADE,\" also isolates a shard
from all tables in the current table's [colocation
group](concepts-colocation.md).

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

* Many of the functions in this article modify system [metadata tables](reference-metadata.md)
* [Server parameters](reference-parameters.md) customize the behavior of some functions
