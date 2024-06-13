---
title: Azure CLI Script Example - Run a Batch job | Microsoft Docs
description: Learn how to create a Batch job and add a series of tasks to the job using the Azure CLI. This article also shows how to monitor a job and its tasks.
ms.topic: sample
ms.date: 05/24/2022 
ms.custom: devx-track-azurecli, seo-azure-cli
keywords: batch, batch job, monitor job, azure cli samples, azure cli code samples, azure cli script samples
---

# CLI example: Run a job and tasks with Azure Batch

This script creates a Batch job and adds a series of tasks to the job. It also demonstrates how to monitor a job and its tasks.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Create a Batch account in Batch service mode

:::code language="azurecli" source="~/azure_cli_scripts/batch/run-job/run-job.sh" id="FullScript":::

### To add many tasks at once

To add many tasks at once, specify the tasks in a JSON file, and pass it to the command. For format, see https://github.com/Azure/azure-docs-cli-python-samples/blob/master/batch/run-job/tasks.json. Provide the absolute path to the JSON file. For an example JSON file, see https://github.com/Azure-Samples/azure-cli-samples/blob/master/batch/run-job/tasks.json.

```azurecli
az batch task create \
    --job-id myjob \
    --json-file tasks.json
```

### To update the job

Update the job so that it is automatically marked as completed once all the tasks are finished.

```azurecli
az batch job set \
--job-id myjob \
--on-all-tasks-complete terminatejob
```

### To monitor the status of the job

```azurecli
az batch job show --job-id myjob
```

### To monitor the status of a task

```azurecli
az batch task show \
    --job-id myjob \
    --task-id task1
```

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

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
