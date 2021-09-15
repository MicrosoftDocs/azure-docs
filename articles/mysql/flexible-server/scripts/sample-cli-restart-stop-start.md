---
title: CLI Script - Restart/Stop/Start an Azure Database for MySQL - Flexible Server (Preview)
description: This Azure CLI sample script shows how to Restart/Stop/Start an Azure Database for MySQL - Flexible Server.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 09/15/2021
---

# Restart/Stop/Start an Azure Database for MySQL - Flexible Server (Preview) using Azure CLI

This sample CLI script performs restart, start and stop operations on an Azure Database for MySQL - Flexible Server.

[!INCLUDE [flexible-server-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample Script

Update the script with your values for variables in **Set up variables** section.

```azurecli
#!/bin/bash

# Create a server, perform restart / start / stop operations

# Set up variables
RESOURCE_GROUP="myresourcegroup" 
SERVER_NAME="mydemoserver" # Substitute with preferred name for MySQL Flexible Server. 
LOCATION="westus" 
ADMIN_USER="mysqladmin" 
PASSWORD="" # Enter your server admin password
IP_ADDRESS=# Enter your IP Address for Public Access - https://whatismyipaddress.com

# 1. Create a resource group
az group create \
--name $RESOURCE_GROUP \
--location $LOCATION

# 2. Create a MySQL Flexible server in the resource group

az mysql flexible-server create \
--name $SERVER_NAME \
--resource-group $RESOURCE_GROUP \
--location $LOCATION \
--admin-user $ADMIN_USER \
--admin-password $PASSWORD \
--public-access $IP_ADDRESS

# 3. Stop the running server
az mysql flexible-server stop \
--resource-group $RESOURCE_GROUP \
--name $SERVER_NAME

# 4. Start the stopped server
az mysql flexible-server start \
--resource-group $RESOURCE_GROUP \
--name $SERVER_NAME

# 5. Restart the server
az mysql flexible-server restart \
--resource-group $RESOURCE_GROUP \
--name $SERVER_NAME
```


## Clean up deployment

After the sample script has been run, the following code snippet can be used to clean up the resources.

```azurecli
#!/bin/bash

RESOURCE_GROUP="myresourcegroup" 
SERVER_NAME="mydemoserver" # Enter your server name

# Delete MySQL Flexible Server
az mysql flexible-server delete \
--resource-group $RESOURCE_GROUP 
--name $SERVER_NAME

# Optional : Delete resource group

az group delete --name $RESOURCE_GROUP

```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| **Command** | **Notes** |
|---|---|
|[az group create](/cli/azure/group#az_group_create)|Creates a resource group in which all resources are stored|
|[az mysql flexible-server create](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_create)|Creates a Flexible Server that hosts the databases.|
|[az mysql flexible-server stop](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_stop)|Stops a Flexible Server.|
|[az mysql flexible-server start](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_start)|Starts a Flexible Server.|
|[az mysql flexible-server restart](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_restart)|Restarts a Flexible Server.|
|[az mysql flexible-server delete](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_delete)|Deletes a Flexible Server.|
|[az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources.|

## Next Steps

- Try additional scripts: [Azure CLI samples for Azure Database for MySQL - Flexible Server (Preview)](../sample-scripts-azure-cli.md)
- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).