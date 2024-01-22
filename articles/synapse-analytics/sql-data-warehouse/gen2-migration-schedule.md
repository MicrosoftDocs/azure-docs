---
title: Migrate your dedicated SQL pool (formerly SQL DW) to Gen2
description: Instructions for migrating an existing dedicated SQL pool (formerly SQL DW) to Gen2 and the migration schedule by region.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: sngun
ms.date: 01/21/2020
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: article
ms.custom:
  - seo-lt-2019
  - azure-synapse
---
# Upgrade your dedicated SQL pool (formerly SQL DW) to Gen2

Microsoft is helping to reduce the entry-level cost of running a dedicated SQL pool (formerly SQL DW).  Lower compute tiers capable of handling demanding queries are now available for dedicated SQL pool (formerly SQL DW). Read the full announcement [Lower compute tier support for Gen2](https://azure.microsoft.com/blog/azure-sql-data-warehouse-gen2-now-supports-lower-compute-tiers/). The new offering is available in the regions noted in the table below. For supported regions, existing Gen1 dedicated SQL pool (formerly SQL DW) can be upgraded to Gen2 through either:

- **The automatic upgrade process:** Automatic upgrades don't start as soon as the service is available in a region.  When automatic upgrades start in a specific region, individual data warehouse upgrades will take place during your selected maintenance schedule.
- [**Self-upgrade to Gen2:**](#self-upgrade-to-gen2) You can control when to upgrade by doing a self-upgrade to Gen2. If your region is not yet supported, you can restore from a restore point directly to a Gen2 instance in a supported region.

## Automated Schedule and Region Availability Table

The following table summarizes by region when the Lower Gen2 compute tier will be available and when automatic upgrades start. The dates are subject to change. Check back to see when your region becomes available.

\* indicates a specific schedule for the region is currently unavailable.

| **Region** | **Lower Gen2 available** | **Automatic upgrades begin** |
|:--- |:--- |:--- |
| China East |\* |\* |
| China North |\* |\* |

## Automatic upgrade process

Based on the availability chart above, we'll be scheduling automated upgrades for your Gen1 instances. To avoid any unexpected interruptions on the availability of the dedicated SQL pool (formerly SQL DW), the automated upgrades will be scheduled during your maintenance schedule. The ability to create a new Gen1 instance will be disabled in regions undergoing auto upgrade to Gen2. Gen1 will be deprecated once the automatic upgrades have been completed. For more information on schedules, see [View a maintenance schedule](maintenance-scheduling.md#view-a-maintenance-schedule)

The upgrade process will involve a brief drop in connectivity (approximately 5 min) as we restart your dedicated SQL pool (formerly SQL DW).  Once your dedicated SQL pool (formerly SQL DW) has been restarted, it will be fully available for use. However, you may experience a degradation in performance while the upgrade process continues to upgrade the data files in the background. The total time for the performance degradation will vary dependent on the size of your data files.

You can also expedite the data file upgrade process by running [Alter Index rebuild](sql-data-warehouse-tables-index.md) on all primary columnstore tables using a larger SLO and resource class after the restart.

> [!NOTE]
> Alter Index rebuild is an offline operation and the tables will not be available until the rebuild completes.

## Self-upgrade to Gen2

You can choose to self-upgrade by following these steps on an existing Gen1 dedicated SQL pool (formerly SQL DW). If you choose to self-upgrade, you must complete it before the automatic upgrade process begins in your region. Doing so ensures that you avoid any risk of the automatic upgrades causing a conflict.

There are two options when conducting a self-upgrade.  You can either upgrade your current dedicated SQL pool (formerly SQL DW) in-place or you can restore a Gen1 dedicated SQL pool (formerly SQL DW) into a Gen2 instance.

- [Upgrade in-place](upgrade-to-latest-generation.md) - This option will upgrade your existing Gen1 dedicated SQL pool (formerly SQL DW) to Gen2. The upgrade process will involve a brief drop in connectivity (approximately 5 min) as we restart your dedicated SQL pool (formerly SQL DW).  Once restarted, it will be fully available for use. If you experience issues during the upgrade, open a [support request](sql-data-warehouse-get-started-create-support-ticket.md) and reference "Gen2 upgrade" as the possible cause.
- [Upgrade from restore point](sql-data-warehouse-restore-points.md) - Create a user-defined restore point on your current Gen1 dedicated SQL pool (formerly SQL DW) and then restore directly to a Gen2 instance. The existing Gen1 dedicated SQL pool (formerly SQL DW) will stay in place. Once the restore has been completed, your Gen2 dedicated SQL pool (formerly SQL DW) will be fully available for use.  Once you have run all testing and validation processes on the restored Gen2 instance, the original Gen1 instance can be deleted.

  - Step 1: From the Azure portal, [create a user-defined restore point](sql-data-warehouse-restore-active-paused-dw.md).
  - Step 2: When restoring from a user-defined restore point, set the "performance Level" to your preferred Gen2 tier.

You may experience a period of degradation in performance while the upgrade process continues to upgrade the data files in the background. The total time for the performance degradation will vary dependent on the size of your data files.

To expedite the background data migration process, you can immediately force data movement by running [Alter Index rebuild](sql-data-warehouse-tables-index.md) on all primary columnstore tables you'd be querying at a larger SLO and resource class.

> [!NOTE]
> Alter Index rebuild is an offline operation and the tables will not be available until the rebuild completes.

If you encounter any issues with your dedicated SQL pool (formerly SQL DW), create a [support request](sql-data-warehouse-get-started-create-support-ticket.md) and reference "Gen2 upgrade" as the possible cause.

For more information, see [Upgrade to Gen2](upgrade-to-latest-generation.md).

## Migration frequently asked questions

**Q: Does Gen2 cost the same as Gen1?**

- A: Yes.

**Q: How will the upgrades affect my automation scripts?**

- A: Any automation script that references a Service Level Objective should be changed to correspond to the Gen2 equivalent.  See details [here](upgrade-to-latest-generation.md#upgrade-in-a-supported-region-using-the-azure-portal).

**Q: How long does a self-upgrade normally take?**

- A: You can upgrade in place or upgrade from a restore point.

  - Upgrading in place will cause your dedicated SQL pool (formerly SQL DW) to momentarily pause and resume.  A background process will continue while the dedicated SQL pool (formerly SQL DW) is online.  
  - It takes longer if you are upgrading through a restore point, because the upgrade will go through the full restore process.

**Q: How long will the auto upgrade take?**

- A: The actual downtime for the upgrade is only the time it takes to pause and resume the service, which is between 5 to 10 minutes. After the brief down-time, a background process will run a storage migration. The length of time for the background process is dependent on the size of your dedicated SQL pool (formerly SQL DW).

**Q: When will this automatic upgrade take place?**

- A: During your maintenance schedule. Leveraging your chosen maintenance schedule will minimize disruption to your business.

**Q: What should I do if my background upgrade process seems to be stuck?**

- A: Kick off a reindex of your Columnstore tables. Note that reindexing of the table will be offline during this operation.

**Q: What if Gen2 does not have the Service Level Objective I have on Gen1?**

- A: If you are running a DW600 or DW1200 on Gen1, it is advised to use DW500c or DW1000c respectively since Gen2 provides more memory, resources, and higher performance than Gen1.

**Q: Can I disable geo-backup?**

- A: No. Geo-backup is an enterprise feature to preserve your dedicated SQL pool (formerly SQL DW) availability in the event a region becomes unavailable. Open a [support request](sql-data-warehouse-get-started-create-support-ticket.md) if you have further concerns.

**Q: Is there a difference in T-SQL syntax between Gen1 and Gen2?**

- A: There is no change in the T-SQL language syntax from Gen1 to Gen2.

**Q: Does Gen2 support Maintenance Windows?**

- A: Yes.

**Q: Will I be able to create a new Gen1 instance after my region has been upgraded?**

- A: No. After a region has been upgraded, the creation of new Gen1 instances will be disabled.

## Next steps

- [Upgrade steps](upgrade-to-latest-generation.md)
- [Maintenance windows](maintenance-scheduling.md)
- [Resource health monitor](../../service-health/resource-health-overview.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json)
- [Review Before you begin a migration](upgrade-to-latest-generation.md#before-you-begin)
- [Upgrade in-place and upgrade from a restore point](upgrade-to-latest-generation.md)
- [Create a user-defined restore point](sql-data-warehouse-restore-points.md)
- [Learn How to restore to Gen2](sql-data-warehouse-restore-active-paused-dw.md)
- [Open an Azure Synapse Analytics support request](./sql-data-warehouse-get-started-create-support-ticket.md)
