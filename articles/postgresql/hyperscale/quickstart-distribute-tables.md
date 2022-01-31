---
title: 'Quickstart: distribute tables - Hyperscale (Citus) - Azure Database for PostgreSQL'
description: Quickstart to distribute table data across nodes in Azure Database for PostgreSQL - Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.custom: mvc, mode-ui
ms.topic: quickstart
ms.date: 01/24/2022
---

# Create and distribute tables

Within Hyperscale (Citus) servers there are three types of tables:

* **Distributed Tables** - Distributed across worker nodes (scaled out).
  Generally large tables should be distributed tables to improve performance.
* **Reference tables** - Replicated to all nodes. Enables joins with
  distributed tables. Typically used for small tables like countries or product
  categories.
* **Local tables** - Tables that reside on coordinator node. Administration
  tables are good examples of local tables.

In this quickstart, we'll primarily focus on distributed tables, and getting
familiar with them.

The data model we're going to work with is simple: user and event data from GitHub. Events include fork creation, git commits related to an organization, and more.

## Prerequisites

To follow this quickstart, you'll first need to:

1. [Create a server group](quickstart-create-portal.md) in the Azure portal.
2. [Connect to the server group](quickstart-connect-psql.md) with psql to
   run SQL commands.

## Create tables

Once you've connected via psql, let's create our tables. In the psql console run:

```sql
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

CREATE TABLE github_users
(
    user_id bigint,
    url text,
    login text,
    avatar_url text,
    gravatar_id text,
    display_login text
);
```

The `payload` field of `github_events` has a JSONB datatype. JSONB is the JSON datatype in binary form in Postgres. The datatype makes it easy to store a flexible schema in a single column.

Postgres can create a `GIN` index on this type, which will index every key and value within it. With an  index, it becomes fast and easy to query the payload with various conditions. Let's go ahead and create a couple of indexes before we load our data. In psql:

```sql
CREATE INDEX event_type_index ON github_events (event_type);
CREATE INDEX payload_index ON github_events USING GIN (payload jsonb_path_ops);
```

## Shard tables across worker nodes

Next we’ll take those Postgres tables on the coordinator node and tell Hyperscale (Citus) to shard them across the workers. To do so, we’ll run a query for each table specifying the key to shard it on. In the current example we’ll shard both the events and users table on `user_id`:

```sql
SELECT create_distributed_table('github_events', 'user_id');
SELECT create_distributed_table('github_users', 'user_id');
```

[!INCLUDE [azure-postgresql-hyperscale-dist-alert](../../../includes/azure-postgresql-hyperscale-dist-alert.md)]

## Load data into distributed tables

We're ready to load data. In psql still, shell out to download the files:

```sql
\! curl -O https://examples.citusdata.com/users.csv
\! curl -O https://examples.citusdata.com/events.csv
```

Next, load the data from the files into the distributed tables:

```sql
SET CLIENT_ENCODING TO 'utf8';

\copy github_events from 'events.csv' WITH CSV
\copy github_users from 'users.csv' WITH CSV
```

## Next steps

* [Run queries](quickstart-run-queries.md) on the distributed tables you
  created in this quickstart.
* Learn more about [sharding data](tutorial-shard.md).
