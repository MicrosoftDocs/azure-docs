---
title: Server parameters - Azure Database for MySQL
description: This topic provides guidelines for configuring server parameters in Azure Database for MySQL.
author: Bashar-MSFT
ms.author: bahusse
ms.service: mysql
ms.topic: conceptual
ms.date: 1/26/2021
---
# Server parameters in Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-server](includes/applies-to-mysql-single-server.md)]

This article provides considerations and guidelines for configuring server parameters in Azure Database for MySQL.

## What are server parameters? 

The MySQL engine provides many different server variables/parameters that can be used to configure and tune engine behavior. Some parameters can be set dynamically during runtime while others are "static", requiring a server restart in order to apply.

Azure Database for MySQL exposes the ability to change the value of various MySQL server parameters using the [Azure portal](./howto-server-parameters.md), [Azure CLI](./howto-configure-server-parameters-using-cli.md), and [PowerShell](./howto-configure-server-parameters-using-powershell.md) to match your workload's needs.

## Configurable server parameters

The list of supported server parameters is constantly growing. Use the server parameters tab in the Azure portal to view the full list and configure server parameters values.

Refer to the following sections below to learn more about the limits of the several commonly updated server parameters. The limits are determined by the pricing tier and vCores of the server.

### Thread pools

MySQL traditionally assigns a thread for every client connection. As the number of concurrent users grows, there is a corresponding drop in performance. Many active threads can impact the performance significantly due to increased context switching, thread contention, and bad locality for CPU caches.

Thread pools which is a server side feature and distinct from connection pooling, maximize performance by introducing a dynamic pool of worker thread that can be used to limit the number of active threads running on the server and minimize thread churn. This helps ensure that a burst of connections will not cause the server to run out of resources or crash with an out of memory error. Thread pools are most efficient for short queries and CPU intensive workloads, for example OLTP workloads.

To learn more about thread pools, refer to [Introducing thread pools in Azure Database for MySQL](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/introducing-thread-pools-in-azure-database-for-mysql-service/ba-p/1504173)

> [!NOTE]
> Thread pool feature is not supported for MySQL 5.6 version. 

### Configuring the thread pool
To enable thread pool, update the `thread_handling` server parameter to "pool-of-threads". By default, this parameter is set to `one-thread-per-connection`, which means MySQL creates a new thread for each new connections. Please note that this is a static parameter and requires a server restart to apply.

You can also configure the maximum and minimum number of threads in the pool by setting the following server parameters: 
- `thread_pool_max_threads`: This value ensures that there will not be more than this number of threads in the pool.
- `thread_pool_min_threads`: This value sets the number of threads that will be reserved even after connections are closed.

To improve performance issues of short queries on the thread pool, Azure Database for MySQL allows you to enable batch execution where instead of returning back to the thread pool immediately after executing a query, threads will keep active for a short time to wait for the next query through this connection. The thread then executes the query rapidly and once complete, waits for the next one, until the overall time consumption of this process exceeds a threshold. The batch execution behavior is determined using the following server parameters:  

-  `thread_pool_batch_wait_timeout`: This value specifies the time a thread waits for another query to process.
- `thread_pool_batch_max_time`: This value determines the max time a thread will repeat the cycle of query execution and waiting for the next query.

> [!IMPORTANT]
> Please test thread pool before turning it ON in production. 

### log_bin_trust_function_creators

In Azure Database for MySQL, binary logs are always enabled (i.e. `log_bin` is set to ON). In case you want to use triggers you will get error similar to *you do not have the SUPER privilege and binary logging is enabled (you might want to use the less safe `log_bin_trust_function_creators` variable)*. 

The binary logging format is always **ROW** and all connections to the server **ALWAYS** use row-based binary logging. With row-based binary logging, security issues do not exist and binary logging cannot break, so you can safely set [`log_bin_trust_function_creators`](https://dev.mysql.com/doc/refman/5.7/en/replication-options-binary-log.html#sysvar_log_bin_trust_function_creators) to **TRUE**.

### innodb_buffer_pool_size

Review the [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/innodb-parameters.html#sysvar_innodb_buffer_pool_size) to learn more about this parameter.

#### Servers on [general purpose storage v1 (supporting up to 4-TB)](concepts-pricing-tiers.md#general-purpose-storage-v1-supports-up-to-4-tb)

|**Pricing Tier**|**vCore(s)**|**Default value (bytes)**|**Min value (bytes)**|**Max value (bytes)**|
|---|---|---|---|---|
|Basic|1|872415232|134217728|872415232|
|Basic|2|2684354560|134217728|2684354560|
|General Purpose|2|3758096384|134217728|3758096384|
|General Purpose|4|8053063680|134217728|8053063680|
|General Purpose|8|16106127360|134217728|16106127360|
|General Purpose|16|32749125632|134217728|32749125632|
|General Purpose|32|66035122176|134217728|66035122176|
|General Purpose|64|132070244352|134217728|132070244352|
|Memory Optimized|2|7516192768|134217728|7516192768|
|Memory Optimized|4|16106127360|134217728|16106127360|
|Memory Optimized|8|32212254720|134217728|32212254720|
|Memory Optimized|16|65498251264|134217728|65498251264|
|Memory Optimized|32|132070244352|134217728|132070244352|

#### Servers on [general purpose storage v2 (supporting up to 16-TB)](concepts-pricing-tiers.md#general-purpose-storage-v2-supports-up-to-16-tb-storage)

|**Pricing Tier**|**vCore(s)**|**Default value (bytes)**|**Min value (bytes)**|**Max value (bytes)**|
|---|---|---|---|---|
|Basic|1|872415232|134217728|872415232|
|Basic|2|2684354560|134217728|2684354560|
|General Purpose|2|7516192768|134217728|7516192768|
|General Purpose|4|16106127360|134217728|16106127360|
|General Purpose|8|32212254720|134217728|32212254720|
|General Purpose|16|65498251264|134217728|65498251264|
|General Purpose|32|132070244352|134217728|132070244352|
|General Purpose|64|264140488704|134217728|264140488704|
|Memory Optimized|2|15032385536|134217728|15032385536|
|Memory Optimized|4|32212254720|134217728|32212254720|
|Memory Optimized|8|64424509440|134217728|64424509440|
|Memory Optimized|16|130996502528|134217728|130996502528|
|Memory Optimized|32|264140488704|134217728|264140488704|

### innodb_file_per_table

> [!NOTE]
> `innodb_file_per_table` can only be updated in the General Purpose and Memory Optimized pricing tiers on [general purpose storage v2](concepts-pricing-tiers.md#general-purpose-storage-v2-supports-up-to-16-tb-storage).

MySQL stores the InnoDB table in different tablespaces based on the configuration you provided during the table creation. The [system tablespace](https://dev.mysql.com/doc/refman/5.7/en/innodb-system-tablespace.html) is the storage area for the InnoDB data dictionary. A [file-per-table tablespace](https://dev.mysql.com/doc/refman/5.7/en/innodb-file-per-table-tablespaces.html) contains data and indexes for a single InnoDB table, and is stored in the file system in its own data file. This behavior is controlled by the `innodb_file_per_table` server parameter. Setting `innodb_file_per_table` to `OFF` causes InnoDB to create tables in the system tablespace. Otherwise, InnoDB creates tables in file-per-table tablespaces.

Azure Database for MySQL supports at largest, **4-TB**,  in a single data file on [general purpose storage v2](concepts-pricing-tiers.md#general-purpose-storage-v2-supports-up-to-16-tb-storage). If your database size is larger than 4 TB, you should create the table in [innodb_file_per_table](https://dev.mysql.com/doc/refman/5.7/en/innodb-parameters.html#sysvar_innodb_file_per_table) tablespace. If you have a single table size larger than 4-TB, you should use the partition table.

### join_buffer_size

Review the [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html#sysvar_join_buffer_size) to learn more about this parameter.

|**Pricing Tier**|**vCore(s)**|**Default value (bytes)**|**Min value (bytes)**|**Max value (bytes)**|
|---|---|---|---|---|
|Basic|1|Not configurable in Basic tier|N/A|N/A|
|Basic|2|Not configurable in Basic tier|N/A|N/A|
|General Purpose|2|262144|128|268435455|
|General Purpose|4|262144|128|536870912|
|General Purpose|8|262144|128|1073741824|
|General Purpose|16|262144|128|2147483648|
|General Purpose|32|262144|128|4294967295|
|General Purpose|64|262144|128|4294967295|
|Memory Optimized|2|262144|128|536870912|
|Memory Optimized|4|262144|128|1073741824|
|Memory Optimized|8|262144|128|2147483648|
|Memory Optimized|16|262144|128|4294967295|
|Memory Optimized|32|262144|128|4294967295|

### max_connections

|**Pricing Tier**|**vCore(s)**|**Default value**|**Min value**|**Max value**|
|---|---|---|---|---|
|Basic|1|50|10|50|
|Basic|2|100|10|100|
|General Purpose|2|300|10|600|
|General Purpose|4|625|10|1250|
|General Purpose|8|1250|10|2500|
|General Purpose|16|2500|10|5000|
|General Purpose|32|5000|10|10000|
|General Purpose|64|10000|10|20000|
|Memory Optimized|2|625|10|1250|
|Memory Optimized|4|1250|10|2500|
|Memory Optimized|8|2500|10|5000|
|Memory Optimized|16|5000|10|10000|
|Memory Optimized|32|10000|10|20000|

When connections exceed the limit, you may receive the following error:
> ERROR 1040 (08004): Too many connections

> [!IMPORTANT]
> For best experience, we recommend that you use a connection pooler like ProxySQL to efficiently manage connections.

Creating new client connections to MySQL takes time and once established, these connections occupy database resources, even when idle. Most applications request many short-lived connections, which compounds this situation. The result is fewer resources available for your actual workload leading to decreased performance. A connection pooler that decreases idle connections and reuses existing connections will help avoid this. To learn about setting up ProxySQL, visit our [blog post](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/load-balance-read-replicas-using-proxysql-in-azure-database-for/ba-p/880042).

>[!Note]
>ProxySQL is an open source community tool. It is supported by Microsoft on a best effort basis. In order to get production support with authoritative guidance, you can evaluate and reach out to [ProxySQL Product support](https://proxysql.com/services/support/).

### max_heap_table_size

Review the [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html#sysvar_max_heap_table_size) to learn more about this parameter.

|**Pricing Tier**|**vCore(s)**|**Default value (bytes)**|**Min value (bytes)**|**Max value (bytes)**|
|---|---|---|---|---|
|Basic|1|Not configurable in Basic tier|N/A|N/A|
|Basic|2|Not configurable in Basic tier|N/A|N/A|
|General Purpose|2|16777216|16384|268435455|
|General Purpose|4|16777216|16384|536870912|
|General Purpose|8|16777216|16384|1073741824|
|General Purpose|16|16777216|16384|2147483648|
|General Purpose|32|16777216|16384|4294967295|
|General Purpose|64|16777216|16384|4294967295|
|Memory Optimized|2|16777216|16384|536870912|
|Memory Optimized|4|16777216|16384|1073741824|
|Memory Optimized|8|16777216|16384|2147483648|
|Memory Optimized|16|16777216|16384|4294967295|
|Memory Optimized|32|16777216|16384|4294967295|

### query_cache_size

The query cache is turned off by default. To enable the query cache, configure the `query_cache_type` parameter. 

Review the [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html#sysvar_query_cache_size) to learn more about this parameter.

> [!NOTE]
> The query cache is deprecated as of MySQL 5.7.20 and has been removed in MySQL 8.0

|**Pricing Tier**|**vCore(s)**|**Default value (bytes)**|**Min value (bytes)**|**Max value **|
|---|---|---|---|---|
|Basic|1|Not configurable in Basic tier|N/A|N/A|
|Basic|2|Not configurable in Basic tier|N/A|N/A|
|General Purpose|2|0|0|16777216|
|General Purpose|4|0|0|33554432|
|General Purpose|8|0|0|67108864|
|General Purpose|16|0|0|134217728|
|General Purpose|32|0|0|134217728|
|General Purpose|64|0|0|134217728|
|Memory Optimized|2|0|0|33554432|
|Memory Optimized|4|0|0|67108864|
|Memory Optimized|8|0|0|134217728|
|Memory Optimized|16|0|0|134217728|
|Memory Optimized|32|0|0|134217728|

### lower_case_table_names

The lower_case_table_name is set to 1 by default and you can update this parameter in MySQL 5.6 and MySQL 5.7

Review the [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html#sysvar_lower_case_table_names) to learn more about this parameter.

> [!NOTE]
> In MySQL 8.0, the lower_case_table_name is set to 1 by default and you cannot change it.

### innodb_strict_mode

If you receive an error similar to "Row size too large (> 8126)" then you may want to turn OFF the parameter **innodb_strict_mode**. The server parameter **innodb_strict_mode** is not allowed to be modified globally at the server level because if row data size is larger than 8k, the data will be truncated without an error leading to potential data loss. We recommend to modify the schema to fit the page size limit. 

This parameter can be set at a session level using `init_connect`. To set **innodb_strict_mode** at session level, refer to [setting parameter not listed](./howto-server-parameters.md#setting-parameters-not-listed).

> [!NOTE]
> If you have a read replica server, setting **innodb_strict_mode** to OFF at the session-level on a source server will break the replication. We suggest keeping the parameter set to OFF if you have read replicas.

### sort_buffer_size

Review the [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html#sysvar_sort_buffer_size) to learn more about this parameter.

|**Pricing Tier**|**vCore(s)**|**Default value (bytes)**|**Min value (bytes)**|**Max value (bytes)**|
|---|---|---|---|---|
|Basic|1|Not configurable in Basic tier|N/A|N/A|
|Basic|2|Not configurable in Basic tier|N/A|N/A|
|General Purpose|2|524288|32768|4194304|
|General Purpose|4|524288|32768|8388608|
|General Purpose|8|524288|32768|16777216|
|General Purpose|16|524288|32768|33554432|
|General Purpose|32|524288|32768|33554432|
|General Purpose|64|524288|32768|33554432|
|Memory Optimized|2|524288|32768|8388608|
|Memory Optimized|4|524288|32768|16777216|
|Memory Optimized|8|524288|32768|33554432|
|Memory Optimized|16|524288|32768|33554432|
|Memory Optimized|32|524288|32768|33554432|

### tmp_table_size

Review the [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html#sysvar_tmp_table_size) to learn more about this parameter.

|**Pricing Tier**|**vCore(s)**|**Default value (bytes)**|**Min value (bytes)**|**Max value (bytes)**|
|---|---|---|---|---|
|Basic|1|Not configurable in Basic tier|N/A|N/A|
|Basic|2|Not configurable in Basic tier|N/A|N/A|
|General Purpose|2|16777216|1024|67108864|
|General Purpose|4|16777216|1024|134217728|
|General Purpose|8|16777216|1024|268435456|
|General Purpose|16|16777216|1024|536870912|
|General Purpose|32|16777216|1024|1073741824|
|General Purpose|64|16777216|1024|1073741824|
|Memory Optimized|2|16777216|1024|134217728|
|Memory Optimized|4|16777216|1024|268435456|
|Memory Optimized|8|16777216|1024|536870912|
|Memory Optimized|16|16777216|1024|1073741824|
|Memory Optimized|32|16777216|1024|1073741824|

### InnoDB Buffer Pool Warmup
After restarting Azure Database for MySQL server, the data pages residing in disk are loaded as the tables are queried. This leads to increased latency and slower performance for the first execution of the queries. This may not be acceptable for latency sensitive workloads. Utilizing InnoDB buffer pool warmup shortens the warmup period by reloading disk pages that were in the buffer pool before the restart rather than waiting for DML or SELECT operations to access corresponding rows.

You can reduce the warmup period after restarting your Azure Database for MySQL server which represents a performance advantage by configuring [InnoDB buffer pool server parameters](https://dev.mysql.com/doc/refman/8.0/en/innodb-preload-buffer-pool.html). InnoDB saves a percentage of the most recently used pages for each buffer pool at server shutdown and restores these pages at server startup.

It is also important to note that improved performance comes at the expense of longer start-up time for the server. When this parameter is enabled, the server startup and restart time is expected to increase depending on the IOPS provisioned on the server. We recommend to test and monitor the restart time to ensure the start-up/restart performance is acceptable as the server is unavailable during that time. It is not recommend to use this parameter when IOPS provisioned is less than 1000 IOPS (or in other words, when storage provisioned is less than 335GB.

To save the state of the buffer pool at server shutdown set server parameter `innodb_buffer_pool_dump_at_shutdown` to `ON`. Similarly, set server parameter `innodb_buffer_pool_load_at_startup` to `ON` to restore the buffer pool state at server startup. You can control the impact on start-up/restart by lowering and fine tuning the value of server parameter `innodb_buffer_pool_dump_pct`, By default, this parameter is set to `25`.

> [!Note]
> InnoDB buffer pool warmup parameters are only supported in general purpose storage servers with up to 16-TB storage. Learn more about [Azure Database for MySQL storage options here](./concepts-pricing-tiers.md#storage).

### time_zone

Upon initial deployment, an Azure for MySQL server includes systems tables for time zone information, but these tables are not populated. The time zone tables can be populated by calling the `mysql.az_load_timezone` stored procedure from a tool like the MySQL command line or MySQL Workbench. Refer to the [Azure portal](howto-server-parameters.md#working-with-the-time-zone-parameter) or [Azure CLI](howto-configure-server-parameters-using-cli.md#working-with-the-time-zone-parameter) articles for how to call the stored procedure and set the global or session-level time zones.

## Non-configurable server parameters

The below server parameters are not configurable in the service:

|**Parameter**|**Fixed value**|
| :------------------------ | :-------- |
|innodb_file_per_table in Basic tier|OFF|
|innodb_flush_log_at_trx_commit|1|
|sync_binlog|1|
|innodb_log_file_size|256MB|
|innodb_log_files_in_group|2|

Other variables not listed here are set to the default MySQL out-of-the-box values. Refer to the MySQL docs for versions [8.0](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html), [5.7](https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html), and [5.6](https://dev.mysql.com/doc/refman/5.6/en/server-system-variables.html) for the default values. 

## Next steps

- Learn how to [configure sever parameters using the Azure portal](./howto-server-parameters.md)
- Learn how to [configure sever parameters using the Azure CLI](./howto-configure-server-parameters-using-cli.md)
- Learn how to [configure sever parameters using PowerShell](./howto-configure-server-parameters-using-powershell.md)
