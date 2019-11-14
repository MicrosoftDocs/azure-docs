---
title: Azure SQL Database - migrate from DTU to vCore | Microsoft Docs
description: Migrate from the DTU model to the vCore model. Migrating to vCore is similar to upgrading or downgrading between the standard and premium tiers.
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: sashan, moslake, carlrab
ms.date: 10/08/2019
---
# Migrate from the DTU-based model to the vCore-based model

## Migrate a database

Migrating a database from the DTU-based purchasing model to the vCore-based purchasing model is similar to upgrading or downgrading between the standard and premium service tiers in the DTU-based purchasing model.

## Migrate databases that use geo-replication

Migrating from the DTU-based model to the vCore-based purchasing model is similar to upgrading or downgrading the geo-replication relationships between databases in the standard and premium service tiers. During migration, you don't have to stop geo-replication, but you must follow these sequencing rules:

- When upgrading, you must upgrade the secondary database first, and then upgrade the primary.
- When downgrading, reverse the order: you must downgrade the primary database first, and then downgrade the secondary.

When you're using geo-replication between two elastic pools, we recommend that you designate one pool as the primary and the other as the secondary. In that case, when you're migrating elastic pools you should use the same sequencing guidance. However, if you have elastic pools that contain both primary and secondary databases, treat the pool with the higher utilization as the primary and follow the sequencing rules accordingly.  

The following table provides guidance for specific migration scenarios:

|Current service tier|Target service tier|Migration type|User actions|
|---|---|---|---|
|Standard|General purpose|Lateral|Can migrate in any order, but need to ensure appropriate vCore sizing*|
|Premium|Business critical|Lateral|Can migrate in any order, but need to ensure appropriate vCore sizing*|
|Standard|Business critical|Upgrade|Must migrate secondary first|
|Business critical|Standard|Downgrade|Must migrate primary first|
|Premium|General purpose|Downgrade|Must migrate primary first|
|General purpose|Premium|Upgrade|Must migrate secondary first|
|Business critical|General purpose|Downgrade|Must migrate primary first|
|General purpose|Business critical|Upgrade|Must migrate secondary first|
||||

\* Every 100 DTUs in the standard tier require at least 1 vCore, and every 125 DTUs in the premium tier require at least 1 vCore.

## Migrate failover groups

Migration of failover groups with multiple databases requires individual migration of the primary and secondary databases. During that process, the same considerations and sequencing rules apply. After the databases are converted to the vCore-based purchasing model, the failover group will remain in effect with the same policy settings.

### Create a geo-replication secondary database

You can create a geo-replication secondary database (a geo-secondary) only by using the same service tier as you used for the primary database. For databases with a high log-generation rate, we recommend creating the geo-secondary with the same compute size as the primary.

If you're creating a geo-secondary in the elastic pool for a single primary database, make sure the `maxVCore` setting for the pool matches the primary database's compute size. If you're creating a geo-secondary for a primary in another elastic pool, we recommend that the pools have the same `maxVCore` settings.

## Use database copy to convert a DTU-based database to a vCore-based database

You can copy any database with a DTU-based compute size to a database with a vCore-based compute size without restrictions or special sequencing as long as the target compute size supports the maximum database size of the source database. The database copy creates a snapshot of the data as of the starting time of the copy operation and doesn't synchronize data between the source and the target.

## Next steps

- For the specific compute sizes and storage size choices available for single databases, see [SQL Database vCore-based resource limits for single databases](sql-database-vcore-resource-limits-single-databases.md).
- For the specific compute sizes and storage size choices available for elastic pools, see [SQL Database vCore-based resource limits for elastic pools](sql-database-vcore-resource-limits-elastic-pools.md).
