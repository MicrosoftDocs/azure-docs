---
title: Azure CLI Script-Scale for Machine Learning Server 
description: "Azure CLI Script Sample - Scale Azure Database for PostgreSQL server to a different performance level after querying the metrics."
services: machine-learning
author: yourgithubalias
ms.author: yourmsftalias
manager: jhubbard
editor: jasonwhowell
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.devlang: azure-cli
ms.topic: article
ms.date: 09/25/2017
---

# A sample script
The article contains a sample CLI script that does something. Focus on a longer copy/pasteable code block. Not much explanation needed.

[!INCLUDE [cloud-shell-try-it](../../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Sample script
In the sample script, change the highlighted lines to customize the admin username and password. Replace the subscription id used in the az monitor commands with your own subscription id.

The script is included from another repo meant just for CLI scripts.
[!code-azurecli-interactive[main](../../../cli_scripts/machine-learning/article-name/create-script.sh?highlight=2-3 "Description here.")]

## Clean up deployment
After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.
[!code-azurecli-interactive[main](../../../cli_scripts/machine-learning/article-name/delete-script.sh "Delete the resource group.")]

## Script explanation
A script uses the following commands. Each command in the table links to command specific documentation.

| **Command** | **Notes** |
|---|---|
| [az group create](/cli/azure/group#create) | Creates a resource group in which all resources are stored. |

## Next steps
- Read more information on the Azure CLI: [Azure CLI documentation](/cli/azure/overview)
