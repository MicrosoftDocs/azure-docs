---
title: SQL functions – Hyperscale (Citus) - Azure Database for PostgreSQL
description: Functions the in Hyperscale (Citus) SQL API
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: reference
ms.date: 07/17/2020
---

# Functions in the Hyperscale (Citus) SQL API

This section contains reference information for the user defined functions
provided by Hyperscale (Citus). These functions help in providing additional
distributed functionality to Hyperscale (Citus) other than the standard SQL
commands.

## Table and Shard DDL

### create\_distributed\_table

The create\_distributed\_table() function is used to define a distributed table
and create its shards if it's a hash-distributed table. This function takes in
a table name, the distribution column and an optional distribution method and
inserts appropriate metadata to mark the table as distributed. The function
defaults to 'hash' distribution if no distribution method is specified. If the
table is hash-distributed, the function also creates worker shards based on the
shard count and shard replication factor configuration values. If the table
contains any rows, they are automatically distributed to worker nodes.

This function replaces usage of master\_create\_distributed\_table() followed
by master\_create\_worker\_shards().

#### Arguments

**table\_name:** Name of the table which needs to be distributed.

**distribution\_column:** The column on which the table is to be
distributed.

**distribution\_type:** (Optional) The method according to which the
table is to be distributed. Permissible values are append or hash, and
defaults to 'hash'.

**colocate\_with:** (Optional) include current table in the co-location group
of another table. By default tables are co-located when they are distributed by
columns of the same type, have the same shard count, and have the same
replication factor. If you want to break this colocation later, you can use
[update_distributed_table_colocation](#update_distributed_table_colocation).
Possible values for `colocate_with` are `default`, `none` to start a new
co-location group, or the name of another table to co-locate with that table.
(See [table colocation](concepts-hyperscale-colocation.md).)

Keep in mind that the default value of `colocate_with` does implicit
co-location. As [colocation](concepts-hyperscale-colocation.md) explains, this can
be a great thing when tables are related or will be joined.  However when two
tables are unrelated but happen to use the same datatype for their distribution
columns, accidentally co-locating them can decrease performance during [shard
rebalancing](howto-hyperscale-scaling.md#rebalance-shards).  The table
shards will be moved together unnecessarily in a \"cascade.\" If you want to
break this implicit colocation, you can use
[update_distributed_table_colocation](#update_distributed_table_colocation).

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

### truncate\_local\_data\_after\_distributing\_table

Truncate all local rows after distributing a table, and prevent
constraints from failing due to outdated local records. The truncation
cascades to tables having a foreign key to the designated table. If the
referring tables are not themselves distributed then truncation is
forbidden until they are, to protect referential integrity:

```
ERROR:  cannot truncate a table referenced in a foreign key constraint by a local table
```

Truncating local coordinator node table data is safe for distributed
tables because their rows, if they have any, are copied to worker nodes
during distribution.

#### Arguments

**table\_name:** Name of the distributed table whose local counterpart
on the coordinator node should be truncated.

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

**table\_name:** Name of the small dimension or reference table which
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
table which has a shard count of one, and upgrades it to be a recognized
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
the same co-location group as the source. If the source is not yet in a
group, this function creates one, and assigns the source and targets to
it.

Usually colocating tables ought to be done at table distribution time via the
`colocate_with` parameter of [create_distributed_table](#create-distributed-table)
But `mark_tables_colocated` can take care of it if necessary.

If you want to break colocation of a table, you can use
[update_distributed_table_colocation](#update_distributed_table_colocation).

#### Arguments

**source\_table\_name:** Name of the distributed table whose co-location
group the targets will be assigned to match.

**target\_table\_names:** Array of names of the distributed target
tables, must be non-empty. These distributed tables must match the
source table in:

> -   distribution method
> -   distribution column type
> -   replication type
> -   shard count

Failing this, Hyperscale (Citus) will raise an error. For instance, attempting
to colocate tables `apples` and `oranges` whose distribution column types
differ results in:

```
ERROR:  XX000: cannot colocate tables apples and oranges
DETAIL:  Distribution column types don't match for apples and oranges.
```

#### Return Value

N/A

#### Example

This example puts `products` and `line_items` in the same co-location
group as `stores`. The example assumes that these tables are all
distributed on a column with matching type, most likely a \"store id.\"

```postgresql
SELECT mark_tables_colocated('stores', ARRAY['products', 'line_items']);
```

### update\_distributed\_table\_colocation

The update\_distributed\_table\_colocation() function is used to update
colocation of a distributed table. This function can also be used to break
colocation of a distributed table. Hyperscale (Citus) will implicitly colocate
two tables if the distribution column is the same type, this can be useful if
the tables are related and will do some joins. If table A and B are colocated,
and table A gets rebalanced, table B will also be rebalanced. If table B does
not have a replica identity, the rebalance will fail. Therefore, this function
can be useful breaking the implicit colocation in that case.

Both of the arguments should be a hash distributed table, currently we
do not support colocation of APPEND or RANGE distributed tables.

Note that this function does not move any data around physically.

#### Arguments

**table\_name:** Name of the table colocation of which will be updated.

**colocate\_with:** The table to which the table should be colocated
with.

If you want to break the colocation of a table, you should specify
`colocate_with => 'none'`.

#### Return Value

N/A

#### Example

This example shows that colocation of `table A` is updated as colocation
of `table B`.

```postgresql
SELECT update_distributed_table_colocation('A', colocate_with => 'B');
```

Assume that `table A` and `table B` are colocated( possibily
implicitly), if you want to break the colocation:

```postgresql
SELECT update_distributed_table_colocation('A', colocate_with => 'none');
```

Now, assume that `table A`, `table B`, `table C` and `table D` are
colocated and you want to colocate `table A` and `table B` together, and
`table C` and `table D` together:

```postgresql
SELECT update_distributed_table_colocation('C', colocate_with => 'none');
SELECT update_distributed_table_colocation('D', colocate_with => 'C');
```

If you have a hash distributed table named `none` and you want to update
its colocation, you can do:

```postgresql
SELECT update_distributed_table_colocation('"none"', colocate_with => 'some_other_hash_distributed_table');
```

### create\_distributed\_function

Propagates a function from the coordinator node to workers, and marks it
for distributed execution. When a distributed function is called on the
coordinator, Hyperscale (Citus) uses the value of the \"distribution argument\" to
pick a worker node to run the function. Executing the function on
workers increases parallelism, and can bring the code closer to data in
shards for lower latency.

Note that the Postgres search path is not propagated from the
coordinator to workers during distributed function execution, so
distributed function code should fully-qualify the names of database
objects. Also notices emitted by the functions will not be displayed to
the user.

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
future the function will automatically be created there too.

**colocate\_with:** (Optional) When the distributed function reads or writes to
a distributed table (or more generally colocation group), be sure to name that
table using the `colocate_with` parameter. This ensures that each invocation of
the function runs on the worker node containing relevant shards.

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

### master\_create\_distributed\_table

> [!WARNING]
> This function is deprecated, and replaced by
> [create_distributed_table](#create-distributed-table).

The master\_create\_distributed\_table() function is used to define a
distributed table. This function takes in a table name, the distribution
column and distribution method and inserts appropriate metadata to mark
the table as distributed.

#### Arguments

**table\_name:** Name of the table which needs to be distributed.

**distribution\_column:** The column on which the table is to be
distributed.

**distribution\_method:** The method according to which the table is to
be distributed. Permissible values are append or hash.

#### Return Value

N/A

#### Example

This example informs the database that the github\_events table should
be distributed by hash on the repo\_id column.

```postgresql
SELECT master_create_distributed_table('github_events', 'repo_id', 'hash');
```

### master\_create\_worker\_shards

 > [!WARNING]
> This function is deprecated, and replaced by
> [create_distributed_table](#create-distributed_table)

The master\_create\_worker\_shards() function creates a specified number of
worker shards with the desired replication factor for a *hash* distributed
table. While doing so, the function also assigns a portion of the hash token
space (which spans between -2 Billion and 2 Billion) to each shard. Once all
shards are created, this function saves all distributed metadata on the
coordinator.

#### Arguments

**table\_name:** Name of hash distributed table for which shards are to
be created.

**shard\_count:** Number of shards to create.

**replication\_factor:** Desired replication factor for each shard.

#### Return Value

N/A

#### Example

This example usage would create a total of 16 shards for the
github\_events table where each shard owns a portion of a hash token
space and gets replicated on 2 workers.

```postgresql
SELECT master_create_worker_shards('github_events', 16, 2);
```

### master\_create\_empty\_shard

The master\_create\_empty\_shard() function can be used to create an
empty shard for an *append* distributed table. Behind the covers, the
function first selects shard\_replication\_factor workers to create the
shard on. Then, it connects to the workers and creates empty placements
for the shard on the selected workers. Finally, the metadata is updated
for these placements on the coordinator to make these shards visible to
future queries. The function errors out if it is unable to create the
desired number of shard placements.

#### Arguments

**table\_name:** Name of the append distributed table for which the new
shard is to be created.

#### Return Value

**shard\_id:** The function returns the unique id assigned to the newly
created shard.

#### Example

This example creates an empty shard for the github\_events table. The
shard id of the created shard is 102089.

```postgresql
SELECT * from master_create_empty_shard('github_events');
 master_create_empty_shard
---------------------------
                102089
(1 row)
```

## Table and Shard DML

### master\_append\_table\_to\_shard

The master\_append\_table\_to\_shard() function can be used to append a
PostgreSQL table's contents to a shard of an *append* distributed
table. Behind the covers, the function connects to each of the workers
which have a placement of that shard and appends the contents of the
table to each of them. Then, the function updates metadata for the shard
placements on the basis of whether the append succeeded or failed on
each of them.

If the function is able to successfully append to at least one shard
placement, the function will return successfully. It will also mark any
placement to which the append failed as INACTIVE so that any future
queries do not consider that placement. If the append fails for all
placements, the function quits with an error (as no data was appended).
In this case, the metadata is left unchanged.

#### Arguments

**shard\_id:** Id of the shard to which the contents of the table have
to be appended.

**source\_table\_name:** Name of the PostgreSQL table whose contents
have to be appended.

**source\_node\_name:** DNS name of the node on which the source table
is present (\"source\" node).

**source\_node\_port:** The port on the source worker node on which the
database server is listening.

#### Return Value

**shard\_fill\_ratio:** The function returns the fill ratio of the shard
which is defined as the ratio of the current shard size to the
configuration parameter shard\_max\_size.

#### Example

This example appends the contents of the github\_events\_local table to
the shard having shard id 102089. The table github\_events\_local is
present on the database running on the node master-101 on port number
5432. The function returns the ratio of the the current shard size to
the maximum shard size, which is 0.1 indicating that 10% of the shard
has been filled.

```postgresql
SELECT * from master_append_table_to_shard(102089,'github_events_local','master-101', 5432);
 master_append_table_to_shard
------------------------------
                 0.100548
(1 row)
```

### master\_apply\_delete\_command

The master\_apply\_delete\_command() function is used to delete shards
which match the criteria specified by the delete command on an *append*
distributed table. This function deletes a shard only if all rows in the
shard match the delete criteria. As the function uses shard metadata to
decide whether or not a shard needs to be deleted, it requires the WHERE
clause in the DELETE statement to be on the distribution column. If no
condition is specified, then all shards of that table are deleted.

Behind the covers, this function connects to all the worker nodes which
have shards matching the delete criteria and sends them a command to
drop the selected shards. Then, the function updates the corresponding
metadata on the coordinator. If the function is able to successfully
delete a shard placement, then the metadata for it is deleted. If a
particular placement could not be deleted, then it is marked as TO
DELETE. The placements which are marked as TO DELETE are not considered
for future queries and can be cleaned up later.

#### Arguments

**delete\_command:** valid [SQL
DELETE](http://www.postgresql.org/docs/current/static/sql-delete.html)
command

#### Return Value

**deleted\_shard\_count:** The function returns the number of shards
which matched the criteria and were deleted (or marked for deletion).
Note that this is the number of shards and not the number of shard
placements.

#### Example

The first example deletes all the shards for the github\_events table
since no delete criteria is specified. In the second example, only the
shards matching the criteria (3 in this case) are deleted.

```postgresql
SELECT * from master_apply_delete_command('DELETE FROM github_events');
 master_apply_delete_command
-----------------------------
                           5
(1 row)

SELECT * from master_apply_delete_command('DELETE FROM github_events WHERE review_date < ''2009-03-01''');
 master_apply_delete_command
-----------------------------
                           3
(1 row)
```

### master\_modify\_multiple\_shards

The master\_modify\_multiple\_shards() function is used to run data
modification statements which could span multiple shards. Depending on
the value of citus.multi\_shard\_commit\_protocol, the commit can be
done in one- or two-phases.

Limitations:

-   It cannot be called inside a transaction block
-   It must be called with simple operator expressions only

#### Arguments

**modify\_query:** A simple DELETE or UPDATE query as a string.

#### Return Value

N/A

#### Example

```postgresql
SELECT master_modify_multiple_shards(
  'DELETE FROM customer_delete_protocol WHERE c_custkey > 500 AND c_custkey < 500');
```

## Metadata / Configuration Information

### master\_add\_node

The master\_add\_node() function registers a new node addition in the server
group in the Hyperscale (Citus) metadata table pg\_dist\_node. It also copies
reference tables to the new node.

#### Arguments

**node\_name:** DNS name or IP address of the new node to be added.

**node\_port:** The port on which PostgreSQL is listening on the worker
node.

**group\_id:** A group of one primary server and zero or more secondary
servers, relevant only for streaming replication. Default -1

**node\_role:** Whether it is 'primary' or 'secondary'. Default
'primary'

**node\_cluster:** The server group name. Default 'default'

#### Return Value

The nodeid column from the newly inserted row in
`pg_dist_node <pg_dist_node>`{.interpreted-text role="ref"}.

#### Example

```postgresql
select * from master_add_node('new-node', 12345);
 master_add_node
-----------------
               7
(1 row)
```

### master\_update\_node

The master\_update\_node() function changes the hostname and port for a node
registered in the Hyperscale (Citus) metadata table `pg_dist_node
<pg_dist_node>`{.interpreted-text role="ref"}.

#### Arguments

**node\_id:** id from the pg\_dist\_node table.

**node\_name:** updated DNS name or IP address for the node.

**node\_port:** the port on which PostgreSQL is listening on the worker
node.

#### Return Value

N/A

#### Example

```postgresql
select * from master_update_node(123, 'new-address', 5432);
```

### master\_set\_node\_property

The master\_set\_node\_property() function changes properties in the Hyperscale
(Citus) metadata table `pg_dist_node <pg_dist_node>`{.interpreted-text
role="ref"}. Currently it can change only the `shouldhaveshards` property.

#### Arguments

**node\_name:** DNS name or IP address for the node.

**node\_port:** the port on which PostgreSQL is listening on the worker
node.

**property:** the column to change in `pg_dist_node`, currently only
`shouldhaveshard` is supported.

**value:** the new value for the column.

#### Return Value

N/A

#### Example

```postgresql
SELECT * FROM master_set_node_property('localhost', 5433, 'shouldhaveshards', false);
```

### master\_add\_inactive\_node

The `master_add_inactive_node` function, similar to
[master_add_node](#master-add-node), registers a new node in
`pg_dist_node`. However it marks the new node as inactive, meaning no
shards will be placed there. Also it does *not* copy reference tables to
the new node.

#### Arguments

**node\_name:** DNS name or IP address of the new node to be added.

**node\_port:** The port on which PostgreSQL is listening on the worker
node.

**group\_id:** A group of one primary server and zero or more secondary
servers, relevant only for streaming replication. Default -1

**node\_role:** Whether it is 'primary' or 'secondary'. Default
'primary'

**node\_cluster:** The server group name. Default 'default'

#### Return Value

The nodeid column from the newly inserted row in
`pg_dist_node <pg_dist_node>`{.interpreted-text role="ref"}.

#### Example

```postgresql
select * from master_add_inactive_node('new-node', 12345);
 master_add_inactive_node
--------------------------
                        7
(1 row)
```

### master\_activate\_node

The `master_activate_node` function marks a node as active in the Hyperscale
(Citus) metadata table `pg_dist_node` and copies reference tables to the node.
Useful for nodes added via [master_add_inactive_node](#master-add-inactive-node).

#### Arguments

**node\_name:** DNS name or IP address of the new node to be added.

**node\_port:** The port on which PostgreSQL is listening on the worker
node.

#### Return Value

The nodeid column from the newly inserted row in
`pg_dist_node <pg_dist_node>`{.interpreted-text role="ref"}.

#### Example

```postgresql
select * from master_activate_node('new-node', 12345);
 master_activate_node
----------------------
                    7
(1 row)
```

### master\_disable\_node

The `master_disable_node` function is the opposite of `master_activate_node`.
It marks a node as inactive in the Hyperscale (Citus) metadata table
`pg_dist_node`, removing it from the server group temporarily.  The function
also deletes all reference table placements from the disabled node. To
reactivate the node, just run `master_activate_node` again.

#### Arguments

**node\_name:** DNS name or IP address of the node to be disabled.

**node\_port:** The port on which PostgreSQL is listening on the worker
node.

#### Return Value

N/A

#### Example

```postgresql
select * from master_disable_node('new-node', 12345);
```

### master\_add\_secondary\_node

The master\_add\_secondary\_node() function registers a new secondary node in
the server group for an existing primary node. It updates the Hyperscale
(Citus) metadata table pg\_dist\_node.

#### Arguments

**node\_name:** DNS name or IP address of the new node to be added.

**node\_port:** The port on which PostgreSQL is listening on the worker
node.

**primary\_name:** DNS name or IP address of the primary node for this
secondary.

**primary\_port:** The port on which PostgreSQL is listening on the
primary node.

**node\_cluster:** The server group name. Default 'default'

#### Return Value

The nodeid column for the secondary node, inserted row in
`pg_dist_node <pg_dist_node>`{.interpreted-text role="ref"}.

#### Example

```postgresql
select * from master_add_secondary_node('new-node', 12345, 'primary-node', 12345);
 master_add_secondary_node
---------------------------
                         7
(1 row)
```

### master\_remove\_node

The master\_remove\_node() function removes the specified node from the
pg\_dist\_node metadata table. This function will error out if there are
existing shard placements on this node. Thus, before using this
function, the shards will need to be moved off that node.

#### Arguments

**node\_name:** DNS name of the node to be removed.

**node\_port:** The port on which PostgreSQL is listening on the worker
node.

#### Return Value

N/A

#### Example

```postgresql
select master_remove_node('new-node', 12345);
 master_remove_node 
--------------------

(1 row)
```

### master\_get\_active\_worker\_nodes

The master\_get\_active\_worker\_nodes() function returns a list of
active worker host names and port numbers.

#### Arguments

N/A

#### Return Value

List of tuples where each tuple contains the following information:

**node\_name:** DNS name of the worker node

**node\_port:** Port on the worker node on which the database server is
listening

#### Example

```postgresql
SELECT * from master_get_active_worker_nodes();
 node_name | node_port 
-----------+-----------
 localhost |      9700
 localhost |      9702
 localhost |      9701

(3 rows)
```

### master\_get\_table\_metadata

The master\_get\_table\_metadata() function can be used to return distribution
related metadata for a distributed table. This metadata includes the relation
id, storage type, distribution method, distribution column, replication count,
maximum shard size and the shard placement policy for that table. Behind the
covers, this function queries Hyperscale (Citus) metadata tables to get the
required information and concatenates it into a tuple before returning it to
the user.

#### Arguments

**table\_name:** Name of the distributed table for which you want to
fetch metadata.

#### Return Value

A tuple containing the following information:

**logical\_relid:** Oid of the distributed table. This values references
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

### get\_shard\_id\_for\_distribution\_column {#get_shard_id}

Hyperscale (Citus) assigns every row of a distributed table to a shard based on
the value of the row's distribution column and the table's method of
distribution. In most cases the precise mapping is a low-level detail that the
database administrator can ignore. However it can be useful to determine a
row's shard, either for manual database maintenance tasks or just to satisfy
curiosity. The `get_shard_id_for_distribution_column` function provides this
info for hash- and range-distributed tables as well as reference tables. It
does not work for the append distribution.

#### Arguments

**table\_name:** The distributed table.

**distribution\_value:** The value of the distribution column.

#### Return Value

The shard id Hyperscale (Citus) associates with the distribution column value for the
given table.

#### Example

```postgresql
SELECT get_shard_id_for_distribution_column('my_table', 4);

 get_shard_id_for_distribution_column
--------------------------------------
                               540007
(1 row)
```

### column\_to\_column\_name

Translates the `partkey` column of `pg_dist_partition` into a textual
column name. This is useful to determine the distribution column of a
distributed table.

For a more detailed discussion, see [choosing a distribution
column](concepts-hyperscale-choose-distribution-column).

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

Get the disk space used by all the shards of the specified distributed
table. This includes the size of the \"main fork,\" but excludes the
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

Get the disk space used by all the shards of the specified distributed
table, excluding indexes (but including TOAST, free space map, and
visibility map).

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

Removes all rows from `citus_stat_statements
<citus_stat_statements>`{.interpreted-text role="ref"}. Note that this works
independently from `pg_stat_statements_reset()`. To reset all stats, call both
functions.

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

**shard\_id:** Id of the shard to be repaired.

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

The example below will repair an inactive shard placement of shard 12345
which is present on the database server running on 'bad\_host' on port
5432. To repair it, it will use data from a healthy shard placement
present on the server running on 'good\_host' on port 5432.

```postgresql
SELECT master_copy_shard_placement(12345, 'good_host', 5432, 'bad_host', 5432);
```

### master\_move\_shard\_placement

This function moves a given shard (and shards co-located with it) from
one node to another. It is typically used indirectly during shard
rebalancing rather than being called directly by a database
administrator.

There are two ways to move the data: blocking or nonblocking. The
blocking approach means that during the move all modifications to the
shard are paused. The second way, which avoids blocking shard writes,
relies on Postgres 10 logical replication.

After a successful move operation, shards in the source node get
deleted. If the move fails at any point, this function throws an error
and leaves the source and target nodes unchanged.

#### Arguments

**shard\_id:** Id of the shard to be moved.

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

1.  The shards are roughly the same size
2.  The shards get roughly the same amount of traffic
3.  Worker nodes are all the same size/type
4.  Shards haven't been pinned to particular workers

If any of these assumptions don't hold, then the default rebalancing
can result in a bad plan. In this case you may customize the strategy,
using the `rebalance_strategy` parameter.

It's advisable to call
[get_rebalance_table_shards_plan](#get-rebalance-table-shards-plan) before
running rebalance\_table\_shards, to see and verify the actions to be
performed.

#### Arguments

**table\_name:** (Optional) The name of the table whose shards need to
be rebalanced. If NULL, then rebalance all existing colocation groups.

**threshold:** (Optional) A float number between 0.0 and 1.0 which
indicates the maximum difference ratio of node utilization from average
utilization. For example, specifying 0.1 will cause the shard rebalancer
to attempt to balance all nodes to hold the same number of shards ±10%.
Specifically, the shard rebalancer will try to converge utilization of
all worker nodes to the (1 - threshold) \* average\_utilization \... (1
+ threshold) \* average\_utilization range.

**max\_shard\_moves:** (Optional) The maximum number of shards to move.

**excluded\_shard\_list:** (Optional) Identifiers of shards which
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

**drain\_only:** (Optional) When true, move shards off worker nodes who
have `shouldhaveshards` set to false in `pg_dist_node`{.interpreted-text
role="ref"}; move no other shards.

**rebalance\_strategy:** (Optional) the name of a strategy in
`pg_dist_rebalance_strategy`{.interpreted-text role="ref"}. If this
argument is omitted, the function chooses the default strategy, as
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
without moving shards with id 1 and 2.

```postgresql
SELECT rebalance_table_shards('github_events', excluded_shard_list:='{1,2}');
```

### get\_rebalance\_table\_shards\_plan

Output the planned shard movements of
[rebalance_table_shards](#rebalance-table-shards) without performing them.
While it's unlikely, get\_rebalance\_table\_shards\_plan can output a slightly
different plan than what a rebalance\_table\_shards call with the same
arguments will do. This could happen because they are not executed at the same
time, so facts about the server group \-- e.g. disk space \-- might differ
between the calls.

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

Append a row to the `pg_dist_rebalance_strategy`.

#### Arguments

For more about these arguments, see the corresponding column values in
`pg_dist_rebalance_strategy`{.interpreted-text role="ref"}.

**name:** identifier for the new strategy

**shard\_cost\_function:** identifies the function used to determine the
\"cost\" of each shard

**node\_capacity\_function:** identifies the function to measure node
capacity

**shard\_allowed\_on\_node\_function:** identifies the function which
determines which shards can be placed on which nodes

**default\_threshold:** a floating point threshold that tunes how
precisely the cumulative shard cost should be balanced between nodes

**minimum\_threshold:** (Optional) a safeguard column that holds the
minimum value allowed for the threshold argument of
rebalance\_table\_shards(). Its default value is 0

#### Return Value

N/A

### citus\_set\_default\_rebalance\_strategy

Update the `pg_dist_rebalance_strategy`{.interpreted-text role="ref"}
table, changing the strategy named by its argument to be the default
chosen when rebalancing shards.

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
`pg_dist_node`{.interpreted-text role="ref"}. This function is designed to be
called prior to removing a node from the server group, i.e. turning the node's
physical server off.

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
`pg_dist_rebalance_strategy`{.interpreted-text role="ref"}. If this
argument is omitted, the function chooses the default strategy, as
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

When draining multiple nodes it's recommended to use
[rebalance_table_shards](#rebalance-table-shards) instead. Doing so allows
Hyperscale (Citus) to plan ahead and move shards the minimum number of times.

1.  Run this for each node that you want to remove:

    ```postgresql
    SELECT * FROM master_set_node_property(node_hostname, node_port, 'shouldhaveshards', false);
    ```

2.  Drain them all at once with
    [rebalance_table_shards](#rebalance-table-shards)

    ```postgresql
    SELECT * FROM rebalance_table_shards(drain_only := true);
    ```

3.  Wait until the draining rebalance finishes

4.  Remove the nodes

### replicate\_table\_shards

The replicate\_table\_shards() function replicates the under-replicated
shards of the given table. The function first calculates the list of
under-replicated shards and locations from which they can be fetched for
replication. The function then copies over those shards and updates the
corresponding shard metadata to reflect the copy.

#### Arguments

**table\_name:** The name of the table whose shards need to be
replicated.

**shard\_replication\_factor:** (Optional) The desired replication
factor to achieve for each shard.

**max\_shard\_copies:** (Optional) Maximum number of shards to copy to
reach the desired replication factor.

**excluded\_shard\_list:** (Optional) Identifiers of shards which
shouldn't be copied during the replication operation.

#### Return Value

N/A

#### Examples

The example below will attempt to replicate the shards of the
github\_events table to shard\_replication\_factor.

```postgresql
SELECT replicate_table_shards('github_events');
```

This example will attempt to bring the shards of the github\_events
table to the desired replication factor with a maximum of 10 shard
copies. This means that the rebalancer will copy only a maximum of 10
shards in its attempt to reach the desired replication factor.

```postgresql
SELECT replicate_table_shards('github_events', max_shard_copies:=10);
```

### isolate\_tenant\_to\_new\_shard

This function creates a new shard to hold rows with a specific single value in
the distribution column. It is especially handy for the multi-tenant Hyperscale
(Citus) use case, where a large tenant can be placed alone on its own shard and
ultimately its own physical node.

For a more in-depth discussion, see `tenant_isolation`{.interpreted-text
role="ref"}.

#### Arguments

**table\_name:** The name of the table to get a new shard.

**tenant\_id:** The value of the distribution column which will be
assigned to the new shard.

**cascade\_option:** (Optional) When set to \"CASCADE,\" also isolates a shard
from all tables in the current table's [colocation
group](concepts-hyperscale-colocation.md).

#### Return Value

**shard\_id:** The function returns the unique id assigned to the newly
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

### citus\_create\_restore\_point

Temporarily blocks writes to the server group, and creates a named restore
point on all nodes. This function is similar to
[pg\_create\_restore\_point](https://www.postgresql.org/docs/10/static/functions-admin.html#FUNCTIONS-ADMIN-BACKUP),
but applies to all nodes and makes sure the restore point is consistent across
them. This function is well suited to doing point-in-time recovery, and server
group forking.

#### Arguments

**name:** The name of the restore point to create.

#### Return Value

**coordinator\_lsn:** Log sequence number of the restore point in the
coordinator node WAL.

#### Examples

```postgresql
select citus_create_restore_point('foo');
```

```
┌────────────────────────────┐
│ citus_create_restore_point │
├────────────────────────────┤
│ 0/1EA2808                  │
└────────────────────────────┘
```
