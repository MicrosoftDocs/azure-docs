---
title: Jobs in Azure Container Apps (preview)
description: Learn about jobs in Azure Container Apps (preview)
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: cshoe
---

# Jobs in Azure Container Apps (preview)

Azure Container Apps jobs enable you to run containerized workloads that execute for a finite duration and then terminate successfully. You can use jobs to perform tasks such as data processing, machine learning, and more.

## Job types

There are two types of jobs:

- **Manual** – manual jobs are triggered on-demand.
- **Schedule** – scheduled jobs are triggered on a schedule and run repeatedly.

### Manual jobs

Manual jobs are triggered on-demand using the Azure CLI or a request to the Azure Resource Manager API.

Examples of manual jobs include:

- One time processing tasks such as migrating data from one system to another.
- An e-commerce site running as container app starts a job execution to process inventory when an order is placed.

To create a manual job, use the job type `Manual`.

# [Azure CLI](#tab/azure-cli)

To create a manual job using the Azure CLI, use the `az containerapp job create` command. The following example creates a manual job named `my-job` in a resource group named `my-resource-group` and a Container Apps environment named `my-environment`:

```azurecli
az containerapp job create \
    --name "my-job" --resource-group "my-resource-group"  --environment "my-environment" \
    --trigger-type Manual \
    --replica-timeout 60 --replica-retry-limit 1 --replica-count 1 --parallelism 1 \
    --image "mcr.microsoft.com/k8se/quickstart-jobs:latest" \
    --cpu "0.25" --memory "0.5Gi"
```

# [Azure Resource Manager](#tab/azure-resource-manager)

The following example ARM template creates a manual job named `my-job` in a resource group named `my-resource-group` and a Container Apps environment named `my-environment`:

```json
{
    "location": "East US 2 EUAP",
    "name": "my-job",
    "properties": {
        "configuration": {
            "manualTriggerConfig": {
                "parallelism": 1,
                "replicaCompletionCount": 1
            },
            "replicaRetryLimit": 1,
            "replicaTimeout": 60,
            "triggerType": "Manual"
        },
        "environmentId": "/subscriptions/<subscription_id>/resourceGroups/my-resource-group/providers/Microsoft.App/managedEnvironments/my-environment",
        "template": {
            "containers": [
                {
                    "image": "mcr.microsoft.com/k8se/quickstart-jobs:latest",
                    "name": "main",
                    "resources": {
                        "cpu": 0.25,
                        "memory": "0.5Gi"
                    }
                }
            ]
        }
    }
}
```

---

`mcr.microsoft.com/k8se/quickstart-jobs:latest` is a sample container image that runs a job that waits a few seconds, prints a message to the console, and then exits.

Creating a manual job only defines the job. To start a job execution, see [Start a job execution on demand](#start-a-job-execution-on-demand).

### Scheduled jobs

Scheduled jobs are triggered on a schedule. To create a scheduled job, use the job type `Schedule`.

Container Apps jobs use cron expressions to define schedules. It supports the standard [cron](https://en.wikipedia.org/wiki/Cron) expression format with five fields for minute, hour, day of month, month, and day of week. The following are examples of cron expressions:

- `0 */2 * * *` – run every two hours.
- `0 0 * * *` – run every day at midnight.
- `0 0 * * 0` – run every Sunday at midnight.
- `0 0 1 * *` – run on the first day of every month at midnight.

Cron expressions in scheduled jobs are evaluated in Universal Time Coordinated (UTC).

# [Azure CLI](#tab/azure-cli)

To create a manual job using the Azure CLI, use the `az containerapp job create` command. The following example creates a scheduled job named `my-job` in a resource group named `my-resource-group` and a Container Apps environment named `my-environment`:

```azurecli
az containerapp job create \
    --name "my-job" --resource-group "my-resource-group"  --environment "my-environment" \
    --trigger-type Schedule \
    --replica-timeout 60 --replica-retry-limit 1 --replica-count 1 --parallelism 1 \
    --image "mcr.microsoft.com/k8se/quickstart-jobs:latest" \
    --cpu "0.25" --memory "0.5Gi" \
    --cron-expression "0 0 * * *"
```

# [Azure Resource Manager](#tab/azure-resource-manager)

The following example ARM template creates a manual job named `my-job` in a resource group named `my-resource-group` and a Container Apps environment named `my-environment`:

```json
{
    "location": "East US 2 EUAP",
    "name": "my-job",
    "properties": {
        "configuration": {
            "scheduleTriggerConfig": {
                "cronExpression": "0 0 * * *",
                "parallelism": 1,
                "replicaCompletionCount": 1
            },
            "replicaRetryLimit": 1,
            "replicaTimeout": 60,
            "triggerType": "Schedule"
        },
        "environmentId": "/subscriptions/<subscription_id>/resourceGroups/my-resource-group/providers/Microsoft.App/managedEnvironments/my-environment",
        "template": {
            "containers": [
                {
                    "image": "mcr.microsoft.com/k8se/quickstart-jobs:latest",
                    "name": "main",
                    "resources": {
                        "cpu": 0.25,
                        "memory": "0.5Gi"
                    }
                }
            ]
        }
    }
}
```

---

`mcr.microsoft.com/k8se/quickstart-jobs:latest` is a sample container image that runs a job that waits a few seconds, prints a message to the console, and then exits.

The cron expression `0 0 * * *` runs the job every day at midnight UTC.

## Start a job execution on demand

For any job type, you can start a job execution on demand.

# [Azure CLI](#tab/azure-cli)

To start a job execution using the Azure CLI, use the `az containerapp job start` command. The following example starts an execution of a job named `my-job` in a resource group named `my-resource-group`:

```azurecli
az containerapp job start --name my-job --resource-group my-resource-group
```

# [Azure Resource Manager](#tab/azure-resource-manager)

To start a job execution using the ARM REST API, make a *POST* request to the job's `start` operation. The following example starts an execution of a job named `my-job` in a resource group named `my-resource-group`:

```http
POST https://management.azure.com/subscriptions/<subscription_id>/resourceGroups/my-resource-group/providers/Microsoft.App/jobs/my-job/start?api-version=2022-11-01-preview
```

To authenticate the request, add an `Authorization` header with a valid bearer token. For more information, see [Azure REST API reference](/rest/api/azure).

---

## Next steps

> [!div class="nextstepaction"]
> [TBD](overview.md)
