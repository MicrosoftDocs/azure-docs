<properties title="Azure SQL Database Elastic Scale" pageTitle="Azure SQL Database Elastic Scale" description="Scale Azure SQL Database shards with elastic scale APIs, Azure elastic scale, SQL Federation Migration, about Azure SQL Elastic Scale" metaKeywords="sharding,elastic scale, Azure SQL DB sharding" services="sql-database" documentationCenter="sql-database" authors="sidneyh@microsoft.com"/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/02/2014" ms.author="sidneyh" />

#Azure SQL Database Elastic Scale 
Welcome to the Azure Database Elastic Scale Public Preview! 

###Promises and Challenges
Azure SQL Database Elastic Scale delivers on the promise of cloud computing and enables both virtually unbounded capacity as well as elasticity on the Azure SQL DB platform. To date, cloud service providers have been able to deliver on most aspects around boundless capacity of compute and state-less blob storage. Elasticity, however, still remains a challenge when it comes to stateful data processing in the cloud, particularly with relational database management. We have seen these challenges emerge most prominently in the two following scenarios: 

* Growing and shrinking capacity for the relational database part of your workload.
* Management of utilization hotspots for stateful database workloads and their data.

Traditionally, these scenarios are addressed by buying more hardware that hosts the data tier of the application. However, this option is limited in the cloud where all processing happens on predefined commodity hardware. Sharding, or the distribution of data and processing across several scale units for capacity reasons, provides a compelling alternative to traditional scale-up approaches both in terms of cost and elasticity. Over the course of several years, we found customers must implement their own scale-out approaches on top of Azure SQL DB to be successful with sharding. For some, this meant managing hundreds or thousands of Azure SQL databases. That meant lots of code in their data tier that dealt with the intricacies of sharding rather than the business logic of the application. 

Working directly with customers over the years, we have seen several patterns for sharding emerge from these projects. Azure SQL Database Elastic Scale provides client libraries and service offerings around these patterns. Elastic scale allows you to more easily develop, scale and manage the stateful data tiers of your Azure applications.

You can then focus on the business logic of your application rather than building infrastructure for sharding.  


##Capabilities 

Developing, scaling and managing scaled-out applications using sharding presents challenges for both the developer as well as for the administrator. Azure SQL DB Elastic Scale makes life easier for both these roles. The numbers in the graphic outline the main capabilities delivered with this public preview release. 
The lower part shows the data tier of the application and the distribution of its data across several databases, called shards. Assume that multiple databases are storing the data for several shards. 


###Elastic Scale with Sharding 

![][1]

The figure shows the developer and the administrator on the left and right. Customers can expect to get full T-SQL functionality when submitting shard-local operations as opposed to cross-shard operations that have their own semantics. Note that there is a [glossary](./elastic-scale-glossary) that will help you get up to speed with Elastic Scale terminology. 

The public preview release for Azure SQL Database Elastic Scale makes developing sharded Azure SQL DB applications easier through the following specific capabilities: 

* **Shard Map Management (SMM)**: Shard map management (Number 1 in the figure) is the ability for an application to manage various metadata about its shards. This release introduces shard map management with its Elastic Scale client library. Developers can use this functionality to register shards, describe mappings of individual sharding keys or key ranges to shards, and maintain this metadata as the layout of shards in the data tier evolves to reflect capacity changes. Shard map management constitutes a big part of boiler-plate code that customers had to write in their applications when they were implementing sharding themselves. 
* **Data Dependent Routing (DDR)**: Imagine a request coming into the application. Based on the sharding key value of the request, the application needs to determine the correct shard that holds the data for this sharding key value, and then open a connection to this shard (Number 2 in the figure) to process the request. DDR provides the ability to open connections with a single easy call into the shard map of the application. DDR was another area of infrastructure code that is now covered by functionality in the Elastic Scale client library.
* 
* **Multi-Shard Queries (MSQ)**: Multi-shard querying works when processing of the request involves several (or even all) shards. A multi-shard query (Number 3 in the figure) executes the same T-SQL code on all shards or a set of shards. The results from the participating shards are merged into an overall result set using UNION ALL semantics. The functionality is exposed through the client library and the library takes care of many tasks, including: connection management, thread management, fault handling and intermediate results processing. MSQ is designed for querying tens up to hundreds of shards. 

* **Shard Elasticity (SE)**: This sample capability aids administrators that need to change the capacity of a single shard (Number 4 in the figure). This works by changing the Azure SQL DB edition is used to address a hotspot or under-utilization on a given shard. For example, the edition can be temporarily changed from standard to premium. This release illustrates how edition changes can be automated based on simple, extensible policies.

* **Split/Merge Service**: When capacity needs fluctuate in tandem with business momentum, applications need to flexibly re-distribute data across a number of databases. Elastic scale provides a customer-hosted service experience for growing and shrinking the data tier capacity and managing hotspots for sharded applications in situations that also involve movement of data. It builds on an underlying capability for moving shardlets on demand between different shards and integrates with shard map management to maintain consistent mappings and accurate data dependent routing connections. 


<!--Anchors-->

<!--Image references-->
[1]: ./media/elastic-scale-intro/overview.png
