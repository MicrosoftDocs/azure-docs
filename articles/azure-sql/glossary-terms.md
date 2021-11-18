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
|SQL server entity| SQL server | An Azure SQL database [server](database/logical-servers.md) is a logical construct that acts as a central administrative point for a collection of databases. All databases managed by a server are created in the same region as the server. There are no guarantees regarding location of the databases in relation to the server that manages them. There is no instance-level access or features. |
|Deployment option ||Azure SQL databases may be deployed individually or as part of an elastic pool. You may move existing SQL databases in and out of elastic pools. |
||Elastic pool|[Elastic pools](database/elastic-pool-overview.md) are a simple, cost-effective solution for managing and scaling multiple databases that have varying and unpredictable usage demands. The databases in an elastic pool are on a single logical server. The databases share a set number of resources at a set price.|
||Single database|If you deploy [single databases](database/single-database-overview.md), each database is isolated and portable. Each has its own service tier within your selected purchasing model and a guaranteed compute size.|
|Purchasing model|| Azure SQL Database has two purchasing models. The purchasing model defines how you scale your database and how you are billed for compute, storage, and IO resources. |
||DTU-based purchasing model|The [Database Transaction Unit (DTU)-based purchasing model](database/service-tiers-dtu.md) is based on a bundled measure of compute, storage, and I/O resources. Compute sizes are expressed in DTUs for single databases and in elastic database transaction units (eDTUs) for elastic pools. |
||vCore-based purchasing model (recommended)| A virtual core (vCore) represents a logical CPU. The [vCore-based purchasing model](database/service-tiers-vcore.md) offers greater control over the hardware configuration to better match compute and memory requirements of the workload, pricing discounts for [Azure Hybrid Benefit (AHB)](../azure-hybrid-benefit.md) and [Reserved Instance (RI)](reserved-capacity-overview.md), and greater transparency in hardware details. |
|Service tier|| The service tier defines the storage architecture, storage and I/O limits, and business continuity options. Options for service tiers vary by purchasing model. |
||DTU-based service tiers | [Basic, Standard, and Premium service tiers](database/service-tiers-dtu.md#compare-the-dtu-based-service-tiers) are available in the DTU-based purchasing model.|
||vCore-based service tiers (recommended) |[General Purpose, Business Critical, and Hyperscale service tiers](database/service-tiers-sql-database-vcore#service-tiers) are available in the vCore-based purchasing model (recommended).|
|Compute tier|| The compute tier determines whether resources are continuously available or autoscaled. Compute tier availability varies by purchasing model and service tier. |
||Provisioned compute|The [provisioned compute tier](database/service-tiers-sql-database-vcore.md#compute-tiers) provides a specific amount of compute resources that are continuously provisioned independent of workload activity. Under the provisioned compute tier you are billed at a fixed price per hour.
||Serverless compute| The [serverless compute tier](database/serverless-tier-overview.md) autoscales compute resources based on workload activity and bills for the amount of compute used per second. SQL Database serverless is currently available in the vCore purchasing model's  General Purpose service tier with Generation 5 hardware.|
|Hardware generation| Available hardware configurations | The vCore-based purchasing model allows you to select the appropriate hardware generation for your workload. [Hardware configuration options](database/service-tiers-sql-database-vcore.md#hardware-generations) include Gen5, M-series, Fsv2-series, and DC-series.|
|Compute size (service objective) ||Compute size (service objective) is the maximum amount of CPU, memory, and storage resources available for a single database or elastic pool.
||vCore-based sizing options|For sizing options and resource limits in the vCore-based purchasing model, see [vCore single databases](database/resource-limits-vcore-single-databases.md), and [vCore elastic pools](database/resource-limits-vcore-elastic-pools.md).|
||DTU-based sizing options|For sizing options and resource limits in the DTU-based purchasing model, see [DTU single databases](database/resource-limits-dtu-single-databases.md) and [DTU elastic pools](database/resource-limits-dtu-elastic-pools.md).

## Azure SQL Managed Instance

|Context|Term|More information|
|:---|:---|:---|
|Azure service|Azure SQL Managed Instance| [Azure SQL Managed Instance](managed-instance/sql-managed-instance-paas-overview.md) is a fully managed platform as a service (PaaS) deployment option of Azure SQL. It gives you an instance of SQL Server but removes much of the overhead of managing a virtual machine. Most of the features available in SQL Server are available in SQL Managed Instance. |
|Server entity|Managed instance or instance| Each managed instance is itself an instance of SQL Server. Databases created on a managed instance are colocated with one another, and you may run cross-database queries. You can connect to the managed instance and use instance-level features such as linked servers and the SQL Server Agent. |
|Deployment option ||Azure SQL managed instances may be deployed individually or as part of an instance pools (preview). Managed instances cannot currently be moved into, between, or out of instance pools.|
| |Single instance| A single [managed instance](managed-instance/sql-managed-instance-paas-overview.md) provides a dedicated virtual cluster for one managed instance.   |
||Instance pool (preview)|[Instance pools](managed-instance/instance-pools-overview.md) allow you to deploy multiple managed instances into a single virtual cluster. Instance pools enable you to migrate smaller and less compute-intensive workloads to the cloud without consolidating them in a single larger managed instance. |
|Purchasing model|vCore-based purchasing model| Azure SQL Managed Instance is available under the [vCore-based purchasing model](managed-instance/service-tiers-managed-instance-vcore.md). |
|Service tier| vCore-based service tiers| Azure SQL Managed Instance offers two service tiers. Both service tiers guarantee 99.99% availability and enable you to independently select storage size and compute capacity. Select either the [General Purpose or Business Critical service tier](managed-instance/sql-managed-instance-paas-overview.md#service-tiers) for a managed instance based upon your performance and latency requirements.|
|Compute tier|Provisioned compute| Azure SQL managed instances run under the [provisioned compute](managed-instance/service-tiers-managed-instance-vcore.md#compute-tiers) tier. SQL Managed Instance provides a specific amount of compute resources that are continuously provisioned independent of workload activity, and bills for the amount of compute provisioned at a fixed price per hour. |
|Hardware generation|Available hardware configurations| Azure SQL Managed Instance [hardware generations](managed-instance/service-tiers-managed-instance-vcore.md#hardware-generations) include standard-series (Gen5), premium-series, and memory optimized premium-series hardware generations. |
|Compute size | vCore-based sizing options | Configure the compute size for your managed instance by selecting the appropriate service tier and hardware generation for your workload. Learn about [resource limits for managed instances](managed-instance/resource-limits.md). |
