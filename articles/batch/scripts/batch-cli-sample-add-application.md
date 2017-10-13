---
title: Azure CLI Script Sample - Add an Application in Batch | Microsoft Docs
description: Azure CLI Script Sample - Add an Application in Batch
services: batch
documentationcenter: ''
author: annatisch
manager: daryls
editor: tysonn

ms.assetid:
ms.service: batch
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 05/02/2017
ms.author: antisch
---

# Adding applications to Azure Batch with Azure CLI

This script demonstrates how to set up an application for use with an Azure Batch
pool or task. To set up an application, package your executable, together with any dependencies,
into a .zip file. In this example the executable zip file is called 'my-application-exe.zip'.

## Prerequisites

- Install the Azure CLI using the instructions provided in the [Azure CLI installation guide](https://docs.microsoft.com/cli/azure/install-azure-cli), if you have not already done so.
- Create a Batch account if you don't already have one. See [Create a Batch account with the Azure CLI](https://docs.microsoft.com/azure/batch/scripts/batch-cli-sample-create-account) for a sample script that creates an account.

## Sample script

[!code-azurecli[main](../../../cli_scripts/batch/add-application/add-application.sh "Add Application")]

## Clean up application

After you run the above sample script, run the following commands to remove the
application and all of its uploaded application packages.

```azurecli
az batch application package delete -g myresourcegroup -n mybatchaccount --application-id myapp --version 1.0 --yes
az batch application delete -g myresourcegroup -n mybatchaccount --application-id myapp --yes
```

## Script explanation

This script uses the following commands to create an application and upload an application package.
Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az batch application create](https://docs.microsoft.com/cli/azure/batch/application#create) | Creates an application.  |
| [az batch application set](https://docs.microsoft.com/cli/azure/batch/application#set) | Updates properties of an application.  |
| [az batch application package create](https://docs.microsoft.com/cli/azure/batch/application/package#create) | Adds an application package to the specified application.  |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional Batch CLI script samples can be found in the [Azure Batch CLI documentation](../batch-cli-samples.md).
