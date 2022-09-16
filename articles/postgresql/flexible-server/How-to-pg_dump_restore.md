---
title: Best Practices For PG Dump And Restore
description: Best Practices For PG Dump And Restore in Azure Database for PostgreSQL - Flexible Server 
author: sarat0681
ms.author: sbalijepalli
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/16/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# PG Dump And Restore

In this document, we will walk through options to speed-up pg_dump and pg_restore and best server configuration for carrying out pg_restore.

## Best practices for pg_dump

### Directory Format(-Fd)

The directory format (-Fd) provides the dump in a compressed format(gzip). By compressing a dump impact of IO can be reduced.

### Parallel Jobs(-j)

Pg_dump can run dump jobs concurrently using parallel jobs option.This option reduces the total dump time but increases the load on the database server.It is advised to arrive at a parallel job value after closely monitoring the source server metrics like CPU,Memory,IOPS usage.

There are a few considerations that needs to be taken into account when setting this value
- Pg_dump requires number of dump jobs+1 number of connections when parallel jobs option is considered, so make sure max_connections is set accordingly.
- The number of dump jobs should be less than the number of vCPU’s allocated for the database server.

### Syntax

Syntax for pg_dump is as below:

`pg_dump -h <hostname>  -U <username> -d <databasename> -Fd -j <Num of parallel jobs> -f sampledb_dir_format`

If you take the pg_dump exports frequently then consider doing them from a read replica.

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

Create a virtual machine in the same region,same AZ preferably where you have both your target and source servers or at least have the virtual machine closer to source server or a target server.Use of Azure Virtual Machines with high-performance local SSD is recommended.Choose virtual machine with 16 or 32 vCore.For more details about the SKUs please refer

[Edv4 and Edsv4-series](https://docs.microsoft.com/azure/virtual-machines/edv4-edsv4-series)
[Ddv4 and Ddsv4-series](https://docs.microsoft.com/azure/virtual-machines/ddv4-ddsv4-series)

## Next steps

- Troubleshoot high CPU utilization [High CPU Utilization](./how-to-high-cpu-utilization.md).
- Troubleshoot high memory utilization [High Memory Utilization](./how-to-high-memory-utilization.md).
- Troubleshoot and tune Autovacuum [Autovacuum Tuning](./how-to-autovacuum-tuning.md).
- Troubleshoot high CPU utilization [High IOPS Utilization](./how-to-high-io-utilization.md).