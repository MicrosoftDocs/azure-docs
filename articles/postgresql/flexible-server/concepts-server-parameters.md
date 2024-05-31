---
title: Server parameters in Azure Database for PostgreSQL - Flexible Server
description: Learn about the server parameters in Azure Database for PostgreSQL - Flexible Server.
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/16/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Server parameters in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL provides a subset of configurable parameters for each server. For more information on
Postgres parameters, see the [PostgreSQL documentation](https://www.postgresql.org/docs/current/runtime-config.html).

## Parameter types

Azure Database for PostgreSQL - Flexible Server comes preconfigured with optimal default settings for each parameter. Parameters are categorized into one of the following types:

* **Static**: These parameters require a server restart to implement any changes.
* **Dynamic**: These parameters can be altered without the need to restart the server instance. However, changes will apply only to new connections established after the modification.
* **Read-only**: These parameters aren't user configurable because of their critical role in maintaining reliability, security, or other operational aspects of the service.

To determine the parameter type, go to the Azure portal and open the **Server parameters** pane. The parameters are grouped into tabs for easy identification.

## Parameter customization

Various methods and levels are available to customize your parameters according to your specific needs.

### Global level

For altering settings globally at the instance or server level, go to the **Server parameters** pane in the Azure portal. You can also use other available tools such as the Azure CLI, the REST API, Azure Resource Manager templates, or partner tools.

> [!NOTE]
> Because Azure Database for PostgreSQL is a managed database service, users don't have host or operating system access to view or modify configuration files such as *postgresql.conf*. The content of the files is automatically updated based on parameter changes that you make.

:::image type="content" source="./media/concepts-server-parameters/server-parameters-portal.png" alt-text="Screenshot of the pane for server parameters in the Azure portal.":::

### Granular levels

You can adjust parameters at more granular levels. These adjustments override globally set values. Their scope and duration depend on the level at which you make them:

* **Database level**: Use the `ALTER DATABASE` command for database-specific configurations.
* **Role or user level**: Use the `ALTER USER` command for user-centric settings.
* **Function, procedure level**: When you're defining a function or procedure, you can specify or alter the configuration parameters that will be set when the function is called.
* **Table level**: As an example, you can modify parameters related to autovacuum at this level.
* **Session level**: For the duration of an individual database session, you can adjust specific parameters. PostgreSQL facilitates this adjustment with the following SQL commands:

  * Use the `SET` command to make session-specific adjustments. These changes serve as the default settings during the current session. Access to these changes might require specific `SET` privileges, and the limitations for modifiable and read-only parameters described earlier don't apply. The corresponding SQL function is `set_config(setting_name, new_value, is_local)`.
  * Use the `SHOW` command to examine existing parameter settings. Its SQL function equivalent is `current_setting(setting_name text)`.

## Supported server parameters

[!INCLUDE [server-parameters-table](./includes/server-parameters-table.md)]

## Next steps

For information on supported PostgreSQL extensions, see [PostgreSQL extensions in Azure Database for PostgreSQL - Flexible Server](concepts-extensions.md).
