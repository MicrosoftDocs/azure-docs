---
title: Management stored procedures - Azure Database for MariaDB
description: Learn which stored procedures in Azure Database for MariaDB are useful to help you configure data-in replication, set the timezone, and kill queries.
ms.service: mariadb
author: SudheeshGH
ms.author: sunaray
ms.topic: conceptual
ms.date: 06/24/2022
---

# Azure Database for MariaDB management stored procedures

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

Stored procedures are available on Azure Database for MariaDB servers to help manage your MariaDB server. This includes managing your server's connections, queries, and setting up Data-in Replication.

## Data-in Replication stored procedures

Data-in Replication allows you to synchronize data from a MariaDB server running on-premises, in virtual machines, or database services hosted by other cloud providers into the Azure Database for MariaDB service.

The following stored procedures are used to set up or remove Data-in Replication between a source and replica.

|**Stored Procedure Name**|**Input Parameters**|**Output Parameters**|**Usage Note**|
|-----|-----|-----|-----|
|*mysql.az_replication_change_master*|master_host<br/>master_user<br/>master_password<br/>master_port<br/>master_log_file<br/>master_log_pos<br/>master_ssl_ca|N/A|To transfer data with SSL mode, pass in the CA certificate's context into the master_ssl_ca parameter. </br><br>To transfer data without SSL, pass in an empty string into the master_ssl_ca parameter.|
|*mysql.az_replication _start*|N/A|N/A|Starts replication.|
|*mysql.az_replication _stop*|N/A|N/A|Stops replication.|
|*mysql.az_replication _remove_master*|N/A|N/A|Removes the replication relationship between the source and replica.|
|*mysql.az_replication_skip_counter*|N/A|N/A|Skips one replication error.|

To set up Data-in Replication between a source and a replica in Azure Database for MariaDB, refer to [how to configure Data-in Replication](howto-data-in-replication.md).

## Other stored procedures

The following stored procedures are available in Azure Database for MariaDB to manage your server.

|**Stored Procedure Name**|**Input Parameters**|**Output Parameters**|**Usage Note**|
|-----|-----|-----|-----|
|*mysql.az_kill*|processlist_id|N/A|Equivalent to [`KILL CONNECTION`](https://dev.mysql.com/doc/refman/8.0/en/kill.html) command. Will terminate the connection associated with the provided processlist_id after terminating any statement the connection is executing.|
|*mysql.az_kill_query*|processlist_id|N/A|Equivalent to [`KILL QUERY`](https://dev.mysql.com/doc/refman/8.0/en/kill.html) command. Will terminate the statement the connection is currently executing. Leaves the connection itself alive.|
|*mysql.az_load_timezone*|N/A|N/A|Loads time zone tables to allow the `time_zone` parameter to be set to named values (ex. "US/Pacific").|

## Next steps

- Learn how to set up [Data-in Replication](howto-data-in-replication.md)
- Learn how to use the [time zone tables](howto-server-parameters.md#working-with-the-time-zone-parameter)
