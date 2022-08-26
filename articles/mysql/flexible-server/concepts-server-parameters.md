---
title: Server parameters - Azure Database for MySQL - Flexible Server
description: This topic provides guidelines for configuring server parameters in Azure Database for MySQL - Flexible Server.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
author: code-sidd
ms.author: sisawant
ms.custom: event-tier1-build-2022
ms.date: 05/24/2022
---
# Server parameters in Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article provides considerations and guidelines for configuring server parameters in Azure Database for MySQL flexible server.

## What are server variables?

The MySQL engine provides many different [server variables/parameters](https://dev.mysql.com/doc/refman/5.7/en/server-option-variable-reference.html) that can be used to configure and tune engine behavior. Some parameters can be set dynamically during runtime while others are "static", requiring a server restart in order to apply.

Azure Database for MySQL Flexible Server exposes the ability to change the value of various MySQL server parameters using the [Azure portal](./how-to-configure-server-parameters-portal.md) and [Azure CLI](./how-to-configure-server-parameters-cli.md) to match your workload's needs.

## Configurable server parameters

You can manage Azure Database for MySQL Flexible Server configuration using server parameters. The server parameters are configured with the default and recommended value when you create the server. The server parameter blade on Azure portal shows both the modifiable and non-modifiable server parameters. The non-modifiable server parameters are greyed out.

The list of supported server parameters is constantly growing. Use the server parameters tab in the Azure portal to view the full list and configure server parameters values.

Refer to the following sections below to learn more about the limits of the several commonly updated server parameters. The limits are determined by the compute tier and size (vCores) of the server.

> [!NOTE]
>* If you are looking to modify a server parameter which are static using the portal, it will request you to restart the server for the changes to take effect. In case you are using automation scripts (using tools like ARM templates , Terraform, Azure CLI etc) then your script should have a provision to restart the service for the settings to take effect even if you are changing the configurations as a part of create experience.
>* If you are looking to modify a server parameter which is non-modifiable but you would like to see as a modifiable for your environment, please open a [UserVoice](https://feedback.azure.com/d365community/forum/47b1e71d-ee24-ec11-b6e6-000d3a4f0da0) item or vote if the feedback already exist which can help us prioritize.

### log_bin_trust_function_creators

In Azure Database for MySQL Flexible Server, binary logs are always enabled (that is, `log_bin` is set to ON). log_bin_trust_function_creators is set to ON by default in flexible servers.

The binary logging format is always **ROW** and all connections to the server **ALWAYS** use row-based binary logging. With row-based binary logging, security issues do not exist and binary logging cannot break, so you can safely allow [`log_bin_trust_function_creators`](https://dev.mysql.com/doc/refman/5.7/en/replication-options-binary-log.html#sysvar_log_bin_trust_function_creators) to remain **ON**.

If [`log_bin_trust_function_creators`] is set to OFF, if you try to create triggers you may get errors similar to *you do not have the SUPER privilege and binary logging is enabled (you might want to use the less safe `log_bin_trust_function_creators` variable)*.

### innodb_buffer_pool_size

Review the [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/innodb-parameters.html#sysvar_innodb_buffer_pool_size) to learn more about this parameter.

|**Pricing Tier**|**vCore(s)**|**Memory Size (GiB)**|**Default value (bytes)**|**Min value (bytes)**|**Max value (bytes)**|
|---|---|---|---|---|---|
|Burstable (B1s)|1|1|134217728|33554432|134217728|
|Burstable (B1ms)|1|2|536870912|134217728|536870912|
|Burstable|2|4|2147483648|134217728|2147483648|
|General Purpose|2|8|5368709120|134217728|5368709120|
|General Purpose|4|16|12884901888|134217728|12884901888|
|General Purpose|8|32|25769803776|134217728|25769803776|
|General Purpose|16|64|51539607552|134217728|51539607552|
|General Purpose|32|128|103079215104|134217728|103079215104|
|General Purpose|48|192|154618822656|134217728|154618822656|
|General Purpose|64|256|206158430208|134217728|206158430208|
|Business Critical|2|16|12884901888|134217728|12884901888|
|Business Critical|4|32|25769803776|134217728|25769803776|
|Business Critical|8|64|51539607552|134217728|51539607552|
|Business Critical|16|128|103079215104|134217728|103079215104|
|Business Critical|32|256|206158430208|134217728|206158430208|
|Business Critical|48|384|309237645312|134217728|309237645312|
|Business Critical|64|504|405874409472|134217728|405874409472|

### innodb_file_per_table

MySQL stores the InnoDB table in different tablespaces based on the configuration you provided during the table creation. The [system tablespace](https://dev.mysql.com/doc/refman/5.7/en/innodb-system-tablespace.html) is the storage area for the InnoDB data dictionary. A [file-per-table tablespace](https://dev.mysql.com/doc/refman/5.7/en/innodb-file-per-table-tablespaces.html) contains data and indexes for a single InnoDB table, and is stored in the file system in its own data file. This behavior is controlled by the `innodb_file_per_table` server parameter. Setting `innodb_file_per_table` to `OFF` causes InnoDB to create tables in the system tablespace. Otherwise, InnoDB creates tables in file-per-table tablespaces.

Azure Database for MySQL Flexible Server supports at largest, **4 TB**, in a single data file. If your database size is larger than 4 TB, you should create the table in [innodb_file_per_table](https://dev.mysql.com/doc/refman/5.7/en/innodb-parameters.html#sysvar_innodb_file_per_table) tablespace. If you have a single table size larger than 4 TB, you should use the partition table.

### innodb_log_file_size

[innodb_log_file_size](https://dev.mysql.com/doc/refman/8.0/en/innodb-parameters.html#sysvar_innodb_log_file_size) is the size in bytes of each [log file](https://dev.mysql.com/doc/refman/8.0/en/glossary.html#glos_log_file) in a [log group](https://dev.mysql.com/doc/refman/8.0/en/glossary.html#glos_log_group). The combined size of log files [(innodb_log_file_size](https://dev.mysql.com/doc/refman/8.0/en/innodb-parameters.html#sysvar_innodb_log_file_size) * [innodb_log_files_in_group](https://dev.mysql.com/doc/refman/8.0/en/innodb-parameters.html#sysvar_innodb_log_files_in_group)) cannot exceed a maximum value that is slightly less than 512GB). A bigger log file size is better for performance, but it has a drawback that the recovery time after a crash will be high. You need to balance recovery time in the rare event of a crash recovery versus maximizing throughput during peak operations. These can also result in longer restart times. You can configure innodb_log_size to any of these values - 256MB, 512MB, 1GB or 2GB for Azure database for MySQL Flexible server. The parameter is static and requires a restart.

> [!NOTE]
> If you have changed the parameter innodb_log_file_size from default, check if the value of "show global status like 'innodb_buffer_pool_pages_dirty'" stays at 0 for 30 seconds to avoid restart delay.



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
|Business Critical|2|16|1365|10|2731|
|Business Critical|4|32|2731|10|5461|
|Business Critical|8|64|5461|10|10923|
|Business Critical|16|128|10923|10|21845|
|Business Critical|32|256|21845|10|43691|
|Business Critical|48|384|32768|10|65536|
|Business Critical|64|504|43008|10|86016|

When connections exceed the limit, you may receive the following error:
> ERROR 1040 (08004): Too many connections

> [!IMPORTANT]
>For best experience, we recommend that you use a connection pooler like ProxySQL to efficiently manage connections.

Creating new client connections to MySQL takes time and once established, these connections occupy database resources, even when idle. Most applications request many short-lived connections, which compounds this situation. The result is fewer resources available for your actual workload leading to decreased performance. A connection pooler that decreases idle connections and reuses existing connections will help avoid this. To learn about setting up ProxySQL, visit our [blog post](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/load-balance-read-replicas-using-proxysql-in-azure-database-for/ba-p/880042).

>[!Note]
>ProxySQL is an open source community tool. It is supported by Microsoft on a best effort basis. In order to get production support with authoritative guidance, you can evaluate and reach out to [ProxySQL Product support](https://proxysql.com/services/support/).

### innodb_strict_mode

If you receive an error similar to "Row size too large (> 8126)", you may want to turn OFF the parameter **innodb_strict_mode**. The server parameter **innodb_strict_mode** is not allowed to be modified globally at the server level because if row data size is larger than 8k, the data will be truncated without an error, which can lead to potential data loss. We recommend modifying the schema to fit the page size limit.

This parameter can be set at a session level using `init_connect`. To set **innodb_strict_mode** at session level, refer to [setting parameter not listed](./how-to-configure-server-parameters-portal.md#setting-non-modifiable-server-parameters).

> [!NOTE]
> If you have a read replica server, setting **innodb_strict_mode** to OFF at the session-level on a source server will break the replication. We suggest keeping the parameter set to ON if you have read replicas.

### time_zone

Upon initial deployment, an Azure for MySQL Flexible Server includes system tables for time zone information, but these tables are not populated. The time zone tables can be populated by calling the `mysql.az_load_timezone` stored procedure from a tool like the MySQL command line or MySQL Workbench. Refer to the [Azure portal](./how-to-configure-server-parameters-portal.md#working-with-the-time-zone-parameter) or [Azure CLI](./how-to-configure-server-parameters-cli.md#working-with-the-time-zone-parameter) articles for how to call the stored procedure and set the global or session-level time zones.

### binlog_expire_logs_seconds 

In Azure Database for MySQL this parameter specifies the number of seconds the service waits before purging the binary log file.

The binary log contains “events” that describe database changes such as table creation operations or changes to table data. It also contains events for statements that potentially could have made changes. The binary log are used mainly for two purposes , replication and data recovery operations.  Usually, the binary logs are purged as soon as the handle is free from service, backup or the replica set. In case of multiple replica, it would wait for the slowest replica to read the changes before it is been purged. If you want to persist binary logs for a more duration of time you can configure the parameter binlog_expire_logs_seconds. If the binlog_expire_logs_seconds is set to 0, which is the default value, it will purge as soon as the handle to the binary log is freed. If binlog_expire_logs_seconds > 0,  then it would wait until the seconds configured before it purges. For Azure database for MySQL, managed features like backup and read replica purging of binary files are handled internally . When you replicate the data-out from the Azure Database for MySQL service, this parameter needs to be set in primary to avoid purging of binary logs before the replica reads from the changes from the primary. If you set the binlog_expire_logs_seconds to a higher value, then the binary logs will not get purged soon enough and can lead to increase in the storage billing. 

## Non-modifiable server parameters

The server parameter blade on the Azure portal shows both the modifiable and non-modifiable server parameters. The non-modifiable server parameters are greyed out. If you want to configure a non-modifiable server parameter at session level, refer to the [Azure portal](./how-to-configure-server-parameters-portal.md#setting-non-modifiable-server-parameters) or [Azure CLI](./how-to-configure-server-parameters-cli.md#setting-non-modifiable-server-parameters) article for setting the parameter at the connection level using `init_connect`.

## Next steps

- How to configure [server parameters in Azure portal](./how-to-configure-server-parameters-portal.md)
- How to configure [server parameters in Azure CLI](./how-to-configure-server-parameters-cli.md)
