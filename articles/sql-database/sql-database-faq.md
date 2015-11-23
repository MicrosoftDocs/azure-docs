<properties 
   pageTitle="Azure SQL Database FAQ" 
   description="Answers to common questions customers ask about cloud databases and Azure SQL Database, Microsoft's relational database management system (RDBMS) and database as a service in the cloud." 
   services="sql-database" 
   documentationCenter="" 
   authors="jeffgoll" 
   manager="jeffreyg" 
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management" 
   ms.date="11/11/2015"
   ms.author="jeffreyg"/>

# SQL Database FAQ

## How does the usage of SQL Database show up on my bill? 
SQL Database bills on a predictable hourly rate based on both the service tier + performance level for single databases or eDTUs per elastic database pool. Actual usage is computed and pro-rated hourly, so your bill might show fractions of an hour. For example, if a database exists for 12 hours in a month, your bill will show usage of 0.5 days. Additionally, service tiers + performance level and eDTUs per pool are broken out in the bill to make it easier to see the number of database days you used for each in a single month.

## What if a single database is active for less than an hour or uses a higher service tier for less than an hour?
You are billed for each hour a database exists using the highest service tier + performance level that applied during that hour, regardless of usage or whether the database was active for less than an hour. For example, if you create a single database and delete it 5 minutes later your bill will reflect a charge for 1 database hour. 

Examples
	
- If you create a Basic database and then immediately upgrade it to Standard S1, you are charged at the Standard S1 rate for the first hour.

- If you upgrade a database from Basic to Premium at 10:00 p.m. and upgrade completes at 1:35 a.m. on the following day, you are charged at the Premium rate starting at 1:00 a.m. 

- If you downgrade a database from Premium to Basic at 11:00 a.m. and it completes at 2:15 p.m., then the database will be charged at the Premium rate until 3:00 p.m., after which it is charged at the Basic rates.

## How does elastic database pool usage show up on my bill and what happens when I change eDTUs per pool?
Elastic database pool charges show up on your bill as Elastic DTUs (eDTUs) in the increments shown under eDTUs per pool on [the pricing page](https://azure.microsoft.com/pricing/details/sql-database/). There is no per-database charge for elastic database pools. You are billed for each hour a pool exists at the highest eDTU, regardless of usage or whether the pool was active for less than an hour. 

Examples

- If you create a Standard elastic database pool with 200 eDTUs at 11:18 a.m., adding five databases to the pool, you will be charged for 200 eDTUs for the whole hour, beginning at 11 a.m. through the remainder of the day.
- On Day 2, at 5:05 a.m., Database 1 begins consuming 50 eDTUs and holds steady through the day. Databases 2-5 fluctuate between 0 and 80 eDTUs. During the day, you add five other databases that consume varying eDTUs throughout the day. Day 2 is a full day billed at 200 eDTU. 
- On Day 3, at 5 a.m. you add another 15 databases. Database usage increases throughout the day to the point where you decide to increase eDTUs for the pool from 200 to 400 at 8:05 p.m. Charges at the 200 eDTU level were in effect until 8 pm and increases to 400 eDTUs for the remaining 4. 

## How does the use of Geo-replication in an elastic database pool show up on my bill?
Unlike single databases, using GEO-DR with elastic databases doesn't have a direct billing impact.  You are only charged for the eDTUs provisioned for each of the pools (primary pool and secondary pool)

## How does the use of the auditing feature impact my bill? 
Auditing is built into the SQL Database service at no extra cost and is available to Basic, Standard, and Premium databases. However, to store the audit logs, the auditing feature uses an Azure Storage account, and rates for tables and queues in Azure Storage apply based on the size of your audit log.

## How do I find the right service tier and performance level for single databases and elastic database pools? 
There are a few tools available to you. 

- For on-premises databases, use the [DTU sizing advisor](http://dtucalculator.azurewebsites.net/), which will recommend databases and  DTUs required, and will evaluate multiple databases for elastic database pools.
- If a single database would benefit from being in a pool, Azure's intelligent engine will recommend an elastic database pool if it sees an historical usage pattern that warrants it. See [recommended elastic database pools](sql-database-elastic-pool-portal.md#recommended-elastic-database-pools) to see how this works. For details about how to do the math yourself, see [Price and performance considerations for an elastic database pool](sql-database-elastic-pool-guidance.md)
- To see whether you need to dial a single database up or down, see [performance guidance for single databases](sql-database-performance-guidance.md).

## How often can I change the service tier or performance level of a single database? 
With V12 databases you can change the service tier (between Basic, Standard, and Premium) or the performance level within a service tier (for example, S1 to S2) as often as you want. For earlier version databases, you can change the service tier or performance level a total of four times in a 24-hour period.

##How often can I adjust the eDTUs per pool? 
As often as you want.

## How long does it take to change the service tier or performance level of a single database or move a database in and out of an elastic database pool? 
Changing the service tier of a database and moving in and out of a pool requires the database to be copied on the platform as a background operation. This can take from a few minutes to several hours depending on the size of the databases. In both cases, the databases remain online and available during the move. For details on changing single databases see [Change the service tier of a database](sql-database-scale-up.md). For elastic databases, see [Elastic pool reference](sql-database-elastic-pool-reference.md#latency-of-elastic-pool-operations) 

##When should I use a single database vs. elastic databases? 
In general, elastic database pools are designed for a typical software-as-a-service (SaaS) application pattern, where there is one database per customer or tenant. Purchasing individual databases and overprovisioning to meet the variable and peak demand for each database is often not cost efficient. With pools, you manage the collective performance of the pool, and the databases scale up and down automatically. 

Azure's intelligent engine will recommend a pool for databases if it sees a usage pattern that warrants it. For details, see [Recommended elastic database pools](sql-database-elastic-pool-portal.md#recommended-elastic-database-pools). For detailed guidance about choosing between single and elastic databases, see [Price and performance considerations for elastic database pools](sql-database-elastic-pool-guidance.md).

## What does it mean to have up to 200% of your maximum provisioned database storage for backup storage? 
Backup storage is the storage associated with your automated database backups that are used for Point-In-Time-Restore and Geo-Restore. Microsoft Azure SQL Database provides up to 200% of your maximum provisioned database storage of backup storage at no additional cost. For example, if you have a Standard DB instance with a provisioned DB size of 250 GB, you will be provided with 500 GB of backup storage at no additional charge. If your database exceeds the provided backup storage, you can choose to reduce the retention period by contacting Azure Support or pay for the extra backup storage billed at standard Read-Access Geographically Redundant Storage (RA-GRS) rate. For more information on RA-GRS billing, see Storage Pricing Details.

## I'm moving from Web/Business to the new service tiers, what do I need to know?
Azure SQL Web and Business databases are now retired. The Basic, Standard, Premium, and Elastic tiers replace the retiring Web and Business databases. We've additional FAQ that should help you in this transition period. [Web and Business Edition sunset FAQ](sql-database-web-business-sunset-faq.md)

