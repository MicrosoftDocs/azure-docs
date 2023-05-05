---
title: Best practices for pg_dump and pg_restore in Azure Database for PostgreSQL - Flexible Server
description: This article discusses best practices for pg_dump and pg_restore in Azure Database for PostgreSQL - Flexible Server 
author: sarat0681
ms.author: sbalijepalli
ms.reviewer: maghan
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/16/2022
ms.custom: template-how-to
---

# Best practices for pg_dump and pg_restore for Azure Database for PostgreSQL - Flexible Server

This article reviews options and best practices for speeding up pg_dump and pg_restore. It also explains the best server configurations for carrying out pg_restore.

## Best practices for pg_dump

You can use the pg_dump utility to extract a PostgreSQL database into a script file or archive file. A few of the command line options that you can use to reduce the overall dump time by using pg_dump are listed in the following sections.

### Directory format(-Fd)

This option outputs a directory-format archive that you can input to pg_restore. By default, the output is compressed.

### Parallel jobs(-j)

With pg_dump, you can run dump jobs concurrently by using the parallel jobs option. This option reduces the total dump time but increases the load on the database server. We recommend that you arrive at a parallel job value after closely monitoring the source server metrics, such as CPU, memory, and IOPS (input/output operations per second) usage.

When you're setting a value for the parallel jobs option, pg_dump requires the following:
- The number of connections must equal the number of parallel jobs&nbsp;+1, so be sure to set the `max_connections` value accordingly.
- The number of parallel jobs should be less than or equal to the number of vCPUs that are allocated for the database server.

### Compression(-Z0)

This option specifies the compression level to use. Zero means no compression. Zero compression during the pg_dump process could help with performance gains.

### Table bloats and vacuuming

Before you start the pg_dump process, consider whether table vacuuming is necessary. Bloat on tables significantly increases pg_dump times. Execute the following query to identify table bloats:

```
select schemaname,relname,n_dead_tup,n_live_tup,round(n_dead_tup::float/n_live_tup::float*100) dead_pct,autovacuum_count,last_vacuum,last_autovacuum,last_autoanalyze,last_analyze from pg_stat_all_tables where n_live_tup >0;
```

The `dead_pct` column in this query is the percentage of dead tuples when compared to live tuples. A high `dead_pct` value for a table might indicate that the table isn't being properly vacuumed. For more information, see [Autovacuum tuning in Azure Database for PostgreSQL - Flexible Server](./how-to-autovacuum-tuning.md).


For each table that you identify, you can perform a manual vacuum analysis by running the following:

```
vacuum(analyze, verbose) <table_name> 
```

### Use a PITR server

You can perform a pg_dump on an online or live server. It makes consistent backups even if the database is being used. It doesn't block other users from using the database. Consider the database size and other business or customer needs before you start the pg_dump process. Small databases might be good candidates for performing a pg_dump on the production server. 

For large databases, you could create a point-in-time recovery (PITR) server from the production server and perform the pg_dump process on the PITR server. Running pg_dump on a PITR would be a cold run process. The trade-off for this approach is that you wouldn't be concerned with extra CPU, memory, and IO utilization that comes with a pg_dump process that runs on an actual production server. You can run pg_dump on a PITR server and then drop the PITR server after the pg_dump process is completed.

### Syntax for pg_dump

Use the following syntax for pg_dump:

`pg_dump -h <hostname>  -U <username> -d <databasename> -Fd -j <Num of parallel jobs> -Z0 -f sampledb_dir_format`

## Best practices for pg_restore

You can use the pg_restore utility to restore a PostgreSQL database from an archive that's created by pg_dump. A few command line options for reducing the overall restore time are listed in the following sections.

### Parallel restore

By using multiple concurrent jobs, you can reduce the time it takes to restore a large database on a multi-vCore target server. The number of jobs can be equal to or less than the number of vCPUs that are allocated for the target server.

### Server parameters

If you're restoring data to a new server or non-production server, you can optimize the following server parameters prior to running pg_restore:

`work_mem` = 32 MB   
`max_wal_size` = 65536 (64 GB)     
`checkpoint_timeout` = 3600 #60min     
`maintenance_work_mem` = 2097151 (2 GB)   
`autovacuum` = off   
`wal_compression` = on   

After the restore is completed, make sure that all these parameters are appropriately updated as per workload requirements.

> [!NOTE]
> Follow the preceding recommendations only if there's enough memory and disk space. If you have a small server with 2, 4, or 8 vCores, set the parameters accordingly.

### Other considerations

- Disable high availability (HA) prior to running pg_restore.
- Analyze all tables that are migrated after the restore is complete.

### Syntax for pg_restore

Use the following syntax for pg_restore:

`pg_restore -h <hostname> -U <username> -d <db name> -Fd -j <NUM>  -C  <dump directory>`

* `-Fd`: The directory format.   
* `-j`: The number of jobs.   
* `-C`: Begin the output with a command to create the database itself and then reconnect to it.     

Here's an example of how this syntax might appear:

`pg_restore -h <hostname>  -U <username> -j <Num of parallel jobs> -Fd -C -d <databasename> sampledb_dir_format`

## Virtual machine considerations

Create a virtual machine in the same region and availability zone, preferably where you have both your target and source servers. Or, at a minimum, create the virtual machine closer to the source server or a target server. We recommend that you use Azure Virtual Machines with a high-performance local SSD. 

For more information about the SKUs, see:
* [Edv4 and Edsv4-series](../../virtual-machines/edv4-edsv4-series.md)   
* [Ddv4 and Ddsv4-series](../../virtual-machines/ddv4-ddsv4-series.md)

## Next steps

- [Troubleshoot high CPU utilization](./how-to-high-cpu-utilization.md)
- [Troubleshoot high memory utilization](./how-to-high-memory-utilization.md)
- [Troubleshoot and tune autovacuum](./how-to-autovacuum-tuning.md)
- [Troubleshoot high IOPS utilization](./how-to-high-io-utilization.md)