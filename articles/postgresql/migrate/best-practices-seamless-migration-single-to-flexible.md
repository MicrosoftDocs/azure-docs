---
title: "Best Practices for a seamless migration using the Single to Flexible migration tool"
description: Best Practices for a seamless migration using the Single to Flexible migration tool.
author: hariramt
ms.author: hariramt
ms.reviewer: shriramm
ms.date: 12/12/2023
ms.service: postgresql
ms.subservice: 
ms.topic: conceptual
ms.custom: seo-lt-2023, references_regions
---

# Best practices for a seamless migration using the Single to Flexible migration tool

[!INCLUDE [applies-to-postgresql-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

This article explains common pitfalls encountered, and best practices to ensure a smooth and successful migration to the Azure Database for PostgreSQL Flexible Server.

## Pre-migration validation

As a first step in the migration, run the pre-migration validation before you perform a migration. You can do this using the **Validate** and **Validate and Migrate** options in the migration setup page. Pre-migration validation conducts thorough checks against a predefined rule set. The goal is to identify any potential problems and provide actionable insights for remedial actions. Keep running pre migration validation until it results in **Succeeded** state. Click [Pre-migration validations](./concepts-single-to-flexible.md#pre-migration-validations) to know more.

## Target Flexible server storage configuration

During initial base copy of data, multiple insert statements are executed on the target, which in-turn generates WALs (Write Ahead Logs). Until these WALs are archived, the logs consume storage at the target in addition to the storage required by the Database. Hence, It's advisable to allocate sufficient storage on the Flexible server, equivalent to 1.25 times or 25% more storage than the Single server. To get an idea of the storage required for migrating your server, we strongly recommend taking a **PITR (point in time restore)** of your single server and running it against the single to flex migration tool. Monitoring the **PITR** migration gives a good estimate of the required storage. [Storage Autogrow](../flexible-server/how-to-auto-grow-storage-portal.md) can also be used.

> [!IMPORTANT]  
> In both manual configuration and Storage Autogrow, storage size can't be reduced. Each step in the Storage configuration spectrum doubles in size so it's prudent to estimate the required storage beforehand.

A good place to begin is the quickstart to [Create an Azure Database for PostgreSQL flexible server using the Portal](../flexible-server/quickstart-create-server-portal.md). [Compute and storage options in Azure Database for PostgreSQL - Flexible Server](../flexible-server/concepts-compute-storage.md) also gives detailed information about each server configuration. Additionally, it's recommended to enable or provision Read replicas and High Availability (HA) after the migration is complete. This precaution ensures that the migration process completes seamlessly.

## Set up Online migration parameters

> [!NOTE]  
> Online migration is currently supported in limited regions - India Central, India South, Australia Southeast and South East Asia. For Onlone migrations using Single servers running PostgreSQL 9.5 and 9.6 we explicitly have to allow replication connection. To enable that, add a firewall entry to allowlist connection from target. Make sure the firewall rule name has `_replrule` suffix. The suffic isn't required for Single servers running PostgreSQL 10 and 11.

For Online migration, the Azure replication support should be set to Logical under the Replication settings of the Single server page in the Azure Portal. In addition, the Server parameters `max_wal_senders` and `max_replication_slots` values should be equal to the number of Databases that need to be migrated. They can also be configured in the command line using the following commands:

- ALTER SYSTEM SET wal_level = logical;
- ALTER SYSTEM SET max_wal_senders = `number of databases to migrate`;
- ALTER SYSTEM SET max_replication_slots = `number of databases to migrate`;

You'll need to restart the source Single server after completing all the Online migration prerequisites.

## Migration timeline

Each migration has a lifecycle of seven days (168 hours) once the migration starts and will time out after seven days. You can plan to complete your migration and application cutover once the data validation and all checks are complete to avoid the migration from timing out. In Online migrations, after the initial base copy is complete, the cutover window has a lifecycle of three days (72 hours) before timing out. In Offline migrations, the applications should stop writing to the Database so that there is no data loss. Similarly, for Online migration, it's recommended to keep traffic low throughout the migration.

In most cases, the non-prod servers (dev, UAT, test, staging) are migrated using offline migrations. Since these servers have less data than the production servers, the migration completes fast. For migration of production server, you need to know the time it would take to complete the migration to plan for it in advance.

The time taken for a migration to complete depends on several factors. It includes the number of databases, size of databases, number of tables inside each database, number of indexes, and the distribution of data across tables. It also depends on the SKU of the source and target server, and the IOPS available on the source and target server. Given the many factors that can affect the migration time, it's hard to estimate the total time for the migration to complete. The best approach would be to try it on a server restored from the primary server.

For calculating the total downtime to perform migration of production server, the following phases are considered.

- **Migration of PITR** - The best way to get a good estimate on the time taken to migrate your production database server would be to take a point-in time restore of your production server and run the offline migration on this newly restored server.

- **Migration of Buffer** - After completing the above step, you can plan for actual production migration during a time period when the application traffic is low. This migration can be planned on the same day or probably a week away. By this time, the size of the source server might have increased. Update your estimated migration time for your production server based on the amount of this increase. If the increase is significant, you can consider doing another test using the PITR server. But for most servers the size increase shouldn't be significant enough.

- **Data Validation** - Once the migration completes for the production server, you need to verify if the data in flexible server is an exact copy of the single server. Customers can use opensource/thirdparty tools or can do the validation manually. Prepare the validation steps that you would like to do in advance of the actual migration. Validation can include:
    * Row count match for all the tables involved in the migration.
    * Matching counts for all the database object (tables, sequences, extensions, procedures, indexes)
    * Comparing max or min IDs of key application related columns

> [!NOTE]  
> The size of databases is not the right metric for validation.The source server might have bloats/dead tuples which can bump up the size on the source server. Also, the storage containers used in single and flexible servers are completely different. It's completely normal to have size differences between source and target servers. If there's an issue in the first three steps of validation, it indicates a problem with the migration.

- **Migration of server settings** - The server parameters, firewall rules (if applicable), tags, alerts need to be manually copied from single server to flexible server.

- **Changing connection strings** - Post successful validation, application should change their connection strings to point to flexible server. This activity is coordinated with the application team to make changes to all the references of connection strings pointing to single server. In the flexible server, the user parameter in the connection string no longer needs to be in the **username@servername** format. You should just use the **user=username** format for this parameter in the connection string
For example
Psql -h **mysingleserver**.postgres.database.azure.com -u **user1@mysingleserver** -d db1
should now be of the format
Psql -h **myflexserver**.postgres.database.azure.com -u user1 -d db1

**Total planned downtime** = **Time to migrate PITR** + **time to migrate Buffer** + **time for Validation** + **time to migrate server settings** + **time to switch connection strings to the flexible server**.

While often a migration runs without a hitch, it's good practice to plan for contingencies if more time is required for debugging or if a migration needs to be restarted.

## Migration speed benchmarking

The following table shows the time for performing migrations for databases of various sizes using the single to flex migration tool. The migration was performed using a flexible server with the SKU – **Standard_D4ds_v4(4 cores, 16GB Memory, 128GB disk and 500 iops)**

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
> The above numbers give you an approximation of the time taken to complete the migration. To get a precise value for migrating your server, we strongly recommend taking a **PITR (point in time restore)** of your single server and running it against the single to flex migration tool.

> [!IMPORTANT]  
> In order to perform faster migrations, pick a higher SKU for your flexible server. Azure Database for PostgreSQL Flexible server supports near zero downtime Compute & IOPS scaling so the SKU can be updated with minimal downtime. You can always change the SKU to match the application needs post migration.

### Improve migration speed - Parallel migration of tables

A powerful SKU is recommended for the target as the migration tool runs out of a container on the Flexible server. A powerful SKU enables a greater number of tables to be migrated in parallel. You can scale the SKU back to your preferred configuration after the migration. This section contains steps to improve the migration speed in case the data distribution among the tables is skewed and/or a more powerful SKU doesn't have a significant impact on the migration speed.

If the data distribution on the source is highly skewed, with most of the data present in one table, the allocated compute for migration isn't fully utilized and it creates a bottleneck. So, we split large tables into smaller chunks, which are then migrated in parallel. This feature is applicable to tables that have more than 10000000 (10 m) tuples. Splitting the table into smaller chunks is possible if one of the following conditions is satisfied.  

1. The table must have a column with a simple (not composite) primary key or unique index of type int or big int.

> [!NOTE]  
> In case of approaches #2 or #3, the user must carefully evaluate the implications of adding a unique index column to the source schema. Only after confirmation that adding a unique index column will not affect the application should the user go ahead with the changes.

2. If the table doesn't have a simple primary key or unique index of type int or big int, but has a column that meets the data type criteria, the column can be converted into a unique index using the below command. This command doesn't require a lock on the table.

```sql
    create unique index concurrently partkey_idx on <table name> (column name);
```

3. If the table doesn't have a simple int/big int primary key or unique index or any column that meets the data type criteria, you can add such a column using [ALTER](https://www.postgresql.org/docs/current/sql-altertable.html) and drop it post-migration. Running the ALTER command requires a lock on the table.

```sql
    alter table <table name> add column <column name> bigserial unique;
```

If any of the above conditions are satisfied, the table is migrated in multiple partitions in parallel, which should provide a marked increase in the migration speed.

#### How it works

- The migration tool looks up the maximum and minimum integer value of the Primary key/Unique index of that table that must be split up and migrated in parallel.
- If the difference between the minimum and maximum value is more than 10000000 (10 m), then the table is split into multiple parts and each part is migrated separately, in parallel.

In summary, the Single to Flexible migration tool migrates a table in parallel threads and reduce the migration time if:

- The table has a column with a simple primary key or unique index of type int or big int.
- The table has at least 10000000 (10 m) rows so that the difference between the minimum and maximum value of the primary key is more than 10000000 (10 m).
- The SKU used has idle cores, which can be used for migrating the table in parallel.

## Vacuum bloat in the PostgreSQL database

Over time, as data is added, updated, and deleted, PostgreSQL may accumulate dead rows and wasted storage space. This can lead to increased storage requirements and decreased query performance. Vacuuming is a crucial maintenance task that helps reclaim this wasted space and ensures the database operates efficiently. Vacuuming addresses issues such as dead rows and table bloat, ensuring efficient use of storage. More importantly, it helps ensure a quicker migration as the migration time taken is a function of the Database size.

PostgreSQL provides the VACUUM command to reclaim storage occupied by dead rows. Additionally, the `ANALYZE` option gathers statistics, further optimizing query planning. For tables with heavy write activity, the `VACUUM` process can be more aggressive by using `VACUUM FULL`, but it requires more time to execute.

-- Standard Vacuum
```sql
VACUUM your_table;
```

-- Vacuum with Analyze
```sql
VACUUM ANALYZE your_table;
```

-- Aggressive Vacuum for Heavy Write Tables
```sql
VACUUM FULL your_table;
```

In this example, replace your_table with the actual table name. The `VACUUM` command without **FULL** reclaims space efficiently, while `VACUUM ANALYZE` optimizes query planning. The `VACUUM FULL` option should be used judiciously due to its heavier performance impact.

Some Databases store large objects such as images or documents that can contribute to database bloat over time. The `VACUUMLO` command is designed for large objects in PostgreSQL.

-- Vacuum Large Objects
```sql
VACUUMLO;
```

Regularly incorporating these vacuuming strategies ensures a well-maintained PostgreSQL database.

## Conclusion

Once the migration is complete, make sure you perform the recommended post-migration activities. Click [Post-migration activities](./concepts-single-to-flexible.md#post-migration) to know more.

## Next steps

- [Migration tool](concepts-single-to-flexible.md)
- [Migrate to Flexible Server by using the Azure portal](how-to-migrate-single-to-flexible-portal.md)
- [Migrate to Flexible Server by using the Azure CLI](how-to-migrate-single-to-flexible-cli.md)