---
title: Hive LLAP Workload Management commands
titleSuffix: Azure HDInsight
description: Hive LLAP Workload Management commands
ms.service: hdinsight
ms.topic: reference
author: reachnijel
ms.author: nijelsf
ms.date: 07/19/2022
---
# Hive LLAP Workload Management commands

Workload management feature can be controlled and managed with the help of following Hive commands. These commands resemble the existing ALTER, CREATE, DROP, and SHOW statements.

## Alter Mapping 
Changes the routing of queries to a resource pool. 
#### Syntax 
```hql
ALTER { USER | GROUP | APPLICATION } MAPPING 'entity_name' IN plan_name { TO pool_path | UNMANAGED } [ WITH ORDER num ]
```
#### Example 
```hql
ALTER USER MAPPING 'hive' IN demo_plan TO etl WITH ORDER 1;
```

## Alter Pool 
Modifies query pool properties, adds triggers, and removes triggers. 
#### Syntax 
```hql
ALTER POOL plan_name.pool_path [ SET {property=value, ... } | UNSET { property, ... } ];
ALTER POOL plan_name.pool_path [ ADD | DROP ] TRIGGER name;
```
#### Example 
```hql
ALTER POOL demo_plan.default ADD TRIGGER defaultToETL;
```

## Alter Resource Plan 
Enables, disables, activates, validates, or changes a plan. 
#### Syntax 
```hql
ALTER RESOURCE PLAN name [ VALIDATE | DISABLE | ENABLE | ACTIVATE | RENAME TO another_name | SET {property=value, ... } | UNSET {property, ... } ];
```
#### Example 
```hql
ALTER RESOURCE PLAN demo_plan SET DEFAULT POOL=etl, QUERY_PARALLELISM=3;
```

## Alter Trigger 
Adds a trigger to or removes a trigger from a resource pool. 
#### Syntax 
```hql
ALTER TRIGGER plan_name.name { ADD TO | DROP FROM } { POOL path | UNMANAGED };
```
#### Example 
```hql
ALTER TRIGGER demo_plan.ETLKill ADD TO POOL etl;
```

## Create Mapping 
Routes queries to a resource pool. 
#### Syntax 
```hql
CREATE { USER | GROUP | APPLICATION } MAPPING 'entity_name' IN plan_name { TO pool_path | UNMANAGED } [ WITH ORDER num ];
```
#### Example 
```hql
CREATE USER MAPPING 'hive' IN demo_plan TO sys_accounts WITH ORDER 1;
```

## Create Pool 
Creates and adds a query pool for a resource plan. 
#### Syntax 
```hql
CREATE POOL plan_name.path WITH ALLOC_FRACTION = decimal, QUERY_PARALLELISM = num, [ SCHEDULING_POLICY = scheduling_value ];
```
#### Example 
```hql
CREATE POOL demo_plan.etl WITH ALLOC_FRACTION = 0.20, QUERY_PARALLELISM = 2;
```

## Create Resource Plan 
Creates a resource plan 
#### Syntax 
```hql
CREATE RESOURCE PLAN plan_name [ WITH QUERY PARALLELISM=number | LIKE name];
```
#### Example 
```hql
CREATE RESOURCE PLAN demo_plan;
```

## Create Trigger 
Creates and adds a trigger to a resource plan. 
#### Syntax 
```hql
CREATE TRIGGER plan_name.name WHEN condition DO action;
```
#### Example 
```hql
CREATE TRIGGER demo_plan.defaultToETL WHEN  ELAPSED_TIME > 20000 DO MOVE TO etl;
```

## Disable Workload Management 
Deactivates the active resource plan. 
#### Syntax 
```hql
DISABLE WORKLOAD MANAGEMENT;
```
#### Example 
```hql
DISABLE WORKLOAD MANAGEMENT
```

## Drop Mapping 
Removes a mapping from a resource plan. 
#### Syntax 
```hql
DROP { USER | GROUP | APPLICATION } MAPPING 'entity_name' IN plan_name;
```
#### Example 
```hql
DROP USER MAPPING 'hive' IN demo_plan;
```

## Drop Pool 
Removes a query pool from a resource plan. 
#### Syntax 
```hql
DROP POOL plan_name.pool_path;
```
#### Example 
```hql
CREATE POOL demo_plan.etl;
```

## Drop Resource Plan 
Deletes a resource plan. 
#### Syntax 
```hql
DROP RESOURCE PLAN plan_name;
```
#### Example 
```hql
DROP RESOURCE PLAN demo_plan;
```

## Drop Trigger 
Deletes a trigger from a resource plan. 
#### Syntax 
```hql
DROP TRIGGER plan_name.trigger_name;
```
#### Example 
```hql
DROP TRIGGER demo_plan.defaultToETL;
```

## Replace Resource Plan With 
Replaces the contents of one resource plan with the contents of another. 
#### Syntax 
```hql
REPLACE RESOURCE PLAN name1 WITH name2; 
REPLACE ACTIVE RESOURCE PLAN name1 WITH name2;
```
#### Example 
```hql
REPLACE RESOURCE PLAN rp_plan1 WITH rp_plan2;
```

## Show Resource Plan 
Lists plan contents. 
#### Syntax 
```hql
SHOW RESOURCE PLAN plan_name;
```
#### Example 
```hql
SHOW RESOURCE PLAN demo_plan;
```

## Show Resource Plans 
Lists all resource plans. 
#### Syntax 
```hql
SHOW RESOURCE PLANS;
```
#### Example 
```hql
SHOW RESOURCE PLANS;
```
