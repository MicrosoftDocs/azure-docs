---
title: CLI Script - Create an Azure Database for MySQL - Flexible Server (Preview) and enable public access connectivity
description: This Azure CLI sample script shows how to create a Azure Database for MySQL - Flexible Server, configure a server-level firewall rule (public access connectivity method) and connect to the server.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 09/13/2021
---

# Create an Azure Database for MySQL - Flexible Server (Preview) and enable public access connectivity using Azure CLI

This sample CLI script creates an Azure Database for MySQL - Flexible Server, configures a server-level firewall rule (public access connectivity method) and connects to the server after creation. 
Once the script runs successfully, the MySQL Flexible Server will be accessible by all Azure services and the configured IP address, and you will be connected to the server in an interactive mode.

[!INCLUDE [flexible-server-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample Script

In this sample script, edit the highlighted lines to update the variable values.



## Clean up deployment

After the sample script has been run, the following code snippet can be used to clean up the resources.


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

## Next Steps

