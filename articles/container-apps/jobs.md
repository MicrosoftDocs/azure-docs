---
title: Jobs in Azure Container Apps (preview)
description: Learn about jobs in Azure Container Apps (preview)
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: build-2023
ms.topic: conceptual
ms.date: 05/08/2023
ms.author: cshoe
---

# Jobs in Azure Container Apps (preview)

Azure Container Apps jobs enable you to run containerized tasks that execute for a finite duration and exit. You can use jobs to perform tasks such as data processing, machine learning, or any scenario where on-demand processing is required.

Container apps and jobs run in the same [environment](environment.md), allowing them to share capabilities such as networking and logging.

## Compare container apps and jobs

There are two types of compute resources in Azure Container Apps: apps and jobs.

Apps are services that run continuously. If a container in an app fails, it's restarted automatically. Examples of apps include HTTP APIs, web apps, and background services that continuously process input.

Jobs are tasks that start, run for a finite duration, and exit when finished. Each execution of a job typically performs a single unit of work. Job executions start manually, on a schedule, or in response to events. Examples of jobs include batch processes that run on demand and scheduled tasks.

## Job trigger types

A job's trigger type determines how the job is started. The following trigger types are available:

- **Manual**: Manual jobs are triggered on-demand.
- **Schedule**:  Scheduled jobs are triggered at specific times and can run repeatedly.
- **Event**: Event-driven jobs are triggered by events such as a message arriving in a queue.

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
    --replica-timeout 1800 --replica-retry-limit 1 --replica-completion-count 1 --parallelism 1 \
    --image "mcr.microsoft.com/k8se/quickstart-jobs:latest" \
    --cpu "0.25" --memory "0.5Gi"
```

# [Azure Resource Manager](#tab/azure-resource-manager)

The following example Azure Resource Manager template creates a manual job named `my-job` in a resource group named `my-resource-group` and a Container Apps environment named `my-environment`:

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
            "replicaTimeout": 1800,
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

The `mcr.microsoft.com/k8se/quickstart-jobs:latest` image is a sample container image that runs a job that waits a few seconds, prints a message to the console, and then exits.

The above command only creates the job. To start a job execution, see [Start a job execution on demand](#start-a-job-execution-on-demand).

### Scheduled jobs

To create a scheduled job, use the job type `Schedule`.

Container Apps jobs use cron expressions to define schedules. It supports the standard [cron](https://en.wikipedia.org/wiki/Cron) expression format with five fields for minute, hour, day of month, month, and day of week. The following are examples of cron expressions:

| Expression | Description |
|---|---|
| `0 */2 * * *` | Runs every two hours. |
| `0 0 * * *` | Runs every day at midnight. |
| `0 0 * * 0` | Runs every Sunday at midnight. |
| `0 0 1 * *` | Runs on the first day of every month at midnight. |

Cron expressions in scheduled jobs are evaluated in Universal Time Coordinated (UTC).

# [Azure CLI](#tab/azure-cli)

To create a scheduled job using the Azure CLI, use the `az containerapp job create` command. The following example creates a scheduled job named `my-job` in a resource group named `my-resource-group` and a Container Apps environment named `my-environment`:

```azurecli
az containerapp job create \
    --name "my-job" --resource-group "my-resource-group"  --environment "my-environment" \
    --trigger-type "Schedule" \
    --replica-timeout 1800 --replica-retry-limit 1 --replica-completion-count 1 --parallelism 1 \
    --image "mcr.microsoft.com/k8se/quickstart-jobs:latest" \
    --cpu "0.25" --memory "0.5Gi" \
    --cron-expression "0 0 * * *"
```

# [Azure Resource Manager](#tab/azure-resource-manager)

The following example Azure Resource Manager template creates a manual job named `my-job` in a resource group named `my-resource-group` and a Container Apps environment named `my-environment`:

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
            "replicaTimeout": 1800,
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

The `mcr.microsoft.com/k8se/quickstart-jobs:latest` image is a sample container image that runs a job that waits a few seconds, prints a message to the console, and then exits.

The cron expression `0 0 * * *` runs the job every day at midnight UTC.

### Event-driven jobs

Event-driven jobs are triggered by events from supported [custom scalers](scale-app.md#custom). Examples of event-driven jobs include:

- A job that runs when a new message is added to a queue such as Azure Service Bus, Kafka, or RabbitMQ.
- A self-hosted GitHub Actions runner or Azure DevOps agent that runs when a new job is queued in a workflow or pipeline.

Container apps and event-driven jobs use [KEDA](https://keda.sh/) scalers. They both evaluate scaling rules on a polling interval to measure the volume of events for an event source, but the way they use the results is different.

In an app, each replica continuously processes events and a scaling rule determines the number of replicas to run to meet demand. In event-driven jobs, each job typically processes a single event, and a scaling rule determines the number of jobs to run.

Use jobs when each event requires a new instance of the container with dedicated resources or needs to run for a long time. Event-driven jobs are conceptually similar to [KEDA scaling jobs](https://keda.sh/docs/latest/concepts/scaling-jobs/).

To create an event-driven job, use the job type `Event`.

# [Azure CLI](#tab/azure-cli)

To create an event-driven job using the Azure CLI, use the `az containerapp job create` command. The following example creates an event-driven job named `my-job` in a resource group named `my-resource-group` and a Container Apps environment named `my-environment`:

```azurecli
az containerapp job create \
    --name "my-job" --resource-group "my-resource-group"  --environment "my-environment" \
    --trigger-type "Event" \
    --replica-timeout 1800 --replica-retry-limit 1 --replica-completion-count 1 --parallelism 1 \
    --image "docker.io/myuser/my-event-driven-job:latest" \
    --cpu "0.25" --memory "0.5Gi" \
    --min-executions "0" \
    --max-executions "10" \
    --scale-rule-name "queue" \
    --scale-rule-type "azure-queue" \
    --scale-rule-metadata "accountName=mystorage" "queueName=myqueue" "queueLength=1" \
    --scale-rule-auth "connection=connection-string-secret" \
    --secrets "connection-string-secret=<QUEUE_CONNECTION_STRING>"
```

# [Azure Resource Manager](#tab/azure-resource-manager)

The following example Azure Resource Manager template creates an event-driven job named `my-job` in a resource group named `my-resource-group` and a Container Apps environment named `my-environment`:

```json
{
    "location": "North Central US",
    "name": "my-job",
    "properties": {
        "configuration": {
            "eventTriggerConfig": {
                "maxExecutions": 10,
                "minExecutions": 0,
                "scale": {
                    "rules": [
                        {
                            "auth": {
                                "connection": "connection-string-secret"
                            },
                            "metadata": {
                                "accountName": "mystorage",
                                "queueLength": 1,
                                "queueName": "myqueue"
                            },
                            "name": "queue",
                            "type": "azure-queue"
                        }
                    ],
                }
            },
            "replicaRetryLimit": 1,
            "replicaTimeout": 1800,
            "triggerType": "Event",
            "secrets": [
                {
                    "name": "connection-string-secret",
                    "value": "<QUEUE_CONNECTION_STRING>"
                }
            ]
        },
        "environmentId": "/subscriptions/<subscription_id>/resourceGroups/my-resource-group/providers/Microsoft.App/managedEnvironments/my-environment",
        "template": {
            "containers": [
                {
                    "image": "docker.io/myuser/my-event-driven-job:latest",
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

The example configures an Azure Storage queue scale rule. For a complete tutorial, see [Deploy an event-driven job](tutorial-event-driven-jobs.md).

## Start a job execution on demand

For any job type, you can start a job execution on demand.

# [Azure CLI](#tab/azure-cli)

To start a job execution using the Azure CLI, use the `az containerapp job start` command. The following example starts an execution of a job named `my-job` in a resource group named `my-resource-group`:

```azurecli
az containerapp job start --name "my-job" --resource-group "my-resource-group"
```

# [Azure Resource Manager](#tab/azure-resource-manager)

To start a job execution using the Azure Resource Manager REST API, make a `POST` request to the job's `start` operation.

The following example starts an execution of a job named `my-job` in a resource group named `my-resource-group`:

```http
POST https://management.azure.com/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/my-resource-group/providers/Microsoft.App/jobs/my-job/start?api-version=2022-11-01-preview
Authorization: Bearer <TOKEN>
```

Replace `<SUBSCRIPTION_ID>` with your subscription ID.

To authenticate the request, replace `<TOKEN>` in the `Authorization` header with a valid bearer token. For more information, see [Azure REST API reference](/rest/api/azure).

---

When you start a job execution, you can choose to override the job's configuration. For example, you can override an environment variable or the startup command to pass specific data to the job.

# [Azure CLI](#tab/azure-cli)

Azure CLI doesn't support overriding a job's configuration when starting a job execution.

# [Azure Resource Manager](#tab/azure-resource-manager)

To override the job's configuration, include a template in the request body. The following example overrides the startup command to run a different command:

```http
POST https://management.azure.com/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/my-resource-group/providers/Microsoft.App/jobs/my-job/start?api-version=2022-11-01-preview
Content-Type: application/json
Authorization: Bearer <TOKEN>

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

Replace `<SUBSCRIPTION_ID>` with your subscription ID and `<TOKEN>` in the `Authorization` header with a valid bearer token. For more information, see [Azure REST API reference](/rest/api/azure).

---

## Get job execution history

Each Container Apps job maintains a history of recent job executions.

# [Azure CLI](#tab/azure-cli)

To get the statuses of job executions using the Azure CLI, use the `az containerapp job execution list` command. The following example returns the status of the most recent execution of a job named `my-job` in a resource group named `my-resource-group`:

```azurecli
az containerapp job execution list --name "my-job" --resource-group "my-resource-group"
```

# [Azure Resource Manager](#tab/azure-resource-manager)

To get the status of job executions using the Azure Resource Manager REST API, make a `GET` request to the job's `executions` operation. The following example returns the status of the most recent execution of a job named `my-job` in a resource group named `my-resource-group`:

```http
GET https://management.azure.com/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/my-resource-group/providers/Microsoft.App/jobs/my-job/executions?api-version=2022-11-01-preview
```

Replace `<SUBSCRIPTION_ID>` with your subscription ID.

To authenticate the request, add an `Authorization` header with a valid bearer token. For more information, see [Azure REST API reference](/rest/api/azure).

---

The execution history for scheduled & event-based jobs is limited to the most recent `100` successful and failed job executions.

To list all executions of a job or to get detailed output from a job, query the logs provider configured for your Container Apps environment.

## Advanced job configuration

Container Apps jobs support advanced configuration options such as container settings, retries, timeouts, and parallelism.

### Container settings

Container settings define the containers to run in each replica of a job execution. They include environment variables, secrets, and resource limits. For more information, see [Containers](containers.md).

### Job settings

The following table includes the job settings that you can configure:

| Setting | Azure Resource Manager property | CLI parameter| Description |
|---|---|---|---|
| Job type | `triggerType` | `--trigger-type` | The type of job. (`Manual`, `Schedule`, or `Event`) |
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

The following example Azure Resource Manager template creates a job with advanced configuration options:

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

## Jobs preview restrictions

The following features are not supported:

- Volume mounts
- Init containers
- Dapr
- Azure Key Vault references in secrets
- Ingress and related features such as custom domains and SSL certificates

## Next steps

> [!div class="nextstepaction"]
> [Create a job with Azure Container Apps](jobs-get-started-cli.md)
