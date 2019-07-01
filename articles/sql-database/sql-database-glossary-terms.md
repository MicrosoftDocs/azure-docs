---
title: Azure SQL Database glossary of terms | Microsoft Docs
description: Azure SQL Database glossary of terms
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: 
manager: craigg
ms.date: 04/26/2019
---
# Azure SQL Database glossary of terms

|Context|Term|More information|
|:---|:---|:---|
|Azure service name|Azure SQL Database or SQL Database|[The Azure SQL Database service](sql-database-technical-overview.md)|
|Compute tier|Serverless (preview)|[Serverless compute tier](sql-database-serverless.md)
||Provisioned|[Serverless compute tier](sql-database-serverless.md)
|Deployment options |Single database|[Single databases](sql-database-single-database.md)|
||Elastic pool|[Elastic pool](sql-database-elastic-pool.md)|
||Managed instance|[Managed instance](sql-database-managed-instance.md)|
|Server objects|SQL Database server or database server|[Database server](sql-database-servers.md)|
||SQL Database managed instance server, managed instance server, or instance server|[Managed instance](sql-database-managed-instance.md)|
Database objects|Azure SQL database|Any database in Azure SQL Database|
||Single database|A database created using the single database deployment option|
||Pooled database|A database created within or moved into an elastic pool|
||Instance database|A database created within a managed instance|
||Basic database|A database created within or moved into the basic service tier of the DTU-based purchasing model|
||Standard database|A database created within or moved into standard service tier of the DTU-based purchasing model|
||Premium database|A database created within or moved into the premium service tier of the DTU-based purchasing model|
||General purpose database|A database created within or moved into the general purpose service tier of the vCore-based purchasing model|
||Hyperscale database|A database created within or moved into the hyperscale service tier of the vCore-based purchasing model|
||Business critical database|A database created within or moved into the business critical service tier of the vCore-based purchasing model|
||Provisioned database|A database configured in the provisioned compute tier|
|[Purchase models and resources](sql-database-purchase-models.md)|DTU-based purchasing model|[DTU-based purchasing model](sql-database-service-tiers-dtu.md)|
||vCore-based purchasing model|[vCore-based purchasing model](sql-database-service-tiers-vcore.md)|
||vCore|A core provided to the guest OS by the hypervisor.|
||Service tier|A level of service within a purchasing model|
||Compute size|The amount of compute resources for a single database, elastic pool, or managed instance within a service tier|
||Storage amount|The amount of storage available to a single database, elastic pool, or managed instance|
||Compute generation|The generation of processor within a service tier|
|Database server IP firewall rules|IP firewall rules|[IP firewall rules](sql-database-firewall-configure.md)|
||Server-level IP firewall rules|[Server-level IP firewall rules](sql-database-firewall-configure.md#overview)|
|| Database-level IP firewall rules|[Database-level IP firewall rules](sql-database-firewall-configure.md#overview)|
||Virtual network endpoints and rules|[Virtual network endpoints and rules](sql-database-vnet-service-endpoint-rule-overview.md)|
