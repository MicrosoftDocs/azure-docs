<properties
    pageTitle="Azure SQL Database - client library"
    description="Build scalable .NET database apps"
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
    ms.date="07/29/2015"
    ms.author="sidneyh"/>

# Elastic Database client library overview

The **Elastic Database client library** helps you easily develop sharded applications using hundreds—or even thousands—of Azure SQL databases hosted on Microsoft Azure. Such designs are commonly used for Software as a Service (SaaS) applications, which are typically single tenant architectures--where each tenant is provisioned with a database. Building and managing such an application is a goal of the library. The client library is a .NET Framework library that can be installed into any application project using [Visual Studio](sql-database-elastic-scale-add-references-visual-studio.md) and [Nuget](http://go.microsoft.com/?linkid=9862605). The client library is part of Elastic Database tools which is specifically an [Elastic Database feature](sql-database-elastic-scale-introduction.md). 

## Client capabilities

Developing, scaling and managing scaled-out applications using *sharding* (discussed below) presents challenges for both the developer as well as the administrator. The client library make life easier for both these roles. The figure below outline the main capabilities delivered by the Elastic Database client library. The figure illustrates an environment with many databases, and each database corresponds to a shard. In this example, many customers are co-located in the same database using a range map, although the same applies if there is a database per customer (tenant). The tools make developing sharded Azure SQL Database applications easier through the following specific capabilities:

For definitions of terms used here, see [Elastic database tools glossary](sql-database-elastic-scale-glossary.md).

![Elastic scale capabilities][1]

1.  **Shard Map Management**: To manage an collection of shards, a speical database called the "shard map manager" is created. Shard map management is the ability for an application to manage various metadata about its shards. Developers can use this functionality to register databases as shards, describe mappings of individual sharding keys or key ranges to those databases, and maintain this metadata as the number and composition of databases evolves to reflect capacity changes. Without the elastic database client library, you would need to spend a lot of time writing the management code when implementing sharding. For details, see [Shard map management](sql-database-elastic-scale-shard-map-management.md).

* **Data dependent routing**: Imagine a request coming into the application. Based on the sharding key value of the request, the application needs to determine the correct database that holds the data for this key value, and then open a connection to it to process the request. Data dependent routing provides the ability to open connections with a single easy call into the shard map of the application. Data dependent routing was another area of infrastructure code that is now covered by functionality in the elastic database client library. For details, see [Data dependent routing](sql-database-elastic-scale-data-dependent-routing.md).

* **Multi-shard queries (MSQ)**: Multi-shard querying works when a request involves several (or all) shards. A multi-shard query executes the same T-SQL code on all shards or a set of shards. The results from the participating shards are merged into an overall result set using UNION ALL semantics. The functionality as exposed through the client library handles many tasks, including: connection management, thread management, fault handling and intermediate results processing. MSQ can query up to hundreds of shards. For details, see [Multi-shard querying](sql-database-elastic-scale-multishard-querying.md).

In general, customers using elastic database tools can expect to get full T-SQL functionality when submitting shard-local operations as opposed to cross-shard operations that have their own semantics.

## Next steps

Try the [sample app](sql-database-elastic-scale-get-started.md) which demonstrates the client functions. 

To install the library, go to [Elastic Database Client Library]( http://www.nuget.org/packages/Microsoft.Azure.SqlDatabase.ElasticScale.Client/).

For instructions on using the split-merge tool, see the [split-merge tool overview](sql-database-elastic-scale-overview-split-and-merge.md).


[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]

<!--Anchors-->
<!--Image references-->
[1]:./media/sql-database-elastic-database-client-library/glossary.png

