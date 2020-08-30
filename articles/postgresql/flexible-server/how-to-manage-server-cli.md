---
title: Manage server - Azure CLI - Azure Database for PostgreSQL Flexible Server
description: Learn how to manage an Azure Database for PostgreSQL Flexible server from the Azure CLI.
author: mksuni
ms.author: sumuth
ms.service: postgresql
ms.topic: how-to
ms.date: 9/21/2020
---

# Manage an Azure Database for PostgreSQL Flexible server (Preview) using the Azure CLI

This article shows you how to manage your Flexible Server (Preview) deployed in Azure. Management tasks include compute and storage scaling, admin password reset, and viewing server details.

## Prerequisites
If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin. This article requires that you're running the Azure CLI version 2.0 or later locally. To see the version installed, run the `az --version` command. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

You'll need to log in to your account using the [az login](https://docs.microsoft.com/cli/azure/reference-index?view=azure-cli-latest#az-login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

```azurecli-interactive
az login
```

Select the specific subscription under your account using [az account set](/cli/azure/account) command. Make a note of the **id** value from the **az login** output to use as the value for **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscription, use [az account list](https://docs.microsoft.com/cli/azure/account?view=azure-cli-latest#az-account-list).

```azurecli
az account set --subscription <subscription id>
```

> [!Important]
> If you have not already created a flexible server yet, please create one to get started with this how to guide.

## Scale compute and storage

You can scale up your compute tier, vCores, and storage easily using the following command. You can see all the server operation you can run [az postgres flexible-server server overview](/cli/azure/PostgreSQL/server?view=azure-cli-latest)

```azurecli-interactive
az postgres flexible-server update --resource-group myresourcegroup --name mydemoserver --sku-name Standard_D4ds_v3 --storage-size 6144
```

Here are the details for arguments above :

**Setting** | **Sample value** | **Description**
---|---|---
name | mydemoserver | Enter a unique name for your server. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain from 3 to 63 characters.
resource-group | myresourcegroup | Provide the name of the Azure resource group.
sku-name|Standard_D4ds_v3|Enter the name of the compute tier and size. Follows the convention Standard_{VM size} in shorthand. See the [pricing tiers](../concepts-pricing-tiers.md) for more information.
storage-size | 6144 | The storage capacity of the server (unit is megabytes). Minimum 5120 and increases in 1024 increments.

> [!Important]
> - Storage can be scaled up (however, you cannot scale storage down)

## Manage PostgreSQL databases on a server
You can use any of these commands to create, delete , list and view database properties of a database on your server

| Cmdlet | Usage| Description |
| --- | ---| --- |
|[az postgres flexible-server db create](/cli/azure/sql/db#az-PostgreSQL-flexible-server-db-create)|```az postgres flexible-server db create -g myresourcegroup -s mydemoserver -n mydatabasename``` |Creates a database|
|[az postgres flexible-server db delete](/cli/azure/sql/db#az-PostgreSQL-flexible-server-db-delete)|```az postgres flexible-server db delete -g myresourcegroup -s mydemoserver -n mydatabasename```|Delete your database from your server. This command does not delete your server. |
|[az postgres flexible-server db list](/cli/azure/sql/db#az-PostgreSQL-flexible-server-db-list)|```az postgres flexible-server db list -g myresourcegroup -s mydemoserver```|lists all the databases on the server|
|[az postgres flexible-server db show](/cli/azure/sql/db#az-PostgreSQL-flexible-server-db-show)|```az postgres flexible-server db show -g myresourcegroup -s mydemoserver -n mydatabasename```|Shows more details of the database|

## Reset admin password
You can change the administrator role's password with this command
```azurecli-interactive
az postgres flexible-server update --resource-group myresourcegroup --name mydemoserver --admin-password <new-password>
```

> [!Important]
>  Make sure password is minimum 8 characters and maximum 128 characters.
> Password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.

## Delete a server
If you would just like to delete the PostgreSQL Flexible server, you can run [az postgres flexible-server delete](/cli/azure/PostgreSQL/server#az-PostgreSQL-flexible-server-delete) command.

```azurecli-interactive
az postgres flexible-server delete --resource-group myresourcegroup --name mydemoserver
```

## Next steps
- Understand backup and restore concepts
- Tune and monitor the server
