---
title: Glossary of terms 
titleSuffix: Azure SQL Database & SQL Managed Instance 
description: A glossary of terms for working with Azure SQL Database, Azure SQL Managed Instance, and SQL on Azure VM. 
services: sql-database
ms.service: sql-database
ms.subservice: service-overview
ms.custom: sqldbrb=4
ms.devlang: 
ms.topic: reference
author: MashaMSFT
ms.author: mathoma
ms.reviewer: 
ms.date: 5/18/2021
---
# Azure SQL Database glossary of terms
[!INCLUDE[appliesto-sqldb-sqlmi](./includes/appliesto-sqldb-sqlmi.md)]

## Azure SQL Database

|Context|Term|Definition|
|:---|:---|:---|
|Azure service|Azure SQL Database or SQL Database|[Azure SQL Database](database/sql-database-paas-overview.md) is a fully managed platform as a service (PaaS) database engine that handles most of the database management functions such as upgrading, patching, backups, and monitoring without user involvement.|
|SQL server entity| SQL server | A [server](database/logical-servers.md) is a logical construct that acts as a central administrative point for a collection of databases. All databases managed by a server are created in the same region as the server. |
|Deployment option ||Azure SQL Databases may be deployed individually or as part of an elastic pool. You may move existing SQL databases in and out of elastic pools. |
||Elastic pool|[Elastic pools](database/elastic-pool-overview.md) are a simple, cost-effective solution for managing and scaling multiple databases that have varying and unpredictable usage demands. The databases in an elastic pool are on a single logical server and share a set number of resources at a set price.|
||Single database|If you deploy [single databases](database/single-database-overview.md), each database is isolated and portable. Each has its own service tier within your selected purchasing model and a guaranteed compute size.|
|Purchasing model|| Azure SQL Database has two purchasing models. The purchasing model controls how you scale your database and how you are billed for compute, storage, and IO resources.   |
||DTU-based purchasing model|The [Database Transaction Unit (DTU)-based purchasing model](database/service-tiers-dtu.md) is based on a bundled measure of compute, storage, and I/O resources. Compute sizes are expressed in DTUs for single databases and in elastic database transaction units (eDTUs) for elastic pools. |
||vCore-based purchasing model (recommended)| A virtual core (vCore) represents a logical CPU. The [vCore-based purchasing model](database/service-tiers-vcore.md) offers greater control over the hardware generation to better match compute and memory requirements of the workload, pricing discounts for [Azure Hybrid Benefit (AHB)](../azure-hybrid-benefit.md) and [Reserved Instance (RI)](reserved-capacity-overview.md), and greater transparency in hardware details. |
|Service tier|| The service tier generally defines the storage architecture, space and I/O limits, and business continuity options related to availability and disaster recovery. Options for service tiers vary by purchasing model. |
||DTU-based service tiers | [Basic, Standard, and Premium service tiers](database/service-tiers-dtu.md#compare-the-dtu-based-service-tiers) are available in the DTU-based purchasing model.|
||vCore-based service tiers (recommended) |[General Purpose, Business Critical, and Hyperscale service tiers](database/service-tiers-sql-database-vcore#service-tiers) are available in the vCore-based purchasing model (recommended).|
|Compute tier|| The compute tier determines whether resources are continuously available or auto-scaled. Compute tier availability varies by purchasing model and service tier. |
||Provisioned compute|The [provisioned compute tier](database/service-tiers-sql-database-vcore.md#compute-tiers) provides a specific amount of compute resources that are continuously provisioned independent of workload activity, and bills for the amount of compute provisioned at a fixed price per hour.
||Serverless compute| The [serverless compute tier](database/serverless-tier-overview.md) auto-scales compute resources based on workload activity and bills for the amount of compute used per second. SQL Database serverless is currently only supported in the General Purpose service tier on Generation 5 hardware in the vCore purchasing model.|
|Hardware generation| Available hardware configurations | The vCore-based purchasing model allows you to select the appropriate hardware generation for your workload. [Hardware configuration options](database/service-tiers-sql-database-vcore.md#hardware-generations) include Gen5, M-series, Fsv2-series, and DC-series.|
|Compute size and storage amount||Compute size is the maximum amount of CPU, memory, and other non-storage related resources available for a single database or elastic pool.  Storage size is the maximum amount of storage available for a single database or elastic pool.
||vCore-based sizing options|For sizing options and resource limits in the vCore model, see [vCore single databases](database/resource-limits-vcore-single-databases.md), and [vCore elastic pools](database/resource-limits-vcore-elastic-pools.md).|
||DTU-based sizing options|For sizing options and resource limits in the DTU model, see [DTU single databases](database/resource-limits-dtu-single-databases.md) and [DTU elastic pools](database/resource-limits-dtu-elastic-pools.md).

## Azure SQL Managed Instance

|Context|Term|More information|
|:---|:---|:---|
|Azure service|Azure SQL Managed Instance|[SQL Managed Instance](managed-instance/sql-managed-instance-paas-overview.md)|
|Purchasing model|vCore-based purchasing model|[vCore-based purchasing model](managed-instance/service-tiers-managed-instance-vcore.md)|
|Deployment option |Single Instance|[Single Instance](managed-instance/sql-managed-instance-paas-overview.md)|
||Instance pool (preview)|[Instance pools](managed-instance/instance-pools-overview.md)|
|Service tier|General Purpose, Business Critical|[SQL Managed Instance service tiers](managed-instance/sql-managed-instance-paas-overview.md#service-tiers)|
|Compute tier|Provisioned compute|[Provisioned compute](managed-instance/service-tiers-managed-instance-vcore.md#compute-tiers)|
|Compute generation|Gen5|[Hardware generations](managed-instance/service-tiers-managed-instance-vcore.md#hardware-generations)
|Server entity|Managed instance or instance| N/A as the SQL Managed Instance is in itself the server |
|Resource type|vCore|A CPU core provided to the compute resource for SQL Managed Instance.|
||Compute size and storage amount|Compute size is the maximum amount of CPU, memory and other non-storage related resources for SQL Managed Instance.  Storage size is the maximum amount of storage available for a SQL Managed Instance.  For sizing options, [SQL Managed Instances](managed-instance/resource-limits.md). |
