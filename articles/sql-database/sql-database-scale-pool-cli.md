---
title: Azure CLI Script-Scale an elastic pool | Microsoft Docs
description: Azure CLI Script Sample - Scale an elastic database pool
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
ms.date: 02/20/2017
ms.author: janeng
---

# Scale an elastic pool in Azure SQL Database using the Azure CLI

The sample script provided here creates an elastic database pool in the North Central US region and scales the performance up.This sample works in Bash. For options on running Azure CLI scripts on Windows, see [Running the Azure CLI in Windows](../virtual-machines-windows-cli-options.md).

Before running this script, ensure that a connection with Azure has been created using the `az login` command. Also, an SSH public key with the name `id_rsa.pub` must be stored in the ~/.ssh directory. Finally, the OMS workspace ID and workspace key need to be updated in the script.

## Run the CLI script

[!code-azurecli[main](../../cli_scripts/sql-database/scale-pool/scale-pool.sh "Move database between pools")]

## Clean up deployment

After the script sample has been run, the following command can be used to remove the Resource Group, logical server and SQL Database.

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
| [az sql elastic-pools update](https://docs.microsoft.com/en-us/cli/azure/sql/elastic-pools#update) | Updates an elastic database pool, in this example changes the assigned eDTU. |
| [az group delete](https://docs.microsoft.com/en-us/cli/azure/vm/extension#set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database CLI scripts](https://github.com/Azure/azure-docs-cli-python-samples/tree/master/sql-database).