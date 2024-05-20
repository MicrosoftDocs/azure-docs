---
title: How to enable and use pg_partman
description: How to enable and use pg_partman on Azure Database for PostgreSQL - Flexible Server to optimize database performance and improve query speed.
ms.author: gapaderla
author: GayathriPaderla
ms.reviewer: sbalijepalli, maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
#customer intent: As a developer, I want to learn how to enable and use pg_partman on Azure Database for PostgreSQL - Flexible Server so that I can optimize my database performance.
---

# How to enable and use `pg_partman` on Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

In this article, you learn how to optimize the Azure Database for PostgreSQL Flexible Server using pg_partman. When tables in the database get large, it's hard to manage how often they're vacuumed, how much space they take up, and how to keep their indexes efficient. This can make queries slower and affect performance. Partitioning of large tables is a solution for these situations. In this article, you find out how to use pg_partman extension to create range-based partitions of tables in your Azure Database for PostgreSQL Flexible Server.  

## Prerequisites

To enable the `pg_partman` extension, follow these steps. 

- Add the `pg_partman` extension under Azure extensions as shown by the server parameters on the portal.

    :::image type="content" source="media/how-to-use-pg-partman/pg-partman-prerequisites.png" alt-text="Screenshot of prerequisites to get started.":::

    ```sql
    CREATE EXTENSION pg_partman; 
    ```

- There's another extension related to `pg_partman` called `pg_partman_bgw`, which must be included in Shared_Preload_Libraries. It offers a scheduled function run_maintenance(). It takes care of the partition sets that have `automatic_maintenance` turned ON in `part_config`. 

    :::image type="content" source="media/how-to-use-pg-partman/pg-partman-prerequisites-outlined.png" alt-text="Screenshot of prerequisites highlighted.":::

    You can use server parameters in the Azure portal to change the following configuration options that affect the BGW process: 

    `pg_partman_bgw.dbname` - Required. This parameter should contain one or more databases that `run_maintenance()` needs to be run on. If more than one, use a comma separated list. If nothing is set, `pg_partman_bgw` doesn't run the procedure. 
    
    `pg_partman_bgw.interval` - Number of seconds between calls to `run_maintenance()` procedure. Default is 3600 (1 hour). This can be updated based on the requirement of the project. 
    
    `pg_partman_bgw.role` - The role that `run_maintenance()` procedure runs as. Default is postgres. Only a single role name is allowed. 
    
    `pg_partman_bgw.analyze` - By default, it's set to OFF. Same purpose as the p_analyze argument to `run_maintenance()`. 
    
    `pg_partman_bgw.jobmon` - Same purpose as the `p_jobmon` argument to `run_maintenance()`. By default, it's set to ON. 

> [!NOTE]
> 1. When an identity feature uses sequences, the data from the parent table gets new sequence value. It doesn't generate new sequence values when the data is directly added to the child table. 
>
> 1. `pg_partman` uses a template to control whether the table is UNLOGGED. This means the Alter table command can't change this status for a partition set. By changing the status on the template, you can apply it to all future partitions. But for existing child tables, you must use the Alter command manually. [Here](https://www.postgresql.org/message-id/flat/15954-b61523bed4b110c4%40postgresql.org) is a bug that shows why.  

## Permissions 

Super user role isn't required with `pg_partman`. The only requirement is that the role that runs `pg_partman` functions has ownership over all the partition sets/schema where new objects will be created. It's recommended to create a separate role for `pg_partman` and give it ownership over the schema/all the objects that `pg_partman` will operate on. 

```sql
CREATE ROLE partman_role WITH LOGIN; 
CREATE SCHEMA partman; 
GRANT ALL ON SCHEMA partman TO partman_role; 
GRANT ALL ON ALL TABLES IN SCHEMA partman TO partman_role; 
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA partman TO partman_role; 
GRANT EXECUTE ON ALL PROCEDURES IN SCHEMA partman TO partman_role; 
GRANT ALL ON SCHEMA <partition_schema> TO partman_role; 
GRANT TEMPORARY ON DATABASE <databasename> to partman_role; --  this allows temporary table creation to move data. 
```
## Creating partitions

`pg_partman` supports range-type partitions only, not trigger-based partitions. The code below shows how `pg_partman` assists with partitioning a table. 

```sql
CREATE SCHEMA partman; 
CREATE TABLE partman.partition_test 
(a_int INT, b_text TEXT,c_text TEXT,d_date TIMESTAMP DEFAULT now()) 
PARTITION BY RANGE(d_date); 
CREATE INDEX idx_partition_date ON partman.partition_test(d_date); 
```

:::image type="content" source="media/how-to-use-pg-partman/pg-partman-table-output.png" alt-text="Screenshot of the table output for pg_partman.":::

Using the `create_parent` function, you can set up the number of partitions you want on the partition table. 

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

This command divides the `p_parent_table` into smaller parts based on the `p_control` column, using native partitioning (the other option is trigger-based partitioning, but `pg_partman` doesn't support it yet). The partitions are created at a daily interval. We'll create 20 future partitions in advance, instead of the default value of 4. We'll also specify the `p_start_partition`, where we mention the past date from which the partitions should start. 

The `create_parent()` function populates two tables `part_config` and `part_config_sub`. There's a maintenance function `run_maintenance()`. You can schedule a cron job for this procedure to run on a periodic basis. This function checks all parent tables in `part_config` table and creates new partitions for them or runs the tables set retention policy. To know more about the functions and tables in `pg_partman` go through the [PostgreSQL Partition Manager Extension](https://github.com/pgpartman/pg_partman/blob/master/doc/pg_partman.md) article. 

To create new partitions every time the `run_maintenance()` is run in the background using the `pg_partman_bgw` extension, run the `update` statement below. 

```sql
UPDATE partman.part_config SET premake = premake+1 WHERE parent_table = 'partman.partition_test'; 
```

If the premake is the same and your `run_maintenance()` procedure is run, there wont be any new partitions created for that day. For the next day as premake defines from the current day a new partition for a day is created with the execution of you `run_maintenance()` function. 

Using the insert command below, insert 100k rows for each month. 

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

Run the command below on you psql to see the partitions created. 

```sql
\d+ partman.partition_test;
```

:::image type="content" source="media/how-to-use-pg-partman/pg-partman-table-output-partitions.png" alt-text="Screenshot of table output with partitions." lightbox="media/how-to-use-pg-partman/pg-partman-table-output-partitions.png":::

Here's the output of the select statement executed. 

:::image type="content" source="media/how-to-use-pg-partman/pg-partman-explain-plan-output.png" alt-text="Screenshot of an explanation plan output." lightbox="media/how-to-use-pg-partman/pg-partman-explain-plan-output.png":::

## How to manually run the run_maintenance procedure 

`partman.run_maintenance()` command could be run manually rather than the `pg_partman_bgw`. Use the below command to run the maintenance procedure manually.

```sql
SELECT partman.run_maintenance(p_parent_table:='partman.partition_test'); 
```

> [!WARNING] 
> If you insert data before creating partitions, the data goes to the default partition. If the default partition has data belonging to a new partition that you want to be created later, you get a default partition violation error and the procedure won't work. Therefore, change the premake value recommended above and then run the procedure. 

## How to schedule maintenance procedure using `pg_cron`

Run the maintenance procedure using `pg_cron`. To enable `pg_cron` on your server follow the below steps. 

1.	Add pg_cron to `azure. extensions`, `shared_preload_libraries`, and `cron.database_name` server parameters from the Azure portal. 

    :::image type="content" source="media/how-to-use-pg-partman/pg-partman-pgcron-prerequisites.png" alt-text="Screenshot of pgcron extension prerequisites.":::

    :::image type="content" source="media/how-to-use-pg-partman/pg-partman-pgcron-prerequisites-2.png" alt-text="Screenshot of pgcron extension prerequisites2.":::

    :::image type="content" source="media/how-to-use-pg-partman/pg-partman-pgcron-database-name.png" alt-text="Screenshot of pgcron extension databasename.":::

2. Select the **Save** button and let the deployment complete. 

3. Once done, the pg_cron is automatically created. If you still try to install it, you'll get the message below. 

    ```sql
    CREATE EXTENSION pg_cron;   
    ```

    ```output
    ERROR: extension "pg_cron" already exists
    ```

4. To schedule the cron job, use the below command. 

    ```sql
    SELECT cron.schedule_in_database('sample_job','@hourly', $$SELECT partman.run_maintenance(p_parent_table:= 'partman.partition_test')$$,'postgres'); 
    ```

5. You can view all the cron job using the command below. 

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

6. The job's run history can be checked using the command below. 

    ```sql
    SELECT * FROM cron.job_run_details; 
    ```

    The results show 0 records as the job hasn't yet been run. 

7. To unschedule the cron job, use the command below. 

    ```sql    
    SELECT cron.unschedule(1); 
    ```

## Frequently Asked Questions

- Why is my `pg_partman_bgw` not running the maintenance proc based on the interval provided? 

    Check the server parameter  `pg_partman_bgw.dbname` and update it with the proper databasename. Also, check the server parameter `pg_partman_bgw.role` and provide the appropriate role with the role. You should also make sure you connect to the server using the same user to create the extension instead of Postgres. 

- I'm encountering an error when my `pg_partman_bgw` is running the maintenance proc. What could be the reasons? 

    Same as mentioned in the previous answer. 

- How to set the partitions to start from the previous day. 

    `p_start_partition` refers to the date from which the partition must be created. 

    This can be done by running the command below. 

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

