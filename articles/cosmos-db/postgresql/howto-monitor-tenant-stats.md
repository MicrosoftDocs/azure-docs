---
title: Multi-Tenant Stats Monitoring - Azure Cosmos DB for PostgreSQL
description: See how to review tenant stats metrics for Azure Cosmos DB for PostgreSQL
ms.author: avijitgupta
author: AvijitkGupta
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: reference
ms.date: 05/15/2023
---

# Multi-Tenant Stats Monitoring

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

> [!IMPORTANT] Applicable to Citus 11.3 & newer versions

Tenant stats monitoring is a crucial aspect of managing a multi-tenant SaaS platform. It provides insights into how tenants are using the cluster resources, such as CPU, Query volume across the nodes & tenants sharing the individual nodes. The introduction emphasizes the benefits of proactive issue identification, resource allocation optimization, and user experience improvement that can be achieved through tenant stats monitoring.

## Conceptual model
In this distributed multi-tenant sharded model, a distributed table schema includes a tenant key which is the primary key of table that stores tenant data. The tenant key enables each individual schema to store one or many tenants. The use of sharded database makes it easy for the application system to support a very large number of tenants. All the data for any one tenant is stored on a separate shard (which could be shared or isolated for tenant). The large number of tenants are distributed across the many sharded databases.

![screen](./media/saas-tenancy-schema-management/schema-management-dpt.png)

## GUC 

##### citus.stat_tenants_log_level (text)

Controls the logging insights. Valid value includes (LOG, DEBUG, ERROR, OFF) , the later the level the fewer messages are sent to the log. Default is OFF. Only Citus user can edit this setting.

##### citus.stat_tenants_limit (int)

Controls the number of tenants to be returned. Min tenants observed by default.  

##### citus.stat_tenants_period (int)

Controls the time period (in secs) during which the metrics of the tenants are closely monitored and analyzed. Default to 15 mins. 

##### citus.stat_tenants_track (boolean)

Controls the stat collection. Enables or disables the tracking of tenant stats. Default is set to None, for avoiding extra CPU cycles needed for the calculations.

## Explore the tenant stat functions & views 

##### pg_catalog.citus_stat_tenants 
The monitoring view tracks the read query & overall query volume at node, colocation & tenant grain. Privileges (execute & select) is granted to role pg_monitor.

| **ColumnName**              | **Type**      | **Description**                                                                             |
|-----------------------------|---------------|---------------------------------------------------------------------------------------------|
| nodeid                      | INT           | Auto-generated identifier for an individual node.                                           |
| colocation_id               | INT           | Co-location group to which this table belongs.                                              |
| tenant_attribute            | VARCHAR(100)  | Represents the distribution\shard key.                                                      |
| read_count_in_this_period   | INT           | Represents select queries count for ongoing time period defined with stat_tenants_period.   |
| read_count_in_last_period   | INT           | Represents select queries count for previous time period defined with stat_tenants_period.  |
| query_count_in_this_period  | INT           | Represents overall queries count for ongoing time period defined with stat_tenants_period.  |
| query_count_in_last_period  | INT           | Represents overall queries count for previous time period defined with stat_tenants_period. |
|                             |               |                                                                                             |


##### pg_catalog.citus_stat_tenants_reset()
The function discards statistics gathered so far by citus_stat_tenants

## Simulate usage with sample



## What commands are accounted



|                                                Command                                               | Accounted | Remarks |
|:----------------------------------------------------------------------------------------------------:|:---------:|:-------:|
| INSERT INTO TABLE (column_1,column_2) VALUES('tenant_1',124);                                        | Yes       |         |
| INSERT INTO TABLE (column_1,column_2)  VALUES  ('tenant_1',124) ,('tenant_1',234) ,('tenant_1',214); | Yes       |         |
| INSERT INTO TABLE (column_1,column_2)  VALUES  ('tenant_1',124) ,('tenant_2',234) ,('tenant_3',214); | No        |         |
| SELECT column_1 FROM Table;                                                                          | No        |         |
| SELECT column_1 FROM Table WHERE tenant = 'tenant_1';                                                | Yes       |         |
| SELECT * FROM Table WHERE tenant = 'tenant_1';                                                       | Yes       |         |
| SELECT column_1 FROM Table WHERE tenant IN ('tenant_1';'tenant_2');                                  | No        |         |
| SELECT * FROM Table WHERE tenant IN ('tenant_1';'tenant_2');                                         | No        |         |
| UPDATE Table SET column_2 = 1123;                                                                    | No        |         |
| UPDATE Table SET column_2 = 1123 WHERE tenant = 'tenant_1';                                          | Yes       |         |
| UPDATE Table SET column_2 = 1123 WHERE tenant IN ('tenant_1','tenant_2');                            | No        |         |
| DELETE FROM Table;                                                                                   | No        |         |
| DELETE FROM Table WHERE tenant = 'tenant_1';                                                         | Yes       |         |
| DELETE FROM Table WHERE tenant IN ('tenant_1','tenant_2');                                           | No        |         |
| \copy sample FROM '/home/MyUser/data/TableName.csv' WITH (FORMAT CSV)                                | No        |         |
|                                                                                                      |           |         |


> [!TIP] 
CPU Monitoring - How does this work </br>
Performance </br>
documentation </br>
enabling transmitted to the cluster </br>


## Monitor the tenants (Workbook)

To be added post MARLIN integration with Citus 11.3

## Additional Resources
> For more information, see additional </br>
> To learn about distributed tables, refer @ concepts-distributed-data </br>
> To learn about modeling multi-tenant app on Azure Cosmos DB for PostgreSQL, @quickstart-build-scalable-apps-model-multi-tenant </br>


