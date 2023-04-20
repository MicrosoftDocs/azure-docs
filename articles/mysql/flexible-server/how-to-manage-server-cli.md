---
title: Manage server - Azure CLI - Azure Database for MySQL - Flexible Server
description: Learn how to manage an Azure Database for MySQL - Flexible Server from the Azure CLI.
author: mksuni
ms.author: sumuth
ms.service: mysql
ms.subservice: flexible-server
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 9/21/2020
---

# Manage an Azure Database for MySQL - Flexible Server using the Azure CLI
[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article shows you how to manage your Flexible Server deployed in Azure. Management tasks include compute and storage scaling, admin password reset, and viewing server details.

## Prerequisites

[!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]

This article requires that you're running the Azure CLI version 2.0 or later locally. To see the version installed, run the `az --version` command. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

You'll need to log in to your account using the [az login](/cli/azure/reference-index#az-login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

```azurecli-interactive
az login
```

Select the specific subscription under your account using [az account set](/cli/azure/account) command. Make a note of the **id** value from the **az login** output to use as the value for **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscription, use [az account list](/cli/azure/account#az-account-list).

```azurecli
az account set --subscription <subscription id>
```

> [!IMPORTANT]
>If you have not already created a flexible server yet, please create one to get started with this how to guide.

## Scale compute and storage

You can scale up your compute tier, vCores, and storage easily using the following command. You can see all the server operation you can perform [az mysql flexible-server update](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-update)

```azurecli-interactive
az mysql flexible-server update --resource-group myresourcegroup --name mydemoserver --sku-name Standard_D4ds_v4 --storage-size 6144
```

Here are the details for arguments above :

**Setting** | **Sample value** | **Description**
---|---|---
name | mydemoserver | Enter a unique name for your Azure Database for MySQL server. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain from 3 to 63 characters.
resource-group | myresourcegroup | Provide the name of the Azure resource group.
sku-name|Standard_D4ds_v4|Enter the name of the compute tier and size. Follows the convention Standard_{VM size} in shorthand. See the [pricing tiers](../concepts-pricing-tiers.md) for more information.
storage-size | 6144 | The storage capacity of the server (unit is megabytes). Minimum 5120 and increases in 1024 increments.

> [!IMPORTANT]
>- Storage can be scaled up (however, you cannot scale storage down)


## Manage MySQL databases on a server.
You can use any of these commands to create, delete , list and view database properties of a database on your server

| Cmdlet | Usage| Description |
| --- | ---| --- |
|[az mysql flexible-server db create](/cli/azure/mysql/flexible-server/db#az-mysql-flexible-server-db-create)|```az mysql flexible-server db create -g myresourcegroup -s mydemoserver -n mydatabasename``` |Creates a database|
|[az mysql flexible-server db delete](/cli/azure/mysql/flexible-server/db#az-mysql-flexible-server-db-delete)|```az mysql flexible-server db delete -g myresourcegroup -s mydemoserver -n mydatabasename```|Delete your database from your server. This command does not delete your server. |
|[az mysql flexible-server db list](/cli/azure/mysql/flexible-server/db#az-mysql-flexible-server-db-list)|```az mysql flexible-server db list -g myresourcegroup -s mydemoserver```|lists all the databases on the server|
|[az mysql flexible-server db show](/cli/azure/mysql/flexible-server/db#az-mysql-flexible-server-db-show)|```az mysql flexible-server db show -g myresourcegroup -s mydemoserver -n mydatabasename```|Shows more details of the database|

## Update admin password
You can change the administrator role's password with this command
```azurecli-interactive
az mysql flexible-server update --resource-group myresourcegroup --name mydemoserver --admin-password <new-password>
```

> [!IMPORTANT]
> Make sure password is minimum 8 characters and maximum 128 characters.
> Password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.

## Delete a server
If you would just like to delete the MySQL Flexible server, you can run [az mysql flexible-server server delete](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-delete) command.

```azurecli-interactive
az mysql flexible-server delete --resource-group myresourcegroup --name mydemoserver
```

## Next steps
- [Learn how to start or stop a server](how-to-stop-start-server-portal.md)
- [Learn how to manage a virtual network](how-to-manage-virtual-network-cli.md)
- [Troubleshoot connection issues](how-to-troubleshoot-common-connection-issues.md)
- [Create and manage firewall](how-to-manage-firewall-cli.md)
