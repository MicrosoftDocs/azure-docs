---
title: Azure CLI Script Example - Run a Batch job
description: This script creates a Batch job and adds a series of tasks to the job. It also demonstrates how to monitor a job and its tasks.
ms.topic: sample
ms.date: 12/12/2019 
ms.custom: devx-track-azurecli

---

# CLI example: Run a job and tasks with Azure Batch

This script creates a Batch job and adds a series of tasks to the job. It also demonstrates
how to monitor a job and its tasks. 

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

- This tutorial requires version 2.0.20 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed. 

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
| [az batch pool create](/cli/azure/batch/pool#az-batch-pool-create) | Creates a pool of compute nodes.  |
| [az batch job create](/cli/azure/batch/job#az-batch-job-create) | Creates a Batch job.  |
| [az batch task create](/cli/azure/batch/task#az-batch-task-create) | Adds a task to the specified Batch job.  |
| [az batch job set](/cli/azure/batch/job#az-batch-job-set) | Updates properties of a Batch job.  |
| [az batch job show](/cli/azure/batch/job#az-batch-job-show) | Retrieves details of a specified Batch job.  |
| [az batch task show](/cli/azure/batch/task#az-batch-task-show) | Retrieves the details of a task from the specified Batch job.  |
| [az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).
