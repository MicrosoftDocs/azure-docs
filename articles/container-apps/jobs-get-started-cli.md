---
title: Create a Job in Azure Container Apps
description: Find out how to create and run an on-demand or scheduled job in Azure Container Apps. Also go through steps for checking the history and output logs of a job.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: build-2023, devx-track-azurecli
ms.topic: quickstart
ms.date: 11/17/2025
ms.author: cshoe
zone_pivot_groups: container-apps-job-types
# customer intent: As a developer, I want to find out how to create jobs in Azure Container Apps so that I can start containerized tasks on demand.
---

# Quickstart: Create a job in Azure Container Apps

In this quickstart, you create an Azure Container Apps [job](jobs.md). In Container Apps, jobs are used to start containerized tasks that run for a finite duration and then exit. Jobs are best suited for tasks such as data processing, machine learning, resource cleanup, or any scenario that requires on-demand processing.

You can trigger a job manually, schedule its run, or trigger its run based on events. This quickstart shows you how to create a manual or scheduled job. To find out how to create an event-driven job, see [Deploy an event-driven job with Azure Container Apps](tutorial-event-driven-jobs.md).

[!INCLUDE [container-apps-create-cli-steps-jobs.md](../../includes/container-apps-create-cli-steps-jobs.md)]

::: zone pivot="container-apps-job-manual"

## Create and run a manual job

To use manual jobs, you first create a job with a trigger type of `Manual` and then start its run. You can start multiple runs of the same job, and multiple job executions can run concurrently.

1. Create a job in the Container Apps environment by using the following command.

    ```azurecli
    az containerapp job create \
        --name "$JOB_NAME" --resource-group "$RESOURCE_GROUP"  --environment "$ENVIRONMENT" \
        --trigger-type "Manual" \
        --replica-timeout 1800 \
        --image "mcr.microsoft.com/k8se/quickstart-jobs:latest" \
        --cpu "0.25" --memory "0.5Gi"
    ```

    Manual jobs don't run automatically. You must start each job.

1. Start the job by using the following command.

    ```azurecli
    az containerapp job start \
        --name "$JOB_NAME" \
        --resource-group "$RESOURCE_GROUP"
    ```

    The command returns detailed information about the job run, including its name.

::: zone-end

::: zone pivot="container-apps-job-scheduled"

## Create and run a scheduled job

To use scheduled jobs, you create a job with a trigger type of `Schedule` and a `cron` expression that defines the schedule.

Use the following command to create a Container Apps job that starts every minute.

```azurecli
az containerapp job create \
    --name "$JOB_NAME" --resource-group "$RESOURCE_GROUP"  --environment "$ENVIRONMENT" \
    --trigger-type "Schedule" \
    --replica-timeout 1800 \
    --image "mcr.microsoft.com/k8se/quickstart-jobs:latest" \
    --cpu "0.25" --memory "0.5Gi" \
    --cron-expression "*/1 * * * *"
```

The job runs start automatically based on the schedule.

Container Apps jobs use `cron` expressions to define schedules. Jobs support the standard [cron](https://en.wikipedia.org/wiki/Cron) expression format, which contains fields for the minute, hour, day of month, month, and day of week.

::: zone-end

## List recent job run history

Container Apps jobs maintain a history of recent runs. You can list the runs of a job.

```azurecli
az containerapp job execution list \
    --name "$JOB_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --output table \
    --query '[].{Status: properties.status, Name: name, StartTime: properties.startTime}'
```

Jobs appear in the list as they run.

```console
Status     Name            StartTime
---------  --------------  -------------------------
Succeeded  my-job-jvsgub6  2025-11-17T21:21:45+00:00
```

## Query job run logs

Job runs write output logs to the logging provider that you configure for the Container Apps environment. By default, logs are stored in Log Analytics.

1. Save the Log Analytics workspace ID for the Container Apps environment to a variable.

    ```azurecli
    LOG_ANALYTICS_WORKSPACE_ID=$(az containerapp env show \
        --name "$ENVIRONMENT" \
        --resource-group "$RESOURCE_GROUP" \
        --query "properties.appLogsConfiguration.logAnalyticsConfiguration.customerId" \
        --output tsv)
    ```

1. Save the name of the most recent job run to a variable.

    ```azurecli
    JOB_RUN_NAME=$(az containerapp job execution list \
        --name "$JOB_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --query "[0].name" \
        --output tsv)
    ```

1. Run a Log Analytics query for the job run by using the following command.

    ```azurecli
    az monitor log-analytics query \
        --workspace "$LOG_ANALYTICS_WORKSPACE_ID" \
        --analytics-query "ContainerAppConsoleLogs_CL | where ContainerGroupName_s startswith '$JOB_RUN_NAME' | order by _timestamp_d asc" \
        --query "[].Log_s"
    ```

    > [!NOTE]
    > Until the **ContainerAppConsoleLogs_CL** table is ready, the command returns no results, or it returns the following error: "BadArgumentError: The request had some invalid properties." In either case, wait a few minutes and then run the command again.

    The following output is an example of the logs printed by the job run.

    ```console
    [
        "2025/11/17 18:38:28 This is a sample application that demonstrates how to use Azure Container Apps jobs",
        "2025/11/17 18:38:28 Starting processing...",
        "2025/11/17 18:38:33 Finished processing. Shutting down!"
    ]
    ```

## Clean up resources

If you're not going to continue to use this job, run the following command to delete the resource group and all the resources from this quickstart.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this quickstart exist in the specified resource group, they're also deleted.

```azurecli
az group delete --name "$RESOURCE_GROUP"
```

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps/issues).

## Next step

> [!div class="nextstepaction"]
> [Jobs in Azure Container Apps](jobs.md)
