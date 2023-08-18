---
title: Configure parameters - Azure Database for PostgreSQL - Flexible Server
description: This article describes how to configure Postgres parameters in Azure Database for PostgreSQL - Flexible Server using the Azure CLI.
ms.author: sunila
author: sunilagarwal
ms.service: postgresql
ms.subservice: flexible-server
ms.devlang: azurecli
ms.topic: how-to
ms.date: 8/14/2023
ms.custom: devx-track-azurecli
---

# Customize server parameters for Azure Database for PostgreSQL - Flexible Server using Azure CLI

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

You can list, show, and update configuration parameters for an Azure PostgreSQL server using the Command Line Interface (Azure CLI). A subset of engine parameters is exposed at server-level and can be modified. 

## Prerequisites

To step through this how-to guide, you need:
- Create an Azure Database for PostgreSQL server and database by following [Create an Azure Database for PostgreSQL](quickstart-create-server-cli.md)
- Install [Azure CLI](/cli/azure/install-azure-cli) command-line interface on your machine or use the [Azure Cloud Shell](../../cloud-shell/overview.md) in the Azure portal using your browser.

## List server parameters for a flexible server

To list all modifiable parameters in a server and their values, run the [az postgres flexible-server parameter list](/cli/azure/postgres/flexible-server/parameter) command.

You can list the server parameters for the server **mydemoserver.postgres.database.azure.com** under resource group **myresourcegroup**.

```azurecli-interactive
az postgres flexible-server parameter list --resource-group myresourcegroup --server-name mydemoserver
```

## Show server parameter details

To show details about a particular parameter for a server, run the [az postgres flexible-server parameter show](/cli/azure/postgres/flexible-server/parameter)  command.

This example shows details of the **log\_min\_messages** server parameter for server **mydemoserver.postgres.database.azure.com** under resource group **myresourcegroup.**

```azurecli-interactive
az postgres flexible-server parameter show --name log_min_messages --resource-group myresourcegroup --server-name mydemoserver
```

## Modify server parameter value

You can also modify the value of a certain server parameter, which updates the underlying configuration value for the PostgreSQL server engine. To update the parameter, use the [az postgres flexible-server parameter set](/cli/azure/postgres/flexible-server/parameter) command. 

To update the **log\_min\_messages** server parameter of server **mydemoserver.postgres.database.azure.com** under resource group **myresourcegroup.**

```azurecli-interactive
az postgres flexible-server parameter set --name log_min_messages --value INFO --resource-group myresourcegroup --server-name mydemoserver
```

If you want to reset the value of a parameter, you simply choose to leave out the optional `--value` parameter, and the service applies the default value. In above example, it would look like:

```azurecli-interactive
az postgres flexible-server parameter set --name log_min_messages --resource-group myresourcegroup --server-name mydemoserver
```

This command resets the **log\_min\_messages** parameter to the default value **WARNING**. For more information on server parameters and permissible values, see PostgreSQL documentation on [Setting Parameters](https://www.postgresql.org/docs/current/config-setting.html).

## Next steps

- To configure and access server logs, see [Server Logs in Azure Database for PostgreSQL](concepts-logging.md)
