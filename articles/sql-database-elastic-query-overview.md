<properties 
	title="Elastic database query – previewing May 2015" 
	pageTitle="Elastic database query – previewing May 2015" 
	description="Announces the elastic query feature" 
	metaKeywords="azure sql database elastic global queries" 
	services="sql-database" 
	documentationCenter=""  
	manager="jeffreyg" 
	authors="sidneyh"/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/29/2015" 
	ms.author="sidneyh" />

# Elastic database query – previewing May 2015 

Elastic database query is a new feature of Azure SQL Database previewing in late May 2015. It introduces the ability to run a T-SQL query that spans across multiple databases using a single connection to an Azure SQL database. This allows a sharded set of data, defined using an elastic database shard map, to appear as a single integrated data store. Used for reporting and data integration purposes, all distributed query processing is handled behind the scenes. Connections are supported using any driver capable of communicating with SQL Database including ADO.Net, ODBC, JDBC, Node.js, PHP, etc.

## Elastic database query scenarios

The goal of elastic database query is to facilitate reporting scenarios across a sharded data tier where multiple databases or shards contribute rows into a single overall result of a T-SQL query. The T-SQL query can either be composed by the user or application directly, or indirectly through tools that are connected to the global query elastic query database. This is especially useful for commercial BI, reporting, or data integration tools,  packaged software that cannot be extended directly using the elastic scale libraries. It also allows easy access to an entire collection of sharded data through queries issued by SQL Server Management Studio or Visual Studio, and supports transparent multi-shard data access from Entity Framework or other ORM environments. Figure 1 illustrates this scenario where global query elastic DB query offers a second, different avenue to submit queries to the sharded data tier in addition to the existing cloud application (which may use the elastic scale libraries).

![Elastic database queries][1]

Scenarios can be characterized by the following topologies:

-	Sharded data tier (topology 1): The data tier has been designed for sharding. The sharding is performed and managed using (1) the elastic database client library or (2) self-sharding. The reporting case is to compute reports across many shards with functional or connectivity requirement beyond what multi-shard query in the elastic database client library can accomplish. 

-	Multi-database design (topology 2): Here, the data tier has been partitioned vertically such that different kinds of data reside on different databases. The reporting case is to calculate reports over data that is distributed over multiple databases but must be integrated into one overall result for the report.

Elastic database query preview will cover both cases. Customers with topology 1 can rely on their existing shard map if they are using the elastic database client library to manage shards. Self sharders in turn will need to create a shard map using elastic database tools for their data tiers in order to use this preview capability. Customers following topology 2 need to create a different shard map for each of their databases. These shard maps will each point to only a single shard that can then expose its tables for cross-shard queries.

## Next steps
Elastic database query is scheduled for preview at the end of May 2015. Check back to this page for more details and step-by-step instructions on how to use the feature at that time.

[AZURE.INCLUDE [elastic-scale-include](../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-query-overview/overview.png
<!--anchors-->

