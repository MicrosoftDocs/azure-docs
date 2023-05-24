---
title: Monitor stats with Multi-Tenant Monitoring on Azure Cosmos DB for PostgreSQL
description: how to monitor Multi-tenant stats on Azure Cosmos DB for PostgreSQL
ms.author: avijitgupta
author: AvijitkGupta
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: reference
ms.date: 05/19/2023
---

# How to monitor tenant stats using Multi-Tenant Monitoring in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

> [!IMPORTANT] Applicable to Citus 11.3 & newer versions

This article provides insights into the utilization of cluster resources by tenants, through the utilization of new `citus_stat_tenants` view. The view allows us with tracking :

* read query count - SELECT queries.
* total query count - SELECT, INSERT, DELETE, and UPDATE queries.
* total CPU usage in seconds.

In this article, you will learn about how could we utilize the `citus_stat_tenants` view for making informed decisions and also would learn to configure to best fit your application.

> [!Note]
> * Privileges (`execute & select`) on view is granted to the role `pg_monitor`.

## Monitor your top tenants with citus_stat_tenants

When you enable this feature, accounting is activated for SQL commands such as `INSERT`, `UPDATE`, `DELETE`, and `SELECT`. This accounting is specifically designed for a `single tenant` queries. A query qualifies to be a single tenant query, if the query planner generates a query plan restricted to a single shard or to a single tenant.

The feature provides you with better control over required tenant tracking by configuring for desired number of tenants to track, through the usage of parameter `citus.stat_tenants_limit`.

Let's try to learn more by reviewing a sample multi-tenant application which helps companies run their ad-campaigns.

```postgresql
CREATE TABLE companies (id BIGSERIAL, name TEXT);
SELECT create_distributed_table ('companies', 'id');

CREATE TABLE campaigns (id BIGSERIAL, company_id BIGINT, name TEXT);
SELECT create_distributed_table ('campaigns', 'company_id');
```

With above schema definition you can enroll companies as tenants, while id \ company_id acts as tenant keys. You can create some sample data by running below commands.

```postgresql
INSERT INTO companies (name) VALUES ('GigaMarket');
INSERT INTO campaigns (company_id, name) VALUES (1, 'Crazy Wednesday'), (1, 'Frozen Food Frenzy');
INSERT INTO campaigns (company_id, name) VALUES (1, 'Spring Cleaning'), (1, 'Bread&Butter');
INSERT INTO campaigns (company_id, name) VALUES (1, 'Personal Care Refresh'), (1, 'Lazy Lunch');

INSERT INTO companies (name) VALUES ('White Bouquet Flowers');
INSERT INTO campaigns (company_id, name) VALUES (2, 'Bonjour Begonia'), (2, 'April Selection'), (2, 'May Selection');

INSERT INTO companies (name) VALUES ('Smart Pants Co.');
INSERT INTO campaigns (company_id, name) VALUES (3, 'Short Shorts'), (3, 'Tailors Cut');
INSERT INTO campaigns (company_id, name) VALUES (3, 'Smarter Casual');
```

You can also run a few more reads and update queries and track the changes in `citus_stat_tenants` view upon executing individual commands.

```postgresql
SELECT COUNT(*) FROM campaigns WHERE company_id = 1;
count
-------
     6
(1 row)

SELECT name FROM campaigns WHERE company_id = 2 AND name LIKE '%Selection';
      name
-----------------
 April Selection
 May Selection
(2 rows)

UPDATE campaigns SET name = 'Tailor''s Cut' WHERE company_id = 3 AND name = 'Tailors Cut';
```

```postgresql
SELECT tenant_attribute,
       read_count_in_this_period,
       query_count_in_this_period,
       cpu_usage_in_this_period
FROM citus_stat_tenants;
tenant_attribute | read_count_in_this_period | query_count_in_this_period | cpu_usage_in_this_period
------------------+---------------------------+----------------------------+--------------------------
 1                |                         1 |                          5 |                 0.000299
 3                |                         0 |                          4 |                 0.000314
 2                |                         1 |                          3 |                 0.000295
(3 rows)
```
As you observed, you now have insights into individual top tenant activities.

> [!Important]
> * Tenant level statistics feature is `disabled by default`, since it adds an overhead.
>
> * set citus.stat_tenants_track = 'all' to enable tracking

The `citus_stat_tenants` view monitor tenants within time buckets, managed using `citus.stat_tenants_period`. Each time period's query and CPU statistics are meticulously counted separately. Once a period concludes, the numbers are finalized and preserved for just one additional period. This allows us with an immediate snapshot of the current period's statistics, along with the data from the previous period.

> [!Note]
> Default for citus.stat_tenants_period is `60 seconds`.

## Next Steps
To learn about concepts related to multi-tenant monitoring
> [!div class="nextstepaction"]
> [Multi-tenant monitoring](concepts-multi-tenant-monitoring.md)

To learn about scaling the cluster
> [!div class="nextstepaction"]
> [Zero-Downtime cluster scaling](howto-scale-grow.md)

To learn about rebalancing
> [!div class="nextstepaction"]
> [Zero-Downtime rebalancing](howto-scale-rebalance.md)