---
title: High CPU Utilization
description: Troubleshooting guide for high cpu utilization in Azure Database for PostgreSQL - Flexible Server
author: sarat0681
ms.author: sbalijepalli
ms.reviewer: maghan
ms.date: 10/26/2023
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Troubleshoot high CPU utilization in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article shows you how to quickly identify the root cause of high CPU utilization, and possible remedial actions to control CPU utilization when using [Azure Database for PostgreSQL - Flexible Server](overview.md).

In this article, you'll learn:

- About troubleshooting guides to identify and get recommendations to mitigate root causes.
- About tools to identify high CPU utilization such as Azure Metrics, Query Store, and pg_stat_statements.
- How to identify root causes, such as long running queries and total connections.
- How to resolve high CPU utilization by using Explain Analyze, Connection Pooling, and Vacuuming tables.

## Troubleshooting guides

Using the feature troubleshooting guides which is available on the Azure Database for PostgreSQL - Flexible Server portal the probable root cause and recommendations to the mitigate high CPU scenario can be found. How to setup the troubleshooting guides to use them please follow [setup troubleshooting guides](how-to-troubleshooting-guides.md).

## Tools to identify high CPU utilization

Consider these tools to identify high CPU utilization.

### Azure Metrics

Azure Metrics is a good starting point to check the CPU utilization for the definite date and period. Metrics give information about the time duration during which the CPU utilization is high. Compare the graphs of Write IOPs, Read IOPs, Read Throughput, and Write Throughput with CPU utilization to find out times when the workload caused high CPU. For proactive monitoring, you can configure alerts on the metrics. For step-by-step guidance, see [Azure Metrics](./howto-alert-on-metrics.md).

### Query Store

Query Store automatically captures the history of queries and runtime statistics, and it retains them for your review. It slices the data by time so that you can see temporal usage patterns. Data for all users, databases and queries is stored in a database named azure_sys in the Azure Database for PostgreSQL instance. For step-by-step guidance, see [Query Store](./concepts-query-store.md).

### pg_stat_statements

The pg_stat_statements extension helps identify queries that consume time on the server.

#### Mean or average execution time

##### [Postgres v13 & above](#tab/postgres-13)

For Postgres versions 13 and above, use the following statement to view the top five SQL statements by mean or average execution time:

```postgresql
SELECT userid::regrole, dbid, query, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time
DESC LIMIT 5;
```

##### [Postgres v9.6-12](#tab/postgres9-12)

For Postgres versions 9.6, 10, 11, and 12, use the following statement to view the top five SQL statements by mean or average execution time:

```postgresql
SELECT userid::regrole, dbid, query
FROM pg_stat_statements
ORDER BY mean_time
DESC LIMIT 5;
```
---

#### Total execution time

Execute the following statements to view the top five SQL statements by total execution time.

##### [Postgres v13 & above](#tab/postgres-13)

For Postgres versions 13 and above, use the following statement to view the top five SQL statements by total execution time:

```postgresql
SELECT userid::regrole, dbid, query
FROM pg_stat_statements
ORDER BY total_exec_time
DESC LIMIT 5;
```

##### [Postgres v9.6-12](#tab/postgres9-12)

For Postgres versions 9.6, 10, 11, and 12, use the following statement to view the top five SQL statements by total execution time:

```postgresql
SELECT userid::regrole, dbid, query,
FROM pg_stat_statements
ORDER BY total_time
DESC LIMIT 5;
```

---

## Identify root causes

If CPU consumption levels are high in general, the following could be possible root causes:

### Long-running transactions

Long-running transactions can consume CPU resources that can lead to high CPU utilization.

The following query helps identify connections running for the longest time:

```postgresql
SELECT pid, usename, datname, query, now() - xact_start as duration
FROM pg_stat_activity
WHERE pid <> pg_backend_pid() and state IN ('idle in transaction', 'active')
ORDER BY duration DESC;
```

### Total number of connections and number connections by state

A large number of connections to the database is also another issue that might lead to increased CPU and memory utilization.

The following query gives information about the number of connections by state:

```postgresql
SELECT state, count(*)
FROM  pg_stat_activity
WHERE pid <> pg_backend_pid()
GROUP BY 1 ORDER BY 1;
```

## Resolve high CPU utilization

Use Explain Analyze, PG Bouncer, connection pooling and terminate long running transactions to resolve high CPU utilization.

### Use Explain Analyze

Once you know the query that's running for a long time, use **EXPLAIN** to further investigate the query and tune it.  
For more information about the **EXPLAIN** command, review [Explain Plan](https://www.postgresql.org/docs/current/sql-explain.html).

### PGBouncer and connection pooling

In situations where there are lots of idle connections or lot of connections, which are consuming the CPU consider use of a connection pooler like PgBouncer.

For more details about PgBouncer, review:

[Connection Pooler](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/not-all-postgres-connection-pooling-is-equal/ba-p/825717)

[Best Practices](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/connection-handling-best-practice-with-postgresql/ba-p/790883)

Azure Database for Flexible Server offers PgBouncer as a built-in connection pooling solution. For more information, see [PgBouncer](./concepts-pgbouncer.md)

### Terminate long running transactions

You could consider killing a long running transaction as an option.

To terminate a session's PID, you'll need to detect the PID using the following query:

```postgresql
SELECT pid, usename, datname, query, now() - xact_start as duration
FROM pg_stat_activity
WHERE pid <> pg_backend_pid() and state IN ('idle in transaction', 'active')
ORDER BY duration DESC;
```

You can also filter by other properties like `usename` (username), `datname` (database name) etc.

Once you have the session's PID, you can terminate using the following query:

```postgresql
SELECT pg_terminate_backend(pid);
```

### Monitor vacuum and table stats

Keeping table statistics up to date helps improve query performance. Monitor whether regular autovacuuming is being carried out.

The following query helps to identify the tables that need vacuuming:

```postgresql
select schemaname,relname,n_dead_tup,n_live_tup,last_vacuum,last_analyze,last_autovacuum,last_autoanalyze
from pg_stat_all_tables where n_live_tup > 0;
```

`last_autovacuum` and `last_autoanalyze` columns give the date and time when the table was last autovacuumed or analyzed. If the tables aren't being vacuumed regularly, take steps to tune autovacuum. For more information about autovacuum troubleshooting and tuning, see [Autovacuum Troubleshooting](./how-to-autovacuum-tuning.md).

A short-term solution would be to do a manual vacuum analyze of the tables where slow queries are seen:

```postgresql
vacuum analyze <table_name>;
```

## Related content

- [Autovacuum Tuning](how-to-high-cpu-utilization.md)
- [High Memory Utilization](how-to-high-memory-utilization.md)
- [Identify Slow Queries](how-to-identify-slow-queries.md)
