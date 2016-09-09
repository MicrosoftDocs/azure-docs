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
   ms.date="08/11/2016"
   ms.author="nicw;barbkess;sonyama"/>

# Migration to Premium Storage Details
SQL Data Warehouse recently introduced [Premium Storage for greater performance predictability][].  We are now ready to migrate existing Data Warehouses currently on Standard Storage to Premium Storage.  Read on for more details about how and when automatic migrations occur and how to self-migrate if you prefer to control when the downtime occurs.

If you have more than one Data Warehouse, use the [automatic migration schedule][] below to determine when it will also be migrated.

## Determine storage type
If you created a DW before the dates below, you are currently using Standard Storage.  Each Data Warehouse on Standard Storage that is subject to automatic migration has a notice at the top of the Data Warehouse blade in the [Azure Portal][] that says "*An upcoming upgrade to premium storage will require an outage.  Learn more ->*."

| **Region**          | **DW Created Before This Date**   |
| :------------------ | :-------------------------------- |
| Australia East      | Premium Storage Not Yet Available |
| Australia Southeast | August 5, 2016                    |
| Brazil South        | August 5, 2016                    |
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
| Japan East          | August 5, 2016                    |
| Japan West          | Premium Storage Not Yet Available |
| North Central US    | Premium Storage Not Yet Available |
| North Europe        | August 5, 2016                    |
| South Central US    | May 27, 2016                      |
| Southeast Asia      | May 24, 2016                      |
| West Europe         | May 25, 2016                      |
| West Central US     | Premium Storage Not Yet Available |
| West US             | May 26, 2016                      |
| West US2            | Premium Storage Not Yet Available |

## Automatic migration details
By default, we will migrate your database for you during 6pm and 6am in your region's local time during the [automatic migration schedule][] below.  Your existing Data Warehouse will be unusable during the migration.  We estimate that the migration will take around one hour per TB of storage per Data Warehouse.  We will also ensure that you are not charged during any portion of the automatic migration.

> [AZURE.NOTE] You will not be able to use your existing Data Warehouse during the migration.  Once the migration is complete, your Data Warehouse will be back online.

The details below are steps that Microsoft is taking on your behalf to complete the migration and does not require any involvement on your part.  In this example, imagine that your existing DW on Standard Storage is currently named “MyDW.”

1.	Microsoft renames “MyDW” to “MyDW_DO_NOT_USE_[Timestamp]”
2.	Microsoft pauses “MyDW_DO_NOT_USE_[Timestamp].”  During this time, a backup is taken.  You may see multiple pause/resumes if we encounter any issues during this process.
3.	Microsoft creates a new DW named “MyDW” on Premium Storage from the backup taken in step 2.  “MyDW” will not appear until after the restore is complete.
4.	Once the restore is complete, “MyDW” returns to the same DWUs and paused or active state it was before the migration.
5.	Once the migration is complete, Microsoft deletes “MyDW_DO_NOT_USE_[Timestamp]”
	
> [AZURE.NOTE] These settings do not carry over as part of the migration:
> 
>	-  Auditing at the Database level needs to be re-enabled
>	-  Firewall rules at the **Database** level need to be readded.  Firewall rules at the **Server** level are not be impacted.

### Automatic migration schedule
Automatic migrations occur from 6pm – 6am (local time per region) during the following outage schedule.

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
| West Central US     | August 14, 2016              | August 28, 2016              |
| West US             | June 23, 2016                | July 7, 2016                 |
| West US2            | August 14, 2016              | August 28, 2016              |

## Self-migration to Premium Storage
If you would like to control when your downtime will occur, you can use the following steps to migrate an existing Data Warehouse on Standard Storage to Premium Storage.  If you choose to self-migrate, you must complete the self-migration before the automatic migration begins in that region to avoid any risk of the automatic migration causing a conflict (refer to the [automatic migration schedule][]).

### Self-migration instructions
If you would like to control your downtime, you can self-migrate your Data Warehouse by using backup/restore.  The restore portion of the migration is expected to take around one hour per TB of storage per DW.  If you want to keep the same name once migration is complete, follow the steps for [steps to rename during migration][]. 

1.	[Pause][] your DW which takes an automatic backup
2.	[Restore][] from your most recent snapshot
3.	Delete your existing DW on Standard Storage. **If you fail to do this step, you will be charged for both DWs.**

> [AZURE.NOTE] These settings do not carry over as part of the migration:
> 
>	-  Auditing at the Database level needs to be re-enabled
>	-  Firewall rules at the **Database** level need to be readded.  Firewall rules at the **Server** level are not be impacted.

#### Optional: steps to rename during migration 
Two databases on the same logical server cannot have the same name. SQL Data Warehouse now supports the ability to rename a DW.

In this example, imagine that your existing DW on Standard Storage is currently named “MyDW.”

1.	Rename "MyDW" using the ALTER DATABASE command that follows to something like "MyDW_BeforeMigration."  This command kills all existing transactions and must be done in the master database to succeed.
```
ALTER DATABASE CurrentDatabasename MODIFY NAME = NewDatabaseName;
```
2.	[Pause][] "MyDW_BeforeMigration" which takes an automatic backup
3.	[Restore][] from your most recent snapshot a new database with the name you used to have (ex: "MyDW")
4.	Delete "MyDW_BeforeMigration".  **If you fail to do this step, you will be charged for both DWs.**

> [AZURE.NOTE] These settings do not carry over as part of the migration:
> 
>	-  Auditing at the Database level needs to be re-enabled
>	-  Firewall rules at the **Database** level need to be readded.  Firewall rules at the **Server** level are not be impacted.

## Next steps
With the change to Premium Storage, we have also increased the number of database blob files in the underlying architecture of your Data Warehouse.  If you encounter any performance issues, we recommend that you rebuild your Clustered Columnstore Indexes using the following script.  The script below works by forcing some of your existing data to the additional blobs.  If you take no action, the data will naturally redistribute over time as you load more data into your Data Warehouse tables.

**Pre-requisites:**

1.	Data Warehouse should run with 1,000 DWUs or higher (see [scale compute power][])
2.	User executing the script should be in the [mediumrc role][] or higher
	1.	To add a user to this role, execute the following: 
		1.	````EXEC sp_addrolemember 'xlargerc', 'MyUser'````

````sql
-------------------------------------------------------------------------------
-- Step 1: Create Table to control Index Rebuild
-- Run as user in mediumrc or higher
--------------------------------------------------------------------------------
create table sql_statements
WITH (distribution = round_robin)
as select 
    'alter index all on ' + s.name + '.' + t.NAME + ' rebuild;' as statement,
    row_number() over (order by s.name, t.name) as sequence
from 
    sys.schemas s
    inner join sys.tables t
        on s.schema_id = t.schema_id
where
    is_external = 0
;
go
 
--------------------------------------------------------------------------------
-- Step 2: Execute Index Rebuilds.  If script fails, the below can be rerun to restart where last left off
-- Run as user in mediumrc or higher
--------------------------------------------------------------------------------

declare @nbr_statements int = (select count(*) from sql_statements)
declare @i int = 1
while(@i <= @nbr_statements)
begin
      declare @statement nvarchar(1000)= (select statement from sql_statements where sequence = @i)
      print cast(getdate() as nvarchar(1000)) + ' Executing... ' + @statement
      exec (@statement)
      delete from sql_statements where sequence = @i
      set @i += 1
end;
go
-------------------------------------------------------------------------------
-- Step 3: Cleanup Table Created in Step 1
--------------------------------------------------------------------------------
drop table sql_statements;
go
````

If you encounter any issues with your Data Warehouse, [create a support ticket][] and reference “Migration to Premium Storage” as the possible cause.

<!--Image references-->

<!--Article references-->
[automatic migration schedule]: #automatic-migration-schedule
[self-migration to Premium Storage]: #self-migration-to-premium-storage
[create a support ticket]: ./sql-data-warehouse-get-started-create-support-ticket.md
[Azure paired region]: ./best-practices-availability-paired-regions.md
[main documentation site]: ./services/sql-data-warehouse.md
[Pause]: ./sql-data-warehouse-manage-compute-portal.md/#pause-compute
[Restore]: ./sql-data-warehouse-manage-database-restore-portal.md
[steps to rename during migration]: #optional-steps-to-rename-during-migration
[scale compute power]: ./sql-data-warehouse-manage-compute-portal/#scale-compute-power
[mediumrc role]: ./sql-data-warehouse-develop-concurrency/#workload-management

<!--MSDN references-->


<!--Other Web references-->
[Premium Storage for greater performance predictability]: https://azure.microsoft.com/en-us/blog/azure-sql-data-warehouse-introduces-premium-storage-for-greater-performance/
[Azure Portal]: https://portal.azure.com
