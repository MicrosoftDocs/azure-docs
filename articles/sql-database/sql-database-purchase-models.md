---
title: 'Azure SQL Database purchasing models | Microsoft Docs'
description: Learn about the purchasing models model that are available databases in the Azure SQL Database service.  
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: carlrab
manager: craigg
ms.date: 02/08/2019
---
# Azure SQL Database purchasing models

Azure SQL Database enables you to easily purchase fully managed PaaS database engine that fits your performance and cost needs. Depending on the deployment model of Azure SQL Database, you can select the purchasing model that fits your needs:

- [vCore-based purchasing model](sql-database-service-tiers-vcore.md) (recommended) that enables you to choose the exact amount of storage capacity and compute that you need for your workload.
- [DTU-based purchasing model](sql-database-service-tiers-dtu.md) where you can choose bundled compute and storage packages balanced for common workloads.

Different purchasing models are available in Azure SQL Database deployment models:

- The [single database](sql-database-single-databases-manage.md) and [elastic pool](sql-database-elastic-pool.md) deployment options in [Azure SQL Database](sql-database-technical-overview.md) offer both the [DTU-based purchasing model](sql-database-service-tiers-dtu.md) and the [vCore-based purchasing model](sql-database-service-tiers-vcore.md).
- The [managed instance](sql-database-managed-instance.md) deployment option in Azure SQL Database only offers the [vCore-based purchasing model](sql-database-service-tiers-vcore.md).

> [!IMPORTANT]
> The [hyperscale service tier (preview)](sql-database-service-tier-hyperscale.md) is in public preview only for single databases using the vCore purchasing model.

The following table and chart compare and contrast these two purchasing models.

|**Purchasing model**|**Description**|**Best for**|
|---|---|---|
|DTU-based model|This model is based on a bundled measure of compute, storage, and IO resources. Compute sizes are expressed in terms of Database Transaction Units (DTUs) for single databases and elastic Database Transaction Units (eDTUs) for elastic pools. For more on DTUs and eDTUs, see [What are DTUs and eDTUs?](sql-database-purchase-models.md#dtu-based-purchasing-model).|Best for customers who want simple, pre-configured resource options.|
|vCore-based model|This model allows you to independently choose compute and storage resources. The vCore-based purchasing model also allows you to use [Azure Hybrid Benefit for SQL Server](https://azure.microsoft.com/pricing/hybrid-benefit/) to gain cost savings.|Best for customers who value flexibility, control, and transparency.|
||||  

![pricing model](./media/sql-database-service-tiers/pricing-model.png)

## Compute costs

The compute cost reflects the total compute capacity that is provisioned for the application. In the business critical service tier, we automatically allocate at least 3 replicas. To reflect this additional allocation of compute resources, the price in the vCore-based purchasing model is approximately 2.7x higher in the business critical service tier than in the general purpose service tier. For the same reason, the higher storage price per GB in the business critical service tier reflects the high IO and low latency of the SSD storage. At the same time, the cost of backup storage is not different between these two service tiers because in both cases we use a class of standard storage.

## Storage costs

Different types of storage are billed differently. For data storage, you are charged for the provisioned storage based upon the maximum database or pool size you select. The cost does not change unless you reduce or increase that maximum. Backup storage is associated with automated backups of your instance and is allocated dynamically. Increasing your backup retention period increases the backup storage that’s consumed by your instance.

7 days of automated backups of your databases are copied to RA-GRS Standard blob storage by default. The storage is used by weekly full backups, daily differential backups, and transaction log backups copied every 5 minutes. The size of the transaction log depends on the rate of change of the database. A minimum storage amount equal to 100% of database size is provided at no extra charge. Additional consumption of backup storage will be charged in GB/month.

For more information about storage prices, see the [pricing](https://azure.microsoft.com/pricing/details/sql-database/single/) page.

## vCore-based purchasing model

A virtual core represents the logical CPU offered with an option to choose between generations of hardware and physical characteristics of hardware (for example, number of cores, memory, storage size). The vCore-based purchasing model gives you flexibility, control, transparency of individual resource consumption and a straightforward way to translate on-premises workload requirements to the cloud. This model allows you to choose compute, memory, and storage based upon their workload needs. In the vCore-based purchasing model, you can choose between [general purpose](sql-database-high-availability.md#basic-standard-and-general-purpose-service-tier-availability) and [business critical](sql-database-high-availability.md#premium-and-business-critical-service-tier-availability) service tiers for [single databases](sql-database-single-database-scale.md), [elastic pools](sql-database-elastic-pool.md), and [managed instances](sql-database-managed-instance.md). For single databases, you can also choose the [hyperscale service tier (preview)](sql-database-service-tier-hyperscale.md).

The vCore-based purchasing model enables you to independently choose compute and storage resources, match on-premises performance, and optimize price. In the vCore-based purchasing model, customers pay for:

- Compute (service tier + number of vCores and amount of memory + generation of hardware)
- Type and amount of data and log storage
- Backup storage (RA-GRS)

> [!IMPORTANT]
> Compute, IOs, data and log storage are charged per database or elastic pool. Backups storage is charged per each database. For more information about managed instance charges, see [managed instances](sql-database-managed-instance.md).
> **Region limitations:** For the current list of supported regions, see [products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=sql-database&regions=all). If you want to create a Managed Instance in the region that is currently not supported, you can [send support request via Azure portal](sql-database-managed-instance-resource-limits.md#obtaining-a-larger-quota-for-sql-managed-instance).
.

If your single database or elastic pool consumes more than 300 DTUs, converting to the vCore-based purchasing model may reduce your cost. If you decide to convert, you can convert using your API of choice or using the Azure portal, with no downtime. However, conversion is not required and is not done automatically. If the DTU-based purchasing model meets your performance and business requirements, you should continue using it. If you decide to convert from the DTU-based purchasing model to the vCore-based purchasing model, select the compute size using the following rules of thumb:

- Each 100 DTU in Standard tier requires at least 1 vCore in General Purpose tier
- Each 125 DTU in Premium tier requires at least 1 vCore in Business Critical tier

## DTU-based purchasing model

The Database Transaction Unit (DTU) represents a blended measure of CPU, memory, reads, and writes. The DTU-based purchasing model offers a set of preconfigured bundles of compute resources and included storage to drive different levels of application performance. Customers who prefer the simplicity of a pre-configured bundle and fixed payments each month, may find the DTU-based model more suitable for their needs. In the DTU-based purchasing model, customers can choose between **basic**, **standard**, and **premium** service tiers for both [single databases](sql-database-single-database-scale.md) and [elastic pools](sql-database-elastic-pool.md). This purchase model is not available in [managed instances](sql-database-managed-instance.md).

### Database transaction units (DTUs)

For a single database at a specific compute size within a [service tier](sql-database-single-database-scale.md), Microsoft guarantees a certain level of resources for that database (independent of any other database in the Azure cloud), providing a predictable level of performance. The amount of resources is calculated as a number of Database Transaction Units or DTUs and is a bundled measure of compute, storage, and IO resources. The ratio amongst these resources was originally determined by an [OLTP benchmark workload](sql-database-benchmark-overview.md), designed to be typical of real-world OLTP workloads. When your workload exceeds the amount of any of these resources, your throughput is throttled - resulting in slower performance and timeouts. The resources used by your workload do not impact the resources available to other SQL databases in the Azure cloud, and the resources used by other workloads do not impact the resources available to your SQL database.

![bounding box](./media/sql-database-what-is-a-dtu/bounding-box.png)

DTUs are most useful for understanding the relative amount of resources between Azure SQL databases at different compute sizes and service tiers. For example, doubling the DTUs by increasing the compute size of a database equates to doubling the set of resources available to that database. For example, a Premium P11 database with 1750 DTUs provides 350x more DTU compute power than a Basic database with 5 DTUs.  

To gain deeper insight into the resource (DTU) consumption of your workload, use [query performance insights](sql-database-query-performance.md) to:

- Identify the top queries by CPU/Duration/Execution count that can potentially be tuned for improved performance. For example, an IO intensive query might benefit from the use of [in-memory optimization techniques](sql-database-in-memory.md) to make better use of the available memory at a certain service tier and compute size.
- Drill down into the details of a query, view its text and history of resource utilization.
- Access performance tuning recommendations that show actions performed by [SQL Database Advisor](sql-database-advisor.md).

### Elastic Database Transaction Units (eDTUs)

Rather than provide a dedicated set of resources (DTUs) that may not always be needed for a SQL Database that is always available, you can place databases into an [elastic pool](sql-database-elastic-pool.md) on a SQL Database server that shares a pool of resources among those databases. The shared resources in an elastic pool are measured by elastic Database Transaction Units or eDTUs. Elastic pools provide a simple cost effective solution to manage the performance goals for multiple databases having widely varying and unpredictable usage patterns. An elastic pool guarantees resources cannot be consumed by one database in the pool, while ensuring each database in the pool always has a minimum amount of necessary resources available.

A pool is given a set number of eDTUs for a set price. Within the elastic pool, individual databases are given the flexibility to auto-scale within the configured boundaries. A database under heavier load will consume more eDTUs to meet demand. Databases under lighter loads will consume less eDTUs. Databases with no load will consume no eDTUs. By provisioning resources for the entire pool, rather than per database, management tasks are simplified, providing a predictable budget for the pool.

Additional eDTUs can be added to an existing pool with no database downtime and with no impact on the databases in the pool. Similarly, if extra eDTUs are no longer needed, they can be removed from an existing pool at any point in time. You can add or subtract databases to the pool or limit the amount of eDTUs a database can use under heavy load to reserve eDTUs for other databases. If a database is predictably under-utilizing resources, you can move it out of the pool and configure it as a single database with a predictable amount of required resources.

### Determine the number of DTUs needed by a workload

If you are looking to migrate an existing on-premises or SQL Server virtual machine workload to Azure SQL Database, you can use the [DTU calculator](https://dtucalculator.azurewebsites.net/) to approximate the number of DTUs needed. For an existing Azure SQL Database workload, you can use [query performance insight](sql-database-query-performance.md) to understand your database resource consumption (DTUs) to gain deeper insight for optimizing your workload. You can also use the [sys.dm_db_ resource_stats](https://msdn.microsoft.com/library/dn800981.aspx) DMV to view resource consumption for the last hour. Alternatively, the catalog view [sys.resource_stats](https://msdn.microsoft.com/library/dn269979.aspx) displays resource consumption for the last 14 days, but at a lower fidelity of five-minute averages.

### Workloads that benefit from an elastic pool of resources

Pools are suited for a large number of databases with specific utilization patterns. For a given database, this pattern is characterized by a low utilization average with relatively infrequent utilization spikes. SQL Database automatically evaluates the historical resource usage of databases in an existing SQL Database server and recommends the appropriate pool configuration in the Azure portal. For more information, see [when should an elastic pool be used?](sql-database-elastic-pool.md)

## Purchase model frequently asked questions (FAQ)

### Do I need to take my application offline to convert from a DTU-based database to a vCore-based service tier

The new service tiers offer a simple online conversion method that is similar to the existing process of upgrading databases from Standard to Premium service tier and vice versa. This conversion can be initiated using the Azure portal, PowerShell, Azure CLI, T-SQL, or the REST API. See [Manage single databases](sql-database-single-database-scale.md) and [Manage elastic pools](sql-database-elastic-pool.md).

### Can I convert a database from a service tier using the vCore-based purchase to a service tier using the DTU-based purchasing model

Yes, you can easily convert your database to any supported performance objective using Azure portal, PowerShell, Azure CLI, T-SQL, or the REST API. See [manage single databases](sql-database-single-database-scale.md) and [manage elastic pools](sql-database-elastic-pool.md).

## Next steps

- For vCore-based purchasing model, see [vCore-based purchasing model](sql-database-service-tiers-vcore.md)
- For the DTU-based purchasing model, see [DTU-based purchasing model](sql-database-service-tiers-dtu.md).
