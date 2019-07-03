---
title: Azure SQL Database Scale Resources | Microsoft Docs
description: This article explains how to scale your database by adding or removing allocated resources.
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: jrasnik, carlrab
manager: craigg
ms.date: 06/25/2019
---

# Dynamically scale database resources with minimal downtime

Azure SQL Database enables you to dynamically add more resources to your database with minimal [downtime](https://azure.microsoft.com/support/legal/sla/sql-database/v1_2/); however, there is a switch over period where connectivity is lost to the database for a short amount of time, which can be mitigated using retry logic.

## Overview

When demand for your app grows from a handful of devices and customers to millions, Azure SQL Database scales on the fly with minimal downtime. Scalability is one of the most important characteristics of PaaS that enables you to dynamically add more resources to your service when needed. Azure SQL Database enables you to easily change resources (CPU power, memory, IO throughput, and storage) allocated to your databases.

You can mitigate performance issues due to increased usage of your application that cannot be fixed using indexing or query rewrite methods. Adding more resources enables you to quickly react when your database hits the current resource limits and needs more power to handle the incoming workload. Azure SQL Database also enables you to scale-down the resources when they are not needed to lower the cost.

You don’t need to worry about purchasing hardware and changing underlying infrastructure. Scaling database can be easily done via Azure portal using a slider.

![Scale database performance](media/sql-database-scalability/scale-performance.svg)

Azure SQL Database offers the [DTU-based purchasing model](sql-database-service-tiers-dtu.md) and the [vCore-based purchasing model](sql-database-service-tiers-vcore.md).

- The [DTU-based purchasing model](sql-database-service-tiers-dtu.md) offers a blend of compute, memory, and IO resources in three service tiers to support lightweight to heavyweight database workloads: Basic, Standard, and Premium. Performance levels within each tier provide a different mix of these resources, to which you can add additional storage resources.
- The [vCore-based purchasing model](sql-database-service-tiers-vcore.md) lets you choose the number of vCores, the amount or memory, and the amount and speed of storage. This purchasing model offers three service tiers: General Purpose, Business Critical, and Hyperscale.

You can build your first app on a small, single database at a low cost per month in the Basic, Standard, or General Purpose service tier and then change its service tier manually or programmatically at any time to the Premium or Business Critical service tier to meet the needs of your solution. You can adjust performance without downtime to your app or to your customers. Dynamic scalability enables your database to transparently respond to rapidly changing resource requirements and enables you to only pay for the resources that you need when you need them.

> [!NOTE]
> Dynamic scalability is different from autoscale. Autoscale is when a service scales automatically based on criteria, whereas dynamic scalability allows for manual scaling with a minimal downtime.

Single Azure SQL Database supports manual dynamic scalability, but not autoscale. For a more *automatic* experience, consider using elastic pools, which allow databases to share resources in a pool based on individual database needs.
However, there are scripts that can help automate scalability for a single Azure SQL Database. For an example, see [Use PowerShell to monitor and scale a single SQL Database](scripts/sql-database-monitor-and-scale-database-powershell.md).

You can change [DTU service tiers](sql-database-service-tiers-dtu.md) or [vCore characteristics](sql-database-vcore-resource-limits-single-databases.md) at any time with minimal downtime to your application (generally averaging under four seconds). For many businesses and apps, being able to create databases and dial performance up or down on demand is enough, especially if usage patterns are relatively predictable. But if you have unpredictable usage patterns, it can make it hard to manage costs and your business model. For this scenario, you use an elastic pool with a certain number of eDTUs that are shared among multiple databases in the pool.

![Intro to SQL Database: Single database DTUs by tier and level](./media/sql-database-what-is-a-dtu/single_db_dtus.png)

All three flavors of Azure SQL Database offer some ability to dynamically scale your databases:

- With a [single database](sql-database-single-database-scale.md), you can use either [DTU](sql-database-dtu-resource-limits-single-databases.md) or [vCore](sql-database-vcore-resource-limits-single-databases.md) models to define maximum amount of resources that will be assigned to each database.
- A [Managed Instance](sql-database-managed-instance.md) uses [vCores](sql-database-managed-instance.md#vcore-based-purchasing-model) mode and enables you to define maximum CPU cores and maximum of storage allocated to your instance. All databases within the instance will share the resources allocated to the instance.
- [Elastic pools](sql-database-elastic-pool-scale.md) enable you to define maximum resource limit per group of databases in the pool.

> [!NOTE]
> You can expect a short connection break when the scale up/scale down process is finished. If you have implemented [Retry logic for standard transient errors](sql-database-connectivity-issues.md#retry-logic-for-transient-errors), you will not notice the failover.

## Alternative scale methods

Scaling resources is the easiest and the most effective way to improve performance of your database without changing either database or application code. In some cases, even the highest service tiers, compute sizes, and performance optimizations might not handle your workload on successful and cost-effective way. In that cases you have these additional options to scale your database:

- [Read scale-out](sql-database-read-scale-out.md) is a feature available in where you are getting one read-only replica of your data where you can execute demanding read-only queries such as reports. Read-only replica will handle your read-only workload without affecting resource usage on your primary database.
- [Database sharding](sql-database-elastic-scale-introduction.md) is a set of techniques that enables you to split your data into several databases and scale them independently.

## Next steps

- For information about improving database performance by changing database code, see [Find and apply performance recommendations](sql-database-advisor-portal.md).
- For information about letting built-in database intelligence optimize your database, see [Automatic tuning](sql-database-automatic-tuning.md).
- For information about Read Scale-out in the Azure SQL Database service, see how to [use read-only replicas to load balance read-only query workloads](sql-database-read-scale-out.md).
- For information about a Database sharding, see [Scaling out with Azure SQL Database](sql-database-elastic-scale-introduction.md).
