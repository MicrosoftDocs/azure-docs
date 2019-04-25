---
title: Azure CLI Script Example - Run a Batch job | Microsoft Docs
description: Azure CLI Script Example - Run a job with Batch
services: batch
documentationcenter: ''
author: laurenhughes
manager: jeconnoc
editor: tysonn

ms.assetid:
ms.service: batch
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 01/29/2018
ms.author: lahugh
---

# CLI example: Run a job and tasks with Azure Batch

This script creates a Batch job and adds a series of tasks to the job. It also demonstrates
how to monitor a job and its tasks. 

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). 

## Example script

[!code-azurecli-interactive[main](../../../cli_scripts/batch/run-job/run-job.sh "Run Job")]

## Clean up deployment

Run the following command to remove the
resource group and all resources associated with it.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az batch account create](/cli/azure/batch/account#az-batch-account-create) | Creates the Batch account. |
| [az batch account login](/cli/azure/batch/account#az-batch-account-login) | Authenticates against the specified Batch account for further CLI interaction.  |
| [az batch pool create](https://docs.microsoft.com/cli/azure/batch/pool#az-batch-pool-create) | Creates a pool of compute nodes.  |
| [az batch job create](https://docs.microsoft.com/cli/azure/batch/job#az-batch-job-create) | Creates a Batch job.  |
| [az batch task create](https://docs.microsoft.com/cli/azure/batch/task#az-batch-task-create) | Adds a task to the specified Batch job.  |
| [az batch job set](https://docs.microsoft.com/cli/azure/batch/job#az-batch-job-set) | Updates properties of a Batch job.  |
| [az batch job show](https://docs.microsoft.com/cli/azure/batch/job#az-batch-job-show) | Retrieves details of a specified Batch job.  |
| [az batch task show](https://docs.microsoft.com/cli/azure/batch/task#az-batch-task-show) | Retrieves the details of a task from the specified Batch job.  |
| [az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).