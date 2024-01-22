---
title: Performance tuning - Azure Cosmos DB for PostgreSQL
description: Improving query performance in the distributed database
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: conceptual
ms.date: 01/30/2023
---

# Performance tuning in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Running a distributed database at its full potential offers high performance.
However, reaching that performance can take some adjustments in application
code and data modeling. This article covers some of the most common--and
effective--techniques to improve performance.

## Client-side connection pooling

A connection pool holds open database connections for reuse. An application
requests a connection from the pool when needed, and the pool returns one that
is already established if possible, or establishes a new one. When done, the
application releases the connection back to the pool rather than closing it.

Adding a client-side connection pool is an easy way to boost application
performance with minimal code changes. In our measurements, running single-row
insert statements goes about **24x faster** on a cluster with pooling enabled.

For language-specific examples of adding pooling in application code, see the
[app stacks guide](quickstart-app-stacks-overview.yml).

> [!NOTE]
>
> Azure Cosmos DB for PostgreSQL also provides [server-side connection
> pooling](concepts-connection-pool.md) using pgbouncer, but it mainly serves
> to increase the client connection limit. An individual application's
> performance benefits more from client- rather than server-side pooling.
> (Although both forms of pooling can be used at once without harm.)

## Scoping distributed queries

### Updates

When updating a distributed table, try to filter queries on the distribution
column--at least when it makes sense, when the new filters don't change the
meaning of the query.

In some workloads, it's easy.  Transactional/operational workloads like
multi-tenant SaaS apps or the Internet of Things distribute tables by tenant or
device. Queries are scoped to a tenant- or device-ID.

For instance, in our [multi-tenant
tutorial](tutorial-design-database-multi-tenant.md#use-psql-utility-to-create-a-schema)
we have an `ads` table distributed by `company_id`. The naive way to update an
ad is to single it out like this:

```sql
-- slow

UPDATE ads
   SET impressions_count = impressions_count+1
 WHERE id = 42; -- missing filter on distribution column
```

Although the query uniquely identifies a row and updates it, Azure Cosmos DB for PostgreSQL
doesn't know, at planning time, which shard the query will update. The Citus extension takes a
ShareUpdateExclusiveLock on all shards to be safe, which blocks other queries
trying to update the table.

Even though the `id` was sufficient to identify a row, we can include an
extra filter to make the query faster:

```sql
-- fast

UPDATE ads
   SET impressions_count = impressions_count+1
 WHERE id = 42
   AND company_id = 1; -- the distribution column
```

The Azure Cosmos DB for PostgreSQL query planner sees a direct filter on the distribution
column and knows exactly which single shard to lock. In our tests, adding
filters for the distribution column increased parallel update performance by
**100x**.

### Joins and CTEs

We've seen how UPDATE statements should scope by the distribution column to
avoid unnecessary shard locks. Other queries benefit from scoping too, usually
to avoid the network overhead of unnecessarily shuffling data between worker
nodes.



```sql
-- logically correct, but slow

WITH single_ad AS (
  SELECT *
    FROM ads
   WHERE id=1
)
SELECT *
  FROM single_ad s
  JOIN campaigns c ON (s.campaign_id=c.id);
```

We can speed up the query up by filtering on the distribution column,
`company_id`, in the CTE and main SELECT statement.

```sql
-- faster, joining on distribution column

WITH single_ad AS (
  SELECT *
    FROM ads
   WHERE id=1 and company_id=1
)
SELECT *
  FROM single_ad s
  JOIN campaigns c ON (s.campaign_id=c.id)
 WHERE s.company_id=1 AND c.company_id = 1;
```

In general, when joining distributed tables, try to include the distribution
column in the join conditions. However, when joining between a distributed and
reference table it's not required, because reference table contents are
replicated across all worker nodes.

If it seems inconvenient to add the extra filters to all your queries, keep in
mind there are helper libraries for several popular application frameworks that
make it easier. Here are instructions:

* [Ruby on Rails](https://docs.citusdata.com/en/stable/develop/migration_mt_ror.html),
* [Django](https://django-multitenant.readthedocs.io/en/latest/migration_mt_django.html),
* [ASP.NET](https://docs.citusdata.com/en/stable/develop/migration_mt_asp.html),
* [Java Hibernate](https://www.citusdata.com/blog/2018/02/13/using-hibernate-and-spring-to-build-multitenant-java-apps/).

## Efficient database logging

Logging all SQL statements all the time adds overhead. In our measurements,
using more a judicious log level improved the transactions per second by
**10x** vs full logging.

For efficient everyday operation, you can disable logging except for errors and
abnormally long-running queries:

| setting | value | reason |
|---------|-------|--------|
| log_statement_stats | OFF | Avoid profiling overhead |
| log_duration | OFF | Don't need to know the duration of normal queries |
| log_statement | NONE | Don't log queries without a more specific reason |
| log_min_duration_statement | A value longer than what you think normal queries should take | Shows the abnormally long queries |

> [!NOTE]
>
> The log-related settings in our managed service take the above
> recommendations into account. You can leave them as they are. However, we've
> sometimes seen customers change the settings to make logging aggressive,
> which has led to performance issues.

## Lock contention

The database uses locks to keep data consistent under concurrent access.
However, some query patterns require an excessive amount of locking, and faster
alternatives exist.

### System health and locks

Before diving into common locking inefficiencies, let's see how to view locks
and activity throughout the database cluster. The
[citus_stat_activity](reference-metadata.md#distributed-query-activity) view
gives a detailed view.

The view shows, among other things, how queries are blocked by "wait events,"
including locks.  Grouping by
[wait_event_type](https://www.postgresql.org/docs/14/monitoring-stats.html#WAIT-EVENT-TABLE)
paints a picture of system health:

```sql
-- general system health

SELECT wait_event_type, count(*)
  FROM citus_stat_activity
 WHERE state != 'idle'
 GROUP BY 1
 ORDER BY 2 DESC;
```

A NULL `wait_event_type` means the query isn't waiting on anything.

If you do see locks in the stat activity output, you can view the specific
blocked queries using `citus_lock_waits`:

```sql
SELECT * FROM citus_lock_waits;
```

For example, if one query is blocked on another trying to update the same row,
you'll see the blocked and blocking statements appear:

```
-[ RECORD 1 ]-------------------------+--------------------------------------
waiting_gpid                          | 10000011981
blocking_gpid                         | 10000011979
blocked_statement                     | UPDATE numbers SET j = 3 WHERE i = 1;
current_statement_in_blocking_process | UPDATE numbers SET j = 2 WHERE i = 1;
waiting_nodeid                        | 1
blocking_nodeid                       | 1
```

To see not only the locks happening at the moment, but historical patterns, you
can capture locks in the PostgreSQL logs. To learn more, see the
[log_lock_waits](https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-LOCK-WAITS)
server setting in the PostgreSQL documentation. Another great resource is
[seven tips for dealing with
locks](https://www.citusdata.com/blog/2018/02/22/seven-tips-for-dealing-with-postgres-locks/)
on the Citus Data Blog.

### Common problems and solutions

#### DDL commands

DDL Commands like `truncate`, `drop`, and `create index` all take write locks,
and block writes on the entire table. Minimizing such operations reduces
locking issues.

Tips:

* Try to consolidate DDL into maintenance windows, or use them less often.

* PostgreSQL supports [building indices
  concurrently](https://www.postgresql.org/docs/current/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY),
  to avoid taking a write lock on the table.

* Consider setting
  [lock_timeout](https://www.postgresql.org/docs/14/runtime-config-client.html#GUC-LOCK-TIMEOUT)
  in a SQL session prior to running a heavy DDL command. With `lock_timeout`,
  PostgreSQL will abort the DDL command if the command waits too long for a write
  lock. A DDL command waiting for a lock can cause later queries to queue behind
  itself.

#### Idle in transaction connections

Idle (uncommitted) transactions sometimes block other queries unnecessarily.
For example:

```sql
BEGIN;

UPDATE ... ;

-- Suppose the client waits now and doesn't COMMIT right away.
--
-- Other queries that want to update the same rows will be blocked.

COMMIT; -- finally!
```

To manually clean up any long-idle queries on the coordinator node, you can run
a command like this:

```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'citus'
 AND pid <> pg_backend_pid()
 AND state in ('idle in transaction')
 AND state_change < current_timestamp - INTERVAL '15' MINUTE;
```

PostgreSQL also offers an
[idle_in_transaction_session_timeout](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-IDLE-IN-TRANSACTION-SESSION-TIMEOUT)
setting to automate idle session termination.

#### Deadlocks

Azure Cosmos DB for PostgreSQL detects distributed deadlocks and cancels their queries, but the
situation is less performant than avoiding deadlocks in the first place. A
common source of deadlocks comes from updating the same set of rows in a
different order from multiple transactions at once.

For instance, running these transactions in parallel:

Session A:

```sql
BEGIN;
UPDATE ads SET updated_at = now() WHERE id = 1 AND company_id = 1;
UPDATE ads SET updated_at = now() WHERE id = 2 AND company_id = 1;
```

Session B:

```sql
BEGIN;
UPDATE ads SET updated_at = now() WHERE id = 2 AND company_id = 1;
UPDATE ads SET updated_at = now() WHERE id = 1 AND company_id = 1;

-- ERROR:  canceling the transaction since it was involved in a distributed deadlock
```

Session A updated ID 1 then 2, whereas the session B updated 2 then 1. Write
SQL code for transactions carefully to update rows in the same order. (The
update order is sometimes called a "locking hierarchy.")

In our measurement, bulk updating a set of rows with many transactions went
**3x faster** when avoiding deadlock.

## I/O during ingestion

I/O bottlenecking is typically less of a problem for Azure Cosmos DB for PostgreSQL than
for single-node PostgreSQL because of sharding. The shards are individually
smaller tables, with better index and cache hit rates, yielding better
performance.

However, even with Azure Cosmos DB for PostgreSQL, as tables and indices grow larger, disk
I/O can become a problem for data ingestion.  Things to look out for are an
increasing number of 'IO' `wait_event_type` entries appearing in
`citus_stat_activity`:

```sql
SELECT wait_event_type, wait_event count(*)
  FROM citus_stat_activity
 WHERE state='active'
 GROUP BY 1,2;
```

Run the above query repeatedly to capture wait event related information. Note
how the counts of different wait event types change.

Also look at [metrics in the Azure portal](concepts-monitoring.md),
particularly the IOPS metric maxing out.

Tips:

- If your data is naturally ordered, such as in a time series, use PostgreSQL
   table partitioning. See [this
   guide](https://docs.citusdata.com/en/stable/use_cases/timeseries.html) to learn
   how to partition distributed tables.

- Remove unused indices. Index maintenance causes I/O amplification during
   ingestion.  To find which indices are unused, use [this
   query](howto-useful-diagnostic-queries.md#identifying-unused-indices).

- If possible, avoid indexing randomized data. For instance, some UUID
   generation algorithms follow no order. Indexing such a value causes a lot
   overhead. Try a bigint sequence instead, or monotonically increasing UUIDs.

## Summary of results

In benchmarks of simple ingestion with INSERTs, UPDATEs, transaction blocks, we
observed the following query speedups for the techniques in this article.

| Technique | Query speedup |
|-----------|---------------|
| Scoping queries | 100x |
| Connection pooling | 24x |
| Efficient logging | 10x |
| Avoiding deadlock | 3x |

## Next steps

* [Advanced query performance tuning](https://docs.citusdata.com/en/stable/performance/performance_tuning.html)
* [Useful diagnostic queries](howto-useful-diagnostic-queries.md)
* Build fast [app stacks](quickstart-app-stacks-overview.yml)
