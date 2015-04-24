<properties 
	pageTitle="Azure SQL Database Elastic Scale" 
	description="Documentation map, a visual table of contents for Elastic Scale feature of Azure SQL DB" 
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

# Azure SQL Database elastic database topics

Manage large deployments of databases using the elastic database pool and job features (both in preview). If you have an app where every user is provided an Azure SQL database—a common scenario for a Software as a Service (SaaS) developer—the elastic pool provides immediate advantages. The pool enables predictable pricing with guaranteed performance characteristics for any number of databases. The job feature gives you an easy and reliable tool for upgrading and managing every database in the pool with T-SQL scripts.  

Elastic database tools include a client library and the split-merge tool. These help you build and manage applications that use sharding to scale-out across Azure SQL databases. The elastic database client library enables: shard management, data-dependent routing, and cross-shard query capabilities for ADO.Net. The split-merge tool lets you easily move data from one shard to another by splitting rows from one shard, and joining them to another. Elastic database tools tackle the infrastructure details of sharding while you focus on your app's business logic.  

<object type="image/svg+xml" data="https://sidneyhcontent.blob.core.windows.net/documentation/ElasticScaleMapcoded.svg" width="100%" height="100%">
</object>
