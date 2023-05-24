---
title: Multi-Tenant Stats Monitoring - Azure Cosmos DB for PostgreSQL
description: Review Multi-tenant metrics on Azure Cosmos DB for PostgreSQL
ms.author: avijitgupta
author: AvijitkGupta
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: reference
ms.date: 05/22/2023
---

# Multi-Tenant Statistics Monitoring

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

> [!IMPORTANT] Applicable to Citus 11.3 & newer versions

`Multi-tenant statistics monitoring` is a crucial aspect of managing a multi-tenant SaaS platform. The feature offers valuable insights into the utilization of cluster resources by tenants, including CPU usage, read queries, and the overall volume of queries. This information is obtained by monitoring the nodes and the tenants who share those nodes, providing a comprehensive understanding of resource usage within the cluster. The introduction emphasizes the benefits of proactive issue identification, resource allocation optimization, and user experience improvement that can be achieved through the added monitoring.

## Conceptual model
In this distributed multi-tenant sharded model, a distributed table schema includes a tenant key which is the primary key of the table, that stores tenant data. The tenant key enables each individual schema to store one or many tenants. The use of sharded database makes it easy for the application system to support a very large number of tenants. All the data for any one tenant is stored on a separate shard (which could be shared or isolated to tenant). 

:::image type="content" source="media/concepts-monitor-tenants/tenant-overview.svg" alt-text="Screenshot that shows the metrics screen.":::

## GUC 

### citus.stat_tenants_log_level (text)
Controls the logging insights. Valid values are `DEBUG5`, `DEBUG4`, `DEBUG3`, `DEBUG2`, `DEBUG1`, `INFO`, `NOTICE`, `WARNING`, `ERROR`, `LOG`, `FATAL`, and `PANIC`. Default is `LOG`. Only Citus user can edit this setting.
Each level includes all the levels that follow it. The latter the level, the fewer messages are sent to the log.`-- Removing this as same logging done for any state.`

### citus.stat_tenants_limit (int)
Controls the number of tenants (top ``N``) to be tracked. Default is `100`.

### citus.stat_tenants_period (int)
Controls the window (`in secs`) during which the metrics of the tenants are closely monitored and analyzed. Default is `60 * 60 * 24` seconds. 

### citus.stat_tenants_track (boolean)
Enables or disables the `tracking` of tenant statistics. Default is `None`. Modification to the GUC requires a restart.

## Statistics views 

### pg_catalog.citus_stat_tenants 
The `citus_stat_tenants` monitoring view tracks the metrics within time bucket. Once a period ends, its statistics are stored for one more period, giving you current and previous period insights. Metrics currently tracked within the view include read query count, overall query count & CPU cycle consumed at the node, colocation group & tenant grain. 

|       ColumnName            |    Type       |                    Description                                                              |
|-----------------------------|---------------|---------------------------------------------------------------------------------------------|
| nodeid                      | INT           | Auto-generated identifier for an individual node.                                           |
| colocation_id               | INT           | [Colocation group](https://learn.microsoft.com/en-us/azure/cosmos-db/postgresql/concepts-colocation#data-colocation-for-hash-distributed-tables) to which this table belongs.                                               |
| tenant_attribute            | VARCHAR(100)  | Represents the distribution column\shard key.                                               |
| read_count_in_this_period   | INT           | Represents select queries count for ongoing time period (defined by stat_tenants_period).   |
| read_count_in_last_period   | INT           | Represents select queries count for previous time period (defined by stat_tenants_period).  |
| query_count_in_this_period  | INT           | Represents overall queries count for ongoing time period (defined by stat_tenants_period).  |
| query_count_in_last_period  | INT           | Represents overall queries count for previous time period (defined by stat_tenants_period). |
| cpu_usage_in_this_period    | DOUBLE        | Represents seconds of CPU time consumed for this tenant in ongoing period                      |
| cpu_usage_in_last_period    | DOUBLE        | Represents seconds of CPU time consumed for this tenant in previous period                     |

> [!Note]
> Privileges (`execute & select`) on view is granted to the role `pg_monitor`.
>
> Tracking tenant level statistics adds an overhead, and `by default is disabled`.

### pg_catalog.citus_stat_tenants_reset()
The function discards or truncates the collected statistics within citus_stat_tenants view.

## Operations tracked
When you enable this feature, accounting is activated for SQL commands such as `INSERT`, `UPDATE`, `DELETE`, and `SELECT`. This accounting is specifically designed for a `single tenant`. A query qualifies to be a single tenant query, if the query planner could restrict the query to a single shard or single tenant. 
In a multi-tenant environment, each tenant typically has access to their own dataset, and as a result, queries are filtered based on tenant keys. Any query in such systems which operates across tenants practically would be initiated by the system administrator or the landlord & are not traced back to individual tenants. For example, if the landlord needs to generate a report that includes aggregated data from all tenants, a cross-tenant query would be initiated by the landlord and not associated\accounted with any specific tenant.

```postgresql
CREATE TABLE organizations (id BIGSERIAL, name TEXT);

SELECT create_distributed_table ('organizations', 'id');

INSERT INTO organizations (name) VALUES ('Teleflora'); -- tracked
INSERT INTO organizations (name) VALUES ('BloomThat'); -- tracked
INSERT INTO organizations (name) VALUES ('UrbanStems');-- tracked

SELECT COUNT(*) FROM organizations where id = 1; -- tracked
 count 
-------
     1
(1 row)

SELECT COUNT(*) FROM organizations where id IN (1,2); -- untracked
 count 
-------
     1
(1 row)

UPDATE organizations SET name = 'Bloomers' WHERE id = 2; -- tracked

-- UPDATE 1

DELETE FROM organizations WHERE id = 3; -- tracked

-- DELETE 1
```

```postgresql
SELECT tenant_attribute,
       read_count_in_this_period,
       query_count_in_this_period,
       cpu_usage_in_this_period
FROM citus_stat_tenants;

 tenant_attribute | read_count_in_this_period | query_count_in_this_period | cpu_usage_in_this_period 
------------------+---------------------------+----------------------------+--------------------------
 1                |                         2 |                          3 |                        0
 2                |                         0 |                          2 |                        0
 3                |                         0 |                          2 |                        0
(3 rows)
```

> [!Note]
> `\COPY` command isn't tracked with the feature. 

## Next steps
To learn more about how to review tenant statistics
> [!div class="nextstepaction"]
> [How to review tenants monitor in Multi-Tenant application](howto-monitor-tenant-stats.md)

To learn about modeling multi-tenant app on Azure Cosmos DB for PostgreSQL 
>[!div class="nextstepaction"]
> [Model Multi_tenant application](quickstart-build-scalable-apps-model-multi-tenant.md)