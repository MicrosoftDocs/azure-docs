---
title: Best Practices For PG Dump And Restore
description: Best Practices For PG Dump And Restore in Azure Database for PostgreSQL - Flexible Server 
author: sarat0681
ms.author: sbalijepalli
ms.reviewer: maghan
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/16/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# PG Dump And Restore 

In this document, we will review options to speed-up pg_dump and pg_restore and best server configuration for carrying out pg_restore.

## Best practices for pg_dump

### Directory Format(-Fd)

The directory format (-Fd) outputs in a directory format which can be input to pg_restore.By default the output is compressed.

### Parallel Jobs(-j)

Pg_dump can run dump jobs concurrently using parallel jobs option.This option reduces the total dump time but increases the load on the database server.It is advised to arrive at a parallel job value after closely monitoring the source server metrics like CPU,Memory,IOPS usage.

There are a few considerations that needs to be taken into account when setting this value
- Pg_dump requires number of dump jobs+1 number of connections when parallel jobs option is considered, so make sure max_connections is set accordingly.
- The number of dump jobs should be less than the number of vCPU’s allocated for the database server.

### Compression(-Z0)

Specifies the compression level to use.Zero means no compression.Zero compression during pg_dump process could help with performance gains.

### Table Bloats And Vacuuming

Before the starting the pg_dump process consider if vacuuming of tables is necessary.Bloat on tables significantly increases pg_dump times.Execute below query to identify table bloats 

```
select schemaname,relname,n_dead_tup,n_live_tup,round(n_dead_tup::float/n_live_tup::float*100) dead_pct,autovacuum_count,last_vacuum,last_autovacuum,last_autoanalyze,last_analyze from pg_stat_all_tables where n_live_tup >0;
```
- **Dead_pct**: percentage of dead tuples when compared to live tuples.

Perform vacuum analyze of the tables which are identified or deemed necessary. 

```
vacuum(analyze, verbose) <table_name> 
```

### Use Of PITR [Point In Time Recovery] Server

Pg dump can be carried out on a online/live server.It makes consistent backups even if the database is being used.It does not block other users from using the database.It is suggested to consider the database size and other business/customer needs before pg_dump process is started.Small DBs might be a good candidate to carry out pg dump online on the production server without stopping the actual production server.For large databases you could create PITR (Point In Time Recovery) server from the actual production server and carry out the pg_dump process on the PITR server.Running pg_dump on a PITR would be a cold run process but the trade off for this would be one would not be concerned with additional CPU/IO utilization that comes with pg_dump process on the actual production server.You can run pg_dump on a PITR server without any impact of production server and drop the PITR server once pg_dump process is completed.

### Syntax

Syntax for pg_dump is as below:

`pg_dump -h <hostname>  -U <username> -d <databasename> -Fd -j <Num of parallel jobs> -Z0 -f sampledb_dir_format`


## Best practices for pg_restore

### Parallel Restore

Using multiple concurrent jobs, you can reduce the time to restore a large database on a multi vCore target server.The number of jobs can be equal to or less than the number of vCPU’s allocated for the target server.


#### Syntax

Syntax for pg_restore is as below:

`pg_restore -h <hostname> -U <username> -d <db name> -Fd -j <NUM>  -C  <dump directory>`

-Fd - Directory format
-j - Number of jobs
-C - Begin the output with a command to create the database itself and reconnect to the created database.

A sample example is as follows:

`pg_restore -h <hostname>  -U <username> -j <Num of parallel jobs> -Fd -C -d <databasename> sampledb_dir_format`

### Server Parameters

If you are restoring data to a new server or non-production server. You can optimize the following server parameters prior to running pg_restore.

`work_mem` = 32 MB
`max_wal_size` = 65536 (64 GB)  
`checkpoint_timeout` = 3600 #60min  
`maintenance_work_mem` = 2097151 (2 GB)
`autovacuum` = off
`wal_compression` = on

Please make sure once the restore is completed all the above mentioned parameters are appropriately updated as per workload requirements.

> [!NOTE]
> Please follow the above recommendations only if there is enough memory and disk space.In case you have small server with 2,4,8 vCore, please set the parameters accordingly.

### Other Considerations

- Disable HA or any standby server prior to running pg_restore.
- Analyze all tables migrated after restore option.


## Virtual Machine Considerations

Create a virtual machine in the same region,same AZ preferably where you have both your target and source servers or at least have the virtual machine closer to source server or a target server.Use of Azure Virtual Machines with high-performance local SSD is recommended.For more details about the SKUs please refer

Edv4 and Edsv4-series[https://docs.microsoft.com/azure/virtual-machines/edv4-edsv4-series]
Ddv4 and Ddsv4-series[https://docs.microsoft.com/azure/virtual-machines/ddv4-ddsv4-series]

## Next steps

- Troubleshoot high CPU utilization [High CPU Utilization](./how-to-high-cpu-utilization.md).
- Troubleshoot high memory utilization [High Memory Utilization](./how-to-high-memory-utilization.md).
- Troubleshoot and tune Autovacuum [Autovacuum Tuning](./how-to-autovacuum-tuning.md).
- Troubleshoot high CPU utilization [High IOPS Utilization](./how-to-high-io-utilization.md).