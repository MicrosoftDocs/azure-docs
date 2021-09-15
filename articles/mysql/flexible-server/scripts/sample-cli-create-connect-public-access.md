---
title: CLI Script - Create an Azure Database for MySQL - Flexible Server (Preview) and enable public access connectivity
description: This Azure CLI sample script shows how to create a Azure Database for MySQL - Flexible Server, configure a server-level firewall rule (public access connectivity method) and connect to the server.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 09/15/2021
---

# Create an Azure Database for MySQL - Flexible Server (Preview) and enable public access connectivity using Azure CLI

This sample CLI script creates an Azure Database for MySQL - Flexible Server, configures a server-level firewall rule ([public access connectivity method](../concepts-networking-public.md)) and connects to the server after creation. 

Once the script runs successfully, the MySQL Flexible Server will be accessible by all Azure services and the configured IP address, and you will be connected to the server in an interactive mode.

[!INCLUDE [flexible-server-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample Script

Update the script with your values for variables in **Set up variables** section. 

```azurecli
#!/bin/bash

# Create an Azure Database for MySQL - Flexible Server Burstable B1ms instance
# and configure Public Access connectivity method

# Set up variables
RESOURCE_GROUP="myresourcegroup" 
SERVER_NAME="mydemoserver" # Substitute with preferred name for your MySQL Flexible Server. 
LOCATION="westus" 
ADMIN_USER="mysqladmin" 
PASSWORD="" # Enter your server admin password
IP_ADDRESS=  # Enter your IP Address for Public Access - https://whatismyipaddress.com

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

# Optional: Add firewall rule to connect from all Azure services
# To allow other IP addresses, change start-ip-address and end-ip-address

az mysql flexible-server firewall-rule create \
--name $SERVER_NAME \
--resource-group $RESOURCE_GROUP \
--rule-name AllowAzureIPs \
--start-ip-address 0.0.0.0 \
--end-ip-address 0.0.0.0

# 3. Connect to server in interactive mode
az mysql flexible-server connect \
--name $SERVER_NAME \
--admin-user $ADMIN_USER \
--admin-password $PASSWORD \
--interactive

```


## Clean up deployment

After the sample script has been run, the following code snippet can be used to clean up the resources.

```azurecli
#!/bin/bash

RESOURCE_GROUP="myresourcegroup" 
SERVER_NAME="mydemoserver" # Enter your server name.

# Delete MySQL Flexible Server 
az mysql flexible-server delete --resource-group $RESOURCE_GROUP --name $SERVER_NAME

# Optional : Delete resource group
az group delete --name $RESOURCE_GROUP
```

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

- Try additional scripts: [Azure CLI samples for Azure Database for MySQL - Flexible Server (Preview)](../sample-scripts-azure-cli.md)
- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).