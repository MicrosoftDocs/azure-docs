---
title: 'Tutorial: Deploy an event-driven job with Azure Container Apps'
description: Learn to create a job that processes queue messages with Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: build-2023, devx-track-azurecli
ms.topic: conceptual
ms.date: 12/09/2024
ms.author: cshoe
---

# Tutorial: Deploy an event-driven job with Azure Container Apps

Azure Container Apps [jobs](jobs.md) allow you to run containerized tasks that execute for a finite duration and exit. You can trigger a job execution manually, on a schedule, or based on events. Jobs are best suited to for tasks such as data processing, machine learning, resource cleanup, or any scenario that requires serverless ephemeral compute resources.

In this tutorial, you learn how to work with [event-driven jobs](jobs.md#event-driven-jobs).

> [!div class="checklist"]
> * Create a Container Apps environment to deploy your container apps
> * Create an Azure Storage Queue to send messages to the container app
> * Build a container image that runs a job
> * Deploy the job to the Container Apps environment
> * Verify that the queue messages are processed by the container app

The job you create starts an execution for each message that is sent to an Azure Storage queue. Each job execution runs a container that performs the following steps:

1. Gets one message from the queue.
1. Logs the message to the job execution logs.
1. Deletes the message from the queue.
1. Exits.

> [!IMPORTANT]
> The scaler monitors the queue's length to determine how many jobs to start. For accurate scaling, don't delete a message from the queue until the job execution has finished processing it.

The source code for the job you run in this tutorial is available in an Azure Samples [GitHub repository](https://github.com/Azure-Samples/container-apps-event-driven-jobs-tutorial/blob/main/index.js).

[!INCLUDE [container-apps-create-cli-steps-jobs.md](../../includes/container-apps-create-cli-steps-jobs.md)]

## Set up a storage queue

The job uses an Azure Storage queue to receive messages. In this section, you create a storage account and a queue.

1. Define a name for your storage account.

    ```bash
    STORAGE_ACCOUNT_NAME="<STORAGE_ACCOUNT_NAME>"
    QUEUE_NAME="myqueue"
    ```

    Replace `<STORAGE_ACCOUNT_NAME>` with a unique name for your storage account. Storage account names must be *unique within Azure* and be from 3 to 24 characters in length containing numbers and lowercase letters only.

1. Create an Azure Storage account.

    ```azurecli
    az storage account create \
        --name "$STORAGE_ACCOUNT_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --sku Standard_LRS \
        --kind StorageV2
    ```

    If this command returns the error:

    ```
    (SubscriptionNotFound) Subscription <SUBSCRIPTION_ID> was not found.
    Code: SubscriptionNotFound
    Message: Subscription <SUBSCRIPTION_ID> was not found.
    ```

    Be sure you have registered the `Microsoft.Storage` namespace in your Azure subscription.

    ```azurecli
    az provider register --namespace Microsoft.Storage
    ```

1. Save the queue's connection string into a variable.

    ```bash
    QUEUE_CONNECTION_STRING=$(az storage account show-connection-string -g $RESOURCE_GROUP --name $STORAGE_ACCOUNT_NAME --query connectionString --output tsv)
    ```

1. Create the message queue.

    ```azurecli
    az storage queue create \
        --name "$QUEUE_NAME" \
        --account-name "$STORAGE_ACCOUNT_NAME" \
        --connection-string "$QUEUE_CONNECTION_STRING"
    ```

## Create a user-assigned managed identity

To avoid using administrative credentials, pull images from private repositories in Microsoft Azure Container Registry using managed identities for authentication. When possible, use a user-assigned managed identity to pull images.

1. Create a user-assigned managed identity. Before you run the following commands, choose a name for your managed identity and replace the `\<PLACEHOLDER\>` with the name.

    ```bash
    IDENTITY="<YOUR_IDENTITY_NAME>"
    ```

    ```azurecli
    az identity create \
        --name $IDENTITY \
        --resource-group $RESOURCE_GROUP
    ```

1. Get the identity's resource ID.

    ```azurecli
    IDENTITY_ID=$(az identity show \
        --name $IDENTITY \
        --resource-group $RESOURCE_GROUP \
        --query id \
        --output tsv)
    ```

## Build and deploy the job

To deploy the job, you must first build a container image for the job and push it to a registry. Then, you can deploy the job to the Container Apps environment.

1. Define a name for your container image and registry.

    ```bash
    CONTAINER_IMAGE_NAME="queue-reader-job:1.0"
    CONTAINER_REGISTRY_NAME="<CONTAINER_REGISTRY_NAME>"
    ```

    Replace `<CONTAINER_REGISTRY_NAME>` with a unique name for your container registry. Container registry names must be *unique within Azure* and be from 5 to 50 characters in length containing numbers and lowercase letters only.

1. Create a container registry.

    ```azurecli
    az acr create \
        --name "$CONTAINER_REGISTRY_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --sku Basic
    ```

1. Your container registry must allow Azure Resource Manager (ARM) audience tokens for authentication in order to use managed identity to pull images.

    Use the following command to check if ARM tokens are allowed to access your Azure Container Registry (ACR).

    ```azurecli
    az acr config authentication-as-arm show --registry "$CONTAINER_REGISTRY_NAME"
    ```

    If ARM tokens are allowed, the command outputs the following.
    
    ```
    {
      "status": "enabled"
    }
    ```

    If the `status` is `disabled`, allow ARM tokens with the following command.

    ```azurecli
    az acr config authentication-as-arm update --registry "$CONTAINER_REGISTRY_NAME" --status enabled
    ```

1. The source code for the job is available on [GitHub](https://github.com/Azure-Samples/container-apps-event-driven-jobs-tutorial). Run the following command to clone the repository and build the container image in the cloud using the `az acr build` command.

    ```azurecli
    az acr build \
        --registry "$CONTAINER_REGISTRY_NAME" \
        --image "$CONTAINER_IMAGE_NAME" \
        "https://github.com/Azure-Samples/container-apps-event-driven-jobs-tutorial.git"
    ```

    The image is now available in the container registry.

1. Create a job in the Container Apps environment.

    ```azurecli
    az containerapp job create \
        --name "$JOB_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --environment "$ENVIRONMENT" \
        --trigger-type "Event" \
        --replica-timeout "1800" \
        --min-executions "0" \
        --max-executions "10" \
        --polling-interval "60" \
        --scale-rule-name "queue" \
        --scale-rule-type "azure-queue" \
        --scale-rule-metadata "accountName=$STORAGE_ACCOUNT_NAME" "queueName=$QUEUE_NAME" "queueLength=1" \
        --scale-rule-auth "connection=connection-string-secret" \
        --image "$CONTAINER_REGISTRY_NAME.azurecr.io/$CONTAINER_IMAGE_NAME" \
        --cpu "0.5" \
        --memory "1Gi" \
        --secrets "connection-string-secret=$QUEUE_CONNECTION_STRING" \
        --registry-server "$CONTAINER_REGISTRY_NAME.azurecr.io" \
        --mi-user-assigned "$IDENTITY_ID" \
        --registry-identity "$IDENTITY_ID" \
        --env-vars "AZURE_STORAGE_QUEUE_NAME=$QUEUE_NAME" "AZURE_STORAGE_CONNECTION_STRING=secretref:connection-string-secret"
    ```

    The following table describes the key parameters used in the command.

    | Parameter | Description |
    | --- | --- |
    | `--replica-timeout` | The maximum duration a replica can execute. |
    | `--min-executions` | The minimum number of job executions to run per polling interval. |
    | `--max-executions` | The maximum number of job executions to run per polling interval. |
    | `--polling-interval` | The polling interval at which to evaluate the scale rule. |
    | `--scale-rule-name` | The name of the scale rule. |
    | `--scale-rule-type` | The type of scale rule to use. |
    | `--scale-rule-metadata` | The metadata for the scale rule. |
    | `--scale-rule-auth` | The authentication for the scale rule. |
    | `--secrets` | The secrets to use for the job. |
    | `--registry-server` | The container registry server to use for the job. For an Azure Container Registry, the command automatically configures authentication. |
    | `--mi-user-assigned` | The resource ID of the user-assigned managed identity to assign to the job. |
    | `--registry-identity` | The resource ID of a managed identity to authenticate with the registry server instead of using a username and password. If possible, an 'acrpull' role assignment is created for the identity automatically. |
    | `--env-vars` | The environment variables to use for the job. |

    The scale rule configuration defines the event source to monitor. It is evaluated on each polling interval and determines how many job executions to trigger. To learn more, see [Set scaling rules](scale-app.md).

The event-driven job is now created in the Container Apps environment. 

## Verify the deployment

The job is configured to evaluate the scale rule every 60 seconds, which checks the number of messages in the queue. For each evaluation period, it starts a new job execution for each message in the queue, up to a maximum of 10 executions.

To verify the job was configured correctly, you can send some messages to the queue, confirm that job executions are started, and the messages are logged to the job execution logs.

1. Send a message to the queue.

    ```azurecli
    az storage message put \
        --content "Hello Queue Reader Job" \
        --queue-name "$QUEUE_NAME" \
        --connection-string "$QUEUE_CONNECTION_STRING"
    ```

1. List the executions of a job.

    ```azurecli
    az containerapp job execution list \
        --name "$JOB_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --output json
    ```

    Since the job is configured to evaluate the scale rule every 60 seconds, it may take up to a full minute for the job execution to start. Repeat the command until you see the job execution and its status is `Succeeded`.

1. Run the following commands to see logged messages. These commands require the Log analytics extension, so accept the prompt to install extension when requested.

    ```azurecli
    LOG_ANALYTICS_WORKSPACE_ID=$(az containerapp env show --name $ENVIRONMENT --resource-group $RESOURCE_GROUP --query properties.appLogsConfiguration.logAnalyticsConfiguration.customerId --output tsv)

    az monitor log-analytics query \
        --workspace "$LOG_ANALYTICS_WORKSPACE_ID" \
        --analytics-query "ContainerAppConsoleLogs_CL | where ContainerJobName_s == '$JOB_NAME' | order by _timestamp_d asc"
    ```

    Until the `ContainerAppConsoleLogs_CL` table is ready, the command returns an error: `BadArgumentError: The request had some invalid properties`. Wait a few minutes and try again.

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Clean up resources

Once you're done, run the following command to delete the resource group that contains your Container Apps resources.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this tutorial exist in the specified resource group, they will also be deleted.

```azurecli
az group delete \
    --resource-group $RESOURCE_GROUP
```

## Next steps

> [!div class="nextstepaction"]
> [Container Apps jobs](jobs.md)
