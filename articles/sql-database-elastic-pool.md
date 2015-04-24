<properties 
	pageTitle="Azure SQL Database elastic pool" 
	description="An elastic pool is a collection of available resources that are shared by a group of databases." 
	services="sql-database" 
	documentationCenter="" 
	authors="stevestein" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="04/23/2015" 
	ms.author="sstein" 
	ms.workload="data-management" 
	ms.topic="article" 
	ms.tgt_pltfrm="NA"/>


# Azure SQL Database elastic pool (preview)

An elastic pool is a collection of available resources that are shared by a group of databases. This ability to share resources accommodates unpredictable periods of increased activity for the databases in the pool that need it, while at the same time, provides a guaranteed amount of resources for all databases to reliably accommodate the average use for each database. Additionally, elastic pools simplify data application management by providing the ability to easily execute scripts across all databases in a pool with elastic jobs.

> [AZURE.NOTE] Elastic pools are currently in preview, and only available with V12 SQL Database Servers. For this preview, elastic pools can only be set to the elastic standard pricing tier, and you can only configure and manage elastic pools using the Microsoft Azure Portal, PowerShell, and REST APIs.

## Overview

An elastic pool is a collection of database throughput units (DTUs), and storage (GBs) that are shared by multiple databases. Databases can be added to, and removed from the pool at any time. The databases in the pool utilize only the resources they require from the pool freeing up available resources for only the active databases that need them.

For SaaS developers who have tens, hundreds, or even thousands of databases, a common application pattern is for each database to have different customers with varying and unpredictable usage patterns. Trying to predict the resource requirements for individual databases is difficult, if not impossible. Attempts to account for this unpredictable usage pattern results in either over-provisioning databases (at great expense), or under-provisioning resources and risking a poor performance experience for customers. 

Elastic pools address this problem by providing performance adaptability for the entire group of databases, while also providing the ability to control price within a set budget. Instead of over-provisioning individual databases, and paying for resources that sit idle, you allocate resources to the pool and pay for the aggregate resources required for the entire group of databases.

For example, with SaaS applications that host a large number of databases, it is common to have only a subset of databases concurrently active at any given time. The actual databases that are simultaneously active change unpredictably over time. By sharing resources in an elastic pool, the databases with increased activity are accommodated while also maintaining a guaranteed level of resources for all other databases in the pool. 

## Easily Manage large numbers of databases

Elastic pools make SaaS application development easier by providing tools that simplify building and managing your data-tier. Performing maintenance tasks and implementing changes across a large set of databases, a historically time-consuming and complex process, has been reduced to running scripts in elastic jobs. The ability to create and run an elastic job eliminates most all of the heavy lifting associated with administering hundreds or even thousands of databases.  


Sidney...?




## Elastic pool (preview) settings and limitations

The Performance of an elastic pool is controlled by setting the amount of DTUs and GB storage available to the entire pool, and setting the available (or elastic) DTU range (min and max) for the databases.

*The current preview is constrained with the following limitations:*


### DTU and storage limits


| property | default value | valid values |
| :-- | :-- | :-- |
| Dtu | 200 | 200, 400, 800, 1200 |
| databaseDtuMax | 100 | 10, 20, 50 100 |
| databaseDtuMin | 0 | 0, 10, 20, 50 |
| storageMB | 200 GB*  | 200 GB, 400 GB, 800 GB, 1200 GB |

*units in API are MB, not GB

### Worker and session limits

The maximum number of concurrent workers and concurrent sessions supported for all databases in an elastic pool depends on the DTU setting for the pool: 

| DTUs | Max concurrent workers | Max concurrent sessions |
| :-- | :-- | :-- |
| 200 | 400 | 4,800 |
| 400 | 800 | 9,600 |
| 800 | 1,600 | 19,200 |
| 1,200 | 2,400 | 28,800 |


### Azure Resource Manager limitations

An elastic pool requires an Azure SQL Server (V12), that requires a resource group.

- Each resource group can have a maximum 800 servers.
- Each server can have a maximum 800 elastic pools.
- Each elastic pool can have a maximum 100 databases.




## Elastic pool preview limitations and considerations






Elastic pools are only available in SQL Database V12 servers.   
Elastic pools are supported in the [Azure portal](https://portal.azure.com) only, the [classic portal](https://manage.windowsazure.com) is not supported. 
PowerShell and REST API for elastic pools are supported on Azure Resource Manager (ARM) only; Azure Service Management cmdlets and APIs are not supported.





## Summary
Elastic pools provide a collection of resources to share across a group of databases. Sharing a single resource pool for a group of databases with widely varying usage patterns provides large scale SaaS cloud service vendors a simple mechanism to .   
   







<!--Image references-->
[1]: ./media/sql-database-elastic-pool/new-elastic-pool.png



