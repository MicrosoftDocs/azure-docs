---
title: Azure CLI Script-Multiregion replication for DocumentDB | Microsoft Docs
description: Azure CLI Script Sample - Multiregion replication for DocumentDB
services: documentdb
documentationcenter: documentdb
author: mimig1
manager: jhubbard
editor: ''
tags: azure-service-management

ms.assetid:
ms.service: documentdb
ms.custom: sample
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: documentdb
ms.workload: database
ms.date: 04/20/2017
ms.author: mimig
---

# Replicate DocumentDB database account in multiple regions and configure failover priorities using the Azure CLI

This sample CLI script creates an Azure DocumentDB account, database and collection. Once the script has been successfully run, the DocumentDB database can be accessed from all Azure services. 

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

## Sample script

`[!code-azurecli[main](../../../cli_scripts/documentdb/scale-documentdb-replicate-multiple-regions/scale-documentdb-replicate-multiple-regions.sh?highlight=29-38 "Scale DocumentDB into multiple regions")]`

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
| [az group delete](/cli/azure/resource#delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional DocumentDB CLI script samples can be found in the [Azure DocumentDB documentation](../documentdb-cli-samples.md).
