---
title: "Azure CLI example: Auditing and Advanced Threat Protection in Azure SQL Database"
description: Use this Azure CLI example script to configure auditing and Advanced Threat Protection in an Azure SQL Database
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: security, devx-track-azurecli
ms.devlang: azurecli
ms.topic: sample
author: DavidTrigano
ms.author: datrigan
ms.reviewer: vanto
ms.date: 01/05/2022
---

# Use CLI to configure SQL Database auditing and Advanced Threat Protection

[!INCLUDE[appliesto-sqldb](../../includes/appliesto-sqldb.md)]

This Azure CLI script example configures SQL Database auditing and Advanced Threat Protection.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/sql-database/database-auditing-and-threat-detection/database-auditing-and-threat-detection.sh" range="4-37":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Description |
|---|---|
| [az sql db audit-policy](/cli/azure/sql/db/audit-policy) | Sets the auditing policy for a database. |
| [az sql db threat-policy](/cli/azure/sql/db/threat-policy) | Sets an Advanced Threat Protection policy on a database. |

## Next steps

For more information on Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../az-cli-script-samples-content-guide.md).
