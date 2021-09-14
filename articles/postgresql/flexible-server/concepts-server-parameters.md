---
title: Server parameters - Azure Database for PostgreSQL - Flexible Server
description: Describes the server parameters in Azure Database for PostgreSQL - Flexible Server
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 06/04/2021
---

# Server parameters in Azure Database for PostgreSQL - Flexible Server

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is in preview

Azure Database for PostgreSQL provides a subset of configurable parameters for each server. For more information on Postgres parameters, see the [PostgreSQL documentation](https://www.postgresql.org/docs/13/config-setting.html).

## An overview of PostgreSQL parameters 

Azure Database for PostgreSQL server is pre-configured with optimal default values for each parameter on creation. Static parameters require a server restart and parameters that require superuser access cannot be configured by the user. 

In order to review which parameters are available to view or to modify, we recommend going into the Azure portal, and to the Server Parameters page. You can also configure parameters on a per-user or per-database basis using `ALTER DATABASE` or `ALTER ROLE` commands.

>[!NOTE]
> Since Azure Database for PostgreSQL is a managed database service, users are not provided host or OS access to view or modify configuration files such as `postgresql.conf`. The content of the file is automatically updated based on parameter changes in the Server Parameters page.

:::image type="content" source="./media/concepts-server-parameters/server-parameters.png" alt-text="Server parameters - portal":::

Here is the list of some of the parameters:

| Parameter Name             | Description |
|----------------------|--------|
| **max_connections** | You can tune max_connections on Postgres Flexible Server, where it can be set to 5,000 connections. Please see the [limits documentation](concepts-limits.md) for more details. | 
| **shared_buffers**    | The 'shared_buffers' setting changes depending on the selected SKU (SKU determines the memory available). General Purpose servers have 2GB shared_buffers for 2 vCores; Memory Optimized servers have 4GB shared_buffers for 2 vCores. The shared_buffers setting scales linearly (approximately) as vCores increase in a tier. | 
| **shared_preload_libraries** | This parameter is available for configuration with a predefined set of supported extensions. Note that we always load the `azure` extension (used for maintenance tasks), as well as the `pg_stat_statements` extension (you can use the pg_stat_statements.track parameter to control whether the extension is active). |
| **connection_throttling** | You can enable or disable temporary connection throttling per IP for too many invalid password login failures. |
 
## Next steps

For information on supported PostgreSQL extensions, see [the extensions document](concepts-extensions.md).
