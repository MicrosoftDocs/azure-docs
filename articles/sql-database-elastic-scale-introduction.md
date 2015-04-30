<properties 
    pageTitle="Azure SQL Database - elastic database tools" 
    description="Easily scale database resources in the cloud using elastic database tools." 
    services="sql-database" 
    documentationCenter="" 
    manager="jeffreyg" 
    authors="sidneyh" 
    editor=""/>

<tags 
    ms.service="sql-database" 
    ms.workload="sql-database" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="04/24/2015" 
    ms.author="sidneyh"/>

# Azure SQL Database - elastic database tools

## Promises and challenges

Azure SQL Database delivers virtually unbounded database resources as well as elasticity for transactional workloads. Enabling this functionality is facilitated by features such as the **elastic database client library** and **split-merge tool**, known together as **elastic database tools**. These components are designed to simplify development and management of sharded database solutions – discussed in this article.

While achieving elasticity and scale for cloud applications has been straightforward for compute and blob storage, it has remained a challenge for stateful data processing in relational databases. We have seen these challenges emerge most prominently in the two following scenarios:

* Growing and shrinking capacity for the relational database part of your workload.
* Managing hotspots that may arise affecting a specific subset of data – such as a particularly busy end-customer (tenant).

Traditionally, scenarios like these have been addressed by investing in larger-scale database servers to support the application. However, this option is limited in the cloud where all processing happens on predefined commodity hardware. Instead, distributing data and processing across many identically-structured databases (a scale-out pattern known as sharding) provides a compelling alternative to traditional scale-up approaches both in terms of cost and elasticity. 

Elastic database features of Azure SQL Database make scaling-out simpler and more flexible than ever.  If you are developing Software as a Service applications, **elastic database pools** make it easy to create individual databases for each of your end-customers or tenants, and allows each to dynamically grow or shrink its resource footprint automatically while maintaining a predictable budget.    **Elastic database jobs** allow you to reliably perform management operations at scale across an entire set of databases by running T-SQL scripts to perform schema changes, credentials management or any other database maintenance operation you choose. 

And whether you use separate databases for each tenant, or pack multiple ranges of data into each of a collection of databases, the elastic database client library and split/merge tool reduce the effort required to build and manage applications that take advantage of sharding.   Instead of writing code to document data layout across databases and route connections to the right location, the client library allows you to focus on the business logic of the application.

## Horizontal and vertical scaling
The figure below shows the horizontal and vertical dimensions of scaling.   
 
![Horizontal versus Vertical Scaleout][4]

Horizontal scaling refers to adding or removing databases in order to adjust capacity or overall performance. This is frequently called “scaling out”. Sharding is a common approach to horizontal scaling, in which data is partitioned across a collection of identically structured databases.  

Vertical scaling refers to increasing or decreasing the performance level of an individual database – also known as “scaling up”.

Most cloud-scale database applications will use a combination of these two strategies. For example, a Software as a Service application may use horizontal scaling to provision new end-customers and vertical scaling to allow each end-customer’s database to grow or shrink resources as needed by the workload.

Elastic database tools simplify building applications that rely on sharding – handling horizontal scaling infrastructure.   And by using an elastic database pool for your family of databases, vertical scaling is handled automatically by the system. With pools, you are responsible for setting limits on the system overall and the range of variation you wish to permit per-database.  You can also manually change database editions or resource levels for databases that don’t participate in elastic database pools. For example, you may create a new shard to handle a massive influx of data at the end of a month. While the new data is arriving the shard is scaled up, and scaled back down as the influx abates.

For more information about elastic database pools, see [Elastic database pools overview](sql-database-elastic-pool.md).

## Elastic database tools capabilities 

Developing, scaling and managing scaled-out applications using sharding presents challenges for both the developer as well as the administrator. Elastic database tools make life easier for both these roles. The numbers in the figure below outline the main capabilities delivered by the elastic database client library and split-merge tool. The figure illustrates an environment with many databases, and each database corresponds to a shard. The tools make developing sharded Azure SQL DB applications easier through the following specific capabilities: 

For definitions of terms used here, see [Elastic database tools glossary](sql-database-elastic-scale-glossary.md).

![Elastic scale capabilities][1]

1.  **Shard Map Management**: Shard map management is the ability for an application to manage various metadata about its shards. Shard map management is a feature of the elastic database client library. Developers can use this functionality to register databases as shards, describe mappings of individual sharding keys or key ranges to those databases, and maintain this metadata as the number and composition of databases evolves to reflect capacity changes. Shard map management constitutes a big part of boiler-plate code that customers had to write in their applications when they were implementing sharding themselves. For details, see [Shard map management](sql-database-elastic-scale-shard-map-management.md)
 
* **Data dependent routing**: Imagine a request coming into the application. Based on the sharding key value of the request, the application needs to determine the correct database that holds the data for this key value, and then open a connection to it to process the request. Data dependent routing provides the ability to open connections with a single easy call into the shard map of the application. Data dependent routing was another area of infrastructure code that is now covered by functionality in the elastic database client library.  For details, see [Data dependent routing](sql-database-elastic-scale-data-dependent-routing.md)

* **Multi-shard queries (MSQ)**: Multi-shard querying works when a request involves several (or all) shards. A multi-shard query executes the same T-SQL code on all shards or a set of shards. The results from the participating shards are merged into an overall result set using UNION ALL semantics. The functionality as exposed through the client library handles many tasks, including: connection management, thread management, fault handling and intermediate results processing. MSQ can query up to hundreds of shards. For details, see [Multi-shard querying](sql-database-elastic-scale-multishard-querying.md).


* **Split-merge tool**: If you choose not to use the simple model of allocating separate databases in an elastic database pool for each shardlet (tenant), your application may need to flexibly redistribute data among databases when capacity needs fluctuate in tandem with business momentum. Elastic database tools includesa customer-hosted split-merge tool for rebalancing the data distribution and managing hotspots for sharded applications in situations that also involve movement of data. It builds on an underlying capability for moving shardlets on demand between different databases and integrates with shard map management to maintain consistent mappings and accurate data dependent routing connections. For details, see [Splitting and merging with elastic database tools](sql-database-elastic-scale-overview-split-and-merge.md)

In general, customers using elastic database tools can expect to get full T-SQL functionality when submitting shard-local operations as opposed to cross-shard operations that have their own semantics

## Common sharding patterns

**Sharding** is a technique to distribute large amounts of identically-structured data across a number of independent databases. It is especially popular with cloud developers who are creating Software as a Service (SAAS) offerings for end customers or businesses. These end customers are often referred to as “Tenants”. Sharding may be required for any number of reasons:  

* The total amount of data is too large to fit within the constraints of a single database 
* The transaction throughput of the overall workload exceeds the capabilities of a single database 
* Tenants may require physical isolation from each other, so separate databases are needed for each tenant 
* Different sections of a database may need to reside in different geographies for compliance, performance or geopolitical reasons. 

In other scenarios, such as ingestion of data from distributed devices, sharding can be used to fill a set of databases that are organized temporally. For example, a separate database can be dedicated to each day or week. In that case, the sharding key can be an integer representing the date (present in all rows of the sharded tables) and queries retrieving information for a date range must be routed by the application to the subset of databases covering the range in question.
 
Sharding works best when every transaction in an application can be restricted to a single value of a sharding key. That ensures that all transactions will be local to a specific database. 

Some applications use the simplest approach of creating a separate database for each tenant. This is the **single tenant sharding pattern** that provides isolation, backup/restore ability and resource scaling at the granularity of the tenant. With single tenant sharding, each database is associated with a specific tenant ID value (or customer key value), but that key need not always be present in the data itself. It is the application’s responsibility to route each request to the appropriate database – and the elastic database client library can simplify this. 

![Single tenant versus multi-tenant][3]

Others scenarios pack multiple tenants together into databases, rather than isolating them into separate databases. This is a typical **multi-tenant sharding pattern** –and it may be driven by the fact that an application manages large numbers of very small tenants. In multi-tenant sharding, the rows in the database tables are all designed to carry a key identifying the tenant ID or sharding key. Again, the application tier is responsible for routing a tenant’s request to the appropriate database – which can be supported by the elastic database client library. Redistributing data among databases may be needed with this pattern, and is facilitated by the elastic database split-merge tool. 

[AZURE.INCLUDE [elastic-scale-include](../includes/elastic-scale-include.md)]

<!--Anchors-->
<!--Image references-->
[1]:./media/sql-database-elastic-scale-intro/overview.png
[2]:./media/sql-database-elastic-scale-intro/tenancy.png
[3]:./media/sql-database-elastic-scale-intro/single_v_multi_tenant.png
[4]:./media/sql-database-elastic-scale-intro/h_versus_vert.png
