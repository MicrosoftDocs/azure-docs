<properties pageTitle="Azure SQL Database Elastic Scale" description="Easily scale database resources in the cloud using Elastic Scale feature of Azure SQL Database." services="sql-database" documentationCenter="" manager="jhubbard" authors="sidneyh" editor=""/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/02/2014" ms.author="sidneyh"/>

#Azure SQL Database Elastic Scale Overview 
Welcome to the Azure SQL Database Elastic Scale Public Preview! 

###Promises and Challenges
Azure SQL Database Elastic Scale delivers on the promise of cloud computing and enables both virtually unbounded capacity as well as elasticity on the Azure SQL DB platform. To date, cloud service providers have been able to deliver on most aspects around boundless capacity of compute and blob storage. Elasticity, however, still remains a challenge when it comes to stateful data processing in the cloud, particularly with relational database management. We have seen these challenges emerge most prominently in the two following scenarios: 

* Growing and shrinking capacity for the relational database part of your workload.
* Management of utilization hotspots for stateful database workloads and their data.

Traditionally, these scenarios are addressed by buying more hardware that hosts the data tier of the application. However, this option is limited in the cloud where all processing happens on predefined commodity hardware. Sharding, or the distribution of data and processing across several scale units for capacity reasons, provides a compelling alternative to traditional scale-up approaches both in terms of cost and elasticity. Over the course of several years, we found customers must implement their own scale-out approaches on top of Azure SQL DB to be successful with sharding. For some, this meant managing hundreds or thousands of Azure SQL databases. That meant lots of code in their data tier that dealt with the intricacies of sharding rather than the business logic of the application. 

Working directly with customers over the years, we have seen several patterns for sharding emerge from these projects. Azure SQL Database Elastic Scale provides client libraries and service offerings around these patterns. Elastic scale allows you to more easily develop, scale and manage the stateful data tiers of your Azure applications.

You can then focus on the business logic of your application rather than building infrastructure for sharding.
## Horizontal Versus Vertical Scale Out
The figure below shows the difference between horizontal and vertical scaleout. These are the two ways you can scale a sharded solution. 
![Horizontal versus Vertical Scaleout][4]

Use horizontal scale out to increase capacity. For example, as a tax deadline approaches you increase space to store incoming documents.

Use vertical scale out to increase the performance of a shard. This can occur when a lot of data is being processed, and that causes the shard to become a hot spot in the system. For example, you may create a new shard to handle an massive influx of data at the end of a month. While the new data is arriving the shard is scaled up, and scaled back down as the influx abates.

For more information about scaling scenarios, see [Splitting and Merging with Elastic Scale](./sql-database-elastic-scale-overview-split-and-merge.md).


##Capabilities 

Developing, scaling and managing scaled-out applications using sharding presents challenges for both the developer as well as for the administrator. Azure SQL DB Elastic Scale makes life easier for both these roles. The numbers in the graphic outline the main capabilities delivered with this public preview release. 
The lower part shows the data tier of the application and the distribution of its data across several databases, called shards. Assume that multiple databases are storing the data for several shards. 

For definitions of terms used here, see [Elastic Scale Glossary](./sql-database-elastic-scale-glossary.md).

###Elastic Scale with Sharding 
**Shard Elasticity** is the capability that enables administrators to automate the vertical (dialing up and down the edition of a single shard) and horizontal (adding or removing shards from a shard map) scaling of their sharded environment via PowerShell scripts and by means of the Azure Automation Service. For details, see [Shard Elasticity](./sql-database-elastic-scale-elasticity.md).



The figure below shows the developer and the administrator on the left and right. Customers can expect to get full T-SQL functionality when submitting shard-local operations as opposed to cross-shard operations that have their own semantics. 
The public preview release for Azure SQL Database Elastic Scale makes developing sharded Azure SQL DB applications easier through the following specific capabilities: 

![Elastic Scale Capabilities][1]

1.  **Shard Map Management**: Shard map management  is the ability for an application to manage various metadata about its shards. Shard map management is a feature of the Elastic Scale client library. Developers can use this functionality to register shards, describe mappings of individual sharding keys or key ranges to shards, and maintain this metadata as the layout of shards in the data tier evolves to reflect capacity changes. Shard map management constitutes a big part of boiler-plate code that customers had to write in their applications when they were implementing sharding themselves. For details, see [Shard Map Management](./sql-database-elastic-scale-shard-map-management.md)
 
* **Data Dependent Routing**: Imagine a request coming into the application. Based on the sharding key value of the request, the application needs to determine the correct shard that holds the data for this sharding key value, and then open a connection to this shard to process the request. Data dependent routing provides the ability to open connections with a single easy call into the shard map of the application. Data dependent routing was another area of infrastructure code that is now covered by functionality in the Elastic Scale client library. For details, see [Data Dependent Routing](./sql-database-elastic-scale-data-dependent-routing.md)

* **Multi-Shard Queries (MSQ)**: Multi-shard querying works when a request involves several (or all) shards. A multi-shard query executes the same T-SQL code on all shards or a set of shards. The results from the participating shards are merged into an overall result set using UNION ALL semantics. The functionality is exposed through the client library handles many tasks, including: connection management, thread management, fault handling and intermediate results processing. MSQ can query up to hundreds of shards. For details, see [Multi-Shard Querying](./sql-database-elastic-scale-multishard-querying.md).


* **Split-Merge service**: When capacity needs fluctuate in tandem with business momentum, applications need to flexibly redistribute data across a number of databases. Elastic scale provides a customer-hosted service experience for growing and shrinking the data tier capacity and managing hotspots for sharded applications in situations that also involve movement of data. It builds on an underlying capability for moving shardlets on demand between different shards and integrates with shard map management to maintain consistent mappings and accurate data dependent routing connections. For details, see [Splitting and Merging with Elastic Scale](./sql-database-elastic-scale-overview-split-and-merge.md)




##Common Sharding Patterns

**Sharding** is a technique to distribute large amounts of identically-structured data across a number of independent databases. It is especially popular with cloud developers who are creating Software as a Service (SAAS) offerings for end customers or businesses. These end customers are often referred to as “Tenants”. Sharding may be required for any number of reasons: 

* The total amount of data is too large to fit within the constraints of a single database 
* The transaction throughput of the overall workload exceeds the capabilities of a single database 
* Tenants may require physical isolation from each other, so separate databases are needed for each tenant 
* Different sections of a database may need to reside in different geographies for compliance, performance or geopolitical reasons. 

In other scenarios, such as ingestion of data from distributed devices, sharding can be used to fill a set of databases that are organized temporally. For example, a separate database can be dedicated to each day or week. In that case, the sharding key can be an integer representing the date (present in all rows of the sharded tables) and queries retrieving information for a date range must be routed by the application to the subset of databases covering the range in question.
 
Sharding works best when every transaction in an application can be restricted to a single value of a sharding key. That ensures that all transactions will be local to a specific database. 

Some applications use the simplest approach of creating a separate database for each tenant. This is the **single tenant sharding pattern** that provides isolation, backup/restore ability and resource scaling at the granularity of the tenant. With single tenant sharding, each database is associated with a specific tenant ID value (or customer key value), but that key need not always be present in the data itself. It is the application’s responsibility to route each request to the appropriate database. 

![Single tenant versus multi-tenant][3]

Others scenarios pack multiple tenants together into databases, rather than isolating them into separate databases. This is a typical **multi-tenant sharding pattern** – and it may be driven by considerations of cost, efficiency or the fact that an application manages large numbers of very small tenants. In multi-tenant sharding, the rows in the database tables are all designed to carry a key identifying the tenant ID or sharding key. Again, the application tier is responsible for routing a tenant’s request to the appropriate database. 

[AZURE.INCLUDE [elastic-scale-include](../includes/elastic-scale-include.md)]

<!--Anchors-->
<!--Image references-->
[1]:./media/sql-database-elastic-scale-intro/overview.png
[2]:./media/sql-database-elastic-scale-intro/tenancy.png
[3]:./media/sql-database-elastic-scale-intro/single_v_multi_tenant.png
[4]:./media/sql-database-elastic-scale-intro/h_versus_vert.png
