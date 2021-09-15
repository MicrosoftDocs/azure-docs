---
title: CLI Script - Create an Azure Database for MySQL - Flexible Server (Preview) in a VNet
description: This Azure CLI sample script shows how to create a Azure Database for MySQL - Flexible Server in a VNet (private access connectivity method) and connect to the server from a VM within the VNet.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 09/15/2021
---

# Create an Azure Database for MySQL - Flexible Server (Preview) in a VNet using Azure CLI

This sample CLI script creates an Azure Database for MySQL - Flexible Server in a VNet ([private access connectivity method](../concepts-networking-vnet.md)) and connects to the server from a VM within the VNet.

[!INCLUDE [flexible-server-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample Script

Update the script with your values for variables in **Set up variables** section. 

```azurecli
#!/bin/bash

# Create an Azure Database for MySQL - Flexible Server (General Purpose SKU) in VNET - with Private Access connectivity method
# Connect to the server from a VM within the VNET.

RESOURCE_GROUP="myresourcegroup"
SERVER_NAME="mydemoserver" # Substitute with preferred name for your MySQL Flexible Server.
LOCATION="westus" 
ADMIN_USER="mysqladmin" 
PASSWORD="" # Enter your server admin password

# 1. Create a resource group
az group create \
--name $RESOURCE_GROUP \
--location $LOCATION

# OPTIONAL : View all SKUs for Flexible Server
az mysql flexible-server list-skus --location $LOCATION

# 2. Create a MySQL Flexible server in the resource group

az mysql flexible-server create \
--name $SERVER_NAME \
--resource-group $RESOURCE_GROUP \
--location $LOCATION \
--sku-name Standard_D2ds_v4 \
--tier GeneralPurpose \
--storage-size 64 \
--storage-auto-grow Enabled \
--admin-user $ADMIN_USER \
--admin-password $PASSWORD \
--vnet MyVnet \
--address-prefixes 155.5.0.0/24 \
--subnet mysql-subnet \
--subnet-prefixes 155.5.0.0/28 

# 3. Create a VM within the VNET to connect to MySQL Flex Server
    # a. Create a subnet within the VNET
    # b. Create VM within the created subnet

az network vnet subnet create \
--resource-group $RESOURCE_GROUP \
--vnet-name MyVnet \
--name vm-subnet \
--address-prefixes 155.5.0.48/28

az vm create \
--resource-group $RESOURCE_GROUP \
--name mydemoVM \
--location $LOCATION \
--image UbuntuLTS \
--admin-username azureuser \
--generate-ssh-keys \
--vnet-name MyVnet \
--subnet vm-subnet

# 4. Open port 80 for web traffic

az vm open-port --port 80 \
--resource-group $RESOURCE_GROUP \
--name mydemoVM

# 5. SSH into the VM
publicIp=$(az vm list-ip-addresses --resource-group $RESOURCE_GROUP --name mydemoVM --query "[].virtualMachine.network.publicIpAddresses[0].ipAddress" --output tsv)
ssh azureuser@$publicIp 

# 6. Download MySQL tools and connect to the server!
# Substitute <server_name> and <admin_user> with your values

sudo apt-get update
sudo apt-get install mysql-client

wget --no-check-certificate https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem

mysql -h <replace-with-server-name>.mysql.database.azure.com -u mysqladmin -p --ssl-mode=REQUIRED --ssl-ca=DigiCertGlobalRootCA.crt.pem

```

## Clean up deployment

After the sample script has been run, the following code snippet can be used to clean up the resources.

```azurecli
#!/bin/bash

RESOURCE_GROUP="myresourcegroup"

# Delete resource group 
az group delete --name $RESOURCE_GROUP
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| **Command** | **Notes** |
|---|---|
|[az group create](/cli/azure/group#az_group_create)|Creates a resource group in which all resources are stored|
|[az mysql flexible-server create](/cli/azure/mysql/flexible-server#az_mysql_flexible_server_create)|Creates a Flexible Server that hosts the databases.|
|[az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create)|Creates a subnet within the VNet.|
|[az vm create](/cli/azure/vm#az_vm_create)|Creates an Azure Virtual Machine.|
|[az vm open-port](/cli/azure/vm#az_vm_open_port)|Opens a VM to inbound traffic on specified ports.|
|[az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources.|

## Next Steps

- Try additional scripts: [Azure CLI samples for Azure Database for MySQL - Flexible Server (Preview)](../sample-scripts-azure-cli.md)
- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).