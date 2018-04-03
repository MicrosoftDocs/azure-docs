---
title: Migrate your existing Azure data warehouse to premium storage | Microsoft Docs
description: Instructions for migrating an existing data warehouse to premium storage
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
manager: barbkess
editor: ''

ms.assetid: 04b05dea-c066-44a0-9751-0774eb84c689
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: migrate
ms.date: 03/15/2018
ms.author: elbutter;barbkess

---
# Migrate your data warehouse to premium storage
Azure SQL Data Warehouse recently introduced [premium storage for greater performance predictability][premium storage for greater performance predictability]. Existing data warehouses currently on standard storage can now be migrated to premium storage. You can take advantage of automatic migration, or if you prefer to control when to migrate (which does involve some downtime), you can do the migration yourself.

If you have more than one data warehouse, use the [automatic migration schedule][automatic migration schedule] to determine when it will also be migrated.

## Determine storage type
If you created a data warehouse before the following dates, you are currently using standard storage.

| **Region** | **Data warehouse created before this date** |
|:--- |:--- |
| Australia East |January 1, 2018 |
| China East |November 1, 2016 |
| China North |November 1, 2016 |
| Germany Central |November 1, 2016 |
| Germany Northeast |November 1, 2016 |
| India West |February 1, 2018 |
| Japan West |February 1, 2018 |
| North Central US |November 10, 2016 |

## Automatic migration details
By default, we will migrate your database for you between 6:00 PM and 6:00 AM in your region's local time during the [automatic migration schedule][automatic migration schedule]. Your existing data warehouse will be unusable during the migration. The migration will take approximately one hour per terabyte of storage per data warehouse. You will not be charged during any portion of the automatic migration.

> [!NOTE]
> When the migration is complete, your data warehouse will be back online and usable.
>
>

Microsoft is taking the following steps to complete the migration (these do not require any involvement on your part). In this example, imagine that your existing data warehouse on standard storage is currently named “MyDW.”

1. Microsoft renames “MyDW” to “MyDW_DO_NOT_USE_[Timestamp].”
2. Microsoft pauses “MyDW_DO_NOT_USE_[Timestamp].” During this time, a backup is taken. You may see multiple pauses and resumes if we encounter any issues during this process.
3. Microsoft creates a new data warehouse named “MyDW” on premium storage from the backup taken in step 2. “MyDW” will not appear until after the restore is complete.
4. After the restore is complete, “MyDW” returns to the same data warehouse units and state (paused or active) that it was before the migration.
5. After the migration is complete, Microsoft deletes “MyDW_DO_NOT_USE_[Timestamp]”.

> [!NOTE]
> The following settings do not carry over as part of the migration:
>
> * Auditing at the database level needs to be re-enabled.
> * Firewall rules at the database level need to be re-added. Firewall rules at the server level are not affected.
>
>

### Automatic migration schedule
Automatic migrations occur between 6:00 PM and 6:00 AM (local time per region) during the following outage schedule.

| **Region** | **Estimated start date** | **Estimated end date** |
|:--- |:--- |:--- |
| Australia East |March 19, 2018 |March 20, 2018 |
| China East |Already migrated |Already migrated |
| China North |Already migrated |Already migrated |
| Germany Central |Already migrated |Already migrated |
| Germany Northeast |Already migrated |Already migrated |
| India West |March 19, 2018 |March 20, 2018 |
| Japan West |March 19, 2018 |March 20, 2018 |
| North Central US |Already migrated |Already migrated |

## Self-migration to premium storage
If you want to control when your downtime will occur, you can use the following steps to migrate an existing data warehouse on standard storage to premium storage. If you choose this option, you must complete the self-migration before the automatic migration begins in that region. This ensures that you avoid any risk of the automatic migration causing a conflict (refer to the [automatic migration schedule][automatic migration schedule]).

### Self-migration instructions
To migrate your data warehouse yourself, use the backup and restore features. The restore portion of the migration is expected to take around one hour per terabyte of storage per data warehouse. If you want to keep the same name after migration is complete, follow the [steps to rename during migration][steps to rename during migration].

1. [Pause][Pause] your data warehouse. 
2. [Restore][Restore] from your most recent snapshot.
3. Delete your existing data warehouse on standard storage. **If you fail to do this step, you will be charged for both data warehouses.**

> [!NOTE]
>
> When restoring your data warehouse, verify that the most recent restore point available occurs after your data warehouse was paused.
>
> The following settings do not carry over as part of the migration:
>
> * Auditing at the database level needs to be re-enabled.
> * Firewall rules at the database level need to be re-added. Firewall rules at the server level are not affected.
>
>

#### Rename data warehouse during migration (optional)
Two databases on the same logical server cannot have the same name. SQL Data Warehouse now supports the ability to rename a data warehouse.

In this example, imagine that your existing data warehouse on standard storage is currently named “MyDW.”

1. Rename "MyDW" by using the following ALTER DATABASE command. (In this example, we'll rename it "MyDW_BeforeMigration.")  This command stops all existing transactions, and must be done in the master database to succeed.
   ```
   ALTER DATABASE CurrentDatabasename MODIFY NAME = NewDatabaseName;
   ```
2. [Pause][Pause] "MyDW_BeforeMigration." 
3. [Restore][Restore] from your most recent snapshot a new database with the name it used to be (for example, "MyDW").
4. Delete "MyDW_BeforeMigration." **If you fail to do this step, you will be charged for both data warehouses.**


## Next steps
With the change to premium storage, you also have an increased number of database blob files in the underlying architecture of your data warehouse. To maximize the performance benefits of this change, rebuild your clustered columnstore indexes by using the following script. The script works by forcing some of your existing data to the additional blobs. If you take no action, the data will naturally redistribute over time as you load more data into your tables.

If you encounter any issues with your data warehouse, [create a support ticket][create a support ticket] and reference “migration to premium storage” as the possible cause.

<!--Image references-->

<!--Article references-->
[automatic migration schedule]: #automatic-migration-schedule
[self-migration to Premium Storage]: #self-migration-to-premium-storage
[create a support ticket]: sql-data-warehouse-get-started-create-support-ticket.md
[Azure paired region]: best-practices-availability-paired-regions.md
[main documentation site]: services/sql-data-warehouse.md
[Pause]: sql-data-warehouse-manage-compute-portal.md
[Restore]: sql-data-warehouse-restore-database-portal.md
[steps to rename during migration]: #optional-steps-to-rename-during-migration
[scale compute power]: quickstart-scale-compute-portal.md
[mediumrc role]: resource-classes-for-workload-management.md

<!--MSDN references-->


<!--Other Web references-->
[Premium Storage for greater performance predictability]: https://azure.microsoft.com/en-us/blog/azure-sql-data-warehouse-introduces-premium-storage-for-greater-performance/
[Azure Portal]: https://portal.azure.com
