---
title: Restart - Azure portal - Azure Database for PostgreSQL Flexible Server
description: This article describes how to restart operations in Azure Database for PostgreSQL through the Azure CLI.
ms.service: postgresql
ms.subservice: flexible-server
ms.custom: devx-track-azurecli
ms.author: sunila
author: sunilagarwal
ms.reviewer: ""
ms.topic: how-to
ms.date: 11/30/2021
---

# Restart an Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article shows you how to perform restart, start and stop flexible server using Azure CLI.

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
- Install or upgrade Azure CLI to the latest version. See [Install Azure CLI](/cli/azure/install-azure-cli).
-  Login to Azure account using [az login](/cli/azure/reference-index#az-login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

    ```azurecli-interactive
    az login
    ````

- If you have multiple subscriptions, choose the appropriate subscription in which you want to create the server using the ```az account set``` command.
`
    ```azurecli
    az account set --subscription <subscription id>
    ```

- Create a PostgreSQL Flexible Server if you have not already created one using the ```az postgres flexible-server create``` command.

    ```azurecli
    az postgres flexible-server create --resource-group myresourcegroup --name myservername
    ```

## Restart a server
To restart a server, run  ```az postgres flexible-server restart``` command. If you are using [local context](/cli/azure/config/param-persist), you don't need to provide any arguments.

**Usage:**
```azurecli
az postgres flexible-server restart [--name]
                                 [--resource-group]
                                 [--subscription]
```

**Example without local context:**
```azurecli
az postgres flexible-server restart  --resource-group --name myservername
```

**Example with local context:**
```azurecli
az postgres flexible-server restart
```

> [!IMPORTANT]
> Once the server has restarted successfully, all management operations are now available for the flexible server.

## Next steps
- Learn more about [stopping and starting Azure Database for PostgreSQL Flexible Server](./how-to-stop-start-server-cli.md)
