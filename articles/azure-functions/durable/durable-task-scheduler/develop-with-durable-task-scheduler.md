---
title: Develop with Durable Task Scheduler (preview)
description: Learn how to develop with the Durable Task Scheduler using the Azure CLI for both Durable Functions and Durable Task Scheduler.
ms.topic: how-to
ms.date: 05/06/2025
zone_pivot_groups: dts-devexp
---

# Develop with Durable Task Scheduler (preview)

The Durable Task Scheduler is a highly performant, fully managed backend provider for Durable Functions with an [out-of-the-box monitoring dashboard](./durable-task-scheduler-dashboard.md). Azure offers two developer-oriented orchestration frameworks that work with Durable Functions to build apps: Durable Task SDKs and Durable Functions. 

In this article, you learn to:

> [!div class="checklist"]
> * Run the Durable Task Scheduler emulator
> * Perform CRUD operations on a scheduler and task hub. 

Learn more about Durable Task Scheduler [features](./durable-task-scheduler.md#feature-highlights), [supported regions](./durable-task-scheduler.md#limitations-and-considerations), and [plans](./durable-task-scheduler.md#limitations-and-considerations).

## Durable Task Scheduler emulator

The Durable Task Scheduler emulator is only available as a Docker image today. 

1. Pull the docker image containing the emulator. 

   ```bash
   docker pull mcr.microsoft.com/dts/dts-emulator:latest
   ```

1. Run the emulator.

   ```bash
   docker run -itP mcr.microsoft.com/dts/dts-emulator:latest
   ```

    This command exposes a single task hub named `default`. If you need more than one task hub, you can set the environment variable `DTS_TASK_HUB_NAMES` on the container to a comma-delimited list of task hub names like in the following command:

    ```bash
    docker run -itP -e DTS_TASK_HUB_NAMES=taskhub1,taskhub2,taskhub3 mcr.microsoft.com/dts/dts-emulator:latest
    ```

::: zone pivot="az-cli" 

## Prerequisites

- [The latest version of the Azure CLI.](/cli/azure/install-azure-cli) 

## Set up the CLI

1. Log in to the Azure CLI and make sure you have the latest installed.

    ```azurecli
    az login
    az upgrade
    ```

1. Install the Durable Task Scheduler CLI extension.

    ```azurecli
    az extension add --name durabletask
    ```

1. If you already installed the Durable Task Scheduler CLI extension, upgrade to the latest version.

    ```azurecli
    az extension add --upgrade --name durabletask
    ```
::: zone-end 

## Create a scheduler and task hub

::: zone pivot="az-cli" 
1. Create a resource group.

    ```azurecli
    az group create --name YOUR_RESOURCE_GROUP --location LOCATION
    ```

1. Using the `durabletask` CLI extension, create a scheduler.

    ```azurecli
    az durabletask scheduler create --name "YOUR_SCHEDULER" --resource-group "YOUR_RESOURCE_GROUP" --location "LOCATION" --ip-allowlist "[0.0.0.0/0]" --sku-name "dedicated" --sku-capacity "1"
    ```

    The creation process may take up to 15 minutes to complete.

    *Output*

    ```json
    {
        "id": "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/YOUR_RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/YOUR_SCHEDULER",
        "location": "northcentralus",
        "name": "YOUR_SCHEDULER",
        "properties": {
            "endpoint": "https://YOUR_SCHEDULER.northcentralus.durabletask.io",
            "ipAllowlist": [
                "0.0.0.0/0"
            ],
            "provisioningState": "Succeeded",
            "sku": {
                "capacity": 1,
                "name": "Dedicated",
                "redundancyState": "None"
            }
        },
        "resourceGroup": "YOUR_RESOURCE_GROUP",
        "systemData": {
            "createdAt": "2025-01-06T21:22:59Z",
            "createdBy": "YOUR_EMAIL@example.com",
            "createdByType": "User",
            "lastModifiedAt": "2025-01-06T21:22:59Z",
            "lastModifiedBy": "YOUR_EMAIL@example.com",
            "lastModifiedByType": "User"
        },
        "tags": {}
    }
    ```

1. Create a task hub.

    ```azurecli
    az durabletask taskhub create --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER --name YOUR_TASKHUB
    ```

    *Output*

    ```json
    {
      "id": "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/YOUR_RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/YOUR_SCHEDULERS/taskHubs/YOUR_TASKHUB",
      "name": "YOUR_TASKHUB",
      "properties": {
        "provisioningState": "Succeeded"
      },
      "resourceGroup": "YOUR_RESOURCE_GROUP",
      "systemData": {
        "createdAt": "2024-09-18T22:13:56.5467094Z",
        "createdBy": "OBJECT_ID",
        "createdByType": "User",
        "lastModifiedAt": "2024-09-18T22:13:56.5467094Z",
        "lastModifiedBy": "OBJECT_ID",
        "lastModifiedByType": "User"
      },
      "type": "microsoft.durabletask/scheduler/taskhubs"
    }
    ```
::: zone-end 

::: zone pivot="az-portal"

1. In the Azure portal, search for **Durable Task Scheduler** and select it from the results. 

    :::image type="content" source="media/create-durable-task-scheduler/search-for-durable-task-scheduler.png" alt-text="Screenshot of searching for the Durable Task Scheduler in the portal.":::

1. Click **Create** to open the **Azure Functions: Durable Task Scheduler (preview)** pane.

    :::image type="content" source="media/create-durable-task-scheduler/top-level-create-form.png" alt-text="Screenshot of the create page for the Durable Task Scheduler.":::

1. Fill out the fields in the **Basics** tab. Click **Review + create**. Once the validation passes, click **Create**. 

    Deployment may take around 15 to 20 minutes. 

::: zone-end 

## View all Durable Task Scheduler resources in a subscription

::: zone pivot="az-cli" 

1. Get a list of all scheduler names within a subscription by running the following command.

    ```azurecli
    az durabletask scheduler list --subscription <SUBSCRIPTION_ID>
    ```

1. You can narrow down results to a specific resource group by adding the `--resource-group` flag.

    ```azurecli
    az durabletask scheduler list --subscription <SUBSCRIPTION_ID> --resource-group <RESOURCE_GROUP_NAME>
    ```
::: zone-end

::: zone pivot="az-portal"

In the Azure portal, search for **Durable Task Scheduler** and select it from the results. 

:::image type="content" source="media/create-durable-task-scheduler/search-for-durable-task-scheduler.png" alt-text="Screenshot of searching for the Durable Task Scheduler service in the portal.":::

You can see the list of scheduler resources created in all subscriptions you have access to. 

::: zone-end

## View all task hubs in a Durable Task Scheduler

::: zone pivot="az-cli" 

1. Retrieve a list of task hubs in a specific scheduler by running: 

    ```azurecli
    az durabletask taskhub list --resource-group <RESOURCE_GROUP_NAME> --scheduler-name <SCHEDULER_NAME>
    ```
::: zone-end

::: zone pivot="az-portal"

You can see all the task hubs created in a scheduler on the **Overview** of the resource on Azure portal. 

:::image type="content" source="media/create-durable-task-scheduler/durable-task-scheduler-overview-portal.png" alt-text="Screenshot of overview tab of Durable Task Scheduler in the portal.":::

::: zone-end

## Delete the scheduler and task hub

::: zone pivot="az-cli" 

1. Delete the scheduler:

    ```azurecli
    az durabletask scheduler --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER
    ```

1. Delete a task hub:

    ```azurecli
    az durabletask taskhub delete --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER --name YOUR_TASKHUB
    ```
::: zone-end

::: zone pivot="az-portal"

1. Open the scheduler resource on Azure portal and click **Delete**: 

    :::image type="content" source="media/create-durable-task-scheduler/durable-task-scheduler-delete-portal.png" alt-text="Screenshot of scheduler resource in the portal highlighting delete button.":::

1. Find the scheduler with the task hub you want to delete, then click into that task hub. Click **Delete**:

    :::image type="content" source="media/create-durable-task-scheduler/task-hub-delete-portal.png" alt-text="Screenshot of task hub resource in the portal highlighting delete button.":::

::: zone-end


## Configure identity-based authentication for app to access Durable Task Scheduler

Durable Task Scheduler **only** supports either *user-assigned* or *system-assigned* managed identity authentication. **User-assigned identities are recommended,** as they aren't tied to the lifecycle of the app and can be reused after the app is deprovisioned.

Learn more about [identity-based access in Durable Task Scheduler](./durable-task-scheduler-identity.md). 

## Access the Durable Task Scheduler dashboard

[Assign the required role to your *developer identity (email)*](./durable-task-scheduler-dashboard.md) to gain access to the Durable Task Scheduler dashboard. 

## Next steps

For using Durable Task Scheduler with Durable Functions:
- [Quickstart: Configure a Durable Functions app to use Azure Functions Durable Task Scheduler](./quickstart-durable-task-scheduler.md)

For using Durable Task Scheduler with the Durable Task SDKs:
- [Quickstart: Create an app with Durable Task SDKs and Durable Task Scheduler](./quickstart-portable-durable-task-sdks.md)
- [Quickstart: Host a Durable Task SDK app on Azure Container Apps](./quickstart-container-apps-durable-task-sdk.md)