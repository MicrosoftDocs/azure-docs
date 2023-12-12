---
title: "Best Practices for a seamless migration using the Single to Flexible migration tool"
description: Best Practices for a seamless migration using the Single to Flexible migration tool.
author: hariramt, shriramm
ms.author: hariramt, shriramm
ms.reviewer: hasingh
ms.date: 12/12/2023
ms.service: postgresql
ms.subservice: 
ms.topic: conceptual
ms.custom: seo-lt-2023, references_regions
---

# Best Practices for a seamless migration using the Single to Flexible migration tool

[!INCLUDE [applies-to-postgresql-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

This articles explains common pitfalls ecountered and best practices to ensure a smooth and successful migration to the Azure Database for PostgreSQL Flexible Server.

## Pre-Migration Validation

As a first step, it is recommended to run the pre-migration validation before you perform a migration. You can do this using the **Validate** and **Validate and Migrate** options in the migration setup page. Pre-migration validation conducts thorough checks against a predefined rule set. The goal is to identify any potential problems and provide actionable insights for remedial actions. Click [Pre-migration validations](./concepts-single-to-flexible.md#pre-migration-validations) to know more.

## Migration Set up

Each migration has a lifecyle of 7 days (168 hours) once the migration starts and will time out after that. You can plan to complete your migration and application cutover once the data validation and all checks are complete to avoid the migration from timing out. In case of Online migrations, the cutover window has a lifecycle of 3 days (72 hours) before timing out.

> [!NOTE]  
> Online migration is currently supported in limited regions - India Central, India South, Australia Southeast and South East Asia.

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
> In order to perform faster migrations, pick a higher SKU for your flexible server. You can always change the SKU to match the application needs post migration.

### Improve migration speed - Parallel migration of tables

A powerful SKU is recommended for the target as the migration tool runs out of a container on the Flexible server. A powerful SKU enables a greater number of tables to be migrated in parallel. You can scale the SKU back to your preferred configuration after the migration. This section contains steps to improve the migration speed in case the data distribution among the tables is skewed and/or a more powerful SKU doesn't have a significant impact on the migration speed.

If the data distribution on the source is highly skewed, with most of the data present in one table, the allocated compute for migration isn't fully utilized and it creates a bottleneck. So, we split large tables into smaller chunks, which are then migrated in parallel. This feature is applicable to tables that have more than 10000000 (10 m) tuples. Splitting the table into smaller chunks is possible if one of the following conditions is satisfied.  

1. The table must have a column with a simple (not composite) primary key or unique index of type int or big int.

> [!NOTE]  
> In case of approaches #2 or #3 below, the user must carefully evaluate the implications of adding a unique index column to the source schema. Only after confirmation that adding a unique index column will not affect the application should the user go ahead with the changes.

2. If the table doesn't have a simple primary key or unique index of type int or big int, but has a column that meets the data type criteria, the column can be converted into a unique index using the below command. This command does not require a lock on the table.

```sql
    create unique index concurrently partkey_idx on <table name> (column name);
```

3. If the table has neither a simple int/big int primary key or unique index nor any column that meets the data type criteria, you can add such a column using [ALTER](https://www.postgresql.org/docs/current/sql-altertable.html) and drop it post-migration. Running the ALTER command requires a lock on the table.

```sql
    alter table <table name> add column <column name> bigserial unique;
```

If any of the above conditions are satisfied, the table is migrated in multiple partitions in parallel, which should provide a marked increase in the migration speed.

#### How it works

- The migration tool looks up the maximum and minimum integer value of the Primary key/Unique index of that table that must be split up and migrated in parallel.
- If the difference between the minimum and maximum value is more than 10000000 (10 m), then the table is split into multiple parts and each part is migrated separately, in parallel.

In summary, the Single to Flexible migration tool migrates a table in parallel threads and reduce the migration time if:

1. The table has a column with a simple primary key or unique index of type int or big int.
2. The table has at least 10000000 (10 m) rows so that the difference between the minimum and maximum value of the primary key is more than 10000000 (10 m).
3. The SKU used has idle cores, which can be used for migrating the table in parallel.

### Target Flexible server storage configuration

During initial base copy of data, multiple insert statements are executed on the target, which in-turn generates WALs (Write Ahead Logs). Until these WALs are archived, the logs will consume storage at the target in addition to the storage required by the Database. Hence, It is advisable to allocate sufficient storage on the Flexible server, equivalent to 1.25 times or 25% more storage than the Single server. To get an idea of the storage required for migrating your server, we strongly recommend taking a **PITR (point in time restore)** of your single server and running it against the single to flex migration tool. Monitoring the **PITR** migration will give a good estimate of the required storage. [Storage Autogrow](../flexible-server/how-to-auto-grow-storage-portal.md) can also be used.

> [!IMPORTANT]  
> 
- In both manual configuration as well as Storage Autogrow, storage size cannot be reduced. Each step in the Storage configuration spectrum doubles in size so it is prudent to estimate the required storage beforehand.

### Vacuum Bloat in PostgreSQL Database

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

Some Databases store large objects such as images or documents that can contribute to database bloat over time. The `VACUUMLO` command is specifically designed for large objects in PostgreSQL.

-- Vacuum Large Objects
```sql
VACUUMLO;
```

Regularly incorporating these vacuuming strategies ensures a well-maintained PostgreSQL database.

## Next steps

- [Migration tool](concepts-single-to-flexible.md)
- [Migrate to Flexible Server by using the Azure portal](how-to-migrate-single-to-flexible-portal.md)
- [Migrate to Flexible Server by using the Azure CLI](how-to-migrate-single-to-flexible-cli.md)