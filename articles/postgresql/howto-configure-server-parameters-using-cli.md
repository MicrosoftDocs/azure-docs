---
title: postgresql-howto-configure-server-parameters-using-cli | Microsoft Docs
description: Describes how to configures PostgreSQL service paramters.
keywords: azure cloud postgresql postgres
services: postgresql
author:
ms.author:
manager: jhubbard
editor: jasonh

ms.assetid:
ms.service: postgresql - database
ms.tgt_pltfrm: portal
ms.topic: hero - article
ms.date: 04/30/2017
---
# Customize server configuration parameters using Azure CLI
You can list, show and update configuration parameters for an Azure PostgreSQL server using the Command Line Interface (Azure CLI). However, only a subset of engine configurations are exposed at server-level and can be modified. For more information, see [Server](server-logs/update.me) Configuration [Parameters](server-parameters/update.me).

# Before you begin

## Prerequisites
To step through this how-to guide, you need:
- An [Azure Database for PostgreSQL server](file:///D:/Orcas/Documentation/postgresql-server/update.me)
- [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) command line utility installed

## List server configuration parameters for Azure PostgreSQL server
To get a list of all modifiable parameters in an Azure PostgreSQL server and their values, run the following command. See [az postgres server configuration](config-cli/update.me) for usage details.
az postgres server configuration list --resource-group <resource group name> --server <server name>
For example, you can list the server configuration parameters for Azure PostgreSQL server **mypgserver.postgres.database.azure.com** under Resource Group **myresourcegroup. **
```azurecli
az postgres server configuration list --resource-group
**myresourcegroup** --server **mypgserver**
```

## Show server configuration parameter details
To show details about a particular configuration parameter for an Azure PostgreSQL server, run the following command. See [az postgres server configuration](config-cli/update.me) for details.
```azurecli
az postgres server configuration show --name <configuration name>
--resource-group <resource group name> --server <server
name>
```
For example, you can show details of the **log\_min\_messages** server configuration parameter for Azure PostgreSQL server **mypgserver.postgres.database.azure.com** under Resource Group **myresourcegroup. **
```azurecli
az postgres server configuration show --name log\_min\_messages
--resource-group **myresourcegroup** --server **mypgserver**
```
## Modify server configuration parameter value
You can modify the value of certain configuration parameters of an Azure PostgreSQL server, and this updates the underlying configuration value for the PostgreSQL server engine. To update the configuration value run the following command. See [az postgres server configuration](config-cli/update.me) for details.
```azurecli
az postgres server configuration update --name <configuration
name> --resource-group <resource group name> --server
<server name> \[--value\]
```
For example, you can update the **log\_min\_messages** server configuration parameter of Azure PostgreSQL server **mypgserver.postgres.database.azure.com** under Resource Group **myresourcegroup. **
```azurecli
az postgres server configuration show --name log\_min\_messages
--resource-group **myresourcegroup** --server **mypgserver** --value
INFO
```
If you want to reset the value of a configuration parameter, you simply choose to leave out the optional --value parameter, and the service will apply the default value. In above example, it would look like:
```azurecli
az postgres server configuration show --name log\_min\_messages
--resource-group **myresourcegroup** --server **mypgserver**
```
This will reset the log\_min\_messages configuration to the default value WARNING. For further details on server configuration and permissible values, see PostgreSQL documentation on [Server Configuration](https://www.postgresql.org/docs/9.6/static/runtime-config.html).

## Next steps
- For more information on server parameters, see [Customizing server configuration parameters](parameters/update.me).
- To configure and access server logs, see [Configure and Access Server logs](server-logs-cli/update.me) using Azure CLI.
- To configure monitoring and metrics, see [Configure Monitoring and Alerting](monitoring/update.me) using Azure CLI.

