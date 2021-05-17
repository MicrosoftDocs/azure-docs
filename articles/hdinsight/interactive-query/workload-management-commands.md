---
title: Hive Workload Management Commands
description: Hive Workload Management Commands
ms.service: hdinsight
ms.topic: reference
author: guptanikhil007
ms.author: guptan
ms.reviewer: jasonh
ms.date: 04/07/2021
---
# Hive Workload Management Commands

## WLM Commands Summary

|Name |Brief Description |Syntax |Example |
|---------------------------|------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
|ALTER MAPPING |Changes the routing of queries to a resource pool. |ALTER { USER &#124; GROUP &#124; APPLICATION } MAPPING 'entity_name' IN plan_name { TO pool_path &#124; UNMANAGED } [ WITH ORDER num ] |ALTER USER MAPPING 'hive' IN demo_plan TO etl WITH ORDER 1; |
|ALTER POOL |Modifies query pool properties, adds triggers, and removes triggers. |ALTER POOL plan_name.pool_path [ SET {property=value, ... } &#124; UNSET { property, ... } ]; <br/> ALTER POOL plan_name.pool_path [ ADD &#124; DROP ] TRIGGER name;|ALTER POOL demo_plan.default ADD TRIGGER defaultToETL; |
|ALTER RESOURCE PLAN |Enables, disables, activates, validates, or changes a plan. |ALTER RESOURCE PLAN name [ VALIDATE &#124; DISABLE &#124; ENABLE &#124; ACTIVATE &#124; RENAME TO another_name &#124; SET {property=value, ... } &#124; UNSET {property, ... } ]; |ALTER RESOURCE PLAN demo_plan SET DEFAULT POOL=etl, QUERY_PARALLELISM=3; |
|ALTER TRIGGER |Adds a trigger to or removes a trigger from a resource pool. |ALTER TRIGGER plan_name.name { ADD TO &#124; DROP FROM } { POOL path &#124; UNMANAGED }; |ALTER TRIGGER demo_plan.ETLKill ADD TO POOL etl; |
|CREATE MAPPING |Routes queries to a resource pool. |CREATE { USER &#124; GROUP &#124; APPLICATION } MAPPING 'entity_name' IN plan_name { TO pool_path &#124; UNMANAGED } [ WITH ORDER num ]; |CREATE USER MAPPING 'hive' IN demo_plan TO sys_accounts WITH ORDER 1; |
|CREATE POOL |Creates and adds a query pool for a resource plan. |CREATE POOL plan_name.path WITH ALLOC_FRACTION = decimal, QUERY_PARALLELISM = num, [ SCHEDULING_POLICY = scheduling_value ]; |CREATE POOL demo_plan.etl WITH ALLOC_FRACTION = 0.20, QUERY_PARALLELISM = 2; |
|CREATE RESOURCE PLAN |Creates a resource plan |CREATE RESOURCE PLAN plan_name [ WITH QUERY PARALLELISM=number &#124; LIKE name]; |CREATE RESOURCE PLAN demo_plan; |
|CREATE TRIGGER |Creates and adds a trigger to a resource plan. |CREATE TRIGGER plan_name.name WHEN condition DO action; |CREATE TRIGGER demo_plan.defaultToETL WHEN  ELAPSED_TIME > 20000 DO MOVE TO etl;|
|DISABLE WORKLOAD MANAGEMENT|Deactivates the active resource plan. |DISABLE WORKLOAD MANAGEMENT; |DISABLE WORKLOAD MANAGEMENT |
|DROP MAPPING |Removes a mapping from a resource plan. |DROP { USER &#124; GROUP &#124; APPLICATION } MAPPING 'entity_name' IN plan_name; |DROP USER MAPPING 'hive' IN demo_plan; |
|DROP POOL |Removes a query pool from a resource plan. |DROP POOL plan_name.pool_path; |CREATE POOL demo_plan.etl; |
|DROP RESOURCE PLAN |Deletes a resource plan. |DROP RESOURCE PLAN plan_name; |DROP RESOURCE PLAN demo_plan; |
|DROP TRIGGER |Deletes a trigger from a resource plan. |DROP TRIGGER plan_name.trigger_name; |DROP TRIGGER demo_plan.defaultToETL; |
|REPLACE RESOURCE PLAN WITH |Replaces the contents of one resource plan with the contents of another.|REPLACE RESOURCE PLAN name1 WITH name2; <br/> REPLACE ACTIVE RESOURCE PLAN name1 WITH name2; |REPLACE RESOURCE PLAN rp_plan1 WITH rp_plan2; |
|SHOW RESOURCE PLAN |Lists plan contents. |SHOW RESOURCE PLAN plan_name; |SHOW RESOURCE PLAN demo_plan; |
|SHOW RESOURCE PLANS |Lists all resource plans. |SHOW RESOURCE PLANS; |SHOW RESOURCE PLANS; |



## References:
- [Cloudera Hive Workload Management Commands Summary](https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.1.5/hive-workload-commands/content/hive_workload_management_command_summary.html)
- [Cloudera Hive Workload Management Trigger Counters](https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.1.5/hive-workload-commands/content/hive_workload_trigger_counters.html)
