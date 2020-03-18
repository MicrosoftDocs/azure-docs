---
title: Configure parameters - Azure Database for PostgreSQL - Single Server
description: This article describes how to configure Postgres parameters in Azure Database for PostgreSQL - Single Server using the Azure CLI.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.devlang: azurecli
ms.topic: conceptual
ms.date: 06/19/2019
---
# Customize server configuration parameters for Azure Database for PostgreSQL - Single Server using Azure CLI
You can list, show, and update configuration parameters for an Azure PostgreSQL server using the Command Line Interface (Azure CLI). A subset of engine configurations is exposed at server-level and can be modified. 

## Prerequisites
To step through this how-to guide, you need:
- Create an Azure Database for PostgreSQL server and database by following [Create an Azure Database for PostgreSQL](quickstart-create-server-database-azure-cli.md)
- Install [Azure CLI](/cli/azure/install-azure-cli) command-line interface on your machine or use the [Azure Cloud Shell](../cloud-shell/overview.md) in the Azure portal using your browser.

## List server configuration parameters for Azure Database for PostgreSQL server
To list all modifiable parameters in a server and their values, run the [az postgres server configuration list](/cli/azure/postgres/server/configuration) command.

You can list the server configuration parameters for the server **mydemoserver.postgres.database.azure.com** under resource group **myresourcegroup**.
```azurecli-interactive
az postgres server configuration list --resource-group myresourcegroup --server mydemoserver
```
## Show server configuration parameter details
To show details about a particular configuration parameter for a server, run the [az postgres server configuration show](/cli/azure/postgres/server/configuration)  command.

This example shows details of the **log\_min\_messages** server configuration parameter for server **mydemoserver.postgres.database.azure.com** under resource group **myresourcegroup.**
```azurecli-interactive
az postgres server configuration show --name log_min_messages --resource-group myresourcegroup --server mydemoserver
```
## Modify server configuration parameter value
You can also modify the value of a certain server configuration parameter, which updates the underlying configuration value for the PostgreSQL server engine. To update the configuration, use the [az postgres server configuration set](/cli/azure/postgres/server/configuration) command. 

To update the **log\_min\_messages** server configuration parameter of server **mydemoserver.postgres.database.azure.com** under resource group **myresourcegroup.**
```azurecli-interactive
az postgres server configuration set --name log_min_messages --resource-group myresourcegroup --server mydemoserver --value INFO
```
If you want to reset the value of a configuration parameter, you simply choose to leave out the optional `--value` parameter, and the service applies the default value. In above example, it would look like:
```azurecli-interactive
az postgres server configuration set --name log_min_messages --resource-group myresourcegroup --server mydemoserver
```
This command resets the **log\_min\_messages** configuration to the default value **WARNING**. For more information on server configuration and permissible values, see PostgreSQL documentation on [Server Configuration](https://www.postgresql.org/docs/9.6/static/runtime-config.html).

## Next steps
- [Learn how to restart a server](howto-restart-server-cli.md)
- To configure and access server logs, see [Server Logs in Azure Database for PostgreSQL](concepts-server-logs.md)
