---
title: Workload management
description: Guidance for implementing workload management in Azure Synapse Analytics.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: sngun
ms.date: 02/04/2020
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom: azure-synapse
---

# What is workload management?

Running mixed workloads can pose resource challenges on busy systems.  Solution Architects seek ways to separate classic data warehousing activities (such as loading, transforming, and querying data) to ensure that enough resources exist to hit SLAs.  

Physical server isolation can lead to pockets of infrastructure that are underutilized, overbooked or in a state where caches are constantly being primed with hardware starting and stopping.  A successful workload management scheme effectively manages resources, ensures highly efficient resource utilization, and maximizes return on investment (ROI).

A data warehouse workload refers to all operations that transpire in relation to a data warehouse. The depth and breadth of these components depend on the maturity level of the data warehouse.  The data warehouse workload encompasses:

- The entire process of loading data into the warehouse
- Performing data warehouse analysis and reporting
- Managing data in the data warehouse
- Exporting data from the data warehouse

The performance capacity of a data warehouse is determined by the [data warehouse units](what-is-a-data-warehouse-unit-dwu-cdwu.md).

- To view the resources allocated for all the performance profiles, see [Memory and concurrency limits](memory-concurrency-limits.md).
- To adjust capacity, you can [scale up or down](quickstart-scale-compute-portal.md).

## Workload management concepts

In the past, for Synapse SQL in Azure Synapse you managed the query performance through [resource classes](resource-classes-for-workload-management.md).  Resource classes allowed for assigning memory to a query based on role membership.  The primary challenge with resources classes is that, once configured, there was no governance or ability to control the workload.  

For example, granting an ad-hoc user role membership to smallrc allowed that user to consume 100% of the memory on the system.  With resource classes, there is no way to reserve and ensure resources are available for critical workloads.

Dedicated SQL pool workload management in Azure Synapse consists of three high-level concepts: [Workload Classification](sql-data-warehouse-workload-classification.md), [Workload Importance](sql-data-warehouse-workload-importance.md), and [Workload Isolation](sql-data-warehouse-workload-isolation.md).  These capabilities give you more control over how your workload utilizes system resources.

Workload classification is the concept of assigning a request to a workload group and setting importance levels.  Historically, this assignment was done via role membership using [sp_addrolemember](resource-classes-for-workload-management.md#change-a-users-resource-class).  This action can now be done via the [CREATE WORKLOAD CLASSIFER](/sql/t-sql/statements/create-workload-classifier-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true).  The classification capability provides a richer set of options such as label, session, and time to classify requests.

Workload importance influences the order in which a request gets access to resources.  On a busy system, a request with higher importance has first access to resources.  Importance can also ensure ordered access to locks.

Workload isolation reserves resources for a workload group.  Resources reserved in a workload group are held exclusively for that workload group to ensure execution.  Workload groups also allow you to define the amount of resources that are assigned per request, much like resource classes do.  Workload groups give you the ability to reserve or cap the amount of resources a set of requests can consume.  Finally, workload groups are a mechanism to apply rules, such as query timeout, to requests.  

## Next steps

- For more information about workload classification, see [Workload Classification](sql-data-warehouse-workload-classification.md).  
- For more information about workload isolation, see [Workload Isolation](sql-data-warehouse-workload-isolation.md).  
- For more information about workload importance, see [Workload Importance](sql-data-warehouse-workload-importance.md).  
- For more information about workload management monitoring, see [Workload Management Portal Monitoring](sql-data-warehouse-workload-management-portal-monitor.md).  
