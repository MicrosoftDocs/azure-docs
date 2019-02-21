---
title: Migrate your existing Azure SQL Data Warehouse to Gen2 | Microsoft Docs
description: Instructions for migrating an existing data warehouse to Gen2 and the migration schedule by region.
services: sql-data-warehouse
author: mlee3gsd
ms.author: anumjs
ms.reviewer: jrasnick
manager: craigg
ms.assetid: 04b05dea-c066-44a0-9751-0774eb84c689
ms.service: sql-data-warehouse
ms.topic: article
ms.date: 02/09/2019
---
# Upgrade your data warehouse to Gen2
Microsoft is helping drive down the entry-level cost of running a data warehouse capable of handling demanding queries by adding lower compute tiers for Azure SQL Data Warehouse To read full announcement about [Lower compute tier support for Gen2](https://azure.microsoft.com/blog/azure-sql-data-warehouse-gen2-now-supports-lower-compute-tiers/). The new offering is already available in the regions noted in the table below. For supported regions, existing Gen1 data warehouses can be upgraded to Gen2 through either:
- **The automatic upgrade process:** Automatic upgrades do not start as soon as the service is available in a region.  When automatic upgrades start in a specific region, individual DW upgrades will take place during your selected maintenance schedule. 
- **Self-upgrade to Gen2:** If you prefer to control when to upgrade, you can perform a self-upgrade to Gen2. If your region is not yet supported, you can migrate your DW to a region that is supported and then perform a self-upgrade to Gen 2.

## Automated Schedule and Region Availability Table
The following table summarizes by region when the Lower Gen2 compute tier will be available and when automatic upgrades start. The dates are subject to change. Check back to see when your region becomes available.

\* indicates a specific schedule for the region is currently unavailable.

| **Region** | **Lower Gen2 available** | **Automatic upgrades begin** |
|:--- |:--- |:--- |
| Australia East |Available |May 1, 2019 |
| Australia Southeast |March 1, 2019 |June 15, 2019 |
| Brazil South |\* |\* |
| Canada Central |Available |May 1, 2019 |
| Canada East |\* |\* |
| Central US |Available |May 1, 2019 |
| China East |\* |\* |
| China North 1 |\* |\* |
| East Asia |Available |May 1, 2019 |
| East US 1 |Available |March 16, 2019 |
| East US 2 |Available |March 16, 2019 |
| France Central |March 1, 2019 |May 1, 2019 |
| Germany Central |\* |\* |
| India Central |Available |May 1, 2019 |
| India South 1 |March 1, 2019 |June 15, 2019 |
| Japan East |Available |May 1, 2019 |
| Japan West |Available |June 15, 2019 |
| Korea Central |March 1, 2019 |May 1, 2019 |
| Korea South 1 |March 1, 2019 |June 15, 2019 |
| North Central US |March 1, 2019 |June 15, 2019 |
| North Europe |Available |March 16, 2019 |
| South Central US |Available |May 1, 2019 |
| South East Asia |Available |March 16, 2019 |
| UK South |March 1, 2019 |May 1, 2019 |
| UK West 1 |March 1, 2019 |June 15, 2019 |
| West Central US |\* |\* |
| West Europe |Available |March 16, 2019 |
| West US 1 |March 1, 2019 |June 15, 2019 |
| West US 2 |Available |March 16, 2019 |

## Automatic upgrade process

Starting March 16, 2019, we will begin scheduling automated upgrades for your Gen1 instances. To avoid any unexpected interruptions on the availability of the data warehouse, the automated upgrades will be scheduled during your maintenance schedule. For more information on schedules, see [View a maintenance schedule](viewing-maintenance-schedule.md)

The upgrade process will involve a brief drop in connectivity (approx. 5 min) as we restart your data warehouse.  Once your data warehouse has been restarted, it will be fully available for use however, you may experience a degradation in performance while the upgrade process continues to upgrade the data files in the background. The total time for the performance degradation will vary dependent on the size of your data files.

You can also expedite the data file upgrade process by running [Alter Index rebuild](sql-data-warehouse-tables-index.md) on all primary columnstore tables using a larger SLO and resource class after the restart.

> [!NOTE]
> Alter Index rebuild is an offline operation and the tables will not be available until the rebuild completes.

## Self-upgrade to Gen2

Optionally, if you want to upgrade now, you can choose to self-upgrade by following these steps on an existing Gen1 data warehouse. If you choose this option, you must complete the self-upgrade before the automatic upgrade process begins in that region. This ensures that you avoid any risk of the automatic upgrades causing a conflict.

There are two options when conducting a self-upgrade.  You can either upgrade your current data warehouse in-place or you can restore a Gen1 data warehouse into a Gen2 instance.

- [Upgrade in-place](upgrade-to-latest-generation.md) - This option will upgrade your existing Gen1 data warehouse to Gen2. The upgrade process will involve a brief drop in connectivity (approx. 5 min) as we restart your data warehouse.  Once your data warehouse has been restarted, it will be fully available for use. If for any reason you need to restore back to Gen1 from a Gen2 instance, open a [support request](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-get-started-create-support-ticket).
- [Upgrade from restore point](sql-data-warehouse-restore.md) - Create a user-defined restore point on your current Gen1 data warehouse and then restore directly to a Gen2 instance. The existing Gen1 data warehouse will stay in place. Once the restore has been completed, your Gen2 data warehouse will be fully available for use.  Once you have run all testing and validation processes on the restored Gen2 instance, the original Gen1 instance can be deleted.
    - Step 1: From the Azure portal, [create a user-defined restore point](sql-data-warehouse-restore.md#create-a-user-defined-restore-point-using-the-azure-portal).
    - Step 2: When restoring from a user-defined restore point, set the "performance Level" to your preferred Gen2 tier.

You may experience a period of degradation in performance while the upgrade process continues to upgrade the data files in the background. The total time for the performance degradation will vary dependent on the size of your data files.

To expedite the background data migration process, you can immediately force data movement by running [Alter Index rebuild](sql-data-warehouse-tables-index.md) on all primary columnstore tables you'd be querying at a larger SLO and resource class.

> [!NOTE]
> Alter Index rebuild is an offline operation and the tables will not be available until the rebuild completes.

If you encounter any issues with your data warehouse, create a [support request](sql-data-warehouse-get-started-create-support-ticket.md) and reference “Gen2 upgrade” as the possible cause.

For more information, see [Upgrade to Gen2](upgrade-to-latest-generation.md).

## Migration frequently asked questions

**Q: Does Gen2 cost the same as Gen1?**
- A: Yes.

**Q: How will the upgrades affect my automation scripts?**
- A: Any automation script that references a Service Level Objective should be changed to correspond to the Gen2 equivalent.  See details [here](upgrade-to-latest-generation.md#sign-in-to-the-azure-portal).

**Q: How long does a self-upgrade normally take?**
- A: You can upgrade in place or upgrade from a restore point.  
   - Upgrading in place will cause your data warehouse to momentarily pause and resume.  A background process will continue while the data warehouse is online.  
   - It takes longer if you are upgrading through a restore point, because the upgrade will go through the full restore process.

**Q: How long will the auto upgrade take?**
- A: The actual downtime for the upgrade is only the time it takes to pause and resume the service, which is between 5 to 10 minutes. After the brief down-time, a background process will run a storage migration. The length of time for the background process is dependent on the size of your data warehouse.

**Q: When will this automatic upgrade take place?**
- A: During your maintenance schedule. Leveraging your chosen maintenance schedule will minimize disruption to your business.

**Q: What should I do if my background upgrade process seems to be stuck?**
 - A: Kick off a reindex of your Columnstore tables. Note that reindexing of the table will be offline during this operation.

**Q: What if Gen2 does not have the Service Level Objective I have on Gen1?**
- A: If you are running a DW600 or DW1200 on Gen1, it is advised to use DW500c or DW1000c respectively since Gen2 provides more memory, resources, and higher performance than Gen1.

**Q: Can I disable geo-backup?**
- A: No. Geo-backup is an enterprise feature to preserve your data warehouse availability in the event a region becomes unavailable. Open a [support request](sql-data-warehouse-get-started-create-support-ticket.md) if you have further concerns.

**Q: Is there a difference in T-SQL syntax between Gen1 and Gen2?**
- A: There is no change in the T-SQL language syntax from Gen1 to Gen2.

**Q: Does Gen2 support Maintenance Windows?**
- A: Yes.

**Q: Will I be able to create a new Gen1 instance after my region has been upgraded?**
- A: No. After a region has been upgraded, the creation of new Gen1 instances will be disabled.

## Next steps

- [Upgrade steps](upgrade-to-latest-generation.md)
- [Maintenance windows](maintenance-scheduling.md)
- [Resource health monitor](https://docs.microsoft.com/azure/service-health/resource-health-overview)
- [Review Before you begin a migration](upgrade-to-latest-generation.md#before-you-begin)
- [Upgrade in-place and upgrade from a restore point](upgrade-to-latest-generation.md)
- [Create a user-defined restore point](sql-data-warehouse-restore.md#restore-through-the-azure-portal)
- [Learn How to restore to Gen2](sql-data-warehouse-restore.md#restore-an-active-or-paused-database-using-the-azure-portal)
- [Open a SQL Data Warehouse support request](https://go.microsoft.com/fwlink/?linkid=857950)
