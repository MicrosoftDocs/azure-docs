---
title: Monitor statistics with multi-tenant monitoring on Azure Cosmos DB for PostgreSQL
description: how to monitor multi-tenant stats on Azure Cosmos DB for PostgreSQL
ms.author: avijitgupta
author: AvijitkGupta
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: reference
ms.date: 06/05/2023
---

# How to review tenant statistics using multi-tenant monitoring in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

> [!IMPORTANT]
> Applicable to Citus 11.3 & newer versions

This article shows how to gain insights into resource usage by tenants, by using the `citus_stat_tenants` view. The view tracks listed metrics for tenants

* Count of read queries (SELECT queries).
* Count of total queries (SELECT, INSERT, DELETE, and UPDATE queries).
* Total CPU usage in seconds.

You'll learn how to use the `citus_stat_tenants` view for making informed decisions and how to configure the feature to best fit your application.

> [!Note]
> * Privileges (`execute`, `select`) on view is granted to the role `pg_monitor`.

## Monitor your top tenants with citus_stat_tenants
[!INCLUDE [Introduction to `tenant tracking`](includes/tenant-monitoring.md)]

You can control the number of tenants tracked with the `citus.stat_tenants_limit` parameter. Additionally using `citus.stat_tenants_period`, you can define the time bucket of monitoring. Once a period ends, its statistics are stored in the last period, providing you with the ongoing and last completed period of measurement.

> [!Note]
> * Default for citus.stat_tenants_period is `60 seconds`.
>
> * Default for citus.stat_tenants_limit is `100`.

Learn more by reviewing a sample multi-tenant application, which helps companies run their ad-campaigns.

```postgresql
CREATE TABLE companies (company_id BIGSERIAL PRIMARY KEY, name TEXT);
SELECT create_distributed_table ('companies', 'company_id');

CREATE TABLE campaigns (id BIGSERIAL, company_id BIGINT, name TEXT, PRIMARY KEY (id, company_id));
SELECT create_distributed_table ('campaigns', 'company_id');
```

`companies` & `campaigns` tables both are sharded on a common tenant key `company_id`. You can now add companies and the ad campaigns data using commands:

```postgresql
INSERT INTO companies (company_id, name) VALUES (1, 'GigaMarket');
INSERT INTO campaigns (id, company_id, name) VALUES (1, 1, 'Crazy Wednesday'), (2, 1, 'Frozen Food Frenzy');
INSERT INTO campaigns (id, company_id, name) VALUES (3, 1, 'Spring Cleaning'), (4, 1, 'Bread&Butter');
INSERT INTO campaigns (id, company_id, name) VALUES (5, 1, 'Personal Care Refresh'), (6, 1, 'Lazy Lunch');

INSERT INTO companies (company_id, name) VALUES (2, 'White Bouquet Flowers');
INSERT INTO campaigns (id, company_id, name) VALUES (7, 2, 'Bonjour Begonia'), (8, 2, 'April Selection'), (9, 2, 'May Selection');

INSERT INTO companies (company_id, name) VALUES (3, 'Smart Pants Co.');
INSERT INTO campaigns (id, company_id, name) VALUES (10, 3, 'Short Shorts'), (11, 3, 'Tailors Cut');
INSERT INTO campaigns (id, company_id, name) VALUES (12, 3, 'Smarter Casual');
```

Let's run a few more `SELECT` and `UPDATE` queries and see the changes to the `citus_stat_tenants` view upon executing individual command.

```postgresql
SELECT COUNT(*) FROM campaigns WHERE company_id = 1;
```
```text
count
-------
     6
(1 row)
```
```postgresql
SELECT name FROM campaigns WHERE company_id = 2 AND name LIKE '%Selection';
```
```text
      name
-----------------
 April Selection
 May Selection
(2 rows)
```
```postgresql
UPDATE campaigns SET name = 'Tailor''s Cut' WHERE company_id = 3 AND name = 'Tailors Cut';
```

```postgresql
SELECT tenant_attribute,
       read_count_in_this_period,
       query_count_in_this_period,
       cpu_usage_in_this_period
FROM citus_stat_tenants;
```

Let's now review the resultset captured in the `citus_stat_tenants` view. For tenant_attribute `1`, during this ongoing period, there were 5 queries executed, resulting in a relatively low CPU usage of 0.000299. Additionally, there was 1 read count recorded. We observed queries in last 60 seconds for the 3 tenants, which appear in resultset. Ordering of Top N tenants depends on `query_count_in_this_period` field.

```text
tenant_attribute | read_count_in_this_period | query_count_in_this_period | cpu_usage_in_this_period
------------------+---------------------------+----------------------------+--------------------------
 1                |                         1 |                          5 |               0.000299
 3                |                         0 |                          3 |               0.000314
 2                |                         2 |                          4 |               0.000295
(3 rows)
```

> [!Important]
> * Tracking tenant level statistics adds an overhead, and `by default is disabled`.
>
> * set citus.stat_tenants_track = 'all' to enable tracking.

## Next steps
Learn about the concepts related to multi-tenant monitoring and rebalancing active tenants.
> [!div class="nextstepaction"]
> [Multi-tenant monitoring](concepts-multi-tenant-monitoring.md)

> [!div class="nextstepaction"]
> [Zero-Downtime rebalancing](howto-scale-rebalance.md)