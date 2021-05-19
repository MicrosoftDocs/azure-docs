---
title: Hive Workload Management Feature
description: Hive Workload Management Feature
ms.service: hdinsight
ms.topic: how-to
author: guptanikhil007
ms.author: guptan
ms.reviewer: jasonh
ms.date: 04/07/2021
---

# Hive Workload Management (WLM) Feature
In an Interactive Query Cluster, resource management is imperative, especially in a multi-tenant environment. Hive LLAP (low-latency analytical processing) uses workload management to enable users to allocate resources to match availability needs and prevent contention for those resources. <br> 
Workload Management implements resource pools to provide an interface to control resource usage and access. The WLM resource pools try to improve parallel query execution and provide guaranteed resources. Workload management also provides sufficient help in reducing resource starvation issue often seen in large clusters.

![`LLAP Architecture/Components`](./media/hive-workload-management/llap-architecture.png "LLAP Architecture/Components")

## Enable Hive Workload Management feature for HDInsight clusters

Enable workload management feature in HDInsight Interactive Query clusters by following the steps listed below:
1. Create a new yarn queue, which can be used to bring up the workload management Tez AMs.
2. Change cluster configs via Ambari to enable the feature in Hive.
3. Create and Activate a resource plan.

### Create a new yarn queue suitable for Workload Management feature.
Create a new yarn queue called `wm` with the help of following [guide](../hdinsight-troubleshoot-yarn.md).
Configure the `wm` queue on cluster based on following configurations:

| QueueName   | Capacity | Max Capacity | Priority | Maximum AM Resource |
|-------------|----------|--------------|----------|---------------------|
| `default` | 5%       | 5%           | 0        | 33%                 |
| `llap`   | 85%      | 100%         | 10       | 33%                 |
| `wm`      | 10%      | 15%          | 9        | 100%                |

Confirm if the `wm` queue configuration looks as shown below.
![`wm-queue`](./media/hive-workload-management/wm-yarn-queue.png)

### Enable Workload Management feature in Hive Configs
Add the following property to Custom hiveserver2-interactive-site and set its value to the name of newly create yarn queue that is, `wm`. Restart Interactive HiveServer for configuration changes to take place.
```
hive.server2.tez.interactive.queue=wm
```

### Create Resource Plan
Following is an example on how to create a basic resource plan.
![Resource Plan](./media/hive-workload-management/WLM-ResourcePlan.jpg "Basic Resource Plan")

Execute following commands via beeline to create the above resource plan.

#### Commands to create, view, and drop the resource plan
```
# CREATE RESOURCE PLAN
CREATE RESOURCE PLAN demo_plan;

# CREATE POOLS
ALTER POOL demo_plan.default SET ALLOC_FRACTION = 0.65, QUERY_PARALLELISM = 2;
CREATE POOL demo_plan.etl WITH ALLOC_FRACTION = 0.20, QUERY_PARALLELISM = 2;
CREATE POOL demo_plan.sys_accounts WITH ALLOC_FRACTION = 0.15, QUERY_PARALLELISM = 1;

# CREATE MAPPING
CREATE USER MAPPING 'hive' IN demo_plan TO sys_accounts WITH ORDER 1;
 
# CREATE TRIGGERS
CREATE TRIGGER demo_plan.defaultToETL WHEN  ELAPSED_TIME > 20000 DO MOVE TO etl;
ALTER TRIGGER demo_plan.defaultToETL ADD TO POOL default;
CREATE TRIGGER demo_plan.ETLKill  WHEN ELAPSED_TIME > 40000 DO KILL;
ALTER TRIGGER demo_plan.ETLKill ADD TO POOL etl;

# VALIDATE PLAN
ALTER RESOURCE PLAN demo_plan VALIDATE;

# ENABLE PLAN
ALTER RESOURCE PLAN demo_plan ENABLE;

#  ACTIVATE PLAN
ALTER RESOURCE PLAN demo_plan ACTIVATE;

# SHOW RESOURCE PLAN
SHOW RESOURCE PLANS;
SHOW RESOURCE PLAN demo_plan;
```

## Understanding Resource Plan
To have an optimal resource plan, one needs to have a thorough understanding of the workload requirements.

### Number of Pools
The number of pools is limited by total query parallelism (Minimum one query per pool).
Most of the workloads rarely require more than three pools. 
- default, for interactive queries 
- etl/batch, for long running queries
- sys, for system administrators

### Total QUERY_PARALLELISM

Let's assume `wm` queue is defined with capacity as **x%** and cluster's total capacity is **y GBs**
Then number of max queries that can be supported is obtained with following formula
```
Assuming tez container size as 4 GB and
number of total concurrent queries(Tez AMs) = N
N = Math.floor(x/100 * y/4)
```
A D14v2 node comes with 112 GB out of which 100 GB can be used for yarn applications. For a cluster with 4 D14v2 worker nodes, **y = 400**. 
If `wm` queue size is set to 10%, **x = 10**.
Based on above values, we can have `Total QUERY_PARALLELISM` as 10.

> [!IMPORTANT]
> Note: Have a slightly more capacity in wm queue than required to avoid tez AMs getting stuck in accepted state that is, `wm` queue capacity can be made to 10.01% and `default` queue capacity can be reduced to 4.99%.

### Mappings
Mappings provide a mechanism to direct queries to certain pools. As number of mappings increase, multiple rules may apply for a given query. To establish which rule should take precedence:
1. If ordering is not specified (or is equal), `user` rules > `application` rules > `group` rules. The order of group rules with the same priority is undefined.
2. If ordering is specified with the optional `WITH ORDER` clause, lower-order rule takes priority.


## Important Notes
1. Tez AMs from `wm` queue will be used for scheduling queries when a resource plan is active. Tez AMs will remain available in `llap` queue to support smooth transitions between active and disabled state.
2. Enabling WLM resource plan launches number of Tez AMs equal to total `QUERY_PARALLELISM` configured for the given resource plan. `wm` queue size should be tuned to avoid these Tez AM getting stuck in ACCEPTED state.
3. We only support the use of following two counters for use in resource plans:
    1. EXECUTION_TIME
    2. ELAPSED_TIME

## Related Topics
* [Hive Workload Management Commands Summary](workload-management-commands.md)
* [Troubleshoot Hive Workload Management Issues](troubleshoot-workload-management-issues.md)


## References
* [Cloudera Hive Workload Management Overview](https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.1.5/hive-workload/content/hive_workload_management.html)
* [Cloudera Hive Workload Management Commands Summary](https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.1.5/hive-workload-commands/content/hive_workload_management_command_summary.html)
* [Cloudera Hive Workload Management Trigger Counters](https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.1.5/hive-workload-commands/content/hive_workload_trigger_counters.html)

