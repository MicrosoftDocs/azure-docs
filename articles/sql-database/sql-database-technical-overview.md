<properties
   pageTitle="What is SQL Database | Microsoft Azure"
   description="Discover the technical details and capabilities of Azure SQL Database, Microsoft's relational database management system (RDBMS) and PaaS solution in the cloud."
   services="sql-database"
   documentationCenter=""
   authors="shontnew"
   manager="jeffreyg"
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="09/30/2015"
   ms.author="shkurhek"/>

# Introduction to SQL Database

SQL Database is a relational database service in the cloud based on the market leading Microsoft SQL Server engine, with mission-critical capabilities. SQL Database delivers predictable performance, scalability with no downtime, business continuity and data protection—all with near-zero administration. You can focus on rapid app development and accelerating your time to market, rather than managing virtual machines and infrastructure. Because it’s based on the [SQL Server](https://msdn.microsoft.com/library/bb545450.aspx) engine, SQL Database supports existing SQL Server tools, libraries and APIs, which makes it easier for you to move and extend to the cloud.


If you’re ready to jump in you can…in minutes, and if you want a deeper dive, watch this 30 minute video.


> [AZURE.VIDEO azurecon-2015-get-started-with-azure-sql-database]


The present article introduces the core concepts and features of SQL Database related to performance, scalability, and manageability, with links to explore details. If you’re ready to jump in, you can [Create your first SQL database](sql-database-get-started.md) or [Create an elastic database pool](sql-database-elastic-pool-portal.md) in minutes.

## Adjust performance and scale without downtime
SQL databases is available in Basic, Standard, and Premium *service tiers*. Each service tier offers [different levels of performance and capabilities](sql-database-service-tiers.md) to support lightweight to heavyweight database workloads. You can build your first app on a small database for a few bucks a month, then [change the service tier](sql-database-scale-up.md) manually or programmatically at any time as your app goes viral worldwide, without downtime to your app or your customers.

For many businesses and apps, being able to create databases and dial single database performance up or down on demand is enough, especially if usage patterns are relatively predictable. But if you have unpredictable usage patterns, it can make it hard to manage costs and your business model. 

[Elastic database pools](sql-database-elastic-pool.md) in SQL Database solve this problem. The concept is simple. You allocate performance to a pool, and pay for the collective performance of the pool rather than single database performance. You don’t need to dial database performance up or down. The databases in the pool, called *elastic databases*, automatically scale up and down to meet demand. Elastic databases consume but don’t exceed the limits of the pool, so your cost remains predictable even if database usage doesn’t. What’s more, you can [add and remove databases to the pool](sql-database-elastic-pool-portal.md), scaling your app from a handful of databases to thousands, all within a budget that you control.

Either way you go—single or elastic—you’re not locked in. You can blend single databases with elastic database pools, and change the service tiers of single databases and pools to create innovate designs. Moreover, with the power and reach of Azure, you can mix-and-match Azure services with SQL Database to meet your unique modern app design needs, drive cost and resource efficiencies, and unlock new business opportunities.

But how can you compare the relative performance of databases and database pools? How do you know the right click-stop when you dial up and down? The answer is the database transaction unit (DTU) for single databases and the elastic DTU (eDTU) for elastic databases and database pools.

## Understand DTUs

The Database Transaction Unit (DTU) is the unit of measure in SQL Database that represents the relative power of databases based on a real-world measure: the database transaction. We took a set of operations that are typical for an online transaction processing (OLTP) request, and then measured how many transactions could be completed per second under fully loaded conditions (that’s the short version, you can read the gory details in the [Benchmark overview](https://msdn.microsoft.com/library/azure/dn741327.aspx)).

A Basic database has 5 DTUs, which means it can complete 5 transactions per second, while a Premium P11 database has 1750 DTUs.

![Single database DTUs](./media/sql-database-technical-overview/single_db_dtus.png)

The DTU for single databases translates directly to the eDTU for elastic databases. For example, a database in a Basic elastic database pool offers up to 5 eDTUs. That’s the same performance as a single Basic database. The difference is that the elastic database won’t consume any eDTUs from the pool until it has to. 

![Elastic pools and eDTUs](./media/sql-database-technical-overview/sqldb_elastic_pools.png)

A simple example helps. Take a Basic elastic database pool with 1000 DTUs and drop 800 databases in it. As long as only 200 of the 800 databases are being used at any point in time (5DTU X 200 = 1000), you won’t hit capacity of the pool, and database performance won’t degrade. This example is simplified for clarity. The real math is a bit more involved. The portal does the math for you, and makes a recommendation based on historical database usage. See [Price and performance considerations for an elastic database pool](sql-database-elastic-pool-guidance.md) to learn how the recommendations work, or to do the math yourself.

## Keep your app and business running

Azure's industry leading 99.99% availability service level agreement [(SLA)](http://azure.microsoft.com/support/legal/sla/), powered by a global network of Microsoft-managed datacenters, helps keep your app running 24/7. With every SQL database, you take advantage of built-in data protection, fault tolerance, and data protection that you would otherwise have to design, buy, build, and manage. Even so, depending on the demands of your business, you may demand additional layers of protection to ensure your app and your business can recover quickly in the event of a disaster, an error, or something else. With SQL Database, each service tier offers a different menu of features you can use to get up and running. You can use point-in-time restore to return a database to an earlier state, as far back as 35 days. In addition, if the datacenter hosting your databases experiences an outage, you can failover to database replicas in a different region. Or you can use replicas for upgrades or relocation to different regions.

![SQL Database geo-replication](./media/sql-database-technical-overview/azure_sqldb_map.png)


See [Business Continuity](sql-database-business-continuity.md) for details about the different business continuity features available for different service tiers.

## Secure your data
SQL Server has a tradition of solid  data security that SQL Database upholds  with features that limit access, protect data, and help you monitor activity. See [Securing your SQL database](sql-database-security.md) for a quick rundown of security options you have in SQL Database. See the [Security Center for SQL Server Database Engine and SQL Database](https://msdn.microsoft.com/library/bb510589) for a more comprehensive view of security features. And visit the [Azure Trust Center](http://azure.microsoft.com/support/trust-center/security/) for information about Azure's platform security.

## Next steps

- See the [pricing page](http://azure.microsoft.com/pricing/details/sql-database/) for single database and elastic database pricing and calculators.

- Get started by [creating your first database](sql-database-get-started.md). Then build your first app in [C#](sql-database-connect-query.md), [Java](sql-database-develop-java-simple-windows.md), [Node.js](sql-database-develop-nodejs-simple-windows.md), [PHP](sql-database-develop-php-retry-windows.md), [Python](sql-database-develop-python-simple-windows.md), or [Ruby](sql-database-develop-ruby-simple-linux). 

