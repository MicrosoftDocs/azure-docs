---
title: CLI script - Create an Azure Database for MySQL - Flexible Server and enable public access connectivity
description: This Azure CLI sample script shows how to create a Azure Database for MySQL - Flexible Server, configure a server-level firewall rule (public access connectivity method) and connect to the server.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 09/15/2021
---

# Create an Azure Database for MySQL - Flexible Server and enable public access connectivity using Azure CLI

This sample CLI script creates an Azure Database for MySQL - Flexible Server, configures a server-level firewall rule ([public access connectivity method](../concepts-networking-public.md)) and connects to the server after creation. 

Once the script runs successfully, the MySQL Flexible Server will be accessible by all Azure services and the configured IP address, and you will be connected to the server in an interactive mode.

> [!NOTE] 
> The connectivity method cannot be changed after creating the server. For example, if you create server using *Public access (allowed IP addresses)*, you cannot change to *Private access (VNet Integration)* after creation. To learn more about connectivity methods, see [Networking concepts](../concepts-networking.md).


[!INCLUDE [flexible-server-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample script

Edit the highlighted lines in the script with your values for variables.

[!code-azurecli-interactive[main](../../../../cli_scripts/mysql/flexible-server/create-server-public-access/create-connect-burstable-server-public-access.sh?highlight=8,11-12 "Create Flexible Server and enable public access.")]

## Clean up deployment

After the sample script has been run, the following code snippet can be used to clean up the resources.

[!code-azurecli-interactive[main](../../../../cli_scripts/mysql/flexible-server/create-server-public-access/clean-up-resources.sh?highlight=4 "Clean up resources.")]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| **Command** | **Notes** |
|---|---|
|[az group create](/cli/azure/group#az_group_create)|Creates a resource group in which all resources are stored|
|[az mysql flexible-server create](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_create)|Creates a Flexible Server that hosts the databases.|
|[az mysql flexible-server firewall-rule create](/cli/azure/mysql/flexible-server/firewall-rule#az_mysql_flexible_server_firewall_rule_create)|Creates a firewall rule to allow access to the Flexible Server and its databases from the entered IP address range.|
|[az mysql flexible-server connect](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_connect)|Connects to a Flexible Server to perform server or database operations.|
|[az mysql flexible-server delete](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_delete)|Deletes a Flexible Server.|
|[az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources.|

## Next steps

- Try additional scripts: [Azure CLI samples for Azure Database for MySQL - Flexible Server](../sample-scripts-azure-cli.md)
- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).