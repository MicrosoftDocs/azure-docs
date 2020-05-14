---
title: Glossary of terms 
titleSuffix: Azure SQL 
description: A glossary of terms for working with Azure SQL Database, Azure SQL Managed Instance, and SQL on Azure VM. 
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom: sqldbrb=4
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: 
ms.date: 01/22/2020
---
# Azure SQL glossary of terms

## Azure SQL Database

|Context|Term|More information|
|:---|:---|:---|
|Azure service|Azure SQL Database or SQL Database|[Azure SQL Database](../../sql-database/sql-database-technical-overview.md)|
|Purchasing model|DTU-based purchasing model|[DTU-based purchasing model](dtu-service-tiers.md)|
||vCore-based purchasing model|[vCore-based purchasing model](../../sql-database/sql-database-service-tiers-vcore.md)|
|Deployment option |Single database|[Single databases](single-database-overview.md)|
||Elastic pool|[Elastic pool](elastic-pool-overview.md)|
|Service tier|Basic, Standard, Premium, General Purpose, Hyperscale, Business Critical|For service tiers in the vCore model, see [SQL Database service tiers](../../sql-database/sql-database-service-tiers-vcore.md#service-tiers). For service tiers in the DTU model, see [DTU model](dtu-service-tiers.md#compare-the-dtu-based-service-tiers).|
|Compute tier|Serverless compute|[Serverless compute](../../sql-database/sql-database-service-tiers-vcore.md#compute-tiers)
||Provisioned compute|[Provisioned compute](../../sql-database/sql-database-service-tiers-vcore.md#compute-tiers)
|Compute generation|Gen5, M-series, Fsv2-series|[Hardware generations](../../sql-database/sql-database-service-tiers-vcore.md#hardware-generations)
|Server entity| Server |[Logical SQL servers](logical-servers.md)|
|Resource type|vCore|A CPU core provided to the compute resource for a single database, elastic pool. |
||Compute size and storage amount|Compute size is the maximum amount of CPU, memory and other non-storage related resources available for a single database, or elastic pool.  Storage size is the maximum amount of storage available for a single database, or elastic pool. For sizing options in the vcore model, see [vCore single databases](resource-limits-vcore-single-databases.md), and [vCore elastic pools](resource-limits-vcore-elastic-pools.md).  (../../sql-database/sql-database-managed-instance-resource-limits.md).  For sizing options in the DTU model, see [DTU single databases](resource-limits-dtu-single-databases.md) and [DTU elastic pools](resource-limits-dtu-elastic-pools.md).

## Azure SQL Managed Instance

|Context|Term|More information|
|:---|:---|:---|
|Azure service|Azure SQL Managed Instance|[SQL Managed Instance](../../sql-database/sql-database-managed-instance.md)|
|Purchasing model|vCore-based purchasing model|[vCore-based purchasing model](../../sql-database/sql-database-service-tiers-vcore.md)|
|Deployment option |Single instance|[Single instance](../../sql-database/sql-database-managed-instance.md)|
||Instance pool (preview)|[Instance pools](../../sql-database/sql-database-instance-pools.md)|
|Service tier|General Purpose, Business Critical|[SQL Managed Instance service tiers](../../sql-database/sql-database-managed-instance.md#service-tiers)..|
|Compute tier|Provisioned compute|[Provisioned compute](../../sql-database/sql-database-service-tiers-vcore.md#compute-tiers)|
|Compute generation|Gen5|[Hardware generations](../../sql-database/sql-database-service-tiers-vcore.md#hardware-generations)
|Server entity|Managed instance or instance| N/A as the SQL Managed Instance is in itself the server |
|Resource type|vCore|A CPU core provided to the compute resource for SQL Managed Instance.|
||Compute size and storage amount|Compute size is the maximum amount of CPU, memory and other non-storage related resources for SQL Managed Instance.  Storage size is the maximum amount of storage available for a SQL Managed Instance.  For sizing options, [SQL Managed Instances](../../sql-database/sql-database-managed-instance-resource-limits.md). |

## SQL on Azure VM

need more stuff here
