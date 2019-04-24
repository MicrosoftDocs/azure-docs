---
title: Server concepts in Azure Database for PostgreSQL
description: This article provides considerations and guidelines for configuring and managing Azure Database for PostgreSQL servers.
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 4/24/2019
---

Hyperscale uses the distribution column in distributed tables to assign table
rows to shards. Choosing the distribution column for each table is **one of the
most important** modeling decisions because it determines how data is spread
across nodes.

If the distribution columns are chosen correctly, then related data will group
together on the same physical nodes, making queries fast and adding support for
all SQL features. If the columns are chosen incorrectly, the system will run
needlessly slowly, and won't be able to support all SQL features across nodes.

This section gives distribution column tips for the two most common Hyperscale
scenarios.

### Multi-Tenant Apps

The multi-tenant architecture uses a form of hierarchical database modeling to
distribute queries across nodes in the server group.  The top of the data
hierarchy is known as the *tenant ID*, and needs to be stored in a column on
each table. Hyperscale inspects queries to see which tenant ID they involve and
routes the query to a single worker node for processing, specifically the node
which holds the data shard associated with the tenant id. Running a query with
all relevant data placed on the same node is called colocation.

The following diagram illustrates co-location in the multi-tenant data
model. It contains two tables, Accounts and Campaigns, each distributed
by `account_id`. The shaded boxes represent shards, each of whose color
represents which worker node contains it. Green shards are stored
together on one worker node, and blue on another. Notice how a join
query between Accounts and Campaigns would have all the necessary data
together on one node when restricting both tables to the same
account\_id.

![multi-tenant colocation](media/multi-tenant-colocation.png)

To apply this design in your own schema the first step is identifying
what constitutes a tenant in your application. Common instances include
company, account, organization, or customer. The column name will be
something like `company_id` or `customer_id`. Examine each of your
queries and ask yourself: would it work if it had additional WHERE
clauses to restrict all tables involved to rows with the same tenant id?
Queries in the multi-tenant model are usually scoped to a tenant, for
instance queries on sales or inventory would be scoped within a certain
store.

#### Best Practices

-   **Partition distributed tables by a common tenant\_id column.** For
    instance, in a SaaS application where tenants are companies, the
    tenant\_id will likely be company\_id.
-   **Convert small cross-tenant tables to reference tables.** When
    multiple tenants share a small table of information, distribute it
    as a reference table.
-   **Restrict filter all application queries by tenant\_id.** Each
    query should request information for one tenant at a time.

Read the [multi-tenant
tutorial](tutorial-design-database-hyperscale-multi-tenant) for an example of
building this kind of application.

### Real-Time Apps

While the multi-tenant architecture introduces a hierarchical structure
and uses data co-location to route queries per tenant, real-time
architectures depend on specific distribution properties of their data
to achieve highly parallel processing.

We use "entity id" as a term for distribution columns in the real-time
model, as opposed to tenant ids in the multi-tenant model. Typical
entities are users, hosts, or devices.

Real-time queries typically ask for numeric aggregates grouped by date or
category. Hyperscale sends these queries to each shard for partial results and
assembles the final answer on the coordinator node. Queries run fastest when as
many nodes contribute as possible, and when no single node must do a
disproportionate amount of work.

#### Best Practices

-   **Choose a column with high cardinality as the distribution
    column.** For comparison, a \"status\" field on an order table with
    values \"new,\" \"paid,\" and \"shipped\" is a poor choice of
    distribution column because it assumes only those few values. The
    number of distinct values limits the number of shards that can hold
    the data, and the number of nodes that can process it. Among columns
    with high cardinality, it is good additionally to choose those that
    are frequently used in group-by clauses or as join keys.
-   **Choose a column with even distribution.** If you distribute a
    table on a column skewed to certain common values, then data in the
    table will tend to accumulate in certain shards. The nodes holding
    those shards will end up doing more work than other nodes.
-   **Distribute fact and dimension tables on their common columns.**
    Your fact table can have only one distribution key. Tables that join
    on another key will not be co-located with the fact table. Choose
    one dimension to co-locate based on how frequently it is joined and
    the size of the joining rows.
-   **Change some dimension tables into reference tables.** If a
    dimension table cannot be co-located with the fact table, you can
    improve query performance by distributing copies of the dimension
    table to all of the nodes in the form of a reference table.

Read the [real-time dashboard
tutorial](tutorial-design-database-hyperscale-realtime) for an example of
building this kind of application.

### Timeseries Data

In a time-series workload, applications query recent information while
archiving old information.

The most common mistake in modeling timeseries information in Hyperscale is
using the timestamp itself as a distribution column. A hash distribution based
on time will distribute times seemingly at random into different shards rather
than keeping ranges of time together in shards. However queries involving time
generally reference ranges of time (for example the most recent data), so such
a hash distribution would lead to network overhead.

#### Best Practices

-   **Do not choose a timestamp as the distribution column.** Choose a
    different distribution column. In a multi-tenant app, use the tenant
    id, or in a real-time app use the entity id.
-   **Use PostgreSQL table partitioning for time instead.** Use table
    partitioning to break a big table of time-ordered data into
    multiple inherited tables with each containing different time
    ranges.  Distributing a Postgres-partitioned table in Hyperscale
    creates shards for the inherited tables.

Read the [timeseries tutorial](https://aka.ms/hyperscale-tutorial-timeseries)
for an example of building this kind of application.
