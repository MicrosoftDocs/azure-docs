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
# Azure SQL Database glossary of terms
[!INCLUDE[appliesto-asf](includes/appliesto-asf.md)]

## Azure SQL Database

|Context|Term|More information|
|:---|:---|:---|
|Azure service|Azure SQL Database or SQL Database|[Azure SQL Database](database/sql-database-paas-overview.md)|
|Purchasing model|DTU-based purchasing model|[DTU-based purchasing model](database/service-tiers-dtu.md)|
||vCore-based purchasing model|[vCore-based purchasing model](database/service-tiers-vcore.md)|
|Deployment option |Single database|[Single databases](database/single-database-overview.md)|
||Elastic pool|[Elastic pool](database/elastic-pool-overview.md)|
|Service tier|Basic, Standard, Premium, General Purpose, Hyperscale, Business Critical|For service tiers in the vCore model, see [SQL Database service tiers](database/service-tiers-vcore.md#service-tiers). For service tiers in the DTU model, see [DTU model](database/service-tiers-dtu.md#compare-the-dtu-based-service-tiers).|
|Compute tier|Serverless compute|[Serverless compute](database/service-tiers-vcore.md#compute-tiers)
||Provisioned compute|[Provisioned compute](database/service-tiers-vcore.md#compute-tiers)
|Compute generation|Gen5, M-series, Fsv2-series|[Hardware generations](database/service-tiers-vcore.md#hardware-generations)
|Server entity| Server |[Logical SQL servers](database/logical-servers.md)|
|Resource type|vCore|A CPU core provided to the compute resource for a single database, elastic pool. |
||Compute size and storage amount|Compute size is the maximum amount of CPU, memory and other non-storage related resources available for a single database, or elastic pool.  Storage size is the maximum amount of storage available for a single database, or elastic pool. For sizing options in the vcore model, see [vCore single databases](database/resource-limits-vcore-single-databases.md), and [vCore elastic pools](database/resource-limits-vcore-elastic-pools.md).  (../managed-instance/resource-limits.md).  For sizing options in the DTU model, see [DTU single databases](database/resource-limits-dtu-single-databases.md) and [DTU elastic pools](database/resource-limits-dtu-elastic-pools.md).

## Azure SQL Managed Instance

|Context|Term|More information|
|:---|:---|:---|
|Azure service|Azure SQL Managed Instance|[SQL Managed Instance](managed-instance/sql-managed-instance-paas-overview.md)|
|Purchasing model|vCore-based purchasing model|[vCore-based purchasing model](database/service-tiers-vcore.md)|
|Deployment option |Single Instance|[Single Instance](managed-instance/sql-managed-instance-paas-overview.md)|
||Instance pool (preview)|[Instance pools](managed-instance/instance-pools-overview.md)|
|Service tier|General Purpose, Business Critical|[SQL Managed Instance service tiers](managed-instance/sql-managed-instance-paas-overview.md#service-tiers)|
|Compute tier|Provisioned compute|[Provisioned compute](database/service-tiers-vcore.md#compute-tiers)|
|Compute generation|Gen5|[Hardware generations](database/service-tiers-vcore.md#hardware-generations)
|Server entity|Managed instance or instance| N/A as the SQL Managed Instance is in itself the server |
|Resource type|vCore|A CPU core provided to the compute resource for SQL Managed Instance.|
||Compute size and storage amount|Compute size is the maximum amount of CPU, memory and other non-storage related resources for SQL Managed Instance.  Storage size is the maximum amount of storage available for a SQL Managed Instance.  For sizing options, [SQL Managed Instances](managed-instance/resource-limits.md). |

## SQL on Azure VM

need more stuff here
