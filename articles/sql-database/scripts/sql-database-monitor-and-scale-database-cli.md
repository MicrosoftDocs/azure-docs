---
title: Azure CLI Script-Monitor & scale a single SQL Database | Microsoft Docs
description: Azure CLI Script Sample - Monitor and scale a single SQL database using the Azure CLI
services: sql-database
documentationcenter: sql-database
author: janeng
manager: jstrauss
editor: carlrab
tags: azure-service-management

ms.assetid:
ms.service: sql-database
ms.custom: monitor & tune
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: sql-database
ms.workload: database
ms.date: 04/24/2017
ms.author: janeng
---

# Monitor and scale a single SQL database using the Azure CLI

This sample CLI script scales a single Azure SQL database to a different performance level after querying the size information of the database. 

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/sql-database/monitor-and-scale-database/monitor-and-scale-database.sh "Monitor and scale single SQL Database")]

## Clean up deployment

After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az sql server create](https://docs.microsoft.com/cli/azure/sql/server#create) | Creates a logical server that hosts a database. |
| [az sql db show-usage](https://docs.microsoft.com/cli/azure/sql/db#show-usage) | Shows the size usage information for a database. |
| [az sql db update](https://docs.microsoft.com/cli/azure/sql/db#update) | Updates database properties (such as the service tier or performance level) or moves a database into, out of, or between elastic pools. |
| [az group delete](https://docs.microsoft.com/cli/azure/vm/extension#set) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database documentation](../sql-database-cli-samples.md).
