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
   ms.date="06/14/2016"
   ms.author="nicw;barbkess;sonyama"/>

# Migrate your existing Azure SQL Data Warehouse to premium storage

## Overview

### Reason for migration
SQL Data Warehouse recently introduced [Premium Storage for greater performance predictability][].  We are now ready to migrate your Data Warehouse to Premium Storage.  We estimate that the migration will take around 1 hour per TB of storage.

### Downtime options
#### Automatic migration
By default, we will migrate your database for you during 6pm and 6am in your region's local time at some point during the [automatic migration schedule][] below.  During the migration, your existing Data Warehouse will be unusable.  We will also ensure that you are not charged during any portion of the migration.  For more details and to see any changes in the outage schedule, please see the [automatic migration schedule][] below.

#### Self-migration
If you would like to control your downtime, you have the option of self-migrating your Data Warehouse to Premium Storage using the [self-migration to Premium Storage][] instructions below.  If you choose to self-migrate, you must complete the migration before 6pm in your region's local time before your region's scheduled date for automatic migration (see [automatic migration schedule][] below) to avoid any risk of our automatic migration causing a conflict.

### Have another DW?
To see when other regions will be migrated, please see the [automatic migration schedule][] below.

### Customer support
If you encounter any issues with your Data Warehouse, please [create a support ticket][] and reference “Migration to Premium Storage” as the possible cause.

## Automatic migration details
We estimate that the migration will take around 1 hour per TB of storage per Data Warehouse.  Below are the steps that will occur during the migration.

> [AZURE.NOTE] You will not be able to use your existing Data Warehouse during the migration.  Once the migration is complete, the Data Warehouse will be back online.

### Automatic migration steps
Automatic Migration will does not require any involvement on your part.  The details below are steps that Microsoft is taking on your behalf to complete the migration.  For the purpose of this example, imagine that your existing DW on Standard Storage is currently named “MyDW.”

1.	Microsoft will rename “MyDW” to “MyDW_ DO_NOT_USE_[Timestamp]”
2.	Microsoft will pause “MyDW_ DO_NOT_USE_[Timestamp]”.  During this time Microsoft will be taking a backup.  You may see multiple pause/resumes if we encounter any issues during this process.
3.	Microsoft will create a new DW named “MyDW” on Premium Storage from the backup taken in step 2 above.  “MyDW” will not appear until after the restore is complete.
4.	Once the restore is complete, “MyDW” will return to the same level of DWUs and paused or active state it was before the migration.
5.	Once the migration is complete, Microsoft will delete “MyDW_DO_NOT_USE_[Timestamp]”
	
> [AZURE.NOTE] While most settings will move over from your DW on Standard Storage to your new DW on Premium Storage, these items will not carry over:
> 
	-  Auditing at the Database level will need to be re-enabled
	-  Firewall rules at the Database level will need to be re-added

### Automatic migration schedule
Automatic migration will occur from 6pm – 6am (local time for that region) at some point during the outage schedule listed below.

| Region              | Estimated Start Date         | Estimated End Date           |
| :------------------ | :--------------------------- | :--------------------------- |
| Australia East      | Not determined yet           | Not determined yet           |
| Australia Southeast | Not determined yet           | Not determined yet           |
| Canada Central      | June 23, 2016                | July 1,2016                  |
| Canada East         | June 23, 2016                | July 1,2016                  |
| Central US          | June 23, 2016                | July 1,2016                  |
| China East          | Not determined yet           | Not determined yet           |
| East Asia           | June 23, 2016                | July 1,2016                  |
| East US             | June 23, 2016                | July 1,2016                  |
| East US2            | June 23, 2016                | July 1,2016                  |
| India Central       | June 23, 2016                | July 1,2016                  |
| India South         | June 23, 2016                | July 1,2016                  |
| Japan East          | Not determined yet           | Not determined yet           |
| Japan West          | Not determined yet           | Not determined yet           |
| North Central US    | Not determined yet           | Not determined yet           |
| North Europe        | Not determined yet           | Not determined yet           |
| South Central US    | June 23, 2016                | July 1,2016                  |
| Southeast Asia      | June 23, 2016                | July 1,2016                  |
| West Europe         | June 23, 2016                | July 1,2016                  |
| West US             | June 23, 2016                | July 1,2016                  |

## Self-migration to Premium Storage
If you would like to control when your downtime will occur, you can use the steps below to migrate an existing Data Warehouse on Standard Storage to Premium Storage.  If you choose to self-migrate, you must complete the migration before the maintenance window for your region to avoid any risk of our automatic migration causing a conflict. For details on the outage windows per region, please refer to the [automatic migration schedule][].

> [AZURE.NOTE] SQL Data Warehouse with Premium Storage is not currently geo-redundant.  This means that once your Data Warehouse is migrated over to Premium Storage, the data will only reside in your current region.  Once available, Geo-Backups will copy your Data Warehouse every 24 hours to the [Azure paired region][], allowing you to restore from the Geo-Backup to any region in Azure.  Once Geo-Backup functionality is available for self-migrations, it will be announced on our [main documentation site][].  In contrast, automatic migration will not have this limitation.  

### Determine storage type
If you created a DW before the dates below, you are currently using Standard Storage.

| Region              | DW Created Before This Date       |
| :------------------ | :-------------------------------- |
| Australia East      | Premium Storage Not Yet Available |
| Australia Southeast | Premium Storage Not Yet Available |
| Canada Central      | May 25, 2016                      |
| Canada East         | May 26, 2016                      |
| Central US          | May 26, 2016                      |
| China East          | Premium Storage Not Yet Available |
| East Asia           | May 25, 2016                      |
| East US             | May 26, 2016                      |
| East US2            | May 27, 2016                      |
| India Central       | May 27, 2016                      |
| India South         | May 26, 2016                      |
| Japan East          | Premium Storage Not Yet Available |
| Japan West          | Premium Storage Not Yet Available |
| North Central US    | Premium Storage Not Yet Available |
| North Europe        | Premium Storage Not Yet Available |
| South Central US    | May 27, 2016                      |
| Southeast Asia      | May 24, 2016                      |
| West Europe         | May 25, 2016                      |
| West US             | May 26, 2016                      |


### Self-migration instructions
If you would like to control your downtime, you can Self-Migrate your DW by using backup/restore.  The restore portion of the migration is expected to take around 1 hour per TB of storage per DW.  If you want to keep the same name once migration is complete, follow the optional steps below for [rename workaround][]. 

1.	[Pause][] your DW which will take an automatic backup
2.	[Restore][] from your most recent snapshot
3.	Delete your existing DW on Standard Storage. **If you fail to do this step, you will be charged for both DWs.**

> [AZURE.NOTE] While most settings will move over from your DW on Standard Storage to your new DW on Premium Storage, these items will not carry over:
> 
	- Auditing at the Database level will need to be re-enabled
	- Firewall rules at the Database level will need to be re-added

#### Optional: rename workaround 
Two databases on the same logical server cannot have the same name. As SQL DW currently does not support the RENAME functionality, the instructions below will allow you to get around this missing functionality.

For the purpose of this example, imagine that your existing DW on Standard Storage is currently named “MyDW.”

1.	[Pause][] "MyDW" which will take an automatic backup
2.	[Restore][] from your most recent snapshot a new database with a different name like "MyDWTemp"
3.	Delete "MyDW".  **If you fail to do this step, you will be charged for both DWs.**
4.	Since "MyDWTemp" is a newly created DW, the backup will not be available to restore from for a period of time.  It is recommended to continue operations for a couple of hours on "MyDWTemp" and then continue with steps 5 and 6.
5.	[Pause][] "MyDWTemp" which will take an automatic backup.
6.	[Restore][] from your most recent "MyDWTemp" snapshot a new database with the name "MyDW".
7.	Delete "MyDWTemp". **If you fail to do this step, you will be charged for both DWs.**

> [AZURE.NOTE] While most settings will move over from your DW on Standard Storage to your new DW on Premium Storage, these items will not carry over:
> 
	-  Auditing at the Database level will need to be re-enabled
	-  Firewall rules at the Database level will need to be re-added

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
