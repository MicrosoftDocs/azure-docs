---
title: Create and manage Azure Database for PostgreSQL firewall rules using Azure CLI | Microsoft Docs
description: Describes how to create and manage Azure Database for PostgreSQL firewall rules using Azure CLI.
services: postgresql
author: jasonwhowell
ms.author: jasonh
manager: jhubbard
editor: jasonh
ms.assetid:
ms.service: postgresql-database
ms.tgt_pltfrm: portal
ms.devlang: azurecli
ms.topic: article
ms.date: 05/10/2017
---
# Create and manage Azure Database for PostgreSQL firewall rules using Azure CLI
Server-level firewall rules enable administrators to manage access to an Azure Database for PostgreSQL Server from a specific IP address or range of IP addresses. Using convenient Azure CLI commands, you can create, update, delete, list, and show firewall rules to manage your server. For an overview of Azure Database for PostgreSQL firewalls, see [Azure Database for PostgreSQL Server firewall rules](concepts-firewall-rules.md)

## Prerequisites
To step through this how-to guide, you need:
- An [Azure Database for PostgreSQL server and database](quickstart-create-server-database-azure-cli.md)
- [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) command-line utility installed

## Configure firewall rules for Azure Database for PostgreSQL
The **az postgres server firewall-rule** command is used from Azure CLI to create, delete, list, show, and update firewall rules. This 

## Login to Azure and List servers
Securely connect Azure CLI with your Azure account. Use the **az login** command to do this.
1. Run the following command from the command line.
```azurecli
az login
```
This command will output a code to use in the next step.

2. Use a web browser to open the page [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the code.

3. At the prompt, log in using your Azure credentials.

4. Once your login is authorized, a list of subscriptions will be printed in the console.
Copy the id of the desired subscription to set the current subscription to be used moving forward.
```azurecli
az account set --subscription {your subscription id}
```
5. List the Azure Databases for PostgreSQL servers for your subscription and resource group if you are unsure of the names.

```azurecli
az postgres server list --resource-group myresourcegroup
```
Note the name attribute in the listing, which will be used to specify which PostgreSQL server to work on. If needed, confirm the details for that server to using the name attribute to confirm name is correct:

```azurecli
az postgres server show --resource-group myresourcegroup --name mypgserver-20170401
```

## List Firewall Rules 
Using the server name and the resource group name, list the existing server firewall rules on the server. Notice that the server name attribute is specified in the **--server** switch and not the **--name** switch.
```azurecli
az postgres server firewall-rule list --resource-group myresourcegroup --server mypgserver-20170401
```
The output will list the rules if any, by default in JSON format. You may use the switch **--output table** for a more readable table format as the output.
```azurecli
az postgres server firewall-rule list --resource-group myresourcegroup --server mypgserver-20170401 --output table
```
## Create Firewall Rule
Using the Azure Database for PostgreSQL server name and the resource group name, create a new firewall rule on the server. Provide a name for the rule, the start IP, and end IP for the rule to cover a range of IP addresses to allow access.
```azurecli
az postgres server firewall-rule create --resource-group myresourcegroup  --server mypgserver-20170401 --name "Firewall Rule 1" --start-ip-address 13.83.152.0 --end-ip-address 13.83.152.15
```
For a singular IP address to be allowed access, provide the same address as the Start IP and End IP, as in this example.
```azurecli
az postgres server firewall-rule create --resource-group myresourcegroup  
--server mypgserver-20170401 --name "Firewall Rule with a Single Address" --start-ip-address 1.1.1.1 --end-ip-address 1.1.1.1
```
Upon success, the command output will list the details of the firewall rule you have created, by default in JSON format. If there is a failure, the output will show error message text instead.

## Update Firewall Rule 
Using the Azure Database for PostgreSQL server name and the resource group name, update an existing firewall rule on the server. Provide the name of the existing firewall rule as input, and the start IP and end IP attributes to update.
```azurecli
az postgres server firewall-rule update --resource-group myresourcegroup --server mypgserver-20170401 --name "Firewall Rule 1" --start-ip-address 13.83.152.0 --end-ip-address 13.83.152.1
```
Upon success, the command output will list the details of the firewall rule you have updated, by default in JSON format. If there is a failure, the output will show error message text instead.
> [!NOTE]
> If the firewall rule does not exist, it will be created by the update command.

## Show Firewall Rule Details
Using the Azure Database for PostgreSQL server name and the resource group name, show the existing firewall rule details from the server. Provide the name of the existing firewall rule as input.
```azurecli
az postgres server firewall-rule show --resource-group myresourcegroup --server mypgserver-20170401 --name "Firewall Rule 1"
```
Upon success, the command output will list the details of the firewall rule you have specified, by default in JSON format. If there is a failure, the output will show error message text instead.

## Delete Firewall Rule
Using the Azure Database for PostgreSQL server name and the resource group name, remove an existing firewall rule from the server. Provide the name of the existing firewall rule.
```azurecli
az postgres server firewall-rule delete --resource-group myresourcegroup --server mypgserver-20170401 --name "Firewall Rule 1"
```
Upon success, there is no output. Upon failure, the error message text will be returned.

## Next steps
- Similarly, you can use a web browser to [Create and manage Azure Database for PostgreSQL firewall rules using the Azure portal](howto-manage-firewall-using-portal.md)
- Understand more about [Azure Database for PostgreSQL Server firewall rules](concepts-firewall-rules.md)
- For help in connecting to an Azure Database for PostgreSQL server, see [Connection libraries for Azure Database for PostgreSQL](concepts-connection-libraries.md)
