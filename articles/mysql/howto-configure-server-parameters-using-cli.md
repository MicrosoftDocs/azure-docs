---
title: Configure the service parameters in Azure Database for MySQL | Microsoft Docs
description: This article describes how to configure the service parameters in Azure Database for MySQL using the Azure CLI command line utility.
services: mysql
author: rachel-msft
ms.author: raagyema
manager: jhubbard
editor: jasonwhowell
ms.service: mysql-database
ms.devlang: azure-cli
ms.topic: article
ms.date: 10/12/2017
---
# Customize server configuration parameters by using Azure CLI
You can list, show, and update configuration parameters for an Azure Database for MySQL server by using Azure CLI, the Azure command-line utility. A subset of engine configurations is exposed at the server-level and can be modified. 

## Prerequisites
To step through this how-to guide, you need:
- [An Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-cli.md)
- [Azure CLI 2.0](/cli/azure/install-azure-cli) command-line utility or use the Azure Cloud Shell in the browser.

## List server configuration parameters for Azure Database for MySQL server
To list all modifiable parameters in a server and their values, run the [az mysql server configuration list](/cli/azure/mysql/server/configuration#list) command.

You can list the server configuration parameters for the server **myserver4demo.mysql.database.azure.com** under resource group **myresourcegroup**.
```azurecli-interactive
az mysql server configuration list --resource-group myresourcegroup --server myserver4demo
```
For the definition of each of the listed parameters, see the MySQL reference section on [Server System Variables](https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html).

## Show server configuration parameter details
To show details about a particular configuration parameter for a server, run the [az mysql server configuration show](/cli/azure/mysql/server/configuration#show) command.

This example shows details of the **slow\_query\_log** server configuration parameter for server **myserver4demo.mysql.database.azure.com** under resource group **myresourcegroup.**
```azurecli-interactive
az mysql server configuration show --name slow_query_log --resource-group myresourcegroup --server myserver4demo
```
## Modify a server configuration parameter value
You can also modify the value of a certain server configuration parameter, which updates the underlying configuration value for the MySQL server engine. To update the configuration, use the [az mysql server configuration set](/cli/azure/mysql/server/configuration#set) command. 

To update the **slow\_query\_log** server configuration parameter of server **myserver4demo.mysql.database.azure.com** under resource group **myresourcegroup.**
```azurecli-interactive
az mysql server configuration set --name slow_query_log --resource-group myresourcegroup --server myserver4demo --value ON
```
If you want to reset the value of a configuration parameter, omit the optional `--value` parameter, and the service applies the default value. For the example above, it would look like:
```azurecli-interactive
az mysql server configuration set --name slow_query_log --resource-group myresourcegroup --server myserver4demo
```
This code resets the **slow\_query\_log** configuration to the default value **OFF**. 

## Next steps
- How to configure [server parameters in Azure portal](howto-server-parameters.md)
