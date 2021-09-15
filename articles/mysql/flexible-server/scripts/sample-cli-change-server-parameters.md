---
title: CLI Script - List and change server parameters of an Azure Database for MySQL - Flexible Server (Preview)
description: This Azure CLI sample script shows how to list and change server parameters of an Azure Database for MySQL - Flexible Server
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 09/15/2021
---

# List and change server parameters of an Azure Database for MySQL - Flexible Server (Preview) using Azure CLI

This sample CLI script lists all available [server parameters](../concepts-server-parameters.md) as well as their allowable values for Azure Database for MySQL - Flexible Server, and sets the *max_connections* and global *time_zone* parameters to values other than the default ones.

[!INCLUDE [flexible-server-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample Script

Update the script with your values for variables in **Set up variables** section. 

```azurecli
#!/bin/bash

# Change server parameters for Azure Database for MySQL - Flexible Server

# Set up variables
RESOURCE_GROUP="myresourcegroup" 
SERVER_NAME="mydemoserver" # Substitute with preferred name for MySQL Flexible Server. 
LOCATION="westus" 
ADMIN_USER="mysqladmin" 
PASSWORD="" # Enter your server admin password
IP_ADDRESS= # Enter your IP Address for Public Access - https://whatismyipaddress.com

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

# 3. List all Flexible Server parameters with their values and parameter descriptions
az mysql flexible-server parameter list \
--resource-group $RESOURCE_GROUP \
--server-name $SERVER_NAME

# 4. Set and check parameter values

# Set value of max_connections parameter
az mysql flexible-server parameter set \
--resource-group $RESOURCE_GROUP \
--server-name $SERVER_NAME \
--name max_connections \
--value 250

# Check value of max_connections paramater

az mysql flexible-server parameter show \
--resource-group $RESOURCE_GROUP \
--server-name $SERVER_NAME \
--name max_connections

# Set value of max_connections parameter back to default

az mysql flexible-server parameter set \
--resource-group $RESOURCE_GROUP \
--server-name $SERVER_NAME \
--name max_connections 

# Set global level time zone
az mysql flexible-server parameter set \
--resource-group $RESOURCE_GROUP \
--server-name $SERVER_NAME \
--name time_zone \
--value "+02:00"

# Check global level time zone

az mysql flexible-server parameter show \
--resource-group $RESOURCE_GROUP \
--server-name $SERVER_NAME \
--name time_zone
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
|[az mysql flexible-server parameter list](/cli/azure/mysql/flexible-server/parameter#az_mysql_flexible_server_parameter_list)|Lists the parameter values for a flexible server.|
|[az mysql flexible-server parameter set](/cli/azure/mysql/flexible-server/parameter#az_mysql_flexible_server_parameter_set)|Updates the parameter of a flexible server.|
|[az mysql flexible-server parameter show](/cli/azure/mysql/flexible-server/parameter#az_mysql_flexible_server_parameter_show)|Get a specific parameter value for a flexible server.|
|[az mysql flexible-server delete](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_delete)|Deletes a Flexible Server.|
|[az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources.|

## Next Steps

- Try additional scripts: [Azure CLI samples for Azure Database for MySQL - Flexible Server (Preview)](../sample-scripts-azure-cli.md)
- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).