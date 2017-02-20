---
title: Azure CLI Script-Create a SQL database | Microsoft Docs
description: Azure CLI Script Sample - Create a SQL database
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

# Create a SQL database and configure a firewall rule with the Azure CLI

The sample script provided here illustrates how to create an Azure SQL database and configure a server-level firewall rule. Once the script has been successfully run, the SQL Database can be accessed from all Azure services and the configured IP address. This sample works in Bash. For options on running Azure CLI scripts on Windows, see [Running the Azure CLI in Windows](../virtual-machines/virtual-machines-windows-cli-options.md).

Before running this script, ensure that a connection with Azure has been created using the `az login` command. Also, an SSH public key with the name `id_rsa.pub` must be stored in the ~/.ssh directory. Finally, the OMS workspace ID and workspace key need to be updated in the script.

## Run CLI script

[!code-azurecli[main](../../cli_scripts/sql-database/create-and-configure-database/create-and-configure-database.sh "Create SQL Database")]

## Clean up deployment

After the script sample has been run, the following command can be used to remove the Resource Group, logical server and SQL database.

```azurecli
az group delete --name SampleResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, logical server, SQL Database and firewall rules. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/en-us/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az sql server create](https://docs.microsoft.com/en-us/cli/azure/sql/server#create) | Creates a logical server that will host the SQL Database. |
| [az sql server firewall create](https://docs.microsoft.com/en-us/cli/azure/sql/server/firewall#create) | Creates a firewall rule to allow access to all SQL Databases on the server from the entered IP address range. |
| [az sql db create](https://docs.microsoft.com/en-us/cli/azure/sql/db#create) | Creates the SQL Database in the logical server. |
| [az group delete](https://docs.microsoft.com/en-us/cli/azure/vm/extension#set) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional SQL Database CLI script samples can be found in the [Azure SQL Database CLI scripts](https://github.com/Azure/azure-docs-cli-python-samples/tree/master/sql-database).
