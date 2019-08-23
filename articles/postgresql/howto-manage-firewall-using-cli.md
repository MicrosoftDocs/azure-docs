---
title: Create and manage firewall rules in Azure Database for PostgreSQL - Single Server using Azure CLI
description: This article describes how to create and manage firewall rules in Azure Database for PostgreSQL - Single Server using Azure CLI command line.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.devlang: azurecli
ms.topic: conceptual
ms.date: 5/6/2019
---
# Create and manage firewall rules in Azure Database for PostgreSQL - Single Server using Azure CLI
Server-level firewall rules can be used to manage access to an Azure Database for PostgreSQL Server from a specific IP address or range of IP addresses. Using convenient Azure CLI commands, you can create, update, delete, list, and show firewall rules to manage your server. For an overview of Azure Database for PostgreSQL firewall rules, see [Azure Database for PostgreSQL Server firewall rules](concepts-firewall-rules.md).

Virtual Network (VNet) rules can also be used to secure access to your server. Learn more about [creating and managing Virtual Network service endpoints and rules using the Azure CLI](howto-manage-vnet-using-cli.md).

## Prerequisites
To step through this how-to guide, you need:
- Install [Azure CLI](/cli/azure/install-azure-cli) command-line utility or use the Azure Cloud Shell in the browser.
- An [Azure Database for PostgreSQL server and database](quickstart-create-server-database-azure-cli.md).

## Configure firewall rules for Azure Database for PostgreSQL
The [az postgres server firewall-rule](/cli/azure/postgres/server/firewall-rule) commands are used to configure firewall rules.

## List firewall rules 
To list the existing server firewall rules, run the [az postgres server firewall-rule list](/cli/azure/postgres/server/firewall-rule) command.
```azurecli-interactive
az postgres server firewall-rule list --resource-group myresourcegroup --server-name mydemoserver
```
The output lists the firewall rules, if any, by default in JSON format. You may use the switch `--output table` for a more readable table format as the output.
```azurecli-interactive
az postgres server firewall-rule list --resource-group myresourcegroup --server-name mydemoserver --output table
```
## Create firewall rule
To create a new firewall rule on the server, run the [az postgres server firewall-rule create](/cli/azure/postgres/server/firewall-rule) command. 

```
To allow access to a singular IP address, provide the same address in the `--start-ip-address` and `--end-ip-address`, as in this example, replacing the IP shown here with your specific IP.
```azurecli-interactive
az postgres server firewall-rule create --resource-group myresourcegroup --server-name mydemoserver --name AllowSingleIpAddress --start-ip-address 13.83.152.1 --end-ip-address 13.83.152.1
```
To allow applications from Azure IP addresses to connect to your Azure Database for PostgreSQL server, provide the IP address 0.0.0.0 as the Start IP and End IP, as in this example.
```azurecli-interactive
az postgres server firewall-rule create --resource-group myresourcegroup --server-name mydemoserver --name AllowAllAzureIps --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
```

> [!IMPORTANT]
> This option configures the firewall to allow all connections from Azure including connections from the subscriptions of other customers. When selecting this option, make sure your login and user permissions limit access to only authorized users.
> 

Upon success, the command output lists the details of the firewall rule you have created, by default in JSON format. If there is a failure, the output shows an error message instead.

## Update firewall rule 
Update an existing firewall rule on the server using [az postgres server firewall-rule update](/cli/azure/postgres/server/firewall-rule) command. Provide the name of the existing firewall rule as input, and the start IP and end IP attributes to update.
```azurecli-interactive
az postgres server firewall-rule update --resource-group myresourcegroup --server-name mydemoserver --name AllowIpRange --start-ip-address 13.83.152.0 --end-ip-address 13.83.152.0
```
Upon success, the command output lists the details of the firewall rule you have updated, by default in JSON format. If there is a failure, the output shows an error message instead.
> [!NOTE]
> If the firewall rule does not exist, it gets created by the update command.

## Show firewall rule details
You can also show the details of an existing server-level firewall rule by running [az postgres server firewall-rule show](/cli/azure/postgres/server/firewall-rule) command.
```azurecli-interactive
az postgres server firewall-rule show --resource-group myresourcegroup --server-name mydemoserver --name AllowIpRange
```
Upon success, the command output lists the details of the firewall rule you have specified, by default in JSON format. If there is a failure, the output shows an error message instead.

## Delete firewall rule
To revoke access for an IP range to the server, delete an existing firewall rule by executing the [az postgres server firewall-rule delete](/cli/azure/postgres/server/firewall-rule) command. Provide the name of the existing firewall rule.
```azurecli-interactive
az postgres server firewall-rule delete --resource-group myresourcegroup --server-name mydemoserver --name AllowIpRange
```
Upon success, there is no output. Upon failure, the error message text is returned.

## Next steps
- Similarly, you can use a web browser to [Create and manage Azure Database for PostgreSQL firewall rules using the Azure portal](howto-manage-firewall-using-portal.md).
- Understand more about [Azure Database for PostgreSQL Server firewall rules](concepts-firewall-rules.md).
- Further secure access to your server by [creating and managing Virtual Network service endpoints and rules using the Azure CLI](howto-manage-vnet-using-cli.md).
- For help in connecting to an Azure Database for PostgreSQL server, see [Connection libraries for Azure Database for PostgreSQL](concepts-connection-libraries.md).
