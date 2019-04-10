---
title: 'Design a Multi-Tenant Database'
description: This tutorial shows how to create, populate, and query distributed tableson Azure Database for PostgreSQL Hyperscale (Citus).
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.custom: mvc
ms.devlang: azurecli
ms.topic: tutorial
ms.date: 04/07/2019
---

Multi-tenant Applications
=========================

This guide takes a sample multi-tenant application and describes
how to modify it for scalability. We'll examine typical challenges
for multi-tenant applications like isolating tenants from noisy
neighbors, and storing data that differs across tenants.

Let's Make an App -- Ad Analytics
---------------------------------

We'll build the back-end for an application that tracks online advertising
performance and provides an analytics dashboard on top.  Code for the full
example application is
[available](https://github.com/citusdata/citus-example-ad-analytics) on Github.

Let's start by considering a simplified schema for this application.
The application must keep track of multiple companies, each of which
runs advertising campaigns. Campaigns have many ads, and each ad has
associated records of its clicks and impressions.

```sql
CREATE TABLE companies (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  image_url text,
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL
);

CREATE TABLE campaigns (
  id bigserial PRIMARY KEY,
  company_id bigint REFERENCES companies (id),
  name text NOT NULL,
  cost_model text NOT NULL,
  state text NOT NULL,
  monthly_budget bigint,
  blacklisted_site_urls text[],
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL
);

CREATE TABLE ads (
  id bigserial PRIMARY KEY,
  campaign_id bigint REFERENCES campaigns (id),
  name text NOT NULL,
  image_url text,
  target_url text,
  impressions_count bigint DEFAULT 0,
  clicks_count bigint DEFAULT 0,
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL
);

CREATE TABLE clicks (
  id bigserial PRIMARY KEY,
  ad_id bigint REFERENCES ads (id),
  clicked_at timestamp without time zone NOT NULL,
  site_url text NOT NULL,
  cost_per_click_usd numeric(20,10),
  user_ip inet NOT NULL,
  user_data jsonb NOT NULL
);

CREATE TABLE impressions (
  id bigserial PRIMARY KEY,
  ad_id bigint REFERENCES ads (id),
  seen_at timestamp without time zone NOT NULL,
  site_url text NOT NULL,
  cost_per_impression_usd numeric(20,10),
  user_ip inet NOT NULL,
  user_data jsonb NOT NULL
);
```

Scaling the Relational Data Model
---------------------------------

Multi-tenant queries typically request information for one tenant
(e.g. store or company) at a time. By storing each tenant's data
together on a database node, we can minimize network overhead between
nodes during a query. This allows Hyperscale to support all application
joins, key constraints and transactions efficiently.

Citus stores table rows on different nodes based on the value of a
user-designated column called the "distribution column." This column
marks which tenant owns which rows.  In the ad analytics application
the tenants are companies, so we must ensure all tables have a
`company_id` column.

Preparing Tables and Ingesting Data
-----------------------------------

The schema we have created so far uses a separate `id` column as
primary key for each table. However, Citus requires that primary
and foreign key constraints include the distribution column,
`company_id`.

Putting it all together, here are the changes which prepare the
tables for distribution:

```sql
CREATE TABLE companies (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  image_url text,
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL
);

CREATE TABLE campaigns (
  id bigserial,       -- was: PRIMARY KEY
  company_id bigint REFERENCES companies (id),
  name text NOT NULL,
  cost_model text NOT NULL,
  state text NOT NULL,
  monthly_budget bigint,
  blacklisted_site_urls text[],
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL,
  PRIMARY KEY (company_id, id) -- added
);

CREATE TABLE ads (
  id bigserial,       -- was: PRIMARY KEY
  company_id bigint,  -- added
  campaign_id bigint, -- was: REFERENCES campaigns (id)
  name text NOT NULL,
  image_url text,
  target_url text,
  impressions_count bigint DEFAULT 0,
  clicks_count bigint DEFAULT 0,
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL,
  PRIMARY KEY (company_id, id),         -- added
  FOREIGN KEY (company_id, campaign_id) -- added
    REFERENCES campaigns (company_id, id)
);

CREATE TABLE clicks (
  id bigserial,        -- was: PRIMARY KEY
  company_id bigint,   -- added
  ad_id bigint,        -- was: REFERENCES ads (id),
  clicked_at timestamp without time zone NOT NULL,
  site_url text NOT NULL,
  cost_per_click_usd numeric(20,10),
  user_ip inet NOT NULL,
  user_data jsonb NOT NULL,
  PRIMARY KEY (company_id, id),      -- added
  FOREIGN KEY (company_id, ad_id)    -- added
    REFERENCES ads (company_id, id)
);

CREATE TABLE impressions (
  id bigserial,         -- was: PRIMARY KEY
  company_id bigint,    -- added
  ad_id bigint,         -- was: REFERENCES ads (id),
  seen_at timestamp without time zone NOT NULL,
  site_url text NOT NULL,
  cost_per_impression_usd numeric(20,10),
  user_ip inet NOT NULL,
  user_data jsonb NOT NULL,
  PRIMARY KEY (company_id, id),       -- added
  FOREIGN KEY (company_id, ad_id)     -- added
    REFERENCES ads (company_id, id)
);
```

### Try it Yourself

* TODO: instructions for provisioning hyperscale database
* [download](https://examples.citusdata.com/mt_ref_arch/schema.sql) schema
  and execute it with psql. TODO: provide commands for that.

Once the schema is ready, distribute the tables across worker nodes:

```sql
SELECT create_distributed_table('companies',   'id');
SELECT create_distributed_table('campaigns',   'company_id');
SELECT create_distributed_table('ads',         'company_id');
SELECT create_distributed_table('clicks',      'company_id');
SELECT create_distributed_table('impressions', 'company_id');
```

The `create_distributed_table` function informs Citus that a table
should be distributed among nodes and that future incoming queries
to those tables should be planned for distributed execution. The
function also creates shards for the table on worker nodes, which
are low-level units of data storage Citus uses to assign data to
nodes.

The next step is loading sample data into the cluster from the
command line.

* TODO: are windows folks able to do this in their shell?

```bash
# download and ingest datasets from the shell

for dataset in companies campaigns ads clicks impressions geo_ips; do
  curl -O https://examples.citusdata.com/mt_ref_arch/${dataset}.csv
done
```

Back inside psql, bulk load the data:

```postgresql
\copy companies from 'companies.csv' with csv
\copy campaigns from 'campaigns.csv' with csv
\copy ads from 'ads.csv' with csv
\copy clicks from 'clicks.csv' with csv
\copy impressions from 'impressions.csv' with csv
```

Integrating Applications
------------------------

Any application queries or update statements which include a filter
on `company_id` will continue to work. As mentioned earlier, this
kind of filter is common in multi-tenant apps. When using an
Object-Relational Mapper (ORM) you can recognize these queries by
methods such as `where` or `filter`.

ActiveRecord:

```ruby
Impression.where(company_id: 5).count
```

Django:

```python
Impression.objects.filter(company_id=5).count()
```

Basically when the resulting SQL executed in the database contains a
`WHERE company_id = :value` clause on every table (including tables in
JOIN queries), then Citus will recognize that the query should be routed
to a single node and execute it there as it is. This makes sure that all
SQL functionality is available. The node is an ordinary PostgreSQL
server after all.

Also, to make it even simpler, you can use our
[activerecord-multi-tenant](https://github.com/citusdata/activerecord-multi-tenant)
library for Rails, or
[django-multitenant](https://github.com/citusdata/django-multitenant)
for Django which will automatically add these filters to all your
queries, even the complicated ones. Check out our migration guides for
`rails_migration`{.interpreted-text role="ref"} and
`django_migration`{.interpreted-text role="ref"}.

This guide is framework-agnostic, so we\'ll point out some Citus
features using SQL. Use your imagination for how these statements would
be expressed in your language of choice.

Here is a simple query and update operating on a single tenant.

```sql
-- campaigns with highest budget

SELECT name, cost_model, state, monthly_budget
  FROM campaigns
 WHERE company_id = 5
 ORDER BY monthly_budget DESC
 LIMIT 10;

-- double the budgets!

UPDATE campaigns
   SET monthly_budget = monthly_budget*2
 WHERE company_id = 5;
```

A common pain point for users scaling applications with NoSQL databases
is the lack of transactions and joins. However, transactions work as
you\'d expect them to in Citus:

```sql
-- transactionally reallocate campaign budget money

BEGIN;

UPDATE campaigns
   SET monthly_budget = monthly_budget + 1000
 WHERE company_id = 5
   AND id = 40;

UPDATE campaigns
   SET monthly_budget = monthly_budget - 1000
 WHERE company_id = 5
   AND id = 41;

COMMIT;
```

As a final demo of SQL support, we have a query which includes
aggregates and window functions and it works the same in Citus as it
does in PostgreSQL. The query ranks the ads in each campaign by the
count of their impressions.

```sql
SELECT a.campaign_id,
       RANK() OVER (
         PARTITION BY a.campaign_id
         ORDER BY a.campaign_id, count(*) desc
       ), count(*) as n_impressions, a.id
  FROM ads as a
  JOIN impressions as i
    ON i.company_id = a.company_id
   AND i.ad_id      = a.id
 WHERE a.company_id = 5
GROUP BY a.campaign_id, a.id
ORDER BY a.campaign_id, n_impressions desc;
```

In short when queries are scoped to a tenant then inserts, updates,
deletes, complex SQL, and transactions all work as expected.

Sharing Data Between Tenants
----------------------------

Up until now all tables have been distributed by `company_id`, but
sometimes there is data that can be shared by all tenants, and doesn\'t
\"belong\" to any tenant in particular. For instance, all companies
using this example ad platform might want to get geographical
information for their audience based on IP addresses. In a single
machine database this could be accomplished by a lookup table for
geo-ip, like the following. (A real table would probably use PostGIS but
bear with the simplified example.)

```sql
CREATE TABLE geo_ips (
  addrs cidr NOT NULL PRIMARY KEY,
  latlon point NOT NULL
    CHECK (-90  <= latlon[0] AND latlon[0] <= 90 AND
           -180 <= latlon[1] AND latlon[1] <= 180)
);
CREATE INDEX ON geo_ips USING gist (addrs inet_ops);
```

To use this table efficiently in a distributed setup, we need to find a
way to co-locate the `geo_ips` table with clicks for not just one \--
but every \-- company. That way, no network traffic need be incurred at
query time. We do this in Citus by designating `geo_ips` as a
`reference table <reference_tables>`{.interpreted-text role="ref"}.

```sql
-- Make synchronized copies of geo_ips on all workers

SELECT create_reference_table('geo_ips');
```

Reference tables are replicated across all worker nodes, and Citus
automatically keeps them in sync during modifications. Notice that we
call `create_reference_table <create_reference_table>`{.interpreted-text
role="ref"} rather than `create_distributed_table`.

Now that `geo_ips` is established as a reference table, load it with
example data:

```postgresql
\copy geo_ips from 'geo_ips.csv' with csv
```

Now joining clicks with this table can execute efficiently. We can ask,
for example, the locations of everyone who clicked on ad 290.

```sql
SELECT c.id, clicked_at, latlon
  FROM geo_ips, clicks c
 WHERE addrs >> c.user_ip
   AND c.company_id = 5
   AND c.ad_id = 290;
```

Online Changes to the Schema
----------------------------

Another challenge with multi-tenant systems is keeping the schemas for
all the tenants in sync. Any schema change needs to be consistently
reflected across all the tenants. In Citus, you can simply use standard
PostgreSQL DDL commands to change the schema of your tables, and Citus
will propagate them from the coordinator node to the workers using a
two-phase commit protocol.

For example, the advertisements in this application could use a text
caption. We can add a column to the table by issuing the standard SQL on
the coordinator:

```sql
ALTER TABLE ads
  ADD COLUMN caption text;
```

This updates all the workers as well. Once this command finishes, the
Citus cluster will accept queries that read or write data in the new
`caption` column.

For a fuller explanation of how DDL commands propagate through the
cluster, see `ddl_prop_support`{.interpreted-text role="ref"}.

When Data Differs Across Tenants
--------------------------------

Given that all tenants share a common schema and hardware
infrastructure, how can we accommodate tenants which want to store
information not needed by others? For example, one of the tenant
applications using our advertising database may want to store tracking
cookie information with clicks, whereas another tenant may care about
browser agents. Traditionally databases using a shared schema approach
for multi-tenancy have resorted to creating a fixed number of
pre-allocated \"custom\" columns, or having external \"extension
tables.\" However PostgreSQL provides a much easier way with its
unstructured column types, notably
[JSONB](https://www.postgresql.org/docs/current/static/datatype-json.html).

Notice that our schema already has a JSONB field in `clicks` called
`user_data`. Each tenant can use it for flexible storage.

Suppose company five includes information in the field to track whether
the user is on a mobile device. The company can query to find who clicks
more, mobile or traditional visitors:

```sql
SELECT
  user_data->>'is_mobile' AS is_mobile,
  count(*) AS count
FROM clicks
WHERE company_id = 5
GROUP BY user_data->>'is_mobile'
ORDER BY count DESC;
```

The database administrator can even create a [partial
index](https://www.postgresql.org/docs/current/static/indexes-partial.html)
to improve speed for an individual tenant\'s query patterns. Here is one
to improve company 5\'s filters for clicks from users on mobile devices:

```sql
CREATE INDEX click_user_data_is_mobile
ON clicks ((user_data->>'is_mobile'))
WHERE company_id = 5;
```

Additionally, PostgreSQL supports [GIN
indices](https://www.postgresql.org/docs/current/static/gin-intro.html)
on JSONB. Creating a GIN index on a JSONB column will create an index on
every key and value within that JSON document. This speeds up a number
of [JSONB
operators](https://www.postgresql.org/docs/current/static/functions-json.html#FUNCTIONS-JSONB-OP-TABLE)
such as `?`, `?|`, and `?&`.

```sql
CREATE INDEX click_user_data
ON clicks USING gin (user_data);

-- this speeds up queries like, "which clicks have
-- the is_mobile key present in user_data?"

SELECT id
  FROM clicks
 WHERE user_data ? 'is_mobile'
   AND company_id = 5;
```

Dealing with Big Tenants
------------------------

::: {.note}
::: {.admonition-title}
Note
:::

This section uses features available only in Citus Cloud and Citus
Enterprise.
:::

The previous section describes a general-purpose way to scale a cluster
as the number of tenants increases. However, users often have two
questions. The first is what will happen to their largest tenant if it
grows too big. The second is what are the performance implications of
hosting a large tenant together with small ones on a single worker node,
and what can be done about it.

Regarding the first question, investigating data from large SaaS sites
reveals that as the number of tenants increases, the size of tenant data
typically tends to follow a [Zipfian
distribution](https://en.wikipedia.org/wiki/Zipf%27s_law).

![image](../images/zipf.png)

For instance, in a database of 100 tenants, the largest is predicted to
account for about 20% of the data. In a more realistic example for a
large SaaS company, if there are 10k tenants, the largest will account
for around 2% of the data. Even at 10TB of data, the largest tenant will
require 200GB, which can pretty easily fit on a single node.

Another question is regarding performance when large and small tenants
are on the same node. Standard shard rebalancing will improve overall
performance but it may or may not improve the mixing of large and small
tenants. The rebalancer simply distributes shards to equalize storage
usage on nodes, without examining which tenants are allocated on each
shard.

To improve resource allocation and make guarantees of tenant QoS it is
worthwhile to move large tenants to dedicated nodes. Citus provides the
tools to do this.

In our case, let\'s imagine that our old friend company id=5 is very
large. We can isolate the data for this tenant in two steps. We\'ll
present the commands here, and you can consult
`tenant_isolation`{.interpreted-text role="ref"} to learn more about
them.

First sequester the tenant\'s data into a bundle (called a shard)
suitable to move. The CASCADE option also applies this change to the
rest of our tables distributed by `company_id`.

```sql
SELECT isolate_tenant_to_new_shard(
  'companies', 5, 'CASCADE'
);
```

The output is the shard id dedicated to hold `company_id=5`:

```text
┌─────────────────────────────┐
│ isolate_tenant_to_new_shard │
├─────────────────────────────┤
│                      102240 │
└─────────────────────────────┘
```

Next we move the data across the network to a new dedicated node. Create
a new node as described in the previous section. Take note of its
hostname as shown in the Nodes tab of the Cloud Console.

```sql
-- find the node currently holding the new shard

SELECT nodename, nodeport
  FROM pg_dist_placement AS placement,
       pg_dist_node AS node
 WHERE placement.groupid = node.groupid
   AND node.noderole = 'primary'
   AND shardid = 102240;

-- move the shard to your choice of worker (it will also move the
-- other shards created with the CASCADE option)

SELECT master_move_shard_placement(
  102240,
  'source_host', source_port,
  'dest_host', dest_port);
```

You can confirm the shard movement by querying
`pg_dist_placement <placements>`{.interpreted-text role="ref"} again.

Where to Go From Here
---------------------

With this, you now know how to use Citus to power your multi-tenant
application for scalability. If you have an existing schema and want to
migrate it for Citus, see
`Multi-Tenant Transitioning <transitioning_mt>`{.interpreted-text
role="ref"}.

To adjust a front-end application, specifically Ruby on Rails or Django,
read `rails_migration`{.interpreted-text role="ref"}. Finally, try
`Citus Cloud <cloud_overview>`{.interpreted-text role="ref"}, the
easiest way to manage a Citus cluster, available with discounted
developer plan pricing.
