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

Manage large deployments of databases using the elastic database pool and job features. If you have an app where every user is provided a Azure SQL database, such as a Software as a Service (SaaS) developer, the elastic pool feature gives you framework of a set number of Database Throughput Units (DTUs) that can be distributed to a set of databases in a pool. Set min and max DTUs and the pool automatically re-configures the databases dynamically. 

Elastic database tools help you build and manage applications that utilize sharding patterns to scale-out across many Azure SQL Databases.  Included are the elastic database client library supporting shard management, data-dependent routing, and cross-shard query capabilities for ADO.Net.  Also included is the split-merge tool that is delivered as an Azure service package for hosting within your own subscription. And now in preview is elastic database jobs -- allowing you to perform management operations across an entire set of databases at a time by invoking T-SQL scripts of your choice. Elastic database tools implement the infrastructure aspects of sharding while allowing you to focus on the business logic of your application instead.  

<object type="image/svg+xml" data="https://sidneyhcontent.blob.core.windows.net/documentation/ElasticScaleMapcoded.svg" width="100%" height="100%">
</object>
