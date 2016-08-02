<properties
   pageTitle="Migrate your existing Azure SQL Data Warehouse to premium storage | Microsoft Azure"
   description="Instructions for migrating an existing SQL Data Warehouse to premium storage"
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="happynicolle"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="08/2/2016"
   ms.author="nicw;barbkess;sonyama"/>

# Migration to Premium Storage Details
SQL Data Warehouse recently introduced [Premium Storage for greater performance predictability][].  We are now ready to migrate existing Data Warehouses currently on Standard Storage to Premium Storage.  Read on for more details about how and when automatic migrations will occur and how to self-migrate if you prefer to control when the downtime occurs.

If you have more than one Data Warehouse, please use the [automatic migration schedule][] below to determine when it will also be migrated.

## Determine storage type
If you created a DW before the dates below, you are currently using Standard Storage.  In addition to this, each Data Warehouse on Standard Storage that will be migrated will have a notice in the [Azure Portal][] at the top of the Data Warehouse blade saying "*An upcoming upgrade to premium storage will require an outage.  Learn more ->*".

| **Region**          | **DW Created Before This Date**   |
| :------------------ | :-------------------------------- |
| Australia East      | Premium Storage Not Yet Available |
| Australia Southeast | Premium Storage Not Yet Available |
| Brazil South        | Premium Storage Not Yet Available |
| Canada Central      | May 25, 2016                      |
| Canada East         | May 26, 2016                      |
| Central US          | May 26, 2016                      |
| China East          | Premium Storage Not Yet Available |
| China North         | Premium Storage Not Yet Available |
| East Asia           | May 25, 2016                      |
| East US             | May 26, 2016                      |
| East US2            | May 27, 2016                      |
| India Central       | May 27, 2016                      |
| India South         | May 26, 2016                      |
| India West          | Premium Storage Not Yet Available |
| Japan East          | Premium Storage Not Yet Available |
| Japan West          | Premium Storage Not Yet Available |
| North Central US    | Premium Storage Not Yet Available |
| North Europe        | Premium Storage Not Yet Available |
| South Central US    | May 27, 2016                      |
| Southeast Asia      | May 24, 2016                      |
| West Europe         | May 25, 2016                      |
| West US             | May 26, 2016                      |

## Automatic migration details
By default, we will migrate your database for you during 6pm and 6am in your region's local time at some point during the [automatic migration schedule][] below.  During the migration, your existing Data Warehouse will be unusable.  We estimate that the migration will take around 1 hour per TB of storage per Data Warehouse.  We will also ensure that you are not charged during any portion of the migration.

> [AZURE.NOTE] You will not be able to use your existing Data Warehouse during the migration.  Once the migration is complete, your Data Warehouse will be back online.

The details below are steps that Microsoft is taking on your behalf to complete the migration and does not require any involvement on your part.  For the purpose of this example, imagine that your existing DW on Standard Storage is currently named “MyDW.”

1.	Microsoft will rename “MyDW” to “MyDW_DO_NOT_USE_[Timestamp]”
2.	Microsoft will pause “MyDW_DO_NOT_USE_[Timestamp]”.  During this time Microsoft will be taking a backup.  You may see multiple pause/resumes if we encounter any issues during this process.
3.	Microsoft will create a new DW named “MyDW” on Premium Storage from the backup taken in step 2 above.  “MyDW” will not appear until after the restore is complete.
4.	Once the restore is complete, “MyDW” will return to the same level of DWUs and paused or active state it was before the migration.
5.	Once the migration is complete, Microsoft will delete “MyDW_DO_NOT_USE_[Timestamp]”
	
> [AZURE.NOTE] These settings will not carry over as part of the migration:
> 
>	-  Auditing at the Database level will need to be re-enabled
>	-  Firewall rules at the **Database** level will need to be re-added.  Firewall rules at the **Server** level will not be impacted.

### Automatic migration schedule
Automatic migration will occur from 6pm – 6am (local time for that region) at some point during the outage schedule listed below.

| **Region**          | **Estimated Start Date**     | **Estimated End Date**       |
| :------------------ | :--------------------------- | :--------------------------- |
| Australia East      | Not determined yet           | Not determined yet           |
| Australia Southeast | August 10, 2016              | August 24, 2016              |
| Brazil South        | August 10, 2016              | August 24, 2016              |
| Canada Central      | June 23, 2016                | July 1, 2016                 |
| Canada East         | June 23, 2016                | July 1, 2016                 |
| Central US          | June 23, 2016                | July 4, 2016                 |
| China East          | Not determined yet           | Not determined yet           |
| China North         | Not determined yet           | Not determined yet           |
| East Asia           | June 23, 2016                | July 1, 2016                 |
| East US             | June 23, 2016                | July 11, 2016                |
| East US2            | June 23, 2016                | July 8, 2016                 |
| India Central       | June 23, 2016                | July 1, 2016                 |
| India South         | June 23, 2016                | July 1, 2016                 |
| India West          | Not determined yet           | Not determined yet           |
| Japan East          | August 10, 2016              | August 24, 2016              |
| Japan West          | Not determined yet           | Not determined yet           |
| North Central US    | Not determined yet           | Not determined yet           |
| North Europe        | August 10, 2016              | August 24, 2016              |
| South Central US    | June 23, 2016                | July 2, 2016                 |
| Southeast Asia      | June 23, 2016                | July 1, 2016                 |
| West Europe         | June 23, 2016                | July 8, 2016                 |
| West US             | June 23, 2016                | July 7, 2016                 |

## Self-migration to Premium Storage
If you would like to control when your downtime will occur, you can use the steps below to migrate an existing Data Warehouse on Standard Storage to Premium Storage.  If you choose to self-migrate, you must complete the self-migration before the automatic migration begins in that region to avoid any risk of the automatic migration causing a conflict (refer to the [automatic migration schedule][]).

### Self-migration instructions
If you would like to control your downtime, you can self-migrate your Data Warehouse by using backup/restore.  The restore portion of the migration is expected to take around 1 hour per TB of storage per DW.  If you want to keep the same name once migration is complete, follow the steps below for [rename workaround][]. 

1.	[Pause][] your DW which will take an automatic backup
2.	[Restore][] from your most recent snapshot
3.	Delete your existing DW on Standard Storage. **If you fail to do this step, you will be charged for both DWs.**

> [AZURE.NOTE] These settings will not carry over as part of the migration:
> 
>	-  Auditing at the Database level will need to be re-enabled
>	-  Firewall rules at the **Database** level will need to be re-added.  Firewall rules at the **Server** level will not be impacted.

#### Optional: steps to rename during migration 
Two databases on the same logical server cannot have the same name. SQL Data Warehouse now supports the ability to rename a DW.

For the purpose of this example, imagine that your existing DW on Standard Storage is currently named “MyDW.”

1.	Rename "MyDW" using the ALTER DATABASE command below to something like "MyDW_BeforeMigration".  This will kill all existing transactions and must be done in the master database to succeed.

```sql
ALTER DATABASE CurrentDatabasename MODIFY NAME = NewDatabaseName;
```	

2.	[Pause][] "MyDW_BeforeMigration" which will take an automatic backup
3.	[Restore][] from your most recent snapshot a new database with the name you used to have (ex: "MyDW")
4.	Delete "MyDW_BeforeMigration".  **If you fail to do this step, you will be charged for both DWs.**

> [AZURE.NOTE] These settings will not carry over as part of the migration:
> 
>	-  Auditing at the Database level will need to be re-enabled
>	-  Firewall rules at the **Database** level will need to be re-added.  Firewall rules at the **Server** level will not be impacted.

## Next steps
If you encounter any issues with your Data Warehouse, please [create a support ticket][] and reference “Migration to Premium Storage” as the possible cause.

<!--Image references-->

<!--Article references-->
[automatic migration schedule]: #automatic-migration-schedule
[self-migration to Premium Storage]: #self-migration-to-premium-storage
[create a support ticket]: ./sql-data-warehouse-get-started-create-support-ticket.md
[Azure paired region]: ./best-practices-availability-paired-regions.md
[main documentation site]: ./services/sql-data-warehouse.md
[Pause]: ./sql-data-warehouse-manage-compute-portal.md/#pause-compute
[Restore]: ./sql-data-warehouse-manage-database-restore-portal.md
[rename workaround]: #optional-rename-workaround

<!--MSDN references-->


<!--Other Web references-->
[Premium Storage for greater performance predictability]: https://azure.microsoft.com/en-us/blog/azure-sql-data-warehouse-introduces-premium-storage-for-greater-performance/
[Azure Portal]: https://portal.azure.com
