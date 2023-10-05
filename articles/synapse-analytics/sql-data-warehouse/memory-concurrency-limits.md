---
title: Memory and concurrency limits
description: View the memory and concurrency limits allocated to the various performance levels and resource classes for dedicated SQL pool in Azure Synapse Analytics.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: sngun
ms.date: 04/04/2021
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom: azure-synapse
---


# Memory and concurrency limits for dedicated SQL pool in Azure Synapse Analytics

View the memory and concurrency limits allocated to the various performance levels and resource classes in Azure Synapse Analytics.  

> [!NOTE]
> Workload management workload groups provide more flexibility for configuring resources per request and concurrency than dynamic or static resource classes.  See [Workload Groups](sql-data-warehouse-workload-isolation.md) and the [CREATE WORKLOAD GROUP](/sql/t-sql/statements/create-workload-group-transact-sql) syntax for further details.

## Data warehouse capacity settings

The following tables show the maximum capacity for the data warehouse at different performance levels. To change the performance level, see [Scale compute - portal](quickstart-scale-compute-portal.md).

### Service Levels

The service levels range from DW100c to DW30000c.

| Performance level | Compute nodes | Distributions per Compute node | Memory per data warehouse (GB) |
|:-----------------:|:-------------:|:------------------------------:|:------------------------------:|
| DW100c            | 1             | 60                             |    60                          |
| DW200c            | 1             | 60                             |   120                          |
| DW300c            | 1             | 60                             |   180                          |
| DW400c            | 1             | 60                             |   240                          |
| DW500c            | 1             | 60                             |   300                          |
| DW1000c           | 2             | 30                             |   600                          |
| DW1500c           | 3             | 20                             |   900                          |
| DW2000c           | 4             | 15                             |  1200                          |
| DW2500c           | 5             | 12                             |  1500                          |
| DW3000c           | 6             | 10                             |  1800                          |
| DW5000c           | 10            | 6                              |  3000                          |
| DW6000c           | 12            | 5                              |  3600                          |
| DW7500c           | 15            | 4                              |  4500                          |
| DW10000c          | 20            | 3                              |  6000                          |
| DW15000c          | 30            | 2                              |  9000                          |
| DW30000c          | 60            | 1                              | 18000                          |

The maximum service level is DW30000c, which has 60 Compute nodes and one distribution per Compute node. For example, a 600 TB data warehouse at DW30000c processes approximately 10 TB per Compute node.

> [!NOTE]
> Synapse Dedicated SQL pool is an evergreen platform service. Under [shared responsibility model in the cloud](../../security/fundamentals/shared-responsibility.md#division-of-responsibility), Microsoft continues to invest in advancements to underlying software and hardware which host dedicated SQL pool. As a result, the number of nodes or the type of computer hardware which underpins a given performance level (SLO) may change. The number of compute nodes listed here are provided as a reference, and shouldn't be used for sizing or performance purposes. Irrespective of number of nodes or underlying infrastructure, Microsoft's goal is to deliver performance in accordance with SLO; hence, we recommend that all sizing exercises must use cDWU as a guide. For more information on SLO and compute Data Warehouse Units, see [Data Warehouse Units (DWUs) for dedicated SQL pool (formerly SQL DW)](what-is-a-data-warehouse-unit-dwu-cdwu.md#service-level-objective).

## Concurrency maximums for workload groups

With the introduction of [workload groups](sql-data-warehouse-workload-isolation.md), the concept of concurrency slots no longer applies.  Resources per request are allocated on a percentage basis and specified in the workload group definition.  However, even with the removal of concurrency slots, there are minimum amounts of resources needed per queries based on the service level.  The below table defined the minimum amount of resources needed per query across service levels and the associated concurrency that can be achieved.

|Service Level|Maximum concurrent queries|Min % supported for REQUEST_MIN_RESOURCE_GRANT_PERCENT|
|---|---|---|
|DW100c|4|25%|
|DW200c|8|12.5%|
|DW300c|12|8%|
|DW400c|16|6.25%|
|DW500c|20|5%|
|DW1000c|32|3%|
|DW1500c|32|3%|
|DW2000c|48|2%|
|DW2500c|48|2%|
|DW3000c|64|1.5%|
|DW5000c|64|1.5%|
|DW6000c|128|0.75%|
|DW7500c|128|0.75%|
|DW10000c|128|0.75%|
|DW15000c|128|0.75%|
|DW30000c|128|0.75%|
||||

## Concurrency maximums for resource classes

To ensure each query has enough resources to execute efficiently, Synapse SQL tracks resource utilization by assigning concurrency slots to each query. The system puts queries into a queue based on importance and concurrency slots. Queries wait in the queue until enough concurrency slots are available. [Importance](sql-data-warehouse-workload-importance.md) and concurrency slots determine CPU prioritization. For more information, see [Analyze your workload](analyze-your-workload.md)

**Static resource classes**

The following table shows the maximum concurrent queries and concurrency slots for each [static resource class](resource-classes-for-workload-management.md).  

| Service Level | Maximum concurrent queries | Concurrency slots available | Slots used by staticrc10 | Slots used by staticrc20 | Slots used by staticrc30 | Slots used by staticrc40 | Slots used by staticrc50 | Slots used by staticrc60 | Slots used by staticrc70 | Slots used by staticrc80 |
|:-------------:|:--------------------------:|:---------------------------:|:---------:|:----------:|:----------:|:----------:|:----------:|:----------:|:----------:|:----------:|
| DW100c        |  4                         |    4                        | 1         | 2          | 4          | 4          | 4         |  4         |  4         |  4         |
| DW200c        |  8                         |    8                        | 1         | 2          | 4          | 8          |  8         |  8         |  8         |  8        |
| DW300c        | 12                         |   12                        | 1         | 2          | 4          | 8          |  8         |  8         |  8         |   8        |
| DW400c        | 16                         |   16                        | 1         | 2          | 4          | 8          | 16         | 16         | 16         |  16        |
| DW500c        | 20                         |   20                        | 1         | 2          | 4          | 8          | 16         | 16         | 16         |  16        |
| DW1000c       | 32                         |   40                        | 1         | 2          | 4          | 8          | 16         | 32         | 32         |  32        |
| DW1500c       | 32                         |   60                        | 1         | 2          | 4          | 8          | 16         | 32         | 32         |  32        |
| DW2000c       | 48                         |   80                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         |  64        |
| DW2500c       | 48                         |  100                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         |  64        |
| DW3000c       | 64                         |  120                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         |  64        |
| DW5000c       | 64                         |  200                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         | 128        |
| DW6000c       | 128                        |  240                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         | 128        |
| DW7500c       | 128                        |  300                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         | 128        |
| DW10000c      | 128                        |  400                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         | 128        |
| DW15000c      | 128                        |  600                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         | 128        |
| DW30000c      | 128                        | 1200                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         | 128        |

**Dynamic resource classes**

The following table shows the maximum concurrent queries and concurrency slots for each [dynamic resource class](resource-classes-for-workload-management.md). Dynamic resource classes use a 3-10-22-70 memory percentage allocation for small-medium-large-xlarge resource classes across all service levels.

| Service Level | Maximum concurrent queries | Concurrency slots available | Slots used by smallrc | Slots used by mediumrc | Slots used by largerc | Slots used by xlargerc |
|:-------------:|:--------------------------:|:---------------------------:|:---------------------:|:----------------------:|:---------------------:|:----------------------:|
| DW100c        |  4                         |    4                        | 1                     |  1                     |  1                    |   2                    |
| DW200c        |  8                         |    8                        | 1                     |  1                     |  1                    |   5                    |
| DW300c        | 12                         |   12                        | 1                     |  1                     |  2                    |   8                    |
| DW400c        | 16                         |   16                        | 1                     |  1                     |  3                    |  11                    |
| DW500c        | 20                         |   20                        | 1                     |  2                     |  4                    |  14                    |
| DW1000c       | 32                         |   40                        | 1                     |  4                     |  8                    |  28                    |
| DW1500c       | 32                         |   60                        | 1                     |  6                     |  13                   |  42                    |
| DW2000c       | 32                         |   80                        | 2                     |  8                     |  17                   |  56                    |
| DW2500c       | 32                         |  100                        | 3                     | 10                     |  22                   |  70                    |
| DW3000c       | 32                         |  120                        | 3                     | 12                     |  26                   |  84                    |
| DW5000c       | 32                         |  200                        | 6                     | 20                     |  44                   | 140                    |
| DW6000c       | 32                         |  240                        | 7                     | 24                     |  52                   | 168                    |
| DW7500c       | 32                         |  300                        | 9                     | 30                     |  66                   | 210                    |
| DW10000c      | 32                         |  400                        | 12                    | 40                     |  88                   | 280                    |
| DW15000c      | 32                         |  600                        | 18                    | 60                     | 132                   | 420                    |
| DW30000c      | 32                         | 1200                        | 36                    | 120                    | 264                   | 840                    |

When there are not enough concurrency slots free to start query execution, queries are queued and executed based on importance.  If there is equivalent importance, queries are executed on a first-in, first-out basis.  As a queries finishes and the number of queries and slots fall below the limits, Azure Synapse Analytics releases queued queries.

## Next steps

To learn more about how to leverage resource classes to optimize your workload further please review the following articles:

* [Workload management workload groups](sql-data-warehouse-workload-isolation.md)
* [CREATE WORKLOAD GROUP](/sql/t-sql/statements/create-workload-group-transact-sql)
* [Resource classes for workload management](resource-classes-for-workload-management.md)
* [Analyzing your workload](analyze-your-workload.md)
