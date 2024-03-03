---
title: Restart/stop/start - Azure portal
description: This article describes how to use restart/stop/start operations for Azure Database for MySQL - Flexible Server through the Azure CLI.
ms.service: mysql
ms.subservice: flexible-server
ms.custom: devx-track-azurecli
ms.topic: how-to
author: code-sidd 
ms.author: sisawant
ms.date: 03/30/2021
---

# Restart/stop/start an Azure Database for MySQL - Flexible Server instance

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article shows you how to perform restart, start and stop an Azure Database for MySQL flexible server instance by using Azure CLI.

## Prerequisites

- An Azure account with an active subscription. 

    [!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]
- Install or upgrade Azure CLI to the latest version. See [Install Azure CLI](/cli/azure/install-azure-cli).
-  Login to Azure account using [az login](/cli/azure/reference-index#az-login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

    ```azurecli-interactive
    az login
    ````

- If you have multiple subscriptions, choose the appropriate subscription in which you want to create the server using the `az account set` command.
`
    ```azurecli
    az account set --subscription <subscription id>
    ```

- Create an Azure Database for MySQL flexible server instance if you haven't already created one by using the `az mysql flexible-server create` command.

    ```azurecli
    az mysql flexible-server create --resource-group myresourcegroup --name myservername
    ```

## Stop a running server
To stop a server, run the `az mysql flexible-server stop` command. If you use [local context](/cli/azure/config/param-persist), you don't need to provide any arguments.

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
To start a server, run the `az mysql flexible-server start` command. If you use [local context](/cli/azure/config/param-persist), you don't need to provide any arguments.

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
>Once the server has restarted successfully, all management operations are now available for the Azure Database for MySQL flexible server instance.

## Restart a server
To restart a server, run the `az mysql flexible-server restart` command. If you use [local context](/cli/azure/config/param-persist), you don't need to provide any arguments.

>[!Note]
>If the user restarting the server is part of [custom role](../../role-based-access-control/custom-roles.md) the user should have write privilege on the server.

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
>Once the server has restarted successfully, all management operations are now available for the Azure Database for MySQL flexible server instance.

## Next steps
- Learn more about [networking in Azure Database for MySQL flexible server](./concepts-networking.md)
- [Create and manage an Azure Database for MySQL flexible server virtual network using Azure portal](./how-to-manage-virtual-network-portal.md).
