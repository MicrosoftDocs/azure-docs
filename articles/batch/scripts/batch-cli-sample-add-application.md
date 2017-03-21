---
title: Azure CLI Script Sample - Add an Application in Batch | Microsoft Docs
description: Azure CLI Script Sample - Add an Application in Batch
services: batch
documentationcenter: batch
author: annatisch
manager: daryls
editor: tamram
tags: azure-batch

ms.assetid:
ms.service: batch
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: batch
ms.workload: infrastructure
ms.date: 03/20/2017
ms.author: antisch
---

# Adding Applications to Azure Batch with Azure CLI

This script demonstrates how to set up an application for use with an Azure Batch
pool or task. In order to set up an application - the executable will need to be packaged
up with any dependencies into a zip file. In this example the executable zip file is
called 'my-application-exe.zip'.
Running this script assumes that a Batch account has already been set up. For more information,
please see the same script for creating a Batch account.

If needed, install the Azure CLI using the instruction found in the [Azure CLI installation guide](https://docs.microsoft.com/cli/azure/install-azure-cli), 
and then run `az login` to create a connection with Azure.

## Sample script

[!code-azurecli[main](../../../cli_scripts/batch/add-application/add-application.sh "Add Application")]

## Clean up application

After the above sample script has been run, the following command can be used to remove the
application and all of it's uploaded application packages.

```azurecli
az batch application delete -g myresourcegroup -n mybatchaccount --application-id myapp
```

## Script explanation

This script uses the following commands to create an application and upload an application package.
Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az batch application create](https://docs.microsoft.com/cli/azure/batch/application#create) | Creates an application.  |
| [az batch application set](https://docs.microsoft.com/cli/azure/batch/application#set) | Updates properties of an application.  |
| [az batch application package create](https://docs.microsoft.com/cli/azure/batch/application/package#create) | Adds an application package to the specified application.  |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional Batch CLI script samples can be found in the [Azure Batch CLI documentation](../batch-cli-samples.md).
