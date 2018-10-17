---
title: Configure the service parameters in Azure Database for MySQL
description: This article describes how to configure the service parameters in Azure Database for MySQL using the Azure CLI command line utility.
services: mysql
author: ajlam
ms.author: andrela
manager: kfile
editor: jasonwhowell
ms.service: mysql
ms.devlang: azure-cli
ms.topic: article
ms.date: 07/18/2018
---
# Customize server configuration parameters by using Azure CLI
You can list, show, and update configuration parameters for an Azure Database for MySQL server by using Azure CLI, the Azure command-line utility. A subset of engine configurations is exposed at the server-level and can be modified. 

## Prerequisites
To step through this how-to guide, you need:
- [An Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-cli.md)
- [Azure CLI](/cli/azure/install-azure-cli) command-line utility or use the Azure Cloud Shell in the browser.

## List server configuration parameters for Azure Database for MySQL server
To list all modifiable parameters in a server and their values, run the [az mysql server configuration list](/cli/azure/mysql/server/configuration#az-mysql-server-configuration-list) command.

You can list the server configuration parameters for the server **mydemoserver.mysql.database.azure.com** under resource group **myresourcegroup**.
```azurecli-interactive
az mysql server configuration list --resource-group myresourcegroup --server mydemoserver
```
For the definition of each of the listed parameters, see the MySQL reference section on [Server System Variables](https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html).

## Show server configuration parameter details
To show details about a particular configuration parameter for a server, run the [az mysql server configuration show](/cli/azure/mysql/server/configuration#az-mysql-server-configuration-show) command.

This example shows details of the **slow\_query\_log** server configuration parameter for server **mydemoserver.mysql.database.azure.com** under resource group **myresourcegroup.**
```azurecli-interactive
az mysql server configuration show --name slow_query_log --resource-group myresourcegroup --server mydemoserver
```
## Modify a server configuration parameter value
You can also modify the value of a certain server configuration parameter, which updates the underlying configuration value for the MySQL server engine. To update the configuration, use the [az mysql server configuration set](/cli/azure/mysql/server/configuration#az-mysql-server-configuration-set) command. 

To update the **slow\_query\_log** server configuration parameter of server **mydemoserver.mysql.database.azure.com** under resource group **myresourcegroup.**
```azurecli-interactive
az mysql server configuration set --name slow_query_log --resource-group myresourcegroup --server mydemoserver --value ON
```
If you want to reset the value of a configuration parameter, omit the optional `--value` parameter, and the service applies the default value. For the example above, it would look like:
```azurecli-interactive
az mysql server configuration set --name slow_query_log --resource-group myresourcegroup --server mydemoserver
```
This code resets the **slow\_query\_log** configuration to the default value **OFF**. 

## Working with the time zone parameter

### Populating the time zone tables

The time zone tables on your server can be populated by calling the `az_load_timezone` stored procedure from a tool like the MySQL command line or MySQL Workbench.

> [!NOTE]
> If you are running the `az_load_timezone` command from MySQL Workbench, you may need to turn off safe update mode first using `SET SQL_SAFE_UPDATES=0;`.

```sql
CALL mysql.az_load_timezone();
```

To view available time zone values, run the following command:

```sql
SELECT name FROM mysql.time_zone_name;
```

### Setting the global level time zone

The global level time zone can be set using the [az mysql server configuration set](/cli/azure/mysql/server/configuration#az-mysql-server-configuration-set) command.

The following command updates the **time\_zone** server configuration parameter of server **mydemoserver.mysql.database.azure.com** under resource group **myresourcegroup** to **US/Pacific**.

```azurecli-interactive
az mysql server configuration set --name time_zone --resource-group myresourcegroup --server mydemoserver --value "US/Pacific"
```

### Setting the session level time zone

The session level time zone can be set by running the `SET time_zone` command from a tool like the MySQL command line or MySQL Workbench. The example below sets the time zone to the **US/Pacific** time zone.  

```sql
SET time_zone = 'US/Pacific';
```

Refer to the MySQL documentation for [Date and Time Functions](https://dev.mysql.com/doc/refman/5.7/en/date-and-time-functions.html#function_convert-tz).


## Next steps

- How to configure [server parameters in Azure portal](howto-server-parameters.md)