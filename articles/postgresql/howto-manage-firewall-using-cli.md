---
title: Create and manage Azure Database for PostgreSQL firewall rules using Azure CLI | Microsoft Docs
description: This article describes how to create and manage Azure Database for PostgreSQL firewall rules using Azure CLI command line.
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
# Create and manage Azure Database for PostgreSQL firewall rules using Azure CLI
Server-level firewall rules enable administrators to manage access to an Azure Database for PostgreSQL Server from a specific IP address or range of IP addresses. Using convenient Azure CLI commands, you can create, update, delete, list, and show firewall rules to manage your server. For an overview of Azure Database for PostgreSQL firewalls, see [Azure Database for PostgreSQL Server firewall rules](concepts-firewall-rules.md)

## Prerequisites
To step through this how-to guide, you need:
- An [Azure Database for PostgreSQL server and database](quickstart-create-server-database-azure-cli.md)
- Install [Azure CLI 2.0](/cli/azure/install-azure-cli) command line utility or use the Azure Cloud Shell in the browser.

## Configure firewall rules for Azure Database for PostgreSQL
The [az postgres server firewall-rule](/cli/azure/postgres/server/firewall-rule) commands are used to configure firewall rules.

## List firewall rules 
To list the existing server firewall rules on the server, run the [az postgres server firewall-rule list](/cli/azure/postgres/server/firewall-rule#list) command.
```azurecli-interactive
az postgres server firewall-rule list --resource-group myresourcegroup --server mypgserver-20170401
```
The output lists the rules if any, by default in JSON format. You may use the switch `--output table` for a more readable table format as the output.
```azurecli-interactive
az postgres server firewall-rule list --resource-group myresourcegroup --server mypgserver-20170401 --output table
```
## Create firewall rule
To create a new firewall rule on the server, run the [az postgres server firewall-rule create](/cli/azure/postgres/server/firewall-rule#create) command. 

This example allows a range of all IP addresses to access the server **mypgserver-20170401.postgres.database.azure.com**
```azurecli-interactive
az postgres server firewall-rule create --resource-group myresourcegroup  --server mypgserver-20170401 --name "AllowIpRange" --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255
```
To allow a singular IP address to access, provide the same address as the Start IP and End IP, as in this example.
```azurecli-interactive
az postgres server firewall-rule create --resource-group myresourcegroup  
--server mypgserver-20170401 --name "AllowSingleIpAddress" --start-ip-address 13.83.152.1 --end-ip-address 13.83.152.1
```
Upon success, the command output lists the details of the firewall rule you have created, by default in JSON format. If there is a failure, the output showserror message text instead.

## Update firewall rule 
Update an existing firewall rule on the server using [az postgres server firewall-rule update](/cli/azure/postgres/server/firewall-rule#update) command. Provide the name of the existing firewall rule as input, and the start IP and end IP attributes to update.
```azurecli-interactive
az postgres server firewall-rule update --resource-group myresourcegroup --server mypgserver-20170401 --name "AllowIpRange" --start-ip-address 13.83.152.0 --end-ip-address 13.83.152.255
```
Upon success, the command output lists the details of the firewall rule you have updated, by default in JSON format. If there is a failure, the output showserror message text instead.
> [!NOTE]
> If the firewall rule does not exist, it gets created by the update command.

## Show firewall rule details
You can also show the existing firewall rule details for a server by running [az postgres server firewall-rule show](/cli/azure/postgres/server/firewall-rule#show) command.
```azurecli-interactive
az postgres server firewall-rule show --resource-group myresourcegroup --server mypgserver-20170401 --name "AllowIpRange"
```
Upon success, the command output lists the details of the firewall rule you have specified, by default in JSON format. If there is a failure, the output showserror message text instead.

## Delete firewall rule
To revoke access for an IP range from the server, delete an existing firewall rule by executing the [az postgres server firewall-rule delete](/cli/azure/postgres/server/firewall-rule#delete) command. Provide the name of the existing firewall rule.
```azurecli-interactive
az postgres server firewall-rule delete --resource-group myresourcegroup --server mypgserver-20170401 --name "AllowIpRange"
```
Upon success, there is no output. Upon failure, the error message text is returned.

## Next steps
- Similarly, you can use a web browser to [Create and manage Azure Database for PostgreSQL firewall rules using the Azure portal](howto-manage-firewall-using-portal.md)
- Understand more about [Azure Database for PostgreSQL Server firewall rules](concepts-firewall-rules.md)
- For help in connecting to an Azure Database for PostgreSQL server, see [Connection libraries for Azure Database for PostgreSQL](concepts-connection-libraries.md)
