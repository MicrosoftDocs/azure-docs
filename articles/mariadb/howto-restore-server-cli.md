---
title: How to backup and restore a server in Azure Database for MariaDB
description: Learn how to backup and restore a server in Azure Database for MariaDB by using the Azure CLI.
author: rachel-msft
ms.author: raagyema
ms.service: mariadb
ms.devlang: azurecli
ms.topic: conceptual
ms.date: 11/10/2018
---
# How to back up and restore a server in Azure Database for MariaDB using the Azure CLI

## Backup happens automatically

Azure Database for MariaDB servers are backed up periodically to enable Restore features. Using this feature you may restore the server and all its databases to an earlier point-in-time, on a new server.

## Prerequisites

To complete this how-to guide, you need:

- An [Azure Database for MariaDB server and database](quickstart-create-mariadb-server-database-using-azure-cli.md)

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

> [!IMPORTANT]
> This how-to guide requires that you use Azure CLI version 2.0 or later. To confirm the version, at the Azure CLI command prompt, enter `az --version`. To install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Set backup configuration

You make the choice between configuring your server for either locally redundant backups or geographically redundant backups at server creation.

> [!NOTE]
> After a server is created, the kind of redundancy it has, geographically redundant vs locally redundant, can't be switched.
>

While creating a server via the `az mariadb server create` command, the `--geo-redundant-backup` parameter decides your Backup Redundancy Option. If `Enabled`, geo redundant backups are taken. Or if `Disabled` locally redundant backups are taken.

The backup retention period is set by the parameter `--backup-retention`.

For more information about setting these values during create, see the [Azure Database for MariaDB server CLI Quickstart](quickstart-create-mariadb-server-database-using-azure-cli.md).

The backup retention period of a server can be changed as follows:

```azurecli-interactive
az mariadb server update --name mydemoserver --resource-group myresourcegroup --backup-retention 10
```

The preceding example changes the backup retention period of mydemoserver to 10 days.

The backup retention period governs how far back in time a point-in-time restore can be retrieved, since it's based on backups available. Point-in-time restore is described further in the next section.

## Server point-in-time restore

You can restore the server to a previous point in time. The restored data is copied to a new server, and the existing server is left as is. For example, if a table is accidentally dropped at noon today, you can restore to the time just before noon. Then, you can retrieve the missing table and data from the restored copy of the server.

To restore the server, use the Azure CLI [az mariadb server restore](/cli/azure/mariadb/server#az-mariadb-server-restore) command.

### Run the restore command

To restore the server, at the Azure CLI command prompt, enter the following command:

```azurecli-interactive
az mariadb server restore --resource-group myresourcegroup --name mydemoserver-restored --restore-point-in-time 2018-03-13T13:59:00Z --source-server mydemoserver
```

The `az mariadb server restore` command requires the following parameters:

| Setting | Suggested value | Description  |
| --- | --- | --- |
| resource-group |  myresourcegroup |  The resource group where the source server exists.  |
| name | mydemoserver-restored | The name of the new server that is created by the restore command. |
| restore-point-in-time | 2018-03-13T13:59:00Z | Select a point in time to restore to. This date and time must be within the source server's backup retention period. Use the ISO8601 date and time format. For example, you can use your own local time zone, such as `2018-03-13T05:59:00-08:00`. You can also use the UTC Zulu format, for example, `2018-03-13T13:59:00Z`. |
| source-server | mydemoserver | The name or ID of the source server to restore from. |

When you restore a server to an earlier point in time, a new server is created. The original server and its databases from the specified point in time are copied to the new server.

The location and pricing tier values for the restored server remain the same as the original server.

After the restore process finishes, locate the new server and verify that the data is restored as expected.

## Geo restore

If you configured your server for geographically redundant backups, a new server can be created from the backup of that existing server. This new server can be created in any region that Azure Database for MariaDB is available.  

To create a server using a geo redundant backup, use the Azure CLI `az mariadb server georestore` command.

> [!NOTE]
> When a server is first created it may not be immediately available for geo restore. It may take a few hours for the necessary metadata to be populated.
>

To geo restore the server, at the Azure CLI command prompt, enter the following command:

```azurecli-interactive
az mariadb server georestore --resource-group myresourcegroup --name mydemoserver-georestored --source-server mydemoserver --location eastus --sku-name GP_Gen5_8
```

This command creates a new server called *mydemoserver-georestored* in East US that will belong to *myresourcegroup*. It is a General Purpose, Gen 5 server with 8 vCores. The server is created from the geo-redundant backup of *mydemoserver*, which is also in the resource group *myresourcegroup*

If you want to create the new server in a different resource group from the existing server, then in the `--source-server` parameter you would qualify the server name as in the following example:

```azurecli-interactive
az mariadb server georestore --resource-group newresourcegroup --name mydemoserver-georestored --source-server "/subscriptions/$<subscription ID>/resourceGroups/$<resource group ID>/providers/Microsoft.DBforMariaDB/servers/mydemoserver" --location eastus --sku-name GP_Gen5_8

```

The `az mariadb server georestore` command requires the following parameters:

| Setting | Suggested value | Description  |
| --- | --- | --- |
|resource-group| myresourcegroup | The name of the resource group the new server will belong to.|
|name | mydemoserver-georestored | The name of the new server. |
|source-server | mydemoserver | The name of the existing server whose geo redundant backups are used. |
|location | eastus | The location of the new server. |
|sku-name| GP_Gen5_8 | This parameter sets the pricing tier, compute generation, and number of vCores of the new server. GP_Gen5_8 maps to a General Purpose, Gen 5 server with 8 vCores.|

>[!Important]
>When creating a new server by a geo restore, it inherits the same storage size and pricing tier as the source server. These values cannot be changed during creation. After the new server is created, its storage size can be scaled up.

After the restore process finishes, locate the new server and verify that the data is restored as expected.

## Next steps

- Learn more about the service's [backups](concepts-backup.md).
- Learn more about [business continuity](concepts-business-continuity.md) options.
