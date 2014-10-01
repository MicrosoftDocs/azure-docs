<properties title="Azure SQL Database Elastic Scale" pageTitle="Azure SQL Database Elastic Scale" description="Azure SQL Database Elastic Scale, sharding, ShardMapManager, Shard Map,  Split Merge Shards" metaKeywords="sharding scaling, Azure SQL DB sharding, elastic scale" services="sql-database" documentationCenter="sql-database" authors="sidneyh@microsoft.com"/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/02/2014" ms.author="sidneyh" />

# Azure SQL Database Elastic Scale Topics
Azure SQL Database Elastic Scale (in preview) enables the data-tier of an application to scale out and in via industry-standard sharding practices, while significantly streamlining the development and management of your sharded cloud applications. Elastic Scale delivers both developer and management functionality which are provided through a set of .Net libraries and through Azure service templates that you can host in your own Azure subscription to manage your highly scalable applications. Azure DB Elastic Scale implements the infrastructure aspects of sharding and thus allows you to focus on the business logic of your application instead. 

## Tell Me About Azure Elastic Scale

1. [Get Started with Azure SQL Database Elastic Scale](./sql-database-elastic-scale-get-started.md)
2. [Azure SQL Database Elastic Scale](./sql-database-elastic-scale-introduction.md)
3. [Elastic Scale Glossary](./sql-database-elastic-scale-glossary.md)


## Explore Elastic Scale
1. What is a Shard Map? 
	* [Shard Map Management](./sql-database-elastic-scale-shard-map-management.md)
2. What is Data Dependent Routing?
	* [Data Dependent Routing](./sql-database-elastic-scale-data-dependent-routing.md)	
3. How do I add a shard for new data?
	* [Adding a Shard to an Elastic Scale Application](./sql-database-elasic-scale-add-a-shard.md)
4.  What is Multi-Shard Querying?
	* [Multi-Shard Querying](./sql-database-elastic-scale-multishard-querying.md)
5.   How do I split or merge a shard?
	* [Spliting and Merging Shards with Elastic Scale](./sql-database-elastic-scale-overview-split-and-merge.md)
6. What is Shard Elasticity?
	* [Shard Elasticity](./sql-database-elastic-scale-elasticity.md)

## Run Samples
1. [Entity Framework Integration](./sql-database-elastic-scale-use-entity-framework-applications-visual-studio.md)
2. [Federations Migration](./sql-database-elastic-scale-federation-migration.md)
3. [Shard Elasticity Scripts](./sql-database-elastic-scale-elasticity.md)
4. [Shard SQL Commands](http://go.microsoft.com/?linkid=9862617)

## APIs
1. [How To: Add Azure SQL DB Elastic Scale References to a Visual Studio Project](./sql-database-elastic-scale-add-references-visual-studio.md)
3. [How to: Add Elastic Scale References to a Visual Studio Project](sql-database-elastic-scale-add-references-visual-studio)
2. [Elastic Scale API Reference](http://go.microsoft.com/?linkid=9862604)

## Dive in?
	
Management Services

* [Elastic Scale Security Considerations](./sql-database-elastic-scale-configure-security.md)
* [Managing Elastic Scale Credentials](./sql-database-elastic-scale-manage-credentials.md)
* [Azure SQL Database Split and Merge Service Tutorial](./sql-database-elastic-scale-configure-deploy-split-and-merge.md)