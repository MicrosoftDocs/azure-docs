---
title: Create a job with Azure Container Apps
description: Learn to create an on-demand or scheduled job in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: build-2023, devx-track-azurecli
ms.topic: quickstart
ms.date: 08/17/2023
ms.author: cshoe
zone_pivot_groups: container-apps-job-types
---

# Create a job with Azure Container Apps

Azure Container Apps [jobs](jobs.md) allow you to run containerized tasks that execute for a finite duration and exit. You can trigger a job manually, schedule their execution, or trigger their execution based on events.

Jobs are best suited to for tasks such as data processing, machine learning, or any scenario that requires on-demand processing.

In this quickstart, you create a manual or scheduled job. To learn how to create an event-driven job, see [Deploy an event-driven job with Azure Container Apps](tutorial-event-driven-jobs.md).

[!INCLUDE [container-apps-create-cli-steps-jobs.md](../../includes/container-apps-create-cli-steps-jobs.md)]

::: zone pivot="container-apps-job-manual"

## Create and run a manual job

To use manual jobs, you first create a job with trigger type `Manual` and then start an execution. You can start multiple executions of the same job and multiple job executions can run concurrently.

1. Create a job in the Container Apps environment using the following command.

    ```azurecli
    az containerapp job create \
        --name "$JOB_NAME" --resource-group "$RESOURCE_GROUP"  --environment "$ENVIRONMENT" \
        --trigger-type "Manual" \
        --replica-timeout 1800 --replica-retry-limit 1 --replica-completion-count 1 --parallelism 1 \
        --image "mcr.microsoft.com/k8se/quickstart-jobs:latest" \
        --cpu "0.25" --memory "0.5Gi"
    ```

    Manual jobs don't execute automatically. You must start an execution of the job.

1. Start an execution of the job using the following command.

    ```azurecli
    az containerapp job start \
        --name "$JOB_NAME" \
        --resource-group "$RESOURCE_GROUP"
    ```

    The command returns details of the job execution, including its name.

::: zone-end

::: zone pivot="container-apps-job-scheduled"

## Create and run a scheduled job

To use scheduled jobs, you create a job with trigger type `Schedule` and a cron expression that defines the schedule.

Create a job in the Container Apps environment that starts every minute using the following command.

```azurecli
az containerapp job create \
    --name "$JOB_NAME" --resource-group "$RESOURCE_GROUP"  --environment "$ENVIRONMENT" \
    --trigger-type "Schedule" \
    --replica-timeout 1800 --replica-retry-limit 1 --replica-completion-count 1 --parallelism 1 \
    --image "mcr.microsoft.com/k8se/quickstart-jobs:latest" \
    --cpu "0.25" --memory "0.5Gi" \
    --cron-expression "*/1 * * * *"
```

Job executions start automatically based on the schedule.

Container Apps jobs use cron expressions to define schedules. It supports the standard [cron](https://en.wikipedia.org/wiki/Cron) expression format with five fields for minute, hour, day of month, month, and day of week.

::: zone-end

## List recent job execution history

Container Apps jobs maintain a history of recent executions. You can list the executions of a job.

```azurecli
az containerapp job execution list \
    --name "$JOB_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --output table \
    --query '[].{Status: properties.status, Name: name, StartTime: properties.startTime}'
```

Executions of scheduled jobs appear in the list as they run.

```console
Status     Name            StartTime
---------  --------------  -------------------------
Succeeded  my-job-jvsgub6  2023-05-08T21:21:45+00:00
```

## Query job execution logs

Job executions output logs to the logging provider that you configured for the Container Apps environment. By default, logs are stored in Azure Log Analytics.

1. Save the Log Analytics workspace ID for the Container Apps environment to a variable.

    ```azurecli
    LOG_ANALYTICS_WORKSPACE_ID=`az containerapp env show \
        --name "$ENVIRONMENT" \
        --resource-group "$RESOURCE_GROUP" \
        --query "properties.appLogsConfiguration.logAnalyticsConfiguration.customerId" \
        --output tsv`
    ```

1. Save the name of the most recent job execution to a variable.

    ```azurecli
    JOB_EXECUTION_NAME=`az containerapp job execution list \
        --name "$JOB_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --query "[0].name" \
        --output tsv`
    ```

1. Run a query against Log Analytics for the job execution using the following command.

    ```azurecli
    az monitor log-analytics query \
        --workspace "$LOG_ANALYTICS_WORKSPACE_ID" \
        --analytics-query "ContainerAppConsoleLogs_CL | where ContainerGroupName_s startswith '$JOB_EXECUTION_NAME' | order by _timestamp_d asc" \
        --query "[].Log_s"
    ```

    > [!NOTE]
    > Until the `ContainerAppConsoleLogs_CL` table is ready, the command returns no results or with an error: `BadArgumentError: The request had some invalid properties`. Wait a few minutes and run the command again.

    The following output is an example of the logs printed by the job execution.

    ```json
    [
        "2023/04/24 18:38:28 This is a sample application that demonstrates how to use Azure Container Apps jobs",
        "2023/04/24 18:38:28 Starting processing...",
        "2023/04/24 18:38:33 Finished processing. Shutting down!"
    ]
    ```

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this quickstart.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this quickstart exist in the specified resource group, they will also be deleted.

```azurecli
az group delete --name "$RESOURCE_GROUP"
```

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps/issues).

## Next steps

> [!div class="nextstepaction"]
> [Container Apps jobs](jobs.md)
