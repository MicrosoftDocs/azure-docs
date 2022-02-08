---
title: 'Quickstart: Run queries - Hyperscale (Citus) - Azure Database for PostgreSQL'
description: Quickstart to run queries on table data in Azure Database for PostgreSQL - Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.custom: mvc, mode-ui
ms.topic: quickstart
ms.date: 02/02/2022
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

Now it's time for the fun part in our quickstart series--running queries.
Let's start with a simple `count (*)` to verify how much data we loaded in
the previous section.

```sql
-- count all rows (across shards)

SELECT count(*) FROM github_users;
```

```
 count
-------
 10000
(1 row)
```

Recall that `github_users` is a distributed table, meaning its data is divided
between multiple shards. Hyperscale (Citus) automatically runs the count on all
the shards in parallel, and combines the results.

```sql
-- find all events for a single user (common transactional/operational query)

SELECT * from github_events where user_id = 85;
```

## More complicated queries

Hyperscale (Citus) uses an advanced query planner to transform arbitrary SQL
queries into tasks running across shards. The tasks run in parallel on
horizontally scalable worker nodes.

Here's an example of a more complicated query, which retrieves minute-by-minute
statistics for requests at each site:

```sql
-- Querying JSONB type. Query is parallelized across nodes.
-- Find the number of commits to the postgres repo on master per hour 

SELECT repo_name, hour,
       count(*) OVER (PARTITION BY repo_id) AS repo_events,
       count(*) OVER (PARTITION BY repo_id, hour) AS hourly_events
  FROM (
	SELECT *,
	       repo->>'name' AS repo_name,
	       date_trunc('hour', created_at) AS hour
	  FROM github_events
  ) evts
 ORDER BY repo_events DESC;
```

```
┌─────────┬────────────────────────┬───────────┬────────────┬─────────────┬───────────────┐
│ site_id │         minute         │ req_count │ good_count │ error_count │ avg_resp_time │
├─────────┼────────────────────────┼───────────┼────────────┼─────────────┼───────────────┤
│     994 │ 2022-02-02 00:55:00+00 │         9 │          3 │           6 │            57 │
│     611 │ 2022-02-02 00:55:00+00 │         9 │          4 │           5 │            64 │
│     146 │ 2022-02-02 00:55:00+00 │         6 │          4 │           2 │            73 │
│     139 │ 2022-02-02 00:55:00+00 │         7 │          3 │           4 │            73 │
│     132 │ 2022-02-02 00:55:00+00 │        16 │          6 │          10 │            83 │
│     989 │ 2022-02-02 00:55:00+00 │        10 │          6 │           4 │            61 │
│       8 │ 2022-02-02 00:55:00+00 │        10 │          3 │           7 │            86 │
│     443 │ 2022-02-02 00:55:00+00 │         5 │          5 │           0 │           117 │
│     968 │ 2022-02-02 00:55:00+00 │         4 │          3 │           1 │            96 │
│      20 │ 2022-02-02 00:55:00+00 │         4 │          0 │           4 │            95 │
└─────────┴────────────────────────┴───────────┴────────────┴─────────────┴───────────────┘
```

## Next steps

The quickstart is now complete. You've successfully created a scalable
Hyperscale (Citus) server group, created a table, sharded it, loaded data,
and run distributed queries.

Here are good resources to begin to deepen your knowledge.

* See a more detailed [illustration](tutorial-shard.md) of distributed query
  execution.
* Discover [useful diagnostic queries](howto-useful-diagnostic-queries.md) to
  inspect distributed tables.
* Learn how to speed up the per-minute `http_request` aggregation from this
  example with "roll-ups" in the [real-time
  dashboard](tutorial-design-database-realtime.md) tutorial.
