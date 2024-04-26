---
title: How to enable and use pg_partman - Azure Database for PostgreSQL - Flexible Server
description: How to enable and use pg_partman on Azure Database for PostgreSQL - Flexible Server
ms.author: gapaderla
author: GayathriPaderla
ms.reviewer: sbalijepalli
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.date: 03/14/2024
---

# How to enable and use `pg_partman` on Azure Database for PostgreSQL - Flexible Server

When tables in the database get large, it's hard to manage how often they're vacuumed, how much space they take up, and how to keep their indexes efficient. This can make queries slower and affect performance. Partitioning of large tables is a solution for these situations. In this article, you find out how to use `pg_partman` extension to create range-based partitions of tables in your Azure Database for PostgreSQL Flexible Server.  

## Prerequisites

To enable `pg_partman` extension, add `pg_partman` extension under Azure extensions as shown from server parameters on the portal.

:::image type="content" source="media/how-to-use-pg-partman/pg-partman-prerequisites.png" alt-text="Screenshot of prerequisites.":::

```sql
CREATE EXTENSION pg_partman; 
```

## Overview

When an identity feature uses sequences, the data that comes from the parent table gets new sequence value. It doesn't generate new sequence values when the data is directly added to the child table.

`pg_partman` uses a template to control whether the table is UNLOGGED or not. This means that the Alter table command can't change this status for a partition set. By changing the status on the template, you can apply it to all future partitions. But for existing child tables, you must use the `ALTER` command manually. [Here](https://www.postgresql.org/message-id/flat/15954-b61523bed4b110c4%40postgresql.org) is an email thread that shows why.

There's another extension related to `pg_partman` called `pg_partman_bgw`, which must be included in the `shared_preload_libraries`. It offers a scheduled function `run_maintenance()`. It takes care of the partition sets that have `automatic_maintenance` turned ON in `part_config`.

:::image type="content" source="media/how-to-use-pg-partman/pg-partman-prerequisites-outlined.png" alt-text="Screenshot of prerequisites highlighted.":::

You can use server parameters in the Azure portal to change the following configuration options that affect the BGW process: 

`pg_partman_bgw.dbname` - Required. This parameter should contain one or more databases that `run_maintenance()` needs to be run on. If more than one, use a comma separated list. If nothing is set, BGW doesn't run the procedure.

`pg_partman_bgw.interval` - Number of seconds between calls to `run_maintenance()` procedure. Default is 3600 (1 hour). The parameter value can be updated based on the requirement of the project.

`pg_partman_bgw.role` - The role that `run_maintenance()` procedure runs as. Default is `postgres`. Only a single role name is allowed. 

`pg_partman_bgw.analyze` - By default, it's set to OFF. Same purpose as the p_analyze argument to `run_maintenance()`. 

`pg_partman_bgw.jobmon` - Same purpose as the p_jobmon argument to run_maintenance(). By default, it's set to ON. 

## Permissions 

`pg_partman` doesn't require a super user role to run. The only requirement is that the role that runs `pg_partman` functions has ownership over all the partition sets/schema where new objects are created. It's recommended to create a separate role for `pg_partman` and give it ownership over the schema/all the objects that `pg_partman` operate on. 

```sql
CREATE ROLE partman_role WITH LOGIN; 
CREATE SCHEMA partman; 
GRANT ALL ON SCHEMA partman TO partman_role; 
GRANT ALL ON ALL TABLES IN SCHEMA partman TO partman_role; 
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA partman TO partman_role; 
GRANT EXECUTE ON ALL PROCEDURES IN SCHEMA partman TO partman_role; 
GRANT ALL ON SCHEMA <partition_schema> TO partman_role; 
GRANT TEMPORARY ON DATABASE <databasename> to partman_role; --  this allows creation  of temporary table to move data. 
```
## Creating partitions

`pg_partman` relies on range type partitions and not on trigger-based partitions. This shows how `pg_partman` assists with the partitioning of a table. 

```sql
CREATE SCHEMA partman; 
CREATE TABLE partman.partition_test 
(a_int INT, b_text TEXT,c_text TEXT,d_date TIMESTAMP DEFAULT now()) 
PARTITION BY RANGE(d_date); 
CREATE INDEX idx_partition_date ON partman.partition_test(d_date); 
```

:::image type="content" source="media/how-to-use-pg-partman/pg-partman-table-output.png" alt-text="Screenshot of table output.":::

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

This command divides the p_parent_table into smaller parts based on the `p_control column`, using native partitioning (the other option is trigger-based partitioning, but `pg_partman` doesn't support it). The partitions are created at a daily interval. We'll create 20 future partitions in advance, instead of the default value of 4. We'll also specify the `p_start_partition`, where we mention the past date from which the partitions should start. 

The `create_parent()` function populates two tables `part_config` and `part_config_sub`. There's a maintenance function `run_maintenance()`. You can schedule a cron job for this procedure to run on a periodic basis. This function checks all parent tables in `part_config` table and creates new partitions for them or runs the tables set retention policy. To know more about the functions and tables in `pg_partman` go through [here.](https://github.com/pgpartman/pg_partman/blob/master/doc/pg_partman.md) 

To create new partitions every time the `run_maintenance()` is run in the background using `bgw` extension, run the below update statement. 

```sql
UPDATE partman.part_config SET premake = premake+1 WHERE parent_table = 'partman.partition_test'; 
```

If the premake is the same and your `run_maintenance()` procedure is run, there wont be any new partitions created for that day. For the next day as premake defines from the current day a new partition for a day is created with the execution of you `run_maintenance()` function. 

Using the insert command below, insert 100k rows for each month. 

```sql
insert into partman.partition_test select generate_series(1,100000),generate_series(1, 100000) || 'abcdefghijklmnopqrstuvwxyz', 

generate_series(1, 100000) || 'zyxwvutsrqponmlkjihgfedcba', generate_series (timestamp '2024-03-01',timestamp '2024-03-30', interval '1 day ') ; 

insert into partman.partition_test select generate_series(100000,200000),generate_series(100000,200000) || 'abcdefghijklmnopqrstuvwxyz', 

generate_series(100000,200000) || 'zyxwvutsrqponmlkjihgfedcba', generate_series (timestamp '2024-04-01',timestamp '2024-04-30', interval '1 day') ; 

insert into partman.partition_test select generate_series(200000,300000),generate_series(200000,300000) || 'abcdefghijklmnopqrstuvwxyz', 

generate_series(200000,300000) || 'zyxwvutsrqponmlkjihgfedcba', generate_series (timestamp '2024-05-01',timestamp '2024-05-30', interval '1 day') ; 

insert into partman.partition_test select generate_series(300000,400000),generate_series(300000,400000) || 'abcdefghijklmnopqrstuvwxyz', 

generate_series(300000,400000) || 'zyxwvutsrqponmlkjihgfedcba', generate_series (timestamp '2024-06-01',timestamp '2024-06-30', interval '1 day') ; 

insert into partman.partition_test select generate_series(400000,500000),generate_series(400000,500000) || 'abcdefghijklmnopqrstuvwxyz', 

generate_series(400000,500000) || 'zyxwvutsrqponmlkjihgfedcba', generate_series (timestamp '2024-07-01',timestamp '2024-07-30', interval '1 day') ; 
```

Run the command below to see the partitions created. 

```bash
postgres=> \d+ partman.partition_test;
```

:::image type="content" source="media/how-to-use-pg-partman/pg-partman-table-output-partitions.png" alt-text="Screenshot of table out with partitions." lightbox="media/how-to-use-pg-partman/pg-partman-table-output-partitions.png":::

Here's the output of the select statement executed. 

:::image type="content" source="media/how-to-use-pg-partman/pg-partman-explain-plan-output.png" alt-text="Screenshot of explain plan output." lightbox="media/how-to-use-pg-partman/pg-partman-explain-plan-output.png":::

## How to manually run the run_maintenance procedure 

```sql
SELECT partman.run_maintenance(p_parent_table:='partman.partition_test'); 
```

> [!WARNING] 
> If you insert data before creating partitions, the data goes to the default partition. If the default partition has data that belongs to a new partition that you want to be created later, then you get a default partition violation error and the procedure won't work. Therefore, change the premake value as recommended above and then run the procedure. 

## How to schedule maintenance procedure using `pg_cron`

Run the maintenance procedure using `pg_cron`. To enable `pg_cron` on your server follow the below steps. 
1.	Add `pg_cron` to `azure.extensions`, `shared_preload_libraries` and `cron.database_name` server parameter from Azure portal. 

    :::image type="content" source="media/how-to-use-pg-partman/pg-partman-pgcron-prerequisites.png" alt-text="Screenshot of pgcron prerequisites.":::

    :::image type="content" source="media/how-to-use-pg-partman/pg-partman-pgcron-prerequisites-2.png" alt-text="Screenshot of pgcron prerequisites2.":::

    :::image type="content" source="media/how-to-use-pg-partman/pg-partman-pgcron-database-name.png" alt-text="Screenshot of pgcron databasename.":::

2. Hit Save button and let the deployment complete. 

3. Once done the `pg_cron` is automatically created. If you still, try to install then you get the below message. 

    ```bash
    postgres=> CREATE EXTENSION pg_cron; 
    ERROR:  extension "pg_cron" already exists 
    ```

4. To schedule the cron job, use the below command. 

    ```sql
    SELECT cron.schedule_in_database('sample_job','@hourly', $$SELECT partman.run_maintenance(p_parent_table:= 'partman.partition_test')$$,'postgres'); 
    ```

5. You can view all the cron job using the command below. 

    ```sql
    SELECT * FROM cron.job; 
    ```

    ```text
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

6. Run history of the job can be checked using the command below. 

    ```sql
    SELECT * FROM cron.job_run_details;
    ```

    Currently the results show 0 records as the job has not run yet. 

7. To unschedule the cron job, use the command below. 

    ```SQL    
    SELECT cron.unschedule(1); 
    ```

## Limitations and considerations

- Why is my `bgw` not running the maintenance proc based on the interval provided. 

    Check the server parameter  `pg_partman_bgw.dbname` and update it with the proper databasename. Also, check the server parameter `pg_partman_bgw.role` and provide the appropriate role with the role. You should also make sure you connecting to server using the same user to create the extension instead of postgres. 

- I'm encountering an error when my bgw is running the maintenance proc. What could be the reasons? 

    Same as mentioned in the previous answer. 

- How to set the partitions to start from the previous day. 

    `p_start_partition` in which we mention the previous date from which the partition needs to be created. 

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

- [pgvector](how-to-use-pgvector.md)