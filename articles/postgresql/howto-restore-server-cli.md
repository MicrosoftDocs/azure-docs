---
title: 'How To Restore a Server in Azure Database for PostgreSQL | Microsoft Docs'
description: This article describes how to backup and restore a server in Azure Database for PostgreSQL using the Azure CLI command line.
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

# How To Back up and Restore a server in Azure Database for PostgreSQL using the Azure CLI

## Prerequisites
To step through this how-to guide, you need:
- An [Azure Database for PostgreSQL server and database](quickstart-create-server-database-azure-cli.md)
- Install [Azure CLI 2.0](/cli/azure/install-azure-cli) command-line utility or use the Azure Cloud Shell in your web browser.

## Backup happens automatically
When using Azure Database for PostgreSQL, the database service automatically makes a backup of the service every 5 minutes. 

The backups are available for 7 days when using Basic Tier, and 35 days when using Standard Tier. For more information, see [Azure Database for PostgreSQL pricing tiers](concepts-service-tiers.md)

Using this automatic backup feature you may restore the server and all its databases into a new server at an earlier point-in-time.

## Restore a database to a previous point in time using the Azure CLI
Azure Database for PostgreSQL allows you to restore the server to a previous point in time. The restored data is copied into a new server, and the existing server is left as is. For example, if a table was accidentally dropped at noon today, you could restore to the time just before noon. Then retrieve the missing table and data from the restored copy of the server. 

Use the [az postgres server restore](/cli/azure/postgres/server#restore) command from the Azure CLI to do the restore.

You may use the Azure Cloud Shell in the browser to run the Azure CLI command, or [Install Azure CLI 2.0]( /cli/azure/install-azure-cli) on your own computer.

[!INCLUDE [cloud-shell-try-it](../../includes/cloud-shell-try-it.md)]

### Sign in to Azure
If you are using the Azure Cloud Shell follow the on screen prompts to sign in. 

If you are using an Azure CLI installed on a computer, log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions.  
```azurecli
az login
```

### Run the restore command
```azurecli-interactive
az postgres server restore --resource-group myResourceGroup --name mypgserver-restored --restore-point-in-time 2017-04-13T13:59:00Z --source-server mypgserver-20170401
```

The `az postgres server restore` command requires the following parameters:
| Setting | Suggested value | Description  |
| --- | --- | --- |
| resource-group |  myResourceGroup |  The resource group in which the source server exists.  |
| name | mypgserver-restored | The name of the new server that is created by the restore command. |
| restore-point-in-time | 2017-04-13T13:59:00Z | Select a point-in-time to restore to. This date and time must be within the source server's backup retention period. Use ISO8601 date and time format. For example, you may use your own local timezone, such as `2017-04-13T05:59:00-08:00`, or use UTC Zulu format `2017-04-13T13:59:00Z`. |
| source-server | mypgserver-20170401 | The name or ID of the source server to restore from. |

Restoring a server to a point-in-time creates a new server, copying as the original server as of the point in time you specify. The location and pricing tier values for the restored server are the same as the source server. The command is synchronous, and will return after waiting for the server to be restored. 

Once the restore finishes, locate the new server that was created. Verify the data was restored as expected.

## Next steps
[Connection libraries for Azure Database for PostgreSQL](concepts-connection-libraries.md)
