---
title: Best practices to migrate into Flexible Server
description: Best practices for a seamless migration into Azure Database for PostgreSQL, including premigration validation, target server configuration, migration timeline, and migration speed benchmarking.
author: hariramt
ms.author: hariramt
ms.reviewer: maghan
ms.date: 01/30/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Best practices for seamless migration into Azure Database for PostgreSQL

[!INCLUDE [applies-to-postgresql-flexible-server](../../includes/applies-to-postgresql-flexible-server.md)]

This article explains common pitfalls encountered and best practices to ensure a smooth and successful migration to Azure Database for PostgreSQL.

## Premigration validation

As a first step in the migration, run the premigration validation before you perform a migration. You can use the **Validate** and **Validate and Migrate** options on the migration setup page. Premigration validation conducts thorough checks against a predefined rule set. The goal is to identify potential problems and provide actionable insights for remedial actions. Keep running premigration validation until it results in a **Succeeded** state. Select [premigration validations](concepts-premigration-migration-service.md) to know more.

## Target Flexible server configuration

During the initial base copy of data, multiple insert statements are executed on the target, which generates WALs (Write Ahead Logs). Until these WALs are archived, the logs consume storage at the target and the storage required by the database.

To calculate the number, sign in to the source instance and execute this command for all the Database(s) to be migrated:

`SELECT pg_size_pretty( pg_database_size('dbname') );`

It's advisable to allocate sufficient storage on the Flexible server, equivalent to 1.25 times or 25% more storage than what is being used per the output to the command above. [Storage Autogrow](../../flexible-server/how-to-auto-grow-storage-portal.md) can also be used.

> [!IMPORTANT]  
> Storage size can't be reduced in manual configuration or Storage Autogrow. Each step in the Storage configuration spectrum doubles in size, so estimating the required storage beforehand is prudent.

The quickstart to [Create an Azure Database for PostgreSQL flexible server using the portal](../../flexible-server/quickstart-create-server-portal.md) is an excellent place to begin. [Compute and storage options in Azure Database for PostgreSQL - Flexible Server](../../flexible-server/concepts-compute-storage.md) also gives detailed information about each server configuration.

## Migration timeline

Each migration has a maximum lifetime of seven days (168 hours) once it starts and will time out after seven days. You can complete your migration and application cutover once the data validation and all checks are complete to avoid the migration from timing out. In Online migrations, after the initial base copy is complete, the cutover window lasts three days (72 hours) before timing out. In offline migrations, the applications should stop writing to the Database to prevent data loss. Similarly, for Online migration, keep traffic low throughout the migration.

Most non-prod servers (dev, UAT, test, staging) are migrated using offline migrations. Since these servers have less data than the production servers, the migration completes fast. For production server migration, you need to know the time it would take to complete the migration to plan for it in advance.

The time taken for a migration to complete depends on several factors. It includes the number of databases, size, number of tables inside each database, number of indexes, and data distribution across tables. It also depends on the SKU of the target server and the IOPS available on the source instance and target server. Given the many factors that can affect the migration time, it's hard to estimate the total time for the migration to complete. The best approach would be to perform a test migration with your workload.

The following phases are considered for calculating the total downtime to perform production server migration.

- **Migration of PITR** - The best way to get a good estimate on the time taken to migrate your production database server would be to take a point-in time restore of your production server and run the offline migration on this newly restored server.

- **Migration of Buffer** - After completing the above step, you can plan for actual production migration during a time period when the application traffic is low. This migration can be planned on the same day or probably a week away. By this time, the size of the source server might have increased. Update your estimated migration time for your production server based on the amount of this increase. If the increase is significant, you can consider doing another test using the PITR server. But for most servers the size increase shouldn't be significant enough.

- **Data Validation** - Once the migration is completed for the production server, you need to verify if the data in the flexible server is an exact copy of the source instance. Customers can use open-source/third-party tools or can do the validation manually. Prepare the validation steps you would like to do before the actual migration. Validation can include:
    
- Row count match for all the tables involved in the migration.

- Matching counts for all the database objects (tables, sequences, extensions, procedures, indexes)

- Comparing max or min IDs of key application-related columns

    > [!NOTE]  
    > The size of databases needs to be the right metric for validation. The source instance might have bloats/dead tuples, which can bump up the size of the source instance. It's completely normal to have size differences between source instances and target servers. If there's an issue in the first three steps of validation, it indicates a problem with the migration.

- **Migration of server settings** - Any custom server parameters, firewall rules (if applicable), tags, and alerts must be manually copied from the source instance to the target.

- **Changing connection strings** - The application should change its connection strings to a flexible server after successful validation. This activity is coordinated with the application team to change all the references of connection strings pointing to the source instance. In the flexible server, the user parameter can be used in the **user=username** format in the connection string.

For example: psql -h **myflexserver**.postgres.database.azure.com -u user1 -d db1

While a migration often runs without a hitch, it's good practice to plan for contingencies if more time is required for debugging or if a migration needs to be restarted.

## Migration speed benchmarking

The following table shows the time it takes to perform migrations for databases of various sizes using the migration service. The migration was performed using a flexible server with the SKU – **Standard_D4ds_v4(4 cores, 16GB Memory, 128 GB disk, and 500 iops)**

| Database size | Approximate time taken (HH:MM) |
| :--- | :--- |
| 1 GB | 00:01 |
| 5 GB | 00:03 |
| 10 GB | 00:08 |
| 50 GB | 00:35 |
| 100 GB | 01:00 |
| 500 GB | 04:00 |
| 1,000 GB | 07:00 |

> [!NOTE]  
> The above numbers give you an approximation of the time taken to complete the migration. We strongly recommend running a test migration with your workload to get a precise value for migrating your server.

> [!IMPORTANT]  
> Pick a higher SKU for your flexible server to perform faster migrations. Azure Database for PostgreSQL Flexible server supports near zero downtime Compute & IOPS scaling so the SKU can be updated with minimal downtime. You can always change the SKU to match the application needs post-migration.

### Improve migration speed - parallel migration of tables

A powerful SKU is recommended for the target, as the PostgreSQL migration service runs out of a container on the Flexible server. A powerful SKU enables more tables to be migrated in parallel. You can scale the SKU back to your preferred configuration after the migration. This section contains steps to improve the migration speed in case the data distribution among the tables needs to be more balanced and/or a more powerful SKU doesn't significantly impact the migration speed.

If the data distribution on the source is highly skewed, with most of the data present in one table, the allocated compute for migration needs to be fully utilized, and it creates a bottleneck. So, we split large tables into smaller chunks, which are then migrated in parallel. This feature applies to tables with more than 10000000 (10 m) tuples. Splitting the table into smaller chunks is possible if one of the following conditions is satisfied.

1. The table must have a column with a simple (not composite) primary key or unique index of type int or significant int.

    > [!NOTE]  
    > In the case of approaches #2 or #3, the user must carefully evaluate the implications of adding a unique index column to the source schema. Only after confirmation that adding a unique index column will not affect the application should the user go ahead with the changes.

1. If the table doesn't have a simple primary key or unique index of type int or significant int but has a column that meets the data type criteria, the column can be converted into a unique index using the command below. This command doesn't require a lock on the table.

    ```sql
        create unique index concurrently partkey_idx on <table name> (column name);
    ```

1. If the table doesn't have a simple int/big int primary key or unique index or any column that meets the data type criteria, you can add such a column using [ALTER](https://www.postgresql.org/docs/current/sql-altertable.html) and drop it post-migration. Running the ALTER command requires a lock on the table.

    ```sql
        alter table <table name> add column <column name> big serial unique;
    ```

If any of the above conditions are satisfied, the table is migrated in multiple partitions in parallel, which should provide a marked increase in the migration speed.

#### How it works

- The migration service looks up the maximum and minimum integer value of the table's Primary key/Unique index that must be split up and migrated in parallel.
- If the difference between the minimum and maximum value is more than 10000000 (10 m), then the table is split into multiple parts, and each part is migrated in parallel.

In summary, the PostgreSQL migration service migrates a table in parallel threads and reduces the migration time if:

- The table has a column with a simple primary key or unique index of type int or significant int.
- The table has at least 10000000 (10 m) rows so that the difference between the minimum and maximum value of the primary key is more than 10000000 (10 m).
- The SKU used has idle cores, which can be used for migrating the table in parallel.

## Vacuum bloat in the PostgreSQL database

Over time, as data is added, updated, and deleted, PostgreSQL might accumulate dead rows and wasted storage space. This bloat can lead to increased storage requirements and decreased query performance. Vacuuming is a crucial maintenance task that helps reclaim this wasted space and ensures the database operates efficiently. Vacuuming addresses issues such as dead rows and table bloat, ensuring efficient use of storage. More importantly, it helps ensure a quicker migration as the migration time taken is a function of the Database size.

PostgreSQL provides the VACUUM command to reclaim storage occupied by dead rows. The `ANALYZE` option also gathers statistics, further optimizing query planning. For tables with heavy write activity, the `VACUUM` process can be more aggressive using `VACUUM FULL`, but it requires more time to execute.

- Standard Vacuum

```sql
VACUUM your_table;
```

- Vacuum with Analyze

```sql
VACUUM ANALYZE your_table;
```

- Aggressive Vacuum for Heavy Write Tables

```sql
VACUUM FULL your_table;
```

In this example, replace your_table with the actual table name. The `VACUUM` command without **FULL** reclaims space efficiently, while `VACUUM ANALYZE` optimizes query planning. The `VACUUM FULL` option should be used judiciously due to its heavier performance impact.

Some Databases store large objects, such as images or documents, that can contribute to database bloat over time. The `VACUUMLO` command is designed for large objects in PostgreSQL.

- Vacuum Large Objects

```sql
VACUUMLO;
```

Regularly incorporating these vacuuming strategies ensures a well-maintained PostgreSQL database.

## Special consideration

There are special conditions that typically refer to unique circumstances, configurations, or prerequisites that learners need to be aware of before proceeding with a tutorial or module. These conditions could include specific software versions, hardware requirements, or additional tools that are necessary for successful completion of the learning content.

### Use of Replica Identity for Online migration

Online migration makes use of logical replication, which has a few [restrictions](https://www.postgresql.org/docs/current/logical-replication-restrictions.html). In addition, it's recommended to have a primary key in all the tables of a database undergoing Online migration. If primary key is absent, the deficiency may result in only insert operations being reflected during migration, excluding updates or deletes. Add a temporary primary key to the relevant tables before proceeding with the online migration. Another option is to use the [REPLICA IDENTIY](https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-REPLICA-IDENTITY) action with `ALTER TABLE`. If none of these options work, perform an offline migration as an alternative.

### Database with postgres_fdw extension

The [postgres_fdw module](https://www.postgresql.org/docs/current/postgres-fdw.html) provides the foreign-data wrapper postgres_fdw, which can be used to access data stored in external PostgreSQL servers. If your database uses this extension, the following steps must be performed to ensure a successful migration.

1. Temporarily remove (unlink) Foreign data wrapper on the source instance.
1. Perform data migration of rest using the Migration service.
1. Restore the Foreign data wrapper roles, user, and Links to the target after migration.

### Database with postGIS extension

The Postgis extension has breaking changes/compact issues between different versions. If you migrate to a flexible server, the application should be checked against the newer postGIS version to ensure that the application isn't impacted or that the necessary changes must be made. The [postGIS news](https://postgis.net/news/) and [release notes](https://postgis.net/docs/release_notes.html#idm45191) are a good starting point to understand the breaking changes across versions.

### Database connection cleanup

Sometimes, you might encounter this error when starting a migration:

`CL003:Target database cleanup failed in the pre-migration step. Reason: Unable to kill active connections on the target database created by other users. Please add the pg_signal_backend role to the migration user using the command 'GRANT pg_signal_backend to <migrationuser>' and try a new migration.`

In this case, you can grant the `migration user` permission to close all active connections to the database or close the connections manually before retrying the migration.

## Related content

- [Migration service](concepts-migration-service-postgresql.md)
- [Known issues and limitations](concepts-known-issues-migration-service.md)