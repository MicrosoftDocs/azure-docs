<properties 
   pageTitle="Azure SQL Database FAQ" 
   description="Answers to common questions customers ask about cloud databases and Azure SQL Database, Microsoft's relational database management system (RDBMS) in the cloud." 
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
   ms.date="10/23/2015"
   ms.author="jeffreyg"/>

# SQL Database FAQ

## How does the usage of SQL Database show up on my bill? 
SQL Databasee bills on a predictable hourly rate based on either the service tier + performance level or elastic database pool size. Actual usage is computed and pro-rated hourly, so your bill might show fractions of an hour. For example, if a database exists for 12 hours in a month, your bill will show usage of 0.5 days. Additionally, service tiers and performance level and elastic database eDTUs are broken out in the bill to make it easier to see the number of database days you incurred in a single month for each.

## What if a single database is active for less than an hour or uses a higher service tier for less than an hour?
You are billed for each hour a database exists using the highest performance level or eDTU pool size that applied during that hour, regardless of usage or whether the database was active for less than an hour. For example, if you create a database and delete it 5 minutes later your bill will reflect a charge for 1 database hour. 

Examples
	
- If you create a Basic database and then immediately upgrade it to Standard S1, you are charged at the Standard S1 rate for the first hour.

- If you upgrade a database from Basic to Premium at 10:00 p.m. and upgrade completes at 1:35 a.m. on the following day, you are charged at the Premium rate starting at 1:00 a.m. 

- If you downgrade a database from Premium to Basic at 11:00 a.m. and it completes at 2:15 p.m., then the database will be charged at the Premium rate until 3:00 p.m. when the downgrade is complete, and will then be charged at the Standard or Basic rates.

## How does the use of the auditing feature impact my bill? 
Auditing is built into the SQL Database service at no extra cost and is available to Basic, Standard, and Premium databases. However, to store the audit logs, the auditing feature uses an Azure Storage account, and rates for tables and queues in Azure Storage apply based on the size of your audit log. GUY TO CONFIRM STORAGE ACCOUNT TYPE?

## How do I figure out the right service tier and performance level for single databases and elastic databases? 
There are a few tools available to you. 

- For on-premises databases, use the [DTU sizing advisor](http://dtucalculator.azurewebsites.net/), which will recommend databases and  DTUs required, and will evaluate multiple databases for elastic database pools.
- If a single database would benefit from being in a pool, Azure's intelligent recommendation engine will recommend an elastic database pool if it sees an historical usage pattern that warrants it. See [recommend elastic database pools](https://azure.microsoft.com/en-us/documentation/articles/sql-database-elastic-pool-portal/#recommended-elastic-database-pools) to see how this works. For details about how to do the math yourself, see [Price and performance considerations for an elastic database pool](https://azure.microsoft.com/en-us/documentation/articles/sql-database-elastic-pool-guidance/)
- To see whether you need to dial a single database up or down, see [performance guidance for single databases](https://azure.microsoft.com/en-us/documentation/articles/sql-database-performance-guidance/).

## How often can I change the service tier or performance level of a single database? 
You can change the service tier (between Basic, Standard, and Premium) or the performance level within a service tier (for example S1 to S2) a total of four times in a 24-hour period.

##How often can I adjust the number of elastic DTUs allocated to a database pool? 
The number of elastic DTUs allocated to a database pool can be adjusted once per day.

## How long does it take to change the service tier or performance level of a single database or move a database in and out of an elastic database pool? 
Changing the service tier of a database and moving in and out of a pool requires the database to be copied on the platform as a background operation. This can take from a few minutes to several hours depending on the size of the database. In both cases, the database remains online and available during the move.  For more details see [Elastic pool reference] (https://azure.microsoft.com/en-us/documentation/articles/sql-database-elastic-pool-reference/#latency-of-elastic-pool-operations) 

##When should I use SQL Database elastic databases vs single database? 
Software-as-a-service (SaaS) providers often have challenges handling large numbers of databases. One architectural pattern for SaaS applications is to create one database per customer. Purchasing individual databases and overprovisioning to meet the variable and peak demand for each database is often not cost efficient, and managing many databases presents its own set of challenges. Microsoft designed the elastic database model to address this need and help you manage workloads with unpredictable resource demands across a large number of databases.

## What does it mean to have up to 200% of your maximum provisioned database storage for backup storage? 
Backup storage is the storage associated with your automated database backups that are used for Point-In-Time-Restore and Geo-Restore. Microsoft Azure SQL Database provides up to 200% of your maximum provisioned database storage of backup storage at no additional cost. For example, if you have a Standard DB instance with a provisioned DB size of 250 GB, you will be provided with 500 GB of backup storage at no additional charge. If your database exceeds the provided backup storage, you can choose to reduce the retention period by contacting Azure Support or pay for the extra backup storage billed at standard Read-Access Geographically Redundant Storage (RA-GRS) rate. For more information on RA-GRS billing, see Storage Pricing Details.



