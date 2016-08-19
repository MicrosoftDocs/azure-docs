<properties
	pageTitle="Azure SQL Database Resource Limits"
	description="This page describes some common resource limits for Azure SQL Database."
	services="sql-database"
	documentationCenter="na"
	authors="CarlRabeler"
	manager="jhubbard"
	editor="monicar" />


<tags
	ms.service="sql-database"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="data-management"
	ms.date="07/19/2016"
	ms.author="carlrab" />


# Azure SQL Database resource limits

## Overview

Azure SQL Database manages the resources available to a database using two different mechanisms: **Resources Governance** and **Enforcement of Limits**. This topic explains these two main areas of resource management.

## Resource governance
One of the design goals of the Basic, Standard, and Premium service tiers is for Azure SQL Database to behave as if the database is running on its own machine, completely isolated from other databases. Resource governance emulates this behavior. If the aggregated resource utilization reaches the maximum available CPU, Memory, Log I/O, and Data I/O resources assigned to the database, resource governance will queue queries in execution and assign resources to the queued queries as they free up.

As on a dedicated machine, utilizing all available resources will result in a longer execution of currently executing queries, which can result in command timeouts on the client. Applications with aggressive retry logic and applications that execute queries against the database with a high frequency can encounter errors messages when trying to execute new queries when the limit of concurrent requests has been reached.

### Recommendations:
Monitor the resource utilization as well as the average response times of queries when nearing the maximum utilization of a database. When encountering higher query latencies you generally have three options:

1.	Reduce the amount of incoming requests to the database to prevent timeout and the pile up of requests.

2.	Assign a higher performance level to the database.

3.	Optimize queries to reduce the resource utilization of each query. For more information, see the Query Tuning/Hinting section in the Azure SQL Database Performance Guidance article.

## Enforcement of limits
Resources other than CPU, Memory, Log I/O, and Data I/O are enforced by denying new requests when limits are reached. Clients will receive an [error message](sql-database-develop-error-messages.md) depending on the limit that has been reached.

For example, the number of connections to a SQL database as well as the number of concurrent requests that can be processed are restricted. SQL Database allows the number of connections to the database to be greater than the number of concurrent requests to support connection pooling. While the amount of connections that are available can easily be controlled by the application, the amount of parallel requests is often times harder to estimate and to control. Especially during peak loads when the application either sends too many requests or the database reaches its resource limits and starts piling up worker threads due to longer running queries, errors can be encountered.

## Service tiers and performance levels

For a single database, the limits of a database are defined by the database service tier and performance level. The following table describes the characteristics of Basic, Standard, and Premium databases at varying performance levels.

[AZURE.INCLUDE [SQL DB service tiers table](../../includes/sql-database-service-tiers-table.md)]

[Elastic database pools](sql-database-elastic-pool.md) share resources across databases in the pool. The following table describes the characteristics of Basic, Standard, and Premium elastic database pools.

[AZURE.INCLUDE [SQL DB service tiers table for elastic databases](../../includes/sql-database-service-tiers-table-elastic-db-pools.md)]

For an expanded definition of each resource listed in the previous tables, see the descriptions in [Service tier capabilities and limits](sql-database-performance-guidance.md#service-tier-capabilities-and-limits). For an overview of service tiers, see [Azure SQL Database Service Tiers and Performance Levels](sql-database-service-tiers.md).

## Other SQL Database limits

| Area | Limit | Description |
|---|---|---|
| Databases using Automated export per subscription | 10 | Automated export allows you to create a custom schedule for backing up your SQL databases. For more information, see [SQL Databases: Support for Automated SQL Database Exports](http://weblogs.asp.net/scottgu/windows-azure-july-updates-sql-database-traffic-manager-autoscale-virtual-machines).|
| Database per server | Up to 5000 | Up to 5000 databases are allowed per server on V12 servers. |  
| DTUs per server | 45000 | 45000 DTUs are available per server on V12 servers for provisioning databases, elastic pools and data warehouses. |



## Resources

[Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md)

[Azure SQL Database Service Tiers and Performance Levels](sql-database-service-tiers.md)

[Error messages for SQL Database client programs](sql-database-develop-error-messages.md)
