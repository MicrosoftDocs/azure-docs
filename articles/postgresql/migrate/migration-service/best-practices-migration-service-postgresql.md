---
title: Best practices to migrate into Flexible Server
description: Best practices for migration into Azure Database for PostgreSQL, including premigration validation, target server configuration, migration timeline, and migration speed benchmarking.
author: hariramt
ms.author: hariramt
ms.reviewer: maghan
ms.date: 06/19/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Best practices for seamless migration into Azure Database for PostgreSQL

[!INCLUDE [applies-to-postgresql-flexible-server](~/reusable-content/ce-skilling/azure/includes/postgresql/includes/applies-to-postgresql-flexible-server.md)]

This article explains common pitfalls encountered and best practices to ensure a smooth and successful migration to Azure Database for PostgreSQL.

## Premigration validation

As a first step in the migration, run the premigration validation before you perform a migration. You can use the **Validate** and **Validate and Migrate** options on the migration **Setup** page. Premigration validation conducts thorough checks against a predefined rule set. The goal is to identify potential problems and provide actionable insights for remedial actions. Keep running premigration validation until it results in a **Succeeded** state. To learn more, see [Premigration validations](concepts-premigration-migration-service.md).

## Target Flexible Server configuration

During the initial base copy of data, multiple insert statements are executed on the target, which generates write-ahead logs (WALs). Until these WALs are archived, the logs consume storage at the target and the storage required by the database.

To calculate the number, sign in to the source instance and run this command for all the databases to be migrated:

`SELECT pg_size_pretty( pg_database_size('dbname') );`

We recommend that you allocate sufficient storage on the flexible server, equivalent to 1.25 times or 25% more storage than what's being used per the output to the preceding command. You can also use [Storage Autogrow](../../flexible-server/how-to-auto-grow-storage-portal.md).

> [!IMPORTANT]  
> Storage size can't be reduced in manual configuration or Storage Autogrow. Each step in the storage configuration spectrum doubles in size, so estimating the required storage beforehand is prudent.

The quickstart to [create an Azure Database for PostgreSQL - Flexible Server instance by using the portal](../../flexible-server/quickstart-create-server-portal.md) is an excellent place to begin. For more information about each server configuration, see [Compute and storage options in Azure Database for PostgreSQL - Flexible Server](../../flexible-server/concepts-compute-storage.md).

## Migration timeline

Each migration has a maximum lifetime of seven days (168 hours) after it starts, and it times out after seven days. You can complete your migration and application cutover after the data validation and all checks are complete to avoid the migration from timing out. In online migrations, after the initial base copy is complete, the cutover window lasts three days (72 hours) before timing out. In offline migrations, the applications should stop writing to the database to prevent data loss. Similarly, for online migration, keep traffic low throughout the migration.

Most nonproduction servers (dev, UAT, test, and staging) are migrated by using offline migrations. Because these servers have less data than the production servers, the migration is fast. For production server migration, you need to know the time it would take to complete the migration to plan for it in advance.

The time taken for a migration to complete depends on several factors. It includes the number of databases, size, number of tables inside each database, number of indexes, and data distribution across tables. It also depends on the SKU of the target server and the IOPS available on the source instance and target server. With so many factors that can affect the migration time, it's hard to estimate the total time for a migration to complete. The best approach is to perform a test migration with your workload.

The following phases are considered for calculating the total downtime to perform production server migration:

- **Migration of PITR**: The best way to get a good estimate on the time taken to migrate your production database server is to take a point-in time restore (PITR) of your production server and run the offline migration on this newly restored server.
- **Migration of buffer**: After you finish the preceding step, you can plan for actual production migration during a time period when application traffic is low. This migration can be planned on the same day or probably a week away. By this time, the size of the source server might have increased. Update your estimated migration time for your production server based on the amount of this increase. If the increase is significant, consider doing another test by using the PITR server. But for most servers, the size increase shouldn't be significant enough.
- **Data validation**: After the migration is finished for the production server, you need to verify if the data in the flexible server is an exact copy of the source instance. You can use open-source or third-party tools or you can do the validation manually. Prepare the validation steps you want to do before the actual migration. Validation can include:

   - Row count match for all the tables involved in the migration.
   - Matching counts for all the database objects (tables, sequences, extensions, procedures, and indexes).
   - Comparing maximum or minimum IDs of key application-related columns.

    > [!NOTE]
    > The comparative size of databases is not the right metric for validation. The source instance might have bloats or dead tuples, which can bump up the size of the source instance. It's normal to have size differences between source instances and target servers. An issue in the preceding three steps of validation indicates a problem with the migration.

- **Migration of server settings**: Any custom server parameters, firewall rules (if applicable), tags, and alerts must be manually copied from the source instance to the target.
- **Changing connection strings**: The application should change its connection strings to a flexible server after successful validation. This activity is coordinated with the application team to change all the references of connection strings pointing to the source instance. In the flexible server, the user parameter can be used in the **user=username** format in the connection string.

For example: `psql -h myflexserver.postgres.database.azure.com -u user1 -d db1`

Although a migration often runs without any problems, it's good practice to plan for contingencies if more time is required for debugging or if a migration needs to be restarted.

## Migration speed benchmarking

The following table shows the time it takes to perform migrations for databases of various sizes by using the migration service. The migration was performed by using a flexible server with the SKU Standard_D4ds_v4 (4 cores, 16-GB memory, 128-GB disk, and 500 IOPS).

| Database size | Approximate time taken (HH:MM) |
| :--- | :--- |
| 1 GB | 00:01 |
| 5 GB | 00:03 |
| 10 GB | 00:08 |
| 50 GB | 00:35 |
| 100 GB | 01:00 |
| 500 GB | 04:00 |
| 1,000 GB | 07:00 |

The preceding numbers give you an approximation of the time taken to complete the migration. We strongly recommend running a test migration with your workload to get a precise value for migrating your server.

> [!IMPORTANT]  
> Choose a higher SKU for your flexible server to perform faster migrations. Azure Database for PostgreSQL - Flexible Server supports near-zero downtime compute and IOPS scaling, so the SKU can be updated with minimal downtime. You can always change the SKU to match the application needs post-migration.

### Improve migration speed: Parallel migration of tables

We recommend a powerful SKU for the target because the PostgreSQL migration service runs out of a container on the flexible server. A powerful SKU enables more tables to be migrated in parallel. You can scale the SKU back to your preferred configuration after the migration. This section contains steps to improve the migration speed if the data distribution among the tables needs to be more balanced or a more powerful SKU doesn't significantly affect the migration speed.

If the data distribution on the source is highly skewed, with most of the data present in one table, the allocated compute for migration needs to be fully utilized, which creates a bottleneck. So, split large tables into smaller chunks, which are then migrated in parallel. This feature applies to tables with more than 1,000,000 (1 m) tuples. Splitting the table into smaller chunks is possible if one of the following conditions is satisfied:

- The table must have a column with a simple (not composite) primary key or unique index of type `int` or `significant int`.

    > [!NOTE]
    > In the case of the first or second approaches, you must carefully evaluate the implications of adding a unique index column to the source schema. Only after confirmation that adding a unique index column won't affect the application should you go ahead with the changes.

- If the table doesn't have a simple primary key or unique index of type `int` or `significant int` but has a column that meets the data type criteria, the column can be converted into a unique index by using the following command. This command doesn't require a lock on the table.

    ```sql
        create unique index concurrently partkey_idx on <table name> (column name);
    ```

- If the table doesn't have a `simple int`/`big int` primary key or unique index or any column that meets the data type criteria, you can add such a column by using [ALTER](https://www.postgresql.org/docs/current/sql-altertable.html) and drop it post-migration. Running the `ALTER` command requires a lock on the table.

    ```sql
        alter table <table name> add column <column name> big serial unique;
    ```

If any of the preceding conditions are satisfied, the table is migrated in multiple partitions in parallel, which should provide an increase in the migration speed.

#### How it works

- The migration service looks up the maximum and minimum integer value of the table's primary key/unique index that must be split up and migrated in parallel.
- If the difference between the minimum and maximum value is more than 1,000,000 (1 m), the table is split into multiple parts and each part is migrated in parallel.

In summary, the PostgreSQL migration service migrates a table in parallel threads and reduces the migration time if:

- The table has a column with a simple primary key or unique index of type int or significant int.
- The table has at least 1,000,000 (1 m) rows so that the difference between the minimum and maximum value of the primary key is more than 1,000,000 (1 m).
- The SKU used has idle cores, which can be used for migrating the table in parallel.

## Vacuum bloat in the PostgreSQL database

Over time, as data is added, updated, and deleted, PostgreSQL might accumulate dead rows and wasted storage space. This bloat can lead to increased storage requirements and decreased query performance. Vacuuming is a crucial maintenance task that helps reclaim this wasted space and ensures the database operates efficiently. Vacuuming addresses issues such as dead rows and table bloat to ensure efficient use of storage. It also helps to ensure quicker migration because the migration time is a function of the database size.

PostgreSQL provides the `VACUUM` command to reclaim storage occupied by dead rows. The `ANALYZE` option also gathers statistics to further optimize query planning. For tables with heavy write activity, the `VACUUM` process can be more aggressive by using `VACUUM FULL`, but it requires more time to run.

- Standard vacuum

    ```sql
    VACUUM your_table;
    ```

- Vacuum with analyze

    ```sql
    VACUUM ANALYZE your_table;
    ```

- Aggressive vacuum for heavy write tables

    ```sql
    VACUUM FULL your_table;
    ```

In this example, replace your_table with the actual table name. The `VACUUM` command without `FULL` reclaims space efficiently, whereas `VACUUM ANALYZE` optimizes query planning. The `VACUUM FULL` option should be used judiciously because of its heavier performance impact.

Some databases store large objects, such as images or documents, that can contribute to database bloat over time. The `VACUUMLO` command is designed for large objects in PostgreSQL.

- Vacuum large objects

    ```sql
    VACUUMLO;
    ```

Regularly incorporating these vacuuming strategies ensures a well-maintained PostgreSQL database.

## Special consideration

There are special conditions that typically refer to unique circumstances, configurations, or prerequisites that you need to be aware of before you proceed with a tutorial or module. These conditions could include specific software versions, hardware requirements, or other tools that are necessary for successful completion of the learning content.

### Online migration

Online migration makes use of [pgcopydb follow](https://pgcopydb.readthedocs.io/en/latest/ref/pgcopydb_follow.html), and some of the [logical decoding restrictions](https://pgcopydb.readthedocs.io/en/latest/ref/pgcopydb_follow.html#pgcopydb-follow) apply. We also recommend that you have a primary key in all the tables of a database that's undergoing online migration. If a primary key is absent, the deficiency results in only `insert` operations being reflected during migration, excluding updates or deletes. Add a temporary primary key to the relevant tables before you proceed with the online migration.

> [!NOTE]
> In the case of online migration of tables without a primary key, only `insert` operations are replayed on the target. This can potentially introduce inconsistency in the database if records that are updated or deleted on the source don't reflect on the target.

An alternative is to use the `ALTER TABLE` command where the action is [REPLICA IDENTIY](https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-REPLICA-IDENTITY) with the `FULL` option. The `FULL` option records the old values of all columns in the row so that even in the absence of a primary key, all CRUD operations are reflected on the target during the online migration. If none of these options work, perform an offline migration as an alternative.

### Database with postgres_fdw extension

The [postgres_fdw module](https://www.postgresql.org/docs/current/postgres-fdw.html) provides the foreign data wrapper postgres_fdw, which can be used to access data stored in external PostgreSQL servers. If your database uses this extension, the following steps must be performed to ensure a successful migration.

1. Temporarily remove (unlink) the foreign data wrapper on the source instance.
1. Perform data migration of the rest by using the migration service.
1. Restore the foreign data wrapper roles, user, and links to the target after migration.

### Database with postGIS extension

The postGIS extension has breaking changes/compact issues between different versions. If you migrate to a flexible server, the application should be checked against the newer postGIS version to ensure that the application isn't affected or that the necessary changes must be made. The [postGIS news](https://postgis.net/news/) and [release notes](https://postgis.net/docs/release_notes.html#idm45191) are a good starting point to understand the breaking changes across versions.

### Database connection cleanup

Sometimes, you might encounter this error when you start a migration:

`CL003:Target database cleanup failed in the pre-migration step. Reason: Unable to kill active connections on the target database created by other users. Please add the pg_signal_backend role to the migration user using the command 'GRANT pg_signal_backend to <migrationuser>' and try a new migration.`

In this scenario, you can grant the `migration user` permission to close all active connections to the database or close the connections manually before you retry the migration.

## Related content

- [Migration service](concepts-migration-service-postgresql.md)
- [Known issues and limitations](concepts-known-issues-migration-service.md)
