---
title: Azure CLI Script-Scale for Machine Learning Server  | Microsoft Docs
description: This sample describes the article in 115 to 145 characters. Validate using Gauntlet toolbar check icon. Use SEO kind of action verbs here.
services: machine-learning
author: jasonwhowell
ms.author: jasonh
manager: jhubbard
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.devlang: azure-cli
ms.topic: article
ms.date: 08/28/2017
---

# This is the H1 and the article title that shows on the web. A sample script.
The article contains a sample CLI script that does something. Focus on a longer block intended to be copied and pasted. Only intro explanation needed.

[!INCLUDE [cloud-shell-try-it](../../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. To find the version, run `az --version` . If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Sample script
In the sample script, change the highlighted lines to customize the admin username and password. Replace the subscription ID used in the az monitor commands with your own subscription ID.

The script is included from another repo meant just for CLI scripts.
[!code-azurecli-interactive[main](../../../../cli_scripts/postgresql/create-postgresql-server-and-firewall-rule/create-postgresql-server-and-firewall-rule.sh?highlight=2-3 "Description here.")]

## Clean up deployment
After the script sample has run, the following command can be used to remove the resource group and all resources associated with it.
[!code-azurecli-interactive[main](../../../../cli_scripts/postgresql/create-postgresql-server-and-firewall-rule/delete-postgresql.sh  "Delete the resource group.")]

## Script explanation
A script uses the following commands. Each command in the table links to command specific documentation.

| **Command** | **Notes** |
|---|---|
| [az group create](/cli/azure/group#create) | Creates a resource group in which all resources are stored. |

## Next steps
- Read more information on the Azure CLI: [Azure CLI documentation](/cli/azure/overview)
