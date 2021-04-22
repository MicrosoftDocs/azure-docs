---
title: What is a single database?
description: Learn about the single database resource type in Azure SQL Database. 
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer:
ms.date: 04/08/2019
---
# What is a single database in Azure SQL Database?
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

The single database resource type creates a database in Azure SQL Database with its own set of resources and is managed via a [server](logical-servers.md). With a single database, each database is isolated and portable. Each has its own service tier within the [DTU-based purchasing model](service-tiers-dtu.md) or [vCore-based purchasing model](service-tiers-vcore.md) and a guaranteed compute size.

> [!IMPORTANT]
> Single database is one resource type for Azure SQL Database. The other is [elastic pools](elastic-pool-overview.md).

## Dynamic scalability

You can build your first app on a small, single database at low cost in the serverless compute tier or a small compute size in the provisioned compute tier. You change the [compute or service tier](single-database-scale.md) manually or programmatically at any time to meet the needs of your solution. You can adjust performance without downtime to your app or to your customers. Dynamic scalability enables your database to transparently respond to rapidly changing resource requirements and enables you to only pay for the resources that you need when you need them.

## Single databases and elastic pools

A single database can be moved into or out of an [elastic pool](elastic-pool-overview.md) for resource sharing. For many businesses and applications, being able to create single databases and dial performance up or down on demand is enough, especially if usage patterns are relatively predictable. But if you have unpredictable usage patterns, it can make it hard to manage costs and your business model. Elastic pools are designed to solve this problem. The concept is simple. You allocate performance resources to a pool rather than an individual database and pay for the collective performance resources of the pool rather than for single database performance.

## Monitoring and alerting

You use the built-in [performance monitoring](performance-guidance.md) and [alerting tools](alerts-insights-configure-portal.md), combined with the performance ratings. Using these tools, you can quickly assess the impact of scaling up or down based on your current or project performance needs. Additionally, SQL Database can [emit metrics and resource logs](metrics-diagnostic-telemetry-logging-streaming-export-configure.md) for easier monitoring.

## Availability capabilities

Single databases and elastic pools provide many availability characteristics. For information, see [Availability characteristics](sql-database-paas-overview.md#availability-capabilities).

## Transact-SQL differences

Most Transact-SQL features that applications use are fully supported in both Microsoft SQL Server and Azure SQL Database. For example, the core SQL components such as data types, operators, string, arithmetic, logical, and cursor functions, work identically in SQL Server and SQL Database. There are, however, a few T-SQL differences in DDL (data-definition language) and DML (data manipulation language) elements resulting in T-SQL statements and queries that are only partially supported (which we discuss later in this article).

In addition, there are some features and syntax that are not supported because Azure SQL Database is designed to isolate features from dependencies on the master database and the operating system. As such, most server-level activities are inappropriate for SQL Database. T-SQL statements and options are not available if they configure server-level options, configure operating system components, or specify file system configuration. When such capabilities are required, an appropriate alternative is often available in some other way from SQL Database or from another Azure feature or service.

For more information, see [Resolving Transact-SQL differences during migration to SQL Database](transact-sql-tsql-differences-sql-server.md).

## Security

SQL Database provides a range of [built-in security and compliance](security-overview.md) features to help your application meet various security and compliance requirements.

> [!IMPORTANT]
> Azure SQL Database has been certified against a number of compliance standards. For more information, see the [Microsoft Azure Trust Center](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942), where you can find the most current list of SQL Database compliance certifications.

## Next steps

- To quickly get started with a single database, start with the [Single database quickstart guide](quickstart-content-reference-guide.md).
- To learn about migrating a SQL Server database to Azure, see [Migrate to Azure SQL Database](migrate-to-database-from-sql-server.md).
- For information about supported features, see [Features](features-comparison.md).
