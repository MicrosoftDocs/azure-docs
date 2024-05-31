---
title: CLI script - Configure same-zone high availability
description: This Azure CLI sample script shows how to configure same-zone high availability in an Azure Database for MySQL - Flexible Server instance.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.subservice: flexible-server
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 05/24/2022
---

# Configure same-zone high availability in Azure Database for MySQL - Flexible Server using Azure CLI

[!INCLUDE[applies-to-mysql-flexible-server](../../includes/applies-to-mysql-flexible-server.md)]

This sample CLI script configures and manages [Same-Zone high availability](../concepts-high-availability.md) in an Azure Database for MySQL - Flexible Server.
Currently, Same-Zone high availability is supported only for the General purpose and Business Critical pricing tiers.

[!INCLUDE [quickstarts-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/mysql/flexible-server/high-availability/same-zone-ha.sh" id="FullScript":::

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
|[az mysql flexible-server update](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-update)|Updates a Flexible Server.|
|[az mysql flexible-server delete](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-delete)|Deletes a Flexible Server.|
|[az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources.|

## Next steps

- Try additional scripts: [Azure CLI samples for Azure Database for MySQL - Flexible Server](../sample-scripts-azure-cli.md)
- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).
