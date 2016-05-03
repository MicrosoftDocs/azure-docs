<properties
    pageTitle="Elastic Database tools features overview | Microsoft Azure"
    description="Software as a Service (SaaS) developers can easily create elastic, scalable databases in the cloud using these tools"
    services="sql-database"
    documentationCenter=""
    manager="jhubbard"
    authors="ddove"
    editor=""/>

<tags
    ms.service="sql-database"
    ms.workload="sql-database"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="article"
    ms.date="04/04/2016"
    ms.author="ddove;sidneyh"/>

# Elastic Database features overview

**Elastic Database** features enables you to use the virtually unlimited database resources of **Azure SQL Database** to create solutions for transactional workloads, and especially Software as a Service (SaaS) applications. Elastic Database features are composed of the following:

* Elastic Database tools: These two tools simplify development and management of sharded database solutions. The tools are: the [Elastic Database client library](sql-database-elastic-database-client-library.md) and the [Elastic Database split-merge tool](sql-database-elastic-scale-overview-split-and-merge.md).
* [Elastic Database pools](sql-database-elastic-pool-guidance.md) (preview): A pool is a collection of databases to which you can add or remove databases at any time. The databases in the pool share a fixed amount of resources (known as Database Transaction Units, or DTUs). You pay a fixed price for the resources, which enables you to easily calculate costs while managing performance.
* [Elastic Database jobs](sql-database-elastic-jobs-overview.md) (preview): Use jobs to manage large numbers of Azure SQL databases. Easily perform administrative operations such as schema changes, credentials management, reference data updates, performance data collection or tenant (customer) telemetry collection using jobs.
* [Elastic Database query](sql-database-elastic-query-overview.md) (preview): Enables you to run a Transact-SQL query that spans multiple databases. This enables connection to reporting tools such as Excel, PowerBI, Tableau, etc.
* [Elastic transactions](sql-database-elastic-transactions-overview.md): This feature allows you to run transactions that span several databases in Azure SQL Database. Elastic database transactions are available for .NET applications using ADO .NET and integrate with the familiar programming experience using the [System.Transaction classes](https://msdn.microsoft.com/library/system.transactions.aspx).

The graphic below shows an architecture that includes the **Elastic Database features** in relation to a collection of databases.

![Elastic Database tools][1]

For a printable version of this graphic, go to [Elastic database overview download](http://aka.ms/axmybc).

In this graphic, colors of the database represent schemas. Databases with the same color share the same schemas.

1. A set of **Azure SQL databases** are hosted on Azure using sharding architecture.
2. The **Elastic Database client library** is used to manage a shard set.
3. A subset of the databases are put into an **Elastic Database pool**. (See [Tame explosive growth with elastic databases](sql-database-elastic-pool.md)).
4. An **Elastic Database job** runs T-SQL scripts against all databases.
5. The **split-merge tool** is used to move data from one shard to another.
6. The **Elastic Database query** allows you to write a query that spans all databases in the shard set.

## Promises and challenges

Achieving elasticity and scale for cloud applications has been straightforward for compute and blob storage--simply add or subtract units. But it has remained a challenge for stateful data processing in relational databases. We have seen these challenges emerge most prominently in the two following scenarios:

* Growing and shrinking capacity for the relational database part of your workload.
* Managing hotspots that may arise affecting a specific subset of data – such as a particularly busy end-customer (tenant).

Traditionally, scenarios like these have been addressed by investing in larger-scale database servers to support the application. However, this option is limited in the cloud where all processing happens on predefined commodity hardware. Instead, distributing data and processing across many identically-structured databases (a scale-out pattern known as "sharding") provides an alternative to traditional scale-up approaches both in terms of cost and elasticity.

## Horizontal and vertical scaling

The figure below shows the horizontal and vertical dimensions of scaling, which are the basic ways the elastic databases can be scaled.

![Horizontal versus Vertical Scaleout][2]

Horizontal scaling refers to adding or removing databases in order to adjust capacity or overall performance. This is also called “scaling out”. Sharding, in which data is partitioned across a collection of identically structured databases, is a common way to implement horizontal scaling.  

Vertical scaling refers to increasing or decreasing the performance level of an individual database—this is also known as “scaling up.”

Most cloud-scale database applications will use a combination of these two strategies. For example, a Software as a Service application may use horizontal scaling to provision new end-customers and vertical scaling to allow each end-customer’s database to grow or shrink resources as needed by the workload.

* Horizontal scaling is managed using the [Elastic Database client library](sql-database-elastic-database-client-library.md).

* Vertical scaling is accomplished using Azure PowerShell cmdlets to change the service tier, or by placing databases in an Elastic Database pool.

## Single and multi-tenancy patterns

*Sharding* is a technique to distribute large amounts of identically-structured data across a number of independent databases. It is especially popular with cloud developers who are creating Software as a Service (SAAS) offerings for end customers or businesses. These end customers are often referred to as “tenants”. Sharding may be required for any number of reasons:  

* The total amount of data is too large to fit within the constraints of a single database
* The transaction throughput of the overall workload exceeds the capabilities of a single database
* Tenants may require physical isolation from each other, so separate databases are needed for each tenant
* Different sections of a database may need to reside in different geographies for compliance, performance or geopolitical reasons.

In other scenarios, such as ingestion of data from distributed devices, sharding can be used to fill a set of databases that are organized temporally. For example, a separate database can be dedicated to each day or week. In that case, the sharding key can be an integer representing the date (present in all rows of the sharded tables) and queries retrieving information for a date range must be routed by the application to the subset of databases covering the range in question.

Sharding works best when every transaction in an application can be restricted to a single value of a sharding key. That ensures that all transactions will be local to a specific database.

Some applications use the simplest approach of creating a separate database for each tenant. This is the **single tenant sharding pattern** that provides isolation, backup/restore ability and resource scaling at the granularity of the tenant. With single tenant sharding, each database is associated with a specific tenant ID value (or customer key value), but that key need not always be present in the data itself. It is the application’s responsibility to route each request to the appropriate database – and the client library can simplify this.

![Single tenant versus multi-tenant][4]

Others scenarios pack multiple tenants together into databases, rather than isolating them into separate databases. This is a typical **multi-tenant sharding pattern** – and it may be driven by the fact that an application manages large numbers of very small tenants. In multi-tenant sharding, the rows in the database tables are all designed to carry a key identifying the tenant ID or sharding key. Again, the application tier is responsible for routing a tenant’s request to the appropriate database, and this can be supported by the elastic database client library. In addition, row-level security can be used to filter which rows each tenant can access – for details, see [Multi-tenant applications with elastic database tools and row-level security](sql-database-elastic-tools-multi-tenant-row-level-security.md). Redistributing data among databases may be needed with the multi-tenant sharding pattern, and this is facilitated by the elastic database split-merge tool.

### Move data from multiple to single-tenancy databases
When creating a SaaS application, it is typical to offer prospective customers a trial version of the software. In this case, it is cost-effective to use a multi-tenant database for the data. However, when a prospect becomes a customer, a single-tenant database is better since it provides better performance. If the customer had created data during the trial period, use the [split-merge tool](sql-database-elastic-scale-overview-split-and-merge.md) to move the data from the multi-tenant to the new single-tenant database.

## Next steps

For a sample app that demonstrates the client library, see [Get started with Elastic Datbabase tools](sql-database-elastic-scale-get-started.md).

To use the split-merge tool, you must [configure security](sql-database-elastic-scale-split-merge-security-configuration.md).

To see the specifics of the Elastic Database pool, see [Price and performance considerations for an elastic database pool](sql-database-elastic-pool-guidance.md), or create a new pool with the [tutorial](sql-database-elastic-pool-create-portal.md).  

[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]

### Feedback please!
What can we do better? Does this topic explain the feature clearly? Or are you puzzled by any bit of it? We aim to please, so use the voting buttons, and tell us how we failed (or succeeded). And if you want us to contact you, include your email in your feedback.


<!--Anchors-->
<!--Image references-->
[1]:./media/sql-database-elastic-scale-introduction/tools.png
[2]:./media/sql-database-elastic-scale-introduction/h_versus_vert.png
[3]:./media/sql-database-elastic-scale-introduction/overview.png
[4]:./media/sql-database-elastic-scale-introduction/single_v_multi_tenant.png

