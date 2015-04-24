<properties
   pageTitle="SQL Database Service Tiers"
   description="Compare performance and business continuity features of Azure SQL Database service tiers to find the right balance of cost and capability as you scale on demand with no downtime."
   services="sql-database"
   documentationCenter=""
   authors="shontnew"
   manager="jeffreyg"
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="04/15/2015"
   ms.author="shkurhek"/>

# Service Tiers

[SQL Database](sql-database-technical-overview.md) is available in Basic, Standard, and Premium service tiers. All three service tiers have an uptime [SLA](http://azure.microsoft.com/support/legal/sla/) of 99.99% and offer predictable performance, flexible business continuity options, security features, and hourly billing. With multiple performance levels within each service tier, you have the flexibility to choose the level that best meets your workload’s demands. If you need to scale up or down, you can easily change the tiers of your database in the Azure Portal, with zero-downtime for your application. See [Changing Database Service Tiers and Performance Levels](https://msdn.microsoft.com/library/azure/dn369872.aspx) for details.

> [AZURE.IMPORTANT] Web and Business editions are being retired. Find out how to [upgrade Web and Business editions](sql-database-upgrade-new-service-tiers.md). Please read the [Sunset FAQ](http://azure.microsoft.com/pricing/details/sql-database/web-business/) if you plan to continue using Web and Business Editions.

## Basic

Basic tier is designed for applications with a light transactional workload. A typical use case is a lightweight application that needs a small database with a single operation at any given point in time.

**Performance, Size & Features**


| Service Tier | Basic |
| :-- | :-- |
| Database Throughput Units (DTUs) | 5 |
| Maximum Database Size | 2 GB |
| Point-in-time Restore (PITR) | Up to millisecond within last 7 days |
| Disaster Recovery | Geo-Restore, restore to any Azure region |
| Performance Objectives | Transaction rate per hour |


## Standard

Standard tier is the go-to option for getting started with transactional workloads. It offers better performance and better built-in business continuity features compared to Basic tier. A typical use case is an application with multiple concurrent transactions.

**Performance & Size**


| Service Tier | Standard S0 | Standard S1 | Standard S2 | Standard S3 |
| :-- | :-- | :-- | :-- | :-- |
| Database Throughput Units (DTUs) | 10 | 20 | 50 | 100 |
| Maximum Database Size | 250 GB | 250 GB | 250 GB | 250 GB |


**Features**


| Service Tier | Standard (S0, S1, S2, S3) |
| :-- | :-- |
| Point-in-time Restore (PITR) | Up to millisecond within last 14 days |
| Disaster Recovery | Standard geo-replication, 1 offline secondary |
| Performance Objectives | Transaction rate per minute |


## Premium

Premium tier is designed for mission-critical applications. It offers the best level of performance and access to advanced business continuity features including active geo-replication in up to 4 Azure regions of your choice. A typical use case is a mission-critical application with high transactional volume and many concurrent users.

**Performance & Size**


| Service Tier | Premium P1 | Premium P2 | Premium P3 |
| :-- | :-- | :-- | :-- |
| Database Throughput Units (DTUs) | 125 | 250 | 1000 |
| Maximum Database Size | 500 GB | 500 GB | 500 GB |


**Features**


| Service Tier | Premium (P1, P2, P3) |
| :-- | :-- |
| Point-in-time Restore (PITR) | Up to millisecond within last 35 days |
| Disaster Recovery | Active geo-replication, up to 4 online readable secondaries |
| Performance Objectives | Transaction rate per second |


Find out more about the pricing for these tiers on [SQL Database Pricing](http://azure.microsoft.com/pricing/details/sql-database/).

Now that you know about the SQL Database tiers, try them out with a [free trial](http://azure.microsoft.com/pricing/free-trial/) and learn [how to create your first SQL database](sql-database-get-started.md)!
