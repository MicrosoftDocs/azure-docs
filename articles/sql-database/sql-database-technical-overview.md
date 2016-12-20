---
title: What is SQL Database? Intro to SQL Database | Microsoft Docs
description: 'Get an introduction to SQL Database: technical details and capabilities of Microsoft''s relational database management system (RDBMS) in the cloud.'
keywords: introduction to sql,intro to sql,what is sql database
services: sql-database
documentationcenter: ''
author: shontnew
manager: jhubbard
editor: cgronlun

ms.assetid: c561f600-a292-4e3b-b1d4-8ab89b81db48
ms.service: sql-database
ms.custom: overview
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 12/20/2016
ms.author: shkurhek;carlrab
---
# What is SQL Database? Introduction to SQL Database
SQL Database is a relational database service in the Microsoft cloud based on the market-leading Microsoft SQL Server engine and capable of handling mission-critical workloads. SQL Database delivers predictable performance at multiple service levels, dynamic scalability with no downtime, built-in business continuity and data protection — all with near-zero administration. These capabilities allow you to focus on rapid app development and accelerating your time to market, rather than allocating precious time and resources to managing virtual machines and infrastructure. Because SQL Database is based on the [SQL Server](https://msdn.microsoft.com/library/bb545450.aspx) engine, SQL Database supports existing SQL Server tools, libraries and APIs - making it easy for you develop new solutions in the Microsoft cloud, to move your existing SQL Server solutions to the Microsoft cloud, and to extend your existing SQL Server solutions to the Microsoft cloud - all without having to learn new skills.

This article is an introduction to SQL Database core concepts and features related to performance, scalability, and manageability, with links to explore details. If you are ready to jump in to hands-on tutorials, go to [Create your first SQL database](sql-database-get-started.md) or [Create an elastic pool](sql-database-elastic-pool-create-portal.md). For a short video demonstration, watch this video.

> [!VIDEO https://channel9.msdn.com/Blogs/Windows-Azure/Azure-SQL-Database-create-DBs-in-seconds/player]
> 
> 

## Adjust performance and scale without downtime
The SQL Database service offers three service tiers: Basic, Standard, and Premium. Each service tier offers [different levels of performance and capabilities](sql-database-service-tiers.md) to support lightweight to heavyweight database workloads. You can build your first app on a small database for a few bucks a month, then [change the service tier](sql-database-scale-up.md) manually or programmatically at any time to meet the needs of your solution, without downtime to your app or your customers. Dynamic scalability enables your database to transparently respond to rapidly changing resource requirements and enables you to only pay for the resources that you need when you need them.

For many businesses and apps, being able to create single databases and dial performance up or down on demand is enough, especially if usage patterns are relatively predictable. But if you have unpredictable usage patterns, it can make it hard to manage costs and your business model. [Elastic pools](sql-database-elastic-pool.md) are designed to solve this problem. The concept is simple. You allocate performance resources to a pool rather than an individual database, and pay for the collective performance resources of the pool rather than for single database performance. With elastic pools, you don’t need to focus on dialing database performance up and down as demand for resources fluctuates. The pooled databases consume the performance resources of the elastic pool as needed. Pooled databases consume but don’t exceed the limits of the pool, so your cost remains predictable even if individual database usage doesn’t. What’s more, you can [add and remove databases to the pool](sql-database-elastic-pool-manage-portal.md), scaling your app from a handful of databases to thousands, all within a budget that you control. Finally, you can also control the minumum and maximum resources available to databases in the pool to ensure a single database does not use all of the pool resource and to ensure a minimunm level of resources is available to each databae. To learn more about design patterns for SaaS applications using elastic pools, see [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](sql-database-design-patterns-multi-tenancy-saas-applications.md).

Either way you go — single databases or elastic pools — you are not locked in. You can blend single databases with elastic pools, and change the service tiers of single databases and elastic pools quickly and easily to adapt to your situation. Moreover, with the power and reach of Azure, you can mix-and-match other Azure services with SQL Database to meet your unique app design needs, drive cost and resource efficiencies, and unlock new business opportunities.

But how can you compare the relative performance of databases and database pools? How do you know the right click-stop when you dial up and down? The answer lies with the built-in performance monitoring and alerting tools, combined with the performance ratings based on Database Transaction Units (DTUs) for single databases and elastic DTUs (eDTUs) for elastic pools, which let you quickly assess the impact of scaling up or down based on your current or project performance needs. See [SQL Database options and performance: Understand what's available in each service tier](sql-database-service-tiers.md) for details.

## Keep your app and business running
Azure's industry leading 99.99% availability service level agreement [(SLA)](http://azure.microsoft.com/support/legal/sla/), powered by a global network of Microsoft-managed datacenters, helps keep your app running 24/7. With every SQL database, you take advantage of built-in security, fault tolerance, and data protection that you would otherwise have to buy or design, build, and manage. With SQL Database, each service tier offers a comprehensive set of business continuity features and options that you can use to get up and running and stay that way. You can use point-in-time restore to return a database to an earlier state, as far back as 35 days. You can configure long-term backup retention to store backups in a secure vault for up to 10 years. In addition, if the datacenter hosting your databases experiences an outage, you can restore databases from geo-redundant copies of recent backups. You can also configure geo-redundant readable replicas in one or more regions for rapid recovery, if needed. You can also use these replicas for faster read performance in different geographic regions or for upgrades without downtime. 

![SQL Database Geo-Replication](./media/sql-database-technical-overview/azure_sqldb_map.png)

See [Business Continuity](sql-database-business-continuity.md) for details about the different business continuity features available for different service tiers.

## Secure your data
SQL Server has a tradition of solid  data security that SQL Database upholds with features that limit access, protect data, and help you monitor activity. See [Securing your SQL database](sql-database-security.md) for a quick rundown of security options you have in SQL Database. See the [Security Center for SQL Server Database Engine and SQL Database](https://msdn.microsoft.com/library/bb510589) for a more comprehensive view of security features. And visit the [Azure Trust Center](https://azure.microsoft.com/support/trust-center/security/) for information about Azure's platform security.

## Next steps
Now that you've read an introduction to SQL Database and answered the question "What is SQL Database?", you're ready to:

* See the [pricing page](https://azure.microsoft.com/pricing/details/sql-database/) for single database and elastic pools cost comparisons and calculators.
* Learn about [elastic pools](sql-database-elastic-pool.md).
* Get started by [creating your first database](sql-database-get-started.md).
* Build your first app in C#, Java, Node.js, PHP, Python, or Ruby: [Connection libraries for SQL Database and SQL Server](sql-database-libraries.md)
