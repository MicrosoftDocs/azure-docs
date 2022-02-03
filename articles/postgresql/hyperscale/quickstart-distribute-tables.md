---
title: 'Quickstart: distribute tables - Hyperscale (Citus) - Azure Database for PostgreSQL'
description: Quickstart to distribute table data across nodes in Azure Database for PostgreSQL - Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.custom: mvc, mode-ui
ms.topic: quickstart
ms.date: 02/02/2022
---

# Model and load data

Within Hyperscale (Citus) servers, there are three types of tables:

* **Distributed Tables** - Distributed across worker nodes (scaled out).
  Generally large tables should be distributed tables to improve performance.
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
CREATE TABLE http_request (
	site_id INT,
	ingest_time TIMESTAMPTZ DEFAULT now(),

	url TEXT,
	request_country TEXT,
	ip_address TEXT,

	status_code INT,
	response_time_msec INT
);
```

## Shard tables across worker nodes

Next, we’ll tell Hyperscale (Citus) to shard the `http_request` table. If your
Hyperscale (Citus) server group is running on the Standard Tier (meaning it has
worker nodes), then the table shards will be created on workers. If the server
group is  running on the Basic Tier, then the shards will all be stored on the
coordinator node.

To shard and distribute the table, call `create_distributed_table()` and
specify the table and key to shard it on.

```sql
SELECT create_distributed_table('http_request', 'site_id');
```

[!INCLUDE [azure-postgresql-hyperscale-dist-alert](../../../includes/azure-postgresql-hyperscale-dist-alert.md)]

By default, `create_distributed_table()` splits the table into thirty-two shards.
We can verify using the `citus_shards` view:

```sql
SELECT table_name, count(*)
  FROM citus_shards
 GROUP BY 1;
```

```
┌──────────────┬───────┐
│  table_name  │ count │
├──────────────┼───────┤
│ http_request │    32 │
└──────────────┴───────┘
```

## Load data into distributed tables

We're ready to load data. For simplicity, let's generate a million rows of
fake random data:

```sql
INSERT INTO http_request
SELECT
	trunc(random()*1000),
	-- one three hour span
	clock_timestamp() + make_interval(secs => random()*60*60),
	concat('http://example.com/', md5(random()::text)),
	('{China,India,USA,Indonesia}'::text[])[ceil(random()*4)],
	concat(
	  trunc(random()*250 + 2), '.',
	  trunc(random()*250 + 2), '.',
	  trunc(random()*250 + 2), '.',
	  trunc(random()*250 + 2)
	)::inet,
	('{200,404}'::int[])[ceil(random()*2)],
	5+trunc(random()*150)
FROM generate_series(1, 1000000);
```

We can confirm that each shard contains between 3 and 5 MB of data.
Here's data for the first 5 shards:

```sql
SELECT shardid, table_name, pg_size_pretty(shard_size)
  FROM citus_shards
 LIMIT 5;
```

```
┌─────────┬──────────────┬────────────────┐
│ shardid │  table_name  │ pg_size_pretty │
├─────────┼──────────────┼────────────────┤
│  102136 │ http_request │ 3264 kB        │
│  102137 │ http_request │ 4424 kB        │
│  102138 │ http_request │ 3920 kB        │
│  102139 │ http_request │ 4176 kB        │
│  102140 │ http_request │ 4032 kB        │
└─────────┴──────────────┴────────────────┘
```

To see the exact number of rows in each shard, we can use the
`run_command_on_shards()` utility function:

```sql
SELECT run_command_on_shards('http_request', 'SELECT count(*) FROM %s')
 LIMIT 5;
```

```
┌───────────────────────┐
│ run_command_on_shards │
├───────────────────────┤
│ (102136,t,24882)      │
│ (102137,t,34323)      │
│ (102138,t,29826)      │
│ (102139,t,32109)      │
│ (102140,t,30772)      │
└───────────────────────┘
```

From the above, we can see that the million rows we inserted are divided into
about 25k to 35k per shard.

## Next steps

Now we have a table sharded and loaded with data. Next, let's try running
queries across the data in these shards.

> [!div class="nextstepaction"]
> [Run distributed queries](quickstart-run-queries.md)
