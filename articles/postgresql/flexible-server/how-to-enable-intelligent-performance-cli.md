---
title: Configure intelligent performance - Azure Database for PostgreSQL - Flexible Server
description: This article describes how to configure intelligent performance in Azure Database for PostgreSQL - Flexible Server using the Azure CLI.
ms.author: alkuchar
author: AwdotiaRomanowna
ms.service: postgresql
ms.subservice: flexible-server
ms.devlang: azurecli
ms.topic: how-to
ms.date: 06/02/2023
ms.custom: devx-track-azurecli
---

# Configure intelligent performance for Azure Database for PostgreSQL - Flexible Server using Azure CLI

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

You can list, show, and update intelligent performance configuration for an Azure PostgreSQL server using the Command Line Interface (Azure CLI). 

## Prerequisites
- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
- Install or upgrade Azure CLI to the latest version. See [Install Azure CLI](/cli/azure/install-azure-cli).
-  Log in to Azure account using [az login](/cli/azure/reference-index#az-login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

    ```azurecli-interactive
    az login
    ````

- If you have multiple subscriptions, choose the appropriate subscription in which you want to create the server using the ```az account set``` command.

    ```azurecli
    az account set --subscription <subscription id>
    ```

- Create a PostgreQL Flexible Server if you haven't already created one using the ```az postgres flexible-server create``` command.

    ```azurecli
    az postgres flexible-server create --resource-group myresourcegroup --name myservername
    ```

## Verify current settings

To verify current settings of intelligent performance feature, run the [az postgres flexible-server parameter show](/cli/azure/postgres/flexible-server/parameter#az-postgres-flexible-server-parameter-show) command.

You can check the server parameters for the server **mydemoserver.postgres.database.azure.com** under resource group **myresourcegroup**.

```azurecli-interactive
az postgres flexible-server parameter show --resource-group myresourcegroup --server-name mydemoserver --name intelligent_tuning.metric_targets --query value
```

## Enable intelligent tuning

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
