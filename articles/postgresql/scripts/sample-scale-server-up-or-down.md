---
title: Azure CLI script - Scale and monitor
description: Azure CLI Script Sample - Scale an Azure Database for PostgreSQL - Flexible Server instance to a different performance level after querying the metrics.
ms.author: sunila
author: sunilagarwal
ms.service: postgresql
ms.devlang: azurecli
ms.custom: mvc, devx-track-azurecli
ms.topic: sample
ms.date: 01/26/2022 
---
# Monitor and scale a single Azure Database for PostgreSQL - Flexible Server instance using Azure CLI

[!INCLUDE[applies-to-postgres-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

This sample CLI script scales compute and storage for a single Azure Database for PostgreSQL flexible server instance after querying the metrics. Compute can scale up or down. Storage can only scale up. 

> [!IMPORTANT]
> Storage can only be scaled up, not down.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/postgresql/scale-postgresql-server/scale-postgresql-server.sh" id="FullScript":::

## Clean up deployment

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the commands outlined in the following table:

| **Command** | **Notes** |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az postgres server create](/cli/azure/postgres/server#az-postgres-server-create) | Creates an Azure Database for PostgreSQL flexible server instance that hosts the databases. |
| [az postgres server update](/cli/azure/postgres/server#az-postgres-server-update) | Updates properties of the Azure Database for PostgreSQL flexible server instance. |
| [az monitor metrics list](/cli/azure/monitor/metrics) | Lists the metric value for the resources. |
| [az group delete](/cli/azure/group) | Deletes a resource group including all nested resources. |

## Next steps

- Learn more about [Azure Database for PostgreSQL - Flexible Server compute and storage](../concepts-pricing-tiers.md)
- Try additional scripts: [Azure CLI samples for Azure Database for PostgreSQL - Flexible Server](../sample-scripts-azure-cli.md)
- Learn more about the [Azure CLI](/cli/azure)
