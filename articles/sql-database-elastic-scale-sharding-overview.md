<properties pageTitle="Sharding Overview" description="Reasons for sharding: scale database resources to increase availability or performance." services="sql-database" documentationCenter="" manager="jhubbard" authors="sidneyh" editor=""/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/02/2014" ms.author="sidneyh"/>
#Sharding Overview 

##Principles of Sharding 

**Sharding** is a technique to distribute large amounts of identically-structured data across a number of independent databases. It is especially popular with cloud developers who are creating Software as a Service (SAAS) offerings for end customers or businesses. These end customers are often referred to as “Tenants”. Sharding may be required for any number of reasons: 

* The total amount of data is too large to fit within the constraints of a single database 
* The transaction throughput of the overall workload exceeds the capabilities of a single database 
* Tenants may require physical isolation from each other, so separate databases are needed for each tenant 
* Different sections of a database may need to reside in different geographies for compliance, performance or geopolitical reasons. 
 
Sharding works best when every transaction in an application can be restricted to a single value of a sharding key. That ensures that all transactions will be local to a specific database. 

Some applications use the simplest approach of creating a separate database for each tenant. This is the **single tenant sharding pattern** that provides isolation, backup/restore ability and resource scaling at the granularity of the tenant. With single tenant sharding, each database is associated with a specific tenant ID value (or customer key value), but that key need not always be present in the data itself. It is the application’s responsibility to route each request to the appropriate database. 

![][1]

Others scenarios pack multiple tenants together into databases, rather than isolating them into separate databases. This is a typical **multi-tenant sharding pattern** – and it may be driven by considerations of cost, efficiency or the fact that an application manages large numbers of very small tenants. In multi-tenant sharding, the rows in the database tables are all designed to carry a key identifying the tenant ID or sharding key. Again, the application tier is responsible for routing a tenant’s request to the appropriate database. 

In other scenarios, such as ingestion of data from distributed devices, sharding can be used to fill a set of databases distributed by a time period. For example, a separate database can be dedicated to each day or week. In that case, the sharding key can be an integer representing the date (present in all rows of the sharded tables) and queries retrieving information for a date range must be routed by the application to the subset of databases covering the range in question.

Regardless of the sharding model being used, a special data structure, known as a **shard map**, serves as a look-up table associating sharding key values with databases; this enables the application to perform the routing for database requests. This is referred to as **data-dependent routing** and is a core capability needed for an application to use a sharded data tier. The [Elastic Scale client APIs](http://go.microsoft.com/?linkid=9862592) provide a rich set of functionality necessary for [managing shard maps](http://go.microsoft.com/?linkid=9862595) and enabling efficient, easy-to-use [Data-depenendent routing capabilities](http://go.microsoft.com/?linkid=9862596) in an application. 

[AZURE.INCLUDE [elastic-scale-include](../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-scale-sharding-overview/tenancy.png
