---
title: Modify distributed tables - Azure Cosmos DB for PostgreSQL
description: SQL commands to create and modify distributed tables
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: how-to
ms.date: 01/30/2023
---

# Distribute and modify tables in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

## Distributing tables

To create a distributed table, you need to first define the table schema. To do
so, you can define a table using the [CREATE
TABLE](http://www.postgresql.org/docs/current/static/sql-createtable.html)
statement in the same way as you would do with a regular PostgreSQL table.

```sql
CREATE TABLE github_events
(
    event_id bigint,
    event_type text,
    event_public boolean,
    repo_id bigint,
    payload jsonb,
    repo jsonb,
    actor jsonb,
    org jsonb,
    created_at timestamp
);
```

Next, you can use the create\_distributed\_table() function to specify
the table distribution column and create the worker shards.

```sql
SELECT create_distributed_table('github_events', 'repo_id');
```

The function call informs Azure Cosmos DB for PostgreSQL that the github\_events table
should be distributed on the repo\_id column (by hashing the column value).

It creates a total of 32 shards by default, where each shard owns a portion of
a hash space and gets replicated based on the default
citus.shard\_replication\_factor configuration value. The shard replicas
created on the worker have the same table schema, index, and constraint
definitions as the table on the coordinator. Once the replicas are created, the
function saves all distributed metadata on the coordinator.

Each created shard is assigned a unique shard ID and all its replicas have the
same shard ID. Shards are represented on the worker node as regular PostgreSQL
tables named \'tablename\_shardid\' where tablename is the name of the
distributed table, and shard ID is the unique ID assigned. You can connect to
the worker postgres instances to view or run commands on individual shards.

You're now ready to insert data into the distributed table and run queries on
it. You can also learn more about the UDF used in this section in the [table
and shard DDL](reference-functions.md#table-and-shard-ddl)
reference.

### Reference Tables

The above method distributes tables into multiple horizontal shards.  Another
possibility is distributing tables into a single shard and replicating the
shard to every worker node. Tables distributed this way are called *reference
tables.* They are used to store data that needs to be frequently accessed by
multiple nodes in a cluster.

Common candidates for reference tables include:

-   Smaller tables that need to join with larger distributed tables.
-   Tables in multi-tenant apps that lack a tenant ID column or which aren\'t
    associated with a tenant. (Or, during migration, even for some tables
    associated with a tenant.)
-   Tables that need unique constraints across multiple columns and are
    small enough.

For instance, suppose a multi-tenant eCommerce site needs to calculate sales
tax for transactions in any of its stores. Tax information isn\'t specific to
any tenant. It makes sense to put it in a shared table. A US-centric reference
table might look like this:

```postgresql
-- a reference table

CREATE TABLE states (
  code char(2) PRIMARY KEY,
  full_name text NOT NULL,
  general_sales_tax numeric(4,3)
);

-- distribute it to all workers

SELECT create_reference_table('states');
```

Now queries such as one calculating tax for a shopping cart can join on the
`states` table with no network overhead, and can add a foreign key to the state
code for better validation.

In addition to distributing a table as a single replicated shard, the
`create_reference_table` UDF marks it as a reference table in the Azure Cosmos
DB for PostgreSQL metadata tables. Azure Cosmos DB for PostgreSQL automatically performs
two-phase commits
([2PC](https://en.wikipedia.org/wiki/Two-phase_commit_protocol)) for
modifications to tables marked this way, which provides strong consistency
guarantees.

For another example of using reference tables, see the [multi-tenant database
tutorial](tutorial-design-database-multi-tenant.md).

### Distributing Coordinator Data

If an existing PostgreSQL database is converted into the coordinator node for a
cluster, the data in its tables can be distributed
efficiently and with minimal interruption to an application.

The `create_distributed_table` function described earlier works on both empty
and non-empty tables, and for the latter it automatically distributes table
rows throughout the cluster. You will know if it copies data by the presence of
the message, \"NOTICE: Copying data from local table\...\" For example:

```postgresql
CREATE TABLE series AS SELECT i FROM generate_series(1,1000000) i;
SELECT create_distributed_table('series', 'i');
NOTICE:  Copying data from local table...
 create_distributed_table
 --------------------------

 (1 row)
```

Writes on the table are blocked while the data is migrated, and pending writes
are handled as distributed queries once the function commits. (If the function
fails then the queries become local again.) Reads can continue as normal and
will become distributed queries once the function commits.

When distributing tables A and B, where A has a foreign key to B, distribute
the key destination table B first. Doing it in the wrong order will cause an
error:

```
ERROR:  cannot create foreign key constraint
DETAIL:  Referenced table must be a distributed table or a reference table.
```

If it's not possible to distribute in the correct order, then drop the foreign
keys, distribute the tables, and recreate the foreign keys.

When migrating data from an external database, such as from Amazon RDS to
Azure Cosmos DB for PostgreSQL, first create the Azure Cosmos DB for PostgreSQL distributed
tables via `create_distributed_table`, then copy the data into the table.
Copying into distributed tables avoids running out of space on the coordinator
node.

## Colocating tables

Colocation means placing keeping related information on the same machines. It
enables efficient queries, while taking advantage of the horizontal scalability
for the whole dataset. For more information, see
[colocation](concepts-colocation.md).

Tables are colocated in groups. To manually control a table's colocation group
assignment, use the optional `colocate_with` parameter of
`create_distributed_table`. If you don\'t care about a table\'s colocation then
omit this parameter. It defaults to the value `'default'`, which groups the
table with any other default colocation table having the same distribution
column type, shard count, and replication factor. If you want to break or
update this implicit colocation, you can use
`update_distributed_table_colocation()`.

```postgresql
-- these tables are implicitly co-located by using the same
-- distribution column type and shard count with the default
-- co-location group

SELECT create_distributed_table('A', 'some_int_col');
SELECT create_distributed_table('B', 'other_int_col');
```

When a new table is not related to others in its would-be implicit
colocation group, specify `colocated_with => 'none'`.

```postgresql
-- not co-located with other tables

SELECT create_distributed_table('A', 'foo', colocate_with => 'none');
```

Splitting unrelated tables into their own colocation groups will improve [shard
rebalancing](howto-scale-rebalance.md) performance, because
shards in the same group have to be moved together.

When tables are indeed related (for instance when they will be joined), it can
make sense to explicitly colocate them. The gains of appropriate colocation are
more important than any rebalancing overhead.

To explicitly colocate multiple tables, distribute one and then put the others
into its colocation group. For example:

```postgresql
-- distribute stores
SELECT create_distributed_table('stores', 'store_id');

-- add to the same group as stores
SELECT create_distributed_table('orders', 'store_id', colocate_with => 'stores');
SELECT create_distributed_table('products', 'store_id', colocate_with => 'stores');
```

Information about colocation groups is stored in the
[pg_dist_colocation](reference-metadata.md#colocation-group-table)
table, while
[pg_dist_partition](reference-metadata.md#partition-table) reveals
which tables are assigned to which groups.

## Dropping tables

You can use the standard PostgreSQL DROP TABLE command to remove your
distributed tables. As with regular tables, DROP TABLE removes any indexes,
rules, triggers, and constraints that exist for the target table. In addition,
it also drops the shards on the worker nodes and cleans up their metadata.

```sql
DROP TABLE github_events;
```

## Modifying tables

Azure Cosmos DB for PostgreSQL automatically propagates many kinds of DDL statements.
Modifying a distributed table on the coordinator node will update shards on the
workers too. Other DDL statements require manual propagation, and certain
others are prohibited such as any which would modify a distribution column.
Attempting to run DDL that is ineligible for automatic propagation will raise
an error and leave tables on the coordinator node unchanged.

Here is a reference of the categories of DDL statements that propagate.

### Adding/Modifying Columns

Azure Cosmos DB for PostgreSQL propagates most [ALTER
TABLE](https://www.postgresql.org/docs/current/static/ddl-alter.html) commands
automatically. Adding columns or changing their default values work as they
would in a single-machine PostgreSQL database:

```postgresql
-- Adding a column

ALTER TABLE products ADD COLUMN description text;

-- Changing default value

ALTER TABLE products ALTER COLUMN price SET DEFAULT 7.77;
```

Significant changes to an existing column like renaming it or changing its data
type are fine too. However the data type of the [distribution
column](concepts-nodes.md#distribution-column) cannot be altered.
This column determines how table data distributes through the cluster,
and modifying its data type would require moving the data.

Attempting to do so causes an error:

```postgres
-- assumining store_id is the distribution column
-- for products, and that it has type integer

ALTER TABLE products
ALTER COLUMN store_id TYPE text;

/*
ERROR:  XX000: cannot execute ALTER TABLE command involving partition column
LOCATION:  ErrorIfUnsupportedAlterTableStmt, multi_utility.c:2150
*/
```

### Adding/Removing Constraints

Using Azure Cosmos DB for PostgreSQL allows you to continue to enjoy the safety of a
relational database, including database constraints (see the PostgreSQL
[docs](https://www.postgresql.org/docs/current/static/ddl-constraints.html)).
Due to the nature of distributed systems, Azure Cosmos DB for PostgreSQL will not
cross-reference uniqueness constraints or referential integrity between worker
nodes.

To set up a foreign key between colocated distributed tables, always include
the distribution column in the key. Including the distribution column may
involve making the key compound.

Foreign keys may be created in these situations:

-   between two local (non-distributed) tables,
-   between two reference tables,
-   between two [colocated](concepts-colocation.md) distributed
    tables when the key includes the distribution column, or
-   as a distributed table referencing a [reference
    table](concepts-nodes.md#type-2-reference-tables)

Foreign keys from reference tables to distributed tables are not
supported.

> [!NOTE]
>
> Primary keys and uniqueness constraints must include the distribution
> column. Adding them to a non-distribution column will generate an error

This example shows how to create primary and foreign keys on distributed
tables:

```postgresql
--
-- Adding a primary key
-- --------------------

-- We'll distribute these tables on the account_id. The ads and clicks
-- tables must use compound keys that include account_id.

ALTER TABLE accounts ADD PRIMARY KEY (id);
ALTER TABLE ads ADD PRIMARY KEY (account_id, id);
ALTER TABLE clicks ADD PRIMARY KEY (account_id, id);

-- Next distribute the tables

SELECT create_distributed_table('accounts', 'id');
SELECT create_distributed_table('ads',      'account_id');
SELECT create_distributed_table('clicks',   'account_id');

--
-- Adding foreign keys
-- -------------------

-- Note that this can happen before or after distribution, as long as
-- there exists a uniqueness constraint on the target column(s) which
-- can only be enforced before distribution.

ALTER TABLE ads ADD CONSTRAINT ads_account_fk
  FOREIGN KEY (account_id) REFERENCES accounts (id);
ALTER TABLE clicks ADD CONSTRAINT clicks_ad_fk
  FOREIGN KEY (account_id, ad_id) REFERENCES ads (account_id, id);
```

Similarly, include the distribution column in uniqueness constraints:

```postgresql
-- Suppose we want every ad to use a unique image. Notice we can
-- enforce it only per account when we distribute by account id.

ALTER TABLE ads ADD CONSTRAINT ads_unique_image
  UNIQUE (account_id, image_url);
```

Not-null constraints can be applied to any column (distribution or not)
because they require no lookups between workers.

```postgresql
ALTER TABLE ads ALTER COLUMN image_url SET NOT NULL;
```

### Using NOT VALID Constraints

In some situations it can be useful to enforce constraints for new rows, while
allowing existing non-conforming rows to remain unchanged. Azure Cosmos DB for PostgreSQL
supports this feature for CHECK constraints and foreign keys, using
PostgreSQL\'s \"NOT VALID\" constraint designation.

For example, consider an application that stores user profiles in a
[reference table](concepts-nodes.md#type-2-reference-tables).

```postgres
-- we're using the "text" column type here, but a real application
-- might use "citext" which is available in a postgres contrib module

CREATE TABLE users ( email text PRIMARY KEY );
SELECT create_reference_table('users');
```

In the course of time imagine that a few non-addresses get into the
table.

```postgres
INSERT INTO users VALUES
   ('foo@example.com'), ('hacker12@aol.com'), ('lol');
```

We would like to validate the addresses, but PostgreSQL does not
ordinarily allow us to add a CHECK constraint that fails for existing
rows. However it *does* allow a constraint marked not valid:

```postgres
ALTER TABLE users
ADD CONSTRAINT syntactic_email
CHECK (email ~
   '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'
) NOT VALID;
```

New rows are now protected.

```postgres
INSERT INTO users VALUES ('fake');

/*
ERROR:  new row for relation "users_102010" violates
        check constraint "syntactic_email_102010"
DETAIL:  Failing row contains (fake).
*/
```

Later, during non-peak hours, a database administrator can attempt to
fix the bad rows and revalidate the constraint.

```postgres
-- later, attempt to validate all rows
ALTER TABLE users
VALIDATE CONSTRAINT syntactic_email;
```

The PostgreSQL documentation has more information about NOT VALID and
VALIDATE CONSTRAINT in the [ALTER
TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
section.

### Adding/Removing Indices

Azure Cosmos DB for PostgreSQL supports adding and removing
[indices](https://www.postgresql.org/docs/current/static/sql-createindex.html):

```postgresql
-- Adding an index

CREATE INDEX clicked_at_idx ON clicks USING BRIN (clicked_at);

-- Removing an index

DROP INDEX clicked_at_idx;
```

Adding an index takes a write lock, which can be undesirable in a
multi-tenant \"system-of-record.\" To minimize application downtime,
create the index
[concurrently](https://www.postgresql.org/docs/current/static/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY)
instead. This method requires more total work than a standard index
build and takes longer to complete. However, since it
allows normal operations to continue while the index is built, this
method is useful for adding new indexes in a production environment.

```postgresql
-- Adding an index without locking table writes

CREATE INDEX CONCURRENTLY clicked_at_idx ON clicks USING BRIN (clicked_at);
```
### Types and Functions

Creating custom SQL types and user-defined functions propogates to worker
nodes. However, creating such database objects in a transaction with
distributed operations involves tradeoffs.

Azure Cosmos DB for PostgreSQL parallelizes operations such as `create_distributed_table()`
across shards using multiple connections per worker. Whereas, when creating a
database object, Azure Cosmos DB for PostgreSQL propagates it to worker nodes using a single connection
per worker. Combining the two operations in a single transaction may cause
issues, because the parallel connections will not be able to see the object
that was created over a single connection but not yet committed.

Consider a transaction block that creates a type, a table, loads data, and
distributes the table:

```postgresql
BEGIN;

-- type creation over a single connection:
CREATE TYPE coordinates AS (x int, y int);
CREATE TABLE positions (object_id text primary key, position coordinates);

-- data loading thus goes over a single connection:
SELECT create_distributed_table(‘positions’, ‘object_id’);

SET client_encoding TO 'UTF8';
\COPY positions FROM ‘positions.csv’

COMMIT;
```

Prior to Citus 11.0, Citus would defer creating the type on the worker nodes,
and commit it separately when creating the distributed table. This enabled the
data copying in `create_distributed_table()` to happen in parallel. However, it
also meant that the type was not always present on the Citus worker nodes – or
if the transaction rolled back, the type would remain on the worker nodes.

With Citus 11.0, the default behaviour changes to prioritize schema consistency
between coordinator and worker nodes. The new behavior has a downside: if
object propagation happens after a parallel command in the same transaction,
then the transaction can no longer be completed, as highlighted by the ERROR in
the code block below:

```postgresql
BEGIN;
CREATE TABLE items (key text, value text);
-- parallel data loading:
SELECT create_distributed_table(‘items’, ‘key’);
SET client_encoding TO 'UTF8';
\COPY items FROM ‘items.csv’
CREATE TYPE coordinates AS (x int, y int);

ERROR:  cannot run type command because there was a parallel operation on a distributed table in the transaction
```

If you run into this issue, there are two simple workarounds:

1. Use set `citus.create_object_propagation` to `automatic` to defer creation
   of the type in this situation, in which case there may be some inconsistency
   between which database objects exist on different nodes.
1. Use set `citus.multi_shard_modify_mode` to `sequential` to disable per-node
   parallelism. Data load in the same transaction might be slower.

## Next steps

> [!div class="nextstepaction"]
> [Useful diagnostic queries](howto-useful-diagnostic-queries.md)
