---
title: Configure the service parameters in Azure Database for PostgreSQL | Microsoft Docs
description: This article describes how to configure the service parameters in Azure Database for PostgreSQL using the Azure CLI command line.
services: postgresql
author: SaloniSonpal
ms.author: salonis
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql-database
ms.devlang: azure-cli
ms.topic: article
ms.date: 06/13/2017
---
# Customize server configuration parameters using Azure CLI
You can list, show and update configuration parameters for an Azure PostgreSQL server using the Command Line Interface (Azure CLI). However, only a subset of engine configurations are exposed at server-level and can be modified. 

## Prerequisites
To step through this how-to guide, you need:
- A server and database [Create an Azure Database for PostgreSQL](quickstart-create-server-database-azure-cli.md)
- Install [Azure CLI 2.0](/cli/azure/install-azure-cli) command line utility or use the Azure Cloud Shell in the browser.

## List server configuration parameters for Azure Database for PostgreSQL server
To list all modifiable parameters in a server and their values, run the [az postgres server configuration list](/cli/azure/postgres/server/configuration#list) command.

You can list the server configuration parameters for the server **mypgserver-20170401.postgres.database.azure.com** under resource group **myresourcegroup**.
```azurecli-interactive
az postgres server configuration list --resource-group myresourcegroup --server mypgserver-20170401
```
## Show server configuration parameter details
To show details about a particular configuration parameter for a server, run the [az postgres server configuration show](/cli/azure/postgres/server/configuration#show)  command.

This example shows details of the **log\_min\_messages** server configuration parameter for server **mypgserver-20170401.postgres.database.azure.com** under resource group **myresourcegroup.**
```azurecli-interactive
az postgres server configuration show --name log_min_messages --resource-group myresourcegroup --server mypgserver-20170401
```
## Modify server configuration parameter value
You can also modify the value of a certain server configuration parameter, and this updates the underlying configuration value for the PostgreSQL server engine. To update the configuration use the [az postgres server configuration set](/cli/azure/postgres/server/configuration#set) command. 

To update the **log\_min\_messages** server configuration parameter of server **mypgserver-20170401.postgres.database.azure.com** under resource group **myresourcegroup.**
```azurecli-interactive
az postgres server configuration set --name log_min_messages --resource-group myresourcegroup --server mypgserver-20170401 --value INFO
```
If you want to reset the value of a configuration parameter, you simply choose to leave out the optional `--value` parameter, and the service will apply the default value. In above example, it would look like:
```azurecli-interactive
az postgres server configuration set --name log_min_messages --resource-group myresourcegroup --server mypgserver-20170401
```
This will reset the **log\_min\_messages** configuration to the default value **WARNING**. For further details on server configuration and permissible values, see PostgreSQL documentation on [Server Configuration](https://www.postgresql.org/docs/9.6/static/runtime-config.html).

## Next steps
- To configure and access server logs, see [Server Logs in Azure Database for PostgreSQL](concepts-server-logs.md)
