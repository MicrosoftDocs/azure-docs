---
title: Azure SQL Data Warehouse performance tiers | Microsoft Docs
description: Introduction to the new performance tiers available in Azure SQL Data Warehouse.
services: sql-data-warehouse
documentationcenter: NA
author: jrowlandjones
manager: jhubbard
editor: ''

ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: performance
ms.date: 09/26/2017
ms.author: jrj;barbkess

---
# Azure SQL Data Warehouse performance tiers
SQL Data Warehouse offers two performance tiers that have been optimized to suit analytical workloads. This article explains the concepts of performance tiers to help you make the right decision when choosing for your workload. 

## What is a performance tier?
A performance tier is an option chosen during the provisioning process which dictates how your data warehouse is configured. This option is one of the first choices you make when creating a data warehouse.  

- The Optimized for Elasticity performance tier separates the compute and storage layers in the architecture. This option excels when supporting workloads that take full advantage of this separation to scale throughout the day or to support short periods of peak activity. This compute tier has the lowest entry price point and scales to support the majority of customer workloads.

- The Optimized for Compute performance tier uses the latest Azure hardware to introduce a new NVMe Solid State Disk cache that keeps the most frequently accessed data close to the CPUs; which is exactly where you want it. By automatically tiering the storage in this way this performance tier excels with complex queries as all IO is kept local to the compute layer. Furthermore, the columnstore has been further enhanced to enable you to store an unlimited amount of data in your SQL Data Warehouse. The optimized for compute performance tier provides the greatest level of scalability enabling you to scale all the way up to 30,000 compute Data Warehouse Units (cDWU). Choose this tier for workloads that requires continuous, blazing fast, performance.

## Service Level Objectives for performance tiers
The Service Level Objective (SLO) is the scalability setting that determines the cost and performance level of your data warehouse. The SLO for the optimized for compute performance tier scale is measured in compute data warehouse units (cDWUs). The Service Level name uses a 'c' suffix to differentiate it from the optimized for elasticity performance tier, for example, DW2000c. The elasticity-optimized service levels are measured in DWUs, for example DW2000. For more information, see [What is a data warehouse unit?](what-is-a-data-warehouse-unit-dwu-cdwu.md).

In T-SQL the SLO chosen also determines which performance tier you will be using:

```sql
--Optimized for Elasticity
CREATE DATABASE myElasticSQLDW
WITH
(    SERVICE_OBJECTIVE = 'DW1000'
)
;

--Optimized for Compute
CREATE DATABASE myComputeSQLDW
WITH
(    SERVICE_OBJECTIVE = 'DW1000c'
)
;
```

## Memory maximums
The two performance tiers also have a different memory profile. This translates into a different amount of memory per query. 
The optimized for compute performance tier provides 2.5x more memory per query when compared with elastic performance tier. This helps the compute performance tier deliver its blazing fast performance and means you can also run more queries concurrently by using lower [resource classes]. 

### Optimized for Elasticity

The service levels for the "Optimized for Elasticity" performance tier range from DW100 to DW6000. 

| Service Level | Max concurrent queries | Compute nodes | Distributions per compute node | Max memory per distribution (MB) | Max memory per data warehouse (GB) |
|:-------------:|:----------------------:|:-------------:|:------------------------------:|:--------------------------------:|:----------------------------------:|
| DW100         | 4                      | 1             | 60                             | 400                              |  24                                |
| DW200         | 8                      | 2             | 30                             | 800                              |  48                                |
| DW300         | 12                     | 3             | 20                             | 1,200                            |  72                                |
| DW400         | 16                     | 4             | 15                             | 1,600                            |  96                                |
| DW500         | 20                     | 5             | 12                             | 2,000                            | 120                                |
| DW600         | 24                     | 6             | 10                             | 2,400                            | 144                                |
| DW1000        | 32                     | 10            | 6                              | 4,000                            | 240                                |
| DW1200        | 32                     | 12            | 5                              | 4,800                            | 288                                |
| DW1500        | 32                     | 15            | 4                              | 6,000                            | 360                                |
| DW2000        | 48                     | 20            | 3                              | 8,000                            | 480                                |
| DW3000        | 64                     | 30            | 2                              | 12,000                           | 720                                |
| DW6000        | 128                    | 60            | 1                              | 24,000                           | 1440                               |

### Optimized for Compute

The service levels for the "Optimized for Compute" performance tier range from DW1000c to DW30000c. 

| Service Level | Max concurrent queries | Compute nodes | Distributions per compute node | Max memory per distribution (GB) | Max memory per data warehouse (GB) |
|:-------------:|:----------------------:|:-------------:|:------------------------------:|:--------------------------------:|:----------------------------------:|
| DW1000c       | 32                     | 2             | 30                             |  10                              |   600                              |
| DW1500c       | 32                     | 3             | 20                             |  15                              |   900                              |
| DW2000c       | 32                     | 4             | 15                             |  20                              |  1200                              |
| DW2500c       | 32                     | 5             | 12                             |  25                              |  1500                              |
| DW3000c       | 32                     | 6             | 10                             |  30                              |  1800                              |
| DW5000c       | 32                     | 10            | 6                              |  50                              |  3000                              |
| DW6000c       | 32                     | 12            | 5                              |  60                              |  3600                              |
| DW7500c       | 32                     | 15            | 4                              |  75                              |  4500                              |
| DW10000c      | 32                     | 20            | 3                              | 100                              |  6000                              |
| DW15000c      | 32                     | 30            | 2                              | 150                              |  9000                              |
| DW30000c      | 32                     | 60            | 1                              | 300                              | 18000                              |

The maximum cDWU is DW30000c, which has 60 Compute nodes and one distribution per Compute node. For example, a 600 TB data warehouse at DW30000c processes approximately 10 TB per Compute node.

## Workload optimization
SQL Data Warehouse provides supports industry leading concurrency from a single data warehouse instance. To ensure each query has enough resource to execute efficiently the system has built in workload optimization functionality that you can tailor to meet your requirements. 

The system optimizes your utilisation in the following ways:

- Channels queries into a queue based on priority and time of submission
- Tracks compute resource utilization by assigning concurrency slots to each query


### Concurrency slots

Concurrency slots are an easy way to track the resources available for query execution. They are like tickets that you purchase to reserve seats at a concert because seating is limited. Similarly, SQL Data Warehouse has a finite number of compute resources. Queries reserve compute resources by acquiring concurrency slots. A query cannot execute until enough concurrency slots are available. 

Only some queries require concurrency slots. System queries and some trivial queries do not consume any slots. However, by default, resource governed queries i.e. those that take one or more slots take only one slot in order to execute. More complex queries can require additional concurrency slots. 

Before a query can start executing, it must be able to reserve enough concurrency slots. When a query finishes, it releases its concurrency slots.  

* The optimized for elasticity performance tier scales to 240 concurrency slots.
* The optimized for compute performance tier scales to 1200 concurrency slots.

Each query will consume zero, one or more concurrency slots. For example, a query that is assigned 10 concurrency slots has access to 5 five times more compute resources than a query running with 2 concurrency slots. Similarly, if each query requires 10 concurrency slots and there are 40 concurrency slots then 4 queries will run concurrently.

The following table shows the maximum concurrent queries and concurrency slots at the various service levels.

### Optimized for Elasticity

| Service Level | Maximum concurrent queries | Maximum concurrency slots |
|:-------------:|:--------------------------:|:-------------------------:|
| DW100         | 4                          |   4                       |
| DW200         | 8                          |   8                       |
| DW300         | 12                         |  12                       |
| DW400         | 16                         |  16                       |
| DW500         | 20                         |  20                       |
| DW600         | 24                         |  24                       |
| DW1000        | 32                         |  40                       |
| DW1200        | 32                         |  48                       |
| DW1500        | 32                         |  60                       |
| DW2000        | 48                         |  80                       |
| DW3000        | 64                         | 120                       |
| DW6000        | 128                        | 240                       |

### Optimized for Compute

| Service Level | Maximum concurrent queries | Maximum concurrency slots   |
|:-------------:|:--------------------------:|:---------------------------:|
| DW1000c       | 32                         |   40                        |
| DW1500c       | 32                         |   60                        |
| DW2000c       | 32                         |   80                        |
| DW2500c       | 32                         |  100                        |
| DW3000c       | 32                         |  120                        |
| DW5000c       | 32                         |  200                        |
| DW6000c       | 32                         |  240                        |
| DW7500c       | 32                         |  300                        |
| DW10000c      | 32                         |  400                        |
| DW15000c      | 32                         |  600                        |
| DW30000c      | 32                         | 1200                        |

When one of these thresholds is met, new queries are queued and executed on a first-in, first-out basis.  As a queries finishes and the number of queries and slots falls below the limits, SQL Data Warehouse releases queued queries. 

## Concurrency slot consumption  
Resource governed queries consume concurrency slots. The exact number of concurrency slots consumed is dependent upon the resource class that is assigned to the query.

The following tables consolidates all of the previous concepts in a single view that shows the number of concurrency slots available by DWU and the slots consumed by each resource class.  

> [!NOTE]  
> SELECT statements on dynamic management views (DMVs) or other system views are not governed by any of the concurrency limits. You can monitor the system regardless of the number of queries executing on it.
> 
> 

### Optimized for compute performance tier concurrency slot consumption

**Dynamic resource classes**
| Service Level | Maximum concurrent queries | Concurrency slots available | Slots used by smallrc | Slots used by mediumrc | Slots used by largerc | Slots used by xlargerc |
|:-------------:|:--------------------------:|:---------------------------:|:---------------------:|:----------------------:|:---------------------:|:----------------------:|
| DW1000c       | 32                         |   40                        | 1                     |  8                     |  16                   |  32                    |
| DW1500c       | 32                         |   60                        | 1                     |  8                     |  16                   |  32                    |
| DW2000c       | 32                         |   80                        | 1                     | 16                     |  32                   |  64                    |
| DW2500c       | 32                         |  100                        | 1                     | 16                     |  32                   |  64                    |
| DW3000c       | 32                         |  120                        | 1                     | 16                     |  32                   |  64                    |
| DW5000c       | 32                         |  200                        | 1                     | 32                     |  64                   | 128                    |
| DW6000c       | 32                         |  240                        | 1                     | 32                     |  64                   | 128                    |
| DW7500c       | 32                         |  300                        | 1                     | 64                     | 128                   | 128                    |
| DW10000c      | 32                         |  400                        | 1                     | 64                     | 128                   | 256                    |
| DW15000c      | 32                         |  600                        | 1                     | 64                     | 128                   | 256                    |
| DW30000c      | 32                         | 1200                        | 1                     | 64                     | 128                   | 256                    |

**Static resource classes**

| Service Level | Maximum concurrent queries | Concurrency slots available |staticrc10 | staticrc20 | staticrc30 | staticrc40 | staticrc50 | staticrc60 | staticrc70 | staticrc80 |
|:-------------:|:--------------------------:|:---------------------------:|:---------:|:----------:|:----------:|:----------:|:----------:|:----------:|:----------:|:----------:|
| DW1000c       | 32                         |   40                        | 1         | 2          | 4          | 8          | 16         | 32         | 32         |  32        |
| DW1500c       | 32                         |   60                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         |  64        |
| DW2000c       | 32                         |   80                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         |  64        |
| DW2500c       | 32                         |  100                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         |  64        |
| DW3000c       | 32                         |  120                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         | 128        |
| DW5000c       | 32                         |  200                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         | 128        |
| DW6000c       | 32                         |  240                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         | 128        |
| DW7500c       | 32                         |  300                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         | 128        |
| DW10000c      | 32                         |  400                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         | 128        |
| DW15000c      | 32                         |  600                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         | 128        |
| DW30000c      | 32                         | 1200                        | 1         | 2          | 4          | 8          | 16         | 32         | 64         | 128        |

### Optimized for compute performance tier concurrency slot consumption

**Dynamic resource classes**

| Service Level | Maximum concurrent queries | Concurrency slots available | smallrc | mediumrc | largerc | xlargerc |
|:-------------:|:--------------------------:|:---------------------------:|:-------:|:--------:|:-------:|:--------:|
| DW100         |  4                         |   4                         | 1       |  1       |  2      |   4      |
| DW200         |  8                         |   8                         | 1       |  2       |  4      |   8      |
| DW300         | 12                         |  12                         | 1       |  2       |  4      |   8      |
| DW400         | 16                         |  16                         | 1       |  4       |  8      |  16      |
| DW500         | 20                         |  20                         | 1       |  4       |  8      |  16      |
| DW600         | 24                         |  24                         | 1       |  4       |  8      |  16      |
| DW1000        | 32                         |  32                         | 1       |  8       | 16      |  32      |
| DW1200        | 32                         |  32                         | 1       |  8       | 16      |  32      |
| DW1500        | 32                         |  32                         | 1       |  8       | 16      |  32      |
| DW2000        | 32                         |  48                         | 1       | 16       | 32      |  64      |
| DW3000        | 32                         |  64                         | 1       | 16       | 32      |  64      |
| DW6000        | 32                         | 128                         | 1       | 32       | 64      | 128      |

**Static resource classes**

| Service Level | Maximum concurrent queries | Maximum concurrency slots |staticrc10 | staticrc20 | staticrc30 | staticrc40 | staticrc50 | staticrc60 | staticrc70 | staticrc80 |
|:-------------:|:--------------------------:|:-------------------------:|:---------:|:----------:|:----------:|:----------:|:----------:|:----------:|:----------:|:----------:|
| DW100         | 4                          |   4                       | 1         | 2          | 4          | 4          |  4         |  4         |  4         |   4        |
| DW200         | 8                          |   8                       | 1         | 2          | 4          | 8          |  8         |  8         |  8         |   8        |
| DW300         | 12                         |  12                       | 1         | 2          | 4          | 8          |  8         |  8         |  8         |   8        |
| DW400         | 16                         |  16                       | 1         | 2          | 4          | 8          | 16         | 16         | 16         |  16        |
| DW500         | 20                         |  20                       | 1         | 2          | 4          | 8          | 16         | 16         | 16         |  16        |
| DW600         | 24                         |  24                       | 1         | 2          | 4          | 8          | 16         | 16         | 16         |  16        |
| DW1000        | 32                         |  40                       | 1         | 2          | 4          | 8          | 16         | 32         | 32         |  32        |
| DW1200        | 32                         |  48                       | 1         | 2          | 4          | 8          | 16         | 32         | 32         |  32        |
| DW1500        | 32                         |  60                       | 1         | 2          | 4          | 8          | 16         | 32         | 32         |  32        |
| DW2000        | 32                         |  80                       | 1         | 2          | 4          | 8          | 16         | 32         | 64         |  64        |
| DW3000        | 32                         | 120                       | 1         | 2          | 4          | 8          | 16         | 32         | 64         |  64        |
| DW6000        | 32                         | 240                       | 1         | 2          | 4          | 8          | 16         | 32         | 64         | 128        |

## Next Steps

To learn more about how to leverage resource classes to optimize your workload further please review the following articles:
* [Tutorial: How to change resource classes]
* [Resource classes for workload management]
* [Analyzing your workload]

<!--Article references-->
[Tutorial: How to change resource classes]: ./change-a-users-resource-class.md
[resource classes]: ./resource-classes-for-workload-management.md
[Resource classes for workload management]: ./resource-classes-for-workload-management.md
[Analyzing your workload]: ./resource-classes-troubleshoot-workload.md
