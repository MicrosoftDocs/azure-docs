---
title: CLI script - Create with vNet rule
description: This sample CLI script creates an Azure Database for PostgreSQL - Flexible Server instance with a service endpoint on a virtual network and configures a vNet rule.
author: savjani
ms.author: pariks
ms.service: postgresql
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 01/26/2022 
---

# Create an Azure Database for PostgreSQL - Flexible Server instance and configure a vNet rule using the Azure CLI

[!INCLUDE[applies-to-postgres-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

This sample CLI script creates an Azure Database for PostgreSQL flexible server instance and configures a vNet rule.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/postgresql/create-postgresql-server-vnet/create-postgresql-server.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the commands outlined in the following table:

| **Command** | **Notes** |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az postgresql server create](/cli/azure/postgres/server/vnet-rule#az-postgres-server-vnet-rule-create) | Creates an Azure Database for PostgreSQL flexible server instance that hosts the databases. |
| [az network vnet list-endpoint-services](/cli/azure/network/vnet#az-network-vnet-list-endpoint-services#az-network-vnet-list-endpoint-services) | Lists which services support VNET service tunneling in a given region. |
| [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) | Creates a virtual network. |
| [az network vnet subnet create](/cli/azure/network/vnet#az-network-vnet-subnet-create) | Creates a subnet and associates an existing NSG and route table. |
| [az network vnet subnet show](/cli/azure/network/vnet#az-network-vnet-subnet-show) |Shows details of a subnet. |
| [az postgresql server vnet-rule create](/cli/azure/postgres/server/vnet-rule#az-postgres-server-vnet-rule-create) | Creates a virtual network rule to allow access to an Azure Database for PostgreSQL flexible server instance. |
| [az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |

## Next steps

- Read more information on the Azure CLI: [Azure CLI documentation](/cli/azure).
- Try more scripts: [Azure CLI samples for Azure Database for PostgreSQL - Flexible Server](../sample-scripts-azure-cli.md)
