---
title: 'Quickstart: distribute tables - Hyperscale (Citus) - Azure Database for PostgreSQL'
description: Quickstart to distribute table data across nodes in Azure Database for PostgreSQL - Hyperscale (Citus).
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.custom: mvc, mode-ui
ms.topic: quickstart
ms.date: 02/09/2022
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

Once you've connected via psql, let's create our table. Copy and paste the
following commands into the psql terminal window, and hit enter to run:

```sql
CREATE TABLE github_users
(
	user_id bigint,
	url text,
	login text,
	avatar_url text,
	gravatar_id text,
	display_login text
);

CREATE TABLE github_events
(
	event_id bigint,
	event_type text,
	event_public boolean,
	repo_id bigint,
	payload jsonb,
	repo jsonb,
	user_id bigint,
	org jsonb,
	created_at timestamp
);

CREATE INDEX event_type_index ON github_events (event_type);
CREATE INDEX payload_index ON github_events USING GIN (payload jsonb_path_ops);
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
SELECT table_name, count(*) AS shards
  FROM citus_shards
 GROUP BY 1;
```

```
  table_name   | shards
---------------+--------
 github_users  |     32
 github_events |     32
(2 rows)
```

## Load data into distributed tables

We're ready to fill the tables with sample data. For this quickstart, we'll use
a dataset previously captured from the GitHub API.

Run the following commands to download example CSV files and load them into the
database tables. (The `curl` command downloads the files, and comes
pre-installed in the Azure Cloud Shell.)

```
-- download users and store in table

\COPY github_users FROM PROGRAM 'curl https://examples.citusdata.com/users.csv' WITH (FORMAT CSV)

-- download events and store in table

\COPY github_events FROM PROGRAM 'curl https://examples.citusdata.com/events.csv' WITH (FORMAT CSV)
```

We can confirm the shards now hold data:

```sql
SELECT table_name,
       pg_size_pretty(sum(shard_size)) AS shard_size_sum
  FROM citus_shards
 GROUP BY 1;
```

```
  table_name   | shard_size_sum
---------------+----------------
 github_users  | 38 MB
 github_events | 95 MB
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
