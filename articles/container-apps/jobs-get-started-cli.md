---
title: Create a job with Azure Container Apps (preview)
description: Learn to create an on-demand or scheduled job in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: quickstart
ms.date: 04/12/2023
ms.author: cshoe
---

# Create a job with Azure Container Apps (preview)

Azure Container Apps [jobs](jobs.md) enable you to run containerized workloads that execute for a finite duration and exit. Jobs can be triggered manually or on a schedule. You can use jobs to perform tasks such as data processing, machine learning, and more.

In this quickstart, you'll create a manual or scheduled job.

## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli).
- See [Jobs preview limitations](jobs.md#jobs-preview-limitations) for a list of limitations.

## Setup

1. To sign in to Azure from the CLI, run the following command and follow the prompts to complete the authentication process.

    ```azurecli
    az login
    ```

1. Ensure you're running the latest version of the CLI via the upgrade command.

    ```azurecli
    az upgrade
    ```

1. Uninstall any existing versions of the Azure Container Apps extension for the CLI and install the latest version that supports the jobs preview.

    ```azurecli
    az extension remove --name containerapp
    az extension add --upgrade --source https://containerappextension.blob.core.windows.net/containerappcliext/containerapp-private_preview_jobs_1.0.5-py2.py3-none-any.whl --yes
    ```

    > [!NOTE]
    > Only use this version of the CLI extension for the jobs preview. To use the Azure CLI for other Container Apps scenarios, uninstall this version and install the latest public version of the extension.
    > 
    > ```azurecli
    > az extension remove --name containerapp
    > az extension add --name containerapp
    > ```

1. Register the `Microsoft.App` and `Microsoft.OperationalInsights` namespaces if you haven't already registered them in your Azure subscription.

    ```azurecli
    az provider register --namespace Microsoft.App
    az provider register --namespace Microsoft.OperationalInsights
    ```

1. Now that your Azure CLI setup is complete, you can define the environment variables that are used throughout this article.

    ```azurecli
    RESOURCE_GROUP="jobs-quickstart"
    LOCATION="northcentralus"
    ENVIRONMENT="env-jobs-quickstart"
    JOB_NAME="my-job"
    ```

    > [!NOTE]
    > The jobs preview is only supported in the East US 2 EUAP, North Central US, and Australia East regions.

## Create a Container Apps environment

The Azure Container Apps environment acts as a secure boundary that allows container apps and jobs in an environment to share the same network and communicate with each other.

1. Create a resource group using the following command.

    ```azurecli
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION"
    ```

1. Create the Container Apps environment using the following command.

    ```azurecli
    az containerapp env create \
        --name "$ENVIRONMENT" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION"
    ```

# [Manual job](#tab/manual)

## Create and run a manual job

To use manual jobs, you first create a job with trigger type `Manual` and then start an execution. You can start multiple executions of the same job and multiple job executions can run concurrently.

1. Create a job in the Container Apps environment using the following command.

    ```azurecli
    az containerapp job create \
        --name "$JOB_NAME" --resource-group "$RESOURCE_GROUP"  --environment "$ENVIRONMENT" \
        --trigger-type "Manual" \
        --replica-timeout 60 --replica-retry-limit 1 --replica-completion-count 1 --parallelism 1 \
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

# [Scheduled job](#tab/scheduled)

## Create and run a scheduled job

To use scheduled jobs, you create a job with trigger type `Schedule` and a cron expression that defines the schedule.

Create a job in the Container Apps environment that starts every minute using the following command.

```azurecli
az containerapp job create \
    --name "$JOB_NAME" --resource-group "$RESOURCE_GROUP"  --environment "$ENVIRONMENT" \
    --trigger-type "Schedule" \
    --replica-timeout 60 --replica-retry-limit 1 --replica-completion-count 1 --parallelism 1 \
    --image "mcr.microsoft.com/k8se/quickstart-jobs:latest" \
    --cpu "0.25" --memory "0.5Gi" \
    --cron-expression "*/1 * * * *"
```

Job executions start automatically based on the schedule.

Container Apps jobs use cron expressions to define schedules. It supports the standard [cron](https://en.wikipedia.org/wiki/Cron) expression format with five fields for minute, hour, day of month, month, and day of week.

---

## List recent job execution history

Container Apps jobs maintain a history of recent executions. You can list the executions of a job.

```azurecli
az containerapp job executionhistory \
    --name "$JOB_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --output json
```

Executions of scheduled jobs appear in the list when they're started by the schedule.

## Query job execution logs

Job executions output logs to the logging provider that you configured for the Container Apps environment. By default, logs are stored in Azure Log Analytics.

# [Manual job](#tab/manual)

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
    JOB_EXECUTION_NAME=`az containerapp job executionhistory \
        --name "$JOB_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --query "[0].name" \
        --output tsv`
    ```

1. Query Log Analytics for the job execution using the following command.

    ```azurecli
    az monitor log-analytics query \
        --workspace "$LOG_ANALYTICS_WORKSPACE_ID" \
        --analytics-query "ContainerAppConsoleLogs_CL | where ContainerGroupName_s startswith '$JOB_EXECUTION_NAME' | order by _timestamp_d asc" \
        --query "[].Log_s"
    ```

    It may take a few minutes for the logs to appear in Log Analytics. The following output is an example of the logs printed by the job execution.

    ```json
    [
        "2023/04/24 18:38:28 This is a sample application that demonstrates how to use Azure Container Apps jobs",
        "2023/04/24 18:38:28 Starting processing...",
        "2023/04/24 18:38:33 Finished processing. Shutting down!"
    ]
    ```

# [Scheduled job](#tab/scheduled)

Logs are currently unavailable for scheduled jobs.

---

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
