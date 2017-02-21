---
title: Azure CLI Script-Move a SQL database and elastic pools | Microsoft Docs
description: Azure CLI Script Sample - Move a SQL database between elastic pools
services: sql-database
documentationcenter: sql-database
author: janeng
manager: jstrauss
editor: carlrab
tags: azure-service-management

ms.assetid:
ms.service: sql-database
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: sql-database
ms.workload: database
ms.date: 02/21/2017
ms.author: janeng
---

# Create elastic pools and move databases between pools and out of a pool using the Azure CLI

The sample script provided here illustrates how a database can be moved from one elastic pool into another elastic pool and finally to a standalone performance level. This sample works in Bash. For options on running Azure CLI scripts on Windows, see [Running the Azure CLI in Windows](../virtual-machines/virtual-machines-windows-cli-options.md).

Before running this script, ensure that a connection with Azure has been created using the `az login` command. Also, an SSH public key with the name `id_rsa.pub` must be stored in the ~/.ssh directory. Finally, the OMS workspace ID and workspace key need to be updated in the script.

## Create elastic pools and move databases between pools

[!code-azurecli[main](../../cli_scripts/sql-database/move-database-between-pools/move-database-between-pools.sh "Move database between pools")]

## Clean up deployment

After the script sample has been run, the following command can be used to remove the Resource Group and all resources associated with it.

```azurecli
az group delete --name SampleResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, logical server, SQL Database and firewall rules. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/en-us/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az sql server create](https://docs.microsoft.com/en-us/cli/azure/sql/server#create) | Creates a logical server that will host the SQL Database. |
| [az sql elastic-pools create](https://docs.microsoft.com/en-us/cli/azure/sql/elastic-pools#create) | Creates an elastic database pool within the logical server. |
| [az sql db create](https://docs.microsoft.com/en-us/cli/azure/sql/db#create) | Creates the SQL Database in the logical server. |
| [az sql db update](https://docs.microsoft.com/en-us/cli/azure/sql/db#update) | Updates the SQL Database. |
| [az group delete](https://docs.microsoft.com/en-us/cli/azure/vm/extension#set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database CLI scripts](https://github.com/Azure/azure-docs-cli-python-samples/tree/master/sql-database).

