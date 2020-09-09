---
title: Server parameters - Azure Database for MariaDB
description: This topic provides guidelines for configuring server parameters in Azure Database for MariaDB.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.topic: conceptual
ms.date: 6/25/2020
---
# Server parameters in Azure Database for MariaDB

This article provides considerations and guidelines for configuring server parameters in Azure Database for MariaDB.

## What are server parameters? 

The MariaDB engine provides many different server variables/parameters that can be used to configure and tune engine behavior. Some parameters can be set dynamically during runtime while others are "static", requiring a server restart in order to apply.

Azure Database for MariaDB exposes the ability to change the value of various MariaDB server parameters using the [Azure portal](./howto-server-parameters.md), [Azure CLI](./howto-configure-server-parameters-cli.md), and [PowerShell](./howto-configure-server-parameters-using-powershell.md) to match your workload's needs.

## Configurable server parameters

The list of supported server parameters is constantly growing. Use the server parameters tab in the Azure portal to view the full list and configure server parameters values.

Refer to the following sections below to learn more about the limits of the several commonly updated server parameters. The limits are determined by the pricing tier and vCores of the server.

### innodb_buffer_pool_size

Review the [MariaDB documentation](https://mariadb.com/kb/en/innodb-system-variables/#innodb_buffer_pool_size) to learn more about this parameter.

#### Servers supporting up to 4 TB storage

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

#### Servers support up to 16 TB storage

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
> `innodb_file_per_table` can only be updated in the General Purpose and Memory Optimized pricing tiers.

MariaDB stores the InnoDB table in different tablespaces based on the configuration you provided during the table creation. The [system tablespace](https://mariadb.com/kb/en/innodb-system-tablespaces/) is the storage area for the InnoDB data dictionary. A [file-per-table tablespace](https://mariadb.com/kb/en/innodb-file-per-table-tablespaces/) contains data and indexes for a single InnoDB table, and is stored in the file system in its own data file. This behavior is controlled by the `innodb_file_per_table` server parameter. Setting `innodb_file_per_table` to `OFF` causes InnoDB to create tables in the system tablespace. Otherwise, InnoDB creates tables in file-per-table tablespaces.

Azure Database for MariaDB supports at largest, **1 TB**, in a single data file. If your database size is larger than 1 TB, you should create the table in [innodb_file_per_table](https://mariadb.com/kb/en/innodb-system-variables/#innodb_file_per_table) tablespace. If you have a single table size larger than 1 TB, you should use the partition table.

### join_buffer_size

Review the [MariaDB documentation](https://mariadb.com/kb/en/server-system-variables/#join_buffer_size) to learn more about this parameter.

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

Creating new client connections to MariaDB takes time and once established, these connections occupy database resources, even when idle. Most applications request many short-lived connections, which compounds this situation. The result is fewer resources available for your actual workload leading to decreased performance. A connection pooler that decreases idle connections and reuses existing connections will help avoid this. To learn about setting up ProxySQL, visit our [blog post](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/load-balance-read-replicas-using-proxysql-in-azure-database-for/ba-p/880042).

>[!Note]
>ProxySQL is an open source community tool. It is supported by Microsoft on a best effort basis. In order to get production support with authoritative guidance, you can evaluate and reach out to [ProxySQL Product support](https://proxysql.com/services/support/).

### max_heap_table_size

Review the [MariaDB documentation](https://mariadb.com/kb/en/server-system-variables/#max_heap_table_size) to learn more about this parameter.

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

The query cache is enabled by default in MariaDB with the `have_query_cache` parameter. 

Review the [MariaDB documentation](https://mariadb.com/kb/en/server-system-variables/#query_cache_size) to learn more about this parameter.

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

### sort_buffer_size

Review the [MariaDB documentation](https://mariadb.com/kb/en/server-system-variables/#sort_buffer_size) to learn more about this parameter.

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

Review the [MariaDB documentation](https://mariadb.com/kb/en/server-system-variables/#tmp_table_size) to learn more about this parameter.

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

### time_zone

Upon initial deployment, an Azure for MariaDB server includes systems tables for time zone information, but these tables are not populated. The time zone tables can be populated by calling the `mysql.az_load_timezone` stored procedure from a tool like the MySQL command line or MySQL Workbench. Refer to the [Azure portal](howto-server-parameters.md#working-with-the-time-zone-parameter) or [Azure CLI](howto-configure-server-parameters-cli.md#working-with-the-time-zone-parameter) articles for how to call the stored procedure and set the global or session-level time zones.

## Non-configurable server parameters

The below server parameters are not configurable in the service:

|**Parameter**|**Fixed value**|
| :------------------------ | :-------- |
|innodb_file_per_table in Basic tier|OFF|
|innodb_flush_log_at_trx_commit|1|
|sync_binlog|1|
|innodb_log_file_size|256MB|
|innodb_log_files_in_group|2|

Other server parameters that are not listed here are set to their MariaDB out-of-box default values for [MariaDB](https://mariadb.com/kb/en/server-system-variables/).

## Next steps

- Learn how to [configure sever parameters using the Azure portal](./howto-server-parameters.md)
- Learn how to [configure sever parameters using the Azure CLI](./howto-configure-server-parameters-cli.md)
- Learn how to [configure sever parameters using PowerShell](./howto-configure-server-parameters-using-powershell.md)