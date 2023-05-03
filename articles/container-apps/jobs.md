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

Azure Container Apps jobs enable you to run containerized workloads that execute for a finite duration and exit. You can use jobs to perform tasks such as data processing, machine learning, and more.

## Compare container apps and jobs

Container apps are services that run until continuously. If a replica fails, it's restarted automatically. Examples of container apps include web apps, APIs, and background services that continuously process messages from a queue.

Container Apps jobs are tasks that start, run for a finite duration, and exit when finished. A job execution typically performs a single unit of work. Job executions start manually or on a schedule and are complete when its replicas exit. Examples of jobs include on-demand batch processing and scheduled tasks. You can query job executions and their statuses.

## Jobs preview limitations

The jobs preview has the following limitations:

- Only supported in the East US 2 EUAP, North Central US, and Australia East regions
- Only supported in the Azure CLI using a preview version of the Azure Container Apps extension

    Uninstall any existing versions of the Azure Container Apps extension for the CLI and install the latest version that supports the jobs preview.

    ```azurecli
    az extension remove --name containerapp
    az extension add --upgrade --source https://containerappextension.blob.core.windows.net/containerappcliext/containerapp-private_preview_jobs_1.0.5-py2.py3-none-any.whl --yes
    ```
    
- Only supported in the Consumption plan
- Logs are currently unavailable for scheduled jobs

## Job trigger types

A job's trigger type determines how the job is started. The following trigger types are available:

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
    --trigger-type "Manual" \
    --replica-timeout 60 --replica-retry-limit 1 --replica-completion-count 1 --parallelism 1 \
    --image "mcr.microsoft.com/k8se/quickstart-jobs:latest" \
    --cpu "0.25" --memory "0.5Gi"
```

# [Azure Resource Manager](#tab/azure-resource-manager)

The following example ARM template creates a manual job named `my-job` in a resource group named `my-resource-group` and a Container Apps environment named `my-environment`:

```json
{
    "location": "North Central US",
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

The above command only creates the job. To start a job execution, see [Start a job execution on demand](#start-a-job-execution-on-demand).

### Scheduled jobs

Scheduled jobs are triggered on a schedule. To create a scheduled job, use the job type `Schedule`.

Container Apps jobs use cron expressions to define schedules. It supports the standard [cron](https://en.wikipedia.org/wiki/Cron) expression format with five fields for minute, hour, day of month, month, and day of week. The following are examples of cron expressions:

- `0 */2 * * *` – run every two hours.
- `0 0 * * *` – run every day at midnight.
- `0 0 * * 0` – run every Sunday at midnight.
- `0 0 1 * *` – run on the first day of every month at midnight.

Cron expressions in scheduled jobs are evaluated in Universal Time Coordinated (UTC).

# [Azure CLI](#tab/azure-cli)

To create a scheduled job using the Azure CLI, use the `az containerapp job create` command. The following example creates a scheduled job named `my-job` in a resource group named `my-resource-group` and a Container Apps environment named `my-environment`:

```azurecli
az containerapp job create \
    --name "my-job" --resource-group "my-resource-group"  --environment "my-environment" \
    --trigger-type "Schedule" \
    --replica-timeout 60 --replica-retry-limit 1 --replica-completion-count 1 --parallelism 1 \
    --image "mcr.microsoft.com/k8se/quickstart-jobs:latest" \
    --cpu "0.25" --memory "0.5Gi" \
    --cron-expression "0 0 * * *"
```

# [Azure Resource Manager](#tab/azure-resource-manager)

The following example ARM template creates a manual job named `my-job` in a resource group named `my-resource-group` and a Container Apps environment named `my-environment`:

```json
{
    "location": "North Central US",
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
az containerapp job start --name "my-job" --resource-group "my-resource-group"
```

# [Azure Resource Manager](#tab/azure-resource-manager)

To start a job execution using the ARM REST API, make a *POST* request to the job's `start` operation. The following example starts an execution of a job named `my-job` in a resource group named `my-resource-group`:

```http
POST https://management.azure.com/subscriptions/<subscription_id>/resourceGroups/my-resource-group/providers/Microsoft.App/jobs/my-job/start?api-version=2022-11-01-preview
Authorization: Bearer <token>
```

Replace `<subscription_id>` with your subscription ID.

To authenticate the request, replace `<token>` in the `Authorization header with a valid bearer token. For more information, see [Azure REST API reference](/rest/api/azure).

---

When starting a job execution, you can optionally override the job's configuration. For example, you can override an environment variable or the startup commmand to pass data that is specific to the execution you're starting.

# [Azure CLI](#tab/azure-cli)

Azure CLI doesn't support overriding a job's configuration when starting a job execution.

# [Azure Resource Manager](#tab/azure-resource-manager)

To override the job's configuration, include a template in the request body. The following example overrides the startup command to run a different command:

```http
POST https://management.azure.com/subscriptions/<subscription_id>/resourceGroups/my-resource-group/providers/Microsoft.App/jobs/my-job/start?api-version=2022-11-01-preview
Content-Type: application/json
Authorization: Bearer <token>

{
    "template": {
        "containers": [
            {
                "image": "mcr.microsoft.com/k8se/quickstart-jobs:latest",
                "name": "main",
                "resources": {
                    "cpu": 0.25,
                    "memory": "0.5Gi"
                },
                "command": [
                    "echo",
                    "Hello, Azure Container Apps jobs!"
                ]
            }
        ]
    }
}
```

Replace `<subscription_id>` with your subscription ID and `<token>` in the `Authorization header with a valid bearer token. For more information, see [Azure REST API reference](/rest/api/azure).

---

## Get job execution history

Each Container Apps job maintains a history of recent job executions.

# [Azure CLI](#tab/azure-cli)

To get the statuses of job executions using the Azure CLI, use the `az containerapp job executionhistory` command. The following example gets the status of the most recent execution of a job named `my-job` in a resource group named `my-resource-group`:

```azurecli
az containerapp job executionhistory --name "my-job" --resource-group "my-resource-group"
```

# [Azure Resource Manager](#tab/azure-resource-manager)

To get the statuses of job executions using the ARM REST API, make a *GET* request to the job's `executions` operation. The following example gets the status of the most recent execution of a job named `my-job` in a resource group named `my-resource-group`:

```http
GET https://management.azure.com/subscriptions/<subscription_id>/resourceGroups/my-resource-group/providers/Microsoft.App/jobs/my-job/executions?api-version=2022-11-01-preview
```

Replace `<subscription_id>` with your subscription ID.

To authenticate the request, add an `Authorization` header with a valid bearer token. For more information, see [Azure REST API reference](/rest/api/azure).

---

To list all executions of a job or to get detailed output from a job, query the logs provider configured for your Container Apps environment.

## Advanced job configuration

Container Apps jobs support advanced configuration options such as container settings, retries, timeouts, and parallelism.

### Container settings

Container settings define the containers to run in each replica of a job execution. They include environment variables, secrets, and resource limits. For more information, see [Containers](containers.md).

### Job settings

The following table includes the job settings that you can configure:

| Setting | ARM property | CLI parameter| Description |
|---|---|---|---|
| Job type | `triggerType` | `--trigger-type` | The type of job. (`Manual` or `Schedule`) |
| Parallelism | `parallelism` | `--parallelism` | The number of replicas to run per execution. |
| Replica completion count | `replicaCompletionCount` | `--replica-completion-count` | The number of replicas to complete successfully for the execution to succeed. |
| Replica timeout | `replicaTimeout` | `--replica-timeout` | The maximum time in seconds to wait for a replica to complete. |
| Replica retry limit | `replicaRetryLimit` | `--replica-retry-limit` | The maximum number of times to retry a failed replica. |

### Example

# [Azure CLI](#tab/azure-cli)

The following example creates a job with advanced configuration options:

```azurecli
az containerapp job create \
    --name "my-job" --resource-group "my-resource-group"  --environment "my-environment" \
    --trigger-type "Schedule" \
    --replica-timeout 1800 --replica-retry-limit 3 --replica-completion-count 5 --parallelism 5 \
    --image "myregistry.azurecr.io/quickstart-jobs:latest" \
    --cpu "0.25" --memory "0.5Gi" \
    --command "/startup.sh" \
    --env-vars "MY_ENV_VAR=my-value" \
    --cron-expression "0 0 * * *"  \
    --registry-server "myregistry.azurecr.io" \
    --registry-username "myregistry" \
    --registry-password "myregistrypassword"
```

# [Azure Resource Manager](#tab/azure-resource-manager)

The following example ARM template creates a job with advanced configuration options:

```json
{
    "location": "North Central US",
    "name": "my-job",
    "properties": {
        "configuration": {
            "scheduleTriggerConfig": {
                "cronExpression": "0 0 * * *",
                "parallelism": 5,
                "replicaCompletionCount": 5
            },
            "replicaRetryLimit": 3,
            "replicaTimeout": 1800,
            "triggerType": "Schedule",
            "secrets": [
                {
                    "name": "registry-password",
                    "value": "myregistrypassword"
                }
            ]
            "registries": [
                {
                    "server": "myregistry.azurecr.io",
                    "username": "myregistry",
                    "passwordSecretRef": "registry-password"
                }
            ]
        },
        "environmentId": "/subscriptions/<subscription_id>/resourceGroups/my-resource-group/providers/Microsoft.App/managedEnvironments/my-environment",
        "template": {
            "containers": [
                {
                    "command": [
                        "/startup.sh"
                    ],
                    "cpu": 0.25,
                    "envVars": [
                        {
                            "name": "MY_ENV_VAR",
                            "value": "my-value"
                        }
                    ],
                    "image": "myregistry.azurecr.io/quickstart-jobs:latest",
                    "memory": "0.5Gi",
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

## Next steps

> [!div class="nextstepaction"]
> [Create a job with Azure Container Apps](jobs-get-started-cli.md)
