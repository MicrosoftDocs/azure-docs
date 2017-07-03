---
title: 'How to back up and restore a server in Azure Database for PostgreSQL | Microsoft Docs'
description: Learn how to back up and restore a server in Azure Database for PostgreSQL by using the Azure CLI command-line tool.
services: postgresql
author: jasonwhowell
ms.author: jasonh
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql-database
ms.devlang: azure-cli
ms.topic: article
ms.date: 06/13/2017
---

# How to back up and restore a server in Azure Database for PostgreSQL by using the Azure CLI command-line tool

Use Azure Database for PostgreSQL to restore a server database to an earlier date that spans from seven to 35 days.

## Prerequisites
To complete this how-to guide, you need:
- An [Azure Database for PostgreSQL server and database](quickstart-create-server-database-azure-cli.md)

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

 

> [!IMPORTANT]
> If you install and use the Azure CLI locally, this how-to guide requires that you use Azure CLI version 2.0 or later. To confirm the version, at the Azure CLI command prompt, enter `az --version`. To install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Back up happens automatically
When you use Azure Database for PostgreSQL, the database service automatically makes a backup of the service every five minutes. 

For Basic Tier, the backups are available for seven days. For Standard Tier, the backups are available for 35 days. For more information, see [Azure Database for PostgreSQL pricing tiers](concepts-service-tiers.md).

With this automatic backup feature, you can restore the server and its databases to an earlier date, or point-in-time.

## Restore a database to a previous point-in-time by using the Azure CLI tool
Use Azure Database for PostgreSQL to restore the server to a previous point-in-time. The restored data is copied to a new server, and the existing server is left as is. For example, if a table is accidentally dropped at noon today, you can restore to the time just before noon. Then, you can retrieve the missing table and data from the restored copy of the server. 

To restore the server, use the Azure CLI [az postgres server restore](/cli/azure/postgres/server#restore) command.

### Run the restore command

To restore the server, at the Azure CLI command prompt, enter the following command:

```azurecli-interactive
az postgres server restore --resource-group myResourceGroup --name mypgserver-restored --restore-point-in-time 2017-04-13T13:59:00Z --source-server mypgserver-20170401
```

The `az postgres server restore` command requires the following parameters:
| Setting | Suggested value | Description  |
| --- | --- | --- |
| resource-group |  myResourceGroup |  The resource group where the source server exists.  |
| name | mypgserver-restored | The name of the new server that is created by the restore command. |
| restore-point-in-time | 2017-04-13T13:59:00Z | Select a point-in-time to restore to. This date and time must be within the source server's back up retention period. Use the ISO8601 date and time format. For example, you can use your own local time zone, such as `2017-04-13T05:59:00-08:00`. You can also use the UTC Zulu format, for example, `2017-04-13T13:59:00Z`. |
| source-server | mypgserver-20170401 | The name or ID of the source server to restore from. |

When you restore a server to an earlier point-in-time, a new server is created. The original server and its databases from the specified point-in-time are copied to the new server.

The location and pricing tier values for the restored server remain the same as the original server. 

The `az postgres server restore` command is synchronous. After the server is restored, you can use it again to repeat the process for a different point-in-time. 

After the restore process is complete, locate the new server and verify that the data is restored as expected.

## Next steps
[Connection libraries for Azure Database for PostgreSQL](concepts-connection-libraries.md)
