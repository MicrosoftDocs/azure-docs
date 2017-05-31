---
title: Azure CLI Script Sample - Running a job with Batch | Microsoft Docs
description: Azure CLI Script Sample - Running a job with Batch
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

# Running jobs on Azure Batch with Azure CLI

This script creates a Batch job and adds a series of tasks to the job. It also demonstrates
how to monitor a job and its tasks. Finally, it shows how to query the Batch service efficiently for information about the job's tasks.

## Prerequisites

- Install the Azure CLI using the instructions provided in the [Azure CLI installation guide](https://docs.microsoft.com/cli/azure/install-azure-cli), if you have not already done so.
- Create a Batch account if you don't already have one. See [Create a Batch account with the Azure CLI](https://docs.microsoft.com/azure/batch/scripts/batch-cli-sample-create-account) for a sample script that creates an account.
- Configure an application to run from a start task if you haven't yet done so. See [Adding applications to Azure Batch with Azure CLI](https://docs.microsoft.com/azure/batch/scripts/batch-cli-sample-add-application) for a sample script that creates an application and uploads an application package to Azure.
- Configure a pool on which the job will run. See [Managing Azure Batch pools with Azure CLI](https://docs.microsoft.com/azure/batch/batch-cli-sample-manage-pool) for a sample script that creates a pool with either a Cloud Service Configuration or a Virtual Machine Configuration.

## Sample script

[!code-azurecli[main](../../../cli_scripts/batch/run-job/run-job.sh "Run Job")]

## Clean up job

After you run the above sample script, run the following command to remove the
job and all of its tasks. Note that the pool will need to be deleted separately. See
[Managing Azure Batch pools with Azure CLI](./batch-cli-sample-manage-pool.md) for more information on creating and deleting pools.

```azurecli
az batch job delete --job-id myjob
```

## Script explanation

This script uses the following commands to create a Batch job and tasks. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az batch account login](https://docs.microsoft.com/cli/azure/batch/account#login) | Authenticate against a Batch account.  |
| [az batch job create](https://docs.microsoft.com/cli/azure/batch/job#create) | Creates a Batch job.  |
| [az batch job set](https://docs.microsoft.com/cli/azure/batch/job#set) | Updates properties of a Batch job.  |
| [az batch job show](https://docs.microsoft.com/cli/azure/batch/job#show) | Retrieves details of a specified Batch job.  |
| [az batch task create](https://docs.microsoft.com/cli/azure/batch/task#create) | Adds a task to the specified Batch job.  |
| [az batch task show](https://docs.microsoft.com/cli/azure/batch/task#show) | Retrieves the details of a task from the specified Batch job.  |
| [az batch task list](https://docs.microsoft.com/cli/azure/batch/task#list) | Lists the tasks associated with the specified job.  |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).

Additional Batch CLI script samples can be found in the [Azure Batch CLI documentation](../batch-cli-samples.md).
