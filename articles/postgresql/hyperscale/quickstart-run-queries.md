---
title: 'Quickstart: Run queries - Hyperscale (Citus) - Azure Database for PostgreSQL'
description: Quickstart to run queries on table data in Azure Database for PostgreSQL - Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.custom: mvc, mode-ui
ms.topic: quickstart
ms.date: 01/24/2022
---

# Run queries

## Prerequisites

To follow this quickstart, you'll first need to:

1. [Create a server group](quickstart-create-portal.md) in the Azure portal.
2. [Connect to the server group](quickstart-connect-psql.md) with psql to
   run SQL commands.
3. [Create and distribute tables](quickstart-distribute-tables.md) with our
   example dataset.

## Distributed queries

Now it's time for the fun part in our quickstart series -- running queries.
Let's start with a simple `count (*)` to verify how much data we loaded in
the previous section.

```sql
SELECT count(*) FROM http_request;

┌─────────┐
│  count  │
├─────────┤
│ 1000000 │
└─────────┘
```

Recall that `http_request` is a distributed table, meaning its data is divided
between multiple shards. Hyperscale (Citus) automatically runs the count on all
the shards in parallel, and combines the results.

Using the Postgres EXPLAIN command, we can see that Citus runs a query for each
shard (32 total), and aggregates the results:

```sql
EXPLAIN SELECT count(*) FROM http_request;

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                            QUERY PLAN                                            │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Aggregate  (cost=250.00..250.02 rows=1 width=8)                                                  │
│   ->  Custom Scan (Citus Adaptive)  (cost=0.00..0.00 rows=100000 width=8)                        │
│     Task Count: 32                                                                               │
│     Tasks Shown: One of 32                                                                       │
│     ->  Task                                                                                     │
│       Node: host=private-c.quickstart.postgres.database.azure.com port=5432 dbname=citus         │
│       ->  Aggregate  (cost=721.60..721.61 rows=1 width=8)                                        │
│         ->  Seq Scan on http_request_102136 http_request  (cost=0.00..658.88 rows=25088 width=0) │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## More complicated queries

Hyperscale (Citus) uses an advanced query planner to transform arbitrary SQL
queries into tasks running across shards. The tasks run in parallel on
horizontally scalable worker nodes.

Here's an example of a more complicated query, which retrieves minute-by-minute
statistics for requests at each site:

```sql
SELECT
  site_id,
  date_trunc('minute', ingest_time) AS minute,
  COUNT(*) AS req_count,
  SUM(CASE WHEN (status_code between 200 and 299) THEN 1 ELSE 0 END) AS good_count,
  SUM(CASE WHEN (status_code between 200 and 299) THEN 0 ELSE 1 END) AS error_count,
  SUM(response_time_msec) / COUNT(*) AS avg_resp_time
FROM http_request
GROUP BY site_id, minute
ORDER BY minute ASC
LIMIT 10;

┌─────────┬────────────────────────┬───────────┬────────────┬─────────────┬───────────────┐
│ site_id │         minute         │ req_count │ good_count │ error_count │ avg_resp_time │
├─────────┼────────────────────────┼───────────┼────────────┼─────────────┼───────────────┤
│     850 │ 2022-02-01 23:33:00+00 │        21 │         12 │           9 │            78 │
│     903 │ 2022-02-01 23:33:00+00 │        22 │         14 │           8 │            68 │
│     791 │ 2022-02-01 23:33:00+00 │        19 │          8 │          11 │            81 │
│     588 │ 2022-02-01 23:33:00+00 │        17 │          9 │           8 │            78 │
│     443 │ 2022-02-01 23:33:00+00 │        26 │         14 │          12 │            73 │
│     301 │ 2022-02-01 23:33:00+00 │        20 │          9 │          11 │            90 │
│      20 │ 2022-02-01 23:33:00+00 │        19 │          8 │          11 │            90 │
│     280 │ 2022-02-01 23:33:00+00 │        14 │          8 │           6 │            90 │
│     138 │ 2022-02-01 23:33:00+00 │        21 │         11 │          10 │            78 │
│     298 │ 2022-02-01 23:33:00+00 │        19 │         10 │           9 │            72 │
└─────────┴────────────────────────┴───────────┴────────────┴─────────────┴───────────────┘
```

## Next steps

- See a more detailed [illustration](tutorial-shard.md) of distributed query execution.
- Learn how to speed up the per-minute `http_request` aggregation from this
  example with "roll-ups" in the [real-time
  dashboard](tutorial-design-database-realtime.md) tutorial.
