---
title: Configure the service parameters in Azure Database for MariaDB
description: This article describes how to configure the service parameters in Azure Database for MariaDB using the Azure CLI command line utility.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.devlang: azurecli
ms.topic: conceptual
ms.date: 11/09/2018
---
# Customize server configuration parameters by using Azure CLI
You can list, show, and update configuration parameters for an Azure Database for MariaDB server by using Azure CLI, the Azure command-line utility. A subset of engine configurations is exposed at the server-level and can be modified.

## Prerequisites
To step through this how-to guide, you need:
- [An Azure Database for MariaDB server](quickstart-create-mariadb-server-database-using-azure-cli.md)
- [Azure CLI](/cli/azure/install-azure-cli) command-line utility or use the Azure Cloud Shell in the browser.

## List server configuration parameters for Azure Database for MariaDB server
To list all modifiable parameters in a server and their values, run the [az mariadb server configuration list](/cli/azure/mariadb/server/configuration#az-mariadb-server-configuration-list) command.

You can list the server configuration parameters for the server **mydemoserver.mariadb.database.azure.com** under resource group **myresourcegroup**.
```azurecli-interactive
az mariadb server configuration list --resource-group myresourcegroup --server mydemoserver
```

For the definition of each of the listed parameters, see the MariaDB reference section on [Server System Variables](https://mariadb.com/kb/en/library/server-system-variables/).

## Show server configuration parameter details
To show details about a particular configuration parameter for a server, run the [az mariadb server configuration show](/cli/azure/mariadb/server/configuration#az-mariadb-server-configuration-show) command.

This example shows details of the **slow\_query\_log** server configuration parameter for server **mydemoserver.mariadb.database.azure.com** under resource group **myresourcegroup.**
```azurecli-interactive
az mariadb server configuration show --name slow_query_log --resource-group myresourcegroup --server mydemoserver
```

## Modify a server configuration parameter value
You can also modify the value of a certain server configuration parameter, which updates the underlying configuration value for the MariaDB server engine. To update the configuration, use the [az mariadb server configuration set](/cli/azure/mariadb/server/configuration#az-mariadb-server-configuration-set) command. 

To update the **slow\_query\_log** server configuration parameter of server **mydemoserver.mariadb.database.azure.com** under resource group **myresourcegroup.**
```azurecli-interactive
az mariadb server configuration set --name slow_query_log --resource-group myresourcegroup --server mydemoserver --value ON
```

If you want to reset the value of a configuration parameter, omit the optional `--value` parameter, and the service applies the default value. For the example above, it would look like:
```azurecli-interactive
az mariadb server configuration set --name slow_query_log --resource-group myresourcegroup --server mydemoserver
```

This code resets the **slow\_query\_log** configuration to the default value **OFF**. 

## Working with the time zone parameter

### Populating the time zone tables

The time zone tables on your server can be populated by calling the `az_load_timezone` stored procedure from a tool like the MariaDB command line or MariaDB Workbench.

> [!NOTE]
> If you are running the `az_load_timezone` command from MariaDB Workbench, you may need to turn off safe update mode first using `SET SQL_SAFE_UPDATES=0;`.

```sql
CALL mysql.az_load_timezone();
```

To view available time zone values, run the following command:

```sql
SELECT name FROM mysql.time_zone_name;
```

### Setting the global level time zone

The global level time zone can be set using the [az mariadb server configuration set](/cli/azure/mariadb/server/configuration#az-mariadb-server-configuration-set) command.

The following command updates the **time\_zone** server configuration parameter of server **mydemoserver.mariadb.database.azure.com** under resource group **myresourcegroup** to **US/Pacific**.

```azurecli-interactive
az mariadb server configuration set --name time_zone --resource-group myresourcegroup --server mydemoserver --value "US/Pacific"
```

### Setting the session level time zone

The session level time zone can be set by running the `SET time_zone` command from a tool like the MariaDB command line or MariaDB Workbench. The example below sets the time zone to the **US/Pacific** time zone.  

```sql
SET time_zone = 'US/Pacific';
```

Refer to the MariaDB documentation for [Date and Time Functions](https://mariadb.com/kb/en/library/date-time-functions/).

## Next steps

- How to configure [server parameters in Azure portal](howto-server-parameters.md)
