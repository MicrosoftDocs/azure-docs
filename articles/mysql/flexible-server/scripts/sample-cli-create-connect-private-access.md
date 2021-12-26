---
title: CLI script - Create an Azure Database for MySQL - Flexible Server in a VNet
description: This Azure CLI sample script shows how to create a Azure Database for MySQL - Flexible Server in a VNet (private access connectivity method) and connect to the server from a VM within the VNet.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 09/15/2021
---

# Create an Azure Database for MySQL - Flexible Server in a VNet using Azure CLI

This sample CLI script creates an Azure Database for MySQL - Flexible Server in a VNet ([private access connectivity method](../concepts-networking-vnet.md)) and connects to the server from a VM within the VNet.

> [!NOTE] 
> The connectivity method cannot be changed after creating the server. For example, if you create server using *Private access (VNet Integration)*, you cannot change to *Public access (allowed IP addresses)* after creation. To learn more about connectivity methods, see [Networking concepts](../concepts-networking.md).

[!INCLUDE [flexible-server-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment](../../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

## Sample script

Edit the highlighted lines in the script with your values for variables.

[!code-azurecli-interactive[main](../../../../cli_scripts/mysql/flexible-server/create-server-private-access/create-connect-server-in-vnet.sh?highlight=7,10 "Create and Connect to an Azure Database for MySQL - Flexible Server (General Purpose SKU) in VNet")]

## Clean up deployment

After the sample script has been run, the following code snippet can be used to clean up the resources.

[!code-azurecli-interactive[main](../../../../cli_scripts/mysql/flexible-server/create-server-private-access/clean-up-resources.sh "Clean up resources.")]

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

## Next steps

- Try additional scripts: [Azure CLI samples for Azure Database for MySQL - Flexible Server](../sample-scripts-azure-cli.md)
- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).