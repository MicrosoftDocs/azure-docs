---
title: Manage server - Azure CLI - Azure Database for PostgreSQL
description: Learn how to manage an Azure Database for PostgreSQL server from the Azure CLI.
author: ajlam
ms.author: andrela
ms.service: postgresql
ms.topic: how-to
ms.date: 9/22/2020
---

# Manage an Azure Database for PostgreSQL Single server using the Azure CLI

This article shows you how to manage your Single servers deployed in Azure. Management tasks include compute and storage scaling, admin password reset, and viewing server details.

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin. This article requires that you're running the Azure CLI version 2.0 or later locally. To see the version installed, run the `az --version` command. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

You'll need to log in to your account using the [az login](/cli/azure/reference-index#az_login) command. Note the **id** property, which refers to **Subscription ID** for your Azure account.

```azurecli-interactive
az login
```

Select the specific subscription under your account using [az account set](/cli/azure/account) command. Make a note of the **id** value from the **az login** output to use as the value for **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscription, use [az account list](/cli/azure/account#az_account_list).

```azurecli
az account set --subscription <subscription id>
```

If you have not already created a server, refer to this [quickstart](quickstart-create-server-database-azure-cli.md) to create one.

[!INCLUDE [cloud-shell-try-it](../../includes/cloud-shell-try-it.md)]

## Scale compute and storage

You can scale up your pricing tier, compute, and storage easily using the following command. You can see all the server operation you can perform [az postgres server overview](/cli/azure/mysql/server)

```azurecli-interactive
az postgres server update --resource-group myresourcegroup --name mydemoserver --sku-name GP_Gen5_4 --storage-size 6144
```

Here are the details for arguments above:

**Setting** | **Sample value** | **Description**
---|---|---
name | mydemoserver | Enter a unique name for your Azure Database for PostgreSQL server. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain from 3 to 63 characters.
resource-group | myresourcegroup | Provide the name of the Azure resource group.
sku-name|GP_Gen5_2|Enter the name of the pricing tier and compute configuration. Follows the convention {pricing tier}_{compute generation}_{vCores} in shorthand. See the [pricing tiers](./concepts-pricing-tiers.md) for more information.
storage-size | 6144 | The storage capacity of the server (unit is megabytes). Minimum 5120 and increases in 1024 increments.

> [!Important]
> - Storage can be scaled up (however, you cannot scale storage down)
> - Scaling up from Basic to General purpose or Memory optimized pricing tier is not supported. You can manually scale up with either  [using a bash script](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/upgrade-from-basic-to-general-purpose-or-memory-optimized-tiers/ba-p/830404) or [using PostgreSQL Workbench](https://techcommunity.microsoft.com/t5/azure-database-support-blog/how-to-scale-up-azure-database-for-mysql-from-basic-tier-to/ba-p/369134)


## Manage PostgreSQL databases on a server.
You can use any of these commands to create, delete, list, and view database properties of a database on your server

| Cmdlet | Usage| Description |
| --- | ---| --- |
|[az postgres db create](/cli/azure/sql/db#az_mysql_db_create)|```az postgres db create -g myresourcegroup -s mydemoserver -n mydatabasename``` |Creates a database|
|[az postgres db delete](/cli/azure/sql/db#az_mysql_db_delete)|```az postgres db delete -g myresourcegroup -s mydemoserver -n mydatabasename```|Delete your database from your server. This command does not delete your server. |
|[az postgres db list](/cli/azure/sql/db#az_mysql_db_list)|```az postgres db list -g myresourcegroup -s mydemoserver```|lists all the databases on the server|
|[az postgres db show](/cli/azure/sql/db#az_mysql_db_show)|```az postgres db show -g myresourcegroup -s mydemoserver -n mydatabasename```|Shows more details of the database|

## Update admin password
You can change the administrator role's password with this command
```azurecli-interactive
az postgres server update --resource-group myresourcegroup --name mydemoserver --admin-password <new-password>
```

> [!Important]
>  Make sure password is minimum 8 characters and maximum 128 characters.
> Password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.

## Delete a server
If you would just like to delete the PostgreSQL Single server, you can run [az postgres server delete](/cli/azure/mysql/server#az_mysql_server_delete) command.

```azurecli-interactive
az postgres server delete --resource-group myresourcegroup --name mydemoserver
```

## Next steps
- [Restart a server](howto-restart-server-cli.md)
- [Restore a server in a bad state](howto-restore-server-cli.md)
- [Monitor and tune the server](concepts-monitoring.md)
