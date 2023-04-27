---
title: Manage zone redundant high availability - Azure CLI - Azure Database for MySQL - Flexible Server
description: This article describes how to configure zone redundant high availability in Azure Database for MySQL - Flexible Server with the Azure CLI.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
author: VandhanaMehta
ms.author: vamehta
ms.custom: references_regions, devx-track-azurecli, event-tier1-build-2022
ms.date: 05/24/2022
---

# Manage zone redundant high availability in Azure Database for MySQL - Flexible Server with Azure CLI

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]


The article describes how you can enable or disable zone redundant high availability configuration at the time of server creation in your flexible server. You can disable zone redundant high availability after server creation too. Enabling zone redundant high availability after server creation is not supported.

High availability feature provisions physically separate primary and standby replica in different zones. For more information, see [high availability concepts documentation](./concepts/../concepts-high-availability.md). Enabling or disabling high availability does not change your other settings including VNET configuration, firewall settings, and backup retention. Disabling of high availability does not impact your application connectivity and operations.

> [!IMPORTANT]
> Zone redundant high availability is available in limited set of regions. Please review the supported regions [here](./overview.md#azure-regions).

## Prerequisites

- An Azure account with an active subscription. 

    [!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]
- Install or upgrade Azure CLI to the latest version. See [Install Azure CLI](/cli/azure/install-azure-cli).
- Login to Azure account using [az login](/cli/azure/reference-index#az-login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

    ```azurecli-interactive
    az login
    ````

- If you have multiple subscriptions, choose the appropriate subscription in which you want to create the server using the ```az account set``` command.

    ```azurecli
    az account set --subscription <subscription id>
    ```

## Enable high availability during server creation

You can only create server using  General purpose or Business Critical pricing tiers with high availability. You can enable Zone redundant high availability for a server only during create time.

**Usage:**

   ```azurecli
    az mysql flexible-server create [--high-availability {Disabled, SameZone, ZoneRedundant}]
                                    [--sku-name]
                                    [--tier]
                                    [--resource-group]
                                    [--location]
                                    [--name]
   ```

**Example:**

   ```azurecli
    az mysql flexible-server create --name myservername --sku-name Standard_D2ds_v4 --tier GeneralPurpose --resource-group myresourcegroup --high-availability ZoneRedundant --location eastus
   ```

## Disable high availability

You can disable high availability by using the [az mysql flexible-server update](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-update) command. Note that disabling high availability is only supported if the server was created with high availability.

```azurecli
az mysql flexible-server update [--high-availability {Disabled, SameZone, ZoneRedundant}]
                                [--resource-group]
                                [--name]
```
>[!Note]
>If you want to move from ZoneRedundant to SameZone you would have to first disable high availability and then enable same zone.

**Example:**

   ```azurecli
    az mysql flexible-server update --resource-group myresourcegroup --name myservername --high-availability Disabled
   ```

## Next steps

- Learn about [business continuity](./concepts-business-continuity.md)
- Learn about [zone redundant high availability](./concepts-high-availability.md)
