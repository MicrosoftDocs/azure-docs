---
title: Workload isolation
description: Guidance for setting workload isolation with workload groups in Azure Synapse Analytics.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: sngun
ms.date: 11/16/2021
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom: azure-synapse
---

# Azure Synapse Analytics workload group isolation

This article explains how workload groups can be used to configure workload isolation, contain resources, and apply runtime rules for query execution.

## Workload groups

Workload groups are containers for a set of requests and are the basis for how workload management, including workload isolation, is configured on a system.  Workload groups are created using the [CREATE WORKLOAD GROUP](/sql/t-sql/statements/create-workload-group-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) syntax.  A simple workload management configuration can manage data loads and user queries.  For example, a workload group named `wgDataLoads` will define workload aspects for data being loaded into the system. Also, a workload group named `wgUserQueries` will define workload aspects for users running queries to read data from the system.

The following sections will highlight how workload groups provide the ability to define isolation, containment, request resource definition, and adhere to execution rules.

## Resource governance

Workload groups govern memory and CPU resources.  Disk and network IO as well as tempdb are not governed.  Resource governance for memory and CPU is as follows:

Memory is governed at the request level and held throughout the duration of the request.  See [Resources per request definition](#resources-per-request-definition) for further details on how to configure the amount of memory per request.  The MIN_PERCENTAGE_RESOURCE parameter for the workload group dedicates memory to that workload group exclusively.  The CAP_PERCENTAGE_RESOURCE parameter for the workload group is a hard limit on the memory a workload group can consume.

CPU resources are governed at the workload group level and shared by all requests within a workload group.  CPU resources are fluid compared to memory which is dedicated to a request for the duration of execution.  Given CPU is a fluid resource, unused CPU resources can be consumed by all workload groups.  This means that CPU utilization can exceed the CAP_PERCENTAGE_RESOURCE parameter for the workload group.  This also means that the MIN_PERCENTAGE_RESOURCE parameter for the workload group is not a hard reservation like memory is.  When CPU resources are under contention, utilization will align to the CAP_PERCENTAGE_RESOURCE definition for workload groups.


## Workload isolation

Workload isolation means resources are reserved, exclusively, for a workload group.  Workload isolation is achieved by configuring the MIN_PERCENTAGE_RESOURCE parameter to greater than zero in the [CREATE WORKLOAD GROUP](/sql/t-sql/statements/create-workload-group-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) syntax.  For continuous execution workloads that need to adhere to tight SLAs, isolation ensures resources are always available for the workload group.

Configuring workload isolation implicitly defines a guaranteed level of concurrency. For example, a workload group with a MIN_PERCENTAGE_RESOURCE set to 30% and REQUEST_MIN_RESOURCE_GRANT_PERCENT set to 2% is guaranteed 15 concurrency.  The level of concurrency is guaranteed because 15-2% slots of resources are reserved within the workload group at all times (regardless of how REQUEST_*MAX*_RESOURCE_GRANT_PERCENT is configured).  If REQUEST_MAX_RESOURCE_GRANT_PERCENT is greater than REQUEST_MIN_RESOURCE_GRANT_PERCENT and CAP_PERCENTAGE_RESOURCE is greater than MIN_PERCENTAGE_RESOURCE additional resources can be added per request (based on resource availability).  If REQUEST_MAX_RESOURCE_GRANT_PERCENT and REQUEST_MIN_RESOURCE_GRANT_PERCENT are equal and CAP_PERCENTAGE_RESOURCE is greater than MIN_PERCENTAGE_RESOURCE, additional concurrency is possible.  Consider the below method for determining guaranteed concurrency:

[Guaranteed Concurrency] = [`MIN_PERCENTAGE_RESOURCE`] / [`REQUEST_MIN_RESOURCE_GRANT_PERCENT`]

> [!NOTE]
> There are specific service level minimum values for min_percentage_resource.  For more information, see [Effective Values](/sql/t-sql/statements/create-workload-group-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json?view=azure-sqldw-latest&preserve-view=true#effective-values) for further details.

In the absence of workload isolation, requests operate in the [shared pool](#shared-pool-resources) of resources.  Access to resources in the shared pool is not guaranteed and is assigned on an [importance](sql-data-warehouse-workload-importance.md) basis.

Configuring workload isolation should be done with caution as the resources are allocated to the workload group even if there are no active requests in the workload group. Over-configuring isolation can lead to diminished overall system utilization.

Users should avoid a workload management solution that configures 100% workload isolation: 100% isolation is achieved when the sum of min_percentage_resource configured across all workload groups equals 100%.  This type of configuration is overly restrictive and rigid, leaving little room for resource requests that are accidentally mis-classified. There is a provision to allow one request to execute from workload groups not configured for isolation. The resources allocated to this request will show up as a zero in the systems DMVs and borrow a smallrc level of resource grant from system reserved resources.

> [!NOTE]
> To ensure optimal resource utilization, consider a workload management solution that leverages some isolation to ensure SLAs are met and mixed with shared resources that are accessed based on [workload importance](sql-data-warehouse-workload-importance.md).

## Workload containment

Workload containment refers to limiting the amount of resources a workload group can consume.  Workload containment is achieved by configuring the CAP_PERCENTAGE_RESOURCE parameter to less than 100 in the [CREATE WORKLOAD GROUP](/sql/t-sql/statements/create-workload-group-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true)  syntax.  Consider the scenario whereby users need read access to the system so they can run a what-if analysis via ad-hoc queries.  These types of requests could have a negative impact on other workloads that are running on the system.  Configuring containment ensures the amount of resources is limited.

Configuring workload containment implicitly defines a maximum level of concurrency.  With a CAP_PERCENTAGE_RESOURCE set to 60% and a REQUEST_MIN_RESOURCE_GRANT_PERCENT set to 1%, up to a 60-concurrency level is allowed for the workload group.  Consider the method included below for determining the maximum concurrency:

[Max Concurrency] = [`CAP_PERCENTAGE_RESOURCE`] / [`REQUEST_MIN_RESOURCE_GRANT_PERCENT`]

> [!NOTE]
> The effective CAP_PERCENTAGE_RESOURCE of a workload group will not reach 100% when workload groups with MIN_PERCENTAGE_RESOURCE at a level greater than zero are created.  See [sys.dm_workload_management_workload_groups_stats](/sql/relational-databases/system-dynamic-management-views/sys-dm-workload-management-workload-group-stats-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) for effective runtime values.

## Resources per request definition

Workload groups provide a mechanism to define the min and max amount of resources that are allocated per request with the REQUEST_MIN_RESOURCE_GRANT_PERCENT and REQUEST_MAX_RESOURCE_GRANT_PERCENT parameters in the [CREATE WORKLOAD GROUP](/sql/t-sql/statements/create-workload-group-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) syntax.  Resource in this case is memory. CPU resource governance is covered in the [Resource governance](#resource-governance) section.

> [!NOTE]
> REQUEST_MAX_RESOURCE_GRANT_PERCENT is an optional parameter that defaults to the same value that is specified for REQUEST_MIN_RESOURCE_GRANT_PERCENT.

Like choosing a resource class, configuring REQUEST_MIN_RESOURCE_GRANT_PERCENT sets the value for the resources utilized by a request.  The amount of resources indicated by the set value is guaranteed for allocation to the request before it begins execution.  For customers migrating from resource classes to workload groups, consider following the [How To](sql-data-warehouse-how-to-convert-resource-classes-workload-groups.md) article to map from resources classes to workload groups as a starting point.

Configuring REQUEST_MAX_RESOURCE_GRANT_PERCENT to a value greater than REQUEST_MIN_RESOURCE_GRANT_PERCENT allows the system to allocate more resources per request.  While scheduling a request, system determines actual resource allocation  to the request, which is between REQUEST_MIN_RESOURCE_GRANT_PERCENT and REQUEST_MAX_RESOURCE_GRANT_PERCENT, based on resource availability in shared pool and current load on the system.  The resources must exist in the [shared pool](#shared-pool-resources) of resources when the query is scheduled.  

> [!NOTE]
> REQUEST_MIN_RESOURCE_GRANT_PERCENT and REQUEST_MAX_RESOURCE_GRANT_PERCENT have effective values that are dependent on the effective MIN_PERCENTAGE_RESOURCE and CAP_PERCENTAGE_RESOURCE values.  See [sys.dm_workload_management_workload_groups_stats](/sql/relational-databases/system-dynamic-management-views/sys-dm-workload-management-workload-group-stats-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) for effective runtime values.

## Execution Rules

On ad-hoc reporting systems, customers can accidentally execute runaway queries that severely impact the productivity of others.  System admins are forced to spend time killing runaway queries to free up system resources.  Workload groups offer the ability to configure a query execution timeout rule to cancel queries that have exceeded the specified value.  The rule is configured by setting the QUERY_EXECUTION_TIMEOUT_SEC parameter in the [CREATE WORKLOAD GROUP](/sql/t-sql/statements/create-workload-group-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) syntax.

## Shared pool resources

Shared pool resources are the resources not configured for isolation.  Workload groups with a MIN_PERCENTAGE_RESOURCE set to zero leverage resources in the shared pool to execute requests.  Workload groups with a CAP_PERCENTAGE_RESOURCE greater than MIN_PERCENTAGE_RESOURCE also used shared resources.  The amount of resources available in the shared pool is calculated as follows.

[Shared Pool] = 100 - [sum of `MIN_PERCENTAGE_RESOURCE` across all workload groups]

Access to resources in the shared pool is allocated on an [importance](sql-data-warehouse-workload-importance.md) basis.  Requests with the same importance level will access shared pool resources on a first in/first out basis.

## Next steps

- [Quickstart: configure workload isolation](quickstart-configure-workload-isolation-tsql.md)
- [CREATE WORKLOAD GROUP](/sql/t-sql/statements/create-workload-group-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true)
- [Convert resource classes to workload groups](sql-data-warehouse-how-to-convert-resource-classes-workload-groups.md).
- [Workload Management Portal Monitoring](sql-data-warehouse-workload-management-portal-monitor.md).  
