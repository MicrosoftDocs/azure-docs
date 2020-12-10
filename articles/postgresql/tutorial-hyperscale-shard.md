---
title: 'Tutorial: Shard data on worker nodes - Hyperscale (Citus) - Azure Database for PostgreSQL'
description: This tutorial shows how to create distributed tables and visualize how their data is distributed with Azure Database for PostgreSQL Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.custom: mvc
ms.devlang: azurecli
ms.topic: tutorial
ms.date: 11/25/2020
---

# Tutorial: Shard data on worker nodes in Azure Database for PostgreSQL – Hyperscale (Citus)

In this tutorial, you use Azure Database for PostgreSQL - Hyperscale (Citus) to learn how to:

> [!div class="checklist"]
> * Create hash-distributed shards
> * See where table shards are placed
> * Identify skewed distribution
> * Run queries faster using worker nodes
> * Create constraints on distributed tables

## Prerequisites

[!INCLUDE azure-postgresql-hyperscale-create-db](../../includes/azure-postgresql-hyperscale-create-db.md)]

## Get started with distributed data

Distributing table rows across multiple PostgreSQL servers is a key technique
for scalable queries in Hyperscale (Citus). Multiple servers (workers) can hold
more data than any individual worker, and in many cases can use worker CPUs in
parallel to execute queries.

In the prerequisites section we created a Hyperscale (Citus) server group with
two worker nodes. The coordinator node's metadata tables track workers and
distributed data. We can check the active workers in
[pg_dist_node](reference-hyperscale-metadata.md#worker-node-table).

```sql
select nodeid from pg_dist_node where isactive;
```
```
 nodeid | nodename
--------+-----------
      1 | 10.0.0.21
      2 | 10.0.0.23
```

> [!NOTE]
> Nodenames on Hyperscale (Citus) are internal IP addresses in a virtual
> network, and the actual addresses you see may differ.

### Rows, shards, and placements

Distributing a table assigns each row to to a logical group called a *shard.*
Each shard is mapped to a physical table on a worker node by its *shard
placement.* After distribution, a table's rows are stored in shard placements
on worker nodes; no rows remain on the coordinator node in distributed tables.

Let's create a table for users and distribute it, choosing `email` as its
*distribution column*:

```sql
-- create a table on the coordinator
create table users ( email text primary key, bday date not null );

-- distribute it into shards on workers
select create_distributed_table('users', 'email');

-- load sample data
insert into users
select
	md5(random()::text) || '@test.com',
	date_trunc('day', now() - random()*'100 years'::interval)
from generate_series(1, 1000);
```

By default `create_distributed_table()` makes 32 shards, as we can see by
counting in the metadata table
[pg_dist_shard](reference-hyperscale-metadata.md#shard-table):

```sql
select logicalrelid, count(shardid)
  from pg_dist_shard
 group by logicalrelid;
```
```
 logicalrelid | count
--------------+-------
 users        |    32
```

Hyperscale (Citus) uses information in the `pg_dist_shard` table to match rows
in a distributed table with shards, using a hash of the value in the
distribution column. The hashing details are unimportant for this tutorial.
What matters is that we can query to see which shard is assigned any value of
the distribution column:

```sql
-- Where would a row containing hi@test.com be stored?
-- (The value doesn't have to actually be present in users, the mapping
-- is just a mathematical operation consulting pg_dist_shard.)
select get_shard_id_for_distribution_column('users', 'hi@test.com');
```
```
 get_shard_id_for_distribution_column
--------------------------------------
                               102008
```

To connect the dots and see which worker node physically holds which rows of a
distributed table, we can look at the shard placements in
[pg_dist_placement](reference-hyperscale-metadata.md#shard-placement-table).
Joining it with the other metadata tables we've seen shows where each shard
lives.

```sql
-- limit the output to the first five placements

select
	shard.logicalrelid as table,
	placement.shardid as shard,
	node.nodename as host
from
	pg_dist_placement placement,
	pg_dist_node node,
	pg_dist_shard shard
where placement.groupid = node.groupid
  and shard.shardid = placement.shardid
order by shard
limit 5;
```
```
 table | shard  |    host
-------+--------+------------
 users | 102008 | 10.0.0.21
 users | 102009 | 10.0.0.23
 users | 102010 | 10.0.0.21
 users | 102011 | 10.0.0.23
 users | 102012 | 10.0.0.21
```

## Execute distributed queries

In the previous section we saw how distributed table rows are placed on worker
nodes. Don't worry, most of the time you don't need to know how or where data
is stored in a server group. Hyperscale (Citus) has a distributed query
executor that automatically splits up regular SQL queries and runs them in
parallel on worker nodes close to the data.

For instance, we can run a query to find the average age of users, treating the
distributed `users` table like it's a normal table on the coordinator.

```sql
select avg(current_date - bday) from users;
```
```
        avg
--------------------
 17926.348000000000
```

Behind the scenes, the Hyperscale (Citus) executor creates a separate query for
each shard, runs them on the workers, and combines the result. You can see this
if you use the PostgreSQL EXPLAIN command:

```sql
explain select avg(current_date - bday) from users;
```
```
                                  QUERY PLAN
----------------------------------------------------------------------------------
 Aggregate  (cost=500.00..500.02 rows=1 width=32)
   ->  Custom Scan (Citus Adaptive)  (cost=0.00..0.00 rows=100000 width=16)
     Task Count: 32
     Tasks Shown: One of 32
     ->  Task
       Node: host=10.0.0.21 port=5432 dbname=citus
       ->  Aggregate  (cost=41.75..41.76 rows=1 width=16)
         ->  Seq Scan on users_102040 users  (cost=0.00..22.70 rows=1270 width=4)
```

The output shows an example of an execution plan for a *query fragment* running
on shard 102040 (the table `users_102040` on worker 10.0.0.21). The other
fragments are similar and are thus not shown. We can see that the worker node
scans the shard tables and applies the aggregate. The coordinator node combines
the aggregates for the final result.

### Run queries faster using worker nodes

The worker nodes can run query fragments in parallel, potentially speeding up
the entire query. For most toy examples such as the one in the previous
section, running a distributed query is actually slower than running a normal
query on the corresponding large local table.  The communication overhead
between nodes and small extra planning time for distributing the query
counterbalances the parallelism. The advantage of Hyperscale (Citus) becomes
apparent only in larger workloads.

However, we can demonstrate a query speedup using our two workers by contriving
a query that is very CPU-bound, like computing lots of SHA-256 hashes. First
let's calculate a million of them on the coordinator node alone and see how
long it takes.

```sql
create table hashes ( val bytea );

\timing on

-- calculate a million cryptographic hashes
insert into hashes
select digest(i::text, 'sha256')
  from generate_series(1,1000000) i;
```
```
INSERT 0 1000000
Time: 3131.042 ms (00:03.131)
```

That took about three seconds. Now let's distribute the table and let the
workers calculate a million more between them.

```sql
select create_distributed_table('hashes', 'val');

insert into hashes
select digest(i::text, 'sha256')
  from generate_series(1000001,2000000) i;
```
```
INSERT 0 1000000
Time: 1706.436 ms (00:01.706)
```

The two workers did it in half the time, plus a little extra time for the
distributed query overhead.


--------------------------------------------------------

SELECT *
FROM run_command_on_shards('foo', $cmd$
  SELECT pg_size_pretty(pg_table_size('%1$s'));
$cmd$);
