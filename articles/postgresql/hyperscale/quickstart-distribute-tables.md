---
title: 'Quickstart: distribute tables - Hyperscale (Citus) - Azure Database for PostgreSQL'
description: Quickstart to distribute table data across nodes in Azure Database for PostgreSQL - Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.custom: mvc, mode-ui
ms.topic: quickstart
ms.date: 02/08/2022
---

# Model and load data

Within Hyperscale (Citus) servers, there are three types of tables:

* **Distributed Tables** - Distributed across worker nodes (scaled out).
  Large tables should be distributed tables to improve performance.
* **Reference tables** - Replicated to all nodes. Enables joins with
  distributed tables. Typically used for small tables like countries or product
  categories.
* **Local tables** - Tables that reside on coordinator node. Administration
  tables are good examples of local tables.

In this quickstart, we'll focus on distributed tables, and get familiar with
them.  The data model we're going to work with is simple: an HTTP request log
for multiple websites, sharded by site.

## Prerequisites

To follow this quickstart, you'll first need to:

1. [Create a server group](quickstart-create-portal.md) in the Azure portal.
2. [Connect to the server group](quickstart-connect-psql.md) with psql to
   run SQL commands.

## Create tables

Once you've connected via psql, let's create our table. In the psql console,
run:

```sql
CREATE TABLE github_users
(
	user_id bigint,
	url text,
	login text,
	avatar_url text,
	display_login text
);

CREATE TABLE github_events
(
	event_id bigint,
	event_type text,
	event_public boolean,
	repo_id bigint,
	repo jsonb,
	user_id bigint,
	created_at timestamp
);
```

## Shard tables across worker nodes

Next, we’ll tell Hyperscale (Citus) to shard the tables. If your server group
is running on the Standard Tier (meaning it has worker nodes), then the table
shards will be created on workers. If the server group is running on the Basic
Tier, then the shards will all be stored on the coordinator node.

To shard and distribute the tables, call `create_distributed_table()` and
specify the table and key to shard it on.

```sql
SELECT create_distributed_table('github_users', 'user_id');
SELECT create_distributed_table('github_events', 'user_id');
```

[!INCLUDE [azure-postgresql-hyperscale-dist-alert](../../../includes/azure-postgresql-hyperscale-dist-alert.md)]

By default, `create_distributed_table()` splits tables into 32 shards.  We can
verify using the `citus_shards` view:

```sql
SELECT table_name, count(*)
  FROM citus_shards
 GROUP BY 1;
```

```
  table_name   | count
---------------+-------
 github_events |    32
 github_users  |    32
(2 rows)
```

## Load data into distributed tables

We're ready to fill the tables with sample data. For this quickstart, we can
use random data, modeled loosely on results from the Github API.

```sql
-- generate random 10,000 users
INSERT INTO github_users
SELECT
	id, 
	'https://api.github.com/users/' || handle,
	handle,
	'https://avatars.githubusercontent.com/u/' || id,
	handle
FROM (
	SELECT generate_series(1,10000) id, md5(random()::text) handle
) AS rnd;

-- generate random 250,000 events
INSERT INTO github_events
SELECT
	id, event_type, public, repo_id,
	json_build_object(
		'id', repo_id,
		'url', 'https://api.github.com/repos/' || display_login || '/' || repo_name,
		'name', display_login || '/' || repo_name
	) repo,
	rnd.user_id, created_at
FROM (
	SELECT generate_series(1,250000) id,
	('{CreateEvent,DeleteEvent,ForkEvent,IssueCommentEvent,IssuesEvent,MemberEvent,PullRequestEvent,PushEvent}'::text[])[ceil(random()*8)] event_type,
	1=trunc(random()*2) public,
	trunc(random()*50000) repo_id,
	trunc(random()*10000) user_id,
	date_trunc('year', now()) + (trunc(random()*365*24*60*60) * interval '1 second') created_at,
	md5(random()::text) repo_name
) rnd
INNER JOIN github_users u ON (u.user_id = rnd.user_id);
```

We can confirm the shards now hold data:

```sql
SELECT table_name, pg_size_pretty(sum(shard_size))
  FROM citus_shards
 GROUP BY 1;
```

```
  table_name   | pg_size_pretty
---------------+----------------
 github_events | 29 MB
 github_users  | 2248 kB
(2 rows)
```

If you created your server group in the Basic Tier, all shards are stored on
one node, the coordinator.  Otherwise, if the server group is in the Standard
Tier, it has multiple worker nodes that store the shards.

## Next steps

Now we have a table sharded and loaded with data. Next, let's try running
queries across the data in these shards.

> [!div class="nextstepaction"]
> [Run distributed queries](quickstart-run-queries.md)
