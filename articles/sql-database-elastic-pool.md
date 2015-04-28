<properties 
	pageTitle="Azure SQL Database elastic database pool (preview)" 
	description="An elastic database pool is a collection of available resources that are shared by a group of elastic databases." 
	services="sql-database" 
	documentationCenter="" 
	authors="stevestein" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="04/27/2015" 
	ms.author="sstein" 
	ms.workload="data-management" 
	ms.topic="article" 
	ms.tgt_pltfrm="NA"/>


# Azure SQL Database elastic database pool (preview)

For SaaS developers who have tens, hundreds, or even thousands of databases, an elastic database pool simplifies the process of creating, maintaining, and managing both performance and cost across the entire group of databases. 

An elastic pool is a collection of available resources that are shared by a group of databases. This ability to share resources accommodates unpredictable periods of increased activity for the databases in the pool that need it, while at the same time, provides a guaranteed amount of resources for all databases to reliably accommodate each database's average workload. Additionally, elastic pools simplify data application management by providing the ability to easily execute scripts across all databases in a pool with elastic jobs.

> [AZURE.NOTE] Elastic database pools are currently in preview, and only available with  SQL Database V12 Servers. For this preview, elastic pools can only be set to the Standard pricing tier, and you can only configure and manage elastic pools using the [Microsoft Azure Portal](https://portal.azure.com), PowerShell, and REST APIs.

## Overview

An elastic database pool is a collection of database throughput units (DTUs), and storage (GBs) that are shared by multiple databases. Databases can be added to, and removed from the pool at any time. The databases in the pool utilize only the resources they require from the pool freeing up available resources for only the active databases that need them.

For SaaS developers who have large numbers of databases, a common application pattern is for each database to have different customers with varying and unpredictable usage patterns. Trying to predict the resource requirements for individual databases is difficult, if not impossible. Attempts to account for this unpredictable usage pattern results in either over-provisioning databases (at great expense), or under-provisioning resources and risking a poor performance experience for customers. 

Elastic pools address this problem by providing performance adaptability for the entire group of databases, while also providing the ability to control price within a set budget. Instead of over-provisioning individual databases and paying for resources that sit idle, you allocate resources to the pool and pay for the aggregate resources required for the entire group of databases.

For example, with SaaS applications that host a large number of databases, it is common to have only a subset of databases concurrently active at any given time. The actual databases that are simultaneously active change unpredictably over time. By sharing resources in a pool, the databases with increased activity are accommodated while also maintaining a guaranteed level of resources for all other databases in the pool. 

## Easily manage large numbers of databases

Elastic pools make SaaS application development easier by providing tools that simplify building and managing your data-tier. Performing maintenance tasks and implementing changes across a large set of databases, a historically time-consuming and complex process, has been reduced to running scripts in elastic jobs. The ability to create and run an elastic job eliminates most all of the heavy lifting associated with administering hundreds or even thousands of databases.  

## Business continuity features for elastic databases

Currently in the preview, elastic databases (in the elastic standard tier) support most features that are available to Standard tier databases except for Geo-Replication (which is not supported in the current preview).

### Backing up and restoring databases (Point in Time Restore)

Databases in elastic pools are backed up automatically by the system and the backup retention policy is the same as Standard tier databases. During preview, a live database in a pool will be restored as a new database in the same pool; while a dropped database will always be restored as a database outside any pool as Standard S0 databases.  
You can perform database restore operations through the Azure Portal or programmatically using REST API. PowerShell cmdlets should be available later in the preview.

### Geo-Restore
Geo-Restore allows you to recover a database in a pool to a server in a different region. During the preview, to restore a database in a pool on a different server, the target server needs to have a pool with the same name as the source pool. If needed, create a new elastic pool on the target server and give it the same name prior to restoring the database. If a pool with the same name on the target server doesn’t exist the Geo-Restore operation will fail.
You can perform Geo-Restore operations using the Azure Portal or REST API, PowerShell cmdlets support should be available later in the preview.



## Get started creating elastic databases and elastic jobs

You can create an elastic pool in minutes using the Microsoft Azure portal. For details, see [Create an Azure SQL Database elastic database pool in the Microsoft Azure portal](sql-database-elastic-pool-portal.md).

You can also create elastic pools programmatically using PowerShell cmdlets. For details, see [Create an Azure SQL Database elastic database pool using PowerShell](sql-database-elastic-pool-powershell.md).

For information about the elastic jobs service that enables running T-SQL scripts across all elastic databases in a pool, see [Elastic database jobs overview](sql-database-elastic-jobs-overview.md).



## Summary

Elastic pools provide a collection of resources to share across a group of databases. Sharing resources in an elastic database pool provides SaaS ISVs a simple way to manage and administer large groups of databases with widely varying usage patterns.   
   

## Elastic database pool reference

For more information about elastic databases and elastic database pools, including API and error details, see [Elastic database pool reference](sql-database-elastic-pool-reference.md).







