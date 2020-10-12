---
title: Troubleshoot replication latency - Azure Database for MySQL
description: Learn how to troubleshoot replication latency with Azure Database for MySQL read replicas
keywords: mysql, troubleshoot, replication latency in seconds
author: savjani
ms.author: pariks
ms.service: mysql
ms.topic: troubleshooting
ms.date: 10/08/2020
---
# Troubleshoot replication latency in Azure Database for MySQL

The [read replica](concepts-read-replicas.md) feature allows you to replicate data from an Azure Database for MySQL server to a read-only replica server. Read Replicas are used to scale out workload by routing read/reporting queries from the application to replica servers. This reduces the pressure on primary server and improves overall performance and latency of the application as it scales. Replicas are updated asynchronously using the MySQL engine's native binary log (binlog) file position-based replication technology. To learn more about binlog replication, see the [MySQL binlog replication overview](https://dev.mysql.com/doc/refman/5.7/en/binlog-replication-configuration-overview.html). 

The replication lag on the secondary read replicas depends on number of factors including but not limited to 

- Network latency
- Transaction volume on the source server
- Compute tier of source and secondary read replica server
- Queries running on the primary and secondary server. 

In this document, you will learn on how to troubleshoot replication latency in Azure Database for MySQL. In addition, you will also understand some of the common causes of increased replication latency on replica servers.

## Replication concepts

When binary log is enabled, the source server writes committed transaction into the binary log, which is used for replication. The binary log is turned ON by default for all newly provisioned servers that supports up to 16 TB storage. On replica servers, there are two threads running per replica server, one called the IO thread and the other called the SQL thread.

- The **IO thread** connects to the source server and requests updated binary logs. After this thread receives the binary log updates, they are saved on a replica server, in a local log called the relay log.
- The **SQL thread** reads the relay log and apply the data change(s) on replica servers.

## Monitoring replication latency

Azure Database for MySQL provides the Replication lag in seconds metric in [Azure Monitor](concepts-monitoring.md). This metric is available on read replicas servers only. This metric is calculated using the seconds_behind_master metric available in MySQL. To understand root cause of increased replication latency, connect to the replica server using [MySQL Workbench](connect-workbench.md) or [Azure Cloud shell](https://shell.azure.com) and execute following command:

 Replace values with your actual replica server name and admin user login name. The admin username requires '@\<servername>' for Azure Database for MySQL:

  ```azurecli-interactive
  mysql --host=myreplicademoserver.mysql.database.azure.com --user=myadmin@mydemoserver -p 
  ```

  Here is how the experience looks like in the Cloud Shell terminal
  ```
  Requesting a Cloud Shell.Succeeded.
  Connecting terminal...

  Welcome to Azure Cloud Shell

  Type "az" to use Azure CLI
  Type "help" to learn about Cloud Shell

  user@Azure:~$mysql -h myreplicademoserver.mysql.database.azure.com -u myadmin@mydemoserver -p
  Enter password:
  Welcome to the MySQL monitor.  Commands end with ; or \g.
  Your MySQL connection id is 64796
  Server version: 5.6.42.0 Source distribution

  Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

  Oracle is a registered trademark of Oracle Corporation and/or its
  affiliates. Other names may be trademarks of their respective
  owners.

  Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
  mysql>
  ```
  In the same Azure Cloud Shell terminal, execute following command

  ```
  mysql> SHOW SLAVE STATUS;
  ```

  A typical output will look like:
  
>[!div class="mx-imgBorder"]
> :::image type="content" source="./media/howto-troubleshoot-replication-latency/show-status.png" alt-text="Monitoring replication latency":::


The output contains a lot of information, but normally it's only important to focus on the following columns:

|Metric|Description|
|---|---|
|Slave_IO_State| Current status of the IO thread. Normally, the status is "Waiting for master to send event" if it is synchronizing. However, if you see a status such as "Connecting to master", then the replica has lost the connection to the master server. Check if the master is running or if a firewall is blocking the connection.|
|Master_Log_File| The binary log file to which the master is writing.|
|Read_Master_Log_Pos| Represents the position in the above binary log file in which the master is writing.|
|Relay_Master_Log_File| Indicated represents the binary log file that the replica server is reading from the master.|
|Slave_IO_Running| Indicates whether the IO thread is running. It should be "Yes". If "NO", then most likely the replication is broken.|
|Slave_SQL_Running| Indicates whether the SQL thread is running. It should be "Yes". If "NO", then most likely the replication is broken.|
|Exec_Master_Log_Pos| Displays position of the Relay_Master_Log_File the replica is applying. If there is latency, this position sequence should be smaller than Read_Master_Log_Pos.|
|Relay_Log_Space|Displays upper limit of relay log size. You can check the size by querying show global variables like "relay_log_space_limit".|
|Seconds_Behind_Master| Displays replication latency in seconds.|
|Last_IO_Errno|Displays the IO thread error code, if any. For more information about these codes, see [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/server-error-reference.html).|
|Last_IO_Error| Displays the IO thread error message, if any.|
|Last_SQL_Errno|Displays the SQL thread error code, if any. For more information about these codes, see [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/server-error-reference.html).|
|Last_SQL_Error|Displays the SQL thread error message, if any.|
|Slave_SQL_Running_State| Indicates the current SQL thread status. Note that "System lock" shown in this state is a normal behavior. It is normal to see status as "Waiting for dependent transaction to commit". It indicates that replica is waiting for the master to update committed transactions.|

If Slave_IO_Running is Yes and Slave_SQL_Running is Yes, then the replication is running fine. 

Next, you need to check Last_IO_Errno, Last_IO_Error, Last_SQL_Errno and Last_SQL_Error.  These fields hold the error number and error message of the most recent error that caused the SQL thread to stop. An error number 0 and empty message mean there is no error. A non-zero value in the error must be investigated further by looking up for the error code in [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/server-error-reference.html).

## Common scenarios for high replication latency

### Network latency or high cpu on source server

If you observe the following values, the most common cause of the replication latency is high network latency or high cpu consumption on the source server. In this case, the IO thread is running and waiting on the master. The master (source server) has already written to binary log file #20, while replica received only up to file #10. The primary contributing factors for high replication latency in this scenario are network speed or high cpu utilization on source server.  In Azure, the network latency within a region typically ranges in milliseconds and across region can go up to seconds. In most cases, the delay in IO thread to connect to the source server is caused due to high cpu utilization on the source server causing the IO thread processing to be slow. This can be detected by monitoring the cpu utilization and observing the number of concurrent connections on the source server using Azure monitor.

If you do not see high cpu utilization on the source server, the possible causes can be network latency. if you see high network latency abnormally all of a sudden, we recommend you check [Azure status page](https://status.azure.com/status) to ensure there are non known issues or outages. 

```
Slave_IO_State: Waiting for master to send event
Master_Log_File: the binary file sequence is larger then Relay_Master_Log_File, e.g. mysql-bin.00020
Relay_Master_Log_File: the file sequence is smaller than Master_Log_File, e.g. mysql-bin.00010
```

### Heavy burst of transactions on source server

If you observe the following values, the most common cause of the replication latency is, heavy burst of transactions on source server. In the output below, though the replica can retrieve the binary log behind the master, the replica IO thread indicates that the relay log space is full already. So network speed isn't causing the delay, because the replica has already been trying to catch up as fast as it can. Instead, the updated binary log size exceeds the upper limit of the relay log space. To troubleshoot this issue further, [slow query log](concepts-server-logs.md) should be enabled on the master server. Slow query logs enables you to identify long running transactions on the source server. The identified queries needs to be tuned to reduce the latency on the server. 

```
Slave_IO_State: Waiting for the slave SQL thread to free enough relay log space
Master_Log_File: the binary file sequence is larger then Relay_Master_Log_File, e.g. mysql-bin.00020
Relay_Master_Log_File: the file sequence is smaller then Master_Log_File, e.g. mysql-bin.00010
```

Following are the common causes of the latency in this category:

#### Replication latency due to data load on source server
In some cases, there are weekly or monthly data load on source servers. Unfortunately, the replication latency is unavoidable in this case. In this scenario, the replica servers eventually catch-up after the data load on source server is completed.


### Slowness on the replica server

If you observe the following values, the most common cause can be some issue on the replica server that needs further investigation. In this scenario, as seen in the output, both the IO and SQL threads are running well and the replica is reading the same binary log file as the master writes. However, some latency occurs on the replica server to reflect the same transaction from the source server. 

```
Slave_IO_State: Waiting for master to send event
Master_Log_File: The binary log file sequence equals to Relay_Master_Log_File, e.g. mysql-bin.000191
Read_Master_Log_Pos: The position of master server written to the above file is larger than Relay_Log_Pos, e.g. 103978138
Relay_Master_Log_File: mysql-bin.000191
Slave_IO_Running: Yes
Slave_SQL_Running: Yes
Exec_Master_Log_Pos: The position of slave reads from master binary log file is smaller than Read_Master_Log_Pos, e.g. 13468882
Seconds_Behind_Master: There is latency and the value here is greater than 0
```

Following are the common causes of the latency in this category:

#### No primary or unique key on a table

Azure Database for MySQL uses row-based replication. With row-based replication, the master server writes events to the binary log about individual table row change. The SQL Thread in-turn executes those changes to the corresponding table rows on replica server. No primary or unique key on a table is one of the common causes of replication latency. Lack of primary or unique keys leads to scan of all rows in the target table by SQL thread to apply the changes.

In MySQL the primary key is an associated index that ensures fast query performance as it cannot include NULL values. With InnoDB storage engine, the table data is physically organized to do ultra-fast lookups and sorts based on the primary key. It is therefore recommended to add a primary key on tables in the source server before creating the replica server. In this scenario, you need to add primary keys on the source server and recreate read replicas to help improve replication latency.

You can use the following query to determine the tables with primary key missing on the source server:

```sql 
select tab.table_schema as database_name, tab.table_name 
from information_schema.tables tab left join 
information_schema.table_constraints tco 
on tab.table_schema = tco.table_schema 
and tab.table_name = tco.table_name 
and tco.constraint_type = 'PRIMARY KEY' 
where tco.constraint_type is null 
and tab.table_schema not in('mysql', 'information_schema', 'performance_schema', 'sys') 
and tab.table_type = 'BASE TABLE' 
order by tab.table_schema, tab.table_name;

```

#### Replication latency due to long running queries on replica server

It is possible that the workload on replica server can prevent SQL thread to keep-up with the IO thread. This is one of the common causes of high replication latency if there is a long running query on the replica server. In this case, [slow query log](concepts-server-logs.md) should be enabled on the replica server to help troubleshooting the issue. Slow queries can increase resource consumptions or slow down the server, thus replica will not be able to catch-up with the master. In this scenario, you need to tune slow queries. Faster queries prevent blocking of SQL thread and improves replication latency significantly.


#### Replication latency due to DDL queries on source server
If there is an long running DDL command like [ALTER TABLE](https://dev.mysql.com/doc/refman/5.7/en/alter-table.html) executed on source server and say it took 1 hour to execute. During that time, there may be thousands of other queries running in parallel on source server. When the DDL gets replicated to the replica, to ensure consistency of the database, MySQL engine has to run the DDL in a single replication thread. So all other replicated queries will be blocked and will need to wait for a hour or more until the DDL operation is completed on replica server. This is true regardless of online DDL operation or not. With DDL operations, the replication is expected to see an increased replication latency.

If you have [slow query log](concepts-server-logs.md) enabled on the source server, this scenario can be detected by looking at the slow query logs to see if a DDL command was executed on source server. Though Index dropping, renaming and creation should use INPLACE algorithm for the ALTER TABLE it may involve copying table data, and rebuild the table. Typically for INPLACE algorithm concurrent DML is supported, but an exclusive metadata lock on the table may be taken briefly during preparation and execution phases of the operation. As such, for CREATE INDEX statement the clauses ALGORITHM and LOCK may be used to influence the table copying method and level of concurrency for reading and writing, nevertheless adding a FULLTEXT or SPATIAL index will still prevent DML operations. See below an example of creating an index with ALGORITHM and LOCK clauses:

```sql
ALTER TABLE table_name ADD INDEX index_name (column), ALGORITHM=INPLACE, LOCK=NONE;
```

Unfortunately, for DDL statement that requires a lock, replication latency cannot be avoided, instead these types of DDL operations should be performed during off peak hours, for instance during nighttime to reduce potential impact.

#### Replication latency due to replica server lower SKU

In Azure Database for MySQL read replicas are created with the same server configuration as the master server. The replica server configuration can be changed after it has been created. However, if the replica server will be downgraded, the workload can cause higher resource consumption that in turn can lead to replication latency. This can be observed by monitoring the CPU and Memory consumption of the replica server from Azure Monitor. In this scenario, it is recommended that the replica server's configuration should be kept at equal or greater values than the source to ensure the replica is able to keep up with the master.

#### Improving replication latency using server parameter tuning on source server

In Azure Database for MySQL, replication is optimized to run with parallel threads on replicas by default. For high concurrency workloads on source server where replica server is failing to catch-up, the replication latency can improved by configuring parameter binlog_group_commit_sync_delay on the source server. This parameter controls how many microseconds the binary log commit waits before synchronizing the binary log file. The benefit is that instead of immediately applying every transaction committed, the master send the binary log updates in bulk. This reduces IO on the replica and helps to improve performance. In this scenario, it might be useful to set binlog_group_commit_sync_delay to 1000 or so and monitor the replication latency. This parameter should be set cautiously and leveraged for high concurrent workloads only. For low concurrency scenario with lot of singleton transactions, setting binlog_group_commit_sync_delay can add to the latency because the IO thread is waiting for bulk binary log updates while only few transactions may be committed. 

## Next steps
Learn more about [MySQL binlog replication overview](https://dev.mysql.com/doc/refman/5.7/en/binlog-replication-configuration-overview.html).
