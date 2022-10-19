---
title: Best practices for PG dump and restore in Azure Database for PostgreSQL - Flexible Server
description: Best Practices For PG Dump And Restore in Azure Database for PostgreSQL - Flexible Server 
author: sarat0681
ms.author: sbalijepalli
ms.reviewer: maghan
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/16/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Best practices for PG dump and restore for Azure Database for PostgreSQL - Flexible Server

This article reviews options to speed up pg_dump and pg_restore. It also explains the best server configurations for carrying out pg_restore.

## Best practices for pg_dump

pg_dump is a utility that can extract a PostgreSQL database into a script file or archive file. Few of the command line options that can be used to reduce the overall dump time using pg_dump are listed below.

#### Directory format(-Fd)

This option outputs a directory-format archive that can be input to pg_restore. By default the output is compressed.

#### Parallel jobs(-j)

Pg_dump can run dump jobs concurrently using the parallel jobs option. This option reduces the total dump time but increases the load on the database server. It's advised to arrive at a parallel job value after closely monitoring the source server metrics like CPU, Memory, and IOPS usage.

There are a few considerations that need to be taken into account when setting this value
- Pg_dump requires number of parallel jobs +1 number of connections when parallel jobs option is considered, so make sure max_connections is set accordingly.
- The number of parallel jobs should be less than or equal to the number of vCPUs allocated for the database server.

#### Compression(-Z0)

Specifies the compression level to use. Zero means no compression. Zero compression during pg_dump process could help with performance gains.

#### Table bloats and vacuuming

Before the starting the pg_dump process, consider if table vacuuming is necessary. Bloat on tables significantly increases pg_dump times. Execute the below query to identify table bloats:

```
select schemaname,relname,n_dead_tup,n_live_tup,round(n_dead_tup::float/n_live_tup::float*100) dead_pct,autovacuum_count,last_vacuum,last_autovacuum,last_autoanalyze,last_analyze from pg_stat_all_tables where n_live_tup >0;
```

The **dead_pct** column in the above query gives percentage of dead tuples when compared to live tuples. A high dead_pct value for a table might point to the table not being properly vacuumed. For tuning autovacuum, review the article [Autovacuum Tuning](./how-to-autovacuum-tuning.md).


As a one of case perform manual vacuum analyze of the tables that are identified.

```
vacuum(analyze, verbose) <table_name> 
```

#### Use of PITR [Point In Time Recovery] server

Pg dump can be carried out on an online or live server. It makes consistent backups even if the database is being used. It doesn't block other users from using the database. Consider the database size and other business or customer needs before the pg_dump process is started. Small databases might be a good candidate to carry out a pg dump on the production server. For large databases, you could create PITR (Point In Time Recovery) server from the production server and carry out the pg_dump process on the PITR server. Running pg_dump on a PITR would be a cold run process. The trade-off for the approach would be you wouldn't be concerned with extra CPU/memory/IO utilization that comes with the pg_dump process running on the actual production server. You can run pg_dump on a PITR server and drop the PITR server once the pg_dump process is completed.

##### Syntax

Use the following syntax to perform a pg_dump:

`pg_dump -h <hostname>  -U <username> -d <databasename> -Fd -j <Num of parallel jobs> -Z0 -f sampledb_dir_format`


## Best practices for pg_restore

pg_restore is a utility for restoring postgreSQL database from an archive created by pg_dump. Few of the command line options that can be used to reduce the overall restore time using pg_restore are listed below.

#### Parallel restore

Using multiple concurrent jobs, you can reduce the time to restore a large database on a multi vCore target server. The number of jobs can be equal to or less than the number of vCPUs allocated for the target server.

#### Server parameters

If you're restoring data to a new server or non-production server, you can optimize the following server parameters prior to running pg_restore.

`work_mem` = 32 MB   
`max_wal_size` = 65536 (64 GB)     
`checkpoint_timeout` = 3600 #60min     
`maintenance_work_mem` = 2097151 (2 GB)   
`autovacuum` = off   
`wal_compression` = on   

Once the restore is completed, make sure all the above mentioned parameters are appropriately updated as per workload requirements.

> [!NOTE]
> Please follow the above recommendations only if there is enough memory and disk space. In case you have small server with 2,4,8 vCore, please set the parameters accordingly.

#### Other considerations

- Disable High Availability [HA] prior to running pg_restore.
- Analyze all tables migrated after restore option.

##### Syntax

Use the following syntax for pg_restore:

`pg_restore -h <hostname> -U <username> -d <db name> -Fd -j <NUM>  -C  <dump directory>`

-Fd - Directory format   
-j - Number of jobs   
-C - Begin the output with a command to create the database itself and reconnect to the created database     

Here's an example of how this syntax might appear:

`pg_restore -h <hostname>  -U <username> -j <Num of parallel jobs> -Fd -C -d <databasename> sampledb_dir_format`

## Virtual machine considerations

Create a virtual machine in the same region, same availability zone (AZ) preferably where you have both your target and source servers or at least have the virtual machine closer to source server or a target server. Use of Azure Virtual Machines with high-performance local SSD is recommended. For more details about the SKUs review

[Edv4 and Edsv4-series](../../virtual-machines/edv4-edsv4-series.md)   

[Ddv4 and Ddsv4-series](../../virtual-machines/ddv4-ddsv4-series.md)

## Next steps

- Troubleshoot high CPU utilization [High CPU Utilization](./how-to-high-cpu-utilization.md).
- Troubleshoot high memory utilization [High Memory Utilization](./how-to-high-memory-utilization.md).
- Troubleshoot and tune Autovacuum [Autovacuum Tuning](./how-to-autovacuum-tuning.md).
- Troubleshoot high CPU utilization [High IOPS Utilization](./how-to-high-io-utilization.md).