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
--------
 264308
(1 row)
```

Recall that `github_users` is a distributed table, meaning its data is divided
between multiple shards. Hyperscale (Citus) automatically runs the count on all
the shards in parallel, and combines the results.

```sql
-- find all events for a single user (common transactional/operational query)

SELECT * from github_events where user_id = 973676;
```

## More complicated queries

Hyperscale (Citus) uses an advanced query planner to transform arbitrary SQL
queries into tasks running across shards. The tasks run in parallel on
horizontally scalable worker nodes.

Here's an example of a more complicated query, which retrieves hourly
statistics for push events on GitHub. It uses PostgreSQL's JSONB feature to
handle semi-structured data.

```sql
-- Querying JSONB type. Query is parallelized across nodes.
-- Find the number of commits on the master branch per hour 
SELECT date_trunc('hour', created_at) AS hour,
       sum((payload->>'distinct_size')::int) AS num_commits
FROM   github_events
WHERE  event_type = 'PushEvent' AND
       payload @> '{"ref":"refs/heads/master"}'
GROUP BY hour
ORDER BY hour;
```

```
        hour         | num_commits
---------------------+-------------
 2016-12-01 05:00:00 |       13051
 2016-12-01 06:00:00 |       43480
 2016-12-01 07:00:00 |       34254
 2016-12-01 08:00:00 |       29307
(4 rows)
```

Hyperscale (Citus) also automatically applies changes to data definition across
the shards of a distributed table.

```sql
-- DDL commands that are also parallelized

ALTER TABLE github_users ADD COLUMN dummy_column integer;
```

## Next steps

The quickstart is now complete. You've successfully created a scalable
Hyperscale (Citus) server group, created tables, sharded them, loaded data, and
run distributed queries.

Here are good resources to begin to deepen your knowledge.

* See a more detailed [illustration](tutorial-shard.md) of distributed query
  execution.
* Discover [useful diagnostic queries](howto-useful-diagnostic-queries.md) to
  inspect distributed tables.
* Learn how to speed up the per-minute `http_request` aggregation from this
  example with "roll-ups" in the [real-time
  dashboard](tutorial-design-database-realtime.md) tutorial.
