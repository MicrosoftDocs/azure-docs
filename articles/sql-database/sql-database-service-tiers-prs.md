---
title: Azure SQL Database Premium RS service tier retirement | Microsoft Docs
description: The Premium RS service tier is being retired and support for it is ending - see migration options.  
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
ms.date: 02/07/2019
---
# Azure SQL Database Premium RS service tier (preview) is being retired - options for migration

In February 2018, Microsoft announced that the Premium RS service tier in Azure SQL Database would not be released for general availability and would no longer be supported after January 31, 2019. This end of support deadline has been extended to June 30, 2019. This article explains your options for migrating from the Premium RS service tier to another service tier. After June 30, 2019, Microsoft will automatically migrate your Premium RS databases to a generally available service tier that most closely matches the performance requirements of your Premium RS database.

The following are the migration destinations and pricing options that may be suitable for Premium RS customers:

- vCore service tiers

  The **General Purpose** and **Business Critical** service tiers in the [vCore-based purchase model](sql-database-service-tiers-vcore.md). These two service tiers are in general availability. The vCore-based purchasing model also offers the **Hyperscale** service tier that adapts on-demand to your workload's needs with auto-scaling up to 100 TB per database. The Hyperscale service tier provides IO performance comparable to the Premium service tier in the [DTU-based purchasing model](sql-database-service-tiers-dtu.md) at a price closer to the Premium RS service tier.
- Dev/Test pricing

  [Dev/test pricing](https://azure.microsoft.com/pricing/dev-test/) provides savings up to 55% versus license-included rates with your Visual Studio subscription.
- Azure Hybrid Benefit and reserved capacity pricing

  [Azure Hybrid Benefit and reserved capacity pricing](https://azure.microsoft.com/pricing/details/sql-database/) provide savings up to 80% versus license-included rates. For more information on these options, see [Azure Hybrid Benefit for SQL Server](https://azure.microsoft.com/pricing/hybrid-benefit/) and [Azure SQL Database reserved capacity](sql-database-reserved-capacity.md).

## Act now to migrate your Premium RS databases to alternative SQL Database service tiers

Review the guidance in this article along with our pricing and documentation to determine the right migration destination(s) for your Premium RS workloads.

## Migrate compute-intensive workloads and save

For your compute-intensive Premium RS workloads, we recommend migrating to our generally available vCore-based General Purpose service tier and save more versus license-included rates using the Azure Hybrid Benefit for SQL Server and reserved capacity offers. If you would rather remain on a DTU-based purchasing option, you can migrate your compute-intensive Premium RS databases to a Standard service tier and still save versus the Premium RS general availability pricing (if it had gone into general availability).

> [!WARNING]
> Migrating your Premium RS workloads to DTU-based Premium service tiers may increase monthly costs versus current Premium RS pricing. We recommend considering the Hyperscale or Business Critical tiers with Azure Hybrid Benefit and reserved capacity pricing to maintain similar or lower costs than Premium RS.

### Premium RS databases

|**If you are currently on…**|**Migrate to comparable vCore-based…**|**Migrate to comparable DTU-based…**|
|---|---|---|
|Premium RS 1|General Purpose 1 vCore (Gen4)|Standard 3|
|Premium RS 2|General Purpose 2 vCores (Gen4)|Standard 4|
|Premium RS 4|General Purpose 4 vCores (Gen4)|Standard 6|
|Premium RS 6|General Purpose 6 vCores (Gen4)|Standard 7|

### Premium RS pools

|**If you are currently on…**|**Migrate to comparable vCore-based…**|**Migrate to comparable DTU-based…**|
|---|---|---|
|Premium RS pool 125 DTU|General Purpose 1 vCore (Gen4)|Standard pool 100 eDTUs|
|Premium RS pool 250 DTU|General Purpose 2 vCores (Gen4)|Standard pool 250 eDTUs|
|Premium RS pool 500 DTU|General Purpose 4 vCores (Gen4)|Standard pool 500 eDTUs|
|Premium RS pool 1000 DTU|General Purpose 8 vCores (Gen4)|Standard pool 1000 eDTUs|

## Optimize savings and performance for your IO-intensive workloads

We recommend migrating your IO-intensive single databases to our vCore-based Hyperscale tier, currently in preview, and your IO-intensive database pools to our generally available Business Critical tier, for the optimal combination of performance and cost.  The following vCore-based options will maintain or improve your current performance and may save you money when combined with the Azure Hybrid Benefit and reserved capacity pricing.

|**If you are currently on…**|**Migrate to comparable vCore-based…**|**Migrate to comparable DTU-based…**|
|---|---|---|
|Premium RS 1| Hyperscale 1 vCore (Gen4) or Business Critical 1 vCore (Gen4)|Premium 1|
|Premium RS 2| Hyperscale 2 vCores (Gen4) or Business Critical 2 vCores (Gen4|Premium 2|
|Premium RS 4| Hyperscale 4 vCores (Gen4) or Business Critical 4 vCores (Gen4)|Premium 4
|Premium RS 6| Hyperscale 6 vCores (Gen4) or Business Critical 6 vCores (Gen4)|Premium 6|

|**If you are currently on…**|**Migrate to comparable vCore-based…**|**Migrate to comparable DTU-based…**|
|---|---|---|
|Premium RS pool 125 DTU|Business Critical 2 vCores (Gen4)|Premium pool 125 eDTUs|
|Premium RS pool 250 DTU|Business Critical 2 vCores (Gen4)|Premium pool 250 eDTUs|
|Premium RS pool 500 DTU|Business Critical 4 vCores (Gen4)|Premium pool 500 eDTUs|
|Premium RS pool 1000 DTU|Business Critical 8 vCores (Gen4)|Premium pool 1000 eDTUs|

## Take advantage of our new offers

Our service tiers in the vCore-based purchasing model are eligible for special offers that can save you up to 80% versus license-included pricing. Use your SQL Server Standard or Enterprise edition licenses with active Software Assurance to save up to 55% versus license-included pricing with the [Azure Hybrid Benefit for SQL Server](https://azure.microsoft.com/pricing/hybrid-benefit/). You can combine the hybrid benefit with [Azure SQL Database reserved capacity](sql-database-reserved-capacity.md) pricing and save up to 80% when you commit upfront to a one or three-year term.  Activate both benefits today from Azure portal.

If you have any questions or concerns regarding this change or if you require migration assistance, contact [Microsoft](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

## Migration from a Premium RS service tier to a service tier in either the DTU or the vCore model

### Migration of a database

Migrating a database from a Premium RS service tier to a service tier in either the DTU or the vCore model is similar to upgrading or downgrading between service tiers in the Premium RS service tier.

### Using database copy to convert a Premium RS database to a DTU-based or vCore-based database

You can copy any database with a Premium RS compute size to a database with a DTU-based or vCore-based compute size without restrictions or special sequencing as long as the target compute size supports the maximum database size of the source database. The database copy creates a snapshot of data as of the starting time of the copy operation and does not perform data synchronization between the source and the target.

## Next steps

- For details on specific compute sizes and storage size choices available for single database, see [SQL Database vCore-based resource limits for single databases](sql-database-vcore-resource-limits-single-databases.md)
- For details on specific compute sizes and storage size choices available for elastic pools, see [SQL Database vCore-based resource limits for elastic pools](sql-database-vcore-resource-limits-elastic-pools.md).
