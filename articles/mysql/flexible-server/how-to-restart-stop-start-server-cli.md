---
title: Restart/Stop/start - Azure portal - Azure Database for MySQL Flexible Server
description: This article describes how to restart/stop/start operations in Azure Database for MySQL through the Azure CLI.
author: mksuni
ms.author: sumuth
ms.service: mysql
ms.topic: how-to
ms.date: 03/30/2021
---

# Restart/Stop/Start an Azure Database for MySQL - Flexible Server (Preview)

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

> [!IMPORTANT]
> Azure Database for MySQL - Flexible Server is currently in public preview.

This article shows you how to perform restart, start and stop flexible server using Azure CLI.

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
- Install or upgrade Azure CLI to the latest version. See [Install Azure CLI](/cli/azure/install-azure-cli).
-  Login to Azure account using [az login](/cli/azure/reference-index#az_login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

    ```azurecli-interactive
    az login
    ````

- If you have multiple subscriptions, choose the appropriate subscription in which you want to create the server using the ```az account set``` command.
`
    ```azurecli
    az account set --subscription <subscription id>
    ```

- Create a MySQL Flexible Server if you have not already created one using the ```az mysql flexible-server create``` command.

    ```azurecli
    az mysql flexible-server create --resource-group myresourcegroup --name myservername
    ```

## Stop a running server
To stop a server, run  ```az mysql flexible-server stop``` command. If you are using [local context](/cli/azure/config/param-persist), you don't need to provide any arguments.

**Usage:**
```azurecli
az mysql flexible-server stop  [--name]
                               [--resource-group]
                               [--subscription]
```

**Example without local context:**
```azurecli
az mysql flexible-server stop  --resource-group --name myservername
```

**Example with local context:**
```azurecli
az mysql flexible-server stop
```

## Start a stopped server
To start a server, run  ```az mysql flexible-server start``` command. If you are using [local context](/cli/azure/config/param-persist), you don't need to provide any arguments.

**Usage:**
```azurecli
az mysql flexible-server start [--name]
                               [--resource-group]
                               [--subscription]
```

**Example without local context:**
```azurecli
az mysql flexible-server start  --resource-group --name myservername
```

**Example with local context:**
```azurecli
az mysql flexible-server start
```

> [!IMPORTANT]
>Once the server has restarted successfully, all management operations are now available for the flexible server.

## Restart a server
To restart a server, run  ```az mysql flexible-server restart``` command. If you are using [local context](/cli/azure/config/param-persist), you don't need to provide any arguments.

**Usage:**
```azurecli
az mysql flexible-server restart [--name]
                                 [--resource-group]
                                 [--subscription]
```

**Example without local context:**
```azurecli
az mysql flexible-server restart  --resource-group --name myservername
```

**Example with local context:**
```azurecli
az mysql flexible-server restart
```


> [!IMPORTANT]
>Once the server has restarted successfully, all management operations are now available for the flexible server.

## Next steps
- Learn more about [networking in Azure Database for MySQL Flexible Server](./concepts-networking.md)
- [Create and manage Azure Database for MySQL Flexible Server virtual network using Azure portal](./how-to-manage-virtual-network-portal.md).

