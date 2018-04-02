---
title: Azure SQL Database FAQ | Microsoft Docs
description: Answers to common questions customers ask about cloud databases and Azure SQL Database, Microsoft's relational database management system (RDBMS) and database as a service in the cloud.
services: sql-database
author: CarlRabeler
manager: craigg
ms.service: sql-database
ms.custom: reference
ms.topic: article
ms.date: 04/04/2018
ms.author: carlrab

---
# SQL Database FAQ

## What is the current version of SQL Database?
The current version of SQL Database is V12. Version V11 has been retired.

## What is the SLA for SQL Database?
We guarantee at least 99.99% of the time, you have connectivity between your Microsoft Azure SQL Database and our Internet gateway. For more information, see [SLA](http://azure.microsoft.com/support/legal/sla/).

## How do I reset the password for the server admin?
In the [Azure portal](https://portal.azure.com), click **SQL Servers**, select the server from the list, and then click **Reset Password**.

## How do I manage databases and logins?
See [Managing databases and logins](sql-database-manage-logins.md).

## How do I make sure only authorized IP addresses are allowed to access a server?
See [How to: Configure firewall settings on SQL Database](sql-database-configure-firewall-settings.md).

## How does the usage of SQL Database show up on my bill?
SQL Database bills on a predictable hourly rate based on the [purchasing model](sql-database-service-tiers.md). Actual usage is computed and pro-rated hourly, so your bill might show fractions of an hour. For example, if a database exists for 12 hours in a month, your bill shows usage of 0.5 days. 

## What if a single database is active for less than an hour or uses a higher service tier for less than an hour?
You are billed for each hour a database exists using the highest service tier + performance level that applied during that hour, regardless of usage or whether the database was active for less than an hour. For example, if you create a single database and delete it five minutes later your bill reflects a charge for one database hour. 

Examples:

* If you create a Basic database and then immediately upgrade it to Standard S1, you are charged at the Standard S1 rate for the first hour.
* If you upgrade a database from Basic to Premium at 10:00 p.m. and upgrade completes at 1:35 a.m. on the following day, you are charged at the Premium rate starting at 1:00 a.m. 
* If you downgrade a database from Premium to Basic at 11:00 a.m. and it completes at 2:15 p.m., then the database is charged at the Premium rate until 3:00 p.m., after which it is charged at the Basic rates.

## How does elastic pool usage show up on my bill?
Elastic pool charges show up on your bill as Elastic DTUs (eDTUs) or vCores plus storage in the increments shown on [the pricing page](https://azure.microsoft.com/pricing/details/sql-database/). There is no per-database charge for elastic pools. You are billed for each hour a pool exists at the highest eDTU or vCores, regardless of usage or whether the pool was active for less than an hour. 

DTU-based purchasing model examples:

* If you create a Standard elastic pool with 200 eDTUs at 11:18 a.m., adding five databases to the pool, you are charged for 200 eDTUs for the whole hour, beginning at 11 a.m. through the remainder of the day.
* On Day 2, at 5:05 a.m., Database 1 begins consuming 50 eDTUs and holds steady through the day. Databases 2-5 fluctuate between 0 and 80 eDTUs. During the day, you add five other databases that consume varying eDTUs throughout the day. Day 2 is a full day billed at 200 eDTU. 
* On Day 3, at 5 a.m. you add another 15 databases. Database usage increases throughout the day to the point where you decide to increase eDTUs for the pool from 200 to 400 at 8:05 p.m. Charges at the 200 eDTU level were in effect until 8 pm and increases to 400 eDTUs for the remaining four hours. 

## Elastic pool billing and pricing information
Elastic pools are billed per the following characteristics:

* An elastic pool is billed upon its creation, even when there are no databases in the pool.
* An elastic pool is billed hourly. This is the same metering frequency as for performance levels of single databases.
* If an elastic pool is resized, then the pool is not billed according to the new amount of resources until the resizing operation completes. This follows the same pattern as changing the performance level of single databases.
* The price of an elastic pool is based on the resources of the pool. The price of an elastic pool is independent of the number and utilization of the elastic databases within it.

For details, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/) and [Service tiers](sql-database-service-tiers.md).

## How does the use of active geo-replication in an elastic pool show up on my bill?
Unlike single databases, using [active geo-replication](sql-database-geo-replication-overview.md) with elastic databases doesn't have a direct billing impact.  You are only charged for the resources provisioned for each of the pools (primary pool and secondary pool)

## How does the use of the auditing feature impact my bill?
Auditing is built into the SQL Database service at no extra cost and is available on all service tiers. However, to store the audit logs, the auditing feature uses an Azure Storage account, and rates for tables and queues in Azure Storage apply based on the size of your audit log.

## Are the existing Basic, Standard and Premium editions being retired with the release of the new vCore-based model?
The DTU-based Basic, Standard and Premium options are not being retired with the release of the vCore-based model. In many cases, applications can benefit from the simplicity of a preconfigured bundle of resources. Therefore, we continue to offer and support these DTU-based choices to our customers. If you are using them and it meets your business requirements, you should continue to do so. See [Service tiers](sql-database-service-tiers.md).

## How does the vCore-based usage show up in my bill? 
In the vCore-based model, the service is billed on a predictable, hourly rate based on the service tier, provisioned compute in vCores, provisioned storage in GB/month, and consumed backup storage. If the storage for backups exceeds the total database size (that is, 100% of the database size), there are additional charges. vCore hours, configured database storage, consumed IO, and backup storage are clearly itemized in the bill, making it easier for you to see the details of resources you have used. Backup storage up to 100% of the maximum database size is included, beyond which you are billed in GB/month consumed in a month.

For example:
- If the SQL database exists for 12 hours in a month, the bill shows usage for 12 hours of vCore. If the SQL database provisioned an additional 100 GB of storage, the bill shows storage usage in units of GB/Month prorated hourly and number of IOs consumed in a month.
- If the SQL database is active for less than one hour, you are billed for each hour the database exists using the highest service tier selected, provisioned storage, and IO that applied during that hour, regardless of usage or whether the database was active for less than an hour.
- If you create a Managed Instance and delete it five minutes later, you’ll be charged for one database hour.
- If you create a Managed Instance in the General Purpose tier with 8 vCores, and then immediately upgrade it to 16 vCores, you’ll be charged at the 16 vCore rate for the first hour.

> [!NOTE]
> For a limited period through June 30th 2018, backup charges and IO charges are free of charge.

## Is the vCore-based model available to SQL Database Managed Instance?
[Managed Instance](sql-database-managed-instance.md) is available only with the vCore-based model. For more information, also see the [SQL Database pricing page](https://azure.microsoft.com/pricing/details/sql-database/managed/). 

## Does the cost of compute and storage depend on the service tier that I choose?
The compute cost reflects the total compute capacity that is provisioned for the application. In the Business Critical service tier, we automatically allocate at least 3 Always ON replicas. To reflect this additional allocation of compute resources, the vCore price is approximately 2.7x higher in Business Critical. For the same reason, the higher storage price per GB in the Business Critical tier reflects the high IO and low latency of the SSD storage. At the same time, the cost of backup storage is not different because in both cases we use a class of standard storage ([RA-GRS](../storage/common/storage-redundancy-grs.md#read-access-geo-redundant-storage)).

## How am I charged for storage - based on what I configure upfront or on what the database uses?
Different types of storage are billed differently. For data storage, you are be charged for the provisioned storage based upon the maximum database or pool size you select. The cost does not change unless you reduce or increase that maximum. Backup storage is associated with automated backups of your instance. Increasing your backup retention period increases the backup storage that’s consumed by your instance. There’s no additional charge for backup storage for up to 100 percent of your total provisioned server storage. Additional consumption of backup storage is charged in GB per month. For example, if you have the database storage size of 100 GBs, you’ll get 100 GBs of backup at no additional cost. But if the backup is 110 GBs, you pay for the additional 10 GBs.

For backup storage of a single database, you are charged on a prorated basis for the storage that was allocated to the database backups minus the size of the database. For backup storage of an elastic pool, you are charged on a prorated basis for the storage that was allocated to the database backups of all the databases in the pool minus the maximum data size of the elastic pool. Any increase in the database size or elastic pool, or increase in the transaction rate, requires more storage and thus increases your backup storage bill.  When you increase the maximum data size, this new amount is deducted from the billed backup storage size.

## How often can I change the DTU-based service tier or performance level of a single database ?
You can change the service tier (between Basic, Standard, and Premium) or the performance level within a service tier (for example, S1 to S2) as often as you want. For earlier version databases, you can change the service tier or performance level a total of four times in a 24-hour period.

## How do I select the right SKU when converting an existing database to the new service tiers? 
For existing SQL Database applications using the DTU-based model, the General Purpose service tier is comparable with the Standard tier. The Business Critical service tier is comparable with the Premium tier. In both cases, you should allocate at least 1 vCore for each 100 DTU that your application uses in the DTU-based model.

## Do I need to take my application offline to convert from a DTU-based database to a vCore-based service tier? 
The new service tiers offer a simple online conversion method that is similar to the existing process of upgrading databases from Standard to Premium service tier and vice versa. This conversion can be initiated using Portal, ARM, PowerShell, Azure CLI or T-SQL. See [Manage single databases](sql-database-single-database-resources.md) and [Manage elastic pools](sql-database-elastic-pool.md).

## Can I convert a database from a vCore-based service tier to a DTU-based one? 
Yes, you can easily convert your database to any supported performance objective using Portal or programmatically using Portal, ARM, PowerShell, Azure CLI or T-SQL. See [Manage single databases](sql-database-single-database-resources.md) and [Manage elastic pools](sql-database-elastic-pool.md).

## Can I upgrade or downgrade between the General Purpose and Business Critical service tiers? 
Yes, with some restrictions. Your destination SKU must meet the maximum database or elastic pool size you configured for your existing deployment. The [Azure Hybrid Use Benefit for SQL Server](../virtual-machines/windows/hybrid-use-benefit-licensing.md) for the Business Critical SKU is only available to customers with Enterprise Edition licenses. Only customers who migrated from on-premises to General Purpose using Azure Hybrid Benefit for SQL Server with Enterprise Edition licenses can upgrade to Business Critical. For details see What are the specific rights of the [Azure Hybrid Use Benefit for SQL Server](../virtual-machines/windows/hybrid-use-benefit-licensing.md)?

This conversion does not result in downtime and can be initiated using Portal, ARM, PowerShell, Azure CLI or T-SQL. See [Manage single databases](sql-database-single-database-resources.md) and [Manage elastic pools](sql-database-elastic-pool.md).

## I am using a Premium RS database that will not be Generally Available - can I upgrade it to a new tier and achieve a similar price/performance benefit?
Because the vCore model allows independent control over the amount of provisioned compute and storage, you can more effectively manage the resulting costs, making it an attractive destination for Premium RS databases. In addition, the [Azure Hybrid Use Benefit for SQL Server](../virtual-machines/windows/hybrid-use-benefit-licensing.md) provides a substantial discount when the vCore-based model is used. 

## How often can I adjust the resources per pool?
As often as you want. See [Manage elastic pools](sql-database-elastic-pool.md).

## How long does it take to change the service tier or performance level of a single database or move a database in and out of an elastic pool?
Changing the service tier of a database and moving in and out of a pool requires the database to be copied on the platform as a background operation. Changing the service tier can take from a few minutes to several hours depending on the size of the databases. In both cases, the databases remain online and available during the move. For details on changing single databases, see [Change the service tier of a database](sql-database-service-tiers.md). 

## When should I use a single database vs. elastic databases?
In general, elastic pools are designed for a typical [software-as-a-service (SaaS) application pattern](sql-database-design-patterns-multi-tenancy-saas-applications.md), where there is one database per customer or tenant. Purchasing individual databases and overprovisioning to meet the variable and peak demand for each database is often not cost efficient. With pools, you manage the collective performance of the pool, and the databases scale up and down automatically. Azure's intelligent engine recommends a pool for databases when a usage pattern warrants it. For details, see [Elastic pool guidance](sql-database-elastic-pool.md).

## What does it mean to have up to 200% of your maximum provisioned database storage for backup storage?
Backup storage is the storage associated with your automated database backups that are used for [Point-In-Time-Restore](sql-database-recovery-using-backups.md#point-in-time-restore) and [geo-restore](sql-database-recovery-using-backups.md#geo-restore). Microsoft Azure SQL Database provides up to 200% of your maximum provisioned database storage of backup storage at no additional cost. For example, if you have a Standard DB instance with a provisioned DB size of 250 GB, you are provided with 500 GB of backup storage at no additional charge. If your database exceeds the provided backup storage, you can choose to reduce the retention period by contacting Azure Support or pay for the extra backup storage billed at standard Read-Access Geographically Redundant Storage (RA-GRS) rate. For more information on RA-GRS billing, see Storage Pricing Details.

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
In the [Azure portal](https://portal.azure.com), click **SQL databases**, select a database from the list, and then click **Copy**. See [Copy an Azure SQL database](sql-database-copy.md) for more detail.

## To move a database between subscriptions
In the [Azure portal](https://portal.azure.com), click **SQL servers** and then select the server that hosts your database from the list. Click **Move**, and then pick the resources to move and the subscription to move to.
