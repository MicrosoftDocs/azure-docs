---
title: CLI script - Restore
description: This Azure CLI sample script shows how to restore a single Azure Database for MySQL - Flexible Server instance to a previous point in time.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.subservice: flexible-server
ms.devlang: azurecli
ms.topic: sample
ms.custom: mvc, devx-track-azurecli
ms.date: 02/10/2022
---

# Restore an Azure Database for MySQL - Flexible Server instance using Azure CLI

[!INCLUDE[applies-to-mysql-flexible-server](../../includes/applies-to-mysql-flexible-server.md)]

Azure Database for MySQL - Flexible Server, automatically creates server backups and securely stores them in local redundant storage within the region.

This sample CLI script performs a [point-in-time restore](../concepts-backup-restore.md) and creates a new server from your Flexible Server's backups.

The new Flexible Server is created with the original server's configuration and also inherits tags and settings such as virtual network and firewall from the source server. The restored server's compute and storage tier, configuration and security settings can be changed after the restore is completed.

[!INCLUDE [quickstarts-free-trial-note](../../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/mysql/flexible-server/backup-restore/restore-server.sh" id="FullScript":::

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
|[az mysql flexible-server restore](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-restore)|Restore a Flexible Server from backup.|
|[az mysql flexible-server show](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-show)|Get details of a Flexible Server.|
|[az mysql flexible-server delete](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-delete)|Deletes a Flexible Server.|
|[az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources.|

## Next steps

- Try additional scripts: [Azure CLI samples for Azure Database for MySQL - Flexible Server](../sample-scripts-azure-cli.md)
- For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).
