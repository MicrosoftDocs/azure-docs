---
title: CLI script - Configure zone-redundant high availability in an Azure Database for MySQL - Flexible Server
description: This Azure CLI sample script shows how to configure Zone-Redundant high availability in an Azure Database for MySQL - Flexible Server.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.subservice: flexible-server
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli, event-tier1-build-2022
ms.date: 05/24/2022
---

# Configure zone-redundant high availability in an Azure Database for MySQL - Flexible Server using Azure CLI

This sample CLI script configures and manages [Zone-Redundant high availability](../concepts-high-availability.md) in an Azure Database for MySQL - Flexible Server.
You can enable Zone-Redundant high availability only during Flexible Server creation, and can disable it anytime. You can also choose the availability zone for the primary and the standby replica.

Currently, Zone-Redundant high availability is supported only for the General purpose and Business Critical pricing tiers.

[!INCLUDE [quickstarts-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/mysql/flexible-server/high-availability/zone-redundant-ha.sh" id="FullScript":::

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
