---
title: Workload management 
description: Guidance for implementing workload management in Azure SQL Data Warehouse.
services: sql-data-warehouse
author: ronortloff
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: workload-management
ms.date: 01/13/2020
ms.author: rortloff
ms.reviewer: jrasnick
ms.custom: seo-lt-2019
---

# What is workload management?

Running mixed workloads can pose resource challenges on busy systems.  Solution Architects seek ways to separate classic data warehousing activities (such as loading, transforming and querying data) to ensure that enough resources exist to hit SLAs.  

Physical server isolation can lead to pockets of infrastructure that are underutilized, overbooked or in a state where caches are constantly being primed with hardware starting and stopping.  A successful workload management scheme effectively manages resources, ensures highly efficient resource utilization, and maximizes return on investment (ROI).

A data warehouse workload refers to all operations that transpire in relation to a data warehouse. The depth and breadth of these components depend on the maturity level of the data warehouse.  The data warehouse workload encompasses: 
- The entire process of loading data into the warehouse 
- Performing data warehouse analysis and reporting
- Managing data in the data warehouse 
- Exporting data from the data warehouse

The performance capacity of a data warehouse is determined by the [data warehouse units](what-is-a-data-warehouse-unit-dwu-cdwu.md).
- To view the resources allocated for all the performance profiles, see [Memory and concurrency limits]memory-concurrency-limits.md).
- To adjust capacity, you can [scale up or down](quickstart-scale-compute-portal.md).


## Workload management concepts
In the past, you managed the query performance on SQL Data Warehouse through [resource classes](resource-classes-for-workload-management.md).  Resource classes allowed for assigning memory to a query based on role membership.  The primary challenge with resources classes is that, once configured, there was no governance or ability to control the workload.  

For example, granting an ad-hoc user role membership to smallrc allowed that user to consume 100% of the memory on the system.  With resource classes, there is no way to reserve and ensure resources are available for critical workloads.

Workload management on SQL Data Warehouse consists of three high-level concepts: [Workload Classification](sql-data-warehouse-workload-classification.md), [Workload Importance](sql-data-warehouse-workload-importance.md) and [Workload Isolation](sql-data-warehouse-workload-isolation.md).  These capabilities give you more control over how your workload utilizes system resources.

Workload classification is the concept of assigning a request to a workload group and setting importance levels.  Historically, this assignment was done via role membership using [sp_addrolemember](https://docs.microsoft.com/azure/sql-data-warehouse/resource-classes-for-workload-management#change-a-users-resource-class).  This can now be done via the [CREATE WORKLOAD CLASSIFER](https://docs.microsoft.com/sql/t-sql/statements/create-workload-classifier-transact-sql).  The classification capability provides a richer set of options such as label, session, and time to classify requests.

Workload importance influences the order in which a request gets access to resources.  On a busy system, a request with higher importance has first access to resources.  Importance can also ensure ordered access to locks. 

Workload isolation reserves resources for a workload group.  Resources reserved in a workload group are held exclusively for that workload group to ensure execution.  Workload groups also allow you to define the amount of resources that are assigned per request, much like resource classes do.  Workload groups give you the ability to reserve or cap the amount of resources a set of requests can consume.  Finally, workload groups are a mechanism to apply rules, such as query timeout, to requests.  


## Next steps

- For more information about workload classification, see [Workload Classification](sql-data-warehouse-workload-classification.md).  
- For more information about workload isolation, see [Workload Isolation](sql-data-warehouse-workload-isolation.md).  
- For more information about workload importance, see [Workload Importance](sql-data-warehouse-workload-importance.md).  
- For more information about workload management monitoring, see [Workload Management Portal Monitoring](sql-data-warehouse-workload-management-portal-monitor.md).  