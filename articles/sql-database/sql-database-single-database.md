---
title: What is an Azure SQL Database single database | Microsoft Docs
description: Learn about single database in Azure SQL Database
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer:
manager: craigg
ms.date: 04/08/2019
---
# What is a single database in Azure SQL Database

The single database deployment option creates a database in Azure SQL Database with its own set of resources and is managed via a SQL Database server. With a single database, each database is isolated from each other and portable, each with its own service tier within the [DTU-based purchasing model](sql-database-service-tiers-dtu.md) or [vCore-based purchasing model](sql-database-service-tiers-vcore.md) and a guaranteed compute size.

> [!IMPORTANT]
> Single database is one of three deployment options for Azure SQL Database. The other two are [elastic pools](sql-database-elastic-pool.md) and [managed instance](sql-database-managed-instance.md).
> [!NOTE]
> For a glossary of terms in Azure SQL Database, see [SQL Database terms glossary](sql-database-glossary-terms.md)

## Dynamic scalability

You can build your first app on a small, single database at low cost in the serverless (preview) compute tier or a small compute size in the provisioned compute tier. You change the [compute or service tier](sql-database-single-database-scale.md) manually or programmatically at any time to meet the needs of your solution. You can adjust performance without downtime to your app or to your customers. Dynamic scalability enables your database to transparently respond to rapidly changing resource requirements and enables you to only pay for the resources that you need when you need them.

## Single databases and elastic pools

A single database can be moved into or out of an [elastic pool](sql-database-elastic-pool.md) for resource sharing. For many businesses and applications, being able to create single databases and dial performance up or down on demand is enough, especially if usage patterns are relatively predictable. But if you have unpredictable usage patterns, it can make it hard to manage costs and your business model. Elastic pools are designed to solve this problem. The concept is simple. You allocate performance resources to a pool rather than an individual database and pay for the collective performance resources of the pool rather than for single database performance.

## Monitoring and alerting

You use the built-in [performance monitoring](sql-database-performance.md) and [alerting tools](sql-database-insights-alerts-portal.md), combined with the performance ratings. Using these tools, you can quickly assess the impact of scaling up or down based on your current or project performance needs. Additionally, SQL Database can [emit metrics and diagnostic logs](sql-database-metrics-diag-logging.md) for easier monitoring.

## Availability capabilities

Single databases, elastic pools, and managed instances all provide many availability characteristics. For information, see [Availability characteristics](sql-database-technical-overview.md#availability-capabilities).

## Transact-SQL differences

Most Transact-SQL features that applications use are fully supported in both Microsoft SQL Server and Azure SQL Database. For example, the core SQL components such as data types, operators, string, arithmetic, logical, and cursor functions, work identically in SQL Server and SQL Database. There are, however, a few T-SQL differences in DDL (data-definition language) and DML (data manipulation language) elements resulting in T-SQL statements and queries that are only partially supported (which we discuss later in this article).
In addition, there are some features and syntax that is not supported at all because Azure SQL Database is designed to isolate features from dependencies on the master database and the operating system. As such, most server-level activities are inappropriate for SQL Database. T-SQL statements and options are not available if they configure server-level options, operating system components, or specify file system configuration. When such capabilities are required, an appropriate alternative is often available in some other way from SQL Database or from another Azure feature or service.

For more information, see [Resolving Transact-SQL differences during migration to SQL Database](sql-database-transact-sql-information.md).

## Security

SQL Database provides a range of [built-in security and compliance](sql-database-security-overview.md) features to help your application meet various security and compliance requirements.

> [!IMPORTANT]
> Azure SQL Database (all deployment options), has been certified against a number of compliance standards. For more information, see the [Microsoft Azure Trust Center](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942) where you can find the most current list of SQL Database compliance certifications.

## Next steps

- To quickly get started with a single database, start with the [Single database quickstart guide.md](sql-database-single-database-quickstart-guide.md).
- To learn about migrating a SQL Server database to Azure, see [Migrate to Azure SQL Database](sql-database-single-database-migrate.md).
- For information about supported features, see [Features](sql-database-features.md).