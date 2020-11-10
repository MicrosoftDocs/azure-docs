---
title: Server parameters - Azure Database for MySQL - Flexible Server
description: This topic provides guidelines for configuring server parameters in Azure Database for MySQL - Flexible Server.
author: ambhatna
ms.author: ambhatna
ms.service: mysql
ms.topic: conceptual
ms.date: 11/10/2020
---
# Server parameters in Azure Database for MySQL - Flexible Server

> [!IMPORTANT]
> Azure Database for MySQL - Flexible Server is currently in public preview.

This article provides considerations and guidelines for configuring server parameters in Azure Database for MySQL flexible server.

## What are server parameters? 

The MySQL engine provides many different server variables/parameters that can be used to configure and tune engine behavior. Some parameters can be set dynamically during runtime while others are "static", requiring a server restart in order to apply.

Azure Database for MySQL flexible server exposes the ability to change the value of various MySQL server parameters using the [Azure portal](./how-to-configure-server-parameters-portal.md) and [Azure CLI](./how-to-configure-server-parameters-cli.md) to match your workload's needs.

## Configurable server parameters

You can manage Azure Database for MySQL Flexible Server configuration using server parameters. The server parameters are configured with the default and recommended value when you create the server. The server parameter blade on Azure portal shows both the modifiable and non-modifiable server parameter. The non-modifiable server parameters are greyed out.

The list of supported server parameters is constantly growing. Use the server parameters tab in the Azure portal to view the full list and configure server parameters values.

Refer to the following sections below to learn more about the limits of the several commonly updated server parameters. The limits are determined by the pricing tier and vCores of the server.

### log_bin_trust_function_creators

In Azure Database for MySQL Flexible Server, binary logs are always enabled (i.e. `log_bin` is set to ON). In case you want to use triggers you will get error similar to *you do not have the SUPER privilege and binary logging is enabled (you might want to use the less safe `log_bin_trust_function_creators` variable)*. 

The binary logging format is always **ROW** and all connections to the server **ALWAYS** use row-based binary logging. With row-based binary logging, security issues do not exist and binary logging cannot break, so you can safely set [`log_bin_trust_function_creators`](https://dev.mysql.com/doc/refman/5.7/en/replication-options-binary-log.html#sysvar_log_bin_trust_function_creators) to **TRUE**.

### innodb_buffer_pool_size

Review the [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/innodb-parameters.html#sysvar_innodb_buffer_pool_size) to learn more about this parameter.

|**Pricing Tier**|**vCore(s)**|**Memory Size (GiB)**|**Default value (bytes)**|**Min value (bytes)**|**Max value (bytes)**|
|---|---|---|---|---|---|
|Burstable (B1s)|1|1|134217728|33554432|134217728|
|Burstable (B1ms)|1|2|536870912|134217728|536870912|
|Burstable|2|4|2147483648|134217728|2147483648|
|General Purpose|2|8|6442450944|134217728|6442450944|
|General Purpose|4|16|12884901888|134217728|12884901888|
|General Purpose|8|32|25769803776|134217728|25769803776|
|General Purpose|16|64|51539607552|134217728|51539607552|
|General Purpose|32|128|103079215104|134217728|103079215104|
|General Purpose|48|192|154618822656|134217728|154618822656|
|General Purpose|64|256|206158430208|134217728|206158430208|
|Memory Optimized|2|16|12884901888|134217728|12884901888|
|Memory Optimized|4|32|25769803776|134217728|25769803776|
|Memory Optimized|8|64|51539607552|134217728|51539607552|
|Memory Optimized|16|128|103079215104|134217728|103079215104|
|Memory Optimized|32|256|206158430208|134217728|206158430208|
|Memory Optimized|48|384|309237645312|134217728|309237645312|
|Memory Optimized|64|504|405874409472|134217728|405874409472|

### innodb_file_per_table

MySQL stores the InnoDB table in different tablespaces based on the configuration you provided during the table creation. The [system tablespace](https://dev.mysql.com/doc/refman/5.7/en/innodb-system-tablespace.html) is the storage area for the InnoDB data dictionary. A [file-per-table tablespace](https://dev.mysql.com/doc/refman/5.7/en/innodb-file-per-table-tablespaces.html) contains data and indexes for a single InnoDB table, and is stored in the file system in its own data file. This behavior is controlled by the `innodb_file_per_table` server parameter. Setting `innodb_file_per_table` to `OFF` causes InnoDB to create tables in the system tablespace. Otherwise, InnoDB creates tables in file-per-table tablespaces.

Azure Database for MySQL Flexible Server supports at largest, **4 TB**, in a single data file. If your database size is larger than 4 TB, you should create the table in [innodb_file_per_table](https://dev.mysql.com/doc/refman/5.7/en/innodb-parameters.html#sysvar_innodb_file_per_table) tablespace. If you have a single table size larger than 4 TB, you should use the partition table.

### max_connections

The value of max_connection is determined by the memory size of the server. 

|**Pricing Tier**|**vCore(s)**|**Memory Size (GiB)**|**Default value**|**Min value**|**Max value**|
|---|---|---|---|---|---|
|Burstable (B1s)|1|1|85|10|171|
|Burstable (B1ms)|1|2|171|10|341|
|Burstable|2|4|341|10|683|
|General Purpose|2|8|683|10|1365|
|General Purpose|4|16|1365|10|2731|
|General Purpose|8|32|2731|10|5461|
|General Purpose|16|64|5461|10|10923|
|General Purpose|32|128|10923|10|21845|
|General Purpose|48|192|16384|10|32768|
|General Purpose|64|256|21845|10|43691|
|Memory Optimized|2|16|1365|10|2731|
|Memory Optimized|4|32|2731|10|5461|
|Memory Optimized|8|64|5461|10|10923|
|Memory Optimized|16|128|10923|10|21845|
|Memory Optimized|32|256|21845|10|43691|
|Memory Optimized|48|384|32768|10|65536|
|Memory Optimized|64|504|43008|10|86016|

When connections exceed the limit, you may receive the following error:
> ERROR 1040 (08004): Too many connections

> [!IMPORTANT]
> For best experience, we recommend that you use a connection pooler like ProxySQL to efficiently manage connections.

Creating new client connections to MySQL takes time and once established, these connections occupy database resources, even when idle. Most applications request many short-lived connections, which compounds this situation. The result is fewer resources available for your actual workload leading to decreased performance. A connection pooler that decreases idle connections and reuses existing connections will help avoid this. To learn about setting up ProxySQL, visit our [blog post](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/load-balance-read-replicas-using-proxysql-in-azure-database-for/ba-p/880042).

>[!Note]
>ProxySQL is an open source community tool. It is supported by Microsoft on a best effort basis. In order to get production support with authoritative guidance, you can evaluate and reach out to [ProxySQL Product support](https://proxysql.com/services/support/).

### innodb_strict_mode

If you receive an error similar to "Row size too large (> 8126)" then you may want to turn OFF the parameter **innodb_strict_mode**. The server parameter **innodb_strict_mode** is not allowed to be modified globally at the server level because if row data size is larger than 8k, the data will be truncated without an error leading to potential data loss. We recommend to modify the schema to fit the page size limit. 

This parameter can be set at a session level using `init_connect`. To set **innodb_strict_mode** at session level, refer to [setting parameter not listed](./how-to-configure-server-parameters-portal.md#setting-parameters-not-listed).

> [!NOTE]
> If you have a read replica server, setting **innodb_strict_mode** to OFF at the session-level on a source server will break the replication. We suggest keeping the parameter set to OFF if you have read replicas.

### time_zone

Upon initial deployment, an Azure for MySQL server includes systems tables for time zone information, but these tables are not populated. The time zone tables can be populated by calling the `mysql.az_load_timezone` stored procedure from a tool like the MySQL command line or MySQL Workbench. Refer to the [Azure portal](./how-to-configure-server-parameters-portal.md#working-with-the-time-zone-parameter) or [Azure CLI](./how-to-configure-server-parameters-cli.md#working-with-the-time-zone-parameter) articles for how to call the stored procedure and set the global or session-level time zones.

## Non-modifiable server parameters

The server parameter blade on Azure portal shows both the modifiable and non-modifiable server parameter. The non-modifiable server parameters are greyed out. If you want to configure the non-modifiable server parameter at session level, refer to the [Azure Portal](./how-to-configure-server-parameters-portal.md#setting-non-modifiable-server-parameters) or [Azure CLI](./how-to-configure-server-parameters-cli.md#setting-non-modifiable-server-parameters) article for setting the parameter at the connection level using `init_connect`.

## Next steps

- How to configure [server parameters in Azure portal](./how-to-configure-server-parameters-portal.md)
- How to configure [server parameters in Azure CLI](./how-to-configure-server-parameters-cli.md)
