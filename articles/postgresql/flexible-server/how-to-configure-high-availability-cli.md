---
title: Manage zone redundant high availability - Azure CLI - Azure Database for PostgreSQL Flexible Server
description: This article describes how to configure zone redundant high availability in Azure Database for PostgreSQL flexible Server with the Azure CLI.
author: mksuni
ms.author: sumuth
ms.service: postgresql
ms.topic: how-to
ms.date: 05/29/2021
ms.custom: references_regions, devx-track-azurecli
---

# Manage zone redundant high availability in Azure Database for PostgreSQL Flexible Server with Azure CLI

> [!NOTE]
> Azure Database for PostgreSQL Flexible Server is in public preview. 

The article describes how you can enable or disable zone redundant high availability configuration at the time of server creation in your flexible server. You can disable zone redundant high availability after server creation too. Enabling zone redundant high availability after server creation is not supported.

High availability feature provisions physically separate primary and standby replica in different zones. For more information, see [high availability concepts documentation](./concepts/../concepts-high-availability.md). Enabling or disabling high availability does not change your other settings including VNET configuration, firewall settings, and backup retention. Disabling of high availability does not impact your application connectivity and operations.

> [!IMPORTANT]
> For the list of regions that support Zone redundant high availability, please review the supported regions [here](./overview.md#azure-regions). 

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

You can disable high availability by using the [az postgres flexible-server update](/cli/azure/postgres/flexible-server#az_postgres_flexible_server_update) command. Note that disabling high availability is only supported if the server is configured with high availability. 

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