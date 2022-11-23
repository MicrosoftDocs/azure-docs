---
title: Manage high availability - Azure CLI - Azure Database for PostgreSQL Flexible Server
description: This article describes how to configure high availability in Azure Database for PostgreSQL flexible Server with the Azure CLI.
ms.service: postgresql
ms.subservice: flexible-server
ms.author: sunila
author: sunilagarwal
ms.reviewer: ""
ms.topic: how-to
ms.date: 6/16/2022
ms.custom: references_regions, devx-track-azurecli
---

# Manage high availability in Azure Database for PostgreSQL Flexible Server with Azure CLI

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

The article describes how you can enable or disable high availability configuration at the time of server creation in your flexible server. You can disable high availability after server creation too. 

High availability feature provisions physically separate primary and standby replica in different zones. For more information, see [high availability concepts documentation](./concepts/../concepts-high-availability.md). Enabling or disabling high availability doesn't change your other settings including VNET configuration, firewall settings, and backup retention. Disabling of high availability doesn't impact your application connectivity and operations.

> [!IMPORTANT]
> For the list of regions that support Zone redundant high availability, please review the supported regions [here](./overview.md#azure-regions). 

## Prerequisites
- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
- Install or upgrade Azure CLI to the latest version. See [Install Azure CLI](/cli/azure/install-azure-cli).
-  Log in to Azure account using [az login](/cli/azure/reference-index#az-login) command. The **id** property, which refers to **Subscription ID** for your Azure account.

    ```azurecli-interactive
    az login
    ````

- If you have multiple subscriptions, choose the appropriate subscription in which you want to create the server using the ```az account set``` command.
`
    ```azurecli
    az account set --subscription <subscription id>
    ```

## Enable high availability during server creation
You can only create server using  General purpose or Memory optimized pricing tiers with high availability. You can enable high availability for a server only during create time.

**Usage:**

```azurecli
az postgres flexible-server create [--high-availability {Disabled, Enabled}]
                                [--resource-group]
                                [--name]
```

**Example:**
```azurecli
az postgres flexible-server create --name myservername --sku-name Standard-D2ds_v4 --resource-group myresourcegroup --high-availability Enabled
```

## Disable high availability

You can disable high availability by using the [az postgres flexible-server update](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-update) command. Disabling high availability is only supported if the server is configured with high availability. 

```azurecli
az postgres flexible-server update [--high-availability {Disabled, Enabled}]
                                [--resource-group]
                                [--name]
```

**Example:**
```azurecli
az postgres flexible-server update --resource-group myresourcegroup --name myservername --high-availability Disabled
```


## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn about [zone redundant high availability](./concepts-high-availability.md)