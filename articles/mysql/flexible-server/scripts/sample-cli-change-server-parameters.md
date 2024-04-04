---
title: CLI script - List and change server parameters
description: This Azure CLI sample script shows how to list and change server parameters of an Azure Database for MySQL - Flexible Server instance.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.subservice: flexible-server
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 02/10/2022 
---

# List and change server parameters of Azure Database for MySQL - Flexible Server using Azure CLI

[!INCLUDE[applies-to-mysql-flexible-server](../../includes/applies-to-mysql-flexible-server.md)]

This sample CLI script lists all available [server parameters](../concepts-server-parameters.md) as well as their allowable values for Azure Database for MySQL - Flexible Server, and sets the *max_connections* and global *time_zone* parameters to values other than the default ones.

[!INCLUDE [quickstarts-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/mysql/flexible-server/manage-server/change-server-parameters.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| **Command** | **Notes** |
|---|---|
|[az group create](/cli/azure/group#az-group-create)|Creates a resource group in which all resources are stored|
|[az mysql flexible-server create](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-create)|Creates a Flexible Server that hosts the databases.|
|[az mysql flexible-server parameter list](/cli/azure/mysql/flexible-server/parameter#az-mysql-flexible-server-parameter-list)|Lists the parameter values for a flexible server.|
|[az mysql flexible-server parameter set](/cli/azure/mysql/flexible-server/parameter#az-mysql-flexible-server-parameter-set)|Updates the parameter of a flexible server.|
|[az mysql flexible-server parameter show](/cli/azure/mysql/flexible-server/parameter#az-mysql-flexible-server-parameter-show)|Get a specific parameter value for a flexible server.|
|[az mysql flexible-server delete](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-delete)|Deletes a Flexible Server.|
|[az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources.|

## Next steps

- Try additional scripts: [Azure CLI samples for Azure Database for MySQL - Flexible Server](../sample-scripts-azure-cli.md)
- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).