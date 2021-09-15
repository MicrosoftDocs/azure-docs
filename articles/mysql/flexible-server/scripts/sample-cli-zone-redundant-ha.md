---
title: CLI Script - Configure Zone-Redundant high availability in an Azure Database for MySQL - Flexible Server (Preview)
description: This Azure CLI sample script shows how to configure Zone-Redundant high availability in an Azure Database for MySQL - Flexible Server.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 09/15/2021
---

# Configure Zone-Redundant high availability in an Azure Database for MySQL - Flexible Server (Preview) using Azure CLI

This sample CLI script configures and manages [Zone-Redundant high availability](../concepts-high-availability.md) in an Azure Database for MySQL - Flexible Server. 
You can enable Zone-Redundant high availability only during Flexible Server creation, and can disable it anytime. You can also choose the availability zone for the primary and the standby replica. 

Currently, Zone-Redundant high availability is supported only for the General purpose and Memory optimized pricing tiers.


[!INCLUDE [flexible-server-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample Script

Update the script with your values for variables in **Set up variables** section.

```azurecli
#!/bin/bash

# Enable Zone-redundant High Availability

# Set up variables
RESOURCE_GROUP="myresourcegroup" 
SERVER_NAME="mydemoserver" # Substitute with preferred name for MySQL Flexible Server. 
LOCATION="eastus" 
ADMIN_USER="mysqladmin" 
PASSWORD="" # Enter your server admin password
IP_ADDRESS= # Enter your IP Address for Public Access - https://whatismyipaddress.com

PRIMARY_ZONE=1
STANDBY_ZONE=2

# 1. Create resource group
az group create \
--name $RESOURCE_GROUP \
--location $LOCATION

# 2. Enable Zone-redundant HA while creating a MySQL Flexible server in the resource group
# HA is not available for Burstable tier
# zone and standby-zone parameters are optional

az mysql flexible-server create \
--name $SERVER_NAME \
--resource-group $RESOURCE_GROUP \
--location $LOCATION \
--sku-name Standard_D2ds_v4 \
--tier GeneralPurpose \
--admin-user $ADMIN_USER \
--admin-password $PASSWORD \
--public-access $IP_ADDRESS \
--high-availability ZoneRedundant \
--zone $PRIMARY_ZONE \
--standby-zone $STANDBY_ZONE

3. Disable Zone-redundant HA

az mysql flexible-server update \
--resource-group $RESOURCE_GROUP \
--name $SERVER_NAME \
--high-availability Disabled

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
|[az mysql flexible-server update](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_update)|Updates a Flexible Server.|
|[az mysql flexible-server delete](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_delete)|Deletes a Flexible Server.|
|[az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources.|

## Next Steps

- Try additional scripts: [Azure CLI samples for Azure Database for MySQL - Flexible Server (Preview)](../sample-scripts-azure-cli.md)
- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).