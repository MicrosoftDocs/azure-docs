---
title: 'Quickstart: Run queries - Hyperscale (Citus) - Azure Database for PostgreSQL'
description: Quickstart to run queries on table data in Azure Database for PostgreSQL - Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.custom: mvc, mode-ui
ms.topic: quickstart
ms.date: 02/09/2022
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
shards in parallel, and combines the results. To see this in action, let's
temporarily enable remote logging and look at the queries running on shards.

```sql
-- reveal the per-shard queries behind the scenes

SET citus.log_remote_commands TO on;

-- run the count again

SELECT count(*) FROM github_users;
```

```
NOTICE:  issuing SELECT count(*) AS count FROM public.github_events_102040 github_events WHERE true
DETAIL:  on server citus@private-c.demo.postgres.database.azure.com:5432 connectionId: 1
NOTICE:  issuing SELECT count(*) AS count FROM public.github_events_102041 github_events WHERE true
DETAIL:  on server citus@private-c.demo.postgres.database.azure.com:5432 connectionId: 1
NOTICE:  issuing SELECT count(*) AS count FROM public.github_events_102042 github_events WHERE true
DETAIL:  on server citus@private-c.demo.postgres.database.azure.com:5432 connectionId: 1

... etc, one for each of the 32 shards
```

The advanced Hyperscale (Citus) query planner can transform almost all
PostgreSQL queries into tasks running across shards. Its broad SQL support
means that applications written for PostgreSQL can use Hyperscale (Citus) with
minimal modification.

Let's continue looking at a few more query examples:

```sql
-- hide the remote queries again

SET citus.log_remote_commands TO off;

-- Find all events for a single user.
-- (A common transactional/operational query)

SELECT created_at, event_type, repo->>'name' AS repo_name
  FROM github_events
 WHERE user_id = 3861633;
```

```
     created_at      |  event_type  |              repo_name
---------------------+--------------+--------------------------------------
 2016-12-01 06:28:44 | PushEvent    | sczhengyabin/Google-Image-Downloader
 2016-12-01 06:29:27 | CreateEvent  | sczhengyabin/Google-Image-Downloader
 2016-12-01 06:36:47 | ReleaseEvent | sczhengyabin/Google-Image-Downloader
 2016-12-01 06:42:35 | WatchEvent   | sczhengyabin/Google-Image-Downloader
 2016-12-01 07:45:58 | IssuesEvent  | sczhengyabin/Google-Image-Downloader
(5 rows)
```

## More complicated queries

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

Hyperscale (Citus) also automatically applies data definition changes across
the shards of a distributed table.

```sql
-- DDL commands that are also parallelized

ALTER TABLE github_users ADD COLUMN dummy_column integer;
```

## Next steps

The quickstart is now complete. You've successfully created a scalable
Hyperscale (Citus) server group, created tables, sharded them, loaded data, and
run distributed queries.

Here are good resources to deepen your knowledge.

* See a more detailed [illustration](tutorial-shard.md) of distributed query
  execution.
* Scale your server group by [adding
  nodes](https://docs.microsoft.com/azure/postgresql/hyperscale/howto-scale-grow#add-worker-nodes)
  and [rebalancing
  shards](https://docs.microsoft.com/azure/postgresql/hyperscale/howto-scale-rebalance).
* Learn how to speed up the per-minute `http_request` aggregation from this
  example with "roll-ups" in the [real-time
  dashboard](tutorial-design-database-realtime.md) tutorial.
