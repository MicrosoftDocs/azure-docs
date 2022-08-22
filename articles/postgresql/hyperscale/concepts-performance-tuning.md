---
title: Performance tuning - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Improving query performance in the distributed database
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 08/22/2022
---

# Hyperscale (Citus) performance tuning

[!INCLUDE[applies-to-postgresql-hyperscale](../includes/applies-to-postgresql-hyperscale.md)]

Running a distributed database at its full potential provides a lot of
performance. However, reaching that performance can take some adjustments in
application code and data modeling. This article covers some of the most common
-- and effective -- techniques to improve performance.

## Client-side connection pooling

A connection pool holds open database connections for reuse. An application
requests a connection from the pool when needed, and the pool returns one that
is already established if possible, or establishes a new one. When done, the
application releases the connection back to the pool rather than closing it.

Adding a client-side connection pool is an easy way to boost applicatiohn
performance with minimal code changes. In our measurements, running single-row
insert statements goes about **24x faster** on a Hyperscale (Citus) server
group with pooling enabled.

For language-specific examples of adding pooling in application code, see the
[app stacks guide](quickstart-app-stacks-overview.md).

> [!NOTE]
>
> Hyperscale (Citus) also provides [server-side connection
> pooling](concepts-connection-pool.md) using pgbouncer, but it mainly serves
> to increase the client connection limit. Short lived client connections
> benefit more from client- rather than server-side pooling. (Although both
> forms of pooling can be used at once without harm.)

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
| log_statement | NONE | Don't log queries without a a more specific reason |
| log_min_duration_statement | A value longer than what you think normal queries should take | Shows the abnormally long queries |

> [!NOTE]
>
> These log settings are the default in PostgreSQL, except
> log_min_duration_statement, which by default is disabled (-1).

## Scoping distributed queries

## Lock contention

## Table bloat

### Detecting locks

### Common problems and solutions

#### DDL commands

#### Idle connections

#### Locking hierarchy

## I/O during ingestion

## Next steps

* [Useful diagnostic queries](howto-useful-diagnostic-queries.md)
* Build fast [app stacks](quickstart-app-stacks-overview.md)
