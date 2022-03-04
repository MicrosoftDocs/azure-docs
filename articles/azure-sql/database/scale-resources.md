---
title: Scale resources
description: This article explains how to scale your database in Azure SQL Database and SQL Managed Instance by adding or removing allocated resources.
services: sql-database
ms.service: sql-db-mi
ms.subservice: performance
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: dimitri-furman
ms.author: dfurman
ms.reviewer: kendralittle, mathoma, urmilano, wiassaf
ms.date: 06/25/2019
---

# Dynamically scale database resources with minimal downtime
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

Azure SQL Database and SQL Managed Instance enable you to dynamically add more resources to your database with minimal [downtime](https://azure.microsoft.com/support/legal/sla/azure-sql-database); however, there is a switch over period where connectivity is lost to the database for a short amount of time, which can be mitigated using retry logic.

## Overview

When demand for your app grows from a handful of devices and customers to millions, Azure SQL Database and SQL Managed Instance scale on the fly with minimal downtime. Scalability is one of the most important characteristics of platform as a service (PaaS) that enables you to dynamically add more resources to your service when needed. Azure SQL Database enables you to easily change resources (CPU power, memory, IO throughput, and storage) allocated to your databases.

You can mitigate performance issues due to increased usage of your application that cannot be fixed using indexing or query rewrite methods. Adding more resources enables you to quickly react when your database hits the current resource limits and needs more power to handle the incoming workload. Azure SQL Database also enables you to scale-down the resources when they are not needed to lower the cost.

You don't need to worry about purchasing hardware and changing underlying infrastructure. Scaling a database can be easily done via the Azure portal using a slider.

![Scale database performance](./media/scale-resources/scale-performance.svg)

Azure SQL Database offers the [DTU-based purchasing model](service-tiers-dtu.md) and the [vCore-based purchasing model](service-tiers-vcore.md), while Azure SQL Managed Instance offers just the [vCore-based purchasing model](service-tiers-vcore.md). 

- The [DTU-based purchasing model](service-tiers-dtu.md) offers a blend of compute, memory, and I/O resources in three service tiers to support lightweight to heavyweight database workloads: Basic, Standard, and Premium. Performance levels within each tier provide a different mix of these resources, to which you can add additional storage resources.
- The [vCore-based purchasing model](service-tiers-vcore.md) lets you choose the number of vCores, the amount or memory, and the amount and speed of storage. This purchasing model offers three service tiers: General Purpose, Business Critical, and Hyperscale.

The service tier, compute tier, and resource limits for a database, elastic pool, or managed instance can be changed at any time. For example, you can build your first app on a single database using the serverless compute tier and then change its service tier manually or programmatically at any time, to the provisioned compute tier, to meet the needs of your solution.

> [!NOTE]
> Notable exceptions where you cannot change the service tier of a database are:
> - Databases in the Hyperscale service tier cannot currently be changed to a different service tier.
> - Databases using features which are [only available](features-comparison.md#features-of-sql-database-and-sql-managed-instance) in the Business Critical / Premium service tiers, cannot be changed to use the General Purpose / Standard service tier.

You can adjust the resources allocated to your database by changing service objective, or scaling, to meet workload demands. This also enables you to only pay for the resources that you need, when you need them. Please refer to the [note](#impact-of-scale-up-or-scale-down-operations) on the potential impact that a scale operation might have on an application.

> [!NOTE]
> Dynamic scalability is different from autoscale. Autoscale is when a service scales automatically based on criteria, whereas dynamic scalability allows for manual scaling with a minimal downtime. Single databases in Azure SQL Database can be scaled manually, or in the case of the [Serverless tier](serverless-tier-overview.md), set to automatically scale the compute resources. [Elastic pools](elastic-pool-overview.md), which allow databases to share resources in a pool, can currently only be scaled manually.

Azure SQL Database offers the ability to dynamically scale your databases:

- With a [single database](single-database-scale.md), you can use either [DTU](resource-limits-dtu-single-databases.md) or [vCore](resource-limits-vcore-single-databases.md) models to define maximum amount of resources that will be assigned to each database.
- [Elastic pools](elastic-pool-scale.md) enable you to define maximum resource limit per group of databases in the pool.

Azure SQL Managed Instance allows you to scale as well: 

- [SQL Managed Instance](../managed-instance/sql-managed-instance-paas-overview.md) uses [vCores](../managed-instance/sql-managed-instance-paas-overview.md#vcore-based-purchasing-model) mode and enables you to define maximum CPU cores and maximum of storage allocated to your instance. All databases within the managed instance will share the resources allocated to the instance.

## Impact of scale up or scale down operations

Initiating a scale up, or scale down action, in any of the flavors mentioned above, restarts the database engine process, and moves it to a different virtual machine if needed. Moving the database engine process to a new virtual machine is an **online process** during which you can continue using your existing Azure SQL Database service. Once the target database engine is ready to process queries, open connections to the current database engine will be [terminated](single-database-scale.md#impact), and uncommitted transactions will be rolled back. New connections will be made to the target database engine.

> [!NOTE]
> It is not recommended to scale your managed instance if a long-running transaction, such as data import, data processing jobs, index rebuild, etc., is running, or if you have any active connection on the instance. To prevent the scaling from taking longer time to complete than usual, you should scale the instance upon the completion of all long-running operations.

> [!NOTE]
> You can expect a short connection break when the scale up/scale down process is finished. If you have implemented [Retry logic for standard transient errors](troubleshoot-common-connectivity-issues.md#retry-logic-for-transient-errors), you will not notice the failover.

## Alternative scale methods

Scaling resources is the easiest and the most effective way to improve performance of your database without changing either the database or application code. In some cases, even the highest service tiers, compute sizes, and performance optimizations might not handle your workload in a successful and cost-effective way. In that case you have these additional options to scale your database:

- [Read scale-out](read-scale-out.md) is an available feature where you are getting one read-only replica of your data where you can execute demanding read-only queries such as reports. A read-only replica will handle your read-only workload without affecting resource usage on your primary database.
- [Database sharding](elastic-scale-introduction.md) is a set of techniques that enables you to split your data into several databases and scale them independently.

## Next steps

- For information about improving database performance by changing database code, see [Find and apply performance recommendations](database-advisor-find-recommendations-portal.md).
- For information about letting built-in database intelligence optimize your database, see [Automatic tuning](automatic-tuning-overview.md).
- For information about read scale-out in Azure SQL Database, see how to [use read-only replicas to load balance read-only query workloads](read-scale-out.md).
- For information about a Database sharding, see [Scaling out with Azure SQL Database](elastic-scale-introduction.md).
- For an example of using scripts to monitor and scale a single database, see [Use PowerShell to monitor and scale a single SQL Database](scripts/monitor-and-scale-database-powershell.md).
