---
title: Azure SQL Database FAQ | Microsoft Docs
description: Answers to common questions customers ask about cloud databases and Azure SQL Database, Microsoft's relational database management system (RDBMS) and database as a service in the cloud.
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 1da12abc-0646-43ba-b564-e3b049a6487f
ms.service: sql-database
ms.custom: reference
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-management
ms.date: 02/07/2017
ms.author: sashan;carlrab

---
# SQL Database FAQ

## What is the current version of SQL Database?
The current version of SQL Database is V12. Version V11 has been retired.

## What is the SLA for SQL Database?
We guarantee at least 99.99% of the time customers will have connectivity between their single or elastic Basic, Standard, or Premium Microsoft Azure SQL Database and our Internet gateway. For more information, see [SLA](http://azure.microsoft.com/support/legal/sla/).

## How do I reset the password for the server admin?
In the [Azure portal](https://portal.azure.com) click **SQL Servers**, select the server from the list, and then click **Reset Password**.

## How do I manage databases and logins?
See [Managing databases and logins](sql-database-manage-logins.md).

## How do I make sure only authorized IP addresses are allowed to access a server?
See [How to: Configure firewall settings on SQL Database](sql-database-configure-firewall-settings.md).

## How does the usage of SQL Database show up on my bill?
SQL Database bills on a predictable hourly rate based on both the service tier + performance level for single databases or eDTUs per elastic pool. Actual usage is computed and pro-rated hourly, so your bill might show fractions of an hour. For example, if a database exists for 12 hours in a month, your bill shows usage of 0.5 days. Additionally, service tiers + performance level and eDTUs per pool are broken out in the bill to make it easier to see the number of database days you used for each in a single month.

## What if a single database is active for less than an hour or uses a higher service tier for less than an hour?
You are billed for each hour a database exists using the highest service tier + performance level that applied during that hour, regardless of usage or whether the database was active for less than an hour. For example, if you create a single database and delete it five minutes later your bill reflects a charge for one database hour. 

Examples

* If you create a Basic database and then immediately upgrade it to Standard S1, you are charged at the Standard S1 rate for the first hour.
* If you upgrade a database from Basic to Premium at 10:00 p.m. and upgrade completes at 1:35 a.m. on the following day, you are charged at the Premium rate starting at 1:00 a.m. 
* If you downgrade a database from Premium to Basic at 11:00 a.m. and it completes at 2:15 p.m., then the database is charged at the Premium rate until 3:00 p.m., after which it is charged at the Basic rates.

## How does elastic pool usage show up on my bill and what happens when I change eDTUs per pool?
Elastic pool charges show up on your bill as Elastic DTUs (eDTUs) in the increments shown under eDTUs per pool on [the pricing page](https://azure.microsoft.com/pricing/details/sql-database/). There is no per-database charge for elastic pools. You are billed for each hour a pool exists at the highest eDTU, regardless of usage or whether the pool was active for less than an hour. 

Examples

* If you create a Standard elastic pool with 200 eDTUs at 11:18 a.m., adding five databases to the pool, you are charged for 200 eDTUs for the whole hour, beginning at 11 a.m. through the remainder of the day.
* On Day 2, at 5:05 a.m., Database 1 begins consuming 50 eDTUs and holds steady through the day. Databases 2-5 fluctuate between 0 and 80 eDTUs. During the day, you add five other databases that consume varying eDTUs throughout the day. Day 2 is a full day billed at 200 eDTU. 
* On Day 3, at 5 a.m. you add another 15 databases. Database usage increases throughout the day to the point where you decide to increase eDTUs for the pool from 200 to 400 at 8:05 p.m. Charges at the 200 eDTU level were in effect until 8 pm and increases to 400 eDTUs for the remaining four hours. 

## Elastic pool billing and pricing information
Elastic pools are billed per the following characteristics:

* An elastic pool is billed upon its creation, even when there are no databases in the pool.
* An elastic pool is billed hourly. This is the same metering frequency as for performance levels of single databases.
* If an elastic pool is resized to a new number of eDTUs, then the pool is not billed according to the new amount of eDTUS until the resizing operation completes. This follows the same pattern as changing the performance level of single databases.
* The price of an elastic pool is based on the number of eDTUs of the pool. The price of an elastic pool is independent of the number and utilization of the elastic databases within it.
* Price is computed by (number of pool eDTUs)x(unit price per eDTU).

The unit eDTU price for an elastic pool is higher than the unit DTU price for a single database in the same service tier. For details, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/). 

To understand the eDTUs and service tiers, see [SQL Database options and performance](sql-database-service-tiers.md).

## How does the use of active geo-replication in an elastic pool show up on my bill?
Unlike single databases, using [active geo-replication](sql-database-geo-replication-overview.md) with elastic databases doesn't have a direct billing impact.  You are only charged for the eDTUs provisioned for each of the pools (primary pool and secondary pool)

## How does the use of the auditing feature impact my bill?
Auditing is built into the SQL Database service at no extra cost and is available to Basic, Standard, Premium, and Premium RS databases. However, to store the audit logs, the auditing feature uses an Azure Storage account, and rates for tables and queues in Azure Storage apply based on the size of your audit log.

## How do I find the right service tier and performance level for single databases and elastic pools?
There are a few tools available to you. 

* For on-premises databases, use the [DTU sizing advisor](http://dtucalculator.azurewebsites.net/) to recommend the databases and DTUs required, and evaluate multiple databases for elastic pools.
* If a single database would benefit from being in a pool, Azure's intelligent engine recommends an elastic pool if it sees a historical usage pattern that warrants it. See [Monitor and manage an elastic pool with the Azure portal](sql-database-elastic-pool-manage-portal.md). For details about how to do the math yourself, see [Price and performance considerations for an elastic pool](sql-database-elastic-pool.md)
* To see whether you need to dial a single database up or down, see [performance guidance for single databases](sql-database-performance-guidance.md).

## How often can I change the service tier or performance level of a single database?
You can change the service tier (between Basic, Standard, Premium, and Premium RS) or the performance level within a service tier (for example, S1 to S2) as often as you want. For earlier version databases, you can change the service tier or performance level a total of four times in a 24-hour period.

## How often can I adjust the eDTUs per pool?
As often as you want.

## How long does it take to change the service tier or performance level of a single database or move a database in and out of an elastic pool?
Changing the service tier of a database and moving in and out of a pool requires the database to be copied on the platform as a background operation. Changing the service tier can take from a few minutes to several hours depending on the size of the databases. In both cases, the databases remain online and available during the move. For details on changing single databases, see [Change the service tier of a database](sql-database-service-tiers.md). 

## When should I use a single database vs. elastic databases?
In general, elastic pools are designed for a typical [software-as-a-service (SaaS) application pattern](sql-database-design-patterns-multi-tenancy-saas-applications.md), where there is one database per customer or tenant. Purchasing individual databases and overprovisioning to meet the variable and peak demand for each database is often not cost efficient. With pools, you manage the collective performance of the pool, and the databases scale up and down automatically. Azure's intelligent engine recommends a pool for databases when a usage pattern warrants it. For details, see [Elastic pool guidance](sql-database-elastic-pool.md).

## What does it mean to have up to 200% of your maximum provisioned database storage for backup storage?
Backup storage is the storage associated with your automated database backups that are used for [Point-In-Time-Restore](sql-database-recovery-using-backups.md#point-in-time-restore) and [geo-restore](sql-database-recovery-using-backups.md#geo-restore). Microsoft Azure SQL Database provides up to 200% of your maximum provisioned database storage of backup storage at no additional cost. For example, if you have a Standard DB instance with a provisioned DB size of 250 GB, you are provided with 500 GB of backup storage at no additional charge. If your database exceeds the provided backup storage, you can choose to reduce the retention period by contacting Azure Support or pay for the extra backup storage billed at standard Read-Access Geographically Redundant Storage (RA-GRS) rate. For more information on RA-GRS billing, see Storage Pricing Details.

## I'm moving from Web/Business to the new service tiers, what do I need to know?
Azure SQL Web and Business databases are now retired. The Basic, Standard, Premium, Premium RS, and Elastic tiers replace the retiring Web and Business databases. 

## What is an expected replication lag when geo-replicating a database between two regions within the same Azure geography?
We are currently supporting an RPO of five seconds and the replication lag has been less than that when the geo-secondary is hosted in the Azure recommended paired region and at the same service tier.

## What is an expected replication lag when geo-secondary is created in the same region as the primary database?
Based on empirical data, there is not too much difference between intra-region and inter-region replication lag when the Azure recommended paired region is used. 

## If there is a network failure between two regions, how does the retry logic work when geo-replication is set up?
If there is a disconnect, we retry every 10 seconds to re-establish connections.

## What can I do to guarantee that a critical change on the primary database is replicated?
The geo-secondary is an async replica and we do not try to keep it in full sync with the primary. But we provide a method to force synchronization to ensure the replication of critical changes (for example, password updates). Forced synchronization impacts performance because it blocks the calling thread until all committed transactions are replicated. For details, see [sp_wait_for_database_copy_sync](https://msdn.microsoft.com/library/dn467644.aspx). 

## What tools are available to monitor the replication lag between the primary database and geo-secondary?
We expose the real-time replication lag between the primary database and geo-secondary through a DMV. For details, see [sys.dm_geo_replication_link_status](https://msdn.microsoft.com/library/mt575504.aspx).

## To move a database to a different server in the same subscription
* In the [Azure portal](https://portal.azure.com), click **SQL databases**, select a database from the list, and then click **Copy**. See [Copy an Azure SQL database](sql-database-copy.md) for more detail.

## To move a database between subscriptions
* In the [Azure portal](https://portal.azure.com), click **SQL servers** and then select the server that hosts your database from the list. Click **Move**, and then pick the resources to move and the subscription to move to.
