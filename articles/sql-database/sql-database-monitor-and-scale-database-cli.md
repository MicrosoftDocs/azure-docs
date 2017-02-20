---
title: Azure CLI Script-Monitor & scale a SQL Database | Microsoft Docs
description: Azure CLI Script Sample - Monitor and scale a SQL database
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

# Monitor and scale a SQL database uisng the Azure CLI

The sample script provided here illustrates how to scale an Azure SQL database to a different performance level after querying the size information of the database. This sample works in Bash. For options on running Azure CLI scripts on Windows, see [Running the Azure CLI in Windows](../virtual-machines/virtual-machines-windows-cli-options.md).

Before running this script, ensure that a connection with Azure has been created using the `az login` command. Also, an SSH public key with the name `id_rsa.pub` must be stored in the ~/.ssh directory. Finally, the OMS workspace ID and workspace key need to be updated in the script.

## Run the CLI script

[!code-azurecli[main](../../cli_scripts/sql-database/monitor-and-scale-database/monitor-and-scale-database.sh "Monitor and scale SQL Database")]

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
| [az sql db show-usage](https://docs.microsoft.com/en-us/cli/azure/sql/db#show-usage) | Shows the size usage information for the database. |
| [az sql db update](https://docs.microsoft.com/en-us/cli/azure/sql/db#update) | Updates the SQL Database, in this example changes the performance level. |
| [az group delete](https://docs.microsoft.com/en-us/cli/azure/vm/extension#set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database CLI scripts](https://github.com/Azure/azure-docs-cli-python-samples/tree/master/sql-database).

