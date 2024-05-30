---
title: Enable and use pg_partman
description: Learn how to enable and use pg_partman on Azure Database for PostgreSQL - Flexible Server to optimize database performance and improve query speed.
ms.author: gapaderla
author: GayathriPaderla
ms.reviewer: sbalijepalli, maghan
ms.date: 05/17/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
#customer intent: As a developer, I want to learn how to enable and use pg_partman on Azure Database for PostgreSQL - Flexible Server so that I can optimize my database performance.
---

# Enable and use pg_partman on Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

In this article, you learn how to optimize Azure Database for PostgreSQL - Flexible Server by using the PostgreSQL Partition Manager (`pg_partman`) extension.

When tables in a database become large, it's hard to manage how often they're vacuumed, how much space they take up, and how to keep their indexes efficient. This difficulty can make queries slower and affect performance. Partitioning of large tables is a solution for these situations.

In this article, you use `pg_partman` to create range-based partitions of tables in your Azure Database for PostgreSQL flexible server.

## Prerequisites

To enable the `pg_partman` extension, follow these steps:

1. In the Azure portal, select `pg_partman` in the list of server parameters for `azure.extensions`.

    :::image type="content" source="media/how-to-use-pg-partman/pg-partman-prerequisites.png" alt-text="Screenshot that shows selection of the pg_partman extension in a list of Azure extensions.":::

    ```sql
    CREATE EXTENSION pg_partman; 
    ```

1. Include the related `pg_partman_bgw` extension in `shared_preload_libraries`. It offers the scheduled function `run_maintenance()`. It takes care of the partition sets that have `automatic_maintenance` set to `ON` in `part_config`.

    :::image type="content" source="media/how-to-use-pg-partman/pg-partman-prerequisites-outlined.png" alt-text="Screenshot that shows selection of the pg_partman_bgw extension.":::

   You can use server parameters in the Azure portal to change the following configuration options that affect the Background Writer (BGW) process:

   - `pg_partman_bgw.dbname`: Required. This parameter should contain one or more databases where `run_maintenance()` needs to run. If there's more than one database, use a comma-separated list. If nothing is set, `pg_partman_bgw` doesn't run the procedure.

   - `pg_partman_bgw.interval`: The number of seconds between calls to the `run_maintenance()` procedure. Default is `3600` (1 hour). You can update this value based on the requirements of the project.

   - `pg_partman_bgw.role`: The role that `run_maintenance()` procedure runs as. Default is `postgres`. Only a single role name is allowed.

   - `pg_partman_bgw.analyze`: Same purpose as the `p_analyze` argument to `run_maintenance()`. By default, it's set to `OFF`.

   - `pg_partman_bgw.jobmon`: Same purpose as the `p_jobmon` argument to `run_maintenance()`. By default, it's set to `ON`.

> [!NOTE]
>
> - When an identity feature uses sequences, the data from the parent table gets new sequence values. It doesn't generate new sequence values when the data is directly added to the child table.
>
> - The `pg_partman` extension uses a template to control whether the table is `UNLOGGED`. This means the `ALTER TABLE` command can't change this status for a partition set. By changing the status on the template, you can apply it to all future partitions. But for existing child tables, you must use the `ALTER TABLE` command manually. [This bug](https://www.postgresql.org/message-id/flat/15954-b61523bed4b110c4%40postgresql.org) shows why.  

## Set up permissions

A superuser role isn't required with `pg_partman`. The only requirement is that the role that runs `pg_partman` functions has ownership over all the partition sets and schemas where new objects will be created.

We recommend that you create a separate role for `pg_partman` and give it ownership over the schema and all the objects that `pg_partman` will operate on:

```sql
CREATE ROLE partman_role WITH LOGIN; 
CREATE SCHEMA partman; 
GRANT ALL ON SCHEMA partman TO partman_role; 
GRANT ALL ON ALL TABLES IN SCHEMA partman TO partman_role; 
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA partman TO partman_role; 
GRANT EXECUTE ON ALL PROCEDURES IN SCHEMA partman TO partman_role; 
GRANT ALL ON SCHEMA <partition_schema> TO partman_role; 
GRANT TEMPORARY ON DATABASE <databasename> to partman_role; --  This allows temporary table creation to move data. 
```

## Create partitions

The `pg_partman` extension supports range-type partitions only, not trigger-based partitions. The following code shows how `pg_partman` assists with partitioning a table:

```sql
CREATE SCHEMA partman; 
CREATE TABLE partman.partition_test 
(a_int INT, b_text TEXT,c_text TEXT,d_date TIMESTAMP DEFAULT now()) 
PARTITION BY RANGE(d_date); 
CREATE INDEX idx_partition_date ON partman.partition_test(d_date); 
```

:::image type="content" source="media/how-to-use-pg-partman/pg-partman-table-output.png" alt-text="Screenshot of the table output for pg_partman.":::

By using the `create_parent` function, you can set up the number of partitions that you want on the partition table:

```sql
SELECT public.create_parent( 
p_parent_table := 'partman.partition_test', 
p_control := 'd_date', 
p_type := 'native', 
p_interval := 'daily', 
p_premake :=20, 
p_start_partition := (now() - interval '10 days')::date::text  
);

UPDATE public.part_config   
SET infinite_time_partitions = true,  
    retention = '1 hour',   
    retention_keep_table=true   
        WHERE parent_table = 'partman.partition_test';  
```

The preceding command divides `p_parent_table` into smaller parts based on the `p_control` column, by using native partitioning. (The other option is trigger-based partitioning, but `pg_partman` doesn't currently support it.) The partitions are created at a daily interval.

The example creates 20 future partitions in advance, instead of using the default value of `4`. It also specifies `p_start_partition`, where you mention the past date from which the partitions should start.

The `create_parent()` function populates two tables: `part_config` and `part_config_sub`. There's a maintenance function, `run_maintenance()`. You can schedule a `cron` job for this procedure to run on a periodic basis. This function checks all parent tables in a `part_config` table and creates new partitions for them, or it runs the tables' set retention policy. To learn more about the functions and tables in `pg_partman`, see the [PostgreSQL Partition Manager Extension](https://github.com/pgpartman/pg_partman/blob/master/doc/pg_partman.md) documentation on GitHub.

To create new partitions every time the `run_maintenance()` is run in the background through the `pg_partman_bgw` extension, run the following `UPDATE` statement:

```sql
UPDATE partman.part_config SET premake = premake+1 WHERE parent_table = 'partman.partition_test'; 
```

If the premake is the same and your `run_maintenance()` procedure is run, no new partitions are created for that day. For the next day, because the premake defines from the current day, a new partition for a day is created with the execution of your `run_maintenance()` function.

By using the following `INSERT INTO` commands, insert 100,000 rows for each month:

```sql
INSERT INTO partman.partition_test SELECT GENERATE_SERIES(1,100000),GENERATE_SERIES(1, 100000) || 'abcdefghijklmnopqrstuvwxyz', 

GENERATE_SERIES(1, 100000) || 'zyxwvutsrqponmlkjihgfedcba', GENERATE_SERIES (timestamp '2024-03-01',timestamp '2024-03-30', interval '1 day ') ; 

INSERT INTO partman.partition_test SELECT GENERATE_SERIES(100000,200000),GENERATE_SERIES(100000,200000) || 'abcdefghijklmnopqrstuvwxyz', 

GENERATE_SERIES(100000,200000) || 'zyxwvutsrqponmlkjihgfedcba', GENERATE_SERIES (timestamp '2024-04-01',timestamp '2024-04-30', interval '1 day') ; 

INSERT INTO partman.partition_test SELECT GENERATE_SERIES(200000,300000),GENERATE_SERIES(200000,300000) || 'abcdefghijklmnopqrstuvwxyz', 

GENERATE_SERIES(200000,300000) || 'zyxwvutsrqponmlkjihgfedcba', GENERATE_SERIES (timestamp '2024-05-01',timestamp '2024-05-30', interval '1 day') ; 

INSERT INTO partman.partition_test SELECT GENERATE_SERIES(300000,400000),GENERATE_SERIES(300000,400000) || 'abcdefghijklmnopqrstuvwxyz', 

GENERATE_SERIES(300000,400000) || 'zyxwvutsrqponmlkjihgfedcba', GENERATE_SERIES (timestamp '2024-06-01',timestamp '2024-06-30', interval '1 day') ; 

INSERT INTO partman.partition_test SELECT GENERATE_SERIES(400000,500000),GENERATE_SERIES(400000,500000) || 'abcdefghijklmnopqrstuvwxyz', 

GENERATE_SERIES(400000,500000) || 'zyxwvutsrqponmlkjihgfedcba', GENERATE_SERIES (timestamp '2024-07-01',timestamp '2024-07-30', interval '1 day') ; 
```

Run the following command on PostgreSQL to see the created partitions:

```sql
\d+ partman.partition_test;
```

:::image type="content" source="media/how-to-use-pg-partman/pg-partman-table-output-partitions.png" alt-text="Screenshot of table output with partitions." lightbox="media/how-to-use-pg-partman/pg-partman-table-output-partitions.png":::

Here's the output of the `SELECT` statement that you ran:

:::image type="content" source="media/how-to-use-pg-partman/pg-partman-explain-plan-output.png" alt-text="Screenshot of an explanation plan output." lightbox="media/how-to-use-pg-partman/pg-partman-explain-plan-output.png":::

## Manually run a maintenance procedure

You can manually run the `partman.run_maintenance()` command instead of using `pg_partman_bgw`. Use the following command to run the maintenance procedure manually:

```sql
SELECT partman.run_maintenance(p_parent_table:='partman.partition_test'); 
```

> [!WARNING]
> If you insert data before creating partitions, the data goes to the default partition. If the default partition has data that belongs to a new partition that you want create later, you get a default partition violation error and the procedure doesn't work. Change the premake value recommended earlier and then run the procedure.

## Schedule a maintenance procedure

Run the maintenance procedure by using `pg_cron`:

1. First, enable `pg_cron` on your server. In the Azure portal, add `pg_cron` to the `azure. extensions`, `shared_preload_libraries`, and `cron.database_name` server parameters.

    :::image type="content" source="media/how-to-use-pg-partman/pg-partman-pgcron-prerequisites.png" alt-text="Screenshot that shows adding pg_cron to the server parameter for Azure extensions.":::

    :::image type="content" source="media/how-to-use-pg-partman/pg-partman-pgcron-prerequisites-2.png" alt-text="Screenshot that shows adding pg_cron to the server parameter for shared preload libraries.":::

    :::image type="content" source="media/how-to-use-pg-partman/pg-partman-pgcron-database-name.png" alt-text="Screenshot that shows the server parameter for cron database name.":::

2. Select the **Save** button and let the deployment finish.

   After the deployment finishes, `pg_cron` is created automatically. If you try to install it, you get the following message:

   ```sql
   CREATE EXTENSION pg_cron;   
   ```

   ```output
   ERROR: extension "pg_cron" already exists
   ```

3. To schedule the `cron` job, use the following command:

   ```sql
   SELECT cron.schedule_in_database('sample_job','@hourly', $$SELECT partman.run_maintenance(p_parent_table:= 'partman.partition_test')$$,'postgres'); 
   ```

4. To view all the `cron` jobs, use the following command:

   ```sql
   SELECT * FROM cron.job; 
   ```

   ```output
   -[ RECORD 1 ]----------------------------------------------------------------------- 

   jobid    | 1 
   schedule | @hourly 
   command  | SELECT partman.run_maintenance(p_parent_table:= 'partman.partition_test') 
   nodename | /tmp 
   nodeport | 5432 
   database | postgres 
   username | postgres 
   active   | t 
   jobname  | sample_job 
   ```

5. To check the job's run history, use the following command:

   ```sql
   SELECT * FROM cron.job_run_details; 
   ```

   The results show zero records because you haven't run the job yet.

6. To unschedule the `cron` job, use the following command:

   ```sql
   SELECT cron.unschedule(1); 
   ```

## Frequently asked questions

- Why is `pg_partman_bgw` not running the maintenance procedure based on the interval that I provided?

    Check the server parameter `pg_partman_bgw.dbname` and update it with the proper database name. Also, check the server parameter `pg_partman_bgw.role` and provide the appropriate role. You should also make sure that you connect to the server by using the same user to create the extension, instead of Postgres.

- I'm encountering an error when `pg_partman_bgw` is running the maintenance procedure. What could be the reasons?

    See the previous answer.

- How do I set the partitions to start from the previous day?

    The `p_start_partition` function refers to the date from which the partition must be created. Run the following command:

    ```sql
    SELECT public.create_parent( 
    p_parent_table := 'partman.partition_test', 
    p_control := 'd_date', 
    p_type := 'native', 
    p_interval := 'daily', 
    p_premake :=20, 
    p_start_partition := (now() - interval '10 days')::date::text  
    );
    ```

## Related content

- [Vector search on Azure Database for PostgreSQL](how-to-use-pgvector.md)
