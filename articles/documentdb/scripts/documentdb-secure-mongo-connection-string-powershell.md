---
title: Azure PowerShell Script-Get DocumentDB connection string for MongoDB apps| Microsoft Docs
description: Azure PowerShell Script Sample - Get DocumentDB connection string for MongoDB apps
services: documentdb
documentationcenter: documentdb
author: mimig1
manager: jhubbard
editor: ''
tags: azure-service-management

ms.assetid:
ms.service: documentdb
ms.custom: sample
ms.devlang: PowerShell
ms.topic: article
ms.tgt_pltfrm: documentdb
ms.workload: database
ms.date: 04/20/2017
ms.author: mimig
---

# Get DocumentDB connection string for MongoDB apps using PowerShell

*To be updated for PowerShell, current contents are from CLI doc*

This sample CLI script creates an Azure DocumentDB account, database and collection. Once the script has been successfully run, the DocumentDB database can be accessed from all Azure services. 

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

## Sample script

`[!code-azurecli[main](../../../cli_scripts/documentdb/secure-documentdb-get-mongodb-connection-string/secure-documentdb-get-mongodb-connection-string.sh?highlight=38-41  "Get a DocumentDB connection string for MongoDB apps")]`

## Clean up deployment

After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.

```azurecli
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#create) | Creates a resource group in which all resources are stored. |
| [az documentdb update](/cli/azure/documentdb/name#update) | Updates a DocumentDB account. |
| [az documentdb list-connection-strings](/cli/azure/documentdb/list-connection-strings) | Gets the connection string for the account.|
| [az group delete](/cli/azure/resource#delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional DocumentDB CLI script samples can be found in the [Azure DocumentDB documentation](../documentdb-cli-samples.md).
