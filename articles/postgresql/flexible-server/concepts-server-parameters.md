---
title: Server parameters - Azure Database for PostgreSQL - Flexible Server
description: Describes the server parameters in Azure Database for PostgreSQL - Flexible Server
ms.author: srranga
author: sr-msft
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 11/30/2021
---

# Server parameters in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL provides a subset of configurable parameters for each server. For more information on Postgres parameters, see the [PostgreSQL documentation](https://www.postgresql.org/docs/13/config-setting.html).

## An overview of PostgreSQL parameters 

Azure Database for PostgreSQL server is pre-configured with optimal default values for each parameter on creation. Static parameters require a server restart and parameters that require superuser access can't be configured by the user. 

In order to review which parameters are available to view or to modify, we recommend going into the Azure portal, and to the Server Parameters page. You can also configure parameters on a per-user or per-database basis using `ALTER DATABASE` or `ALTER ROLE` commands.

>[!NOTE]
> Since Azure Database for PostgreSQL is a managed database service, users are not provided host or OS access to view or modify configuration files such as `postgresql.conf`. The content of the file is automatically updated based on parameter changes in the Server Parameters page.

:::image type="content" source="./media/concepts-server-parameters/server-parameters.png" alt-text="Server parameters - portal":::

Here's the list of some of the parameters:


   | Parameter Name             | Description |
|----------------------|--------|
| **max_connections** | You can tune max_connections on Postgres Flexible Server, where it can be set to 5,000 connections. See the [limits documentation](concepts-limits.md) for more details. | 
| **shared_buffers**    | The 'shared_buffers' setting changes depending on the selected SKU (SKU determines the memory available). General Purpose servers have 2 GB shared_buffers for 2 vCores; Memory Optimized servers have 4 GB shared_buffers for 2 vCores. The shared_buffers setting scales linearly (approximately) as vCores increase in a tier. | 
| **shared_preload_libraries** | This parameter is available for configuration with a predefined set of supported extensions. We always load the `azure` extension (used for maintenance tasks), and the `pg_stat_statements` extension (you can use the pg_stat_statements.track parameter to control whether the extension is active). |
| **connection_throttling** | You can enable or disable temporary connection throttling per IP for too many invalid password login failures. |
 | **work_mem** | This parameter specifies the amount of memory to be used by internal sort operations and hash tables before writing to temporary disk files. If your workload has few queries with many complex sorting and you have a lot of available memories, increasing this parameter may allow Postgres to do larger scans in-memory vs. spilling to disk, which will be faster.  Be careful however, as one complex query may have number of sort, hash operations running concurrently. Each one of those operations will use as much memory as it value allows before it starts writing to disk based temporary files. Therefore on a relatively busy system total memory usage will be many times of individual work_mem parameter. If you do decide to tune this value globally, you can use formula Total RAM * 0.25 / max_connections as initial value. Azure Database for PostgreSQL - Flexible Server supports range of 4096-2097152 kilobytes for this parameter.|
| **effective_cache_size** |The effective_cache_size parameter estimates how much memory is available for disk caching by the operating system and within the database itself. The PostgreSQL query planner decides whether it’s fixed in RAM or not. Index scans are most likely to be used against higher values; otherwise, sequential scans will be used if the value is low. Recommendations are to set Effective_cache_size at 50% of the machine’s total RAM. |
| **maintenance_work_mem** | The maintenance_work_mem parameter basically provides the maximum amount of memory to be used by maintenance operations like vacuum, create index, and alter table add foreign key operations.  Default value for that parameter is 64 KB. It’s recommended to set this value higher than work_mem; this can improve performance for vacuuming. |
| **effective_io_concurrency** | Sets the number of concurrent disk I/O operations that PostgreSQL expects can be executed simultaneously. Raising this value will increase the number of I/O operations that any individual PostgreSQL session attempts to initiate in parallel. The allowed range is 1 to 1000, or zero to disable issuance of asynchronous I/O requests. Currently, this setting only affects bitmap heap scans.. |
 |**require_secure_transport** | If your application doesn't support SSL connectivity to the server, you can optionally disable secured transport from your client by turning `OFF` this parameter value. |
 |**log_connections** | This parameter may be read-only, as on Azure Database for PostgreSQL - Flexible Server all connections are logged and intercepted to make sure connections are coming in from right sources for security reasons. |

>[!NOTE]
> As you scale Azure Database for PostgreSQL - Flexible Server SKUs up or down, affecting available memory to the server, you may wish to tune your memory global parameters, such as work_mem or effective_cache_size accordingly based on information above. 

 
## Next steps

For information on supported PostgreSQL extensions, see [the extensions document](concepts-extensions.md).
