<properties
	pageTitle="What is SQL Database? Intro to SQL Database | Microsoft Azure"
	description="Get an introduction to SQL Database: technical details and capabilities of Microsoft's relational database management system (RDBMS) in the cloud."
	keywords="introduction to sql,intro to sql,what is sql database"
	services="sql-database"
	documentationCenter=""
	authors="shontnew"
	manager="jhubbard"
	editor="cgronlun"/>

<tags
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="05/23/2016"
   ms.author="shkurhek"/>

# What is SQL Database? Introduction to SQL Database

SQL Database is a relational database service in the cloud based on the market-leading Microsoft SQL Server engine, with mission-critical capabilities. SQL Database delivers predictable performance, scalability with no downtime, business continuity and data protection—all with near-zero administration. You can focus on rapid app development and accelerating your time to market, rather than managing virtual machines and infrastructure. Because it’s based on the [SQL Server](https://msdn.microsoft.com/library/bb545450.aspx) engine, SQL Database supports existing SQL Server tools, libraries and APIs, which makes it easier for you to move and extend to the cloud.

This article is an introduction to SQL Database core concepts and features related to performance, scalability, and manageability, with links to explore details. If you’re ready to jump in, you can [Create your first SQL database](sql-database-get-started.md) or [Create an elastic database pool](sql-database-elastic-pool-create-portal.md) in minutes. If you want a deeper dive, watch this 30 minute video.

> [AZURE.VIDEO azurecon-2015-get-started-with-azure-sql-database]

## Adjust performance and scale without downtime

SQL databases is available in Basic, Standard, and Premium *service tiers*. Each service tier offers [different levels of performance and capabilities](sql-database-service-tiers.md) to support lightweight to heavyweight database workloads. You can build your first app on a small database for a few bucks a month, then [change the service tier](sql-database-scale-up.md) manually or programmatically at any time as your app goes viral worldwide, without downtime to your app or your customers.

For many businesses and apps, being able to create databases and dial single database performance up or down on demand is enough, especially if usage patterns are relatively predictable. But if you have unpredictable usage patterns, it can make it hard to manage costs and your business model.

[Elastic pools](sql-database-elastic-pool.md) in SQL Database solve this problem. The concept is simple. You allocate performance to a pool, and pay for the collective performance of the pool rather than single database performance. You don’t need to dial database performance up or down. The databases in the pool, called *elastic databases*, automatically scale up and down to meet demand. Elastic databases consume but don’t exceed the limits of the pool, so your cost remains predictable even if database usage doesn’t. What’s more, you can [add and remove databases to the pool](sql-database-elastic-pool-manage-portal.md), scaling your app from a handful of databases to thousands, all within a budget that you control. To learn more about design patterns for SaaS applications using elastic pools, see [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](sql-database-design-patterns-multi-tenancy-saas-applications.md).

Either way you go—single or elastic—you’re not locked in. You can blend single databases with elastic database pools, and change the service tiers of single databases and pools to create innovative designs. Moreover, with the power and reach of Azure, you can mix-and-match Azure services with SQL Database to meet your unique modern app design needs, drive cost and resource efficiencies, and unlock new business opportunities.

But how can you compare the relative performance of databases and database pools? How do you know the right click-stop when you dial up and down? The answer is the Database Transaction Unit (DTU) for single databases and the elastic DTU (eDTU) for elastic databases and database pools. See [SQL Database options and performance: Understand what's available in each service tier](sql-database-service-tiers.md) for details.

## Keep your app and business running

Azure's industry leading 99.99% availability service level agreement [(SLA)](http://azure.microsoft.com/support/legal/sla/), powered by a global network of Microsoft-managed datacenters, helps keep your app running 24/7. With every SQL database, you take advantage of built-in data protection, fault tolerance, and data protection that you would otherwise have to design, buy, build, and manage. Even so, depending on the demands of your business, you may demand additional layers of protection to ensure your app and your business can recover quickly in the event of a disaster, an error, or something else. With SQL Database, each service tier offers a different menu of features you can use to get up and running and stay that way. You can use point-in-time restore to return a database to an earlier state, as far back as 35 days. In addition, if the datacenter hosting your databases experiences an outage, you can failover to database replicas in a different region. Or you can use replicas for upgrades or relocation to different regions.

![SQL Database Geo-Replication](./media/sql-database-technical-overview/azure_sqldb_map.png)


See [Business Continuity](sql-database-business-continuity.md) for details about the different business continuity features available for different service tiers.

## Secure your data
SQL Server has a tradition of solid  data security that SQL Database upholds with features that limit access, protect data, and help you monitor activity. See [Securing your SQL database](sql-database-security.md) for a quick rundown of security options you have in SQL Database. See the [Security Center for SQL Server Database Engine and SQL Database](https://msdn.microsoft.com/library/bb510589) for a more comprehensive view of security features. And visit the [Azure Trust Center](https://azure.microsoft.com/support/trust-center/security/) for information about Azure's platform security.

## Next steps
Now that you've read an introduction to SQL Database and answered the question "What is SQL Database?", you're ready to:

- See the [pricing page](https://azure.microsoft.com/pricing/details/sql-database/) for single database and elastic database cost comparisons and calculators.
- Learn about [elastic pools](sql-database-elastic-pool.md).
- Get started by [creating your first database](sql-database-get-started.md).
- [Connect and query with SSMS](sql-database-connect-query-ssms.md)
- Build your first app in C#, Java, Node.js, PHP, Python, or Ruby: [Connection libraries for SQL Database and SQL Server](sql-database-libraries.md)
- See an index of the titles and descriptions of [All topics for Azure sql-database service](sql-database-index-all-articles.md).
