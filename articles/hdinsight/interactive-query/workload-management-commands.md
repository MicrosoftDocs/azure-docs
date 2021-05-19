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

## ALTER MAPPING 
Changes the routing of queries to a resource pool. 
#### Syntax 
```
ALTER { USER | GROUP | APPLICATION } MAPPING 'entity_name' IN plan_name { TO pool_path | UNMANAGED } [ WITH ORDER num ]
```
#### Example 
```
ALTER USER MAPPING 'hive' IN demo_plan TO etl WITH ORDER 1;
```

## ALTER POOL 
Modifies query pool properties, adds triggers, and removes triggers. 
#### Syntax 
```
ALTER POOL plan_name.pool_path [ SET {property=value, ... } | UNSET { property, ... } ];
ALTER POOL plan_name.pool_path [ ADD | DROP ] TRIGGER name;
```
#### Example 
```
ALTER POOL demo_plan.default ADD TRIGGER defaultToETL;
```

## ALTER RESOURCE PLAN 
Enables, disables, activates, validates, or changes a plan. 
#### Syntax 
```
ALTER RESOURCE PLAN name [ VALIDATE | DISABLE | ENABLE | ACTIVATE | RENAME TO another_name | SET {property=value, ... } | UNSET {property, ... } ];
```
#### Example 
```
ALTER RESOURCE PLAN demo_plan SET DEFAULT POOL=etl, QUERY_PARALLELISM=3;
```

## ALTER TRIGGER 
Adds a trigger to or removes a trigger from a resource pool. 
#### Syntax 
```
ALTER TRIGGER plan_name.name { ADD TO | DROP FROM } { POOL path | UNMANAGED };
```
#### Example 
```
ALTER TRIGGER demo_plan.ETLKill ADD TO POOL etl;
```

## CREATE MAPPING 
Routes queries to a resource pool. 
#### Syntax 
```
CREATE { USER | GROUP | APPLICATION } MAPPING 'entity_name' IN plan_name { TO pool_path | UNMANAGED } [ WITH ORDER num ];
```
#### Example 
```
CREATE USER MAPPING 'hive' IN demo_plan TO sys_accounts WITH ORDER 1;
```

## CREATE POOL 
Creates and adds a query pool for a resource plan. 
#### Syntax 
```
CREATE POOL plan_name.path WITH ALLOC_FRACTION = decimal, QUERY_PARALLELISM = num, [ SCHEDULING_POLICY = scheduling_value ];
```
#### Example 
```
CREATE POOL demo_plan.etl WITH ALLOC_FRACTION = 0.20, QUERY_PARALLELISM = 2;
```

## CREATE RESOURCE PLAN 
Creates a resource plan 
#### Syntax 
```
CREATE RESOURCE PLAN plan_name [ WITH QUERY PARALLELISM=number | LIKE name];
```
#### Example 
```
CREATE RESOURCE PLAN demo_plan;
```

## CREATE TRIGGER 
Creates and adds a trigger to a resource plan. 
#### Syntax 
```
CREATE TRIGGER plan_name.name WHEN condition DO action;
```
#### Example 
```
CREATE TRIGGER demo_plan.defaultToETL WHEN  ELAPSED_TIME > 20000 DO MOVE TO etl;
```

## DISABLE WORKLOAD MANAGEMENT 
Deactivates the active resource plan. 
#### Syntax 
```
DISABLE WORKLOAD MANAGEMENT;
```
#### Example 
```
DISABLE WORKLOAD MANAGEMENT
```

## DROP MAPPING 
Removes a mapping from a resource plan. 
#### Syntax 
```
DROP { USER | GROUP | APPLICATION } MAPPING 'entity_name' IN plan_name;
```
#### Example 
```
DROP USER MAPPING 'hive' IN demo_plan;
```

## DROP POOL 
Removes a query pool from a resource plan. 
#### Syntax 
```
DROP POOL plan_name.pool_path;
```
#### Example 
```
CREATE POOL demo_plan.etl;
```

## DROP RESOURCE PLAN 
Deletes a resource plan. 
#### Syntax 
```
DROP RESOURCE PLAN plan_name;
```
#### Example 
```
DROP RESOURCE PLAN demo_plan;
```

## DROP TRIGGER 
Deletes a trigger from a resource plan. 
#### Syntax 
```
DROP TRIGGER plan_name.trigger_name;
```
#### Example 
```
DROP TRIGGER demo_plan.defaultToETL;
```

## REPLACE RESOURCE PLAN WITH 
Replaces the contents of one resource plan with the contents of another. 
#### Syntax 
```
REPLACE RESOURCE PLAN name1 WITH name2; 
REPLACE ACTIVE RESOURCE PLAN name1 WITH name2;
```
#### Example 
```
REPLACE RESOURCE PLAN rp_plan1 WITH rp_plan2;
```

## SHOW RESOURCE PLAN 
Lists plan contents. 
#### Syntax 
```
SHOW RESOURCE PLAN plan_name;
```
#### Example 
```
SHOW RESOURCE PLAN demo_plan;
```

## SHOW RESOURCE PLANS 
Lists all resource plans. 
#### Syntax 
```
SHOW RESOURCE PLANS;
```
#### Example 
```
SHOW RESOURCE PLANS;
```

## References
- [Cloudera Hive Workload Management Commands Summary](https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.1.5/hive-workload-commands/content/hive_workload_management_command_summary.html)
- [Cloudera Hive Workload Management Trigger Counters](https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.1.5/hive-workload-commands/content/hive_workload_trigger_counters.html)
